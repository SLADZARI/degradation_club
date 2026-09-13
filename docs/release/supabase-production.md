# Supabase production release

The canonical backend release owner is the manual GitHub Actions workflow `Deploy Dementor Supabase Production`.

## Release boundary

For a Result that changes both the database and the site, release in this order:

1. merge the reviewed Result to `dementor-club-production`;
2. dispatch `Deploy Dementor Supabase Production` from that branch with `release_confirmation=APPROVED`;
3. review the logged production SHA, local/remote migration table, pending migration list, and backend smoke evidence;
4. deploy `telegram-outbox-worker` only when its explicit workflow input is enabled;
5. after backend verification, dispatch the separate Pages workflow;
6. run live browser smoke.

The backend workflow must never use `db reset`, `migration repair`, `--include-all`, or another automatic history rewrite. Unexpected remote-only history or an out-of-order pending migration is a hard stop.

## Migration authority

`supabase/migrations` is the single tracked migration history. Normal releases use `supabase db push --linked`, which applies only tracked pending migrations. A release with no pending migrations is a valid explicit no-op.

If an emergency production mutation is ever performed outside the canonical workflow, reconcile Git and the Supabase migration ledger before the next normal release. Do not re-execute SQL that production already applied merely to make history match.

New unapplied migrations must use a version later than the latest production migration. Renumber an unapplied migration before first release if it would otherwise be out of order.

## Telegram worker auth

`telegram-outbox-worker` intentionally uses `verify_jwt=false` at the Supabase gateway and enforces its own trusted invocation boundary inside the function: direct service-role authorization or the database scheduler token validated by the service-only RPC. The production workflow deploys this function explicitly with `--no-verify-jwt`; it does not deploy unrelated functions.

## Required GitHub secrets

The workflow follows the current Supabase CLI CI contract and expects encrypted repository/environment secrets named `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, and `SUPABASE_PROJECT_ID`. Never commit their values or any service-role, scheduler, or Telegram secret.
