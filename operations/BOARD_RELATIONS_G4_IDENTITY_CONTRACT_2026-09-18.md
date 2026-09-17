---
artifactId: dementor-club.evidence.board-relations-g4-identity-contract-2026-09-18
project: dementor-club
documentType: TECHNICAL_CONTRACT_EVIDENCE
projectStage: CLARITY
gate: G4_DECISION
status: READY_FOR_ACTIVATION
version: 1.0
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-relations-v1
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
productionInspectedAt: 2dae3b6ece79652c81af780c049521fda7262726
runtimeMutation: false
schemaMutation: false
---

# Board Relations v1 — G4 Identity Contract evidence

## Verdict

**READY FOR RESULT ACTIVATION — NOT AUTHORIZED FOR IMPLEMENTATION YET**

This evidence closes the pre-activation identity-forensics requirement for the proposed Batch C successor.

It does not activate board-relations-v1, create a branch, choose a database schema, authorize RLS/RPC changes, mutate runtime/UI, or authorize production work.

Canonical endpoint invariant:

~~~text
canonical relation endpoint
=
(sourceKind, stable sourceId)
~~~

Never canonical persisted relation identity:

~~~text
entity:${id}
DOM id
card id
Board projection id
render key
~~~

thingRef is optional proven cross-context identity. It is not a mandatory resolver and does not turn ThingProjection into a registry.

## Evidence basis

Semantic authority / governance:
- operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
- operations/BOARD_ACCESS_AND_OWNER_ADMIN_V2.md
- .weekly-os/results/board-information-architecture-v1.v0.18.md
- .weekly-os/results/board-relations-v1.v0.1.md
- .weekly-os/results/thing-projection-runtime-v1.v1.0.md
- projects/dementor-lab/DEMENTOR_LAB_PROJECT_IDENTITY_V1.md

Production inspected at exact SHA:
2dae3b6ece79652c81af780c049521fda7262726

Implementation owners inspected:
- supabase/migrations/20260828170411_dc_workspace_readonly_v01.sql
- supabase/migrations/20260829232745_community_member_artifact_v1.sql
- supabase/migrations/20260907215547_board_access_owner_admin_v2.sql
- supabase/migrations/20260912121109_board_information_architecture_batch_a.sql
- supabase/migrations/20260912123011_board_information_architecture_batch_b_subtypes.sql
- supabase/migrations/20260912144034_board_telegram_promotion_v1.sql
- supabase/migrations/20260828205228_mp_weekly_runtime_v1.sql
- supabase/migrations/20260828211140_mp_project_access_profiles_v1.sql
- supabase/migrations/20260909061242_mp_project_owner_provisioning_v1.sql
- supabase/migrations/20260909214529_mp_client_team_access_v1.sql
- community/board/board-entity-model-v1.js
- dementor-relations-v1.js
- thing-projection-v1.js

## 1. Endpoint owner matrix

| Candidate kind | Canonical source owner | Stable sourceId | Current read / validation path | Optional proven thingRef | Ownership / permission source | v1 |
|---|---|---|---|---|---|---|
| Artifact | dc_artifacts canonical Community Artifact owner | dc_artifacts.id UUID | canonical Artifact read/detail paths; Board history read uses Artifact id | none | author_profile_id + Board Access v2 + Owner Admin | **SUPPORTED** |
| Event | Event source document, mirrored as confirmed dc_entities(event) + dc_events | stable Event slug | dc_board_entity_projection_read_v1 resolves confirmed Event slug/source_ref | none; Fuengirola has no released thingRef | active dc_entity_assignments + Owner Admin; non-admin writes fail closed unless qualifying assignment is proved | **SUPPORTED — confirmed entity-backed Events only** |
| Program | Program/Course/Practice source document, mirrored as confirmed dc_entities(program) + dc_programs | stable Program slug | dc_board_entity_projection_read_v1 + dc_programs | program:dengi-na-veter only | active dc_entity_assignments + Owner Admin; non-admin writes fail closed unless qualifying assignment is proved | **SUPPORTED — confirmed entity-backed Programs only** |
| Course | Program subtype, not separate canonical entity kind | Program slug | Program path with program_type=course | Dengi only via Program | Program permission owner | **SUPPORTED AS PROGRAM, NOT A SEPARATE ENDPOINT KIND** |
| Practice | Program subtype, not separate canonical entity kind | Program slug | Program path with program_type=practice | none proven | Program permission owner | **SUPPORTED AS PROGRAM, NOT A SEPARATE ENDPOINT KIND** |
| Project | project-local source authority; DEMENTOR LAB proves dc_entities is not required | source-owner-specific stable slug/ref | no generic Board Project resolver covers project-local identities without creating a registry | project:dementor-lab only | no single Dementor Club Project permission owner proven for all valid project-local identities | **UNSUPPORTED IN RELATIONS V1** |
| Product | product-specific authorities; no generic Board Product owner | source-specific id may exist, but no common Product identity contract | dc_entities excludes Product; Board filter grouping is presentation only | none proven | no generic Product relation permission owner | **UNSUPPORTED IN RELATIONS V1** |
| Person / Dementor | Person profile identity; Dementor is a scoped role, not a person kind | profile UUID where needed | profiles / dc_member_public_profiles + role/assignment owners | none | dc_role_assignments / dc_entity_assignments / existing participation owners | **UNSUPPORTED AS GENERIC RELATION ENDPOINT** |

## 2. Supported endpoint kinds v1

Generic persisted Board relation endpoints may use only:

~~~text
artifact
event
program
~~~

Course and Practice stay Program subtypes:

~~~text
(program, dengi-na-veter)  // course
(program, ne-komanda)      // practice
~~~

Do not create parallel namespaces:
- (course, dengi-na-veter)
- (practice, ne-komanda)

For Event/Program, stable sourceId is the source slug. The current dc_entities mirror may validate it by unique (entity_type, slug), provenance/source_ref and typed extension, but dc_entities.id is not promoted into universal cross-system identity.

## 3. Explicit unsupported kinds

### Project — UNSUPPORTED IN RELATIONS V1

DEMENTOR LAB proves a valid Project can have:
- sourceKind: project
- slug: dementor-lab
- thingRef: project:dementor-lab

without any required dc_entities row.

Using dc_entities as the Project resolver would exclude a valid canonical Project. Using ThingProjection as mandatory Project resolver would convert a deliberately thin adapter into a universal registry.

A later Project endpoint requires its own proven project-source adapter and permission boundary.

### Product — UNSUPPORTED IN RELATIONS V1

Current Product truth is source-specific. Merch can have SKU identity, but there is no approved generic Product identity owner plus Board read/permission adapter.

The Board project/product filter grouping is presentation taxonomy, not identity authority.

### Person / Dementor — UNSUPPORTED AS GENERIC ENDPOINT

Dementor is a scoped role, not a global person/entity kind.

Person/Dementor participation or assignment must compose with existing assignment/registration/enrollment owners and must not be copied into a generic Board relation row merely to draw a line.

## 4. Existing-owner collision inventory

| Existing owner / mechanism | Disposition | Contract |
|---|---|---|
| dc_entity_assignments | **REUSE / COMPOSE** | Existing Dementor Club scoped person↔entity assignment owner. Use for permission/participation evidence where applicable. Do not duplicate person assignment. |
| dc_role_assignments | **REUSE** | Existing system role source for dementor / owner_admin. Role alone does not create an entity relation. |
| Board Access v2 / Owner Admin | **REUSE** | Existing Board authority boundary. Member owns own Artifact-origin actions; Dementor role alone is not global moderation; Owner Admin is global Board moderation authority. |
| dc_artifact_board_positions | **COMPOSE, NOT IDENTITY** | Spatial layout owner only. Position/card key never becomes relation endpoint identity. |
| event_registrations | **NOT GENERIC RELATION OWNER** | Registration/attendance domain. If future participation projection uses it, project that fact rather than duplicate it. |
| course_enrollments | **NOT GENERIC RELATION OWNER** | Enrollment/progress domain, not Board semantic graph. |
| mp_project_refs / mp_project_assignments | **EXPLICITLY NOT SAME CONCEPT** | Modern Pilgrims / Weekly OS project system. Never infer these relationships into Dementor Club. |
| dementor-relations-v1.js | **LEGACY PRESENTATION ONLY** | Static DOM links between named Dementors and pages. No canonical persistence, endpoint validation or permission ownership. |
| promoted_entity_id/type on dc_artifacts | **EXPLICITLY NOT SAME CONCEPT** | Board IA explicitly forbids repurposing as universal relation owner. |
| dc_artifact_promotion_support | **EXPLICITLY NOT SAME CONCEPT** | Immutable Telegram-promotion support ledger; its migration explicitly says it is not the later generic Board relation graph. |
| dc_board_entity_projection_read_v1() | **COMPOSE** | Board-safe entity read/projection adapter. Read owner, not relation owner. |
| board-entity-model-v1.js | **COMPOSE, NOT IDENTITY** | Creates local id=entity:<uuid>. That is a projection/render key, not persisted relation identity. |
| thing-projection-v1.js | **OPTIONAL COMPOSITION** | Thin read adapter for proven Dengi + DEMENTOR LAB only. Never required as registry/resolver. |
| Workspace / MP relationship mechanics | **SEPARATE SYSTEM** | mp_project_assignments.relation belongs to Modern Pilgrims/Weekly OS project access, not Dementor Club Board relations. |

Production migration inventory shows assignment, enrollment, registration, promotion-support, reaction/response and projection mechanisms, but no released canonical generic Board typed-relation owner implementing the six approved Batch C relation meanings.

Therefore G5 may propose a minimal dedicated persistence owner only after repeating this owner inventory against the then-current production baseline.

## 5. ThingProjection compatibility

Released proven refs:

~~~text
program:dengi-na-veter
project:dementor-lab
~~~

Compatibility chain:

~~~text
SOURCE OWNER
→ stable source reference
→ optional proven thingRef
→ Board-local projection
~~~

Dengi:
~~~text
(program, dengi-na-veter)
thingRef? = program:dengi-na-veter
~~~

DEMENTOR LAB has a proven project:dementor-lab ref but Project remains unsupported in generic Relations v1 because a generic Project read/permission adapter is not proven. A proven thingRef alone does not authorize a whole endpoint kind.

Fuengirola:
~~~text
(event, fuengirola)
thingRef = absent
~~~

No event:fuengirola ref may be invented.

## 6. Direction semantics

One logical relation is one logical edge. No reverse row exists merely for presentation.

| Type | Semantics | Canonical origin | Canonical target | Reverse row | Presentation inverse |
|---|---|---|---|---|---|
| RELATED_TO | **SYMMETRIC** | no semantic origin; persistence deterministically normalizes endpoint ordering | other endpoint | **NO** | same relation from either side |
| RESULT_OF | **DIRECTIONAL** | result / thing that appeared | antecedent/source thing | **NO** | source may show origin as its result |
| CONTINUES | **DIRECTIONAL** | continuation/newer object | predecessor | **NO** | predecessor may show origin as continuation |
| ABOUT | **DIRECTIONAL** | object/publication making the reference | subject object | **NO** | subject may show origin as content/about-it |
| PARTICIPATES_IN | **DIRECTIONAL** | participating object/person | containing Event/Program/Project context | **NO** | target may list participants; existing participation/assignment owner wins |
| REPORT_OF | **DIRECTIONAL** | report/recap/output | object being reported | **NO** | target may list report/output |

RELATED_TO is deduplicated as one unordered logical pair. Any deterministic storage ordering is technical only and cannot create semantic origin ownership.

If PARTICIPATES_IN represents Person/Dementor participation already owned by dc_entity_assignments, event registration, enrollment or another canonical owner:

~~~text
existing participation/assignment owner
→ Board projection
~~~

not:

~~~text
existing assignment
+
second generic relation row
~~~

## 7. Permission-source map

### Artifact origin

~~~text
dc_artifacts.author_profile_id
+ Board Access v2
+ dc_is_owner_admin()
~~~

- Member may manage relations originating from own Artifact.
- Member may not manage another Member's Artifact origin.
- Dementor role alone grants no global Artifact relation authority.
- Owner Admin may manage all.

### Event / Program origin

~~~text
dc_entity_assignments
+ active/valid assignment state
+ dc_is_owner_admin()
~~~

- Owner Admin is the global relation authority.
- Non-admin Event/Program origin writes require a proven qualifying active source assignment.
- dc_entity_assignments currently stores free-text role values and there is no released generic dc_can_manage_entity_relation predicate.
- G5 must therefore fail closed for non-admin Event/Program origin writes until the exact qualifying existing assignment-role predicate is validated from approved source facts.
- No new role vocabulary may be invented for Relations.

### Target validity

Selecting a target grants no authority over that target.

Authorization is evaluated from canonical origin ownership plus relation-specific target validity. A relation never mutates target ownership, membership, role or canonical source meaning.

## 8. Minimal persistence requirements — no schema selected

If the G5 re-check still finds no equivalent relation owner, the smallest persistence design must satisfy:

1. one logical edge = one canonical record;
2. relation type is one of the six approved meanings;
3. origin identity = (sourceKind, stable sourceId);
4. target identity = (sourceKind, stable sourceId);
5. no persisted identity from entity:<uuid>, card id, DOM id or render key;
6. optional thingRef only where already proven; it is never required to resolve an endpoint;
7. RELATED_TO cannot be duplicated as A→B and B→A;
8. directional relations cannot create guessed reverse rows;
9. create/update/delete are attributable to an authenticated actor and auditable;
10. source-specific adapters validate endpoint existence/visibility;
11. authorization composes existing Board Access / assignment owners;
12. relation deletion deletes only the relation, not endpoint objects;
13. hiding/removing a Board projection does not silently destroy source identity/history;
14. existing assignment/enrollment/registration relationships are composed/projected, not duplicated;
15. unsupported endpoint kinds fail closed.

No table name, RPC name, FK shape, RLS policy name or migration is approved by G4.

## 9. Risks / blockers carried into G5

1. **Entity assignment role predicate:** correct source is dc_entity_assignments, but non-admin relation-management eligibility must be validated fail-closed.
2. **Project gap:** DEMENTOR LAB proves Project identity but no generic Board Project resolver/permission owner.
3. **Product gap:** no generic Product identity/read/permission owner.
4. **Person participation collision:** Person/Dementor participation must not duplicate assignment/enrollment/registration owners.
5. **Mirror identity drift:** dc_entities.id and entity:<uuid> must remain implementation/projection identifiers.
6. **Legacy naming trap:** dementor-relations-v1.js sounds canonical but is only DOM presentation.
7. **Promotion trap:** promoted_entity_id/type and dc_artifact_promotion_support are not the relation graph.
8. **ThingProjection overreach:** Dengi/Lab refs cannot be generalized by naming convention.
9. **Production re-check:** before persistence design, G5 must repeat owner inventory against the then-current production baseline.

## 10. Recommendation

**READY FOR ACTIVATION of board-relations-v1 as the single current Result, subject to separate owner authorization.**

READY means:

~~~text
G4 identity contract accepted
→ owner may separately authorize Result activation
→ exactly one integration branch may then open
→ G5 may begin
~~~

READY does not mean:

~~~text
schema approved
migration approved
RLS approved
runtime/UI approved
production approved
~~~

Final invariant:

~~~text
SOURCE OWNER
→ stable source identity
→ optional proven thingRef
→ relation endpoint
→ Board-local projection

relation endpoint
≠ Board-local projection
≠ DOM/card id
~~~

**STOP: G4 COMPLETE / ACTIVATION NOT YET AUTHORIZED.**
