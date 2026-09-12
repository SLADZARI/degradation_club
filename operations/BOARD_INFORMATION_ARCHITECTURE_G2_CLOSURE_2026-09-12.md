---
artifactId: dementor-club.evidence.board-information-architecture-g2-closure-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G2_INVENTORY
status: COMPLETE_EVIDENCE
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
branch: agent/board-information-architecture-v1
productionBaseline: fe7a86a024f1c316c93b800ba66e70933082e927
---

# Board Information Architecture v1 — G2 Inventory Closure

## Outcome
G2 inventory is complete enough to define Batch A without inventing new semantic owners.

No production merge, deployment or live database mutation is authorized by this closure.

## 1. Member Board read owner

`community/board/board.js` currently reads only:

- `visibility='community'`;
- `status='active'`;
- then client-filters `expires_at <= now()` out.

Therefore Member/Dementor/Owner Board is live-only by implementation even though existing Artifact RLS already permits Member/Owner reads for `active / expired / archived` community Artifacts.

Batch A does not need a second Member history store. It needs the existing Board query/render path extended to current + historical records.

## 2. Artifact detail owner and Guest defect

`community/artifact/artifact.js` currently gates the whole detail page on `membership_active` before loading the Artifact.

This conflicts with approved Board IA v1 because authenticated Guest and Applicant may read Community history and open Board objects.

Direct DB RLS also currently blocks Guest from selecting `dc_artifacts`, `dc_artifact_media`, `dc_member_public_profiles` and private storage objects through the Member-only policies. Therefore removing the frontend gate alone would be incorrect.

Batch A requires one canonical Guest-safe detail read path rather than broad accidental table exposure.

## 3. Historical interactions — existing enforcement

### Responses
Current Member and Guest response INSERT policies already require a live/current Artifact (`status='active'` and not past `expires_at`).

This matches the approved rule that new responses are frozen on expired/archived cards.

No second response subsystem is needed. Batch A should make the disabled historical UI explicit and keep the existing write boundary.

### Reactions
Current Member reaction INSERT policy and Guest `dc_guest_board_interest_toggle_v1` both require live/current Artifact state.

This conflicts with approved history semantics: historical cards remain reactable.

Batch A must extend the existing canonical reaction owners to `active / expired / archived` Community Artifacts while keeping removed/draft/publishing excluded.

## 4. Spatial ownership and history coverage

Live data snapshot:

- 8 Community Artifacts total;
- 3 stale `active + expires_at <= now()`, all 3 have persisted positions;
- 2 `expired`, both have persisted positions;
- 3 `archived`, only 1 has a persisted position;
- therefore 2 old archived Artifacts currently rely on runtime placement if made visible.

`dc_artifact_board_positions` rows are not deleted when an Artifact expires or is archived. Existing persisted history positions can therefore be reused directly.

The existing `dc_ensure_artifact_board_position_v1` trigger creates a position only when an Artifact becomes a current live Community Artifact. It does not backfill already historical legacy rows.

Batch A should use the existing deterministic fallback for historical rows without positions. A new history-position table is not justified.

## 5. Important spatial implementation debt found

The current Board has overlapping coordinate responsibilities:

1. `board-spatial-v1.js` places cards, provides deterministic fallback and contains its own drag/persist implementation;
2. `board-layout-v2.js` collision-adjusts cards without persisted positions;
3. `board-own-drag-livefix-v2-1.js` re-centers the raw position cloud and also owns ordinary Member drag persistence.

This is not three semantic Board owners, but it is runtime overlap that must be preserved carefully during Batch A and harmonized later rather than adding a fourth layer.

Critical constraint mismatch explains the current livefix:

- browser spatial world = `12000 × 8000`;
- DB persisted position constraints = `x 0..5000`, `y 0..3500`;
- `board-own-drag-livefix-v2-1.js` stores raw DB coordinates while applying a display offset into the larger visual world.

Therefore Batch A must **not** casually persist 12000×8000 display coordinates into `dc_artifact_board_positions` or remove the livefix while this constraint remains.

For canonical entity projections, the already-existing deterministic platform placement in `board-spatial-v1.js` is the safest v1 owner: stable display placement without creating a parallel persistence table.

## 6. Fullscreen/mobile ownership map

`/workspace/board/` loads one canonical shell and these active responsibilities:

- `board-entry-v2.js` — user state and Guest vs Member Board entry;
- `board.js` — canonical Member Artifact composer/list/interactions;
- `board-integrations-v1.js` — filters + entity projection integration owner;
- `board-spatial-v1.js` — spatial world, camera, base placement and movement responsibility;
- `board-layout-v2.js` — collision layout for non-persisted Artifact cards;
- `board-fullscreen-v2-1.js` — fullscreen open-card overlay, navigator, primary create CTA;
- `board-own-drag-livefix-v2-1.js` — current own-card display-offset/persistence compatibility layer;
- Workspace shell remains outside Board ownership.

Mobile uses the same runtime owners; touch pan/pinch is implemented in `board-spatial-v1.js`, with mobile presentation supplied by Board CSS rather than a separate mobile Board data/runtime owner.

## 7. Canonical entity read boundary

Existing entity projection model/integration code already exists, but direct entity reads are protected by `dc_can_read_entity`.

Current `dc_can_read_entity` requires active membership and either Owner Admin or an active `dc_entity_assignments` row for that profile/entity.

Consequences:

- authenticated Guest/Applicant cannot directly read canonical entities;
- ordinary Members cannot necessarily read every canonical entity;
- simply enabling the existing fullscreen `loadPlatformProjections()` direct-table query would violate the approved Board projection goal or return incomplete results depending on assignment.

Batch A therefore needs a **Board-specific safe projection read RPC** that returns only the fields approved for Community Board projection, without changing the deeper canonical entity access boundary.

This extends Board presentation; it does not make Guest a general entity reader.

## 8. Person ↔ entity participation existing owner

`dc_entity_assignments` is the canonical existing-equivalent candidate.

Current live data:

- 2 active rows;
- roles currently observed: `author`, `dementor`;
- assignment RLS allows SELECT only for the assigned profile or Owner Admin;
- no general authenticated write policy was found.

This confirms Batch C must extend canonical assignment semantics deliberately rather than creating `board_participants` or inferring participation from a Board line.

No Batch A mutation is required here.

## 9. Generic relation inventory

Schema-wide relation-like inventory found no existing canonical typed Artifact↔Artifact / Artifact↔Entity relation table.

Related but non-equivalent owners are:

- `dc_artifacts.promoted_entity_id/type` — promotion pointer, explicitly not the generic relation owner;
- `dc_entity_assignments` — Person↔Entity assignment;
- `dc_artifact_slot_grants.source_entity_id` — slot provenance;
- `mp_project_assignments` — Modern Pilgrims system/project assignment and outside the Community Board canonical relation boundary.

A new typed generic Board relation owner remains justified for Batch C, not Batch A.

## 10. Artifact subtype constraint

Current DB constraint is exactly:

`artifact_type = 'notice'`.

So Batch B explicit subtypes require a real schema constraint/function/composer migration. They cannot be implemented as frontend labels alone if the approved semantic subtype values are to be canonical.

No subtype mutation belongs in Batch A.

## 11. Lifecycle normalization conclusion

Current stored truth has 3 stale active rows.

Time passage cannot be handled by an ordinary row trigger alone. The existing publisher RPC only expires the publishing user's own stale records opportunistically.

Batch A needs one canonical normalization responsibility. Do not add multiple independent normalizers in frontend, publish RPC and separate jobs.

Minimal direction for build:

- introduce one canonical lifecycle-normalization DB function;
- invoke it from the canonical Board read path(s) before returning Board state, so Board observation deterministically reconciles stale active rows;
- keep publish-time normalization only as compatibility until it can safely delegate to the same owner;
- do not add a scheduler unless validation proves read-time normalization insufficient.

This avoids a second lifecycle system while correcting stored state whenever Board truth is consumed.

## 12. Batch A minimal diff

### Database / RPC

A1. Add one canonical lifecycle normalizer for stale Community Artifacts.

A2. Extend/replace `dc_guest_board_read_v1` through its canonical name or a clearly versioned successor so it returns current + historical Community Artifact rows and historical state fields needed by UI.

A3. Extend Guest interest toggle to historical Community Artifacts.

A4. Extend Member canonical reaction INSERT authorization to historical Community Artifacts.

A5. Add one Guest-safe Artifact detail RPC returning only Board-approved Artifact detail fields, public author identity, reaction counts, Guest-interest state, media descriptors and existing own-response state where applicable.

A6. Add narrowly scoped Guest storage SELECT authorization only for media attached to Board-readable published Community Artifacts; do not expose the whole private bucket or draft media.

A7. Add one Board-safe canonical entity projection read RPC. It returns only confirmed Board projection fields for Event / Program / Project and their Event/Program extension fields. It does not replace canonical entity RLS or `dc_can_read_entity`.

### Frontend

A8. `board.js`: render `active / expired / archived` Community Artifacts instead of live-only; stop client-hiding past `expires_at`; mark historical state for presentation and disable new responses on history.

A9. `board-entry-v2.js`: render Guest current + historical rows from the canonical Guest Board RPC; preserve Guest reaction path; mark history.

A10. `artifact.js`: replace blanket Membership gate with canonical Board-state-aware Guest read path; historical response CTA is disabled; historical reaction remains available through the correct Member or Guest owner.

A11. `board-integrations-v1.js`: remove fullscreen projection suppression and load projections through Board-safe RPC instead of direct canonical entity table reads.

A12. `board-spatial-v1.js`: keep existing Artifact positions; use deterministic fallback for the two historical rows without positions; use existing deterministic platform projection placement. Do not add a second position table in Batch A.

### Explicitly deferred

- Artifact subtypes and filter redesign → Batch B;
- typed generic relations and participation UI → Batch C;
- board-hide and continuous aging tuning → Batch D;
- coordinate-system cleanup / retirement of `board-own-drag-livefix-v2-1.js` only after dedicated regression evidence proves one spatial owner can replace the compatibility layer safely.

## 13. Rollback boundaries for Batch A

Batch A must remain reversible without data loss.

Rollback rules:

- no destructive table rewrite;
- lifecycle normalization only changes stale `active` rows to canonical `expired`; this is semantically forward-only correction, not deletion;
- new/changed RPCs and policies must be reversible by restoring prior definitions from tracked migrations;
- no existing Artifact/history/position row is deleted;
- no canonical Event/Program/Project source row is mutated by Board projection reads;
- no entity assignment is mutated;
- no relation schema is introduced in Batch A;
- frontend rollback must still leave current production data readable by the previous live-only Board behavior.

## 14. G2 closure verdict

**G2 INVENTORY: PASS / COMPLETE FOR BATCH A START.**

The minimal Batch A owner map is now known, current conflicts are recorded, and no unresolved inventory gap requires creating a parallel system.

Next gate: **G3 BUILD — BATCH A**.
