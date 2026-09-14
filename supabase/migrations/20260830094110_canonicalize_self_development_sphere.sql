-- Canonicalize the historical DC-9 `self-development` slug to Community v1
-- `self_development` without losing distinct assessment attempts.

begin;

-- If an exact canonical copy already exists, keep it and remove only the
-- semantically duplicate legacy row before the source_key rewrite.
delete from public.assessment_runs legacy
using public.assessment_runs canonical
where legacy.sphere_id = 'self-development'
  and canonical.profile_id = legacy.profile_id
  and canonical.id <> legacy.id
  and canonical.source_key = replace(
    legacy.source_key,
    'dc9-v1:self-development:',
    'dc9-v1:self_development:'
  );

update public.assessment_runs
set sphere_id = 'self_development',
    source_key = replace(
      source_key,
      'dc9-v1:self-development:',
      'dc9-v1:self_development:'
    )
where sphere_id = 'self-development';

-- Snapshots are server state. Keep the canonical key if both are present;
-- otherwise move the legacy value to the canonical key.
update public.assessment_snapshots
set state_json = jsonb_set(
  state_json,
  '{results}',
  case
    when coalesce(state_json->'results','{}'::jsonb) ? 'self_development'
      then coalesce(state_json->'results','{}'::jsonb) - 'self-development'
    else
      (coalesce(state_json->'results','{}'::jsonb) - 'self-development')
      || jsonb_build_object(
        'self_development',
        state_json->'results'->'self-development'
      )
  end,
  true
)
where coalesce(state_json->'results','{}'::jsonb) ? 'self-development';

-- Defensive normalization for interrupted assessments. There are no such rows
-- at migration time, but future replays of the migration remain safe.
update public.assessment_snapshots
set state_json = jsonb_set(
  state_json,
  '{active,sphere}',
  to_jsonb('self_development'::text),
  false
)
where state_json->'active'->>'sphere' = 'self-development';

commit;
