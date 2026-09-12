---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.10
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.9
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
changeDecision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
integrationBranch: agent/board-information-architecture-v1
productionBaseCommit: fe7a86a024f1c316c93b800ba66e70933082e927
productionMergeAuthorized: true
productionDeployAuthorized: true
productionCommit: 75e074a431f18bd65506bf567ae21308057b24fe
productionDeployStatus: SUCCESS_LIVE_RETEST_PENDING
productionDeployRun: 57
productionDeployRunId: 34702060603
pagesArtifactId: 10300324172
liveDatabaseMutationAuthorized: true
telegramWorkerDeployAuthorized: true
telegramWorkerDeployed: true
telegramWorkerVersion: 10
---

# MP | Dementor Club | RELEASE | Board Information Architecture v1 | Result v0.10

## Status

**ACTIVE / G7 RELEASE — PRODUCTION DEPLOY SUCCESS / AUTHENTICATED LIVE RETEST PENDING**

## Released production surface

The validated Board release candidate from PR #145 is now both merged and deployed.

Production commit:

`75e074a431f18bd65506bf567ae21308057b24fe`

Production deployment:

- workflow `Deploy Dementor Production`;
- run `#57`;
- run id `34702060603`;
- conclusion `success`;
- Pages artifact id `10300324172`;
- artifact digest `sha256:99eb66b0ad5124e3402b7474a4093bd9462b8c4e9ab2c162df8b9b49a359ffea`.

Although the workflow controller lives on `main`, its build job explicitly checked out canonical branch `dementor-club-production`; logs confirmed checkout SHA `75e074a431f18bd65506bf567ae21308057b24fe` before build.

Evidence:

`operations/BOARD_INFORMATION_ARCHITECTURE_PRODUCTION_RELEASE_2026-09-12.md`

## Backend state retained

Already released before frontend deploy:

- Batch A DB migrations;
- Batch B DB migrations;
- Telegram Promotion DB migrations;
- `telegram-outbox-worker` v10.

Immediate post-site-deploy read-only DB state remained stable:

- Artifacts: 8 total = 5 expired + 3 archived;
- outbox: 6 sent + 1 failed;
- pending = 0;
- processing = 0;
- delivery_unknown = 0.

No delivery row was manufactured for release validation.

## Validation already passed

Pre-release candidate:

- Site Integrity / Release Readiness #974 — PASS.

Production workflow #57 additionally passed:

- registry/routes/feature state;
- content readiness;
- visual contract;
- production build;
- production analytics/consent;
- production artifact/release guard;
- GitHub Pages deployment.

## Remaining live validation

This Result is released technically but is **not yet G8 / DONE**.

Still required:

1. Authenticated live-browser regression after production deploy for:
   - `/workspace/board/`;
   - `/community/artifact/:id/`;
   - `/workspace/artifacts/`.
2. Real non-owner Dementor support path remains unavailable without a legitimate non-owner Dementor account:
   `0/2 → 1/2 → 2/2 → held → pending`.
3. External Telegram delivery through worker v10 remains to be observed when a legitimate row reaches `pending`.

No synthetic role mutation is authorized merely to close evidence.

## Boundary

- production merge — DONE;
- production Pages deploy — DONE;
- production DB — RELEASED;
- Telegram worker v10 — RELEASED;
- authenticated live retest — PENDING;
- G8 cleanup / Result closure — NOT CLAIMED.

`Commit ≠ merge ≠ deploy ≠ live validation.`
