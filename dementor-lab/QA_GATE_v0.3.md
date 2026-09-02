# DEMENTOR LAB — QA Gate v0.3

**Branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Stage:** physical-device + FUN PASS before PR to `dementor-club-site`

## Testable slice

`PERSON → BRAIN → SETUP + RANDOMIZED OPPONENT → TALK → HOT PATCH → same Encounter resume → RESULT → one-node replay → BEFORE/AFTER`

The mobile UI is wired to `VerticalSliceController`; encounter semantics remain in runtime modules rather than click handlers.

## Automated gate status

Both approved production bodies now use validated exact cleaned SVG + manifest pairs.

- Modular runtime boundary: **PASS**.
- UI/runtime separation: **PASS**.
- Deterministic zero-dependency QA: **PASS**.
- Seeded opponent generation: **PASS**.
- Two-base-character exact production asset contract: **PASS**.
- Manifest/SVG validation gate: **PASS**.
- Exact numbered variant selection: **PASS**.
- Intentional female asymmetry (no fabricated facial hair/outfits): **PASS**.
- Exact wrapper handling for female `shoes-01` and `glasses-01`: **PASS**.
- Chromium browser smoke with iPhone 13 viewport: **PASS**.
- Full browser flow through HOT PATCH → RESULT → replay: **PASS**.
- Generated opponent description/brain preset/rig persistence: **PASS**.
- Same-opponent counterfactual replay: **PASS**.
- Horizontal phone overflow smoke: **PASS**.

Verified CI run: `33605375379`.

## Exact character QA contract

### character-01

Production manifest exposes the exact authored male variants: 7 hats, 4 glasses, 4 facial-hair variants, 3 accessories, 3 outfits and 1 shoes variant.

### character-02

Production manifest exposes the exact authored female variants: 7 hats, 4 glasses, 3 accessories and 1 shoes variant. It intentionally exposes 0 facial-hair and 0 separable outfit variants because those do not exist in the source geometry.

QA must reject any implementation that invents missing variants for visual symmetry.

The renderer must also distinguish numbered variant IDs from paint targets and must not hide a wrapper group that contains active exact variants.

## Opponent QA contract

A fresh experiment may randomize opponent body/appearance/preset. Once PLAY begins, that exact opponent baseline becomes part of the experiment and must remain unchanged for counterfactual replay.

QA uses an explicit seed to reproduce opponent selection. Browser smoke verifies that the generated opponent:

- uses only `character-01` or `character-02`;
- exposes a real authored brain preset;
- has a readable setup description;
- keeps the generated rig into TALK;
- remains the same during one-node replay.

## Remaining Gate A — physical devices

Still requires human verification on at least:

### iPhone Safari

- PERSON body switching and numbered variant controls are thumb-usable;
- exact male/female characters are not clipped around safe areas;
- glasses, hats and shoes render correctly during real touch interaction;
- SETUP opponent card is readable without tiny support copy;
- AUTO pause/resume is obvious;
- STEP progression is obvious;
- TALK characters remain large enough to read visually;
- HOT PATCH overlay can be understood and dismissed/applied with one hand;
- RESULT → replay is clear;
- browser bottom/top chrome does not cover navigation.

### Android Chrome

Repeat the same flow and additionally verify browser-specific viewport resize / bottom-bar behavior.

Physical-device QA is **not** considered passed by CI.

## Remaining Gate D — FUN PASS

Do not measure whether the tester understands our architecture. Measure whether the game produces curiosity.

A fresh adult tester should be able to:

1. build a visible character quickly;
2. understand that BRAIN changes behavior rather than appearance;
3. understand who the generated opponent is from SETUP;
4. start the situation knowing the objective;
5. watch the two systems behave without choosing every line;
6. recognize that HOT PATCH points to a cause rather than offering a dialogue answer;
7. understand the Result without developer explanation;
8. want to change one thing and rerun.

Strong success signal:

> «А что будет, если я вот это поменяю?»

Failure signals:

- asks what they are supposed to press on every screen;
- thinks opponent preset is a fixed scripted dialogue;
- thinks clothing changes personality;
- cannot tell why the model broke;
- sees Result as a score rather than consequence;
- has no desire to rerun after Result.

## Integration decision

Exact character asset integration is complete and automated Gate A coverage is green.

PR to `dementor-club-site` remains **NOT READY** until physical-device Gate A has no blocking defects and at least one short FUN PASS is completed.

Asset expansion remains frozen during this gate. No `character-03` and no fabricated female variants.

No Vercel deploy implied.
