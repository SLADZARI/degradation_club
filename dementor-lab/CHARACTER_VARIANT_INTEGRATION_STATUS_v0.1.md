# DEMENTOR LAB — CHARACTER VARIANT INTEGRATION STATUS v0.1

**DATE:** 2026-09-02  
**BRANCH:** `agent/dementor-lab-vertical-slice-v0.3`  
**PRODUCT SOURCE:** `dementor-club/projects/dementor-lab/DEMENTOR_LAB_CHARACTER_SYSTEM_V0.1.md`

## STATUS

Variant-capable runtime plumbing is integrated. Exact cleaned character geometry is **not yet promoted to production**.

This distinction is deliberate: the current production SVGs are still the previously reconstructed semantic assets, while newly supplied candidate manifests describe a richer cleaned-asset contract.

## COMPLETED

- product source-of-truth extended from boolean appearance state to variant appearance state;
- roster remains exactly `character-01` + `character-02`;
- `CharacterRegistry` now exposes the variant-capable data contract and rejects undeclared variants/color targets;
- `CharacterRenderer` supports numbered semantic groups such as `hat-01`, `glasses-01`, `facial-hair-01`, `outfit-01`, `shoes-01`;
- renderer keeps legacy single-layer SVG compatibility until the geometry swap;
- PERSON keeps shared vs body-owned appearance responsibilities separate;
- PERSON has a compact mobile variant rail which activates only when the production registry declares real variants;
- seeded opponent generation is variant-ready while keeping appearance independent from BehaviorGraph preset;
- replay snapshot preserves player appearance state and the exact frozen opponent profile;
- candidate manifests are staged outside the production runtime asset directory;
- migration selftest prevents candidate variants from being advertised before the production SVG contract is updated.

## CANDIDATE MANIFEST FACTS

### character-01

Candidate manifest declares:

- hats: 7;
- glasses: 4;
- facial hair: 4;
- accessories: 3;
- outfits: 3;
- shoes: 1;
- color targets: `shorts-primary`, `shirt-primary`, `outfit-primary`, `body-underwear`, `shoes-primary`.

It also records that `outfit-02` and `outfit-03` contain merged geometry that must not be split/recolored by invention.

### character-02

Candidate manifest declares:

- hats: 7;
- glasses: 4;
- facial hair: 0;
- accessories: 3;
- outfits: 0;
- shoes: 1;
- color targets: `shoes-primary` only.

The missing outfit variants are not an error to fill artificially: torso clothing is recorded as baked into source body geometry.

## CURRENT ASSET GATE

Do **not** copy the candidate manifests over production `manifest.json` yet.

Before promotion, both cleaned SVG files must be directly readable and checked against their manifests for:

- `viewBox`;
- groups and ids;
- transforms;
- masks / clips;
- opacity / display defaults;
- fills / strokes;
- face-state groups;
- numbered appearance groups;
- color-target ids;
- pivot metadata or manifest fallback coordinates.

Only after that comparison should production geometry + production manifests + registry variant catalogs be updated together.

## INPUT NOTE

The archive inspected in this integration pass contains four Dementor Club web-ready WEBP editorial/site assets (`about-service-03`, `event-fuengirola-03`, `logic-awareness-03`, `home-interruption-03`). They are not DEMENTOR LAB character geometry and were therefore not added to the LAB character registry.

Two pivot-reference SVG attachments were announced for this pass, but their byte paths were not readable in the execution sandbox. Their geometry/pivots therefore remain **unverified input**, not a basis for silently changing production rig coordinates.

## NEXT GATE

1. Read the exact cleaned male/female SVG XML when accessible.
2. Compare real ids/geometry with staged candidate manifests.
3. Promote only validated SVG + manifest pairs into the two production character directories.
4. Populate production registry variant catalogs from validated manifests.
5. Run asset/runtime/opponent/UI/browser QA.
6. Return to physical iPhone Safari + Android Chrome Gate A and FUN PASS.

No Vercel deploy is part of this change.
