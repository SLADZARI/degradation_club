# OWNER_ADMIN SYSTEM TOOLS AND TESTS v0.1

Status: APPROVED / IMPLEMENTED BASELINE
Date: 2026-08-29
Scope: Dementor Club only

## 1. Purpose

Internal technical tools are an OWNER_ADMIN surface of the Dementor Club account, not a public product area.

The footer hold gesture remains an emergency/shortcut navigation method only. It is not an authorization mechanism.

## 2. Current OWNER_ADMIN assignments

Runtime source: Supabase `dc_role_assignments`.

Confirmed active OWNER_ADMIN people:
- Евгений Казаков;
- Nikita Lobushkin.

A registered guest without OWNER_ADMIN must not receive the System Tools entry in the personal workspace.

Identity or Google authentication alone never grants OWNER_ADMIN.

## 3. Account placement

For OWNER_ADMIN the common personal workspace HOME adds:

`SYSTEM TOOLS → /design-system/admin/`

The ordinary Guest / Member / Dementor account remains unchanged unless that same PERSON has the independent OWNER_ADMIN role assignment.

## 4. System Tools

The admin hub contains:
- SYSTEM TESTS;
- UI LAB;
- AUTH TEST;
- SYNC TEST.

The hub performs an OWNER_ADMIN session/role gate. Static GitHub Pages HTML is not itself a security boundary; all production data and write capabilities remain protected by Supabase RLS and role policies.

## 5. Production smoke suite

`/design-system/admin/tests/` is a live, read-only test runner.

### Scenario A — Access and membership contract

A1. AUTH / OWNER_ADMIN
- active Supabase session exists;
- current `user_id` has active scoped `owner_admin` assignment.

A2. RLS / ACCESS CONTRACT
- RLS enabled on personal, assessment and DC runtime tables used by current production flows.

A3. MEMBERSHIP APPLICATION
- anonymous INSERT policy absent;
- authenticated own-profile INSERT policy present;
- own SELECT policy present;
- one active `submitted` application per profile is enforced by DB index.

### Scenario B — Runtime continuity

B1. DC-9 / PERSISTENCE
- own `assessment_runs` can be read;
- own `assessment_snapshots` can be read;
- local browser result count is shown for comparison;
- empty account is WARN, not FAIL.

B2. ENTITY / MERCH RUNTIME
- current Program/Event registry is readable;
- Supabase merch runtime exists;
- expected baseline entity counts are present.

B3. PROGRAM / PERSONAL ARCHIVE
- own certificates, progress signals and enrollments are queryable without permission errors.

B4. PRODUCTION ROUTES
- JOIN;
- membership application;
- Workspace;
- Merch;
- DC-9 progress runtime;
- membership application runtime
return successful production responses.

## 6. Test safety

SYSTEM TESTS v1 does not create, modify or delete production business rows.

Manual AUTH TEST and SYNC TEST remain separate because some of their actions intentionally mutate browser/session/snapshot state and require explicit operator action.

## 7. Database support

`dc_owner_admin_system_checks()` is a read-only SECURITY DEFINER diagnostic RPC.

Execution is granted to `authenticated`, but the function itself rejects any caller without an active `owner_admin` role assignment.

It exposes only structural health/status information required by the internal test panel, not user secrets or auth tokens.

## 8. Boundary

This admin surface is Dementor Club only.

It must not become an administration surface for Modern Pilgrims, BEREG, Obitel, Seven Clicks or another system merely because the same PERSON participates there.
