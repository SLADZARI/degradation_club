---
artifactId: dementor-club.evidence.board-relations-g5-pre-persistence-contract-2026-09-18
project: dementor-club
documentType: TECHNICAL_CONTRACT_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: APPROVED_EVIDENCE
version: 1.0
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-relations-v1
runtimeMutation: false
schemaMutation: false
---

# Board Relations v1 — G5 pre-persistence contract

## Checkpoint

**PASS / PRE-PERSISTENCE CONTRACT COMPLETE**

This checkpoint is semantic/technical evidence only. It authorizes no schema, RPC, RLS, UI or production mutation.

## 1. Event / Program assignment permission predicate

Approved Board IA says:

- Member manages relations originating from own Artifact;
- canonical entity owner / assigned Dementor manages relations originating from scoped entity;
- Owner Admin manages all relations.

Current production does **not** expose a canonical entity-owner predicate for Board Relations.

Current `dc_entity_assignments.role` is free text. Existing seeded values include `author` and `dementor`. The architectural boundary explicitly says ownership, authorship, facilitation and participation are distinct concepts.

Therefore `author` MUST NOT be silently treated as `owner`.

### Existing qualifying non-admin predicate

For Event/Program origin writes, the only currently proven non-admin predicate is:

```text
membership active
AND system role = dementor
AND active confirmed dc_entity_assignments row
AND assignment.role = 'dementor'
AND assignment.entity_id = resolved canonical entity mirror row
AND assignment valid_from <= now
AND (valid_to is null OR valid_to > now)
```

Conceptual SQL predicate:

```sql
public.dc_membership_active(auth.uid())
AND public.dc_has_role('dementor', auth.uid())
AND EXISTS (
  SELECT 1
  FROM public.dc_entity_assignments a
  WHERE a.profile_id = auth.uid()
    AND a.entity_id = resolved_entity_id
    AND lower(btrim(a.role)) = 'dementor'
    AND a.status = 'active'
    AND a.provenance_status = 'confirmed'
    AND a.valid_from <= now()
    AND (a.valid_to IS NULL OR a.valid_to > now())
)
```

Owner Admin remains a separate positive path through `dc_is_owner_admin()`.

### Explicit negative cases

These do **not** authorize relation writes:

- global Dementor role without scoped entity assignment;
- any arbitrary active `dc_entity_assignments` row;
- `role='author'` by itself;
- inferred source-page copy naming a Dementor;
- Board card ownership;
- entity visibility/read permission;
- `dc_can_read_entity()` — it is a read predicate and accepts any active assignment, so it is too broad for relation management.

### Current consequence

If an Event/Program has no qualifying scoped `role='dementor'` assignment:

```text
non-admin write = FAIL CLOSED
```

This means a canonical source may be readable/projectable while relation mutation remains unavailable to non-admin actors.

No new assignment role value is introduced.

## 2. Relation type × endpoint compatibility

Supported endpoint kinds in Relations v1:

```text
artifact
event
program
```

Course/Practice are Program subtypes.

Legend:
- **ALLOW** = generic persisted relation may be created manually if permission + target validity pass.
- **DENY** = invalid pair for this relation type in v1.
- **PROJECT ONLY** = Board may display a canonical external participation fact, but generic relation persistence must not duplicate it.

### RELATED_TO — symmetric

All distinct supported endpoints may be related.

| Origin | artifact | event | program |
|---|---:|---:|---:|
| artifact | ALLOW* | ALLOW | ALLOW |
| event | ALLOW | ALLOW* | ALLOW |
| program | ALLOW | ALLOW | ALLOW* |

`*` same-kind is allowed only between different sourceIds. Self-edge is forbidden.

Persistence stores one normalized unordered pair. No reverse row.

### RESULT_OF — directional

Meaning: origin appeared from / is a result of target.

| Origin \ Target | artifact | event | program |
|---|---:|---:|---:|
| artifact | ALLOW | DENY | DENY |
| event | ALLOW | DENY | DENY |
| program | ALLOW | DENY | DENY |

Rationale: v1 supports the concrete Board pattern where a Member Artifact/idea/request may grow into another Artifact, Event or Program.

Event→Event and Program→Program evolution uses `CONTINUES`; reports use `REPORT_OF`; generic cross-entity causality beyond these proven meanings remains denied.

### CONTINUES — directional

Meaning: origin is a continuation/update of target.

| Origin \ Target | artifact | event | program |
|---|---:|---:|---:|
| artifact | ALLOW | DENY | DENY |
| event | DENY | ALLOW | DENY |
| program | DENY | DENY | ALLOW |

Cross-kind continuation is denied in v1 because a form change should not be silently equated to continuation semantics.

### ABOUT — directional

Meaning: origin publication/object is about target.

| Origin \ Target | artifact | event | program |
|---|---:|---:|---:|
| artifact | ALLOW* | ALLOW | ALLOW |
| event | DENY | DENY | DENY |
| program | DENY | DENY | DENY |

`*` self-edge forbidden.

Artifact is the only generic v1 authored/publication endpoint with an approved independent publication lifecycle. Event/Program source semantics are not mutated into editorial “about” objects.

### PARTICIPATES_IN — canonical participation projection

Generic persisted relation creation:

| Origin \ Target | artifact | event | program |
|---|---:|---:|---:|
| artifact | DENY | DENY | DENY |
| event | DENY | DENY | DENY |
| program | DENY | DENY | DENY |

**PROJECT ONLY in Relations v1.**

Approved Board IA states Person/Dementor participation is canonical assignment/participation data and Board only projects it.

Existing owners win:

```text
dc_entity_assignments
event registrations
course enrollments
other canonical participation owner
→ Board projection
```

No duplicate generic relation edge is created.

Person/Dementor generic endpoint remains unsupported.

### REPORT_OF — directional

Meaning: origin Artifact is a report/recap/result publication of target.

| Origin \ Target | artifact | event | program |
|---|---:|---:|---:|
| artifact | DENY | ALLOW | ALLOW |
| event | DENY | DENY | DENY |
| program | DENY | DENY | DENY |

Reports are authored publications in v1, therefore origin must be Artifact. Project target remains unsupported until Project endpoint identity/permission is separately proven.

## 3. Reverse representation invariant

No guessed reverse rows.

- RELATED_TO = one symmetric logical edge.
- RESULT_OF / CONTINUES / ABOUT / REPORT_OF = one directional logical edge.
- UI may present a readable inverse label from the target side without persisting a second edge.
- PARTICIPATES_IN is projected from its canonical participation owner, not duplicated.

## 4. Event / Program slug rename invariant

G4 accepted stable source slug as v1 `sourceId` for Event/Program.

Current schema guarantees uniqueness of `(entity_type, slug)`, but uniqueness is not rename safety.

Therefore Relations v1 adopts:

```text
once a relation references (event|program, slug),
that sourceId is relation-key immutable
unless a controlled rename migration is executed
```

A controlled rename requires:

1. explicit semantic/source-owner approval of the new slug;
2. inventory of every relation endpoint using the old tuple;
3. atomic/controlled relation endpoint migration;
4. validation that zero old endpoint references remain;
5. canonical route/source projection alignment and redirect/compatibility handling where applicable;
6. evidence recorded before the old slug stops resolving.

Forbidden:

```text
silent source slug rename
while relation edges still reference old sourceId
```

No automatic slug alias registry is created by this Result.

## 5. Pre-persistence conclusion

The G5 implementation may now proceed to:

```text
fresh existing persistence inventory
→ minimal persistence proposal
→ RPC/RLS design
→ runtime adapter
→ canvas/detail UI
```

with these mandatory guards:

- existing before new;
- Project/Product/Person remain unsupported generic endpoints;
- no universal Thing registry;
- no entity:<id> persistence;
- no reverse rows;
- no new roles;
- no Batch D;
- no inferred relations;
- Event/Program non-admin writes fail closed unless the exact scoped Dementor predicate passes.

## Gate state

**PRE-PERSISTENCE CHECKPOINT COMPLETE.**

Schema mutation remains unauthorized at this checkpoint.
