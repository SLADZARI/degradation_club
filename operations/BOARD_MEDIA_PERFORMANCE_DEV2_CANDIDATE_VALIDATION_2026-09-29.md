---
artifactId: dementor-club.operations.board-media-performance-dev2-candidate-validation-2026-09-29
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G4_DESIGN
status: RUNTIME_PASS_VALIDATOR_FIX_REQUIRED
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentQa: BQA-20,BQA-27
workerLane: DEV2_FRONTEND
workerBranch: worker/board-media-performance-v1-dev2-frontend
baseCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
candidateCommit: 2c27020e4e3de31e23b04d22754fedc4f163c416
runtimeFilesFrozen: true
productionMutation: false
---

# Board / Media Performance — DEV2 candidate validation

## Exact identity

```text
branch  worker/board-media-performance-v1-dev2-frontend
base    a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
head    2c27020e4e3de31e23b04d22754fedc4f163c416
```

Commit chain:

- `ce7e4262` progressive Board render + media normalization;
- `9da39e1c` Board media performance browser acceptance;
- `0633c1c0` validator transfer correction;
- `2c27020e` preserve Board owners through media enrichment.

No Supabase/backend file is present in the candidate.

## Runtime verdict

Corrected ephemeral validator run reports:

```text
BQA-27 runtime              PASS
BQA-20 runtime              PASS
BQA-24 regression           PASS
BQA-28 regression           PASS
production-shape 21/3/13    PASS
Safari fallback             PASS
broken media guard          PASS
orphan cleanup              PASS
```

Production-shape fixture:

```text
Artifacts   21
Ideas        3
media       13

structural render      90.9 ms
interactive controls   90.9 ms
participant RPC before first render 0
signed URLs before first render     0
participant RPC total               3
signed URLs total                  13
hydrated image nodes               13
page errors                         0
```

The earlier deterministic old-flow fixture showed structural/interactive render at 2205.4 ms under delayed media/participant/signing work.

Absolute timings are not like-for-like across fixture shapes, therefore the authoritative performance invariant is:

```text
first structural/usable render occurs before participant/media/signing work begins
```

## Media normalization evidence

Candidate constants:

```text
max longest edge  1800 px
WebP quality      0.82
```

Fixtures:

| Fixture | Before | After |
|---|---|---|
| Landscape JPEG | 209,791 B · 2400×1600 JPEG | 21,548 B · 1800×1200 WebP |
| Portrait JPEG | 202,434 B · 1600×2400 JPEG | 21,466 B · 1200×1800 WebP |
| Landscape PNG | 3,891,378 B · 2400×1600 PNG | 20,704 B · 1800×1200 WebP |
| WebP | 57,646 B · 2400×1600 WebP | 20,896 B · 1800×1200 WebP |
| Transparent PNG | 64,729 B · 2200×1400 PNG | 5,254 B · 1800×1145 WebP |
| Near-4MB JPEG | 4,033,927 B · 2600×2000 JPEG | 1,418,204 B · 1800×1385 WebP |
| Small JPEG | 39,050 B · 640×480 JPEG | 7,174 B · 640×480 WebP |

Small image is not upscaled. Transparent alpha remains present. Encoder failure falls back to the valid original representation.

Safari-style fallback with `createImageBitmap` unavailable uses image-element decoding and passed.

## Exact committed validator finding

The committed validator itself is not green.

The browser-facing BQA-28 mutation uses ordinary quoted strings containing literal template syntax, for example:

```js
globalThis.__QA.participation['${A}']='JOINED'
detail:{artifactId:'${A}'}
```

Inside that `page.evaluate(()=>{...})` function these are literal strings, not outer-template interpolation.

This causes the subsequent wait for the real UUID `A` to time out.

Important distinction:

Occurrences such as:

```js
const runtimeModule=()=>`
const A='${A}', ...
`
```

are intentional outer-template interpolation and must not be changed.

## Required validator-only correction

Runtime files are frozen:

- `community/board/board.js` — NO CHANGE;
- `community/board/board-media-v1.js` — NO CHANGE.

Only:

`scripts/validate-board-media-performance-browser.mjs`

may change.

Preferred fix: pass IDs into `page.evaluate` explicitly, for example:

```js
await page.evaluate(id=>{
  globalThis.__QA.participation[id]='JOINED';
  window.dispatchEvent(new CustomEvent(
    'dc:artifact-collaboration-changed',
    {detail:{artifactId:id}}
  ));
  window.dispatchEvent(new CustomEvent('dc:board-artifact-closed'));
},A);
```

Apply the same pattern to DECLINED / other browser-evaluate fixture mutations.

Do not perform global replacement of `${A}` because the runtime-module template intentionally uses it.

## Candidate state

```text
runtime candidate        PASS
exact committed validator FAIL
classification           VALIDATOR_FIXTURE_DEFECT
runtime files            FROZEN
allowed next mutation    validator-only
candidate clean-green    NO
G5                       NOT ENTERED
```

After one validator-only commit:

1. run exact committed validator;
2. run BQA-24/BQA-28 regression;
3. verify runtime file SHAs unchanged from `2c27020e...`;
4. report new exact worker HEAD and diff.

No production PR, merge or deploy.
