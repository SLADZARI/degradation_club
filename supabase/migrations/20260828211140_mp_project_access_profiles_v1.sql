alter table public.mp_project_assignments
  add column if not exists access_profile text not null default 'INTERNAL'
    check (access_profile in ('INTERNAL','OWNER','DECISION','TEAM','OBSERVER')),
  add column if not exists capability_overrides jsonb not null default '{}'::jsonb;

create or replace function mp_private.current_user_can_manage_mp_project(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select mp_private.current_user_is_mp_owner()
    or exists (
      select 1
      from public.mp_project_assignments a
      where a.project_id = p_project_id
        and a.user_id = auth.uid()
        and a.status = 'ACTIVE'
        and a.access_profile = 'OWNER'
        and (a.valid_to is null or a.valid_to > now())
    );
$$;

revoke all on function mp_private.current_user_can_manage_mp_project(uuid) from public;
grant execute on function mp_private.current_user_can_manage_mp_project(uuid) to authenticated;

drop policy if exists mp_assignments_select on public.mp_project_assignments;
create policy mp_assignments_select on public.mp_project_assignments
for select to authenticated
using (
  user_id = auth.uid()
  or mp_private.current_user_is_mp_owner()
  or mp_private.current_user_can_manage_mp_project(project_id)
);
