---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G3_BUILD_BATCH_A
status: ACTIVE
version: 0.3
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.2
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
integrationBranch: agent/board-information-architecture-v1
productionBaseCommit: fe7a86a024f1c316c93b800ba66e70933082e927
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | BUILD | Board Information Architecture v1 | Result v0.3

## Goal
Implement the approved Board Information Architecture v1 without parallel Board/entity/history/relation owners.

## Status
**ACTIVE / G3 BUILD — BATCH A**

G2 inventory is closed by:

- `operations/BOARD_INFORMATION_ARCHITECTURE_G2_INVENTORY_2026-09-12.md`;
- `operations/BOARD_INFORMATION_ARCHITECTURE_G2_CLOSURE_2026-09-12.md`;
- `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_PLAN_2026-09-12.md`.

## Active branch

`agent/board-information-architecture-v1`

Baseline:

`dementor-club-production@fe7a86a024f1c316c93b800ba66e70933082e927`

## Batch A implementation currently committed

Tracked database migration:

- `supabase/migrations/20260912131000_board_information_architecture_batch_a.sql`

The migration is committed only. It has **NOT** been applied to live Supabase.

Migration scope:

- lifecycle normalizer for stale active Artifacts;
- expanded canonical Guest Board history read;
- historical Guest interests;
- historical Member reaction INSERT authorization;
- Board-safe Guest/Applicant Artifact detail RPC;
- narrow Guest Board media read helper/policy;
- Board-safe canonical entity projection RPC.

Frontend owners extended:

- `community/board/board-entry-v2.js` — Guest/Applicant current + history rendering;
- `community/board/board.js` — Member/Dementor/Owner current + history rendering and frozen history responses;
- `community/artifact/artifact.js` — state-aware Guest detail read, history reactions, response freeze;
- `community/board/board-integrations-v1.js` — fullscreen canonical entity projections via safe RPC.

Existing spatial owners remain unchanged in Batch A. Historical Artifacts reuse stored positions or existing deterministic fallback; canonical projections reuse existing deterministic platform placement.

## Explicitly not changed yet

- Artifact subtypes;
- approved final filter taxonomy;
- generic relation owner/UI;
- Person↔Entity participation UI;
- board-hide;
- continuous visual-aging formula;
- persisted-coordinate schema;
- drag compatibility/livefix ownership.

## Current validation state

**NOT G6A VALIDATED.**

Static review identified and corrected two migration hazards before validation:

1. `dc_guest_board_read_v1` changes its table return shape, so the migration now explicitly drops/recreates the canonical function rather than relying on incompatible `CREATE OR REPLACE`.
2. Guest Storage policy lookup now goes through a narrow SECURITY DEFINER helper because direct `dc_artifact_media` RLS is Member-only.

Remaining required work before G6A PASS:

- migration/contract validation in a non-production environment;
- JS/build syntax validation;
- lifecycle/Guest/history/reaction/response-negative contract tests;
- entity projection contract tests;
- sequential role-state browser validation;
- desktop/mobile spatial and persisted-position regression;
- verify canonical entity routes and Workspace/Public Header shell ownership.

## Authorization state

- integration-branch implementation: **authorized / active**;
- production merge: **false**;
- production deploy: **false**;
- live database mutation: **false**.

`Commit ≠ merge ≠ deploy.`
