---
artifactId: dementor-club.operations.board-view-model-corrective-g7-release-candidate-2026-09-22
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: BUILD
gate: G7_RELEASE
status: APPROVED
version: 1.0
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
---

# STAB-06 · Board View Model corrective · G7 release candidate

## Production

Exact baseline:

`d4d1e2f45883beff973a5cd5827e6f71065c0575`

Fresh compare after validation:

```text
production vs baseline = identical
ahead = 0
behind = 0
```

## Validated corrective candidate

`155565786ac969c63a692006c145e4f4e266090d`

PR:

`#239 · OPEN / DRAFT / UNMERGED / mergeable`

Validation:

```text
Site Integrity / Release Readiness #1241
run id = 35773470724
conclusion = SUCCESS
```

## Exact production → candidate diff

```text
ahead = 11 commits
behind = 0
changed files = 7
```

Exact files:

1. `community/board/board-entity-model-v1.js`
2. `community/board/board-fullscreen-v2-1.js`
3. `community/board/board-integrations-v1.js`
4. `community/board/board-spatial-v1.js`
5. `scripts/validate-board-batch-b-contract.mjs`
6. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`
7. `scripts/validate-board-v21-contract.mjs`

No CSS file changed in the corrective because the mobile Program-strip suppression and desktop Program presentation from the first STAB-06 release remain valid.

`current-program-v1.js` is unchanged.

## Release boundary

```text
schema mutation = NO
semantic domain mutation = NO
Change Proposal = NO
backend production deploy required = NO
Supabase deploy required = NO
production merge authorized = NO
production deploy authorized = NO
```

## G7 verdict

`READY_FOR_RELEASE_DECISION`

STOP.

Do not mark PR ready, merge, deploy or start STAB-07 without a new owner release decision.
