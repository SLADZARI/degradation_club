# Public Site Visual Harmonization — Live Smoke Evidence — 2026-09-09

Status: EVIDENCE / FINAL CORRECTIVE PASS VALIDATED / LIVE RELEASE RETEST PENDING

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

## Artifact-level blocker discovered before PR #140 release
A tester then inspected the exact Pages artifact from deploy #51 and found that the Home-only asset:

`assets/home/events/fuengirola-banner.webp`

was physically truncated/corrupted. GitHub reports the repository file size as `29 921` bytes, while the WebP RIFF header declares a much larger payload; direct decoders reject the file. This explains why a CSS/layout-only fix could still leave the sole Home event image unreliable.

This finding is valid and is inside Result 1 because the visible harmonization acceptance requires the built Home image to actually render.

Resolution in PR `#140`:
- do not create another duplicate event image;
- stop referencing the corrupted Home-only banner in runtime CSS;
- reuse the existing canonical, decodable event asset `assets/ink/event-fuengirola-03.webp` for Home Fuengirola;
- keep the single Home image owner and single semantic Gabil relation;
- add built-route browser raster decoding checks so truncated `.webp/.png/.jpg` references fail G6 instead of passing on file existence/CSS geometry alone.

The corrupted `assets/home/events/fuengirola-banner.webp` file itself is not deleted in Result 1; once unreferenced it becomes tech-debt inventory for Result 2 rather than another visual mutation.

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

## Release #52 — live composition retest
PR `#140` was merged and released as production commit:

`6abb7f28d63fe2e0e7025d49255b59ee55b715db`

Deploy Dementor Production `#52` / `34400419171` completed **SUCCESS**. Pages artifact: `10123205040`, digest `sha256:c146bb0fa744ad025c23d63c8c3a832f23d4db9a2d9bd4c286b851f9efc0d4a3`.

User-supplied live screenshot confirmed the technical duplicate and corrupted-asset issues were gone, but revealed one remaining visual defect: the full-bleed Home Fuengirola background plus a still-strong left veil/copy rail visually read as a smaller paper/card composition placed over the same larger poster.

This was classified as **visual duplicate composition**, not a second raster asset.

## PR #141 — final Home visual correction
Final correction remains inside Result 1 and the same active integration branch. It does not change Header, Gabil relation, CTA semantics, events lifecycle, merch commercial state, Board, Workspace, Membership, DC-9, auth or Supabase.

Implemented:
- desktop/tablet: one canonical `assets/ink/event-fuengirola-03.webp` section background, `cover`;
- desktop veil shortened/softened and copy rail narrowed to the accepted composition range;
- mobile `<=700`: section background intentionally removed and the same canonical asset rendered once as an in-flow poster strip owned by `.dc-shell::before`;
- legacy runtime Home Fuengirola `<img>` injection removed;
- one semantic Gabil relation preserved;
- breakpoint-aware regression contract now requires exactly one active Fuengirola raster owner at every tested width.

### Visual-reference establishment
Site Integrity / Release Readiness `#924` / `34406568109` intentionally stopped only because accepted visual hashes did not yet exist. Its breakpoint-aware media-owner diagnostics passed, including `390px`, where the sole active Fuengirola raster owner was `.dc-shell::before` with the canonical asset and `cover`.

Reference artifact from #924:
- artifact: `10125592894` / `home-fuengirola-visual-references`;
- widths inspected: `1440 / 1024 / 390`;
- acceptance: one poster/composition, no inner rectangular paper/card panel, one Gabil, readable copy, visible CTA, no overflow;
- accepted hashes committed in `scripts/visual-baselines/home-fuengirola.json`.

### Final G6
Validated candidate:

`07a097594dc816c718e6c8d28a49f62ddb88bc69`

Site Integrity / Release Readiness `#925` / `34406937024` completed **SUCCESS** on the exact candidate and production base `6abb7f28d63fe2e0e7025d49255b59ee55b715db`.

All validation steps passed, including:
- visual/static contracts;
- raster decode;
- breakpoint-aware Home Fuengirola ownership and browser matrix;
- accepted screenshot baselines at `1440 / 1024 / 390`;
- DC-9/Membership regression contracts;
- Board browser state matrix;
- Workspace/browser recovery;
- My Artifacts;
- WebKit auth;
- route manifest;
- production artifact release gate.

Final visual-reference artifact from #925:
- artifact: `10125722167`;
- digest: `sha256:d53fffebcfc2556e6ca1f609c578acc42db6ae5acd85bb7883d5d2b4d650c0af`.

## Current gate
Final correction is **G6 validated** and ready to return to `G7_RELEASE` once Weekly OS pointers are updated. Production has not been mutated by PR #141 yet. A final production merge/deploy still requires explicit authorization, followed by one short live smoke before Result 1 can close.
