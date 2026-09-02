-- DEMENTOR CLUB / MEMBERSHIP V2 PRODUCTION CUTOVER
-- DO NOT RUN BEFORE the dementor-club-site v2 application/review UI is deployed.
-- Purpose: remove the legacy automatic admission and direct application-insert paths.

begin;

-- 1. The v1 RPC automatically activates membership after 9/9 and bypasses Dementor Review v2.
revoke execute on function public.dc_activate_membership_v1(text,text,text,text,text,text,text) from authenticated;
revoke execute on function public.dc_activate_membership_v1(text,text,text,text,text,text,text) from anon;
revoke execute on function public.dc_activate_membership_v1(text,text,text,text,text,text,text) from public;

-- 2. Applications must be created through dc_submit_membership_application_v2(),
-- which performs the server-side 9/9 gate and creates the immutable Candidate Snapshot.
drop policy if exists join_applications_auth_insert on public.join_applications;
revoke insert on public.join_applications from authenticated;

commit;

-- POST-CUTOVER VERIFICATION
-- select grantee, privilege_type
-- from information_schema.routine_privileges
-- where routine_schema='public' and routine_name='dc_activate_membership_v1';
--
-- select grantee, privilege_type
-- from information_schema.role_table_grants
-- where table_schema='public' and table_name='join_applications' and grantee='authenticated';
