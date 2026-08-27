# Dementor Club — Supabase Backend v1

Status: ACTIVE BACKEND BASELINE
Date: 2026-08-27
Supabase project: `EDU Modern Pilgrims`
Project ref: `mmekfydwbvptbdatwitj`

## Purpose

Supabase stores operational/dynamic state only.

**Git remains source-of-truth for what exists.**
**Supabase stores what happens.**

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

Public forms may also exist without authentication. Their `profile_id` is nullable by design.

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

### `public.join_applications`
Operational applications to join the club.

Important: this does not define membership mechanics. It only stores submitted applications once a public application UI is approved.

Fields include:
- `profile_id` nullable
- `email`
- `full_name`
- `answers jsonb`
- `status`
- `source`
- timestamps

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

## Security baseline

All active public Dementor Club tables have RLS enabled.

The previous critical issue where `public.profiles` had policies but RLS disabled has been removed from the active schema.

Remaining Supabase advisor findings currently relate to the cold `legacy_edu` archive or to optional password-auth hardening (`Leaked Password Protection`). Google OAuth operation does not depend on password login.

## Storage / Realtime / Edge Functions

At this baseline:

- Storage: no club buckets configured
- Realtime: not used by club runtime
- Edge Functions: none required yet

Do not introduce these services without a concrete product requirement.

## Website activation rule

The website currently contains UI readiness and feature flags for external services.

Backend existence does **not** automatically make a feature LIVE.

Do not set membership/event/contact feature flags to LIVE until:

1. the public UX and required fields are approved;
2. the site adapter is connected;
3. canonical entity IDs are mapped correctly;
4. end-to-end submission is tested;
5. privacy/legal copy matches the actual stored data.

The current `/join/` page is a local diagnostic/onboarding experience using `localStorage`; it is not yet an approved membership application form. Do not silently upload its diagnostic results to Supabase.

## Next activation order

Recommended order:

1. approved Join application form -> `join_applications`
2. event registration -> `event_registrations`
3. contacts -> `contact_requests`
4. course applications/enrollment -> `course_enrollments`
5. optional member account/history later

## Architectural rule

`dementor-club` -> approved entity/content -> `dementor-club-site`

`dementor-club-site` -> user action -> Supabase operational state

Supabase must never become authority for club doctrine, approved event facts, project descriptions, mentor pages or editorial content.
