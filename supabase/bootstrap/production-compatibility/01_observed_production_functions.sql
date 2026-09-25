-- Observed production compatibility overlay v1: exact function definitions.
-- LOCAL VALIDATION ONLY. Read-only captured from production on 2026-09-24.
-- Do not promote to semantic authority or permanent supabase/migrations history.

-- BEGIN observed production dc_admin_board_hide_artifact_v1
CREATE OR REPLACE FUNCTION public.dc_admin_board_hide_artifact_v1(p_artifact_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_uid uuid:=auth.uid(); v_artifact_id uuid; v_outbox_id uuid; v_status text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_is_owner_admin(v_uid) then raise exception 'OWNER_ADMIN_REQUIRED'; end if;
  select a.id into v_artifact_id from public.dc_artifacts a
   where a.id=p_artifact_id and a.visibility='community' and a.published_at is not null for update;
  if v_artifact_id is null then raise exception 'ARTIFACT_NOT_FOUND'; end if;
  update public.dc_artifacts set board_hidden_at=coalesce(board_hidden_at,now()),board_hidden_by=coalesce(board_hidden_by,v_uid),updated_at=now() where id=p_artifact_id;
  select o.id,o.status into v_outbox_id,v_status from public.dc_distribution_outbox o where o.artifact_id=p_artifact_id and o.channel='telegram' for update;
  if v_outbox_id is not null and v_status in ('held','pending') then
    update public.dc_distribution_outbox set status='suppressed',locked_at=null,updated_at=now() where id=v_outbox_id and status=v_status;
    v_status:='suppressed';
  end if;
  return jsonb_build_object('artifact_id',p_artifact_id,'board_hidden',true,'delivery_status',v_status);
end;
$function$;
-- END observed production dc_admin_board_hide_artifact_v1

-- BEGIN observed production dc_admin_promote_artifact_telegram_v1
CREATE OR REPLACE FUNCTION public.dc_admin_promote_artifact_telegram_v1(p_artifact_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_uid uuid:=auth.uid(); v_artifact public.dc_artifacts%rowtype; v_status text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_is_owner_admin(v_uid) then raise exception 'OWNER_ADMIN_REQUIRED'; end if;
  perform public.dc_normalize_artifact_lifecycle_v1();
  select * into v_artifact from public.dc_artifacts a where a.id=p_artifact_id for update;
  if v_artifact.id is null or v_artifact.visibility<>'community' or v_artifact.status<>'active' or v_artifact.published_at is null
     or v_artifact.board_hidden_at is not null or (v_artifact.expires_at is not null and v_artifact.expires_at<=now()) then raise exception 'ARTIFACT_NOT_PROMOTION_ELIGIBLE'; end if;
  select o.status into v_status from public.dc_distribution_outbox o where o.artifact_id=p_artifact_id and o.channel='telegram' for update;
  if v_status is null then raise exception 'PROMOTION_OUTBOX_MISSING'; end if;
  if v_status='suppressed' then raise exception 'TELEGRAM_SUPPRESSED'; end if;
  if v_status='held' then
    update public.dc_distribution_outbox set status='pending',available_at=now(),updated_at=now()
     where artifact_id=p_artifact_id and channel='telegram' and status='held';
    v_status:='pending';
  end if;
  return jsonb_build_object('artifact_id',p_artifact_id,'delivery_status',v_status,'override',true);
end;
$function$;
-- END observed production dc_admin_promote_artifact_telegram_v1

-- BEGIN observed production dc_admin_resolve_delivery_unknown_v1
CREATE OR REPLACE FUNCTION public.dc_admin_resolve_delivery_unknown_v1(p_outbox_id uuid, p_resolution text, p_external_ref text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_uid uuid:=auth.uid(); v_status text; v_resolution text:=lower(btrim(coalesce(p_resolution,'')));
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_is_owner_admin(v_uid) then raise exception 'OWNER_ADMIN_REQUIRED'; end if;
  if v_resolution not in ('sent','retry','cancelled') then raise exception 'RESOLUTION_INVALID'; end if;
  select o.status into v_status from public.dc_distribution_outbox o where o.id=p_outbox_id for update;
  if v_status is null then raise exception 'OUTBOX_NOT_FOUND'; end if;
  if v_status<>'delivery_unknown' then raise exception 'DELIVERY_NOT_UNKNOWN'; end if;
  if v_resolution='sent' then
    update public.dc_distribution_outbox set status='sent',sent_at=coalesce(sent_at,now()),external_ref=coalesce(nullif(btrim(p_external_ref),''),external_ref),locked_at=null,last_error=null,updated_at=now()
     where id=p_outbox_id and status='delivery_unknown'; v_status:='sent';
  elsif v_resolution='retry' then
    update public.dc_distribution_outbox set status='pending',available_at=now(),locked_at=null,updated_at=now()
     where id=p_outbox_id and status='delivery_unknown'; v_status:='pending';
  else
    update public.dc_distribution_outbox set status='cancelled',locked_at=null,updated_at=now()
     where id=p_outbox_id and status='delivery_unknown'; v_status:='cancelled';
  end if;
  return jsonb_build_object('outbox_id',p_outbox_id,'delivery_status',v_status,'manual_resolution',v_resolution);
end;
$function$;
-- END observed production dc_admin_resolve_delivery_unknown_v1

-- BEGIN observed production dc_admin_suppress_artifact_telegram_v1
CREATE OR REPLACE FUNCTION public.dc_admin_suppress_artifact_telegram_v1(p_artifact_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_uid uuid:=auth.uid(); v_id uuid; v_status text;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if not public.dc_is_owner_admin(v_uid) then raise exception 'OWNER_ADMIN_REQUIRED'; end if;
  select o.id,o.status into v_id,v_status from public.dc_distribution_outbox o where o.artifact_id=p_artifact_id and o.channel='telegram' for update;
  if v_id is null then raise exception 'PROMOTION_OUTBOX_MISSING'; end if;
  if v_status in ('held','pending') then
    update public.dc_distribution_outbox set status='suppressed',locked_at=null,updated_at=now() where id=v_id and status=v_status;
    v_status:='suppressed';
  end if;
  return jsonb_build_object('artifact_id',p_artifact_id,'delivery_status',v_status);
end;
$function$;
-- END observed production dc_admin_suppress_artifact_telegram_v1

-- BEGIN observed production dc_distribution_claim_pending_v1
CREATE OR REPLACE FUNCTION public.dc_distribution_claim_pending_v1(p_limit integer DEFAULT 5)
 RETURNS TABLE(id uuid, artifact_id uuid, attempts integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  return query with candidates as (
    select o.id from public.dc_distribution_outbox o where o.status='pending' and o.available_at<=now() and o.attempts<5
    order by o.created_at for update skip locked limit greatest(1,least(coalesce(p_limit,5),20)
  )), claimed as (
    update public.dc_distribution_outbox o set status='processing',locked_at=now(),attempts=o.attempts+1,updated_at=now()
    from candidates c where o.id=c.id and o.status='pending' returning o.id,o.artifact_id,o.attempts
  ) select c.id,c.artifact_id,c.attempts from claimed c;
end;
$function$;
-- END observed production dc_distribution_claim_pending_v1

-- BEGIN observed production dc_guest_board_interest_toggle_v1
CREATE OR REPLACE FUNCTION public.dc_guest_board_interest_toggle_v1(p_artifact_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare v_uid uuid:=auth.uid(); v_active boolean; v_count bigint;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if public.dc_membership_active() or public.dc_is_owner_admin() then raise exception 'MEMBER_USE_CANONICAL_REACTION'; end if;
  perform public.dc_normalize_artifact_lifecycle_v1();
  if not exists(select 1 from public.dc_artifacts a where a.id=p_artifact_id and a.visibility='community'
    and a.status in ('active','expired','archived') and a.published_at is not null and a.board_hidden_at is null
    and (a.starts_at is null or a.starts_at<=now())) then raise exception 'ARTIFACT_NOT_AVAILABLE'; end if;
  if exists(select 1 from public.dc_guest_board_interests i where i.artifact_id=p_artifact_id and i.profile_id=v_uid) then
    delete from public.dc_guest_board_interests i where i.artifact_id=p_artifact_id and i.profile_id=v_uid; v_active:=false;
  else
    insert into public.dc_guest_board_interests(artifact_id,profile_id) values(p_artifact_id,v_uid) on conflict do nothing; v_active:=true;
  end if;
  select count(*)::bigint into v_count from public.dc_guest_board_interests i where i.artifact_id=p_artifact_id;
  return jsonb_build_object('active',v_active,'count',v_count);
end;
$function$;
-- END observed production dc_guest_board_interest_toggle_v1

-- BEGIN observed production dc_member_entry_status_v1
CREATE OR REPLACE FUNCTION public.dc_member_entry_status_v1()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
-- END observed production dc_member_entry_status_v1

-- BEGIN observed production dc_publish_artifact_v1
CREATE OR REPLACE FUNCTION public.dc_publish_artifact_v1(p_artifact_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_uid uuid := auth.uid(); v_owner boolean; v_granted integer := 0; v_consuming integer := 0;
  v_artifact public.dc_artifacts%rowtype; v_outbox_id uuid;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_owner := public.dc_is_owner_admin(v_uid);
  if not public.dc_membership_active(v_uid) and not v_owner then raise exception 'MEMBERSHIP_REQUIRED'; end if;
  perform 1 from public.profiles p where p.id=v_uid for update;
  update public.dc_artifacts set status='expired',updated_at=now()
   where author_profile_id=v_uid and status='active' and expires_at is not null and expires_at <= now();
  select * into v_artifact from public.dc_artifacts a where a.id=p_artifact_id and a.author_profile_id=v_uid for update;
  if v_artifact.id is null or v_artifact.status <> 'draft' then raise exception 'ARTIFACT_DRAFT_NOT_FOUND'; end if;
  if v_artifact.expires_at is not null and v_artifact.expires_at <= now() then raise exception 'ARTIFACT_ALREADY_EXPIRED'; end if;
  if not v_owner then
    select coalesce(sum(g.amount),0)::integer into v_granted from public.dc_artifact_slot_grants g where g.profile_id=v_uid;
    select count(*)::integer into v_consuming from public.dc_artifacts a
     where a.author_profile_id=v_uid and a.status in ('publishing','active') and (a.expires_at is null or a.expires_at > now());
    if v_granted-v_consuming <= 0 then raise exception 'NO_ARTIFACT_SLOT_AVAILABLE'; end if;
  end if;
  update public.dc_artifacts set status='active',published_at=now(),updated_at=now() where id=p_artifact_id;
  insert into public.dc_distribution_outbox(artifact_id,channel,status,payload,available_at)
  values (p_artifact_id,'telegram','held',jsonb_build_object('artifact_id',p_artifact_id,'source','community_board_promotion_v1'),now())
  on conflict (artifact_id,channel) do nothing returning id into v_outbox_id;
  if v_outbox_id is null then
    select o.id into v_outbox_id from public.dc_distribution_outbox o where o.artifact_id=p_artifact_id and o.channel='telegram';
  end if;
  return jsonb_build_object('artifact_id',p_artifact_id,'status','active','published_at',now(),'owner_admin',v_owner,
    'slots_available',case when v_owner then null else greatest(v_granted-v_consuming-1,0) end,
    'telegram_outbox_id',v_outbox_id,'telegram_status','held');
end;
$function$;
-- END observed production dc_publish_artifact_v1

-- BEGIN observed production dc_set_artifact_activity_v1
CREATE OR REPLACE FUNCTION public.dc_set_artifact_activity_v1(p_artifact_id uuid, p_activity_at timestamp with time zone)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_uid uuid := auth.uid(); v_owner boolean;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  v_owner := public.dc_is_owner_admin(v_uid);
  if not public.dc_membership_active(v_uid) and not v_owner then raise exception 'MEMBERSHIP_REQUIRED'; end if;
  update public.dc_artifacts set activity_at=p_activity_at,updated_at=now()
   where id=p_artifact_id and author_profile_id=v_uid and status='draft';
  if not found then raise exception 'ARTIFACT_DRAFT_NOT_FOUND'; end if;
  return p_artifact_id;
end;
$function$;
-- END observed production dc_set_artifact_activity_v1

-- BEGIN observed production dc_submit_membership_application_v2
CREATE OR REPLACE FUNCTION public.dc_submit_membership_application_v2(p_full_name text, p_social_url text, p_about text, p_why_club text DEFAULT NULL::text, p_interest_distribution jsonb DEFAULT '{}'::jsonb, p_terms_version text DEFAULT '0.2'::text, p_privacy_version text DEFAULT '0.2'::text, p_legal_accepted boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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

  if public.dc_membership_active(v_uid) then raise exception 'ALREADY_MEMBER'; end if;

  if exists (
    select 1 from public.join_applications a
    where a.profile_id = v_uid and a.status in ('submitted','reviewing')
  ) then raise exception 'ACTIVE_APPLICATION_EXISTS'; end if;

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
-- END observed production dc_submit_membership_application_v2

