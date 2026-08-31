# DC-9 Scoring Pattern Model v0.3

Status: **DRAFT HYPOTHESIS / NOT CANON / NOT IMPLEMENTATION READY**  
Date: 2026-08-31

## Problem

The existing v0.2 draft still assumes:

`answer score 0–3 = degree of Dementor behavior`.

That is easy to game editorially because the most articulate, anti-success or obviously Club-aligned answer can become the visible winner.

The v0.3 hypothesis separates two different things:

1. **what strategy/pattern the answer expresses**;
2. **how that evidence may contribute to the canonical sphere result**.

These must not be silently collapsed into one number.

## Editorial answer payload

For question-lab purposes, an answer may carry:

- `pattern_stage ∈ {0,1,2,3}`;
- `pattern_id` — sphere-specific mechanism being expressed;
- `canonical_alignment` — unresolved mapping to current DC-9 sphere semantics;
- `impact_band I1–I7` — belongs to the question, not the answer;
- optional editorial notes explaining the psychological logic.

### Pattern stage

- `0` — direct reaction without protective construction;
- `1` — ordinary social adaptation / explanation;
- `2` — structured repeatable mechanism;
- `3` — mechanism elevated into principle / worldview / identity.

This scale describes **form and entrenchment of the strategy**, not goodness, maturity, pathology or Dementor status.

## Critical compatibility rule

`pattern_stage` MUST NOT be directly substituted into the production formula as `a`.

Why:

A highly entrenched pattern can be either:

- strongly aligned with a sphere-specific Dementor refusal;
- strongly aligned with successful-success maintenance;
- neutral to the actual sphere construct;
- evidence of a different hidden mechanism entirely.

Therefore the mapping from answer → canonical sphere evidence must be defined per question or per pattern family.

## Candidate mapping layer

For experiments only, use a separate semantic field:

`canonical_evidence ∈ [0,1]`

where:

- `0.00` = strongly serves the successful-success construction in this sphere;
- `0.33` = small violation / weak refusal;
- `0.67` = meaningful refusal;
- `1.00` = construction clearly loses power over the decision.

This preserves compatibility with the canonical semantic direction without forcing the public/editorial answer labels to look like a moral ladder.

The lab can then test:

`tag_raw(t) = Σ(w_q × canonical_evidence_q) / Σ(w_q)`

`tag_level(t) = round(tag_raw(t) × 5)`

This is mathematically similar to v0.2 but editorially separates **pattern description** from **canonical diagnostic contribution**.

### Important

`canonical_evidence` is still a draft compatibility field. It is not approved production data until playtests show that the mapping is stable and editors can agree on it without arbitrary judgement.

## Impact I1–I7

Question impact remains independent from both `pattern_stage` and `canonical_evidence`.

Impact is determined by:

1. cost of being wrong;
2. degree of personal stake.

Working coefficients remain:

`I1=.70 · I2=.80 · I3=.90 · I4=1.00 · I5=1.15 · I6=1.30 · I7=1.50`

The curve is intentionally compressed.

## Why this model may be better

It allows answer options such as:

- direct action;
- explanation;
- repeated protective mechanism;
- principled rationalization;

without pretending that the fourth option is automatically the “most Dementor”.

The satire can then emerge from the pattern diagnosis, while the canonical sphere score is calculated from a separate hidden semantic mapping.

## Example abstract structure

Question target: `identity_consistency_pressure`

Answer A:
- `pattern_stage: 0`
- direct change without explanation
- `canonical_evidence: 1.00` **if** the sphere canon says old identity has lost power

Answer B:
- `pattern_stage: 1`
- social explanation before changing
- `canonical_evidence: 0.67`

Answer C:
- `pattern_stage: 2`
- hidden workaround to preserve external consistency
- `canonical_evidence: 0.33`

Answer D:
- `pattern_stage: 3`
- explicit worldview that consistency must be protected
- `canonical_evidence: 0.00`

In another question, the ordering between `pattern_stage` and `canonical_evidence` may be completely different.

That is the point: **pattern stage is descriptive; canonical evidence is diagnostic.**

## Guards

Intentionality and responsibility remain canonical constraints in production.

In the lab they should also be written as behavioral scenes, not self-report.

Candidate methodology:

- intentionality → test the behavior under a profitable/easy exception;
- responsibility → test after a prior commitment or consequence already exists;
- reputation-removal (`nobody will know`) may be used when public image contaminates the construct.

No new guard formula is approved by this document.

## Validation questions before production use

1. Can two editors independently map answers to `canonical_evidence` with high agreement?
2. Does hiding the moral ladder reduce replay/gaming behavior?
3. Does `pattern_stage` create useful result language rather than pseudo-psychology?
4. Are sphere levels stable enough compared with current scoring on representative profiles?
5. Does impact weighting improve discrimination without making one scene dominate?
6. Can the user still complete the experience quickly enough?
7. Does the result remain nine independent sphere results with no universal psychotype?

Until those questions are answered, v0.3 remains a question-lab hypothesis only.
