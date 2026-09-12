---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.9
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.8
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
changeDecision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
integrationBranch: agent/board-information-architecture-v1
productionBaseCommit: fe7a86a024f1c316c93b800ba66e70933082e927
productionMergeAuthorized: true
productionDeployAuthorized: true
productionCommit: 75e074a431f18bd65506bf567ae21308057b24fe
productionDeployStatus: PENDING_MANUAL_WORKFLOW_DISPATCH
liveDatabaseMutationAuthorized: true
telegramWorkerDeployAuthorized: true
telegramWorkerDeployed: true
telegramWorkerVersion: 10
---

# MP | Dementor Club | RELEASE | Board Information Architecture v1 | Result v0.9

## Status

**ACTIVE / G7 RELEASE — PRODUCTION MERGE COMPLETE / SITE DEPLOY AUTHORIZED + PENDING WORKFLOW DISPATCH**

## Release authorization

After the Telegram worker deployment was completed and reported, the project owner explicitly authorized the next production step with:

`давай`

The immediately preceding requested step was production frontend merge + deploy for the Board release. This authorization therefore covers:

- merge of the validated Board release candidate into `dementor-club-production`;
- production Pages deploy of that merged commit.

It does not authorize unrelated Results or semantic changes outside this Board Result.

## Release candidate evidence

Integration PR:

`#145 Board Information Architecture v1 — production release candidate`

Candidate head:

`e646a42d81d3c21476e2c173c2acf4c4611f63d6`

Current production baseline before merge:

`fe7a86a024f1c316c93b800ba66e70933082e927`

The production baseline had not moved since the integration branch was created, so the release was not a blind site→production merge.

Latest full candidate validation:

- Site Integrity / Release Readiness `#974`;
- run id `34701054386`;
- conclusion `success`.

## Production merge

PR #145 was squash-merged into `dementor-club-production`.

Production commit:

`75e074a431f18bd65506bf567ae21308057b24fe`

Merge is complete.

## Backend state already released

Before frontend merge:

- Batch A DB migrations were applied and validated;
- Batch B DB migrations were applied and validated;
- Telegram Promotion DB migrations were applied and validated;
- `telegram-outbox-worker` v10 was explicitly authorized and deployed;
- post-worker-deploy outbox remained `6 sent + 1 failed`, with `pending=0` and `delivery_unknown=0`.

## Residual validation limitation

Production still has no legitimate active non-owner Dementor actor.

Therefore the real live support threshold path:

`0/2 → 1/2 → 2/2 → held → pending`

cannot be exercised without synthetic role mutation. No synthetic role is created solely for validation.

This limitation remains recorded after release and must be closed when a real authorized Dementor actor exists.

## Deploy status

The production repository uses a manual `workflow_dispatch` deployment gate:

`.github/workflows/deploy-pages.yml`

with required input:

`release_confirmation=APPROVED`

The connected GitHub action surface available in this execution can merge PRs and inspect/retry existing workflow runs, but it does not expose creation of a new `workflow_dispatch` run.

Therefore the authorized site deploy is currently **PENDING MANUAL WORKFLOW DISPATCH**, not falsely reported as deployed.

Required dispatch target:

- workflow: `Deploy Dementor Production`;
- ref: `dementor-club-production`;
- input: `release_confirmation = APPROVED`.

After that run completes, live Board routes must be retested before any `RELEASED` or G8 claim.

## Boundaries

- production DB: applied;
- Telegram worker v10: deployed;
- production frontend merge: **DONE**;
- production site deploy: **AUTHORIZED / PENDING WORKFLOW DISPATCH**;
- live retest: **PENDING**;
- Result DONE / G8: **NOT CLAIMED**.

`Commit ≠ merge ≠ deploy.`