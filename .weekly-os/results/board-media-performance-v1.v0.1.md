---
artifactId: dementor-club.result.board-media-performance-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
workStatus: ACTIVE
version: 0.1
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentQa: BQA-20,BQA-27
integrationBranch: result/board-media-performance-v1
integrationBaseRef: dementor-club-production
integrationBaseCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
productionBaseCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
implementationStartAuthorized: true
schemaChangeImplementationAuthorized: true
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
costBoundary: NO_PAID_INFRASTRUCTURE
frontendWorkerBranch: worker/board-media-performance-v1-dev2-frontend
frontendWorkerCandidate: 09b33b731610258f7049aa1a4b9576db393176a1
frontendWorkerStatus: CLEAN_GREEN_FROZEN
backendWorkerBranch: worker/board-media-performance-v1-dev1-backend
backendWorkerCandidate: 834bb9776c4e99bb73556c4776c49f270fe70a6c
backendWorkerStatus: STATIC_PASS_RUNTIME_PENDING
frontendIntegrationCommit: 0eac2c9b00bc6a493ec331780948693e16c2a654
qaReconciliation: operations/QA_RECONCILIATION_2026-09-30.md
preflight: operations/BOARD_MEDIA_PERFORMANCE_PREFLIGHT_2026-09-29.md
productionBaselineEvidence: operations/BOARD_MEDIA_PERFORMANCE_PRODUCTION_BASELINE_2026-09-29.md
devLanes: operations/BOARD_MEDIA_PERFORMANCE_DEV_LANES_2026-09-29.md
---

# Board / Media Performance v1 · Result v0.1

## Goal

Make Community Board usable before non-critical enrichment completes and make new Artifact images predictably lightweight, without creating a parallel Board/media/participation owner.

## Scope

```text
BQA-27  Board initial render performance
BQA-20  client-side image normalization / media pipeline
```

## Canonical owners

- Board runtime: `community/board/board.js`
- Board media helper: extension owned by Board runtime
- media record owner: `dc_artifact_media`
- Storage owner: `dc-community-artifacts`
- participant truth: `dc_artifact_participation_events`
- CIRCLE ACL: existing Artifact Collaboration predicates

No second renderer, media table, bucket, cache owner, participant-state owner or polling system.

## Production baseline

Exact baseline:

`a24f8d900cc29e5ae922a9a62b751cc02e88f8d9`

Measured live shape:

```text
21 Artifacts
3 Ideas
13 media rows
12 PNG / 1 WebP
median media 1.872 MB
p90 media 2.892 MB
```

## Current integration state

Fresh canonical integration branch:

`result/board-media-performance-v1`

Clean frontend integration commit:

`0eac2c9b00bc6a493ec331780948693e16c2a654`

It is one commit ahead of exact production and contains only:

- `community/board/board.js`
- `community/board/board-media-v1.js`
- `scripts/validate-board-media-performance-browser.mjs`

The clean integration tree comes from the frozen DEV2 worker candidate, without importing worker history.

## Acceptance criteria

### CJM / first usable Board

Under delayed secondary work:

```text
Artifact rows
→ structural cards visible
→ primary Board navigation/OPEN controls usable
→ participants/media enrich later
```

Required:

- participant RPC count before first render = 0;
- signed media URL count before first render = 0;
- production-shape 21/3/13 fixture remains usable;
- existing Board card nodes are patched rather than replaced by a second renderer.

### Media

New images:

- JPEG / PNG / WebP accepted;
- orientation-safe decode;
- no upscaling;
- bounded longest edge;
- WebP output when smaller;
- original + normalized metadata retained;
- transparent input remains visually valid;
- Safari-compatible fallback;
- broken image does not publish;
- orphan upload cleanup remains correct.

### Backend participant projection

Before G6:

- DEV1 batch-read receives disposable/local DB runtime evidence;
- max-50 boundary;
- same participant shape as canonical single read;
- current INVITED/JOINED only;
- hidden CIRCLE remains non-enumerable;
- no cross-Artifact leakage.

Only after that proof may the integration branch consume the batch RPC.

### Regression

Must retain:

- BQA-24 invitation discoverability;
- BQA-28 roster freshness;
- CIRCLE outsider privacy;
- Board filters/camera/pager/focus;
- detail open/close/deeplink;
- canonical shell ownership.

## Stop boundaries

```text
multi-image Artifact contract     NO / BQA-29 DECISION
new media owner                   NO
new participant owner             NO
production Supabase mutation      NO
production merge                  NO
production deploy                 NO
```

## Current Gate

```text
G5_BUILD
frontend integration = READY FOR EXACT CI
backend integration  = WAITING FOR DB RUNTIME PROOF
```
