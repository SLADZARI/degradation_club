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
productionMergeAuthorized: true
productionDeployAuthorized: true
liveDatabaseMutationAuthorized: false
telegramWorkerDeployAuthorized: false
---

# MP | Dementor Club | CLEANUP | Board Information Architecture v1 | Result v0.17

## Status

**ACTIVE / G8 CLEANUP — CORRECTIVE #156 MERGED / PAGES DEPLOY PENDING**

Owner production authorization: `разрешаю corrective #156 в production` on 2026-09-12.

## Current live baseline

Production deploy **#62 / 34715357139 — SUCCESS** shipped exact `dementor-club-production` commit:

`1dccbd8bbaf1d0220bc80f9a6a0f0e42cace099b`

Pages artifact: `10303993309`.
Artifact digest: `sha256:fa0bfebf617f6e0c781ebbde71b6bf99c5459a166a08d4678fa31438af48ab1d`.

Owner live QA after deploy #62 confirmed the earlier mobile filter/auth corrections and exposed two residual defects:

1. the opened mobile type drawer could be overlapped by the fixed bottom Board control strip;
2. embedded Artifact `← BOARD` could navigate the iframe to `/workspace/board/`, producing Board-inside-Board instead of closing the parent overlay.

## Corrective #156

Integration branch:

`agent/board-live-corrective-mobile-overlay`

Exact branch base:

`1dccbd8bbaf1d0220bc80f9a6a0f0e42cace099b`

Final corrective head:

`5ddb2369b51c4899d50de0c0dfb3a07aec5b0bd7`

Scope remains presentation/navigation-only:

- mobile `ТИПЫ` drawer clears the fixed bottom Board controls with safe-area clearance and scrollable max-height;
- desktop drawer remains attached to the canonical filter host;
- existing `board-fullscreen-v2-1.js` remains the fullscreen overlay owner and intercepts embedded Artifact `#artifactBackTop / #detailBack` so return closes the parent overlay and restores the existing Board camera;
- browser acceptance asserts drawer/control non-overlap and embedded return behavior;
- no new detail owner, spatial owner, route owner or permission owner is introduced.

## Validation

Site Integrity / Release Readiness **#1024 / 34718513387 — SUCCESS** on exact head `5ddb2369b51c4899d50de0c0dfb3a07aec5b0bd7`.

Passed: Board v2/v2.1, Board IA Batch A/B, Telegram Promotion, G8 ownership, production candidate build, public browser matrix, DC-9 recovery, Board fullscreen browser matrix, Board live corrective browser acceptance, Workspace recovery, My Artifacts history, WebKit auth, production route manifest and production release gate.

## Production repository merge

After explicit owner authorization, PR **#156** was marked ready and squash-merged into `dementor-club-production`.

Production repository commit:

`af28404048dfc918ada81298b0d184df407d0595`

Repository merge is complete. `Commit ≠ deploy` remains in force.

## Current release boundary

The connected GitHub surface does not expose workflow-dispatch for the manual Pages production workflow. Therefore:

- production repository: `af28404048dfc918ada81298b0d184df407d0595`;
- live Pages frontend: still evidenced at deploy #62 / `1dccbd8bbaf1d0220bc80f9a6a0f0e42cace099b`;
- corrective #156 Pages deploy: **PENDING_WORKFLOW_DISPATCH**;
- no claim that #156 is live until the production workflow succeeds on exact commit `af28404048dfc918ada81298b0d184df407d0595`;
- no live DB migration or Telegram worker deployment is part of this corrective.

## Required post-deploy evidence

After production workflow dispatch, verify sequentially on live `/workspace/board/`:

1. mobile `ТИПЫ` opens fully above fixed bottom controls;
2. drawer scrolls and a type selection applies normally;
3. compact controls remain tappable while the drawer is open;
4. Artifact card opens in the existing fullscreen overlay;
5. Artifact `← BOARD` / detail back closes that overlay, preserves the parent Board route and does not leave a nested Board iframe;
6. desktop Board and drawer remain regression-free.

## Hard boundaries

No changes to DB/RLS, Membership semantics, Artifact lifecycle, Telegram Promotion/outbox/trusted scheduler, spatial coordinate model, or deep-link/share implementation.

Deep-link/share remains the next Result after this Board corrective is live-PASS.

## Client preview boundary

**CLIENT PREVIEW = HOLD** until corrective #156 is deployed and owner live smoke confirms both residual defects are gone without regression.

Deferred operational evidence remains unchanged: legitimate non-owner Dementor `0/2 → 1/2 → 2/2 → pending`, first legitimate new Telegram delivery, and unsynthesized coverage of all eight Board states.
