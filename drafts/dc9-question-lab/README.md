# DC-9 Question Lab

Status: **DRAFT / NOT PRODUCTION / NOT CANON**

Branch: `draft/dc9-question-lab`
Base: `dementor-club`

## Purpose

This branch is the working laboratory for the Dementor Club DC-9 onboarding question system.

It exists to collect, compare, rewrite and QA:

- all question scenes;
- all answer options;
- hidden answer semantics;
- protective-pattern taxonomy;
- question impact / weight;
- intentionality and responsibility guards;
- editorial evaluation;
- per-question presentation mechanics that do not require illustrations;
- result-language hypotheses;
- candidate scoring changes before they are approved;
- future Club-routing hypotheses without inventing public mechanics.

Nothing in this directory is production truth until explicitly promoted into the canonical `dementor-club` branch.

## Authority boundary

Canonical sources remain in `dementor-club`:

- `operations/ONBOARDING_SCENARIO_RULES.md` — current canonical scenario and answer semantics;
- `operations/ONBOARDING_SYSTEM.md` — onboarding system;
- `operations/CONTENT_TAXONOMY_AND_DEMENTOR_LEVELS.md` — diagnostic meaning;
- `operations/DC9_RESULT_SYSTEM_V0.1.md` — current approved result contract.

Implementation remains in `dementor-club-site` only after content/scoring approval.

This lab MUST NOT silently change production semantics.

## Working structure

- `METHODOLOGY_V0.3_DRAFT.md` — current editorial hypothesis: normal scenes, plausible answers, pattern-stage semantics, satire after the choice.
- `PATTERN_TAXONOMY_V0.1_DRAFT.md` — internal vocabulary for mechanisms such as role maintenance, control buffer, sunk-cost defense and principle justification; not a psychotype system.
- `QUESTION_SCHEMA.md` — draft record shape for questions.
- `SCORING_WEIGHT_MODEL_V0.2_DRAFT.md` — earlier weighted model that still assumes monotonic Dementor answer score.
- `SCORING_PATTERN_MODEL_V0.3_DRAFT.md` — compatibility experiment separating `pattern_stage` from canonical diagnostic evidence.
- `QUESTION_PRESENTATION_PATTERNS.md` — reusable no-image UX patterns with explicit diagnostic/satirical functions.
- `EDITORIAL_QA_RUBRIC.md` — quality gates and mandatory per-question workbench.
- `RESULT_AND_ROUTING_HYPOTHESES.md` — non-canonical technical-result language and future content-routing ideas.
- `baseline/CURRENT_PRODUCTION_BANK_2026-08-31.md` — frozen reference of current production question bank.
- `baseline/CURRENT_AUDIT_2026-08-31.md` — editorial/product audit of the current bank.
- `spheres/01_personality.md` — earlier full v2 rewrite retained for comparison.
- `spheres/01_personality_workbench.md` — active gold-standard workflow; question-by-question, not whole-sphere rewrite.
- `spheres/01_personality_q1_role_candidates.md` — reaction pool and first Q1 clustering pass.
- `spheres/01_personality_q1_role_v02.md` — current playtest-ready Q1 candidate.
- later sphere workbenches follow only after the Personality method is proven.

## Workflow

`CURRENT → AUDIT → WORKBENCH → CANDIDATE → PLAYTEST → APPROVED DRAFT → CANON → SITE`

A question moves through statuses:

`baseline / rewrite / workbench / candidate / playtest / approved-draft / rejected / promoted`

Only `promoted` content may be copied into the canonical branch.

## Non-negotiable principles

1. User chooses behavior in a concrete situation; they do not self-report how Dementor they are.
2. A good question does not require a funny answer; a normal answer can later receive a funny diagnosis.
3. All four answers must be psychologically plausible.
4. Public options must not reveal a moral ladder or a stable Club-preferred answer.
5. Answer position never equals hidden semantics; options are shuffled at runtime.
6. Tag, pattern, score/evidence, impact, weight and guard mechanics are hidden from the public layer.
7. `pattern_stage` describes how a strategy becomes a system/principle; it is not automatically a Dementor score.
8. Pattern labels are internal editorial tools, not personality types or diagnoses.
9. Variable question counts are allowed in the lab, but every sphere must reach a minimum evidence threshold.
10. More questions are not automatically better. The experience must stay tense, recognizable and short enough to finish.
11. Question impact is based on cost of error + personal stake, not theatrical drama.
12. Result language must not create a universal psychotype or aggregate Dementor score.
13. Future routing may point only to real approved Club entities and must be approved separately.

## Current scoring research state

### Production baseline

Current production still uses the approved monotonic semantic answer score `0–3` and the existing guard-cap result contract.

### v0.2 draft

Tests variable question counts and impact weights while retaining the production-style semantic answer score.

### v0.3 draft hypothesis

Tests a separate editorial field:

`pattern_stage 0–3`

where the stages describe how a strategy is formed:

- 0 — direct reaction;
- 1 — ordinary adaptation / explanation;
- 2 — structured mechanism;
- 3 — mechanism becomes principle/worldview.

This is **not automatically the sphere score**.

A separate candidate `canonical_evidence` mapping is being tested so that an entrenched pattern is not automatically interpreted as “more Dementor”.

## Impact I1–I7

Impact is separate from answer semantics.

It is based on:

- cost of being wrong;
- personal stake.

Working coefficients remain experimental:

`I1=.70 · I2=.80 · I3=.90 · I4=1.00 · I5=1.15 · I6=1.30 · I7=1.50`

## Current active task

Do not rewrite all six Personality scenes at once.

Q1 `Role maintenance` is now at playtest-ready candidate v0.2 with provisional editorial QA `44/50`.

Next gate for Q1:

1. blind-check whether any answer is perceived as the obvious Club answer;
2. verify that competent organizers can sincerely choose C/D without feeling caricatured;
3. only then mark `approved-draft`;
4. after Q1 is frozen, move to Q2 `value through activity / free time` using the same workbench method.
