# Dementor Club — Personal Workspace Progressive Access v0.2

Date: 2026-08-28
Status: APPROVED PRODUCT / ACCESS MODEL
Source of truth: `dementor-club`

## 1. Core rule

`/workspace/` is the universal personal account surface for every authenticated Dementor Club user.

It is **not** a Dementor-only dashboard.

Base progression:

`AUTHENTICATED → CLUB_MEMBER → DEMENTOR → OWNER_ADMIN`

The same PERSON keeps the same account. Higher states add capabilities; they do not replace the base personal workspace.

## 2. Registered guest

Any authenticated user without an active Dementor Club membership is shown as:

`ЗАРЕГИСТРИРОВАННЫЙ ГОСТЬ`

A registered guest can access own-account information protected by existing own-user RLS:
- profile;
- completed DC-9 assessment runs;
- own course enrollments;
- own order history;
- public Dementor roster/profile links.

Authentication alone does not create membership or a Dementor role.

## 3. Club member

An active `dc_system_memberships` record and/or effective `club_member`-or-higher role creates member state.

Member UI replaces the open membership CTA with completed state:

`✓ ЧЛЕН КЛУБА`

Member-only documents such as a club charter may be shown only after an approved source exists. As of this document, no approved charter source was found; the UI must not invent one.

## 4. Dementor

`DEMENTOR` is a scoped Dementor Club role, not a global person type.

A Dementor receives the same personal surfaces as a guest/member, plus `MY WORK` based on real `dc_entity_assignments` and related `dc_*` entities.

Dementor role implies member-level UX in the access hierarchy, but entity management still requires explicit assignments/permissions.

## 5. Owner Admin

`OWNER_ADMIN` inherits member + Dementor-level UX and receives admin/system surfaces only where separately implemented.

Current read-only Workspace may expose a system entity view for OWNER_ADMIN. This is not impersonation.

## 6. Navigation

Universal shell:

- HOME
- MY CLUB
- MY ACTIVITY
- MY PROFILE

Conditional:

- MY WORK — only when role/assignments create a real work context.

HOME should answer:
- who is signed in;
- current club status;
- test/course/purchase archive counts;
- whether membership is active;
- whether work entities exist.

## 7. Membership CTA

`СТАТЬ ЧЛЕНОМ КЛУБА` is an approved product state/CTA for registered guests.

The actual membership acquisition/approval/payment workflow is still not approved. Until it is fixed in source-of-truth, the CTA must not silently create membership, payment, or an invented application process.

Existing `join_applications` may be displayed as historical/account records but are not redefined here as the membership mechanism.

## 8. Data model

No new table is required for registered guest state.

- PERSON/auth identity: `auth.users` + `profiles`
- registered guest: authenticated session + no effective active DC membership
- membership: `dc_system_memberships`
- scoped roles: `dc_role_assignments`
- work relations: `dc_entity_assignments`
- tests: `assessment_runs`
- course participation: `course_enrollments`
- purchases: `orders`

Role and membership are not stored directly on `profiles`.

## 9. Portrait binding

Canonical Dementor Ink portraits already exist in the official site assets:

- Evgeniy: `assets/people/dementors/evgeniy/portrait-ink.webp`
- Nikita: `assets/people/dementors/nikita/portrait-ink.webp`
- Valentin: `assets/people/dementors/valentin/portrait-ink.webp`
- Gabil: `assets/people/dementors/gabil/portrait-ink.webp`

Known authenticated Dementor accounts may use these canonical assets in `profiles.avatar_url` after exact user-id mapping.

As of 2026-08-28 exact mappings confirmed and applied:
- `kazakoveugenio@gmail.com` → Evgeniy portrait;
- `3122065@gmail.com` → Nikita portrait.

`sharecraftwideo@gmail.com` remains a registered guest and retains its ordinary account avatar.

Valentin and Gabil portraits must not be bound to auth profiles until exact Supabase user IDs exist and are confirmed.

## 10. Product boundary

This Workspace queries Dementor Club and own-account data only.

Modern Pilgrims, Seven Clicks, BEREG, Obitel and other systems do not appear merely because the same PERSON participates there.

**People may overlap. Product rights do not.**
