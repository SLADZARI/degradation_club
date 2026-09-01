# DEMENTOR LAB — PRODUCT FLOW & INTERACTION SPEC v0.3

**STATUS:** APPROVED FOR VERTICAL-SLICE IMPLEMENTATION  
**DATE:** 2026-09-01  
**OWNER:** Dementor Club  
**SOURCE-OF-TRUTH BRANCH:** `dementor-club`  
**IMPLEMENTATION TARGET:** `dementor-club-site`  
**SUPERSEDES:** UX/product-flow draft v0.2 for implementation decisions.  
**BASELINE:** `DEMENTOR_LAB_GAME_ARCHITECTURE_V0.1.md` + mobile prototype line through v2.8.

---

## 0. STAGE DECISION

The exploratory mobile UX phase is closed.

The approved first-slice product loop is:

**PERSON → BRAIN → SITUATION → RUN → CONSEQUENCE → HOT PATCH → RUN AGAIN → DISCOVERY**

Player promise:

> **Собери человека → собери ему мозг → отправь к людям → посмотри, что он натворит → измени одну причину → проверь ещё раз.**

Invariant:

> **Graph is cause. Dialogue is output.**

The next stage is implementation hardening and integration. Do not expand content or add new game systems until the vertical slice passes the production gates in this document.

---

# 1. MOBILE-FIRST PRODUCT CONTRACT

DEMENTOR LAB is designed phone-first. Desktop is an expansion of the same interaction model, not the source layout scaled down.

Each primary screen has one job:

- **PERSON** — change visual identity;
- **BRAIN** — change behavior;
- **SETUP** — define the experiment;
- **TALK** — watch the autonomous collision;
- **HOT PATCH** — change one cause;
- **RESULT** — understand the consequence and choose the next experiment.

Permanent UI density must remain lower than the exploratory prototypes. Temporary detail belongs in bottom sheets, TRACE, contextual overlays and inspectors.

Mobile readability rule:

- primary copy should generally render at readable phone sizes (~15px or larger depending on hierarchy);
- support copy should not become a wall of 8–10px microtext;
- technical labels may disappear from the permanent layer if the same information is available on demand;
- target: a player should understand where to look and what the next action is within roughly 2–3 seconds.

---

# 2. PERSON

Purpose: create attachment and comedy before complexity.

Invariant:

**VISUAL CHARACTER ≠ BEHAVIOR GRAPH**

Approved mobile structure:

- large live character dominates useful area;
- horizontal category rail;
- active category exposes immediate visual choices;
- secondary descriptions are not permanently visible on small phones;
- visual changes are immediate;
- randomization affects appearance only.

Primary exit:

**СОБРАТЬ ЕМУ МОЗГ →**

The same Character object continues into BRAIN, TALK and RESULT.

---

# 3. BRAIN

## 3.1 Onboarding

Behavioral presets are jokes and real graphs, not archetype labels.

Examples:

- **Я ВСЕГДА ПРАВ**
- **СЕЙЧАС ВСЁ ОБЪЯСНЮ**
- **ЛИШЬ БЫ НЕ РУГАЛИСЬ**
- **Я ПРОСТО СПРОСИЛ**
- **МНЕ ВСЁ РАВНО**
- **ПОСМОТРИМ, ЧТО БУДЕТ**
- **СОБРАТЬ СВОЮ КАТАСТРОФУ**

## 3.2 Six semantic families

The vertical slice uses:

1. **TRIGGER** — what happened;
2. **IMPULSE** — what the character wants;
3. **STATE / MEMORY** — what accumulated/persisted;
4. **REACTION** — what the character does;
5. **LOGIC / CONTROL** — when/how often;
6. **ABILITY** — special operation.

STATE / MEMORY is executable, not decorative. The first proven persistent states are `resentment` / **ОБИДА** and `trust` / **ДОВЕРИЕ**. State changes persist in `Character.state.memory` and may affect future graph behavior.

## 3.3 Mobile manipulation contract

BRAIN is a free canvas.

Required:

- one-finger blank-canvas pan;
- one-finger node drag;
- two-finger pinch zoom;
- tap node to inspect;
- tap output → compatible target to connect;
- minimum effective interaction target around **44 CSS px**;
- bottom-sheet inspector;
- safe-area aware chrome.

Gesture disambiguation:

- node movement begins only after a small drag slop (current implementation baseline: 8px);
- a short touch remains a tap;
- when a second finger appears, active node drag yields to pinch;
- releasing a dragged node must not accidentally open the inspector.

Port target size is a device-space invariant. SVG hit radius must compensate for current viewBox/zoom so the rendered target does not shrink below the intended phone target.

## 3.4 Connections

Ports represent real compatibility and are never decorative.

When connecting:

- compatible targets remain active / acid-highlighted;
- invalid targets dim or become unavailable;
- self-links and duplicate links are rejected;
- invalid targets never pretend to connect.

## 3.5 Validation

Do not lead with technical terms such as `invalid graph` or `RUNNABLE`.

Use concrete human diagnosis, for example:

- **НЕТ ТРИГГЕРА**
- **НЕТ РЕАКЦИИ**
- **ОН ПОКА НЕ ЗНАЕТ, ЧТО ДЕЛАТЬ ПОСЛЕ «КРИТИКА».**
- **РЕАКЦИЯ ЕСТЬ, НО СИГНАЛ ДО НЕЁ НЕ ДОХОДИТ.**
- **ГОТОВ**

Only one actionable problem needs to be surfaced at a time.

---

# 4. ENCOUNTER SETUP

Setup is a transient overlay/bottom sheet over TALK.

Player must know before start:

- situation;
- opponent;
- objective;
- end condition;
- AUTO or STEP.

First-time default is **AUTO**.

Approved first-slice objective contracts:

- **SURVIVE / ВЫДЕРЖАТЬ 20 РАУНДОВ**;
- **BURNOUT / СЖЕЧЬ МОЗГ**;
- **CONTACT / СОХРАНИТЬ КОНТАКТ**.

`CONVINCE / PRESSURE` remains out of the first slice until influence/position has a legible explicit contract.

Objective has one source of truth: UI, Scenario rules and Result wording must reference the same objective contract.

---

# 5. TALK

TALK is the spectacle, not a telemetry dashboard.

Approved mobile hierarchy:

1. compact situation/objective/topic;
2. two large characters + turn;
3. four mirrored metrics;
4. editorial dialogue;
5. minimal controls;
6. persistent `PERSON / BRAIN / TALK` app navigation.

On small phones, redundant micro-labels and duplicated speaker metadata should be hidden before shrinking essential copy.

Metrics:

- **ENERGY** — remaining operational capacity; low is dangerous;
- **BRAIN** — cognitive load; high is dangerous;
- **TENSION** — social/emotional pressure;
- **CONTACT** — connection quality; low may be dangerous by scenario.

Per-turn deltas appear briefly and then get out of the way.

Dialogue is autonomous. Player does not manually choose every reply.

---

# 6. TRACE

TRACE is optional explanatory detail answering:

> **Why did that happen?**

It may show:

- trigger;
- visited nodes;
- selected impulse;
- selected reaction;
- memory change;
- metric deltas;
- loops;
- breakpoint.

TRACE never becomes the primary game surface.

---

# 7. HOT PATCH

HOT PATCH is the central interaction after autonomous behavior becomes unstable.

When triggered:

1. freeze the current TALK state;
2. preserve visible actors and metrics;
3. show the responsible causal chain;
4. expose only relevant changes;
5. allow one patch opportunity in the first slice;
6. resume the same Encounter state.

Approved patch classes:

- reduce impulse weight;
- reduce repeat count;
- insert PAUSE;
- change one compatible connection.

Resume preserves:

- current turn;
- metrics;
- memory;
- transcript;
- patch history.

AUTO resumes automatically after applying/declining the patch. STEP returns to the next manual turn.

---

# 8. CHARACTER RENDERING

Graph/runtime logic must not own visual SVG manipulation.

Approved boundary:

```text
CharacterRenderer.render(characterState)
CharacterRenderer.breakdown(characterState, reason)
```

Renderer owns:

- eyes;
- brows;
- mouth;
- head/arm/body motion;
- cause-specific breakdown acting.

Cause-specific baseline:

- BRAIN overload → overheat/instability;
- ENERGY collapse → sleepy/slump;
- CONTACT collapse → closed/tense/disengaged state.

Visual feedback must follow state; it must not introduce hidden gameplay logic.

---

# 9. RESULT

Result order is fixed:

**Funny first → causal second → analytical third.**

Stage A: punchline / outcome.  
Stage B: what actually happened.  
Stage C: mechanism + next experiment.

Result must derive from actual Encounter/ExecutionTrace, not generic psychology and not a universal score.

Primary replay action:

**ИЗМЕНИТЬ ОДНУ ВЕЩЬ →**

Strongest loop:

`RESULT → suspicious node → one change → same encounter → BEFORE / AFTER`

Target reaction:

> **«Подожди. А что будет, если я ему вот это поменяю?»**

---

# 10. MOBILE DENSITY RULE

The exploratory prototype proved that simply fitting everything onto a phone is not enough.

For the production slice:

- remove duplicate labels before reducing font size;
- show the primary action and current consequence first;
- keep BRAIN as a graph, not a graph plus permanent documentation;
- keep TALK as characters + consequence + dialogue, not a telemetry wall;
- keep RESULT as punchline + one causal explanation + next action before deeper stats;
- technical detail belongs behind tap/TRACE/inspector;
- avoid permanent microcopy that only helps developers/QA.

Current target is approximately **20–30% fewer simultaneous UI elements** than the earlier dense mobile prototypes.

---

# 11. PRODUCTION ARCHITECTURE BOUNDARIES

The next implementation stage separates responsibilities into modules equivalent to:

```text
core/model
core/graph
encounter/runtime
render/character-renderer
dialogue/phrase-bank
app/mobile-interaction
ui/workspaces
```

Rules:

- Character owns persistent state;
- BehaviorGraph owns causality;
- Encounter owns run state, transcript, traces and patches;
- Dialogue layer renders phrases from reaction/context;
- CharacterRenderer owns visual state;
- UI orchestrates interaction but does not redefine engine semantics.

A self-contained prototype may remain as a QA reference, but production code must not evolve as one monolithic HTML file.

---

# 12. VERTICAL-SLICE SCOPE FREEZE

Required before adding content packs:

1. Intro.
2. One real customizable player Character.
3. Funny BRAIN preset entry.
4. Editable real BehaviorGraph.
5. Six semantic families including executable STATE / MEMORY.
6. One authored opponent with a real graph.
7. One strong adult social Scenario.
8. At least two objective contracts.
9. AUTO and STEP.
10. Speaking/state-driven character animation.
11. Correct metric semantics.
12. Live metric deltas.
13. TRACE.
14. One real HOT PATCH.
15. Resume current encounter state.
16. Cause-specific breakdown.
17. Three-stage Result.
18. One-node counterfactual replay.
19. BEFORE / AFTER comparison.
20. Physical-phone QA.

Do **not** add situation packs, accounts, persistence systems, social sharing or LLM dialogue before this loop passes the next gates unless required for QA.

---

# 13. NEXT STAGE GATES

## Gate A — physical mobile usability

Verify on at least iPhone Safari and Android Chrome:

- tap vs node drag;
- blank-canvas pan;
- pinch beginning near/on a node;
- port selection with thumb;
- bottom-sheet scroll/dismiss;
- browser/safe-area behavior;
- full TALK → HOT PATCH → RESULT → replay flow.

## Gate B — modular runtime

Production implementation must physically separate graph/runtime, renderer, dialogue and UI orchestration.

## Gate C — deterministic flow QA

For one authored scenario verify:

- same seed/model produces expected deterministic trace;
- memory persists;
- objective wording and rules agree;
- HOT PATCH changes only the intended cause;
- resume does not reset Encounter;
- Result explains what actually happened;
- replay compares the same Scenario/model baseline.

## Gate D — FUN PASS

A new adult player should be able to:

- make a character quickly;
- choose a funny behavioral start without editor literacy;
- understand that the graph is real/editable;
- start an encounter knowing the objective;
- understand who acts and why;
- see a breakpoint;
- patch one cause;
- recognize the consequence;
- want to rerun or show the outcome.

---

# 14. IMPLEMENTATION HANDOFF

This document closes the exploratory UX/product-flow stage and authorizes implementation work in `dementor-club-site`.

The implementation branch must treat this file and `DEMENTOR_LAB_GAME_ARCHITECTURE_V0.1.md` as product/engine contracts. If implementation reveals a semantic conflict, update `dementor-club` first rather than silently redefining the product inside the site branch.
