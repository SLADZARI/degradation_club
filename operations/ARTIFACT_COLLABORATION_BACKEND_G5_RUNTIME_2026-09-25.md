---
artifactId: dementor-club.evidence.artifact-collaboration-backend-g5-runtime-2026-09-25
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: PASS_BACKEND_RUNTIME
version: 1.0
updated: 2026-09-25
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
integrationBranch: result/artifact-collaboration-v1
integrationHeadTested: 47d1286379615962208ba43120bf409af00c5361
prehistoryFixtureCommit: e58edb6a931c8536a7ed4cbe907d0b38c5ba4c9e
observedProductionOverlayCommit: 95b33bdb9e51376cd28b9eecac63a2fcfb7dfe75
artifactMigrationBlob: b18b79b78643bd0509797ca1e621bf8f77edbdf3
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
costBoundary: NO_PAID_INFRASTRUCTURE
supersedesEvidence: operations/ARTIFACT_COLLABORATION_BACKEND_G5_MIGRATION_HISTORY_REPLAY_BLOCKER_2026-09-24.md
---

# Artifact Collaboration v1 — Backend G5 runtime evidence

## Verdict

DEV1 backend G5 runtime validation: **PASS** against an observed-production-compatible local Supabase target.

This evidence closes the prior historical migration replay blocker for the backend validation lane.

It does **not** enter G6, authorize production merge/deploy, or claim frontend/browser acceptance.

## Exact tested source

Integration branch:

`result/artifact-collaboration-v1`

Exact source head:

`47d1286379615962208ba43120bf409af00c5361`

Artifact Collaboration migration:

`supabase/migrations/20260924002500_artifact_collaboration_v1.sql`

Migration blob:

`b18b79b78643bd0509797ca1e621bf8f77edbdf3`

Historical migration blobs remained unchanged:

- `20260827212520` → `ad1e8762167dc1a01f023b70247abdbff808bde7`
- `20260827212614` → `c69bbdfdb8e5e00f6a3b569e925349e15a5076ce`
- `20260828170411` → `6d313eda5d8fa23713e2186dac0f39317d4f28d1`
- `20260924002500` → `b18b79b78643bd0509797ca1e621bf8f77edbdf3`

## Production-compatible local validation chain

Canonical validation chain used:

```text
PREHISTORY REPLAY FIXTURE
→ tracked migrations through 20260921134959
→ OBSERVED PRODUCTION COMPATIBILITY OVERLAY
→ exact observed production structural baseline
→ 20260924002500 Artifact Collaboration
```

The prehistory fixture remains the versioned local-only fixture introduced at:

`e58edb6a931c8536a7ed4cbe907d0b38c5ba4c9e`

The observed-production compatibility overlay remains validation-only state introduced at:

`95b33bdb9e51376cd28b9eecac63a2fcfb7dfe75`

It is not semantic authority, not a production repair, and not a replacement for tracked migration history.

## Structural baseline proof

Before overlay:

```text
parts = 1292
md5   = 55e1ea1b2484f4d4516f47c06313f27b
status = PASS
```

After overlay:

```text
parts = 1291
md5   = beb6fcdf35c889bfa37fd1d725507b7e
exact_observed_production_compatibility = PASS
```

The hard fingerprint guard was not weakened.

## Artifact Collaboration migration execution

Full clean local replay applied in order:

- ephemeral prehistory fixture;
- all tracked migrations through `20260921134959`;
- ephemeral observed-production overlay `20260924002459`;
- Artifact Collaboration `20260924002500`.

Database replay proof: **PASS**.

Artifact migration history entry: **PASS**.

The unrelated observed-production drift surfaces remained compatible after Artifact Collaboration: **PASS**.

Specifically:

- `join_applications_auth_insert` remained absent;
- `dc_merch_public_read` remained in observed-production form;
- seven unrelated observed-production function definitions were not mutated;
- the three functions intentionally owned by Artifact Collaboration were replaced by Artifact Collaboration definitions.

## Repeatability

Second clean reset/replay: **PASS**.

Compatibility overlay replayed: **PASS**.

Target migration history re-established: **PASS**.

Database remained reachable after reset: **PASS**.

## Local CLI restart warning

Both full `supabase db reset --local` runs completed database migration replay but the CLI reported:

```text
Restarting containers...
Error status 502
```

This is recorded as:

`WARN_502`

It is not treated as a migration PASS by itself.

The validator continued only after direct local Postgres proof established:

- database reachable;
- compatibility overlay migration applied;
- Artifact Collaboration migration applied.

Therefore the warning is a local service-health / CLI restart warning, not a database replay blocker.

It remains a tooling caveat for later local-environment cleanup but does not invalidate the backend SQL/runtime evidence.

## G5 runtime matrix

```text
Owner Admin authority                  PASS
RPC positive: publish CIRCLE Idea      PASS
RLS negative: outsider CIRCLE          PASS
CIRCLE no-oracle                       PASS
RPC negative                           PASS
participation invite/join RPC          PASS
participant roster read                PASS
Owner Admin slot grants                PASS
Relations create/delete                PASS
Owner Admin relation delete            PASS
Storage/privacy                        PASS
slot ceiling → release → republish     PASS
```

The matrix proves the approved backend contract locally against the observed-production-compatible baseline.

## Cleanup

Temporary local replay workspace: removed.

No local fixture or overlay file was permanently materialized into `supabase/migrations/`.

## Gate truth

```text
G4 backend owner contract              PASS
G5 backend static contract             PASS
G5 production-compatible baseline      PASS
G5 Artifact SQL execution              PASS
G5 repeatability                       PASS
G5 backend runtime matrix              PASS
local CLI post-reset service restart   WARN_502 (DB proof PASS)
overall Result G5 integration          NOT CLOSED BY THIS EVIDENCE
G6                                     NOT ENTERED
```

## Remaining contract gaps

This DEV1 evidence does not prove:

- DEV2/frontend acceptance;
- full integration-branch CI completion;
- desktop/mobile browser flow acceptance for the complete Result;
- G6 integration validation;
- release candidate construction from the then-current production baseline;
- production migration/apply;
- production merge/deploy;
- live production acceptance.

Tracked-history versus live-production drift reconciliation remains a separate post-Result task and is not resolved by the validation overlay.

## Boundaries

```text
LIVE SUPABASE APPLY = NO
PAID INFRASTRUCTURE = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
G6 = NOT ENTERED
```

DEV1 backend G5 runtime lane stops here.
