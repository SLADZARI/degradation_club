---
artifactId: dementor-club.result.board-navigation-adaptive-cards-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G2_INVENTORY
status: ACTIVE
version: 0.1
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
specification: operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_V1.md
plannedIntegrationBranch: agent/board-navigation-adaptive-cards-v1
integrationBranch: agent/board-navigation-adaptive-cards-v1
productionBaseCommit: 43b6dcaa11292f49564c989add219e0b095fbf8d
implementationStartAuthorized: true
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | BUILD | Board Navigation + Adaptive Cards v1 | Result v0.1

## Goal

Improve the current canonical Community Board in two ways without semantic expansion:

1. expose the already-existing previous/next card navigator on mobile;
2. make canonical Artifact cards respond to attached image proportions and text density so the Board has meaningful visual rhythm instead of one repeated card shape.

Visual differentiation by Board object/event type is explicitly deferred to `operations/BOARD_VISUAL_TYPE_LANGUAGE_V0.1.md` and is not part of this Result.

## Status

**ACTIVE / G2 INVENTORY — IMPLEMENTATION START AUTHORIZED, PRODUCTION NOT AUTHORIZED**

The project owner replied `давай` after the proposal to start this separate Board UX Result. This authorizes Result preparation and implementation work, not production merge/deploy.

## Exact production baseline

`43b6dcaa11292f49564c989add219e0b095fbf8d`

This is deploy #64 live production after PR #155.

## Existing owner inventory

### Navigator

`community/board/board-fullscreen-v2-1.js` already owns:

- `.dc-board-filter-nav`;
- previous/next buttons;
- position counter;
- `step(delta)`;
- `focusCard(card)`.

`community/board/board-fullscreen-v2-1.css` hides the navigator at `max-width:520px`.

Conclusion: mobile arrows are an extension of the existing owner; no new JS navigation system is required.

### Card sizing / layout

`community/board/board-spatial-v1.js` owns spatial size classification through `cardSizeClass()` and the existing XS/S/M/L classes.

Current logic treats any media card as L if no persisted size class exists and does not inspect image ratio.

`community/board/board-spatial-v1.css` owns width by size class.

`community/board/board-layout-v2.js` owns collision-safe layout and must remain the single layout owner.

### Card content

`community/board/board.js` remains the canonical Artifact card renderer.

`community/board/board-integrations-v1.js` remains the canonical entity-projection renderer/filter owner.

This Result must not fork either into a second card component.

### Media presentation

`community/board/board-fullscreen-v2-1.css` currently clamps Board image height and applies `object-fit:cover`, visually normalizing different source aspect ratios.

## Planned implementation

### A. Mobile arrows

Remove the narrow-screen hide rule and compose the existing navigator into mobile controls without covering `ТИПЫ`, CTA or bottom spatial controls.

### B. Adaptive cards

Extend the existing spatial/card presentation with deterministic DOM-only presentation states:

- `data-media-shape="portrait|square|landscape|none"`;
- `data-text-density="compact|standard|dense"`.

No DB fields or migrations.

Image natural dimensions become presentation input after load; the existing layout owner receives a re-layout request when geometry changes.

### C. Browser acceptance

Extend the existing Board browser acceptance rather than create an unrelated test stack.

Required viewports: 390, 430, 800, 1440.

Tests must prove:

- mobile arrows visible for 2+ visible cards;
- arrows alter focused card/camera and counter;
- filter changes preserve correct navigator behavior;
- portrait/square/landscape media receive distinct deterministic card presentation;
- compact vs dense copy receives distinct typographic hierarchy;
- existing ТИПЫ / pan-zoom / Artifact open-close / Member-first acceptance remains green.

## Hard boundaries

No change to:

- DB/RLS;
- Membership/DC-9/Application semantics;
- Artifact lifecycle;
- Telegram promotion/outbox/scheduler;
- Board filter taxonomy;
- canonical entity ownership;
- persisted spatial coordinate model;
- Artifact detail owner;
- Public Header / Workspace shell.

## Type-language deferment

`operations/BOARD_VISUAL_TYPE_LANGUAGE_V0.1.md` is DRAFT / REFERENCE only.

This Result does not implement type color/shape/badge changes.

## Gate plan

`G2 Inventory → G3 Build → G6 Validation → G7 Release (separate authorization) → live retest → G8 Cleanup`.

## Authorization state

- implementation start: **authorized**;
- production merge: **not authorized**;
- production deploy: **not authorized**;
- live DB mutation: **not authorized and not required**.
