---
artifactId: dementor-club.evidence.public-site-visual-tech-debt-cleanup-refresh-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
---

# Public Site Visual Tech-Debt Cleanup — refreshed candidate

## Baseline and isolation

Branch creation baseline:

`638dd42d63d27bc43b524a1086b0904b6f9e671d`

Board corrective #154 has since merged. Current production integration baseline used by PR checks is:

`1dccbd8bbaf1d0220bc80f9a6a0f0e42cace099b`

This candidate remains isolated and does not modify:

- `community/board/**`;
- Board runtime modules;
- Supabase migrations/RLS;
- Board validators;
- `.github/workflows/site-integrity.yml`.

## Scope completed in this candidate

### 1. Ink runtime ownership cleanup

G6 root-cause work separates runtime ownership from compatibility CSS.

The active Ink runtime routes are:

- `/` — Home Hero Ink integration;
- `/about/`;
- `/projects/logic-awareness/`.

The following runtime owners are retired:

- Home Fuengirola runtime image owner;
- Community Ink runtime owner;
- Fuengirola detail Ink runtime owner.

No Home/Fuengirola runtime figure is restored.

The shared Ink CSS files still contain compatibility declarations that participate in accepted Home/Fuengirola geometry. Those declarations are intentionally preserved byte-for-byte in this cleanup and are not treated as active raster ownership.

### 2. Home Fuengirola ownership finding

The route-specific canonical active raster owner remains:

`home-event-fuengirola-20260828.css`

It owns the visible desktop/tablet section background and mobile in-flow strip using:

`/assets/ink/event-fuengirola-03.webp`

The accepted Home/Fuengirola composition also depends on compatibility layout declarations in the shared visual/Ink CSS stack. Their older pseudo-raster behavior is neutralized by the later route-specific owner via:

`content:none!important; display:none!important; background-image:none!important`.

G6 established the boundary experimentally:

1. Removing the shared Home/Fuengirola compatibility layout causes the 1024 visual reference to drift.
2. Restoring Home Hero Ink alone does not repair that event-section drift.
3. Approximate migration of the missing geometry into the canonical route file does not reproduce the accepted reference.
4. Restoring the exact production compatibility CSS while keeping the Home Fuengirola runtime image owner retired restores the accepted browser matrix.

Therefore this cleanup narrows runtime ownership but defers physical deletion/migration of the compatibility CSS to a dedicated visual refactor with explicit geometry contracts. The visual baseline and tolerance are not weakened.

Runtime acceptance remains strict:

- exactly one active Fuengirola raster owner;
- no Home Fuengirola runtime `<img>` owner;
- canonical route file suppresses the older pseudo-raster layer;
- one semantic Gabil relation;
- accepted Home geometry at 1440 / 1024 / 390.

### 3. Merch entity-set/runtime consistency

The public T-shirt catalog is fixed to the visible entity set:

- `SH-DEM-01`;
- `SH-DEM-02`;
- `SH-DEM-03`;
- `SH-DEM-04`.

Runtime hydration resolves a card by visible SKU instead of array position.

Missing runtime data no longer hides a catalog card or product detail page. Public fallback language is:

- `PRICE UNAVAILABLE`;
- `STATUS UNAVAILABLE`.

`SH-DEM-04` is included in the detail-route runtime map.

All four product pages are cleaned of visitor-facing technical placeholders such as `TBD`, `WORKING ASSET`, `production specification`, `sales-state` and visual-mockup implementation language.

### 4. Regression guard

`scripts/validate-visual-contract.mjs` now requires:

- Home + About + Logic Ink runtime owners to remain present;
- Community / Home-Fuengirola-runtime / Fuengirola-detail runtime owners to stay retired;
- accepted Home/Fuengirola compatibility geometry to remain until a dedicated migration exists;
- the route-specific Home Fuengirola owner to suppress the older pseudo-raster at runtime;
- all four public T-shirt SKUs to remain present;
- positional merch runtime mapping not to return;
- cards/details not to disappear when a runtime record is absent;
- `PRICE / TBD` and product-detail implementation language not to return.

The browser matrix remains the authority for effective geometry and the one-active-raster contract.

## G6 evidence

### #995 — initial broad cleanup

SHA `1ccf40d1cf89c6fff6384f4449ffc3fc898c4bed`

- static stages: PASS;
- public harmonization browser matrix: BLOCKED;
- Home @1024 visual drift: `55 > 36`.

This candidate removed both Home Ink ownership and shared Home/Fuengirola compatibility layout.

### #1000 — Home Ink experiment

Home @1024 remained `55 > 36`.

Restoring Home Ink alone did not repair the Fuengirola section reference.

### #1002 / #1012 / #1013 — geometry migration experiments

- #1002: `57 > 36`;
- #1012 spacing experiment: `66 > 36`;
- #1013 exact `repeat(12,1fr)` experiment: `57 > 36`.

Approximate migration into the canonical route file did not reproduce accepted production geometry.

### #1016 — production Fuengirola route/visual geometry restored, shared Ink compatibility still narrowed

- static visual contract: PASS;
- one active mobile Fuengirola media owner diagnostic: PASS;
- Home @1024 remained `57 > 36`.

This proved the canonical route file and shared `visual-standard` geometry alone were insufficient.

### #1019 — Home Hero Ink restored, event-section drift unchanged

Home @1024 remained exactly `57 > 36`.

The visual reference is captured from `section.dc-event` itself, so this run definitively disproved Home Hero as the cause of the remaining event-section hash difference.

### #1023 — exact production compatibility CSS restored; runtime ownership stays narrowed

SHA `1c34a1f2a4174c424b0af491ca52b45c176517fd`

Full `Site Integrity / Release Readiness` G6: **PASS**.

Passed stages include:

- visual contract;
- production build and JavaScript syntax;
- Google OAuth handoff;
- Home Fuengirola media-owner diagnostic;
- public harmonization browser matrix;
- DC-9 browser recovery;
- Board v2.1 fullscreen matrix;
- Board live corrective acceptance;
- Workspace/My Artifacts recovery;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

This is the release-candidate proof for the current ownership boundary.

## Final diff boundary against current production

Compared with production `1dccbd8bbaf1d0220bc80f9a6a0f0e42cace099b`, the candidate changes only:

- `ink-layout-v2.js`;
- `merch-runtime-v1.js`;
- four Merch product detail pages;
- this evidence file;
- `scripts/validate-visual-contract.mjs`.

`ink-layout-v2.css`, `ink-layout-v2-tuning.css`, `visual-standard-v2.css` and `home-event-fuengirola-20260828.css` remain at accepted production content and are not part of the final candidate diff.

No Board, Supabase or workflow files are changed.

## Acceptance status

1. Full Site Integrity / Release Readiness G6 on exact candidate SHA: **PASS (#1023)**.
2. Home Fuengirola references at 1440 / 1024 / 390 without tolerance/baseline relaxation: **PASS**.
3. Canonical Header / no-overflow browser matrix: **PASS**.
4. Merch four-entity runtime fallback contract: **PASS**.
5. Final compare against current production: **PASS — no Board/Supabase/workflow overlap**.

`Commit ≠ merge ≠ deploy`.
