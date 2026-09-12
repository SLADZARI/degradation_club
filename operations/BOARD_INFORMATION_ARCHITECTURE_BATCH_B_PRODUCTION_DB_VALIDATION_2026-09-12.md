---
artifactId: dementor-club.evidence.board-information-architecture-batch-b-production-db-validation-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G6B_VALIDATION
status: APPROVED_EVIDENCE
version: 1.1
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
integrationBranch: agent/board-information-architecture-v1
productionDatabaseProject: mmekfydwbvptbdatwitj
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: true
---

# Board Information Architecture v1 — Batch B production DB validation

## Scope and authorization

Project owner explicitly authorized production DB mutation for the active Board Result on 2026-09-12 with instruction to minimize risk.

Batch B extends the existing `public.dc_artifacts.artifact_type` owner in place. No publication/content table, membership state or slot owner was added.

Production code merge/deploy remain unauthorized.

## Preflight

Before mutation:

- 8 total Artifact rows;
- all 8 had `artifact_type='notice'`;
- no draft rows existed;
- `dc_artifacts_type_check` allowed only `notice`;
- table-level `artifact_type` default was legacy `'notice'`;
- no DB dependents were found on the current `dc_create_artifact_draft_v1` or `dc_update_artifact_draft_v1` signatures.

Exact preflight Artifact IDs:

- `61b869a5-c0ff-4d27-bc0e-a8ae258d946e`;
- `f35172d6-4870-439a-a108-bbeab285b6ee`;
- `d8354552-b821-4f1d-a29d-211b32f62f66`;
- `72a93f0e-7000-44b6-823b-14624385d01d`;
- `e2e9d99e-b2e5-4392-9a3d-695f7cb69a61`;
- `378e1692-12e5-4db4-95ae-26d1c778153c`;
- `d0d79a2f-6f14-475f-9af0-f21b4f7e604d`;
- `42b71eab-aa58-490e-9d7d-ff866c5792f9`.

## CI evidence

Site Integrity / Release Readiness run `#953` passed before the production subtype migration.

Site Integrity / Release Readiness run `#954` passed on the subsequent Batch B integration head after the default-hardening file and production evidence were tracked.

Passed checks include:

- legacy Board access/security contracts;
- Board v2.1 fullscreen contract;
- Batch A contract;
- Batch B contract;
- production candidate build;
- built JavaScript syntax;
- Board fullscreen browser role-state matrix;
- Workspace recovery;
- My Artifacts history;
- WebKit regression;
- route manifest and production artifact release gate.

## Applied production DB migrations

### 1. Canonical subtype migration

Applied successfully:

`board_information_architecture_batch_b_subtypes`

Tracked source:

`supabase/migrations/20260912143000_board_information_architecture_batch_b_subtypes.sql`

Effects:

1. legacy `notice` values updated in-place to `announcement`;
2. `dc_artifacts_type_check` now allows only `announcement`, `post`, `idea`, `request`;
3. existing create-draft RPC/signature remains canonical and persists new drafts as `announcement`;
4. narrow `dc_set_artifact_subtype_v1(uuid,text)` added for the existing canonical composer;
5. publish/slot/membership RPC ownership was not rewritten.

No Artifact ID/history/position/reaction/response row was recreated.

### 2. Table-default hardening

Pre-hardening read-only check showed the table-level default still remained legacy `'notice'` even after the subtype constraint had changed.

Applied successfully:

`board_information_architecture_batch_b_default_hardening`

Tracked source:

`supabase/migrations/20260912144500_board_information_architecture_batch_b_default_hardening.sql`

Effect is limited to:

`dc_artifacts.artifact_type DEFAULT 'announcement'`

No existing row is rewritten by this hardening migration.

Post-hardening verification:

- table default: `'announcement'`;
- 8 total persisted Artifacts remain `announcement`;
- 0 non-announcement persisted historical rows;
- 0 draft rows.

## Runtime validation

Post-migration production state:

- 8 total Artifacts;
- 8 `announcement`;
- 0 drafts;
- 0 `post/idea/request` persisted during migration.

Constraint verified as:

`artifact_type IN ('announcement','post','idea','request')`.

### Member draft/subtype transaction

Using an existing active Member profile inside an explicit transaction:

1. `dc_create_artifact_draft_v1(...)` created a test draft with subtype `announcement`;
2. `dc_set_artifact_subtype_v1(...,'post')` changed the same draft to `post`;
3. readback returned `artifact_type='post'`, `status='draft'`;
4. transaction was rolled back;
5. follow-up query confirmed `rollback_test_rows = 0`.

### Permission checks

For `dc_set_artifact_subtype_v1(uuid,text)`:

- anonymous EXECUTE: `false`;
- authenticated EXECUTE: `true`.

Authenticated Guest/non-member did not gain draft subtype write authority.

Invalid subtype remained rejected by the RPC/constraint path in rollback-safe validation.

## Security advisor

The subtype RPC belongs to the existing class of intentional authenticated SECURITY DEFINER Board commands. Its body enforces authenticated identity, active Membership or Owner Admin, approved subtype vocabulary, caller ownership and `status='draft'` only.

No new anonymous subtype authority was introduced.

## Rollback boundary

A broad `announcement → notice` rollback is unsafe after new canonical writes begin because new announcements become indistinguishable from migrated legacy rows.

If immediate rollback were ever required, use the exact eight preflight IDs above plus coordinated restoration of the old create RPC/constraint/default. Prefer forward correction after new subtype writes exist.

## Batch B factual closure

Batch B taxonomy/filter implementation is present on `agent/board-information-architecture-v1` and CI-validated.

Production DB subtype semantics and table default are now aligned with the canonical vocabulary.

Production frontend is still not merged/deployed.

This evidence closes the factual Batch B DB state required before the approved Board Telegram Promotion pre-release batch.

`Commit ≠ merge ≠ deploy.`
