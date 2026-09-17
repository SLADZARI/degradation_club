---
artifactId: dementor-club.evidence.board-relations-g5-persistence-design-2026-09-18
project: dementor-club
documentType: TECHNICAL_CONTRACT_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: READY_FOR_SCHEMA_MUTATION
version: 1.0
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-relations-v1
productionInspectedAt: 2dae3b6ece79652c81af780c049521fda7262726
schemaMutationAuthorized: false
runtimeMutation: false
productionMutation: false
---

# Board Relations v1 — G5 persistence-design checkpoint

## Verdict

**READY FOR SCHEMA MUTATION — SEPARATE OWNER AUTHORIZATION REQUIRED**

This checkpoint proposes the smallest persistence/RPC/RLS design that satisfies the accepted G4 identity contract and G5 pre-persistence contract.

No migration, table, RPC, RLS, runtime JS, CSS, UI or production mutation is performed by this artifact.

## 1. Fresh production persistence inventory

Exact production baseline inspected:

`2dae3b6ece79652c81af780c049521fda7262726`

All 56 current production migrations were inventoried for relation-like persistence, assignment/participation owners, link/reference fields, helper functions and audit/history patterns.

### Dementor Club candidates

| Existing mechanism | What it owns | Reuse verdict |
|---|---|---|
| `dc_entity_assignments` | Person/profile ↔ canonical `dc_entities` assignment; free-text scoped role + lifecycle/provenance | **COMPOSE / REUSE FOR PERMISSION AND PARTICIPATION SOURCE; NOT generic object↔object edge owner** |
| `event_registrations` | event registration/attendance record, keyed by `event_id text`, optional profile, email/full_name, registration status | **KEEP CANONICAL REGISTRATION OWNER; NOT generic relation owner** |
| `course_enrollments` | course enrollment/progress state, keyed by `course_id text`, optional profile, email/full_name | **KEEP CANONICAL ENROLLMENT OWNER; NOT generic relation owner** |
| `dc_artifacts.promoted_entity_type/id` | legacy/reference fields on Artifact | **DO NOT REUSE**; approved Board IA explicitly forbids universal relation ownership here |
| `dc_artifact_slot_grants.source_entity_type/id` | provenance for Artifact slot grant | **NOT SAME CONCEPT** |
| `dc_artifact_reactions` / `dc_guest_board_interests` | reaction/interest | **NOT SAME CONCEPT** |
| `dc_artifact_responses` | response workflow | **NOT SAME CONCEPT** |
| `dc_artifact_promotion_support` | immutable Telegram promotion-support ledger | **NOT SAME CONCEPT**; migration explicitly says it is not the later generic relation graph |
| `dc_distribution_outbox` | distribution delivery state | **NOT SAME CONCEPT** |
| `dc_artifact_board_positions` | spatial layout owner | **NOT IDENTITY / NOT RELATION** |
| `dc_artifact_publisher_overrides` | institutional public publisher presentation for Artifact | **NOT RELATION OWNER** |
| `dc_entities` + typed extension tables | Event/Program mirror/read model | **COMPOSE FOR ENDPOINT VALIDATION ONLY** |
| `dc_board_entity_projection_read_v1()` | Board-safe entity projection read | **COMPOSE; NOT persistence owner** |
| `source_ref` fields | provenance pointers | **NOT semantic relation edges** |
| Artifact lifecycle fields | canonical Artifact history/state | **REUSE FOR ENDPOINT VISIBILITY/VALIDATION; NOT edge owner** |

### Other-system candidates

| Existing mechanism | Verdict |
|---|---|
| `mp_project_refs` / `mp_project_assignments.relation` | Modern Pilgrims / Weekly OS domain. **EXPLICITLY SEPARATE SYSTEM.** |
| `mp_project_artifact_access` | MP project artifact access. **NOT Dementor Club Board relation truth.** |
| `mp_publishing_*` | MP publishing runtime. **NOT Board relation truth.** |
| `dementor-relations-v1.js` | legacy static DOM/page linkage. **NOT persistence / permission owner.** |

### Generic equivalent search result

No current production table or RPC owns:

```text
typed semantic edge
between
canonical Board source tuples
with
Batch C relation meanings
```

No released relation table supports the five generic persisted meanings:

- RELATED_TO;
- RESULT_OF;
- CONTINUES;
- ABOUT;
- REPORT_OF.

No existing canonical equivalent can be safely extended without corrupting its current domain semantics.

**Reuse verdict: NO equivalent. A minimal dedicated Board relation owner is justified.**

## 2. Real helper signatures — production verified

Current production definitions are:

```sql
public.dc_membership_active(
  p_profile_id uuid default auth.uid()
) returns boolean
```

```sql
public.dc_has_role(
  p_role text,
  p_profile_id uuid default auth.uid()
) returns boolean
```

```sql
public.dc_is_owner_admin(
  p_profile_id uuid default auth.uid()
) returns boolean
```

```sql
public.dc_can_read_entity(
  p_entity_id uuid,
  p_profile_id uuid default auth.uid()
) returns boolean
```

No later migration redefines these signatures.

Important:

`dc_can_read_entity()` is a READ helper. It accepts any active assignment and is therefore **too broad** for Event/Program relation write authorization.

The relation mutation path must use the accepted scoped Dementor predicate directly against `dc_entity_assignments` plus the real helper signatures above.

## 3. Minimal dedicated persistence proposal

Proposed canonical owner:

`public.dc_board_relations`

One row = one logical manually-created generic relation edge.

### Minimal row shape

```text
id                  uuid
relation_type       text

origin_kind         text
origin_source_id    text

target_kind         text
target_source_id    text

created_by          uuid
created_at          timestamptz

deleted_by          uuid nullable
deleted_at          timestamptz nullable
```

No:

- JSON metadata;
- Thing registry id;
- thingRef column;
- Board card id;
- DOM id;
- projection id;
- display label;
- title/body copy;
- inferred confidence;
- relation weight;
- automatic inverse row;
- generic update/version payload.

### Why source ids are text

Accepted endpoint contract is heterogeneous:

- Artifact sourceId = UUID owned by `dc_artifacts`;
- Event sourceId = stable slug;
- Program sourceId = stable slug.

Persistence stores the canonical source-owned identifier representation as text and source-specific RPC validation interprets it.

This is not a universal registry.

### Persisted relation types

The generic relation table stores only:

```text
RELATED_TO
RESULT_OF
CONTINUES
ABOUT
REPORT_OF
```

`PARTICIPATES_IN` is intentionally excluded from generic persistence because it remains projection-only.

### Persisted endpoint kinds

Only:

```text
artifact
event
program
```

Project, Product, Person/Dementor and separate Course/Practice namespaces are rejected.

## 4. Integrity / dedup strategy

### Self-edge

Reject when:

```text
(origin_kind, origin_source_id)
=
(target_kind, target_source_id)
```

### RELATED_TO normalization

RELATED_TO is one symmetric logical pair.

Before insert, CREATE RPC deterministically orders the two endpoint tuples lexicographically:

```text
lower endpoint tuple → stored origin columns
higher endpoint tuple → stored target columns
```

Storage order is technical only and creates no semantic origin.

A DB check must require normalized ordering for RELATED_TO so direct privileged writes cannot create reverse duplicates.

### Directional identity

For RESULT_OF / CONTINUES / ABOUT / REPORT_OF, origin and target remain semantic.

No reverse row is created.

### Active duplicate prevention

One partial unique index over active rows:

```text
(relation_type,
 origin_kind, origin_source_id,
 target_kind, target_source_id)
WHERE deleted_at IS NULL
```

Because RELATED_TO is normalized before persistence, the same unique key also prevents A↔B / B↔A duplicates.

### Audit-state integrity

Require:

```text
deleted_at IS NULL  ↔ deleted_by IS NULL
deleted_at IS NOT NULL ↔ deleted_by IS NOT NULL
```

Physical DELETE is not exposed to browser/API clients.

A deleted relation remains an audit/history row. Recreating the same logical relation creates a new active row after the prior row is soft-deleted.

## 5. Source validation contract

CREATE rejects unsupported/missing source tuples before persistence.

### Artifact

`sourceKind='artifact'`:

- sourceId must parse as UUID;
- matching `dc_artifacts.id` must exist;
- `visibility='community'`;
- `published_at is not null`;
- status must be Board history-visible: `active | expired | archived`;
- hidden/removed/draft objects are not valid new relation endpoints.

Artifact UUID is already stable; no alias/rename layer is required.

### Event

`sourceKind='event'`:

- exactly one `dc_entities` row with `entity_type='event'` and matching slug;
- `provenance_status='confirmed'`;
- matching `dc_events.entity_id` exists.

### Program

`sourceKind='program'`:

- exactly one `dc_entities` row with `entity_type='program'` and matching slug;
- `provenance_status='confirmed'`;
- matching `dc_programs.entity_id` exists.

Course/Practice remain Program subtypes.

### Unsupported

Reject:

- project;
- product;
- person;
- dementor;
- course as separate kind;
- practice as separate kind;
- unknown kind;
- source tuple that no longer resolves.

## 6. Event / Program rename integrity

Accepted invariant:

```text
relation exists
→ silent slug rename forbidden
```

The persistence migration proposal therefore includes one narrow guard on `dc_entities`:

- BEFORE UPDATE of `slug` or `entity_type`;
- only relevant for Event/Program tuples;
- if the old tuple is referenced by any relation audit row, reject the silent rename.

Expected error:

`RELATION_SOURCE_ID_RENAME_REQUIRES_CONTROLLED_MIGRATION`

A controlled rename is still possible by an explicit migration that:

1. receives source-owner approval;
2. migrates every old relation tuple to the new tuple in a controlled transaction;
3. proves zero old references;
4. changes the canonical mirror slug/type;
5. validates route/source alignment.

No alias registry is introduced.

## 7. Minimal RPC contract

Browser clients receive no direct table mutation authority.

### Read

```text
dc_board_relations_read_v1()
```

Purpose:

- return active generic persisted relation truth visible on Board;
- authenticated users only, matching current Board access boundary;
- no private audit actor fields need to be exposed;
- filter out any relation whose endpoints no longer pass current source visibility/validation.

Suggested output only:

```text
relation_id
relation_type
origin_kind
origin_source_id
target_kind
target_source_id
created_at
```

### Create

```text
dc_board_relation_create_v1(
  p_relation_type,
  p_origin_kind,
  p_origin_source_id,
  p_target_kind,
  p_target_source_id
)
→ relation_id
```

Responsibilities:

1. require auth;
2. normalize inputs;
3. reject unsupported relation type/kind;
4. reject unsupported type×endpoint pair;
5. validate both canonical sources;
6. authorize from origin ownership;
7. for RELATED_TO, authorize against at least one endpoint the actor can legitimately manage, then normalize the symmetric storage tuple;
8. normalize RELATED_TO order;
9. reject self-edge;
10. rely on unique active-edge protection;
11. record `created_by=auth.uid()`.

Target selection never grants write authority on target.

### Delete

```text
dc_board_relation_delete_v1(
  p_relation_id uuid
)
→ relation_id
```

Logical delete only:

```text
deleted_at = now()
deleted_by = auth.uid()
```

Authorization:

- directional relation → actor must manage stored semantic origin, or be Owner Admin;
- RELATED_TO → actor may manage the relation if they can manage either endpoint, or be Owner Admin;
- target ownership alone does not authorize deletion of a directional relation.

### Edit

**NO generic UPDATE RPC in v1.**

Changing type or endpoint means:

```text
delete old validated edge
+
create new validated edge
```

This keeps permission/state logic small and preserves audit history.

## 8. RLS / permission contract

Proposed table protection:

- RLS enabled;
- revoke table privileges from `public`, `anon`, `authenticated`;
- no browser direct INSERT/UPDATE/DELETE;
- canonical writes only via SECURITY DEFINER RPCs with explicit validation;
- read through the canonical read RPC, not browser table select.

### Artifact origin permission

Use existing facts:

```text
auth.uid()
dc_membership_active(auth.uid())
dc_artifacts.author_profile_id
dc_is_owner_admin(auth.uid())
```

Allow:

- active Member managing own Artifact origin;
- Owner Admin.

Reject all others.

### Event / Program origin permission

Use existing facts only:

```text
dc_membership_active(v_uid)
AND dc_has_role('dementor', v_uid)
AND scoped dc_entity_assignments
```

Assignment requirements:

- matching `profile_id=v_uid`;
- matching resolved `entity_id`;
- existing role value exactly `dementor`;
- `status='active'`;
- `provenance_status='confirmed'`;
- validity window active.

Owner Admin is separate global positive path.

Fail closed when the scoped predicate is not proven.

Do not treat:

- `author`;
- any assignment;
- read access;
- global Dementor alone

as relation-write authority.

## 9. PARTICIPATES_IN projection sources v1

PARTICIPATES_IN remains **projection-only** and creates no generic `dc_board_relations` row.

### dc_entity_assignments

Verdict:

**CANONICAL PARTICIPATION/ASSIGNMENT SOURCE EXISTS, BUT GENERIC PERSON EDGE OUTPUT IS NOT ENABLED IN Relations v1.**

It is safely usable now for:

- scoped relation write permission;
- source-owned Dementor assignment truth.

Because Person/Dementor is intentionally unsupported as a generic relation endpoint, this Result must not invent a generic person projection just to draw PARTICIPATES_IN lines.

A future safe presentation can project selected public assignment facts from this owner without changing relation persistence.

### event_registrations

Verdict:

**UNSUPPORTED FOR BOARD PARTICIPATION PROJECTION v1.**

Reasons:

- contains email/full_name;
- profile_id may be null;
- current RLS exposes own registration only;
- statuses represent registration/attendance workflow, not automatically public participation;
- no approved public participant-exposure contract exists.

Keep it canonical for Event registration; do not leak/copy it into Board relations.

### course_enrollments

Verdict:

**UNSUPPORTED FOR BOARD PARTICIPATION PROJECTION v1.**

Reasons:

- contains email/full_name;
- profile_id may be null;
- RLS is own enrollment;
- statuses encode enrollment/progress;
- no approved public participant-exposure contract exists.

Keep it canonical for course/program enrollment.

### Other candidates

- `mp_project_assignments`: separate Modern Pilgrims system — unsupported.
- `dc_events.metadata.dementor` / `dc_programs.metadata.dementor`: presentation metadata, not assignment authority — unsupported as participation truth.

Therefore the generic Board relation read RPC does not manufacture PARTICIPATES_IN rows in v1.

## 10. One read truth for canvas + detail

Required runtime path:

```text
dc_board_relations
       ↓
dc_board_relations_read_v1()
       ↓
one Board relation adapter / in-memory relation index
       ├── canvas SVG/line layer
       └── relation detail block
```

No:

- canvas relation store;
- detail relation store;
- duplicated fetch ownership;
- relation data embedded into cards as source truth.

### Board endpoint-to-card adapter

Artifact mapping:

```text
(artifact, UUID)
→ existing [data-artifact="<UUID>"]
```

Event/Program mapping must not use current `data-source-id`, because current Board projection sets:

```text
data-source-id = dc_entities UUID
```

while the relation contract requires:

```text
(event|program, stable slug)
```

Therefore the current Board projection adapter must expose a separate canonical relation tuple derived from:

```text
entity_type + slug
```

Course/Practice presentation types normalize to relation `program`.

The existing `entity:<uuid>` and current `sourceId=entity.id` remain local Board projection keys and are not renamed into relation identity.

## 11. Exact proposed migration/runtime diff

No files below are changed yet.

### Schema/RPC increment after explicit schema authorization

**NEW**
- `supabase/migrations/<implementation-timestamp>_board_relations_v1.sql`

Contains only:

- `dc_board_relations`;
- checks/indexes described above;
- RLS lockdown;
- `dc_board_relations_read_v1()`;
- `dc_board_relation_create_v1(...)`;
- `dc_board_relation_delete_v1(uuid)`;
- narrow Event/Program slug-rename guard.

**NEW**
- `scripts/validate-board-relations-v1.mjs`

**MODIFY**
- `.github/workflows/site-integrity.yml` to run the contract validator.

The migration timestamp is intentionally assigned only at implementation time after one last branch/production migration inventory, preventing timestamp collision with parallel work.

### Runtime/UI increment after schema contract passes branch validation

**MODIFY**
- `community/board/board-entity-model-v1.js`
  - add relation endpoint projection fields from canonical `entity_type + slug`;
  - preserve existing Board-local `id` and `sourceId`.

**MODIFY**
- `community/board/board-integrations-v1.js`
  - emit canonical relation endpoint data attributes separately from current Board projection keys.

**NEW**
- `community/board/board-relations-v1.js`
  - sole Board relation client/presentation owner;
  - one read RPC call;
  - one in-memory relation index;
  - manual create/delete controls;
  - canvas line rendering;
  - relation detail block;
  - no separate persistence/cache truth.

**NEW**
- `community/board/board-relations-v1.css`
  - relation layer/detail/control presentation only.

**MODIFY**
- `workspace/board/index.html`
  - load the canonical relation CSS/module.

No modification is proposed to:

- `thing-projection-v1.js`;
- root legacy `dementor-relations-v1.js`;
- Catalog;
- Batch D aging/hide owners;
- membership/activation;
- Project/Product identity systems.

## 12. Risks carried into schema implementation

1. **Symmetric permission:** RELATED_TO has no semantic origin. v1 proposal allows create/delete when actor legitimately manages either endpoint. This must be covered by explicit tests and must never be generalized to directional types.
2. **Slug guard breadth:** rename guard must cover both active and soft-deleted audit rows so history cannot silently drift.
3. **No polymorphic FK:** heterogeneous source ids require RPC validation; direct table access must remain fully closed.
4. **Entity mirror:** Event/Program validation uses `dc_entities` as a confirmed mirror, not as universal identity registry.
5. **Artifact visibility:** source validation must track the current Board history-visible rules and board-hide without mutating those owners.
6. **Participation privacy:** registration/enrollment data must not leak through relation reads.
7. **Person endpoint intentionally absent:** PARTICIPATES_IN cannot become generic canvas-edge persistence in this Result.
8. **Legacy relation naming:** root `dementor-relations-v1.js` must not be expanded into the new data owner.
9. **Concurrent schema work:** implementation must re-run migration-owner inventory immediately before creating the migration file.
10. **Release:** committed migration does not equal live DB mutation; live DB remains separately authorized.

## Final decision

```text
EXISTING CANONICAL EQUIVALENT = NO

minimal dedicated owner justified
= dc_board_relations

public mutation API
= create + logical delete

generic UPDATE
= NO

PARTICIPATES_IN persistence
= NO

schemaMutationAuthorized
= false
```

**VERDICT: READY FOR SCHEMA MUTATION, pending separate explicit owner authorization.**

**STOP BEFORE MIGRATION.**
