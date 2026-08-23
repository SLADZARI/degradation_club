# Dementor Club — social preview assets

Status: **RASTER PIPELINE / ASSETS PENDING**
Updated: 2026-08-23

Canonical binary requirements: `docs/RASTER_ASSET_SPEC_v1.md`.

All OpenGraph/social preview artwork is raster-only.

## Delivery format

- canvas: 1200×630 px;
- preferred: JPG or WebP;
- PNG only when transparency is genuinely useful before compositing;
- final social delivery has no alpha;
- no SVG social artwork;
- no raster-to-vector tracing;
- text must remain readable in small Telegram/Threads/X previews;
- keep essential copy inside safe margins;
- use PAPER / INK / ACID as the club-level base; project-specific colour may override only inside an approved project subsystem.

## Required files

- `og-home-1200x630.jpg`
- `og-about-1200x630.jpg`
- `og-events-1200x630.jpg`
- `og-fuengirola-1200x630.jpg`
- `og-projects-1200x630.jpg`
- `og-logic-awareness-1200x630.jpg`
- `og-community-1200x630.jpg`
- `og-merch-1200x630.jpg`
- `og-join-1200x630.jpg`

## Composition rules

Every card should contain:
1. Dementor Club provenance;
2. one strong headline or entity title;
3. no more than one major Dementor Ink image/interruption;
4. readable status where relevant (`PLANNED`, `ACTIVE`, etc.);
5. no fake URL/domain until the canonical production domain is approved.

## Integration gate

Do not add `og:image` to public pages until the corresponding raster file exists in this folder and the canonical production host is verified.
