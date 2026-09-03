# DEMENTOR LAB — Runtime Semantic Decisions v0.1

**STATUS:** APPROVED FOR VERTICAL SLICE  
**DATE:** 2026-09-03  
**OWNER:** Dementor Club  
**SOURCE-OF-TRUTH BRANCH:** `dementor-club`  
**RELATES TO:** `DEMENTOR_LAB_GAME_ARCHITECTURE_V0.1.md`, `DEMENTOR_LAB_PRODUCT_FLOW_INTERACTION_SPEC_v0.3.md`

This document records semantic decisions made after physical/mobile BRAIN QA. Approved items below supersede conflicting interaction details in v0.3.

---

## 1. APPROVED — BRAIN interaction

The production mobile BRAIN interaction is a **vertical stack / metro-style causal editor**, not the earlier free infinite canvas.

Approved behavior:

- nodes are arranged as a readable vertical causal stack;
- drag handle reorders nodes;
- tap opens local node actions;
- numeric node parameters open a mobile bottom sheet;
- explicit connect action shows compatible targets and creates real graph edges;
- additional/manual edges are rendered as bracket/metro branches and survive reorder;
- presets remain real editable graphs;
- invalid graphs explain one actionable problem and cannot start an Encounter.

The previous v0.3 requirements for blank-canvas pan, pinch zoom and permanent port manipulation are superseded for the production mobile slice.

Invariant remains:

> **Graph is cause. Dialogue is output.**

---

## 2. APPROVED — SETUP interaction

SETUP remains a **separate mobile-first screen** between BRAIN and TALK.

Flow:

`PERSON → BRAIN → SETUP → TALK → HOT PATCH → RESULT → REPLAY`

SETUP must show from real Scenario/Profile fields:

- situation;
- premise;
- objective;
- end condition;
- opponent;
- AUTO / STEP;
- PLAY.

The earlier v0.3 description of SETUP as only a transient overlay over TALK is superseded.

---

## 3. APPROVED — HOT PATCH ownership

In the first production slice the player may modify **only their own Character A**.

Rules:

- a breakpoint may be caused by either actor and may be shown as information;
- the player must never directly rewrite the generated opponent B graph;
- opponent-side causal risk may affect warnings/result, but does not grant opponent editing;
- opponent editing may only be introduced later if the product explicitly supports creating/owning that second Character.

---

## 4. APPROVED — REPEAT is a real conditional mechanic

`REPEAT ×N` is not a metric multiplier.

Approved behavior:

- REPEAT schedules another attempt of the relevant Reaction;
- `×N` means maximum total attempts including the first execution;
- repetition continues only while the previous attempt has **not been accepted**;
- acceptance is derived from deterministic game events, never from dialogue wording;
- for the first slice, `AGREE → ACCEPTANCE` cancels a pending REPEAT;
- other active reactions do not count as acceptance.

---

## 5. APPROVED — deterministic Dialogue Layer

The first slice uses a deterministic phrase-bank renderer, not random phrase choice and not an LLM dialogue dependency.

### 5.1 Content budget

For each active Reaction in the slice:

- approximately **5–8 authored base phrases**;
- a small number of contextual replacements for meaningful/extreme states.

Current Reaction set:

- EXPLAIN;
- AGREE;
- JOKE;
- SILENT;
- PRESSURE.

### 5.2 DialogueContext

Phrase resolution may read:

- Reaction;
- selected Impulse;
- Scenario;
- actor BRAIN;
- actor TENSION;
- actor CONTACT;
- relevant Memory;
- recent transcript (small window, e.g. last 2–3 entries);
- deterministic run/turn context.

Dialogue **must not modify gameplay state**. Metrics, memory, objectives and graph decisions are resolved before text rendering.

### 5.3 Determinism

No random phrase selection.

For the same meaningful input context, phrase selection must be reproducible. A replay that changes one causal node may produce a different phrase because its trace/state changed; an unchanged causal state must not change because text was rerolled.

Purpose:

> The player should hear the consequence of the brain they built, not watch a random quote generator.

---

## 6. APPROVED — Reaction → Event → Trigger collision

The semantic layer is explicitly three-stage:

`REACTION → WORLD EVENT → RECEIVER TRIGGER`

Do **not** equate Reaction directly with Trigger.

First-slice mapping:

| Reaction | World Event | Receiver Trigger | Accepted for REPEAT |
| --- | --- | --- | --- |
| EXPLAIN | COUNTERPOINT | PUSHBACK | no |
| AGREE | ACCEPTANCE | ACCEPTANCE | yes |
| JOKE | DEFLECTION | DEFLECTION | no |
| SILENT | NO_RESPONSE | IGNORE | no |
| PRESSURE | PRESSURE | PRESSURE | no |

Scenario opening remains `CRITICISM → CRITICISM`.

This makes **two graphs collide** without making dialogue text causal.

---

## 7. APPROVED — CONTACT objective

For `CONTACT / СОХРАНИТЬ КОНТАКТ` the relevant relationship value is derived as:

`RELATIONSHIP_CONTACT = min(A.contact, B.contact)`

This is not a new persistent stat.

Vertical-slice rule:

- reach the Scenario turn limit;
- neither actor has broken down;
- `RELATIONSHIP_CONTACT >= 25` → `OBJECTIVE_COMPLETE`;
- `RELATIONSHIP_CONTACT 1–24` → `OBJECTIVE_FAILED` without forced breakdown;
- `CONTACT = 0` for either participant → CONTACT breakdown.

The numeric threshold remains balance-tunable, but the semantic contract is fixed.

---

## 8. APPROVED — closed BRAIN condition safety

A conditional route must have a fallback path for the same reachable interaction context.

Editor diagnosis:

> **ЕСЛИ УСЛОВИЕ НЕ СРАБОТАЕТ, ОН ЗАВИСНЕТ. ДОБАВЬ ЗАПАСНУЮ РЕАКЦИЮ.**

START is disabled until the graph is safe.

Runtime safety for malformed/legacy graphs:

- record `NO_ACTION / CONDITION_BLOCKED`;
- consume the turn with no hidden metric effects;
- emit `NO_RESPONSE` to the other actor;
- receiver gets `IGNORE`;
- never silently inject a fake SILENT node.

---

## 9. APPROVED — mobile Trigger Hub

The runtime keeps all Trigger nodes as real graph entry points, but the mobile editor must **not render all Trigger nodes as six full-height peer cards in the main vertical stack**.

### 9.1 Player mental model

The user thinks in two layers:

1. **НА ЧТО Я РЕАГИРУЮ** — incoming situations/signals;
2. **ЧТО СО МНОЙ ПРОИСХОДИТ ДАЛЬШЕ** — state, impulse, reaction, control and ability chain.

Therefore all Trigger nodes are represented in the default BRAIN view by one compact **Trigger Hub** at the top of the graph.

Default label:

> **НА ЧТО Я РЕАГИРУЮ**

The hub displays compact active trigger chips/rows using human labels, for example:

- КРИТИКА
- ВОЗРАЖЕНИЕ
- ПРИНЯТО
- ИГНОР
- ДАВЛЕНИЕ
- УШЛИ В СТОРОНУ

### 9.2 Default collapsed state

On normal mobile entry the Trigger Hub is collapsed.

It must show at a glance:

- how many trigger entries are configured;
- which human trigger names are active;
- whether one or more entries are incomplete/invalid.

The user then sees the meaningful causal body of the brain immediately instead of scrolling through infrastructure before reaching behavior.

### 9.3 Expanded editing state

Tap on the hub expands it inline or in a mobile bottom sheet.

Expanded mode exposes each real Trigger node and its outgoing connection(s). The user can:

- inspect a trigger description;
- add/remove an available trigger;
- connect it to a compatible downstream node;
- change its outgoing route;
- see validation for an unconnected trigger.

The runtime graph remains unchanged. The hub is a **UI projection**, not a replacement data structure.

### 9.4 Trigger nodes in the main stack

Trigger cards are not duplicated in the normal causal stack when the hub is collapsed.

When the user expands/selects a trigger, its downstream route should be highlighted in the metro graph so the user can answer:

> **«Если случится вот это — куда пойдёт мой мозг?»**

### 9.5 Progressive disclosure rule

Do not show six equal visual branches by default merely because the engine has six entry points.

Complexity remains real, but the UI reveals it when the player asks for it.

This is a core mobile-first principle for DEMENTOR LAB:

> **Hide infrastructure, never hide causality.**

### 9.6 Presets

Preset cards should open with the Trigger Hub collapsed. A preset may have all first-slice trigger entries internally, but its visible first impression should remain the authored behavioral chain, not six repeated input cards.

Custom BRAIN starts with the Trigger Hub visible as an empty/partial setup affordance and prompts the player to add at least one incoming situation.

---

## 10. STILL OPEN

The following remain deliberate product/design work, not hidden engineering decisions:

1. Second objective for the vertical slice.
2. Final FUN/balance tuning after physical playtest.
3. Speaking/reaction animation depth.
4. Human-readable TRACE presentation details.

These no longer block the collision architecture itself.
