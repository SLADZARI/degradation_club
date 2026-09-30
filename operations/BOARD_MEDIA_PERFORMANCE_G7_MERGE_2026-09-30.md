---
artifactId: dementor-club.operations.board-media-performance-g7-merge-2026-09-30
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: MERGED_WAITING_MANUAL_DEPLOY
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.board-media-performance-v1
previousProductionCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
releaseCandidateCommit: 52ec2966048e16347d8a918ce358d26dff3f803e
productionMergeCommit: cde332779ab0e256dd1e498660d6fa651e91846e
pullRequest: 251
productionMergeAuthorized: true
productionDeployAuthorized: true
deployExecutor: OWNER_MANUAL_GITHUB_ACTION
liveDatabaseMutationAuthorized: true
liveDatabaseMutationExecuted: false
productionDeployExecuted: false
---

# Board / Media Performance v1 — production merge

## Authorization

Owner explicitly authorized:

- merge PR #251 into `dementor-club-production`;
- production release including Supabase migration;
- live retest;
- G8 cleanup.

Owner additionally constrained deployment execution:

`DEPLOY IS OWNER-MANUAL THROUGH GITHUB ACTIONS`

Therefore ChatGPT performed the Git merge only and did not trigger either production deployment workflow.

## Merge result

```text
PR #251
state                 MERGED
release candidate     52ec2966048e16347d8a918ce358d26dff3f803e
previous production   a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
new production        cde332779ab0e256dd1e498660d6fa651e91846e
```

Production merge commit parents:

1. `a24f8d900cc29e5ae922a9a62b751cc02e88f8d9`
2. `52ec2966048e16347d8a918ce358d26dff3f803e`

Production tree:

`95b2289d291096192489b0f0f8ecba733a4f5881`

Clean RC tree:

`95b2289d291096192489b0f0f8ecba733a4f5881`

```text
PRODUCTION TREE == CLEAN RC TREE = PASS
```

## Production delta

Previous production → new production remains exactly seven Result-owned paths:

1. `community/board/board-media-v1.js`
2. `community/board/board-own-drag-livefix-v2-2.js`
3. `community/board/board.js`
4. `scripts/validate-artifact-collaboration-browser.mjs`
5. `scripts/validate-artifact-participants-batch-read-local.mjs`
6. `scripts/validate-board-media-performance-browser.mjs`
7. `supabase/migrations/20260929175000_artifact_participants_batch_read_v1.sql`

No unrelated production path is present.

## Manual deployment boundary

Two manual-only GitHub Actions are the canonical deployment path:

1. `Deploy Dementor Supabase Production`
   - release_confirmation = `APPROVED`
   - deploy_telegram_worker = `false`

2. `Deploy Dementor Production`
   - release_confirmation = `APPROVED`

The Supabase workflow performs migration ledger inspection, release-contract validation, dry-run and tracked migration apply before ledger verification.

No separate direct DB mutation should be performed in parallel.

## Current state

```text
production merge       DONE
Supabase deploy         WAITING OWNER MANUAL ACTION
Pages deploy            WAITING OWNER MANUAL ACTION
live retest             WAITING DEPLOY
G8 cleanup              WAITING LIVE ACCEPTANCE
```
