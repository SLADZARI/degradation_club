---
artifactId: dementor-club.evidence.board-information-architecture-batch-b-inventory-2026-09-12
project: dementor-club
documentType: INVENTORY
projectStage: BUILD
gate: G3_BUILD_BATCH_B
status: EVIDENCE
version: 1.0
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
integrationBranch: agent/board-information-architecture-v1
---

# Board Information Architecture v1 — Batch B inventory

## Authority

Approved semantic source:

- `operations/BOARD_INFORMATION_ARCHITECTURE_V1.md` §6–7.

Batch B must add explicit Artifact subtypes and harmonize Board filters without creating a second publication owner or changing membership/slot semantics.

## Existing Artifact owner

Canonical storage remains:

`public.dc_artifacts`

Current production inventory at 2026-09-12:

- total Artifact rows: 8;
- all 8 currently have `artifact_type='notice'`;
- current constraint: `dc_artifacts_type_check CHECK (artifact_type = 'notice')`.

Existing IDs/history/positions/reactions/responses must be preserved. A new publication table is not required and is prohibited by the approved architecture.

## Existing authoring owner

Canonical composer/runtime remains:

- `community/board/board.js`;
- `dc_create_artifact_draft_v1`;
- `dc_update_artifact_draft_v1`;
- `dc_publish_artifact_v1`.

Current create RPC inserts the literal `artifact_type='notice'`.

Current publish RPC owns membership/OwnerAdmin authorization, slot accounting and activation. Batch B must not duplicate or replace that ownership.

Database dependency preflight found no dependent DB object on the current create/update draft RPC signatures.

## Minimal subtype strategy

Use the existing `dc_artifacts.artifact_type` column as the only subtype owner.

Canonical persisted publication values:

- `announcement`;
- `post`;
- `idea`;
- `request`.

Migration strategy:

1. map existing `notice` rows in-place to `announcement`;
2. replace the type constraint with the four approved values;
3. update the existing create RPC in-place so a new draft defaults to `announcement`;
4. add one narrow draft-only command `dc_set_artifact_subtype_v1(artifact_id, subtype)` so the existing canonical composer can change subtype before publish;
5. keep `dc_publish_artifact_v1` membership/slot semantics unchanged.

No Artifact ID, history row, position, reaction or response is recreated.

## Existing filter owner

Current owner:

`community/board/board-entity-model-v1.js` + `community/board/board-integrations-v1.js`.

Current source controls:

- ВСЁ;
- ОТ ЛЮДЕЙ;
- ОТ КЛУБА.

Current detail controls:

- МЕРОПРИЯТИЯ;
- ПРОГРАММЫ;
- КУРСЫ;
- ПРАКТИКИ;
- ФОРМИРУЕТСЯ;
- ПРОЕКТЫ.

Approved v1 requires one default source view `ВСЁ`, no lifecycle filter, and object-type filters:

- Объявления / публикации;
- События;
- Курсы / программы;
- Практики;
- Проекты / продукты;
- Статьи / контент.

`ФОРМИРУЕТСЯ` is therefore removed as a global filter. Entity lifecycle/status remains visible on the card but does not become a cross-object filter.

## Representation boundary

Member Artifact subtypes all remain under the single Board family `Объявления / публикации`.

Subtype is a semantic label, not a separate card system or access model.

Canonical Event/Program/Project cards remain entity projections. `Статьи / контент` may legitimately have zero canonical projections in v1 because no separately approved Content owner exists; Batch B must not invent a CMS to populate that filter.

## Risk boundary

Batch B must not change:

- membership lifecycle;
- first-Artifact activation;
- slot accounting;
- Artifact archive/history semantics from Batch A;
- relation schema/UI;
- board-hide;
- continuous aging;
- spatial position ownership.

Production code merge/deploy remain unauthorized.
