-- Dementor Club Membership Review v2 hardening
-- Remote migration version: 20260902131415

alter table public.dc_membership_review_policies enable row level security;
revoke all on public.dc_membership_review_policies from anon, authenticated;
grant all on public.dc_membership_review_policies to service_role;

create policy dc_membership_review_policies_no_client_access
on public.dc_membership_review_policies
for select
to authenticated
using (false);

create policy dc_membership_notification_outbox_no_client_access
on public.dc_membership_notification_outbox
for select
to authenticated
using (false);

comment on table public.dc_membership_review_policies is 'Server-owned Membership Review v2 admission threshold policy';
