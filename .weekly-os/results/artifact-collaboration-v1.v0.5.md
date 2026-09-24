---
artifactId: dementor-club.result.artifact-collaboration-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: REVIEW
workStatus: BLOCKED
version: 0.5
updated: 2026-09-24
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.4
parentDecision: dementor-club.decision.artifact-collaboration-v1
integrationBranch: result/artifact-collaboration-v1
integrationHeadTested: b3410377c908db833a480c2425e7681100f6077d
backendCandidateCommit: 3522993d6796fe9dae81a0c7dbde1ddcc1aa350a
productionBaseCommit: df8a24eca2bcca25339f128c7da93982515cf442
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
costBoundary: NO_PAID_INFRASTRUCTURE
g4BackendStatus: PASS
g5BackendStaticStatus: PASS
g5SqlExecutionStatus: BLOCKED_HISTORICAL_MIGRATION_REPLAY
g5BackendReplayBlockerEvidence: operations/ARTIFACT_COLLABORATION_BACKEND_G5_MIGRATION_HISTORY_REPLAY_BLOCKER_2026-09-24.md
gateReadiness: G5_BACKEND_STATIC_READY_BASELINE_REPLAY_BLOCKED
---

# Artifact Collaboration v1 · Result v0.5

## Current state

The free local Supabase path is available and operational.

Current blocker moved from local-runtime availability to historical migration replay.

Exact integration head tested locally:

`b3410377c908db833a480c2425e7681100f6077d`

Backend migration/validator content remains identical to backend candidate:

`3522993d6796fe9dae81a0c7dbde1ddcc1aa350a`

## What passed

- Docker local runtime;
- Supabase CLI local stack startup;
- exact Result branch checkout;
- Artifact Collaboration migration presence;
- static backend validator;
- no-oracle hardening;
- Owner Admin relation-delete authority correction.

## What failed before Artifact Collaboration migration

Clean local migration replay fails at:

`20260827212614_secure_legacy_edu_archive.sql`

because it unconditionally references:

`legacy_edu.profiles`

which existed in production only because the previous migration ran against pre-existing EDU schema state.

On a clean database the previous `ALTER TABLE IF EXISTS public.profiles SET SCHEMA legacy_edu` is a no-op.

Production read-only confirms `legacy_edu.profiles` exists there.

Therefore the repository migration chain alone cannot currently reproduce the production-compatible baseline.

## Gate truth

```text
G4 owner contract                    PASS
G5 static/backend contract           PASS
free local Supabase runtime          PASS
production-compatible baseline replay BLOCKED
Artifact Collaboration SQL execution NOT REACHED
RPC/RLS runtime matrix               NOT RUN
G6                                    NOT ENTERED
```

## Current blocker

Canonical evidence:

`operations/ARTIFACT_COLLABORATION_BACKEND_G5_MIGRATION_HISTORY_REPLAY_BLOCKER_2026-09-24.md`

This blocker supersedes the previous local-runtime blocker as the active DEV1 blocker.

## Stop boundary

Do not:

- alter already-applied historical migrations ad hoc;
- inject unversioned legacy tables locally;
- use live Supabase as a test target;
- use paid Supabase branches;
- merge/deploy production.

A canonical migration-history/bootstrap reconciliation is required before DEV1 can finish G5 runtime validation.
