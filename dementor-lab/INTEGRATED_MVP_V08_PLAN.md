# DEMENTOR LAB — Integrated MVP v0.8

Status: ACTIVE / INTEGRATION BRANCH
Branch: `experiment/dementor-lab-integrated-v0.8`
Base: `experiment/dementor-lab-intent-saliency-v0.5`

## Goal

Unify the freshest deterministic encounter runtime with the portrait-first story flow. v0.8 is the first branch where the player-facing choices must be causally honest: selected brain preset, objective, HOT PATCH and rerun must all change the real ExecutionTrace rather than presentation-only state.

## P0 sequence — current status

1. **IN PROGRESS** — Portrait/story flow is now represented by `prototypes/portrait-flow-v0.8.html` and is connected to the real controller/runtime. It still needs final parity with all v0.7 onboarding/presentation details.
2. **IMPLEMENTED FOR v0.8 PATH** — `runtime-integrated.mjs` promotes Graph → Impulse → Intent → Reaction → salient WorldEvent → next Trigger into the controller path and emits semantic trace events.
3. **IMPLEMENTED** — Three real player graphs: `EXPLAIN_LOOP`, `KEEP_PEACE`, `PRESS_FOR_ANSWER`.
4. **IMPLEMENTED CORE / UI NEEDS POLISH** — CASE objective changes real scenario objective. HOT PATCH uses real `applyHotPatch`; counterfactual rerun recreates the same config and mutates exactly one graph cause. Non-REPEAT patch UX still needs generalized presentation.
5. **IMPLEMENTED DATA CONTRACT** — `trace-summary.mjs` and existing `buildResult()` derive counts/metrics from real traces; v0.8 portrait result uses these runtime objects. Remove any remaining authored/demo result text before MVP label.
6. **IMPLEMENTED FIRST PASS** — deterministic phrase recent-use penalty via `phrase-saliency.mjs`; passive BRAIN voice emitted as non-causal semantic trace event.
7. **IMPLEMENTED FIRST PASS** — completed encounters serialize into `localStorage` via `archive/run-store.mjs`; portrait Archive renders stored runs. Archive detail UI still needs completion.
8. **AUTOMATION IMPLEMENTED / EXECUTION PENDING** — `tests/mvp-mass-smoke.mjs` runs 1000 deterministic encounters and checks bounds/distinct preset traces. `FIRST_TIME_PLAYER_GATE_v0.8.md` defines the outsider test. A real outsider playtest is still required.

## MVP invariants

- No RNG may decide encounter outcome.
- Dialogue never drives game state; dialogue renders state.
- Same initial state + same graphs + same objective = same trace.
- A one-node counterfactual changes only consequences reachable from that mutation.
- HOT PATCH may edit Character A only and must preserve the same Encounter context.
- RESULT numbers and claims must be derived from the actual trace.
- First successful playthrough must not require opening the advanced BRAIN editor.
- TALK defaults to portrait + dialogue + BRAIN + CONTACT; technical diagnostics remain secondary.

## Current v0.8 implementation map

- `src/encounter/runtime-integrated.mjs` — integrated semantic runtime path + passive brain voice.
- `src/brain/player-presets.mjs` — three real player BehaviorGraphs.
- `src/scenarios/criticism-idea.mjs` — objective + player preset binding.
- `src/dialogue/phrase-saliency.mjs` — deterministic recent-use penalty.
- `src/app/mvp-session.mjs` — real session, terminal run, one-change counterfactual rerun, archive save.
- `src/encounter/trace-summary.mjs` — trace-derived BEFORE/AFTER summaries.
- `src/archive/run-store.mjs` — localStorage archive records.
- `prototypes/portrait-flow-v0.8.html` — portrait-first UI over the real runtime.
- `tests/mvp-mass-smoke.mjs` — 1000-run deterministic smoke.
- `FIRST_TIME_PLAYER_GATE_v0.8.md` — no-coaching MVP UX gate.

## Integration warning

The portrait v0.7 branch and intent/saliency v0.5 branch diverged. Do not merge v0.7 wholesale over the runtime. Port only missing UX/story surfaces and keep v0.8 connected to the integrated contracts above.

## Remaining before first MVP label

1. Run the complete automated suite including `npm run test:mvp-smoke` and fix any regression.
2. Finish portrait v0.7 parity: name/identity onboarding, emotion projection polish, archive detail, cleaner HOT PATCH for non-repeat causes.
3. Verify every RESULT statement against ExecutionTrace in browser playthroughs.
4. Run one outsider first-time-player test using `FIRST_TIME_PLAYER_GATE_v0.8.md`.

## Acceptance gate for first MVP

A new tester should be able to say, without explanation:

> I chose this person and this brain, entered this situation with this goal, saw why the other person reacted that way, changed one cause, reran the same experiment, and the new result followed from that change.

If any part of that sentence is simulated by hard-coded copy rather than the runtime, v0.8 is not MVP-ready.
