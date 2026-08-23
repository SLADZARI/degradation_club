# Dementor Ink — site asset slots

Status: **APPROVED RASTER SET / DRIVE MASTER + WEB READY**
Updated: 2026-08-23

Canonical binary requirements: `docs/RASTER_ASSET_SPEC_v1.md`.

The site must use real Dementor Ink artwork, not CSS grunge, generic texture effects or vector stand-ins.

## Approved production set

1. `home-interruption-01.webp` — Home, full-width interruption after featured project.
   - web delivery: 2200×1376, WebP
   - master: `home-interruption-01-master.png`
   - Drive web file: `1Ltdpyb6L8AYuF6q4sIW3TmU6wpH1qlrL`
   - Drive master: `1WHd-h7ki8uwQadUjFOVNfGoDIetYdTbV`
2. `about-service-01.webp` — About, service metaphor / brain on tray.
   - web delivery: 2000×1333, WebP
   - master: `about-service-01-master.png`
   - Drive web file: `1FrfjBw71MwkyIqQdAE3id2ileJEuRPZW`
   - Drive master: `1_n5TCQY49RsyoKRJdw03sAzp_a16LMsH`
3. `logic-awareness-01.webp` — Logic & Awareness, bureaucratic maze inside the head.
   - web delivery: 2000×1333, WebP
   - master: `logic-awareness-01-master.png`
   - Drive web file: `1VRDlHFtFpn6rQjPXhJeudyZa8dTF2ao6`
   - Drive master: `1p669_WbTjwnuB2MkMy_vG2ETD-LCQXr4`
4. `event-fuengirola-01.webp` — Fuengirola event, ink promenade / sea / palms.
   - web delivery: 2200×1467, WebP
   - master: `event-fuengirola-01-master.png`
   - Drive web file: `1M3hTQBMXvuZdb8DGAfD2vu5g5l6nqfMt`
   - Drive master: `1-_QUPKOxhSrGOz6cYN6kP02krGPl0JwK`

All eight files are stored in the canonical Google Drive `References / Dementor Ink` folder.

## Raster-only rule

Artistic Dementor Ink illustrations must **not** be created or delivered as SVG.

Allowed delivery formats:
- `WEBP` — default web delivery;
- `PNG` — high-resolution raster masters or when real transparency/alpha is required;
- `JPG/JPEG` — scans, photographs and social exports where transparency is irrelevant.

SVG is not an illustration format for Dementor Club. It may be used only for purely technical UI geometry/icons if separately required, never as a substitute for Ink artwork.

## Export rules

- WebP preferred for site delivery.
- PNG when artwork needs transparent edges crossing the grid.
- JPG/WebP for scanned paper or photographic source material.
- Keep a high-resolution raster master in Drive; Git stores optimized web delivery assets only.
- No fake paper texture baked into every image.
- No horror/gothic treatment unless explicitly approved for a specific work.
- Alt text must describe the scene, not the style.
- Do not autotrace raster Ink into SVG.

## Current implementation

`ui-v2.css` now maps the approved raster filenames to:
- Home `.dc-ink-slot`;
- About `.dc-ink-slot`;
- Logic & Awareness `.dc-ink-slot`;
- Fuengirola hero intrusion.

The code expects the WebP delivery files at `/assets/ink/*.webp`. Until binary Git synchronization is available, Drive is the canonical binary store and the site paths remain the production contract.
