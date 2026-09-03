# RELATIONSHIP MEMORY CONTRACT v0.1

Status: APPROVED IMPLEMENTATION CONTRACT

## Principle

Memory must change future behavior, not merely annotate the current turn.

`ОБИДА` and `ДОВЕРИЕ` are opposing relationship memories. They are not two unrelated counters that can both grow to maximum without consequence.

## Dynamics

- Traversing `ОБИДА` increases resentment memory and erodes existing trust by the same positive memory increment.
- Traversing `ДОВЕРИЕ` increases trust memory and erodes existing resentment by the same positive memory increment.
- Memory remains clamped by each node's configured cap and never falls below zero.
- A memory change is recorded in the real `ExecutionTrace.memoryChanges`, including any opposing-memory change.

## Future route bias

When a STATE is part of a candidate route, its route preference is based on the relationship balance:

- resentment route bias = `resentment - trust`;
- trust route bias = `trust - resentment`.

The balance changes route score only. It does not secretly force a reaction and does not bypass the authored graph.

Therefore the same Trigger and graph can choose a different authored route later because the relationship history changed.

## TALK feedback

If one memory rises while its opposing memory falls, TALK must show both changes, for example:

`ПАМЯТЬ: ДОВЕРИЕ 1→2 · ОБИДА 3→2`

The player should be able to see why future behavior may now differ.

## Invariant

`past traversed STATE → relationship memory balance → future authored route preference`

Memory changes probability/preference inside the graph. It never becomes a second hidden decision system.
