create or replace function public.mp_weekly_snapshot_v1()
returns jsonb
language sql
security definer
set search_path = public
as $$
with
membership_status as (
  select status, count(*)::int as count
  from public.mp_system_memberships
  group by status
),
report_status as (
  select status, count(*)::int as count
  from public.mp_reports
  group by status
),
report_type as (
  select report_type, count(*)::int as count
  from public.mp_reports
  group by report_type
),
award_maturity as (
  select maturity, count(*)::int as count, coalesce(sum(score),0)::int as spores
  from public.mp_spore_awards
  group by maturity
),
project_rows as (
  select
    p.project_key,
    p.name,
    p.source_ref,
    p.updated_at,
    coalesce((
      select jsonb_object_agg(x.status, x.count)
      from (
        select a.status, count(*)::int as count
        from public.mp_project_assignments a
        where a.project_id = p.id
        group by a.status
      ) x
    ), '{}'::jsonb) as assignments_by_status,
    coalesce((
      select jsonb_object_agg(x.access_profile, x.count)
      from (
        select coalesce(a.access_profile, 'UNSPECIFIED') as access_profile, count(*)::int as count
        from public.mp_project_assignments a
        where a.project_id = p.id
        group by coalesce(a.access_profile, 'UNSPECIFIED')
      ) x
    ), '{}'::jsonb) as assignments_by_access_profile,
    coalesce((
      select count(*)::int
      from public.mp_report_items i
      where i.project_id = p.id
    ), 0) as report_items,
    coalesce((
      select count(*)::int
      from public.mp_spore_awards a
      where a.project_id = p.id
    ), 0) as spore_awards,
    coalesce((
      select sum(a.score)::int
      from public.mp_spore_awards a
      where a.project_id = p.id
    ), 0) as project_spores,
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'personKey', c.person_key,
        'role', c.role,
        'score', c.score,
        'status', c.status,
        'confidence', c.confidence,
        'toolLeverage', c.tool_leverage,
        'toolRefs', c.tool_refs
      ) order by c.updated_at desc)
      from public.mp_spore_credits c
      join public.mp_spore_awards a on a.id = c.award_id
      where a.project_id = p.id
    ), '[]'::jsonb) as spore_credits
  from public.mp_project_refs p
)
select jsonb_build_object(
  'schemaVersion', '1.0',
  'generatedAt', now(),
  'namespace', 'MODERN_PILGRIMS',
  'memberships', jsonb_build_object(
    'total', (select count(*)::int from public.mp_system_memberships),
    'byStatus', coalesce((select jsonb_object_agg(status, count) from membership_status), '{}'::jsonb)
  ),
  'projects', coalesce((select jsonb_agg(to_jsonb(project_rows) order by project_key) from project_rows), '[]'::jsonb),
  'reports', jsonb_build_object(
    'total', (select count(*)::int from public.mp_reports),
    'latestSubmittedAt', (select max(submitted_at) from public.mp_reports),
    'byStatus', coalesce((select jsonb_object_agg(status, count) from report_status), '{}'::jsonb),
    'byType', coalesce((select jsonb_object_agg(report_type, count) from report_type), '{}'::jsonb),
    'items', (select count(*)::int from public.mp_report_items),
    'recipients', (select count(*)::int from public.mp_report_recipients)
  ),
  'spores', jsonb_build_object(
    'awards', (select count(*)::int from public.mp_spore_awards),
    'awardScoreTotal', coalesce((select sum(score)::int from public.mp_spore_awards),0),
    'credits', (select count(*)::int from public.mp_spore_credits),
    'attributions', (select count(*)::int from public.mp_spore_attributions),
    'events', (select count(*)::int from public.mp_spore_events),
    'byMaturity', coalesce((select jsonb_object_agg(maturity, jsonb_build_object('count', count, 'spores', spores)) from award_maturity), '{}'::jsonb)
  ),
  'artifactAccess', jsonb_build_object(
    'records', (select count(*)::int from public.mp_project_artifact_access)
  )
);
$$;

revoke all on function public.mp_weekly_snapshot_v1() from public;
revoke all on function public.mp_weekly_snapshot_v1() from anon;
revoke all on function public.mp_weekly_snapshot_v1() from authenticated;
grant execute on function public.mp_weekly_snapshot_v1() to service_role;

comment on function public.mp_weekly_snapshot_v1() is 'Read-only Modern Pilgrims Weekly OS refresh snapshot. Aggregates mp_* runtime only; never imports Dementor Club dc_* domain state.';