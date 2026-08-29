# Dementor Club — QA / Release Contract v1

Status: **ACTIVE QA CONTRACT**  
Effective: 2026-08-29  
Applies to: staging review, production-candidate preparation and post-deploy verification.

## 0. Authority chain

Before any visual or release QA, read in this order:

1. `docs/DEMENTOR_DESIGN_CANON_CURRENT.md`
2. the canon version referenced by CURRENT
3. approved reference implementation named by that canon
4. this QA / Release Contract
5. implementation/component contracts
6. historical references only after the active authority has been resolved

**Newer file ≠ active canon.**  
**Implemented ≠ approved.**  
**A visual baseline never replaces CURRENT.**

Current design authority at publication time: `DEMENTOR_DESIGN_CANON_v10.md`.

---

## 1. Release decision model

Every production candidate must end in exactly one state:

- `READY_FOR_PRODUCTION`
- `BLOCKED`

Warnings may exist, but a blocker means no production deploy.

Required final report:

- design canon status
- functional QA status
- social / OG status
- analytics status
- SEO / indexation status
- Supabase status
- responsive / visual regressions
- broken routes / assets
- runtime / console errors
- production diff
- blockers
- warnings
- deploy plan
- post-deploy verification plan

---

## 2. Design Canon QA

Every visually reviewed public page should record when practical:

`design_canon: v10`

or explicitly resolve the version through `DEMENTOR_DESIGN_CANON_CURRENT.md`.

QA must distinguish:

1. page valid under its declared canon;
2. page requiring migration to CURRENT;
3. unintended visual regression;
4. intentional human-approved canon change.

A page does not fail only because a newer canon exists if its previous canon remains explicitly accepted for gradual migration.

A baseline screenshot must never be silently updated because CURRENT changed.

### Visual blocker examples

- approved composition materially broken;
- typography/hierarchy no longer matches declared canon;
- critical content clipped or hidden at supported viewport;
- image/text layering differs from approved behavior;
- mobile state is not usable;
- legacy CSS overrides active canon unexpectedly.

---

## 3. Functional QA

Before production release, smoke-test at minimum:

- `/`
- `/about/`
- `/events/`
- `/projects/`
- `/community/`
- `/merch/`
- `/join/`
- `/profile/` / account surface where applicable
- `/workspace/`
- `/auth/callback/`
- primary public course pages
- public Dementor profile pages
- 404 behavior

Verify:

- navigation and local links;
- assets, CSS, JS and fonts;
- no unexpected horizontal overflow;
- no critical console errors;
- no missing production runtime dependency;
- public CTAs resolve to approved destinations;
- private/session pages behave correctly for anonymous and authenticated users.

---

## 4. Social Preview / OG Contract

Every public entity must support a social preview.

Entity types include at minimum:

- Dementor profile
- course
- event
- project
- merch/product
- major editorial/public landing page

### Image resolution priority

1. explicit `social_image` for the entity;
2. approved entity `main_image` / `hero_image`;
3. **global branded fallback image**.

A public entity must not silently produce a text-only social card merely because its specific image is missing.

### Required metadata

For indexable/public pages:

- `og:title`
- `og:description`
- `og:type`
- `og:url`
- `og:image`
- `og:image:alt`
- `twitter:card`
- `twitter:title`
- `twitter:description`
- `twitter:image`
- canonical URL

Use absolute production URLs beginning with `https://dementor.club/`.

### Global fallback rule

The global fallback must:

- be a deliberately branded Dementor Club image;
- follow CURRENT design canon;
- contain no temporary/demo data;
- remain stable enough for cached Telegram/Meta previews;
- live in a production asset path with a deterministic URL.

Suggested contract path:

`/assets/brand/social-fallback.webp`

Do not manufacture an entity-specific fake visual from unrelated content. Fallback is explicitly generic and branded.

### Social preview QA

Before public posting, verify representative links in at least:

- Telegram
- WhatsApp or equivalent messenger where practical
- Meta/Facebook debugger or preview
- LinkedIn/X preview where used by the team

A missing preview image is a release warning for ordinary pages and a **blocker for a page actively scheduled for public promotion**.

---

## 5. SEO / Indexation QA

### Brand rule

SEO must not flatten or rewrite approved Dementor visible voice merely to insert search phrases.

**Visible brand layer ≠ machine/search layer.**

Strengthen SEO through:

- metadata;
- canonical URLs;
- structured data;
- sitemap;
- internal linking;
- entity-specific public pages;
- useful supporting copy where editorially approved.

Do not automatically rewrite approved H1/hero copy.

### Indexable/public surfaces

Public club/editorial/entity pages are indexable unless an explicit source-of-truth says otherwise.

### Private/internal surfaces

At minimum, these classes must be `noindex`:

- `/workspace/`
- `/profile/`
- `/account/`
- `/auth/*`
- session-bound private result pages
- admin / diagnostics / design-system / test / staging surfaces

Use appropriate robots metadata such as:

`noindex,nofollow,noarchive`

when the route is not intended for discovery.

Noindex does **not** disable analytics after consent.

### Legacy origin blocker

Production artifact must not reference legacy public origins such as:

- `sladzari.github.io/degradation_club`
- `/degradation_club/` root assumptions
- `degradation-club.vercel.app`

except where retained solely in non-public historical documentation that cannot affect runtime or metadata.

---

## 6. Analytics QA

Analytics contract source:

- `docs/analytics/ANALYTICS_EVENT_MAP_V1.md`
- `docs/analytics/ANALYTICS_HANDOFF_V1.md`

Production integrations:

- GA4: `G-QTZY2GKZ4R`
- Microsoft Clarity: `y9yuo1zabw`

Analytics remains consent-gated according to the approved privacy flow.

### Approved event parameter dimensions

- `entity_type`
- `entity_id`
- `placement`
- `source_page`
- `cta_id`
- `member_state`

### Success semantics

Do not convert clicks into success events.

- `assessment_complete` only after result state is actually saved/confirmed;
- `auth_complete` only after Supabase session/user confirmation;
- `workspace_open` only after authenticated workspace state is actually rendered.

### PII blocker

Never send to GA4 or Clarity:

- email;
- name/full name;
- phone;
- Supabase/user IDs;
- auth tokens;
- assessment answers;
- free text or other identifying/private payloads.

### Production verification

After deploy, verify:

- GA4 page views;
- representative semantic events;
- no duplicate tag loads;
- Realtime/DebugView where applicable;
- Clarity recordings;
- Clarity tags: `dc_page`, `dc_entity_type`, `dc_entity_id`, `dc_member_state` where available;
- no analytics breakage of auth/session/callback.

---

## 7. Supabase QA

Production candidate must preserve and verify:

- Site URL / redirect URLs for `https://dementor.club`;
- auth callback;
- session persistence;
- profile sync;
- join application;
- assessment save/load;
- workspace membership/roles;
- course enrollment/progress where active;
- public merch/catalog flow where active;
- RLS behavior for anonymous and authenticated users.

Do not create disposable test records in production without cleanup/rollback.

---

## 8. Responsive QA

At minimum review:

- narrow mobile;
- standard mobile;
- tablet/intermediate width;
- laptop;
- wide desktop.

Check:

- content clipping;
- fixed-height traps;
- image disappearance;
- buttons below inaccessible viewport regions;
- overlays covering important image/content;
- z-index/layering;
- text/image collisions;
- large-display image cropping inconsistent with approved composition.

Responsive behavior is part of the page's declared design canon validation.

---

## 9. Production preparation gate

Any visual update remains staging work until it passes production readiness.

Required sequence:

1. work from approved staging/source branches;
2. resolve `DEMENTOR_DESIGN_CANON_CURRENT.md`;
3. validate visual state against the declared canon;
4. ensure demo/mock/placeholder/internal content cannot enter the production artifact;
5. reconcile with current `dementor-club-production` — never reset/overwrite production;
6. preserve production hotfixes/runtime closure;
7. run build and integrity/CI checks;
8. verify routes/assets/CSS/JS/fonts;
9. verify SEO/indexation/social previews;
10. verify analytics/privacy;
11. verify Supabase flows;
12. perform responsive QA;
13. prepare a dedicated production PR;
14. require green `validate`/candidate checks;
15. require explicit human visual approval;
16. merge into `dementor-club-production`;
17. deploy only through protected manual `Deploy Dementor Production` flow with explicit `APPROVED`;
18. perform post-deploy smoke test.

**Never deploy automatically merely because a PR is green.**

---

## 10. Post-deploy smoke test

After every production deploy verify the live `https://dementor.club` surface:

- Home
- About
- Events
- Projects
- Community
- Merch
- Join
- Account/Profile
- Workspace
- Auth callback
- primary course pages
- Dementor profile pages scheduled for promotion
- navigation
- mobile layout
- console errors
- 404/assets
- HTTPS
- canonical/OG
- Supabase session/data flows
- GA4/Clarity live behavior

For any URL about to be publicly posted, additionally verify the actual messenger/social preview before campaign launch.

---

## 11. Release blocker policy

Examples of blockers:

- active page violates its declared design canon materially;
- required route is broken;
- auth/session callback broken;
- missing critical runtime asset/CSS/JS;
- PII sent to analytics;
- private route accidentally indexable;
- legacy origin in live canonical/OG/runtime path;
- production build/validate red;
- approved public-promotion page has no usable social preview;
- production candidate overwrites newer production hotfixes;
- unapproved cart/checkout/commerce state becomes public.

Warnings do not block only when explicitly accepted and documented.

---

## 12. Migration to a new design canon

When v11 (or later) is approved:

1. create the new canon file;
2. obtain explicit human design approval;
3. update only `DEMENTOR_DESIGN_CANON_CURRENT.md` to point to it;
4. keep v10 historically unchanged;
5. classify existing pages as valid-under-old-canon / migration-required / regressed;
6. migrate deliberately and revalidate;
7. do not rewrite baselines automatically.

This QA contract remains active until replaced by a newer explicitly approved QA contract.
