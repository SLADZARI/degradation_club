# DEMENTOR LAB — CHARACTER SYSTEM v0.1

**STATUS:** APPROVED FOR VERTICAL-SLICE IMPLEMENTATION  
**DATE:** 2026-09-01  
**VARIANT EXTENSION APPROVED:** 2026-09-02  
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
- `outfit` variants;
- `shoes` variants;
- body-proportion-dependent visual pieces.

The following appearance categories are shared across the roster as reusable categories:

- `hat` / headwear;
- `glasses`;
- `facialHair` / beard or moustache category where applicable;
- `accessory`.

Shared means the category and selection state belong to the appearance system rather than to one body. The actual geometry may still require body/face anchoring when rendered on a different rig.

`outfit` and `shoes` are **not** shared assets between base bodies. Each character keeps its own compatible clothing and footwear.

A shared category may legitimately have no compatible variants for a particular base body. The UI must treat that as unavailable rather than inventing geometry.

---

## 4. CHARACTER DATA CONTRACT

The vertical slice now uses variant selection rather than only boolean show/hide state:

```text
CharacterVisual
  baseCharacterId

  sharedAppearance
    hatVariant
    glassesVariant
    accessoryVariant
    facialHairVariant

  ownedAppearance
    outfitVariant
    shoesVariant

  colors
    outfitPrimary
    outfitSecondary
    shoesPrimary
```

A variant value is either `null` or the exact semantic SVG group id declared by that character's manifest, for example:

```text
hat-01
hat-02

glasses-01
glasses-02

accessory-01
accessory-02

facial-hair-01
facial-hair-02

outfit-01
outfit-02

shoes-01
shoes-02
```

Do not synthesize a missing variant to satisfy a symmetrical UI. **The manifest and actual SVG geometry define availability.** If an SVG has one shoe variant, the character has one shoe variant. If a body has no separable outfit variant, the UI must not pretend that it does.

Legacy single groups (`hat`, `glasses`, `beard`, `accessory`, `outfit`, `shoes`) may remain temporarily readable during migration, but they are compatibility fallback rather than the target authoring contract.

Each production character asset should provide these semantic base/face groups where the source geometry supports them:

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
```

Appearance variant groups use the numbered IDs above. Recolorable source geometry may additionally expose explicit targets such as:

```text
outfit-primary
outfit-secondary
shirt-primary
jacket-primary
shorts-primary
shoes-primary
shoes-secondary
```

Only manifest-declared color targets may be changed by the renderer.

---

## 5. MANIFEST CONTRACT

Each base character owns a sidecar `manifest.json` next to its runtime SVG.

The manifest is descriptive truth about the supplied SVG, not a wish list. It records at minimum:

- character id;
- viewBox;
- base layer availability;
- face-state ids;
- real variant ids by category;
- real color-target ids;
- rig/pivot coordinates when they are not embedded in SVG metadata;
- `missingOrMerged` notes for source geometry that cannot safely be separated without redrawing.

The runtime registry may normalize manifest data, but it must not advertise a variant id that the active production SVG does not contain.

When cleaned user-supplied geometry replaces reconstructed geometry, preserve renderer-facing semantic ids where possible and update the manifest from the actual SVG.

---

## 6. RIG CONTRACT

Each base SVG owns its pivot metadata. Renderer code must not assume one universal male-body pivot map.

Required pivot concepts:

- head;
- left shoulder;
- right shoulder;
- left hip;
- right hip.

The CharacterRenderer reads the active character's rig metadata and maps ENERGY / BRAIN / TENSION / CONTACT feedback onto that character's own skeleton.

If pivot metadata is absent from SVG, the renderer may use coordinates supplied by that character's manifest/registry entry.

This keeps animation state shared while geometry remains character-specific.

---

## 7. PERSON WORKSPACE RULE

PERSON first chooses a base body, then visual appearance.

Switching `character-01 ↔ character-02`:

- keeps shared appearance-category selection only where the same selection is compatible with the target body's real manifest;
- otherwise resolves that category to `null` rather than substituting another item silently;
- restores the selected base character's own outfit selection;
- restores the selected base character's own shoes selection;
- restores compatible color selections only on manifest-declared color targets;
- does not modify BehaviorGraph;
- does not modify live behavior parameters.

The two characters are visual starting structures, not personality presets.

PERSON should expose variant choices compactly and mobile-first. Unavailable categories should be hidden or clearly disabled rather than occupying space with non-working controls.

---

## 8. TALK RULE

Any actor in TALK may use either base visual character independently of its BehaviorGraph.

Two actors may therefore:

- use different bodies with similar behavior graphs;
- use the same body with different behavior graphs;
- use different appearance with identical graph logic.

Opponent appearance and opponent BehaviorGraph preset are sampled independently. Once PLAY begins, the exact opponent visual state is frozen as part of the experiment and must survive counterfactual replay unchanged.

This is intentional and reinforces the distinction between visible identity and behavior system.

---

## 9. PRODUCTION ASSET RULE

Current production character SVG set remains exactly:

```text
character-01/character-01-layered.svg
character-02/character-02-layered.svg
```

Each directory may also contain its runtime `manifest.json` sidecar.

Only these two base-character SVGs belong in the vertical-slice character asset registry.

Reference drawings, pivot guides, exports, reconstruction drafts, candidate cleaned SVGs and prior character prototypes belong outside the production runtime asset set until they pass SVG/manifest/runtime QA and deliberately replace one of the two production geometries.

---

## 10. RENDERER BOUNDARY

`CharacterRenderer` is the single owner of SVG visual state.

It is responsible for:

- activating exactly one compatible variant per category;
- hiding inactive variants;
- applying only allowed color targets;
- rendering face state;
- applying rig-based visual motion.

BehaviorGraph, Encounter runtime and dialogue code never edit SVG/DOM directly.

Graph semantics remain independent from appearance state.

---

## 11. IMPLEMENTATION CONSEQUENCE

The site implementation must use a character registry rather than hardcoded single-character asset paths.

Registry responsibilities:

- enumerate the two approved base characters;
- resolve SVG and manifest path;
- expose rig metadata;
- expose real variants and color targets;
- distinguish shared appearance categories from character-owned outfit/shoes;
- validate/sanitize a selection when switching body;
- prevent orphan prototype assets from silently entering the runtime.

The immediate implementation task is to migrate PERSON and opponent appearance from boolean toggles to the variant-capable contract while preserving existing engine semantics, seeded opponent QA and same-opponent replay.

After the two real cleaned SVGs are integrated and asset/runtime tests pass, development returns to physical-device Gate A and FUN PASS rather than expanding the asset roster indefinitely.

This document is the approved source-of-truth for the base roster and variant appearance contract until a later character-system decision supersedes it.
