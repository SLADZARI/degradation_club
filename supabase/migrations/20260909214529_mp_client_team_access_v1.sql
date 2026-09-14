create or replace function public.mp_accept_client_team_invite(
  p_user_id uuid,
  p_project_key text,
  p_source_ref text default 'weekly-os.result.client-team-access'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_project_id uuid;
  v_existing public.mp_project_assignments%rowtype;
  v_team_count integer;
begin
  select id into v_project_id
  from public.mp_project_refs
  where project_key = trim(p_project_key)
  limit 1;

  if v_project_id is null then
    raise exception 'project_not_found';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_project_id::text, 0));

  select * into v_existing
  from public.mp_project_assignments
  where project_id = v_project_id
    and user_id = p_user_id
    and role = 'CLIENT'
  limit 1;

  if found
     and v_existing.relation = 'OWNER'
     and v_existing.access_profile = 'OWNER'
     and v_existing.status = 'ACTIVE'
     and (v_existing.valid_to is null or v_existing.valid_to > now()) then
    raise exception 'owner_assignment_protected';
  end if;

  select count(*) into v_team_count
  from public.mp_project_assignments a
  where a.project_id = v_project_id
    and a.role = 'CLIENT'
    and a.relation = 'CONTRIBUTOR'
    and a.access_profile = 'TEAM'
    and a.status in ('ACTIVE', 'INVITED')
    and (a.valid_to is null or a.valid_to > now())
    and a.user_id <> p_user_id;

  if v_team_count >= 5 then
    raise exception 'team_limit_reached';
  end if;

  insert into public.mp_system_memberships (user_id, system_role, status, valid_to, source_ref)
  values (p_user_id, 'CLIENT', 'ACTIVE', null, p_source_ref)
  on conflict (user_id, system_role)
  do update set status = 'ACTIVE', valid_to = null, source_ref = excluded.source_ref;

  insert into public.mp_project_assignments (
    project_id, user_id, role, relation, status, source_ref, confidence, valid_to, access_profile, capability_overrides
  )
  values (
    v_project_id, p_user_id, 'CLIENT', 'CONTRIBUTOR', 'ACTIVE', p_source_ref, 'CONFIRMED', null, 'TEAM', '{}'::jsonb
  )
  on conflict (project_id, user_id, role)
  do update set
    relation = 'CONTRIBUTOR',
    status = 'ACTIVE',
    source_ref = excluded.source_ref,
    confidence = 'CONFIRMED',
    valid_to = null,
    access_profile = 'TEAM',
    capability_overrides = '{}'::jsonb;

  return v_project_id;
end;
$$;

revoke all on function public.mp_accept_client_team_invite(uuid, text, text) from public, anon, authenticated;
grant execute on function public.mp_accept_client_team_invite(uuid, text, text) to service_role;

create or replace function public.mp_revoke_client_team_assignment(
  p_actor_user_id uuid,
  p_project_key text,
  p_assignment_id uuid,
  p_source_ref text default 'weekly-os.result.client-team-access'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_project_id uuid;
  v_can_manage boolean;
  v_revoked_id uuid;
begin
  select id into v_project_id
  from public.mp_project_refs
  where project_key = trim(p_project_key)
  limit 1;

  if v_project_id is null then
    raise exception 'project_not_found';
  end if;

  select (
    exists (
      select 1
      from public.mp_project_assignments a
      where a.project_id = v_project_id
        and a.user_id = p_actor_user_id
        and a.role = 'CLIENT'
        and a.relation = 'OWNER'
        and a.access_profile = 'OWNER'
        and a.status = 'ACTIVE'
        and (a.valid_to is null or a.valid_to > now())
    )
    or exists (
      select 1
      from public.mp_system_memberships m
      where m.user_id = p_actor_user_id
        and m.system_role = 'PLATFORM_OWNER'
        and m.status = 'ACTIVE'
        and (m.valid_to is null or m.valid_to > now())
    )
  ) into v_can_manage;

  if not coalesce(v_can_manage, false) then
    raise exception 'team_manage_forbidden';
  end if;

  update public.mp_project_assignments a
  set status = 'REVOKED', valid_to = now(), source_ref = p_source_ref
  where a.id = p_assignment_id
    and a.project_id = v_project_id
    and a.role = 'CLIENT'
    and a.relation = 'CONTRIBUTOR'
    and a.access_profile = 'TEAM'
    and a.status in ('ACTIVE', 'INVITED')
  returning a.id into v_revoked_id;

  if v_revoked_id is null then
    raise exception 'team_assignment_not_found';
  end if;

  return v_revoked_id;
end;
$$;

revoke all on function public.mp_revoke_client_team_assignment(uuid, text, uuid, text) from public, anon, authenticated;
grant execute on function public.mp_revoke_client_team_assignment(uuid, text, uuid, text) to service_role;

create or replace function public.mp_list_client_project_team(p_project_key text)
returns table (
  assignment_id uuid,
  user_id uuid,
  email text,
  relation text,
  access_profile text,
  status text,
  valid_to timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    a.id,
    a.user_id,
    u.email::text,
    a.relation,
    a.access_profile,
    a.status,
    a.valid_to
  from public.mp_project_refs p
  join public.mp_project_assignments a on a.project_id = p.id
  join auth.users u on u.id = a.user_id
  where p.project_key = trim(p_project_key)
    and a.role = 'CLIENT'
    and (
      (a.relation = 'OWNER' and a.access_profile = 'OWNER' and a.status = 'ACTIVE' and (a.valid_to is null or a.valid_to > now()))
      or
      (a.relation = 'CONTRIBUTOR' and a.access_profile = 'TEAM' and a.status in ('ACTIVE', 'INVITED') and (a.valid_to is null or a.valid_to > now()))
    )
  order by case when a.relation = 'OWNER' then 0 else 1 end, lower(u.email), a.created_at;
$$;

revoke all on function public.mp_list_client_project_team(text) from public, anon, authenticated;
grant execute on function public.mp_list_client_project_team(text) to service_role;;
