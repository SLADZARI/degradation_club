---
artifactId: dementor-club.result.board-media-performance-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
workStatus: WAITING_VALIDATION
version: 0.7
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.6
parentQa: BQA-20,BQA-27
integrationBranch: result/board-media-performance-v1
integrationBaseRef: dementor-club-production
integrationBaseCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
productionBaseCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
implementationStartAuthorized: true
schemaChangeImplementationAuthorized: true
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
backendWorkerCandidate: 834bb9776c4e99bb73556c4776c49f270fe70a6c
backendWorkerStatus: RUNTIME_PASS_INTEGRATED
backendRuntimeEvidence: operations/BOARD_MEDIA_PERFORMANCE_DEV1_RUNTIME_PASS_2026-09-30.md
integrationPullRequest: 250
finalAdapterCandidate: dde55b15a03ced436de95e274c5160c94a94c9b6
finalAdapterRun: 1330
finalAdapterRunStatus: FAIL_STALE_COLLAB_VALIDATOR
validatorCorrectiveCandidate: 91a05166a46ad108f7f2aed3b66c5c1464b2863d
validatorCorrectiveRun: 1331
validatorCorrectiveRunId: 36728660995
validatorCorrectiveStatus: IN_PROGRESS
validatorCorrectiveEvidence: operations/BOARD_MEDIA_PERFORMANCE_G5_VALIDATOR_CONTRACT_CORRECTIVE_2026-09-30.md
gateReadiness: EXACT_HEAD_CI_IN_PROGRESS
---

# Board / Media Performance v1 · Result v0.7

## Runtime state

Runtime implementation is frozen on the canonical integration branch.

The final Board adapter changed the participant path from per-Idea single reads to one batch read:

```text
ideaIds
→ dc_artifact_participants_batch_read_v1
→ group by artifact_id in memory
→ existing applyBoardEnrichment()
```

No runtime single-read fallback exists.

## #1330

Exact adapter candidate:

`dde55b15a03ced436de95e274c5160c94a94c9b6`

Site Integrity #1330 failed only in Artifact Collaboration browser acceptance because its QA Supabase stub had not been updated to the new batch RPC contract.

Board v2.1 fullscreen and navigation/adaptive validation passed on the same candidate.

## Validator-only corrective

New exact candidate:

`91a05166a46ad108f7f2aed3b66c5c1464b2863d`

Delta from failed candidate:

```text
scripts/validate-artifact-collaboration-browser.mjs
+4 / -0
```

Runtime files are unchanged.

Site Integrity #1331 is currently in progress.

## Gate

```text
G5 = WAITING EXACT-HEAD CI
G6 = NOT AUTHORIZED
PR #250 = DRAFT / OPEN / UNMERGED
production merge/deploy = NO
```
