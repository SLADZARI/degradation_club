# Dementor Club — Official Site

Development/staging surface for the official Dementor Club site.

## Branch role

`dementor-club-site` = **DEVELOPMENT / STAGING**.

`dementor-club-production` = **PRODUCTION BASELINE** and the only branch used by the canonical production Pages deploy.

`dementor-club` = **semantic source / Weekly OS governance**. Product meaning, approved local Decisions, Results and authority pointers are resolved there before implementation.

`STAGING ≠ PRODUCTION`.

A commit to staging is not a release. A merge is not a deploy.

## Required entry before substantial implementation

Read in this order from the semantic branch:

1. `.weekly-os/PROJECT.json`
2. `.weekly-os/ARTIFACT_INDEX.json`
3. `.weekly-os/APPROVED_STATE.json`
4. `readFirst`
5. current Result
6. current Gate
7. existing implementation owners

Then extend the existing canonical owner instead of creating a parallel mechanism.

## Development rule

A significant implementation belongs to one active Result and one active integration branch.

Do not use branch age, filename, `latest`, or implementation presence as semantic authority.

Do not restore legacy auth, Board, DC-9, shell, Catalog, DB or QA mechanisms merely because they existed on an older staging snapshot.

## Release rule

Because staging and production historically diverged, never blind-merge `dementor-club-site` into `dementor-club-production`.

For a production-changing Result:

1. implement and validate the Result;
2. start a clean release candidate from the current `dementor-club-production` baseline;
3. apply only the required validated Result diff;
4. run the current Site Integrity / browser / route / auth regression stack;
5. merge to production only after explicit owner authorization;
6. deploy only after a separate explicit owner authorization;
7. live-retest the deployed result;
8. complete G8 cleanup.

Canonical production deploy workflow: `.github/workflows/deploy-pages.yml`.
Canonical validation workflow: `.github/workflows/site-integrity.yml`.
Canonical domain: `https://dementor.club`.

## Site responsibilities

This branch may contain current implementation work for:

- public routes and responsive UI;
- canonical Header/Footer integration;
- Workspace surfaces;
- DC-9 implementation;
- Board implementation;
- SEO / metadata / OpenGraph;
- production-safe integrations;
- release validators and browser regression tests.

Semantic/product truth remains outside this branch unless an approved authority explicitly says otherwise.

## Safety

- test/demo/mock content is not approved public content;
- UI readiness does not mean a feature is live;
- production DB writes/migrations require their own authorized release path;
- internal QA/design surfaces must not leak into the public production artifact;
- legacy routes and compatibility runtime should be removed when their canonical owner no longer requires them;
- production changes require evidence, not assumption.

## Storage split

GitHub stores code and optimized delivery assets.
Google Drive stores heavy source assets and masters according to the project source map.
