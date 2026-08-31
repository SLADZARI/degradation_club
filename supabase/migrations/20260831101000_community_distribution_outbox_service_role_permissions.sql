-- Restore backend worker access to the Community distribution outbox.
-- Direct browser roles remain denied; only service_role gets DML.

begin;

grant select, insert, update, delete on table public.dc_distribution_outbox to service_role;
revoke all on table public.dc_distribution_outbox from public, anon, authenticated;

commit;
