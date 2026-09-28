---
artifactId: dementor-club.operations.supabase-prehistory-replay-fixture-v1
project: dementor-club
documentType: IMPLEMENTATION_CONTRACT
projectStage: BUILD
gate: G5_BUILD
status: APPROVED
version: 1.0
updated: 2026-09-24
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_COORDINATION
result: dementor-club.result.artifact-collaboration-v1
integrationBranch: result/artifact-collaboration-v1
costBoundary: NO_PAID_INFRASTRUCTURE
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
supersedes: DDL_ONLY_PREHISTORY_BOOTSTRAP_PROPOSAL
---

# Supabase Prehistory Replay Fixture v1

## Purpose

This contract exists only to make the repository's already-applied Supabase migration history reproducible in a clean **local** Supabase stack for G5 validation.

It does not change Artifact Collaboration semantics and does not change production meaning.

Canonical replay model:

```text
SCHEMA PRE-STATE
+ MINIMAL SYNTHETIC AUTH IDENTITY PRE-STATE
+ AUTH TRIGGER BINDING
→ existing migrations unchanged
→ observed-production-compatible structural baseline
→ Artifact Collaboration migration
```

This fixture is **not** asserted to be an exact copy of the historical EDU database or of historical user data. It is the minimum versioned local validation state justified by repository migration dependencies plus read-only structural observations of production.

## Boundaries

```text
LOCAL SUPABASE ONLY
LIVE SUPABASE APPLY = NO
DB PUSH = NO
LINKED RESET = NO
REMOTE SQL = NO
PAID INFRASTRUCTURE = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
```

The fixture source files live under:

`supabase/bootstrap/prehistory/`

They must never be committed into `supabase/migrations/`.

The validator materializes one ephemeral earliest migration only inside a temporary local replay workspace and deletes that workspace when validation ends.

## Final pre-state inventory

### Schema objects required before 20260827212520

Eleven former EDU tables are materialized in `public` so the existing archive migration can move them into `legacy_edu` itself:

- companies
- departments
- employee_profiles
- feedback
- mentor_assignments
- profiles
- recommendations
- session_links
- session_summaries
- sessions
- tasks

Eight enum types used only by those archived tables are materialized:

- adoption_status
- burnout_risk
- company_status
- recommendation_priority
- session_status
- task_status
- user_role
- user_status

PK/FK/UNIQUE constraints, table RLS state, and the surviving `profiles_select_authenticated` policy are represented from read-only production structure.

No production rows are copied.

### Minimal Auth identity pre-state

Historical migration `20260828170411_dc_workspace_readonly_v01.sql` contains two stable UUIDs and inserts membership / Owner Admin rows with FKs to `public.profiles`.

The fixture therefore materializes exactly those two IDs in `auth.users` before the Dementor migration history starts:

- `e9b8ec1d-76be-4607-bb5b-63c48c1b80fa`
- `8c79a5a1-88a9-41cc-98d7-a487df690674`

Every other identity field is synthetic local test data. No production email, name, password hash, OAuth identity, token, session, or production metadata is used.

The first existing Dementor migration then performs its own canonical backfill from `auth.users` into the fresh `public.profiles`.

### Auth trigger binding

Read-only production contains:

`auth.users.on_auth_user_created → public.handle_new_user()`

The fixture creates a minimal no-op trigger function and binding **after** the two fixture users are inserted.

The historical body of the old function is not claimed or reconstructed.

Existing migration `20260827212520_archive_edu_and_create_dementor_core.sql` then executes `CREATE OR REPLACE FUNCTION public.handle_new_user()`, replacing the local stub while preserving the trigger binding.

## Final data/state dependency scan

All 59 current migration files were scanned for:

- hardcoded UUIDs;
- Auth / profile dependencies;
- migration-time inserts, updates, deletes and row reads;
- FK-constrained inserts;
- trigger-returning functions;
- pre-existing-row transformations.

Required pre-state dependencies found:

1. legacy EDU schema moved by `20260827212520`;
2. `legacy_edu.profiles` required by `20260827212614`;
3. two stable Auth/profile IDs required by FK-constrained inserts in `20260828170411`;
4. the existing Auth trigger binding that migration `20260827212520` updates by replacing its function.

A later membership migration performs a historical data enrichment by matching hardcoded email literals. Absence of matching local rows yields zero inserted rows and does not block migration execution or alter schema structure. The replay fixture intentionally does **not** reproduce those real emails.

Other migration-time backfills and transforms operate on tables created earlier in the same migration history and are valid on empty rowsets; they do not require another prehistory class.

## Historical migration immutability

Critical Git blob hashes at authorization checkpoint:

```text
20260827212520_archive_edu_and_create_dementor_core.sql
ad1e8762167dc1a01f023b70247abdbff808bde7

20260827212614_secure_legacy_edu_archive.sql
c69bbdfdb8e5e00f6a3b569e925349e15a5076ce

20260828170411_dc_workspace_readonly_v01.sql
6d313eda5d8fa23713e2186dac0f39317d4f28d1

20260924002500_artifact_collaboration_v1.sql
b18b79b78643bd0509797ca1e621bf8f77edbdf3
```

The validator must fail if these source files no longer hash to these values.

## Observed production structural checkpoint

Before Artifact Collaboration, the read-only production catalog produced the scoped structural fingerprint:

```text
parts = 1291
md5   = beb6fcdf35c889bfa37fd1d725507b7e
```

The fingerprint includes project-owned `public` and `legacy_edu` table columns/defaults, constraints, indexes, RLS/policies, project triggers, public enum types, and `dc_*` / `mp_*` / `handle_new_user` function definitions.

The local replay validator first withholds the Artifact Collaboration migration, replays through `20260921134959`, and requires the same structural fingerprint. Only then may it restore and execute `20260924002500_artifact_collaboration_v1.sql`.

## Local validator responsibilities

`scripts/validate-supabase-prehistory-replay-local.mjs` must:

1. refuse unsafe source migration drift;
2. create a temporary workspace;
3. copy Supabase files while excluding link/runtime state;
4. materialize the three fixture fragments only as temporary `20260827212519_pre_dementor_replay_fixture.sql`;
5. run a clean local baseline replay with Artifact Collaboration temporarily withheld;
6. prove migrations 20260827212520, 20260827212614, and 20260828170411 were applied;
7. compare baseline structural fingerprint with the observed production checkpoint;
8. restore Artifact Collaboration migration only in the temp workspace;
9. run full local reset and prove Artifact Collaboration migration applied;
10. run a second full reset to prove repeatability;
11. run the Artifact Collaboration G5 runtime matrix;
12. stop the temporary stack with no backup and delete the temporary workspace.

No remote command is part of the validator command allowlist.
