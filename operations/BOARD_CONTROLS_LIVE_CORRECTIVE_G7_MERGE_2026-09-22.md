---
artifactId: dementor-club.operations.board-controls-live-corrective-g7-merge-2026-09-22
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

# STAB-06 · Board controls live corrective · G7 merge evidence

## Release decision

Exact validated candidate:

`a067ff50cab5b45177d163ec086f116b177f89b3`

PR:

`#240`

Validation:

`Site Integrity / Release Readiness #1250 / 35787057332 · attempt 2 · SUCCESS`

## Fresh pre-merge identity

```text
production = bdd23f80d12bd38a82b5afe2c1257e22d4e64beb
PR #240 = OPEN / DRAFT / UNMERGED / mergeable
base = bdd23f80d12bd38a82b5afe2c1257e22d4e64beb
head = a067ff50cab5b45177d163ec086f116b177f89b3
changed files = 6
production vs baseline = identical
```

## Merge

PR #240 was marked ready and merged using the exact expected head SHA.

New production:

`a26edad33839f0fef10c561570507e1ef0a4435d`

Merge parents:

1. `bdd23f80d12bd38a82b5afe2c1257e22d4e64beb`
2. `a067ff50cab5b45177d163ec086f116b177f89b3`

GitHub merge verification:

`verified = true`

## Exact content delta

Old production → new production:

```text
ahead = 12 commits
behind = 0
changed files = 6
```

Exact files:

1. `community/board/board-deeplink-auth-return-v1.js`
2. `community/board/board-fullscreen-v2-1.css`
3. `community/board/board-fullscreen-v2-1.js`
4. `community/board/board-integrations-v1.js`
5. `scripts/validate-board-deeplink-auth-return-browser.mjs`
6. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`

Candidate → production:

```text
ahead = 1 merge commit
content diff = 0 files
```

Production content equals the exact validated candidate.

## Backend boundary

`Supabase = NOT REQUIRED / NOT RUN`

Latest Supabase production workflow remains historical run #7 on SHA `0852d260...`.

## Current release state

```text
PR #240 = MERGED
production = a26edad33839f0fef10c561570507e1ef0a4435d
Pages deploy = NOT RUN IN THIS STEP
gate = G7_RELEASE
gateReadiness = MERGED_AWAITING_PAGES_DEPLOY
```

STAB-07 not started.
