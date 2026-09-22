---
artifactId: dementor-club.result.board-mobile-information-hierarchy-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G7_RELEASE
status: REVIEW
workStatus: ACTIVE
version: 0.2
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
integrationBranch: result/board-mobile-information-hierarchy-v1
productionBaseCommit: 287b485293d68098dfd3c9302785369a735d42e2
candidateCommit: fbc891126532939a0a7350d18d19dbae807fb76f
releaseCandidateCommit: fbc891126532939a0a7350d18d19dbae807fb76f
integrationPullRequest: 238
validationRunNumber: 1238
validationRunId: 35740224085
validationConclusion: SUCCESS
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | BUILD | Board Mobile Information Hierarchy v1 | Result v0.2

## Work status

**ACTIVE / G7_RELEASE — VALIDATED CANDIDATE / READY FOR RELEASE DECISION**

Project lifecycle remains `BUILD`. Engineering release state is represented by `gate = G7_RELEASE` under the locally approved lifecycle field mapping.

## Exact identity

Production baseline:

`287b485293d68098dfd3c9302785369a735d42e2`

Integration branch:

`result/board-mobile-information-hierarchy-v1`

Validated candidate:

`fbc891126532939a0a7350d18d19dbae807fb76f`

Draft PR:

`#238`

## Corrective

Mobile 390 / 360:

- standalone Current Program strip absent;
- substantially more spatial Board owns first frame;
- Current Program available as an orthogonal option in the existing filter drawer;
- exact affiliation comes from `getCurrentProgram()` thing refs bridged only through canonical source type + slug;
- `ВСЁ` restores the Board;
- type filters + Program affiliation compose;
- Artifact subtype badges use existing subtype truth;
- platform badges use existing source type;
- `В ПРОГРАММЕ` appears only on exact matches;
- no title-based or Relations-based affiliation;
- pager / zoom / МОЁ / relations remain functional;
- no horizontal overflow.

Desktop:

- existing Current Program presentation remains visible with the same three cards.

`current-program-v1.js` is unchanged.

## Validation

G6 evidence:

`operations/BOARD_MOBILE_INFORMATION_HIERARCHY_G6_2026-09-22.md`

G7 evidence:

`operations/BOARD_MOBILE_INFORMATION_HIERARCHY_G7_RELEASE_CANDIDATE_2026-09-22.md`

Canonical CI:

```text
Site Integrity / Release Readiness #1238
run id = 35740224085
head = fbc891126532939a0a7350d18d19dbae807fb76f
conclusion = SUCCESS
```

## Exact diff

Production → candidate:

```text
ahead = 12
behind = 0
changed files = 8
```

1. `community/board/board-entity-model-v1.js`
2. `community/board/board-integrations-v1.js`
3. `community/board/board-mobile-harmonization-v1.css`
4. `community/board/board-program-v1.css`
5. `scripts/validate-board-batch-b-contract.mjs`
6. `scripts/validate-board-mobile-harmonization-browser.mjs`
7. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`
8. `scripts/validate-board-v21-contract.mjs`

## Change control

```text
schema mutation = NO
semantic mutation = NO
Change Proposal = NO
backendProductionDeployRequired = false
liveDatabaseMutationRequired = false
```

## Gate

`G7_RELEASE`

```text
status = REVIEW
workStatus = ACTIVE
productionMergeAuthorized = false
productionDeployAuthorized = false
gateReadiness = READY_FOR_RELEASE_DECISION
```

PR #238 remains DRAFT / UNMERGED.

STOP at validated candidate.

STAB-07 is not started.
