# DEMENTOR LAB — Open Product Decisions v0.1

**Status:** OPEN / reduced after 2026-09-02 decisions  
**Date:** 2026-09-02  
**Implementation branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Purpose:** isolate questions that cannot be safely resolved as engineering bugs. Approved decisions live first in `dementor-club`.

Canonical follow-up:
- `projects/dementor-lab/DEMENTOR_LAB_RUNTIME_SEMANTIC_DECISIONS_V0.1.md` on `dementor-club`.
- `projects/dementor-lab/DEMENTOR_LAB_REACTION_EVENT_TRIGGER_MATRIX_V0.1.md` on `dementor-club` (proposal until approved).

## CLOSED / approved direction

### BRAIN interaction — CLOSED
Production mobile BRAIN is the new vertical stack / metro-style editor. Free-canvas pan/pinch contract is superseded for the slice.

### SETUP interaction — CLOSED
SETUP remains a separate mobile-first screen between BRAIN and TALK.

### HOT PATCH ownership — CLOSED
Player may patch only own Character A. Generated opponent B is not editable in the first slice.

### REPEAT direction — CLOSED DIRECTION / matrix details pending
REPEAT becomes a real conditional mechanic. It must use deterministic acceptance/rejection events and may not remain only a metric multiplier. Exact event table is part of the Reaction → Event → Trigger proposal.

### Dialogue depth — CLOSED
Use 5–8 authored base phrases per active Reaction plus a small number of contextual replacements at meaningful/extreme states. Phrase selection is deterministic; no random choice and no LLM requirement. Dialogue reads gameplay context but never changes gameplay state.

## P0 — decisions still blocking semantic closure

### 1. What is a CONTACT objective win?

Current facts:
- Scenario says `CONTACT / СОХРАНИТЬ КОНТАКТ`.
- CONTACT=0 is a breakdown condition.
- Turn limit is 20.
- Product architecture contains `OBJECTIVE_COMPLETE`, but implementation has no CONTACT success rule.

Current game-design proposal:
- derive `RELATIONSHIP_CONTACT = min(A.contact, B.contact)`;
- objective completes at turn limit if neither Character broke down and relationship contact is `>=25`;
- `1..24` means contact technically exists but objective failed;
- `0` remains CONTACT breakdown.

The value 25 is proposed because the renderer already treats `CONTACT <=25` as a visibly closed/tense state. Needs approval/playtest tuning, not silent implementation.

### 2. Reaction → Event → next Trigger matrix

Current implementation still sends `CRITICISM` again every turn.

Current proposal introduces:

`REACTION → WORLD EVENT → RECEIVER TRIGGER`

Proposed first rows:
- EXPLAIN → COUNTERPOINT → PUSHBACK;
- AGREE → ACCEPTANCE → ACCEPTANCE;
- JOKE → DEFLECTION → DEFLECTION;
- SILENT → NO_RESPONSE → IGNORE;
- PRESSURE → PRESSURE → PRESSURE.

Only `AGREE → ACCEPTANCE` cancels pending REPEAT in v0.1 proposal.

Needs approval before runtime migration because it adds first-slice Trigger semantics and changes both actor graphs.

### 3. Exact REPEAT execution contract

Direction is approved; exact execution still needs approval with the matrix.

Proposal:
- `×N` means maximum total attempts including the first;
- runtime stores pending repeat after the first Reaction;
- the other Character takes a normal graph turn;
- ACCEPTANCE cancels pending repeat;
- otherwise the original Character repeats the stored Reaction on its next activation before normal Trigger traversal;
- incoming event is still recorded even when REPEAT takes precedence.

### 4. Closed condition (`BRAIN >`) fallback

Proposal uses two layers:

1. Authoring validation requires an unconditional fallback reaction route for any reachable conditional split.
2. Runtime safety for malformed/legacy content records `NO_ACTION / CONDITION_BLOCKED`, consumes the turn with no hidden metric effects and emits `NO_RESPONSE`; it does not secretly insert SILENT.

Needs approval because this is a visible game rule.

## P1 — objective/content decision

### 5. Which second objective is required for the vertical slice?

Current implementation only uses CONTACT.

Existing architecture mentions:
- SURVIVE / ВЫДЕРЖАТЬ 20 РАУНДОВ;
- BURNOUT / СЖЕЧЬ МОЗГ;
- CONTACT / СОХРАНИТЬ КОНТАКТ.

Do not implement a second objective until the common collision/event system is stable. New objective concepts may reuse the same metrics/runtime with different terminal/success rules; avoid adding a new combat system just to create variety.

## P2 — intentionally deferred unless exposed

These are model capabilities, not current UI promises:
- discoveries/history;
- negative/decreasing memory controls;
- broader reactions such as LEAVE / ASK / ARGUE;
- broader abilities such as ADMIT ERROR / CHANGE MIND / REFRAME;
- appearance color controls;
- user-created opponent B.

They should remain dormant until the first loop is semantically closed.

## Next decision order

1. Approve/modify Reaction → Event → Trigger matrix.
2. Approve REPEAT acceptance/execution details derived from that matrix.
3. Approve CONTACT relationship rule/threshold.
4. Approve conditional fallback rule.
5. Implement collision runtime + rebalance.
6. Only then choose/design second objective.
