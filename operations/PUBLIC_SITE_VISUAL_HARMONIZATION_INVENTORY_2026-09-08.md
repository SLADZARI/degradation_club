# Dementor Club — Public Site Visual Harmonization Inventory

Status: **DRAFT / BUILT ARTIFACT INVENTORY CAPTURED / RESPONSIVE VISUAL BASELINE PENDING**  
Result: `dementor-club.result.public-site-visual-harmonization-v1`  
Production baseline: `b1ed177564581c820e3739e70404957108157af1`  
Prepared: **2026-09-08**

This inventory is evidence for the Result, not a new design/product authority.

## Baseline freshness
`baseline_sha_at_start = b1ed177564581c820e3739e70404957108157af1`

Immediately before Result creation, `dementor-club-production` was re-read and still resolved to exactly this SHA.

Any implementation mutation must re-check current `dementor-club-production` HEAD. If it differs, this inventory is stale and must be rebuilt before edits.

Implementation branch was created from the exact baseline:
`agent/public-site-visual-harmonization-v1`.

## Exact built artifact inspected
The current production Pages artifact from cleanup deploy #49 was downloaded and inspected before any user-facing mutation:
- deploy run: `#49` / `34272073283`;
- Pages artifact id: `10074208550`;
- production content commit: `b1ed177564581c820e3739e70404957108157af1`.

The artifact contains the built production output used below. Raw source HTML is not treated as sufficient production evidence.

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

## Built `_site` baseline evidence

### `/`
Built source:
- one page `<h1>`;
- one `Дементор: Валентин Лосев.` textual attribution;
- one `.dc-course-prototype__mentor` identity card;
- canonical injected scripts include `/site-config.js`, `/motion-v1.js`, `/global-header.js`, `/global-footer.js`, `/entity-recommendations-v1.js`, `/production-analytics-v1.js`;
- active page styles include `/styles.css`, `/home-v1.css?v=202608290920`, canonical global header/footer CSS and entity-recommendations CSS.

Conclusion: Home / Valentin duplication survives into the exact built production artifact.

### `/events/`
Built source:
- one page `<h1>`;
- public built copy still contains `source-of-truth`;
- event page loads `/styles.css`, `/entity-v1.css`, `/event-system.css` plus canonical shell/recommendation layers;
- canonical runtime scripts include `site-config`, `motion-v1`, global shell and analytics.

Conclusion: internal implementation-language leak survives build normalization. Empty-lifecycle density remains a page-family/layout concern owned by Events source/CSS, not the global shell.

### `/events/fuengirola/`
Built source before runtime relation injection:
- one `.dc-event-hero__relation`;
- one `.dc-dementor-relation` (the same hero relation);
- one later `.dc-dementor-feature` dominant Gabil block;
- built copy still contains `participant relation from entity record`;
- page styles: `/styles.css`, `/entity-v1.css`, `/event-system.css` plus canonical shell/recommendation CSS.

Runtime ownership:
- built HTML loads `/site-config.js`;
- current `site-config.js` dynamically loads `/dementor-relations-v1.js`;
- `dementor-relations-v1.js` contains a route-specific `/events/fuengirola/` injection path.

Conclusion: the two acceptance problems are independent and both are real:
1. static editorial identity density: relation + later dominant feature;
2. runtime duplicate-relation risk from the relation injector.

Do not collapse these into a single selector-count test.

### `/community/`
Built source:
- **2 page `<h1>` nodes**;
- one `.hero-ref__desktop` content root;
- one `.hero-ref__mobile` content root;
- both survive in built production DOM source;
- page styles include `/styles.css` + `/community-v2.css` plus canonical shell/recommendation layers.

Conclusion: duplicate semantic hero source is confirmed in the built artifact, not merely raw source.

### `/community/gabil/`
Built source:
- one page `<h1>`;
- public copy still contains `source-of-truth`;
- page styles include `/styles.css`, `/projects-v1.css`, `/dementors-v1.css`, `/dementor-profile.css` plus canonical shell/recommendation layers.

Conclusion: implementation/process language cleanup is required, while generic formal labels remain subject to context rather than a broad denylist.

### `/merch/`
Built source:
- one page `<h1>`;
- public built copy still contains `source-of-truth`, `production spec`, and `sales_state`;
- page includes `/service-adapters.js` in addition to canonical shell/runtime scripts;
- styles include `/styles.css`, `/entity-v1.css`, `/projects-v1.css`, `/merch-drop-v2.css` plus canonical shell/recommendation CSS.

Conclusion: data-model/implementation language is present in exact built production output.

## Public Shell ownership
Canonical public Header is owned by `global-header.js` / `global-header.css` and must remain visually unchanged.

The build pipeline removes legacy page-owned `header.topbar` markup and injects canonical public shell on public routes. The inspected built pages contain the canonical shell assets independently of their legacy raw header markup.

Header is therefore a locked dependency/regression target, not a page-local harmonization surface.

## Language-regression rule
Denylist exact confirmed implementation markers, including at minimum:
- `source-of-truth`
- `canonical source-of-truth`
- `participant relation from entity record`
- `sales_state`
- `production spec`

Do not globally deny generic editorial/status vocabulary such as:
`STATUS`, `PENDING`, `WAITING`, `NOT OPEN`.

Those terms must be evaluated in context because they may belong to the intentional pseudo-bureaucratic club language.

## Confirmed pre-mutation source/runtime facts

### `/events/fuengirola/`
- static hero already owns event→Gabil relation through `dc-event-hero__relation dc-dementor-relation`;
- page also contains later dominant `dc-dementor-feature` for Gabil;
- `dementor-relations-v1.js` has route-specific Fuengirola injection and checks its chosen target rather than page-level relation ownership;
- source/built artifact contains `participant relation from entity record`.

### `/`
- `Думай с опасностью` contains both textual `Дементор: Валентин Лосев.` and separate full mentor card.

### `/community/`
- two full hero trees survive into built artifact and produce two `<h1>` nodes.

### `/events/`
- one real `PLANNED` event exists;
- five empty lifecycle states are represented as full lanes;
- editorial empty-state thesis is repeated;
- built public copy exposes `source-of-truth`.

### `/community/gabil/`
- built public profile exposes `source-of-truth` and internal fixation/process language.

### `/merch/`
- built public page exposes implementation/data-model terms including `source-of-truth`, `production spec`, `sales_state`.

## Remaining inventory before first source mutation
- capture responsive visual/geometry baseline for all six routes at `1440 / 1024 / 768 / 390 / 360`; optional `320` stress-test;
- record horizontal-overflow baseline;
- verify critical mobile interactions do not require hover;
- complete the static/runtime ownership map for the exact selectors/files to change;
- re-check production HEAD immediately before the first implementation commit.

Only after those checks does the Result move from inventory into visible source mutation.
