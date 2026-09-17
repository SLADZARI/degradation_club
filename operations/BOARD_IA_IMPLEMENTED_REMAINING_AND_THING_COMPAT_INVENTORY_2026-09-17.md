---
artifactId: dementor-club.evidence.board-ia-implemented-remaining-thing-compat-2026-09-17
project: dementor-club
documentType: INVENTORY
projectStage: CLARITY
gate: G3_CLARITY
status: ACTIVE_EVIDENCE
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
basis:
  - operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
  - .weekly-os/results/board-information-architecture-v1.v0.17.md
  - thing-projection-v1.js
productionObservedAt: 23d4266a4009d34042b29ec1fb73fb0cbad6b62e
---

# Board IA v1 — implemented vs remaining + ThingProjection compatibility inventory

> **NON-AUTHORITATIVE OPERATIONAL EVIDENCE.** This inventory does not approve new semantics, does not replace `operations/BOARD_INFORMATION_ARCHITECTURE_V1.md`, does not create a roadmap authority, and does not authorize runtime/schema mutation.

## 1. Authority boundary

Approved Board IA v1 remains the project-local authority. Its implementation sequence is:

`Batch A — lifecycle/history + canonical entity projections → Batch B — filter harmonization → Batch C — relation model + permissions + canvas/detail UI → Batch D — cleanup / board-hide / continuous-aging tuning / regression hardening`.

The three parked Board Results remain QA/release tails and are not blockers for unrelated P0 Results #200/#202. They close when legitimate live evidence becomes available.

## 2. Implemented vs remaining

### Batch A — IMPLEMENTED / RELEASED

Observed production implementation includes:

- deterministic Artifact lifecycle normalization `active → expired` when `expires_at <= now()`;
- historical Artifact read for `active / expired / archived`;
- historical Guest detail/read/reaction support with response freeze rules preserved elsewhere;
- canonical entity projection RPC `dc_board_entity_projection_read_v1()` over `dc_entities` + `dc_events` + `dc_programs`;
- Board adapter `entityToBoardProjection()` and runtime rendering through `board-integrations-v1.js`;
- current Board route loads the canonical integrations/spatial/layout stack.

Caveat: the current canonical-entity Board adapter is physically keyed by `dc_entities` UUID and therefore represents only entities present in that implementation store. This is an implementation limitation, not Product authority.

### Batch B — IMPLEMENTED / RELEASED

Observed production implementation includes:

- canonical Artifact subtypes `announcement / post / idea / request`;
- existing draft/publication owner extended in place rather than duplicated;
- Board source view reduced to `ВСЁ` plus object-type drawer;
- object-type filters for Artifact, Event, Program/Course, Practice, Project/Product and Content;
- source and object type kept as separate dimensions in the runtime model.

### Batch C Relations — NOT IMPLEMENTED

No production migration/runtime owner was found for the approved Board relation graph:

- no separately persisted typed relation fact with source + target refs;
- no approved relation kinds projected on canvas/detail;
- no relation permission owner for Member-originated Artifact relations, scoped canonical entity owner/Dementor relations, or Owner Admin all-relations authority;
- no `SHOW RELATIONS / HIDE RELATIONS` Board layer;
- no stable cross-source endpoint identity contract suitable for relations.

`dementor-relations-v1.js` is **not** Batch C. It is an older page-DOM helper that adds static Dementor profile links to selected course/event/profile pages and contains no persisted Board relation graph.

### Batch D — PARTIAL

Implemented portions:

- Artifact history remains readable after expiry/archive;
- Artifact `board_hidden_at / board_hidden_by` exists;
- Owner Admin Artifact board-hide preserves canonical Artifact/history;
- hidden Artifact moderation read exists;
- Board Artifact reads/interactions honor `board_hidden_at is null`;
- lifecycle normalization exists.

Remaining approved scope:

- board-hide semantics for canonical entity projections, not only Artifacts;
- continuous historical visual aging with an accessibility floor;
- final cleanup/regression hardening after Relations;
- confirm that aging/hide remains presentation/governance and does not mutate source-object authority.

Therefore Board IA v1 is **not** merely a QA-tail. A/B are released; C remains substantive unbuilt approved scope; D is partial.

## 3. ThingProjection ↔ current Board projection compatibility inventory

### Proven ThingProjection identity

ThingProjection Runtime v1 established semantic refs such as:

- `program:dengi-na-veter`
- `project:dementor-lab`

`thingRef` is the only currently proven cross-context stable identity field. ThingProjection is a thin read contract, not a universal registry or mutation authority.

### Current Board identity

Current canonical-entity Board projection builds runtime identity as:

- `id = entity:<dc_entities UUID>`
- `sourceId = <dc_entities UUID>`
- `sourceType = event/program/project/...`

This is valid as a Board implementation locator for entities already represented in `dc_entities`, but it is **not safe as the universal relation endpoint identity**.

### Compatibility gap

1. `project:dementor-lab` has an approved canonical Project identity without requiring a `dc_entities` row.
2. Current Board entity projection cannot represent that Project unless a `dc_entities` implementation row happens to exist.
3. A relation owner built directly on Board `entity:<uuid>` would therefore force cross-source identity through a temporary Board/DB representation and contradict the ThingProjection boundary.
4. Program/Event/Project physical storage is not uniform; Relation identity must not imply that it is.
5. Member Artifact identity is already physically stable as its canonical Artifact UUID, but a relation endpoint contract still needs an explicit typed semantic ref boundary rather than DOM/card IDs.

### Constraint before Batch C implementation

Before Relations runtime starts, the successor/continuation Result must define one **adapter-level relation endpoint contract** that can consume canonical semantic refs without creating a universal Thing registry.

Safe direction to validate, not yet an approved new contract:

- canonical Thing-capable source objects expose/resolve a stable semantic ref (`thingRef` where already proven);
- Artifact endpoints retain canonical Artifact identity through a typed ref such as an adapter-produced Artifact ref;
- Participant/assignment endpoints use their own canonical assignment/person owner;
- Board card IDs and `dc_entities` UUIDs remain implementation locators, never global semantic identity by themselves;
- relations remain separately persisted facts and do not become source-object owners.

This compatibility gap requires its own explicit semantic resolution before Batch C implementation. It must not be silently folded into a Board-only DB identity. Issue #204 concerns Fuengirola onboarding/access policy and is unrelated; #204 remains a parallel decision package and neither blocks #200/#202 nor supplies the relation identity decision.

## 4. Continuation conclusion

Do **not** reopen the historical Board IA Result v0.17 as if only QA remains, and do not implement Relations inside an unrelated Result.

After #200/#202 runtime work and after the relation endpoint compatibility decision is explicit, use a dedicated Board IA continuation/successor Result for Batch C and the remaining Batch D scope. Existing WAITING Board Results remain separately parked for legitimate live evidence.
