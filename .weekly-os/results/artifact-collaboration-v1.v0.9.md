---
artifactId: dementor-club.result.artifact-collaboration-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G6_VALIDATION
status: ACTIVE
workStatus: ACTIVE
version: 0.9
updated: 2026-09-25
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.8
parentDecision: dementor-club.decision.artifact-collaboration-v1
integrationBranch: result/artifact-collaboration-v1
integrationHeadTested: 5769fb10a19fbc2fe492d0b706f07d35df5e8be6
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
siteIntegrityRun: 1306
siteIntegrityRunId: 36183292073
siteIntegrityConclusion: SUCCESS
gateReadiness: READY_FOR_CLEAN_G7_RELEASE_CANDIDATE_PREPARATION
g5FinalStatus: PASS
g5FrontendBrowserStatus: PASS
g5BackendFreezeStatus: PASS
g5FinalEvidence: operations/ARTIFACT_COLLABORATION_G5_FINAL_VALIDATION_2026-09-25.md
backendFreezeBaseCommit: 0d968f7b9d468c87ca95e1f8d1413ea66b383b8c
backendFreezeFinalCommit: 5769fb10a19fbc2fe492d0b706f07d35df5e8be6
backendFreezeSupabaseTree: f6c63692673c93443de7a13698d51f44dc3394d8
candidateCommit: 5769fb10a19fbc2fe492d0b706f07d35df5e8be6
g6Status: PASS
g6Evidence: operations/ARTIFACT_COLLABORATION_G6_2026-09-25.md
g6ValidationRun: 1306
g6ValidationRunId: 36183292073
g6ValidationConclusion: SUCCESS
g6DiffFileCount: 31
g7ReleaseAuthorized: false
---

# Artifact Collaboration v1 · Result v0.9

## Current state

Artifact Collaboration v1 has entered G6 Validation and the exact candidate has passed the G6 acceptance review.

```text
production baseline  df8a24eca2bcca25339f128c7da93982515cf442
candidate            5769fb10a19fbc2fe492d0b706f07d35df5e8be6
Site Integrity       #1306 / 36183292073
G6                   PASS
```

G6 evidence:

`operations/ARTIFACT_COLLABORATION_G6_2026-09-25.md`

The production baseline is still current, the candidate has no inherited staging divergence, and the production→candidate diff is fully understood.

Canonical responsive ownership remains:

```text
Desktop
→ inline Relations

Mobile IDEA
→ Artifact detail
→ existing Artifact-detail Relations owner
```

Backend freeze remains intact and the Artifact Collaboration migration blob remains:

`b596500ed3145ec1f352464c8609c38e02efbc05`

**G7 is not entered by this update.**

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

Final Site Integrity / Release Readiness:

```text
run       #1306
run id    36183292073
head      5769fb10a19fbc2fe492d0b706f07d35df5e8be6
result    SUCCESS
```

The exact final commit passed the full required Site Integrity chain, including Artifact Collaboration browser acceptance, Board Relations browser acceptance, deeplink/auth-return and the production artifact release gate.

## Current gate truth

```text
G5 final evidence                       PASS
G6 production diff boundary             PASS
G6 migration / RPC / RLS matrix         PASS
G6 COMMUNITY / CIRCLE matrix            PASS
G6 Storage / Share / Relations          PASS
G6 slot / Telegram / Public Activity    PASS
G6 desktop / mobile browser             PASS
G6 duplicate-owner review               PASS
G6 full exact-candidate CI               PASS

overall Result gate                     G6_VALIDATION
G6 status                               PASS
gate readiness                          READY FOR CLEAN G7 RELEASE CANDIDATE PREPARATION
G7                                      NOT ENTERED
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
