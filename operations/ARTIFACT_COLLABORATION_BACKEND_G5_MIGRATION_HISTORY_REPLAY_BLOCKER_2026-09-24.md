---
artifactId: dementor-club.evidence.artifact-collaboration-backend-g5-migration-history-replay-blocker-2026-09-24
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: BLOCKED
version: 1.0
updated: 2026-09-24
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
productionBaseCommit: df8a24eca2bcca25339f128c7da93982515cf442
integrationBranch: result/artifact-collaboration-v1
integrationHeadTested: b3410377c908db833a480c2425e7681100f6077d
backendCandidateCommit: 3522993d6796fe9dae81a0c7dbde1ddcc1aa350a
liveDatabaseMutationAuthorized: false
costBoundary: NO_PAID_INFRASTRUCTURE
supersedesEvidence: operations/ARTIFACT_COLLABORATION_BACKEND_G5_LOCAL_STACK_BLOCKER_2026-09-24.md
---

# Artifact Collaboration v1 — G5 historical migration replay blocker

## Verdict

The free local Supabase execution path is now available and starts correctly.

The current blocker is no longer Docker/Supabase CLI availability.

The clean local database cannot replay the production migration chain because an already-applied historical migration assumes pre-migration EDU schema state that is absent on a clean database.

Therefore the required production-compatible local schema cannot currently be reproduced from the repository migration chain alone.

Per owner instruction: STOP. Do not substitute live production, paid branching, another project, or unversioned bootstrap state.

## Local environment evidence

User machine:

- Docker 29.2.1;
- Supabase CLI 2.75.0;
- Docker daemon running;
- standard Supabase local images already available.

Exact checked-out integration head:

`b3410377c908db833a480c2425e7681100f6077d`

Artifact Collaboration migration exists locally:

`supabase/migrations/20260924002500_artifact_collaboration_v1.sql`

The backend migration and static validator are byte-identical to backend candidate `3522993d...`:

- migration blob: `b18b79b78643bd0509797ca1e621bf8f77edbdf3`;
- validator blob: `c9b528967d41c4424901ef6b32857f5bd4d6918b`.

The extra commit from `3522993d...` to `b3410377...` changes frontend/UI/workflow files only and does not mutate the backend migration contract.

## Local stack startup

After stopping the unrelated local INbetweenME Supabase stack, Dementor Club local Supabase starts database initialization and begins replaying repository migrations.

Observed sequence:

1. `20260827212520_archive_edu_and_create_dementor_core.sql`
2. `20260827212614_secure_legacy_edu_archive.sql`

The first migration succeeds on the clean database with notices that old EDU tables do not exist.

The second migration fails:

```text
ERROR: relation "legacy_edu.profiles" does not exist (SQLSTATE 42P01)

alter table legacy_edu.profiles enable row level security
```

Artifact Collaboration migration is never reached.

## Exact root cause

Historical migration:

`20260827212520_archive_edu_and_create_dementor_core.sql`

contains:

```sql
alter table if exists public.profiles set schema legacy_edu;
```

On production in August 2026, `public.profiles` existed from the former EDU system, so it was archived into:

`legacy_edu.profiles`.

On a clean local Supabase database there is no pre-existing EDU `public.profiles`, therefore the `IF EXISTS` statement is a no-op.

The next historical migration:

`20260827212614_secure_legacy_edu_archive.sql`

contains an unconditional:

```sql
alter table legacy_edu.profiles enable row level security;
```

Therefore clean migration replay fails.

## Production read-only confirmation

Live production was queried read-only only.

Production currently contains the archived EDU table:

`legacy_edu.profiles`

together with the other archived EDU tables.

This proves the historical production migration ran against pre-existing schema state that is not represented by the current repository migration chain.

No production mutation was made.

Production migration head remains:

`20260921134959_public_activity_truth_boundary_v1`

## Existing-before-new / collision check

The production migration file is unchanged on `dementor-club-production`.

No canonical local bootstrap or replay repair was found in the current Result branch.

The historical branch name `agent/community-board-migration-history-align` does not provide the missing migration file through current repository contents and is not a canonical authority for mutating already-applied production history.

The blocker must not be "fixed" by silently editing an already-applied migration or inventing unversioned local legacy tables inside Artifact Collaboration v1.

## Validation truth

```text
free local Supabase stack                 PASS
Docker/local DB startup                   PASS
repository migration replay               FAIL (historical pre-state)
Artifact Collaboration migration execution NOT REACHED
rollback/reset proof                      NOT RUN
repeatability proof                       NOT RUN
RPC positive/negative                     NOT RUN
RLS matrix                                NOT RUN
CIRCLE runtime no-oracle                  NOT RUN
Storage ACL runtime                       NOT RUN
G6                                        NOT ENTERED
```

This is not evidence that `20260924002500_artifact_collaboration_v1.sql` fails.

It is evidence that the repository cannot currently construct the production-compatible baseline required to test it.

## Required decision / unblock

A canonical, reusable solution is required outside the semantics of Artifact Collaboration v1, for example an approved production-baseline bootstrap or migration-history reconciliation that can reconstruct the exact pre-Artifact schema locally without changing production meaning.

Until such a canonical replay path exists, DEV1 must not:

- edit historical applied migrations ad hoc;
- inject a one-off local `legacy_edu.profiles` table;
- use production as test DB;
- use a paid Supabase branch;
- use another unrelated Supabase project.

## STOP boundary

```text
G5 = BLOCKED
LIVE SUPABASE APPLY = NO
PAID INFRASTRUCTURE = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
```

DEV1 stops at exact historical migration replay blocker.
