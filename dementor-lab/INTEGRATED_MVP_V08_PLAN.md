# DEMENTOR LAB — Integrated MVP v0.8

Status: ACTIVE / INTEGRATION BRANCH
Branch: `experiment/dementor-lab-integrated-v0.8`
Base: `experiment/dementor-lab-intent-saliency-v0.5`

## Goal

Unify the freshest deterministic encounter runtime with the portrait-first story flow. v0.8 is the first branch where the player-facing choices must be causally honest: selected brain preset, objective, HOT PATCH and rerun must all change the real ExecutionTrace rather than presentation-only state.

## P0 sequence

1. Port portrait/story flow from v0.7 onto this branch without changing encounter balance.
2. Make the integrated runtime path canonical for v0.8: Graph → Impulse → Intent → Reaction → salient WorldEvent → next Trigger.
3. Add three real BRAIN presets as real graphs, not labels.
4. Bind CASE objective and HOT PATCH to the real Encounter; HOT PATCH edits exactly one cause and recomputes the pending turn / rerun.
5. Build RESULT and BEFORE/AFTER only from ExecutionTrace / Result objects. No authored counts or metrics may contradict the trace.
6. Add deterministic phrase saliency with recent-use penalty; add passive BRAIN voice as a semantic, non-causal trace event.
7. Persist completed runs and reruns to localStorage and render Archive from those records.
8. Add mass deterministic smoke simulation and a first-time-player UX gate.

## MVP invariants

- No RNG may decide encounter outcome.
- Dialogue never drives game state; dialogue renders state.
- Same initial state + same graphs + same objective = same trace.
- A one-node counterfactual changes only consequences reachable from that mutation.
- HOT PATCH may edit Character A only and must preserve the same Encounter context.
- RESULT numbers and claims must be derived from the actual trace.
- First successful playthrough must not require opening the advanced BRAIN editor.
- TALK defaults to portrait + dialogue + BRAIN + CONTACT; technical diagnostics remain secondary.

## Existing pieces already present on the v0.5 base

- pure Encounter runtime and ExecutionTrace;
- deterministic graph path selection;
- pending REPEAT and cancellation behavior;
- predictive HOT PATCH breakpoint;
- objective-aware terminal logic;
- Intent derivation experiment;
- deterministic WorldEvent saliency experiment;
- trust / resentment memory effects;
- deterministic contextual phrase bank;
- VerticalSliceController already importing `runtime-v05.mjs`.

## Integration warning

The portrait v0.7 branch and intent/saliency v0.5 branch diverged. Do not merge v0.7 wholesale over the runtime. Port only the UX/story surfaces and then connect them to the v0.8 controller/runtime contracts.

## Acceptance gate for first MVP

A new tester should be able to say, without explanation:

> I chose this person and this brain, entered this situation with this goal, saw why the other person reacted that way, changed one cause, reran the same experiment, and the new result followed from that change.

If any part of that sentence is simulated by hard-coded copy rather than the runtime, v0.8 is not MVP-ready.
