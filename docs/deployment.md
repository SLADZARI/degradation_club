# Dementor Club — production deployment contract

Status: ACTIVE
Updated: 2026-08-29
Canonical domain: `https://dementor.club`

## Production source

The official public site is deployed only from branch `dementor-club-production`.

Branch responsibilities:

- `dementor-club` — source-of-truth for approved club meanings, rules, events, community mechanics and public copy before web implementation;
- `dementor-club-site` — STAGING / WORKING SITE for implementation, visual tests, responsive work and integration checks. It is never an automatic production source;
- `dementor-club-production` — production snapshot and the only branch allowed to deploy the official site to `dementor.club`;
- `logic-awareness` — independent project «Логика и осознанность»;
- `main` — shared technical/repository level, not a production website source.

The governing approval rule is defined in `dementor-club/operations/PRODUCTION_RELEASE_POLICY_V1.md`.

## Core safety rule

`STAGING ≠ PRODUCTION`.

A layout may be designed and approved on test material. That approval covers layout/design only. Test/demo/mock/placeholder/draft content does not become publishable because the layout was approved.

Before production, test material must be replaced by separately approved public content and the resulting production candidate must be reviewed again.

## Canonical release flow

`responsible source` → `dementor-club` approved fact/decision → implementation in `dementor-club-site` → layout approval on test material → replace test material with approved public material → final visual/content QA → copy/merge into `dementor-club-production` → explicit release action → live verification.

## GitHub Pages target contract

- Repository: `SLADZARI/degradation_club`
- Production Branch: `dementor-club-production`
- Canonical domain: `dementor.club`
- Build artifact root: repository root copied to `_site` without `/degradation_club` path rewriting
- `CNAME` in the generated artifact: `dementor.club`

The old repository-path origin `https://sladzari.github.io/degradation_club/` is legacy and must not appear in the production artifact.

## Deployment trigger

Production deployment is explicit-only. Ordinary pushes to working code do not publish the site.

Workflow: `.github/workflows/deploy-pages.yml`

Allowed release actions:

1. manual `workflow_dispatch` on `dementor-club-production` with `release_confirmation=APPROVED`; or
2. an explicit update of `.github/production-release.txt` on `dementor-club-production`, containing an exact line `STATUS=APPROVED`.

The release-marker file is intentionally the only push path that can trigger production. A push that changes application/site files but does not touch this marker does not deploy.

A push to `dementor-club-site` can never deploy `dementor.club` because the deploy job is hard-gated to `refs/heads/dementor-club-production`.

## Automated production guards

Before building production, the workflow executes:

- `node scripts/validate-site.mjs`
- `node scripts/validate-content-readiness.mjs`
- `node scripts/validate-visual-contract.mjs`
- `node scripts/validate-production-release.mjs`

The production release guard blocks obvious pre-production contamination and legacy-domain references. It is an additional safety net, not a substitute for human approval.

Any validation error is a release blocker.

## Required human approval before production

Confirm all of the following before updating/deploying `dementor-club-production`:

1. source facts and statuses are approved;
2. layout/design has been approved on staging;
3. all test/demo/mock/placeholder material intended only for design testing has been removed or replaced;
4. the final candidate has been reviewed with real public content, not only test material;
5. public images, names, dates, prices, CTAs and URLs are approved where applicable;
6. responsive states are checked;
7. no accidental internal status labels are visible;
8. metadata points to `https://dementor.club`;
9. external features are enabled only when their real provider/endpoint is approved;
10. explicit release approval has been given.

## Branch protection recommendation

Configure GitHub branch protection / ruleset for `dementor-club-production`:

- require pull request before merge;
- require at least one approval;
- require successful validation checks;
- block force pushes;
- block branch deletion;
- restrict direct pushes where practical.

This repository setting is part of the intended production model even if it is not enforced by the source files themselves.

## Required smoke checks after every deploy

1. `https://dementor.club/` returns the current homepage with CSS and images loaded.
2. `/about/` opens successfully.
3. `/events/` and approved event routes resolve.
4. `/projects/` and approved project routes resolve.
5. approved community/merch/join routes resolve.
6. intended interactive flows work without exposing disabled functions as active.
7. main navigation has no legacy repository-path URLs.
8. production asset requests resolve from root paths such as `/assets/...`.
9. `robots.txt` and `sitemap.xml` use `https://dementor.club`.
10. no test/demo/draft material became public accidentally.
11. no claim of successful publication is made before these checks pass.

## Rollback

If a critical issue is found, restore `dementor-club-production` to the last verified production commit and execute a new explicit release action.

Do not use `dementor-club-site` as an emergency production source.
