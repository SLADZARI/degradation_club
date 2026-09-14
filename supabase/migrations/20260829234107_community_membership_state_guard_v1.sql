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
  v_existing_status text;
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
  if p_url is not null and p_url !~* '^https?://' then
    raise exception 'EXTERNAL_IDENTITY_URL_INVALID';
  end if;
  if p_terms_version <> '0.2' or p_privacy_version <> '0.2' then
    raise exception 'LEGAL_VERSION_MISMATCH';
  end if;

  select m.status into v_existing_status
  from public.dc_system_memberships m
  where m.profile_id = v_uid
  for update;

  if v_existing_status in ('suspended','revoked','archived') then
    raise exception 'MEMBERSHIP_STATE_BLOCKED';
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
    confirmed_at = case when public.dc_system_memberships.status = 'active' then public.dc_system_memberships.confirmed_at else now() end,
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

revoke execute on function public.dc_activate_membership_v1(text,text,text,text,text,text,text) from public, anon;
grant execute on function public.dc_activate_membership_v1(text,text,text,text,text,text,text) to authenticated;

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
      and a.author_profile_id <> (select auth.uid())
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  )
);
;
