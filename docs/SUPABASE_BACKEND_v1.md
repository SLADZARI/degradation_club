# Dementor Club — Supabase Backend v1

Status: ACTIVE BACKEND BASELINE
Date: 2026-08-27
Supabase project: `EDU Modern Pilgrims`
Project ref: `mmekfydwbvptbdatwitj`

## Purpose

Supabase stores operational/dynamic and user-specific state only.

**Git remains source-of-truth for what exists.**
**Supabase stores what happens to/with a specific person.**

Canonical club content, entity definitions, approved copy, event/course/project definitions and public URLs continue to live in `dementor-club` and are implemented by `dementor-club-site`.

Supabase MUST NOT become a parallel CMS for approved club content.

## Preserved infrastructure

- Supabase Auth
- Google OAuth provider already used by existing test users
- `auth.users`
- `auth.identities`
- automatic `auth.users -> public.profiles` projection

Existing Google/Auth users were backfilled into the new `public.profiles` table.

## Identity boundary

Authentication is not membership.

A user may have a `public.profiles` record without being a Dementor Club member, having an accepted join application, event registration or course enrollment.

Public actions may also exist without authentication where explicitly designed that way. Their `profile_id` can be nullable.

## Local-first diagnostic model

The nine-sphere diagnostic experience remains local-first.

`localStorage` key: `dementorClubOnboardingV3`

Rules:

1. A visitor may start and complete diagnostics without creating an account.
2. Local state must remain usable when Supabase is unavailable.
3. Google sign-in is an optional persistence/synchronization upgrade, not a gate to the experience.
4. Once authenticated, the local profile is merged with the user's durable Supabase snapshot.
5. Per-sphere completed results are merged by their result timestamp (`result.date`), newest wins.
6. Existing local progress must never be discarded merely because remote state exists.
7. The diagnostic algorithm/version is recorded so future question sets do not silently rewrite historical meaning.

The first synced diagnostic version is `dc9-v1`.

## Active public schema

### `public.profiles`
Identity projection for authenticated users.

Fields:
- `id` -> `auth.users.id`
- `email`
- `full_name`
- `avatar_url`
- `created_at`
- `updated_at`

RLS:
- authenticated user may SELECT own profile
- authenticated user may UPDATE own profile
- no anonymous reads

### `public.assessment_snapshots`
Current durable copy of a user's accumulated diagnostic state.

Fields:
- `profile_id` (PK -> `profiles.id`)
- `assessment_version`
- `state_json`
- `client_updated_at`
- `updated_at`

RLS:
- authenticated user may SELECT/INSERT/UPDATE only own row
- no anonymous access

`state_json` mirrors the local diagnostic runtime shape (`results` + optional `active`) so local and remote state can round-trip without creating a second scoring engine.

### `public.assessment_runs`
Append-oriented history of completed sphere runs.

Fields:
- `profile_id`
- `sphere_id`
- `assessment_version`
- `result_json`
- `answers_json` nullable
- `started_at` nullable
- `completed_at`
- `source_key`
- `created_at`

`source_key` is unique per user and prevents duplicate history rows when the same local result is synchronized more than once.

For runs completed while the sync runtime is active, `answers_json` captures the answer path immediately before the diagnostic runtime clears its active state. Older local results can be backfilled as historical baselines without answer detail.

RLS:
- authenticated user may SELECT/INSERT only own rows
- no anonymous access

### `public.join_applications`
Operational applications to join the club.

Important: this does not define membership mechanics. It only stores submitted applications once a public application UI is approved.

### `public.event_registrations`
Event registrations.

`event_id` is a stable canonical entity ID originating from Git. Supabase does not duplicate event editorial content.

### `public.course_enrollments`
Course/program applications and enrollment state.

`course_id` is a stable canonical entity ID originating from Git.

### `public.contact_requests`
Inbound contact submissions.

No public SELECT policy exists by design.

## Auth trigger

Trigger:
`auth.users` AFTER INSERT -> `public.handle_new_user()`

The function creates/updates only `public.profiles`.

It no longer creates EDU employee entities or assigns an `employee` role.

`public.handle_new_user()` remains `SECURITY DEFINER` for the auth trigger, but direct execution has been revoked from `PUBLIC`, `anon` and `authenticated`.

## Website runtime

`/dementor-account-sync-v1.js` is the browser adapter for the diagnostic profile layer.

Responsibilities:
- initialize Supabase with the publishable key only;
- expose Google sign-in/sign-out UI on `/join`;
- keep diagnostics fully usable before authentication;
- observe the existing localStorage runtime instead of duplicating the scoring engine;
- merge local and remote snapshots after sign-in;
- synchronize the current snapshot while authenticated;
- persist completed runs and answer paths when available;
- restore a newer remote profile on another device and reload the diagnostic UI once so the existing runtime reads the merged local state.

The browser MUST NEVER receive a Supabase secret/service-role key.

The SDK is pinned to `@supabase/supabase-js@2.112.4` for reproducible browser behavior.

## Legacy EDU archive

The former EDU test model was not deleted.

It was moved intact into schema:

`legacy_edu`

Archived tables include:
- companies
- departments
- profiles
- mentor_assignments
- employee_profiles
- sessions
- session_summaries
- session_links
- tasks
- recommendations
- feedback

`legacy_edu` is not part of the Dementor Club runtime. Access for `anon` and `authenticated` has been revoked.

Do not extend or optimize this archive unless data recovery is explicitly required.

## Applied migrations

1. `archive_edu_and_create_dementor_core`
2. `secure_legacy_edu_archive`
3. `add_dementor_assessment_sync`

## Security baseline

All active public Dementor Club tables have RLS enabled.

The previous critical issue where `public.profiles` had policies but RLS disabled has been removed from the active schema.

Remaining Supabase advisor findings currently relate to the cold `legacy_edu` archive, fresh unused indexes, or optional password-auth hardening (`Leaked Password Protection`). Google OAuth operation does not depend on password login.

## Storage / Realtime / Edge Functions

At this baseline:

- Storage: no club buckets configured
- Realtime: not used by club runtime
- Edge Functions: none required for diagnostic synchronization

Do not introduce these services without a concrete product requirement.

## Commerce extension

The same identity model can later support a local-first cart:

anonymous `localStorage` cart -> Google sign-in -> merge into user cart -> durable cross-device cart.

Supabase may store cart/order state, but payment processing must remain with a dedicated payment provider. Product definitions and approved merch content remain canonical in Git.

## Website activation rule

Backend existence does **not** automatically make unrelated features LIVE.

Do not set membership/event/contact/checkout feature flags to LIVE until their public UX, canonical entity mapping, privacy text and end-to-end behavior are approved and tested.

Diagnostic profile synchronization is a separate capability from membership application.

## Architectural rule

`dementor-club` -> approved entity/content -> `dementor-club-site`

`dementor-club-site` -> user action / personal state -> Supabase

Supabase must never become authority for club doctrine, approved event facts, project descriptions, mentor pages or editorial content.
