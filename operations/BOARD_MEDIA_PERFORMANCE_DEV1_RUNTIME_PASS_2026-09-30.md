---
artifactId: dementor-club.operations.board-media-performance-dev1-runtime-pass-2026-09-30
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: PASS
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
result: dementor-club.result.board-media-performance-v1
workerCandidate: 834bb9776c4e99bb73556c4776c49f270fe70a6c
---

# Board / Media Performance v1 — DEV1 DB runtime PASS

## Exact candidate

```text
branch
worker/board-media-performance-v1-dev1-backend

HEAD
834bb9776c4e99bb73556c4776c49f270fe70a6c

candidate changed during proof
NO
```

## Local runtime

Runtime proof was executed on a disposable local Supabase stack.

Remote/main Supabase was not used for DDL or fixtures.

Exact validator:

`scripts/validate-artifact-participants-batch-read-local.mjs`

Exact migration:

`supabase/migrations/20260929175000_artifact_participants_batch_read_v1.sql`

Result:

```json
{
  "static_validation": "PASS",
  "baseline_base": "a24f8d900cc29e5ae922a9a62b751cc02e88f8d9",
  "baseline_n_plus_one_detected": true,
  "request_count": [
    {"ideas":1,"before_participant_requests":1,"after_batch_requests":1},
    {"ideas":5,"before_participant_requests":5,"after_batch_requests":1},
    {"ideas":20,"before_participant_requests":20,"after_batch_requests":1}
  ],
  "runtime_validation": "PASS_LOCAL_SUPABASE"
}
```

Runtime assertions PASS:

- zero IDs;
- one-ID shape/order equivalence with canonical single read;
- COMMUNITY;
- CIRCLE author;
- CIRCLE invited;
- CIRCLE joined;
- outsider hidden CIRCLE;
- missing Artifact omission;
- LEFT / REMOVED / DECLINED exclusion;
- N IDs;
- no cross-Artifact leakage;
- display-name fallback;
- duplicate-ID dedupe;
- max-50 guard.

## Fresh-bootstrap caveat

The local stack exposed three pre-existing fresh-bootstrap assumptions that are not caused by DEV1:

1. `20260827212614_secure_legacy_edu_archive.sql` assumes `legacy_edu.profiles` exists;
2. `20260828170411_dc_workspace_readonly_v01.sql` assumes two historical profile UUIDs already exist;
3. `public.handle_new_user()` exists on fresh bootstrap but the historical `auth.users` insert trigger is absent.

For disposable runtime proof only:

- a local-only legacy profile fixture was used before the archive migration;
- two local-only historical owner profiles were used before the workspace seed migration;
- the historical auth→profile trigger was installed directly in the disposable local DB.

The local-only migration fixture files were deleted from the worktree before the exact validator run.

No DEV1 candidate file was changed.

## Integration

Frozen DEV1 artifacts were copied byte-for-byte into:

`result/board-media-performance-v1`

Blob equivalence:

```text
migration
d3c57599e9d40092e3c45a8b7a1add7fdb576ed1
MATCH

validator
0637aba37056f44ec5d0c5c6661f4f6e30d10990
MATCH
```

## Verdict

```text
DEV1 static validation  PASS
DEV1 local DB runtime   PASS_LOCAL_SUPABASE
remote Supabase         NOT USED
backend artifacts       INTEGRATED
Board adapter           PENDING
G5 overall              PENDING ADAPTER + FULL EXACT-HEAD CI
```
