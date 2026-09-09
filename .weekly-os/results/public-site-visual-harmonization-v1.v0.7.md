---
artifactId: dementor-club.result.public-site-visual-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G7_RELEASE
status: DRAFT
version: 0.7
updated: 2026-09-09
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.6
---

# MP | Dementor Club | VALIDATION | Public Site Visual Harmonization v1 | v0.7

## Goal
Finish the public-site harmonization after live screenshot and exact Pages-artifact retests, without broadening into Workspace/Board/DC-9/Auth/DB or silently converting Merch into an unapproved commerce flow.

Specification: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md`  
Initial inventory: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_INVENTORY_2026-09-08.md`  
Live smoke evidence: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-09.md`

## Status
**DRAFT / SECOND LIVE POLISH + RASTER INTEGRITY FIX G6 PASS / G7 RELEASE PENDING AUTHORIZATION**

Integration branch: `agent/public-site-visual-harmonization-v1`  
Second-polish PR: `#140`  
Second-polish base: `435c74c1fb8566d47f28c5ceda1006279f5f622c`  
Latest validated candidate: `587315105146904fd380eff5661ff955bcce3743`

## Prior release evidence
- original PR `#138` → production `0f19e52c17a700b7e477cab0fca8f98bffaf441c` → deploy `#50` / SUCCESS;
- first live retest exposed duplicate Home Fuengirola image/Gabil treatments and Events/Merch copy debt;
- corrective PR `#139` → production `435c74c1fb8566d47f28c5ceda1006279f5f622c` → deploy `#51` / `34392086767` / SUCCESS;
- Pages artifact `10120031344`, digest `sha256:3e874d45d8baad76f4cf656cbca859fed8a0430d0dd983f7c312159f2f620a6d`;
- second user screenshot retest confirmed duplicate image/Gabil fixes but exposed remaining Home/Events/Merch polish debt;
- exact artifact inspection then exposed a truncated Home-only Fuengirola WebP that previous DOM/CSS guards did not decode.

## Second live polish
### Home / Fuengirola
User confirmed one image + one Gabil, but desktop composition still read as a narrow/cropped feature.

Correction:
- desktop feature becomes full-bleed viewport width;
- background uses `cover` for the web composition;
- existing left text veil and single semantic Gabil relation remain;
- mobile stacked composition remains separate.

### Raster integrity blocker
Exact Pages artifact #51 contained `assets/home/events/fuengirola-banner.webp` as a truncated/corrupted binary. Repository size is only `29 921` bytes and external decoder checks reject the file.

Resolution inside the same Result/PR:
- retired Home-only banner path is no longer referenced by Home runtime CSS;
- Home reuses canonical `assets/ink/event-fuengirola-03.webp`, already used by the event detail surface and known to decode;
- corrupted file is left unreferenced for Result 2 tech-debt cleanup rather than deleted in this visual Result;
- static guard forbids the retired corrupted Home banner path from returning;
- built-route browser matrix now explicitly decodes referenced `.webp/.png/.jpg` assets on target routes at desktop width and fails when `naturalWidth/naturalHeight` are zero or decode rejects.

### Events
Public process/lifecycle mechanics are removed from the dominant public layout. The current event is presented directly; event model/status semantics are unchanged.

### Merch public framing
`/merch/` now reads as `LIVE CATALOG` and lets the existing runtime price/status owner populate actual state. No sales-state, checkout or payment mutation is included.

## Commercial authority conflict — actual sales activation remains separate
Current sources still conflict:
- `site-config.js`: Supabase runtime, catalog/cart enabled, checkout disabled/provider/url null;
- live `dc_merch_items`: `DC-OBJECT-001 €520 preorder`, `SH-DEM-01 €89 sold_out`, `SH-DEM-02 €79 not_open`, `SH-DEM-03 €79 not_open`;
- tracked shirt JSON: `salesState: not_open`, `commercial.priceEur: null`;
- older `merch-preorder-form-v1.js` exists but is not approved as canonical active checkout owner for this Result.

Therefore commerce activation remains a separate decision/Result after visual harmonization and tech-debt cleanup.

## Regression guards
Static and built `_site` browser guards verify:
- Home Fuengirola full-bleed geometry;
- one image owner + one semantic Gabil relation;
- Home active background uses `event-fuengirola-03.webp` and not the retired corrupted banner;
- target-route raster references browser-decode successfully;
- no horizontal overflow;
- Events has one real event presentation and no public lifecycle/process mechanics;
- Merch has live-catalog framing and no preview/sales-rule intent block;
- canonical Header geometry remains locked;
- existing Community/Fuengirola/Gabil/public-marker guards remain active.

## G6 evidence
Site Integrity / Release Readiness:
- run number: `#917`;
- run id: `34398964239`;
- exact candidate: `587315105146904fd380eff5661ff955bcce3743`;
- conclusion: **SUCCESS**.

All steps passed, including:
- updated public harmonization browser matrix;
- target-route raster decode guard;
- DC-9/Membership regressions;
- Board browser state matrix;
- canonical shell/Workspace recovery;
- WebKit auth;
- route manifest;
- production release gate.

## Hard boundaries preserved
No changes to canonical Global Header, auth/OAuth, Membership lifecycle, DC-9, Workspace, Board permissions/product behavior, Supabase schema/data, event registration semantics, merch sales-state values, checkout provider or payment flow.

The separate Board Result remains `WAITING`.

## Release boundary
`commit ≠ merge ≠ deploy ≠ live validation`.

Current authorization:
- implementation/validation of the raster fix: authorized by user instruction `давай` after the blocker review;
- production merge for PR `#140`: **not yet authorized**;
- production deploy for PR `#140`: **not yet authorized**;
- live DB mutation: **not authorized / not part of this Result**.

## Gate
G6 is complete on the asset-integrity candidate. Stay at **G7_RELEASE** pending explicit merge/deploy authorization for PR `#140`, followed by one final Home/Events/Merch live visual retest.