# DEMENTOR LAB — Integrated MVP v0.8

Status: ACTIVE / INTEGRATION BRANCH
Branch: `experiment/dementor-lab-integrated-v0.8`
Base: `experiment/dementor-lab-intent-saliency-v0.5`

## Goal

Unify the freshest deterministic encounter runtime with the portrait-first story flow. v0.8 is the first branch where the player-facing choices must be causally honest: selected brain preset, objective, HOT PATCH and rerun must all change the real ExecutionTrace rather than presentation-only state.

## P0 sequence — current status

1. **IN PROGRESS** — `prototypes/portrait-flow-v0.8.html` is connected to the real controller/runtime. Remaining UX parity: name/identity onboarding and final visual polish.
2. **IMPLEMENTED FOR v0.8 PATH** — `runtime-integrated.mjs` promotes Graph → Impulse → Intent → Reaction → salient WorldEvent → next Trigger and emits semantic trace events.
3. **IMPLEMENTED** — Three real player graphs: `EXPLAIN_LOOP`, `KEEP_PEACE`, `PRESS_FOR_ANSWER`.
4. **CORE IMPLEMENTED / GENERALIZATION IN PROGRESS** — CASE objective changes the real scenario objective. `hot-patch-strategy.mjs` now recommends a one-cause patch for REPEAT or, when no repeat exists, the active impulse. Counterfactual rerun recreates the same config and mutates exactly one graph cause. The portrait UI still needs to consume the generalized recommendation instead of assuming REPEAT.
5. **IMPLEMENTED DATA CONTRACT** — RESULT and BEFORE/AFTER are derived from `buildResult()`, `ExecutionTrace` and `trace-summary.mjs`. No authored metric/count is allowed for the MVP path.
6. **IMPLEMENTED FIRST PASS** — deterministic phrase recent-use penalty via `phrase-saliency.mjs`; passive BRAIN voice emitted as a non-causal semantic event.
7. **IMPLEMENTED DATA / DETAIL MODEL ADDED** — runs persist to `localStorage` via `archive/run-store.mjs`; `archive/run-detail.mjs` derives readable battle detail from the saved record. Archive detail presentation still needs wiring in the portrait UI.
8. **AUTOMATION IMPLEMENTED / EXECUTION PENDING** — `tests/mvp-mass-smoke.mjs` covers 1000 deterministic encounters. `tests/mvp-integration-selftest.mjs` covers generalized patch recommendation and portrait-state projection. A real outsider playtest remains required.

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

- `src/encounter/runtime-integrated.mjs` — integrated semantic runtime + passive BRAIN voice.
- `src/brain/player-presets.mjs` — three real player BehaviorGraphs.
- `src/scenarios/criticism-idea.mjs` — objective + player preset binding.
- `src/dialogue/phrase-saliency.mjs` — deterministic recent-use penalty.
- `src/app/mvp-session.mjs` — real session, one-change counterfactual rerun, archive save.
- `src/app/hot-patch-strategy.mjs` — player-facing one-cause patch recommendation for REPEAT or impulse.
- `src/render/portrait-state.mjs` — runtime state/reaction → portrait emotion projection.
- `src/encounter/trace-summary.mjs` — trace-derived BEFORE/AFTER summaries.
- `src/archive/run-store.mjs` — localStorage archive records.
- `src/archive/run-detail.mjs` — readable archive detail derived from a saved run.
- `prototypes/portrait-flow-v0.8.html` — portrait-first UI over real runtime.
- `tests/mvp-integration-selftest.mjs` — integrated patch/emotion contract.
- `tests/mvp-mass-smoke.mjs` — 1000-run deterministic smoke.
- `FIRST_TIME_PLAYER_GATE_v0.8.md` — no-coaching MVP UX gate.

## Integration warning

The portrait v0.7 branch and intent/saliency v0.5 branch diverged. Do not merge v0.7 wholesale over the runtime. Port only missing UX/story surfaces and keep v0.8 connected to the integrated contracts above.

## Remaining before first MVP label

1. Wire `hot-patch-strategy.mjs` into portrait flow so every preset gets a meaningful one-cause patch, not only EXPLAIN_LOOP.
2. Wire `portrait-state.mjs` into TALK and remove technical emotion labels from the player-facing surface.
3. Add name/identity onboarding and wire `run-detail.mjs` into an interactive Archive detail screen.
4. Run the complete automated suite including `npm run test:mvp` / `npm test` and fix regressions.
5. Verify every RESULT statement against ExecutionTrace in browser playthroughs.
6. Run one outsider first-time-player test using `FIRST_TIME_PLAYER_GATE_v0.8.md`.

## Acceptance gate for first MVP

A new tester should be able to say, without explanation:

> I chose this person and this brain, entered this situation with this goal, saw why the other person reacted that way, changed one cause, reran the same experiment, and the new result followed from that change.

If any part of that sentence is simulated by hard-coded copy rather than the runtime, v0.8 is not MVP-ready.
