# DEMENTOR LAB — PLAYTEST READINESS CONTRACT v0.1

Status: APPROVED for vertical slice stabilization.

## Purpose
The vertical slice is ready for a human playtest only when one uninterrupted mobile flow explains itself without developer commentary:

`PERSON → BRAIN → SETUP → TALK → RESULT → REPAIR`

## Screen jobs

### PERSON
Primary task: make the character recognizably yours.
- name
- body
- compact appearance categories
- random outfit / reset tools
- navigation to BRAIN through the persistent bottom nav
- no duplicate visible next-step CTA

### BRAIN
Primary task: author causality.
- first visit explains `ВХОДЫ → ЦЕПОЧКА → РЕЗУЛЬТАТ` once
- lines are causal truth
- drag changes presentation order only
- custom graph runs when its real opening route is valid
- technical validation does not compete with authoring

### SETUP
Primary task: understand the experiment before PLAY.
The player can identify in a few seconds:
1. situation
2. goal
3. loss condition
4. opponent

### TALK
Primary task: read the conversation.
- full transcript is scrollable
- reading pauses autoplay
- speaker identity stays legible
- technical causality is collapsed under `ПОЧЕМУ ТАК?`
- TRACE is not a competing primary action

### RESULT
Primary task: understand why the run ended and decide what to change.
- human diagnosis first
- behavior pattern in ordinary language
- one suspicious mechanism as a recommendation
- `ПОЧИНИТЬ МОЗГ` returns to the same opponent/scenario
- full BRAIN remains editable in repair mode

## Language rule
Player-facing default surfaces use human language. Engine notation (`W3`, raw node chains, exact deltas, trace IDs) is evidence available on demand, not required literacy.

## QA invariant
A passing mobile smoke must use the same visible controls a real player uses. Tests must not resurrect hidden legacy CTAs or bypass first-run/opt-in surfaces.

The first-run guide is rendered on the next animation frame, so browser QA waits for the visible guide rather than assuming synchronous overlay timing.

## Product invariant
**One screen, one primary question. Causality stays deep, but explanation does not compete with play.**
