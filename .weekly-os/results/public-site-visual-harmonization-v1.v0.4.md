---
artifactId: dementor-club.result.public-site-visual-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G7_RELEASE
status: DRAFT
version: 0.4
updated: 2026-09-09
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.3
---

# MP | Dementor Club | VALIDATION | Public Site Visual Harmonization v1 | v0.4

## Goal
Close the public-site visual harmonization Result after a corrective pass driven by production screenshots, without broadening into Workspace/Board/DC-9/Auth/DB or visual-tech-debt cleanup.

Specification: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md`  
Initial inventory: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_INVENTORY_2026-09-08.md`  
Live smoke evidence: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-09.md`

## Status
**DRAFT / CORRECTIVE G6 PASS / G7 RELEASE PENDING AUTHORIZATION**

Integration branch: `agent/public-site-visual-harmonization-v1`  
Corrective PR: `#139`  
Corrective base: `0f19e52c17a700b7e477cab0fca8f98bffaf441c`  
Validated corrective candidate: `84f78536d7c6fd84db043ddea424eb7c804b9906`

The branch is based directly on the exact currently deployed production merge commit before the corrective mutation. No merge from `dementor-club-site` is involved.

## Original release evidence
- original PR: `#138`;
- original validated candidate: `46e2ee37944e9535330f3e1a2b14e70eafc7eec8`;
- original G6: Site Integrity `#912` / `34319014791` / SUCCESS;
- original production merge: `0f19e52c17a700b7e477cab0fca8f98bffaf441c`;
- original production deploy: `#50` / `34357305018` / SUCCESS;
- Pages artifact: `10106288390`;
- deploy log confirmed exact checkout of `0f19e52c17a700b7e477cab0fca8f98bffaf441c` from `dementor-club-production`.

## Production live smoke finding
User screenshots after deploy #50 invalidated the assumption that the first release was visually complete:
- Home Fuengirola had two visible event image layers;
- Home Fuengirola had two visible Gabil treatments;
- Events still contained overly implementation-facing editorial copy;
- Merch still contained internal taxonomy wording.

`/events/fuengirola/` and `/community/gabil/` appeared consistent with the intended harmonization in the supplied screenshots.

## Corrective implementation
### Home / Fuengirola
Root cause was multiple presentation owners, not duplicate raw HTML:
- `home-event-fuengirola-20260828.css` already owned the full Home banner;
- shared `visual-standard-v2.css` also supplied a second event `::after` image;
- `dementor-relations-v1.js` supplied the semantic Gabil relation;
- route CSS additionally supplied decorative Gabil portrait/copy via CTA pseudo-elements.

Correction:
- `home-event-fuengirola-20260828.css` remains the route-specific Home visual owner;
- the older shared event pseudo-image is neutralized at that owner boundary;
- the semantic runtime Gabil relation remains;
- decorative CTA Gabil pseudo portrait/copy is removed;
- mobile CTA spacing is normalized after removal.

### Events
Lifecycle/state semantics remain unchanged. Public copy now explains only what a visitor needs to know and no longer exposes phrases such as `Пустое состояние — тоже данные` or `канонической записи события`.

### Merch
Sales/product facts remain unchanged. Hero/supporting copy no longer describes implementation taxonomy such as `OBJECT / WEAR / DROP сущности`, `WORKING ASSETS`, or `MERCH CONTRACT`.

## Regression guards
Static and built-artifact browser guards now explicitly verify:
- one Home Fuengirola feature;
- one semantic Gabil relation after runtime;
- canonical Home banner as the active section image owner;
- no shared Fuengirola pseudo-image overlay;
- no decorative Gabil CTA pseudo-treatment;
- corrected Events public programme copy;
- corrected Merch hero copy;
- exact stale implementation markers remain absent.

The standard harmonization browser matrix still runs on built `_site` across `/`, `/events/`, `/events/fuengirola/`, `/community/`, `/community/gabil/`, `/merch/` at `1440 / 1024 / 768 / 390 / 360`.

## Corrective G6 evidence
Site Integrity / Release Readiness:
- run number: `#913`;
- run id: `34362528636`;
- exact candidate: `84f78536d7c6fd84db043ddea424eb7c804b9906`;
- conclusion: **SUCCESS**.

All steps passed, including the extended public harmonization browser matrix, DC-9/Membership regressions, Board browser matrix, canonical shell/Workspace recovery, WebKit auth, route manifest and production release gate.

## Hard boundaries preserved
No changes to:
- canonical Global Header;
- auth / Google OAuth;
- Membership lifecycle;
- DC-9;
- Workspace;
- Board permissions/product behavior;
- Supabase schema/RPC;
- merch checkout semantics;
- event registration semantics.

The separate Board Result remains `WAITING`.

## Release boundary
`commit ≠ merge ≠ deploy`.

Current authorization:
- corrective implementation/validation: **authorized** (`да просто сделай`);
- corrective production merge: **not authorized**;
- corrective production deploy: **not authorized**;
- live DB mutation: **not required / not authorized**.

## Gate
Corrective G6 is complete. Advance to **G7_RELEASE**, pending explicit production merge/deploy authorization and a second live retest after corrective deployment.