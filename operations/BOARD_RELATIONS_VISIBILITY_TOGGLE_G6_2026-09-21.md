---
artifactId: dementor-club.operations.board-relations-visibility-toggle-g6-2026-09-21
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.board-relations-visibility-toggle-v1
parentIssue: 228
scope: BQA-16
productionBaseline: 354d7ea9b176b55f2d4386b178f61cd9cd0e68ef
candidateCommit: 3a017d75271578089d5b108375b03c73dcf7832c
pullRequest: 232
validationRunId: 35643952922
validationRunNumber: 1227
validationConclusion: SUCCESS
---

# STAB-03 · Board Relations visibility toggle · G6 validation

## Verdict

```text
G6 VALIDATION PASS
VALIDATED CANDIDATE
```

No production merge or deploy is authorized by this evidence.

## Authority / scope

Result:
`board-relations-visibility-toggle-v1`

Scope:
`STAB-03 / BQA-16`

Canonical runtime owner:
`community/board/board-relations-v1.js`

Existing regression owner:
`scripts/validate-board-relations-runtime-browser.mjs`

No second visibility mechanism was created.

## Exact corrective

Confirmed production defect:

```js
svg.hidden = !relationsVisible;
```

Validated candidate uses the existing hidden-attribute contract:

```js
svg.toggleAttribute('hidden', !relationsVisible);
```

Individual relation-line visibility continues to use the existing `hidden` attribute contract.

## Targeted browser regression

Exact CI step:

`Validate Board Relations v1 browser acceptance`

Exact output:

```text
Board Relations v1 browser acceptance PASS
- desktop endpoint mapping + relation canvas/detail PASS
- Course/Practice → Program normalization PASS
- visibility toggle hide/show + relation identity preservation PASS
- filter + toggle composition + canonical drag line updates PASS
- refresh resets current ephemeral visibility state PASS
- create/delete + permission reject fixtures PASS
- mobile 390/360 + fullscreen PASS
- RPC unavailable + invalid payload fail-closed PASS
```

Validated behavior:
- visible → hide;
- hide → show;
- same relation line identities restore;
- relation data is not re-read/mutated by presentation toggle;
- filters compose with hidden parent layer;
- drag/layout reconciliation remains valid;
- refresh resets to current ephemeral visible default;
- desktop Chromium;
- mobile 390;
- mobile 360.

## Full Site Integrity

```text
Site Integrity / Release Readiness
run #1227
run id = 35643952922
head = 3a017d75271578089d5b108375b03c73dcf7832c
conclusion = SUCCESS
```

All workflow steps completed successfully, including:
- Board Relations schema/runtime contracts;
- built JavaScript syntax;
- Board mobile harmonization browser acceptance;
- Board v2.1 fullscreen browser state matrix;
- Board live corrective browser acceptance;
- Board navigation/adaptive cards browser acceptance;
- Board Relations v1 browser acceptance;
- Board deep-link auth-return;
- Board Share on movable own card;
- browser shell / Workspace recovery;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

## Exact production → candidate diff

Production remains:

`354d7ea9b176b55f2d4386b178f61cd9cd0e68ef`

Candidate:

`3a017d75271578089d5b108375b03c73dcf7832c`

```text
ahead = 3
behind = 0
changed files = exactly 2
```

Exact files:

1. `community/board/board-relations-v1.js`
2. `scripts/validate-board-relations-runtime-browser.mjs`

No migration, schema, RLS, relation ontology, permission, persistence, Artifact detail, Public Activity, Membership or Contribution files are present.

## Change control

```text
schema mutation = NO
semantic mutation = NO
Change Proposal = NO
backend migration = NO
RLS change = NO
relation type/schema change = NO
permission change = NO
persistence change = NO
```

## PR / production boundary

Draft PR #232:

```text
OPEN / DRAFT / UNMERGED
base = 354d7ea9b176b55f2d4386b178f61cd9cd0e68ef
head = 3a017d75271578089d5b108375b03c73dcf7832c
changed files = 2
```

Production is still exactly the original baseline.

## Gate

```text
VALIDATED CANDIDATE
READY FOR RELEASE DECISION
STOP
```

Do not merge/deploy and do not start STAB-04 without a separate owner decision.
