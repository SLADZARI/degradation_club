---
artifactId: dementor-club.result.board-media-performance-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
workStatus: ACTIVE
version: 0.4
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.3
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
frontendWorkerCandidate: 09b33b731610258f7049aa1a4b9576db393176a1
frontendWorkerStatus: CLEAN_GREEN_FROZEN
backendWorkerCandidate: 834bb9776c4e99bb73556c4776c49f270fe70a6c
backendWorkerStatus: STATIC_PASS_RUNTIME_PENDING
frontendIntegrationCommit: 0eac2c9b00bc6a493ec331780948693e16c2a654
integrationPullRequest: 250
g5FrontendRun: 1327
g5FrontendRunId: 36691834625
g5CoordinateDriftRootCause: CONFIRMED
g5CorrectiveAuthorized: true
g5CorrectiveScope: community/board/board-own-drag-livefix-v2-2.js
g5RootCauseEvidence: operations/BOARD_MEDIA_PERFORMANCE_G5_COORDINATE_DRIFT_ROOT_CAUSE_2026-09-30.md
gateReadiness: CORRECTIVE_AUTHORIZED_EXACT_VALIDATION_REQUIRED
---

# Board / Media Performance v1 · Result v0.4

## Current state

Exact frontend integration candidate remains:

`0eac2c9b00bc6a493ec331780948693e16c2a654`

PR #250 remains DRAFT / OPEN / UNMERGED.

The coordinate-drift blocker now has a proven root cause.

## Root cause

Progressive Board lifecycle activates an older compatibility centering layer in:

`community/board/board-own-drag-livefix-v2-2.js`

That layer maintains a second world/display coordinate owner through `boardOffset` and `ensureCenteredCloud()`.

On View restoration:

```text
board-spatial placeCards() → persisted raw positions
then
legacy livefix ensureCenteredCloud() → raw + boardOffset
```

This changes Artifact `style.left/top` while DB position truth remains unchanged.

The behavior is deterministic across 390 / 360 / desktop.

## Corrective

Authorized corrective is constrained to the existing livefix file.

Goal:

```text
board-spatial-v1 = canonical world-position + camera owner
board-own-drag-livefix-v2-2 = narrow document-capture own-card drag compatibility only
```

Do not change progressive render or media normalization to mask the ownership conflict.

## Required validation

After corrective:

- Board navigation/adaptive cards browser acceptance PASS;
- v2.1 fullscreen drag/movement PASS;
- Board/media performance browser PASS;
- BQA-24/BQA-28 regression PASS;
- full PR #250 Site Integrity PASS.

Backend integration remains on HOLD until frontend G5 is green.

```text
G5 = BLOCKED / CORRECTIVE AUTHORIZED
G6 = NOT AUTHORIZED
```
