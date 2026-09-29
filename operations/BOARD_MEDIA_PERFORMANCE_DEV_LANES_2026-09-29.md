---
artifactId: dementor-club.operations.board-media-performance-dev-lanes-2026-09-29
project: dementor-club
documentType: IMPLEMENTATION_COORDINATION
projectStage: BUILD
gate: G4_DESIGN
status: AUTHORIZED_WORKER_LANES
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_COORDINATION
parentQa: BQA-20,BQA-27
preflight: operations/BOARD_MEDIA_PERFORMANCE_PREFLIGHT_2026-09-29.md
productionBaseline: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
currentResult: dementor-club.result.artifact-collaboration-v1
integrationBranch: null
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# Board / Media Performance — DEV1 + DEV2 worker lanes

## Coordination rule

Current production Result remains Artifact Collaboration v1 until BQA-24/25/26/28 live acceptance reaches G8.

The two developers may work now only on isolated worker branches for the next Board / Media Performance Result.

There is **no active integration branch yet**.

Both worker branches start from the exact same production baseline:

`a24f8d900cc29e5ae922a9a62b751cc02e88f8d9`

Worker branches:

- DEV1: `worker/board-media-performance-v1-dev1-backend`
- DEV2: `worker/board-media-performance-v1-dev2-frontend`

Do not merge one worker branch into the other.

Do not target `dementor-club-production` with a PR.

Do not mutate `.weekly-os/**`, PROJECT, ARTIFACT_INDEX or release evidence from worker branches.

Coordinator will create the one canonical Result integration branch only after the current Result closes G8.

---

## DEV1 — Supabase/backend lane

### Goal

Remove the Board participant N+1 read cost without creating a second participation owner.

### Canonical owner

Existing Artifact Collaboration participation ledger and read semantics:

- `dc_artifact_participation_events`;
- `dc_artifact_participants_read_v1(p_artifact_id)`;
- `dc_can_read_artifact_v1()`.

### Allowed files

DEV1 owns only:

- one new `supabase/migrations/<timestamp>_*.sql`;
- one new backend/local validation script under `scripts/`.

DEV1 must not edit:

- `community/board/board.js`;
- `community/artifact/artifact.js`;
- Board CSS;
- `community-runtime-v1.js`;
- `.github/workflows/site-integrity.yml`;
- `.weekly-os/**`.

### Work

1. Reproduce current N+1 behavior with a fixture containing multiple Ideas.
2. Record request count:
   - 1 Idea;
   - 5 Ideas;
   - 20 Ideas.
3. Extend the existing participation owner with one bounded batch-read RPC only if the measured baseline confirms the N+1 path.
4. Preferred contract:
   - input = bounded array of Artifact ids;
   - output includes `artifact_id` plus the same participant fields as the existing single-Artifact read;
   - only current `INVITED` / `JOINED`;
   - preserve display-name fallback;
   - preserve ordering inside each Artifact;
   - preserve CIRCLE ACL;
   - unreadable/missing Artifact ids are omitted rather than becoming an existence oracle;
   - no table, cache, materialized view or second state owner.
5. Add executable local/backend validation proving:
   - 0 / 1 / N Artifact ids;
   - COMMUNITY readable;
   - CIRCLE author readable;
   - CIRCLE INVITED readable;
   - CIRCLE JOINED readable;
   - outsider receives no rows for hidden CIRCLE;
   - LEFT / REMOVED / DECLINED absent;
   - no cross-Artifact participant leakage;
   - result shape is stable.

### Supabase boundary

DEV1 has Supabase access, but:

```text
LIVE DDL / LIVE MIGRATION = NO
PRODUCTION DB MUTATION = NO
```

Use local/replay/dev-safe validation only.

Do not apply a migration to live Supabase.

### Stop condition

Push only to DEV1 worker branch and report:

- exact commit SHA;
- migration filename;
- validator filename;
- before/after request-count evidence;
- local validation result;
- exact diff.

No production PR, merge or deploy.

---

## DEV2 — frontend / browser performance lane

### Goal

Make Board usable before media/participant enrichment completes, then normalize uploaded images in the existing media owner.

DEV2 must remain independent of DEV1's new RPC. The first-paint work must still function using the current per-Artifact participant read contract.

### Allowed files

DEV2 owns:

- `community/board/board.js`;
- optional new helper `community/board/board-media-v1.js`;
- optional Board CSS only if strictly required without semantic/layout redesign;
- one new browser validator under `scripts/`.

DEV2 must not edit:

- `supabase/**`;
- Artifact Collaboration SQL/RPC;
- `.github/workflows/site-integrity.yml`;
- `.weekly-os/**`;
- DEV1 validation files.

### Work A — executable performance baseline

Create a deterministic browser validator that can delay:

- participant reads;
- media-row read;
- signed URL generation.

Prove the current behavior blocks first meaningful Board render.

Capture at minimum:

- time to structural cards;
- time to first interactive Board controls;
- participant RPC count;
- signed URL count before structural render;
- media count.

### Work B — progressive Board render

Refactor only the existing canonical Board owner.

Target sequence:

```text
Artifact rows
→ structural cards render immediately
→ Board navigation/pager/focus usable
→ secondary data enriches existing cards
→ participant/media changes patch existing canonical cards
```

Requirements:

- no second renderer;
- no polling;
- no parallel state store;
- no duplicate event listeners;
- preserve filters/camera/pager;
- preserve BQA-24 invitation indicator;
- preserve BQA-28 freshness lifecycle;
- preserve CIRCLE privacy;
- preserve detail/open/close/deeplink behavior.

### Work C — media deferral

At minimum:

- media must not block first structural render;
- card images use `loading="lazy"`;
- card images use `decoding="async"`;
- do not sign every media object before first render;
- signed URLs remain ephemeral; no persistent client cache owner.

Prefer viewport/near-card signing only if it can be implemented without disturbing spatial Board behavior.

### Work D — client image normalization

Extend the existing Board composer upload path.

Input remains:

- JPEG;
- PNG;
- WebP.

Target:

```text
select image
→ decode
→ orientation-safe resize only when needed
→ WebP encode
→ compare normalized/original size
→ upload smaller valid representation
→ existing dc_artifact_media metadata
→ publish
```

Requirements:

- never upscale a small source;
- recoverable error on decode/encode failure;
- publish must not continue with broken media;
- upload cleanup still removes orphan media on failure;
- preserve original filename/MIME/size/dimensions in metadata where available;
- record normalized MIME/size/dimensions;
- no second bucket/table/service;
- no multi-image support;
- transparent PNG behavior must be explicitly tested and documented;
- Safari-safe fallback required if a browser API is unavailable.

Do not hard-code quality/edge values without fixture evidence. Candidate range from QA remains roughly 1600–1920 px and WebP 0.80–0.85, but commit the exact values only after desktop/mobile fixture comparison.

### Browser acceptance

Must cover at least:

- desktop JPEG;
- desktop PNG;
- WebP;
- portrait phone-like image;
- landscape image;
- transparent PNG;
- near-4 MB source;
- small image;
- Board first paint while media signing is artificially delayed;
- Board first paint while participant reads are artificially delayed;
- no BQA-24/BQA-28 regression.

### Stop condition

Push only to DEV2 worker branch and report:

- exact commit SHA;
- files changed;
- baseline metrics;
- after metrics;
- image normalization fixture table;
- browser validator result;
- exact diff.

No production PR, merge or deploy.

---

## Integration order after current G8

Coordinator only:

1. verify current production SHA;
2. create one canonical `result/board-media-performance-v1` branch from then-current production;
3. integrate DEV2 first because it must work against existing backend;
4. run browser baseline/acceptance;
5. integrate DEV1 backend contract;
6. make one small frontend adapter to consume the batch RPC only after DEV1 contract is frozen;
7. run full G5;
8. G6 exact candidate;
9. clean G7 RC;
10. explicit owner release authorization;
11. production deploy;
12. live performance retest.

This prevents backend/frontend development from sharing mutable files while both developers work.
