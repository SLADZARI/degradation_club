drop policy if exists join_applications_anon_insert on public.join_applications;
revoke insert on table public.join_applications from anon;
drop policy if exists join_applications_auth_insert on public.join_applications;
create policy join_applications_auth_insert on public.join_applications for insert to authenticated with check (profile_id = (select auth.uid()) and status = 'submitted' and reviewed_at is null);
create unique index if not exists join_applications_one_submitted_per_profile_idx on public.join_applications(profile_id) where profile_id is not null and status = 'submitted';