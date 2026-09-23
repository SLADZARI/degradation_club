---
artifactId: dementor-club.result.board-mobile-information-hierarchy-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: REVIEW
workStatus: ACTIVE
version: 0.12
updated: 2026-09-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.11
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
integrationBranch: result/board-mobile-information-hierarchy-v1
integrationBaseRef: dementor-club-production
integrationBaseCommit: a26edad33839f0fef10c561570507e1ef0a4435d
productionBaseCommit: a26edad33839f0fef10c561570507e1ef0a4435d
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
liveRetestStatus: CORRECTIVE_REQUIRED
---

# MP | Dementor Club | BUILD | Board Mobile Information Hierarchy v1 | Result v0.12

## Work status

**ACTIVE / G5_BUILD — LIVE PAGER CORRECTIVE REQUIRED**

Same STAB-06 Result.

Production baseline:

`a26edad33839f0fef10c561570507e1ef0a4435d`

Pages baseline:

`Deploy Dementor Production #132 / 35834976559 · SUCCESS`

Live QA:

`operations/BOARD_PAGER_LIVE_QA_CORRECTIVE_2026-09-23.md`

## Corrective target

Pager must remain UI/index owner only.

Canonical spatial owner must own all camera movement.

Required path:

```text
pager selects target Thing
→ spatial owner focuses target
→ canonical camera changes
→ DOM transform follows canonical camera
```

Required browser sequence covers 1440 / 390 / 360, forward/back/wrap, zoom/pan/View/Program/Relations/stale-focus/coordinate invariance.

## Gate

`G5_BUILD`

No merge.
No deploy.
No Supabase.
No STAB-07.
