---
artifactId: dementor-club.operations.board-media-performance-preflight-2026-09-29
project: dementor-club
documentType: IMPLEMENTATION_BRIEF
projectStage: DISCOVERY
gate: G4_DESIGN
status: READY_AFTER_CURRENT_G8
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentQa: BQA-20,BQA-27
activeResult: dementor-club.result.artifact-collaboration-v1
implementationAuthorized: false
integrationBranch: null
---

# Board / Media Performance — preflight · BQA-27 + BQA-20

## Boundary

This is preparation for the next Result only.

The active Result remains Artifact Collaboration v1 and is currently awaiting live acceptance for BQA-24/25/26/28.

No second implementation branch is opened by this preflight.

No production, backend or Supabase mutation is authorized.

## Why BQA-27 + BQA-20 belong together

Both findings extend the same canonical owners:

- Board runtime: `community/board/board.js`;
- Artifact media upload path: existing Board composer;
- canonical media record owner: `dc_artifact_media`;
- canonical private Storage bucket: `dc-community-artifacts`;
- shared media signing helper: `community-runtime-v1.js::signedMediaUrl()`.

Do not create:

- a second Board renderer;
- a second media table;
- a second Storage bucket;
- a parallel media service;
- a separate image cache owner.

## Current production facts

Baseline inspected:

`dementor-club-production@a24f8d900cc29e5ae922a9a62b751cc02e88f8d9`

### Board first render

Current `loadBoard()` sequence is effectively:

```text
normalize lifecycle
→ read Artifacts + promotion state
→ read profiles + reactions + all media rows + responses
→ for every Idea: dc_artifact_participants_read_v1()
→ for every media row: create signed URL
→ only then boardHost.innerHTML
```

Therefore visible structural cards are blocked by non-critical enrichment work.

This confirms the BQA-27 root boundary.

### Participant projection

Artifact Collaboration v1 currently exposes the canonical per-Artifact read:

`dc_artifact_participants_read_v1(p_artifact_id)`

Board currently invokes it once per Idea.

This preflight does not authorize a new batch RPC.

Before any backend change, G4 must prove either:

1. progressive card render can remove the first-paint blocker while keeping existing reads; or
2. a bounded batch/projection read is materially necessary and can extend the existing participation owner without creating a second state owner.

### Media rendering

Board card image currently renders as a plain image from a signed original media URL.

Current markup does not declare:

- `loading="lazy"`;
- `decoding="async"`.

Signed URLs are created for all loaded media before the first Board render.

### Upload path

Current Board composer:

- accepts JPEG / PNG / WebP;
- UI limit = 4 MB;
- uploads the selected File directly to `dc-community-artifacts`;
- writes original name / size / MIME to `dc_artifact_media.metadata`;
- does not currently decode / resize / re-encode the image before upload.

This confirms the BQA-20 media-hardening boundary.

## JTBD

### Board load

When I enter the Community Board, I want usable cards and controls to appear immediately, so I can orient myself and start acting without waiting for images and secondary collaboration data.

### Media publish

When I attach a normal phone or desktop image, I want the club to optimize it automatically, so the Artifact remains visually correct without making Board loading or Storage/egress unnecessarily heavy.

## CJM acceptance path

```text
Workspace
→ Board entry
→ structural cards become usable
→ first viewport is interactive
→ collaboration/media enrich progressively
→ open Artifact
→ exact canonical media/participants remain correct
```

Image-author path:

```text
create Artifact
→ select image
→ browser validates/normalizes representation
→ existing Storage owner upload
→ existing dc_artifact_media record
→ publish
→ Board/detail render
```

## Required baseline measurements before implementation

Desktop and mobile:

- time to first meaningful Board cards;
- time to interactive Board controls;
- initial Supabase request count;
- number of `dc_artifact_participants_read_v1` calls;
- signed URL calls before first render;
- signed URL calls before first viewport media is needed;
- media bytes transferred before first viewport;
- image decode timing / long tasks where measurable.

Record the Artifact count, Idea count and media count for each fixture so before/after data is comparable.

## Implementation order after current G8

### Phase A — instrumentation / executable baseline

Add a bounded browser performance validator around the existing Board owner.

No visual/product mutation yet.

### Phase B — critical render split

Target:

```text
canonical Artifact rows
→ immediate structural Board render
→ controls usable
→ non-critical enrichment
```

Preserve existing route, card owner, filtering, camera/pager and collaboration freshness behavior.

### Phase C — media deferral

Evaluate in the existing renderer:

- lazy image loading;
- async decoding;
- sign media only when required by presentation rather than signing every media row before first render;
- no CIRCLE/private-media authorization regression.

Do not make signed URLs globally persistent.

### Phase D — image normalization

Extend the existing composer upload owner.

Candidate direction from BQA-20 remains subject to measured validation:

```text
JPEG / PNG / WebP input
→ decode
→ orientation-safe resize if needed
→ bounded WebP encode
→ choose smaller valid representation
→ existing Storage upload
→ existing dc_artifact_media metadata
```

Do not lock exact longest-edge or quality constants until fixture measurements establish a useful quality/size boundary.

Preserve original-source facts in media metadata where useful for QA, while the stored browser representation remains the canonical uploaded object.

## Explicit non-goals

Not part of this Result:

- multi-image Artifact contract (BQA-29 decision);
- new gallery;
- new media table/bucket;
- new generic CDN/cache;
- relation selector UX (BQA-15);
- Owner Admin operations UI (BQA-23);
- Contribution runtime (BQA-07);
- membership/auth semantics;
- Artifact Collaboration state changes.

## Gate rule

Activation only after current Artifact Collaboration Result reaches G8.

At activation:

1. refresh exact production baseline;
2. create one Result;
3. create one active integration branch;
4. measure baseline before optimizing;
5. implementation must prove measurable improvement, not only code rearrangement.

```text
CURRENT STATE = PREFLIGHT COMPLETE
IMPLEMENTATION = NOT STARTED
NEXT RESULT ACTIVATION = AFTER ARTIFACT COLLABORATION G8
```
