# DEMENTOR LAB — Deep Code / Game / UX Audit v0.8

Status: DEEP AUDIT / MVP GATE
Branch: `experiment/dementor-lab-integrated-v0.8`
Date: 2026-09-05

## Executive verdict

v0.8 is no longer a scripted prototype. The runtime, saliency projection, three BRAIN presets, trace-derived result, one-change rerun, portrait renderer and real localStorage archive are connected and executable. Deterministic QA is green after the audit fixes below.

However, **v0.8 should not yet be labelled FIRST MVP**. The remaining blockers are primarily game-design and first-time UX, not basic wiring:

1. the exposed `direct-answer` objective currently has **no winning BRAIN among the three player-facing presets**;
2. all three exposed presets are behaviorally distinct but mostly **single-tactic fixations**, weaker than the previously approved state-driven arc standard;
3. the portrait shell has reintroduced technical/debug language on primary player surfaces;
4. CASE copy and runtime scenario identity are not fully aligned;
5. the required no-coaching outsider test has not been performed.

## Evidence reviewed

### Current implementation
- core model / graph validation;
- base encounter runtime;
- integrated Intent + WorldEvent saliency runtime;
- BRAIN player/opponent presets;
- phrase bank + recent-use saliency;
- result / replay / trace summary;
- HOT PATCH strategy;
- portrait emotion projection;
- archive serialization/detail;
- MVP session/controller;
- portrait-flow v0.8 UI;
- all deterministic tests and GitHub Actions browser flow.

### Previous product / research decisions
- `GAME_FEEL_ARC_AUDIT_v0.1.md`;
- `BRAIN_NODE_MECHANICS_AUDIT_v0.1.md`;
- `BRAIN_FIRST_RUN_CONTRACT_v0.1.md`;
- portrait-first UX spec from v0.7;
- `FIRST_TIME_PLAYER_GATE_v0.8.md`;
- prior similar-game research: andstar, Yarn Storylets/Saliency, Wolfcha / AI Mafia / ArenAI, Anansi and Reigns-style mobile information discipline.

Research principles used as audit criteria:

- graph/state is cause; dialogue is output;
- deterministic runtime, no RNG/LLM outcome authority;
- Intent exists before speech;
- WorldEvent selected from state/context, then becomes the other actor's Trigger;
- REPEAT is pending future attempts and is cancelled by real ACCEPTANCE;
- HOT PATCH must materially change causal trajectory;
- same initial state + same graphs + same objective = same trace;
- first successful run does not require graph-editor knowledge;
- story and conversation dominate; technical trace is secondary disclosure;
- a branch that is visible but unreachable is decorative, not gameplay.

---

## 1. Runtime / causality audit

### PASS — deterministic graph execution
Graph validation rejects dangling edges, invalid family links, explicit cycles, unreachable reactions, islands and conditional branches without fallback. Runtime route scoring remains deterministic.

### PASS — real pending REPEAT
REPEAT remains a pending future behavior across opponent turns and has explicit loop friction. `×N → ×1` is still a decisive loop-break intervention.

### FIXED IN THIS AUDIT — WorldEvent was being committed twice semantically
Before this audit, `runtime-integrated.mjs` called the legacy runtime first. The base runtime committed the fixed `REACTION_EVENT_MATRIX`, including ACCEPTANCE side effects, and only afterwards the integrated wrapper replaced that event with saliency output.

That created a hidden causal violation: a legacy ACCEPTANCE could cancel a pending REPEAT even when saliency later selected a non-acceptance event; a saliency ACCEPTANCE could also cancel the wrong actor's repeat.

Fix:
- base `executeActorTurn` now accepts an `eventResolver`;
- integrated saliency resolves the WorldEvent after reaction/impulse effects but **before event commit and terminal evaluation**;
- the resolved WorldEvent is committed exactly once;
- ACCEPTANCE cancels the target actor's pending REPEAT once;
- event impact is present in the same ExecutionTrace `after.target` state.

Permanent gate added: `tests/integrated-event-commit-selftest.mjs`.

### WATCH — breakpoint prediction does not yet include future saliency WorldEvent impact
HOT PATCH prediction currently sees graph/reaction/impulse/pause deltas but not the still-uncommitted WorldEvent effect. This is acceptable for the current slice but means an event-induced CONTACT/BRAIN jump can become terminal without a pre-commit semantic-event breakpoint. P1 architecture follow-up.

---

## 2. BRAIN / game-design audit

### PASS — three player-facing presets are real graphs
- `EXPLAIN_LOOP`
- `KEEP_PEACE`
- `PRESS_FOR_ANSWER`

They produce three distinct player trace signatures.

### BLOCKER — the three exposed presets are mostly fixation machines
Current six-way matrix shows:
- EXPLAIN_LOOP: player turns are effectively all EXPLAIN;
- KEEP_PEACE: effectively all AGREE;
- PRESS_FOR_ANSWER: effectively all PRESSURE.

This is behaviorally distinct, but it falls below the earlier GAME FEEL ARC target:

`authored pattern → accumulated state/history → behavioral pivot or fixation → consequence → intervention`

Earlier approved regression examples included reachable `AGREE → SILENT` and `JOKE → PRESSURE` pivots inside the same authored BRAIN. v0.8's simplified presets removed most internal alternatives.

Recommendation: keep three player-facing cards, but make at least one or two of them internally adaptive again. Do not add more cards before the existing three support readable trajectories.

### BLOCKER — direct-answer is currently unwinnable with exposed presets
After the corrected integrated-event runtime, current deterministic matrix is:

- EXPLAIN_LOOP / contact → OBJECTIVE_COMPLETE;
- EXPLAIN_LOOP / direct-answer → OBJECTIVE_FAILED / NO_DIRECT_ANSWER;
- KEEP_PEACE / contact → OBJECTIVE_COMPLETE;
- KEEP_PEACE / direct-answer → OBJECTIVE_FAILED / NO_DIRECT_ANSWER;
- PRESS_FOR_ANSWER / contact → BREAKDOWN / CONTACT;
- PRESS_FOR_ANSWER / direct-answer → BREAKDOWN / ENERGY.

So the player can select `ДОБИТЬСЯ ОТВЕТА`, but none of the three visible brains can complete it.

This is not just balance. It breaks perceived agency: the UI offers a goal with no viable visible strategy.

Important evidence: the existing `objective-diversity-selftest.mjs` already proves that an adaptive ask/regulate/ask graph can complete the second objective. The engine can support the goal; the current three-card product layer does not expose a viable strategy.

### SEMANTIC WATCH — "direct answer" is represented by opponent COUNTERPOINT count
The current objective counts B-side `COUNTERPOINT` WorldEvents as answers. This is a useful slice proxy but not a fully natural semantic model of "answering a question". Do not expand the objective content library until this representation is deliberately accepted or replaced.

---

## 3. HOT PATCH / counterfactual audit

### FIXED IN THIS AUDIT — non-repeat patch was decorative on single-route graphs
The prior generalized strategy reduced impulse weight for KEEP_PEACE / PRESS_FOR_ANSWER. On a graph with only one route, impulse weight changes route score but cannot change which route wins; the fixed impulse metric effect is also independent of weight. That made the "repair" mostly a printed number change.

This violated the earlier rule: **HOT PATCH must change trajectory, not merely a node number.**

Fix:
- REPEAT graphs still receive `REPEAT ×N → ×1`;
- non-repeat single-route graphs now receive `INSERT PAUSE` before the active Reaction where possible;
- PAUSE changes BRAIN/TENSION/ENERGY/CONTACT and therefore materially changes later saliency/terminal state;
- integration test now requires the before/after signature to change for KEEP_PEACE and PRESS_FOR_ANSWER.

### FIXED IN THIS AUDIT — rerun could contain more than one difference after a live HOT PATCH
Counterfactual rerun previously reconstructed the original preset, not the actually completed graph. If the first run had already been patched, the "before" and "after" could differ by both the previous patch and the new mutation.

Fix: rerun now clones the completed run's current player graph first, then applies exactly the requested new mutation.

---

## 4. Archive / persistence audit

### FIXED IN THIS AUDIT — all runs had the same ID
`createEncounter()` defaults to `encounter-1`, and v0.8 sessions did not override it. Archive deduplicates by `runId`, so every new experiment replaced the prior experiment.

Fix:
- every MVP session now receives a unique non-causal run id;
- multi-run archive test saves two real completed encounters and verifies both survive serialization;
- six-way browser gate saves all six preset/objective combinations and verifies they coexist and survive page reload.

Permanent gate: `tests/archive-persistence-selftest.mjs`.

---

## 5. Dialogue / saliency / passive voice

### PASS — dialogue is downstream of state
Phrase selection does not drive state. Controller asks the runtime for a trace first and only then renders a phrase.

### PASS — recent-use penalty exists
`phrase-saliency.mjs` avoids recently used exact phrases deterministically.

### PARTIAL — saliency pool is narrower than the original Yarn-inspired target
The explicit recent-use scoring primarily operates over the base reaction phrase bank after the preferred phrase repeats. Contextual EXTREME variants are not all ranked together in one storylet pool. This is acceptable MVP scope but is not yet the full "contextual match + memory match - recent use" architecture from research.

### PASS / WATCH — passive BRAIN voice
Passive brain voice is a non-causal semantic event, which matches the andstar-inspired design. UX presentation is still too technical because it currently displays raw node type and weight before the line.

---

## 6. UI / UX audit against portrait v0.7 research

### What improved substantially
- real portrait-first flow, not scripted conversation;
- NAME establishes identity;
- portrait dominates the identity screen;
- TALK persists only BRAIN + CONTACT;
- two character portraits make speaker/listener legible;
- runtime emotion projection is connected to SVG face layers;
- RESULT numbers and causes come from real traces;
- BEFORE/AFTER is a real counterfactual;
- Archive and Archive Detail are real data, not demo cards;
- first run does not require the advanced graph editor.

### BLOCKER — debug/cockpit language returned to primary surfaces
The v0.7 rule was "human situation first, technical trace one level deeper". Current v0.8 exposes:
- `INTEGRATED MVP · v0.8` on INTRO;
- `Runtime ... commit` on HOT PATCH;
- `RESULT`;
- `COUNTERFACTUAL`;
- `TRACE`;
- raw `INTENT` / `WORLD_EVENT` / trigger enums in TALK;
- raw brain node type + weight in passive voice.

This directly conflicts with the first-time-player gate, which fails when technical terms require explanation.

Required correction: player-facing copy should say what happened in human terms. Keep raw trace behind an explicit advanced disclosure.

### BLOCKER — WHY is permanently technical instead of progressive disclosure
Research contract required a closed `ПОЧЕМУ ТАК? +` disclosure with:
- `ТЫ СДЕЛАЛ`;
- `СОБЕСЕДНИК ВОСПРИНЯЛ`;
- `ПОЭТОМУ СРАБОТАЛО`.

Current TALK permanently prints a raw pipeline. This is the exact cockpit pattern the portrait redesign was meant to remove.

### P1 — CASE presentation and runtime identity disagree
Portrait UI says `НЕУДОБНЫЙ ВОПРОС`, while the active MVP session uses `criticism-idea` / `КРИТИКА ИДЕИ` and stores that runtime title in Archive. The UI premise also describes disagreement with an idea rather than the earlier "Ира уходит от прямого ответа" case.

There is already a separate `direct-answer.mjs` scenario in the repository. Product must choose one canonical situation contract instead of visually renaming a different runtime scenario.

### P1 — CASE omits opponent setup
The v0.7 contract called for opponent portrait, name and one behavioral sentence before BRAIN selection. Current CASE shows neither portrait nor opponent behavior. The player enters TALK without a clean mental model of who they are colliding with.

### P1 — VS beat disappeared
v0.7 had a dedicated VS/preflight moment with both portraits, chosen brain and objective. v0.8 jumps BRAIN → TALK. This saves a screen but weakens round framing and objective recall. Either restore VS or make BRAIN's final CTA include a compact preflight summary.

### P1 — bottom navigation bypasses onboarding
Persistent `ИГРАТЬ` routes directly to SETUP, bypassing NAME/PORTRAIT. For a first run, nav should be hidden/locked or route through the current incomplete step.

### P1 — first-run interaction defaults to STEP
The current portrait flow advances via `СЛЕДУЮЩИЙ ХОД`. Earlier product direction favored AUTO for first play with STEP as advanced/inspection mode. This should be validated with the outsider test rather than assumed.

### P1 — portrait identity screen is not yet a real portrait customizer
It is correctly portrait-only, but the v0.7 contract expected 3–4 light categories such as head/face/accessory. Current screen is essentially a confirmation screen.

### P1 — Archive IA is thinner than the approved return-loop concept
Current Archive is a working experiment list/detail, which is the correct MVP minimum. The earlier top-level `ЭКСПЕРИМЕНТЫ / ПЕРСОНАЖИ / ПОЛОМКИ / ИСПРАВЛЕНИЯ` taxonomy is not present. Do not block MVP on the three non-interactive sections, but preserve the taxonomy for expansion.

### P1 — reduced-motion contract missing from portrait prototype CSS
Earlier mobile pass explicitly included reduced motion. Current portrait CSS uses transitions but has no `prefers-reduced-motion` override.

### P1 code-quality/security — user name is inserted through `innerHTML`
Dialogue and Archive card rendering interpolate player-controlled name into `innerHTML`. Even in a local prototype this permits markup injection. Use DOM nodes / `textContent` for user and stored strings before any shared/public build.

---

## 7. Automated test quality audit

### Strong coverage now
Deterministic suite covers:
- graph/runtime basics;
- real REPEAT;
- Intent + WorldEvent saliency;
- integrated single-commit event semantics;
- gameplay regressions;
- game-feel arcs in the older richer graph set;
- objective diversity capability;
- dialogue determinism;
- result/replay;
- renderer/assets;
- opponent generation;
- BRAIN editor contracts;
- MVP patch materiality;
- multi-run archive persistence;
- v0.8 portrait wiring;
- 3 presets × 2 objectives;
- 1000 bounded deterministic executions.

Browser suite now covers:
- iPhone portrait happy path;
- all 3×2 player-facing combinations;
- real HOT PATCH UI in the six-way run when reached;
- six saved runs coexisting in localStorage;
- Archive surviving page reload;
- 390px and 320px quantitative layout checks;
- >=44px visible button targets;
- >=15px lead text;
- portrait dominance;
- exactly two persistent TALK metrics;
- active speaker visual state;
- horizontal overflow gate.

### IMPORTANT LIMIT — "1000-run smoke" is not fuzzing
The 1000-run test repeats the same six deterministic preset/objective configurations. It is useful as a determinism/bounds regression, but it does not explore 1000 unique states.

Next robustness pass should deterministically enumerate a matrix of:
- initial BRAIN / CONTACT / TENSION bands;
- trust / resentment memory bands;
- repeat counts;
- relevant one-node mutations;
- objective/preset/opponent combinations.

No RNG is needed to get much stronger state-space coverage.

### Not yet covered
- real human first-time comprehension;
- screen reader / semantic accessibility;
- keyboard navigation;
- visual screenshot regression of facial states;
- reduced-motion behavior;
- actual portrait customization because it is not implemented in v0.8;
- production persistence beyond localStorage.

---

## 8. Expert game-design verdict

### Core simulation: STRONG
The differentiated part of DEMENTOR LAB is now real: two deterministic graphs collide through semantic events, state and memory. This is a better foundation than an LLM dialogue game because replay can remain causally honest.

### Current gameplay layer: PROMISING BUT TOO LINEAR
The three-card choice is understandable, but current graphs behave more like three fixed personalities than three learnable builds. The earlier arc research was stronger because one graph could visibly change behavior as the encounter state changed.

### Current objective layer: NOT YET FAIR
CONTACT has viable strategies. DIRECT ANSWER currently does not. A goal with no visible winning build is fine only if the game explicitly frames it as an impossible challenge; current UI does not. Therefore this is a blocker, not flavor.

### Current payoff loop: GOOD DIRECTION
`watch → understand → change one cause → rerun → compare → archive` is the right signature loop. It creates learning and shareable postmortems without needing a universal score.

---

## 9. MVP readiness gate

### Green
- deterministic runtime;
- semantic two-actor collision;
- three real preset graphs;
- real portrait TALK;
- trace-derived RESULT;
- material one-change repair;
- real counterfactual;
- deterministic phrase variety;
- passive brain voice;
- multi-run local archive;
- automated deterministic/browser coverage.

### Must fix before FIRST MVP label
1. expose at least one viable strategy for DIRECT ANSWER and regression-gate objective viability;
2. remove primary-surface debug language and make `ПОЧЕМУ ТАК?` human + collapsed;
3. align CASE copy, scenario ID/premise and Archive identity;
4. decide/restore preflight opponent/VS framing so a novice knows who/goal/brain before TALK;
5. run the real outsider no-coaching gate and record evidence.

### Should fix immediately after
- restore meaningful state-driven pivots inside at least one exposed BRAIN;
- sanitize user/stored strings away from `innerHTML`;
- reduced-motion CSS;
- broaden deterministic smoke into state-space enumeration;
- stronger Archive taxonomy / portrait customization only after the first loop is proven.

## Final status

**Engineering:** integrated and regression-tested.

**Game system:** causally credible, but objective viability and exposed trajectory depth are not yet at the standard established by our earlier research.

**UX:** structurally much better than the cockpit version, but technical language has leaked back into the player-facing shell and is currently the largest comprehension risk.

**Release decision:** `FIRST MVP = NOT YET`. Fix the five blocking gates above; do not add new screens or systems before they are resolved.
