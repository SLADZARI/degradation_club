-- Board Information Architecture v1 — Batch A
-- Persistent Artifact history + safe Guest detail + canonical entity projections.
-- Tracked migration only. Committing this file does NOT authorize live application.

begin;

create or replace function public.dc_normalize_artifact_lifecycle_v1()
returns integer
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_count integer := 0;
begin
  update public.dc_artifacts
     set status = 'expired',
         updated_at = now()
   where visibility = 'community'
     and status = 'active'
     and published_at is not null
     and expires_at is not null
     and expires_at <= now();
  get diagnostics v_count = row_count;
  return v_count;
end;
$function$;

revoke all on function public.dc_normalize_artifact_lifecycle_v1() from public;
grant execute on function public.dc_normalize_artifact_lifecycle_v1() to authenticated;

-- The return shape changes, so PostgreSQL requires a drop/recreate rather than
-- CREATE OR REPLACE. This preserves the canonical function name/owner.
drop function if exists public.dc_guest_board_read_v1();
create function public.dc_guest_board_read_v1()
returns table(
  artifact_id uuid,
  artifact_type text,
  title text,
  body text,
  external_url text,
  status text,
  starts_at timestamptz,
  expires_at timestamptz,
  published_at timestamptz,
  closed_at timestamptz,
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
language plpgsql
security definer
set search_path = 'public', 'pg_temp'
as $function$
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  perform public.dc_normalize_artifact_lifecycle_v1();

  return query
  select
    a.id,
    a.artifact_type,
    a.title,
    a.body,
    a.external_url,
    a.status,
    a.starts_at,
    a.expires_at,
    a.published_at,
    a.closed_at,
    p.display_name,
    p.nickname,
    p.avatar_url,
    coalesce((select count(*)::bigint from public.dc_artifact_reactions r where r.artifact_id = a.id), 0::bigint),
    coalesce((select count(*)::bigint from public.dc_guest_board_interests gi where gi.artifact_id = a.id), 0::bigint),
    exists (
      select 1 from public.dc_guest_board_interests mine
       where mine.artifact_id = a.id and mine.profile_id = auth.uid()
    ),
    bp.x,
    bp.y,
    bp.rotation,
    bp.size_class
  from public.dc_artifacts a
  join public.dc_member_public_profiles p on p.profile_id = a.author_profile_id
  left join public.dc_artifact_board_positions bp
    on bp.artifact_id = a.id and bp.board_id = 'community'
  where a.visibility = 'community'
    and a.status in ('active','expired','archived')
    and a.published_at is not null
    and (a.starts_at is null or a.starts_at <= now())
  order by a.published_at desc;
end;
$function$;

grant execute on function public.dc_guest_board_read_v1() to authenticated;

-- Guest interest remains the canonical non-member reaction owner, now history-aware.
create or replace function public.dc_guest_board_interest_toggle_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_active boolean;
  v_count bigint;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if public.dc_membership_active() or public.dc_is_owner_admin() then
    raise exception 'MEMBER_USE_CANONICAL_REACTION';
  end if;
  perform public.dc_normalize_artifact_lifecycle_v1();

  if not exists (
    select 1 from public.dc_artifacts a
    where a.id = p_artifact_id
      and a.visibility = 'community'
      and a.status in ('active','expired','archived')
      and a.published_at is not null
      and (a.starts_at is null or a.starts_at <= now())
  ) then raise exception 'ARTIFACT_NOT_AVAILABLE'; end if;

  if exists (
    select 1 from public.dc_guest_board_interests i
    where i.artifact_id = p_artifact_id and i.profile_id = v_uid
  ) then
    delete from public.dc_guest_board_interests i
     where i.artifact_id = p_artifact_id and i.profile_id = v_uid;
    v_active := false;
  else
    insert into public.dc_guest_board_interests(artifact_id,profile_id)
    values (p_artifact_id,v_uid)
    on conflict (artifact_id,profile_id) do nothing;
    v_active := true;
  end if;

  select count(*)::bigint into v_count
    from public.dc_guest_board_interests i
   where i.artifact_id = p_artifact_id;
  return jsonb_build_object('active',v_active,'count',v_count);
end;
$function$;

grant execute on function public.dc_guest_board_interest_toggle_v1(uuid) to authenticated;

-- Member canonical reaction path: historical Community Artifacts remain reactable.
drop policy if exists dc_artifact_reactions_insert_own on public.dc_artifact_reactions;
create policy dc_artifact_reactions_insert_own
on public.dc_artifact_reactions
for insert
to authenticated
with check (
  auth.uid() = profile_id
  and (public.dc_membership_active() or public.dc_is_owner_admin())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = dc_artifact_reactions.artifact_id
      and a.visibility = 'community'
      and a.status in ('active','expired','archived')
      and a.published_at is not null
  )
);

-- Board-safe Guest/Applicant detail read. No private response bodies are disclosed.
create or replace function public.dc_guest_board_artifact_detail_read_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
  v_result jsonb;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if public.dc_membership_active() or public.dc_is_owner_admin() then
    raise exception 'MEMBER_USE_CANONICAL_DETAIL';
  end if;
  perform public.dc_normalize_artifact_lifecycle_v1();

  select jsonb_build_object(
    'artifact', jsonb_build_object(
      'id', a.id,
      'author_profile_id', a.author_profile_id,
      'artifact_type', a.artifact_type,
      'title', a.title,
      'body', a.body,
      'external_url', a.external_url,
      'status', a.status,
      'visibility', a.visibility,
      'starts_at', a.starts_at,
      'expires_at', a.expires_at,
      'published_at', a.published_at,
      'closed_at', a.closed_at,
      'created_at', a.created_at
    ),
    'author', jsonb_build_object(
      'profile_id', p.profile_id,
      'display_name', p.display_name,
      'nickname', p.nickname,
      'avatar_url', p.avatar_url,
      'member_since', p.member_since
    ),
    'reaction_count', coalesce((select count(*) from public.dc_artifact_reactions r where r.artifact_id = a.id),0),
    'guest_interest_count', coalesce((select count(*) from public.dc_guest_board_interests gi where gi.artifact_id = a.id),0),
    'my_guest_interest', exists(
      select 1 from public.dc_guest_board_interests mine
       where mine.artifact_id = a.id and mine.profile_id = v_uid
    ),
    'my_guest_response_submitted', exists(
      select 1 from public.dc_artifact_responses rr
       where rr.artifact_id = a.id and rr.responder_profile_id = v_uid and rr.status = 'submitted'
    ),
    'media', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id,
        'media_type', m.media_type,
        'storage_bucket', m.storage_bucket,
        'storage_path', m.storage_path,
        'metadata', m.metadata
      ) order by m.created_at)
      from public.dc_artifact_media m where m.artifact_id = a.id
    ), '[]'::jsonb)
  ) into v_result
  from public.dc_artifacts a
  join public.dc_member_public_profiles p on p.profile_id = a.author_profile_id
  where a.id = p_artifact_id
    and a.visibility = 'community'
    and a.status in ('active','expired','archived')
    and a.published_at is not null
    and (a.starts_at is null or a.starts_at <= now());

  if v_result is null then raise exception 'ARTIFACT_NOT_AVAILABLE'; end if;
  return v_result;
end;
$function$;

revoke all on function public.dc_guest_board_artifact_detail_read_v1(uuid) from public;
grant execute on function public.dc_guest_board_artifact_detail_read_v1(uuid) to authenticated;

-- Storage policies cannot depend on guest-visible rows from dc_artifact_media because
-- its own RLS is Member-only. Resolve that lookup through one narrow SECURITY DEFINER helper.
create or replace function public.dc_can_read_guest_board_media_v1(p_bucket text,p_object_name text)
returns boolean
language sql
stable
security definer
set search_path = 'public', 'pg_temp'
as $function$
  select auth.uid() is not null
    and not public.dc_membership_active()
    and not public.dc_is_owner_admin()
    and exists (
      select 1
      from public.dc_artifact_media m
      join public.dc_artifacts a on a.id = m.artifact_id
      where m.storage_bucket = p_bucket
        and m.storage_path = p_object_name
        and a.visibility = 'community'
        and a.status in ('active','expired','archived')
        and a.published_at is not null
        and (a.starts_at is null or a.starts_at <= now())
    );
$function$;

revoke all on function public.dc_can_read_guest_board_media_v1(text,text) from public;
grant execute on function public.dc_can_read_guest_board_media_v1(text,text) to authenticated;

drop policy if exists dc_community_artifacts_storage_select_board_guests on storage.objects;
create policy dc_community_artifacts_storage_select_board_guests
on storage.objects
for select
to authenticated
using (
  bucket_id = 'dc-community-artifacts'
  and public.dc_can_read_guest_board_media_v1(bucket_id,name)
);

-- Safe Board projection read. Canonical entity deep-access RLS remains untouched.
create or replace function public.dc_board_entity_projection_read_v1()
returns table(
  entity_id uuid,
  entity_type text,
  slug text,
  title text,
  status text,
  summary text,
  source_system text,
  provenance_status text,
  event_location text,
  event_capacity integer,
  program_type text,
  delivery_mode text,
  content_summary text
)
language sql
stable
security definer
set search_path = 'public', 'pg_temp'
as $function$
  select
    e.id,
    e.entity_type,
    e.slug,
    e.title,
    e.status,
    e.summary,
    e.source_system,
    e.provenance_status,
    ev.location,
    ev.capacity,
    pr.program_type,
    pr.delivery_mode,
    pr.content_summary
  from public.dc_entities e
  left join public.dc_events ev on ev.entity_id = e.id
  left join public.dc_programs pr on pr.entity_id = e.id
  where auth.uid() is not null
    and e.provenance_status = 'confirmed'
    and e.entity_type in ('event','program','project')
  order by e.updated_at desc, e.id;
$function$;

revoke all on function public.dc_board_entity_projection_read_v1() from public;
grant execute on function public.dc_board_entity_projection_read_v1() to authenticated;

commit;
