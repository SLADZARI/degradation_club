# Dementor Ink — site asset slots

Status: **ASSET PIPELINE / IMAGES PENDING**
Updated: 2026-08-23

The site must use real Dementor Ink artwork, not CSS grunge or generic texture effects.

## Required production files

1. `home-interruption-01.webp` — Home, full-width interruption after featured project.
2. `about-service-01.webp` — About, contradiction between orderly system and human behaviour.
3. `logic-awareness-01.webp` — project page, Ministry / observation / causal-link scene.
4. `event-fuengirola-01.webp` — only after an approved event visual exists.

## Export rules

- WebP or AVIF preferred.
- Transparent background when the artwork is meant to cross the grid.
- Keep a high-resolution master in Drive; Git stores web delivery assets only.
- No fake paper texture baked into every image.
- No horror/gothic treatment unless explicitly approved for a specific work.
- Alt text must describe the scene, not the style.

## Current implementation

`.dc-ink-slot` marks the reserved positions. These placeholders are intentional and must not be replaced with synthetic CSS splashes.
