---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: CLEANUP
gate: G8_CLEANUP
status: ACTIVE
version: 0.12
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.11
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
changeDecision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
integrationBranch: agent/board-information-architecture-v1-g8
previousIntegrationBranch: agent/board-information-architecture-v1
productionBaseCommit: 8adee2d8708393d7ba56de0bc53790152fb5c69c
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
telegramWorkerDeployAuthorized: false
---

# MP | Dementor Club | CLEANUP | Board Information Architecture v1 | Result v0.12

## Status

**ACTIVE / G8 CLEANUP — CLEAN INTEGRATION BASE REALIGNED TO CURRENT PRODUCTION**

## Branch handoff

The implementation branch used for the released build, `agent/board-information-architecture-v1`, diverged after squash/corrective production merges. It remains historical implementation evidence and is no longer the active integration branch.

G8 now uses exactly one active integration branch:

`agent/board-information-architecture-v1-g8`

It starts from exact current production commit:

`8adee2d8708393d7ba56de0bc53790152fb5c69c`

This avoids blind merging of the historically divergent implementation branch back into production.

## Live release state retained

Authenticated target-route release validation is PASS and remains governed by:

`operations/BOARD_INFORMATION_ARCHITECTURE_LIVE_RETEST_2026-09-12.md`

Released backend state remains unchanged:

- Batch A/B migrations;
- Board Telegram Promotion v1 migrations;
- telegram worker v10;
- frontend release #59.

## G8 blocker discovered

Cleanup inventory found that canonical Workspace Board still loads `telegram-worker-trigger-v3.js`, which invokes the worker with an ordinary authenticated session.

Worker v10 now correctly accepts only trusted service-role invocation. No production `pg_cron`/`pg_net` scheduler or scheduled GitHub worker workflow is currently evidenced.

Therefore:

- browser trigger v3 is obsolete compatibility runtime;
- v1/v2 are also shipped legacy trigger files;
- a legitimate `pending` outbox row currently has no evidenced trusted automatic processing path.

Evidence:

`operations/BOARD_INFORMATION_ARCHITECTURE_G8_CLEANUP_INVENTORY_2026-09-12.md`

## Next corrective build boundary

On the active G8 branch only:

1. design and commit a trusted scheduler/service invocation owner;
2. preserve the rule that ordinary authenticated users cannot invoke worker processing authority;
3. validate scheduler auth with a zero-claim path before any real delivery;
4. remove client worker trigger from canonical Board runtime only after trusted invocation exists;
5. retire v1/v2/v3 trigger files only after reference checks;
6. extend Telegram Promotion contract to prohibit browser worker invocation.

## Authorization boundary reset

Entering G8 and creating this clean integration branch does **not** carry forward production mutation authorization for the new scheduler correction.

Current authorization for this v0.12 corrective work:

- branch implementation / static validation — authorized by owner instruction to continue;
- production DB scheduler migration — **not yet authorized for this corrective package**;
- Edge worker v11 deploy / verify_jwt change — **not yet authorized**;
- production merge/deploy — **not yet authorized**.

Prepare and validate first; request one explicit production authorization after the corrective package is reviewable.
