---
artifactId: dementor-club.result.public-site-visual-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G5_BUILD
status: DRAFT
version: 0.9
updated: 2026-09-09
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.8
---

# MP | Dementor Club | VALIDATION | Public Site Visual Harmonization v1 | v0.9

## Goal
Close the final Home Fuengirola composition defect discovered by live screenshot after deploy #52, without broadening Result 1 beyond public visual harmonization.

Specification: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md`  
Inventory: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_INVENTORY_2026-09-08.md`  
Live smoke evidence: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-09.md`

## Status
**DRAFT / DEPLOY #52 SUCCESS / LIVE VISUAL RETEST FOUND ONE HOME COMPOSITION DEFECT / RETURNED TO G5_BUILD**

## Production evidence before final correction
- production commit: `6abb7f28d63fe2e0e7025d49255b59ee55b715db`;
- Deploy Dementor Production `#52` / `34400419171` / **SUCCESS**;
- build checkout proven at exact production commit `6abb7f28d63fe2e0e7025d49255b59ee55b715db`;
- Pages artifact: `10123205040`;
- artifact digest: `sha256:c146bb0fa744ad025c23d63c8c3a832f23d4db9a2d9bd4c286b851f9efc0d4a3`;
- canonical Home event asset decodes and renders: `assets/ink/event-fuengirola-03.webp`;
- one semantic Gabil treatment remains;
- duplicate runtime/image ownership is fixed.

## Live visual defect
User screenshot after deploy #52 shows a **visual duplicate composition**, not a technical duplicate asset.

Root cause in canonical route-specific owner `home-event-fuengirola-20260828.css`:
- full-bleed background is correct;
- left veil remains too opaque (`.94` at origin) and extends until roughly `57%` of viewport;
- copy shell is too wide (`min(48vw,720px)`);
- together these make the left area read as an independent paper/card with a second Fuengirola image, while the right side reads as the main poster.

## Final correction scope
Only Home Fuengirola composition may change:
- keep exactly one full-bleed canonical background image;
- shorten/soften veil so it no longer forms a rectangular internal panel;
- narrow copy area to approximately `520–560px` desktop;
- adjust background position so image and text form one poster;
- preserve Header, Gabil relation, CTA, event semantics and mobile stacking;
- preserve no-overflow behavior.

No other public section receives new redesign in this pass.

## Visual acceptance
Reference widths: `1440 / 1024 / 390`.

At each reference width:
- one Fuengirola poster/composition is perceived;
- no rectangular internal paper/card panel is formed by the veil;
- exactly one Gabil identity treatment is visible;
- text remains readable;
- CTA remains visible/usable;
- no horizontal overflow.

The existing DOM/runtime assertions remain necessary but are not sufficient. This correction must add a screenshot/reference regression check for the Home event composition at the three reference widths.

## Hard boundaries preserved
No changes to canonical Global Header, auth/OAuth, Membership lifecycle, DC-9, Workspace, Board permissions/product behavior, Supabase schema/data, event registration semantics, merch sales-state values, checkout provider or payment flow.

Board Result remains `WAITING`.

## Gate
Returned to **G5_BUILD** until:
1. integration branch is fast-forwarded from deployed production `6abb7f28...`;
2. Home composition correction is implemented in the existing canonical route-specific owner;
3. screenshot/reference regression guard is added;
4. full G6 passes;
5. only then may the Result return to G7 release for one final merge/deploy/live smoke.
