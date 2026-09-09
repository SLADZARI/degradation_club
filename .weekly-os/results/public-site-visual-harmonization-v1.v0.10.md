---
artifactId: dementor-club.result.public-site-visual-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G7_RELEASE
status: DRAFT
version: 0.10
updated: 2026-09-09
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.9
---

# MP | Dementor Club | VALIDATION | Public Site Visual Harmonization v1 | v0.10

## Goal
Close the public-site visual harmonization pass with the final Home Fuengirola composition corrected and regression-protected, without broadening Result 1 into commerce, Board, Workspace, Membership, DC-9, auth or general visual tech-debt cleanup.

Specification: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md`  
Inventory: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_INVENTORY_2026-09-08.md`  
Live smoke evidence: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-09.md`

## Status
**DRAFT / FINAL CORRECTION G6 PASS / G7 RELEASE / PRODUCTION MERGE + DEPLOY NOT YET AUTHORIZED**

## Current release candidate
- production base: `6abb7f28d63fe2e0e7025d49255b59ee55b715db`;
- PR: `#141` — `Home Fuengirola — final visual composition correction`;
- integration branch: `agent/public-site-visual-harmonization-v1`;
- validated candidate: `07a097594dc816c718e6c8d28a49f62ddb88bc69`;
- Site Integrity / Release Readiness: `#925` / `34406937024` / **SUCCESS**;
- visual-reference artifact: `10125722167`;
- visual-reference digest: `sha256:d53fffebcfc2556e6ca1f609c578acc42db6ae5acd85bb7883d5d2b4d650c0af`.

## Final Home correction
The live defect after deploy #52 was a **visual duplicate composition**, not a technical second asset.

Final implementation:
- desktop/tablet `>700px`: exactly one canonical `assets/ink/event-fuengirola-03.webp` owner as the full-bleed section background with `cover`;
- desktop veil is shorter/softer and the copy rail is constrained to the accepted narrow range, so the left copy area no longer reads as an internal paper/card panel;
- mobile `<=700px`: section background is intentionally absent; the same canonical asset appears exactly once as the in-flow `.dc-shell::before` poster strip;
- legacy runtime Home Fuengirola `<img>` injection is absent;
- old corrupted `assets/home/events/fuengirola-banner.webp` remains unreferenced tech debt for a later cleanup Result;
- exactly one semantic Gabil relation remains;
- CTA and event semantics are unchanged.

## Visual acceptance evidence
Reference widths: `1440 / 1024 / 390`.

Site Integrity run `#924` / `34406568109` generated the candidate reference artifact `10125592894`. The breakpoint-aware media-owner contract passed; that run intentionally stopped only because accepted visual hashes were not yet recorded.

The three generated references were inspected before acceptance and met the Result criteria:
- one Fuengirola poster/composition;
- no rectangular internal paper/card panel;
- one Gabil identity treatment;
- readable text;
- visible CTA;
- no horizontal overflow.

Accepted hashes are now tracked in:

`scripts/visual-baselines/home-fuengirola.json`

The full follow-up G6 `#925` passed against those baselines and the same exact candidate.

## G6 evidence
All release-readiness steps passed, including:
- registry/routes/features;
- content readiness;
- visual contract;
- DC-9 immutable baseline and sync integrity;
- Membership semantic authority;
- Board security/interaction and fullscreen browser matrix;
- production candidate build;
- analytics/consent;
- canonical shell;
- built JS syntax;
- Google OAuth handoff;
- raster decode and public harmonization browser matrix;
- Home Fuengirola breakpoint-aware one-owner contract;
- Home screenshot baselines `1440 / 1024 / 390`;
- Workspace/browser recovery;
- My Artifacts;
- WebKit auth;
- route manifest;
- production artifact release gate.

## Result 1 scope preserved
Public target routes remain:
- `/`;
- `/events/`;
- `/events/fuengirola/`;
- `/community/`;
- `/community/gabil/`;
- `/merch/`.

No semantic/commercial mutation was made to turn the merch catalog into an enabled checkout flow. The known runtime/tracked-record commercial authority conflict remains a separate decision/result.

No live Supabase mutation is authorized by this Result.

Board Result `dementor-club.result.board-access-control-v2` remains `WAITING` and is not closed by this work.

## G7 release gate
Before production merge:
1. PR `#141` must still be open/mergeable and point to exact head `07a097594dc816c718e6c8d28a49f62ddb88bc69`;
2. `dementor-club-production` must still be exact base `6abb7f28d63fe2e0e7025d49255b59ee55b715db`;
3. G6 `#925` must remain SUCCESS for the exact candidate;
4. user must explicitly authorize merge/deploy.

After authorized release:
1. merge only PR `#141` into current production baseline;
2. run canonical `Deploy Dementor Production` with `release_confirmation=APPROVED`;
3. prove checkout/build from the resulting production commit;
4. perform final live smoke on Home `1440/1024/mobile`, plus short `/events/`, `/events/fuengirola/`, `/community/`, `/community/gabil/`, `/merch/` regression check;
5. only after live PASS may Result 1 be closed and moved through G8 cleanup.

## Current authorization
- production merge authorized: **false**;
- production deploy authorized: **false**;
- live database mutation authorized: **false**.
