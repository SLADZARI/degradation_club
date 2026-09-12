---
artifactId: dementor-club.result.board-navigation-adaptive-cards-v1
project: dementor-club
documentType: RESULT
projectStage: CLEANUP
gate: G8_CLEANUP
status: APPROVED
version: 1.0
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.4
specification: operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_V1.md
integrationBranch: agent/board-navigation-adaptive-cards-v1
productionBaseCommit: 43b6dcaa11292f49564c989add219e0b095fbf8d
candidateCommit: faf57aa7a949f27d506ef9a969896e8653c32d2b
pullRequest: 158
implementationStartAuthorized: true
productionMergeAuthorized: true
productionDeployAuthorized: true
productionCommit: d7451d1d7023edf4ff85abb17fa6235ddc53bb35
productionDeployRun: 65
productionDeployRunId: 34723798930
pagesArtifactId: 10307500383
pagesArtifactDigest: sha256:cc65101ed21f1f102a1772b328abd9eb48439285efd9731fc1363130a03e5c9b
productionDeployStatus: SUCCESS
liveRetest: PASS_OWNER_SMOKE_2026-09-13
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | CLEANUP | Board Navigation + Adaptive Cards v1 | Result v1.0

## Status

**APPROVED / G8 CLOSED / RELEASED**

## Goal result

The existing canonical Board presentation was extended without introducing parallel Board mechanics:

- the existing previous/next navigator is exposed on narrow mobile;
- portrait/landscape media preserve intrinsic proportions instead of collapsing into one cropped strip;
- the existing XS/S/M/L card classes have a stronger typographic hierarchy;
- the mobile `ТИПЫ` drawer remains clear of the visible navigator;
- durable Chromium acceptance covers 390 / 430 / desktop navigation and card/media geometry.

No DB/RLS/migrations, Membership/DC-9/Application semantics, Artifact lifecycle, Telegram Promotion/outbox/scheduler, Board taxonomy, entity ownership, spatial persistence, Artifact detail owner, Public Header or Workspace shell semantics were changed.

## Validation and release

Candidate:

`faf57aa7a949f27d506ef9a969896e8653c32d2b`

Full Site Integrity / Release Readiness #1031 / run `34722775463` — PASS.

PR #158 was squash-merged to production commit:

`d7451d1d7023edf4ff85abb17fa6235ddc53bb35`

Deploy Dementor Production #65 / run `34723798930` — SUCCESS.

Build logs confirm exact checkout/build of `d7451d1d7023edf4ff85abb17fa6235ddc53bb35`.

Pages artifact: `10307500383`.

Digest: `sha256:cc65101ed21f1f102a1772b328abd9eb48439285efd9731fc1363130a03e5c9b`.

Project-owner production smoke: PASS on `/workspace/board/`.

## G8 cleanup

Evidence:

`operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_G8_2026-09-13.md`

Completed cleanup classification:

- PR #158 is merged/closed and no release PR remains open for this Result;
- `agent/board-navigation-adaptive-cards-v1` is retired from active integration ownership and is historical only;
- no duplicate navigator/card/state/runtime owner was introduced;
- the new browser script is retained deliberately as regression acceptance, not as temporary runtime;
- no temporary feature flag or compatibility layer introduced by this Result remains;
- Board visual type-language remains excluded and DRAFT / REFERENCE;
- Board Information Architecture v1 remains a separate WAITING / G8 Result.

G8 also recorded a pre-existing deployment-workflow ownership inconsistency between `main/.github/workflows/deploy-production.yml` and `dementor-club-production/.github/workflows/deploy-pages.yml`. Release #65 remains valid because its build checked out the exact production commit, but workflow ownership should be harmonized in a separately scoped Result rather than changed inside this Board presentation Result.

Physical historical Git refs may remain for traceability; they no longer own active integration.

## Authority boundaries preserved

`operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_V1.md` remains DRAFT / REFERENCE and is not promoted to project-wide DESIGN authority.

`operations/BOARD_VISUAL_TYPE_LANGUAGE_V0.1.md` remains DRAFT / REFERENCE and unapproved for implementation.

No production authorization from this Result carries into future Results.

## Closure

This Result is completed history. Future Board UX or CI/workflow cleanup must start from the current production baseline and use a separate Result.