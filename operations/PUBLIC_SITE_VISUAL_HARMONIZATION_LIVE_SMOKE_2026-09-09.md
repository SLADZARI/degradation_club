# Public Site Visual Harmonization — Live Smoke Evidence — 2026-09-09

Status: EVIDENCE / SECOND CORRECTIVE PASS OPEN

Result: `dementor-club.result.public-site-visual-harmonization-v1`

## Release #50 — first live retest
Production observed:
- commit: `0f19e52c17a700b7e477cab0fca8f98bffaf441c`
- deploy run: `#50` / `34357305018`
- Pages artifact: `10106288390`

User-supplied production screenshots after deploy #50 showed:

1. `/` — Fuengirola Home feature
   - two event image treatments visible at once;
   - two Gabil identity treatments visible at once;
   - root cause confirmed in production CSS/runtime: `home-event-fuengirola-20260828.css` owned the full banner while `visual-standard-v2.css` still added a second Fuengirola `::after` image; `dementor-relations-v1.js` added the semantic Gabil relation while the Home event CTA CSS added a second decorative Gabil portrait/copy.

2. `/events/`
   - compact lifecycle layout visually improved;
   - programme intro still read as implementation/process explanation rather than public editorial copy.

3. `/events/fuengirola/`
   - one primary Gabil relation visible;
   - no second dominant Gabil portrait feature visible in the supplied screenshot.

4. `/community/gabil/`
   - no obvious source-of-truth/PENDING implementation wording visible;
   - hero presentation visually coherent.

5. `/merch/`
   - prior hard implementation markers gone;
   - hero still used internal taxonomy wording and supporting internal labels.

Corrective PR `#139` addressed those findings and was released as production commit `435c74c1fb8566d47f28c5ceda1006279f5f622c` via deploy `#51` / `34392086767` / SUCCESS.

## Release #51 — second live retest
User-supplied desktop + mobile screenshots after deploy #51 confirm:

### Confirmed fixed
- `/` — duplicate event image is gone;
- `/` — duplicate Gabil treatment is gone; one semantic Gabil relation remains;
- `/events/` — first layer of implementation-facing explanatory copy is gone;
- `/merch/` — hard internal markers such as `OBJECT / WEAR / DROP сущности`, `WORKING ASSETS`, `MERCH CONTRACT` are gone.

### Remaining visual/editorial issues
1. `/` — Fuengirola desktop feature
   - composition still reads as a narrow/cropped block with large unused space to the right;
   - requested direction: full-width/full-bleed event image on web while keeping the mobile stacked composition and single Gabil relation.

2. `/events/`
   - page still foregrounds lifecycle/process mechanics (`PROGRAMME / STATUS INDEX`, state rail, archive rule/notes) more strongly than the actual event;
   - requested direction: present the current event directly and keep lifecycle semantics internal rather than as dominant public UI.

3. `/merch/`
   - page is visually cleaner but still reads as a preview/intention instead of an operating catalog;
   - requested direction: public page should read as a live shop/catalog and let actual price/availability state speak through the cards.

## Commercial truth conflict discovered during second retest
Actual sales activation is intentionally **not** folded into the visual harmonization pass because current production sources disagree and checkout is disabled.

Current production facts:
- `site-config.js` declares `merch.runtimeSource = 'supabase'`, `catalogEnabled = true`, `cartEnabled = true`, but `checkoutEnabled = false`, `checkoutProvider = null`, `checkoutUrl = null`;
- live `dc_merch_items` currently exposes:
  - `DC-OBJECT-001` — EUR 520 / `preorder`;
  - `SH-DEM-01` — EUR 89 / `sold_out`;
  - `SH-DEM-02` — EUR 79 / `not_open`;
  - `SH-DEM-03` — EUR 79 / `not_open`;
- tracked `content/merch/sh-dem-01..03.json` still declares `salesState: not_open` and `commercial.priceEur: null` for the shirts;
- public product pages still contain implementation-facing commercial copy and no canonical enabled checkout action;
- `merch-preorder-form-v1.js` exists as an older/manual preorder implementation, but it is not approved as the canonical active checkout owner for this Result.

Therefore the visual pass may present Merch as a **live catalog** using existing runtime price/state, but it must not silently turn `not_open` into `available`, enable payment, or invent inventory/fulfilment facts.

Required separate decision before real sales activation:
- which SKU(s) are actually open for `available` or `preorder`;
- approved price per SKU;
- canonical order/payment owner;
- whether manual preorder/BLIK is accepted or replaced;
- fulfilment/size/material/shipping facts required before purchase;
- reconciliation rule between Supabase commercial runtime state and tracked merch records.

## Current second corrective implementation
The same Result and same integration branch continue with PR `#140` from exact production commit `435c74c1fb8566d47f28c5ceda1006279f5f622c`.

Scope remains public visual/editorial harmonization only:
- Home Fuengirola full-bleed desktop composition;
- Events visitor-facing simplification;
- Merch live-catalog framing without changing sales-state or checkout semantics;
- regression guards for those exact live findings.

No Workspace, Board, DC-9, Membership, auth, Supabase data/schema, event registration or merch checkout mutation is included.