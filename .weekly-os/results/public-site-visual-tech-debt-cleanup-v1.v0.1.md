---
artifactId: dementor-club.result.public-site-visual-tech-debt-cleanup-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G8_CLEANUP
status: DRAFT
version: 0.1
updated: 2026-09-10
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
---

# MP | Dementor Club | BUILD | Public Site Visual Tech-Debt Cleanup v1 | v0.1

## Goal
Reduce structural presentation entropy on the public site without changing the accepted Result-1 production appearance or product semantics.

Source specification boundary: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md` §7.  
Accepted visual baseline: `operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-10.md`.

## Status
**DRAFT / PASS 01 RELEASED + LIVE VALIDATED / PASS 02 INVENTORY ACTIVE**

## Hard requirement
**No user-visible visual change relative to accepted Result-1 production unless a separate defect is explicitly opened.**

`Existing before new.`  
`One responsibility = one canonical owner.`  
`ACTIVE OWNER / COMPATIBILITY / DEAD before deletion.`

## Pass 01 — released and live validated
Baseline before Pass 01:
- production: `f3ffdea8cc4ec17a140beeada2b2af3f774dba29`;
- Deploy #55 / `34463167914` / SUCCESS;
- Pages artifact `10146383467`.

Implementation:
- PR `#143` — `Public visual tech-debt cleanup v1 — owner retirement pass 01`;
- validated candidate `7f8c25dbd7668869565b0721592be0d46a2dbdb3`;
- G6 `#932` / `34465751927` / SUCCESS;
- merged production commit `fe7a86a024f1c316c93b800ba66e70933082e927`;
- Deploy Dementor Production `#56` / `34477429235` / SUCCESS;
- Pages artifact `10152083803`;
- artifact digest `sha256:a15b26994e78e78114b2a1056c23fdf82d389b11cfd6cc213d71b7764d570fc9`;
- owner live smoke after deploy: **PASS / 2026-09-10** on the checked public surfaces.

Pass 01 changes, without adding a new CSS/JS layer:
- `seo-runtime.js`: legacy `.nav` / `.menu-toggle` compatibility hooks removed; ink-layout loading scoped to routes with an active presentation responsibility;
- `ink-layout-v2.js`: explicit active-route allowlist;
- `motion-v1.js`: dead primary-nav / Archive mutation removed;
- `docs/GLOBAL_HEADER_v1.md`: aligned with the current canonical Russian/auth-aware Public Header;
- retired corrupted `assets/home/events/fuengirola-banner.webp` removed;
- unreferenced `ui-redesign-drive-v1.css` removed.

## Pass 02 — exact baseline and inventory
Pass 02 starts from the exact released production baseline:
- production baseline: `fe7a86a024f1c316c93b800ba66e70933082e927`;
- baseline deploy: `#56` / `34477429235` / SUCCESS;
- baseline Pages artifact: `10152083803`;
- integration branch: `agent/public-site-visual-tech-debt-cleanup-v1`, fast-forwarded to the exact production baseline before new mutation.

Confirmed inventory candidates:
- `ink-layout-v2.css` still contains Fuengirola entity selectors for `.dc-has-integrated-ink--fuengirola`; Pass 01 no longer loads the legacy ink-layout runtime/CSS on `/events/fuengirola/`, so these selectors are a DEAD candidate pending removal + G6 proof;
- `ink-layout-v2-tuning.css` contains the same unreachable Fuengirola legacy composition, also a DEAD candidate under the route allowlist;
- `visual-standard-v2.css` still contains the superseded Home Fuengirola `::after` image owner while `home-event-fuengirola-20260828.css` is the accepted canonical owner and explicitly neutralizes that pseudo-layer; removal requires an updated guard and regression evidence;
- Home compatibility declarations that still match live DOM remain **COMPATIBILITY**, not DEAD, until computed/browser evidence proves otherwise;
- duplicate raster families remain inventory only until both source-reference and built-runtime closure are proved.

## Pass 02 boundary
Allowed now:
- remove only owners/selectors proved unreachable or fully superseded;
- strengthen existing guards rather than create another presentation layer;
- validate the six accepted public routes against the released visual baseline.

Not allowed without a separate decision/result:
- redesign;
- Membership / DC-9 / Workspace / Board semantics;
- auth ownership changes;
- Supabase schema/RPC mutation;
- checkout, registration or commercial-state changes.

## Acceptance criteria
1. Canonical Header/Footer behavior and accepted public visuals remain unchanged on `/`, `/events/`, `/events/fuengirola/`, `/community/`, `/community/gabil/`, `/merch/`.
2. No retired runtime owner can reappear through legacy route loading.
3. Fuengirola detail remains owned by the canonical static hero.
4. Home Fuengirola remains one visual owner per breakpoint.
5. Removed selectors/files/assets have no surviving active runtime responsibility.
6. Full Site Integrity / Release Readiness G6 passes before any next production release proposal.

## Release boundary for Pass 02
- production merge authorized: **false**;
- production deploy authorized: **false**;
- live database mutation authorized: **false**.

`Commit ≠ merge ≠ deploy.`

## Related state
- `dementor-club.result.public-site-visual-harmonization-v1` is released/live-validated and handed off to this cleanup Result;
- `dementor-club.result.board-access-control-v2` remains `WAITING`;
- Merch commercial activation conflict remains separate;
- MP_DSL v0.1 remains DRAFT / REFERENCE.
