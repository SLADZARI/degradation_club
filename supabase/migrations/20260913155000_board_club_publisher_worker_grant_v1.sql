-- Telegram delivery resolves the public publisher identity with service_role only.
-- Browser roles retain zero direct table access.

begin;

revoke all on table public.dc_artifact_publisher_overrides from public, anon, authenticated;
grant select on table public.dc_artifact_publisher_overrides to service_role;

commit;
