---
artifactId: dementor-club.result.board-mobile-information-hierarchy-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G7_RELEASE
status: REVIEW
workStatus: ACTIVE
version: 0.6
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.5
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
integrationBranch: result/board-mobile-information-hierarchy-v1
integrationBaseRef: dementor-club-production
integrationBaseCommit: d4d1e2f45883beff973a5cd5827e6f71065c0575
productionBaseCommit: d4d1e2f45883beff973a5cd5827e6f71065c0575
candidateCommit: 8180b4a7b7caf37738604321fe5a34c344455b60
releaseCandidateCommit: 8180b4a7b7caf37738604321fe5a34c344455b60
integrationPullRequest: 239
validationRunNumber: 1243
validationRunId: 35777088217
validationConclusion: SUCCESS
exactDiffFileCount: 7
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
liveRetestStatus: CORRECTIVE_CANDIDATE_VALIDATED
---

# MP | Dementor Club | BUILD | Board Mobile Information Hierarchy v1 | Result v0.6

## Work status

**ACTIVE / G7_RELEASE — FINAL CORRECTIVE VALIDATED / READY FOR RELEASE DECISION**

This is the same STAB-06 Result.

Approved authority:
`operations/BOARD_VIEW_MODEL_DECISION_V1.md`

Production baseline:
`d4d1e2f45883beff973a5cd5827e6f71065c0575`

Final corrective candidate:
`8180b4a7b7caf37738604321fe5a34c344455b60`

Draft PR:
`#239`

Validation:
`Site Integrity / Release Readiness #1243 / 35777088217 · SUCCESS`

The prior v0.5 candidate `155565786ac969c63a692006c145e4f4e266090d` is superseded after the required full-set camera fit exposed a real minimum-scale blocker.

## Canonical Board View

User-facing state is one `activeView`.

No hidden `activeFilter + currentProgramOnly` compound state remains.

Current Program remains a separate affiliation/context dimension in data and one canonical View in presentation.

`МОЁ` remains locator/focus and does not establish persistent filter state.

Relations remain independent presentation.

Every explicit View change fits camera to the visible set without mutating persisted card positions.

Pager reflects the visible set.

## Browser acceptance

Required sequence PASS on 390 / 360 / desktop:

```text
ВСЁ
→ ТЕКУЩАЯ ПРОГРАММА
→ КУРСЫ / ПРОГРАММЫ
→ ПРОЕКТЫ / ПРОДУКТЫ
→ ВСЁ
```

Exactly one View is active at each step; expected visible sets, camera fit, pager, coordinate invariance, exact Program identity, same-title guard, canonical badges, МОЁ locator, Relations-visible-set invariance, desktop/mobile semantic equality, mobile Program-strip suppression and desktop Program presentation all PASS.

## Exact diff

Production → candidate = exactly 7 files:

1. `community/board/board-entity-model-v1.js`
2. `community/board/board-fullscreen-v2-1.js`
3. `community/board/board-integrations-v1.js`
4. `community/board/board-spatial-v1.js`
5. `scripts/validate-board-batch-b-contract.mjs`
6. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`
7. `scripts/validate-board-v21-contract.mjs`

`current-program-v1.js` is unchanged.

## Evidence

- `operations/BOARD_VIEW_MODEL_CORRECTIVE_G6_2026-09-22.md` v1.1
- `operations/BOARD_VIEW_MODEL_CORRECTIVE_G7_RELEASE_CANDIDATE_2026-09-22.md` v1.1

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
