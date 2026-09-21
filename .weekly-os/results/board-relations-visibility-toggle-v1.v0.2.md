---
artifactId: dementor-club.result.board-relations-visibility-toggle-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.2
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 228
scope:
  - STAB-03
  - BQA-16
integrationBranch: result/board-relations-visibility-toggle-v1
productionBaseCommit: 354d7ea9b176b55f2d4386b178f61cd9cd0e68ef
candidateCommit: 3a017d75271578089d5b108375b03c73dcf7832c
integrationPullRequest: 232
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | RELEASE | Board Relations Visibility Toggle v1 | Result v0.2

## Goal

Fix the existing `СКРЫТЬ СВЯЗИ / ПОКАЗАТЬ СВЯЗИ` presentation contract so hiding relations removes all visible relation lines without mutating relation data.

Parent: #228 — STABILIZATION.

Scope: STAB-03 / BQA-16 only.

## Status

**ACTIVE / G7_RELEASE — VALIDATED CANDIDATE / READY FOR RELEASE DECISION**

## Production baseline

`dementor-club-production@354d7ea9b176b55f2d4386b178f61cd9cd0e68ef`

Implementation branch:
`result/board-relations-visibility-toggle-v1`

Validated candidate:
`3a017d75271578089d5b108375b03c73dcf7832c`

Draft PR:
`#232`

## Corrective

Canonical runtime owner:
`community/board/board-relations-v1.js`

Production behavior:

```js
svg.hidden = !relationsVisible;
```

Validated corrective:

```js
svg.toggleAttribute('hidden', !relationsVisible);
```

No second relation visibility mechanism was created.

Regression owner:
`scripts/validate-board-relations-runtime-browser.mjs`

## G6 validated candidate

```text
candidateCommit = 3a017d75271578089d5b108375b03c73dcf7832c
pullRequest = 232
validationRunNumber = 1227
validationRunId = 35643952922
validationConclusion = SUCCESS
exactDiffFileCount = 2
```

Targeted Board Relations browser regression PASS:
- visible → hide → show;
- same relation lines restore;
- filters + toggle;
- drag/layout reconciliation;
- current ephemeral refresh contract;
- desktop Chromium;
- mobile 390;
- mobile 360.

Evidence:
`operations/BOARD_RELATIONS_VISIBILITY_TOGGLE_G6_2026-09-21.md`

## G7 release candidate precheck

Production remained exactly:
`354d7ea9b176b55f2d4386b178f61cd9cd0e68ef`

Production → candidate:
- ahead 3;
- behind 0;
- exactly 2 changed files.

Exact files:
1. `community/board/board-relations-v1.js`
2. `scripts/validate-board-relations-runtime-browser.mjs`

Evidence:
`operations/BOARD_RELATIONS_VISIBILITY_TOGGLE_G7_RELEASE_CANDIDATE_2026-09-21.md`

## Change control

```text
schema mutation = NO
semantic mutation = NO
Change Proposal = NO
backendProductionDeployRequired = false
liveDatabaseMutationRequired = false
```

Not changed:
- relation schema/types;
- permissions;
- persistence;
- BQA-17 default-hidden proposal;
- Artifact detail;
- Public Activity;
- Membership;
- Contribution.

## Gate

`G7_RELEASE`

```text
productionMergeAuthorized = false
productionDeployAuthorized = false
gateReadiness = READY_FOR_RELEASE_DECISION
```

STOP at validated candidate. STAB-04 is not started.
