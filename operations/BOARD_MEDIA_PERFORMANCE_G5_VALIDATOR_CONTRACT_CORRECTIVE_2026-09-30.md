---
artifactId: dementor-club.operations.board-media-performance-g5-validator-contract-corrective-2026-09-30
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: VALIDATION_RUNNING
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
result: dementor-club.result.board-media-performance-v1
failedCandidate: dde55b15a03ced436de95e274c5160c94a94c9b6
correctiveCandidate: 91a05166a46ad108f7f2aed3b66c5c1464b2863d
failedRun: 1330
correctiveRun: 1331
correctiveRunId: 36728660995
---

# Board / Media Performance v1 — validator contract corrective

## Failed exact-head evidence

Candidate:

`dde55b15a03ced436de95e274c5160c94a94c9b6`

Site Integrity:

`#1330 / 36725018988`

Verdict:

`FAILURE`

Only failing workflow step:

`Validate Artifact Collaboration v1 browser acceptance`

Failure occurred before BQA-24 completion while waiting for:

`[data-board-invitation-indicator]`

## Root cause

Runtime Board now canonically uses:

`dc_artifact_participants_batch_read_v1`

The Artifact Collaboration browser validator Supabase stub still implemented only:

`dc_artifact_participants_read_v1`

Therefore the Board batch RPC fell through the mock and received an empty participant projection.

This is QA fixture-contract drift, not evidence for a runtime single-read fallback.

## Corrective

Runtime remained frozen.

Only:

`scripts/validate-artifact-collaboration-browser.mjs`

was changed.

Exact corrective:

`+4 / -0`

The existing single-read fixture remains for detail flows.

The new batch fixture:

- accepts `p_artifact_ids`;
- omits unreadable/missing Artifacts;
- reuses existing `currentParticipants(id)`;
- adds `artifact_id` to each returned row;
- preserves existing participant shape/order/state semantics.

Corrective candidate:

`91a05166a46ad108f7f2aed3b66c5c1464b2863d`

PR #250 remains DRAFT / OPEN / UNMERGED.

## Validation

Site Integrity #1331:

`36728660995`

Current status:

`IN_PROGRESS`

No further code changes are authorized while exact-head CI is running.

```text
runtime adapter = FROZEN
validator corrective = APPLIED
G5 = WAITING EXACT-HEAD CI
G6 = NOT AUTHORIZED
merge/deploy = NO
```
