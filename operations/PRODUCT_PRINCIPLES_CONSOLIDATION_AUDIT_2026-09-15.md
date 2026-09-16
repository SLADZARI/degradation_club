# DEMENTOR CLUB — PRODUCT PRINCIPLES CONSOLIDATION AUDIT

Status: **OPERATIONS EVIDENCE — NOT PRODUCT AUTHORITY**  
Updated: **2026-09-15**

## Purpose

This file records the consolidation review used to create:

`concept/PRODUCT_PRINCIPLES_ANTIPATTERNS_V1.md`

It does not replace any Product & Marketing authority.

The audit question was:

> **Can `15` close the package by consolidating existing rules without inventing a new product theory?**

Answer:

**YES — with explicit separation between global principles, scoped guardrails and package governance.**

---

# 1. Consolidation result

The package contained many correct recurring formulas, but they were not all the same kind of rule.

Three classes were identified:

## A. GLOBAL PRINCIPLES

Cross-authority constraints that can stop a decision across several parts of the product.

Final v1 set:

1. `OBSERVATION BEFORE JOKE`
2. `THING FIRST`
3. `VALUE BEFORE CTA`
4. `VALUE IS NOT A LADDER`
5. `EDITORIAL > SOCIAL`
6. `OBJECTS > PROFILES`
7. `SITUATIONS > SKILLS`
8. `PRODUCT SEMANTICS ≠ IMPLEMENTATION SHAPE`
9. `RELEASE > COMPLETION`
10. `RETURN FOLLOWS VALUE, NOT DEBT`
11. `PROMISE MUST MATCH REALITY`
12. `PAYMENT FOLLOWS VALUE, NOT STATUS OR POWER`

## B. SCOPED GUARDRAILS

Important rules that belong to a defined authority and should not be applied universally.

Final v1 set:

- `PROGRAM FOLLOWS MEANING, NOT ACTIVITY`
- `CONTRIBUTION ≠ PUBLICATION`
- `USE THE SMALLEST SUFFICIENT INTERVENTION`
- `RICH MODEL → SPARSE SURFACE`
- `DISTRIBUTE THE THING, NOT THE ORG CHART`
- `MEASURE THE VALUE CHAIN, NOT THE NOISE AROUND IT`
- `COMMERCIAL EVIDENCE FOLLOWS THE FULL EXCHANGE`
- `DISTRIBUTION ECONOMICS DO NOT REWRITE PRODUCT VALUE`

## C. LOCAL CONSEQUENCES

Valid formulas that remain inside their source authorities and do not need independent constitutional status.

Examples:

- `NO DELTA → NO UPDATE`;
- `FRESHNESS ≠ CREATED_AT ≠ PUBLISHED_AT`;
- `SEQUENCE BY ATTENTION, NOT DATABASE CHRONOLOGY`;
- `FOLLOW THE WORK, NOT THE PROFILE ACTIVITY`;
- `CONTEXT BEFORE PERSON`;
- `MATERIAL FIRST → CLASSIFICATION LATER`;
- `NO ACTION IS AN OUTCOME. SILENCE IS NOT.`;
- `MERGE BEFORE DUPLICATE CREATION`;
- `OPEN LOOP MUST EVENTUALLY CLOSE OR CHANGE TRUTHFULLY`;
- `CLICK / OPEN ≠ QUALIFIED EXPERIENCE ENTRY`;
- `NO QUESTION → NO EVENT`;
- `DO NOT INVENT LTV BEFORE REPEAT EXISTS`.

These rules remain important but are better preserved as implications / guardrails under the relevant authority.

---

# 2. Main deduplication decisions

## `THING FIRST` vs `VALUE BEFORE CTA`

KEEP BOTH.

They answer different questions:

- `THING FIRST` = what should usually prove Dementor first;
- `VALUE BEFORE CTA` = ordering of value vs requested next action.

---

## `EDITORIAL > SOCIAL` vs `PROGRAM ≠ FEED`

KEEP `EDITORIAL > SOCIAL` global.

Move feed-specific logic under scoped programming guardrail:

`PROGRAM FOLLOWS MEANING, NOT ACTIVITY`.

---

## `OBJECTS > PROFILES` vs `CONTEXT BEFORE PERSON`

KEEP `OBJECTS > PROFILES` global.

Treat `CONTEXT BEFORE PERSON` as Intervention / discovery consequence together with `SITUATIONS > SKILLS`.

---

## `PAYMENT ≠ EDITORIAL PRIORITY` vs `PROGRAM PRIORITY ≠ REVENUE PRIORITY`

MERGE under:

`PAYMENT FOLLOWS VALUE, NOT STATUS OR POWER`.

Both are anti-capture consequences of the same economic boundary.

---

## `NO DELTA → NO UPDATE`

DO NOT promote globally.

It belongs to Programming / audience-facing update semantics.

It must not be misread as a prohibition on technical updates, governance changes or internal operations without user-visible delta.

---

## `RICH MODEL → SPARSE CARD`

REFRAME to scoped:

`RICH MODEL → SPARSE SURFACE`.

The rule protects projection / interface hierarchy, not the richness of the underlying domain model.

---

## `MEASURE THE VALUE CHAIN...`

KEEP scoped to Metrics.

It has cross-package consequences, but `14` remains the primary authority for observability and counting.

---

# 3. Principles added during consolidation

Two cross-authority rules were strong enough to promote explicitly.

## PRODUCT SEMANTICS ≠ IMPLEMENTATION SHAPE

Evidence repeated across Product Model, Board Model and Programming:

- Thing does not imply a new DB table;
- Artifact does not define universal product ontology;
- source type does not define Form;
- operational lifecycle does not define Product lifecycle;
- Programming Moment does not automatically create a new entity;
- projection does not become source truth.

This is a real cross-authority protection against implementation-driven product drift.

## PROMISE MUST MATCH REALITY

Evidence repeated across Programming, Return, Messaging, Distribution, Monetization and Metrics:

- anticipation requires a real next move;
- open loops must close or change truthfully;
- destination must match promise;
- availability / paid terms / fulfillment must be literal;
- Trust / Delivery is part of Product Health.

This is stronger than a messaging rule and warrants global status.

---

# 4. Principle intentionally NOT promoted globally

## USE THE SMALLEST SUFFICIENT INTERVENTION

This is a strong rule, but it remains scoped to Intervention / paid contextual utility.

Reason:

Applying it globally could produce false conclusions such as always choosing the shortest content Form or smallest Product scope regardless of intended experience.

Its source meaning is specifically:

> choose the smallest resource/action sufficient for the real Situation.

Therefore it remains `G03`, not a global constitution principle.

---

# 5. Drift model

The previous package contained many local anti-patterns.

For `15`, they were compressed into nine reusable drift families:

1. SOCIAL DRIFT
2. FEED DRIFT
3. STATUS LADDER
4. MARKETPLACE DRIFT
5. FUNNEL DRIFT
6. IMPLEMENTATION DRIFT
7. PROMISE DEBT
8. COMMERCIAL CAPTURE
9. METRICS THEATER

Purpose:

A future decision should be classifiable as a drift risk without creating a new anti-pattern label for every feature.

---

# 6. Conflict resolution added by `15`

This is the main unique contribution of `15`.

Existing authorities contain strong local rules but do not provide one shared order for resolving cross-authority conflicts.

The consolidation rule is:

**TRUTH → VALUE → MEANING → SEMANTICS → AUTONOMY → OPTIMIZATION**

Interpretation:

1. factual truth / availability / permissions / terms;
2. standalone user value;
3. product + editorial meaning;
4. semantic integrity;
5. human autonomy / non-coercive path;
6. growth / revenue / metrics / operational optimization.

This is not a replacement for primary authority.

It is only the order used when several legitimate authorities pull in different directions.

---

# 7. Fresh `12–14` impact

## 12 · Distribution

Distribution is no longer a semantic gap.

Its main contribution to `15` is captured as scoped guardrail:

`DISTRIBUTE THE THING, NOT THE ORG CHART`.

Key consequences remain in `12`:

- source ≠ channel ≠ transport ≠ Entry Object;
- destination matches promise;
- Home / Board are not default acquisition surfaces;
- not every Release needs every channel;
- click does not prove experience quality.

## 13 · Monetization

`13A + 13B` provide both valid paid-value architecture and distribution economics.

`15` intentionally does not repeat pricing / CAC / attribution mechanics.

It consolidates only the cross-authority economic boundary:

`PAYMENT FOLLOWS VALUE, NOT STATUS OR POWER`.

## 14 · Metrics & Signals

The file currently self-identifies as:

`WORKING CANON / open stack`

while its PR integration state remains Draft / not merged.

This confirms the need to distinguish:

- semantic status;
- integration status;
- production instrumentation status;
- empirical evidence status.

`14` contributes the scoped guardrail:

`MEASURE THE VALUE CHAIN, NOT THE NOISE AROUND IT`.

---

# 8. Known package-status inconsistency

The inherited file:

`operations/PRODUCT_MARKETING_PACKAGE_STATUS_2026-09-15.md`

is stale relative to the active stack.

It still records:

- `12` as a real semantic gap;
- `14` as a real semantic / instrumentation gap;
- older `13` state.

Current stack already contains:

- `12 · Distribution Model`;
- `13A + 13B`;
- `14 · Metrics & Signals`;
- now `15 · Product Principles & Anti-patterns`.

This is **not a semantic conflict inside `15`**.

It is package governance / navigation debt and should be repaired during the next full-package integration review rather than hidden inside the principles document.

---

# 9. What this audit does NOT claim

This review closes the **consolidation logic of `15`**.

It does not yet claim that:

- every stacked PR has been merged;
- the base package index reflects the live stack;
- all `01–15` wording conflicts have been exhaustively removed;
- production implements all authorities;
- instrumentation implements `14`;
- current analytics provide clean external evidence;
- monetization hypotheses are empirically validated.

Those belong to the next package-wide review.

---

# 10. `15` Definition of Done result

| Gate | Result |
|---|---|
| No new unsupported product theory | PASS |
| Global principles limited and deduplicated | PASS — 12 |
| Scoped rules explicitly scoped | PASS — 8 |
| Each global principle has `Does not mean` | PASS |
| Each global principle has a Decision Test | PASS |
| Anti-patterns compressed into drift families | PASS — 9 |
| Conflict-resolution order exists | PASS |
| Source authorities recorded | PASS |
| Semantic vs integration status distinguished | PASS |
| Full `01–15` integration / implementation audit | DEFERRED TO NEXT REVIEW |

Conclusion:

**`15 · Product Principles / Anti-patterns v1` is ready as the package consolidation authority candidate.**

The next meaningful task is no longer to add product theory.

It is to inspect the complete `01–15` package as one system against:

1. authority consistency;
2. merge / stack reality;
3. production implementation;
4. instrumentation;
5. empirical evidence.
