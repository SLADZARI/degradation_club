---
artifactId: dementor-club.result.board-media-performance-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
workStatus: ACTIVE
version: 0.3
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.2
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
g5Attempt1Status: FAIL_OWNER_ADMIN_DRAG_INTERMITTENT
g5Attempt2Status: FAIL_WORLD_COORDINATE_DRIFT
g5OwnerDragCurrentVerdict: NOT_PROVEN_DETERMINISTIC
g5CurrentBlockerEvidence: operations/BOARD_MEDIA_PERFORMANCE_G5_COORDINATE_DRIFT_BLOCKER_2026-09-30.md
gateReadiness: COORDINATE_DRIFT_ROOT_CAUSE_REQUIRED
---

# Board / Media Performance v1 · Result v0.3

## Current G5 state

Exact candidate remains unchanged:

`0eac2c9b00bc6a493ec331780948693e16c2a654`

PR #250 remains draft / unmerged.

### Attempt 1

OWNER_ADMIN drag canonical write was not observed.

Subsequent forensic replay and exact rerun on the same candidate did not reproduce it.

Current classification:

```text
intermittent / timing-sensitive
deterministic candidate regression = NOT PROVEN
runtime patch = NOT AUTHORIZED
```

### Attempt 2

OWNER_ADMIN drag gate passed.

Full G5 then failed the Board navigation/adaptive-cards contract at all three viewport classes.

Observed failures:

```text
390:
  ВСЁ restore changes card style.left/top
  post-pager View restore changes card style.left/top

360:
  same

desktop:
  same
```

The validator compares inline world/display coordinates. It does not directly prove a DB persistence mutation.

## Current diagnostic boundary

Candidate-specific source change includes progressive Board enrichment and new `dc:board-projections-updated` events.

Canonical spatial owners themselves remain unchanged.

Before any patch, identify the first divergent step between production and candidate across:

```text
projection event
→ placeCards
→ size/geometry
→ centering/livefix
→ view switch
→ inline world positions
→ optional DB write
```

## Backend

DEV1 batch candidate remains frozen and is not integrated while frontend G5 is blocked.

## Gate

```text
G5 = BLOCKED
G6 = NOT AUTHORIZED
production merge = NO
production deploy = NO
```
