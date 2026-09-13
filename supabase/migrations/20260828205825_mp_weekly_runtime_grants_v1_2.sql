begin;

revoke all on table public.mp_system_memberships from anon;
revoke all on table public.mp_project_refs from anon;
revoke all on table public.mp_project_assignments from anon;
revoke all on table public.mp_reports from anon;
revoke all on table public.mp_report_recipients from anon;
revoke all on table public.mp_report_items from anon;
revoke all on table public.mp_spore_awards from anon;
revoke all on table public.mp_spore_events from anon;
revoke all on table public.mp_spore_attributions from anon;

revoke all on table public.mp_system_memberships from authenticated;
revoke all on table public.mp_project_refs from authenticated;
revoke all on table public.mp_project_assignments from authenticated;
revoke all on table public.mp_reports from authenticated;
revoke all on table public.mp_report_recipients from authenticated;
revoke all on table public.mp_report_items from authenticated;
revoke all on table public.mp_spore_awards from authenticated;
revoke all on table public.mp_spore_events from authenticated;
revoke all on table public.mp_spore_attributions from authenticated;

grant select, insert, update, delete on table public.mp_system_memberships to authenticated;
grant select, insert, update, delete on table public.mp_project_refs to authenticated;
grant select, insert, update, delete on table public.mp_project_assignments to authenticated;
grant select, insert, update, delete on table public.mp_reports to authenticated;
grant select, insert, update, delete on table public.mp_report_recipients to authenticated;
grant select, insert, update, delete on table public.mp_report_items to authenticated;
grant select, insert, update on table public.mp_spore_awards to authenticated;
grant select, insert on table public.mp_spore_events to authenticated;
grant select, insert, update, delete on table public.mp_spore_attributions to authenticated;

commit;