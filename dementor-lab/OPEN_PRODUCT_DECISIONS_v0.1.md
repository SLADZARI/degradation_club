# DEMENTOR LAB — Open Product Decisions v0.1

**Status:** OPEN / do not invent in implementation  
**Date:** 2026-09-02  
**Implementation branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Purpose:** isolate questions that cannot be safely resolved as engineering bugs. After approval, update the `dementor-club` source-of-truth first, then implementation.

## P0 — decisions blocking semantic closure

### 1. What is a CONTACT objective win?

Current facts:
- Scenario says `CONTACT / СОХРАНИТЬ КОНТАКТ`.
- CONTACT=0 is a breakdown condition.
- Turn limit is 20.
- Product architecture contains `OBJECTIVE_COMPLETE`, but implementation has no CONTACT success rule.

Decision needed:
- Does the player win simply by reaching turn 20 with CONTACT > 0?
- Is there a minimum success threshold, e.g. CONTACT >= N?
- Whose CONTACT matters: player A, opponent B, minimum of both, or a future shared relationship metric?

Do not tune CONTACT balance until this is defined.

### 2. How does one graph emit the next graph's Trigger?

Current facts:
- Both actors have real BehaviorGraphs.
- Architecture says each turn receives a Trigger from the scenario **or previous reaction**.
- Current implementation sends `CRITICISM` again every turn.

Decision needed:
- Define first-slice reaction/event → next-trigger mapping.
- Example questions, not decisions: can `PRESSURE` emit `CRITICISM` or `INTERRUPTION`; can `SILENT` emit `IGNORE`; does `AGREE` end/de-escalate the exchange?

Without this, two graphs take turns but do not yet fully collide causally.

### 3. What does REPEAT actually wait for?

Current facts:
- `count` changes metric cost and loop count.
- UI copy says the reaction repeats if the answer is not accepted.
- Runtime has no `accepted / rejected` event.

Decision needed:
- Keep REPEAT as unconditional repeat count and make copy literal; or
- add a deterministic acceptance signal and make REPEAT conditional.

### 4. What happens when all conditional paths are closed?

Example: the only reaction is behind `BRAIN > 70`, but current BRAIN is 30.

Current implementation correctly refuses the path, but then has no executable reaction.

Decision needed:
- lost turn / no action;
- implicit SILENT;
- implicit STOP;
- dedicated `NO_ACTION` outcome;
- or graph validation rule requiring an unconditional fallback path.

This must be a game rule, not an exception handler disguised as gameplay.

### 5. Whose brain may HOT PATCH edit?

Current breakpoint belongs to the causal chain that predicts failure. That chain can belong to A or B.

Decision needed:
- player may patch only own Character A;
- player may patch whichever actor caused the breakpoint;
- opponent breakpoints are visible but not editable;
- another explicit rule.

Do not silently let the player rewrite the opponent unless that is intended gameplay.

## P1 — source-of-truth conflicts / scope decisions

### 6. BRAIN interaction contract: free canvas or vertical stack?

Approved v0.3 still specifies free canvas, pan, pinch zoom and ports.
Current implementation and physical-phone design work have moved to a vertical stack with drag/reorder plus bracket-like extra connections.

Decision needed:
- confirm vertical stack as the new production contract and supersede free-canvas interaction in `dementor-club`; or
- explicitly retain free canvas and treat stack as temporary prototype.

Implementation should not oscillate between the two.

### 7. SETUP: separate screen or overlay over TALK?

Approved v0.3 says Setup is a transient overlay/bottom sheet over TALK.
Current implementation uses a separate SETUP screen.

Decision needed:
- accept separate SETUP as new contract; or
- return to overlay after BRAIN.

### 8. Which second objective is required for the vertical slice?

Approved v0.3 requires at least two objective contracts and lists:
- SURVIVE / ВЫДЕРЖАТЬ 20 РАУНДОВ
- BURNOUT / СЖЕЧЬ МОЗГ
- CONTACT / СОХРАНИТЬ КОНТАКТ

Current implementation only uses CONTACT.

Decision needed: choose the second first-slice objective. Prefer the one that best tests the same runtime without adding a new influence system.

### 9. How deep should deterministic dialogue react to state in this slice?

Architecture says phrase rendering can use reaction, impulse, scenario, BRAIN, TENSION, CONTACT, memory and recent transcript.
Current phrase bank effectively uses reaction + turn.

Decision needed:
- minimum slice: contextual variants only at meaningful thresholds;
- or richer deterministic phrase rules now.

Graph causality must remain independent of dialogue text.

## P2 — intentionally deferred unless exposed

These are model capabilities, not current UI promises:
- discoveries/history;
- negative/decreasing memory controls;
- broader triggers such as QUESTION / INTERRUPTION;
- broader reactions such as LEAVE / ASK / ARGUE;
- broader abilities such as ADMIT ERROR / CHANGE MIND / REFRAME;
- appearance color controls.

They should remain dormant until the first loop is semantically closed.

## Suggested decision order

1. Confirm **vertical stack BRAIN** or restore free canvas.
2. Define **CONTACT success**.
3. Define **reaction → next Trigger**.
4. Define **REPEAT acceptance semantics**.
5. Define **closed-condition fallback**.
6. Define **HOT PATCH ownership**.
7. Choose **second objective**.
8. Resolve **SETUP screen vs overlay**.
9. Choose dialogue-context depth.

Once 1–6 are decided, runtime balance can be meaningfully tuned instead of adjusted against an incomplete game contract.
