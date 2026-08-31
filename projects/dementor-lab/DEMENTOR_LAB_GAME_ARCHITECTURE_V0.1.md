# DEMENTOR LAB — GAME ARCHITECTURE & VERTICAL SLICE SPEC v0.1

**STATUS:** DRAFT / working product contract  
**DATE:** 2026-08-31  
**OWNER:** Dementor Club  
**SOURCE-OF-TRUTH BRANCH:** `dementor-club`  
**IMPLEMENTATION TARGET:** `dementor-club-site` after approval  

---

## 0. DOCUMENT ROLE

This document defines the next production stage of **DEMENTOR LAB**.

It fixes:

- product nucleus;
- playable loop;
- canonical game entities;
- Character schema;
- graph schema;
- node families;
- live metrics;
- encounter state machine;
- dialogue layer;
- HOT PATCH rules;
- breakdown / debrief behavior;
- progression;
- mobile interaction rules;
- reuse boundary from CODE METRO / PET BRAIN;
- vertical-slice scope;
- acceptance gates for implementation.

This document is not yet an approved public claim about a released club product. Until approval it is a working product specification.

---

# 1. PRODUCT NUCLEUS

## 1.1 Definition

**DEMENTOR LAB is a behavior-construction game in which the player builds a person from visual identity, internal rules, impulses, states, reactions and abilities, then places that model into social situations and observes what the system does on its own.**

The player does not primarily choose dialogue answers.

The player creates the system that chooses them.

Canonical short formulation:

> **Это игра не про выбор правильного ответа. Это игра про создание системы, которая сама выбирает ответ.**

## 1.2 Core promise

The player can:

1. create a visible character;
2. assemble a behavior graph;
3. place the character into an encounter;
4. observe autonomous behavior;
5. inspect consequences and causal trace;
6. patch the graph;
7. rerun or continue the experiment;
8. discover recurring behavior patterns.

## 1.3 What the game is not

DEMENTOR LAB is not:

- a Tamagotchi reskin;
- a personality test with one hidden correct archetype;
- a therapy simulator;
- a morality quiz;
- a chatbot with decorative nodes;
- a game where clothing determines personality;
- a lecture about the “right way” to think.

The educational layer comes from experimentation, counterfactual replay and visible causality.

---

# 2. CORE LOOP

Canonical loop:

**PERSON → BRAIN → SITUATION → RUN → CONSEQUENCE → HOT PATCH → RUN AGAIN → DISCOVERY**

Equivalent production loop:

**BUILD → CONNECT → MEET → RUN → OVERHEAT → HOT PATCH → DEBUG → RUN AGAIN**

The first production slice must prove one question:

> Is it interesting to build a person, run that person against another person, see consequences, modify the brain and continue the encounter?

No additional feature should enter the slice unless it improves this loop.

---

# 3. PRIMARY WORKSPACES

The game has three principal workspaces.

## 3.1 PERSON

Purpose: visual identity.

Player controls:

- base character;
- outfit;
- shoes;
- hat;
- glasses;
- beard / moustache;
- accessory;
- later visual variants.

PERSON does not define behavioral traits automatically.

Invariant:

**VISUAL CHARACTER ≠ BEHAVIOR GRAPH**

## 3.2 BRAIN

Purpose: behavior construction.

The player creates an executable graph from semantic blocks.

BRAIN is the central construction workspace.

On desktop it should use most of the viewport.

On mobile it behaves as a free canvas with pan, pinch zoom, drag, tap-to-connect and bottom-sheet inspection.

## 3.3 TALK

Purpose: autonomous encounter.

Two characters enter a social situation.

Each character has:

- visual state;
- behavior graph;
- live metrics;
- memory/state;
- execution trace.

The player observes rather than manually selecting every phrase.

---

# 4. CANONICAL GAME ENTITIES

## 4.1 Character

A Character is the persistent playable model.

```text
Character
  id
  name

  visual
    base
    outfit
    shoes
    hat
    glasses
    beard
    accessory

  face
    eyes
    brows
    mouth

  rig
    headRotation
    armLeft
    armRight
    legLeft
    legRight

  brainGraph
    nodes
    edges

  state
    energy
    brain
    tension
    contact
    memory

  discoveries
  history
```

PERSON, BRAIN and TALK are different editors/views over the same Character object.

## 4.2 BehaviorGraph

```text
BehaviorGraph
  id
  nodes[]
  edges[]
  entryRules[]
  validation
  runtimeState
```

## 4.3 Node

```text
Node
  id
  family
  type
  title
  subtitle
  ports
  params
  runtimeEffect
  visualMeta
```

## 4.4 Edge

```text
Edge
  id
  fromNode
  fromPort
  toNode
  toPort
```

## 4.5 Scenario

```text
Scenario
  id
  title
  premise
  objective
  initialMetrics
  actorA
  actorB
  openingTrigger
  turnLimit
  breakpoints
  resultRules
```

## 4.6 Encounter

```text
Encounter
  id
  scenarioId
  actors
  turn
  status
  transcript
  traces
  patches
  result
```

## 4.7 ExecutionTrace

ExecutionTrace records why a reaction happened.

```text
ExecutionTrace
  turn
  actorId
  trigger
  visitedNodes[]
  selectedImpulse
  selectedReaction
  metricDeltas
  loops
  breakpoint
```

---

# 5. BRAIN ALPHABET

The first production system uses six semantic families.

## 5.1 TRIGGER

Question: **What happened?**

Examples:

- CRITICISM
- IGNORE
- REJECTION
- QUESTION
- INTERRUPTION

Typical output: event signal.

## 5.2 IMPULSE

Question: **What does the character want right now?**

Examples:

- BE RIGHT
- BE LIKED
- WIN
- UNDERSTAND
- AVOID

Optional runtime parameter:

- weight 1–5.

Weights matter only when multiple impulses compete.

## 5.3 STATE / MEMORY

Question: **What has accumulated or persisted?**

Examples:

- TRUST
- RESENTMENT
- CONFIDENCE
- FATIGUE
- COUNTER

State may be read, increased, decreased or compared.

## 5.4 REACTION

Question: **What does the character do?**

Examples:

- EXPLAIN
- AGREE
- JOKE
- SILENT
- LEAVE
- ASK
- ARGUE

Reaction is an intent/action, not a hardcoded final phrase.

## 5.5 LOGIC / CONTROL

Question: **When, how often and under what condition?**

Examples:

- IF
- REPEAT
- STOP
- DELAY
- THRESHOLD
- RANDOM

Numeric controls are shown only where runtime-relevant.

## 5.6 ABILITY

Question: **What special operation can this character perform?**

Examples:

- PAUSE
- ADMIT ERROR
- CHANGE MIND
- REFRAME
- SEE OTHER PERSPECTIVE

Abilities are not moral rewards. They are additional operations in the system.

---

# 6. NODE PRESENTATION CONTRACT

Each block has:

- family/type label;
- concrete title;
- one-line runtime subtitle;
- functional icon/sign;
- optional meaningful numeric control;
- real input/output ports.

Example:

```text
IMPULSE
БЫТЬ ПРАВЫМ
сохранить позицию при противоречии
WEIGHT 3
```

Example:

```text
LOGIC / REPEAT
ПОВТОРИТЬ
снова выполнить реакцию, если ответ не принят
×2
```

Example:

```text
STATE / MEMORY
ДОВЕРИЕ
накопленное качество контакта
+1
```

Do not add numeric controls merely for visual consistency.

Ports represent actual compatibility and are never decorative.

---

# 7. LIVE METRICS

The first version uses four live metrics.

All values are normalized to `0..100` unless a scenario explicitly overrides the range.

## 7.1 ENERGY

Operational capacity / fatigue.

Decreases from:

- repeated actions;
- long encounters;
- heavy reactions;
- loops.

Low Energy affects body animation and available behavior.

Initial rendering rules:

- Energy > 60: normal amplitude;
- Energy 26–60: reduced amplitude;
- Energy ≤ 25: sleepy eyes, lowered body amplitude, slight head drop.

## 7.2 BRAIN

Cognitive load.

BRAIN is not intelligence.

Increases from:

- loops;
- contradictions;
- repeated analysis;
- competing impulses;
- complex control traversal.

Initial thresholds:

- 0–64: normal;
- 65–84: tense eyes / elevated movement;
- 85–91: overheat state eligible;
- ≥92: severe overheat / breakpoint candidate;
- 100: breakdown unless scenario rule intercepts earlier.

## 7.3 TENSION

Social/emotional pressure inside the encounter.

May increase from:

- criticism;
- pressure;
- contradiction;
- ignored boundaries;
- repeated argument.

May decrease from:

- pause;
- successful joke;
- agreement;
- de-escalating ability.

## 7.4 CONTACT

Quality of connection between actors.

CONTACT is not mood.

Valid combinations include:

- high tension + high contact;
- low tension + low contact.

The system must not automatically interpret high Tension as low Contact.

---

# 8. CHARACTER RUNTIME

The current character SVG becomes a runtime actor rather than static artwork.

Required semantic face groups:

```text
eyes-neutral
eyes-tense
eyes-sleepy
eyes-overheat

brows-neutral
brows-tense
brows-angry

mouth-neutral
mouth-soft
mouth-tense
mouth-open
```

Appearance groups currently supported:

```text
glasses
beard
hat
outfit
accessory
shoes
underwear
```

Rig groups:

```text
head-rig
body-arm-left
body-arm-right
body-leg-left
body-leg-right
```

Canonical runtime policy:

- Figma alternate emotion layers may exist at preview opacity;
- runtime inactive emotion layer = opacity 0;
- runtime active emotion layer = opacity 1;
- neutral layers remain active unless replaced.

The CharacterRenderer receives state changes and updates face/body without graph code manipulating SVG directly.

Interface:

```text
CharacterRenderer.render(characterState)
```

Graph runtime never directly edits DOM/SVG groups.

---

# 9. STATE → VISUAL MAPPING

Initial mapping for the vertical slice:

## BRAIN

- Brain ≥ 65 → tense eyes;
- Brain ≥ 85 → overheat eyes;
- Brain ≥ 92 → mouth-open candidate;
- high Brain may produce subtle head instability.

## TENSION

- Tension ≥ 55 → tense brows;
- Tension ≥ 75 → angry brows;
- high Tension increases arm gesture sharpness.

## ENERGY

- Energy ≤ 25 → sleepy eyes;
- lower motion amplitude;
- slight head drop;
- arms settle downward.

## CONTACT

- Contact ≥ 75 → soft mouth when no stronger state overrides;
- Contact ≤ 25 → tense mouth;
- higher Contact may orient head slightly toward interlocutor.

Priority rules must be deterministic.

Visual mapping is feedback, not hidden gameplay logic.

---

# 10. ENCOUNTER STATE MACHINE

Canonical encounter states:

```text
IDLE
→ INTRO
→ TRIGGER
→ GRAPH_EXECUTION
→ REACTION
→ METRIC_UPDATE
→ DIALOGUE_RENDER
→ CHECK_BREAKPOINT
→ NEXT_TURN
```

Breakpoint branch:

```text
CHECK_BREAKPOINT
→ HOT_PATCH
→ APPLY_PATCH
→ RESUME
```

Terminal branch:

```text
CHECK_BREAKPOINT
→ BREAKDOWN / OBJECTIVE_COMPLETE / TURN_LIMIT
→ DEBRIEF
→ RESULT
```

## 10.1 Turn execution

Each turn:

1. scenario or previous reaction emits Trigger;
2. actor graph receives Trigger;
3. graph traversal selects active path;
4. competing impulses are resolved;
5. Reaction intent is selected;
6. metric deltas are applied;
7. CharacterRenderer updates actor;
8. Dialogue Layer resolves phrase;
9. ExecutionTrace is saved;
10. breakpoint rules are evaluated;
11. next actor/turn proceeds.

---

# 11. DIALOGUE LAYER

The graph does not contain final dialogue copy.

Node:

```text
REACTION / EXPLAIN
```

produces an intent.

Dialogue Layer resolves the visible phrase from:

```text
reaction
impulse
scenario
brain
tension
contact
memory
recentTranscript
```

The first production version is deterministic and phrase-bank based.

No LLM dependency is required for the vertical slice.

Later an LLM may become a rendering layer, but it must not replace graph causality.

Invariant:

**Dialogue is output. Graph is cause.**

---

# 12. TWO-ACTOR RULE

Both actors use the same behavior architecture.

Character A and Character B both have:

- Character object;
- BehaviorGraph;
- live state;
- trace.

Character B may use a fixed authored graph in the first slice, but it must still be a real graph.

Do not implement the opponent as a scripted phrase sequence pretending to be a graph.

Central mechanic:

> **Two graphs collide.**

---

# 13. HOT PATCH

HOT PATCH is a primary mechanic, not a secondary debug panel.

## 13.1 Trigger conditions

Initial breakpoint candidates:

- Brain ≥ 88 with repeated loop activity;
- repeated traversal of the same reaction chain;
- Contact approaching scenario failure threshold;
- explicit scenario breakpoint.

## 13.2 Presentation

When triggered:

1. encounter pauses;
2. active causal chain is highlighted;
3. only 3–5 relevant nodes are shown prominently;
4. player receives one patch opportunity;
5. player applies change;
6. simulation continues from current encounter state.

## 13.3 Allowed patch types for slice

- reduce impulse weight;
- reduce repeat count;
- insert PAUSE;
- change one compatible connection.

Example before:

```text
CRITICISM
→ BE RIGHT ×3
→ REPEAT ×2
→ EXPLAIN
```

Example patch:

```text
BE RIGHT ×3 → ×2
```

or:

```text
REPEAT ×2 → ×1
```

or insertion:

```text
BE RIGHT
→ PAUSE
→ EXPLAIN
```

## 13.4 Resume rule

HOT PATCH does not restart the scenario.

It resumes from:

- current turn;
- current metrics;
- current memory;
- existing transcript.

---

# 14. BREAKDOWN

Failure language:

**МОДЕЛЬ РАЗВАЛИЛАСЬ.**

Do not use moralized language such as “wrong personality”.

Initial breakdown conditions:

- Brain = 100;
- Energy = 0;
- Contact = 0 when scenario treats contact as terminal;
- scenario-specific terminal state.

Breakdown always produces causal trace.

Example:

```text
TURN 03
CRITICISM
→ BE RIGHT ×4
→ REPEAT ×2
→ EXPLAIN

TENSION +17
CONTACT −12
BRAIN +22
LOOP ×3

BRAIN 100
MODEL BREAKDOWN
```

---

# 15. OBJECTIVES

The game must not optimize toward one universal “correct personality”.

First supported objectives:

## 15.1 CONVINCE

Goal: achieve argumentational advantage under scenario rules.

Avoid claiming the other actor has changed beliefs unless explicitly modeled.

Preferred result wording:

**АРГУМЕНТАЦИОННОЕ ПРЕИМУЩЕСТВО**

## 15.2 KEEP CONTACT

Goal: complete the encounter while keeping Contact above threshold.

## 15.3 SURVIVE

Goal: remain functional for N turns without breakdown.

Future objectives may include UNDERSTAND, LEAVE, NEGOTIATE, REPAIR, HIDE INTENT, but they are outside the first slice.

---

# 16. DISCOVERY SYSTEM

Discovery is retained conceptually from CODE METRO / PET BRAIN but reinterpreted.

The game may infer recurring observable patterns from trace history.

Example result:

```text
CHARACTER DISCOVERED
УПРЯМЫЙ ДИПЛОМАТ
```

A discovery label is not a psychological diagnosis.

It is a game-level description of observed runtime behavior.

The first slice may ship with only 2–4 discoveries.

---

# 17. PROGRESSION

Progression introduces one semantic layer at a time.

```text
STAGE 01 — TRIGGER + REACTION
STAGE 02 — IMPULSE
STAGE 03 — STATE / MEMORY
STAGE 04 — CONDITION / REPEAT / STOP
STAGE 05 — ABILITY
STAGE 06 — SECOND FULL CHARACTER
STAGE 07 — FREE LAB
```

This preserves the strongest learning pattern from CODE METRO: new capabilities appear through play instead of tutorial walls.

---

# 18. CODE METRO / PET BRAIN REUSE BOUNDARY

## KEEP

- SVG workbench concept;
- node dragging;
- edge system;
- port compatibility;
- magnet/snap behavior;
- pan/zoom;
- runtime graph traversal foundation;
- trace concept;
- discovery engine concept;
- node unlock progression;
- runtime self-tests concept.

## REWRITE / ADAPT

- node semantics;
- stage state machine;
- UI shell;
- dialogue layer;
- metric system;
- discovery definitions;
- result/debrief system;
- mobile interaction model.

## REMOVE FROM PRIMARY LOOP

- PET;
- egg/hatching;
- feeding;
- hunger;
- old evolution fiction;
- code-learning copy;
- old multicolor palette;
- death presentation.

Old technical IDs may remain internally where doing so reduces regression risk, but semantic/public contracts use Dementor Lab terminology.

---

# 19. UI / VISUAL SYSTEM

The game belongs to Dementor Club but may have its own project subsystem.

Core palette:

```text
PAPER
INK
ACID
```

Acid is a signal, not a dominant surface.

Avoid by default:

- blue/cyan system accents;
- multicolor node families;
- SaaS cards;
- glassmorphism;
- decorative gradients;
- neon glow;
- cyberpunk UI;
- generic AI dashboard language;
- excessive rounded rectangles.

The interface should feel like a controlled laboratory/workbench/register.

The character illustration is allowed to violate the grid more than the functional UI.

---

# 20. DESKTOP SHELL

Persistent primary navigation may use:

```text
PERSON | BRAIN | TALK
```

## PERSON

- full character dominant;
- minimal visual controls;
- no debug dashboard.

## BRAIN

- canvas is dominant;
- minimal chrome;
- graph remains readable at a glance;
- inspector appears only when needed.

## TALK

- two full or near-full characters;
- transcript between/around them;
- live metrics visible but secondary;
- HOT PATCH takes over only at breakpoint.

---

# 21. MOBILE INTERACTION CONTRACT

Mobile is not scaled desktop.

Primary navigation:

```text
PERSON · BRAIN · TALK
```

## BRAIN gestures

- one finger on empty canvas → pan;
- pinch → zoom;
- drag block → move;
- tap block → select;
- tap output port → connection mode;
- compatible inputs highlight;
- tap target input → connect;
- tap selected block → inspector bottom sheet.

Visible port target: approximately 12–16 px.

Invisible hit area target: approximately 44×44 px.

Bottom dock:

```text
+ BLOCK   AUTO   TEST
```

Add-block uses bottom sheet categories.

HOT PATCH on mobile shows only the active 3–5 node chain plus quick edit controls.

---

# 22. FIRST VERTICAL SLICE

The slice must remain deliberately small.

## 22.1 PERSON

One production-ready SVG character.

Supported toggles:

- glasses;
- beard/moustache;
- hat;
- outfit;
- accessory.

Character face/body responds to live state.

## 22.2 BRAIN

Initial node set: approximately 12 nodes.

Suggested set:

### TRIGGER
- CRITICISM
- IGNORE

### IMPULSE
- BE RIGHT
- BE LIKED
- UNDERSTAND

### REACTION
- EXPLAIN
- AGREE
- JOKE
- SILENT

### LOGIC / CONTROL
- REPEAT
- IF BRAIN >

### ABILITY
- PAUSE

The exact list may be adjusted during implementation if runtime coverage requires one substitute, but scope should remain near 12.

## 22.3 TALK

One scenario:

> **Собеседник считает твою идею плохой.**

Character B uses a fixed but real BehaviorGraph.

## 22.4 SYSTEM

Live metrics:

- Energy;
- Brain;
- Tension;
- Contact.

## 22.5 BREAKPOINT

Required path:

```text
Brain / loop pressure
→ HOT PATCH
→ one graph change
→ APPLY & CONTINUE
```

## 22.6 RESULT

Required result view:

- outcome;
- final metrics;
- causal trace;
- at least one observed behavior pattern when applicable;
- option to rerun / edit graph.

---

# 23. IMPLEMENTATION MODULES

Recommended implementation split:

```text
/core
  character-state
  graph-model
  graph-runtime
  encounter-runtime
  metrics
  trace

/render
  character-renderer
  graph-renderer
  dialogue-renderer

/content
  nodes
  phrase-bank
  scenarios
  discoveries

/ui
  person
  brain
  talk
  hot-patch
  debrief

/tests
  graph-runtime
  encounter
  balance
  regression
```

Implementation details may adapt to the existing site stack, but responsibility boundaries should remain.

---

# 24. DETERMINISTIC SELF-TESTS

Before adding further content, the runtime must support deterministic regression tests.

Minimum tests:

1. same graph + same scenario + same seed/state → same trace;
2. invalid port connection rejected;
3. graph with no runnable path reports validation state instead of silently failing;
4. repeat loop increments Brain as defined;
5. PAUSE patch changes subsequent trace;
6. HOT PATCH resumes without resetting metrics/transcript;
7. CharacterRenderer receives state but does not mutate game logic;
8. Character B uses graph runtime, not scripted dialogue branch;
9. objective result is deterministic;
10. breakdown trace identifies causal path.

No balance iteration should proceed while these tests are unstable.

---

# 25. IMPLEMENTATION ORDER

The next development cycle follows this order.

## STEP 01 — Extract runtime core

Separate usable graph/runtime logic from the old CODE METRO/PET presentation.

Do not copy old CSS/UI as foundation.

## STEP 02 — Character Object

Create one canonical Character state object and connect the current SVG asset.

## STEP 03 — CharacterRenderer

Connect Brain/Tension/Energy/Contact to face and body state.

## STEP 04 — Shell

Create production shell:

```text
PERSON / BRAIN / TALK
```

using Dementor Club palette and interaction language.

## STEP 05 — Workbench

Port graph canvas behavior:

- drag;
- connect;
- snap;
- pan;
- zoom;
- compatibility.

## STEP 06 — Dementor node set

Implement the first 12 semantic nodes.

## STEP 07 — Two actors

Run Character A against Character B with the same runtime model.

## STEP 08 — Deterministic dialogue + trace

Phrase-bank dialogue renders from graph result and state.

## STEP 09 — HOT PATCH

Pause, expose causal chain, modify one graph rule, resume.

## STEP 10 — Debrief

Show result and causal trace.

After Step 10, stop adding features and test the full loop.

---

# 26. ACCEPTANCE GATES

The vertical slice is not considered ready merely because screens exist.

## GATE A — CHARACTER

- current SVG loads reliably;
- appearance toggles work;
- face states are deterministic;
- body states visibly react to metrics;
- no graph code directly manipulates SVG.

## GATE B — GRAPH

- nodes can be added/moved/connected;
- compatibility works;
- graph validates;
- graph executes deterministically;
- trace is inspectable.

## GATE C — ENCOUNTER

- both actors execute through graph runtime;
- transcript is produced from reaction intents;
- metrics change visibly;
- scenario can complete or break down.

## GATE D — HOT PATCH

- breakpoint occurs for a causal reason;
- relevant chain is shown;
- one patch can be applied;
- encounter resumes without reset;
- changed graph changes later behavior.

## GATE E — UX

A new tester must be able to understand without explanation:

1. where to edit the person;
2. where to edit the brain;
3. how to connect nodes;
4. how to start the encounter;
5. what caused the result;
6. how to change the model and try again.

## GATE F — MOBILE

At 360–430 px portrait:

- core loop remains playable;
- no required hover;
- ports have usable touch hit areas;
- graph can pan/zoom/connect one-handed;
- HOT PATCH is usable without opening the full desktop graph layout.

---

# 27. OUT OF SCOPE FOR v0.1 VERTICAL SLICE

Do not implement yet:

- LLM-generated dialogue dependency;
- accounts/auth;
- multiplayer;
- public character sharing;
- large wardrobe library;
- monetization;
- community ranking;
- dozens of scenarios;
- deep persistent memory model;
- procedural visual generation;
- complex inventory;
- content packs;
- WORK / RELATIONSHIPS / INTERNET / CLUB expansions;
- full discovery taxonomy;
- advanced analytics.

These features can be considered only after the primary loop proves itself.

---

# 28. PRODUCT QUALITY RULE

Every new feature must answer at least one of these questions:

1. Does it make building the character more expressive?
2. Does it make the graph more understandable?
3. Does it make autonomous behavior more surprising but causally legible?
4. Does it make HOT PATCH more meaningful?
5. Does it make replay produce a visibly different consequence?

If the answer is no, it is not part of the current slice.

---

# 29. FINAL FORMULA

**The visual character is the body.**  
**The graph is the character’s internal mechanism.**  
**The encounter is the test.**  
**The trace is the explanation.**  
**HOT PATCH is the intervention.**  
**Replay is the experiment.**

The target experience is not “pick the right answer”.

The target experience is:

> **Build a system. Let it behave. See why it behaved that way. Change one rule. Run reality again.**
