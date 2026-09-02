# DEMENTOR LAB — CHARACTER VARIANT INTEGRATION STATUS v0.1

**DATE:** 2026-09-02  
**BRANCH:** `agent/dementor-lab-vertical-slice-v0.3`  
**PRODUCT SOURCE:** `dementor-club/projects/dementor-lab/DEMENTOR_LAB_CHARACTER_SYSTEM_V0.1.md`

## STATUS

Exact cleaned geometry for **both** approved production characters is now promoted and active.

Production roster remains exactly:

- `character-01` — exact cleaned male base;
- `character-02` — exact cleaned female base.

The runtime no longer depends on reconstructed character geometry for either production body. Both SVGs are paired with validated `cleaned-svg-v1` manifests and are enabled through the manifest/SVG gate.

## VERIFIED EXACT ASSETS

### character-01

Validated production contract:

- viewBox: `0 0 703 1024`;
- hats: 7;
- glasses: 4;
- facial hair: 4;
- accessories: 3;
- outfits: 3;
- shoes: 1;
- exact rig pivots:
  - head `[352,270]`;
  - shoulderLeft `[275,345]`;
  - shoulderRight `[425,345]`;
  - hipLeft `[311,590]`;
  - hipRight `[393,591]`.

### character-02

Validated production contract:

- viewBox: `0 0 703 1024`;
- 58 unique authored semantic DOM ids;
- hats: 7;
- glasses: 4;
- facial hair: 0;
- accessories: 3;
- outfits: 0;
- shoes: 1;
- color targets: `shoes-primary` only;
- exact rig pivots:
  - head `[352,270]`;
  - shoulderLeft `[287,345]`;
  - shoulderRight `[412,345]`;
  - hipLeft `[310,540]`;
  - hipRight `[392,541]`.

The female asymmetry is **source truth**, not a missing implementation task. Torso clothing is baked into source body geometry; no facial-hair or separable outfit variants are to be invented for UI symmetry.

## NORMALIZATION RULE

Both promoted assets preserve authored geometry. Normalization is semantic/runtime-only:

- exact path geometry is not redrawn;
- verified rig metadata is exposed on the SVG root;
- semantic IDs are preserved;
- color targets and variant groups are treated independently;
- optional appearance remains manifest-driven rather than inferred from visual stereotypes.

## RUNTIME FIXES DISCOVERED BY EXACT-ASSET QA

Exact assets exposed two renderer bugs that were hidden by the reconstructed SVGs:

1. `outfit-primary` / `shoes-primary` and similar paint IDs could be mistaken for numbered variants by prefix matching. Variant discovery now accepts only exact `prefix-NN` IDs.
2. Exact SVGs may use legacy-named wrapper groups such as `#shoes` around numbered variants such as `#shoes-01`. The renderer now preserves such wrapper groups instead of hiding the entire exact variant subtree.

Both behaviors are covered by automated tests.

## QA RESULT

Automated QA after both exact promotions:

- deterministic runtime suite: **PASS**;
- manifest/SVG registry gate: **PASS**;
- exact character asset checks: **PASS**;
- renderer exact-variant checks: **PASS**;
- opponent/replay/UI/mobile-readability checks: **PASS**;
- iPhone-sized Chromium end-to-end browser smoke: **PASS**.

Browser smoke verifies exact numbered variant selection, compatible shared appearance across body switch, intentional female asymmetry, TALK persistence, predictive HOT PATCH, RESULT and same-opponent counterfactual replay.

## NEXT GATE

Asset expansion is frozen. Do not add `character-03` or fabricate missing female variants.

Next work:

1. physical iPhone Safari QA;
2. physical Android Chrome QA;
3. fix only reproducible device/browser defects;
4. Gate D FUN PASS with a new adult player;
5. then decide whether the vertical slice is ready for integration/release work.

Physical-device QA is **not** considered passed by CI.

No Vercel deploy is part of this change.
