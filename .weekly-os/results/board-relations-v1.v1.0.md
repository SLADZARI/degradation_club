---
artifactId: dementor-club.result.board-relations-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
version: 1.0
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.9
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
runtimeIncrementAuthorized: true
runtimeValidationEvidence: operations/BOARD_RELATIONS_G5_RUNTIME_PERMISSION_INTERACTION_BLOCKER_2026-09-18.md
runtimeValidationStatus: BLOCKED
runtimeCandidateCommit: 70251f7faedbbe4a73cb5c99847fd2ab465ca171
runtimeValidationRunId: 35329713003
runtimeValidationRunNumber: 1221
runtimeValidationConclusion: FAILURE
schemaContractEvidence: operations/BOARD_RELATIONS_G5_SCHEMA_CONTRACT_VALIDATION_2026-09-18.md
schemaContractStatus: PASS
candidateCommit: 980c83e26d16219a04254a480671e20de77fe1bb
integrationPullRequest: 225
validationRunId: 35321118124
validationConclusion: SUCCESS
---

# MP | Dementor Club | BUILD | Board Relations v1 | Result v1.0

## Status

**ACTIVE / G5_BUILD — PERMISSION INTERACTION BLOCKED**

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


## Schema contract validation checkpoint

Validated integration head:

`980c83e26d16219a04254a480671e20de77fe1bb`

Evidence:

`operations/BOARD_RELATIONS_G5_SCHEMA_CONTRACT_VALIDATION_2026-09-18.md`

Draft staging PR:

`#225`

Site Integrity:

`run #1205 / 35321118124 = SUCCESS`

The schema/RPC/RLS increment changes only the migration, its static validator and Site Integrity wiring.

Live database mutation was not performed. Staging and production branches were not merged or deployed.

## Current stop

```text
schemaContractStatus = PASS
schemaMutationAuthorized = true
liveDatabaseMutationAuthorized = false
productionMergeAuthorized = false
productionDeployAuthorized = false
```

Runtime/UI work is not implied by the schema contract PASS. STOP before Board relation adapter, canvas/detail UI, staging merge, production merge, Supabase apply or Pages deploy pending separate owner authorization.


## Runtime increment authorization

Owner authorization received on 2026-09-18 for the existing integration branch only:

```text
runtimeIncrementAuthorized = true
liveDatabaseMutationAuthorized = false
productionMergeAuthorized = false
productionDeployAuthorized = false
```

Authorized runtime scope:

- extend existing Board endpoint projection fields only;
- add one canonical Board relation runtime owner;
- render relation lines over the existing spatial/layout owner;
- integrate relation presentation/controls into existing canonical card/detail interaction surfaces;
- add minimal relation CSS;
- add controlled QA fixture/mock validation.

Hard stop conditions:

- do not create a parallel detail/modal/drawer shell;
- if no canonical detail/card surface exists for an endpoint, stop instead of creating one;
- do not mutate live Supabase;
- do not merge PR #225;
- do not begin staging/production/G6 release path.

Existing `id=entity:<uuid>` and `sourceId=dc_entities UUID` remain Board-local projection identity and must not be repurposed.



## Runtime browser blocker checkpoint

Exact candidate:

`cc8b2f51ca9dc1f4bdc53dd0210834404bc8ef1c`

Evidence:

`operations/BOARD_RELATIONS_G5_RUNTIME_BLOCKER_2026-09-18.md`

Site Integrity:

`#1218 / 35327830885 = FAILURE`

Step 48 reproduced the same underlying drag/detail suppression blocker after the candidate had only added diagnostics around the existing assertion:

```text
canonical drag marker present
+
Artifact overlay opened
→ runtime browser contract blocked
```

Per owner instruction, the repeated same-cause failure stops the fix loop.

No further code mutation, owner change, detail shell, live DB apply, staging merge, production merge, deploy or G6 release work is authorized by this checkpoint.

## Current stop

```text
runtimeValidationStatus = BLOCKED
candidate = cc8b2f51ca9dc1f4bdc53dd0210834404bc8ef1c
validationRun = 35327830885
validationConclusion = FAILURE

liveDatabaseMutationAuthorized = false
productionMergeAuthorized = false
productionDeployAuthorized = false
```

Result remains ACTIVE / G5_BUILD pending an explicit owner decision on the canonical drag/detail suppression blocker.


## Exact-head corrective validation checkpoint

Candidate:

`70251f7faedbbe4a73cb5c99847fd2ab465ca171`

Read-only owner review relative to `cc8b2f51...`:

- spatial/layout owners unchanged;
- Artifact overlay owner unchanged;
- drag owner unchanged;
- workspace shell unchanged;
- Relations remains presentation-only for coordinates;
- corrective only reconciles existing SVG line nodes in place.

Validation:

`#1221 / 35329713003 = FAILURE`

Step 48 fails before drag coverage at filter/hide visibility assertion:

```text
artifact filter
→ expected 0 visible relation lines
→ timeout
```

Evidence:

`operations/BOARD_RELATIONS_G5_RUNTIME_PERMISSION_INTERACTION_BLOCKER_2026-09-18.md`

Important:

```text
previous drag/detail blocker = NOT EXERCISED IN #1221
do not infer resolved
current observed blocker = relation line filter visibility
```

No corrective or scope expansion is authorized by this checkpoint.


## Narrow FILTER_LINE_VISIBILITY corrective checkpoint

Authorized corrective:

```text
line.hidden = !visible
→
line.toggleAttribute('hidden', !visible)
```

No other runtime file changed.

Exact candidate:

`70251f7faedbbe4a73cb5c99847fd2ab465ca171`

Validation:

`#1221 / 35329713003 = FAILURE`

Observed browser progression:

```text
FILTER_LINE_VISIBILITY             PASS
canonical drag / no Artifact open  PASS
line follows canonical drag        PASS
create-success scenario            PASS
permission-reject interaction      FAIL
```

Current blocker:

`PERMISSION_INTERACTION_OVERLAY_INTERCEPT`

Evidence:

`operations/BOARD_RELATIONS_G5_RUNTIME_PERMISSION_INTERACTION_BLOCKER_2026-09-18.md`

The validator fails at the permission-reject interaction because the existing Artifact overlay scrim intercepts the relation control click.

No new corrective is authorized. No automatic inference is made about drag/fullscreen ownership or test sequencing.
