---
artifactId: dementor-club.result.artifact-collaboration-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: REVIEW
workStatus: ACTIVE
version: 0.7
updated: 2026-09-25
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.6
parentDecision: dementor-club.decision.artifact-collaboration-v1
integrationBranch: result/artifact-collaboration-v1
integrationHeadTested: 0d968f7b9d468c87ca95e1f8d1413ea66b383b8c
productionBaseCommit: df8a24eca2bcca25339f128c7da93982515cf442
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
costBoundary: NO_PAID_INFRASTRUCTURE
g4BackendStatus: PASS
g5BackendStaticStatus: PASS
g5SqlExecutionStatus: PASS_LOCAL_OBSERVED_PRODUCTION_COMPATIBLE_REPLAY
g5BackendRuntimeStatus: PASS
g5RelationDeleteCapabilityStatus: PASS
g5RepeatabilityStatus: PASS
g5LocalServiceHealthStatus: WARN_POST_RESET_RESTART_502_DB_PROVEN
g5BackendRuntimeEvidence: operations/ARTIFACT_COLLABORATION_BACKEND_G5_RELATION_DELETE_CAPABILITY_2026-09-25.md
prehistoryFixtureCommit: e58edb6a931c8536a7ed4cbe907d0b38c5ba4c9e
observedProductionOverlayCommit: 95b33bdb9e51376cd28b9eecac63a2fcfb7dfe75
artifactMigrationBlob: b596500ed3145ec1f352464c8609c38e02efbc05
siteIntegrityRun: 1271
siteIntegrityRunId: 36066783890
siteIntegrityConclusion: SUCCESS
gateReadiness: G5_BACKEND_FINAL_PASS_COORDINATOR_HANDOFF
---

# Artifact Collaboration v1 · Result v0.7

## Current state

DEV1 backend G5 is now **final PASS** for the authorized backend scope.

The last contract gap — server-authoritative delete capability in the canonical relation read projection — has been reconciled and revalidated.

Exact tested integration head:

`0d968f7b9d468c87ca95e1f8d1413ea66b383b8c`

Current tested Artifact Collaboration migration blob:

`b596500ed3145ec1f352464c8609c38e02efbc05`

The previous blob `b18b79b78643bd0509797ca1e621bf8f77edbdf3` is superseded as the current tested artifact.

The Result remains at `G5_BUILD`. This update does not enter G6.

## Final relation read contract

`dc_board_relations_read_v1()` now returns:

```text
relation_id
relation_type
origin_kind
origin_source_id
target_kind
target_source_id
created_at
can_delete
```

It does not expose relation creator identity.

The backend owns permission calculation through one canonical internal predicate shared with the delete RPC.

Proven capability outcomes:

- own `RELATED_TO` + current JOINED participant → `can_delete=true`;
- another participant's relation → `false`;
- creator LEFT → `false`;
- creator REMOVED → `false`;
- participant directional relation → `false`;
- canonical manager authority remains preserved;
- Owner Admin → `true`;
- unreadable endpoint → relation omitted from read projection.

## Production-compatible baseline

```text
tracked pre-overlay     1292 / 55e1ea1b2484f4d4516f47c06313f27b  PASS
observed production    1291 / beb6fcdf35c889bfa37fd1d725507b7e  PASS
```

The baseline guard remained exact.

## Replay and repeatability

`20260924002500_artifact_collaboration_v1.sql` with blob `b596500ed3145ec1f352464c8609c38e02efbc05`:

- first full replay: PASS;
- migration-history proof: PASS;
- second clean reset/replay: PASS;
- unrelated production-drift surfaces: PASS;
- temporary replay workspace cleanup: PASS.

The local Supabase post-reset service restart still produces `WARN_502`; direct DB proof confirms replay success.

## Runtime matrix

All prior backend G5 runtime checks remain PASS.

Additional final capability checks are PASS:

- `relation_read_can_delete_joined`;
- `relation_read_inaccessible_filtered`;
- `relation_read_owner_admin_true`;
- `relation_read_other_participant_false`;
- `relation_read_directional_participant_false`;
- `relation_manager_authority_preserved`;
- `relation_read_left_false`;
- `relation_read_removed_false`;
- `relation_delete_capability_alignment`.

Canonical evidence:

`operations/ARTIFACT_COLLABORATION_BACKEND_G5_RELATION_DELETE_CAPABILITY_2026-09-25.md`

## Branch CI

Site Integrity / Release Readiness:

```text
run       #1271
run id    36066783890
head      0d968f7b9d468c87ca95e1f8d1413ea66b383b8c
result    SUCCESS
```

This CI result is supporting evidence for the exact tested commit.

## Current gate truth

```text
G4 backend                              PASS
G5 backend static                       PASS
G5 production-compatible baseline       PASS
G5 Artifact migration execution         PASS
G5 backend repeatability                PASS
G5 backend runtime matrix               PASS
G5 relation delete capability           PASS
DEV1 backend authorized scope           PASS / STOP

overall Result gate                      G5_BUILD
G6                                      NOT ENTERED
```

## Boundaries

No live Supabase apply was performed.

No production merge or deploy was performed.

No paid infrastructure was used.

No frontend change was made by this reconciliation.

```text
LIVE SUPABASE APPLY = NO
PAID INFRASTRUCTURE = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
G6 = NOT ENTERED
```

DEV1 stops here.
