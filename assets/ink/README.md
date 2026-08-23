# Dementor Ink — site asset slots

Status: **ASSET PIPELINE / RASTER ONLY / IMAGES PENDING**
Updated: 2026-08-23

Canonical binary requirements: `docs/RASTER_ASSET_SPEC_v1.md`.

The site must use real Dementor Ink artwork, not CSS grunge, generic texture effects or vector stand-ins.

## Required production files

1. `home-interruption-01.webp` — Home, full-width interruption after featured project.
2. `about-service-01.webp` — About, contradiction between orderly system and human behaviour.
3. `logic-awareness-01.webp` — project page, Ministry / observation / causal-link scene.
4. `event-fuengirola-01.webp` — only after an approved event visual exists.

## Raster-only rule

Artistic Dementor Ink illustrations must **not** be created or delivered as SVG.

Allowed delivery formats:
- `WEBP` — default web delivery;
- `PNG` — when real transparency/alpha is required;
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

`.dc-ink-slot` marks the reserved positions. These placeholders are intentional and must not be replaced with synthetic CSS splashes or vector approximations.
