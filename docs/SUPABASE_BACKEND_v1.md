# Dementor Club — Supabase Backend v1

Status: ACTIVE BACKEND BASELINE / GOOGLE OAUTH VERIFIED
Date: 2026-08-28
Supabase project: `EDU Modern Pilgrims`
Project ref: `mmekfydwbvptbdatwitj`

## Core rule

**Git remains source-of-truth for what exists.**
**Supabase stores what happens to/with a specific person.**

Canonical club content, entity definitions, approved copy, event/course/project/product definitions and public URLs remain in `dementor-club` and are implemented by `dementor-club-site`. Supabase is not a CMS.

## Preserved infrastructure

- Supabase Auth
- Google OAuth provider
- `auth.users`
- `auth.identities`
- automatic `auth.users -> public.profiles` projection
- existing Google/Auth users backfilled into `public.profiles`

Authentication is not membership. A profile can exist without accepted membership, event registration or course enrollment.

## Verified authentication baseline

Google OAuth was end-to-end verified on 2026-08-28:

`Google -> Supabase Auth -> authorized callback -> browser session -> public.profiles -> assessment sync`

Verified behavior:
- callback returns to the requested `/join/` route;
- browser receives the implicit-flow auth payload and establishes a persistent Supabase session;
- session survives page reload;
- authenticated user can read their own `public.profiles` row under RLS;
- `/join/` can read/write `assessment_snapshots` and persist `assessment_runs`;
- no service-role credential is exposed to browser code.

Production account runtime: `/dementor-account-sync-v6.js`.
It uses one Supabase client, explicit implicit-flow hash restoration, persistent session storage and a short silent retry for the transient `PGRST303 / JWT issued at future` condition observed immediately after a fresh sign-in.

The temporary public `/auth-test/` page and diagnostic auth runtimes were removed after verification.

## Local-first diagnostic model

Local runtime key: `dementorClubOnboardingV3`.

1. Diagnostics work without account.
2. Local state remains usable if Supabase is unavailable.
3. Google sign-in upgrades persistence; it is not a gate.
4. On sign-in local and remote state merge.
5. Per-sphere completed results merge by `result.date`; newest wins.
6. Existing local progress is never discarded just because remote state exists.
7. Diagnostic version is recorded.

Current version: `dc9-v1`.

Tables:
- `profiles`
- `assessment_snapshots` — current durable accumulated map
- `assessment_runs` — completed run history with `assessment_version`, `result_json`, optional `answers_json`, timestamps and dedupe `source_key`

Routes:
- `/join/` — local-first diagnostic + optional Google persistence
- `/profile/` — account dashboard, nine-sphere map, run history and orders

## Commerce model

Local cart key: `dementorClubCartV1`.

The approved product/preorder model remains canonical in Git. The current payment method remains manual BLIK; no payment-provider semantics were invented or changed.

Flow:

anonymous product selection -> localStorage cart -> optional Google sign-in -> merge to durable user cart -> draft preorder record.

Tables:
- `carts`
- `cart_items`
- `orders`
- `order_items`

RLS:
- all commerce tables are authenticated/own-user only
- no anonymous database access
- anonymous cart stays local only

Browser adapter: `/dementor-cart-v1.js`.
Bridge from the existing preorder selector: `/merch-cart-bridge-v1.js`.
Route: `/cart/`.

`orders` currently supports the existing manual preorder process. `checkoutEnabled` remains false. A draft order is not a paid or confirmed order.

## Other operational tables

- `join_applications`
- `event_registrations`
- `course_enrollments`
- `contact_requests`

Their public feature flags remain disabled until their UX is explicitly activated.

## Auth trigger and profile access

`auth.users` AFTER INSERT -> `public.handle_new_user()`.

The function only creates/updates `public.profiles`. It does not create EDU employee entities. Direct RPC execution is revoked from `PUBLIC`, `anon` and `authenticated`.

`authenticated` has table-level `SELECT` and `UPDATE` grants on `public.profiles`; RLS policies still restrict each user to their own row. This grant is required in addition to RLS policy definitions.

## Legacy EDU archive

Former EDU test tables were moved intact to `legacy_edu`. The schema is not part of runtime and access for `anon` and `authenticated` is revoked.

## Applied migrations

1. `archive_edu_and_create_dementor_core`
2. `secure_legacy_edu_archive`
3. `add_dementor_assessment_sync`
4. `add_dementor_commerce_state`
5. `grant_authenticated_profiles_read_update`

## Security baseline

All active public Dementor Club tables use RLS. Browser code receives only the Supabase publishable key, never secret/service-role credentials.

Remaining advisor notices may relate to the cold `legacy_edu` archive, fresh unused indexes, or optional password-auth hardening. Google OAuth does not use password login.

## Storage / Realtime / Edge Functions

- Storage: not required for current identity/diagnostic/cart runtime
- Realtime: not required
- Edge Functions: not required before payment-provider/server webhook integration

## Google OAuth configuration

Canonical production site origin:
`https://degradation-club.vercel.app`

Current GitHub Pages verification origin:
`https://sladzari.github.io`

Supabase project URL:
`https://mmekfydwbvptbdatwitj.supabase.co`

Google OAuth callback URI:
`https://mmekfydwbvptbdatwitj.supabase.co/auth/v1/callback`

Supabase Auth redirect allow-list includes the production Vercel routes and the GitHub Pages namespace used for current deployment verification.

Verified GitHub Pages join redirect:
`https://sladzari.github.io/degradation_club/join/`

Google Authorized JavaScript origins include:
- `https://degradation-club.vercel.app`
- `https://sladzari.github.io`

Do not add `service_role` credentials to Google, Git or browser code.

## Architectural rule

`dementor-club` -> approved entity/content -> `dementor-club-site`

`dementor-club-site` -> user action / personal state -> Supabase

Supabase must never become authority for club doctrine, approved event facts, project descriptions, mentor pages or editorial content.
