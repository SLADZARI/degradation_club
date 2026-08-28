# ACCOUNT PROGRESS & MERCH RUNTIME v0.1

Status: `APPLIED / 2026-08-28`

## Principle

Interactive Dementor Club procedures that create a personal diagnostic result or program progress require an authenticated Supabase identity.

`AUTHENTICATED PERSON → PERSONAL RESULT / PROGRAM CHECKPOINT → ACCOUNT HISTORY`

Authentication does not create club membership or a Dementor role.

## Join / DC-9

`/join/` is account-bound. The canonical result remains `assessment_runs` + `assessment_snapshots`: sphere, result payload, level 0–5, completion time and cross-device restore.

Do not duplicate the same DC-9 result into another authority table. Public explanatory pages remain public; starting the interactive diagnostic requires sign-in.

## Program checkpoints

Program-specific progress that is not a DC-9 assessment is stored in `dc_progress_signals`.

Current runtime cases:

- `dumai-s-opasnostyu / day1` — raw confidence transition, delta and day-result payload;
- `dengi-na-veter / first-run` — first adaptive run and current logic-resistance signal.

There is no approved universal conversion from these raw measures to one common numeric degradation level. `degradation_level` may therefore remain null while `level_label` and structured payload preserve the source metric. Do not invent a cross-program scale.

The first persisted program checkpoint creates or updates the account `course_enrollments` record to `in_progress`.

## Certificates

Completed programs may issue an account-bound record in `dc_program_certificates`.

First implementation:
`Думай с опасностью → Сертификат повышенной подозрительности`.

This mirrors the already approved in-course artifact. The private workspace renders issued certificates under `MY ACTIVITY`.

Current browser implementation is an MVP completion record, not a cryptographically verifiable external credential.

## Merch commercial runtime

Canonical product meaning and specification stay in Git under `dementor-club/merch/*`.

Mutable commercial state lives in Supabase `dc_merch_items`: `sku`, `base_price_eur`, `sales_state`, `public_visible`, `updated_by`, `updated_at`.

`PRODUCT CANON (Git) ≠ LIVE COMMERCIAL STATE (Supabase)`.

Initial state:
- `DC-OBJECT-001` — EUR 220 / `not_open`;
- `SH-DEM-01` — price TBD / `not_open`;
- `SH-DEM-02` — price TBD / `not_open`;
- `SH-DEM-03` — price TBD / `not_open`.

Only active `owner_admin` assignments can write `dc_merch_items` through RLS. The site reads public live price and sales state from Supabase. Checkout remains a separate feature flag and does not become enabled merely because `sales_state` changes.

## Boundaries

- `profiles` remains product-neutral PERSON identity data.
- membership and roles remain separate assignments.
- certificates and progress are own-user RLS data.
- merch writes are owner-admin only.
- authorization is bound to stable user IDs, not display names.
- Dementor Club permissions never imply permissions in another product.
