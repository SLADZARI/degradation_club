# DESIGN AUDIT — BATCH 4D / COMPATIBILITY LAYERS

Status: completed sub-batch / course bridge scoping.

## Problem confirmed

`course-bridge-v1.css` was imported by `presentation-standard-v1.css`, which is itself part of the global `/styles.css` chain. As a result, course-only compatibility rules were active on every scanned route, including About, Community, Catalog, 404 and other unrelated pages.

This was a layer ownership error, not a visual design decision.

## Change

- Removed the global `@import` of `/course-bridge-v1.css` from `presentation-standard-v1.css`.
- Added explicit `/course-bridge-v1.css` links to the four current course routes:
  - `/courses/dengi-na-veter/`
  - `/courses/dumai-s-opasnostyu/`
  - `/courses/ne-komanda/`
  - `/courses/slaboumie-i-otvaga/`
- Updated the permanent presentation audit so the baseline layer is required to remain course-agnostic.
- Added `audit-compatibility-layers.mjs` to fail if the course bridge leaks outside `/courses/` again.

## Result

Course compatibility now has route ownership instead of global ownership. Non-course pages lose one entire active CSS layer without changing the approved course pages themselves.

## Still open in Batch 4D

The global `ui-v2.css` import graph still includes multiple compatibility / behavior layers: `mobile-overflow-fix.css`, `mobile-qa.css`, `ink-interventions.css`, `mouthwash-v1.css`, `dia-v1.css`, `editorial-system.css`, and `accessibility-v1.css`.

Next step: classify those layers into global baseline vs Home-only vs temporary compatibility, then consolidate/remove only after ownership gates are added.
