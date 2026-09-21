---
artifactId: dementor-club.result.board-relations-visibility-toggle-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.3
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
productionCommit: 692c87da4a15a986861c18d41fc9861aa1cb08f6
integrationPullRequest: 232
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: true
productionDeployAuthorized: true
---

# MP | Dementor Club | RELEASE | Board Relations Visibility Toggle v1 | Result v0.3

## Goal

Fix the existing `СКРЫТЬ СВЯЗИ / ПОКАЗАТЬ СВЯЗИ` presentation contract so hiding relations removes all visible relation lines without mutating relation data.

Parent: #228 — STABILIZATION.

Scope: STAB-03 / BQA-16 only.

## Status

**ACTIVE / G7_RELEASE — PRODUCTION DEPLOYED / AUTHENTICATED LIVE RETEST BLOCKED**

## Validated candidate

`3a017d75271578089d5b108375b03c73dcf7832c`

PR:

`#232 · MERGED`

Production merge commit:

`692c87da4a15a986861c18d41fc9861aa1cb08f6`

Production contains the candidate content with no extra file diff.

## Exact production delta

Previous production:

`354d7ea9b176b55f2d4386b178f61cd9cd0e68ef`

New production:

`692c87da4a15a986861c18d41fc9861aa1cb08f6`

Changed files:

1. `community/board/board-relations-v1.js`
2. `scripts/validate-board-relations-runtime-browser.mjs`

No schema, DB, permission, persistence, Membership, Public Activity, Artifact detail or Contribution mutation.

## Pages release

Canonical workflow:

`Deploy Dementor Production`

Run:

```text
runNumber = 125
runId = 35645805930
headSha = 692c87da4a15a986861c18d41fc9861aa1cb08f6
status = COMPLETED
conclusion = SUCCESS
build = SUCCESS
deploy = SUCCESS
```

Pages exact production SHA: **PASS**.

Supabase deploy: **NOT REQUIRED / NOT RUN**.

## Authenticated live retest

Required live checks:

- relation lines visible;
- `СКРЫТЬ СВЯЗИ` → lines disappear;
- `ПОКАЗАТЬ СВЯЗИ` → same lines return;
- filter + toggle;
- refresh;
- mobile.

Production browser evidence run:

`1bedc2b8-ef33-4de2-993b-6174edfe32c2`

Observed:

- `НЕ ВЫПОЛНЕН ВХОД`;
- Board content restricted to members;
- relation lines and toggle controls unavailable.

Verdict:

`BLOCKED_NO_AUTHENTICATED_SESSION`

This is not a functional regression verdict. It means production live acceptance is not yet proven.

Evidence:

`operations/BOARD_RELATIONS_VISIBILITY_TOGGLE_LIVE_RETEST_2026-09-21.md`

## Gate

`G7_RELEASE`

```text
candidate validation         PASS
production merge             PASS
Pages exact production SHA   PASS
Pages deployment             PASS
authenticated live QA        BLOCKED
STAB-03 → WAITING / G8       NOT YET
STAB-04 activation           NOT YET
```

Gate readiness:

`BLOCKED_LIVE_AUTH_RETEST`

Do not advance to G8 until authenticated live evidence covers the required BQA-16 production scenarios.
