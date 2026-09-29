---
artifactId: dementor-club.operations.board-media-performance-dev2-clean-green-2026-09-29
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G4_DESIGN
status: CLEAN_GREEN_FROZEN
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentQa: BQA-20,BQA-27
workerLane: DEV2_FRONTEND
workerBranch: worker/board-media-performance-v1-dev2-frontend
productionBaseCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
candidateCommit: 09b33b731610258f7049aa1a4b9576db393176a1
runtimeFrozen: true
productionMutation: false
---

# Board / Media Performance — DEV2 clean-green worker candidate

## Verdict

```text
exact worker HEAD            PASS
runtime file freeze          PASS
validator-only corrective    PASS
committed browser validator  PASS
BQA-27 runtime               PASS
BQA-20 runtime               PASS
BQA-24 regression            PASS
BQA-28 regression            PASS
production-shape fixture     PASS
Safari fallback              PASS
production mutation          NONE
```

DEV2 worker candidate is:

```text
CLEAN GREEN / FROZEN
```

This is worker-level evidence only. It is not G5/G6 evidence for an active Result.

## Exact identity

```text
base
a24f8d900cc29e5ae922a9a62b751cc02e88f8d9

branch
worker/board-media-performance-v1-dev2-frontend

head
09b33b731610258f7049aa1a4b9576db393176a1
```

Cumulative worker diff from exact base contains only:

1. `community/board/board-media-v1.js`
2. `community/board/board.js`
3. `scripts/validate-board-media-performance-browser.mjs`

No Supabase/backend file.
No weekly-os mutation.
No workflow mutation.

## Frozen runtime blobs

```text
community/board/board.js
f7895676e8802ac42d5fa996ddc52232c67baa2a

community/board/board-media-v1.js
3fc988f70fffbe20603a3d0844904ede08e1f273
```

These blobs remained unchanged through both validator-only corrective commits.

Final validator blob:

`a1c9e858f5307790a8ea528b1792d16d4ac44871`

## Exact final corrective

Previous head:

`bbc9709ca20f28fdbf465f241fa0c628fff32039`

Final head:

`09b33b731610258f7049aa1a4b9576db393176a1`

Exact delta:

```text
scripts/validate-board-media-performance-browser.mjs
+5 / -5

other files
NONE
```

Known browser-fixture literal defects are no longer present.

## Exact committed browser validator

Reported exact committed output:

```text
BOARD_MEDIA_BASELINE
firstRender       1601.8 ms
interactive       1601.8 ms
participant RPC   2
signed URL before first render 2
media             2

BOARD_MEDIA_AFTER
structural        93.8 ms
interactive       93.8 ms
signed URL before first render 0
participant RPC before first render 0
participant RPC total 2
signed URL total  2
media total       2
enrichment complete 1646.6 ms

BOARD / MEDIA PERFORMANCE BROWSER QA PASS
```

The important acceptance invariant is not the raw synthetic latency ratio but:

```text
structural + usable Board
BEFORE
participant/media/signed-url enrichment completes
```

## Runtime behavior preserved

Candidate implements within the existing Board owner:

```text
Artifact rows
→ structural render
→ canonical card nodes retained
→ participant/profile/reaction/response/promotion enrichment
→ deferred media signing
→ patch existing slots
```

Media presentation:

- deferred signed URLs;
- `loading="lazy"`;
- `decoding="async"`.

Composer:

- accepted JPEG / PNG / WebP;
- orientation-safe decode;
- max edge 1800 px;
- WebP quality 0.82;
- use normalized representation only when smaller;
- no upscaling;
- existing Storage bucket;
- existing `dc_artifact_media` attachment owner;
- source and normalized metadata;
- broken-media guard;
- orphan cleanup;
- Safari image-element fallback.

No:

- second Board renderer;
- persistent signed-URL cache;
- polling owner;
- new media state owner;
- new bucket/table/service;
- multi-image behavior;
- DEV1 batch RPC dependency.

## Production-shape evidence

Measured production shape used for validation:

```text
21 Artifacts
3 Ideas
13 media
```

Candidate evidence:

```text
structural cards                21
participant RPC total            3
participant RPC before render    0
signed URL total                13
signed URL before render         0
hydrated image nodes            13
page errors                      0
```

BQA-24 and BQA-28 canonical regression remained PASS.

## Worker stop state

```text
DEV2 CODE          STOP
candidate           FREEZE
production PR       NO
merge               NO
deploy              NO
Supabase             NO
integration          WAITING
```

Integration must wait for the current Artifact Collaboration Result to close G8, then occur only through the one canonical Board / Media Performance Result branch.
