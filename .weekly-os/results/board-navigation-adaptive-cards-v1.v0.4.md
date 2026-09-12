---
artifactId: dementor-club.result.board-navigation-adaptive-cards-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.4
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.3
specification: operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_V1.md
integrationBranch: agent/board-navigation-adaptive-cards-v1
productionBaseCommit: 43b6dcaa11292f49564c989add219e0b095fbf8d
candidateCommit: faf57aa7a949f27d506ef9a969896e8653c32d2b
pullRequest: 158
implementationStartAuthorized: true
productionMergeAuthorized: true
productionDeployAuthorized: true
productionCommit: d7451d1d7023edf4ff85abb17fa6235ddc53bb35
productionMergeComplete: true
productionDeployStatus: PENDING_MANUAL_WORKFLOW
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | RELEASE | Board Navigation + Adaptive Cards v1 | Result v0.4

## Status

**ACTIVE / G7 — MERGED TO PRODUCTION BRANCH / DEPLOY PENDING**

## Exact release state

Authorized PR #158 was squash-merged with expected-head protection on exact validated head:

`faf57aa7a949f27d506ef9a969896e8653c32d2b`

Resulting `dementor-club-production` commit:

`d7451d1d7023edf4ff85abb17fa6235ddc53bb35`

The production branch was re-read after merge and resolves to the same commit.

Full candidate validation remains Site Integrity / Release Readiness **#1031 / run `34722775463` — SUCCESS**.

## Scope preserved

Release diff remains only:

- `.github/workflows/site-integrity.yml`;
- `community/board/board-mobile-air-v2-1.css`;
- `scripts/validate-board-navigation-adaptive-cards-browser.mjs`.

No DB/RLS/migrations, Membership/DC-9/Application semantics, Artifact lifecycle, Telegram Promotion/outbox/scheduler, entity ownership, spatial persistence, Artifact detail owner, Public Header, or Workspace shell changes.

Visual type-language remains excluded and DRAFT / REFERENCE.

## Deploy state

The canonical Pages workflow is manual:

`Deploy Dementor Production` (`.github/workflows/deploy-pages.yml`).

Required launch state:

- branch: `dementor-club-production`;
- input: `release_confirmation=APPROVED`.

Production deploy is authorized by the owner but has not yet been launched in this Result state.

## Evidence

Release evidence:

`operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_RELEASE_2026-09-13.md`

## Remaining gate

After manual workflow launch:

1. verify successful run;
2. verify checkout/build used exact production commit `d7451d1d7023edf4ff85abb17fa6235ddc53bb35`;
3. capture Pages artifact id/digest;
4. live-retest `/workspace/board/` on mobile and desktop;
5. only then move toward G8 cleanup.

Do not claim RELEASED / PRODUCTION READY / DONE before that evidence exists.