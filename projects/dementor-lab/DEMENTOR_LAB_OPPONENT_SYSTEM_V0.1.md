# DEMENTOR LAB — OPPONENT SYSTEM v0.1

**STATUS:** APPROVED FOR VERTICAL-SLICE IMPLEMENTATION  
**DATE:** 2026-09-01  
**OWNER:** Dementor Club  
**SOURCE-OF-TRUTH BRANCH:** `dementor-club`  
**IMPLEMENTS WITH:** `DEMENTOR_LAB_PRODUCT_FLOW_INTERACTION_SPEC_v0.3.md` + `DEMENTOR_LAB_GAME_ARCHITECTURE_V0.1.md` + `DEMENTOR_LAB_CHARACTER_SYSTEM_V0.1.md`

---

## 1. ROLE

The opponent in DEMENTOR LAB is a real Character with the same BehaviorGraph architecture as the player.

For the vertical slice the opponent is not permanently identical between fresh experiments. A fresh experiment may assemble the opponent from:

- one of the two approved base visual characters;
- randomized compatible visual appearance;
- one of several authored BehaviorGraph presets.

This does not change the central invariant:

> **Two real graphs collide.**

And it does not couple appearance to personality:

> **VISUAL CHARACTER ≠ BEHAVIOR GRAPH**

The body/appearance draw and the brain-preset draw are independent.

---

## 2. RANDOMIZATION BOUNDARY

Randomization is allowed only at the start of a fresh experiment.

Once an Encounter baseline is created, the selected opponent is frozen for that experiment and its counterfactual replay.

`RESULT → one change → same encounter baseline → BEFORE / AFTER` must therefore keep the same:

- opponent base character;
- opponent appearance;
- opponent BehaviorGraph preset;
- scenario;
- objective;
- initial opponent state.

A replay must never silently reroll the opponent.

QA may provide an explicit seed so a randomized opponent can be reproduced deterministically.

---

## 3. VISUAL OPPONENT CONTRACT

Opponent visual selection uses only the two approved base bodies:

- `character-01`;
- `character-02`.

Randomized appearance may select compatible values from the existing appearance system:

```text
sharedAppearance
  hat
  glasses
  beard
  accessory

ownedAppearance
  outfit
  shoes
```

The current vertical slice may use simple on/off choices until multiple asset variants exist inside a category.

No third base-body SVG is introduced by opponent randomization.

---

## 4. BRAIN PRESET CONTRACT

The opponent brain is selected from a small authored preset library. Presets are real BehaviorGraphs, not dialogue scripts or personality labels.

Initial vertical-slice preset set:

### `CONTACT_SKEPTIC`

Working label: **«СНАЧАЛА РАЗБЕРУСЬ»**

Causal tendency:

```text
CRITICISM
→ TRUST
→ UNDERSTAND
→ PAUSE
→ EXPLAIN
```

### `RIGHT_BACK`

Working label: **«НЕТ, ЭТО Я СЕЙЧАС ОБЪЯСНЮ»**

Causal tendency:

```text
CRITICISM
→ RESENTMENT
→ BE RIGHT
→ EXPLAIN
→ REPEAT
```

### `KEEP_PEACE`

Working label: **«ЛИШЬ БЫ НЕ РУГАЛИСЬ»**

Causal tendency:

```text
CRITICISM
→ TRUST
→ BE LIKED
→ PAUSE
→ AGREE
```

These labels are presentation copy. The graph remains the cause.

Do not create opponent presets by hardcoding dialogue sequences.

---

## 5. SETUP PRESENTATION

Before PLAY the player should be able to understand who the current opponent is without seeing a developer/debug panel.

SETUP may show a compact opponent card with:

- opponent name;
- visual preview;
- brain-preset working label;
- one short description of the behavioral tendency;
- optional **«ДРУГОГО →»** action that rerolls the opponent before the Encounter begins.

The card describes the experiment setup; it must not reveal a hidden score or claim a psychological diagnosis.

---

## 6. ENCOUNTER / RESULT RULE

Opponent selection becomes part of the Encounter baseline.

ExecutionTrace and Result remain derived from actual runtime behavior. The Result must not substitute the preset label for causal trace.

If the preset behaves differently because metrics/memory change during the Encounter, the runtime outcome wins over the preset description.

---

## 7. IMPLEMENTATION CONSEQUENCE

Implementation should introduce a separate opponent-selection layer with responsibilities equivalent to:

```text
opponent/presets
opponent/generator
```

The generator may own seeded random selection of:

- baseCharacterId;
- appearance flags;
- presetId.

Scenario/Encounter receives the generated Character; UI does not rebuild or reinterpret the opponent graph.

This is an extension of the approved vertical slice, not permission to add scenario packs, accounts, persistence, LLM dialogue or additional base character bodies.
