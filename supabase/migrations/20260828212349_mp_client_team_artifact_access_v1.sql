create or replace function mp_private.current_user_manages_project(p_project_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.mp_project_assignments a
    where a.project_id = p_project_id
      and a.user_id = auth.uid()
      and a.status = 'ACTIVE'
      and a.access_profile = 'OWNER'
      and (a.valid_to is null or a.valid_to > now())
  ) or mp_private.current_user_is_mp_owner();
$$;

revoke all on function mp_private.current_user_manages_project(uuid) from public;
grant execute on function mp_private.current_user_manages_project(uuid) to authenticated;

create table if not exists public.mp_project_artifact_access (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.mp_project_refs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  artifact_key text not null,
  permission text not null check (permission in ('VIEW','COMMENT','EDIT','DECIDE')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE','REVOKED')),
  granted_by uuid references auth.users(id),
  source_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, user_id, artifact_key, permission)
);

alter table public.mp_project_artifact_access enable row level security;

drop policy if exists mp_assignments_select on public.mp_project_assignments;
create policy mp_assignments_select on public.mp_project_assignments for select to authenticated
using (
  user_id = auth.uid()
  or mp_private.current_user_is_mp_owner()
  or mp_private.current_user_manages_project(project_id)
);

drop policy if exists mp_project_artifact_access_select on public.mp_project_artifact_access;
create policy mp_project_artifact_access_select on public.mp_project_artifact_access for select to authenticated
using (
  user_id = auth.uid()
  or mp_private.current_user_manages_project(project_id)
);

drop policy if exists mp_project_artifact_access_manage on public.mp_project_artifact_access;
create policy mp_project_artifact_access_manage on public.mp_project_artifact_access for all to authenticated
using (mp_private.current_user_manages_project(project_id))
with check (mp_private.current_user_manages_project(project_id));

grant select, insert, update, delete on public.mp_project_artifact_access to authenticated;
revoke all on public.mp_project_artifact_access from anon;