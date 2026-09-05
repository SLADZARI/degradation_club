# DEMENTOR LAB — Integrated MVP v0.8

Status: ACTIVE / INTEGRATION BRANCH / DEEP-AUDITED
Branch: `experiment/dementor-lab-integrated-v0.8`
Base: `experiment/dementor-lab-intent-saliency-v0.5`

## Goal

Unify the deterministic encounter runtime with the portrait-first story flow. Player-facing choices must be causally honest: selected brain preset, objective, HOT PATCH and rerun must change the real ExecutionTrace rather than presentation-only state.

## P0 sequence — current status

1. **IMPLEMENTED FIRST PASS** — `prototypes/portrait-flow-v0.8.html` is connected to the real controller/runtime with name/identity onboarding, portrait-first TALK, RESULT, counterfactual and Archive detail.
2. **IMPLEMENTED + DEEP-AUDIT FIXED** — Graph → Impulse → Intent → Reaction → salient WorldEvent → next Trigger is now committed in one runtime transaction. Saliency no longer overwrites a legacy event after legacy ACCEPTANCE/repeat side effects.
3. **IMPLEMENTED / GAMEPLAY DEPTH BLOCKER** — Three real player graphs exist: `EXPLAIN_LOOP`, `KEEP_PEACE`, `PRESS_FOR_ANSWER`. They are distinct, but current exposed traces are mostly single-reaction fixations rather than the richer state-driven pivots established by earlier game-feel research.
4. **IMPLEMENTED + DEEP-AUDIT FIXED** — objective is real; REPEAT repair is real; non-repeat single-route repair now inserts PAUSE instead of changing a decorative impulse weight. Counterfactual starts from the actually completed graph and then applies exactly one new mutation.
5. **IMPLEMENTED DATA CONTRACT** — RESULT and BEFORE/AFTER derive from `buildResult()`, `ExecutionTrace` and `trace-summary.mjs`.
6. **IMPLEMENTED FIRST PASS** — deterministic phrase recent-use penalty + non-causal passive BRAIN voice.
7. **IMPLEMENTED + DEEP-AUDIT FIXED** — Archive uses unique run IDs; multiple completed experiments coexist in localStorage and survive page reload.
8. **AUTOMATION GREEN / HUMAN GATE PENDING** — full deterministic suite, six-way browser matrix, quantitative mobile UX checks and 1000-run determinism/bounds smoke are green. One real outsider no-coaching test remains mandatory.

## Deep-audit evidence

See `DEEP_CODE_GAME_UX_AUDIT_v0.8.md`.

Permanent regression gates added in the audit:
- `tests/integrated-event-commit-selftest.mjs` — semantic WorldEvent committed once; ACCEPTANCE cancels the correct pending REPEAT.
- `tests/archive-persistence-selftest.mjs` — unique multi-run Archive persistence.
- `tests/mvp-integration-selftest.mjs` — REPEAT and non-repeat repairs must materially change the counterfactual trajectory.
- `tests/portrait-v08-six-way-browser.mjs` — all 3 BRAIN presets × 2 objectives complete through the real portrait UI; HOT PATCH path is exercised; six runs persist across reload.
- `tests/portrait-v08-ux-browser.mjs` — 320/390px no-overflow, >=44px visible button targets, readable primary text, portrait dominance, only BRAIN+CONTACT persistent in TALK, active speaker state.

## Current six-way product result

Deterministic matrix after the runtime integration fix:

- `EXPLAIN_LOOP / contact` → CONTACT objective completes.
- `EXPLAIN_LOOP / direct-answer` → NO_DIRECT_ANSWER.
- `KEEP_PEACE / contact` → CONTACT objective completes.
- `KEEP_PEACE / direct-answer` → NO_DIRECT_ANSWER.
- `PRESS_FOR_ANSWER / contact` → CONTACT breakdown.
- `PRESS_FOR_ANSWER / direct-answer` → ENERGY breakdown.

**Product blocker:** none of the three currently exposed brains can win `direct-answer`. The engine can support a winning adaptive strategy — the existing objective-diversity regression proves it — but the current three-card product layer does not expose one.

## MVP invariants

- No RNG may decide encounter outcome.
- Dialogue never drives game state; dialogue renders state.
- Same initial state + same graphs + same objective = same trace.
- WorldEvent is resolved and committed once before terminal/repeat semantics.
- A one-change counterfactual starts from the actual completed graph state and changes exactly one new cause.
- HOT PATCH edits Character A only and must materially change reachable consequences.
- RESULT numbers and claims derive from actual traces.
- First successful playthrough does not require the advanced BRAIN editor.
- TALK defaults to portrait + dialogue + BRAIN + CONTACT; technical diagnostics remain secondary.

## Current v0.8 implementation map

- `src/encounter/runtime.mjs` — deterministic runtime with pluggable semantic event resolver.
- `src/encounter/runtime-integrated.mjs` — Intent + saliency resolver + passive BRAIN voice.
- `src/brain/player-presets.mjs` — three real player BehaviorGraphs.
- `src/scenarios/criticism-idea.mjs` — current MVP situation/objective binding.
- `src/dialogue/phrase-saliency.mjs` — deterministic recent-use penalty.
- `src/app/mvp-session.mjs` — unique session identity, material one-change counterfactual, archive save.
- `src/app/hot-patch-strategy.mjs` — REPEAT loop-break or material PAUSE insertion, with impulse fallback.
- `src/render/portrait-state.mjs` — runtime state/reaction → portrait emotion projection.
- `src/encounter/trace-summary.mjs` — trace-derived BEFORE/AFTER summaries.
- `src/archive/run-store.mjs` — localStorage archive records.
- `src/archive/run-detail.mjs` — readable archive detail from a saved run.
- `prototypes/portrait-flow-v0.8.html` — portrait-first UI over the real runtime.
- `FIRST_TIME_PLAYER_GATE_v0.8.md` — mandatory outsider no-coaching gate.

## Integration warning

The portrait v0.7 branch and intent/saliency v0.5 branch diverged. Do not merge v0.7 wholesale over the runtime. Keep v0.8 connected to the integrated contracts above.

## Remaining before FIRST MVP label

1. **Objective viability:** make at least one of the three exposed BRAIN choices capable of completing `direct-answer`, and add a viability regression gate.
2. **First-time language:** remove `Runtime`, `commit`, `RESULT`, `COUNTERFACTUAL`, raw `TRACE` / Intent / WorldEvent enums from primary player surfaces. Restore human `ПОЧЕМУ ТАК?` progressive disclosure.
3. **Case identity:** align the visible CASE title/premise/opponent with the actual runtime scenario and Archive record.
4. **Round framing:** restore or replace the missing opponent/VS preflight so player can recall who + objective + brain before TALK; prevent bottom nav from bypassing first-run identity.
5. **Human evidence:** run one outsider first-time-player test using `FIRST_TIME_PLAYER_GATE_v0.8.md`.

P1 immediately after those gates:
- restore reachable state-driven pivots inside at least one exposed BRAIN;
- remove player/stored strings from `innerHTML` rendering;
- add `prefers-reduced-motion` behavior;
- broaden the 1000-run smoke from six repeated configurations into deterministic state-space enumeration;
- only then expand portrait customization / Archive taxonomy / additional situations.

## Acceptance gate for first MVP

A new tester should be able to say, without explanation:

> I chose this person and this brain, entered this situation with this goal, saw why the other person reacted that way, changed one cause, reran the same experiment, and the new result followed from that change.

If any part of that sentence is simulated by hard-coded copy, technically incomprehensible, or impossible to achieve with the visible choices, v0.8 is not MVP-ready.
