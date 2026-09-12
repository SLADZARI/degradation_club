---
artifactId: dementor-club.result.board-navigation-adaptive-cards-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G6_VALIDATION
status: ACTIVE
version: 0.2
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
specification: operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_V1.md
integrationBranch: agent/board-navigation-adaptive-cards-v1
productionBaseCommit: 43b6dcaa11292f49564c989add219e0b095fbf8d
candidateCommit: faf57aa7a949f27d506ef9a969896e8653c32d2b
pullRequest: 158
implementationStartAuthorized: true
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | VALIDATION | Board Navigation + Adaptive Cards v1 | Result v0.2

## Status

**ACTIVE / G6 PASS — RELEASE NOT AUTHORIZED**

## Goal

Improve the current canonical Community Board without semantic expansion:

1. expose the existing previous/next navigator on narrow mobile;
2. make existing canonical cards visually respond to source media proportion and existing size-class density.

Visual differentiation by Board object/event type remains explicitly outside this Result and stays DRAFT / REFERENCE in `operations/BOARD_VISUAL_TYPE_LANGUAGE_V0.1.md`.

## Exact baseline and candidate

Production baseline:

`43b6dcaa11292f49564c989add219e0b095fbf8d`

Integration branch:

`agent/board-navigation-adaptive-cards-v1`

Validated candidate:

`faf57aa7a949f27d506ef9a969896e8653c32d2b`

PR: **#158 — Board UX — mobile navigator + adaptive card rhythm**.

Final diff against production remains limited to 3 files:

- `.github/workflows/site-integrity.yml`;
- `community/board/board-mobile-air-v2-1.css`;
- `scripts/validate-board-navigation-adaptive-cards-browser.mjs`.

No Board semantic JS owner, DB/RLS migration, Membership/DC-9, Telegram, Workspace/auth or Artifact lifecycle file is changed.

## Existing-owner implementation

### Mobile navigator

No new navigator was created.

Existing `community/board/board-fullscreen-v2-1.js` remains the sole owner of:

- `.dc-board-filter-nav`;
- previous/next buttons;
- counter;
- `step(delta)`;
- `focusCard(card)`.

The change is responsive composition only in the existing final mobile Board stylesheet: the old <=520 `display:none` outcome is overridden so the canonical navigator is reachable above the existing spatial controls.

### Adaptive card rhythm

No new card component was created.

Existing canonical `.dc-notice` / `.dc-projection` and XS/S/M/L size classes remain the presentation basis.

The final responsive owner now:

- preserves intrinsic media proportions with `width:auto; max-width:100%; height:auto; object-fit:contain`;
- keeps bounded max heights so Board cards do not consume the full phone viewport;
- gives existing XS/S/M/L classes a stronger title/body hierarchy;
- keeps the `ТИПЫ` drawer clear of the mobile navigator.

No presentation class is persisted to DB and no coordinate model is changed.

## Validation evidence

### #1029 — useful failing guard

Initial candidate CI #1029 failed only the new browser acceptance.

It demonstrated that `width:100% + max-height` could still distort portrait image geometry even with `object-fit:contain`.

The implementation was corrected rather than weakening the assertion.

### #1031 — full G6 PASS

Site Integrity / Release Readiness **#1031 / run `34722775463` — SUCCESS** on exact candidate `faf57aa7a949f27d506ef9a969896e8653c32d2b`.

The complete integrated matrix passed, including:

- registry/routes/content readiness;
- public visual contract and browser matrix;
- DC-9 immutable baseline/account sync/browser recovery;
- Membership semantic authority;
- Board v2/v2.1 contracts;
- Board IA Batch A/B;
- Telegram Promotion and Board G8 ownership;
- existing Board live corrective browser acceptance;
- new navigation/adaptive-card browser acceptance;
- Workspace recovery;
- My Artifacts history;
- WebKit auth regression;
- production route manifest;
- production release gate.

The new browser acceptance proves at 390/430/1440:

- mobile arrows are visible with two or more visible cards;
- next/previous changes the existing Board camera and counter;
- navigator does not overlap bottom spatial controls;
- mobile `ТИПЫ` drawer clears the navigator;
- portrait/landscape media retain distinct rendered aspect ratios;
- portrait media creates a taller visual than landscape media;
- XS vs L existing size classes produce a real rendered title-scale hierarchy;
- desktop navigator remains desktop-composed rather than mobile fixed.

## Hard boundaries preserved

No change to:

- DB / RLS / migrations;
- Membership / DC-9 / Application semantics;
- Artifact lifecycle;
- Telegram Promotion / outbox / scheduler;
- Board filter taxonomy;
- canonical entity ownership;
- spatial coordinate persistence model;
- Artifact detail owner;
- Public Header / Workspace shell.

## Authorization / next gate

Implementation and G6 validation are complete enough for release consideration.

Production merge: **NOT AUTHORIZED**.

Production deploy: **NOT AUTHORIZED**.

A separate explicit owner instruction is required before merging PR #158 to `dementor-club-production`.
