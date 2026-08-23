# Dementor Club — Raster Ink & OG Asset Production Specification v1

Status: **APPROVED PRODUCTION CONTRACT**  
Updated: 2026-08-23

This specification consolidates all requirements for binary raster artwork used by the official Dementor Club website and social previews.

## 1. Core rule

All artistic Dementor Ink and OpenGraph/social preview assets are **raster-only**.

Allowed delivery formats:

- `WEBP` — default web-delivery format for Dementor Ink;
- `PNG` — when real alpha/transparency is required;
- `JPG` — photographic/scanned/social-preview delivery where transparency is not required.

Forbidden:

- SVG illustrations;
- raster-to-vector tracing;
- embedded bitmap wrapped in SVG;
- generic CSS splatter used as a substitute for approved Ink art;
- decorative stock grunge, generic horror, gothic/fantasy or AI-looking texture packs.

Technical SVG may be used only for simple non-artistic UI icons if required. It is never a Dementor Ink delivery format.

## 2. Master vs delivery assets

### Drive master

Google Drive stores the highest-quality visual master:

- layered source when available;
- scan/photo master at full useful resolution;
- lossless or visually lossless export;
- no premature downscaling;
- no destructive sharpening baked into the only master.

### Git/web delivery

Git stores only optimized web-delivery binaries and their documentation.

Delivery asset must:

- be correctly cropped for its specific slot;
- use sRGB;
- strip unnecessary EXIF/GPS metadata;
- preserve intentional paper/ink texture;
- avoid visible compression blocks around linework;
- avoid unnecessary oversize dimensions.

## 3. Dementor Ink visual contract

Dementor Ink is proprietary commentary, not a generic illustration style.

Narrative rule:

**normal situation + one wrong condition**

Approved characteristics:

- black ink;
- nervous hand line;
- dry brush;
- blots/splashes only when they belong to the drawing;
- unfinished areas;
- exaggerated gesture;
- warm paper/transparent field depending on placement;
- meaningful interruption of a disciplined UI.

Avoid by default:

- monsters as a recurring brand device;
- skulls;
- blood;
- horror eyes;
- gothic/fantasy imagery;
- polished digital painting;
- generic editorial stock illustration;
- fake aged-paper overlay on every file.

Ink should add a contradiction or second reading. If removing the illustration does not change the meaning, the visual is probably decorative and should be reconsidered.

## 4. Ink density

Target site distribution:

- Level 0 — no illustration: ~40%;
- Level 1 — small mark/hand/blot: ~30%;
- Level 2 — object/character: ~20%;
- Level 3 — full-width/full-screen takeover: ~10%.

Do not place Level 3 art on every page.

## 5. Required site Ink assets

### 5.1 Home

File: `assets/ink/home-interruption-01.webp`

Purpose: deliberate full-width interruption after the featured project.

Composition:

- one dominant human/object scene;
- wide composition suitable for desktop;
- central meaning must survive mobile crop;
- artwork may cross imagined grid boundaries;
- avoid embedding essential text in the image.

Recommended master ratio: **16:9 to 3:2**.  
Recommended delivery width: **2000–2400 px**.  
Preferred format: **WebP**.  
Target delivery size: **≤ 600 KB**, preferred **250–450 KB** where visual quality allows.

### 5.2 About

File: `assets/ink/about-service-01.webp`

Purpose: contradiction between orderly system and human behaviour.

Recommended master ratio: **4:3 or 3:2**.  
Recommended delivery width: **1600–2200 px**.  
Preferred format: **WebP**; use PNG only when transparent crossing of the grid materially improves composition.  
Target delivery size: **≤ 500 KB**.

### 5.3 Logic & Awareness

File: `assets/ink/logic-awareness-01.webp`

Purpose: Ministry / observation / causal-link scene inside the independent project subsystem.

Must preserve the project's intellectual inversion before Soviet/constructivist visual jokes.

Allowed local visual additions:

- muted bureaucratic red;
- stamps/seals;
- propaganda-like composition;

These additions do not become global Dementor Club identity.

Recommended ratio: **4:3 to 3:2**.  
Recommended delivery width: **1600–2200 px**.  
Target delivery size: **≤ 550 KB**.

### 5.4 Fuengirola event

File: `assets/ink/event-fuengirola-01.webp`

Status: **ONLY AFTER EVENT VISUAL IS APPROVED**.

Do not create fake event facts, venue, programme, dates or participants inside the artwork.

Recommended ratio: **3:2 or 16:9**.  
Recommended delivery width: **1800–2400 px**.  
Target delivery size: **≤ 600 KB**.

## 6. Alpha and background rules

Use transparency only when the illustration must genuinely cross the UI grid or sit directly on PAPER/INK backgrounds.

When transparency is required:

- use PNG for master/delivery if WebP alpha introduces visible edge defects;
- keep soft/ink edges natural;
- never add a fake white matte halo;
- test on both `#F2F0E8` and `#111111` if the asset can appear on both.

When transparency is not required, prefer WebP/JPG for smaller files.

## 7. Colour and tonal requirements

Club base:

- PAPER `#F2F0E8`;
- INK `#111111`;
- ACID `#D8FF3E`.

Raster artwork does not need to contain all three colours. In many Ink assets, black + transparent/paper is preferable.

Rules:

- encode/export in **sRGB**;
- do not use Display-P3-only colours for critical signals;
- retain readable black density after compression;
- avoid crushed detail that turns hand linework into a digital black mass;
- ACID should remain a signal, not a permanent image background.

## 8. Cropping and responsive safety

Each important Ink composition must be evaluated at:

- 1440 px desktop;
- 1024 px;
- 768 px;
- 390 px mobile;
- 360 px mobile.

The asset itself may have one delivery file if CSS crop works safely. Produce a dedicated mobile crop only if the dominant subject/meaning is lost.

If a mobile crop is required, name it:

`<base-name>-mobile.webp`

Do not create mobile variants by simply shrinking embedded text.

Safe composition rules:

- keep the key subject away from both extreme left/right edges unless intentional cropping is part of the concept;
- no essential text inside imagery;
- allow some expendable negative/ink space for `object-fit: cover`;
- test portrait-like crops before approval.

## 9. Accessibility for Ink

Every site image needs meaningful `alt` text in HTML unless it is truly decorative.

Alt text describes the **scene/meaning**, not the visual style.

Good:

`Мужчина спокойно сидит в офисном кресле, а его тень показывает неприличный жест.`

Bad:

`Крутая грязная тушевая иллюстрация Dementor Ink.`

Do not encode required factual information only in a raster image.

## 10. OpenGraph / social preview contract

All OG/social assets are raster-only.

Canvas: **1200 × 630 px** exactly for delivery.

Preferred delivery:

- JPG quality roughly 82–90, or equivalent visually optimized WebP;
- sRGB;
- no alpha in final social file;
- target file size **≤ 500 KB**, hard ceiling **1 MB** unless a platform-specific test proves otherwise.

Master may be larger (e.g. 2400 × 1260) but delivery remains 1200 × 630.

## 11. OG safe zones

Do not place essential text or provenance closer than:

- **60 px** from left/right edges;
- **50 px** from top/bottom edges.

Preferred headline safe block:

- first ~900–980 px of width;
- leave breathing room for platform crops/overlays;
- avoid tiny metadata at the extreme bottom.

The image must still communicate when shown around **320 px wide** in a chat preview.

## 12. OG composition hierarchy

Every OG card must contain:

1. Dementor Club provenance (`DEMENTOR CLUB` or approved brand lockup);
2. one dominant headline/entity title;
3. optional one major Dementor Ink interruption;
4. status only when factual and useful (`PLANNED`, `ACTIVE`, etc.);
5. no fake production URL/domain.

Recommended information limit:

- one headline;
- one kicker/status;
- one visual idea.

Do not turn OG images into miniature web pages.

## 13. Required OG files

- `assets/social/og-home-1200x630.jpg`
- `assets/social/og-about-1200x630.jpg`
- `assets/social/og-events-1200x630.jpg`
- `assets/social/og-fuengirola-1200x630.jpg`
- `assets/social/og-projects-1200x630.jpg`
- `assets/social/og-logic-awareness-1200x630.jpg`
- `assets/social/og-community-1200x630.jpg`
- `assets/social/og-merch-1200x630.jpg`
- `assets/social/og-join-1200x630.jpg`

## 14. Content direction per OG file

### Home

Headline direction: canonical service proposition / strongest current club statement.

Use club base colours. One Ink image maximum.

### About

Communicate what the club is, not a generic `ABOUT` label.

### Events

Use the Events system/index idea. Do not invent event count or dates.

### Fuengirola

Use only approved event facts. Current safe factual layer: entity name/location/status if still current at publication time. Re-check source-of-truth immediately before export.

### Projects

Communicate project ecosystem/index. Do not imply multiple active projects if not approved.

### Logic & Awareness

May use the Ministry local subsystem. Must retain `A DEMENTOR CLUB PROJECT` provenance.

### Community

Do not imply approved mechanics, membership privileges or access rules unless they exist in source-of-truth.

### Merch

Do not show invented products/prices/editions as existing goods.

### Join

Sell the onboarding/procedure experience. Do not promise acceptance/membership status unless club rules approve it.

## 15. Typography inside OG

Typography must survive small previews.

Rules:

- use strong Cyrillic-capable display type;
- avoid thin weights;
- avoid very long headlines;
- generally 2–5 lines maximum;
- do not use body text below a practical social-preview size;
- test Cyrillic letterforms before final export;
- preserve visual hierarchy at 50% and 27% scale.

Mandatory visual tests include:

`ОСОЗНАННОСТЬ`
`СОМНЕНИЕ`
`НЕЭФФЕКТИВНОСТЬ`

## 16. File naming

Naming is lowercase ASCII where possible, hyphen-separated, stable and semantic.

Examples:

`home-interruption-01.webp`
`about-service-01.webp`
`logic-awareness-01.webp`
`og-home-1200x630.jpg`

Versioning belongs in source/master metadata or Git history, not in random names like `final-final-2.jpg`.

## 17. Binary QA before commit

For every raster delivery file verify:

- correct pixel dimensions;
- correct format;
- sRGB;
- no accidental EXIF/GPS;
- no visible JPEG/WebP artifacts around linework/type;
- no unintended white/black fringe on alpha;
- subject survives target responsive crop;
- image has approved source/provenance;
- public facts in image are current;
- no SVG or traced-vector substitute;
- file size within target budget;
- HTML alt text/caption is prepared where applicable.

## 18. OG QA before integration

Before adding `og:image`:

- the exact 1200×630 file exists;
- headline is readable at ~320 px preview width;
- no edge-critical text;
- factual status is current;
- canonical production host is verified;
- absolute `og:image` URL resolves publicly;
- image response has correct MIME type;
- no auth/protection prevents crawlers from fetching it.

Do not integrate `og:image` against an unstable preview deployment.

## 19. Storage map

Google Drive:

- full-resolution masters;
- layered/source files;
- scans/photos;
- approved visual exports;
- review/contact sheets.

GitHub `dementor-club-site`:

- optimized site binaries in `assets/ink/`;
- optimized social binaries in `assets/social/`;
- this specification;
- mapping/integration code.

## 20. Approval state

Use four states for each binary:

- `DRAFT` — visual direction exists but not approved;
- `APPROVED MASTER` — content/composition approved, full-resolution master retained;
- `WEB READY` — optimized binary passed QA;
- `LIVE` — integrated and verified from production public URL.

An image is not `LIVE` merely because it exists in Drive or Git.

## 21. Production sequence

For each asset:

**source-of-truth check → art direction → raster master → approval → web/social export → binary QA → Git commit → page/metadata integration → production fetch check → LIVE**

This order is mandatory for event/project images containing factual claims.