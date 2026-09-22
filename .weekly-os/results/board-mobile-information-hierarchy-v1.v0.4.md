---
artifactId: dementor-club.result.board-mobile-information-hierarchy-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: REVIEW
workStatus: ACTIVE
version: 0.4
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.3
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
integrationBranch: result/board-mobile-information-hierarchy-v1
integrationBaseRef: dementor-club-production
integrationBaseCommit: d4d1e2f45883beff973a5cd5827e6f71065c0575
productionBaseCommit: d4d1e2f45883beff973a5cd5827e6f71065c0575
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
liveRetestStatus: CORRECTIVE_REQUIRED
---

# MP | Dementor Club | BUILD | Board Mobile Information Hierarchy v1 | Result v0.4

## Work status

**ACTIVE / G5_BUILD — LIVE CORRECTIVE REQUIRED**

The first STAB-06 production release is deployed at:

`d4d1e2f45883beff973a5cd5827e6f71065c0575`

Owner live QA found the mobile first-frame objective successful, but the filter/View interaction is not accepted.

Evidence:

`operations/BOARD_VIEW_LIVE_QA_CORRECTIVE_2026-09-22.md`

Approved corrective authority:

`operations/BOARD_VIEW_MODEL_DECISION_V1.md`

## Corrective goal

Replace hidden compound filter behavior with one canonical cross-device Board View model.

Canonical View modes:

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

Exactly one View is active at a time.

## Runtime requirements

1. Rebase/sync the Result branch from exact current production `d4d1e2f4...` before corrective mutation.
2. Remove user-facing two-dimensional state `activeFilter + currentProgramOnly`.
3. Keep Current Program affiliation derivation exact and canonical.
4. Expose Current Program as a View mode, not a hidden second condition.
5. Make View semantics identical on desktop and mobile.
6. Keep mobile standalone Current Program strip suppressed.
7. Desktop standalone Current Program surface may remain; it is presentation only and not a filter owner.
8. Keep card badges:
   - canonical type/subtype;
   - `В ПРОГРАММЕ` exact-match only.
9. `МОЁ` remains locator/focus, not a persistent View.
10. Relations visibility remains independent of View.
11. After every explicit View change, fit the camera to the visible result set without mutating persisted card positions.
12. `ВСЁ` restores all valid cards and fits them into view.

## Canonical owners

Extend existing only:

- `community/board/board-entity-model-v1.js`
- `community/board/board-integrations-v1.js`
- `community/board/board-fullscreen-v2-1.js` if navigator/view state needs canonical ownership there;
- `community/board/board-spatial-v1.js` for fit-visible camera behavior;
- current Board filter/mobile CSS owners;
- existing validators.

No parallel filter/navigation/Board/Program system.

## Required regression sequence

Human-like browser sequence on 390 / 360 / desktop:

```text
ВСЁ
→ ТЕКУЩАЯ ПРОГРАММА
→ КУРСЫ / ПРОГРАММЫ
→ ПРОЕКТЫ / ПРОДУКТЫ
→ ВСЁ
```

At each step assert:

- exactly one View active;
- expected visible Thing set;
- no stale compound Program condition;
- visible result set is within camera viewport after fit;
- pager reflects the visible set;
- no persisted card coordinates changed.

Also verify:

- `МОЁ` locates own Artifact without establishing a hidden persistent View;
- Relations toggle does not change visible Things;
- same-title false-positive guard;
- desktop/mobile View semantics match;
- mobile standalone Program strip remains absent;
- desktop standalone Program presentation remains unchanged;
- pan/zoom/drag remain functional after automatic fit;
- no horizontal overflow;
- accessibility/focus remains valid.

## Scope guard

Do not touch:

- Current Program composition/order/content;
- Artifact subtype semantics;
- entity/domain model;
- relation ontology/permissions;
- BQA-15;
- BQA-17;
- BQA-22;
- Contribution;
- Membership/DC-9/auth;
- schema/RPC/RLS;
- STAB-05 runtime;
- STAB-07.

## Gate

`G5_BUILD`

Stop at a new validated corrective candidate.

No merge/deploy without a new owner release decision.
