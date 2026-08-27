# Dementor Club — Design Audit / Batch 1 Results

Status: CASCADE CLEANUP IN PROGRESS / NO PRODUCTION CHANGES
Branch: `design-audit-batch-2026-08-27`
Date: 2026-08-27

## Batch 1A — duplicate global loading removed

The deterministic cleanup removed explicit `/ui-v2.css` links from HTML files that already load `/styles.css`, because `/styles.css` imports `/ui-v2.css` globally.

Result from machine audit:
- HTML routes/components scanned: **34**
- duplicate global stylesheet routes before cleanup: **30**
- duplicate global stylesheet routes after cleanup: **0**
- deprecated global import `/home-visual-standard-v2.css`: **removed**

This changes cascade order without redesigning page geometry. A page-specific stylesheet can no longer be silently followed by a second copy of the global UI layer.

## Active vs inactive CSS graph

The audit now resolves recursive `@import` dependencies and distinguishes active runtime CSS from dead files.

Current counts:
- active CSS files: **32**
- inactive CSS files: **8**
- routes/components with inline `<style>` blocks: **10**

Confirmed inactive files:
- `/courses/dumai-s-opasnostyu/course.css`
- `/design-system/design-system.css`
- `/global-header.css`
- `/home-visual-standard-v2.css`
- `/ink-layout-v2-tuning.css`
- `/ink-layout-v2.css`
- `/ui-redesign-drive-v1.css`
- `/utility-v1.css`

Important consequence: the very large `!important` counts in old `ink-layout-v2*` files are not current runtime risk. They remain cleanup debt, but do not currently determine public rendering.

## Inline style islands still active

The following routes/components still contain inline `<style>` blocks and therefore bypass normal stylesheet ownership:
- `/404.html`
- `/contacts/index.html`
- `/design-system/preorder/index.html`
- `/design-system/support/index.html`
- `/donate/index.html`
- `/join/index.html`
- `/projects/logic-awareness/dossiers/awareness/index.html`
- `/projects/logic-awareness/dossiers/index.html`
- `/projects/logic-awareness/dossiers/logic/index.html`
- `/projects/logic-awareness/index.html`

These are not being mass-moved blindly. They will be classified by project/page ownership before extraction.

## Batch 1B — critical component ownership consolidated

The second deterministic cleanup removed legacy geometry ownership without changing content.

### Dementor profile HERO

Before:
- portrait selector owners: `dementor-profile.css`, `dementors-v1.css`, `presentation-standard-v1.css`, `visual-standard-v2.css`
- layout selector owners: `dementor-profile.css`, `dementors-v1.css`, `visual-standard-v2.css`

After ownership gate:
- portrait owner: **`/dementor-profile.css` only**
- layout owner: **`/dementor-profile.css` only**

Legacy profile HERO geometry was removed from:
- `/dementors-v1.css`
- `/presentation-standard-v1.css`
- `/visual-standard-v2.css`

This does not yet claim that the HERO perfectly matches the Drive mockup. It establishes one geometry owner so the next component pass can change the geometry predictably.

### Fuengirola EVENT HERO

Before:
- `visual-standard-v2.css` used `.dc-entity-hero::after` for the event image
- `event-system.css` used the same pseudo-element for the Gabil portrait

After ownership gate:
- Fuengirola hero pseudo layer owner: **`/visual-standard-v2.css` only**
- the Gabil pseudo portrait is removed from `event-system.css`
- Gabil remains an actual relation entity in the page rather than competing for the event image pseudo-layer

This aligns layer semantics with the approved Event mockup: one event image layer plus a separate person/relation presentation.

## Risk reduction measured by audit

Before owner consolidation:
- `/visual-standard-v2.css`: 81 `!important`
- active Dementor hero portrait owners: 4
- active Dementor hero layout owners: 3
- active Fuengirola hero pseudo owners: 2

After owner consolidation audit:
- `/visual-standard-v2.css`: **57 `!important`**
- active Dementor hero portrait owners: **1**
- active Dementor hero layout owners: **1**
- active Fuengirola hero pseudo owners: **1**

The owner-consolidation workflow gate is green.

## Remaining P0/P1 work before geometry tuning

### 1. Generic Ink slot has too many active owners

The machine graph still finds generic Ink behavior in 12 active stylesheets:
- `about-v1.css`
- `community-v2.css`
- `dementors-v1.css`
- `dia-v1.css`
- `event-system.css`
- `home-v1.css`
- `illustration-surfaces.css`
- `ink-interventions.css`
- `mobile-overflow-fix.css`
- `mouthwash-v1.css`
- `ui-v2.css`
- `visual-standard-v2.css`

This is the next broad ownership problem. It must be split into:
- one base media primitive;
- one surface/background owner;
- explicit page/component crop rules;
- optional intentional intervention layer only where approved.

### 2. Community roster still loads profile CSS

`/community/` still links `/dementor-profile.css` because roster identity overrides were mixed into the profile stylesheet. Roster identity must move to the Dementor roster/component layer, then the Community route can stop loading full profile CSS.

### 3. `visual-standard-v2.css` remains the highest active migration-risk layer

Current machine count after owner cleanup is still high because this file is a migration bridge:
- `:has()` selectors: 44
- pseudo-elements: 13
- `!important`: 57

The next component batches should progressively move approved behavior into explicit owner files and shrink this bridge rather than adding more specificity.

## Batch 1 gate status

- duplicate global stylesheet gate: **PASS**
- deprecated import gate: **PASS**
- Dementor HERO owner gate: **PASS**
- Fuengirola EVENT HERO pseudo owner gate: **PASS**
- production deploy: **NOT PERFORMED**

## Next

1. separate Community roster identity from profile-only CSS;
2. classify generic Ink slot rules into primitive / surface / crop / intervention owners;
3. only then start Batch 2 geometry implementation against Drive HERO / FEATURE / EVENT mockups.
