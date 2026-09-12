---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: CLEANUP
gate: G8_CLEANUP
status: ACTIVE
version: 0.14
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.13
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
changeDecision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
integrationBranch: agent/board-information-architecture-v1-g8
productionBaseCommit: 8adee2d8708393d7ba56de0bc53790152fb5c69c
productionMergeAuthorized: true
productionDeployAuthorized: true
liveDatabaseMutationAuthorized: true
telegramWorkerDeployAuthorized: true
---

# MP | Dementor Club | CLEANUP | Board Information Architecture v1 | Result v0.14

## Status

**ACTIVE / G8 CLEANUP — SCHEDULER BACKEND PASS / FRONTEND MERGED / PAGES DEPLOY PENDING**

Owner authorization: `разрешаю scheduler correction` on 2026-09-12.

## Validation and production evidence

- final clean candidate CI: run **#985 / 34708759899 — PASS**;
- migration `board_telegram_worker_scheduler_v1`: production **APPLIED**;
- canonical scheduler: one active `dc-telegram-outbox-worker-v1` cron job, every minute;
- worker: `telegram-outbox-worker` production **v11 ACTIVE**, custom service-to-service auth, `verify_jwt=false`;
- trusted scheduler zero-claim smoke: HTTP 200, `invoker=db_scheduler`, `claimed=0`, `sent=0`;
- untrusted publishable-only smoke: HTTP 403, `stage=auth`;
- outbox remained `sent=6`, `failed=1`, actionable pending/failed = 0;
- production validation evidence: `operations/BOARD_TELEGRAM_WORKER_SCHEDULER_G8_PRODUCTION_VALIDATION_2026-09-12.md`.

## Repository release

PR **#151** was merged into `dementor-club-production` after full CI PASS.

Production commit:

`a22486840adaa08aa77b682461d947f85cb3ca88`

The merged repository correction removes the obsolete browser-owned Telegram worker trigger and retires trigger v1/v2/v3 while preserving one canonical trusted scheduler owner.

## Current release boundary

The GitHub Pages deployment workflow is `workflow_dispatch`-only and the connected GitHub tool surface available in this session exposes workflow reads/reruns but no workflow-dispatch mutation. Therefore repository merge is complete but the Pages deployment for production commit `a22486840adaa08aa77b682461d947f85cb3ca88` is **PENDING**.

Do not claim frontend live deployment or final G8 closure until the production deploy workflow is dispatched with its required `APPROVED` confirmation and the live site is retested.

## Remaining operational evidence

- no synthetic non-owner Dementor will be created solely to exercise 0/2→1/2→2/2 support;
- real external Telegram delivery remains deferred until a legitimate eligible row reaches `pending`;
- not all eight Board states have legitimate real production actors available; do not mutate roles to manufacture evidence.
