# DESIGN AUDIT — BATCH 4B / CASCADE PRESSURE

Status: COMPLETE on `design-audit-batch-2026-08-27`.

## Goal
Reduce forced CSS overrides only after ownership contracts were established in Batches 1–4A.

## Completed
- `visual-standard-v2.css` no longer depends on `!important`.
- Canonical FEATURE, RELATION and EVENT HERO are override-free.
- Dementor relation portraits use `object-fit: contain` + `object-position: center bottom`, matching the full-illustration portrait contract.
- Person-specific portrait surfaces no longer force background values with `!important`.
- Home Fuengirola structural selectors no longer require forced declarations.
- Event HERO no longer requires forced layout, image or responsive declarations.
- Event HERO audit was updated to explicitly reject `!important` in the canonical Event contract.

## Measured change
Before Batch 4B, `visual-standard-v2.css` had 52 `!important` declarations in the active style graph. After migration: 0.

## Remaining cascade pressure
The largest remaining active override sources are outside `visual-standard-v2.css`:
- `presentation-standard-v1.css`
- `course-bridge-v1.css`
- `ui-v2.css`
- `home-v1.css`
- `mobile-qa.css`
- `mobile-overflow-fix.css`
- `illustration-surfaces.css`

These must be handled by owner/component scope, not by global removal.

## Permanent gates
The regular Design Audit now checks:
1. style graph ownership;
2. Dementor HERO;
3. Event HERO;
4. FEATURE / RELATION;
5. Ink surfaces;
6. inline style ownership;
7. cascade pressure.

The final non-migration Design Audit after cleanup passed all seven gates.
