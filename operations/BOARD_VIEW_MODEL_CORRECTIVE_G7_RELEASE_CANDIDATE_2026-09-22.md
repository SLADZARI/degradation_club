---
artifactId: dementor-club.operations.board-view-model-corrective-g7-release-candidate-2026-09-22
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: BUILD
gate: G7_RELEASE
status: APPROVED
version: 1.1
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
supersedes: 1.0
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
---

# STAB-06 · Board View Model corrective · G7 release candidate

Production baseline remains exact:
`d4d1e2f45883beff973a5cd5827e6f71065c0575`

Final validated candidate:
`8180b4a7b7caf37738604321fe5a34c344455b60`

PR:
`#239 · OPEN / DRAFT / UNMERGED / mergeable`

Validation:
`Site Integrity / Release Readiness #1243 / 35777088217 · SUCCESS`

The previous candidate `155565786ac969c63a692006c145e4f4e266090d` / #1241 is superseded by this candidate after camera-fit correction.

Exact production → candidate:

```text
ahead = 13
behind = 0
changed files = 7
```

Files:
1. `community/board/board-entity-model-v1.js`
2. `community/board/board-fullscreen-v2-1.js`
3. `community/board/board-integrations-v1.js`
4. `community/board/board-spatial-v1.js`
5. `scripts/validate-board-batch-b-contract.mjs`
6. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`
7. `scripts/validate-board-v21-contract.mjs`

Fresh production compare during validation:
```text
production = d4d1e2f45883beff973a5cd5827e6f71065c0575
ahead = 0
behind = 0
content diff = 0
```

`current-program-v1.js` remains byte-identical to production.

```text
schema mutation = NO
semantic domain mutation = NO
Change Proposal = NO
Supabase deploy required = NO
production merge authorized = NO
production deploy authorized = NO
gateReadiness = READY_FOR_RELEASE_DECISION
```

STOP at exact validated corrective candidate.
