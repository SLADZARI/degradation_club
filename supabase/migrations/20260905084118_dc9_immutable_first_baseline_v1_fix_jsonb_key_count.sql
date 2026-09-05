-- Corrective migration for DC-9 immutable baseline v1.
-- PostgreSQL has jsonb_object_keys(jsonb), not jsonb_object_length(jsonb).
-- Preserve the approved 9-key snapshot gate without changing semantics.

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
