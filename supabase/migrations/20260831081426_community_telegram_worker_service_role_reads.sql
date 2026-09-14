begin;
grant select on table public.dc_artifacts to service_role;
grant select on table public.dc_artifact_media to service_role;
grant select on table public.profiles to service_role;
commit;;
