---
artifactId: dementor-club.result.board-media-performance-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
workStatus: ACTIVE
version: 0.2
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
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
g5FrontendStatus: BLOCKED_OWNER_ADMIN_DRAG
g5BlockerEvidence: operations/BOARD_MEDIA_PERFORMANCE_G5_OWNER_DRAG_BLOCKER_2026-09-30.md
gateReadiness: ROOT_CAUSE_REQUIRED
---

# Board / Media Performance v1 · Result v0.2

## Current state

Clean DEV2 frontend tree is integrated on the one canonical Result branch.

Worker-level performance/media acceptance remains positive, but exact full-repository G5 exposed a regression in the existing Board v2.1 OWNER_ADMIN drag contract.

```text
DEV2 worker browser QA      PASS
production-shape 21/3/13    PASS
BQA-24 regression           PASS
BQA-28 regression           PASS
exact full Site Integrity   FAIL
```

Failure:

```text
OWNER_ADMIN card becomes is-admin-movable
→ pointer drag
→ no canonical dc_artifact_board_positions update observed
```

## Current rule

Do not integrate DEV1 backend until this frontend regression is resolved and full exact-head CI returns PASS.

No runtime patch is authorized before exact first-divergence/root-cause evidence.

## Next

1. DEV2 diagnostic on exact owner drag case;
2. minimal canonical-owner fix only if root cause proves candidate regression;
3. rerun exact PR #250 Site Integrity;
4. only after PASS proceed to DEV1 DB runtime proof/integration.

```text
G5 = BLOCKED
G6 = NOT AUTHORIZED
```
