-- Dementor Club Membership & Dementor Review v2
-- Remote migration version: 20260902130850

alter table public.join_applications
  add column if not exists candidate_snapshot jsonb,
  add column if not exists decision_version text;

alter table public.join_applications
  drop constraint if exists join_applications_status_check;

alter table public.join_applications
  add constraint join_applications_status_check
  check (status = any (array['submitted'::text,'reviewing'::text,'accepted'::text,'rejected'::text,'continue_outside'::text,'withdrawn'::text]));

create unique index if not exists join_applications_one_open_v2
  on public.join_applications(profile_id)
  where profile_id is not null and status in ('submitted','reviewing');

create table if not exists public.dc_membership_review_policies (
  policy_key text primary key,
  required_approvals integer not null check (required_approvals >= 1),
  required_not_now integer not null check (required_not_now >= 1),
  is_active boolean not null default true,
  source_ref text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.dc_membership_review_policies(policy_key,required_approvals,required_not_now,is_active,source_ref)
values ('membership-v2',2,2,true,'community/MEMBERSHIP_AND_DEMENTOR_REVIEW_V2.md')
on conflict (policy_key) do update set
  required_approvals = excluded.required_approvals,
  required_not_now = excluded.required_not_now,
  is_active = excluded.is_active,
  source_ref = excluded.source_ref,
  updated_at = now();

create table if not exists public.dc_membership_reviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.join_applications(id) on delete cascade,
  reviewer_profile_id uuid not null references public.profiles(id) on delete cascade,
  decision text not null check (decision in ('approve','more_context','not_now')),
  internal_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(application_id, reviewer_profile_id)
);

create index if not exists dc_membership_reviews_application_idx
  on public.dc_membership_reviews(application_id, decision);

alter table public.dc_membership_reviews enable row level security;

revoke all on public.dc_membership_reviews from anon, authenticated;
grant select on public.dc_membership_reviews to authenticated;
grant all on public.dc_membership_reviews to service_role;

create policy dc_membership_reviews_dementor_select
on public.dc_membership_reviews
for select
to authenticated
using (
  exists (
    select 1
    from public.dc_role_assignments r
    where r.profile_id = (select auth.uid())
      and r.role = 'dementor'
      and r.status = 'active'
      and r.valid_from <= now()
      and (r.valid_to is null or r.valid_to > now())
  )
);

create policy join_applications_dementor_select_v2
on public.join_applications
for select
to authenticated
using (
  exists (
    select 1
    from public.dc_role_assignments r
    where r.profile_id = (select auth.uid())
      and r.role = 'dementor'
      and r.status = 'active'
      and r.valid_from <= now()
      and (r.valid_to is null or r.valid_to > now())
  )
);

create table if not exists public.dc_membership_notification_outbox (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.join_applications(id) on delete cascade,
  event_type text not null check (event_type in ('join_application_submitted','join_application_accepted','join_application_continue_outside')),
  channel text not null default 'telegram' check (channel in ('telegram')),
  status text not null default 'pending' check (status in ('pending','processing','sent','failed','cancelled')),
  payload jsonb not null default '{}'::jsonb,
  attempts integer not null default 0 check (attempts >= 0),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  sent_at timestamptz,
  external_ref text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(application_id,event_type,channel)
);

alter table public.dc_membership_notification_outbox enable row level security;
revoke all on public.dc_membership_notification_outbox from anon, authenticated;
grant all on public.dc_membership_notification_outbox to service_role;

insert into public.dc_role_assignments(
  profile_id, role, scope_type, status, valid_from, valid_to,
  source_system, source_ref, provenance_status, confirmed_at, created_at, updated_at
)
select p.id, 'dementor', 'system', 'active', now(), null,
       'dementor-club', 'community/MEMBERSHIP_AND_DEMENTOR_REVIEW_V2.md', 'confirmed', now(), now(), now()
from public.profiles p
where lower(p.email) in ('kazakoveugenio@gmail.com','3122065@gmail.com')
on conflict (profile_id,role,scope_type) do update set
  status = 'active',
  valid_to = null,
  source_system = excluded.source_system,
  source_ref = excluded.source_ref,
  provenance_status = 'confirmed',
  confirmed_at = now(),
  updated_at = now();

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
  v_snapshot jsonb;
  v_sphere_count integer := 0;
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

  if exists (
    select 1 from public.dc_system_memberships m
    where m.profile_id = v_uid and m.status = 'active'
  ) then raise exception 'ALREADY_MEMBER'; end if;

  if exists (
    select 1 from public.join_applications a
    where a.profile_id = v_uid and a.status in ('submitted','reviewing')
  ) then raise exception 'ACTIVE_APPLICATION_EXISTS'; end if;

  with latest as (
    select distinct on (ar.sphere_id)
      ar.id, ar.sphere_id, ar.assessment_version, ar.result_json, ar.answers_json, ar.completed_at
    from public.assessment_runs ar
    where ar.profile_id = v_uid
      and ar.completed_at is not null
      and ar.sphere_id = any(array['personality','work','consumption','relationships','control','information','self_development','meaning','technology']::text[])
    order by ar.sphere_id, ar.completed_at desc, ar.created_at desc, ar.id desc
  )
  select count(*)::integer,
         jsonb_object_agg(
           l.sphere_id,
           jsonb_build_object(
             'assessment_run_id', l.id,
             'assessment_version', l.assessment_version,
             'result', l.result_json,
             'answers', l.answers_json,
             'completed_at', l.completed_at
           )
         )
  into v_sphere_count, v_snapshot
  from latest l;

  if v_sphere_count <> 9 then raise exception 'SPHERE_GATE_INCOMPLETE'; end if;

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
      'interest_distribution',coalesce(p_interest_distribution,'{}'::jsonb),
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

create or replace function public.dc_review_membership_application_v2(
  p_application_id uuid,
  p_decision text,
  p_internal_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_app public.join_applications%rowtype;
  v_required_approvals integer;
  v_required_not_now integer;
  v_approve_count integer := 0;
  v_not_now_count integer := 0;
  v_display_name text;
  v_member_since timestamptz;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_decision not in ('approve','more_context','not_now') then raise exception 'DECISION_INVALID'; end if;

  if not exists (
    select 1 from public.dc_role_assignments r
    where r.profile_id = v_uid
      and r.role = 'dementor'
      and r.status = 'active'
      and r.valid_from <= now()
      and (r.valid_to is null or r.valid_to > now())
  ) then raise exception 'DEMENTOR_REQUIRED'; end if;

  select * into v_app
  from public.join_applications a
  where a.id = p_application_id
  for update;

  if v_app.id is null then raise exception 'APPLICATION_NOT_FOUND'; end if;
  if v_app.status not in ('submitted','reviewing') then raise exception 'APPLICATION_CLOSED'; end if;

  insert into public.dc_membership_reviews(application_id,reviewer_profile_id,decision,internal_note)
  values (p_application_id,v_uid,p_decision,nullif(btrim(coalesce(p_internal_note,'')),''))
  on conflict (application_id,reviewer_profile_id) do update set
    decision = excluded.decision,
    internal_note = excluded.internal_note,
    updated_at = now();

  select p.required_approvals,p.required_not_now
  into v_required_approvals,v_required_not_now
  from public.dc_membership_review_policies p
  where p.policy_key='membership-v2' and p.is_active;

  if v_required_approvals is null then raise exception 'REVIEW_POLICY_MISSING'; end if;

  select count(*) filter (where rv.decision='approve')::integer,
         count(*) filter (where rv.decision='not_now')::integer
  into v_approve_count,v_not_now_count
  from public.dc_membership_reviews rv
  join public.dc_role_assignments r
    on r.profile_id = rv.reviewer_profile_id
   and r.role='dementor'
   and r.status='active'
   and r.valid_from <= now()
   and (r.valid_to is null or r.valid_to > now())
  where rv.application_id = p_application_id;

  if v_approve_count >= v_required_approvals then
    update public.join_applications
       set status='accepted', reviewed_at=now()
     where id=p_application_id;

    insert into public.dc_system_memberships(
      profile_id,status,valid_from,valid_to,source_system,source_ref,provenance_status,confirmed_at,updated_at
    ) values (
      v_app.profile_id,'active',now(),null,'dementor-club','membership-review-v2','confirmed',now(),now()
    )
    on conflict (profile_id) do update set
      status='active',
      valid_from=case when public.dc_system_memberships.status='active' then public.dc_system_memberships.valid_from else now() end,
      valid_to=null,
      source_system='dementor-club',
      source_ref='membership-review-v2',
      provenance_status='confirmed',
      confirmed_at=now(),
      updated_at=now();

    select coalesce(nullif(btrim(p.display_name),''),nullif(btrim(p.full_name),''),nullif(btrim(v_app.full_name),''),v_app.email)
      into v_display_name
    from public.profiles p
    where p.id=v_app.profile_id;

    select m.valid_from into v_member_since
    from public.dc_system_memberships m
    where m.profile_id=v_app.profile_id;

    insert into public.dc_member_public_profiles(profile_id,display_name,nickname,avatar_url,member_since,updated_at)
    select p.id,left(v_display_name,80),p.nickname,p.avatar_url,v_member_since,now()
    from public.profiles p where p.id=v_app.profile_id
    on conflict (profile_id) do update set
      display_name=excluded.display_name,
      nickname=excluded.nickname,
      avatar_url=excluded.avatar_url,
      member_since=excluded.member_since,
      updated_at=now();

    if not exists (
      select 1 from public.dc_artifact_slot_grants g
      where g.profile_id=v_app.profile_id
        and g.grant_key in ('initial-membership-v1','initial-membership-v2')
    ) then
      insert into public.dc_artifact_slot_grants(profile_id,amount,grant_key,reason,source_system,source_ref,provenance_status)
      values (v_app.profile_id,1,'initial-membership-v2','Initial Community Artifact slot','dementor-club','membership-review-v2','confirmed');
    end if;

    insert into public.dc_membership_notification_outbox(application_id,event_type,payload)
    values (
      p_application_id,
      'join_application_accepted',
      jsonb_build_object('application_id',p_application_id,'profile_id',v_app.profile_id,'full_name',v_app.full_name)
    )
    on conflict (application_id,event_type,channel) do nothing;

    return jsonb_build_object(
      'application_id',p_application_id,
      'status','accepted',
      'approve_count',v_approve_count,
      'required_approvals',v_required_approvals,
      'membership_active',true
    );
  elsif v_not_now_count >= v_required_not_now then
    update public.join_applications
       set status='continue_outside', reviewed_at=now()
     where id=p_application_id;

    insert into public.dc_membership_notification_outbox(application_id,event_type,payload)
    values (
      p_application_id,
      'join_application_continue_outside',
      jsonb_build_object('application_id',p_application_id,'profile_id',v_app.profile_id,'full_name',v_app.full_name)
    )
    on conflict (application_id,event_type,channel) do nothing;

    return jsonb_build_object(
      'application_id',p_application_id,
      'status','continue_outside',
      'approve_count',v_approve_count,
      'not_now_count',v_not_now_count,
      'membership_active',false
    );
  else
    update public.join_applications
       set status='reviewing'
     where id=p_application_id;

    return jsonb_build_object(
      'application_id',p_application_id,
      'status','reviewing',
      'approve_count',v_approve_count,
      'required_approvals',v_required_approvals,
      'not_now_count',v_not_now_count,
      'membership_active',false
    );
  end if;
end;
$function$;

revoke all on function public.dc_review_membership_application_v2(uuid,text,text) from public, anon;
grant execute on function public.dc_review_membership_application_v2(uuid,text,text) to authenticated;

comment on table public.dc_membership_reviews is 'Dementor Club Membership Review v2 reviewer decisions';
comment on table public.dc_membership_notification_outbox is 'Downstream notification queue for Membership Review v2; not semantic authority';
comment on column public.join_applications.candidate_snapshot is 'Immutable latest-per-sphere DC-9 snapshot captured at Membership v2 submission';
