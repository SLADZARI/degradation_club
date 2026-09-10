---
artifactId: dementor-club.result.public-site-visual-tech-debt-cleanup-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G7_RELEASE
status: DRAFT
version: 0.1
updated: 2026-09-10
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
---

# MP | Dementor Club | VALIDATION | Public Site Visual Tech-Debt Cleanup v1 | v0.1

## Goal
Reduce structural presentation entropy on the public site without changing the accepted Result-1 production appearance or product semantics.

Source specification boundary: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md` §7.  
Accepted visual baseline: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-10.md`.

## Status
**DRAFT / CLEANUP PASS 01 G6 PASS / G7 RELEASE PENDING**

## Exact baseline
- production branch: `dementor-club-production`;
- production baseline: `f3ffdea8cc4ec17a140beeada2b2af3f774dba29`;
- baseline deploy: `Deploy Dementor Production #55` / `34463167914` / SUCCESS;
- baseline Pages artifact: `10146383467`;
- baseline artifact digest: `sha256:08007f227f70ac3c1875020ce3785aad9dea18b6b4b9adc7259923e6ddacac42`;
- integration branch: `agent/public-site-visual-tech-debt-cleanup-v1` created from the exact production baseline.

## Hard requirement
**No user-visible visual change relative to accepted Result-1 production unless a separate defect is explicitly opened.**

`Existing before new.`  
`One responsibility = one canonical owner.`  
`ACTIVE OWNER / COMPATIBILITY / DEAD before deletion.`

## Inventory findings at start
The exact deploy-55 Pages artifact was inspected before cleanup mutation.

Confirmed:
- canonical Public Header runtime is `global-header.js` + `global-header.css`;
- built public pages do not expose the legacy `.nav` primary shell that old `motion-v1.js` compatibility code expected;
- `docs/GLOBAL_HEADER_v1.md` still described the superseded English `Club / Events / Projects / Community / Merch / Archive / Join` navigation;
- `seo-runtime.js` loaded `ink-layout-v2.js` broadly, while `ink-layout-v2.js` only had active mount behavior for `/`, `/about/`, `/projects/logic-awareness/`, `/community/`;
- the Fuengirola detail route is already owned by its static canonical event hero and must not be reclaimed by legacy ink-layout CSS/runtime;
- `assets/home/events/fuengirola-banner.webp` is retired, corrupted and unreferenced by the accepted runtime;
- `ui-redesign-drive-v1.css` is not referenced by the exact built artifact and the existing visual validator already protects against its legacy course import returning.

Exact duplicate-asset families were also observed, but equality alone is not deletion authority. They remain inventory until full source + built reference closure is proved.

## Cleanup pass 01 — implemented and validated
Without creating a new CSS/JS layer:
- `seo-runtime.js`: legacy `.nav`/`.menu-toggle` compatibility hooks removed; ink-layout loading scoped to its four active routes;
- `ink-layout-v2.js`: explicit active-route allowlist added; unrelated public routes no longer load the old layout/tuning CSS;
- `motion-v1.js`: dead legacy primary-nav/Archive mutation removed; canonical Header remains sole primary navigation owner;
- `docs/GLOBAL_HEADER_v1.md`: aligned with the current Russian/auth-aware Public Header contract;
- retired corrupted `assets/home/events/fuengirola-banner.webp` removed;
- unreferenced `ui-redesign-drive-v1.css` removed after exact built-artifact reference check.

PR / candidate:
- PR: `#143` — `Public visual tech-debt cleanup v1 — owner retirement pass 01`;
- base: `f3ffdea8cc4ec17a140beeada2b2af3f774dba29`;
- candidate: `7f8c25dbd7668869565b0721592be0d46a2dbdb3`;
- Site Integrity / Release Readiness: `#932` / `34465751927` / **SUCCESS**.

G6 passed the full current chain including visual contract, production candidate build, canonical shell, JS syntax, Home Fuengirola ownership diagnostic, public harmonization browser matrix, DC-9, Membership, Board browser state matrix, Workspace/browser recovery, My Artifacts, auth regressions, route manifest and production release gate.

## Deferred inside this Result until regression evidence
Do not blindly remove:
- Home compatibility rules in `ink-layout-v2-tuning.css` that may still contribute to accepted composition;
- date/version CSS layers without computed-output proof;
- top-level duplicate raster paths still referenced anywhere;
- runtime generations whose compatibility routes have not been classified.

A later cleanup pass may remove dead Fuengirola selectors from legacy ink-layout CSS and the suppressed Home Fuengirola pseudo-owner from `visual-standard-v2.css`, but only with an updated regression guard and G6 evidence proving no visual drift.

## Acceptance criteria
1. Canonical Header/Footer behavior and Result-1 visuals remain unchanged on `/`, `/events/`, `/events/fuengirola/`, `/community/`, `/community/gabil/`, `/merch/`.
2. No legacy `Archive`/ordinary `Join` primary-nav mutation can reappear through `motion-v1.js`.
3. Ink-layout runtime/CSS is not loaded on routes where it has no active presentation responsibility.
4. Fuengirola detail remains owned by its canonical static hero.
5. Removed files have no surviving built/runtime reference.
6. No Membership, DC-9, Workspace, Board, auth ownership, Supabase schema/RPC, checkout, registration or commercial semantics change.
7. Full Site Integrity / Release Readiness G6 passes before any production release proposal.

## Release boundary
- production merge authorized: **false**;
- production deploy authorized: **false**;
- live database mutation authorized: **false**.

A green commit is not a release. Explicit owner authorization is still required before merge/deploy.

## Related state
- `dementor-club.result.public-site-visual-harmonization-v1` is released and handed off to this cleanup Result;
- `dementor-club.result.board-access-control-v2` remains `WAITING`;
- Merch commercial activation conflict remains separate;
- MP_DSL v0.1 remains DRAFT / REFERENCE.
