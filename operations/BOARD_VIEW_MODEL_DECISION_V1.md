---
artifactId: dementor-club.decision.board-view-model-v1
project: dementor-club
documentType: DECISION
projectStage: BUILD
gate: G5_BUILD
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
supersedesScope:
  - operations/BOARD_MOBILE_CURRENT_PROGRAM_FILTER_DECISION_V1.md#Filter behavior
  - mobile-only filter semantics from STAB-06 v0.3
---

# Dementor Club — Board View Model v1

## Decision

Board remains the persistent spatial map of club life.

The underlying Board architecture keeps its dimensions separate:

- object type;
- Artifact subtype;
- source/ownership;
- Current Program affiliation/context;
- lifecycle;
- relations;
- camera/focus.

The user-facing **View** control must not expose those dimensions as hidden simultaneous filter state.

Canonical UI rule:

```text
one active Board View at a time
```

The canonical View modes are:

```text
ВСЁ
ТЕКУЩАЯ ПРОГРАММА
ОБЪЯВЛЕНИЯ / ПУБЛИКАЦИИ
СОБЫТИЯ
КУРСЫ / ПРОГРАММЫ
ПРАКТИКИ
ПРОЕКТЫ / ПРОДУКТЫ
СТАТЬИ / КОНТЕНТ
```

Selecting one View replaces the previous View.

No hidden compound state such as:

```text
type = program
+
currentProgramOnly = true
```

may remain user-visible behavior in v1.

## Architecture mapping

The UI View model is a presentation projection over canonical data, not a replacement for the data model.

### Object type

Canonical object-type semantics remain owned by Board Information Architecture v1 and the existing Board entity model.

### Artifact subtype

Artifact subtypes remain:

```text
announcement
post
idea
request
```

They are card identity badges, not top-level parallel filter state.

Do not create a canonical `FREE_IDEA` / `СВОБОДНАЯ ИДЕЯ` type.

An Idea outside Current Program is simply:

```text
ИДЕЯ
```

An Idea inside Current Program may display:

```text
ИДЕЯ
В ПРОГРАММЕ
```

### Current Program

Current Program is canonically an affiliation/context dimension.

Its composition/truth stays owned by `current-program-v1.js`.

For UI navigation it is exposed as one canonical Board View:

```text
ТЕКУЩАЯ ПРОГРАММА
```

Membership in this View is derived only from exact canonical identity (`thingRef`, source kind/type + slug bridge, canonical route as needed).

Never match by title.

Never infer Current Program membership from generic Board Relations.

### МОЁ

`МОЁ` is a locator/focus action, not a canonical object-type filter.

It must locate/focus the user's own Board object using the existing canonical owner.

It must not silently establish a persistent View mode.

### Relations

Relations visibility is a presentation layer toggle.

It must not change the visible Thing set and is not part of the View filter taxonomy.

### Lifecycle

No lifecycle View/filter is added in v1.

Historical/current meaning remains expressed by canonical lifecycle + presentation rules from Board Information Architecture v1.

## Camera contract

The following responsibilities remain separate:

```text
1. Thing existence
2. View-visible set
3. persisted spatial position
4. current camera
```

Changing View changes only the visible set.

After a user selects a View, the spatial camera must fit the resulting visible set so the result is immediately understandable.

This camera fit must not mutate persisted card positions.

After the automatic fit, normal user pan/zoom remains free.

## Cross-device semantics

The canonical View semantics are the same on desktop and mobile.

Responsive layouts may present the controls differently, but the meaning and available View modes must not diverge by device.

Mobile:
- standalone Current Program strip remains suppressed so Board owns the first frame.

Desktop:
- existing standalone Current Program presentation may remain as a presentation surface;
- the canonical View control must still expose the same View semantics as mobile.

The standalone desktop Program surface is not a second filter owner.

## Card badges

Cards explain identity/context directly.

Use existing canonical labels:

- Artifact subtype badge;
- platform source/entity type badge;
- secondary `В ПРОГРАММЕ` badge for exact Current Program matches.

Badges are descriptive and must not mutate entity semantics.

## Ownership

Extend existing owners only:

- `community/board/board-entity-model-v1.js`
- `community/board/board-integrations-v1.js`
- `community/board/board-fullscreen-v2-1.js`
- `community/board/board-spatial-v1.js`
- existing Board filter/mobile CSS owners and validators.

Do not create:
- second filter system;
- second Program renderer;
- second Board;
- new entity registry;
- new relation semantics.

## Change control

This Decision changes approved Board presentation behavior after owner live QA exposed an unclear compound filter interaction.

It does not change:
- domain entities;
- Artifact subtype semantics;
- relation ontology;
- permissions;
- Membership/DC-9/auth;
- schema/RPC/RLS;
- Current Program composition.

Owner explicitly approved this superseding local design rule on 2026-09-22.

No separate Change Proposal is required for this bounded STAB-06 presentation correction.

## Acceptance

A human must be able to predict each action:

```text
ВСЁ
→ all valid Board Things visible

ТЕКУЩАЯ ПРОГРАММА
→ exact Current Program Things visible

КУРСЫ / ПРОГРАММЫ
→ Course/Program Things visible

ПРОЕКТЫ / ПРОДУКТЫ
→ Project/Product Things visible
```

At all times:
- exactly one View is active;
- no stale hidden compound state remains;
- changing View fits the visible result set;
- `ВСЁ` restores and fits all valid Things;
- `МОЁ` remains locator/focus;
- Relations remains independent presentation layer;
- desktop/mobile semantics match.
