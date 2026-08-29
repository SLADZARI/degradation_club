# FINAL PRODUCTION PREPARATION

Любое визуальное обновление считать staging-изменением, пока оно отдельно не прошло production readiness check.

Visual updates are already implemented in `dementor-club-site`. Production may contain independent hotfixes.

## Non-destructive reconciliation

- Never overwrite, reset or force-replace `dementor-club-production`.
- Reconcile `dementor-club-production` + approved changes from `dementor-club-site`.
- Preserve all production fixes: custom-domain root-path build; production runtime asset closure; public CSS/runtime dependencies; production readiness registry; removal of test/demo/internal surfaces; cart/checkout production restrictions; production artifact reference guard; PR + `validate` production protection.

## Production analytics

- GA4: `G-QTZY2GKZ4R`
- Microsoft Clarity: `y9yuo1zabw`
- Analytics must exist only on the production/public artifact.
- No duplicate tags and no staging/test traffic.
- Verify page views on navigation.
- Do not break Supabase auth/session/callback.
- Respect consent/privacy requirements; analytics must not load before explicit analytics consent.

## Before creating the production PR

Run and record:

- production build;
- route/link/assets closure;
- CSS/JS/image/font checks;
- visual regression review;
- mobile checks;
- public content readiness;
- no placeholders/demo/test copy;
- canonical + OG URLs use `https://dementor.club`;
- GA4 presence and no duplication;
- Clarity presence and no duplication;
- Supabase runtime configuration;
- Supabase auth callback;
- RLS smoke tests for anon/authenticated with cleanup;
- join/profile/assessment/workspace/course/merch flows;
- cart/checkout disabled unless explicitly approved;
- all CI/integrity checks.

If any blocker remains, do not mark the release ready.

## Production PR and deploy

Create a PR **into** `dementor-club-production`. Do not modify the production branch directly.

Production deploy is allowed only when:

1. PR is merged into `dementor-club-production`;
2. required `validate` is green;
3. production build is green;
4. no blockers remain;
5. final production candidate is visually approved.

Do not run `Deploy Dementor Production` until explicit user approval. Manual deploy requires `APPROVED`.

## Final report format

`READY_FOR_PRODUCTION` or `BLOCKED`

- preserved production commits;
- imported staging commits;
- conflicts resolved;
- production diff;
- CI results;
- visual regressions;
- runtime errors;
- Supabase status;
- GA4 status;
- Clarity status;
- remaining blockers;
- deploy plan;
- post-deploy verification plan.
