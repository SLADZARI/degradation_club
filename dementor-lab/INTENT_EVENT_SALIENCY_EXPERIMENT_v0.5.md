# DEMENTOR LAB — Intent / Event Saliency Experiment v0.5

Status: EXPERIMENTAL / NON-CANON
Branch: `experiment/dementor-lab-intent-saliency-v0.5`
Base: `agent/dementor-lab-vertical-slice-v0.3`

## Why this exists
The current vertical slice already has real Reaction → World Event → next Trigger routing and real pending REPEAT semantics. This experiment does not replace that work. It tests one additional semantic layer inspired by simulation/dialogue engines: an internal Intent plus deterministic saliency when more than one world event is plausible.

## New semantic pipeline
`TRIGGER → GRAPH → IMPULSE → INTENT → REACTION → WORLD EVENT (saliency) → opponent TRIGGER`

Intent is not a new visible BRAIN node. It is a semantic projection derived from the selected Impulse + Reaction, so existing graphs remain valid.

Initial Intent vocabulary:
- `MAKE_UNDERSTOOD`
- `GET_AGREEMENT`
- `DEESCALATE`
- `DEFLECT_TENSION`
- `WITHDRAW`
- `PRESSURE`

## Compatibility rule
Reaction remains the primary causal signal. Intent only biases close event choices. Under the current baseline criticism scenario, EXPLAIN still deterministically produces COUNTERPOINT → PUSHBACK, preserving the current vertical-slice behavior.

Different state can make the same Reaction land differently. Example: EXPLAIN against very high CONTACT + TRUST and very low TENSION may produce ACCEPTANCE instead of COUNTERPOINT.

## Deterministic saliency
Each Reaction exposes a small candidate set. Candidates receive scores from observable encounter state (CONTACT, TENSION, BRAIN, ENERGY, trust, resentment) plus a small Intent bias. Highest score wins; ties are broken lexically. No RNG and no LLM are involved.

This keeps counterfactual replay auditable: same graphs + same state = same event decision.

## Files
- `src/encounter/intent-saliency.mjs` — intent derivation + deterministic event ranking.
- `src/encounter/runtime-v05.mjs` — experimental wrapper over canonical runtime. It leaves metric/memory execution in the canonical engine, then projects Intent and selected event into the trace and next Trigger.
- `tests/intent-saliency-selftest.mjs` — compatibility, alternate-state and determinism checks.

## Important boundary
The canonical `src/encounter/runtime.mjs` is untouched in this branch. This is deliberate: Nikita/current gameplay work keeps using the approved runtime while this semantic idea is tested separately.

## What to evaluate in playtest
1. Does the same Reaction producing different events feel causal rather than random?
2. Can the player understand why high TRUST/CONTACT changed how EXPLAIN landed?
3. Does adding Intent make RESULT/TRACE clearer, or does it add another layer of jargon?
4. Does saliency improve replay value enough to justify the extra complexity?

## Promotion gate
Do not merge into canonical runtime until:
- the experimental selftest runs green;
- at least one browser playtest shows a meaningful state-dependent event change;
- TALK/TRACE can expose the consequence without showing raw saliency scores;
- BEFORE/AFTER remains deterministic with exactly one graph mutation.
