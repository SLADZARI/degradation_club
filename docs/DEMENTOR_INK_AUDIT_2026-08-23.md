# Dementor Ink — implementation audit

Date: 2026-08-23
Branch: `dementor-club-site`

## Density map

| Route | Level | Role | Raster source |
|---|---:|---|---|
| `/` | L3 | TAKEOVER | `assets/ink/home-interruption-02.webp` |
| `/about/` | L2 | CONTAMINATION | `assets/ink/about-service-02.webp` |
| `/projects/logic-awareness/` | L2 | LEAK | `assets/ink/logic-awareness-02.webp` |
| `/events/fuengirola/` | L2 | FIELD RECORD | `assets/ink/event-fuengirola-02.webp` |
| `/events/` | L1 | TRACE | current event preview fragment |
| `/projects/` | L1 | TRACE | current project preview fragment |
| `/catalog/` | L1 | TRACE | no single raster representative; register remains neutral |
| `/archive/` | L0 | SILENCE | none |
| `/community/` | L0 | SILENCE | none |
| `/merch/` | L0 | SILENCE | none until approved objects exist |
| `/join/` | L0 | SILENCE | none |

## Distribution check

Current primary/system routes in this audit: 11.

- L0: 4 routes
- L1: 3 routes
- L2: 3 routes
- L3: 1 route

This is directionally consistent with the approved target distribution 40 / 30 / 20 / 10 and keeps L3 rare.

## Responsive safety

Implemented:

- L2/L3 large scenes use `width:100%` on mobile;
- no large Ink scene may create document-level horizontal overflow;
- mobile rotations are removed for large scenes;
- L1 raster trace fragments become small in-flow elements;
- trace decorative images are `aria-hidden` and use empty alt because the same entity is already identified textually in the register;
- essential factual data remains outside raster artwork;
- hover is never the only way to access entity content.

## Reduced motion

Implemented:

- Ink rotation is removed under `prefers-reduced-motion`;
- Home takeover image transition is disabled;
- DIA variation cannot rotate Ink under reduced motion;
- page meaning and entity status remain identical.

## Asset discipline

No artistic SVG was introduced.
No CSS-generated splatter/grunge is used as substitute art.
L1 uses approved existing raster previews only where the page has one unambiguous current entity.
Catalog does not select a single entity image to represent the whole registry.

## Remaining verification

Code-level contract is implemented. `LIVE` status still requires production verification after Vercel deploy at the target widths:

- 1440
- 1024
- 768
- 430
- 390
- 360

Production verification must specifically check crop, horizontal overflow, trace overlap with headings/controls, and that each raster URL resolves publicly.
