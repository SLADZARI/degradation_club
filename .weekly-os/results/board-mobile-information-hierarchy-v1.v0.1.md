---
artifactId: dementor-club.result.board-mobile-information-hierarchy-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
version: 0.1
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
integrationBranch: result/board-mobile-information-hierarchy-v1
productionBaseCommit: 287b485293d68098dfd3c9302785369a735d42e2
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | BUILD | Board Mobile Information Hierarchy v1 | Result v0.1

## Goal

Make the mobile Board first frame belong to the living spatial Board instead of the standalone Current Program strip.

Authority:

`operations/BOARD_MOBILE_CURRENT_PROGRAM_FILTER_DECISION_V1.md`

Parent: #228 — STABILIZATION.

Scope: STAB-06 / BQA-18 only.

## Production baseline

`dementor-club-production@287b485293d68098dfd3c9302785369a735d42e2`

Implementation branch:

`result/board-mobile-information-hierarchy-v1`

Start from exact production.

## Required implementation

Mobile only:

1. Remove the standalone Current Program visual strip/overlay from the first Board viewport.
2. Keep `current-program-v1.js` as the semantic/composition owner.
3. Extend the existing Board filter drawer with an orthogonal Current Program affiliation control.
4. Use exact canonical identity to mark matching Board cards as `В ПРОГРАММЕ`.
5. Add compact card type badges using existing canonical Artifact subtype / platform source type data.
6. Keep default Board filter `ВСЁ`.
7. Keep desktop Current Program presentation unchanged.
8. No persistence for filter/program visibility state.

## Canonical owners to extend

- `current-program-v1.js` — read-only Current Program composition authority;
- `community/board/board-program-v1.js/css` — existing Program presentation owner;
- `community/board/board-integrations-v1.js` — existing Board projection/filter owner;
- `community/board/board-entity-model-v1.js` — existing type/subtype/filter vocabulary;
- `community/board/board-mobile-harmonization-v1.css` — mobile composition owner;
- existing Board mobile/browser validators.

Do not create a second Program/filter/navigation system.

## Identity rule

Use exact identity from `getCurrentProgram()` items:

```text
program:<slug>
project:<slug>
event:<slug>
```

Bridge Board projections to that identity through existing slug/kind/route data.

Never match by title.

Do not infer program affiliation from generic Relations.

## Card badges

Artifact badge:

`artifactSubtypeLabel()` / existing subtype truth.

Platform badge:

existing `sourceType` / canonical projection type.

Secondary badge:

`В ПРОГРАММЕ` only for exact Current Program identity.

Do not create a new `СВОБОДНАЯ ИДЕЯ` entity/type. `ИДЕЯ` without `В ПРОГРАММЕ` is sufficient.

## Acceptance criteria

- mobile 390: standalone Current Program strip absent;
- mobile 360: standalone Current Program strip absent;
- first viewport exposes substantially more spatial Board;
- filter drawer contains a clear Current Program control;
- selecting it isolates exact Current Program cards;
- returning to `ВСЁ` restores all valid Board cards;
- object-type filters and Current Program affiliation compose correctly;
- Artifact type badges correct;
- platform type badges correct;
- `В ПРОГРАММЕ` only on exact canonical matches;
- no title-based matching;
- no relation-derived affiliation inference;
- spatial pan/zoom/pager/MOЁ/relations remain functional;
- desktop Current Program remains unchanged;
- accessibility/keyboard/filter drawer behavior remains intact;
- no schema/RLS/auth/Membership changes;
- exact production→candidate diff contains only STAB-06-owned files;
- stop at validated candidate; no merge/deploy without owner release decision.

## Must not touch

- Current Program composition/order/content;
- Board default `ВСЁ` semantics;
- relation ontology / BQA-15 / BQA-17;
- STAB-05 runtime;
- Project/Event/Course entity semantics;
- BQA-22 creation flow;
- Contribution;
- Membership / DC-9 / auth;
- schema / RPC / RLS;
- generic media pipeline.

## Gate

`G5_BUILD`

```text
schemaMutationAuthorized = false
semanticMutationRequired = false
changeProposalRequired = false
productionMergeAuthorized = false
productionDeployAuthorized = false
gateReadiness = G5_BUILD_IN_PROGRESS
```
