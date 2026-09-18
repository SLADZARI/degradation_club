---
artifactId: dementor-club.result.board-relations-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
version: 0.5
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.4
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
predecessorResult: dementor-club.result.board-information-architecture-v1
identityContractEvidence: operations/BOARD_RELATIONS_G4_IDENTITY_CONTRACT_2026-09-18.md
identityContractStatus: ACCEPTED
prePersistenceContractEvidence: operations/BOARD_RELATIONS_G5_PRE_PERSISTENCE_CONTRACT_2026-09-18.md
prePersistenceCheckpoint: COMPLETE
persistenceDesignEvidence: operations/BOARD_RELATIONS_G5_PERSISTENCE_DESIGN_2026-09-18.md
persistenceDesignStatus: READY_FOR_SCHEMA_MUTATION
integrationBranch: result/board-relations-v1
integrationBaseRef: dementor-club-site
integrationBaseCommit: 61d85d95bd95dfb536acdd363b45d2773a4b2ca5
productionBaseCommit: 2dae3b6ece79652c81af780c049521fda7262726
implementationStartAuthorized: true
schemaMutationAuthorized: true
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | BUILD | Board Relations v1 | Result v0.5

## Status

**ACTIVE / G5_BUILD — SCHEMA/RPC/RLS IMPLEMENTATION AUTHORIZED / LIVE DB MUTATION NOT AUTHORIZED**

Single active integration branch remains:

`result/board-relations-v1`

The branch still contains no Board Relations implementation mutation at this checkpoint.

## Accepted evidence

- G4 identity contract: `operations/BOARD_RELATIONS_G4_IDENTITY_CONTRACT_2026-09-18.md`
- G5 pre-persistence contract: `operations/BOARD_RELATIONS_G5_PRE_PERSISTENCE_CONTRACT_2026-09-18.md`
- G5 persistence design: `operations/BOARD_RELATIONS_G5_PERSISTENCE_DESIGN_2026-09-18.md`

## Persistence inventory verdict

Fresh inventory of current production baseline:

`2dae3b6ece79652c81af780c049521fda7262726`

found no canonical existing generic Board typed-edge owner.

Existing assignment, registration, enrollment, promotion, layout, distribution, provenance and MP project mechanisms remain their own canonical domains and must be composed/reused rather than repurposed.

## Minimal proposal

A single dedicated `dc_board_relations` owner is justified if schema mutation is separately authorized.

It stores one logical generic edge only:

- relation type;
- canonical origin tuple;
- canonical target tuple;
- creator/time;
- logical deletion actor/time.

No Thing registry, JSON ontology, reverse rows or generic update API.

Persisted types exclude PARTICIPATES_IN, which remains projection-only.

## Public server API proposal

Only:

- `dc_board_relations_read_v1()`;
- `dc_board_relation_create_v1(...)`;
- `dc_board_relation_delete_v1(uuid)`.

No browser direct table mutation.

No generic UPDATE: edit = logical delete + validated create.

## Authorization state

```text
implementationStartAuthorized = true
schemaMutationAuthorized = true
productionMergeAuthorized = false
productionDeployAuthorized = false
liveDatabaseMutationAuthorized = false
```

## Schema implementation authorization

Owner authorization received on 2026-09-18:

```text
schemaMutationAuthorized = true
liveDatabaseMutationAuthorized = false
productionMergeAuthorized = false
productionDeployAuthorized = false
```

Meaning:

```text
WRITE + VALIDATE MIGRATION IN BRANCH
≠
APPLY MIGRATION TO LIVE DB
```

Authorized scope is limited to the accepted schema/RPC/RLS increment plus static validator and Site Integrity wiring. Runtime/UI remains out of scope until a separate checkpoint.

## Next gate

Re-check current staging/production migration heads and timestamp collision risk, then implement and validate the accepted schema contract on `result/board-relations-v1`.

STOP before any live database mutation, production merge, production deploy, Pages deploy, or runtime/UI increment.
