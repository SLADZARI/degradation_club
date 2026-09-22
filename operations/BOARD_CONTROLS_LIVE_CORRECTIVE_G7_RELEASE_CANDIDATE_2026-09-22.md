---
artifactId: dementor-club.operations.board-controls-live-corrective-g7-release-candidate-2026-09-22
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

# STAB-06 · Board controls live corrective · G7 release candidate

Production baseline:

`bdd23f80d12bd38a82b5afe2c1257e22d4e64beb`

Final validated candidate:

`a067ff50cab5b45177d163ec086f116b177f89b3`

PR:

`#240 · OPEN / DRAFT / UNMERGED / mergeable`

Validation:

```text
Site Integrity / Release Readiness #1250
run id = 35787057332
attempt = 2
conclusion = SUCCESS
```

The previous candidate `4669a1e7266b162e34c5f2792702d5efc0b8e93c` is superseded by this candidate after hardening the drawer paint-order and queued deep-link resolver race.

Exact production → candidate:

```text
ahead = 11
behind = 0
changed files = 6
```

Files:

1. `community/board/board-deeplink-auth-return-v1.js`
2. `community/board/board-fullscreen-v2-1.css`
3. `community/board/board-fullscreen-v2-1.js`
4. `community/board/board-integrations-v1.js`
5. `scripts/validate-board-deeplink-auth-return-browser.mjs`
6. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`

Fresh production compare:

```text
production = bdd23f80d12bd38a82b5afe2c1257e22d4e64beb
ahead = 0
behind = 0
content diff = 0
```

```text
productionMergeAuthorized = false
productionDeployAuthorized = false
SupabaseDeployRequired = false
gateReadiness = READY_FOR_RELEASE_DECISION
```

STOP at exact validated candidate.
