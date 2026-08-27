# DESIGN AUDIT — Batch 4D.3 / UI Pressure

Status: COMPLETE on audit branch.

## Problem

`/ui-v2.css` remained one of the highest-pressure shared layers after the presentation and visual standards were cleaned. It still contained 24 `!important` declarations across contrast, mobile typography, transformed states and reduced-motion fallbacks.

Because `/ui-v2.css` is a shared baseline imported before later presentation/component layers, it must not force ownership over route-specific geometry.

## Change

- Removed all `!important` declarations from `/ui-v2.css`.
- Preserved the explicit shared imports that are currently multi-route responsibilities:
  - `/ink-interventions.css`
  - `/editorial-system.css`
  - `/mouthwash-v1.css`
  - `/dia-v1.css`
  - `/accessibility-v1.css`
- Did not incorrectly scope these layers to Home: source inspection confirms they are used by About, Projects, Events, Catalog, Logic and generic entity behaviours as well.
- Kept legacy mobile guardrail files out of `ui-v2.css`; viewport safety remains owned by `/mobile-guardrails.css`.

## Audit contract

`scripts/audit-ui-pressure.mjs` requires:

- `ui-v2.css` has zero `!important`;
- current shared imports remain explicit;
- legacy `/mobile-qa.css` and `/mobile-overflow-fix.css` imports never return.

## Result

Migration commit:

`9fa22396a74b6963843c81055bbdff04f6c90bb8`

The full design audit passed before the migration workflow was frozen.

## Next

The remaining high-pressure files are now primarily route/component owners rather than global baselines: `/home-v1.css`, `/course-bridge-v1.css`, `/dementor-roster.css`, `/illustration-surfaces.css`, `/accessibility-v1.css`, `/event-system.css` and individual course styles. These should be reduced only after checking their actual route ownership, not by blind global replacement.
