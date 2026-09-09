---
artifactId: dementor-club.result.public-site-visual-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G7_RELEASE
status: DRAFT
version: 0.2
updated: 2026-09-09
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
---

# MP | Dementor Club | VALIDATION | Public Site Visual Harmonization v1 | v0.2

## Goal
Harmonize the public Dementor Club site without redesigning it: remove duplicate dominant entity presentations, eliminate public implementation/data-model language, reduce avoidable information-density competition, normalize the Community hero to one semantic DOM source, and protect the corrected state with regression guards.

Specification: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md`  
Inventory: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_INVENTORY_2026-09-08.md`

## Status
**DRAFT / G6 VALIDATION PASS / G7 RELEASE PENDING AUTHORIZATION**

Implementation branch: `agent/public-site-visual-harmonization-v1`  
Integration PR: `#138`  
Production baseline at Result start: `b1ed177564581c820e3739e70404957108157af1`  
Validated candidate head: `46e2ee37944e9535330f3e1a2b14e70eafc7eec8`

The candidate remains based directly on the exact production baseline (`behind_by = 0` at validation time). No merge from `dementor-club-site` is involved.

## Implemented visible harmonization
- `/events/fuengirola/`: page-owned hero relation is the sole event→Gabil identity treatment; route-specific runtime relation injection retired; second dominant Gabil feature removed; public implementation copy removed while ordinary textual attribution remains.
- `/`: duplicate textual `Дементор: Валентин Лосев.` removed; existing mentor card remains the single course identity treatment.
- `/community/`: desktop/mobile duplicate hero DOM collapsed to one semantic content source and one `<h1>`; responsive layout is owned by one CSS structure.
- `/events/`: one real Fuengirola lane remains dominant; five empty lifecycle states are retained as a compact rail instead of five full lanes; duplicate editorial explanation reduced.
- `/community/gabil/`, `/merch/`, `/events/`, Home: confirmed implementation/data-model language removed or replaced with public-facing wording without inventing missing product facts.
- `entity-recommendations-v1.js`: runtime recommendation copy no longer exposes `PRICE / TBD`; unknown price is rendered as `ЦЕНА / БУДЕТ ОБЪЯВЛЕНА` while existing sales state remains unchanged.

## Regression guards
Static owner: `scripts/validate-visual-contract.mjs`.

Browser owner: `scripts/validate-public-harmonization-browser.mjs`, executed against built `_site` for:
- routes: `/`, `/events/`, `/events/fuengirola/`, `/community/`, `/community/gabil/`, `/merch/`;
- widths: `1440 / 1024 / 768 / 390 / 360`;
- horizontal overflow;
- locked canonical Header geometry;
- Fuengirola runtime relation duplication and dominant Gabil density as separate invariants;
- Home Valentin identity count;
- Community single hero source;
- Events real-lane + compact lifecycle structure;
- exact implementation-language denylist;
- mobile Events tap-path.

The browser matrix is now a required step in `.github/workflows/site-integrity.yml` after built artifact creation and Playwright installation.

## G6 evidence
Final full Site Integrity / Release Readiness run:
- run number: `#912`;
- run id: `34319014791`;
- exact candidate: `46e2ee37944e9535330f3e1a2b14e70eafc7eec8`;
- conclusion: **SUCCESS**.

All workflow steps passed, including:
- route/feature validation;
- content readiness;
- visual contract;
- DC-9 immutable baseline and sync integrity;
- Membership semantic authority;
- Board static contracts;
- production candidate build;
- analytics/consent;
- canonical shell;
- built JS syntax;
- Google OAuth handoff;
- **public harmonization browser matrix**;
- DC-9 browser recovery;
- Board browser state matrix;
- Workspace recovery;
- My Artifacts history;
- WebKit auth regression;
- route manifest;
- production artifact release gate.

An earlier run `#910` failed only because the new browser denylist correctly discovered `PRICE / TBD` coming from the global runtime recommendation component on Home and Fuengirola. That was treated as real evidence, not suppressed: the runtime copy was corrected, and the subsequent full candidate run #912 passed.

## Scope / hard boundaries preserved
No changes to:
- Global Header visual/structural contract;
- auth / Google OAuth semantics;
- Membership lifecycle;
- DC-9 semantics;
- Workspace routing/shell;
- Board permissions/product behavior;
- Supabase schema/RPC;
- merch checkout behavior;
- event registration behavior.

The separate `dementor-club.result.board-access-control-v2` remains `WAITING` and is not closed by this Result.

## Release boundary
`commit ≠ merge ≠ deploy`.

Current authorization state:
- production merge authorized: **false**;
- production deploy authorized: **false**;
- live database mutation authorized: **false / not required**.

PR #138 must not be merged or deployed until the user explicitly authorizes release.

## Gate
G6 evidence is complete. Current gate advances to **G7_RELEASE**, pending explicit production merge/deploy authorization and subsequent live retest.