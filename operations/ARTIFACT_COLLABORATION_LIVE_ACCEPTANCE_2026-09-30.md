---
artifactId: dementor-club.operations.artifact-collaboration-live-acceptance-2026-09-30
project: dementor-club
documentType: LIVE_ACCEPTANCE
projectStage: RELEASE
gate: G8_CLEANUP
status: PASS
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
productionCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
pagesRun: 137
pagesRunId: 36598659696
---

# Artifact Collaboration v1 — live acceptance

## Environment

Exact live production:

`a24f8d900cc29e5ae922a9a62b751cc02e88f8d9`

Canonical Pages deploy:

`Deploy Dementor Production #137 / 36598659696 · SUCCESS`

The production SHA remained unchanged during owner live acceptance.

## Human / CJM acceptance

A real Idea with two participant identities was exercised on the live site.

### BQA-24 — invitation discoverability

PASS.

Observed live:

- invited identity sees `ПРИГЛАШЕНИЯ · 1`;
- invited card carries explicit `ВАС ЗОВУТ`;
- the invitation control opens the exact invited Idea;
- the invitation is visible in the Board context without external explanation.

### BQA-25 — Artifact detail action hierarchy

PASS.

Observed live:

- invited viewer sees `ПРИСОЕДИНИТЬСЯ` as the dominant primary action;
- `НЕ СЕЙЧАС` remains secondary;
- after joining the viewer state becomes `ВЫ В ДЕЛЕ`;
- the invitation CTA no longer competes with the joined state.

### BQA-26 — LEFT / REMOVED destructive UX

PASS.

Observed live:

- participant self-action is explicitly `ВЫЙТИ ИЗ ИДЕИ`;
- self-exit is deliberate and separated from author management;
- author-side participant management remains a distinct remove responsibility;
- LEFT and REMOVED are not presented as the same actor action.

### BQA-28 — collaboration freshness

PASS.

Observed live without manual page reload:

- invitation state updates;
- join state updates;
- participant roster updates;
- leave/remove state updates;
- Board/detail converge to current canonical participation state.

## CIRCLE privacy invariant

Additional live check:

- the Idea configured for `СВОЙ КРУГ` was exercised;
- authorized/invited participant flow works;
- the same private Idea is not visible from another unrelated account.

This supports the approved Artifact Collaboration visibility boundary:

`CIRCLE = author / current INVITED / current JOINED / Owner Admin`

No new visibility rule is introduced by this evidence.

## Visual evidence supplied during acceptance

The owner supplied live desktop captures showing:

- Board invitation indicator;
- invited Artifact detail with join decision;
- joined roster/state;
- participant leave control;
- Board visibility from another account.

## Verdict

```text
BQA-24  PASS
BQA-25  PASS
BQA-26  PASS
BQA-28  PASS
CIRCLE outsider privacy  PASS
owner live acceptance    PASS
```

Artifact Collaboration corrective has satisfied live acceptance and may proceed to G8 closure.
