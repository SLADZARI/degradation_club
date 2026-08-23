# Dementor Club — Production QA v1

Status: active implementation checklist  
Updated: 2026-08-23

## 1. Routes that must resolve

- `/`
- `/about/`
- `/events/`
- `/events/fuengirola/`
- `/projects/`
- `/projects/logic-awareness/`
- `/community/`
- `/merch/`
- `/join/`
- `/404.html`
- `/robots.txt`
- `/site.webmanifest`

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
- mobile uses `INDEX`, not a marketing hamburger experience;
- keyboard focus is visible;
- all entity links resolve to real routes;
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
- hover-dependent meaning must remain available on touch.

## 5. Dementor Ink

Production asset slots:

- `/assets/ink/home-interruption-01.webp`
- `/assets/ink/about-service-01.webp`
- `/assets/ink/logic-awareness-01.webp`
- `/assets/ink/event-fuengirola-01.webp`

Until approved assets exist, keep the slot explicit. Do not fake Ink with CSS grunge, generic splatter, horror imagery or stock illustrations.

## 6. Metadata

Already required on key pages:

- unique `<title>`
- unique meta description
- OpenGraph title / description / type / locale
- Twitter summary card baseline

Blocked until production domain and social image are approved:

- canonical URLs
- `og:url`
- `og:image`
- sitemap absolute URLs

Never point canonical metadata at an unstable Vercel preview URL.

## 7. Accessibility

Check:

- one semantic H1 per page;
- navigation labelled;
- buttons/links have understandable text outside project context;
- focus-visible state remains visible over PAPER / INK / ACID;
- reduced motion works;
- contrast is preserved;
- text is not encoded only inside images.

## 8. Production hardening

`vercel.json` provides:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`
- restricted camera / microphone / geolocation / payment permissions
- immutable caching for `/assets/*`

A strict CSP is intentionally postponed because the current Join implementation still contains inline style/script blocks. CSP should be introduced after those are externalized.

## 9. SEO/indexing state

`robots.txt` currently allows indexing but intentionally contains no sitemap until the canonical domain is approved.

404 has `noindex`.

Draft editorial units from `logic-awareness` are not exposed as published site articles until their project source marks them publishable.

## 10. Deployment gate

Production-ready means all are true:

1. canonical production domain approved;
2. Vercel project connection confirmed;
3. current `dementor-club-site` branch deployed;
4. routes above return 200 except deliberate 404 tests;
5. responsive matrix visually checked;
6. no console/runtime errors;
7. real Dementor Ink assets installed;
8. OG image system installed;
9. canonical + sitemap enabled;
10. final source-of-truth sync recorded.

Current blocker: connected Vercel tool does not return the project and the previously known preview URL cannot be resolved through the connector. Do not claim a verified deployment until this changes.
