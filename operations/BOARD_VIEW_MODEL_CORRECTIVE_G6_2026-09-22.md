---
artifactId: dementor-club.operations.board-view-model-corrective-g6-2026-09-22
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

# STAB-06 · Board View Model corrective · G6 validation

## Authority

Approved local decision:

`operations/BOARD_VIEW_MODEL_DECISION_V1.md`

Live QA evidence:

`operations/BOARD_VIEW_LIVE_QA_CORRECTIVE_2026-09-22.md`

## Exact identity

Production baseline:

`d4d1e2f45883beff973a5cd5827e6f71065c0575`

Integration branch:

`result/board-mobile-information-hierarchy-v1`

Validated corrective candidate:

`155565786ac969c63a692006c145e4f4e266090d`

Draft PR:

`#239`

Canonical validation:

```text
Site Integrity / Release Readiness #1241
run id = 35773470724
head SHA = 155565786ac969c63a692006c145e4f4e266090d
status = COMPLETED
conclusion = SUCCESS
```

## Corrective behavior

The user-facing compound state:

```text
activeFilter
+
currentProgramOnly
```

was removed.

Canonical presentation state is now:

`one active Board View`

Views:

- `ВСЁ`
- `ТЕКУЩАЯ ПРОГРАММА`
- `ОБЪЯВЛЕНИЯ / ПУБЛИКАЦИИ`
- `СОБЫТИЯ`
- `КУРСЫ / ПРОГРАММЫ`
- `ПРАКТИКИ`
- `ПРОЕКТЫ / ПРОДУКТЫ`
- `СТАТЬИ / КОНТЕНТ`

Selecting a View replaces the previous View.

Current Program membership remains exact-only through canonical thingRef/source-type+slug identity and `getCurrentProgram()`.

No title matching and no Relations-derived affiliation.

## Camera corrective

Initial browser run #1239 exposed a real camera-fit blocker: the historical minimum scale of `0.28` could not fit widely distributed visible Things on mobile.

The canonical spatial owner was corrected to allow a wider fit range.

This changes camera only.

Persisted card coordinates are not mutated by View fit.

After fit, manual zoom remains available.

## Browser evidence

Existing Board navigation/adaptive-card regression now runs the required sequence on:

- 390;
- 360;
- desktop 1440.

Sequence:

```text
ВСЁ
→ ТЕКУЩАЯ ПРОГРАММА
→ КУРСЫ / ПРОГРАММЫ
→ ПРОЕКТЫ / ПРОДУКТЫ
→ ВСЁ
```

PASS assertions include:

- exactly one active View;
- expected visible Thing set;
- no stale Current Program condition;
- same-title false-positive guard;
- camera fits each visible set;
- pager reflects each visible set;
- persisted `left/top` unchanged across View changes;
- Artifact badges for announcement/post/idea/request;
- platform type badges;
- `В ПРОГРАММЕ` exact-match only;
- `МОЁ` is locator/focus and does not establish a mine filter;
- Relations show/hide does not alter the visible Thing set;
- desktop/mobile View semantics equal;
- mobile standalone Program strip absent;
- desktop Program presentation unchanged;
- zoom remains free after fit;
- no horizontal overflow;
- drawer focus returns to the existing View trigger.

Canonical CI log:

```text
Board navigation/adaptive cards browser acceptance passed:
one-active View sequence on 390/360/desktop +
exact Program identity +
camera fit/pager/coordinate invariance +
canonical badges +
МОЁ locator +
relations-visible-set invariance +
adaptive media
```

Additional existing regressions PASS:

- Board mobile harmonization;
- Board Relations runtime browser acceptance;
- canonical drag line updates;
- Board v2.1 fullscreen composition contract;
- Board Information Architecture Batch B contract;
- Current Program v1 contract;
- production route manifest;
- production release guard.

## Boundary

`current-program-v1.js` remains byte-identical to production.

No changes to:

- Current Program composition/order/content;
- Artifact subtype semantics;
- relation ontology/permissions;
- BQA-15;
- BQA-17;
- BQA-22;
- Contribution;
- Membership / DC-9;
- auth;
- schema / RPC / RLS;
- STAB-05;
- STAB-07.

Schema mutation = NO.

Semantic domain mutation = NO.

Change Proposal = NO.

## G6 verdict

`PASS`
