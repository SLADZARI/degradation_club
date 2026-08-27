# DESIGN AUDIT — Batch 4D.2 / Mobile Guardrails

Status: COMPLETE on audit branch.

## Problem

Two global compatibility layers were active at the same time:

- `/mobile-qa.css`
- `/mobile-overflow-fix.css`

Both owned viewport overflow, mobile display type and transformed elements. They relied on `!important` to win against later layers, creating duplicate ownership and unstable mobile cascade.

## Change

1. Removed both legacy runtime files.
2. Removed both imports from `/ui-v2.css`.
3. Added one canonical `/mobile-guardrails.css` import after `/visual-standard-v2.css` in `/styles.css`.
4. Limited the new layer to structural viewport safety only:
   - horizontal overflow protection;
   - min-width / max-width safety;
   - media width safety;
   - title wrapping safety;
   - touch target minimums;
   - transformed Home Ink containment.
5. Typography scale remains owned by UI/component layers. `mobile-guardrails.css` intentionally does not set display font sizes.
6. New guardrail contains zero `!important`.

## Audit contract

`scripts/audit-mobile-guardrails.mjs` fails when:

- a legacy mobile runtime file exists;
- `ui-v2.css` imports a legacy mobile file;
- runtime HTML/CSS/JS references a legacy mobile file;
- `mobile-guardrails.css` disappears;
- the guardrail takes ownership of display typography scale;
- `!important` is introduced into the guardrail.

## Result

Migration commit:

`afcba631a92241ab1168c72b394eb17ac543afe2`

Full design audit passed before the migration workflow was frozen.

## Next

Continue compatibility-layer reduction by classifying the remaining global UI imports by responsibility. Do not assume `mouthwash-v1.css`, `dia-v1.css` or `ink-interventions.css` are Home-only: current source shows they also own About, Projects, Events, Catalog, Logic and generic entity behaviours.
