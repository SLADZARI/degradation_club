---
artifactId: dementor-club.evidence.board-mobile-types-filter-live-qa-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: CLEANUP
gate: G8_CLEANUP
status: ACTIVE_EVIDENCE
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
productionCommitObserved: a22486840adaa08aa77b682461d947f85cb3ca88
productionDeployRunObserved: 60
correctivePullRequest: 153
---

# Board mobile `ТИПЫ` filter — live QA

## Live observation

After production deploy #60, the project owner supplied fresh production screenshots of `/workspace/board/` on desktop and a narrow/mobile viewport.

Observed:

- desktop Board loads and renders the persistent spatial map;
- mobile Board loads and remains spatial;
- the canonical `ВСЁ` and `ТИПЫ` controls are visible;
- defect `QA-BOARD-LIVE-003`: tapping `ТИПЫ` on the narrow/mobile viewport does not expose the type-filter drawer to the user.

## Existing-owner diagnosis

The existing canonical filter owner remains `community/board/board-integrations-v1.js`; no parallel filter system is needed.

The existing canonical drawer is appended inside `.dc-board-filters`.

On mobile, `community/board/board-fullscreen-v2-1.css` makes that host horizontally scrollable with `overflow-x:auto`. Under CSS overflow-axis computation the nested drawer is clipped by that scroll container even though the existing click handler toggles the drawer open.

This is a responsive presentation defect, not a filter-state or data-model defect.

## Corrective candidate

Clean branch from exact production commit `a22486840adaa08aa77b682461d947f85cb3ca88`:

`agent/board-g8-mobile-types-fix`

PR: **#153**

Scope: 2 files only.

- `community/board/board-mobile-air-v2-1.css`
  - keeps the mobile filter host overflow-visible;
  - renders the same canonical drawer as a fixed bottom sheet on <=900px;
  - preserves vertical touch scrolling inside the drawer.
- `scripts/validate-board-v21-contract.mjs`
  - adds regression guards for the mobile drawer ownership/visibility rule.

No DB, RLS, worker, membership, lifecycle, route, or Telegram semantics are changed.

## Validation

Site Integrity / Release Readiness run **#987 / 34709791435 — PASS**.

All existing Board, Membership, DC-9, browser, WebKit, route and release-gate checks passed, including the updated Board v2.1 contract.

## Current gate

`QA-BOARD-LIVE-003` remains **OPEN** until:

1. PR #153 receives explicit production merge/deploy authorization;
2. the clean corrective diff is merged into `dementor-club-production`;
3. the production Pages workflow is successfully dispatched;
4. the project owner rechecks `ТИПЫ` on a narrow/mobile production viewport.

Do not claim G8 closure before that live retest.