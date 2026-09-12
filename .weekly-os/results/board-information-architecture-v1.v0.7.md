---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G6_PROMOTION_VALIDATION
status: ACTIVE
version: 0.7
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.6
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
changeDecision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
integrationBranch: agent/board-information-architecture-v1
productionBaseCommit: fe7a86a024f1c316c93b800ba66e70933082e927
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: true
---

# MP | Dementor Club | BUILD | Board Information Architecture v1 | Result v0.7

## Status

**ACTIVE / G6 PROMOTION VALIDATION — TELEGRAM PROMOTION DB APPLIED / LIVE WORKER + REAL DEMENTOR PATH PENDING**

## Authority

Canonical Board IA:

`operations/BOARD_INFORMATION_ARCHITECTURE_V1.md`

Approved change Decision:

`operations/BOARD_TELEGRAM_PROMOTION_V1.md`

Existing integration branch remains:

`agent/board-information-architecture-v1`

No parallel Result or second Telegram delivery owner is created.

## Closed implementation batches retained

### Batch A

Batch A remains **G6A PASS**.

Production DB migrations:

- `board_information_architecture_batch_a`;
- `board_information_architecture_batch_a_security_hardening`.

Evidence:

`operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_PRODUCTION_DB_VALIDATION_2026-09-12.md`

### Batch B

Batch B taxonomy/filter implementation remains built and CI-validated.

Production DB migrations:

- `board_information_architecture_batch_b_subtypes`;
- `board_information_architecture_batch_b_default_hardening`.

Evidence:

`operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_B_PRODUCTION_DB_VALIDATION_2026-09-12.md`

## Telegram Promotion v1 factual implementation state

Integration implementation is built on the active branch and the two approved production DB migrations have now been applied:

- `board_telegram_promotion_v1`;
- `board_telegram_promotion_v1_worker_hardening`.

Production migration history versions:

- `20260912144034`;
- `20260912144055`.

Production DB evidence:

`operations/BOARD_TELEGRAM_PROMOTION_PRODUCTION_DB_VALIDATION_2026-09-12.md`

Confirmed production facts after migration:

- promotion threshold backend owner = `2`;
- outbox default = `held`;
- approved eight-state outbox constraint active;
- support ledger exists with RLS enabled;
- authenticated sessions cannot execute worker claim/mark functions;
- `service_role` has worker execution authority;
- legacy direct enqueue is no longer executable by `authenticated`;
- historical outbox remained exactly `6 sent + 1 failed`;
- no historical row was reopened or converted;
- no synthetic Dementor/member state was created;
- rollback-safe transactional smoke passed with zero persisted QA Artifacts.

## CI evidence

Integration commit validated before the evidence-only follow-up:

`0d3a927a92f5f750733a327a2d1981663b332417`

Site Integrity / Release Readiness:

- run `#970`;
- run id `34698779364`;
- conclusion `success`.

Evidence-only integration commit:

`7ac0a657111a2c504a85fe7a95c7705eaac76794`

Draft PR remains:

`#145 Board Information Architecture v1 — integration validation candidate`

## G6 validation facts still open

This Result is **not** G6 PASS yet.

### 1. Real Dementor support path

Production currently has no active **non-owner Dementor** identity available for a legitimate live test.

Therefore the real live path:

`0/2 → 1/2 → 2/2 → held → pending`

and its real concurrent-second/third-support behavior cannot be exercised without creating a synthetic Dementor role.

Creating synthetic membership/role authority solely to make the test pass is prohibited. No such mutation was made.

Static/CI contract coverage for the support path is green, but it does not substitute for a real authorized Dementor actor.

### 2. Trusted Telegram worker live path

The DB worker state-machine functions are installed and production authority boundaries are validated, but the new Telegram Edge worker runtime is **not deployed**.

Therefore these remain pending live evidence:

- trusted service/scheduler invocation;
- real `pending → processing` worker claim in the deployed worker;
- Telegram success persistence;
- known non-delivery → `failed`;
- ambiguous outcome → `delivery_unknown`;
- proof that `delivery_unknown` is not automatically retried by the deployed worker.

Deploying the worker is a production deployment action and is not inferred from DB-mutation authorization.

## Production boundaries

Current authorization state:

- production DB mutation for this active Result — authorized and used within the approved bounded scope;
- production frontend merge — **false**;
- production site deploy — **false**;
- Telegram Edge worker deploy — **not authorized by current kernel**.

No frontend merge, site deploy or worker deploy has been performed.

## Next gate movement

Remain at `G6_PROMOTION_VALIDATION` until the remaining live-path evidence is legitimately obtainable.

A later `G7_RELEASE` transition requires:

- G6 evidence sufficient for the actual release surface;
- a clean release candidate from the current production baseline;
- explicit production merge/deploy authorization.

Generic relation graph Batch C must not be pulled forward merely to occupy the active branch while this validation is unresolved.

`Commit ≠ merge ≠ deploy.`
