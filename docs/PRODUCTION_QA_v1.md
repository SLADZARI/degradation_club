# Dementor Club — Production QA v1

Status: active implementation checklist  
Updated: 2026-08-29
Canonical domain: `https://dementor.club`
Production branch: `dementor-club-production`
Staging branch: `dementor-club-site`

## 0. Mandatory release boundary

`STAGING ≠ PRODUCTION`.

A layout may be tested and approved in `dementor-club-site` using test/demo/mock material. That approval confirms the visual system only.

It does **not** approve the test material for publication.

Before production:

1. layout/composition/responsive states are approved on staging;
2. all test-only material is replaced by separately approved public content;
3. the final candidate is reviewed again with real public content;
4. automated production validation passes;
5. explicit human release approval is recorded;
6. only then may the candidate enter `dementor-club-production` and be released.

Governing policy: `dementor-club/operations/PRODUCTION_RELEASE_POLICY_V1.md`.

## 1. Routes that must resolve when included in the approved production release

Core:

- `/`
- `/about/`
- `/events/`
- `/projects/`
- `/projects/logic-awareness/`
- `/community/`
- `/merch/`
- `/join/`
- `/404.html`
- `/robots.txt`
- `/site.webmanifest`

Entity/feature routes are checked according to current approved registry/readiness state. A reserved route may exist while its transactional function remains disabled.

## 2. Responsive matrix

Every public page must be checked at:

- 360 px — smallest phone baseline
- 390 px — current common phone baseline
- 768 px — tablet portrait
- 1024 px — tablet / small desktop
- 1440 px — desktop baseline

Check: no horizontal overflow, no clipped display type, readable metadata, buttons >= 44 px, navigation reachable, content order preserved.

## 3. Navigation

Global order is fixed:

`Club / Events / Projects / Community / Merch / Join`

Requirements:

- current section has an active state;
- mobile uses `INDEX`;
- keyboard focus is visible;
- all public entity links resolve;
- no legacy repository-subpath routes are generated for the custom domain;
- no legacy `/#projects`, `/#events`, `/#community`, `/#merch` links remain on entity pages.

## 4. Motion

Allowed behaviours:

- Reveal
- Pressure
- Drift
- Status pulse
- Index wipe

Requirements:

- motion supports hierarchy rather than decoration;
- no perpetual movement except mechanical status/ticker where justified;
- `prefers-reduced-motion: reduce` removes non-essential motion;
- hover-dependent meaning remains available on touch.

## 5. Dementor Ink — raster only

Artistic illustration delivery is raster-only:

- WebP default;
- PNG for alpha/transparency;
- JPG/WebP for scans and photographic material;
- no SVG illustrations;
- no raster-to-SVG tracing.

Temporary/reference artwork used to approve a layout does not become a production asset automatically. The exact public raster must be approved separately or the slot must remain intentionally unpublished/disabled.

## 6. Metadata and domain

Production metadata must use:

`https://dementor.club`

Required checks:

- unique `<title>`;
- unique meta description;
- OpenGraph title / description / type / locale;
- `og:url` uses `https://dementor.club`;
- public `og:image` uses an approved production asset;
- Twitter card metadata uses production URLs;
- sitemap absolute URLs use `https://dementor.club`;
- `robots.txt` points to `https://dementor.club/sitemap.xml`;
- legacy `https://sladzari.github.io/degradation_club` is absent from production artifact.

## 7. Social image contract

Final social previews must be raster exports at 1200×630.

Preferred delivery: JPG or WebP. No SVG social cards.

A test social card is not production-approved unless its final content/export is explicitly approved.

## 8. Accessibility

Check:

- one semantic H1 per page;
- navigation labelled;
- buttons/links understandable outside internal project context;
- focus-visible state remains visible over PAPER / INK / ACID;
- reduced motion works;
- contrast is preserved;
- text is not encoded only inside images.

## 9. Feature safety

UI readiness does not mean a function is live.

Before enabling any real external action, verify source approval + configured provider/endpoint for:

- Contacts submit;
- Donate payment;
- Merch checkout;
- Event registration;
- Community membership/account actions;
- any user-data collection or third-party integration.

A disabled function must not look falsely transactional.

## 10. Test-material contamination check

Production must not accidentally expose internal working state.

Review visible output for accidental markers such as:

- TEST / TEST DATA / TEST MATERIAL;
- MOCK / MOCKUP;
- DEMO;
- PLACEHOLDER;
- TEMP;
- SAMPLE;
- INTERNAL ONLY;
- WIP;
- DRAFT / APPROVED DRAFT when that wording is only an internal status rather than intentionally approved public copy;
- fake prices, dates, registration links, contacts, participants or testimonials;
- temporary visual references.

If one of these words is intentionally part of public club language, its use must be approved in the responsible source-of-truth. Otherwise it is a release blocker.

## 11. Automated gate

Production workflow runs:

```bash
node scripts/validate-site.mjs
node scripts/validate-content-readiness.mjs
node scripts/validate-visual-contract.mjs
node scripts/validate-production-release.mjs
```

Any error blocks release.

The production workflow is hard-gated to `dementor-club-production`; ordinary pushes to `dementor-club-site` must not publish `dementor.club`.

## 12. Production-ready definition

Production-ready means all are true:

1. canonical domain is `https://dementor.club`;
2. source facts/statuses are approved;
3. layout has been approved on staging;
4. test-only content/assets have been replaced or intentionally excluded;
5. final candidate has been re-reviewed with actual public content;
6. responsive matrix is checked;
7. no console/runtime errors;
8. production asset paths resolve from the domain root;
9. canonical / sitemap / robots are production-correct;
10. external feature states match real provider readiness;
11. automated validators pass;
12. explicit release approval is recorded;
13. release is executed from `dementor-club-production` only.

## 13. Post-deploy smoke test

After every successful release verify on the live domain:

- homepage CSS and imagery load;
- core navigation works;
- approved event/project/community/merch routes resolve;
- `/join/` behaves as intended;
- no `/degradation_club/` asset-path dependency remains;
- no accidental test/demo/internal material is visible;
- canonical/OG/sitemap/robots use `dementor.club`;
- HTTPS is active once GitHub certificate issuance is complete.

Do not claim publication complete before live smoke verification passes.
