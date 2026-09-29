---
artifactId: dementor-club.operations.board-media-performance-dev2-baseline-2026-09-29
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: DISCOVERY
gate: G4_DESIGN
status: ROOT_CAUSE_PASS_PRODUCTION_SHAPE_PENDING
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentQa: BQA-20,BQA-27
workerLane: DEV2_FRONTEND
workerBranch: worker/board-media-performance-v1-dev2-frontend
productionBaseCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
observedRemoteHead: 2c27020e4e3de31e23b04d22754fedc4f163c416
---

# Board / Media Performance — DEV2 baseline checkpoint

## Reported baseline

Synthetic fixture reported by DEV2:

```text
Artifacts            4
Ideas                3
media rows           3
media read delay     900 ms
participant delay    700 ms
signed URL delay     600 ms

structural render     2205.4 ms
interactive controls  2205.4 ms
participant RPCs      3
signed URLs before render 3
media count           3
```

Three repeated baseline runs reproduced that structural cards were still absent at 500 ms.

## Verdict

This is sufficient to establish the root problem:

```text
current loadBoard()
→ waits for media/participants/signed URLs
→ first usable Board render remains blocked
```

Therefore:

```text
BQA-27 ROOT CAUSE = CONFIRMED
```

It is not yet the final before/after performance evidence because the synthetic fixture does not match the measured production shape.

Measured production shape:

```text
21 Artifacts
3 Ideas
13 media rows
12 PNG / 1 WebP
median media 1.872 MB
p90 media    2.892 MB
```

Before candidate freeze, DEV2 must add or run a production-shape scenario approximating `21 / 3 / 13`.

## Worker branch reconciliation

The remote worker branch is no longer at the original exact base.

Observed remote head:

`2c27020e4e3de31e23b04d22754fedc4f163c416`

It is four commits ahead of production base and changes only DEV2-owned files:

- `community/board/board.js`;
- `community/board/board-media-v1.js`;
- `scripts/validate-board-media-performance-browser.mjs`.

Remote commits:

- `ce7e4262` — progressive Board render + media normalization;
- `9da39e1c` — Board media performance browser acceptance;
- `0633c1c0` — validator correction;
- `2c27020e` — preserve Board owners through media enrichment.

No Supabase/backend file is present in this remote diff.

The remote implementation already contains:

- structural render before enrichment;
- delayed enrichment;
- generation guard;
- lazy image loading;
- async image decoding;
- WebP normalization helper;
- original + normalized metadata handling;
- BQA-24/BQA-28 preservation hooks.

This does not mean the candidate is accepted yet.

## Required reconciliation

DEV2 must not force-push, reset shared history or start a duplicate implementation.

Next required evidence:

1. reconcile local workspace with exact remote head `2c27020e…`;
2. identify whether the four remote commits are the developer's intended candidate;
3. run the new browser validator at exact remote head;
4. run canonical Artifact Collaboration regression for BQA-24/BQA-28;
5. add/run production-shape `21 / 3 / 13` scenario;
6. report exact after metrics and image-normalization fixture table.

Until then:

```text
DEV2 root-cause baseline = PASS
DEV2 implementation candidate = UNVERIFIED_REMOTE_CANDIDATE
G5 = NOT ENTERED
```
