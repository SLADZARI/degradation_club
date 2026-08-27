# Dementor Club — Design Audit / Batch 0 Findings

Status: INVENTORY ONLY / NO VISUAL REPAIR YET
Branch: `design-audit-batch-2026-08-27`
Date: 2026-08-27

## Confirmed import graph problem

`styles.css` already imports:
1. `/visual-tokens.css`
2. `/illustration-surfaces.css`
3. `/ui-v2.css`
4. `/presentation-standard-v1.css`
5. `/visual-standard-v2.css`
6. `/home-visual-standard-v2.css` (deprecated/no-op)

Several public pages then link `/ui-v2.css` again after page-specific styles. This means the same stylesheet is evaluated twice and the second load changes cascade order relative to page-specific CSS.

Confirmed examples:

| Route | HTML-linked styles after `/styles.css` | Confirmed issue |
|---|---|---|
| `/events/fuengirola/` | `entity-v1.css`, `ui-v2.css`, `event-system.css` | `ui-v2.css` duplicated; `event-system.css` comes last and overrides global visual layer |
| `/community/` | `projects-v1.css`, `dementors-v1.css`, `community-v2.css`, `ui-v2.css`, `dementor-profile.css` | `ui-v2.css` duplicated; profile CSS loaded on roster page |
| `/community/valentin/` and other Dementor profiles | `projects-v1.css`, `dementors-v1.css`, `ui-v2.css`, `dementor-profile.css` | `ui-v2.css` duplicated; hero geometry has multiple owners |
| `/about/` | `about-v1.css`, `ui-v2.css` | `ui-v2.css` duplicated after About-specific CSS |
| `/projects/logic-awareness/` | `projects-v1.css`, `ui-v2.css`, inline `<style>` | duplicated global UI plus an additional inline design island |

## P0 collision — Fuengirola `::after`

The exact same semantic layer is owned by two stylesheets:

### `visual-standard-v2.css`
`body.dc-fuengirola-page .dc-entity-hero::after`
- intended asset: `/assets/ink/event-fuengirola-03.webp`
- full/large event image layer
- right-top anchor
- height-first sizing
- z-index 0

### `event-system.css`
`body.dc-fuengirola-page .dc-entity-hero::after`
- intended asset: `/assets/people/dementors/gabil/dementor_gabil.webp`
- compact portrait card
- positioned around top 27%
- bordered 4:5 box

Because `/event-system.css` is linked after `/styles.css`, its `::after` wins for overlapping declarations. Therefore the page cannot simultaneously satisfy the approved Event mockup through this selector. One pseudo-element is being asked to represent two different visual entities.

**Required repair:** Event hero media must have one owner/layer. Gabil must be a separate DOM relation component, not the same `::after`.

## P0 collision — Dementor HERO has at least three geometry owners

Confirmed owners:

1. `presentation-standard-v1.css`
   - generic portrait behavior (`object-fit:contain`, paper background, blend)
2. `visual-standard-v2.css`
   - hero layout, portrait grid columns, min heights, tablet/mobile reflow
3. `dementor-profile.css`
   - another complete hero layout with overlapping columns, z-index, viewport heights and its own mobile composition

Additionally every profile links `/ui-v2.css` again after `/styles.css`, reintroducing generic rules after the global visual contract and before `dementor-profile.css`.

Current desktop profile stack is therefore approximately:
- background/page
- header
- hero meta z4
- hero copy z3
- portrait z2
- portrait image with `mix-blend-mode:multiply`
- later content sections reset to paper

The approved HERO mockup should instead be implemented as one explicit component with one geometry owner and documented layer count.

## P0 collision — generic Ink behavior conflicts with surface contract

`ui-v2.css` defines generic `.dc-ink-slot > img` and event images as `object-fit:cover` with `mix-blend-mode:multiply`.

`illustration-surfaces.css` later/earlier depending on load context defines many approved illustration surfaces as `object-fit:contain`.

Since `/ui-v2.css` is often linked again in page HTML, a page can silently revert a `contain` illustration to generic `cover` unless the surface selector uses greater specificity or `!important`.

This explains why a correct background token does not guarantee the approved composition.

## P0 collision — Home row hover has two implementations

`ui-v2.css` creates `.dc-index-row::before` / `.dc-sphere::before` as a translated acid overlay inside the row.

`home-v1.css` creates a different full-viewport bleed `::before` contract and neutralizes the old transform using `!important`.

This is a migration override, not a stable component architecture. The old owner should be removed for Home rather than permanently overridden.

## P1 — Home has dead imported layer

`home-visual-standard-v2.css` is explicitly marked `DEPRECATED / NO-OP`, yet remains globally imported from `styles.css` on every route.

**Repair:** remove the import in Batch 1 after confirming no runtime dependency.

## P1 — Community page loads profile CSS

`/community/` loads `dementor-profile.css` even though it is a roster/list page. The stylesheet also contains roster overrides, so profile and roster concerns are currently mixed in one file.

**Repair:** split identity/roster rules from full profile hero rules, or move roster rules to the canonical Community/Dementor component layer.

## P1 — Inline design island on Logic Awareness

`/projects/logic-awareness/` contains a substantial inline `<style>` block for dossier cards. This bypasses the global component ownership model and cannot be audited by import graph alone.

**Repair:** move the dossier component to a named project stylesheet/component contract during Batch 1/2, preserving its independent project identity.

## Surface/layer ownership target

### HERO / Dementor profile
- Layer 0: entity background token
- Layer 1: portrait surface/image
- Layer 2: text/copy
- Layer 3: meta/header only if required
- No decorative pseudo-element representing another entity
- One geometry owner stylesheet

### FEATURE
- Layer 0: background/surface
- Layer 1: portrait/image
- Layer 2: copy
- Optional acid rule as a real border or one pseudo-element
- No hidden second image

### EVENT HERO
- Layer 0: Fuengirola surface token
- Layer 1: event image only
- Layer 2: event text/facts/action
- Gabil relation is a separate component/layer outside the event-image pseudo-element

### Illustration slot
- One container background token
- One image
- Explicit `contain` or approved crop rule
- No fallback image occupying geometry
- No generic `cover` override from duplicated UI stylesheet

## Batch 0 machine audit

Added `scripts/audit-style-graph.mjs`.
It is designed to output `artifacts/design-style-graph.json` with:
- global import order
- route stylesheet lists
- duplicate global stylesheet links
- selector ownership for high-risk components
- counts of `::before/::after`, `!important`, `:has()`, `z-index`, `mix-blend-mode`, `isolation`
- CSS background-image asset references

This script must be run before Batch 1 and its JSON kept as the baseline for the cleanup diff.

## Next inventory slice

Before any visual correction:
1. complete route → stylesheet map for all sitemap routes;
2. inventory all inline `<style>` blocks;
3. inventory all duplicate `/ui-v2.css` links;
4. inventory all `::before/::after` image layers;
5. classify every `object-fit:cover` vs `contain` by approved asset type;
6. then produce one Batch 1 patch removing duplicated loads and dead imports without redesigning geometry yet.
