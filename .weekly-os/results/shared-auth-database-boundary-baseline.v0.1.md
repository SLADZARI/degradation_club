---
artifactId: dementor-club.result.shared-auth-database-boundary-baseline
project: dementor-club
documentType: RESULT
projectStage: DECISION
gate: G3_ARCHITECTURE_LOCK
status: DRAFT
version: 0.1
updated: 2026-08-31
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: REFERENCE
supersedes: null
---

# RESULT — Shared Auth Database Boundary Baseline v0.1

## Goal

Capture verified Supabase identity/access facts and the database boundary between Dementor Club and Modern Pilgrims without creating runtime access or changing approved product semantics.

## Status

DRAFT / REVIEW.

## Branch

`result/shared-auth-db-boundary-baseline`

## Acceptance Criteria

- Live Supabase MP/DC identity and access tables are inspected.
- `mp_private` access helper behavior is recorded.
- Shared identity vs separate product-state boundary is explicit at database level.
- BEREG runtime project reference is recorded.
- Valentin state is explicitly WAITING FOR CLIENT DECISION on the €2,800 continuation proposal.
- No Valentin membership, assignment or artifact access is created.
- Remaining semantic choices are marked DECISION REQUIRED, not silently implemented.

## Affected Domain

- shared authentication identity
- Dementor Club membership/roles/entities
- Modern Pilgrims membership/project access
- BEREG client access boundary

## Evidence

- Supabase project `mmekfydwbvptbdatwitj` live schema/constraints/RLS inspected on 2026-08-31.
- `public.profiles.id` references `auth.users.id`.
- DC tables reference `profiles.id`; MP tables use authenticated user IDs independently.
- `mp_project_refs` contains `bereg-k16` / `BEREG / K-16`.
- `mp_system_memberships`, `mp_project_assignments`, and `mp_project_artifact_access` currently have no populated client-access rows in the inspected baseline.
- Existing Dementor Club architecture explicitly forbids inferring MP membership/roles from DC state.

## Gate

G3 remains open. This Result records a baseline only and does not approve the unresolved client-role/access semantics.

## Production Impact

None. No Supabase migration, RLS mutation, membership insert, project assignment, or deployment is included.

## Cleanup Need

After review, either approve a compatible architecture baseline or supersede this draft with a corrected version. Do not merge unresolved semantics as approved authority.
