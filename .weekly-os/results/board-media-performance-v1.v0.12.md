---
artifactId: dementor-club.result.board-media-performance-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
workStatus: WAITING_MANUAL_DEPLOY
version: 0.12
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.11
parentQa: BQA-20,BQA-27
productionBaseCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
validatedCandidate: 91a05166a46ad108f7f2aed3b66c5c1464b2863d
releaseBranch: release/board-media-performance-v1
releaseCandidateCommit: 52ec2966048e16347d8a918ce358d26dff3f803e
releasePullRequest: 251
productionMergeCommit: cde332779ab0e256dd1e498660d6fa651e91846e
g7MergeEvidence: operations/BOARD_MEDIA_PERFORMANCE_G7_MERGE_2026-09-30.md
productionMergeAuthorized: true
productionMergeExecuted: true
productionDeployAuthorized: true
productionDeployExecuted: false
liveDatabaseMutationAuthorized: true
liveDatabaseMutationExecuted: false
deployExecutor: OWNER_MANUAL_GITHUB_ACTION
gateReadiness: MANUAL_SUPABASE_THEN_PAGES_DEPLOY_REQUIRED
---

# Board / Media Performance v1 · Result v0.12

## Current state

```text
G5 = PASS
G6 = PASS
G7 clean RC = PASS
production merge = DONE
manual deployment = PENDING
```

New production branch SHA:

`cde332779ab0e256dd1e498660d6fa651e91846e`

Production tree is identical to the validated clean RC tree.

## Deployment ownership

Deployment is explicitly owner-executed through GitHub Actions.

Required order:

1. Deploy Dementor Supabase Production;
2. Deploy Dementor Production;
3. live BQA-20/BQA-27 retest;
4. G8 cleanup.

No direct or duplicate Supabase mutation is authorized outside the canonical manual workflow.

## Current boundary

```text
Supabase migration apply = NOT YET EXECUTED
Pages production deploy  = NOT YET EXECUTED
live acceptance          = NOT YET EXECUTED
G8                        = NOT YET AUTHORIZED
```
