---
artifactId: dementor-club.operations.board-media-performance-dev1-backend-candidate-2026-09-29
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G4_DESIGN
status: STATIC_PASS_RUNTIME_PENDING
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentQa: BQA-27
workerLane: DEV1_BACKEND
workerBranch: worker/board-media-performance-v1-dev1-backend
baseCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
candidateCommit: 834bb9776c4e99bb73556c4776c49f270fe70a6c
productionMutation: false
liveDatabaseMutation: false
---

# Board / Media Performance — DEV1 backend candidate

## Verdict

```text
exact branch/head           PASS
exact base                  PASS
2-file worker boundary      PASS
canonical owner extension   PASS
static contract review      PASS
DB runtime validation       PENDING
production mutation         NONE
```

Candidate is accepted for later integration, but is not yet G5/G6 evidence.

## Exact identity

```text
branch  worker/board-media-performance-v1-dev1-backend
base    a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
head    834bb9776c4e99bb73556c4776c49f270fe70a6c
```

Exact diff:

1. `supabase/migrations/20260929175000_artifact_participants_batch_read_v1.sql`
2. `scripts/validate-artifact-participants-batch-read-local.mjs`

```text
+364 / -0
frontend files   0
weekly-os files  0
```

## Canonical ownership review

New RPC:

`dc_artifact_participants_batch_read_v1(uuid[])`

It reuses:

- `dc_artifact_participation_events`;
- `dc_can_read_artifact_v1()`;
- existing display-name fallback;
- existing current-state semantics.

It creates no:

- table;
- view;
- materialized view;
- cache;
- second participant state owner.

Therefore this is an extension of the existing Artifact Collaboration participation owner, not a parallel mechanism.

## Contract review

Static review confirms:

- authentication required;
- input bounded at 50 supplied IDs;
- NULL/empty input is supported;
- duplicate IDs are deduplicated while preserving first input order;
- unreadable/missing IDs are omitted through canonical ACL;
- only current `INVITED` and `JOINED` rows survive;
- terminal `LEFT / REMOVED / DECLINED` are filtered;
- output adds `artifact_id` and otherwise preserves the existing participant projection shape;
- participant order within each requested Artifact follows current-state timestamp + profile id;
- authenticated-only EXECUTE grant is explicit.

## Request-count target

Participant projection only:

| Ideas | Current | Batch candidate |
|---:|---:|---:|
| 1 | 1 RPC | 1 RPC |
| 5 | 5 RPC | 1 RPC |
| 20 | 20 RPC | 1 RPC |

For 20 Ideas the candidate removes 19 participant-read network calls.

This is a topology/request-count improvement. End-to-end latency improvement must still be measured after frontend integration.

## Runtime validator review

The validator contains fixtures/checks for:

- 0 / 1 / N IDs;
- comparison of one-ID batch output to canonical single read;
- COMMUNITY access;
- CIRCLE author;
- CIRCLE INVITED;
- CIRCLE JOINED;
- outsider hidden CIRCLE;
- missing ID omission;
- LEFT / REMOVED / DECLINED exclusion;
- cross-Artifact leakage;
- nickname display-name fallback;
- duplicate IDs;
- max-50 boundary.

It also cleans up its local fixtures.

## Evidence boundary

The developer correctly did not apply DDL or fixtures to production.

No local Supabase/Postgres runtime was available in that worker session, therefore:

```text
STATIC PASS != DB RUNTIME PASS
```

Required before integration can be treated as backend G5 PASS:

```text
apply candidate migration in disposable/local Supabase
→ run validate-artifact-participants-batch-read-local.mjs
→ receive PASS_LOCAL_SUPABASE
→ discard/reset disposable DB
```

## Worker status

```text
DEV1 CODE = STOP
candidate = FREEZE
integration = WAITING FOR CURRENT RESULT G8 + RUNTIME VALIDATION
```

DEV1 must not add frontend adapter code and must not apply this migration to live Supabase.
