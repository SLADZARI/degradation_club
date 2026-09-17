---
artifactId: dementor-club.result.board-relations-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
version: 0.3
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.2
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
predecessorResult: dementor-club.result.board-information-architecture-v1
identityContractEvidence: operations/BOARD_RELATIONS_G4_IDENTITY_CONTRACT_2026-09-18.md
identityContractStatus: ACCEPTED
prePersistenceContractEvidence: operations/BOARD_RELATIONS_G5_PRE_PERSISTENCE_CONTRACT_2026-09-18.md
prePersistenceCheckpoint: COMPLETE
integrationBranch: result/board-relations-v1
integrationBaseRef: dementor-club-site
integrationBaseCommit: 61d85d95bd95dfb536acdd363b45d2773a4b2ca5
productionBaseCommit: 2dae3b6ece79652c81af780c049521fda7262726
implementationStartAuthorized: true
schemaMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | BUILD | Board Relations v1 | Result v0.3

## Status

**ACTIVE / G5_BUILD — PRE-PERSISTENCE CHECKPOINT COMPLETE**

Single active integration branch:

`result/board-relations-v1`

No release branch exists.

No schema/RLS/UI/runtime mutation has been performed by this checkpoint.

## G4 accepted

Identity contract:

`operations/BOARD_RELATIONS_G4_IDENTITY_CONTRACT_2026-09-18.md`

Canonical endpoint:

`(sourceKind, stable sourceId)`

Supported generic v1 endpoint kinds:

- artifact;
- confirmed entity-backed event;
- confirmed entity-backed program.

Project, Product and generic Person/Dementor remain unsupported.

## G5 pre-persistence contract complete

Evidence:

`operations/BOARD_RELATIONS_G5_PRE_PERSISTENCE_CONTRACT_2026-09-18.md`

### Assignment permission predicate

For Event/Program relation writes:

- Owner Admin remains the global positive path;
- non-admin writes require active Membership + system Dementor role + a scoped active/confirmed `dc_entity_assignments` row with existing role value `dementor`;
- any assignment is not enough;
- `author` is not treated as owner;
- global Dementor role without scoped assignment is not enough;
- where the predicate is not proven, write remains fail-closed.

No new role values are introduced.

### Relation compatibility

The six approved meanings are bounded to explicit endpoint pairs.

- `RELATED_TO`: supported endpoint kinds, distinct objects only, symmetric one-edge storage;
- `RESULT_OF`: Artifact→Artifact, Event→Artifact, Program→Artifact;
- `CONTINUES`: same-kind only;
- `ABOUT`: Artifact→Artifact/Event/Program;
- `PARTICIPATES_IN`: projection-only in v1; no generic relation row;
- `REPORT_OF`: Artifact→Event/Program.

No guessed reverse rows.

### Slug rename invariant

For Event/Program relation endpoints, stable slug is the v1 sourceId.

Once referenced by a relation, silent slug rename is forbidden.

Rename requires controlled source-owner approval + relation endpoint migration + zero-orphan validation.

## Next G5 step

Only now may implementation proceed to:

```text
fresh existing persistence inventory
→ minimal persistence proposal
→ RPC/RLS design
→ runtime adapter
→ canvas/detail UI
```

Existing before new remains mandatory.

## Authorization state

```text
implementationStartAuthorized = true
schemaMutationAuthorized = false
productionMergeAuthorized = false
productionDeployAuthorized = false
liveDatabaseMutationAuthorized = false
```

STOP before substantial schema mutation until the persistence inventory/proposal is reviewed within this Result.
