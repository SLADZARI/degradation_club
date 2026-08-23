# Dementor Club — Binary Asset Manifest

Status: WEB READY / NOT YET LIVE
Updated: 2026-08-23

This manifest records binaries produced and QA-checked during release preparation. It does not claim that the files are committed to Git or available on the production domain.

## High-resolution Dementor Ink WebP

| Delivery file | Dimensions | Approx. size | Status |
|---|---:|---:|---|
| `home-interruption-03.webp` | 2200×1376 | 173.5 KB | WEB READY |
| `about-service-03.webp` | 2000×1333 | 172.1 KB | WEB READY |
| `logic-awareness-03.webp` | 2000×1333 | 381.6 KB | WEB READY |
| `event-fuengirola-03.webp` | 2200×1467 | 450.8 KB | WEB READY |

All four decode successfully and fit the approved Raster Ink delivery budgets.

## OpenGraph / social JPEG

All files are exactly 1200×630, sRGB JPEG, no alpha, within the approved 500 KB target.

| Delivery file | Approx. size | Factual basis | Status |
|---|---:|---|---|
| `og-home-1200x630.jpg` | 96.6 KB | canonical club proposition + Home Ink | WEB READY |
| `og-about-1200x630.jpg` | 95.6 KB | About proposition + About Ink | WEB READY |
| `og-events-1200x630.jpg` | 103.7 KB | Events programme; `PLANNED / 01` | WEB READY |
| `og-fuengirola-1200x630.jpg` | 78.5 KB | Event 001 / Fuengirola / Spain / PLANNED | WEB READY |
| `og-projects-1200x630.jpg` | 112.6 KB | Projects index; one active project | WEB READY |
| `og-logic-awareness-1200x630.jpg` | 101.9 KB | Project 001 / active / club provenance | WEB READY |
| `og-community-1200x630.jpg` | 25.8 KB | Community / mechanics pending | WEB READY |
| `og-merch-1200x630.jpg` | 47.4 KB | Merch / in development; no invented product | WEB READY |
| `og-join-1200x630.jpg` | 42.8 KB | Join onboarding/procedure | WEB READY |

## Visual QA

The nine OG cards were reviewed together as a contact sheet.

Checks passed:

- headline remains readable at reduced preview scale;
- essential text remains inside the approved safe zones;
- brand provenance is present;
- ACID is used as a signal rather than a full-card effect;
- pages with approved Ink use one visual idea maximum;
- Community / Merch / Join do not fabricate membership privileges, products, prices or acceptance states;
- Fuengirola shows only the approved city/location/status layer.

## Remaining publication step

The runtime available in this session cannot directly upload local binary paths through the GitHub connector. Therefore these files remain `WEB READY`, not `LIVE`.

Required publication sequence:

1. commit the four `-03.webp` files to `assets/ink/`;
2. commit the nine OG JPEGs to `assets/social/`;
3. update HTML `og:image` / `twitter:image` references to the corresponding social files;
4. update page Ink references to the `-03` delivery files;
5. deploy;
6. fetch every binary from production and verify MIME/status;
7. mark `LIVE` only after visual production QA.
