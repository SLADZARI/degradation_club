---
artifactId: dementor-club.architecture.shared-auth-database-boundary
project: dementor-club
documentType: ARCHITECTURE
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

# Shared Auth / Separate Product Data — Database Boundary v0.1

## Status

DRAFT / NOT DEPLOYED / REVIEW REQUIRED.

This artifact records what is already true in the shared Supabase project and defines the smallest safe database boundary between Dementor Club and Modern Pilgrims. It does not approve new product semantics, does not grant access, and does not create memberships or assignments.

## Verified runtime facts — 2026-08-31

Supabase project: `EDU Modern Pilgrims`.
Project ref: `mmekfydwbvptbdatwitj`.

Shared identity chain currently exists as:

```text
auth.users.id
  -> public.profiles.id
```

Dementor Club runtime identity/access uses `profiles.id` as its profile key and has product-scoped tables including:

```text
dc_system_memberships
dc_role_assignments
dc_entities
dc_entity_assignments
```

Modern Pilgrims runtime identity/access uses the same underlying authenticated user identity but separate MP tables:

```text
mp_system_memberships
mp_project_refs
mp_project_assignments
mp_project_artifact_access
```

The verified database relationship is therefore identity-level only:

```text
auth.users
  -> profiles
      -> dc_* product state

same auth.users.id
  -> mp_* product state
```

There is no approved rule allowing Dementor Club membership, role, entity assignment or progress to create Modern Pilgrims membership, role, project assignment or permissions automatically.

## Verified Modern Pilgrims access helpers

The live database currently exposes security-definer helpers in `mp_private`:

- `current_user_is_mp_member()` — true only for an ACTIVE, non-expired `mp_system_memberships` row for `auth.uid()`.
- `current_user_is_mp_owner()` — true only for ACTIVE `system_role = PLATFORM_OWNER`.
- `current_user_manages_project(project_id)` — true for an ACTIVE project assignment with `access_profile = OWNER`, or for a platform owner.

Current RLS uses those helpers for `mp_project_refs`, `mp_project_assignments` and `mp_project_artifact_access`.

## Verified MP role/access vocabulary in the database

`mp_system_memberships.system_role` currently permits:

```text
PLATFORM_OWNER
TEAM_MEMBER
PARTNER
CLIENT
EXPERT
```

`mp_project_assignments.access_profile` currently permits:

```text
INTERNAL
OWNER
DECISION
TEAM
OBSERVER
UNASSIGNED
```

`mp_project_assignments.relation` currently permits:

```text
OWNER
LEAD
CONTRIBUTOR
REVIEWER
PARTNER
CLIENT_COUNTERPART
OBSERVER
```

`mp_project_assignments.status` currently permits:

```text
INVITED
ACTIVE
WAITING
SUSPENDED
REVOKED
```

`mp_project_artifact_access.permission` currently permits:

```text
VIEW
COMMENT
EDIT
DECIDE
```

## BEREG runtime fact

`mp_project_refs` already contains:

```text
project_key: bereg-k16
name: BEREG / K-16
source_ref: https://github.com/SLADZARI/modernpilgrims-platform/tree/bereg-operating-core
```

No BEREG client membership or assignment is created by this artifact.

## Valentin / BEREG state

FACT: Valentin has not accepted the €2,800 continuation proposal.

FACT: Current commercial state is WAITING FOR CLIENT DECISION.

FACT: No Modern Pilgrims membership, project assignment or artifact access should be issued to Valentin solely because he is associated with BEREG or Dementor Club.

FACT from live runtime check on 2026-08-31: no profile was found by the available Valentin/Валентин name fields, and no pre-existing MP membership/assignment was inferred or created.

The €2,800 amount is a proposal awaiting acceptance, not revenue, not a paid contract and not an ACTIVE delivery commitment.

## Dementor Club connection requirement

The database boundary must preserve:

```text
SHARED AUTH IDENTITY != SHARED PRODUCT MEMBERSHIP
DEMENTOR ROLE != MP ROLE
DC ENTITY ASSIGNMENT != MP PROJECT ASSIGNMENT
DC ACCESS != MP ACCESS
```

Allowed shared layer:

```text
auth.users
profiles
login/session infrastructure
```

Product-specific layers remain separate:

```text
Dementor Club -> dc_*
Modern Pilgrims -> mp_*
```

Any future cross-product UX may resolve one authenticated human through the same `auth.users.id` / `profiles.id`, but must query each product's membership and permissions independently.

## Requirement for future BEREG client access

Only after an explicit client-access decision should the runtime flow be allowed to create, in order:

```text
1. authenticated identity / profile
2. mp_system_memberships row
3. mp_project_assignments row scoped to BEREG
4. optional mp_project_artifact_access rows for explicit artifacts
```

Do not use a Dementor Club role as a shortcut for steps 2–4.

For a future Valentin client portal, the intended semantics remain PROPOSAL until separately approved:

```text
system role: PARTNER or CLIENT — DECISION REQUIRED
project relation: OWNER or CLIENT_COUNTERPART — DECISION REQUIRED
access profile: OWNER or DECISION — DECISION REQUIRED
artifact permissions: explicit per artifact
```

No runtime row should be inserted until those exact semantics are approved.

## Current gaps / required checks before implementation

- Decide canonical MP system role for client owners: `PARTNER` vs `CLIENT`.
- Decide project relation for Valentin: `OWNER` vs `CLIENT_COUNTERPART`.
- Decide whether client owner access uses `OWNER` or `DECISION` access profile.
- Define artifact keys for BEREG portal surfaces before granting artifact access.
- Test RLS end-to-end with a non-owner test account before any real client invitation.
- Keep all DC and MP policies independently testable.
- Never cross-join DC/MP product rows except through the neutral human identity when a specific UX explicitly requires it.

## Non-goals

This artifact does not:

- deploy a schema change;
- alter RLS;
- create Valentin in Supabase;
- create BEREG memberships or assignments;
- approve the €2,800 proposal;
- treat the proposal as accepted;
- merge Dementor Club and Modern Pilgrims data models;
- define billing or payment state.
