---
artifactId: dementor-club.result.board-access-control-v2
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.2
updated: 2026-09-07
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
---

# MP | Dementor Club | RELEASE | Board Access Control v2 | v0.2

## Goal
Harmonize the Community Board permission model from authenticated Guest through Owner Admin and complete the two remaining access gaps: first-Artifact Member interaction monotonicity and Owner Admin moderation/layout authority.

## Status
**ACTIVE / G7 RELEASE / G6 VALIDATED + MERGED / DEPLOY NOT AUTHORIZED**

Production branch: `dementor-club-production`  
Production commit: `f74eeb7267e664ed61f6bc3ad08ebe3e6191c0a5`  
Integration PR: `#133`  
Validated candidate head: `dda035028e81768c7f5acc2fa519a246d17e5dc6`  
Semantic authority: `operations/BOARD_ACCESS_AND_OWNER_ADMIN_V2.md`

## Implemented scope
1. Guest states 2–4 keep Board read/pan/zoom/open/react/respond with gated `Создать` and no create/move/close authority.
2. `FIRST_ARTIFACT_REQUIRED` is spotlight/onboarding only; State 5 no longer loses canonical reaction/response rights after acceptance.
3. `OWNER_ADMIN` uses the canonical Artifact controller/composer and canonical reaction/response paths without synthetic membership or slot grants.
4. `OWNER_ADMIN` can move any live Member Artifact through the existing `dc_artifact_board_positions` owner and archive another Community Artifact through the existing close RPC.
5. Owner Admin Artifact media reuses the canonical private `dc-community-artifacts` bucket; upload remains constrained to the Owner Admin's own `auth.uid()` folder.
6. Mobile spatial Artifact previews on viewports up to 430px have an explicit 75vw width ceiling, removing camera-zoom-dependent responsive variance while preserving tap/open enlargement.
7. No parallel Board state, layout table, composer, storage bucket or membership state was introduced.

## Database evidence
Live Supabase project: `mmekfydwbvptbdatwitj`.

Applied migrations:
- `20260907215547_board_access_owner_admin_v2`
- `20260907215922_board_owner_admin_storage_v2`

Repository migration filenames are aligned to the live migration versions:
- `supabase/migrations/20260907215547_board_access_owner_admin_v2.sql`
- `supabase/migrations/20260907215922_board_owner_admin_storage_v2.sql`

Post-migration policy inspection confirmed:
- Owner Admin is admitted to canonical reaction/response/position paths;
- Guest response remains pre-membership and explicitly excludes Owner Admin;
- Board-position write remains bounded to live Community Artifacts;
- private Artifact media SELECT/INSERT admits Member or Owner Admin;
- media INSERT remains restricted to the authenticated user's own first folder segment;
- media DELETE remains own-only.

Supabase security advisor showed no new Storage/RLS issue attributable to this Result. Existing repository-wide legacy/security-definer advisories remain outside this Result and are not claimed resolved.

## G6 validation evidence
Final candidate head: `dda035028e81768c7f5acc2fa519a246d17e5dc6`.

`Site Integrity / Release Readiness` run `#869` completed successfully. Evidence includes:
- registry/routes/feature state: PASS;
- page content readiness: PASS;
- visual contract: PASS;
- DC-9 immutable baseline: PASS;
- Board v2 security and interaction contract: PASS;
- Board v2.1 fullscreen composition: PASS;
- production candidate build: PASS;
- analytics/consent: PASS;
- canonical shell: PASS;
- built JavaScript syntax: PASS;
- Google OAuth handoff: PASS;
- Board browser state matrix: PASS;
- browser shell / Workspace recovery: PASS;
- My Artifacts regression: PASS;
- WebKit auth regression: PASS;
- production route manifest: PASS;
- production artifact release gate: PASS.

Board browser evidence specifically covers:
- State 5 reaction and response before first Artifact;
- Owner Admin privileged create through the existing composer;
- all live Member cards becoming admin-movable after canonical state resolution;
- real drag of another Member Artifact with position persistence;
- drag release not being misread as fullscreen-open;
- Owner Admin close/archive not being intercepted by card-open;
- 390px and 360px responsive Board geometry.

## Merge evidence
PR `#133` was squash-merged after the final successful G6 run.

Merged production commit: `f74eeb7267e664ed61f6bc3ad08ebe3e6191c0a5`.

Post-merge branch inspection confirms `dementor-club-production` HEAD equals this commit. The merge message explicitly states `No deploy`.

## Acceptance criteria
- State 5 can react/respond before first Artifact while spotlight remains and activation semantics are unchanged: **PASS**.
- State 6 ordinary Member cannot moderate another Member Artifact: **PASS by unchanged permission boundary + regression contract**.
- State 8 Owner Admin can move and close another Member Artifact: **PASS**.
- State 8 Owner Admin can create/publish through the existing composer without a Member slot grant: **PASS**.
- Guest states 2–4 cannot create/move/close and keep existing read/react/respond behavior: **PASS**.
- No new membership state, slot grant, Board layout table, duplicate Board controller or storage bucket: **PASS**.
- G6 Site Integrity and Board browser/security state matrix pass: **PASS**.
- Clean production candidate contains only this Result diff: **PASS**; final diff contained 10 Board/QA/Supabase files and was 0 commits behind the production baseline before merge.
- No deploy without explicit owner approval: **PRESERVED**.

## Release boundary
Code is merged into `dementor-club-production` and the required Supabase migrations are live. The public/site artifact has **not** been deployed in this Result step.

Do not infer:
- merge = deploy;
- live database migration = live frontend release;
- G6 validation = G8 cleanup;
- Owner Admin = synthetic Member or unlimited Member slot grant.

## Gate
Current: **G7_RELEASE**.

Next permitted action requires explicit owner authorization to deploy `dementor-club-production` commit `f74eeb7267e664ed61f6bc3ad08ebe3e6191c0a5`. After deploy: targeted live Board retest, then G8 cleanup/reconciliation. Until then the Result remains **ACTIVE**, not RELEASED/DONE.