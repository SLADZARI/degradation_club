---
artifactId: dementor-club.operations.board-view-model-corrective-g7-merge-2026-09-22
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

# STAB-06 · Board View Model corrective · G7 merge evidence

## Release decision

Owner authorized release of exact validated candidate:

`8180b4a7b7caf37738604321fe5a34c344455b60`

PR:

`#239`

Validation:

`Site Integrity / Release Readiness #1243 / 35777088217 · SUCCESS`

## Fresh pre-merge identity

```text
production = d4d1e2f45883beff973a5cd5827e6f71065c0575
PR #239 = OPEN / DRAFT / UNMERGED / mergeable
base = d4d1e2f45883beff973a5cd5827e6f71065c0575
head = 8180b4a7b7caf37738604321fe5a34c344455b60
changed files = 7
production vs baseline = identical
```

## Merge

PR #239 was marked ready and merged with exact expected head SHA.

New production:

`bdd23f80d12bd38a82b5afe2c1257e22d4e64beb`

Merge parents:

1. `d4d1e2f45883beff973a5cd5827e6f71065c0575`
2. `8180b4a7b7caf37738604321fe5a34c344455b60`

GitHub merge verification:

`verified = true`

## Exact content delta

Old production → new production:

```text
ahead = 14 commits
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

Validated candidate → production:

```text
ahead = 1 merge commit
content diff = 0 files
```

Production content therefore equals the exact validated candidate.

## Backend boundary

`Supabase = NOT REQUIRED / NOT RUN`

No STAB-06 schema/RPC/RLS backend deployment exists or was started.

## Current release state

```text
PR #239 = MERGED
production = bdd23f80d12bd38a82b5afe2c1257e22d4e64beb
Pages deploy = NOT RUN IN THIS STEP
gate = G7_RELEASE
gateReadiness = MERGED_AWAITING_PAGES_DEPLOY
```

STAB-07 not started.
