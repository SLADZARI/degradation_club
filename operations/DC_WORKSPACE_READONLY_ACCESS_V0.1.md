# Dementor Club — Workspace Read-Only Access v0.1

Date: 2026-08-28
Status: APPLIED / READ-ONLY PRODUCTION ACCESS LAYER
Source of truth: `dementor-club`

## 0. Purpose

This record closes the first real implementation slice built on top of:

- `AUTH_SYNC_AND_ACCESS_BASELINE_2026-08-28.md`;
- `IDENTITY_MEMBERSHIP_AND_ENTITY_BOUNDARY_V0.2.md`;
- `DEMENTOR_ENTITY_MAP_AND_WORKSPACE_MODULES_V0.1.md`;
- the universal identity/entity architecture documents.

The goal is deliberately narrow:

```text
Supabase Auth
→ current user
→ Dementor Club membership
→ system role assignment
→ entity assignment
→ RLS-protected read-only Workspace
```

No write workflow is enabled in this version.

---

## 1. Applied Supabase domain

The following Dementor Club-specific tables are now applied in the existing Supabase project:

```text
dc_system_memberships
dc_role_assignments
dc_entities
dc_programs
dc_events
dc_entity_assignments
```

The `dc_*` prefix is mandatory and preserves the approved boundary:

**Dementor Club data ≠ Modern Pilgrims data ≠ Seven Clicks data.**

The implementation does not introduce a shared cross-product project registry.

---

## 2. Identity boundary

Authentication continues to use the existing Supabase `auth.users.id` identity.

The Workspace does not derive authority from:

- email;
- display name;
- DC-9 result;
- frontend selector;
- hidden URL.

Access resolves from explicit rows scoped to Dementor Club.

Canonical chain:

```text
AUTH USER
→ dc_system_memberships
→ dc_role_assignments
→ dc_entity_assignments
→ dc_entities
```

---

## 3. Current system assignments

Two existing accounts are currently mapped with exact existing Supabase user IDs and confirmed as `OWNER_ADMIN` according to the approved access baseline:

- Евгений;
- Никита.

Their IDs are intentionally not reproduced in this public repository document.

Valentin and Gabil are NOT seeded with guessed IDs. Their canonical Dementor/entity relationships exist in the entity source-of-truth, but their runtime access assignment waits for an exact authenticated account match.

---

## 4. Current entity registry

Applied canonical read-only entities:

### Programs

- `dumai-s-opasnostyu` — course / self_paced;
- `dengi-na-veter` — course / adaptive_digital;
- `slaboumie-i-otvaga` — experience / physical;
- `ne-komanda` — practice / recurring.

### Events

- `fuengirola` — planned event.

The registry mirrors currently approved/planned source-of-truth status and does not promote a planned entity into active delivery.

---

## 5. Direct entity assignments currently applied

Confirmed runtime mappings that can be established without inference:

- Никита → `dengi-na-veter` → `author`;
- Евгений → `slaboumie-i-otvaga` → `dementor`.

OWNER_ADMIN retains system-level read access independently of direct work assignment.

Valentin/Gabil entity assignments are intentionally deferred until their exact authenticated accounts exist.

---

## 6. RLS behavior

RLS is enabled on all new `dc_*` tables.

Current read policy:

```text
no active DC membership
→ no DC rows

active membership + own assignments
→ own scoped rows

OWNER_ADMIN
→ system-level DC read access
```

No authenticated browser role receives INSERT / UPDATE / DELETE permission in v0.1.

Default authorization remains deny.

---

## 7. Verified negative tests

Applied database-level tests confirmed:

1. an authenticated account without active Dementor Club membership sees:
   - 0 memberships;
   - 0 roles;
   - 0 entity assignments;
   - 0 entities;
2. Nikita's direct entity assignment resolves to `dengi-na-veter`;
3. OWNER_ADMIN can read the full current five-entity Dementor Club registry;
4. the runtime domain queries only `dc_*` tables for Workspace content.

These tests verify database isolation, not merely UI hiding.

---

## 8. Production Workspace route

Site implementation route:

```text
/workspace/
```

The route is private-product UI and uses `noindex,nofollow,noarchive`.

Runtime flow:

```text
open /workspace/
→ restore Supabase PKCE session
→ if no session: Google login
→ resolve own profile
→ resolve dc_system_membership
→ resolve dc_role_assignments
→ resolve own dc_entity_assignments
→ query RLS-visible dc_entities / subtype rows
→ render HOME / MY WORK / MY PROFILE
```

An OWNER_ADMIN may switch between direct assignments and system-wide Dementor Club read view. This is system read access, not impersonation.

---

## 9. OAuth return

The existing `/auth/callback/` now supports a validated same-site `next` route.

Default behavior remains `/join/`.

Workspace login may request a return to `/workspace/` after successful PKCE exchange.

Open redirects are not allowed: the callback accepts only validated paths under the current Dementor Club base path.

---

## 10. Explicitly NOT implemented

v0.1 does not implement:

- profile editing;
- program editing;
- event editing;
- role administration UI;
- participants;
- registrations;
- run/session persistence;
- CLUB_MEMBER acquisition;
- Valentin account assignment;
- Gabil account assignment;
- cross-system permissions;
- Modern Pilgrims data;
- Seven Clicks data.

---

## 11. Next gate

Before any write capability is introduced:

1. confirm live `/workspace/` session restore on desktop and mobile;
2. verify Evgeniy and Nikita each see their direct assignment by default;
3. verify an authenticated non-member is denied;
4. bind Valentin and Gabil only after exact authenticated account confirmation;
5. add write permissions per actual screen/action, not by broad role assumption;
6. add RLS tests for every write capability before enabling the corresponding UI.

**ROLE remains an input into authorization. ROLE ≠ PERMISSION.**
