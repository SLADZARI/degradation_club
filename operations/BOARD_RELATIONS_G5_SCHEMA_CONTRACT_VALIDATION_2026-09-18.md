---
artifactId: dementor-club.evidence.board-relations-g5-schema-contract-validation-2026-09-18
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: APPROVED_EVIDENCE
version: 1.0
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-relations-v1
candidateCommit: 980c83e26d16219a04254a480671e20de77fe1bb
integrationPullRequest: 225
validationRunId: 35321118124
validationConclusion: SUCCESS
liveDatabaseMutation: false
productionMutation: false
---

# Board Relations v1 — G5 schema contract validation

## Verdict

**SCHEMA CONTRACT PASS**

Exact validated integration head:

`980c83e26d16219a04254a480671e20de77fe1bb`

Draft staging PR:

`#225 — result/board-relations-v1 → dementor-club-site`

Site Integrity:

`run #1205 / 35321118124 = SUCCESS`

No merge was performed.

## Exact branch diff

The validated head is exactly one commit ahead of integration baseline
`61d85d95bd95dfb536acdd363b45d2773a4b2ca5` and changes only:

- `supabase/migrations/20260918094000_board_relations_v1.sql` — new;
- `scripts/validate-board-relations-v1.mjs` — new;
- `.github/workflows/site-integrity.yml` — validator wiring only.

No Board runtime/UI files changed.

## Migration contract

The branch-only migration creates the dedicated relation owner:

`public.dc_board_relations`

Persisted relation types are exactly:

- `RELATED_TO`
- `RESULT_OF`
- `CONTINUES`
- `ABOUT`
- `REPORT_OF`

Supported endpoint kinds are exactly:

- `artifact`
- `event`
- `program`

`PARTICIPATES_IN` remains projection-only and is not persisted.

The row contains relation identity plus creator/time and logical-delete actor/time only. No relation status, archive lifecycle, restore workflow or moderation state is introduced.

Integrity includes:

- self-edge rejection;
- exact relation type × endpoint matrix;
- normalized unordered storage for `RELATED_TO`;
- one active logical edge partial unique index;
- soft-delete audit integrity;
- no reverse rows.

## RPC / authorization contract

Public server API is limited to:

- `dc_board_relations_read_v1()`;
- `dc_board_relation_create_v1(text,text,text,text,text)`;
- `dc_board_relation_delete_v1(uuid)`.

No generic UPDATE RPC exists.

Mutation actor is server-derived from `auth.uid()`.

Directional create/delete authorization is based only on canonical origin management.

`RELATED_TO` alone uses the scoped symmetric exception: Owner Admin or legitimate management of either endpoint.

Event/Program non-admin mutation requires all of:

- active Membership;
- system `dementor` role;
- exact scoped `dc_entity_assignments`;
- `role='dementor'`;
- `status='active'`;
- `provenance_status='confirmed'`;
- valid time window.

`dc_can_read_entity()`, generic assignment, `author`, read visibility and global Dementor alone do not authorize writes.

## RLS / Data API boundary

- RLS enabled on `dc_board_relations`;
- table privileges revoked from `public`, `anon`, `authenticated`;
- browser direct INSERT/UPDATE/DELETE is not exposed;
- intended RPC EXECUTE is granted only to `authenticated` after explicit revoke;
- physical relation DELETE is not exposed;
- logical deletion writes only `deleted_at/deleted_by`.

## Read model privacy

The read RPC returns active persisted relation truth only:

- relation id/type;
- canonical origin tuple;
- canonical target tuple;
- created_at.

It does not return `created_by` or `deleted_by`.

It does not read or synthesize from:

- `event_registrations`;
- `course_enrollments`;
- `PARTICIPATES_IN`.

## Slug rename guard

The Event/Program guard checks references to the old canonical
`(entity_type, slug)` tuple across all relation audit rows.

There is no `deleted_at` filter; therefore active and soft-deleted references both block a silent rename.

Controlled rename remains a separate migration procedure. No alias registry is introduced.

## Static contract evidence

Site Integrity validator output at 2026-09-18T07:47:18Z:

```text
Board Relations v1 schema contract PASS
RELATED_TO reverse-normalization fixture PASS
PARTICIPATES_IN generic persistence rejection fixture PASS
Directional origin-only authorization static contract PASS
```

The complete Site Integrity job, including existing browser regression, finished SUCCESS.

## Live DB boundary evidence

After the branch commit and PR creation:

- `dementor-club-production` remained exactly at `2dae3b6ece79652c81af780c049521fda7262726`;
- `dementor-club-site` remained exactly at `61d85d95bd95dfb536acdd363b45d2773a4b2ca5`;
- production Supabase migration ledger remained **56** migrations;
- production Supabase max migration remained `20260916213500_evidence_hygiene_v1`;
- `public.dc_board_relations` was absent;
- all three proposed Board Relations RPCs were absent.

Therefore:

```text
WRITE + VALIDATE MIGRATION IN BRANCH = COMPLETE
LIVE DB APPLY = NOT PERFORMED
STAGING MERGE = NOT PERFORMED
PRODUCTION MERGE = NOT PERFORMED
PRODUCTION / PAGES DEPLOY = NOT PERFORMED
RUNTIME / UI INCREMENT = NOT PERFORMED
```

## Gate consequence

Schema/RPC/RLS branch contract is validated.

Result remains **ACTIVE / G5_BUILD**.

Runtime adapter + canvas/detail implementation requires a separate explicit owner authorization.
