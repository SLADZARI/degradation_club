---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: CLEANUP
gate: G8_CLEANUP
status: ACTIVE
version: 0.17
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.16
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
changeDecision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
integrationBranch: agent/board-live-corrective-mobile-overlay
productionBaseCommit: 1dccbd8bbaf1d0220bc80f9a6a0f0e42cace099b
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
telegramWorkerDeployAuthorized: false
---

# MP | Dementor Club | CLEANUP | Board Information Architecture v1 | Result v0.17

## Status

**ACTIVE / G8 CLEANUP — LIVE RESIDUAL CORRECTIVE IN VALIDATION**

## Current live baseline

Production deploy **#62 / 34715357139 — SUCCESS** shipped exact `dementor-club-production` commit:

`1dccbd8bbaf1d0220bc80f9a6a0f0e42cace099b`

Pages artifact: `10303993309`.
Artifact digest: `sha256:fa0bfebf617f6e0c781ebbde71b6bf99c5459a166a08d4678fa31438af48ab1d`.

Owner live QA after deploy #62 confirms:

- mobile `ТИПЫ` opens and filters;
- active `ВСЁ` is readable black-on-lime;
- `МОЁ / К ЖИЗНИ / + / − / ?` labels are visually centered;
- authenticated Member / first-Artifact interaction is broadly restored.

Two residual live defects remain and keep CLIENT PREVIEW on HOLD:

1. On narrow/mobile, the opened type drawer is overlapped by the fixed bottom Board control strip.
2. In fullscreen Artifact detail, `← BOARD` runs inside the same-origin iframe and can navigate that iframe to `/workspace/board/`, producing a Board-inside-Board instead of closing the parent overlay.

## Active corrective

Integration branch:

`agent/board-live-corrective-mobile-overlay`

Exact branch base:

`1dccbd8bbaf1d0220bc80f9a6a0f0e42cace099b`

Draft PR: **#156**.

Corrective ownership:

- `board-filters-v2.css` keeps the mobile drawer above the bottom control strip with safe-area clearance and scrollable max-height;
- existing `board-fullscreen-v2-1.js` remains the canonical fullscreen overlay owner and intercepts embedded Artifact `#artifactBackTop / #detailBack` so return closes the parent overlay and restores the existing Board camera instead of navigating an iframe to a nested Board;
- existing browser acceptance now asserts drawer/control non-overlap and real embedded `← BOARD` close behavior.

No new detail owner, spatial owner, route owner or permission owner is introduced.

## Hard boundaries

No changes to:

- DB / RLS;
- Membership semantics;
- Artifact lifecycle;
- Telegram Promotion / outbox / trusted scheduler;
- spatial coordinate model;
- deep-link/share implementation.

Deep-link/share remains the next Result after this Board corrective is live-PASS.

## Release boundary

Branch implementation and CI validation are allowed inside the active Result. Production merge/deploy for PR #156 is **not authorized yet** and requires a new explicit owner instruction after PASS evidence.

## Client preview boundary

**CLIENT PREVIEW = HOLD** until PR #156 passes full CI, is released, and owner live smoke confirms:

- mobile drawer no longer overlaps bottom controls;
- embedded `← BOARD` closes the Artifact overlay without Board-inside-Board;
- prior PASS items remain intact.

Deferred operational evidence remains unchanged: real non-owner Dementor 2/2 support transition, first legitimate new Telegram delivery, and unsynthesized coverage of all eight Board states.
