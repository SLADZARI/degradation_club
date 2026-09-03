# DEMENTOR LAB — TALK STAGE DIRECTION CONTRACT v0.1

Status: APPROVED IMPLEMENTATION CONTRACT

## Purpose
The TALK arena must reveal the active direction of a turn before the player reads the explanatory panels below it.

## Source of truth
The arena direction is a read-only projection of the latest real `ExecutionTrace.actorId`.

For a completed turn:
- `speaker = trace.actorId`;
- `target = the other actor`;
- the arena exposes `data-speaker`, `data-target`, and `data-flow`;
- the center TURN marker exposes the visible flow label `A → B` or `B → A`.

No dialogue parsing, guessed emotion, or separate turn state may decide the direction.

## Visual hierarchy
- exactly one actor is `is-speaking`;
- exactly one actor is `is-target`;
- the speaker name receives the strongest acid emphasis;
- the listener remains visually present and receives a lighter target marker;
- the center marker makes the transfer direction explicit without adding another panel;
- existing face/body reactions remain driven by metric deltas.

## Mobile rule
Direction must remain readable inside the existing iPhone-sized arena with no page-level horizontal overflow.

## Invariant
`ExecutionTrace.actorId → speaker → listener → next brain direction`

This is stage direction only. It does not alter encounter order or gameplay state.
