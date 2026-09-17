---
artifactId: dementor-club.result.board-relations-v1
project: dementor-club
documentType: RESULT
projectStage: CLARITY
gate: G4_DECISION
status: DRAFT
version: 0.1
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
predecessorResult: dementor-club.result.board-information-architecture-v1
integrationBranch: null
plannedIntegrationBranch: result/board-relations-v1
implementationStartAuthorized: false
schemaMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
blockingGate: IDENTITY_CONTRACT
---

# MP | Dementor Club | Board Relations v1 | Result draft v0.1

## Status

**DRAFT / NOT ACTIVATED / IDENTITY CONTRACT REQUIRED BEFORE G5**

This is the proposed Batch C successor Result under the existing approved authority:

`operations/BOARD_INFORMATION_ARCHITECTURE_V1.md`

It is not yet `currentResult`, has no active integration branch and authorizes no implementation.

## Goal

Implement approved Board IA **Batch C only**:

`relation model + permissions + canvas/detail relation UI`

on top of the current Board architecture, without creating a second identity registry, a new role model or a parallel Board/card system.

## Governing identity rule

Canonical technical endpoint rule:

```text
relation endpoint
=
canonical source kind
+
stable source identity
```

Forbidden as canonical persisted relation identity:

```text
DOM id
card id
entity:${id}
Board projection id
incidental render key
```

Allowed projection chain:

```text
SOURCE OWNER
→ stable source reference
→ optional proven thingRef
→ Board-local projection
```

`thingRef` is optional and may be used only where already proven by released authority/evidence. ThingProjection is not a mandatory registry or universal resolver.

### Proposed endpoint contract

```text
RelationEndpointV1 {
  sourceKind: canonical source kind
  sourceId: stable identity owned by that source
  thingRef?: proven cross-context reference
}
```

Invariants:

1. primary endpoint identity is `(sourceKind, sourceId)`;
2. `thingRef` may accompany an endpoint only where already proven and must refer to the same source-owned object;
3. Board may derive a local projection/render key from the endpoint, but persistence must never derive canonical identity from `entity:${id}`, a DOM node or a card id;
4. endpoint validation follows the existing source owner/read path; no second registry is introduced;
5. if a source kind has no proven stable source identity/read owner, that endpoint kind stays unsupported until explicitly resolved;
6. existing relation/participation/assignment owners must be inventoried before any new relation persistence is designed.

## Blocking identity-contract gate

**No schema, migration, RPC/RLS or relation UI implementation may begin until this gate is accepted.**

Required evidence:

- exact source-owner map for every endpoint kind proposed for Batch C;
- stable identity field/reference for each supported source kind;
- explicit distinction between canonical source identity, optional `thingRef`, Board-local projection id and DOM/render ids;
- compatibility check against released `thing-projection-runtime-v1`;
- proof that `program:dengi-na-veter` and `project:dementor-lab` remain optional proven cross-context refs rather than templates for a universal registry;
- inventory of existing assignment/participation/relation owners so no duplicate relation authority is created;
- explicit unsupported/blocked list for any source kind whose stable identity is not yet proven.

Gate output must be a technical contract/evidence artifact, not a DB migration.

## Scope after identity gate

Only after the identity contract is accepted:

- six approved relation types:
  - `RELATED_TO`
  - `RESULT_OF`
  - `CONTINUES`
  - `ABOUT`
  - `PARTICIPATES_IN`
  - `REPORT_OF`
- direction semantics;
- minimal persistence/read path;
- permissions through the existing Board Access / Owner Admin boundary;
- manual create/edit/delete;
- canvas relation lines beneath cards;
- detail relation block;
- relation visibility toggle where required by the approved Board IA;
- desktop/mobile behavior;
- regression coverage;
- no inferred relations.

## Direction semantics acceptance

The implementation must explicitly classify each approved relation as directional or symmetric before persistence is finalized.

At minimum:

- inverse meaning must not be guessed at render time;
- no automatic reverse edge may be created unless the accepted contract explicitly requires it;
- `RELATED_TO` symmetry, if used, must be stated technically rather than inferred from the label;
- origin ownership/permission checks operate on the canonical origin endpoint, not on a visual card.

## Permissions boundary

No new roles.

Relation permissions must extend existing Board Access / Owner Admin ownership rules:

- Member may manage relations originating from own Artifact, subject to valid target;
- canonical entity owner / assigned Dementor may manage relations originating from their scoped canonical entity where an existing ownership/assignment authority proves that scope;
- Owner Admin may manage all Board relations;
- UI visibility is not authorization;
- write authorization must be enforced through the canonical server-side persistence path.

A Board relation must never manufacture membership, global role, ownership or canonical assignment.

## DB / RLS implications

Expected implementation may require relation persistence plus server-side read/write paths.

Before any migration:

1. inventory current schema/RPC/RLS for an existing equivalent;
2. extend an existing canonical owner if one already satisfies the approved semantics;
3. only if no equivalent exists, propose the smallest dedicated relation persistence model;
4. do not repurpose `promoted_entity_id/type` as the universal relation owner;
5. do not use Board projection ids as foreign/canonical endpoints;
6. reuse existing Board Access / Owner Admin authorization facts instead of introducing role tables or parallel permission state.

Exact table, column, RPC and policy names are intentionally **not** fixed by this draft.

Any live DB migration requires a separate explicit authorization at release time.

## Affected domain

Potential implementation surface after gate:

- Community Board relation read/write boundary;
- Board canonical source/entity projection adapter;
- Board canvas relation presentation;
- Board detail relation presentation;
- existing Board Access / Owner Admin authorization integration;
- Supabase relation persistence/RPC/RLS only if the post-gate owner inventory proves it is required;
- validation scripts for identity, permissions, desktop/mobile and regression.

## Explicit exclusions

Out of scope:

- Batch D continuous aging;
- redesign of existing board-hide;
- universal Thing registry;
- automatic expansion of `thing-projection-v1.js`;
- new roles;
- new card system;
- Contribution / #214 runtime;
- Catalog identity ownership;
- Product registry;
- automatic relation inference;
- inferred participation/assignment;
- unrelated Board navigation/mobile/share redesign.

## Acceptance criteria

Before G6, implementation must prove:

1. every persisted relation endpoint maps to an approved stable source identity;
2. no persisted endpoint uses DOM/card/Board-local projection ids;
3. `thingRef` is used only where already proven and remains optional;
4. all six relation types have explicit stored direction semantics;
5. manual create/edit/delete works only within existing authorization boundaries;
6. Member negative authority, scoped Dementor/entity-owner authority and Owner Admin authority are validated;
7. relation writes do not mutate canonical source meaning, membership, roles or assignments;
8. canvas lines render beneath cards and remain attached to stable projections without becoming identity owners;
9. detail relation block reads the same canonical relation data as the canvas;
10. desktop and mobile behavior pass sequential browser validation;
11. current Board navigation, Artifact flows, history, filters, spatial movement and fullscreen/detail ownership regressions remain green;
12. no duplicate relation registry/resolver/card owner is introduced.

## Release gates

### G4 — Governance / identity contract
- this draft accepted;
- endpoint identity contract accepted;
- existing owner inventory complete;
- unsupported endpoint kinds explicit;
- only then may the Result be activated and one integration branch opened.

### G5 — Build
- one active integration branch: `result/board-relations-v1`;
- no unrelated Batch D or presentation redesign;
- schema/RLS work only after the identity gate.

### G6 — Validation
- build/syntax;
- relation contract validators;
- RPC/RLS authorization matrix;
- Guest / Applicant / Member / Dementor / Owner Admin negative/positive paths as applicable;
- desktop/mobile sequential browser tests;
- Board route/spatial/detail regression;
- identity invariant proving local projection ids never become canonical endpoints.

### G7 — Release
- clean release candidate from the then-current production baseline;
- exact required diff only;
- full CI;
- production merge only after explicit owner authorization;
- any live Supabase migration/deployment separately authorized;
- Pages deploy separately authorized.

### G8 — Live retest / cleanup
- live relation create/read/edit/delete evidence with legitimate actors where required;
- canvas/detail consistency;
- desktop/mobile live regression;
- stale branch/temp layer/dead code/duplicate owner inventory;
- no DONE / RELEASED claim without the required evidence.

## Activation boundary

This draft does not activate implementation.

Activation requires the next governance decision to:

1. accept this Result boundary and identity-contract gate;
2. set it as the single `currentResult`;
3. open exactly one active integration branch `result/board-relations-v1`.

Until then:

- `currentResult` remains null;
- no active integration branch exists for this successor;
- no runtime/schema/UI/production mutation is authorized.
