---
artifactId: dementor-club.result.public-site-visual-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G7_RELEASE
status: DRAFT
version: 0.5
updated: 2026-09-09
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.4
---

# MP | Dementor Club | VALIDATION | Public Site Visual Harmonization v1 | v0.5

## Goal
Close the public-site visual harmonization Result after the screenshot-driven corrective pass, without broadening into Workspace/Board/DC-9/Auth/DB or visual-tech-debt cleanup.

Specification: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md`  
Initial inventory: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_INVENTORY_2026-09-08.md`  
Live smoke evidence: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-09.md`

## Status
**DRAFT / CORRECTIVE RELEASE DEPLOYED / SECOND LIVE RETEST PENDING**

Integration branch: `agent/public-site-visual-harmonization-v1`  
Corrective PR: `#139`  
Corrective base: `0f19e52c17a700b7e477cab0fca8f98bffaf441c`  
Validated corrective candidate: `84f78536d7c6fd84db043ddea424eb7c804b9906`

## Original release evidence
- original PR: `#138`;
- original validated candidate: `46e2ee37944e9535330f3e1a2b14e70eafc7eec8`;
- original G6: Site Integrity `#912` / `34319014791` / SUCCESS;
- original production merge: `0f19e52c17a700b7e477cab0fca8f98bffaf441c`;
- original production deploy: `#50` / `34357305018` / SUCCESS;
- original Pages artifact: `10106288390`;
- user screenshots after deploy #50 exposed remaining Home Fuengirola duplication and Events/Merch copy debt.

## Corrective implementation
### Home / Fuengirola
- `home-event-fuengirola-20260828.css` is the route-specific Home event visual owner;
- older shared Fuengirola pseudo-image is neutralized at that boundary;
- semantic runtime Gabil relation remains;
- decorative CTA Gabil pseudo portrait/copy is removed;
- mobile CTA spacing is normalized.

### Events
Public copy no longer exposes phrases such as `Пустое состояние — тоже данные` or `канонической записи события`; lifecycle/status semantics are unchanged.

### Merch
Public copy no longer describes internal taxonomy such as `OBJECT / WEAR / DROP сущности`, `WORKING ASSETS`, or `MERCH CONTRACT`; product/sales facts are unchanged.

## Corrective validation evidence
Site Integrity / Release Readiness:
- run number: `#913`;
- run id: `34362528636`;
- exact candidate: `84f78536d7c6fd84db043ddea424eb7c804b9906`;
- conclusion: **SUCCESS**.

All steps passed, including the extended built `_site` public harmonization browser matrix at `1440 / 1024 / 768 / 390 / 360`, plus DC-9/Membership, Board, canonical shell/Workspace, WebKit auth, route manifest and production release gate checks.

## Corrective production release
Owner explicitly authorized: `мерж и деплой`.

- corrective production merge authorized: **YES**;
- corrective production deploy authorized: **YES**;
- corrective PR `#139`: **MERGED**;
- corrective production commit: `435c74c1fb8566d47f28c5ceda1006279f5f622c`;
- corrective deploy workflow: `Deploy Dementor Production`;
- corrective deploy run number: `#51`;
- corrective deploy run id: `34392086767`;
- deploy conclusion: **SUCCESS**;
- build job: **SUCCESS**;
- deploy job: **SUCCESS**;
- Pages artifact id: `10120031344`;
- Pages artifact digest: `sha256:3e874d45d8baad76f4cf656cbca859fed8a0430d0dd983f7c312159f2f620a6d`.

Deploy log evidence confirms the workflow explicitly checked out `dementor-club-production` and built exact commit `435c74c1fb8566d47f28c5ceda1006279f5f622c`. The workflow-dispatch run itself is launched from `main`; its run-level head SHA is not the production content SHA.

## Hard boundaries preserved
No changes to canonical Global Header, auth/OAuth, Membership lifecycle, DC-9, Workspace, Board permissions/product behavior, Supabase schema/RPC, merch checkout semantics, or event registration semantics.

The separate Board Result remains `WAITING`.

## Release boundary
`commit ≠ merge ≠ deploy ≠ live validation`.

Current state:
- corrective production merge: **complete**;
- corrective production deploy: **complete**;
- live DB mutation: **not required / not authorized**;
- second live visual retest: **pending user browser evidence**.

## Gate
Stay at **G7_RELEASE** until the second live retest confirms the corrected production composition/copy. Do not mark Result DONE / APPROVED / G8 closed before that evidence.