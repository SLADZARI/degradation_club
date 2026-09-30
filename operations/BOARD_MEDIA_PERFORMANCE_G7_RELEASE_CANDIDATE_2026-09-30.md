---
artifactId: dementor-club.operations.board-media-performance-g7-release-candidate-2026-09-30
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS_CLEAN_RC_VALIDATED
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.board-media-performance-v1
productionBaseCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
validatedCandidate: 91a05166a46ad108f7f2aed3b66c5c1464b2863d
releaseBranch: release/board-media-performance-v1
releaseCandidateCommit: 52ec2966048e16347d8a918ce358d26dff3f803e
pullRequest: 251
validationRun: 1332
validationRunId: 36736574913
validationConclusion: SUCCESS
liveDatabaseMutation: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# Board / Media Performance v1 — G7 clean release candidate

## Verdict

**G7 CLEAN RC PASS**

**READY FOR RELEASE DECISION**

No production merge, live Supabase mutation or deploy has been performed.

## Exact identities

```text
production baseline  a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
G6 candidate         91a05166a46ad108f7f2aed3b66c5c1464b2863d
release branch       release/board-media-performance-v1
clean RC             52ec2966048e16347d8a918ce358d26dff3f803e
draft PR             #251
Site Integrity       #1332 / 36736574913
conclusion           SUCCESS
```

Current production head still equals the exact release baseline.

## Clean topology

The release candidate was created directly from current production.

```text
parent        a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
ahead_by      1
behind_by     0
changed_files 7
```

The integration branch was not merged or rebased into production.

## Tree identity

G6 validated candidate tree:

`95b2289d291096192489b0f0f8ecba733a4f5881`

Clean RC tree:

`95b2289d291096192489b0f0f8ecba733a4f5881`

```text
TREE EQUALITY = PASS
```

Therefore the clean RC contains exactly the G6 validated Result tree and nothing else.

## Exact release diff

1. `community/board/board-media-v1.js`
2. `community/board/board-own-drag-livefix-v2-2.js`
3. `community/board/board.js`
4. `scripts/validate-artifact-collaboration-browser.mjs`
5. `scripts/validate-artifact-participants-batch-read-local.mjs`
6. `scripts/validate-board-media-performance-browser.mjs`
7. `supabase/migrations/20260929175000_artifact_participants_batch_read_v1.sql`

No unrelated path is present.

## Exact-head validation

Canonical workflow:

`Site Integrity / Release Readiness`

```text
run        #1332
run id     36736574913
head SHA   52ec2966048e16347d8a918ce358d26dff3f803e
result     SUCCESS
failed     0
skipped    0
```

Relevant release gates passed again on the clean RC, including:

- build production candidate artifact;
- canonical shell integration;
- built JavaScript syntax;
- Board v2.1 fullscreen;
- Board navigation/adaptive;
- Board Relations;
- Artifact Collaboration;
- Board deep-link auth-return;
- Board Share on movable own card;
- browser shell / Workspace recovery;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

The standalone Board/media performance proof remains valid because the RC tree is byte-identical to the G6 candidate tree.

## Release boundary

```text
LIVE SUPABASE APPLY = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
```

The clean RC is ready for an explicit owner release decision.
