create or replace function mp_private.current_user_has_mp_portfolio_visibility()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.mp_system_memberships m
    where m.user_id = auth.uid()
      and m.system_role in ('PLATFORM_OWNER', 'TEAM_MEMBER')
      and m.status = 'ACTIVE'
      and (m.valid_to is null or m.valid_to > now())
  );
$$;

revoke all on function mp_private.current_user_has_mp_portfolio_visibility() from public;
grant execute on function mp_private.current_user_has_mp_portfolio_visibility() to authenticated;

create or replace function mp_private.current_user_is_assigned_to_project(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select mp_private.current_user_is_mp_member()
    and exists (
      select 1
      from public.mp_project_assignments a
      where a.project_id = p_project_id
        and a.user_id = auth.uid()
        and a.status = 'ACTIVE'
        and (a.valid_to is null or a.valid_to > now())
    );
$$;

revoke all on function mp_private.current_user_is_assigned_to_project(uuid) from public;
grant execute on function mp_private.current_user_is_assigned_to_project(uuid) to authenticated;

drop policy if exists mp_project_refs_select on public.mp_project_refs;

create policy mp_project_refs_select
on public.mp_project_refs
for select
to authenticated
using (
  mp_private.current_user_has_mp_portfolio_visibility()
  or mp_private.current_user_is_assigned_to_project(id)
);;
