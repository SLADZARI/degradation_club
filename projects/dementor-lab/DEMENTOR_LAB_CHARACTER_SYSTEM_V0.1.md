# DEMENTOR LAB — CHARACTER SYSTEM v0.1

**STATUS:** APPROVED FOR VERTICAL-SLICE IMPLEMENTATION  
**DATE:** 2026-09-01  
**OWNER:** Dementor Club  
**SOURCE-OF-TRUTH BRANCH:** `dementor-club`  
**IMPLEMENTS WITH:** `DEMENTOR_LAB_PRODUCT_FLOW_INTERACTION_SPEC_v0.3.md` + `DEMENTOR_LAB_GAME_ARCHITECTURE_V0.1.md`

---

## 1. ROLE

This record fixes the base visual-character system for the DEMENTOR LAB vertical slice.

It does not change the core invariant:

> **VISUAL CHARACTER ≠ BEHAVIOR GRAPH**

Body type, clothing and accessories never define personality, impulses or behavior automatically.

---

## 2. BASE ROSTER

The first production character system has exactly **two base characters**:

1. `character-01` — first base body/rig;
2. `character-02` — second base body/rig, female visual archetype.

These two characters are the canonical base bodies for the current vertical slice.

Do not keep additional experimental character SVGs in the production character asset directory. New base bodies require a deliberate product decision and a registry change rather than accumulating prototype files.

---

## 3. OWNERSHIP MODEL

Each base character owns its own:

- body geometry;
- rig/pivots;
- head/base geometry where needed;
- `outfit`;
- `shoes`;
- body-proportion-dependent visual pieces.

The following appearance categories are shared across the roster as reusable categories:

- `hat` / headwear;
- `glasses`;
- `beard` / facial-hair category where applicable;
- `accessory`.

Shared means the category and selection state belong to the appearance system rather than to one body. The actual geometry may still require body/face anchoring when rendered on a different rig.

`outfit` and `shoes` are **not** shared assets between base bodies. Each character keeps its own compatible clothing and footwear.

---

## 4. CHARACTER DATA CONTRACT

```text
CharacterVisual
  baseCharacterId

  sharedAppearance
    hat
    glasses
    beard
    accessory

  ownedAppearance
    outfit
    shoes
```

Each character asset must provide semantic groups needed by the renderer:

```text
body
body-torso
body-arm-left
body-arm-right
body-leg-left
body-leg-right
head-rig
head-base

eyes-neutral
eyes-tense
eyes-sleepy
eyes-overheat
brows-neutral
brows-tense
brows-angry
mouth-neutral
mouth-soft
mouth-tense
mouth-open

hat
glasses
beard
accessory
outfit
shoes
```

Optional groups may be added without changing the six core behavior families.

---

## 5. RIG CONTRACT

Each base SVG owns its pivot metadata. Renderer code must not assume one universal male-body pivot map.

Required pivot concepts:

- head;
- left shoulder;
- right shoulder;
- left hip;
- right hip.

The CharacterRenderer reads the active character's rig metadata and maps ENERGY / BRAIN / TENSION / CONTACT feedback onto that character's own skeleton.

This keeps animation state shared while geometry remains character-specific.

---

## 6. PERSON WORKSPACE RULE

PERSON first chooses a base body, then visual appearance.

Switching `character-01 ↔ character-02`:

- keeps shared appearance-category state where compatible;
- restores the selected base character's own outfit state;
- restores the selected base character's own shoes state;
- does not modify BehaviorGraph;
- does not modify live behavior parameters.

The two characters are visual starting structures, not personality presets.

---

## 7. TALK RULE

Any actor in TALK may use either base visual character independently of its BehaviorGraph.

Two actors may therefore:

- use different bodies with similar behavior graphs;
- use the same body with different behavior graphs;
- use different appearance with identical graph logic.

This is intentional and reinforces the distinction between visible identity and behavior system.

---

## 8. PRODUCTION ASSET RULE

Current production character SVG set:

```text
character-01/character-01-layered.svg
character-02/character-02-layered.svg
```

Only these two base-character SVGs belong in the vertical-slice character asset registry.

Reference drawings, pivot guides, exports, reconstruction drafts and prior character prototypes belong outside the production runtime asset set and must not be loaded by the game.

---

## 9. IMPLEMENTATION CONSEQUENCE

The site implementation must use a character registry rather than hardcoded single-character asset paths.

Registry responsibilities:

- enumerate the two approved base characters;
- resolve SVG path;
- expose rig metadata;
- distinguish shared appearance categories from character-owned outfit/shoes;
- prevent orphan prototype assets from silently entering the runtime.

This document is the approved source-of-truth for the base roster until a later character-system decision supersedes it.
