---
artifactId: dementor-club.operations.board-media-performance-g5-owner-drag-blocker-2026-09-30
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: BLOCKED
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
result: dementor-club.result.board-media-performance-v1
candidateCommit: 0eac2c9b00bc6a493ec331780948693e16c2a654
integrationPullRequest: 250
siteIntegrityRun: 1327
siteIntegrityRunId: 36691834625
---

# Board / Media Performance v1 — G5 owner-admin drag blocker

## Exact candidate

```text
production base
a24f8d900cc29e5ae922a9a62b751cc02e88f8d9

integration branch
result/board-media-performance-v1

candidate
0eac2c9b00bc6a493ec331780948693e16c2a654

PR
#250 · DRAFT
```

Candidate diff remains exactly three DEV2 frontend/performance files.

## Site Integrity

`Site Integrity / Release Readiness #1327 / 36691834625`

Conclusion:

`FAILURE`

Static/build and earlier browser checks passed through:

- Supabase release contract;
- routes/registry/content/visual;
- DC-9 and Membership authority;
- Board contracts;
- Artifact Collaboration backend contract;
- build + JS syntax;
- canonical shell;
- OAuth handoff;
- Global Header regression;
- public activity;
- Current Program;
- mobile harmonization;
- public harmonization;
- Projects;
- DC-9 browser recovery.

The first failing gate is:

`Validate Board v2.1 fullscreen browser state matrix`

## Exact failure

Script:

`scripts/validate-board-v21-browser.mjs`

Failure location:

`line 36, column 783`

The failing call is the wait immediately after OWNER_ADMIN pointer drag:

```text
drag qa-artifact-other
→ expect canonical update on dc_artifact_board_positions
→ no update observed
→ timeout
```

The earlier wait on the same owner flow:

```text
cards >= 2
AND
every card has is-admin-movable
```

completed successfully.

Therefore the blocker is not "OWNER_ADMIN cards never become movable".

It is specifically:

```text
OWNER_ADMIN card appears movable
→ pointer drag
→ canonical position write is not observed
```

The validator passes `{timeout:2000}` as the second argument to Playwright `waitForFunction`, so Playwright reports its default 30-second timeout. That timeout-argument bug changes duration only; it does not explain the missing position write.

## Regression boundary

Production baseline passed this canonical v2.1 gate before the Board/media candidate.

The integration diff changes only:

- `community/board/board.js`;
- adds `community/board/board-media-v1.js`;
- adds Board/media validator.

Therefore this is candidate-induced until exact reproduction proves otherwise.

## Required diagnostic before patch

Reproduce one owner case only.

Capture in order:

1. card node identity before enrichment;
2. `is-admin-movable` state;
3. card `left/top`, size and Board camera scale;
4. exact element under the test pointer coordinate;
5. pointerdown reaches canonical spatial drag owner;
6. pointermove sets moved=true;
7. enrichment/projection events during the gesture;
8. pointerup reaches drag owner;
9. whether `persistPosition()` is invoked;
10. whether `dc_artifact_board_positions.update()` is called.

Compare exact production base versus candidate using the same test fixture.

No patch until the first divergent step is identified.

## Gate

```text
G5 FRONTEND = BLOCKED
DEV1 BACKEND INTEGRATION = HOLD
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
```
