-- Dementor Club Community Spatial Board v1.
-- Coordinates are presentation state only; Artifact semantics/lifecycle remain in dc_artifacts.
-- Existing dc_publish_artifact_v1 stays authoritative. An AFTER trigger assigns a Board position
-- in the same transaction, so Telegram/outbox logic in the production frontend remains untouched.

begin;

create table if not exists public.dc_artifact_board_positions (
  artifact_id uuid primary key references public.dc_artifacts(id) on delete cascade,
  board_id text not null default 'community',
  x double precision not null,
  y double precision not null,
  rotation double precision not null default 0,
  size_class text,
  position_version bigint not null default 1,
  placed_at timestamptz not null default now(),
  moved_at timestamptz not null default now(),
  constraint dc_artifact_board_positions_board_check check (board_id = 'community'),
  constraint dc_artifact_board_positions_x_check check (x between 0 and 5000),
  constraint dc_artifact_board_positions_y_check check (y between 0 and 3500),
  constraint dc_artifact_board_positions_rotation_check check (rotation between -8 and 8),
  constraint dc_artifact_board_positions_size_check check (size_class is null or size_class in ('XS','S','M','L'))
);

alter table public.dc_artifact_board_positions enable row level security;
revoke all on table public.dc_artifact_board_positions from public, anon, authenticated;
grant select on table public.dc_artifact_board_positions to authenticated;
grant update (x,y) on table public.dc_artifact_board_positions to authenticated;

drop policy if exists dc_artifact_board_positions_select_members on public.dc_artifact_board_positions;
create policy dc_artifact_board_positions_select_members
on public.dc_artifact_board_positions
for select
to authenticated
using (
  (select public.dc_membership_active())
  and exists (
    select 1
    from public.dc_artifacts a
    where a.id = artifact_id
      and a.visibility = 'community'
      and a.status in ('active','expired','archived')
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
    select 1
    from public.dc_artifacts a
    where a.id = artifact_id
      and a.author_profile_id = (select auth.uid())
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  )
)
with check (
  (select public.dc_member_activated_v1())
  and exists (
    select 1
    from public.dc_artifacts a
    where a.id = artifact_id
      and a.author_profile_id = (select auth.uid())
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  )
);

create index if not exists dc_artifact_board_positions_viewport_idx
  on public.dc_artifact_board_positions (board_id, x, y);

-- Backfill current active Community Artifacts before enabling automatic placement.
with ranked as (
  select
    a.id as artifact_id,
    row_number() over (order by coalesce(a.published_at,a.created_at),a.id) - 1 as rn
  from public.dc_artifacts a
  where a.visibility = 'community'
    and a.status = 'active'
    and (a.expires_at is null or a.expires_at > now())
)
insert into public.dc_artifact_board_positions (
  artifact_id,board_id,x,y,rotation,size_class,position_version,placed_at,moved_at
)
select
  r.artifact_id,
  'community',
  900 + ((r.rn % 6) * 620) + (((r.rn / 30) % 2) * 150),
  650 + (((r.rn / 6) % 5) * 520) + (((r.rn / 30) % 3) * 120),
  ((r.rn % 7) - 3) * 0.18,
  null,
  1,
  now(),
  now()
from ranked r
on conflict (artifact_id) do nothing;

create or replace function public.dc_ensure_artifact_board_position_v1()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_index bigint;
  v_col bigint;
  v_row bigint;
  v_page bigint;
  v_x double precision;
  v_y double precision;
  v_rotation double precision;
begin
  if new.status <> 'active' or new.visibility <> 'community' then
    return new;
  end if;

  if exists (
    select 1 from public.dc_artifact_board_positions p where p.artifact_id = new.id
  ) then
    return new;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('dc-community-board-position-v1'));

  select count(*) into v_index
  from public.dc_artifact_board_positions p
  where p.board_id = 'community';

  v_col := v_index % 6;
  v_row := (v_index / 6) % 5;
  v_page := v_index / 30;
  v_x := 900 + (v_col * 620) + ((v_page % 2) * 150);
  v_y := 650 + (v_row * 520) + ((v_page % 3) * 120);
  v_rotation := ((v_index % 7) - 3) * 0.18;

  insert into public.dc_artifact_board_positions (
    artifact_id,board_id,x,y,rotation,size_class,position_version,placed_at,moved_at
  ) values (
    new.id,'community',v_x,v_y,v_rotation,null,1,now(),now()
  ) on conflict (artifact_id) do nothing;

  return new;
end;
$$;

revoke all on function public.dc_ensure_artifact_board_position_v1() from public, anon, authenticated;

drop trigger if exists dc_artifact_board_position_on_publish_v1 on public.dc_artifacts;
create trigger dc_artifact_board_position_on_publish_v1
after insert or update of status, visibility on public.dc_artifacts
for each row
when (new.status = 'active' and new.visibility = 'community')
execute function public.dc_ensure_artifact_board_position_v1();

-- Client updates only x/y. The database owns version/timestamp bookkeeping.
create or replace function public.dc_touch_artifact_board_position_v1()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.artifact_id := old.artifact_id;
  new.board_id := old.board_id;
  new.rotation := old.rotation;
  new.size_class := old.size_class;
  new.placed_at := old.placed_at;
  new.position_version := old.position_version + 1;
  new.moved_at := now();
  return new;
end;
$$;

drop trigger if exists dc_artifact_board_position_touch_v1 on public.dc_artifact_board_positions;
create trigger dc_artifact_board_position_touch_v1
before update of x,y on public.dc_artifact_board_positions
for each row
execute function public.dc_touch_artifact_board_position_v1();

commit;
