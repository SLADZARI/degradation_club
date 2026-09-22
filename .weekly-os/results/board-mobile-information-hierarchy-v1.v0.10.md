---
artifactId: dementor-club.result.board-mobile-information-hierarchy-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G7_RELEASE
status: REVIEW
workStatus: ACTIVE
version: 0.10
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.9
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
integrationBranch: result/board-mobile-information-hierarchy-v1
integrationBaseRef: dementor-club-production
integrationBaseCommit: bdd23f80d12bd38a82b5afe2c1257e22d4e64beb
productionBaseCommit: bdd23f80d12bd38a82b5afe2c1257e22d4e64beb
candidateCommit: a067ff50cab5b45177d163ec086f116b177f89b3
releaseCandidateCommit: a067ff50cab5b45177d163ec086f116b177f89b3
integrationPullRequest: 240
validationRunNumber: 1250
validationRunId: 35787057332
validationRunAttempt: 2
validationConclusion: SUCCESS
exactDiffFileCount: 6
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
liveRetestStatus: CORRECTIVE_CANDIDATE_VALIDATED
---

# MP | Dementor Club | BUILD | Board Mobile Information Hierarchy v1 | Result v0.10

## Work status

**ACTIVE / G7_RELEASE — LIVE CONTROLS CORRECTIVE VALIDATED / READY FOR RELEASE DECISION**

Same STAB-06 Result.

Production baseline:

`bdd23f80d12bd38a82b5afe2c1257e22d4e64beb`

Final validated candidate:

`a067ff50cab5b45177d163ec086f116b177f89b3`

Draft PR:

`#240`

Canonical validation:

`Site Integrity / Release Readiness #1250 / 35787057332 · attempt 2 · SUCCESS`

The previous v0.9 candidate `4669a1e7...` is superseded.

## Corrective result

1. Desktop View drawer remains above standalone Current Program, including wide desktop owner geometry.
2. Explicit View/pager navigation consumes stale `focus=artifact` before reflow/focus.
3. Already queued deep-link resolvers are invalidated and cannot reopen the stale Artifact.
4. Existing share/deeplink/history behavior remains intact.
5. Existing one-active Board View semantics remain intact.
6. Current Program composition remains unchanged.

## Exact diff

Production → candidate = exactly 6 files:

1. `community/board/board-deeplink-auth-return-v1.js`
2. `community/board/board-fullscreen-v2-1.css`
3. `community/board/board-fullscreen-v2-1.js`
4. `community/board/board-integrations-v1.js`
5. `scripts/validate-board-deeplink-auth-return-browser.mjs`
6. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`

## Gate

```text
projectStage = BUILD
status = REVIEW
workStatus = ACTIVE
gate = G7_RELEASE
gateReadiness = READY_FOR_RELEASE_DECISION
```

No merge.
No deploy.
No Supabase.
STAB-07 not started.

Evidence:

- `operations/BOARD_CONTROLS_LIVE_CORRECTIVE_G6_2026-09-22.md` v1.1
- `operations/BOARD_CONTROLS_LIVE_CORRECTIVE_G7_RELEASE_CANDIDATE_2026-09-22.md` v1.1
