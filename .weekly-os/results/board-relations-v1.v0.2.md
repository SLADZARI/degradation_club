---
artifactId: dementor-club.result.board-relations-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
version: 0.2
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
predecessorResult: dementor-club.result.board-information-architecture-v1
identityContractEvidence: operations/BOARD_RELATIONS_G4_IDENTITY_CONTRACT_2026-09-18.md
identityContractStatus: ACCEPTED
integrationBranch: result/board-relations-v1
integrationBaseRef: dementor-club-site
integrationBaseCommit: 61d85d95bd95dfb536acdd363b45d2773a4b2ca5
implementationStartAuthorized: true
schemaMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | BUILD | Board Relations v1 | Result v0.2

## Status

**ACTIVE / G5_BUILD**

Owner activation approved on 2026-09-18 after acceptance of:

`operations/BOARD_RELATIONS_G4_IDENTITY_CONTRACT_2026-09-18.md`

Single active integration branch:

`result/board-relations-v1`

Branch base:

`dementor-club-site@61d85d95bd95dfb536acdd363b45d2773a4b2ca5`

No release branch exists.

## Goal

Implement approved Board IA **Batch C only**:

`relation model + permissions + canvas/detail relation UI`

under the existing authority:

`operations/BOARD_INFORMATION_ARCHITECTURE_V1.md`

## Identity contract

Canonical persisted relation endpoint:

```text
(sourceKind, stable sourceId)
```

Optional proven cross-context identity:

```text
thingRef?
```

Forbidden as canonical persisted identity:

- DOM id;
- card id;
- `entity:${id}`;
- Board projection id;
- render key.

ThingProjection remains a thin optional read adapter, not a registry/resolver.

## Supported generic endpoint kinds v1

- `artifact`;
- confirmed entity-backed `event`;
- confirmed entity-backed `program`.

Course and Practice are Program subtypes, not separate endpoint namespaces.

Explicitly unsupported in Relations v1:

- generic Project;
- generic Product;
- generic Person/Dementor;
- Content without a separately approved source owner.

## G5 pre-persistence checkpoint

Before choosing or creating persistence, G5 must record:

1. a concrete assignment permission predicate for Event/Program relation writes using existing `dc_entity_assignments` and existing approved role semantics only;
2. relation-type × endpoint compatibility for all six approved relation meanings;
3. the Event/Program slug rename invariant;
4. a fresh existing-persistence inventory against the then-current production baseline.

No persistence/schema/RLS/UI implementation begins before items 1–3 are recorded.

## Scope after checkpoint

Only after the pre-persistence checkpoint:

- six approved relation meanings;
- direction semantics;
- existing-before-new persistence inventory;
- minimal persistence/read proposal if no equivalent exists;
- permissions through existing Board Access / Owner Admin and scoped assignment owners;
- manual create/edit/delete;
- canvas relation lines;
- detail relation block;
- desktop/mobile regression.

## Explicit exclusions

- Batch D continuous aging;
- board-hide redesign;
- Project/Product generic endpoints;
- generic Person endpoint;
- universal Thing registry;
- automatic expansion of `thing-projection-v1.js`;
- new role values;
- new card system;
- Contribution/#214 runtime;
- Catalog identity ownership;
- Product registry;
- automatic/inferred relations;
- guessed reverse rows.

## Authorization state

```text
implementationStartAuthorized = true
schemaMutationAuthorized = false
productionMergeAuthorized = false
productionDeployAuthorized = false
liveDatabaseMutationAuthorized = false
```

Activation authorizes G5 implementation work only within the approved Result boundary.

It does not authorize production merge, deployment, live database mutation or unrelated semantic expansion.
