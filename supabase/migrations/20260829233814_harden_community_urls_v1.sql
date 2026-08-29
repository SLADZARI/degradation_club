-- Dementor Club Community v1 — URL hardening
-- Mirrors live Supabase migration 20260829233814 / harden_community_urls_v1.
-- Only http(s) URLs may be persisted for Community Artifacts and external member identities.

alter table public.dc_artifacts
  drop constraint if exists dc_artifacts_external_url_check;

alter table public.dc_artifacts
  add constraint dc_artifacts_external_url_check
  check (
    external_url is null
    or (
      char_length(external_url) <= 1000
      and external_url ~* '^https?://'
    )
  );

alter table public.dc_member_external_identities
  drop constraint if exists dc_member_external_identities_url_length_check;

alter table public.dc_member_external_identities
  drop constraint if exists dc_member_external_identities_url_check;

alter table public.dc_member_external_identities
  add constraint dc_member_external_identities_url_check
  check (
    url is null
    or (
      char_length(url) <= 1000
      and url ~* '^https?://'
    )
  );
