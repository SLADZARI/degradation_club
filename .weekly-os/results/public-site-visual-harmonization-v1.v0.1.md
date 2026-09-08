---
artifactId: dementor-club.result.public-site-visual-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: DRAFT
version: 0.1
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: null
---

# MP | Dementor Club | BUILD | Public Site Visual Harmonization v1 | v0.1

## Goal
Harmonize the public Dementor Club site without redesigning it: remove duplicate dominant entity presentations, eliminate public implementation/data-model language, reduce avoidable information-density competition, normalize the Community hero to one semantic DOM source, and protect the corrected state with regression guards.

Implementation specification:
`operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md`

## Status
**DRAFT / G5 BUILD / INVENTORY FIRST**

Implementation branch:
`agent/public-site-visual-harmonization-v1`

Production baseline at Result start:
`b1ed177564581c820e3739e70404957108157af1`

`baseline_sha_at_start = b1ed177564581c820e3739e70404957108157af1`

Baseline was re-read from `dementor-club-production` immediately before Result creation and matched the specification baseline.

## Operational baseline guard
Before any implementation mutation:
1. re-read `dementor-club-production` HEAD;
2. compare it with `baseline_sha_at_start`;
3. if production HEAD differs, mark the existing inventory stale and rebuild inventory/built-artifact evidence from the new HEAD before editing;
4. never blind-merge `dementor-club-site` into production.

## First stage — inventory before mutation
Sequence:

`freeze production SHA → build/inspect current _site → inventory six target routes → capture responsive baseline → map static/runtime ownership → first code change`

Target routes:
- `/`
- `/events/`
- `/events/fuengirola/`
- `/community/`
- `/community/gabil/`
- `/merch/`

Responsive baseline:
`1440 / 1024 / 768 / 390 / 360`, with `320` as supplementary stress-test only.

Inventory must distinguish:
- raw source owner;
- runtime mutation/injection owner;
- built `_site` output;
- canonical Public Shell behavior;
- active CSS/JS dependencies relevant to the touched surface.

Raw HTML alone is not production-behavior evidence.

## Scope
This Result owns only the visible public-site harmonization and the minimum regression guards necessary to protect it:
- Fuengirola / Gabil duplicate relation + dominant identity-density cleanup;
- Home / Valentin duplicate attribution cleanup;
- implementation/data-model language cleanup on public surfaces;
- Community single semantic hero DOM;
- Events empty-lifecycle density reduction;
- Entity Identity Density enforcement on the touched surfaces;
- local product/course shell QA where applicable;
- targeted visual/browser/DOM/content regression guards.

## Hard boundaries
Do not change:
- Global Header visual/structural contract;
- auth / Google OAuth;
- Membership semantics;
- DC-9;
- Workspace routing/shell;
- Board permissions/product behavior;
- Supabase schema/RPC semantics;
- merch checkout logic;
- event registration logic;
- unapproved dates/prices/roles/product facts.

The separate `dementor-club.result.board-access-control-v2` remains `WAITING` and is not part of this Result.

## Locked Header contract
Canonical runtime owner remains `global-header.js` + `global-header.css`.

Desktop IA:
`DEMENTOR CLUB · [Вступить в клуб] · О клубе · События · Проекты · Сообщество · Мерч | identity/login`

No Archive in primary nav. Legacy Join does not return as an ordinary nav item. Header before/after must remain visually unchanged.

## Acceptance criteria
### Fuengirola / Gabil
Two independent acceptance checks are mandatory:
1. **runtime relation duplication:** built `/events/fuengirola/` contains only one event→Gabil relation treatment and no second injected relation card;
2. **editorial identity density:** no second dominant Gabil portrait/feature remains in the adjacent page flow.

Ordinary textual mentions and a quote without another portrait/identity card are allowed.

### Home / Valentin
The `Думай с опасностью` feature has one identity presentation of Valentin; duplicate preceding text attribution is removed while the mentor card remains.

### Public language
Regression denylist targets only confirmed implementation/data-model markers, not generic brand vocabulary. At minimum block public built copy containing:
- `source-of-truth`
- `canonical source-of-truth`
- `participant relation from entity record`
- `sales_state`
- `production spec`

Do **not** globally ban generic terms such as `STATUS`, `PENDING`, `WAITING`, `NOT OPEN`; these may be valid Dementor Club editorial language depending on context.

### Community
One semantic hero content source in built DOM: one hero `<h1>`, one hero image source, one lead source, one body-copy source.

### Events
Fuengirola remains the dominant programme record; empty lifecycle states remain represented but do not occupy comparable visual weight to the real event.

### Regression / responsive
- canonical Russian/auth-aware Header unchanged;
- no Archive/legacy Join in primary nav;
- no horizontal overflow at baseline widths;
- mobile critical paths do not depend on hover;
- touched public routes preserve route/SEO/canonical/OG sanity;
- full current Site Integrity / Release Readiness passes before release.

## Validation ownership
Extend existing validators where coherent:
- `scripts/validate-visual-contract.mjs`
- `scripts/validate-browser-shell.mjs`
- `scripts/validate-shell-contract.mjs`

Avoid one validator per symptom when an existing canonical validator can own the invariant.

## Release boundary
`commit ≠ merge ≠ deploy`.

No production merge/deploy is authorized by creating this Result.
No live database mutation is expected or authorized.

## Follow-up Result boundary
CSS/runtime/version/assets/header-documentation entropy cleanup belongs to separate future Result:
`public-site-visual-tech-debt-cleanup-v1`.

It must not be mixed into this user-facing Result.

## Gate
Current: **G5_BUILD**.

No user-facing source mutation should begin until the current production/built-artifact inventory is captured and the baseline freshness guard passes.