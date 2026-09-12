---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: CLEANUP
gate: G8_CLEANUP
status: ACTIVE
version: 0.15
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.14
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
changeDecision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
integrationBranch: agent/board-g8-mobile-types-fix
productionBaseCommit: a22486840adaa08aa77b682461d947f85cb3ca88
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
telegramWorkerDeployAuthorized: false
---

# MP | Dementor Club | CLEANUP | Board Information Architecture v1 | Result v0.15

## Status

**ACTIVE / G8 CLEANUP — SCHEDULER CORRECTION LIVE / MOBILE `ТИПЫ` CORRECTIVE READY / PRODUCTION RELEASE NOT YET AUTHORIZED**

## Scheduler correction now live

Production deploy #60 completed successfully after PR #151.

Verified release facts:

- production repository commit: `a22486840adaa08aa77b682461d947f85cb3ca88`;
- Deploy Dementor Production run: **#60 / 34709240809 — SUCCESS**;
- build job explicitly checked out `dementor-club-production` and resolved `git log -1` to `a22486840adaa08aa77b682461d947f85cb3ca88`;
- Pages artifact: `10302399181`;
- artifact digest: `sha256:9a67fbe74199f2f75f306e1f3fa44c0fed3a9189558c2bbca043a233dc36b606`;
- `telegram-outbox-worker` remains production v11;
- canonical Vault-backed `pg_cron + pg_net` scheduler remains the automatic worker owner;
- obsolete browser Telegram worker trigger is no longer present in the production Board bundle.

Backend scheduler evidence remains:

`operations/BOARD_TELEGRAM_WORKER_SCHEDULER_G8_PRODUCTION_VALIDATION_2026-09-12.md`.

## New live QA defect

Fresh owner screenshots after deploy #60 confirm desktop and mobile Board load, but expose:

`QA-BOARD-LIVE-003` — on a narrow/mobile viewport, tapping `ТИПЫ` does not expose the canonical type-filter drawer.

Diagnosis is presentation-only:

- canonical filter owner remains `community/board/board-integrations-v1.js`;
- drawer is nested inside `.dc-board-filters`;
- mobile fullscreen CSS made that host a horizontal scroll container, clipping the nested drawer.

Evidence:

`operations/BOARD_MOBILE_TYPES_FILTER_LIVE_QA_2026-09-12.md`.

## Corrective candidate

One clean corrective branch now owns the active integration slot:

`agent/board-g8-mobile-types-fix`

It was created from exact current production commit:

`a22486840adaa08aa77b682461d947f85cb3ca88`.

PR **#153**:

- exactly 2 changed files;
- fixes the existing mobile stylesheet owner rather than creating a parallel filter/runtime system;
- makes the same canonical drawer a fixed mobile bottom sheet;
- prevents the filter host from clipping it;
- adds a Board v2.1 contract regression guard;
- no DB/RLS/worker/membership/lifecycle/route/Telegram semantic change.

Validation:

- Site Integrity / Release Readiness **#987 / 34709791435 — PASS**.

## Current production boundary

The defect report authorizes diagnosis and corrective preparation, but does not by itself authorize a new production merge/deploy.

Therefore:

- PR #153 remains unmerged;
- `dementor-club-production` remains at `a22486840adaa08aa77b682461d947f85cb3ca88`;
- production DB and worker are not touched by this corrective candidate;
- G8 cannot close until the mobile drawer fix is released and retested live.

## Deferred operational evidence

Still deferred without synthetic actors/events:

- real non-owner Dementor promotion support `0/2 → 1/2 → 2/2 → pending`;
- real external Telegram delivery from a legitimate pending row;
- all eight Board states exercised by legitimate production actors.

These deferred observations must not be manufactured through role mutation merely to close evidence.