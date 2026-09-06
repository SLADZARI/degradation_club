-- Board UX v2 / R9
-- Narrow pre-membership interest signal.
-- This deliberately does NOT relax dc_artifact_reactions RLS and does NOT turn
-- an authenticated Guest into a Member.

create table if not exists public.dc_guest_board_interests (
  id uuid primary key default gen_random_uuid(),
  artifact_id uuid not null references public.dc_artifacts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (artifact_id, profile_id)
);

alter table public.dc_guest_board_interests enable row level security;

-- No direct Guest/Member table access. All access is through the two narrow
-- SECURITY DEFINER functions below.
revoke all on table public.dc_guest_board_interests from anon, authenticated;

create index if not exists dc_guest_board_interests_artifact_idx
  on public.dc_guest_board_interests (artifact_id);
create index if not exists dc_guest_board_interests_profile_idx
  on public.dc_guest_board_interests (profile_id);

create or replace function public.dc_guest_board_interest_toggle_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_active boolean;
  v_count bigint;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if public.dc_membership_active() then
    raise exception 'MEMBER_USE_CANONICAL_REACTION';
  end if;

  if not exists (
    select 1
      from public.dc_artifacts a
     where a.id = p_artifact_id
       and a.visibility = 'community'
       and a.status = 'active'
       and a.published_at is not null
       and (a.starts_at is null or a.starts_at <= now())
       and (a.expires_at is null or a.expires_at > now())
  ) then
    raise exception 'ARTIFACT_NOT_AVAILABLE';
  end if;

  if exists (
    select 1
      from public.dc_guest_board_interests i
     where i.artifact_id = p_artifact_id
       and i.profile_id = v_uid
  ) then
    delete from public.dc_guest_board_interests
     where artifact_id = p_artifact_id
       and profile_id = v_uid;
    v_active := false;
  else
    insert into public.dc_guest_board_interests (artifact_id, profile_id)
    values (p_artifact_id, v_uid)
    on conflict (artifact_id, profile_id) do nothing;
    v_active := true;
  end if;

  select count(*)::bigint
    into v_count
    from public.dc_guest_board_interests
   where artifact_id = p_artifact_id;

  return jsonb_build_object('active', v_active, 'count', v_count);
end;
$$;

revoke all on function public.dc_guest_board_interest_toggle_v1(uuid) from public, anon;
grant execute on function public.dc_guest_board_interest_toggle_v1(uuid) to authenticated;

-- Extend the existing safe Guest Board projection with this separate signal.
-- reaction_count remains the canonical Member reaction aggregate.
drop function if exists public.dc_guest_board_read_v1();

create function public.dc_guest_board_read_v1()
returns table(
  artifact_id uuid,
  artifact_type text,
  title text,
  body text,
  external_url text,
  starts_at timestamptz,
  expires_at timestamptz,
  published_at timestamptz,
  author_display_name text,
  author_nickname text,
  author_avatar_url text,
  reaction_count bigint,
  guest_interest_count bigint,
  my_guest_interest boolean,
  board_x double precision,
  board_y double precision,
  board_rotation double precision,
  board_size_class text
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    a.id as artifact_id,
    a.artifact_type,
    a.title,
    a.body,
    a.external_url,
    a.starts_at,
    a.expires_at,
    a.published_at,
    p.display_name as author_display_name,
    p.nickname as author_nickname,
    p.avatar_url as author_avatar_url,
    coalesce((select count(*)::bigint from public.dc_artifact_reactions r where r.artifact_id = a.id), 0::bigint) as reaction_count,
    coalesce((select count(*)::bigint from public.dc_guest_board_interests gi where gi.artifact_id = a.id), 0::bigint) as guest_interest_count,
    exists (
      select 1
        from public.dc_guest_board_interests mine
       where mine.artifact_id = a.id
         and mine.profile_id = auth.uid()
    ) as my_guest_interest,
    bp.x as board_x,
    bp.y as board_y,
    bp.rotation as board_rotation,
    bp.size_class as board_size_class
  from public.dc_artifacts a
  join public.dc_member_public_profiles p on p.profile_id = a.author_profile_id
  left join public.dc_artifact_board_positions bp
    on bp.artifact_id = a.id and bp.board_id = 'community'
  where auth.uid() is not null
    and a.visibility = 'community'
    and a.status = 'active'
    and a.published_at is not null
    and (a.starts_at is null or a.starts_at <= now())
    and (a.expires_at is null or a.expires_at > now())
  order by a.published_at desc;
$$;

revoke all on function public.dc_guest_board_read_v1() from public, anon;
grant execute on function public.dc_guest_board_read_v1() to authenticated;
