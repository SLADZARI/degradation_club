# DEMENTOR LAB — Runtime Semantic Decisions v0.1

**STATUS:** PARTIALLY APPROVED / matrix proposal in design  
**DATE:** 2026-09-02  
**OWNER:** Dementor Club  
**SOURCE-OF-TRUTH BRANCH:** `dementor-club`  
**RELATES TO:** `DEMENTOR_LAB_GAME_ARCHITECTURE_V0.1.md`, `DEMENTOR_LAB_PRODUCT_FLOW_INTERACTION_SPEC_v0.3.md`

This document records semantic decisions made after physical/mobile BRAIN QA. Approved items below supersede conflicting interaction details in v0.3. Proposed items remain non-production until explicitly approved.

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

## 4. APPROVED — REPEAT becomes a real conditional mechanic

`REPEAT ×N` must not remain only a metric multiplier.

Approved direction:

- REPEAT schedules another attempt of the relevant Reaction;
- repetition continues only while the previous attempt has **not been accepted**;
- an explicit deterministic acceptance signal must exist in runtime;
- acceptance must be derived from game events/reactions, never from dialogue wording or random text;
- the exact acceptance table is defined together with the Reaction → Event → Trigger matrix.

Until that matrix is approved, do not finalize REPEAT balance numbers.

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

For the same meaningful input context, phrase selection must be reproducible. A replay that changes one causal node may produce a different phrase because its trace/state changed; an unchanged causal state must not change just because text was randomly rerolled.

Purpose:

> The player should hear the consequence of the brain they built, not watch a random quote generator.

---

## 6. DESIGN RULE — Reaction → Event → Trigger

The next semantic layer is explicitly three-stage:

`REACTION → WORLD EVENT → RECEIVER TRIGGER`

Do **not** equate Reaction directly with Trigger.

Reason:

- a Reaction is what the acting Character does;
- an Event is what happened in the interaction;
- a Trigger is how the receiving BehaviorGraph can enter in response to that event.

This layer is required to make “two graphs collide” real and to define REPEAT acceptance without using dialogue text.

The first matrix is designed in a separate proposal and remains non-production until approved.

---

## 7. STILL OPEN

The following are deliberately not invented here:

1. CONTACT objective success rule and threshold.
2. Exact Reaction → Event → Trigger matrix.
3. Exact acceptance/rejection table used by REPEAT.
4. Closed-condition (`BRAIN >`) fallback behavior.
5. Second objective for the vertical slice.

These should be solved as one game system, because changing the event matrix changes contact flow, repeat behavior and branch semantics.
