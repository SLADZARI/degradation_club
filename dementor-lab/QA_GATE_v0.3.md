# DEMENTOR LAB — QA Gate v0.3

**Branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Stage:** physical-device + FUN PASS before PR to `dementor-club-site`

## Testable slice

`PERSON → BRAIN → SETUP + RANDOMIZED OPPONENT → TALK → HOT PATCH → same Encounter resume → RESULT → one-node replay → BEFORE/AFTER`

The mobile UI is wired to `VerticalSliceController`; encounter semantics remain in runtime modules rather than click handlers.

## Automated gate status

- Modular runtime boundary: **PASS**.
- UI/runtime separation: **PASS**.
- Deterministic zero-dependency QA: **PASS**.
- Seeded opponent generation: **PASS**.
- Two-base-character production asset contract: **PASS**.
- Chromium browser smoke with iPhone 13 viewport: **PASS**.
- Full browser flow through HOT PATCH → RESULT → replay: **PASS**.
- Generated opponent description/brain preset/rig persistence: **PASS**.
- Same-opponent counterfactual replay: **PASS**.
- Horizontal phone overflow smoke: **PASS**.

Verified CI run: `33559927323`.

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

- PERSON switching and appearance controls are thumb-usable;
- no character clipping around safe areas;
- SETUP opponent card is readable without tiny support copy;
- AUTO pause/resume is obvious;
- STEP progression is obvious;
- TALK characters remain large enough to read visually;
- HOT PATCH overlay can be understood and dismissed/applied with one hand;
- RESULT → replay is clear;
- browser bottom/top chrome does not cover navigation.

### Android Chrome

Repeat the same flow and additionally verify browser-specific viewport resize / bottom-bar behavior.

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

PR to `dementor-club-site` remains **NOT READY** until physical-device Gate A has no blocking defects and at least one short FUN PASS is completed.

No deploy implied.
