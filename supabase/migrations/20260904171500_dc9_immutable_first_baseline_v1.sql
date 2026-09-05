-- DC-9 immutable first baseline v1
-- Existing assessment_runs remain the append-only history authority.
-- No parallel baseline table is introduced.

create or replace function public.dc_first_complete_baseline_v1(p_profile_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
with canonical_runs as (
  select
    ar.id,
    case when ar.sphere_id = 'self-development' then 'self_development' else ar.sphere_id end as sphere_id,
    ar.assessment_version,
    ar.result_json,
    ar.answers_json,
    ar.completed_at,
    ar.created_at
  from public.assessment_runs ar
  where ar.profile_id = p_profile_id
    and ar.completed_at is not null
    and ar.assessment_version = 'dc9-v1'
    and ar.sphere_id = any(array[
      'personality','work','consumption','relationships','control','information',
      'self_development','self-development','meaning','technology'
    ]::text[])
), first_seen as (
  select sphere_id, min(completed_at) as first_completed_at
  from canonical_runs
  group by sphere_id
), cutoff as (
  select max(first_completed_at) as baseline_completed_at, count(*)::integer as sphere_count
  from first_seen
), baseline as (
  select distinct on (cr.sphere_id)
    cr.id,
    cr.sphere_id,
    cr.assessment_version,
    cr.result_json,
    cr.answers_json,
    cr.completed_at
  from canonical_runs cr
  cross join cutoff c
  where c.sphere_count = 9
    and cr.completed_at <= c.baseline_completed_at
  order by cr.sphere_id, cr.completed_at desc, cr.created_at desc, cr.id desc
), snapshot as (
  select jsonb_object_agg(
    b.sphere_id,
    jsonb_build_object(
      'run_id', b.id,
      'assessment_version', b.assessment_version,
      'result', b.result_json,
      'answers', b.answers_json,
      'completed_at', b.completed_at
    )
  ) as value
  from baseline b
)
select case
  when coalesce((select sphere_count from cutoff),0) <> 9 then null
  else jsonb_build_object(
    'rule','first-complete-9of9-v1',
    'completed_at',(select baseline_completed_at from cutoff),
    'sphere_count',9,
    'snapshot',coalesce((select value from snapshot),'{}'::jsonb)
  )
end;
$function$;

revoke all on function public.dc_first_complete_baseline_v1(uuid) from public, anon, authenticated;
grant execute on function public.dc_first_complete_baseline_v1(uuid) to service_role;

create or replace function public.dc_lock_join_application_baseline_v1()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_baseline jsonb;
  v_snapshot_key_count integer;
begin
  if new.source is distinct from 'dc-membership-application-v2' then
    return new;
  end if;

  v_baseline := public.dc_first_complete_baseline_v1(new.profile_id);
  select count(*)::integer
    into v_snapshot_key_count
  from pg_catalog.jsonb_object_keys(coalesce(v_baseline->'snapshot','{}'::jsonb));

  if v_baseline is null
     or coalesce((v_baseline->>'sphere_count')::integer,0) <> 9
     or coalesce(v_snapshot_key_count,0) <> 9 then
    raise exception 'SPHERE_GATE_INCOMPLETE';
  end if;

  new.candidate_snapshot := v_baseline->'snapshot';
  new.answers := coalesce(new.answers,'{}'::jsonb) || jsonb_build_object(
    'dc9_baseline_rule', v_baseline->>'rule',
    'dc9_baseline_completed_at', v_baseline->>'completed_at'
  );
  return new;
end;
$function$;

revoke all on function public.dc_lock_join_application_baseline_v1() from public, anon, authenticated;

drop trigger if exists dc_join_application_first_baseline_v1 on public.join_applications;
create trigger dc_join_application_first_baseline_v1
before insert on public.join_applications
for each row execute function public.dc_lock_join_application_baseline_v1();

-- Make the existing client-facing assessment history explicitly append-only.
revoke all on table public.assessment_runs from anon;
revoke all on table public.assessment_runs from authenticated;
grant select, insert on table public.assessment_runs to authenticated;

comment on function public.dc_first_complete_baseline_v1(uuid) is
'Derives the immutable DC-9 map at the first moment all 9 canonical spheres were complete. Repeats after that cutoff never change the baseline.';
