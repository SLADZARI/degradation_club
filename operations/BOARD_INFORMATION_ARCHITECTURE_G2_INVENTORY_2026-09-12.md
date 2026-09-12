---
artifactId: dementor-club.evidence.board-information-architecture-g2-inventory-2026-09-12
project: dementor-club
documentType: INVENTORY
projectStage: BUILD
gate: G2_INVENTORY
status: ACTIVE_EVIDENCE
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
branch: agent/board-information-architecture-v1
productionBaseline: fe7a86a024f1c316c93b800ba66e70933082e927
---

# Board Information Architecture v1 — G2 Inventory

## Purpose
Pre-mutation inventory for the active Board Information Architecture Result. This document records current production/runtime owners and gaps before Batch A implementation. It is evidence, not a new semantic decision.

## 1. Branch and baseline

Active integration branch:

`agent/board-information-architecture-v1`

Created from exact production baseline:

`dementor-club-production@fe7a86a024f1c316c93b800ba66e70933082e927`

No production merge, deployment or live database mutation is authorized by this inventory.

## 2. Current Artifact lifecycle data

Read-only live Supabase inventory on 2026-09-12:

- `dc_artifacts`: 8 rows total;
- DB `active`: 3;
- `expired`: 2;
- `archived`: 3;
- stale `active + expires_at < now()`: 3;
- `dc_artifact_board_positions`: 6 rows.

Confirmed defect: all currently `active` Artifact rows are already past `expires_at`, so stored lifecycle and visible runtime state disagree.

Existing `dc_publish_artifact_v1` only normalizes expired active rows for the publishing user's own artifacts at publish time. It is not a general lifecycle normalizer.

## 3. Current Guest read owner

Canonical Guest list read is `dc_guest_board_read_v1`.

Current contract is live-only:

- authenticated session required;
- `visibility='community'`;
- `status='active'`;
- `published_at IS NOT NULL`;
- started now;
- not past `expires_at`.

Therefore the approved persistent-history model cannot be implemented only by frontend changes. The canonical Guest read path itself must be extended or replaced without creating a parallel Guest Board owner.

## 4. Current Guest interaction owners

### Reaction
`dc_guest_board_interest_toggle_v1` is a dedicated Guest-interest owner and currently rejects any target that is not live/current.

Approved architecture requires historical cards to remain reactable, so this canonical path needs a controlled history-aware extension.

### Response
`dc_guest_board_response_submit_v1` is the Guest response owner.

Approved architecture freezes new responses on expired/archived targets. Existing current RLS/RPC behavior must be verified to reject history explicitly rather than relying on accidental visibility filtering.

## 5. Current close/archive owner

`dc_close_artifact_v1` already preserves objects:

- own draft → `removed`;
- `active`/`expired` → `archived`;
- archived/removed are not hard-deleted;
- Owner Admin can close another community Artifact within the existing moderation boundary.

This owner should be extended only where needed; no second archive/history mechanism is justified.

## 6. Current Guest frontend owner

`community/board/board-entry-v2.js` resolves Board state and sends non-member authenticated states through `renderGuestBoard()`.

That function calls `dc_guest_board_read_v1` and currently renders an empty state saying there are no live Member Artifacts when the RPC returns zero.

This is the exact frontend reason `modernpilgrimsteam` showed `0 / 0` while historical records still existed.

## 7. Canonical entity projection code already exists

Existing owners:

- `community/board/board-entity-model-v1.js`;
- `community/board/board-integrations-v1.js`.

The model already supports:

- `ARTIFACT`;
- `ENTITY_PROJECTION`;
- `SYSTEM` source modes;
- Event / Program / Course / Practice / Project projection shapes;
- canonical routes for Event / Program / Project;
- source/type filtering.

However `board-integrations-v1.js` explicitly disables entity projections when the fullscreen Workspace Board class is present. Thus Batch A should extend this existing integration owner, not create a second projection subsystem.

## 8. Current filters conflict with approved v1 taxonomy

Existing code exposes:

Primary:
- `ВСЁ`;
- `ОТ ЛЮДЕЙ`;
- `ОТ КЛУБА`.

Detail:
- `МЕРОПРИЯТИЯ`;
- `ПРОГРАММЫ`;
- `КУРСЫ`;
- `ПРАКТИКИ`;
- `ФОРМИРУЕТСЯ`;
- `ПРОЕКТЫ`.

Approved Board Information Architecture v1 instead requires object-type filters:

- Объявления / публикации;
- События;
- Курсы / программы;
- Практики;
- Проекты / продукты;
- Статьи / контент.

No lifecycle filter is required. `ФОРМИРУЕТСЯ` is therefore a retirement candidate unless another canonical owner proves it necessary.

## 9. Current canonical entities

Read-only live inventory:

- `dc_entities`: 5 rows;
- Event: 1 planned;
- Program: 4 across active / approved-draft / mvp-in-development / planned states.

No Project rows are currently present in `dc_entities` at this snapshot, but the entity model already supports `project` routing.

Entity visibility must remain governed by canonical source/provenance semantics, not by creating Board-owned duplicates.

## 10. Person ↔ entity participation owner already exists

Live schema already contains `dc_entity_assignments` with 2 rows.

Columns include:

- `profile_id`;
- `entity_id`;
- `role`;
- `status`;
- validity range;
- source/provenance metadata.

This is a strong existing-equivalent candidate for the approved canonical Person ↔ Project/Event participation relation.

Therefore Batch C must inventory and extend `dc_entity_assignments` before considering any new person-participation relation table. Board relation lines must project canonical participation rather than duplicate it.

## 11. Generic Board relation owner gap

Current inventory still finds no canonical generic Artifact↔Artifact / Artifact↔Entity typed relation owner matching the six approved meanings:

- RELATED_TO;
- RESULT_OF;
- CONTINUES;
- ABOUT;
- PARTICIPATES_IN;
- REPORT_OF.

`promoted_entity_id/type` is not approved for repurposing as this owner.

A new generic relation owner may therefore be justified in Batch C, but only after full schema/RPC/RLS inventory confirms no equivalent exists.

## 12. Batch A initial conclusion

Batch A should extend existing canonical owners in this order:

1. lifecycle normalization around `dc_artifacts`;
2. Guest/member historical reads using existing Board read paths;
3. historical reaction/response rules using existing interaction owners;
4. historical Artifact detail authorization;
5. existing entity projection model/integration layer;
6. existing Board spatial responsibility for stable projection placement.

Do not build relations or new filter taxonomy until Batch A behavior passes targeted validation.

## 13. Still required before G2 closes

- inspect member Board `board.js` current/full history query path;
- inspect `/community/artifact/:id/` authorization and data-read owner on the active branch;
- inspect RLS policies for Artifact/history reads and historical interaction writes;
- inspect spatial-position behavior for archived/expired rows and non-Artifact projection placement;
- inventory all relation-like schema objects and RPCs, not only obvious table names;
- inspect `dc_entity_assignments` RLS/RPC ownership and roles;
- map current mobile/fullscreen Board scripts to canonical responsibilities;
- record exact migration candidates and rollback boundaries before schema mutation.

Until these are closed, Result remains **G2_INVENTORY**, not BUILD/G3.
