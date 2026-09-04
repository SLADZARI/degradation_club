# DEMENTOR LAB — Intent / Event Saliency Experiment v0.5

Status: PLAYTESTED / INTEGRATED ON EXPERIMENT BRANCH / NOT MERGED TO CANON
Branch: `experiment/dementor-lab-intent-saliency-v0.5`
Base: `agent/dementor-lab-vertical-slice-v0.3`

## Decision
The isolated HTML lab was manually tested on 2026-09-04 and the causal block was accepted as working well. The tested behavior is now wired into the real vertical-slice controller on this experiment branch. Nikita/current canonical branch remains untouched.

## Semantic pipeline
`TRIGGER → GRAPH → IMPULSE → INTENT → REACTION → WORLD EVENT (saliency) → opponent TRIGGER`

Intent is not a visible BRAIN node. It is derived from selected Impulse + Reaction, so existing graphs remain valid.

Initial Intent vocabulary:
- `MAKE_UNDERSTOOD`
- `GET_AGREEMENT`
- `DEESCALATE`
- `DEFLECT_TENSION`
- `WITHDRAW`
- `PRESSURE`

## Deterministic saliency
Each Reaction exposes a small candidate set. Candidates receive scores from encounter state (CONTACT, TENSION, BRAIN, ENERGY, trust, resentment) plus an Intent bias. Highest score wins; ties are deterministic. No RNG and no LLM.

The same Reaction can therefore land differently in a different relationship state while remaining auditable. Example: EXPLAIN can resolve to COUNTERPOINT in a tense/resentful state and ACCEPTANCE in a high-contact/high-trust state.

## Event state transition
The manually tested v0.2 lab also proved that WORLD EVENT must change state before the next brain acts. The integration therefore applies deterministic event impacts to the target after normal Reaction/Impulse deltas. Examples:
- `ACCEPTANCE` raises CONTACT, lowers TENSION/BRAIN, raises trust and reduces resentment.
- `COUNTERPOINT` lowers CONTACT, raises TENSION/BRAIN and resentment.
- `NO_RESPONSE` lowers CONTACT and raises disengagement pressure.

The resulting state becomes the input to the next actor turn.

## REPEAT contract
Existing real pending REPEAT remains intact. In the saliency layer, when the current actor's action resolves to `ACCEPTANCE`, that actor's pending repeat chain is cancelled. This is the behavior verified in the isolated lab.

## Integration files
- `src/encounter/intent-saliency.mjs` — intent derivation, event ranking and deterministic event impacts.
- `src/encounter/runtime-v05.mjs` — wrapper over canonical runtime; commits Intent, selected event, event impact, next Trigger and terminal reconciliation.
- `src/app/vertical-slice-controller.mjs` — now imports `runtime-v05.mjs` on this branch, so the actual vertical slice uses the tested semantic layer.
- `tests/intent-saliency-selftest.mjs` — determinism, alternate-state, state-transition and runtime integration assertions.

## Safety boundary
Canonical `src/encounter/runtime.mjs` remains untouched. This branch is still isolated and can be discarded without affecting Nikita's work.

## Validation state
- isolated HTML manual playtest: PASS;
- causal state change between turns: PASS manually;
- deterministic saliency behavior: covered by selftest contract;
- repository CI run for this branch: NOT AVAILABLE / no workflow runs currently exist for this branch;
- full browser vertical-slice regression after integration: still required before promotion.

## Promotion gate
Merge into canonical runtime only after:
1. full `npm test` is run green on the integrated branch;
2. browser vertical-slice playthrough confirms TALK/HOT PATCH/RESULT still work;
3. TALK/TRACE exposes consequences without raw saliency scores;
4. BEFORE/AFTER remains deterministic with exactly one graph mutation.
