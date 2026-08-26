# Dementor Club — CSS Layer Governance v1

Status: active implementation rule  
Date: 2026-08-26

## Purpose

Prevent early-iteration CSS from silently overriding the approved design system.

## Load order

1. `styles.css` — foundation entry point and shared imports.
2. `ui-v2.css` — shared behavior/accessibility/editorial utilities. It must not own final page-family composition.
3. `presentation-standard-v1.css` — shared component and entity presentation contract.
4. `visual-standard-v2.css` — entity-specific visual identity: Dementor portrait surfaces, Event media, Feature/Relation forms.
5. Page-family stylesheet (`home-v1.css`, etc.) — page composition only, loaded once after `styles.css`.

## Rules

- A shared stylesheet must not be linked a second time after a page-family stylesheet.
- One visual behavior has one owner. Do not keep multiple hover/highlight mechanisms active for the same component.
- Page-family CSS may position shared components but must not redefine their content contract.
- Temporary correction layers are retired after consolidation; no new rules may be added to a deprecated layer.
- `!important` is allowed only when neutralizing a known legacy rule or enforcing an approved accessibility/identity contract. New component work should not depend on escalating specificity.
- Mobile is a reflow of the approved composition, not a scaled desktop.

## Home decisions after cleanup

- `home-v1.css` is the single active Home composition stylesheet despite the legacy filename.
- `home-visual-standard-v2.css` is deprecated/no-op and exists only until its import can be removed from the global entry point.
- Home HERO is a single composition: copy left + real DOM media on the right. The approved `home-interruption-03.webp` is not rendered as a detached downstream Ink block.
- Home ecosystem and sphere rows use one full-bleed accent surface: the ACID background spans the viewport while content remains fixed on the content grid. Content does not shift on hover/focus.
- The old `ui-v2` translateX accent layer is explicitly neutralized on Home and must not be reintroduced there.

## QA

Check at 1440 / 1024 / 768 / 390 / 320:

- HERO reads as one composition.
- Hero media is complete (`contain`) and visually dominant, not a small detached image.
- Full-bleed row accent reaches both viewport edges on desktop.
- Row text does not move when accent appears.
- No horizontal overflow is introduced by full-bleed surfaces.
- Mobile keeps the same HERO media below copy.
