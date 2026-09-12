---
artifactId: dementor-club.evidence.board-information-architecture-batch-a-validation-free-path-2026-09-12
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G6A_VALIDATION
status: EVIDENCE
version: 1.0
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
---

# Board Information Architecture v1 — Batch A validation / free path

No paid Supabase development branch is used. No production merge, deploy, or live database mutation is authorized by this validation pass.

## Candidate
- integration branch: `agent/board-information-architecture-v1`
- production baseline: `dementor-club-production@fe7a86a024f1c316c93b800ba66e70933082e927`
- draft PR: `#145`
- validated code head: `4b65d11cfeb4faa173a8a90c557a00d583ead39b`

## CI evidence
GitHub Actions `Site Integrity / Release Readiness` run `#935` / run id `34691587246` completed successfully.

Passed: registry/routes/feature state, page readiness, visual contract, DC-9 baseline and sync, Membership semantic authority, Board v2 security/interaction, Board v2.1 fullscreen contract, production candidate build, analytics/consent, canonical shell, JS syntax, Google OAuth handoff, browser smoke, public harmonization matrix, DC-9 cross-device recovery, Board fullscreen browser state matrix, Workspace recovery, My Artifacts history, WebKit auth regression, production route manifest, release gate.

The previous CI failure was caused by use of `.not(...)` in the new Board query while the existing browser QA Supabase stub did not implement that builder method. The query was rewritten without semantic expansion and run #935 passed.

## Read-only production compatibility audit
Production Supabase was inspected using SELECT/catalog queries only; no DDL/DML was executed.

Confirmed every table/column used by Batch A migration exists, including Artifact lifecycle/history fields, Board positions, Guest interests, reactions/responses/media, and canonical entity/event/program projection fields.

Confirmed:
- `dc_guest_board_interests` unique `(artifact_id, profile_id)`;
- `dc_artifact_reactions` unique `(artifact_id, profile_id, reaction_type)` and `interested` constraint;
- `dc_membership_active(p_profile_id uuid DEFAULT auth.uid())` and `dc_is_owner_admin(p_profile_id uuid DEFAULT auth.uid())` are compatible with zero-argument calls used by the migration;
- current `dc_guest_board_read_v1()` is SECURITY DEFINER and has no database dependency blocking drop/recreate;
- current reaction INSERT RLS is live-only, while reaction SELECT and Member Artifact/media reads already include `active/expired/archived`, matching the intended migration delta;
- Community Artifact Storage currently has Member/Owner SELECT only, so the narrow Guest media helper/policy is a real required delta.

## Validation boundary
- frontend/build/browser compatibility: PASS;
- production-schema dependency compatibility by read-only introspection: PASS;
- static destructive/dependency hazards: PASS after corrections;
- actual migration execution on an isolated Postgres clone: NOT PERFORMED;
- live production migration: NOT AUTHORIZED / NOT PERFORMED.

This free path is sufficient to continue preparing Batch A. The migration remains an explicit release-time step requiring separate authorization, immediate live smoke/retest, and rollback readiness.

`Commit ≠ merge ≠ deploy.`
