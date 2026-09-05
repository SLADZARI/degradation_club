# DEMENTOR LAB — First-time Player Gate v0.8

Status: REQUIRED BEFORE MVP LABEL
Branch: `experiment/dementor-lab-integrated-v0.8`

## Test setup

Give the phone to a person who has never seen DEMENTOR LAB. Do not explain BehaviorGraph, Intent, saliency, WorldEvent, REPEAT or HOT PATCH. Open `prototypes/portrait-flow-v0.8.html` on the INTRO screen.

Ask the tester to complete one experiment, inspect the result, change one thing if offered, then find the saved experiment in Archive.

## Pass questions

Without prompting, after the run the tester should be able to answer:

1. Who was their character?
2. What situation were they solving?
3. What was their objective?
4. Which brain/behavior preset did they choose?
5. What did that choice make the character do differently?
6. Who was speaking at any given moment?
7. Why did the opponent react the way they did?
8. Why did the encounter end?
9. What single cause could be changed?
10. Where can the previous run be found?

## Behavioral pass criteria

- No explanation from the facilitator is required to start the first run.
- Tester never needs to open the advanced graph editor.
- Tester can distinguish at least two of the three preset descriptions before playing.
- TALK is perceived as the main game, not a debug dashboard.
- RESULT is understood as a consequence of what was shown in TALK.
- BEFORE/AFTER numbers match the actual two traces.
- Archive contains the run the tester just completed.

## Failure conditions

MVP gate fails if any of the following occurs:

- tester asks what they are supposed to do on more than one primary screen;
- choosing a different preset appears to produce the same behavior;
- RESULT claims an action count that was not present in the trace;
- HOT PATCH changes something unrelated to the highlighted cause;
- Archive shows a demo/fake record instead of the completed run;
- technical terms must be explained for the player to understand the outcome.

## Evidence to record

Record only:
- device / viewport;
- chosen objective;
- chosen brain preset;
- completion time;
- screens where the tester hesitated for >5 seconds;
- tester's one-sentence explanation of why the result happened;
- pass/fail for the ten questions above.

Do not coach the tester during the run. One real outsider pass is required before calling v0.8 the first MVP.
