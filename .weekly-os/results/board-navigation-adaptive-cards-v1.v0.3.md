---
artifactId: dementor-club.result.board-navigation-adaptive-cards-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.3
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.2
specification: operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_V1.md
integrationBranch: agent/board-navigation-adaptive-cards-v1
productionBaseCommit: 43b6dcaa11292f49564c989add219e0b095fbf8d
candidateCommit: faf57aa7a949f27d506ef9a969896e8653c32d2b
pullRequest: 158
implementationStartAuthorized: true
productionMergeAuthorized: true
productionDeployAuthorized: true
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | RELEASE | Board Navigation + Adaptive Cards v1 | Result v0.3

## Status

**ACTIVE / G7 RELEASE AUTHORIZED — MERGE PENDING**

## Goal

Release the already validated presentation-only Board UX revision from PR #158 without expanding Board semantics or creating parallel owners.

The release contains only:

1. mobile exposure of the existing canonical previous/next navigator;
2. intrinsic media sizing for existing Board cards;
3. stronger visual hierarchy across existing XS/S/M/L card size classes;
4. browser regression coverage for the above.

Visual differentiation by Board object/event type remains explicitly outside this Result and remains DRAFT / REFERENCE in `operations/BOARD_VISUAL_TYPE_LANGUAGE_V0.1.md`.

## Exact release candidate

Production baseline:

`43b6dcaa11292f49564c989add219e0b095fbf8d`

Validated candidate / PR head:

`faf57aa7a949f27d506ef9a969896e8653c32d2b`

PR:

`#158 — Board UX — mobile navigator + adaptive card rhythm`

Current PR diff remains exactly 3 files:

- `.github/workflows/site-integrity.yml`;
- `community/board/board-mobile-air-v2-1.css`;
- `scripts/validate-board-navigation-adaptive-cards-browser.mjs`.

No Board semantic JS owner, DB/RLS migration, Membership/DC-9, Telegram, Workspace/auth, Artifact lifecycle or spatial persistence owner is changed.

## Validation evidence

Site Integrity / Release Readiness **#1031 / run `34722775463` — SUCCESS** on exact candidate `faf57aa7a949f27d506ef9a969896e8653c32d2b`.

The run passed the integrated public/Board/DC-9/Membership/Workspace/WebKit/release matrix, including the new Board navigation/adaptive-card browser acceptance.

Initial CI #1029 remains useful negative evidence: it caught portrait distortion in the first implementation; the implementation was corrected and the final assertion was not weakened.

## Production authorization

Project owner explicit instruction on 2026-09-13:

`разрешаю #158 в production`

Interpretation for this Result:

- production merge authorized: **true**;
- production deploy authorized: **true**;
- live database mutation authorized: **false** because this Result has no database scope.

This authorization applies only to exact validated PR head `faf57aa7a949f27d506ef9a969896e8653c32d2b`. If the PR head changes before merge, full validation must pass again before release.

## Release procedure

1. Reconfirm PR #158 head equals validated candidate and diff remains only the intended 3 files.
2. Squash-merge PR #158 into `dementor-club-production` using expected-head protection.
3. Record exact resulting production commit.
4. Run the canonical `Deploy Dementor Production` workflow with `release_confirmation=APPROVED`.
5. Verify workflow checkout/build uses the exact production commit, then verify Pages deployment success and artifact digest.
6. Live-retest `/workspace/board/` on mobile and desktop before G8 closure.

`Commit ≠ merge ≠ deploy` remains in force.

## Open release gaps

Until the production workflow and live retest complete, do not claim this Result RELEASED / PRODUCTION READY / DONE.

Board Information Architecture v1 remains a separate WAITING / G8 Result; its deferred legitimate-actor promotion/Telegram/all-eight-state evidence is unchanged.