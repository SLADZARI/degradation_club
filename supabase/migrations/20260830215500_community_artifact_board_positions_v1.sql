-- Dementor Club Community Spatial Board v1
-- Spatial coordinates are presentation state, separate from Artifact semantics.

begin;

create table if not exists public.dc_artifact_board_positions (
  artifact_id uuid primary key references public.dc_artifacts(id) on delete cascade,
  board_id text not null default 'community',
  x double precision not null,
  y double precision not null,
  rotation double precision not null default 0,
  size_class text not null default 'S',
  position_version bigint not null default 1,
  placed_at timestamptz not null default now(),
  moved_at timestamptz not null default now(),
  constraint dc_artifact_board_positions_board_check check (board_id = 'community'),
  constraint dc_artifact_board_positions_x_check check (x between -100000 and 100000),
  constraint dc_artifact_board_positions_y_check check (y between -100000 and 100000),
  constraint dc_artifact_board_positions_rotation_check check (rotation between -8 and 8),
  constraint dc_artifact_board_positions_size_check check (size_class in ('XS','S','M','L'))
);

alter table public.dc_artifact_board_positions enable row level security;

grant select on public.dc_artifact_board_positions to authenticated;
grant insert, update on public.dc_artifact_board_positions to authenticated;
revoke all on public.dc_artifact_board_positions from anon;

drop policy if exists dc_artifact_board_positions_select_members on public.dc_artifact_board_positions;
create policy dc_artifact_board_positions_select_members
on public.dc_artifact_board_positions
for select
to authenticated
using (
  (select public.dc_membership_active())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = artifact_id
      and a.visibility = 'community'
      and a.status in ('active','expired','archived')
  )
);

drop policy if exists dc_artifact_board_positions_insert_own on public.dc_artifact_board_positions;
create policy dc_artifact_board_positions_insert_own
on public.dc_artifact_board_positions
for insert
to authenticated
with check (
  (select public.dc_member_activated_v1())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = artifact_id
      and a.author_profile_id = (select auth.uid())
      and a.visibility = 'community'
      and a.status = 'active'
  )
);

drop policy if exists dc_artifact_board_positions_update_own on public.dc_artifact_board_positions;
create policy dc_artifact_board_positions_update_own
on public.dc_artifact_board_positions
for update
to authenticated
using (
  (select public.dc_member_activated_v1())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = artifact_id
      and a.author_profile_id = (select auth.uid())
      and a.status = 'active'
  )
)
with check (
  (select public.dc_member_activated_v1())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = artifact_id
      and a.author_profile_id = (select auth.uid())
      and a.status = 'active'
  )
);

create index if not exists dc_artifact_board_positions_viewport_idx
  on public.dc_artifact_board_positions (board_id, x, y);

create or replace function public.dc_publish_artifact_to_board_v2(
  p_artifact_id uuid,
  p_x double precision default 2500,
  p_y double precision default 1750,
  p_rotation double precision default 0,
  p_size_class text default 'S'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_granted integer := 0;
  v_consuming integer := 0;
  v_artifact public.dc_artifacts%rowtype;
  v_x double precision := greatest(-100000,least(100000,coalesce(p_x,2500)));
  v_y double precision := greatest(-100000,least(100000,coalesce(p_y,1750)));
  v_rotation double precision := greatest(-8,least(8,coalesce(p_rotation,0)));
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_membership_active(v_uid) then raise exception 'MEMBERSHIP_REQUIRED'; end if;
  if p_size_class not in ('XS','S','M','L') then raise exception 'BOARD_SIZE_INVALID'; end if;

  perform 1 from public.profiles p where p.id=v_uid for update;

  update public.dc_artifacts
  set status='expired', updated_at=now()
  where author_profile_id=v_uid
    and status='active'
    and expires_at is not null
    and expires_at <= now();

  select * into v_artifact
  from public.dc_artifacts a
  where a.id=p_artifact_id and a.author_profile_id=v_uid
  for update;

  if v_artifact.id is null or v_artifact.status <> 'draft' then raise exception 'ARTIFACT_DRAFT_NOT_FOUND'; end if;
  if v_artifact.expires_at is not null and v_artifact.expires_at <= now() then raise exception 'ARTIFACT_ALREADY_EXPIRED'; end if;

  select coalesce(sum(g.amount),0)::integer into v_granted
  from public.dc_artifact_slot_grants g where g.profile_id=v_uid;

  select count(*)::integer into v_consuming
  from public.dc_artifacts a
  where a.author_profile_id=v_uid
    and a.status in ('publishing','active')
    and (a.expires_at is null or a.expires_at > now());

  if v_granted - v_consuming <= 0 then raise exception 'NO_ARTIFACT_SLOT_AVAILABLE'; end if;

  update public.dc_artifacts
  set status='active', published_at=now(), updated_at=now()
  where id=p_artifact_id;

  insert into public.dc_artifact_board_positions(artifact_id,board_id,x,y,rotation,size_class,position_version,placed_at,moved_at)
  values (p_artifact_id,'community',v_x,v_y,v_rotation,p_size_class,1,now(),now())
  on conflict (artifact_id) do update
    set x=excluded.x,
        y=excluded.y,
        rotation=excluded.rotation,
        size_class=excluded.size_class,
        position_version=public.dc_artifact_board_positions.position_version+1,
        moved_at=now();

  return jsonb_build_object(
    'artifact_id',p_artifact_id,
    'status','active',
    'published_at',now(),
    'slots_available',greatest(v_granted-v_consuming-1,0),
    'position',jsonb_build_object('x',v_x,'y',v_y,'rotation',v_rotation,'size_class',p_size_class)
  );
end;
$$;

revoke all on function public.dc_publish_artifact_to_board_v2(uuid,double precision,double precision,double precision,text) from public;
revoke all on function public.dc_publish_artifact_to_board_v2(uuid,double precision,double precision,double precision,text) from anon;
grant execute on function public.dc_publish_artifact_to_board_v2(uuid,double precision,double precision,double precision,text) to authenticated;

create or replace function public.dc_move_own_artifact_v1(
  p_artifact_id uuid,
  p_x double precision,
  p_y double precision,
  p_expected_version bigint default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_current bigint;
  v_next bigint;
  v_x double precision := greatest(-100000,least(100000,p_x));
  v_y double precision := greatest(-100000,least(100000,p_y));
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_member_activated_v1() then raise exception 'FIRST_ARTIFACT_REQUIRED'; end if;
  if p_x is null or p_y is null then raise exception 'BOARD_POSITION_INVALID'; end if;

  if not exists (
    select 1 from public.dc_artifacts a
    where a.id=p_artifact_id
      and a.author_profile_id=v_uid
      and a.visibility='community'
      and a.status='active'
  ) then raise exception 'ARTIFACT_NOT_MOVABLE'; end if;

  select p.position_version into v_current
  from public.dc_artifact_board_positions p
  where p.artifact_id=p_artifact_id
  for update;

  if v_current is null then raise exception 'BOARD_POSITION_NOT_FOUND'; end if;
  if p_expected_version is not null and p_expected_version <> v_current then raise exception 'BOARD_POSITION_CONFLICT'; end if;

  update public.dc_artifact_board_positions
  set x=v_x,y=v_y,position_version=position_version+1,moved_at=now()
  where artifact_id=p_artifact_id
  returning position_version into v_next;

  return jsonb_build_object('artifact_id',p_artifact_id,'x',v_x,'y',v_y,'position_version',v_next);
end;
$$;

revoke all on function public.dc_move_own_artifact_v1(uuid,double precision,double precision,bigint) from public;
revoke all on function public.dc_move_own_artifact_v1(uuid,double precision,double precision,bigint) from anon;
grant execute on function public.dc_move_own_artifact_v1(uuid,double precision,double precision,bigint) to authenticated;

create or replace function public.dc_board_viewport_v1(
  p_x1 double precision,
  p_y1 double precision,
  p_x2 double precision,
  p_y2 double precision,
  p_limit integer default 150
)
returns table(
  artifact_id uuid,
  x double precision,
  y double precision,
  rotation double precision,
  size_class text,
  position_version bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select p.artifact_id,p.x,p.y,p.rotation,p.size_class,p.position_version
  from public.dc_artifact_board_positions p
  join public.dc_artifacts a on a.id=p.artifact_id
  where public.dc_membership_active(auth.uid())
    and p.board_id='community'
    and p.x between least(p_x1,p_x2) and greatest(p_x1,p_x2)
    and p.y between least(p_y1,p_y2) and greatest(p_y1,p_y2)
    and a.visibility='community'
    and a.status='active'
    and (a.expires_at is null or a.expires_at>now())
  order by p.moved_at desc
  limit greatest(1,least(coalesce(p_limit,150),200));
$$;

revoke all on function public.dc_board_viewport_v1(double precision,double precision,double precision,double precision,integer) from public;
revoke all on function public.dc_board_viewport_v1(double precision,double precision,double precision,double precision,integer) from anon;
grant execute on function public.dc_board_viewport_v1(double precision,double precision,double precision,double precision,integer) to authenticated;

commit;
