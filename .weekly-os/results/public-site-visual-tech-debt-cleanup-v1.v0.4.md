---
artifactId: dementor-club.result.public-site-visual-tech-debt-cleanup-v1
project: dementor-club
documentType: RESULT
projectStage: CLEANUP
gate: G8_CLEANUP
status: ACTIVE
version: 0.4
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.3
specification: operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md
integrationBranch: agent/public-site-visual-tech-debt-cleanup-v1-refresh
productionBaseCommit: af28404048dfc918ada81298b0d184df407d0595
productionMergeAuthorized: true
productionDeployAuthorized: true
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | CLEANUP | Public Site Visual Tech-Debt Cleanup v1 | Result v0.4

## Status

**ACTIVE / G8 CLEANUP — RELEASED + OWNER LIVE-SMOKE PASS**

PR #155 was explicitly authorized for production by the project owner.

## Validated candidate

PR: #155 — `Public visual tech-debt cleanup v1 — refreshed isolated candidate`.

Exact validated candidate head:

`bf8156f0c8934aabfd062b6a2def3910c3921e44`

Full Site Integrity / Release Readiness #1026 / run `34720030176` — PASS.

Candidate diff remained isolated to eight public visual/merch/validation/evidence files and did not include Board, Supabase, Membership/DC-9, Workspace/auth or workflow changes.

## Production release

Production squash merge commit:

`43b6dcaa11292f49564c989add219e0b095fbf8d`

Deploy Dementor Production #64 / run `34720912365` — SUCCESS.

The deploy build explicitly checked out `dementor-club-production` and resolved `git log -1` to:

`43b6dcaa11292f49564c989add219e0b095fbf8d`

Pages artifact: `10305384132`.

Artifact digest:

`sha256:ce4324fd48037817c7a5c188104611edde913477339106234bc1a890699905b2`.

## Live smoke

After deploy #64 the project owner explicitly tested the production release and reported that it works.

Therefore the release boundary is satisfied:

- merge — complete;
- deploy — complete;
- production owner smoke — PASS.

Client preview status for the currently released surfaces: **READY**.

This does not mean the Result is G8-closed or the whole project is DONE.

## Released scope

- Ink runtime ownership narrowed to Home Hero + About + Logic;
- Community/Fuengirola obsolete runtime image ownership retired where canonical owners already exist;
- behaviorally active compatibility CSS preserved until a dedicated geometry refactor exists;
- Merch visible entity set stabilized to `SH-DEM-01..04`;
- Merch runtime maps by explicit SKU rather than card position;
- missing runtime rows no longer delete public cards/details;
- visitor-facing `PRICE UNAVAILABLE / STATUS UNAVAILABLE` replaces internal/TBD language;
- visual contract strengthened around the accepted ownership boundary.

## Hard boundaries preserved

No changes to DB/RLS, Membership/DC-9 lifecycle, Board semantics, Workspace/auth ownership, Telegram Promotion/outbox/scheduler or workflow ownership.

`operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md` remains DRAFT / REFERENCE and is not promoted to project-wide DESIGN authority.

## G8 remaining

Before final closure:

- remove/retire stale integration branches when safe;
- verify no temporary compatibility declarations introduced by this Result remain without a canonical owner;
- keep the accepted Home/Fuengirola compatibility CSS until a separately scoped geometry refactor has evidence;
- update stale QA/status pointers if found;
- do not mix unrelated Board UX work into this Result.

## Deferred Board UX observations — NOT THIS EDITION

Owner live review produced three useful follow-up ideas, explicitly deferred from the current release:

- on mobile, add directional arrows analogous to desktop for quick movement between Board items/events;
- let card composition respond more naturally to attached media proportions/content and introduce stronger typographic scale variation so cards do not all read with the same visual weight;
- separately explore how Board item/event types should be visually differentiated.

These are discussion/backlog inputs only. They are not approved implementation, are not part of PR #155, and must be handled under the future Board Result/decision flow after existing owners and semantics are re-read.
