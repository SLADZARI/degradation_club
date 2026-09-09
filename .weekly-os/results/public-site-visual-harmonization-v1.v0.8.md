---
artifactId: dementor-club.result.public-site-visual-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G7_RELEASE
status: DRAFT
version: 0.8
updated: 2026-09-09
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.7
---

# MP | Dementor Club | VALIDATION | Public Site Visual Harmonization v1 | v0.8

## Goal
Release the final public-site harmonization candidate after live screenshot feedback and exact Pages-artifact raster validation, without broadening into Workspace/Board/DC-9/Auth/DB or unapproved commerce activation.

Specification: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md`  
Inventory: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_INVENTORY_2026-09-08.md`  
Live smoke evidence: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-09.md`

## Status
**DRAFT / PR #140 MERGED TO PRODUCTION / DEPLOY EXPLICITLY AUTHORIZED / MANUAL WORKFLOW DISPATCH PENDING**

## Final candidate evidence before merge
- integration branch: `agent/public-site-visual-harmonization-v1`;
- PR: `#140`;
- base before merge: `435c74c1fb8566d47f28c5ceda1006279f5f622c`;
- validated head: `587315105146904fd380eff5661ff955bcce3743`;
- Site Integrity / Release Readiness `#917` / `34398964239` / **SUCCESS**;
- browser matrix includes target-route raster decode guard so truncated `.webp/.png/.jpg` assets fail G6;
- Home uses canonical `assets/ink/event-fuengirola-03.webp`; retired corrupted `assets/home/events/fuengirola-banner.webp` remains unreferenced for Result 2 cleanup;
- Events presents the real current event without public lifecycle/process mechanics;
- Merch reads as `LIVE CATALOG` without enabling checkout or changing commercial state.

## Production merge
Owner instruction: **`мерж и деплой`**.

Authorization recorded:
- PR #140 production merge: **YES**;
- production deploy: **YES**;
- live DB mutation: **NO / NOT PART OF THIS RESULT**.

PR #140 was merged with expected head `587315105146904fd380eff5661ff955bcce3743`.

Production commit:
`6abb7f28d63fe2e0e7025d49255b59ee55b715db`

Merge parents:
- prior production `435c74c1fb8566d47f28c5ceda1006279f5f622c`;
- validated candidate `587315105146904fd380eff5661ff955bcce3743`.

## Deploy boundary
Canonical production deploy remains manual `workflow_dispatch` through **Deploy Dementor Production** and requires `release_confirmation = APPROVED`.

The connected GitHub toolset in this chat can read/verify/rerun existing Actions runs but cannot create a new workflow-dispatch run. Re-running an older deploy would not be valid evidence for the new production commit.

Therefore:
- production merge: **DONE**;
- production deploy authorization: **YES**;
- production deploy execution: **PENDING MANUAL WORKFLOW DISPATCH**;
- required deployed content SHA: `6abb7f28d63fe2e0e7025d49255b59ee55b715db`.

## Hard boundaries preserved
No changes to canonical Global Header, auth/OAuth, Membership lifecycle, DC-9, Workspace, Board permissions/product behavior, Supabase schema/data, event registration semantics, merch sales-state values, checkout provider or payment flow.

The separate Board Result remains `WAITING`.

Commercial activation remains a separate decision/Result because checkout is disabled and tracked merch records conflict with runtime commercial state.

## Gate
Stay at **G7_RELEASE** until:
1. authorized production workflow is manually dispatched;
2. deploy succeeds and the workflow build proves checkout of production commit `6abb7f28d63fe2e0e7025d49255b59ee55b715db`;
3. Pages artifact evidence is recorded;
4. final Home / Events / Merch live visual smoke passes.

Only then may Result 1 close and transition to Result 2 tech-debt cleanup.