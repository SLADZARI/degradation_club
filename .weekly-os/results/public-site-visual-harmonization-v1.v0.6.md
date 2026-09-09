---
artifactId: dementor-club.result.public-site-visual-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G7_RELEASE
status: DRAFT
version: 0.6
updated: 2026-09-09
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.5
---

# MP | Dementor Club | VALIDATION | Public Site Visual Harmonization v1 | v0.6

## Goal
Finish the public-site harmonization after the second production screenshot retest, without broadening visual cleanup into Workspace/Board/DC-9/Auth/DB or silently converting Merch into an unapproved commerce flow.

Specification: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md`  
Initial inventory: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_INVENTORY_2026-09-08.md`  
Live smoke evidence: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-09.md`

## Status
**DRAFT / SECOND LIVE POLISH G6 PASS / G7 RELEASE PENDING AUTHORIZATION**

Integration branch: `agent/public-site-visual-harmonization-v1`  
Second-polish PR: `#140`  
Second-polish base: `435c74c1fb8566d47f28c5ceda1006279f5f622c`  
Validated candidate: `fddaba2543c105e90ebe865fc9eb0e86717faf7b`

## Prior release evidence
- original PR `#138` → production `0f19e52c17a700b7e477cab0fca8f98bffaf441c` → deploy `#50` / SUCCESS;
- first live retest exposed duplicate Home Fuengirola image/Gabil treatments and Events/Merch copy debt;
- corrective PR `#139` → production `435c74c1fb8566d47f28c5ceda1006279f5f622c` → deploy `#51` / `34392086767` / SUCCESS;
- Pages artifact `10120031344`, digest `sha256:3e874d45d8baad76f4cf656cbca859fed8a0430d0dd983f7c312159f2f620a6d`;
- second user screenshot retest confirmed duplicate image/Gabil fixes but exposed remaining composition/editorial debt.

## Second live polish
### Home / Fuengirola
User confirmed one image + one Gabil, but desktop composition still read as a narrow/cropped feature.

Correction:
- same route-specific canonical image owner retained;
- desktop feature becomes full-bleed viewport width;
- background uses `cover` for the web composition;
- existing left text veil and single semantic Gabil relation remain;
- mobile stacked composition remains separate;
- Home event CSS import receives an explicit cache-bust revision.

### Events
User confirmed prior copy cleanup but the page still foregrounded lifecycle/process mechanics.

Correction:
- remove public `PROGRAMME / STATUS INDEX`, empty lifecycle rail, archive rule, footnotes and process editorial block;
- keep one current event lane and the real PLANNED state;
- visitor sees the actual current event first;
- lifecycle semantics remain unchanged in the event model.

### Merch public framing
User requested that Merch stop reading as a future project/preview.

Correction inside this Result:
- `/merch/` now frames itself as `LIVE CATALOG`;
- hero says actual price/availability are shown on cards;
- remove preview/sales-rule intent copy;
- runtime remains the existing price/status owner;
- no sales-state, checkout or payment mutation is included.

## Commercial authority conflict — actual sales activation is separate
During the retest the following conflict was verified:
- `site-config.js` uses Supabase as Merch runtime source and has catalog/cart enabled, but `checkoutEnabled = false`, provider/url null;
- live `dc_merch_items` currently contains `DC-OBJECT-001 €520 preorder`, `SH-DEM-01 €89 sold_out`, `SH-DEM-02 €79 not_open`, `SH-DEM-03 €79 not_open`;
- tracked `content/merch/sh-dem-01..03.json` still declares shirt `salesState: not_open` and `commercial.priceEur: null`;
- public product pages still contain implementation-facing commercial copy and no canonical enabled purchase action;
- an older/manual `merch-preorder-form-v1.js` exists but is not approved as the canonical active checkout owner for this Result.

Therefore **real sales activation is not inferred from the request for a more sales-like presentation**. Before actual commerce mutation, a separate decision/Result must fix:
1. SKU(s) open for `available`/`preorder`;
2. approved price per SKU;
3. canonical order/payment owner;
4. manual preorder/BLIK vs other checkout mechanism;
5. fulfilment/size/material/shipping facts required before purchase;
6. reconciliation rule between Supabase commercial runtime and tracked merch records.

No Supabase mutation or checkout enabling was performed.

## Regression guards
Static and built `_site` browser guards now verify:
- Home Fuengirola is full-bleed at desktop/tablet widths, uses one image owner and one semantic Gabil relation;
- no horizontal overflow;
- Events has one real event lane and no public lifecycle/process mechanics;
- Merch has live-catalog framing and no preview/sales-rule intent block;
- canonical Header geometry remains locked;
- existing Community/Fuengirola/Gabil/public-marker guards remain active.

## G6 evidence
Site Integrity / Release Readiness:
- run number: `#914`;
- run id: `34395380926`;
- exact candidate: `fddaba2543c105e90ebe865fc9eb0e86717faf7b`;
- conclusion: **SUCCESS**.

All steps passed, including the updated public harmonization browser matrix, DC-9/Membership regressions, Board browser state matrix, canonical shell/Workspace recovery, WebKit auth, route manifest and production release gate.

## Hard boundaries preserved
No changes to canonical Global Header, auth/OAuth, Membership lifecycle, DC-9, Workspace, Board permissions/product behavior, Supabase schema/data, event registration semantics, merch sales-state values, checkout provider or payment flow.

The separate Board Result remains `WAITING`.

## Release boundary
`commit ≠ merge ≠ deploy ≠ live validation`.

Current authorization:
- second-polish implementation/validation: authorized by user feedback;
- production merge for PR `#140`: **not yet authorized**;
- production deploy for PR `#140`: **not yet authorized**;
- live DB mutation: **not authorized / not part of this Result**.

## Gate
G6 is complete. Stay at **G7_RELEASE** pending explicit merge/deploy authorization for PR `#140`, followed by one final live visual retest.