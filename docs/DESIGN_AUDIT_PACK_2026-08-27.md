# Dementor Club — Full-site Design Audit Pack

Status: ACTIVE AUDIT / NO PRODUCTION CHANGES
Branch: `design-audit-batch-2026-08-27`
Date: 2026-08-27

## Goal

Do not fix pages one-by-one. First inventory the entire public visual system, compare it with the approved mockups and presentation rules, map all layers/overrides/assets/backgrounds/breakpoints, then repair in controlled batches.

## Sources of truth

### Drive — approved UI mockups
Folder: `03_Dementor Club Official Site/UI Redesign 2026-08`
- `HERO/web.png`
- `HERO/tablet.png`
- `HERO/mob.png`
- `FEATURE/web.png`
- `Event/web.png`
- `vent/tablet.png`
- `vent/mob.png`
- `vent/Dementor_image.png`
- `vent/Event_image.png`

### Git runtime
Base: `dementor-club-site`
Audit branch: `design-audit-batch-2026-08-27`

Primary style layers currently loaded globally from `styles.css`, in this order:
1. `visual-tokens.css`
2. `illustration-surfaces.css`
3. `ui-v2.css`
4. `presentation-standard-v1.css`
5. `visual-standard-v2.css`
6. `home-visual-standard-v2.css` — deprecated/no-op and should not remain in final import graph

Page-specific stylesheets are additionally linked in HTML and must be audited for duplicate loading and override order.

## Public route inventory

Audit every route in sitemap, not only the pages that visibly broke:

1. `/`
2. `/about/`
3. `/events/`
4. `/events/fuengirola/`
5. `/projects/`
6. `/projects/logic-awareness/`
7. `/community/`
8. `/community/valentin/`
9. `/community/nikita/`
10. `/community/evgeniy/`
11. `/community/gabil/`
12. `/merch/`
13. `/merch/drop-001/overthinking-is-my-cardio/`
14. `/merch/drop-001/personal-growth-cancelled/`
15. `/merch/drop-001/success-is-boring/`
16. `/catalog/`
17. `/archive/`
18. `/join/`
19. `/courses/dumai-s-opasnostyu/`
20. `/donate/`
21. `/contacts/`
22. `/legal/privacy/`
23. `/legal/terms/`

## Audit dimensions

Every page/component is checked across all dimensions before any batch repair begins:

### A. Layer stack
- DOM layer count
- pseudo-elements `::before` / `::after`
- absolute layers
- `position: sticky/fixed/absolute/relative`
- `z-index`
- stacking contexts from `isolation`, `transform`, `opacity`, `mix-blend-mode`, filters
- overlays that cover text/buttons/images
- hidden fallback layers that still load or occupy geometry

### B. Surface/background contract
- exact approved background color
- whether color belongs to page, section, media surface or Dementor identity
- image matte and container use the same color where required
- no accidental transparent/white/paper strips
- no duplicated color definitions outside tokens

### C. Media geometry
- `object-fit`
- `object-position`
- background-image sizing/position
- crop vs contain rules
- image anchor
- width/height/aspect-ratio
- desktop/tablet/mobile continuity
- one approved asset reused across breakpoints unless a distinct mockup explicitly requires otherwise

### D. Grid/spacing/type
- container max width
- outer gutters
- 12/8/4-column grids
- gaps
- title width and line breaks
- text/image ratio
- vertical rhythm
- button alignment
- relation-card placement

### E. Cascade integrity
- import order
- duplicate stylesheet loading
- selector collisions
- excessive `!important`
- competing breakpoint rules
- `:has()` rules that silently alter unrelated instances
- deprecated stylesheets still imported
- old fallback selectors still active

### F. Asset integrity
- canonical path only
- no old `portrait-ink.webp` on public pages
- no old Fuengirola asset path
- no hidden duplicate image
- approved background token bound to each image/entity

## Approved Dementor identity backgrounds

- Valentin: `#EFE5D3`
- Nikita: `#F6E9D4`
- Evgeniy: `#F6EDD9`
- Gabil: `#EFE6D3`

These are entity identity surfaces, not arbitrary page colors.

## Approved illustration surfaces

- Home chair: `#F3EDDE`
- Logic maze: `#F0E7D7`
- Authority chair: `#F0E7D7`
- About service: `#F9EDD5`
- Community People: `#F1E9D8`
- Community hero: `#F7EBD5`
- Fuengirola: `#FAF4E2`

## First structural findings — before visual batch repair

### P0 — competing visual systems are still active
`styles.css` loads multiple generations of UI/presentation styles globally. Page HTML then often loads some of those families again. This creates a cascade where the final appearance depends on order and selector specificity rather than one explicit component contract.

### P0 — Home/Event/Dementor composition is implemented in more than one stylesheet
`home-v1.css`, `visual-standard-v2.css`, `event-system.css`, `dementors-v1.css` and `dementor-profile.css` all contain geometry for hero/media/entity presentation. The same semantic component can therefore receive grid, sizing, positioning and media rules from multiple layers.

### P0 — Fuengirola currently has a high risk of duplicate visual layers
The Event mockup defines one event hero image plus one Gabil relation card. Runtime CSS currently contains event-hero image layering in `visual-standard-v2.css` and additional Gabil pseudo-element treatment in `event-system.css`, while the page also contains an actual Gabil relation section. This must be reduced to one intentional event media layer + one intentional relation presentation.

### P0 — deprecated import remains global
`home-visual-standard-v2.css` explicitly declares itself deprecated/no-op but is still imported globally. Remove only after full import-graph audit.

### P1 — excessive cascade force
Current visual layer relies on many `!important` declarations and structural `:has()` selectors. These are acceptable as migration tools, but not as the final stable design system because they can override page-specific intent and make breakpoint defects difficult to predict.

### P1 — HERO mockup contract is stricter than current generic hero rules
Approved HERO web mockup: text block and image are two clearly separated surfaces; mobile mockup stacks identity/title + formula surface + full image. Runtime profile CSS currently uses overlapping grid columns and a full-height portrait treatment. It may be visually close in some widths but is not yet a direct implementation of the mockup geometry.

### P1 — FEATURE mockup contract is not simply a generic profile hero
Approved FEATURE web mockup is a clean two-column component: portrait surface left, identity/quote right, with a single acid vertical rule. Runtime uses several different feature/relationship implementations. These must be consolidated into one FEATURE component.

### P1 — Event mockup relation card geometry differs from current event relation treatment
Approved Event web mockup places a horizontal Gabil relation card inside/over the lower event hero composition. Current code has both pseudo-element and downstream relation concepts. Exact layer ownership must be fixed before tweaking spacing.

## Batch repair sequence

No production merge after an isolated page fix. Work only in this order:

### Batch 0 — inventory and computed layer map
- complete stylesheet import graph
- complete route → stylesheet map
- complete component → selector map
- list every `z-index`, pseudo-layer, stacking context, `!important`, `:has()` and background image involved in public UI

### Batch 1 — cascade cleanup
- one global token layer
- one primitive/component layer
- one page/component contract layer
- remove deprecated imports and duplicate loading
- preserve current content; no visual redesign yet

### Batch 2 — core mockup components
Implement and lock:
- HERO / web-tablet-mobile
- FEATURE / web and responsive fallback
- EVENT HERO / web-tablet-mobile
- RELATION card
- MICRO roster card

### Batch 3 — page application
Apply locked components across Home, Community, four Dementors, Fuengirola, course/event features.

### Batch 4 — illustration surfaces
Apply correct matte/background to every approved illustration slot across all routes. Remove image/container color mismatches and accidental white strips.

### Batch 5 — full-site responsive sweep
For all 23 routes at minimum widths:
- 390
- 430
- 560
- 700/768
- 900
- 1024
- 1280
- 1440+

### Batch 6 — regression gates
- Site Integrity
- visual-contract validator expanded to cascade/surface/layer invariants
- no broken internal routes/assets
- no deprecated public asset paths
- no duplicate canonical image layer on one component

## Definition of done

A page is not marked done because it "looks better". It is done only when:
- its component matches the approved mockup contract;
- the component has one owner stylesheet;
- layer count is intentional and documented;
- correct token owns the background;
- image crop/contain rule is explicit;
- desktop/tablet/mobile rules are coherent;
- no competing selector overrides it from another generation of CSS;
- no hidden fallback duplicates remain;
- regression checks are green.

## Current rule

Do not publish from this branch until the whole audit matrix is completed and repairs are applied as batches.