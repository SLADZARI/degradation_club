# DEMENTOR LAB — GAME FEEL ARC AUDIT v0.1

Status: IMPLEMENTED / REGRESSION-GATED

## Purpose

This audit evaluates a full 10–20 turn encounter as a dramatic system rather than judging isolated node deltas.

The matrix covered all six player BRAIN presets against all three opponent behavior presets. Runs were compared before and after the first arc corrections, with HOT PATCH inspected separately.

## Core rule

**A branch earns its place only if the same graph can actually choose it under a reachable game state.**

A visually present alternative that can never win route selection is decorative, not gameplay.

**HOT PATCH must change the causal trajectory, not merely change a number printed on the node.**

## Findings before the arc pass

1. Several authored branches were mathematically unreachable in normal play. `ЛИШЬ БЫ НЕ РУГАЛИСЬ` always selected AGREE and never SILENT. `ПОСМОТРИМ, ЧТО БУДЕТ` always selected JOKE and never PRESSURE.
2. PAUSE at ENERGY −4 was too expensive as a repeated behavioral modifier. Calm opponents could reach ENERGY breakdown while CONTACT was excellent.
3. Reducing REPEAT by only one step was not a meaningful emergency intervention. Fewer forced repeats could cause more fresh STATE/IMPULSE traversals, so the apparent repair often did not repair the trajectory.
4. Static reaction effects alone were insufficient to produce a visible conversation arc. The graph needed reachable state-dependent route pressure.

## Implemented corrections

### Contextual reaction pressure

Route scoring now includes current-state pressure in addition to authored impulse/memory scoring.

- rising BRAIN/TENSION can make PRESSURE overtake a playful branch;
- low ENERGY can make SILENT overtake continued appeasement;
- low CONTACT / high TENSION increases the value of AGREE;
- high TENSION increases the value of JOKE.

This does not add randomness. The same graph + state still resolves deterministically.

### PAUSE economy

PAUSE changed from ENERGY −4 to ENERGY −2 while retaining its BRAIN/TENSION regulation and CONTACT support. It remains a resource trade, but no longer creates calm ENERGY deaths by arithmetic alone.

### REPEAT friction

A forced repeat now has its own loop friction in addition to the repeated reaction:

- speaker: ENERGY −1, BRAIN +4, TENSION +4;
- listener: CONTACT −2.

Repeating oneself is therefore a distinct escalating behavior rather than a free copy of a previous reaction.

### Decisive loop-break HOT PATCH

The emergency REPEAT patch now changes `×N → ×1` and clears an active pending repeat. It preserves the original reaction while stopping additional forced repetition.

## Observed arcs after correction

The matrix now contains state-driven pivots inside one authored BRAIN:

- `ЛИШЬ БЫ НЕ РУГАЛИСЬ` begins with AGREE and can move into SILENT as ENERGY falls.
- `ПОСМОТРИМ, ЧТО БУДЕТ` begins with JOKE and can move into PRESSURE after BRAIN accumulates.
- peaceful CONTACT-oriented pairings can reach OBJECTIVE_COMPLETE without PAUSE-induced ENERGY breakdown.
- aggressive late PRESSURE can still create a legitimate opponent ENERGY breakdown; this comes from the chosen strategy, not passive PAUSE cost.
- repeat-heavy personalities can still break down after a loop-break patch when the deeper `BE RIGHT → EXPLAIN` personality remains destructive. HOT PATCH is a causal intervention, not a guaranteed win button.

## Permanent regression gates

`tests/game-feel-arc-selftest.mjs` protects the following whole-conversation properties:

1. a peaceful player against CONTACT_SKEPTIC can survive the full conversation and preserve CONTACT;
2. repeated PAUSE does not mechanically exhaust that calm opponent;
3. `ПОСМОТРИМ, ЧТО БУДЕТ` can pivot JOKE → PRESSURE under reachable accumulated BRAIN;
4. `ЛИШЬ БЫ НЕ РУГАЛИСЬ` can pivot AGREE → SILENT under reachable resource depletion.

Decisive REPEAT HOT PATCH behavior is additionally protected by the runtime selftest.

## Design consequence

DEMENTOR LAB should not optimize for every character to survive. It should optimize for **legible causality and meaningful trajectory**:

`authored pattern → accumulated state/history → behavioral pivot or fixation → consequence → possible intervention`

A good failure is acceptable when the player can understand why it happened and can imagine a materially different graph that would have changed it.

## Next audit target

RESULT should expose this arc, not only the final suspicious node. The player should be able to read a compact story such as:

`ШУТИЛ → BRAIN НАКОПИЛСЯ → НАЧАЛ ДАВИТЬ → CONTACT ПРОСЕЛ`

That projection must be derived from actual traces and detected pivots, never authored as a separate narrative truth.
