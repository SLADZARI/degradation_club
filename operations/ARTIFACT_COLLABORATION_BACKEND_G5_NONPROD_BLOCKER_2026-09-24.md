---
artifactId: dementor-club.evidence.artifact-collaboration-backend-g5-nonprod-blocker-2026-09-24
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
candidateBranch: result/artifact-collaboration-v1
candidateCommit: 3522993d6796fe9dae81a0c7dbde1ddcc1aa350a
liveDatabaseMutationAuthorized: false
---

# Artifact Collaboration v1 — Backend G5 non-production execution blocker

## Current truth

DEV1 backend work is complete up to the point where the implementation brief requires real PostgreSQL execution in a non-production environment.

Exact candidate:

`result/artifact-collaboration-v1@3522993d6796fe9dae81a0c7dbde1ddcc1aa350a`

Exact production baseline remains:

`df8a24eca2bcca25339f128c7da93982515cf442`

Compare:

- ahead_by: 12;
- behind_by: 0;
- merge base: exact production baseline;
- Result-owned diff remains four files.

## Additional security hardening completed before blocker

The branch was re-reviewed after the initial G5 static checkpoint.

Two real defects were found and corrected before any database apply.

### Hidden Artifact / relation existence oracle

The first schema draft allowed some mutation RPCs to return different errors for:

- a hidden CIRCLE Idea that exists but caller cannot manage;
- a nonexistent Idea.

That violated the approved no-oracle contract.

Corrective:

- invite candidate lookup now authorizes in the Artifact lookup itself;
- participation mutation returns generic `ARTIFACT_NOT_AVAILABLE` for missing/hidden/unavailable Artifact state;
- profile existence is checked only after Artifact authority is established, so the mutation RPC cannot become a registered-profile existence oracle;
- relation delete returns `RELATION_NOT_AVAILABLE` for missing or unreadable relations.

Static validator now rejects regressions of those boundaries.

### Owner Admin relation-delete regression

A review found that the draft relation delete RPC could let Owner Admin pass the hidden-endpoint check but then continue into ordinary author/scoped-Dementor permission checks.

Corrective:

- Owner Admin now bypasses ordinary endpoint-management checks exactly as the canonical relation authority requires;
- Member author, scoped Dementor and participant-created RELATED_TO authority remain inside the non-admin path;
- validator asserts preservation of those existing authorities.

## Static validation after corrections

Exact candidate static validator:

`scripts/validate-artifact-collaboration-v1.mjs`

Result against exact branch content:

- validator JavaScript syntax: PASS;
- validator execution: PASS;
- one participation owner: PASS;
- CIRCLE=Idea invariant: PASS;
- safe profile fields / no email / no full_name exposure: PASS;
- Storage Artifact ACL: PASS;
- Telegram COMMUNITY-only: PASS;
- Public Activity fail-closed: PASS;
- relation both-endpoint read: PASS;
- participant RELATED_TO-only: PASS;
- participant own-edge delete: PASS;
- no-oracle mutation boundary: PASS;
- Owner Admin relation authority: PASS;
- existing Member/scoped-Dementor relation authority: PASS;
- canonical slot owner reuse: PASS.

This is still static validation, not PostgreSQL execution evidence.

## Non-production execution attempt

The approved implementation brief requires:

`G5 static schema PASS → execute migration contract in NON-PRODUCTION validation environment`

Live production DB mutation is explicitly unauthorized.

Supabase development branches were inventoried first:

`branches = []`

A Supabase branch is the canonical safe managed validation path because it starts from production migrations without production data.

Retrieved branch price for the current organization:

`$0.01344/hour`

Cost confirmation was obtained.

Branch creation attempt:

`artifact-collaboration-v1-validation`

Result:

`PaymentRequiredException: Branching is supported only on the Pro plan or above`

Therefore no development database was created.

## Exact blocker

There is currently no authorized non-production PostgreSQL environment equivalent to the production schema.

Unsafe alternatives were deliberately not used:

- no DDL transaction/rollback smoke on live production;
- no `apply_migration` on production;
- no use of another unrelated Supabase project as a scratch database;
- no production merge/deploy;
- no creation of a parallel database owner.

The existing `dementor-club-site` Git branch is also not a valid execution substitute and is historically divergent from production.

## Gate verdict

```text
G4 owner contract                PASS
G5 branch migration              READY
G5 static security validation    PASS
G5 PostgreSQL execution          BLOCKED
G5 RLS/RPC runtime validation    BLOCKED
G6                               NOT ENTERED
LIVE DB APPLY                    NOT AUTHORIZED / NOT RUN
```

This is an infrastructure validation-path blocker, not a schema semantic blocker.

## Unblock options

Any one explicitly authorized safe PostgreSQL environment equivalent to production is sufficient, for example:

1. Supabase development branching after enabling a plan that supports branches; or
2. a separately approved disposable validation project/database restored to the exact migration baseline.

Do not silently use production or an unrelated existing project.

## STOP boundary

Per `operations/ARTIFACT_COLLABORATION_IMPLEMENTATION_BRIEF_V1.md`:

if no safe non-production SQL execution path exists, STOP and report the exact missing validation path.

That boundary is now reached.

```text
LIVE SUPABASE APPLY = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
```
