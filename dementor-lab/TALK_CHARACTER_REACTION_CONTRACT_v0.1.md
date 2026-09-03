# TALK CHARACTER REACTION CONTRACT v0.1

Status: APPROVED IMPLEMENTATION CONTRACT

## Principle

The character body is feedback, not decoration.

TALK may visually project a turn consequence onto both characters, but the projection MUST derive from the same real `ExecutionTrace.metricDeltas` that drives metric feedback. It MUST NOT infer gameplay state from dialogue text and MUST NOT mutate encounter state.

## Projection

For each completed turn:
- the speaker receives a cue derived from `metricDeltas.self`;
- the listener receives a cue derived from `metricDeltas.target`;
- the cue can affect authored face variants, head orientation, gesture sharpness, amplitude, and a small arena-level motion class;
- persistent baseline expression still derives from the character's current metrics.

Supported immediate cue families:
- BRAIN increase → overheat;
- TENSION increase → tension;
- CONTACT decrease → withdrawal;
- CONTACT increase → approach/contact;
- TENSION decrease → relief;
- ENERGY decrease → fatigue.

The strongest real delta selects the immediate cue. This is visual hierarchy only; it does not change gameplay causality.

## UX rules

- Reactions must remain readable on an iPhone-sized arena.
- Motion is small; characters do not jump around the layout.
- Reduced-motion preference disables impact animations.
- The listener is visually distinguishable as the target of the last action.
- Both character roots expose `data-reaction-cue` for QA and debugging.
- Breakdown rendering remains authoritative for terminal states.

## Invariant

`ExecutionTrace → metrics + text feedback + character reaction`

All three are projections of one cause. None is a second source of truth.
