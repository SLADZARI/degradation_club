---
artifactId: dementor-club.result.board-relations-visibility-toggle-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G8_CLEANUP
status: WAITING
version: 0.4
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 228
scope:
  - STAB-03
  - BQA-16
integrationBranch: null
productionBaseCommit: 354d7ea9b176b55f2d4386b178f61cd9cd0e68ef
candidateCommit: 3a017d75271578089d5b108375b03c73dcf7832c
productionCommit: 692c87da4a15a986861c18d41fc9861aa1cb08f6
integrationPullRequest: 232
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: true
productionDeployAuthorized: true
---

# MP | Dementor Club | G8 | Board Relations Visibility Toggle v1 | Result v0.4

## Goal

Fix the existing `СКРЫТЬ СВЯЗИ / ПОКАЗАТЬ СВЯЗИ` presentation contract so hiding relations removes all visible relation lines without mutating relation data.

## Status

**WAITING / G8_CLEANUP — RELEASED / OWNER LIVE RETEST PASS / NO ACTIVE IMPLEMENTATION OWNERSHIP**

Parent: #228 — STABILIZATION.

Scope: STAB-03 / BQA-16 only.

## Release

```text
validatedCandidate = 3a017d75271578089d5b108375b03c73dcf7832c
pullRequest = #232
productionCommit = 692c87da4a15a986861c18d41fc9861aa1cb08f6
pagesWorkflowRunNumber = 125
pagesWorkflowRunId = 35645805930
pagesConclusion = SUCCESS
backendProductionDeployRequired = false
liveDatabaseMutationRequired = false
```

Exact runtime delta:

- `community/board/board-relations-v1.js`
- `scripts/validate-board-relations-runtime-browser.mjs`

## Validation

G6/G7 evidence:

- `operations/BOARD_RELATIONS_VISIBILITY_TOGGLE_G6_2026-09-21.md`
- `operations/BOARD_RELATIONS_VISIBILITY_TOGGLE_G7_RELEASE_CANDIDATE_2026-09-21.md`

Production live evidence:

- `operations/BOARD_RELATIONS_VISIBILITY_TOGGLE_LIVE_RETEST_2026-09-21.md`

Owner-confirmed production acceptance:

```text
visible → hide                         PASS
hide → show                            PASS
same lines restore                     PASS
filters + toggle                       PASS
refresh / ephemeral contract           PASS
mobile                                 PASS
```

## Handoff

```text
status = WAITING
gate = G8_CLEANUP
integrationBranch = null
activeIntegrationOwnership = false
releaseExecutionStatus = LIVE_PASS
```

Parent #228 remains open. STAB-04 / BQA-14 may now become the single active implementation Result.
