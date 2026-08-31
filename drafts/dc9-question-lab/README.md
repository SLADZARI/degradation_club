# DC-9 Question Lab

Status: **DRAFT / NOT PRODUCTION / NOT CANON**

Branch: `draft/dc9-question-lab`
Base: `dementor-club`

## Purpose

This branch is the working laboratory for the Dementor Club DC-9 onboarding question system.

It exists to collect, compare, rewrite and QA:

- all question scenes;
- all answer options;
- hidden 0–3 Dementor scores;
- question impact / weight;
- intentionality and responsibility guards;
- editorial evaluation;
- per-question presentation mechanics that do not require illustrations;
- candidate scoring changes before they are approved.

Nothing in this directory is production truth until explicitly promoted into the canonical `dementor-club` branch.

## Authority boundary

Canonical sources remain in `dementor-club`:

- `operations/ONBOARDING_SCENARIO_RULES.md` — scenario and answer semantics;
- `operations/ONBOARDING_SYSTEM.md` — onboarding system;
- `operations/CONTENT_TAXONOMY_AND_DEMENTOR_LEVELS.md` — diagnostic meaning;
- `operations/DC9_RESULT_SYSTEM_V0.1.md` — current approved result contract.

Implementation remains in `dementor-club-site` only after content/scoring approval.

This lab MUST NOT silently change production semantics.

## Working structure

- `QUESTION_SCHEMA.md` — one canonical draft record for every question.
- `SCORING_WEIGHT_MODEL_V0.2_DRAFT.md` — proposed weighted scoring model.
- `QUESTION_PRESENTATION_PATTERNS.md` — reusable no-image presentation mechanics.
- `EDITORIAL_QA_RUBRIC.md` — quality gates for question approval.
- `baseline/CURRENT_PRODUCTION_BANK_2026-08-31.md` — frozen reference of current production question bank.
- `baseline/CURRENT_AUDIT_2026-08-31.md` — editorial/product audit of the current bank.
- `spheres/01_personality.md` … `09_technology.md` — working drafts by sphere.

## Workflow

`CURRENT → AUDIT → CANDIDATES → PLAYTEST → APPROVED DRAFT → CANON → SITE`

A question moves through statuses:

`baseline / rewrite / candidate / playtest / approved-draft / rejected / promoted`

Only `promoted` content may be copied into the canonical branch.

## Non-negotiable principles

1. User chooses behavior in a concrete situation; they do not self-report how Dementor they are.
2. `3` is not simply the smartest, healthiest or most competent answer.
3. High score means the successful-success construction has lost power over the decision.
4. Answer position never equals score; options are shuffled at runtime.
5. Tag, score, weight and guard mechanics are hidden from the public layer.
6. Variable question counts are allowed in the lab, but every sphere must reach a minimum evidence threshold.
7. More questions are not automatically better. The experience must stay tense, recognizable and short enough to finish.
8. No new aggregate universal Dementor score is introduced.

## Current working decision

We are testing a seven-band question impact model. Impact is separate from answer score:

- answer score = how Dementor the chosen behavior is (`0–3`);
- impact band = how consequential / diagnostic the situation is (`I1–I7`);
- derived weight = how strongly that question contributes to the sphere evidence.

The seven-band system is a draft hypothesis and is not yet canon.
