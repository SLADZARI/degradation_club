# DEMENTOR LAB — Vertical Slice Implementation Status v0.3

**Branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Product contract:** `dementor-club/projects/dementor-lab/DEMENTOR_LAB_PRODUCT_FLOW_INTERACTION_SPEC_v0.3.md`  
**Character contract:** `dementor-club/projects/dementor-lab/DEMENTOR_LAB_CHARACTER_SYSTEM_V0.1.md`  
**Opponent contract:** `dementor-club/projects/dementor-lab/DEMENTOR_LAB_OPPONENT_SYSTEM_V0.1.md`

## Current state

The approved vertical slice is implemented and both production character bodies now use validated exact cleaned SVG assets.

Connected flow:

`PERSON → BRAIN → SETUP + RANDOMIZED OPPONENT → TALK → predictive HOT PATCH → same Encounter resume → RESULT → one-node replay → BEFORE / AFTER`

Implementation breadth remains frozen around this slice. The next gate is physical-device QA and FUN PASS, not additional systems or character expansion.

## Runtime implemented

- Character/state model including persistent `memory`.
- Executable BehaviorGraph + STATE/MEMORY (`resentment`, `trust`).
- Deterministic Scenario `КРИТИКА ИДЕИ`, objective `СОХРАНИТЬ КОНТАКТ`.
- Two real actor graphs collide in every Encounter; dialogue remains an output/rendering layer rather than graph cause.
- ExecutionTrace records visited nodes, impulse, reaction, metric deltas, memory changes and loops.
- ENERGY / BRAIN / TENSION / CONTACT updates.
- Predictive HOT PATCH intercepts dangerous traversal before turn state is committed.
- Patch preserves turn, metrics, memory and transcript and retries the same pending actor/turn.
- Trace-derived Result.
- Same-scenario one-node counterfactual replay.
- `VerticalSliceController` owns encounter orchestration; UI does not maintain a second semantics layer.

## Production character system

The production roster remains exactly two base characters:

- `character-01` — exact cleaned male base;
- `character-02` — exact cleaned female base.

Runtime assets remain limited to:

```text
assets/characters/character-01/character-01-layered.svg
assets/characters/character-02/character-02-layered.svg
```

Adding `character-03` requires an explicit product/registry decision.

### character-01 exact contract

- viewBox `0 0 703 1024`;
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

### character-02 exact contract

- viewBox `0 0 703 1024`;
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

The female asymmetry is authored source truth. Torso clothing is baked into the body geometry. The implementation must not fabricate female facial-hair or separable outfit variants for UI symmetry.

## Appearance contract

```text
baseCharacterId

sharedAppearance
  hatVariant
  glassesVariant
  facialHairVariant
  accessoryVariant

ownedAppearance
  outfitVariant
  shoesVariant

colors
  outfitPrimary
  outfitSecondary
  shoesPrimary
```

Rules:

- variant availability comes only from the validated production manifest/SVG pair;
- body/rig and owned appearance are character-specific;
- shared appearance survives body switching only when the exact variant is supported by the target character;
- unsupported selections resolve to `null`, never to an invented substitute;
- appearance never changes BehaviorGraph automatically;
- opponent appearance and BehaviorGraph are sampled independently and frozen for replay.

## Manifest / SVG gate

`character-registry.mjs` validates production manifest against production SVG before exposing variants.

The gate checks:

- character id;
- `viewBox`;
- declared base IDs;
- face-state IDs;
- every declared numbered appearance ID;
- every declared color-target ID.

Both current production pairs pass this gate and expose their exact authored variant catalogs.

## Renderer corrections discovered during exact-asset integration

Exact geometry exposed two bugs hidden by the earlier reconstructed assets:

1. paint IDs such as `outfit-primary` and `shoes-primary` were previously vulnerable to prefix-based variant matching. Variant discovery now accepts only numbered `prefix-NN` IDs.
2. exact assets may use wrapper groups such as `#shoes` or `#glasses` around numbered variants. The renderer now keeps such wrappers visible while switching their children instead of hiding the whole subtree.

Regression coverage includes female `shoes-01` and `glasses-01` inside authored wrappers.

## Opponent system

A fresh experiment generates a compact opponent baseline from one of the two approved visual characters and one authored BehaviorGraph preset.

Initial presets:

- `CONTACT_SKEPTIC` — «СНАЧАЛА РАЗБЕРУСЬ»;
- `RIGHT_BACK` — «НЕТ, ЭТО Я СЕЙЧАС ОБЪЯСНЮ»;
- `KEEP_PEACE` — «ЛИШЬ БЫ НЕ РУГАЛИСЬ».

Once PLAY begins, opponent body, exact appearance, preset and initial state are frozen. Counterfactual replay restores that same opponent baseline.

`VISUAL CHARACTER ≠ BEHAVIOR GRAPH` remains invariant.

## Automated QA

Verified on exact production assets:

- deterministic runtime suite: **PASS**;
- result/replay: **PASS**;
- character renderer: **PASS**;
- manifest/SVG registry gate: **PASS**;
- exact character asset contract: **PASS**;
- seeded opponent generation: **PASS**;
- UI contract: **PASS**;
- mobile readability checks: **PASS**;
- iPhone 13-sized Chromium browser flow: **PASS**;
- exact male/female variant switching: **PASS**;
- female wrapper regression (`shoes-01`, `glasses-01`): **PASS**;
- predictive HOT PATCH → RESULT → same-opponent replay: **PASS**;
- horizontal phone overflow smoke: **PASS**.

Verified CI run: `33605375379`.

## Remaining gate

Automated CI does **not** substitute for physical-device testing.

Before integration/release work:

1. physical iPhone Safari QA;
2. physical Android Chrome QA;
3. fix only reproducible device/browser defects;
4. Gate D FUN PASS with a fresh adult player;
5. then decide readiness for integration into `dementor-club-site`.

Asset expansion is frozen during this gate.

No Vercel deploy is implied or performed by this status update.
