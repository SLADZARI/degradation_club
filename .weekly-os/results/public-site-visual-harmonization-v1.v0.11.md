---
artifactId: dementor-club.result.public-site-visual-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G7_RELEASE
status: DRAFT
version: 0.11
updated: 2026-09-09
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.10
---

# MP | Dementor Club | VALIDATION | Public Site Visual Harmonization v1 | v0.11

## Goal
Close the public-site visual harmonization pass with both Home and `/events/` Fuengirola presentation ownership corrected and regression-protected, without broadening Result 1 into commerce, Board, Workspace, Membership, DC-9, auth or general legacy-runtime cleanup.

Specification: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md`  
Inventory: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_INVENTORY_2026-09-08.md`  
Live smoke evidence: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-09.md`

## Status
**DRAFT / PRESENTATION-OWNER CORRECTION G6 PASS / G7 RELEASE / PRODUCTION MERGE + DEPLOY NOT YET AUTHORIZED**

## Why v0.10 was superseded
Result v0.10 and G6 #925 correctly protected the accepted Home breakpoint contract, but a user live screenshot exposed an additional visible Result-1 defect on `/events/`: multiple runtime presentation systems were simultaneously representing the same Fuengirola/Gabil entity.

This is not a new product feature or semantic mutation. It is a corrective visual-ownership pass inside the existing Result and existing integration branch.

## Current release candidate
- production base: `6abb7f28d63fe2e0e7025d49255b59ee55b715db`;
- PR: `#141`;
- integration branch: `agent/public-site-visual-harmonization-v1`;
- validated candidate: `8bd51344dc7e881ef6226167e34de3c7a55b2895`;
- Site Integrity / Release Readiness: `#929` / `34411071069` / **SUCCESS**;
- visual-reference artifact: `10127272676`;
- visual-reference digest: `sha256:cc7e2f4a90ce1aa06fe61aee90f618b3b6b61120d26b22cb3dbf877342b06944`.

## Corrected presentation ownership
### Home
The v0.10 accepted contract remains unchanged:
- desktop/tablet `>700px`: exactly one canonical `assets/ink/event-fuengirola-03.webp` owner as the full-bleed section background with `cover`;
- mobile `<=700px`: section background is absent and the same canonical asset appears exactly once as the in-flow `.dc-shell::before` strip;
- no legacy runtime Fuengirola `<img>` injection;
- no legacy duplicate pseudo-image owner;
- exactly one semantic Gabil relation;
- CTA and event semantics unchanged.

### `/events/`
The visible programme-listing conflict is corrected at the owning runtime sources, not hidden with CSS:
- the Fuengirola row now references canonical `/assets/ink/event-fuengirola-03.webp` for preview and social metadata;
- `motion-v1.js` keeps the L1 trace semantics but no longer gives `/events/` a persistent `media:true` raster owner;
- `dementor-relations-v1.js` no longer injects a standalone Gabil card after the Fuengirola programme row;
- catalog hover/tap preview remains the sole event preview mechanism;
- the listing keeps `GABIL` as event metadata only;
- Gabil portrait/relation ownership remains on `/events/fuengirola/` detail.

No new CSS override/hiding layer was added for these conflicts.

## Regression guard
The existing `scripts/validate-public-harmonization-browser.mjs` was extended instead of creating a parallel QA mechanism.

After runtime JS it now asserts:
- Home: exactly one active Fuengirola raster owner and one Gabil relation;
- `/events/`: exactly one Fuengirola row, canonical preview source, zero persistent `dc-ink-trace-media`, zero runtime Gabil card/portrait, and zero persistent visible Fuengirola raster owners outside the preview mechanism;
- `/events/fuengirola/`: exactly one canonical hero raster and exactly one Gabil portrait relation;
- mobile `/events/`: first tap exposes the canonical preview asset and second tap opens the event detail.

## G6 evidence
Site Integrity / Release Readiness #929 (`34411071069`) completed **SUCCESS** against exact head `8bd51344dc7e881ef6226167e34de3c7a55b2895` and exact production base `6abb7f28d63fe2e0e7025d49255b59ee55b715db`.

Passed evidence includes:
- registry/routes/features;
- content readiness and visual contract;
- production candidate build;
- built JavaScript syntax;
- canonical shell integration;
- Home Fuengirola mobile-media diagnostic;
- full public harmonization browser matrix;
- new Events presentation-owner guards;
- DC-9 immutable baseline and sync integrity;
- Membership semantic authority;
- Board security/interaction and browser matrix;
- Workspace/browser recovery;
- My Artifacts;
- Google OAuth and WebKit auth regressions;
- production route manifest;
- production artifact release gate.

Visual-reference artifact from the successful run: `10127272676`  
Digest: `sha256:cc7e2f4a90ce1aa06fe61aee90f618b3b6b61120d26b22cb3dbf877342b06944`.

## Result 1 scope preserved
Target routes remain:
- `/`;
- `/events/`;
- `/events/fuengirola/`;
- `/community/`;
- `/community/gabil/`;
- `/merch/`.

The broader architectural cleanup — reducing legacy presentation generations and formalizing entity → one presentation owner across the whole public site — remains follow-up cleanup/Result work. It is not silently expanded into this corrective pass.

No commercial activation, Membership lifecycle, role/permission, auth ownership, DC-9, Board or live Supabase semantics changed.

Board Result `dementor-club.result.board-access-control-v2` remains `WAITING`.

## G7 release gate
Before production merge:
1. PR `#141` must still be open/mergeable and point to exact head `8bd51344dc7e881ef6226167e34de3c7a55b2895`;
2. `dementor-club-production` must still be exact base `6abb7f28d63fe2e0e7025d49255b59ee55b715db`;
3. G6 `#929` / `34411071069` must remain SUCCESS for the exact candidate;
4. user must explicitly authorize merge/deploy.

After authorized release:
1. merge only PR `#141` into current production baseline;
2. run canonical `Deploy Dementor Production` with `release_confirmation=APPROVED`;
3. prove checkout/build from the resulting production commit;
4. perform final live smoke on Home `1440/1024/mobile` plus `/events/`, `/events/fuengirola/`, `/community/`, `/community/gabil/`, `/merch/`;
5. only after live PASS may Result 1 close and proceed to G8 cleanup.

## Current authorization
- production merge authorized: **false**;
- production deploy authorized: **false**;
- live database mutation authorized: **false**.
