---
artifactId: dementor-club.evidence.board-navigation-adaptive-cards-release-2026-09-13
project: dementor-club
documentType: QA_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE_EVIDENCE
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

Authorization applies to exact validated PR head:

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

No DB/RLS/migration, Membership/DC-9, Telegram, Artifact lifecycle, entity ownership, Workspace shell, or spatial persistence files were part of the release diff.

## Merge evidence

PR #158 was squash-merged with expected-head protection against exact head `faf57aa7a949f27d506ef9a969896e8653c32d2b`.

Resulting `dementor-club-production` commit:

`d7451d1d7023edf4ff85abb17fa6235ddc53bb35`

Production branch was re-read after merge and resolves to the same commit.

## Deploy state

**PENDING MANUAL WORKFLOW_DISPATCH**

Canonical workflow:

`.github/workflows/deploy-pages.yml` / `Deploy Dementor Production`

Required input:

`release_confirmation=APPROVED`

The workflow itself guards both build and deploy on:

- `github.ref == refs/heads/dementor-club-production`
- `inputs.release_confirmation == APPROVED`

Merge alone is not deployment.

## Remaining release evidence

Before claiming RELEASED / PRODUCTION READY / DONE:

1. launch `Deploy Dementor Production` for `dementor-club-production` with `release_confirmation=APPROVED`;
2. verify workflow success;
3. verify checkout/build used exact production commit `d7451d1d7023edf4ff85abb17fa6235ddc53bb35`;
4. record Pages artifact id/digest and deployment success;
5. live-retest `/workspace/board/` on mobile and desktop, including arrows, `ТИПЫ`, card/media proportions, and existing Board interactions.
