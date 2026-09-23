---
artifactId: dementor-club.operations.board-pager-live-corrective-g7-release-candidate-2026-09-23
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: BUILD
gate: G7_RELEASE
status: APPROVED
version: 1.0
updated: 2026-09-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
---

# STAB-06 · Board pager live corrective · G7 release candidate

Production baseline:

`a26edad33839f0fef10c561570507e1ef0a4435d`

Validated corrective candidate:

`0780bcdbe663ac5ce1ce14357e6b416c38310167`

PR:

`#241 · OPEN / DRAFT / UNMERGED / mergeable`

Validation:

```text
Site Integrity / Release Readiness #1257
run id = 35869634342
attempt = 2
conclusion = SUCCESS
```

Fresh production compare:

```text
production = a26edad33839f0fef10c561570507e1ef0a4435d
ahead = 0
behind = 0
content diff = 0
```

Production → candidate exact content delta:

1. `community/board/board-fullscreen-v2-1.js`
2. `community/board/board-integrations-v1.js`
3. `community/board/board-spatial-v1.js`
4. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`

Root cause and browser evidence are recorded in:

`operations/BOARD_PAGER_LIVE_CORRECTIVE_G6_2026-09-23.md`

```text
productionMergeAuthorized = false
productionDeployAuthorized = false
SupabaseDeployRequired = false
gateReadiness = READY_FOR_RELEASE_DECISION
```

STOP before merge/deploy.
