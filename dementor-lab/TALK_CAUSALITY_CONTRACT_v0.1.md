# DEMENTOR LAB — TALK CAUSALITY CONTRACT v0.1

Status: IMPLEMENTED / QA

## Goal
The player must understand why the other character reacts next without opening technical TRACE.

## Visible chain
After a committed turn TALK exposes exactly one compact causal chain:

`ДЕЙСТВИЕ → ЧТО ПРОИЗОШЛО → СЛЕДУЮЩИЙ МОЗГ`

The three values are projections of the latest real `ExecutionTrace`:
- `ДЕЙСТВИЕ` ← `trace.selectedReaction`;
- `ЧТО ПРОИЗОШЛО` ← `trace.event.type`;
- `СЛЕДУЮЩИЙ МОЗГ` ← `trace.event.trigger`.

No TALK-only state, inference from dialogue text, or hidden remapping may decide causality.

## Human labels
Current projection:
- EXPLAIN → `ОБЪЯСНИЛ` → COUNTERPOINT / `КОНТРАРГУМЕНТ` → PUSHBACK / `ВОЗРАЖЕНИЕ`;
- AGREE → `СОГЛАСИЛСЯ` → ACCEPTANCE / `ПРИНЯТО` → ACCEPTANCE / `ПРИНЯТО`;
- JOKE → `ПОШУТИЛ` → DEFLECTION / `УШЛИ В СТОРОНУ` → DEFLECTION / `УШЛИ В СТОРОНУ`;
- SILENT → `ПРОМОЛЧАЛ` → NO_RESPONSE / `НЕТ ОТВЕТА` → IGNORE / `ИГНОР`;
- PRESSURE → `НАЧАЛ ДАВИТЬ` → PRESSURE / `ДАВЛЕНИЕ` → UNDERPRESSURE / `ДАВЛЕНИЕ`.

## Visual hierarchy
- Dialogue remains primary.
- Causality sits directly below dialogue and before transient metric delta.
- The next Trigger is the strongest visual element because it is the input to the other BehaviorGraph.
- The chain must not look like a debugger or a second TRACE panel.
- On phone all three steps remain visible without horizontal scrolling.

## Empty state
Before the first committed turn the surface only says that the consequence will appear after a reply. It does not invent a cause from scenario setup.

## QA gate
Browser smoke must execute a real turn and verify:
1. the causal surface contains three steps;
2. the `СЛЕДУЮЩИЙ МОЗГ` step is visible;
3. existing HOT PATCH / RESULT flow still completes;
4. page-level horizontal overflow remains absent.

## Principle
`Graph is cause. Dialogue is output. TALK makes the bridge visible.`
