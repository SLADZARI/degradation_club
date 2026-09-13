create or replace function public.dc_owner_admin_system_checks()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  uid uuid := auth.uid();
  is_admin boolean := false;
  result jsonb;
begin
  if uid is null then
    raise exception 'authentication required' using errcode='42501';
  end if;

  select exists(
    select 1
    from public.dc_role_assignments r
    where r.profile_id = uid
      and r.role = 'owner_admin'
      and r.status = 'active'
      and (r.valid_from is null or r.valid_from <= now())
      and (r.valid_to is null or r.valid_to > now())
  ) into is_admin;

  if not is_admin then
    raise exception 'owner_admin required' using errcode='42501';
  end if;

  select jsonb_build_object(
    'checked_at', now(),
    'current_user_id', uid,
    'identity', jsonb_build_object(
      'owner_admin', is_admin,
      'owner_admin_count', (select count(*) from public.dc_role_assignments where role='owner_admin' and status='active')
    ),
    'rls', jsonb_build_object(
      'profiles', coalesce((select relrowsecurity from pg_class where oid='public.profiles'::regclass), false),
      'assessment_runs', coalesce((select relrowsecurity from pg_class where oid='public.assessment_runs'::regclass), false),
      'assessment_snapshots', coalesce((select relrowsecurity from pg_class where oid='public.assessment_snapshots'::regclass), false),
      'join_applications', coalesce((select relrowsecurity from pg_class where oid='public.join_applications'::regclass), false),
      'dc_role_assignments', coalesce((select relrowsecurity from pg_class where oid='public.dc_role_assignments'::regclass), false),
      'dc_entity_assignments', coalesce((select relrowsecurity from pg_class where oid='public.dc_entity_assignments'::regclass), false),
      'dc_merch_items', coalesce((select relrowsecurity from pg_class where oid='public.dc_merch_items'::regclass), false),
      'dc_program_certificates', coalesce((select relrowsecurity from pg_class where oid='public.dc_program_certificates'::regclass), false),
      'dc_progress_signals', coalesce((select relrowsecurity from pg_class where oid='public.dc_progress_signals'::regclass), false)
    ),
    'membership_application', jsonb_build_object(
      'anonymous_insert_policy_absent', not exists(
        select 1 from pg_policies
        where schemaname='public' and tablename='join_applications' and cmd='INSERT'
          and (roles::text ilike '%anon%' or roles::text ilike '%public%')
      ),
      'authenticated_insert_policy_present', exists(
        select 1 from pg_policies
        where schemaname='public' and tablename='join_applications' and policyname='join_applications_auth_insert' and cmd='INSERT'
      ),
      'own_select_policy_present', exists(
        select 1 from pg_policies
        where schemaname='public' and tablename='join_applications' and policyname='join_applications_select_own' and cmd='SELECT'
      ),
      'one_submitted_index_present', exists(
        select 1 from pg_indexes
        where schemaname='public' and tablename='join_applications' and indexname='join_applications_one_submitted_per_profile_idx'
      )
    ),
    'runtime', jsonb_build_object(
      'program_entities', (select count(*) from public.dc_entities where entity_type='program'),
      'event_entities', (select count(*) from public.dc_entities where entity_type='event'),
      'merch_items', (select count(*) from public.dc_merch_items),
      'certificates', (select count(*) from public.dc_program_certificates),
      'progress_signals', (select count(*) from public.dc_progress_signals),
      'assessment_runs', (select count(*) from public.assessment_runs)
    )
  ) into result;

  return result;
end;
$$;
revoke all on function public.dc_owner_admin_system_checks() from public;
grant execute on function public.dc_owner_admin_system_checks() to authenticated;