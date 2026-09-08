# Dementor Club — Public Site Visual Harmonization Inventory

Status: **DRAFT / INVENTORY IN PROGRESS**  
Result: `dementor-club.result.public-site-visual-harmonization-v1`  
Production baseline: `b1ed177564581c820e3739e70404957108157af1`  
Prepared: **2026-09-08**

This inventory is evidence for the Result, not a new design/product authority.

## Baseline freshness
`baseline_sha_at_start = b1ed177564581c820e3739e70404957108157af1`

Any implementation mutation must re-check current `dementor-club-production` HEAD. If it differs, this inventory is stale and must be rebuilt before edits.

## Target routes
- `/`
- `/events/`
- `/events/fuengirola/`
- `/community/`
- `/community/gabil/`
- `/merch/`

## Evidence layers
For every route record:
1. raw source owner;
2. runtime mutation/injection owner;
3. built `_site` output;
4. canonical Public Shell ownership;
5. active CSS/JS relevant to the affected presentation;
6. responsive baseline observations at `1440 / 1024 / 768 / 390 / 360`; optional `320` stress-test.

## Confirmed pre-mutation source facts

### `/events/fuengirola/`
- static hero already owns an event→Gabil relation through `dc-event-hero__relation dc-dementor-relation`;
- the page also contains a later dominant `dc-dementor-feature` for Gabil;
- `dementor-relations-v1.js` has route-specific Fuengirola injection and checks the selected detail target rather than the whole page relation ownership;
- source contains public implementation copy `participant relation from entity record`.

Required inventory split before edit:
- runtime relation duplication;
- editorial dominant identity duplication.

### `/`
- `Думай с опасностью` source contains both `Дементор: Валентин Лосев.` in course copy and a separate full mentor card immediately after it;
- Home also contains public state text that needs classification as intentional club language vs implementation leak.

### `/community/`
- source contains two full hero content trees: `.hero-ref__desktop` and `.hero-ref__mobile`;
- both duplicate image, title, lead and body copy;
- required target is one semantic content tree rearranged by CSS.

### `/events/`
- one real `PLANNED` event exists;
- five empty lifecycle states are represented as full lanes;
- editorial explanation of empty state semantics is repeated;
- source exposes `source-of-truth` language publicly.

### `/community/gabil/`
- source exposes `source-of-truth` and internal fixation/process language in public profile sections;
- generic status vocabulary must not be removed merely because it looks administrative.

### `/merch/`
- source exposes implementation/data-model language including `source-of-truth`, `production spec`, `sales_state` and `CHECKOUT / DISABLED`/`PRICE / TBD` state presentation;
- only actual implementation markers are denylisted; brand-style operational labels are reviewed contextually.

## Public Shell
Canonical public Header is owned by `global-header.js` / `global-header.css` and must remain visually unchanged.

Build pipeline removes legacy page-owned `header.topbar` and injects canonical public shell on public routes, so raw page header markup is not evidence of final production Header behavior.

## Next inventory actions before source mutation
- inspect exact built `_site` for all six routes from the frozen production baseline;
- capture DOM counts for Gabil relation/dominant treatments, Valentin identity, Community hero sources and internal-language markers;
- capture responsive screenshots/geometry at baseline widths;
- map relevant active CSS/JS imports and runtime injections;
- then open the first implementation diff.
