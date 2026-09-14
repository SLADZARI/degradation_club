grant update on public.course_enrollments to authenticated;
drop policy if exists course_enrollments_auth_insert on public.course_enrollments;
create policy course_enrollments_auth_insert on public.course_enrollments for insert to authenticated with check (profile_id = auth.uid() and status in ('applied','in_progress','completed'));
drop policy if exists course_enrollments_update_own on public.course_enrollments;
create policy course_enrollments_update_own on public.course_enrollments for update to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid() and status in ('applied','in_progress','completed'));