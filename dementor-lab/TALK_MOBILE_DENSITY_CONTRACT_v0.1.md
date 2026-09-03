# TALK MOBILE DENSITY CONTRACT v0.1

Status: APPROVED IMPLEMENTATION CONTRACT

## Goal

On an iPhone-sized viewport a single turn should read as one scene, not as a vertical stack of unrelated dashboards.

## Priority

1. Characters and active direction.
2. Latest dialogue.
3. Cause: action → event → next brain.
4. Human consequence.
5. Exact numeric evidence.

No layer may create new gameplay state.

## Mobile projection

At `<=430px`:
- arena height is reduced while keeping both characters readable;
- four metrics are arranged as a compact 2×2 field instead of four tall rows;
- dialogue keeps the latest two bubbles visible; older transcript entries remain in DOM and encounter history;
- causality stays fully visible without horizontal scrolling;
- human metric feedback stays above exact numeric deltas;
- action buttons remain touch-sized;
- no page-level horizontal overflow is allowed.

At `<=360px` the arena and metric geometry compress one additional step without removing causality.

## Invariant

`Density is presentation only.`

Transcript, metrics, trace, turn order, graph state, HOT PATCH, RESULT and replay semantics remain unchanged.
