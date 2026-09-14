-- Board UX v2 / R1B
-- Narrow read-only projection for authenticated non-members.
-- Does not weaken table RLS and does not grant any write capability.

create or replace function public.dc_guest_board_read_v1()
returns table (
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
    count(r.id)::bigint as reaction_count,
    bp.x as board_x,
    bp.y as board_y,
    bp.rotation as board_rotation,
    bp.size_class as board_size_class
  from public.dc_artifacts a
  join public.dc_member_public_profiles p
    on p.profile_id = a.author_profile_id
  left join public.dc_artifact_reactions r
    on r.artifact_id = a.id
  left join public.dc_artifact_board_positions bp
    on bp.artifact_id = a.id
   and bp.board_id = 'community'
  where auth.uid() is not null
    and a.visibility = 'community'
    and a.status = 'active'
    and a.published_at is not null
    and (a.starts_at is null or a.starts_at <= now())
    and (a.expires_at is null or a.expires_at > now())
  group by
    a.id,
    a.artifact_type,
    a.title,
    a.body,
    a.external_url,
    a.starts_at,
    a.expires_at,
    a.published_at,
    p.display_name,
    p.nickname,
    p.avatar_url,
    bp.x,
    bp.y,
    bp.rotation,
    bp.size_class
  order by a.published_at desc;
$$;

revoke all on function public.dc_guest_board_read_v1() from public;
revoke all on function public.dc_guest_board_read_v1() from anon;
grant execute on function public.dc_guest_board_read_v1() to authenticated;

comment on function public.dc_guest_board_read_v1() is
'Board UX v2 guest-safe authenticated read projection. Exposes active community Artifact content, public author identity, aggregate interest count and board position only; no member-only writes, responses, private media paths or reviewer data.';
