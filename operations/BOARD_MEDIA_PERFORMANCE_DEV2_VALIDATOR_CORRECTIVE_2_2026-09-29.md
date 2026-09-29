---
artifactId: dementor-club.operations.board-media-performance-dev2-validator-corrective-2-2026-09-29
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G4_DESIGN
status: VALIDATOR_ONLY_CORRECTIVE_AUTHORIZED
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentQa: BQA-20,BQA-27
workerLane: DEV2_FRONTEND
workerBranch: worker/board-media-performance-v1-dev2-frontend
currentHead: bbc9709ca20f28fdbf465f241fa0c628fff32039
runtimeFrozen: true
---

# DEV2 validator corrective #2

## Verified state

Exact worker HEAD:

`bbc9709ca20f28fdbf465f241fa0c628fff32039`

Delta from previous runtime candidate `2c27020e4e3de31e23b04d22754fedc4f163c416`:

```text
commits      1
files        1
validator    +2 / -2
runtime      unchanged
```

Frozen runtime blob SHAs remain:

```text
community/board/board.js
f7895676e8802ac42d5fa996ddc52232c67baa2a

community/board/board-media-v1.js
3fc988f70fffbe20603a3d0844904ede08e1f273
```

## Remaining committed validator defects

Three browser-side literals remain:

1. invited-state lookup uses literal selector:
   `data-artifact="${A}"`
2. invited-class lookup uses literal selector:
   `data-artifact="${A}"`
3. navigation assertion compares:
   `nav.opened === '${A}'`

These are inside browser-evaluated/assertion code and therefore are literal strings.

They are distinct from intentional outer-template interpolation inside:

`runtimeModule=()=>`...``

which must remain unchanged.

## Authorized next mutation

Exactly one additional validator-only commit is authorized.

Allowed file:

`scripts/validate-board-media-performance-browser.mjs`

Forbidden:

- `community/board/board.js`
- `community/board/board-media-v1.js`
- `supabase/**`
- `.weekly-os/**`
- workflow files

Preferred correction:

- pass `A` into browser evaluation explicitly;
- compare `nav.opened` against the Node-side constant `A`, not a quoted template literal.

## Required final evidence

After the commit:

1. exact new HEAD;
2. exact diff from `bbc9709c...`;
3. runtime blob SHAs unchanged;
4. exact committed validator = PASS;
5. BQA-24 regression = PASS;
6. BQA-28 regression = PASS;
7. no new files outside validator;
8. no PR / merge / deploy / Supabase mutation.

If all pass:

```text
DEV2 CANDIDATE = CLEAN GREEN / FREEZE
```
