---
artifactId: dementor-club.operations.board-media-performance-g6-2026-09-30
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.board-media-performance-v1
productionBaseline: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
candidateCommit: 91a05166a46ad108f7f2aed3b66c5c1464b2863d
validationRun: 1331
validationRunId: 36728660995
validationConclusion: SUCCESS
exactDiffFileCount: 7
liveDatabaseMutation: false
productionMutation: false
---

# Board / Media Performance v1 — G6 validation

## Verdict

**G6 PASS**

**READY FOR CLEAN G7 RELEASE CANDIDATE PREPARATION**

This validates the exact integration candidate. It does not authorize live Supabase mutation, production merge or deployment.

## Exact identities

```text
production baseline  a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
integration branch   result/board-media-performance-v1
candidate            91a05166a46ad108f7f2aed3b66c5c1464b2863d
Site Integrity       #1331 / 36728660995
conclusion           SUCCESS
```

Current `dementor-club-production` still equals the Result production baseline.

The candidate is:

```text
ahead_by   6
behind_by  0
status     ahead
```

No `dementor-club-site` divergence is inherited.

## Exact diff boundary

Production baseline → candidate contains exactly seven reviewed paths:

1. `community/board/board-media-v1.js`
2. `community/board/board-own-drag-livefix-v2-2.js`
3. `community/board/board.js`
4. `scripts/validate-artifact-collaboration-browser.mjs`
5. `scripts/validate-artifact-participants-batch-read-local.mjs`
6. `scripts/validate-board-media-performance-browser.mjs`
7. `supabase/migrations/20260929175000_artifact_participants_batch_read_v1.sql`

No route, auth, Header, Footer, Workspace shell, event, project, merch or unrelated semantic files are changed.

## Functional / browser validation

Exact-head Site Integrity #1331 completed with:

```text
failed steps   0
skipped steps  0
```

Relevant PASS surfaces include:

- Board v2.1 fullscreen;
- Board live corrective;
- Board navigation/adaptive cards;
- Board Relations;
- Artifact Collaboration;
- BQA-24 invitation indicator/highlight and exact-Idea navigation on desktop / 390 / 360;
- BQA-28 collaboration freshness through artifact-close / history-close / BFCache;
- canonical shell integration;
- built JavaScript syntax;
- production route manifest;
- production artifact release gate;
- WebKit auth regression;
- browser shell / Workspace recovery.

## Performance / media proof

Standalone exact-candidate execution:

`node scripts/validate-board-media-performance-browser.mjs`

Exit code:

`0`

Acceptance:

```text
1 Idea   -> 1 participant batch RPC  PASS
5 Ideas  -> 1 participant batch RPC  PASS
20 Ideas -> 1 participant batch RPC  PASS
ordinary performance scenario        PASS
```

Observed optimized scenario:

```text
structuralMs                         88.5
interactiveMs                        88.5
participantRpcCountBeforeFirstRender 0
signedUrlCountBeforeFirstRender      0
participantRpcCount                  1
signedUrlCount                       2
```

Media fixtures cover JPEG / PNG / WebP, portrait / landscape, transparent PNG, near-4MB source, small source, image-bitmap path and Safari fallback.

## Canonical ownership / no parallel mechanism

### Board participant projection

Exact `board.js` inventory:

```text
dc_artifact_participants_batch_read_v1 occurrences  1
dc_artifact_participants_read_v1 occurrences        0
```

The batch result is grouped in memory and passed into the existing `applyBoardEnrichment()` path.

No second participant cache, renderer, polling loop or fallback owner exists.

### Backend participant authority

The batch RPC:

- reuses `dc_can_read_artifact_v1`;
- reads `dc_artifact_participation_events`;
- exposes only current `INVITED / JOINED`;
- omits unreadable/missing Artifacts;
- has a max-50 input bound;
- preserves canonical single-read shape/order;
- creates no table, view or materialized view;
- grants execution only to authenticated users.

Local Supabase runtime proof is PASS, including COMMUNITY/CIRCLE ACL, terminal-state exclusion, dedupe, display-name fallback and no cross-Artifact leakage.

### Media

The existing Board composer remains the owner.

Target contract is implemented inside the existing upload path:

```text
JPEG / PNG / WebP
long edge 1800
WebP quality 0.82
use normalized representation only when smaller
same dc-community-artifacts bucket
same dc_artifact_media metadata owner
```

No second bucket/table/upload service was introduced.

### Spatial ownership

`board-own-drag-livefix-v2-2.js` no longer owns:

- `boardOffset`;
- cloud centering;
- MutationObserver centering;
- spatial/filter/projection/resize centering listeners.

It retains only its narrow drag responsibility and persists canonical style coordinates.

## Routes / auth / actor boundaries

No route or auth implementation file is changed.

The exact-head workflow passed route manifest, shell recovery, WebKit auth and membership/Board access contracts.

Relevant changed Board paths preserve:

- Guest gating;
- active Member Board access;
- Owner Admin create/moderation/drag authority;
- INVITED/JOINED CIRCLE access;
- CIRCLE outsider no-oracle behavior.

The Result does not change Dementor role semantics, membership lifecycle, APPLICATION or DC-9 state.

## Semantic consistency

No new membership, role, entity, route, visibility or collaboration state is introduced.

```text
AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP
```

remains untouched.

## G6 conclusion

```text
functional flow          PASS
semantic consistency     PASS
route integrity          PASS
auth/actor boundaries    PASS
desktop / 390 / 360      PASS
browser regression       PASS
visual/runtime integrity PASS
canonical ownership      PASS
legacy fallback absence  PASS
exact diff boundary      PASS

G6 = PASS
```

Next step is a clean G7 release candidate from the then-current exact production baseline.

No production mutation is authorized by this document.
