---
artifactId: dementor-club.operations.board-controls-live-corrective-g6-2026-09-22
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G6_VALIDATION
status: APPROVED
version: 1.0
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
---

# STAB-06 · Board controls live corrective · G6 validation

## Production baseline

`bdd23f80d12bd38a82b5afe2c1257e22d4e64beb`

Pages baseline:

`Deploy Dementor Production #131 / 35781834222 · SUCCESS`

Owner live QA evidence:

`operations/BOARD_CONTROLS_LIVE_QA_CORRECTIVE_2026-09-22.md`

## Exact candidate

`4669a1e7266b162e34c5f2792702d5efc0b8e93c`

PR:

`#240 · DRAFT / UNMERGED`

Validation:

`Site Integrity / Release Readiness #1244 / 35785111215 · SUCCESS`

## Root corrections

### Desktop View drawer composition

The existing `boardProgramHost` is now moved by the existing fullscreen composition owner into the same `.dc-spatial-viewport` composition as `boardFilters`.

No Current Program renderer/composition semantics changed.

Result:

`View drawer > standalone Current Program presentation > spatial cards`

The browser regression opens the real desktop drawer at an actual overlap with Current Program and verifies through `elementFromPoint` that the drawer owns the top interactive/visual point.

### Stale deep-link focus lifecycle

Explicit Board View and pager navigation now emit one existing-runtime navigation signal before their reflow/focus work.

The canonical deep-link owner consumes a stale `focus=artifact:<uuid>` synchronously on that explicit Board navigation.

A later Board DOM mutation therefore cannot re-resolve/reopen the old Artifact.

Shared incoming Artifact presentation remains protected by the existing shared-arrival state and is not silently consumed by this corrective.

## Browser evidence

PASS:

- Board live corrective browser acceptance;
- Board navigation/adaptive cards browser acceptance;
- desktop drawer-over-Program composition;
- one-active View sequence on 390 / 360 / desktop;
- Board mobile harmonization;
- Board Relations v1 runtime;
- Board deep-link auth-return browser acceptance;
- stale `focus=artifact` consumed by both View and pager navigation;
- later Board mutation does not reopen/refocus the stale Artifact;
- ordinary non-share focus/history remains valid;
- Sender Share / Entity Share / shared Receive flows remain valid;
- Current Program v1 contract;
- built JavaScript syntax;
- production route manifest;
- production release guard.

## Exact diff

Production → candidate = exactly 5 existing files:

1. `community/board/board-deeplink-auth-return-v1.js`
2. `community/board/board-fullscreen-v2-1.js`
3. `community/board/board-integrations-v1.js`
4. `scripts/validate-board-deeplink-auth-return-browser.mjs`
5. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`

`current-program-v1.js` is unchanged.

No CSS owner was added or changed.

Schema/RPC/RLS mutation = NO.
Semantic domain mutation = NO.
Change Proposal = NO.
Supabase = NOT REQUIRED.

G6 verdict: PASS.
