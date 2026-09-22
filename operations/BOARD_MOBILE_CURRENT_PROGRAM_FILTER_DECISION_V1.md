---
artifactId: dementor-club.operations.board-mobile-current-program-filter-decision-v1
project: dementor-club
documentType: DECISION
status: APPROVED
version: 1.0
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: APPROVED_AUTHORITY
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
---

# BOARD MOBILE CURRENT PROGRAM FILTER DECISION v1

## Decision

For the mobile Board, the living spatial Board is the primary first-frame surface.

The standalone `Current Program` overlay/rail must not occupy the first mobile viewport.

On mobile, `Current Program` moves into the existing Board filter experience. The canonical Current Program data remains owned by `current-program-v1.js`; this decision changes presentation only.

Desktop Current Program presentation is unchanged by this decision.

## Mobile rule

At the existing compact mobile Board breakpoint:

```text
default entry:
Board spatial canvas first

Current Program top overlay:
not visually present

filters:
contain a Current Program / program-affiliation control

Board default source view:
ВСЁ remains unchanged
```

Do not create a second navigation system or a second Program renderer.

## Card labels

Board cards should expose compact identity/status badges using existing canonical data.

For Member Artifacts, use the existing Artifact subtype owner:

```text
announcement → ОБЪЯВЛЕНИЕ
post         → ПОСТ
idea         → ИДЕЯ
request      → ЗАПРОС
```

Do not introduce `СВОБОДНАЯ ИДЕЯ` as a new canonical type. An Idea that is not in Current Program is simply `ИДЕЯ` with no `В ПРОГРАММЕ` badge.

For platform projections, use existing canonical source/entity type labels (Event / Course-Program / Practice / Project-Product / Content as already modeled).

Add a secondary badge:

```text
В ПРОГРАММЕ
```

only when the card can be matched by exact canonical identity to an item returned by `getCurrentProgram()`.

Current Program membership must be derived from canonical identity (`thingRef` / slug-kind bridge / canonical route), never title matching and never visual proximity.

Do not infer `В ПРОГРАММЕ` from generic Board Relations in v1.

## Filter behavior

Extend the existing Board filter owner. Do not create a parallel filter owner.

Current Program is an orthogonal affiliation filter, not a replacement for the approved object-type dimension.

Selecting Current Program should show/focus only cards that are exact Current Program Things while preserving the same underlying Board objects and routes.

The default remains:

```text
ВСЁ
```

No persistent user preference is introduced.

## Preserved semantics

No change to:

- Current Program composition/order/truth;
- Project/Event/Course ownership;
- Board entity projection semantics;
- Board default `ВСЁ` rule;
- relation ontology or permissions;
- Artifact subtypes;
- Membership / DC-9 / auth;
- persistence/schema/RLS.

## Acceptance intent

At 390px and 360px:

- first frame is predominantly the living Board;
- no standalone Current Program strip consumes first-screen height;
- filters expose Current Program clearly;
- canonical Current Program Things can be isolated through that filter;
- cards remain understandable through compact type badges;
- Current Program Things carry a visible `В ПРОГРАММЕ` badge;
- no new entity/type semantics are invented;
- desktop remains unchanged.

This is a project-local approved design rule for STAB-06 only.
