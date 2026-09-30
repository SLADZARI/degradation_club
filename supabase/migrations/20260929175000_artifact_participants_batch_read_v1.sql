-- Board / Media Performance v1 — bounded participant projection.
-- Worker-lane migration only. Do not apply to production from this branch.
-- Extends the existing Artifact Collaboration participation owner; no new state owner.

begin;

create or replace function public.dc_artifact_participants_batch_read_v1(
  p_artifact_ids uuid[]
)
returns table(
  artifact_id uuid,
  profile_id uuid,
  display_name text,
  nickname text,
  avatar_url text,
  participation_state text,
  state_changed_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $function$
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;

  if coalesce(cardinality(p_artifact_ids), 0) > 50 then
    raise exception 'ARTIFACT_BATCH_TOO_LARGE';
  end if;

  return query
  with requested as (
    select
      item.artifact_id,
      min(item.input_order)::bigint as input_order
    from unnest(coalesce(p_artifact_ids, '{}'::uuid[]))
      with ordinality as item(artifact_id, input_order)
    where item.artifact_id is not null
    group by item.artifact_id
  ),
  readable as (
    select
      r.artifact_id,
      r.input_order
    from requested r
    where public.dc_can_read_artifact_v1(r.artifact_id)
  ),
  latest as (
    select distinct on (e.artifact_id, e.profile_id)
      e.artifact_id,
      e.profile_id,
      e.state,
      e.created_at
    from public.dc_artifact_participation_events e
    join readable r on r.artifact_id = e.artifact_id
    order by e.artifact_id, e.profile_id, e.transition_no desc
  )
  select
    r.artifact_id,
    p.id,
    coalesce(
      nullif(btrim(p.display_name),''),
      nullif(btrim(p.nickname),''),
      'Пользователь ' || upper(left(p.id::text,8))
    ),
    nullif(btrim(p.nickname),''),
    p.avatar_url,
    l.state,
    l.created_at
  from readable r
  join latest l on l.artifact_id = r.artifact_id
  join public.profiles p on p.id = l.profile_id
  where l.state in ('INVITED','JOINED')
  order by r.input_order, l.created_at, p.id;
end;
$function$;

revoke all on function public.dc_artifact_participants_batch_read_v1(uuid[])
  from public, anon, authenticated;
grant execute on function public.dc_artifact_participants_batch_read_v1(uuid[])
  to authenticated;

comment on function public.dc_artifact_participants_batch_read_v1(uuid[]) is
  'Bounded Artifact Collaboration participant projection. Up to 50 requested Artifact ids; unreadable/missing ids are omitted. Returns current INVITED/JOINED participants under dc_can_read_artifact_v1 ACL.';

commit;
