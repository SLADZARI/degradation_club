# DC-9 Question Lab

Status: **DRAFT / NOT PRODUCTION / NOT CANON**

Branch: `draft/dc9-question-lab`  
Base: `dementor-club`

## Purpose

Working laboratory for the Dementor Club DC-9 onboarding question system.

It stores:

- scenes and answers;
- hidden semantics / pattern taxonomy;
- impact and guards;
- editorial QA;
- scoring experiments;
- result/routing hypotheses;
- playtest candidates.

Nothing here becomes production truth until explicitly promoted into `dementor-club`.

## Canonical authorities

In `dementor-club`:

- `operations/ONBOARDING_SCENARIO_RULES.md` — what the scene measures / hidden semantic canon;
- `operations/QUESTION_PRESENTATION_HUMOR_STANDARD.md` — **how public questions must sound: brevity, deadpan, reality shift, answer style, narrator, humor rhythm**;
- `operations/ONBOARDING_SYSTEM.md` — onboarding system;
- `operations/CONTENT_TAXONOMY_AND_DEMENTOR_LEVELS.md` — diagnostic meaning;
- `operations/DC9_RESULT_SYSTEM_V0.1.md` — approved result contract.

Implementation remains in `dementor-club-site` only after approval.

## Current authoring method

**ACTIVE:** `METHODOLOGY_V0.4_DRAFT.md`

v0.4 replaces the v0.3 authoring assumption that a premise may be completely serious and humor can arrive mainly after the answer.

New working rule:

> **The user must feel Dementor Club on the question screen.**

The humor may be quiet, but the question already needs a small reality shift / deadpan detail. Public copy must be short.

### Public screen rule

`current moment → exact detail → small Dementor shift → four compact exits`

Not:

`biography → construct explanation → long setup → choice`

### Working length target

- premise + detail usually `~35–45 words max`;
- answer usually `~8–16 words`;
- Q1 must be understandable in roughly `5–8 seconds`.

These are editorial targets, not runtime validators.

## First-question rule

Q1 of every sphere is an onboarding into the language of the quiz.

It must be:

- fast;
- light;
- recognizable;
- slightly strange already;
- compact;
- free of theory and biography dump.

If Q1 feels like psychometrics, it fails even with strong semantic QA.

## Working structure

- `METHODOLOGY_V0.4_DRAFT.md` — **active concise humor-first authoring method**;
- `METHODOLOGY_V0.3_DRAFT.md` — previous method retained as history / superseded for public authoring;
- `PATTERN_TAXONOMY_V0.1_DRAFT.md` — internal pattern vocabulary;
- `QUESTION_SCHEMA.md` — draft question record shape;
- `SCORING_WEIGHT_MODEL_V0.2_DRAFT.md` — earlier weighted model;
- `SCORING_PATTERN_MODEL_V0.3_DRAFT.md` — separates `pattern_stage` from `canonical_evidence`;
- `QUESTION_PRESENTATION_PATTERNS.md` — reusable UI/diagnostic patterns, subordinate to canonical humor standard;
- `EDITORIAL_QA_RUBRIC.md` — current QA with instant-read and Q1 gates;
- `RESULT_AND_ROUTING_HYPOTHESES.md` — non-canonical result/routing ideas;
- `baseline/CURRENT_PRODUCTION_BANK_2026-08-31.md` — frozen production bank;
- `baseline/CURRENT_AUDIT_2026-08-31.md` — baseline audit;
- `spheres/01_personality_workbench.md` — Personality workbench;
- `spheres/01_personality_q1_role_candidates.md` — raw Q1 reaction pool;
- `spheres/01_personality_q1_role_v02.md` — previous long semantic candidate, retained for comparison;
- `spheres/01_personality_q1_role_v03.md` — **current concise humor-first Q1 candidate**.

## Workflow

`CURRENT → AUDIT → WORKBENCH → CANDIDATE → SEMANTIC GATE → INSTANT-READ GATE → PRESENTATION/HUMOR GATE → BLIND PLAYTEST → APPROVED DRAFT → CANON → SITE`

Only promoted content may move to production canon.

## Non-negotiable principles

1. User chooses behavior, never abstract self-description.
2. Public screen shows a current incident, not editorial explanation.
3. Q1 teaches the game before it carries maximum depth.
4. The question itself already contains a quiet Dementor signal.
5. All four answers remain defensible human choices.
6. No stable moral ladder / Club-preferred answer.
7. Answer order is shuffled at runtime.
8. Hidden tag/pattern/evidence/impact/guard never leaks publicly.
9. `pattern_stage` is descriptive, not automatically a Dementor score.
10. Humor targets the social system, not the user.
11. Diagnostic depth comes from the decision, not text volume.
12. More questions are not automatically better.
13. Impact = cost of error + personal stake.
14. No universal psychotype or aggregate Dementor score.
15. Routing only to real approved Club entities after separate approval.

## Current scoring research

Production scoring remains unchanged.

Question-lab experiments still separate:

- `pattern_stage` — form / entrenchment of strategy;
- `canonical_evidence` — candidate contribution to sphere semantics;
- impact I1–I7 — question-level weight.

Working impact coefficients:

`I1=.70 · I2=.80 · I3=.90 · I4=1.00 · I5=1.15 · I6=1.30 · I7=1.50`

No production formula change is approved by this lab.

## Current active task

Current gold-standard candidate:

`spheres/01_personality_q1_role_v03.md`

Next gate:

1. blind read for speed;
2. check whether A is privileged simply because it is shortest;
3. verify Q1 feels like Dementor Club before any system reaction;
4. re-score under the new 55-point rubric;
5. only then freeze Q1 and move to Q2.
