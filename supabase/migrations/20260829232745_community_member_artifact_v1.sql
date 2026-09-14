create schema if not exists private;

alter table public.profiles
  add column if not exists display_name text,
  add column if not exists nickname text;

alter table public.profiles
  drop constraint if exists profiles_display_name_length_check,
  add constraint profiles_display_name_length_check check (display_name is null or char_length(btrim(display_name)) between 1 and 80),
  drop constraint if exists profiles_nickname_length_check,
  add constraint profiles_nickname_length_check check (nickname is null or char_length(btrim(nickname)) between 1 and 80);

create table if not exists public.dc_member_external_identities (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  handle text,
  url text,
  is_primary boolean not null default true,
  visibility text not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dc_member_external_identities_provider_check check (provider in ('telegram','instagram','linkedin','website','other')),
  constraint dc_member_external_identities_visibility_check check (visibility in ('private','community')),
  constraint dc_member_external_identities_contact_check check (nullif(btrim(handle),'') is not null or nullif(btrim(url),'') is not null),
  constraint dc_member_external_identities_handle_length_check check (handle is null or char_length(handle) <= 160),
  constraint dc_member_external_identities_url_length_check check (url is null or char_length(url) <= 1000)
);
create index if not exists dc_member_external_identities_profile_idx on public.dc_member_external_identities(profile_id);
create unique index if not exists dc_member_external_identities_one_primary_idx on public.dc_member_external_identities(profile_id) where is_primary;

create table if not exists public.dc_member_legal_acknowledgements (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  terms_version text not null,
  privacy_version text not null,
  terms_accepted_at timestamptz not null,
  privacy_acknowledged_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dc_member_public_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  display_name text not null,
  nickname text,
  avatar_url text,
  member_since timestamptz not null,
  updated_at timestamptz not null default now(),
  constraint dc_member_public_profiles_display_name_check check (char_length(btrim(display_name)) between 1 and 80),
  constraint dc_member_public_profiles_nickname_check check (nickname is null or char_length(btrim(nickname)) between 1 and 80)
);

create table if not exists public.dc_artifacts (
  id uuid primary key default gen_random_uuid(),
  author_profile_id uuid not null references public.profiles(id) on delete cascade,
  artifact_type text not null default 'notice',
  title text,
  body text not null,
  external_url text,
  status text not null default 'draft',
  visibility text not null default 'community',
  starts_at timestamptz,
  expires_at timestamptz,
  published_at timestamptz,
  closed_at timestamptz,
  promoted_entity_type text,
  promoted_entity_id uuid,
  source_system text not null default 'community-member',
  source_ref text,
  provenance_status text not null default 'confirmed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dc_artifacts_type_check check (artifact_type in ('notice')),
  constraint dc_artifacts_status_check check (status in ('draft','publishing','active','expired','archived','removed')),
  constraint dc_artifacts_visibility_check check (visibility in ('community')),
  constraint dc_artifacts_provenance_check check (provenance_status in ('confirmed','inferred','planned','legacy')),
  constraint dc_artifacts_body_check check (char_length(btrim(body)) between 1 and 4000),
  constraint dc_artifacts_title_check check (title is null or char_length(btrim(title)) between 1 and 160),
  constraint dc_artifacts_external_url_check check (external_url is null or char_length(external_url) <= 1000),
  constraint dc_artifacts_expiry_order_check check (expires_at is null or starts_at is null or expires_at > starts_at)
);
create index if not exists dc_artifacts_author_idx on public.dc_artifacts(author_profile_id, created_at desc);
create index if not exists dc_artifacts_board_idx on public.dc_artifacts(status, visibility, published_at desc);
create index if not exists dc_artifacts_expiry_idx on public.dc_artifacts(expires_at) where expires_at is not null;

create table if not exists public.dc_artifact_media (
  id uuid primary key default gen_random_uuid(),
  artifact_id uuid not null references public.dc_artifacts(id) on delete cascade,
  owner_profile_id uuid not null references public.profiles(id) on delete cascade,
  media_type text not null,
  storage_bucket text not null default 'dc-community-artifacts',
  storage_path text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint dc_artifact_media_type_check check (media_type in ('image','file')),
  constraint dc_artifact_media_path_check check (char_length(storage_path) between 3 and 1000)
);
create index if not exists dc_artifact_media_artifact_idx on public.dc_artifact_media(artifact_id);
create index if not exists dc_artifact_media_owner_idx on public.dc_artifact_media(owner_profile_id);

create table if not exists public.dc_artifact_reactions (
  id uuid primary key default gen_random_uuid(),
  artifact_id uuid not null references public.dc_artifacts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  reaction_type text not null default 'interested',
  created_at timestamptz not null default now(),
  constraint dc_artifact_reactions_type_check check (reaction_type in ('interested')),
  unique (artifact_id, profile_id, reaction_type)
);
create index if not exists dc_artifact_reactions_artifact_idx on public.dc_artifact_reactions(artifact_id);
create index if not exists dc_artifact_reactions_profile_idx on public.dc_artifact_reactions(profile_id);

create table if not exists public.dc_artifact_responses (
  id uuid primary key default gen_random_uuid(),
  artifact_id uuid not null references public.dc_artifacts(id) on delete cascade,
  responder_profile_id uuid not null references public.profiles(id) on delete cascade,
  message text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dc_artifact_responses_status_check check (status in ('submitted','withdrawn')),
  constraint dc_artifact_responses_message_check check (message is null or char_length(message) <= 2000)
);
create index if not exists dc_artifact_responses_artifact_idx on public.dc_artifact_responses(artifact_id);
create index if not exists dc_artifact_responses_responder_idx on public.dc_artifact_responses(responder_profile_id);

create table if not exists public.dc_artifact_slot_grants (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  grant_key text not null,
  reason text not null,
  source_entity_type text,
  source_entity_id uuid,
  source_system text not null default 'dementor-club',
  source_ref text,
  provenance_status text not null default 'confirmed',
  created_at timestamptz not null default now(),
  constraint dc_artifact_slot_grants_amount_check check (amount > 0),
  constraint dc_artifact_slot_grants_provenance_check check (provenance_status in ('confirmed','inferred','planned','legacy')),
  unique (profile_id, grant_key)
);
create index if not exists dc_artifact_slot_grants_profile_idx on public.dc_artifact_slot_grants(profile_id);

alter table public.dc_member_external_identities enable row level security;
alter table public.dc_member_legal_acknowledgements enable row level security;
alter table public.dc_member_public_profiles enable row level security;
alter table public.dc_artifacts enable row level security;
alter table public.dc_artifact_media enable row level security;
alter table public.dc_artifact_reactions enable row level security;
alter table public.dc_artifact_responses enable row level security;
alter table public.dc_artifact_slot_grants enable row level security;

revoke all on public.dc_member_external_identities from anon;
revoke all on public.dc_member_legal_acknowledgements from anon;
revoke all on public.dc_member_public_profiles from anon;
revoke all on public.dc_artifacts from anon;
revoke all on public.dc_artifact_media from anon;
revoke all on public.dc_artifact_reactions from anon;
revoke all on public.dc_artifact_responses from anon;
revoke all on public.dc_artifact_slot_grants from anon;

revoke all on public.dc_member_external_identities from authenticated;
revoke all on public.dc_member_legal_acknowledgements from authenticated;
revoke all on public.dc_member_public_profiles from authenticated;
revoke all on public.dc_artifacts from authenticated;
revoke all on public.dc_artifact_media from authenticated;
revoke all on public.dc_artifact_reactions from authenticated;
revoke all on public.dc_artifact_responses from authenticated;
revoke all on public.dc_artifact_slot_grants from authenticated;

grant select on public.dc_member_external_identities to authenticated;
grant select on public.dc_member_legal_acknowledgements to authenticated;
grant select on public.dc_member_public_profiles to authenticated;
grant select on public.dc_artifacts to authenticated;
grant select on public.dc_artifact_media to authenticated;
grant select, insert, delete on public.dc_artifact_reactions to authenticated;
grant select, insert on public.dc_artifact_responses to authenticated;
grant update (status) on public.dc_artifact_responses to authenticated;
grant select on public.dc_artifact_slot_grants to authenticated;

drop policy if exists dc_member_external_identities_select_own on public.dc_member_external_identities;
create policy dc_member_external_identities_select_own on public.dc_member_external_identities
for select to authenticated
using ((select auth.uid()) = profile_id or (select public.dc_is_owner_admin()));

drop policy if exists dc_member_legal_acknowledgements_select_own on public.dc_member_legal_acknowledgements;
create policy dc_member_legal_acknowledgements_select_own on public.dc_member_legal_acknowledgements
for select to authenticated
using ((select auth.uid()) = profile_id or (select public.dc_is_owner_admin()));

drop policy if exists dc_member_public_profiles_select_members on public.dc_member_public_profiles;
create policy dc_member_public_profiles_select_members on public.dc_member_public_profiles
for select to authenticated
using ((select public.dc_membership_active()) or (select public.dc_is_owner_admin()));

drop policy if exists dc_artifacts_select_members on public.dc_artifacts;
create policy dc_artifacts_select_members on public.dc_artifacts
for select to authenticated
using (
  ((select auth.uid()) = author_profile_id)
  or (
    (select public.dc_membership_active())
    and visibility = 'community'
    and status in ('active','expired','archived')
  )
  or (select public.dc_is_owner_admin())
);

drop policy if exists dc_artifact_media_select_members on public.dc_artifact_media;
create policy dc_artifact_media_select_members on public.dc_artifact_media
for select to authenticated
using (
  (select auth.uid()) = owner_profile_id
  or exists (
    select 1 from public.dc_artifacts a
    where a.id = artifact_id
      and (select public.dc_membership_active())
      and a.visibility = 'community'
      and a.status in ('active','expired','archived')
  )
  or (select public.dc_is_owner_admin())
);

drop policy if exists dc_artifact_reactions_select_members on public.dc_artifact_reactions;
create policy dc_artifact_reactions_select_members on public.dc_artifact_reactions
for select to authenticated
using (
  (select public.dc_membership_active())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = artifact_id
      and a.visibility = 'community'
      and a.status in ('active','expired','archived')
  )
);

drop policy if exists dc_artifact_reactions_insert_own on public.dc_artifact_reactions;
create policy dc_artifact_reactions_insert_own on public.dc_artifact_reactions
for insert to authenticated
with check (
  (select auth.uid()) = profile_id
  and (select public.dc_membership_active())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = artifact_id
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  )
);

drop policy if exists dc_artifact_reactions_delete_own on public.dc_artifact_reactions;
create policy dc_artifact_reactions_delete_own on public.dc_artifact_reactions
for delete to authenticated
using ((select auth.uid()) = profile_id and (select public.dc_membership_active()));

drop policy if exists dc_artifact_responses_select_parties on public.dc_artifact_responses;
create policy dc_artifact_responses_select_parties on public.dc_artifact_responses
for select to authenticated
using (
  (select auth.uid()) = responder_profile_id
  or exists (
    select 1 from public.dc_artifacts a
    where a.id = artifact_id and a.author_profile_id = (select auth.uid())
  )
  or (select public.dc_is_owner_admin())
);

drop policy if exists dc_artifact_responses_insert_own on public.dc_artifact_responses;
create policy dc_artifact_responses_insert_own on public.dc_artifact_responses
for insert to authenticated
with check (
  (select auth.uid()) = responder_profile_id
  and status = 'submitted'
  and (select public.dc_membership_active())
  and exists (
    select 1 from public.dc_artifacts a
    where a.id = artifact_id
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  )
);

drop policy if exists dc_artifact_responses_update_own on public.dc_artifact_responses;
create policy dc_artifact_responses_update_own on public.dc_artifact_responses
for update to authenticated
using ((select auth.uid()) = responder_profile_id and (select public.dc_membership_active()))
with check ((select auth.uid()) = responder_profile_id and status in ('submitted','withdrawn'));

drop policy if exists dc_artifact_slot_grants_select_own on public.dc_artifact_slot_grants;
create policy dc_artifact_slot_grants_select_own on public.dc_artifact_slot_grants
for select to authenticated
using ((select auth.uid()) = profile_id or (select public.dc_is_owner_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'dc-community-artifacts',
  'dc-community-artifacts',
  false,
  8388608,
  array['image/jpeg','image/png','image/webp','application/pdf','text/plain']::text[]
)
on conflict (id) do update set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists dc_community_artifacts_storage_insert_own on storage.objects;
create policy dc_community_artifacts_storage_insert_own on storage.objects
for insert to authenticated
with check (
  bucket_id = 'dc-community-artifacts'
  and (select public.dc_membership_active())
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists dc_community_artifacts_storage_select_members on storage.objects;
create policy dc_community_artifacts_storage_select_members on storage.objects
for select to authenticated
using (
  bucket_id = 'dc-community-artifacts'
  and (select public.dc_membership_active())
);

drop policy if exists dc_community_artifacts_storage_delete_own on storage.objects;
create policy dc_community_artifacts_storage_delete_own on storage.objects
for delete to authenticated
using (
  bucket_id = 'dc-community-artifacts'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and owner_id = (select auth.uid())::text
);

create or replace function public.dc_member_entry_status_v1()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_completed text[];
  v_missing text[];
  v_sphere_count integer := 0;
  v_identity_ready boolean := false;
  v_terms_ready boolean := false;
  v_membership_status text;
  v_granted integer := 0;
  v_consuming integer := 0;
  v_published integer := 0;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select coalesce(array_agg(distinct ar.sphere_id order by ar.sphere_id), array[]::text[])
    into v_completed
  from public.assessment_runs ar
  where ar.profile_id = v_uid
    and ar.completed_at is not null
    and ar.sphere_id = any(array['personality','work','consumption','relationships','control','information','self_development','meaning','technology']::text[]);

  v_sphere_count := coalesce(array_length(v_completed, 1), 0);

  select coalesce(array_agg(s order by s), array[]::text[])
    into v_missing
  from unnest(array['personality','work','consumption','relationships','control','information','self_development','meaning','technology']::text[]) s
  where not (s = any(v_completed));

  select exists (
    select 1
    from public.profiles p
    where p.id = v_uid
      and nullif(btrim(p.display_name),'') is not null
  ) and exists (
    select 1
    from public.dc_member_external_identities i
    where i.profile_id = v_uid and i.is_primary
  ) into v_identity_ready;

  select exists (
    select 1 from public.dc_member_legal_acknowledgements l
    where l.profile_id = v_uid
      and l.terms_version = '0.2'
      and l.privacy_version = '0.2'
  ) into v_terms_ready;

  select m.status into v_membership_status
  from public.dc_system_memberships m
  where m.profile_id = v_uid;

  select coalesce(sum(g.amount),0)::integer into v_granted
  from public.dc_artifact_slot_grants g
  where g.profile_id = v_uid;

  select count(*)::integer into v_consuming
  from public.dc_artifacts a
  where a.author_profile_id = v_uid
    and a.status in ('publishing','active')
    and (a.expires_at is null or a.expires_at > now());

  select count(*)::integer into v_published
  from public.dc_artifacts a
  where a.author_profile_id = v_uid
    and a.published_at is not null
    and a.status <> 'removed';

  return jsonb_build_object(
    'sphere_count', v_sphere_count,
    'completed_spheres', v_completed,
    'missing_spheres', v_missing,
    'sphere_gate_complete', v_sphere_count = 9,
    'identity_ready', v_identity_ready,
    'legal_ready', v_terms_ready,
    'membership_status', v_membership_status,
    'membership_active', coalesce(v_membership_status = 'active', false),
    'artifact_slots_granted', v_granted,
    'artifact_slots_consuming', v_consuming,
    'artifact_slots_available', greatest(v_granted - v_consuming, 0),
    'published_artifact_count', v_published,
    'community_activation_state', case
      when v_membership_status = 'active' and v_published > 0 then 'MEMBER_ACTIVATED'
      when v_membership_status = 'active' then 'FIRST_ARTIFACT_REQUIRED'
      when v_sphere_count = 9 then 'IDENTITY_REQUIRED'
      else 'SPHERES_IN_PROGRESS'
    end
  );
end;
$$;

create or replace function public.dc_activate_membership_v1(
  p_display_name text,
  p_provider text,
  p_handle text,
  p_url text,
  p_nickname text,
  p_terms_version text,
  p_privacy_version text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_sphere_count integer;
  v_identity_id uuid;
  v_member_since timestamptz;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;
  if nullif(btrim(p_display_name),'') is null or char_length(btrim(p_display_name)) > 80 then
    raise exception 'DISPLAY_NAME_REQUIRED';
  end if;
  if p_nickname is not null and char_length(btrim(p_nickname)) > 80 then
    raise exception 'NICKNAME_TOO_LONG';
  end if;
  if p_provider not in ('telegram','instagram','linkedin','website','other') then
    raise exception 'IDENTITY_PROVIDER_INVALID';
  end if;
  if nullif(btrim(coalesce(p_handle,'')),'') is null and nullif(btrim(coalesce(p_url,'')),'') is null then
    raise exception 'EXTERNAL_IDENTITY_REQUIRED';
  end if;
  if p_terms_version <> '0.2' or p_privacy_version <> '0.2' then
    raise exception 'LEGAL_VERSION_MISMATCH';
  end if;

  select count(distinct ar.sphere_id)::integer into v_sphere_count
  from public.assessment_runs ar
  where ar.profile_id = v_uid
    and ar.completed_at is not null
    and ar.sphere_id = any(array['personality','work','consumption','relationships','control','information','self_development','meaning','technology']::text[]);

  if v_sphere_count <> 9 then
    raise exception 'SPHERE_GATE_INCOMPLETE';
  end if;

  if not exists (select 1 from public.profiles p where p.id = v_uid) then
    raise exception 'PROFILE_REQUIRED';
  end if;

  update public.profiles
  set display_name = btrim(p_display_name),
      nickname = nullif(btrim(coalesce(p_nickname,'')),''),
      updated_at = now()
  where id = v_uid;

  select i.id into v_identity_id
  from public.dc_member_external_identities i
  where i.profile_id = v_uid and i.is_primary
  order by i.created_at
  limit 1;

  if v_identity_id is null then
    insert into public.dc_member_external_identities(profile_id,provider,handle,url,is_primary,visibility)
    values (v_uid,p_provider,nullif(btrim(coalesce(p_handle,'')),''),nullif(btrim(coalesce(p_url,'')),''),true,'private')
    returning id into v_identity_id;
  else
    update public.dc_member_external_identities
    set provider = p_provider,
        handle = nullif(btrim(coalesce(p_handle,'')),''),
        url = nullif(btrim(coalesce(p_url,'')),''),
        updated_at = now()
    where id = v_identity_id;
  end if;

  insert into public.dc_member_legal_acknowledgements(
    profile_id,terms_version,privacy_version,terms_accepted_at,privacy_acknowledged_at
  ) values (v_uid,p_terms_version,p_privacy_version,now(),now())
  on conflict (profile_id) do update set
    terms_version = excluded.terms_version,
    privacy_version = excluded.privacy_version,
    terms_accepted_at = excluded.terms_accepted_at,
    privacy_acknowledged_at = excluded.privacy_acknowledged_at,
    updated_at = now();

  insert into public.dc_system_memberships(
    profile_id,status,valid_from,valid_to,source_system,source_ref,provenance_status,confirmed_at,updated_at
  ) values (
    v_uid,'active',now(),null,'dementor-club','community-member-entry-v1','confirmed',now(),now()
  )
  on conflict (profile_id) do update set
    status = 'active',
    valid_from = case when public.dc_system_memberships.status = 'active' then public.dc_system_memberships.valid_from else now() end,
    valid_to = null,
    source_system = 'dementor-club',
    source_ref = 'community-member-entry-v1',
    provenance_status = 'confirmed',
    confirmed_at = now(),
    updated_at = now();

  select m.valid_from into v_member_since
  from public.dc_system_memberships m where m.profile_id = v_uid;

  insert into public.dc_member_public_profiles(profile_id,display_name,nickname,avatar_url,member_since,updated_at)
  select p.id,btrim(p.display_name),p.nickname,p.avatar_url,v_member_since,now()
  from public.profiles p where p.id = v_uid
  on conflict (profile_id) do update set
    display_name = excluded.display_name,
    nickname = excluded.nickname,
    avatar_url = excluded.avatar_url,
    member_since = excluded.member_since,
    updated_at = now();

  insert into public.dc_artifact_slot_grants(profile_id,amount,grant_key,reason,source_system,source_ref,provenance_status)
  values (v_uid,1,'initial-membership-v1','Initial Community Artifact slot','dementor-club','community-member-entry-v1','confirmed')
  on conflict (profile_id,grant_key) do nothing;

  return public.dc_member_entry_status_v1();
end;
$$;

create or replace function public.dc_create_artifact_draft_v1(
  p_body text,
  p_title text,
  p_external_url text,
  p_starts_at timestamptz,
  p_expires_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_membership_active(v_uid) then raise exception 'MEMBERSHIP_REQUIRED'; end if;
  if nullif(btrim(p_body),'') is null or char_length(btrim(p_body)) > 4000 then raise exception 'ARTIFACT_BODY_INVALID'; end if;
  if p_title is not null and (nullif(btrim(p_title),'') is null or char_length(btrim(p_title)) > 160) then raise exception 'ARTIFACT_TITLE_INVALID'; end if;
  if p_external_url is not null and char_length(p_external_url) > 1000 then raise exception 'ARTIFACT_URL_INVALID'; end if;
  if p_expires_at is not null and p_starts_at is not null and p_expires_at <= p_starts_at then raise exception 'ARTIFACT_EXPIRY_INVALID'; end if;
  if exists (select 1 from public.dc_artifacts a where a.author_profile_id=v_uid and a.status='draft') then raise exception 'DRAFT_ALREADY_EXISTS'; end if;

  insert into public.dc_artifacts(author_profile_id,artifact_type,title,body,external_url,status,visibility,starts_at,expires_at)
  values (v_uid,'notice',nullif(btrim(coalesce(p_title,'')),''),btrim(p_body),nullif(btrim(coalesce(p_external_url,'')),''),'draft','community',p_starts_at,p_expires_at)
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.dc_attach_artifact_media_v1(
  p_artifact_id uuid,
  p_storage_path text,
  p_media_type text,
  p_metadata jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_media_type not in ('image','file') then raise exception 'MEDIA_TYPE_INVALID'; end if;
  if not exists (
    select 1 from public.dc_artifacts a
    where a.id=p_artifact_id and a.author_profile_id=v_uid and a.status='draft'
  ) then raise exception 'ARTIFACT_DRAFT_NOT_FOUND'; end if;
  if split_part(p_storage_path,'/',1) <> v_uid::text then raise exception 'MEDIA_PATH_INVALID'; end if;
  if not exists (
    select 1 from storage.objects o
    where o.bucket_id='dc-community-artifacts'
      and o.name=p_storage_path
      and o.owner_id=v_uid::text
  ) then raise exception 'MEDIA_OBJECT_NOT_FOUND'; end if;
  if exists (select 1 from public.dc_artifact_media m where m.artifact_id=p_artifact_id) then raise exception 'MEDIA_LIMIT_REACHED'; end if;

  insert into public.dc_artifact_media(artifact_id,owner_profile_id,media_type,storage_bucket,storage_path,metadata)
  values (p_artifact_id,v_uid,p_media_type,'dc-community-artifacts',p_storage_path,coalesce(p_metadata,'{}'::jsonb))
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.dc_publish_artifact_v1(p_artifact_id uuid)
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
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_membership_active(v_uid) then raise exception 'MEMBERSHIP_REQUIRED'; end if;

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

  return jsonb_build_object('artifact_id',p_artifact_id,'status','active','published_at',now(),'slots_available',greatest(v_granted-v_consuming-1,0));
end;
$$;

create or replace function public.dc_close_artifact_v1(p_artifact_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_old_status text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  select a.status into v_old_status from public.dc_artifacts a where a.id=p_artifact_id and a.author_profile_id=v_uid for update;
  if v_old_status is null then raise exception 'ARTIFACT_NOT_FOUND'; end if;
  if v_old_status='draft' then
    update public.dc_artifacts set status='removed',closed_at=now(),updated_at=now() where id=p_artifact_id;
  elsif v_old_status in ('active','expired') then
    update public.dc_artifacts set status='archived',closed_at=now(),updated_at=now() where id=p_artifact_id;
  elsif v_old_status in ('archived','removed') then
    null;
  else
    raise exception 'ARTIFACT_STATE_NOT_CLOSABLE';
  end if;
  return jsonb_build_object('artifact_id',p_artifact_id,'previous_status',v_old_status,'status',(select status from public.dc_artifacts where id=p_artifact_id));
end;
$$;

revoke execute on function public.dc_member_entry_status_v1() from public, anon;
revoke execute on function public.dc_activate_membership_v1(text,text,text,text,text,text,text) from public, anon;
revoke execute on function public.dc_create_artifact_draft_v1(text,text,text,timestamptz,timestamptz) from public, anon;
revoke execute on function public.dc_attach_artifact_media_v1(uuid,text,text,jsonb) from public, anon;
revoke execute on function public.dc_publish_artifact_v1(uuid) from public, anon;
revoke execute on function public.dc_close_artifact_v1(uuid) from public, anon;

grant execute on function public.dc_member_entry_status_v1() to authenticated;
grant execute on function public.dc_activate_membership_v1(text,text,text,text,text,text,text) to authenticated;
grant execute on function public.dc_create_artifact_draft_v1(text,text,text,timestamptz,timestamptz) to authenticated;
grant execute on function public.dc_attach_artifact_media_v1(uuid,text,text,jsonb) to authenticated;
grant execute on function public.dc_publish_artifact_v1(uuid) to authenticated;
grant execute on function public.dc_close_artifact_v1(uuid) to authenticated;

update public.profiles p
set display_name = coalesce(nullif(btrim(p.display_name),''), nullif(btrim(p.full_name),''), 'MEMBER'),
    updated_at = now()
where exists (select 1 from public.dc_system_memberships m where m.profile_id=p.id and m.status='active')
  and nullif(btrim(p.display_name),'') is null;

insert into public.dc_member_public_profiles(profile_id,display_name,nickname,avatar_url,member_since,updated_at)
select p.id,coalesce(nullif(btrim(p.display_name),''),nullif(btrim(p.full_name),''),'MEMBER'),p.nickname,p.avatar_url,m.valid_from,now()
from public.dc_system_memberships m
join public.profiles p on p.id=m.profile_id
where m.status='active'
on conflict (profile_id) do nothing;

insert into public.dc_artifact_slot_grants(profile_id,amount,grant_key,reason,source_system,source_ref,provenance_status)
select m.profile_id,1,'initial-membership-v1','Initial Community Artifact slot','dementor-club','community-member-entry-v1','confirmed'
from public.dc_system_memberships m
where m.status='active'
on conflict (profile_id,grant_key) do nothing;
