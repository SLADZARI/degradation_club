---
artifactId: dementor-club.result.public-site-visual-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASED
gate: G8_CLEANUP
status: APPROVED
version: 1.0
updated: 2026-09-10
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.11
---

# MP | Dementor Club | RELEASED | Public Site Visual Harmonization v1 | v1.0

## Goal
Bring the six target public surfaces to one coherent visual/editorial state, remove visible duplicate entity presentations and protect the accepted state with regression checks without changing Membership, DC-9, Workspace, Board, auth, Supabase or commercial semantics.

Specification: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md`  
Final live evidence: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-10.md`

## Status
**APPROVED / RELEASED / LIVE-VALIDATED ON FINAL CHANGED ROUTES / G8 HANDOFF TO TECH-DEBT CLEANUP**

## Final production state
- production commit: `f3ffdea8cc4ec17a140beeada2b2af3f774dba29`;
- final corrective PR: `#142`;
- final validated candidate: `5dd66b18c49582dbdb532437dcd6b84f5ddfa7e3`;
- Site Integrity / Release Readiness: `#931` / `34462667133` / **SUCCESS**;
- production deploy: `#55` / `34463167914` / **SUCCESS**;
- Pages artifact: `10146383467`;
- Pages artifact digest: `sha256:08007f227f70ac3c1875020ce3785aad9dea18b6b4b9adc7259923e6ddacac42`.

## Accepted visible state
### Home `/`
- one Fuengirola visual owner per breakpoint;
- one Gabil semantic relation;
- one CTA;
- accepted full-bleed desktop/tablet composition and single in-flow mobile media strip;
- no duplicate poster/card effect.

### Events `/events/`
- public section opening is compact and visitor-facing;
- one actual programme record for Fuengirola;
- no persistent programme-trace raster/label;
- no standalone Gabil runtime card in listing;
- canonical event preview remains secondary interaction only.

### Fuengirola detail `/events/fuengirola/`
- one canonical event hero raster;
- visible `ФУЭНХИРОЛА` H1 inside hero;
- one Gabil event relation;
- no second dominant Gabil feature;
- legacy ink-layout owner no longer controls this route.

### Community / Gabil / Merch
Previous Result-1 corrections remain protected by the final G6 #931 matrix. These three unchanged routes were not newly re-screenshoted by the user after deploy #55; final live screenshot evidence is explicitly limited to the three routes changed by PR #142.

## Result-1 acceptance summary
Target routes:
- `/`;
- `/events/`;
- `/events/fuengirola/`;
- `/community/`;
- `/community/gabil/`;
- `/merch/`.

Protected baseline:
- `1440 / 1024 / 768 / 390 / 360`;
- no horizontal overflow;
- one canonical Public Header/Footer owner;
- no implementation/data-model language on corrected public surfaces;
- no duplicate dominant entity treatments introduced by shared runtime;
- mobile critical interactions do not require hover.

## G8 handoff
Visible harmonization is closed. Structural cleanup continues as a separate Result:

`dementor-club.result.public-site-visual-tech-debt-cleanup-v1`

The cleanup baseline is exact production commit `f3ffdea8cc4ec17a140beeada2b2af3f774dba29` and must preserve the accepted visual state above.

Known cleanup classes include:
- dead legacy primary-nav mutation in shared runtime;
- stale Global Header documentation;
- overly broad legacy ink-layout loading;
- retired Fuengirola CSS/presentation generations;
- corrupted/unreferenced Fuengirola banner;
- exact duplicate assets only after equality + reference proof;
- other CSS/runtime generations only after `ACTIVE OWNER / COMPATIBILITY / DEAD` classification.

## Boundaries preserved
- Board Result remains `WAITING`;
- no live database mutation is authorized by this Result;
- Merch commercial activation conflict remains a separate decision;
- MP_DSL v0.1 remains DRAFT / REFERENCE.

## Closure
Result 1 is no longer the active implementation Result. Production release and the changed-route live smoke have passed. G8 structural cleanup is delegated to the separate tech-debt Result so cleanup cannot silently mutate the accepted public presentation.
