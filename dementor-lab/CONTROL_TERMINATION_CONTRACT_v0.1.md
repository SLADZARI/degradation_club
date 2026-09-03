# DEMENTOR LAB — CONTROL TERMINATION CONTRACT v0.1

Status: IMPLEMENTED / QA

## Principle

The editor must never show an outgoing causal route that runtime will ignore.

## STOP

`STOP` is a terminal control. When the path reaches it, the branch ends immediately.

Therefore:
- STOP cannot be used as a connection source;
- any persisted graph containing an outgoing edge from STOP is invalid;
- the UI may still route INTO STOP as an explicit readable ending.

## REPEAT

`REPEAT ×N` schedules additional executions of the current Reaction across later turns and then ends the authored branch.

Therefore:
- REPEAT cannot be used as a connection source;
- any persisted graph containing an outgoing edge from REPEAT is invalid;
- the repeat count remains the maximum total executions including the first;
- explicit ACCEPTANCE can still cancel pending repeats.

## Validation

Graphs containing outgoing edges from STOP or REPEAT fail with `TERMINAL_CONTROL_OUTGOING` and a human explanation that the branch already ended.

## Invariant

`Visible edge = executable causality.`

No editor edge may survive if the runtime cannot ever traverse it.
