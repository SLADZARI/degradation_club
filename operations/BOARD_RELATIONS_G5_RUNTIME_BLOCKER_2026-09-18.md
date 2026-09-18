---
artifactId: dementor-club.evidence.board-relations-g5-runtime-blocker-2026-09-18
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: BLOCKER_EVIDENCE
version: 1.0
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-relations-v1
candidateCommit: cc8b2f51ca9dc1f4bdc53dd0210834404bc8ef1c
validationRunId: 35327830885
validationRunNumber: 1218
validationConclusion: FAILURE
blockingStep: 48
liveDatabaseMutation: false
productionMutation: false
---

# Board Relations v1 — G5 runtime blocker

## Verdict

**G5 RUNTIME CONTRACT BLOCKED**

Exact candidate:

`cc8b2f51ca9dc1f4bdc53dd0210834404bc8ef1c`

Site Integrity:

`#1218 / 35327830885 = FAILURE`

Static/runtime contract steps passed, but browser acceptance step 48 failed.

## Exact failing assertion

Step:

`48 — Validate Board Relations v1 browser acceptance`

Exact runtime evidence:

```text
Error: desktop drag: canonical drag opened Artifact detail or missed drag marker
{"dragged":"1789722572376","overlay":"1","overlayHidden":false,"overlaySrc":"/community/artifact/11111111-1111-4111-8111-111111111111/"}
```

Interpretation:

- canonical drag marker was present;
- the Artifact card did move;
- the Artifact fullscreen/detail overlay nevertheless opened;
- the failure is therefore the drag → click/detail suppression boundary, not relation identity, relation persistence, schema, or endpoint mapping.

## Repeated-cause stop condition

The exact candidate commit is:

`test(board-relations): expose unexpected drag overlay source`

Its diff only adds `overlayHidden` and `overlaySrc` diagnostics around the same existing drag assertion; it does not change the underlying interaction contract.

The #1218 failure reproduces that same underlying issue with the added diagnostics.

Per owner instruction:

```text
same failure / same cause repeated
→ STOP
→ no further architecture changes
→ no additional owner/detail shell
→ blocker evidence instead of another fix loop
```

No further runtime code change is authorized by this checkpoint.

## What passed before the blocker

On exact candidate `cc8b2f51...`:

- Board Relations schema contract: PASS;
- Board Relations runtime static contract: PASS;
- canonical shell/build/JS syntax: PASS;
- Board mobile harmonization: PASS;
- public harmonization: PASS;
- Projects browser regression: PASS;
- DC-9 sync browser regression: PASS;
- Board v2.1 fullscreen browser matrix: PASS;
- Board live corrective browser acceptance: PASS;
- Board navigation/adaptive-card acceptance: PASS.

The blocker is isolated to the relation browser acceptance drag interaction assertion.

## Boundaries

After the failed validation:

- `dementor-club-production` remains exactly `2dae3b6ece79652c81af780c049521fda7262726`;
- `dementor-club-site` remains exactly `61d85d95bd95dfb536acdd363b45d2773a4b2ca5`;
- live Supabase migration ledger remains 56 migrations;
- live Supabase max migration remains `20260916213500_evidence_hygiene_v1`;
- `public.dc_board_relations` is absent live;
- Board Relations read/create/delete RPCs are absent live;
- PR #225 remains open and unmerged.

Therefore:

```text
LIVE DB UNCHANGED
STAGING UNMERGED
PRODUCTION UNCHANGED
PR #225 UNMERGED
```

## Gate consequence

Result remains **ACTIVE / G5_BUILD**, blocked at runtime browser validation.

Do not proceed to live DB apply, staging merge, production merge, deploy, or G6 release path.

Next work requires an explicit owner decision on how to resolve the canonical drag/detail suppression blocker without introducing parallel ownership.
