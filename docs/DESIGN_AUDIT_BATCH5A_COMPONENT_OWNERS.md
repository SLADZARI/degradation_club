# DESIGN AUDIT — BATCH 5A / COMPONENT OWNER HARDENING

Status: completed on audit branch.

## Scope

Owner-level cascade cleanup for:

- `home-v1.css`
- `dementor-roster.css`
- `event-system.css`
- `illustration-surfaces.css`

## Result

All four owner stylesheets are now free of `!important` while preserving their existing component contracts.

### Home

`home-v1.css` remains the route owner for Home composition. The cached legacy Home Ink-slot suppression remains, but no longer relies on forced cascade. Full-bleed hover surfaces for index/sphere rows retain their structure without `!important`.

### Dementor roster

`dementor-roster.css` remains the only roster identity/layout bridge. Portrait contain behavior, personal background variables and the mobile 58px portrait grid remain intact without forced overrides.

### Event system

`event-system.css` keeps programme, lifecycle and relation behavior. Fuengirola mobile/pullquote/portrait compatibility rules remain route-scoped but are no longer force-applied.

### Illustration surfaces

`illustration-surfaces.css` remains the canonical contain-first image-surface owner. Community duplicate-scene suppression, authority surfaces and Fuengirola surfaces now rely on owner specificity/order rather than `!important`.

## Guardrail

Permanent check: `scripts/audit-component-owner-hardening.mjs`.

It fails if any of these four owner files regains `!important` or loses the critical Home, roster, event or illustration contracts.

## Validation

The migration passed the full Design Audit suite before commit, including HERO, Event HERO, FEATURE/RELATION, Ink surfaces, inline ownership, cascade pressure, presentation pressure, compatibility layers, mobile guardrails and ui-v2 pressure.
