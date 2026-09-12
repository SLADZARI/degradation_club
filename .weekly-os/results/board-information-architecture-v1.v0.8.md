---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G6_PROMOTION_VALIDATION
status: ACTIVE
version: 0.8
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.7
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
changeDecision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
integrationBranch: agent/board-information-architecture-v1
productionBaseCommit: fe7a86a024f1c316c93b800ba66e70933082e927
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: true
telegramWorkerDeployAuthorized: true
telegramWorkerDeployed: true
telegramWorkerVersion: 10
---

# MP | Dementor Club | BUILD | Board Information Architecture v1 | Result v0.8

## Status

**ACTIVE / G6 PROMOTION VALIDATION — TELEGRAM PROMOTION DB + WORKER DEPLOYED / REAL DEMENTOR PATH PENDING**

## Authority

Canonical Board IA:

`operations/BOARD_INFORMATION_ARCHITECTURE_V1.md`

Approved change Decision:

`operations/BOARD_TELEGRAM_PROMOTION_V1.md`

Existing integration branch remains:

`agent/board-information-architecture-v1`

No parallel Result or second Telegram delivery owner is created.

## Closed implementation batches retained

Batch A remains G6A PASS. Batch B taxonomy/filter implementation remains built and CI-validated. Production DB migrations remain applied and evidenced.

## Telegram Promotion v1 factual implementation state

Production DB migrations applied:

- `board_telegram_promotion_v1`;
- `board_telegram_promotion_v1_worker_hardening`.

Production worker deployment is now also complete under explicit owner authorization `деплой worker` on 2026-09-12.

Deployed function:

- slug: `telegram-outbox-worker`;
- version: `10`;
- status: `ACTIVE`;
- `verify_jwt`: `true`;
- deployed bundle SHA-256: `e391baaf5082f03e3650cff36f7b15fa8161b756bec92bd2b44594cf77f0946f`;
- source blob: `0d61d6091c84352fc90f7537f5be510cf3451f14` from `agent/board-information-architecture-v1`.

Worker deploy evidence:

`operations/BOARD_TELEGRAM_PROMOTION_WORKER_DEPLOY_2026-09-12.md`

Post-deploy production DB check:

- outbox = `6 sent + 1 failed`;
- `pending = 0`;
- `delivery_unknown = 0`;
- eligible worker rows = `0`.

The deployment itself therefore produced no delivery mutation.

## Validation evidence

Latest full integration validation before worker deploy evidence commit:

- commit `d74fe6e255de7b4dea186f6bfaa069e46c1d4908`;
- Site Integrity / Release Readiness `#973`;
- conclusion `success`.

Production DB evidence:

`operations/BOARD_TELEGRAM_PROMOTION_PRODUCTION_DB_VALIDATION_2026-09-12.md`

Worker deploy evidence:

`operations/BOARD_TELEGRAM_PROMOTION_WORKER_DEPLOY_2026-09-12.md`

A real trusted service-role HTTP invocation was not manufactured by extracting production secrets. The available connector supports deployment/introspection but does not expose a service-role invoke action, and production has no DB scheduler invocation path. The deployed worker runtime/source and zero-row post-deploy safety are proven; external Telegram delivery remains naturally testable once an eligible row reaches `pending`.

## G6 validation fact still open

This Result is **not** G6 PASS yet.

Production still has no active legitimate **non-owner Dementor** identity available for a live support-threshold test.

Therefore the real path:

`0/2 → 1/2 → 2/2 → held → pending`

and concurrent second/third support behavior cannot be exercised without creating synthetic role authority. That remains prohibited and was not done.

## Production boundaries

Current authorization state:

- production DB mutation for this active Result — authorized and used within approved scope;
- Telegram Edge worker deploy — **explicitly authorized and DONE**;
- production frontend merge — **false / NOT AUTHORIZED**;
- production site deploy — **false / NOT AUTHORIZED**.

## Next gate movement

Remain at `G6_PROMOTION_VALIDATION` until sufficient legitimate live-path evidence exists for the release surface.

Do not infer frontend release authorization from the worker deployment.

`Commit ≠ merge ≠ deploy.`
