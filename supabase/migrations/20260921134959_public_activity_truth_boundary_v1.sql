-- STAB-01 · Public Activity truth boundary v1
-- Corrective only: no released generic editorial eligibility owner exists for
-- arbitrary Board Artifacts, so the anonymous/public Activity projection fails closed.
-- This migration adds no table, field, enum, role, visibility level, media owner,
-- Programming state or product semantics.

begin;

create or replace function public.dc_public_activity_read_v1(
  p_limit integer default 12,
  p_before_published_at timestamptz default null,
  p_before_id uuid default null
)
returns table(
  artifact_id uuid,
  artifact_type text,
  title text,
  excerpt text,
  publisher_scope text,
  publisher_display_name text,
  publisher_avatar_url text,
  media_kind text,
  provider text,
  source_url text,
  preview_url text,
  type_source_label text,
  board_focus_url text,
  published_at timestamptz,
  activity_at timestamptz
)
language sql
stable
security definer
set search_path = 'public', 'pg_temp'
as $function$
  -- NO_RELEASED_GENERIC_EDITORIAL_ELIGIBILITY_OWNER
  --
  -- Board-readable/community-visible is not anonymous editorial eligibility.
  -- Keep the existing public RPC contract stable, but return no generic Board
  -- Artifact until a separate approved editorial eligibility owner exists.
  select
    null::uuid as artifact_id,
    null::text as artifact_type,
    null::text as title,
    null::text as excerpt,
    null::text as publisher_scope,
    null::text as publisher_display_name,
    null::text as publisher_avatar_url,
    null::text as media_kind,
    null::text as provider,
    null::text as source_url,
    null::text as preview_url,
    null::text as type_source_label,
    null::text as board_focus_url,
    null::timestamptz as published_at,
    null::timestamptz as activity_at
  where false;
$function$;

revoke all on function public.dc_public_activity_read_v1(integer,timestamptz,uuid) from public;
grant execute on function public.dc_public_activity_read_v1(integer,timestamptz,uuid) to anon, authenticated;

commit;
