-- Dementor Club — DC-9 / Membership semantic integrity v1
-- QA-MEM-037, QA-MEM-038, QA-MEM-039
-- Tracked migration only. Do not apply live without explicit release authorization.

create or replace function public.dc_submit_membership_application_v2(
  p_full_name text,
  p_social_url text,
  p_about text,
  p_why_club text default null,
  p_interest_distribution jsonb default '{}'::jsonb,
  p_terms_version text default '0.2',
  p_privacy_version text default '0.2',
  p_legal_accepted boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_baseline jsonb;
  v_snapshot jsonb;
  v_snapshot_key_count integer := 0;
  v_interest_key_count integer := 0;
  v_interest_total integer := 0;
  v_application_id uuid;
  v_provider text;
  v_identity_id uuid;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if nullif(btrim(coalesce(p_full_name,'')),'') is null then raise exception 'FULL_NAME_REQUIRED'; end if;
  if char_length(btrim(p_full_name)) > 160 then raise exception 'FULL_NAME_TOO_LONG'; end if;
  if nullif(btrim(coalesce(p_social_url,'')),'') is null or p_social_url !~* '^https?://' then raise exception 'SOCIAL_URL_REQUIRED'; end if;
  if nullif(btrim(coalesce(p_about,'')),'') is null then raise exception 'ABOUT_REQUIRED'; end if;
  if p_legal_accepted is not true then raise exception 'LEGAL_CONSENT_REQUIRED'; end if;
  if p_terms_version <> '0.2' or p_privacy_version <> '0.2' then raise exception 'LEGAL_VERSION_MISMATCH'; end if;

  select p.email into v_email from public.profiles p where p.id = v_uid;
  if v_email is null then raise exception 'PROFILE_REQUIRED'; end if;

  -- One canonical meaning of "active now". Historical/expired membership is not active.
  if public.dc_membership_active(v_uid) then raise exception 'ALREADY_MEMBER'; end if;

  if exists (
    select 1 from public.join_applications a
    where a.profile_id = v_uid and a.status in ('submitted','reviewing')
  ) then raise exception 'ACTIVE_APPLICATION_EXISTS'; end if;

  -- Application admission uses the same immutable first-complete baseline authority
  -- as the join_application trigger and Entry Status.
  v_baseline := public.dc_first_complete_baseline_v1(v_uid);
  v_snapshot := coalesce(v_baseline->'snapshot','{}'::jsonb);
  select count(*)::integer into v_snapshot_key_count
  from pg_catalog.jsonb_object_keys(v_snapshot);

  if v_baseline is null
     or coalesce((v_baseline->>'sphere_count')::integer,0) <> 9
     or v_snapshot_key_count <> 9
     or exists (
       select 1
       from pg_catalog.jsonb_object_keys(v_snapshot) as k(key)
       where k.key not in (
         'personality','work','consumption','relationships','control','information',
         'self_development','meaning','technology'
       )
     )
  then
    raise exception 'SPHERE_GATE_INCOMPLETE';
  end if;

  -- Interest Map is a server-owned domain invariant, not only a UI constraint.
  if p_interest_distribution is null
     or pg_catalog.jsonb_typeof(p_interest_distribution) <> 'object'
     or p_interest_distribution = '{}'::jsonb
  then
    raise exception 'INTEREST_MAP_REQUIRED';
  end if;

  select count(*)::integer into v_interest_key_count
  from pg_catalog.jsonb_object_keys(p_interest_distribution);

  if v_interest_key_count <> 9
     or exists (
       select 1
       from pg_catalog.jsonb_object_keys(p_interest_distribution) as k(key)
       where k.key not in (
         'personality','work','consumption','relationships','control','information',
         'self_development','meaning','technology'
       )
     )
  then
    raise exception 'INTEREST_MAP_INVALID_KEYS';
  end if;

  if exists (
    select 1
    from pg_catalog.jsonb_each(p_interest_distribution) as e(key,value)
    where pg_catalog.jsonb_typeof(e.value) <> 'number'
       or ((e.value #>> '{}')::numeric) <> pg_catalog.trunc((e.value #>> '{}')::numeric)
       or ((e.value #>> '{}')::numeric) < 0
       or ((e.value #>> '{}')::numeric) > 100
  ) then
    raise exception 'INTEREST_MAP_INVALID_VALUE';
  end if;

  select coalesce(sum((e.value #>> '{}')::integer),0)::integer into v_interest_total
  from pg_catalog.jsonb_each(p_interest_distribution) as e(key,value);
  if v_interest_total <> 100 then raise exception 'INTEREST_MAP_TOTAL_INVALID'; end if;

  update public.profiles
     set full_name = btrim(p_full_name),
         display_name = coalesce(nullif(btrim(display_name),''), btrim(p_full_name)),
         updated_at = now()
   where id = v_uid;

  v_provider := case
    when lower(p_social_url) like '%t.me/%' or lower(p_social_url) like '%telegram.%' then 'telegram'
    when lower(p_social_url) like '%instagram.com/%' then 'instagram'
    when lower(p_social_url) like '%linkedin.com/%' then 'linkedin'
    else 'website'
  end;

  select i.id into v_identity_id
  from public.dc_member_external_identities i
  where i.profile_id = v_uid and i.is_primary
  order by i.created_at
  limit 1;

  if v_identity_id is null then
    insert into public.dc_member_external_identities(profile_id,provider,url,is_primary,visibility)
    values (v_uid,v_provider,btrim(p_social_url),true,'private')
    returning id into v_identity_id;
  else
    update public.dc_member_external_identities
       set provider = v_provider,
           url = btrim(p_social_url),
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

  insert into public.join_applications(
    profile_id,email,full_name,answers,status,source,candidate_snapshot,decision_version
  ) values (
    v_uid,
    v_email,
    btrim(p_full_name),
    jsonb_build_object(
      'version','dc-membership-application-v2',
      'social_url',btrim(p_social_url),
      'about',btrim(p_about),
      'why_club',nullif(btrim(coalesce(p_why_club,'')),''),
      'interest_distribution',p_interest_distribution,
      'terms_version',p_terms_version,
      'privacy_version',p_privacy_version
    ),
    'submitted',
    'dc-membership-application-v2',
    v_snapshot,
    'membership-review-v2'
  ) returning id into v_application_id;

  insert into public.dc_membership_notification_outbox(application_id,event_type,payload)
  values (
    v_application_id,
    'join_application_submitted',
    jsonb_build_object(
      'application_id',v_application_id,
      'profile_id',v_uid,
      'full_name',btrim(p_full_name),
      'sphere_count',9,
      'review_url','https://dementor.club/workspace/review/?application=' || v_application_id::text
    )
  )
  on conflict (application_id,event_type,channel) do nothing;

  return jsonb_build_object(
    'application_id',v_application_id,
    'status','submitted',
    'sphere_count',9
  );
end;
$function$;

revoke all on function public.dc_submit_membership_application_v2(text,text,text,text,jsonb,text,text,boolean) from public, anon;
grant execute on function public.dc_submit_membership_application_v2(text,text,text,text,jsonb,text,text,boolean) to authenticated;

create or replace function public.dc_member_entry_status_v1()
returns jsonb
language plpgsql
stable
security definer
set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_baseline jsonb;
  v_snapshot jsonb := '{}'::jsonb;
  v_snapshot_key_count integer := 0;
  v_completed text[] := array[]::text[];
  v_missing text[] := array[]::text[];
  v_sphere_count integer := 0;
  v_sphere_gate_complete boolean := false;
  v_identity_ready boolean := false;
  v_legal_ready boolean := false;
  v_membership_status text;
  v_membership_active boolean := false;
  v_published_artifact_count integer := 0;
  v_granted_slots integer := 0;
  v_consuming_slots integer := 0;
  v_artifact_slots_available integer := 0;
  v_community_activation_state text := null;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;

  -- Preserve the existing informative response contract, but canonicalize legacy
  -- sphere ids and scope progress to the canonical DC-9 assessment version.
  select coalesce(array_agg(x.sphere_id order by x.sphere_id),array[]::text[])
  into v_completed
  from (
    select distinct case
      when ar.sphere_id = 'self-development' then 'self_development'
      else ar.sphere_id
    end as sphere_id
    from public.assessment_runs ar
    where ar.profile_id = v_uid
      and ar.completed_at is not null
      and ar.assessment_version = 'dc9-v1'
      and ar.sphere_id = any(array[
        'personality','work','consumption','relationships','control','information',
        'self_development','self-development','meaning','technology'
      ]::text[])
  ) x;

  v_sphere_count := coalesce(array_length(v_completed,1),0);

  select coalesce(array_agg(s order by s),array[]::text[])
  into v_missing
  from unnest(array[
    'personality','work','consumption','relationships','control','information',
    'self_development','meaning','technology'
  ]::text[]) s
  where not (s = any(v_completed));

  -- Permission completion is owned only by the immutable first-complete baseline.
  v_baseline := public.dc_first_complete_baseline_v1(v_uid);
  if v_baseline is not null then
    v_snapshot := coalesce(v_baseline->'snapshot','{}'::jsonb);
    select count(*)::integer into v_snapshot_key_count
    from pg_catalog.jsonb_object_keys(v_snapshot);
    v_sphere_gate_complete :=
      coalesce((v_baseline->>'sphere_count')::integer,0) = 9
      and v_snapshot_key_count = 9
      and not exists (
        select 1
        from pg_catalog.jsonb_object_keys(v_snapshot) as k(key)
        where k.key not in (
          'personality','work','consumption','relationships','control','information',
          'self_development','meaning','technology'
        )
      );
  end if;

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
    select 1
    from public.dc_member_legal_acknowledgements l
    where l.profile_id = v_uid
      and l.terms_version = '0.2'
      and l.privacy_version = '0.2'
  ) into v_legal_ready;

  -- Keep raw lifecycle status for backwards-compatible informational consumers,
  -- while all permission decisions use the validity-window boolean below.
  select m.status into v_membership_status
  from public.dc_system_memberships m
  where m.profile_id = v_uid;

  v_membership_active := public.dc_membership_active(v_uid);

  select count(*)::integer into v_published_artifact_count
  from public.dc_artifacts a
  where a.author_profile_id = v_uid
    and a.published_at is not null
    and a.status <> 'removed';

  select coalesce(sum(g.amount),0)::integer into v_granted_slots
  from public.dc_artifact_slot_grants g
  where g.profile_id = v_uid;

  select count(*)::integer into v_consuming_slots
  from public.dc_artifacts a
  where a.author_profile_id = v_uid
    and a.status in ('publishing','active')
    and (a.expires_at is null or a.expires_at > now());

  v_artifact_slots_available := greatest(v_granted_slots - v_consuming_slots,0);

  v_community_activation_state := case
    when v_membership_active and v_published_artifact_count > 0 then 'MEMBER_ACTIVATED'
    when v_membership_active then 'FIRST_ARTIFACT_REQUIRED'
    when v_sphere_gate_complete then 'IDENTITY_REQUIRED'
    else 'SPHERES_IN_PROGRESS'
  end;

  return jsonb_build_object(
    'assessment_version','dc9-v1',
    'sphere_count',v_sphere_count,
    'completed_spheres',v_completed,
    'missing_spheres',v_missing,
    'sphere_gate_complete',v_sphere_gate_complete,
    'baseline_completed_at',v_baseline->>'completed_at',
    'identity_ready',v_identity_ready,
    'legal_ready',v_legal_ready,
    'membership_status',v_membership_status,
    'membership_active',v_membership_active,
    'artifact_slots_granted',v_granted_slots,
    'artifact_slots_consuming',v_consuming_slots,
    'artifact_slots_available',v_artifact_slots_available,
    'published_artifact_count',v_published_artifact_count,
    'community_activation_state',v_community_activation_state
  );
end;
$function$;

revoke all on function public.dc_member_entry_status_v1() from public, anon;
grant execute on function public.dc_member_entry_status_v1() to authenticated;

comment on function public.dc_member_entry_status_v1() is
'DC-9 / Membership semantic authority: preserves Entry Status response shape while using first-complete baseline gate + validity-window membership + existing first-Artifact activation projection.';
