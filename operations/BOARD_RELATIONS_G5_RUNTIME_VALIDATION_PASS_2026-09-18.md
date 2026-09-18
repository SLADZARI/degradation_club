---
artifactId: dementor-club.evidence.board-relations-g5-runtime-validation-pass-2026-09-18
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: VALIDATION_EVIDENCE
version: 1.0
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-relations-v1
candidateCommit: 20aa71c1db76cbe238c96587523012ecdec7d46f
validationRunId: 35332109233
validationRunNumber: 1222
validationConclusion: SUCCESS
liveDatabaseMutation: false
productionMutation: false
---

# Board Relations v1 — G5 runtime validation PASS

## Verdict

**G5 RUNTIME CONTRACT PASS**

Exact runtime candidate:

`20aa71c1db76cbe238c96587523012ecdec7d46f`

Exact Site Integrity:

`#1222 / 35332109233 = SUCCESS`

## Corrective scope

The final corrective reused the existing drag suppression contract in the canonical deep-link history owner only:

`community/board/board-deeplink-auth-return-v1.js`

```js
if(Number(card.dataset.boardJustDragged||0)>Date.now()-650)return;
```

No helper/refactor was introduced.

No changes were made to:

- `board-own-drag-livefix-v2-2.js`;
- `board-spatial-v1.js`;
- `board-layout-v2.js`;
- `board-fullscreen-v2-1.js`;
- `board-relations-v1.js`;
- permission/RLS;
- overlay/z-index/pointer-events.

The current Relations browser validator was extended with direct evidence that canonical drag leaves both:

```text
boardArtifactOpen absent
focus != artifact:<dragged-id>
```

## Targeted validation

Static contracts on exact candidate:

```text
Board Relations v1 runtime contract       PASS
Board deep-link auth-return contract      PASS
```

Board Relations browser acceptance:

```text
filter visibility                         PASS
canonical drag suppression                PASS
no stale focus after drag                 PASS
relation line follows canonical drag      PASS
create success                            PASS
permission reject                         PASS
delete                                    PASS
mobile/fullscreen                         PASS
RPC unavailable                           PASS
invalid payload fail-closed               PASS
```

Canonical job log confirms:

```text
Board Relations v1 browser acceptance PASS
- create/delete + permission reject fixtures PASS
- mobile/fullscreen PASS
- RPC unavailable + invalid payload fail-closed PASS
```

## Full Site Integrity

`#1222 / 35332109233`

Result:

`SUCCESS`

All workflow steps completed successfully, including the later deep-link browser acceptance, Board movable-card share acceptance, shell/workspace recovery, history, WebKit auth regression, route manifest and production release gate.

## Boundary proof

After the successful exact-head run:

```text
integration head:
20aa71c1db76cbe238c96587523012ecdec7d46f

dementor-club-site:
61d85d95bd95dfb536acdd363b45d2773a4b2ca5
UNCHANGED / UNMERGED

dementor-club-production:
2dae3b6ece79652c81af780c049521fda7262726
UNCHANGED

PR #225:
OPEN / DRAFT / UNMERGED
head = 20aa71c1db76cbe238c96587523012ecdec7d46f
```

Live Supabase remains unchanged:

- migration count: 56;
- max migration: `20260916213500_evidence_hygiene_v1`;
- `public.dc_board_relations`: absent;
- `dc_board_relations_read_v1()`: absent;
- `dc_board_relation_create_v1(...)`: absent;
- `dc_board_relation_delete_v1(uuid)`: absent.

Therefore:

```text
live DB unchanged
staging unmerged
production unchanged
PR #225 OPEN / DRAFT / UNMERGED
```

## Gate consequence

Runtime validation is complete for G5.

```text
runtimeValidationStatus = PASS
blockingGate = null
runtimeValidationBlocker = null
gateReadiness = READY_FOR_NEXT_GATE
```

No Supabase apply, staging merge, production merge, deploy, or next-gate work is authorized by this evidence.
