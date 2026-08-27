# DESIGN AUDIT — BATCH 4C / PRESENTATION PRESSURE

Status: COMPLETE / AUDITED

## Scope

`presentation-standard-v1.css` is a baseline presentation layer imported before `visual-standard-v2.css` and before route-owned CSS.

Batch 4C removes force-winning declarations from that baseline. Route/component owners must be able to override presentation defaults through normal cascade and source order.

## Result

- `presentation-standard-v1.css`: `!important` count reduced to `0`.
- Existing ACTION / ENTITY REGISTER / MOBILE contracts retained.
- `course-bridge-v1.css` import order retained.
- No component markup changed in this batch.
- No production branch change in this batch.

## Permanent gate

`scripts/audit-presentation-pressure.mjs` now fails if `presentation-standard-v1.css` regains `!important` or loses its key baseline contracts.

## Next pressure sources

Do not strip these globally without route/component classification:

1. `course-bridge-v1.css`
2. `ui-v2.css`
3. `home-v1.css`
4. `mobile-qa.css`
5. `mobile-overflow-fix.css`

These files contain route-specific or compatibility behavior and require owner-by-owner migration.
