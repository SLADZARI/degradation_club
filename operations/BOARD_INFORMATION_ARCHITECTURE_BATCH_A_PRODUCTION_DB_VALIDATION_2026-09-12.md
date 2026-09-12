---
artifactId: dementor-club.evidence.board-information-architecture-batch-a-production-db-validation-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G6A_VALIDATION
status: EVIDENCE
version: 1.0
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

# Board Information Architecture v1 — Batch A production DB validation

## Authorization

Project owner explicitly authorized production database mutation on 2026-09-12 with instruction to minimize risk.

This authorization covered the Batch A database migration and targeted validation only. It did **not** authorize production code merge or site deployment.

## Risk controls used

- no paid Supabase branch was created;
- the tracked migration was reviewed against the live schema before application;
- the migration was applied through the migration API as one transaction-scoped DDL unit;
- exact stale lifecycle rows were inventoried before normalization;
- write-path validation used explicit transactions followed by `ROLLBACK` wherever possible;
- no synthetic membership, role, Artifact slot or canonical entity data was created;
- post-DDL security advisors were checked immediately;
- one advisor finding caused an immediate narrow corrective migration rather than broader security refactoring.

## Preflight lifecycle snapshot

Three Community Artifacts were stored as `active` even though `expires_at <= now()`:

- `72a93f0e-7000-44b6-823b-14624385d01d` — expires `2026-08-31 15:28:00+00`;
- `378e1692-12e5-4db4-95ae-26d1c778153c` — expires `2026-09-09 16:13:00+00`;
- `42b71eab-aa58-490e-9d7d-ff866c5792f9` — expires `2026-09-10 10:29:00+00`.

No database dependents were found on the old zero-argument `dc_guest_board_read_v1()` function, so its required drop/recreate return-shape migration had no DB dependency blocker.

Historical response INSERT policies were confirmed to require current `active` targets, preserving the approved response freeze on history.

## Applied migrations

Applied successfully to production Supabase:

1. `board_information_architecture_batch_a`
   - source: `supabase/migrations/20260912131000_board_information_architecture_batch_a.sql`;
   - lifecycle normalizer;
   - Guest/Applicant current + history Board read;
   - historical Guest interest toggle;
   - historical Member reaction INSERT authorization;
   - Guest-safe Artifact detail read;
   - narrow Guest Board media helper/policy;
   - canonical entity projection read RPC.

2. `board_information_architecture_batch_a_security_hardening`
   - source: `supabase/migrations/20260912141500_board_information_architecture_batch_a_security_hardening.sql`;
   - revokes PUBLIC execution from `dc_guest_board_read_v1()` and grants it only to `authenticated`.

## Lifecycle normalization evidence

After the Batch A migration, the lifecycle normalizer was invoked exactly once.

Result:

`normalized_count = 3`

The three preflight rows now store `status='expired'`; their `expires_at` and `closed_at` meanings were preserved.

No broad `expired → active` rollback was performed or authorized.

## Authenticated Guest runtime evidence

Production profile used for scoped read validation:

`modernpilgrimsteam@gmail.com`

Validated state at test time:

- authenticated profile exists;
- `membership_active = false`;
- `owner_admin = false`.

Using `SET LOCAL ROLE authenticated` plus that profile claim inside explicit transactions:

- `dc_guest_board_read_v1()` returned all 8 published Community historical Artifacts visible under the approved Board history model;
- returned lifecycle included `expired` and `archived` records;
- `dc_guest_board_artifact_detail_read_v1()` opened an expired Artifact and returned its Board-safe author/media payload;
- `dc_board_entity_projection_read_v1()` returned confirmed canonical event/program projections;
- `dc_guest_board_interest_toggle_v1()` successfully toggled interest on an expired Artifact inside a transaction, then `ROLLBACK` restored zero persisted test rows;
- historical Guest response submission was exercised in a rollback-safe negative test and remained rejected;
- verification query confirmed no `history-negative-test` response row persisted.

## Member historical reaction evidence

A production active Member profile with no existing reaction on the selected expired Artifact was used inside an explicit transaction.

An `interested` reaction INSERT on the expired Artifact passed the new RLS policy.

The transaction was rolled back and a verification query confirmed zero persisted test reaction rows.

## Security advisor evidence

Immediately after the first migration, Supabase security advisor reported one new actionable warning:

`anon_security_definer_function_executable` for `public.dc_guest_board_read_v1()`.

Cause: drop/recreate restored PostgreSQL's default PUBLIC execute grant.

Correction applied immediately through the tracked hardening migration.

Post-correction verification:

- `anon_can_execute = false`;
- `authenticated_can_execute = true`;
- the anon SECURITY DEFINER advisor finding disappeared.

Remaining advisor items are pre-existing or intentional authenticated RPC exposure patterns and are **not** silently promoted into this Result's scope. In particular, `dc_guest_board_interests` remains RLS-enabled with no direct policies because Guest writes are owned by the canonical SECURITY DEFINER RPC path rather than direct table access.

Supabase remediation reference for the corrected finding:

https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable

## CI evidence before DB mutation

Integration branch CI was green before production DB mutation:

- Site Integrity / Release Readiness run `#940` — PASS;
- includes Board Information Architecture Batch A contract, build, JavaScript syntax, Board fullscreen browser state matrix, Workspace recovery, My Artifacts history, WebKit regression, route manifest and production artifact release gate.

A follow-up CI run is required after the tracked hardening migration and contract-test extension.

## Current boundary

Validated/applied:

- Batch A database contract;
- lifecycle normalization;
- Guest historical read/detail;
- historical reactions;
- historical response freeze;
- canonical entity projection read;
- Guest Board media authorization helper;
- anon-execute hardening.

Not authorized / not performed by this evidence:

- merge into `dementor-club-production`;
- production site deploy;
- Batch B filters/subtypes implementation;
- Batch C relations;
- Batch D board-hide/continuous aging;
- declaring the full Board Result DONE or RELEASED.

`Commit ≠ merge ≠ deploy.`
