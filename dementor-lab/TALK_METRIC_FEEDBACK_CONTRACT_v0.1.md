# DEMENTOR LAB — TALK METRIC FEEDBACK CONTRACT v0.1

Status: APPROVED IMPLEMENTATION CONTRACT

## Purpose
TALK must explain the consequence of the latest real turn without turning the conversation into a debug screen.

## Source of truth
Metric feedback is a read-only projection of the latest `ExecutionTrace`.

It reads:
- `trace.metricDeltas.self`
- `trace.metricDeltas.target`
- `trace.memoryChanges`

It must never infer state from dialogue text and must never mutate encounter state.

## Information hierarchy
1. Human consequence first.
2. Exact numeric deltas second.
3. Memory changes as a compact explicit line when present.

Example:
`ПЕРЕГРЕЛСЯ · СОБЕСЕДНИК НАПРЯГСЯ · КОНТАКТ ПРОСЕЛ`

Then:
`ГОВОРЯЩИЙ: BRAIN +8 · TENSION +5 / СОБЕСЕДНИК: TENSION +4 · CONTACT -5`

## Human projection rules
- ENERGY down → `ПОТРАТИЛ СИЛЫ`
- ENERGY up → `СИЛЫ ВЕРНУЛИСЬ`
- BRAIN up → `ПЕРЕГРЕЛСЯ`
- BRAIN down → `ОСТЫЛ`
- TENSION up → `НАПРЯГСЯ`
- TENSION down → `ВЫДОХНУЛ`
- CONTACT up on speaker → `СТАЛ БЛИЖЕ`
- CONTACT down on speaker → `ОТДАЛИЛСЯ`
- CONTACT up on target → `КОНТАКТ УКРЕПИЛСЯ`
- CONTACT down on target → `КОНТАКТ ПРОСЕЛ`

Target-only physiological phrases explicitly say `СОБЕСЕДНИК ...`.

## Persistence
The feedback remains visible until the next executed turn replaces it. It is not a short-lived toast.

## Memory
When a STATE node changes memory, show the real before/after value, for example:
`ПАМЯТЬ: ОБИДА 0→1`

## UX principle
`Meaning first, evidence second.`

The player should understand what changed at a glance and still be able to inspect the exact numbers without opening TRACE.
