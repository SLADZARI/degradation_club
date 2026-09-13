-- Board institutional publisher identity v1
-- OWNER_ADMIN may publish an Artifact under the public DEMENTOR CLUB identity.
-- The real author_profile_id remains unchanged for audit/ownership. No membership,
-- Artifact slot, visibility, lifecycle or Share semantics are changed.

begin;

create table if not exists public.dc_artifact_publisher_overrides (
  artifact_id uuid primary key references public.dc_artifacts(id) on delete cascade,
  publisher_scope text not null check (publisher_scope = 'club'),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dc_artifact_publisher_overrides enable row level security;
revoke all on table public.dc_artifact_publisher_overrides from public, anon, authenticated;

-- Short-lived command state used only before a brand-new draft exists. The row is
-- consumed atomically by dc_create_artifact_draft_v1 and never becomes content.
create table if not exists public.dc_owner_board_publisher_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  publisher_scope text not null check (publisher_scope = 'club'),
  updated_at timestamptz not null default now()
);

alter table public.dc_owner_board_publisher_preferences enable row level security;
revoke all on table public.dc_owner_board_publisher_preferences from public, anon, authenticated;

create or replace function public.dc_owner_board_publisher_choice_v1(p_scope text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_scope text := lower(btrim(coalesce(p_scope,'profile')));
  v_draft uuid;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_is_owner_admin(v_uid) then raise exception 'OWNER_ADMIN_REQUIRED'; end if;
  if v_scope not in ('profile','club') then raise exception 'PUBLISHER_SCOPE_INVALID'; end if;

  select a.id into v_draft
  from public.dc_artifacts a
  where a.author_profile_id = v_uid and a.status = 'draft'
  order by a.created_at desc
  limit 1;

  if v_draft is null then
    if v_scope = 'club' then
      insert into public.dc_owner_board_publisher_preferences(profile_id,publisher_scope,updated_at)
      values (v_uid,'club',now())
      on conflict (profile_id) do update
        set publisher_scope='club',updated_at=excluded.updated_at;
    else
      delete from public.dc_owner_board_publisher_preferences where profile_id=v_uid;
    end if;
  else
    delete from public.dc_owner_board_publisher_preferences where profile_id=v_uid;
    if v_scope = 'club' then
      insert into public.dc_artifact_publisher_overrides(artifact_id,publisher_scope,created_by,updated_at)
      values (v_draft,'club',v_uid,now())
      on conflict (artifact_id) do update
        set publisher_scope='club',created_by=v_uid,updated_at=excluded.updated_at;
    else
      delete from public.dc_artifact_publisher_overrides where artifact_id=v_draft;
    end if;
  end if;

  return jsonb_build_object(
    'publisher_scope',v_scope,
    'artifact_id',v_draft,
    'pending',(v_draft is null and v_scope='club')
  );
end;
$function$;

revoke all on function public.dc_owner_board_publisher_choice_v1(text) from public, anon;
grant execute on function public.dc_owner_board_publisher_choice_v1(text) to authenticated;

create or replace function public.dc_owner_board_publisher_state_v1()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_draft uuid;
  v_scope text := 'profile';
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_is_owner_admin(v_uid) then raise exception 'OWNER_ADMIN_REQUIRED'; end if;

  select a.id into v_draft
  from public.dc_artifacts a
  where a.author_profile_id=v_uid and a.status='draft'
  order by a.created_at desc
  limit 1;

  if v_draft is not null and exists(
    select 1 from public.dc_artifact_publisher_overrides o
    where o.artifact_id=v_draft and o.publisher_scope='club'
  ) then
    v_scope := 'club';
  elsif v_draft is null and exists(
    select 1 from public.dc_owner_board_publisher_preferences p
    where p.profile_id=v_uid and p.publisher_scope='club'
  ) then
    v_scope := 'club';
  end if;

  return jsonb_build_object('publisher_scope',v_scope,'artifact_id',v_draft,'has_draft',v_draft is not null);
end;
$function$;

revoke all on function public.dc_owner_board_publisher_state_v1() from public, anon;
grant execute on function public.dc_owner_board_publisher_state_v1() to authenticated;

-- Narrow presentation projection. Absence means the canonical personal profile.
-- It never exposes created_by or any private author/audit field.
create or replace function public.dc_artifact_publisher_scopes_v1(p_artifact_ids uuid[])
returns table(artifact_id uuid,publisher_scope text)
language plpgsql
stable
security definer
set search_path = 'public', 'pg_temp'
as $function$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;

  return query
  select o.artifact_id,o.publisher_scope
  from public.dc_artifact_publisher_overrides o
  join public.dc_artifacts a on a.id=o.artifact_id
  where o.artifact_id = any(coalesce(p_artifact_ids,'{}'::uuid[]))
    and (
      a.author_profile_id=v_uid
      or (
        a.visibility='community'
        and a.status in ('active','expired','archived')
        and a.published_at is not null
        and a.board_hidden_at is null
        and (a.starts_at is null or a.starts_at<=now())
      )
    );
end;
$function$;

revoke all on function public.dc_artifact_publisher_scopes_v1(uuid[]) from public, anon;
grant execute on function public.dc_artifact_publisher_scopes_v1(uuid[]) to authenticated;

-- Extend the existing canonical draft create owner without changing its signature.
-- Ordinary Members are byte-for-byte equivalent in behavior; only OWNER_ADMIN may
-- have a pending institutional publisher choice consumed here.
create or replace function public.dc_create_artifact_draft_v1(
  p_body text,
  p_title text default null::text,
  p_external_url text default null::text,
  p_starts_at timestamptz default null::timestamptz,
  p_expires_at timestamptz default null::timestamptz
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
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_owner := public.dc_is_owner_admin(v_uid);
  if not public.dc_membership_active(v_uid) and not v_owner then raise exception 'MEMBERSHIP_REQUIRED'; end if;
  if nullif(btrim(p_body),'') is null or char_length(btrim(p_body)) > 4000 then raise exception 'ARTIFACT_BODY_INVALID'; end if;
  if p_title is not null and (nullif(btrim(p_title),'') is null or char_length(btrim(p_title)) > 160) then raise exception 'ARTIFACT_TITLE_INVALID'; end if;
  if p_external_url is not null and char_length(p_external_url) > 1000 then raise exception 'ARTIFACT_URL_INVALID'; end if;
  if p_expires_at is not null and p_starts_at is not null and p_expires_at <= p_starts_at then raise exception 'ARTIFACT_EXPIRY_INVALID'; end if;
  if exists (select 1 from public.dc_artifacts a where a.author_profile_id=v_uid and a.status='draft') then raise exception 'DRAFT_ALREADY_EXISTS'; end if;

  insert into public.dc_artifacts(author_profile_id,artifact_type,title,body,external_url,status,visibility,starts_at,expires_at)
  values (v_uid,'announcement',nullif(btrim(coalesce(p_title,'')),''),btrim(p_body),nullif(btrim(coalesce(p_external_url,'')),''),'draft','community',p_starts_at,p_expires_at)
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

-- Guest Board keeps the exact current return signature, but public identity is
-- institutionally masked when the OWNER_ADMIN chose DEMENTOR CLUB.
create or replace function public.dc_guest_board_read_v1()
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
    a.id,a.artifact_type,a.title,a.body,a.external_url,a.status,a.starts_at,a.expires_at,a.published_at,a.closed_at,
    case when po.publisher_scope='club' then 'DEMENTOR CLUB'::text else p.display_name end,
    case when po.publisher_scope='club' then null::text else p.nickname end,
    case when po.publisher_scope='club' then '/assets/brand/dementor-mark-black.svg'::text else p.avatar_url end,
    coalesce((select count(*)::bigint from public.dc_artifact_reactions r where r.artifact_id=a.id),0::bigint),
    coalesce((select count(*)::bigint from public.dc_guest_board_interests gi where gi.artifact_id=a.id),0::bigint),
    exists(select 1 from public.dc_guest_board_interests mine where mine.artifact_id=a.id and mine.profile_id=auth.uid()),
    bp.x,bp.y,bp.rotation,bp.size_class
  from public.dc_artifacts a
  join public.dc_member_public_profiles p on p.profile_id=a.author_profile_id
  left join public.dc_artifact_publisher_overrides po on po.artifact_id=a.id
  left join public.dc_artifact_board_positions bp on bp.artifact_id=a.id and bp.board_id='community'
  where a.visibility='community'
    and a.status in ('active','expired','archived')
    and a.published_at is not null
    and a.board_hidden_at is null
    and (a.starts_at is null or a.starts_at <= now())
  order by a.published_at desc;
end;
$function$;

revoke all on function public.dc_guest_board_read_v1() from public, anon;
grant execute on function public.dc_guest_board_read_v1() to authenticated;

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
  if public.dc_membership_active() or public.dc_is_owner_admin() then raise exception 'MEMBER_USE_CANONICAL_DETAIL'; end if;
  perform public.dc_normalize_artifact_lifecycle_v1();

  select jsonb_build_object(
    'artifact',jsonb_build_object(
      'id',a.id,
      'author_profile_id',case when po.publisher_scope='club' then null::uuid else a.author_profile_id end,
      'publisher_scope',coalesce(po.publisher_scope,'profile'),
      'artifact_type',a.artifact_type,
      'title',a.title,
      'body',a.body,
      'external_url',a.external_url,
      'status',a.status,
      'visibility',a.visibility,
      'starts_at',a.starts_at,
      'activity_at',a.activity_at,
      'expires_at',a.expires_at,
      'published_at',a.published_at,
      'closed_at',a.closed_at,
      'created_at',a.created_at
    ),
    'author',jsonb_build_object(
      'profile_id',case when po.publisher_scope='club' then null::uuid else p.profile_id end,
      'display_name',case when po.publisher_scope='club' then 'DEMENTOR CLUB'::text else p.display_name end,
      'nickname',case when po.publisher_scope='club' then null::text else p.nickname end,
      'avatar_url',case when po.publisher_scope='club' then '/assets/brand/dementor-mark-black.svg'::text else p.avatar_url end,
      'member_since',case when po.publisher_scope='club' then null::timestamptz else p.member_since end
    ),
    'reaction_count',coalesce((select count(*) from public.dc_artifact_reactions r where r.artifact_id=a.id),0),
    'guest_interest_count',coalesce((select count(*) from public.dc_guest_board_interests gi where gi.artifact_id=a.id),0),
    'my_guest_interest',exists(select 1 from public.dc_guest_board_interests mine where mine.artifact_id=a.id and mine.profile_id=v_uid),
    'my_guest_response_submitted',exists(select 1 from public.dc_artifact_responses rr where rr.artifact_id=a.id and rr.responder_profile_id=v_uid and rr.status='submitted'),
    'media',coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'media_type',m.media_type,'storage_bucket',m.storage_bucket,'storage_path',m.storage_path,'metadata',m.metadata) order by m.created_at) from public.dc_artifact_media m where m.artifact_id=a.id),'[]'::jsonb)
  ) into v_result
  from public.dc_artifacts a
  join public.dc_member_public_profiles p on p.profile_id=a.author_profile_id
  left join public.dc_artifact_publisher_overrides po on po.artifact_id=a.id
  where a.id=p_artifact_id
    and a.visibility='community'
    and a.status in ('active','expired','archived')
    and a.published_at is not null
    and a.board_hidden_at is null
    and (a.starts_at is null or a.starts_at <= now());

  if v_result is null then raise exception 'ARTIFACT_NOT_AVAILABLE'; end if;
  return v_result;
end;
$function$;

revoke all on function public.dc_guest_board_artifact_detail_read_v1(uuid) from public;
grant execute on function public.dc_guest_board_artifact_detail_read_v1(uuid) to authenticated;

commit;
