---
artifactId: dementor-club.evidence.board-relations-g5-runtime-permission-interaction-blocker-2026-09-18
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: BLOCKER_EVIDENCE
version: 1.0
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-relations-v1
candidateCommit: 70251f7faedbbe4a73cb5c99847fd2ab465ca171
validationRunId: 35329713003
validationRunNumber: 1221
validationConclusion: FAILURE
blockingStep: 48
liveDatabaseMutation: false
productionMutation: false
---

# Board Relations v1 — G5 runtime permission interaction blocker

## Verdict

**G5 RUNTIME CONTRACT BLOCKED**

Exact candidate:

`70251f7faedbbe4a73cb5c99847fd2ab465ca171`

Validation run:

`#1221 / 35329713003 = FAILURE`

The authorized corrective was limited to `FILTER_LINE_VISIBILITY` and changed exactly one runtime expression:

```js
line.hidden = !visible;
```

to:

```js
line.toggleAttribute('hidden', !visible);
```

No architecture, filter owner, drag owner, spatial/layout owner, detail shell, CSS hidden contract, or reconcile-by-relation-id behavior was changed.

## Requested validation sequence

### Static Relations runtime contract

**PASS**

The runtime retains:

- one canonical Relations owner;
- reconcile-by-`relation_id`;
- no remove-all/recreate loop;
- existing spatial/layout coordinates as presentation input only;
- canonical Board filter events;
- existing Artifact detail shell;
- no second click/drag/layout owner.

### Board Relations browser acceptance

The browser validator progressed past the previous filter blocker.

Observed sequence:

```text
filter/hide visible-lines === 0        PASS
restore all visible-lines === 3       PASS
canonical drag marker / no overlay    PASS
relation line follows moved card      PASS
create-success RPC + re-read          PASS
permission-reject interaction         FAIL
```

Therefore the previous `FILTER_LINE_VISIBILITY` blocker is resolved on this exact candidate.

The previous drag/detail suppression condition was exercised in this run and **did not reproduce at the drag assertion**.

This is evidence for the tested drag assertion only; it does not authorize changing drag/fullscreen ownership.

## Exact failure

Step:

`48 — Validate Board Relations v1 browser acceptance`

Failure:

```text
locator.click: Timeout 30000ms exceeded.

waiting for:
.dc-notice[data-artifact-owned="1"]
  [data-relation-block]
  [data-relation-add]

resolved target:
<button class="dc-board-relation-add">＋ СВЯЗЬ</button>

pointer interception:
<div class="dc-artifact-overlay__scrim" data-overlay-close>
from <section class="dc-artifact-overlay">
```

Source location:

`scripts/validate-board-relations-runtime-browser.mjs:304`

This occurs in the **server permission reject scenario**, after the earlier create-success scenario.

The validator attempts to reopen the refreshed relation block and click `[data-relation-add]`, but the existing canonical Artifact overlay is open and its scrim intercepts pointer events.

## Diagnostic boundary

This is a different blocker from both:

- the former drag/detail suppression assertion; and
- `FILTER_LINE_VISIBILITY`.

The exact run does **not** establish why the overlay is open at the permission-reject interaction boundary.

No automatic conclusion is made about:

- `board-fullscreen-v2-1.js`;
- drag ownership;
- relation control propagation;
- focus-target semantics;
- test sequencing.

Those require separate authorization if investigation or corrective mutation is desired.

## Gate consequence

```text
runtimeValidationStatus = BLOCKED
runtimeValidationBlocker = PERMISSION_INTERACTION_OVERLAY_INTERCEPT
blockingGate = RUNTIME_CONTRACT_VALIDATION
```

No further runtime corrective is authorized by this checkpoint.

No Supabase apply, staging merge, production merge, deploy, or G6 work was performed.
