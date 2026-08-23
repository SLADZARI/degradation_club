# Dementor Club — Release QA

Status: PRE-RELEASE AUDIT
Updated: 2026-08-23
Branch: `dementor-club-site`

## 1. Scope

Release path checked as a product system:

Home → Events / Projects / Catalog → entity page → Join → Archive.

The implementation layers currently present are:

- Public Records — entity architecture, event lifecycle, archive;
- Actual Source — register, metadata, catalog, previews;
- 032c — editorial openings, pull quotes, captions, notes;
- Mouthwash — page rhythm and whitespace system;
- DIA — behavioural identity and reduced-motion fallback;
- Dementor Ink — L0–L3 intervention system.

## 2. Route integrity

Repository tree contains the public routes:

- `/`
- `/about/`
- `/events/`
- `/events/fuengirola/`
- `/projects/`
- `/projects/logic-awareness/`
- `/community/`
- `/merch/`
- `/archive/`
- `/catalog/`
- `/join/`
- `/courses/dumai-s-opasnostyu/`
- `404.html`

Sitemap exists and includes the current public route set.

## 3. CSS / runtime delivery

READY:

- `ui-v2.css` now statically imports the final corrective/editorial/composition/behaviour layers;
- Mouthwash and DIA are no longer injected by JavaScript;
- `motion-v1.js` is behavioural only;
- mobile overflow protection uses explicit `!important` rules for the historically dangerous width/transform cases;
- Ink may violate the visual grid but must not expand the mobile layout viewport.

## 4. Mobile contract

Code-level guardrails exist for:

- 768 px;
- 430 px;
- 390 px;
- 360 px.

Expected behaviour:

- no document-level horizontal scrolling;
- no mobile type mutation/drift;
- Ink width constrained to the viewport;
- Catalog preview changes from hover to tap/reveal;
- touch actions remain at practical target sizes;
- Mouthwash spacing contracts on narrow screens;
- reduced-motion removes ambient transforms/animation without removing information.

LIVE visual verification on the deployed build is still required before marking mobile QA complete.

## 5. Raster Ink status

Current Git delivery files `*-02.webp` are valid but low-resolution placeholder/delivery binaries (roughly 7–9 KB each).

High-resolution masters are available and have been exported locally as production-ready WebP:

- `home-interruption-03.webp` — 2200×1376 — ~173.5 KB;
- `about-service-03.webp` — 2000×1333 — ~172.1 KB;
- `logic-awareness-03.webp` — 2000×1333 — ~381.6 KB;
- `event-fuengirola-03.webp` — 2200×1467 — ~450.8 KB.

All four fit the approved raster delivery budgets.

BLOCKER: the GitHub connector available in this session does not provide direct local-binary upload. These `-03` binaries are not yet LIVE and must not be described as published.

## 6. OpenGraph / social

BLOCKER:

`assets/social/` currently contains documentation only. The required physical 1200×630 social assets have not been committed.

Temporary page metadata points to existing Ink WebP imagery, but this does not satisfy the approved OG production contract.

Required final files remain:

- `og-home-1200x630.jpg`
- `og-about-1200x630.jpg`
- `og-events-1200x630.jpg`
- `og-fuengirola-1200x630.jpg`
- `og-projects-1200x630.jpg`
- `og-logic-awareness-1200x630.jpg`
- `og-community-1200x630.jpg`
- `og-merch-1200x630.jpg`
- `og-join-1200x630.jpg`

## 7. Canonical / robots

`robots.txt` intentionally does not declare a sitemap until the canonical production domain is formally approved.

Do not silently change this decision just because the current Vercel production URL is known.

Several pages use the current production URL in OpenGraph metadata, but final `rel="canonical"` rollout should be done only after canonical-domain approval is explicit.

## 8. Production verification

BLOCKER / EXTERNAL VERIFICATION:

The live Vercel domain could not be fetched through the available external web path during this audit. Therefore the following are not claimed as verified:

- exact deployed commit SHA;
- live visual rendering;
- HTTP response/MIME for all raster assets;
- social crawler access;
- real-device horizontal overflow;
- actual hover/tap behaviour in production.

A deployment being present in Git/Vercel is not enough to mark an asset or page LIVE.

## 9. Release state

### READY at code/system level

- Public Records architecture;
- event lifecycle and archive contract;
- unified entity catalog;
- editorial system;
- composition system;
- DIA behavioural system;
- Dementor Ink density/intervention system;
- mobile code guardrails;
- route tree and sitemap;
- safer asset cache policy.

### BLOCKERS before `v1 LIVE`

1. Commit and integrate high-resolution Ink delivery binaries.
2. Create and commit the nine physical 1200×630 OG/social assets.
3. Confirm/approve canonical production domain, then add canonical links and sitemap declaration to robots.
4. Verify the deployed production commit.
5. Run visual QA at desktop, 768, 430, 390 and 360 px on the live build.
6. Confirm all public asset URLs return the correct MIME/status and are accessible to crawlers.

## 10. Release principle

Do not close a blocker by changing its label.

`WEB READY` is not `LIVE`.

Final sequence:

approved source → implementation → binary QA → Git → deployment → live fetch → visual QA → LIVE.
