# DEMENTOR LAB — BRAIN NODE MECHANICS AUDIT v0.1

Status: ACTIVE PRODUCT AUDIT

## Goal
Every visible node must create a distinct player decision. A node is weak if it only renames the same numerical effect. A node is strong when it changes route choice, event semantics, memory, timing, or risk in a way the player can learn and exploit.

## System alphabet
### TRIGGER
The six Trigger types are strong system inputs because they represent different events emitted by the other character. They are infrastructure, not disposable body nodes.

- CRITICISM → opening criticism event.
- PUSHBACK → created by EXPLAIN.
- ACCEPTANCE → created by AGREE and cancels an opponent pending REPEAT.
- DEFLECTION → created by JOKE.
- IGNORE → created by SILENT / NO_ACTION.
- UNDERPRESSURE → created by PRESSURE.

Verdict: KEEP. Their identity comes from event routing, not metric deltas.

## STATE
### ОБИДА
- Writes `resentment` memory.
- Traversal adds TENSION/BRAIN pressure and reduces target CONTACT.
- Existing resentment increases the score of future paths containing the same state.

### ДОВЕРИЕ
- Writes `trust` memory.
- Traversal supports CONTACT and reduces BRAIN.
- Existing trust increases the score of future paths containing the same state.

Verdict: KEEP. These are long-horizon route-bias mechanics, not just one-turn modifiers.

Clarity issue: `+N` changes how much memory is written, while the immediate semantic delta is not multiplied by N. UI must describe this as how strongly the state is remembered/accumulated, not generic damage/power.

## IMPULSE
### БЫТЬ ПРАВЫМ
- Adds route score by `weight * 6`.
- Adds a fixed BRAIN/TENSION cost and small CONTACT cost.

### НРАВИТЬСЯ
- Adds route score by `weight * 6`.
- Supports CONTACT and slightly reduces TENSION.

### ПОНЯТЬ
- Adds route score by `weight * 6`.
- Best CONTACT support of the three, but costs a little BRAIN.

Verdict: KEEP all three. The strategic identity is primarily **which route wins**, secondarily the fixed state effect.

Clarity issue: W1–W5 is not a multiplier on the metric delta. It is the strength of the internal pull / route preference. UI should say `НАСКОЛЬКО ТЯНЕТ`, not imply numerical damage strength.

## REACTION
### ОБЪЯСНИТЬ
- Expensive in ENERGY/BRAIN/TENSION.
- Damages target CONTACT.
- Emits COUNTERPOINT → PUSHBACK.

### СОГЛАСИТЬСЯ
- Restores CONTACT and lowers TENSION on both sides.
- Emits ACCEPTANCE.
- ACCEPTANCE cancels the other character's pending REPEAT.

### ПОШУТИТЬ
- Strong TENSION relief and CONTACT support.
- Emits DEFLECTION instead of ACCEPTANCE, so it does not cancel REPEAT.

### ПРОМОЛЧАТЬ
- Cheapest ENERGY reaction.
- Slightly increases self pressure and reduces target CONTACT.
- Emits NO_RESPONSE → IGNORE.

### ДАВИТЬ
- Highest immediate conflict/risk.
- Strong TENSION increase and CONTACT loss.
- Emits PRESSURE → UNDERPRESSURE.

Verdict: KEEP. Reactions are already distinct because their event output changes the other brain's next Trigger, not merely their metric deltas.

Balance watch: AGREE and JOKE are both very strong for CONTACT objective. Their event distinction must stay visible in TALK or the player will experience them as near-duplicates.

## CONTROL
### REPEAT ×N
- N means maximum total executions including the first reaction.
- A pending repeat waits through the other character's full turn.
- ACCEPTANCE cancels the pending repeat.
- Repeat executes the stored Reaction again; the original impulse modifier is not re-applied.

Verdict: STRONG / KEEP.

### BRAIN > N
- Conditional gate.
- Path is unavailable when condition fails.
- A real fallback route is required; runtime never injects a hidden reaction.

Verdict: STRONG / KEEP.

### STOP
- Explicitly terminates graph traversal.
- A path with no outgoing edge also terminates naturally.
- STOP has no metric/event effect of its own.

Verdict: KEEP AS AUTHORING CONTROL, not as a major gameplay action. Its value is explicit branch termination and protection of intent while editing/reordering. UI language should make this clear: `НА ЭТОМ ЗАКАНЧИВАЮ ВЕТКУ` / `ЗАВЕРШИТЬ ВЕТКУ`, not imply a new conversational action.

## ABILITY
### ПАУЗА
- Applies inside the selected path in the same turn.
- Reduces self BRAIN/TENSION, costs 1 ENERGY.
- Reduces target TENSION and supports target CONTACT.
- Gets extra path-selection value when TENSION >= 55.

Verdict: STRONG / KEEP.

Clarity issue: PAUSE is a modifier/ability inside a reaction path, not a standalone spoken Reaction. UI should preserve that distinction.

### ПЕРЕХВАТ
Semantics are not approved and it is unavailable in the vertical slice.

Verdict: KEEP HIDDEN.

## Immediate product corrections
1. Rename impulse parameter copy from technical/generic `СИЛА ИМПУЛЬСА` to human `НАСКОЛЬКО ТЯНЕТ` (engine field stays `weight`).
2. Clarify STATE parameter as memory accumulation, not generic power.
3. Present STOP as explicit branch ending, not a conversational Reaction.
4. Keep PAUSE visibly in ABILITY and describe it as an in-path modifier.
5. TALK must expose Reaction → Event → next Trigger well enough that AGREE/JOKE/EXPLAIN/SILENT/PRESSURE feel mechanically different.

## Implemented clarity pass
- Impulse control now says `НАСКОЛЬКО ТЯНЕТ`; `weight` remains the runtime field and route-selection mechanic.
- STATE control now says `КАК СИЛЬНО ЗАПОМНИТСЯ`; the stored memory delta remains the runtime mechanic.
- STOP readable projection says `НА ЭТОМ ЗАКАНЧИВАЮ`; no fake conversational effect was added.
- NODE_SPECS descriptions now explain agreement cancelling REPEAT, joke not counting as agreement, silence saving ENERGY, conditional fallback, and PAUSE acting inside a path.
- No balance numbers or runtime semantics were changed in this pass.

## Principle
`A node earns its place when changing it changes the strategy the player expects — not merely the number the engine computes.`
