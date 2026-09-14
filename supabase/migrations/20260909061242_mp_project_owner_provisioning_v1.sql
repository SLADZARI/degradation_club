-- artifactId: weekly-os.architecture.mp-project-owner-provisioning-v1
-- project: weekly-os
-- documentType: ARCHITECTURE
-- projectStage: BUILD
-- gate: G5_BUILD
-- status: DRAFT
-- version: 0.1
-- updated: 2026-09-08
-- owner: Modern Pilgrims
-- sourceSystem: GIT
-- authorityType: IMPLEMENTATION_AUTHORITY
-- supersedes: null
--
-- R2 / Project Ownership Provisioning.
-- COMMITTING THIS FILE DOES NOT APPLY IT TO PRODUCTION SUPABASE.

create or replace function public.mp_provision_project_owner_from_request(
  p_request_id uuid,
  p_project_key text,
  p_source_ref text
)
returns public.mp_project_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_row public.mp_project_requests%rowtype;
  project_row public.mp_project_refs%rowtype;
  next_row public.mp_project_requests%rowtype;
  normalized_project_key text := btrim(coalesce(p_project_key, ''));
  normalized_source_ref text := btrim(coalesce(p_source_ref, ''));
begin
  if not mp_private.current_user_is_mp_owner() then
    raise exception 'project provisioning requires PLATFORM_OWNER'
      using errcode = '42501';
  end if;

  if normalized_project_key = '' or char_length(normalized_project_key) > 160 then
    raise exception 'project_key is required and must be <= 160 characters'
      using errcode = '22023';
  end if;

  if normalized_source_ref = '' or char_length(normalized_source_ref) > 500 then
    raise exception 'source_ref is required and must be <= 500 characters'
      using errcode = '22023';
  end if;

  select *
    into request_row
    from public.mp_project_requests
   where id = p_request_id
   for update;

  if not found then
    raise exception 'project request not found'
      using errcode = 'P0002';
  end if;

  if request_row.request_state <> 'APPROVED' then
    raise exception 'project request must be APPROVED before provisioning: %', request_row.request_state
      using errcode = '22023';
  end if;

  select *
    into project_row
    from public.mp_project_refs
   where project_key = normalized_project_key
   for update;

  if not found then
    insert into public.mp_project_refs (
      project_key,
      name,
      source_ref,
      metadata
    ) values (
      normalized_project_key,
      request_row.project_name,
      normalized_source_ref,
      '{}'::jsonb
    )
    on conflict (project_key) do nothing
    returning * into project_row;

    if project_row.id is null then
      select *
        into project_row
        from public.mp_project_refs
       where project_key = normalized_project_key
       for update;
    end if;
  end if;

  if project_row.id is null then
    raise exception 'project registry row could not be resolved'
      using errcode = 'P0002';
  end if;

  if btrim(coalesce(project_row.source_ref, '')) <> normalized_source_ref then
    raise exception 'existing project source_ref differs; refusing silent repoint'
      using errcode = '22023';
  end if;

  if exists (
    select 1
      from public.mp_project_assignments a
     where a.project_id = project_row.id
       and a.user_id <> request_row.requester_user_id
       and a.role = 'CLIENT'
       and a.status = 'ACTIVE'
       and (a.valid_to is null or a.valid_to > now())
       and (a.relation = 'OWNER' or a.access_profile = 'OWNER')
  ) then
    raise exception 'project already has another active external Owner'
      using errcode = '23505';
  end if;

  insert into public.mp_system_memberships (
    user_id,
    system_role,
    status,
    valid_to,
    source_ref
  ) values (
    request_row.requester_user_id,
    'CLIENT',
    'ACTIVE',
    null,
    'weekly-os.result.project-ownership-provisioning'
  )
  on conflict (user_id, system_role) do update
    set status = 'ACTIVE',
        valid_to = null,
        source_ref = excluded.source_ref;

  insert into public.mp_project_assignments (
    project_id,
    user_id,
    role,
    relation,
    status,
    source_ref,
    confidence,
    valid_to,
    access_profile,
    capability_overrides
  ) values (
    project_row.id,
    request_row.requester_user_id,
    'CLIENT',
    'OWNER',
    'ACTIVE',
    'weekly-os.result.project-ownership-provisioning',
    'CONFIRMED',
    null,
    'OWNER',
    '{}'::jsonb
  )
  on conflict (project_id, user_id, role) do update
    set relation = 'OWNER',
        status = 'ACTIVE',
        source_ref = excluded.source_ref,
        confidence = 'CONFIRMED',
        valid_to = null,
        access_profile = 'OWNER',
        capability_overrides = '{}'::jsonb;

  update public.mp_project_requests
     set request_state = 'PROVISIONED',
         provisioned_project_id = project_row.id,
         updated_at = now()
   where id = p_request_id
  returning * into next_row;

  return next_row;
end;
$$;

revoke all on function public.mp_provision_project_owner_from_request(uuid, text, text) from public;
grant execute on function public.mp_provision_project_owner_from_request(uuid, text, text) to authenticated;

comment on function public.mp_provision_project_owner_from_request(uuid, text, text) is
  'PLATFORM_OWNER-only R2 activation: APPROVED ProjectRequest -> validated registry Project + ACTIVE CLIENT/OWNER assignment + PROVISIONED, atomically. Git/source validation is required by the application boundary before this RPC.';;
