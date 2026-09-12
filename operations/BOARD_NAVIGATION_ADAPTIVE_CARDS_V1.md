---
artifactId: dementor-club.spec.board-navigation-adaptive-cards-v1
project: dementor-club
documentType: IMPLEMENTATION_SPEC
projectStage: BUILD
gate: G2_INVENTORY
status: DRAFT
version: 0.1
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: REFERENCE
---

# Dementor Club — Board Navigation + Adaptive Cards v1

**STATUS: DRAFT / REFERENCE — implementation requires dedicated Result**

## 1. Goal

Improve the existing canonical Community Board without adding a second navigation system or a second card component.

This edition contains only two implementation themes:

1. mobile previous/next navigation between visible Board cards;
2. media-responsive canonical card composition + stronger text hierarchy.

Visual differentiation of Board object/event types is explicitly **NOT IMPLEMENTED IN THIS EDITION**. It is captured separately in `operations/BOARD_VISUAL_TYPE_LANGUAGE_V0.1.md` for later review/approval.

## 2. Existing owner inventory

### 2.1 Previous / next navigation already exists

Canonical owner: `community/board/board-fullscreen-v2-1.js`.

Existing runtime already creates `.dc-board-filter-nav` with:

- `←` previous;
- position `N / total`;
- `→` next;
- `step(delta)`;
- `focusCard(card)` using the existing Board camera/world transform.

No new navigator component is needed.

Current mobile regression is presentation-only: `community/board/board-fullscreen-v2-1.css` explicitly hides `.dc-board-filter-nav` at `max-width:520px`.

Therefore the canonical fix is to extend the existing navigator presentation on mobile, not create a parallel mobile navigator.

### 2.2 Card sizing owner already exists

Canonical spatial sizing owner: `community/board/board-spatial-v1.js` + `community/board/board-spatial-v1.css`.

Existing size classes:

- XS;
- S;
- M;
- L.

Current `cardSizeClass()` behavior:

- persisted `size_class` wins first;
- any card containing `.dc-notice__media` becomes `L` when no persisted size class exists;
- otherwise text length chooses M / XS / S.

This means attached image proportion currently does not affect composition.

### 2.3 Media presentation currently collapses shape

`community/board/board-fullscreen-v2-1.css` limits Board image height and uses `object-fit:cover`.

This makes portrait, square and landscape images visually converge toward the same card treatment.

### 2.4 Canonical card rule remains binding

Approved Board IA v1 requires one canonical card system across Board projections. Differences may use presentation variants; parallel card components are not allowed.

This Result must therefore extend `.dc-notice / .dc-projection`, not fork them.

## 3. Implementation contract

### A. Mobile navigator

Reuse `.dc-board-filter-nav` and existing `step()` / `focusCard()`.

Mobile acceptance:

- arrows visible at 390px and 430px when at least two visible cards exist;
- arrows remain reachable without covering `ТИПЫ`, primary CTA, or bottom pan/zoom controls;
- `←` and `→` move the existing camera to the previous/next visible card;
- position label updates correctly;
- filter changes reset the navigation index as today;
- no duplicate navigation owner is introduced.

Desktop behavior must remain unchanged.

### B. Adaptive card composition

The canonical card receives deterministic presentation attributes derived from already-rendered content:

- media shape: `portrait / square / landscape / none`;
- text density: `compact / standard / dense`.

These are presentation attributes only. They must not become DB fields, lifecycle state, content type, permissions or persisted semantic metadata.

Suggested classification:

- portrait: natural image ratio `< 0.82`;
- square: `0.82–1.18`;
- landscape: `> 1.18`;
- no media: `none`.

Text density should derive from visible title/body length and remain deterministic.

Presentation goals:

- portrait media produces a narrower/taller card rather than a wide cropped strip;
- landscape media produces a wider card with a landscape image stage;
- square media receives a balanced square-ish stage;
- text-only cards continue using content-derived size classes;
- short headline cards may use larger title scale;
- dense cards reduce title/body scale within an accessibility floor;
- exact media ratio is respected through `aspect-ratio` / `object-fit` instead of forcing every image into one crop.

The existing persisted Board position owner remains unchanged. This Result must not migrate or rewrite `dc_artifact_board_positions`.

### C. Layout reaction

When image natural dimensions become available, canonical spatial/layout owners must be asked to re-evaluate card geometry safely.

Do not create a second collision/layout engine.

Use existing Board events / existing layout responsibility.

## 4. Accessibility / interaction

- nav buttons must remain normal buttons with explicit accessible labels;
- keyboard focus remains visible;
- card title/body must stay readable at mobile zoom baseline;
- no information may be conveyed by color alone;
- reduced-motion users must not receive required animation for navigation comprehension.

## 5. Hard boundaries

Do not change:

- DB / RLS / migrations;
- Membership / DC-9 / Application semantics;
- Artifact lifecycle;
- Board filter taxonomy;
- Telegram Promotion/outbox/scheduler;
- canonical Event/Program/Project owners;
- spatial coordinate persistence model;
- Artifact detail owner;
- public Header / Workspace shell.

If implementation requires one of these changes, STOP and determine whether a Change Proposal is required.

## 6. Browser acceptance

Minimum viewport matrix:

- 390×844;
- 430×844;
- 800×900;
- 1440×900.

Required browser evidence:

1. at least two visible cards → mobile arrows visible;
2. next/prev actually changes world transform / focused card;
3. N/total updates and wraps safely;
4. arrows remain hidden when fewer than two visible cards exist;
5. synthetic portrait image → `portrait` presentation and portrait geometry;
6. synthetic landscape image → `landscape` presentation and landscape geometry;
7. square image → `square` presentation;
8. short vs dense text produce distinct typographic density classes;
9. existing `ТИПЫ`, pan/zoom, Artifact open/close, Member-first flow remain green;
10. no DB writes are added merely for presentation classification.

## 7. Explicit non-goal: type visual language

Do not implement new type colors, shapes or badges in this Result.

The owner asked to think about distinguishing Board object/event types separately, not in this edition.

That work stays in `BOARD_VISUAL_TYPE_LANGUAGE_V0.1.md` until reviewed and explicitly approved.
