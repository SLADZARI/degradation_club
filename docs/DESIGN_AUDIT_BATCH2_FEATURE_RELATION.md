# DESIGN AUDIT — BATCH 2 / FEATURE + RELATION

Status: IMPLEMENTED IN AUDIT BRANCH
Date: 2026-08-27

## Source reference

RELATION is grounded in the approved `relation.png` mockup from Drive: compact horizontal card, portrait on the left, role/name/context in the middle, navigation arrow on the right.

FEATURE follows the approved UI Redesign contract already fixed in project notes: two visual surfaces, image on the left, content on the right, one acid vertical divider, no pseudo-image layer.

## Canonical FEATURE

Owner: `/visual-standard-v2.css`

Layer contract:
1. component paper/background
2. portrait surface with the Dementor-specific background token
3. one real `<img>` with `object-fit: contain`
4. copy surface
5. one acid divider only

Desktop: two columns, portrait left / copy right.
Tablet: same semantic split with tighter columns and padding.
Mobile: portrait first, copy second; acid divider becomes horizontal.

Implemented instances:
- Home / `ДУМАЙ С ОПАСНОСТЬЮ` / Valentin
- Fuengirola / detailed Gabil section

Removed from Home Valentin:
- portrait `::after` pseudo-layer
- structural `:has()` rules used to simulate a two-column feature

## Canonical RELATION

Owner: `/visual-standard-v2.css`

Desktop geometry follows the approved relation card:
- 118px portrait
- flexible copy column
- 40px arrow column
- 18px padding/gap
- single border / paper surface

Mobile:
- 86px portrait
- copy column
- context and arrow may collapse when space is insufficient

Implemented instance:
- Fuengirola Event HERO relation to Gabil now carries canonical `.dc-dementor-relation` semantics while retaining its event-positioned variant.

## Automated gate

`scripts/audit-feature-relation.mjs` verifies:
- Home Valentin uses real FEATURE markup and real portrait image
- no Home Valentin pseudo portrait remains
- Fuengirola detailed Gabil section uses FEATURE
- Event HERO relation carries canonical RELATION classes
- FEATURE and RELATION have one stylesheet owner
- acid divider and mobile stack contracts exist

Permanent `Design Audit` workflow now runs:
1. style graph
2. Dementor HERO audit
3. Event HERO audit
4. FEATURE / RELATION audit
