# DEMENTOR LAB — MVP Six-Way Playtest v0.8

Status: REQUIRED BEFORE MVP LABEL
Branch: `experiment/dementor-lab-integrated-v0.8`

## Purpose

Verify in the actual portrait UI that the three real BRAIN presets remain visibly different under both objectives, and that the player can explain the causal difference without reading technical trace internals.

## Matrix

Run all six combinations from a fresh page state:

| # | BRAIN preset | Objective |
|---|---|---|
| 1 | Я ВСЁ ОБЪЯСНЮ / EXPLAIN_LOOP | СОХРАНИТЬ КОНТАКТ |
| 2 | Я ВСЁ ОБЪЯСНЮ / EXPLAIN_LOOP | ДОБИТЬСЯ ОТВЕТА |
| 3 | ЛИШЬ БЫ НЕ РУГАЛИСЬ / KEEP_PEACE | СОХРАНИТЬ КОНТАКТ |
| 4 | ЛИШЬ БЫ НЕ РУГАЛИСЬ / KEEP_PEACE | ДОБИТЬСЯ ОТВЕТА |
| 5 | ОТВЕТЬ ПРЯМО / PRESS_FOR_ANSWER | СОХРАНИТЬ КОНТАКТ |
| 6 | ОТВЕТЬ ПРЯМО / PRESS_FOR_ANSWER | ДОБИТЬСЯ ОТВЕТА |

## What to record for every run

- final outcome;
- player BRAIN;
- relationship CONTACT;
- number and types of player reactions;
- dominant Intent;
- selected WorldEvents;
- whether HOT PATCH appeared;
- proposed one-cause patch;
- whether rerun changed only the intended cause;
- whether BEFORE/AFTER matches the two actual traces;
- whether Archive detail reproduces the same battle honestly.

## Visual / comprehension checks

For every combination, verify:

1. The selected BRAIN preset is still obvious when TALK starts.
2. The selected objective is understandable without technical vocabulary.
3. The two portraits make speaker/listener state obvious.
4. Facial change is visible before reading BRAIN/CONTACT values.
5. `ПОЧЕМУ ТАК?` can explain the last turn in one causal chain.
6. Passive BRAIN voice reads as interpretation, not as an extra action.
7. HOT PATCH identifies one concrete cause rather than opening the whole graph.
8. RESULT contains no number or claim that cannot be found in ExecutionTrace.
9. BEFORE/AFTER changes because of the mutation, not because of RNG.
10. Saved Archive detail matches what the tester remembers seeing.

## Fail conditions

MVP gate fails if any of these occur:

- two different BRAIN presets produce effectively the same player behavior trace;
- objective choice changes only a label and never the win/fail contract;
- a RESULT count differs from the dialogue/trace;
- HOT PATCH suggests a node unrelated to the observed failure;
- rerun changes unrelated initial state or scenario context;
- the player needs the technical trace to understand why the opponent reacted;
- portrait emotions contradict the runtime state;
- Archive cannot reconstruct the battle from stored data.

## Automated companion

Run:

```bash
npm run test:mvp-matrix
npm run test:mvp-smoke
npm run test:mvp
```

`test:mvp-matrix` checks that all six combinations terminate, preserve objective binding, emit Intent + WorldEvent data, and keep all three BRAIN presets behaviorally distinct for each objective.

The browser pass is still required because the automated test cannot validate emotional readability, copy clarity or whether the causal story feels understandable to a first-time player.
