-- Evidence Hygiene v1
-- Prospective QA provenance + public Activity exclusion.
-- No historical Artifact rows are rewritten. provenance_status, RLS, Artifact lifecycle,
-- Telegram semantics and Current Program are unchanged.

begin;

-- Replace the canonical Artifact draft creation RPC with the same owner plus one
-- optional source_ref input. The QA provenance channel is intentionally narrow:
-- only OWNER_ADMIN may write it, and only the canonical lowercase qa: prefix is accepted.
-- Ordinary callers may omit p_source_ref and retain the existing behavior.
drop function if exists public.dc_create_artifact_draft_v1(text,text,text,timestamptz,timestamptz);

create function public.dc_create_artifact_draft_v1(
  p_body text,
  p_title text default null::text,
  p_external_url text default null::text,
  p_starts_at timestamptz default null::timestamptz,
  p_expires_at timestamptz default null::timestamptz,
  p_source_ref text default null::text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_owner boolean;
  v_scope text;
  v_source_ref text := nullif(btrim(coalesce(p_source_ref,'')),'');
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_owner := public.dc_is_owner_admin(v_uid);
  if not public.dc_membership_active(v_uid) and not v_owner then raise exception 'MEMBERSHIP_REQUIRED'; end if;
  if nullif(btrim(p_body),'') is null or char_length(btrim(p_body)) > 4000 then raise exception 'ARTIFACT_BODY_INVALID'; end if;
  if p_title is not null and (nullif(btrim(p_title),'') is null or char_length(btrim(p_title)) > 160) then raise exception 'ARTIFACT_TITLE_INVALID'; end if;
  if p_external_url is not null and char_length(p_external_url) > 1000 then raise exception 'ARTIFACT_URL_INVALID'; end if;
  if p_expires_at is not null and p_starts_at is not null and p_expires_at <= p_starts_at then raise exception 'ARTIFACT_EXPIRY_INVALID'; end if;
  if exists (select 1 from public.dc_artifacts a where a.author_profile_id=v_uid and a.status='draft') then raise exception 'DRAFT_ALREADY_EXISTS'; end if;

  if v_source_ref is not null then
    if not v_owner then raise exception 'QA_SOURCE_REF_OWNER_ADMIN_REQUIRED'; end if;
    if left(v_source_ref,3) <> 'qa:' then raise exception 'QA_SOURCE_REF_INVALID'; end if;
    if char_length(v_source_ref) > 255 then raise exception 'QA_SOURCE_REF_TOO_LONG'; end if;
  end if;

  insert into public.dc_artifacts(
    author_profile_id,artifact_type,title,body,external_url,status,visibility,starts_at,expires_at,source_ref
  )
  values (
    v_uid,
    'announcement',
    nullif(btrim(coalesce(p_title,'')),''),
    btrim(p_body),
    nullif(btrim(coalesce(p_external_url,'')),''),
    'draft',
    'community',
    p_starts_at,
    p_expires_at,
    v_source_ref
  )
  returning id into v_id;

  if v_owner then
    select p.publisher_scope into v_scope
    from public.dc_owner_board_publisher_preferences p
    where p.profile_id=v_uid;

    if v_scope='club' then
      insert into public.dc_artifact_publisher_overrides(artifact_id,publisher_scope,created_by,updated_at)
      values (v_id,'club',v_uid,now())
      on conflict (artifact_id) do update
        set publisher_scope='club',created_by=v_uid,updated_at=excluded.updated_at;
    end if;

    delete from public.dc_owner_board_publisher_preferences where profile_id=v_uid;
  end if;

  return v_id;
end;
$function$;

revoke all on function public.dc_create_artifact_draft_v1(text,text,text,timestamptz,timestamptz,text) from public, anon;
grant execute on function public.dc_create_artifact_draft_v1(text,text,text,timestamptz,timestamptz,text) to authenticated;

-- Public Activity is audience evidence. QA Artifacts remain in the canonical Board
-- and operational audit surfaces but are not projected as current public club life.
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
  with eligible as (
    select
      a.id,
      a.artifact_type,
      a.title,
      a.body,
      a.external_url,
      a.published_at,
      a.activity_at,
      coalesce(po.publisher_scope,'profile') as publisher_scope,
      case when po.publisher_scope='club' then 'DEMENTOR CLUB'::text else coalesce(mp.display_name,'MEMBER') end as publisher_display_name,
      case when po.publisher_scope='club' then '/assets/brand/dementor-mark-black.svg'::text else mp.avatar_url end as publisher_avatar_url,
      public.dc_youtube_video_id_v1(a.external_url) as youtube_id,
      exists(
        select 1
        from public.dc_artifact_media m
        where m.artifact_id=a.id and m.media_type='image'
      ) as has_private_image
    from public.dc_artifacts a
    left join public.dc_member_public_profiles mp on mp.profile_id=a.author_profile_id
    left join public.dc_artifact_publisher_overrides po on po.artifact_id=a.id
    where a.visibility='community'
      and a.status='active'
      and a.published_at is not null
      and a.board_hidden_at is null
      and (a.starts_at is null or a.starts_at<=now())
      and (a.expires_at is null or a.expires_at>now())
      and (a.source_ref is null or a.source_ref not like 'qa:%')
      and (
        p_before_published_at is null
        or p_before_id is null
        or (a.published_at,a.id) < (p_before_published_at,p_before_id)
      )
    order by a.published_at desc,a.id desc
    limit greatest(1,least(coalesce(p_limit,12),50))
  )
  select
    e.id as artifact_id,
    e.artifact_type,
    nullif(btrim(coalesce(e.title,'')),'') as title,
    left(regexp_replace(btrim(coalesce(e.body,'')), E'\\s+', ' ', 'g'),240) as excerpt,
    e.publisher_scope,
    e.publisher_display_name,
    e.publisher_avatar_url,
    case
      when e.youtube_id is not null then 'video'
      when e.has_private_image then 'image'
      when e.external_url is not null then 'link'
      else 'text'
    end as media_kind,
    case
      when e.youtube_id is not null then 'youtube'
      when e.has_private_image then 'board'
      when e.external_url is not null then 'web'
      else 'board'
    end as provider,
    e.external_url as source_url,
    case when e.youtube_id is not null then 'https://i.ytimg.com/vi/'||e.youtube_id||'/hqdefault.jpg' else null end as preview_url,
    case
      when e.youtube_id is not null then 'VIDEO · YOUTUBE'
      when e.has_private_image then 'IMAGE · BOARD'
      when e.external_url is not null then 'LINK · WEB'
      else 'TEXT · BOARD'
    end as type_source_label,
    '/workspace/board/?focus=artifact:'||e.id::text as board_focus_url,
    e.published_at,
    e.activity_at
  from eligible e
  order by e.published_at desc,e.id desc;
$function$;

revoke all on function public.dc_public_activity_read_v1(integer,timestamptz,uuid) from public;
grant execute on function public.dc_public_activity_read_v1(integer,timestamptz,uuid) to anon, authenticated;

commit;
