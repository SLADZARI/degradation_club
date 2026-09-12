---
artifactId: dementor-club.evidence.board-navigation-adaptive-cards-release-2026-09-13
project: dementor-club
documentType: QA_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: APPROVED_EVIDENCE
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-navigation-adaptive-cards-v1
---

# Board Navigation + Adaptive Cards v1 — production release evidence

## Authorization

Explicit project-owner instruction:

`разрешаю #158 в production`

Authorization applied to exact validated PR head:

`faf57aa7a949f27d506ef9a969896e8653c32d2b`

## Pre-merge evidence

- PR: `#158 — Board UX — mobile navigator + adaptive card rhythm`
- base: `dementor-club-production`
- exact production baseline before merge: `43b6dcaa11292f49564c989add219e0b095fbf8d`
- head: `faf57aa7a949f27d506ef9a969896e8653c32d2b`
- mergeable: true
- changed files: exactly 3
  - `.github/workflows/site-integrity.yml`
  - `community/board/board-mobile-air-v2-1.css`
  - `scripts/validate-board-navigation-adaptive-cards-browser.mjs`
- full Site Integrity / Release Readiness: `#1031`, run `34722775463`, SUCCESS

No DB/RLS/migration, Membership/DC-9, Telegram, Artifact lifecycle, entity ownership, Workspace shell, auth owner or spatial persistence files were part of the release diff.

## Merge evidence

PR #158 was squash-merged with expected-head protection against exact head `faf57aa7a949f27d506ef9a969896e8653c32d2b`.

Resulting `dementor-club-production` commit:

`d7451d1d7023edf4ff85abb17fa6235ddc53bb35`

Production branch was re-read after merge and resolves to the same commit.

Candidate and production merge commit resolve to the same released tree:

`9adfa8fa800c221e27b80e767864efa206acc3d9`

## Deploy evidence

Deploy Dementor Production #65 / workflow run `34723798930` — SUCCESS.

The build job explicitly checked out `dementor-club-production`; `git log -1 --format=%H` returned:

`d7451d1d7023edf4ff85abb17fa6235ddc53bb35`

before the production validation/build steps.

Build/release guards passed, including registry/routes/feature-state validation, content readiness, visual contract, production Pages build, analytics/consent guard and production release guard.

Pages artifact:

`10307500383`

Artifact digest:

`sha256:cc65101ed21f1f102a1772b328abd9eb48439285efd9731fc1363130a03e5c9b`

GitHub Pages deployment reported SUCCESS and environment URL `http://dementor.club/`.

## Live smoke

Project owner reported live smoke PASS after deployment on `/workspace/board/` for the released Board navigation/adaptive-card behavior.

This is owner-provided live evidence. It does not claim a separate post-deploy automated browser run beyond the already-green pre-release browser matrix.

## Release conclusion

Release evidence is complete for G7:

- exact validated candidate;
- exact production merge commit;
- exact production commit used for build;
- successful Pages artifact and deployment;
- artifact id/digest recorded;
- owner live smoke PASS.

G8 cleanup/closure evidence is recorded separately at:

`operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_G8_2026-09-13.md`.