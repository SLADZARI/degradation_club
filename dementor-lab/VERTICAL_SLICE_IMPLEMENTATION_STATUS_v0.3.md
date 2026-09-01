# DEMENTOR LAB — Vertical Slice Implementation Status v0.3

**Branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Product contract:** `dementor-club/projects/dementor-lab/DEMENTOR_LAB_PRODUCT_FLOW_INTERACTION_SPEC_v0.3.md`  
**Character contract:** `dementor-club/projects/dementor-lab/DEMENTOR_LAB_CHARACTER_SYSTEM_V0.1.md`  
**Opponent contract:** `dementor-club/projects/dementor-lab/DEMENTOR_LAB_OPPONENT_SYSTEM_V0.1.md`

## Implemented in modular runtime

- Character/state model including persistent `memory`.
- BehaviorGraph family compatibility + human validation.
- Executable STATE/MEMORY (`resentment`, `trust`).
- Deterministic authored Scenario `КРИТИКА ИДЕИ`.
- Two real actor graphs collide in every Encounter; opponent is never a scripted phrase sequence.
- Encounter state with turn, transcript, traces, patches and result.
- Deterministic graph path selection.
- ExecutionTrace with visited nodes, impulse, reaction, metric deltas, memory changes and loops.
- ENERGY/BRAIN/TENSION/CONTACT updates.
- Predictive HOT PATCH interception before dangerous traversal is committed.
- HOT PATCH reduce-repeat / reduce-impulse / insert-pause / rewire operations.
- Patch preserves turn, metrics, memory and transcript.
- Terminal checks follow approved contract: BRAIN, ENERGY, CONTACT when objective-terminal, plus turn limit/scenario rules. TENSION remains a live pressure metric, not a universal terminal by itself.
- Phrase-bank dialogue remains a rendering layer rather than graph cause.
- Trace-derived three-stage Result data.
- Same-scenario replay comparison helper.
- VerticalSliceController separates UI orchestration from engine semantics.
- CharacterRenderer remains a separate visual boundary.

## Base character system

The vertical slice has a fixed production roster of exactly two base visual characters:

- `character-01` — base character 01;
- `character-02` — base character 02 / female visual archetype.

Runtime character assets remain intentionally limited to:

```text
assets/characters/character-01/character-01-layered.svg
assets/characters/character-02/character-02-layered.svg
```

Character ownership rules:

- body/rig is character-specific;
- `outfit` is character-specific;
- `shoes` are character-specific;
- `hat`, `glasses`, `facialHair` and `accessory` are shared appearance categories;
- shared appearance selection survives a body switch only when the exact selected variant is compatible with the target body's validated manifest;
- incompatible shared selection resolves to `null` rather than silently substituting another item;
- outfit/shoes state belongs to the selected base character;
- visual identity never changes BehaviorGraph automatically.

The renderer reads rig metadata from the active SVG when present and otherwise uses that character's registry/manifest fallback. The implementation uses `src/render/character-registry.mjs` as the runtime roster and asset-contract boundary.

Prototype/reference character SVGs must not accumulate in the production character asset folder. Adding a third base body requires an explicit product/registry decision.

## Variant appearance integration — current state

The character pipeline is now variant-capable without falsely promoting candidate geometry.

Target visual state:

```text
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

Implemented:

- registry APIs for authored numbered variants (`hat-01`, `glasses-01`, `facial-hair-01`, `accessory-01`, `outfit-01`, `shoes-01`);
- compact mobile PERSON variant rail which appears only for categories backed by validated production variants;
- legacy boolean appearance fallback for the current reconstructed production SVGs;
- renderer switching of numbered SVG groups without touching graph/runtime semantics;
- renderer support for manifest-approved color targets;
- variant-ready seeded opponent appearance generation;
- replay preservation of player appearance/colors and the exact frozen opponent visual profile;
- candidate manifests staged outside production at `reference/character-candidates/`.

### Manifest/SVG promotion gate

`character-registry.mjs` now validates a manifest against the actual production SVG before enabling any variant catalog.

Validation checks:

- character id;
- SVG `viewBox`;
- required base ids declared by the manifest;
- face-state ids;
- every declared numbered appearance id;
- every declared color-target id.

If any declared id is missing, the contract is invalid and **no candidate variants are exposed to PERSON or opponent generation**. The old production asset continues through the legacy fallback instead.

At browser startup the app loads each production `manifest.json` together with its production SVG, validates the pair, caches the exact SVG text, and only then generates variant-aware appearance state.

This means the next cleaned-character promotion should be primarily an asset/data replacement rather than another UI/engine rewrite.

### Candidate manifest facts currently staged

`character-01` candidate declares:

- 7 hats;
- 4 glasses;
- 4 facial-hair variants;
- 3 accessories;
- 3 outfits;
- 1 shoes variant;
- color targets including `shorts-primary`, `shirt-primary`, `outfit-primary`, `body-underwear`, `shoes-primary`.

`character-02` candidate declares:

- 7 hats;
- 4 glasses;
- 0 facial-hair variants;
- 3 accessories;
- 0 separable outfit variants;
- 1 shoes variant;
- only `shoes-primary` as a declared color target.

This asymmetry is intentional and comes from the supplied candidate manifests. The implementation must not fabricate missing `character-02` facial hair or outfit geometry for UI symmetry.

The candidate manifests currently **fail** against the reconstructed production SVGs, as expected, because their numbered semantic groups do not yet exist in those production files. Automated tests require this failure and prevent accidental promotion.

## Opponent system

Fresh experiments generate a compact opponent baseline through:

```text
src/opponent/presets.mjs
src/opponent/generator.mjs
```

A generated opponent independently receives:

- one of the two approved base visual characters;
- compatible visual appearance from that character's validated contract;
- a name;
- one authored real BehaviorGraph preset.

Initial authored opponent presets:

- `CONTACT_SKEPTIC` — «СНАЧАЛА РАЗБЕРУСЬ»;
- `RIGHT_BACK` — «НЕТ, ЭТО Я СЕЙЧАС ОБЪЯСНЮ»;
- `KEEP_PEACE` — «ЛИШЬ БЫ НЕ РУГАЛИСЬ».

SETUP shows the opponent name, preset label and a short behavioral tendency description. **ДРУГОГО →** rerolls the opponent only before PLAY.

The generator is seedable for QA. Randomization is frozen once the first Encounter baseline begins. Counterfactual replay restores the same opponent body, appearance, brain preset and initial state; it never silently rerolls the opponent.

Appearance and brain preset are sampled independently, preserving `VISUAL CHARACTER ≠ BEHAVIOR GRAPH`.

## Wired vertical-slice UI

The implementation branch has a real modular entry page at `dementor-lab/index.html`.

Current connected flow:

`PERSON → BRAIN → SETUP + OPPONENT → TALK → predictive HOT PATCH → same-turn resume → RESULT → one-node rerun → BEFORE/AFTER`

UI responsibilities:

- PERSON chooses one of the two base visual bodies and edits appearance only.
- PERSON uses validated registry/manifest availability rather than hardcoded invented variant lists.
- BRAIN edits actual player graph params (`BE RIGHT weight`, `REPEAT count`).
- SETUP exposes Scenario, objective and the generated opponent baseline.
- TALK reads both real actor states from `VerticalSliceController`.
- AUTO and STEP both call the same runtime.
- TRACE reads actual `ExecutionTrace`.
- HOT PATCH edits the actual graph and then resumes the pending turn.
- RESULT is trace-derived.
- Rerun recreates the same Scenario and opponent baseline, asks for one player-graph change, and compares terminal state through `compareRuns()`.

The UI does not maintain a second copy of encounter semantics.

## Important semantic correction made during implementation

The earlier prototype/runtime ordering could apply a turn, reach terminal state and only then consider HOT PATCH. The modular runtime now predicts the dangerous traversal first. If the breakpoint qualifies, the Encounter enters `HOT_PATCH` **without consuming the turn or mutating metrics/memory/transcript**. After the patch, the same actor retries the pending turn against the changed graph.

The BRAIN loop breakpoint is aligned with the architecture baseline at predicted `BRAIN ≥ 88` with repeated loop activity.

## Test coverage present in branch

The deterministic suite covers Encounter/HOT PATCH, replay/result, renderer behavior, mobile readability, UI contracts, character-asset contracts, character registry/manifest promotion gates and seeded opponent generation.

The registry selftest proves all three states explicitly:

1. current production SVG + current production manifest is valid but remains legacy/non-variant;
2. staged candidate manifest + current reconstructed SVG is rejected and cannot expose variants;
3. a synthetic exact manifest/SVG match passes and enables the variant contract.

Browser smoke verifies the phone-sized end-to-end flow, two-character appearance contract, opponent SETUP description, generated opponent rig persistence and same-opponent counterfactual replay.

## Current asset blocker

The exact cleaned male/female SVG XML still needs to be directly readable before production geometry can be replaced.

Do not promote candidate manifests or pivot coordinates independently from their source SVGs. Required promotion sequence:

1. read exact SVG XML;
2. inspect groups, ids, transforms, masks/clips, opacity/display, fills/strokes, viewBox and metadata;
3. compare against the staged candidate manifest;
4. normalize only semantic naming/default visibility that can be changed without redrawing the user's geometry;
5. promote SVG + production manifest together;
6. let runtime validation enable only the proven variants;
7. run asset/runtime/opponent/UI/browser tests.

## Current gate

Implementation breadth remains frozen around the approved two-character variant extension. Continue with asset completion, physical QA and FUN PASS rather than adding more systems.

Required checks before integration PR:

1. AUTO and STEP produce the same deterministic turn semantics.
2. HOT PATCH appears before dangerous traversal is committed.
3. Applying a patch retries the same actor/turn with preserved state.
4. UI objective wording matches Scenario objective.
5. TRACE matches actual graph path.
6. Result explains actual final trace.
7. Replay uses the same Scenario, same opponent baseline and shows a real BEFORE/AFTER delta.
8. Both base characters render correctly with their own rigs/outfit/shoes.
9. Shared appearance state behaves consistently between both base characters and incompatible variants do not leak across bodies.
10. Candidate manifests cannot enable variants against mismatched SVG geometry.
11. Opponent description matches its actual preset tendency without replacing trace causality.
12. Mobile Safari and Android Chrome remain readable and operable.
13. Gate D FUN PASS confirms a new adult player understands who they built, who they are facing, why behavior happened and wants to rerun.

Physical iPhone Safari / Android Chrome QA is **not** marked passed by CI.

No deploy yet.
