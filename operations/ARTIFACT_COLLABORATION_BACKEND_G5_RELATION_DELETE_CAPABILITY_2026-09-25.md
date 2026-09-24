---
artifactId: dementor-club.evidence.artifact-collaboration-backend-g5-relation-delete-capability-2026-09-25
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: PASS_BACKEND_FINAL
version: 1.0
updated: 2026-09-25
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
integrationBranch: result/artifact-collaboration-v1
integrationHeadTested: 0d968f7b9d468c87ca95e1f8d1413ea66b383b8c
artifactMigrationBlob: b596500ed3145ec1f352464c8609c38e02efbc05
siteIntegrityRun: 1271
siteIntegrityRunId: 36066783890
siteIntegrityConclusion: SUCCESS
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
supersedesEvidence: operations/ARTIFACT_COLLABORATION_BACKEND_G5_RUNTIME_2026-09-25.md
---

# Artifact Collaboration v1 — Final G5 relation delete capability reconciliation

## Verdict

Final DEV1 backend G5 reconciliation: **PASS**.

The unreleased Artifact Collaboration migration was extended in place, then revalidated from the observed-production-compatible baseline.

No second production migration was created.

No frontend file was changed.

## Exact tested source

Integration branch:

`result/artifact-collaboration-v1`

Exact tested source head:

`0d968f7b9d468c87ca95e1f8d1413ea66b383b8c`

Artifact Collaboration migration:

`supabase/migrations/20260924002500_artifact_collaboration_v1.sql`

New tested migration blob:

`b596500ed3145ec1f352464c8609c38e02efbc05`

The previously tested blob `b18b79b78643bd0509797ca1e621bf8f77edbdf3` is historical evidence only and is no longer the current tested Artifact Collaboration migration.

## Exact read projection contract

Canonical RPC:

`public.dc_board_relations_read_v1()`

Projection:

```text
relation_id uuid
relation_type text
origin_kind text
origin_source_id text
target_kind text
target_source_id text
created_at timestamptz
can_delete boolean
```

The projection does **not** expose `created_by` or another private identity field for frontend permission calculation.

`can_delete` is computed server-side through:

`public.dc_can_delete_board_relation_v1(relation_id)`

The helper is internal and has no execute grant for public / anon / authenticated / service_role.

Both the read projection and `dc_board_relation_delete_v1` use the same backend predicate.

## Capability contract proven

### JOINED participant / own RELATED_TO

A current JOINED participant who created a readable `RELATED_TO` relation receives:

`can_delete = true`

and can delete that relation.

### Another participant relation

For another participant's `RELATED_TO`:

`can_delete = false`

and delete is rejected.

### LEFT

After the creator transitions to `LEFT`:

`can_delete = false`

and delete is rejected.

### REMOVED

After the creator transitions to `REMOVED`:

`can_delete = false`

and delete is rejected.

### Directional relation

Participant delete permission does not extend to directional relation types.

For the participant:

`can_delete = false`

Existing canonical manager authority remains preserved.

### Owner Admin

Owner Admin capability remains preserved:

`can_delete = true`

for a relation present in canonical read projection.

### Inaccessible relation

If either relation endpoint is not readable for the current viewer, the relation does not appear in `dc_board_relations_read_v1()`.

The read projection therefore does not reveal relation existence or creator identity as a permission oracle.

CIRCLE no-oracle remains preserved.

## Production-compatible replay

Pre-overlay tracked replay:

```text
parts = 1292
md5   = 55e1ea1b2484f4d4516f47c06313f27b
status = PASS
```

Observed-production compatibility baseline:

```text
parts = 1291
md5   = beb6fcdf35c889bfa37fd1d725507b7e
exact_observed_production_compatibility = PASS
```

Artifact migration replay:

```text
20260924002459 compatibility overlay   PASS
20260924002500 Artifact Collaboration  PASS
DB replay                              PASS
unrelated production-drift surfaces   PASS
```

Second clean reset/replay:

```text
second_full_reset          PASS
compatibility_overlay      PASS
db_replay_proven           PASS
```

The local Supabase CLI again emitted post-reset `502` service-restart warnings. Direct Postgres proof confirmed the target migrations had applied after both resets, so this remains `WARN_502`, not a SQL/replay failure.

## Full runtime matrix

```text
owner_admin_authority                         PASS
rpc_positive_publish_circle_idea              PASS
rls_negative_circle                           PASS
circle_no_oracle                              PASS
rpc_negative                                  PASS
participation_rpc                             PASS
rpc_positive_participants                     PASS
slots                                         PASS
relations                                     PASS
owner_admin_relation_delete                   PASS
storage_privacy                               PASS
slot_capacity_ceiling_release                 PASS

relation_read_can_delete_joined               PASS
relation_read_inaccessible_filtered           PASS
relation_read_owner_admin_true                PASS
relation_read_other_participant_false         PASS
relation_read_directional_participant_false   PASS
relation_manager_authority_preserved          PASS
relation_read_left_false                      PASS
relation_read_removed_false                   PASS
relation_delete_capability_alignment          PASS
```

## CI signal

Site Integrity / Release Readiness run:

`#1271 / run 36066783890`

Exact head:

`0d968f7b9d468c87ca95e1f8d1413ea66b383b8c`

Conclusion:

`SUCCESS`

This is supporting branch-level validation. It does not authorize G6, production merge, database apply, or deploy.

## Cleanup and boundaries

Temporary local replay workspace was removed.

```text
LIVE SUPABASE APPLY = NO
PAID INFRASTRUCTURE = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
G6 = NOT ENTERED
```

DEV1 backend G5 has no remaining contract gap in the authorized scope.
