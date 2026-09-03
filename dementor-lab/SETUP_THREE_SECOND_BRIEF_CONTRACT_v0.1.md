# DEMENTOR LAB — SETUP THREE-SECOND BRIEF CONTRACT v0.1

Status: APPROVED for vertical slice.

## Purpose
SETUP is a pre-fight brief, not a second editor. Before PLAY the player should be able to answer three questions in a few seconds:

1. Who am I talking to?
2. What am I trying to achieve?
3. What counts as losing this experiment?

## Visible hierarchy
1. Experiment choice.
2. Situation title + one-sentence premise.
3. One stakes block: `ТВОЯ ЗАДАЧА` + `ПРОИГРАЕШЬ, ЕСЛИ`.
4. Real opponent portrait, name and behavioral shorthand.
5. Tempo control as a secondary setting.
6. One primary `НАЧАТЬ ЭКСПЕРИМЕНТ` action.

## Rules
- Opponent portrait is visible before PLAY.
- Seed remains implementation evidence, not primary content.
- AUTO / STEP is a tempo setting, not a competing primary choice.
- Loss copy must name the actual player-facing thresholds instead of vague `РАЗВАЛ` wording.
- No new gameplay state or objective is introduced by this pass.
- The same Scenario and opponent data remain source of truth.

## Invariant
**SETUP explains stakes; BRAIN defines behavior; TALK runs the experiment.**
