# DESIGN AUDIT — BATCH 6 / SHARED CROSS-ROUTE SYSTEMS

Status: COMPLETED
Branch: `design-audit-batch-2026-08-27`

## Scope

Shared cross-route CSS systems were audited as one batch:

- `dia-v1.css`
- `mouthwash-v1.css`
- `ink-interventions.css`
- root `styles.css`

## Decisions

### DIA

Ordinary mobile force overrides were removed. The only remaining `!important` declarations are reduced-motion hard stops. They are treated as accessibility invariants, not visual layout overrides.

### Mouthwash

The composition/rhythm layer now has zero `!important`. It remains responsible for rhythm and route composition only.

### Ink interventions

`ink-interventions.css` no longer owns generic `.dc-ink-slot` geometry, crop, surface, pseudo labels or page-scale takeover behavior. Canonical raster geometry/crop remains in `illustration-surfaces.css`.

The Ink intervention system retains only explicit trace/intervention behavior (`.dc-ink-trace`, `.dc-ink-trace-media`) that does not compete with canonical raster slots.

### Root styles

Legacy primitives remain in `styles.css`, but all force overrides were removed. This batch does not redesign legacy primitives; it only removes cascade coercion.

## Before / after

- `dia-v1.css`: 5 → 2 `!important` (reduced-motion only)
- `mouthwash-v1.css`: 1 → 0
- `ink-interventions.css`: 4 → 0
- `styles.css`: 6 → 0

Machine report: `artifacts/design-batch6-shared-systems-report.json`.

## Permanent gate

`audit-shared-systems.mjs` is now part of the permanent Design Audit workflow. It enforces:

- no ordinary `!important` in DIA;
- no `!important` in Mouthwash, Ink interventions, or root styles;
- generic Ink slot ownership stays in `illustration-surfaces.css`;
- trace-level Ink intervention behavior remains present.

## Result

Shared cross-route systems no longer compete with the canonical raster surface contract or rely on force overrides for normal layout behavior.
