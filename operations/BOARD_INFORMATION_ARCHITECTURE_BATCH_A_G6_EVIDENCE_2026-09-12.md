---
artifactId: dementor-club.evidence.board-information-architecture-batch-a-g6-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G6A_VALIDATION
status: PARTIAL_PASS_DB_RUNTIME_PENDING
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
branch: agent/board-information-architecture-v1
productionBaseline: fe7a86a024f1c316c93b800ba66e70933082e927
pullRequest: 145
validationRun: 935
validationRunId: 34691587246
---

# Board Information Architecture v1 — Batch A G6 evidence

## Status

**PARTIAL PASS — integration/build/browser regression PASS; database runtime contract validation remains pending.**

This document is evidence for Batch A only. It does not authorize a production merge, deployment, or live Supabase migration.

## Candidate

Integration branch:

`agent/board-information-architecture-v1`

Validation candidate head after corrective commit:

`4b65d11cfeb4faa173a8a90c557a00d583ead39b`

Draft validation PR:

`#145 — Board Information Architecture v1 — Batch A validation candidate`

Base:

`dementor-club-production@fe7a86a024f1c316c93b800ba66e70933082e927`

## Validation chain

### Run 934 — FAIL, diagnosed and corrected

The first validation run reached the Board fullscreen browser matrix and failed before Member card rendering.

Root cause was not the approved Board semantic model. The new Member history query used Supabase `.not(...)`, while the existing Board browser QA stub did not implement that query method. The result was a test-runtime incompatibility before `.dc-notice [data-reaction]` could render.

Correction:

- removed the additional `.not('published_at','is',null)` query-chain dependency from `community/board/board.js`;
- retained the intended published-only invariant by filtering returned history rows client-side on `published_at`;
- no permission, lifecycle, entity-owner, spatial-owner, or production behavior was broadened by the correction.

Corrective commit:

`4b65d11cfeb4faa173a8a90c557a00d583ead39b`

### Run 935 — PASS

GitHub Actions run:

`34691587246` / Site Integrity run `#935`

All workflow stages passed, including:

- registry/routes/feature state;
- page content readiness;
- visual contract;
- DC-9 immutable baseline;
- DC-9 account sync integrity;
- Membership semantic authority;
- Board v2 security and interaction contract;
- Board v2.1 fullscreen composition contract;
- production-candidate build;
- analytics/consent;
- canonical shell integration;
- built JavaScript syntax;
- Google OAuth handoff;
- public harmonization browser matrix;
- DC-9 cross-device browser recovery;
- Board v2.1 fullscreen browser state matrix;
- browser shell and Workspace recovery;
- My Artifacts history;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

This provides regression evidence that the Batch A frontend candidate does not break the existing canonical Board/Workspace/DC-9/public-site contracts covered by the repository validation suite.

## Batch A implementation evidence currently present

Tracked migration:

`supabase/migrations/20260912131000_board_information_architecture_batch_a.sql`

Frontend owner extensions:

- `community/board/board.js`;
- `community/board/board-entry-v2.js`;
- `community/artifact/artifact.js`;
- `community/board/board-integrations-v1.js`.

Existing spatial owners remain unchanged.

## Static migration review already completed

Before Run 935, two migration-shape hazards were corrected:

1. `dc_guest_board_read_v1()` changes its table return shape, so the migration drops/recreates the existing canonical function instead of attempting an incompatible `CREATE OR REPLACE`.
2. Guest media storage authorization uses the narrow SECURITY DEFINER helper `dc_can_read_guest_board_media_v1(...)` because direct Guest lookup through `dc_artifact_media` would otherwise be blocked by its existing Member-only RLS.

The tracked SQL still has **not** been applied to live Supabase.

## What Run 935 does NOT prove

The repository CI does not execute the new migration against a disposable Postgres/Supabase branch. Therefore Run 935 is not runtime evidence for:

- migration application/rollback behavior;
- idempotent lifecycle normalization in an actual database transaction;
- expanded Guest Board RPC result shape under real Postgres;
- Guest historical interest writes under real RLS;
- Member historical reaction writes under real RLS;
- Guest historical detail/media access under real RLS/storage policies;
- history response rejection under real RLS;
- canonical entity projection RPC output against the real database.

These are required before Batch A may be called fully `G6A PASS`.

## Authorization boundary

Production merge: **NOT AUTHORIZED**.  
Production deploy: **NOT AUTHORIZED**.  
Live Supabase migration: **NOT AUTHORIZED**.

`Commit ≠ merge ≠ deploy`.
