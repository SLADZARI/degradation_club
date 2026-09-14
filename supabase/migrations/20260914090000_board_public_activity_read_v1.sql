-- Board -> public Activity read model v1
-- One anonymous-safe projection for Home + Community. Board remains the only
-- publication owner; this function exposes no private author IDs or storage paths.

begin;

create or replace function public.dc_youtube_video_id_v1(p_url text)
returns text
language sql
immutable
set search_path = ''
as $function$
  select case
    when p_url is null then null
    when p_url ~* '^https?://([^/]+\.)?youtu\.be/'
      then substring(p_url from '(?i)youtu\.be/([A-Za-z0-9_-]{6,})')
    when p_url ~* '^https?://([^/]+\.)?youtube\.com/shorts/'
      then substring(p_url from '(?i)youtube\.com/shorts/([A-Za-z0-9_-]{6,})')
    when p_url ~* '^https?://([^/]+\.)?youtube\.com/embed/'
      then substring(p_url from '(?i)youtube\.com/embed/([A-Za-z0-9_-]{6,})')
    when p_url ~* '^https?://([^/]+\.)?youtube\.com/watch'
      then substring(p_url from '(?i)[?&]v=([A-Za-z0-9_-]{6,})')
    else null
  end;
$function$;

revoke all on function public.dc_youtube_video_id_v1(text) from public, anon, authenticated;

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
