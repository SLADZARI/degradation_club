# DEMENTOR LAB — SECOND OBJECTIVE CONTRACT v0.1

Status: IMPLEMENTED / REGRESSION-GATED

## Core rule

**Same BRAIN, different win condition, different optimal causal strategy.**

An objective earns its place only when it changes which BRAIN the player wants to build.

The second objective must not create a second game. PERSON, BRAIN, TALK, HOT PATCH, RESULT and replay remain the same interaction loop.

## Objective 1 — CONTACT

Scenario: `КРИТИКА ИДЕИ`

Goal: preserve the relationship through the full encounter.

- turn limit: 20
- success: `min(A.contact, B.contact) >= 25`
- CONTACT reaching zero is an immediate breakdown for this objective

This objective rewards regulation, repair and not destroying the weaker side of the relationship.

## Objective 2 — DIRECT ANSWER

Scenario: `НЕУДОБНЫЙ ВОПРОС`

Goal: obtain a real position from an evasive interlocutor without destroying the relationship.

- turn limit: 16
- required opponent direct answers: 4
- a direct answer is a real opponent `COUNTERPOINT` event in ExecutionTrace
- success also requires `min(A.contact, B.contact) >= 50`

The progress indicator is therefore derived from actual traces plus current metrics:

`ОТВЕТЫ X/4 · CONTACT Y/50`

No dialogue phrase or UI counter is allowed to become a second source of gameplay truth.

## Opponent causal contract

The objective-specific opponent reacts to the incoming world Trigger instead of flattening every input into the same response:

- `pushback` → EXPLAIN → COUNTERPOINT — a direct answer
- `acceptance` → SILENT → NO_RESPONSE
- `deflection` → JOKE → DEFLECTION
- `ignore` → SILENT → NO_RESPONSE
- `underpressure` → PRESSURE → PRESSURE

The opening criticism starts with deflection.

This preserves the core causal chain:

`player BRAIN → player Reaction → Event/Trigger → opponent BRAIN → opponent Reaction`

## Why this objective is mechanically distinct

The six existing BRAIN presets were audited against the strict objective.

- `ВСЕГДА ПРАВ` and `ОБЪЯСНЯТЬ ВСЁ` can extract six direct answers, but overheat to BRAIN breakdown and leave CONTACT around the low 30s.
- `ЛИШЬ БЫ НЕ РУГАЛИСЬ` preserves strong CONTACT but gets zero direct answers.
- joke-oriented presets preserve CONTACT but get zero direct answers because DEFLECTION produces more DEFLECTION.
- SILENT gets zero direct answers and lets CONTACT decay.

So neither the old conflict strategy nor the old CONTACT strategy solves the new objective.

A regression-gated adaptive graph does solve it:

`while cool → EXPLAIN`

`if BRAIN > 35 → PAUSE → JOKE`

`after cooling → EXPLAIN again`

The winning structure alternates extraction and regulation rather than camping in one Reaction.

## UI contract

Scenario choice belongs in SETUP as a compact two-option experiment selector.

It must not duplicate PERSON or BRAIN creation.

TALK uses the same arena, metrics, dialogue, causality strip and character reactions. Only the objective progress projection changes.

HOT PATCH remains the same one-intervention mechanic and may edit only Character A.

RESULT uses the same causal diagnosis and behavior arc, with objective-specific terminal copy.

Replay keeps the same scenario and opponent and changes one suspicious player cause.

## Regression gates

`tests/objective-diversity-selftest.mjs` proves:

1. EXPLAIN-only can produce enough answers but still fails the whole objective;
2. the CONTACT-oriented preset does not automatically solve DIRECT ANSWER;
3. an adaptive EXPLAIN → regulate → EXPLAIN BRAIN can complete DIRECT ANSWER while keeping CONTACT >= 50.

`tests/browser-smoke.mjs` protects the iPhone-sized SETUP selector and verifies that the second objective exposes its real rules before returning to the normal full-flow smoke.

## Product consequence

The scenario layer can now vary **what counts as success** without replacing the causal simulation underneath it.

Future objectives should be admitted only under the same standard:

**different objective → materially different desirable BRAIN → same simulation grammar.**
