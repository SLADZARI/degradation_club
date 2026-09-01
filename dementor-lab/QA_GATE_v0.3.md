# DEMENTOR LAB — QA Gate v0.3

**Branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Stage:** deterministic modular QA before PR to `dementor-club-site`

## What is now testable as one slice

`PERSON → BRAIN → SETUP → TALK → HOT PATCH → same Encounter resume → RESULT → one-node replay → BEFORE/AFTER`

The mobile UI is wired to `VerticalSliceController`; encounter semantics remain in runtime modules rather than click handlers.

## Deterministic contracts present

1. `tests/encounter-runtime-selftest.mjs`
   - deterministic first turn;
   - persistent STATE/MEMORY;
   - HOT PATCH before terminal mutation;
   - patch preserves turn, transcript and memory;
   - same Encounter resumes after patch.

2. `tests/result-replay-selftest.mjs`
   - encounter reaches a terminal result;
   - Result is generated from trace data;
   - suspicious causal node exists;
   - same-scenario rerun comparison produces metric delta.

3. `tests/ui-contract-selftest.mjs`
   - all required mobile workspace DOM contracts exist;
   - safe-area viewport contract exists;
   - UI imports `VerticalSliceController` and `compareRuns`;
   - first-run Encounter snapshot exists;
   - replay keeps first-run BRAIN baseline;
   - only one replay target remains editable;
   - non-target control is disabled and visibly locked.

Zero-dependency command:

```bash
cd dementor-lab
npm test
```

## QA finding fixed in this pass

The first replay wiring allowed both BRAIN controls to remain editable. That violated the approved counterfactual loop `one change → same encounter → BEFORE / AFTER`. Replay now returns to the original pre-run BRAIN configuration and visually exposes one causal target while locking the other parameter.

This means BEFORE/AFTER can be interpreted as a counterfactual rather than an uncontrolled second experiment.

## Known limitation before PR

The current first-slice portrait UI uses the lightweight placeholder portrait surface rather than the final semantic Dementor SVG actor. Runtime/renderer boundaries are ready, but replacing the placeholder with the approved SVG remains visual integration work, not an engine change.

## Gate status

- Modular runtime boundary: **PASS by code structure**.
- UI/runtime separation: **PASS by code structure**.
- Deterministic test suite: **AUTHORED — must be executed in a normal Node environment before PR**.
- Browser smoke test: **PENDING**.
- iPhone Safari physical QA: **PENDING**.
- Android Chrome physical QA: **PENDING**.
- PR to `dementor-club-site`: **NOT READY until the pending gates above are checked**.

## Next pass

Do not add features. Execute the zero-dependency tests, then perform browser/mobile smoke QA focused on:

- AUTO pause/resume;
- STEP progression;
- HOT PATCH timing;
- TRACE correctness;
- same-turn resume;
- RESULT causal copy;
- one-node replay lock;
- BEFORE/AFTER delta;
- safe area / bottom navigation / overlay behavior on phone.
