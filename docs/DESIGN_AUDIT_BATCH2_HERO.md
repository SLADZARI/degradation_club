# Dementor Club — Design Audit / Batch 2 HERO

Status: IMPLEMENTED IN AUDIT BRANCH / VISUAL QA BEFORE MERGE
Branch: `design-audit-batch-2026-08-27`
Date: 2026-08-27

## Approved references

Batch 2 is based on the approved Dementor profile HERO references for three breakpoints:

- WEB: split composition — large name and formula on the left, portrait/artwork as a distinct large rectangle on the right.
- TABLET: intentional controlled overlap — portrait becomes dominant and starts behind the left copy; name/formula remain readable above it.
- MOBILE: strict vertical stack — label/name, formula frame, then portrait as a separate full-width visual block.

The formula is not generic body copy. It is an explicit visual component:

- thin dashed frame;
- muted grey typography;
- generous internal padding;
- constrained width;
- positioned directly after the name;
- no card shadow, radius, gradient or decorative pseudo image.

## Implemented component ownership

`/dementor-profile.css` remains the only geometry owner for the full Dementor profile HERO.

The HERO contract now defines:

1. one page identity background via `--dementor-bg`;
2. one copy layer;
3. one formula block (`.dc-dementor-quote`);
4. one portrait layer (`.dc-dementor-hero__portrait`);
5. no `::after` artwork layer;
6. no roster/profile cross-loading;
7. tags/back-link suppressed inside the first-screen composition so they do not distort the approved HERO geometry.

## Breakpoint behavior

### WEB

- 12-column layout;
- copy: columns 1–6;
- portrait: columns 8–12;
- no intended overlap;
- large two-line name where the content requires it;
- formula frame below the name.

### TABLET

- 12-column layout retained;
- copy remains on the left;
- portrait expands to columns 4–12;
- controlled overlap is intentional and copy keeps the higher z-layer;
- formula remains visually separate from portrait.

### MOBILE

- one-column flow;
- role/name are first;
- formula is second;
- portrait is third;
- portrait is no longer absolutely positioned behind the text;
- the composition therefore matches the approved vertical reference instead of scaling the desktop overlap.

## Machine gate

Added `scripts/audit-dementor-hero.mjs`.

It verifies all four current Dementor profile routes:

- `/community/valentin/`
- `/community/nikita/`
- `/community/evgeniy/`
- `/community/gabil/`

For each profile the gate checks:

- the canonical profile stylesheet is loaded;
- HERO, copy, formula and portrait nodes exist;
- DOM order is copy → formula → portrait;
- the canonical profile number exists;
- WEB/TABLET/MOBILE CSS contracts are present;
- dashed formula frame is present.

## Deliberately not changed in this batch

- doctrine, method, course or event content;
- Dementor source-of-truth semantics;
- portrait assets;
- general site header/navigation;
- non-profile pages;
- production branch.

## Remaining visual QA before merge

1. render Valentin at ~1440×800 and compare name/formula/portrait proportions against WEB reference;
2. render at ~768×590 and confirm the intended tablet overlap;
3. render at ~390×760 and confirm formula precedes portrait without horizontal overflow;
4. repeat with Gabil because his long formula is the worst-case typography test;
5. confirm Nikita and Evgeniy single-line names do not leave an oversized dead area;
6. only then move the patch into `dementor-club-site`.
