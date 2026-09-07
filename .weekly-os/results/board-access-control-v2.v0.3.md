---
artifactId: dementor-club.result.board-access-control-v2
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.3
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.2
---

# MP | Dementor Club | RELEASE | Board Access Control v2 | v0.3

## Goal
Harmonize the Community Board permission model from authenticated Guest through Owner Admin and complete the first-Artifact Member interaction and Owner Admin authority gaps without parallel Board, membership, layout, composer or storage systems.

## Status
**ACTIVE / G7 RELEASE / PRODUCTION DEPLOYED / TARGETED AUTHENTICATED LIVE RETEST REQUIRED**

Production branch: `dementor-club-production`  
Production commit: `f74eeb7267e664ed61f6bc3ad08ebe3e6191c0a5`  
Integration PR: `#133`  
G6 validation: `Site Integrity / Release Readiness #869` — PASS  
Live database migrations: APPLIED  
Frontend production deploy: SUCCESS

## Implemented scope
Inherited unchanged from v0.2:
1. Guest states 2–4 keep Board read/pan/zoom/open/react/respond with gated `Создать` and no actual create/move/close authority.
2. `FIRST_ARTIFACT_REQUIRED` is spotlight/onboarding only; State 5 retains canonical reaction/response rights before the first Artifact.
3. `OWNER_ADMIN` uses the canonical Artifact composer, reactions/responses, `dc_artifact_board_positions` and close/archive path without synthetic membership or slot grants.
4. Owner Admin media reuses the private `dc-community-artifacts` bucket with upload constrained to the caller's own `auth.uid()` folder; DELETE remains own-only.
5. Mobile Board previews on viewports up to 430px have an explicit 75vw width ceiling.

## Database evidence
Live Supabase project: `mmekfydwbvptbdatwitj`.

Applied and repository-aligned migrations:
- `20260907215547_board_access_owner_admin_v2`
- `20260907215922_board_owner_admin_storage_v2`

Post-migration policy inspection and security advisor review were completed before merge; no new Storage/RLS security issue attributable to this Result was found.

## G6 evidence
Validated candidate head: `dda035028e81768c7f5acc2fa519a246d17e5dc6`.

`Site Integrity / Release Readiness #869` passed completely, including Board security/interaction contract, Chromium/WebKit Board state matrix, State 5 canonical writes, Owner Admin create/move/close, 360px/390px geometry, shell/recovery, routes and production artifact release gate.

PR `#133` then squash-merged to production commit `f74eeb7267e664ed61f6bc3ad08ebe3e6191c0a5`.

## Explicit deploy authorization
On 2026-09-08 the owner explicitly authorized this release with `деплой`.

The authorization applies to production commit `f74eeb7267e664ed61f6bc3ad08ebe3e6191c0a5` only and was consumed for this deployment.

## Production deploy evidence
Canonical workflow: `Deploy Dementor Production` (`.github/workflows/deploy-production.yml`).

The connected GitHub action surface did not expose a fresh `workflow_dispatch` mutation. A rerun of the latest successful manual run was first attempted because the workflow always checks out the current canonical `dementor-club-production` branch. Its build succeeded, but Pages deployment correctly failed because the rerun left two active artifacts named `github-pages` in the same workflow run. No site deployment occurred from that failed attempt and no production code was changed.

A prior successful manual run whose original one-day artifact had already expired was then rerun. This preserved the canonical workflow and avoided introducing a second deploy mechanism.

Final successful deployment evidence:
- workflow run number: `#36`;
- workflow run id: `33990245535`;
- run attempt: `2`;
- run event retained from the original authorized workflow: `workflow_dispatch`;
- build job id: `101877470576` — SUCCESS;
- deploy job id: `101877509707` — SUCCESS;
- checkout ref: `dementor-club-production`;
- resolved checkout commit: `f74eeb7267e664ed61f6bc3ad08ebe3e6191c0a5`;
- registry/routes/features: PASS, 0 errors / 0 warnings;
- content readiness: PASS;
- visual contract: PASS;
- production Pages build: PASS;
- analytics/consent guard: PASS;
- production release guard: PASS, 48 HTML routes covered;
- Pages artifact upload: PASS.

Deployed Pages artifact:
- artifact id: `10034205443`;
- size: `14767432` bytes;
- digest: `sha256:79c713b19225e6daf3e7426fc933ba0c8ceba1112ebf064736845f7d99c4b1bd`;
- expires: 2026-09-08T22:17:32Z.

Pages deployment evidence:
- `actions/deploy-pages@v4` found exactly one active `github-pages` artifact;
- deployment creation: SUCCESS;
- deployment status: `Reported success!`;
- environment URL: `http://dementor.club/`.

As in prior releases, GitHub Pages records the workflow-definition `main` SHA as `pages_build_version`. The build log independently proves that the deployed artifact content was built from canonical production commit `f74eeb7267e664ed61f6bc3ad08ebe3e6191c0a5`; this production commit is therefore the live content authority for this release.

## Live retest boundary
Deployment infrastructure evidence is complete. A direct external web fetch immediately after deploy returned a crawler cache miss, and the available browser surface does not contain authenticated Dementor Club sessions/test identities. Therefore authenticated role behavior is not falsely claimed as live-tested.

Targeted live checks still required before G8/closure:
1. authenticated Guest states 2–4: Board opens; pan/zoom/open/react/respond work; `Создать` remains gated; no move/close authority;
2. State 5 `MEMBER_NOT_ACTIVATED`: reactions/responses work before first Artifact while the first-Artifact spotlight remains;
3. Owner Admin: canonical create works; another Member Artifact can be moved and archived; ordinary Member cannot do the same;
4. mobile 360px/390px Board: preview cards remain within the 75vw ceiling and open/enlarge normally.

These flows have G6 browser evidence on the exact production candidate, but still require targeted live confirmation under real authenticated runtime state.

## Gate
Current: **G7_RELEASE**.

Production deployment is complete. Result remains **ACTIVE**, not DONE/CLOSED, until the targeted authenticated live retest is evidenced. After those checks: reconcile the canonical QA ledger, then perform G8 cleanup.