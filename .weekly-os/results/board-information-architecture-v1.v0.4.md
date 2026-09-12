---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G6A_VALIDATION
status: ACTIVE
version: 0.4
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.3
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
integrationBranch: agent/board-information-architecture-v1
productionBaseCommit: fe7a86a024f1c316c93b800ba66e70933082e927
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: true
---

# MP | Dementor Club | BUILD | Board Information Architecture v1 | Result v0.4

## Goal
Implement the approved Board Information Architecture v1 without parallel Board/entity/history/relation owners.

## Status
**ACTIVE / G6A VALIDATION — BATCH A DATABASE APPLIED, CODE NOT RELEASED**

Batch A implementation remains on:

`agent/board-information-architecture-v1`

Production code baseline remains:

`dementor-club-production@fe7a86a024f1c316c93b800ba66e70933082e927`

## Explicit owner authorization

On 2026-09-12 the project owner explicitly authorized **production database mutation for this Result**, with instruction to minimize risk.

This authorization does **not** authorize:

- merge into `dementor-club-production`;
- production site deploy;
- unrelated database changes;
- Batch B/C/D database mutation outside their validated scope.

## Batch A production database state

Applied to live Supabase project `mmekfydwbvptbdatwitj`:

1. `board_information_architecture_batch_a`;
2. `board_information_architecture_batch_a_security_hardening`.

Tracked sources:

- `supabase/migrations/20260912131000_board_information_architecture_batch_a.sql`;
- `supabase/migrations/20260912141500_board_information_architecture_batch_a_security_hardening.sql`.

Lifecycle normalizer was invoked once after migration and normalized exactly 3 stale Community Artifacts from stored `active` to `expired`.

Exact preflight IDs are recorded in:

- `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_PRODUCTION_DB_VALIDATION_2026-09-12.md`.

## Runtime validation completed

Production DB runtime evidence now confirms:

- Authenticated Guest current + full Community history read works;
- expired Artifact detail opens through the Guest-safe RPC;
- canonical entity projection RPC returns confirmed Event/Program projections;
- Guest historical interest toggle succeeds in a transaction and leaves no row after rollback;
- historical Guest response remains rejected and leaves no test row;
- active Member historical reaction INSERT passes inside a transaction and leaves no row after rollback;
- anonymous execution of `dc_guest_board_read_v1()` is revoked;
- authenticated execution remains granted.

Post-DDL Supabase security advisor found one new anon SECURITY DEFINER execute warning. It was corrected immediately by the tracked security-hardening migration. Remaining advisor findings are pre-existing/intentional patterns and are not silently expanded into this Result.

## CI evidence

Pre-DB application:

- Site Integrity / Release Readiness `#940` — **PASS**;
- includes Board Batch A contract, build/syntax, Board fullscreen browser matrix, Workspace recovery, My Artifacts history, WebKit, route manifest and production release gate.

After production DB validation, the integration branch gained:

- tracked security hardening migration;
- contract assertion for authenticated-only Guest Board read;
- production DB validation evidence.

A follow-up CI run on that exact head is required before closing G6A.

## Batch A implementation scope

Database/runtime:

- lifecycle normalizer;
- persistent Artifact history read;
- Guest/Applicant historical read;
- historical Guest interests;
- historical Member reactions;
- frozen new responses on history;
- Guest-safe Artifact detail/media access;
- Board-safe canonical entity projections.

Frontend owners extended:

- `community/board/board-entry-v2.js`;
- `community/board/board.js`;
- `community/artifact/artifact.js`;
- `community/board/board-integrations-v1.js`.

Existing spatial owners remain unchanged.

## Explicitly not changed yet

- Artifact subtypes;
- approved final filter taxonomy;
- generic relation owner/UI;
- Person↔Entity participation UI;
- board-hide;
- continuous visual-aging formula;
- persisted-coordinate schema;
- drag compatibility/livefix ownership.

## G6A exit condition

G6A may close when all of the following are true:

1. follow-up CI on the exact post-hardening integration head is green;
2. production DB evidence remains internally consistent after post-migration reads;
3. no new actionable security advisor finding attributable to Batch A remains unresolved;
4. no persistent test rows remain from validation transactions;
5. production merge/deploy remain separately gated.

## Evidence

- `operations/BOARD_INFORMATION_ARCHITECTURE_G2_INVENTORY_2026-09-12.md`;
- `operations/BOARD_INFORMATION_ARCHITECTURE_G2_CLOSURE_2026-09-12.md`;
- `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_PLAN_2026-09-12.md`;
- `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_VALIDATION_FREE_PATH_2026-09-12.md`;
- `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_PRODUCTION_DB_VALIDATION_2026-09-12.md`;
- draft PR `#145`.

## Authorization state

- integration-branch implementation: **authorized / active**;
- live database mutation for validated Batch A scope: **authorized / applied**;
- production merge: **false**;
- production deploy: **false**.

`Commit ≠ merge ≠ deploy.`
