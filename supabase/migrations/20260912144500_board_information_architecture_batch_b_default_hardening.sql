-- Board Information Architecture v1 — Batch B default hardening.
-- Keep the table-level default aligned with the canonical subtype vocabulary.

begin;

alter table public.dc_artifacts
  alter column artifact_type set default 'announcement';

commit;
