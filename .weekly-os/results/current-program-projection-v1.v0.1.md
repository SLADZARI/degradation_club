---
artifactId: dementor-club.result.current-program-projection-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.1
updated: 2026-09-15
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: null
branch: result/current-program-projection-v1
baseline: dementor-club-production@688899e31b82e14c31f5f805b2bce4f00f3741c0
implementationStartAuthorized: true
productionMergeAuthorized: true
productionDeployAuthorized: false
---

# MP | Dementor Club | RELEASE | Current Program Projection v1 | Result v0.1

## Status

**ACTIVE / G7_RELEASE / PRODUCTION MERGE AUTHORIZED / DEPLOY NOT AUTHORIZED**

Single implementation owner for the first Current Program runtime slice. G6 is complete. Owner explicitly authorized production merge on 2026-09-15; deploy remains a separate unauthorized action.

## Approval record · 2026-09-15

Owner explicitly accepted semantic stack `#196 → #205 → #207` as the implementation basis and opened G5 for this Result.

After exact-head G6 validation passed, owner explicitly authorized the production merge in chat on 2026-09-15. This authorization applies to the same Result and branch only and does **not** authorize deploy.

Narrow precedence:

> #207 supersedes the older #196 product-status wording for one claim: `Деньги на ветер` is **ready to take**.

This does not approve price, checkout, server/AI backend, Membership requirement, live Supabase mutation or production deploy.

## Baseline decision

This branch is anchored to the current `dementor-club-production` code baseline:

`688899e31b82e14c31f5f805b2bce4f00f3741c0`

Reason: `dementor-club-site` is materially diverged from production, so this Result must not blind-merge site history into production. The implementation diff is built directly against the evidenced production baseline and remains narrow.

## Goal

Implement reviewed **Current Program v0** as one coherent runtime slice without creating a parallel ontology or second source of truth.

Flow:

`accepted source truth → ThingProjection adapter → Current Program composition → Home Program Cover → Board projection hook → minimal semantic evidence`

## Current Program v0

1. `Деньги на ветер` — course ready to take;
2. `Dementor Lab` — approved public project presentation, not public playable Release;
3. `Фуэнхирола` — factual PLANNED event projection.

Excluded:

- `НЕ КОМАНДА` while model changes;
- Merch/payment;
- Membership redesign;
- automatic raw Board Artifact programming;
- Telegram programming automation;
- broad DB/schema migration;
- recommendation AI.

## Acceptance Criteria

### AC1 · One ThingProjection contract
Home and Board consume one reviewed read model derived from existing source identities. No universal `dc_things` table.

### AC2 · Explicit Program composition
Runtime uses the reviewed v0 composition, not recency/database activity/publication timestamps/Board activity.

### AC3 · Exact actions
- `Деньги на ветер` → `ПРОЙТИ КУРС` → `/courses/dengi-na-veter/`;
- `Dementor Lab` → `ПОСМОТРЕТЬ LAB` → `/projects/dementor-lab/`;
- `Фуэнхирола` → `ПОСМОТРЕТЬ СОБЫТИЕ` → `/events/fuengirola/`.

### AC4 · Home Program Cover
Home renders Current Program from shared projection/composition source, not an independent semantic list. No broad Home redesign.

### AC5 · Board projection hook
Board projects reviewed Things separately from raw Artifacts. Artifact existence/QA/activity must not become Programming Moment automatically.

### AC6 · Truth conflict explicit
`Деньги на ветер = ready to take` must not silently mix with stale `mvp-in-development` operational wording.

### AC7 · Minimal semantic evidence
Reuse existing analytics conventions where possible; prove rendered Program and exact action destinations without building a new analytics platform.

### AC8 · Validation
Desktop + mobile, Home render, Board hook, exact routes, blocked-claim sweep, no duplicate semantic/runtime owner, build/route integrity and full browser/release-gate regression must pass before production merge.

## G6 corrective loop

The first full browser run exposed a real ownership defect rather than a test-threshold problem.

### Mobile fullscreen geometry

Canonical mobile Board shell owns a 136 px top envelope (`24 px LIVE banner + 112 px Workspace header`). The existing fullscreen regression correctly requires the spatial viewport to begin within that canonical envelope.

The initial Current Program Board rail was inserted in normal document flow before the spatial viewport and pushed the viewport to about 400 px on 390/360 widths.

Corrective action stayed inside the new Current Program projection owner:

- kept the existing fullscreen threshold unchanged;
- made the Board shell the positioning owner for Current Program;
- moved Current Program to a compact absolute interface overlay;
- kept Program Things separate from the 12,000 × 8,000 spatial Artifact world;
- added explicit regression assertions for absolute placement and remaining-height ownership.

The next full run proved `Board v2.1 fullscreen browser state matrix` with the original geometry threshold.

### Pointer ownership

That geometry correction exposed a second real defect: the overlay rail intercepted clicks intended for Board detail filters.

Corrective action did not weaken Board tests:

- Program overlay, rail and cards are click-through;
- only explicit Current Program action links receive pointer events;
- Board filters, pan/drag and spatial interaction remain canonical owners of the underlying surface;
- Current Program browser acceptance now guards both fullscreen geometry and this pointer boundary.

The subsequent full run proved the previously failing `Board live corrective browser acceptance` and all downstream Board interaction regressions.

## G6 evidence — code candidate

Validated implementation head:

`18769232342574efac649d9e03c80fc385c87261`

Site Integrity / Release Readiness:

- workflow run: `#1178` / Actions run `34999160599`;
- conclusion: `SUCCESS`;
- Supabase release contract: `SUCCESS`;
- registry/routes/content/visual contracts: `SUCCESS`;
- DC-9 + Membership semantic contracts: `SUCCESS`;
- Board static contracts: `SUCCESS`;
- production candidate build: `SUCCESS`;
- Current Program static contract: `SUCCESS`;
- production analytics + shell + built JS + OAuth: `SUCCESS`;
- Current Program browser acceptance, Home + Workspace Board 1440/390: `SUCCESS`;
- public harmonization browser matrix 1440/1024/768/390/360: `SUCCESS`;
- Projects browser regression: `SUCCESS`;
- DC-9 sync browser: `SUCCESS`;
- Board v2.1 fullscreen browser state matrix: `SUCCESS` with the existing geometry threshold unchanged;
- Board live corrective browser acceptance: `SUCCESS`;
- Board navigation/adaptive cards: `SUCCESS`;
- Board deep-link auth return: `SUCCESS`;
- Board Share on movable own card: `SUCCESS`;
- browser shell / Workspace recovery: `SUCCESS`;
- My Artifacts history: `SUCCESS`;
- WebKit auth regression: `SUCCESS`;
- production route manifest: `SUCCESS`;
- final production artifact release gate: `SUCCESS`.

Implementation evidence also proves:

- exactly three reviewed Things are projected;
- Home and Board share one projection source;
- Program Things never become Artifacts or spatial positions;
- canonical analytics click ownership is reused without duplicate events;
- legacy Home course/Fuengirola funnel blocks remain absent;
- Current Program Board overlay does not alter fullscreen viewport geometry;
- non-action Program surface does not steal Board filter/pan/drag pointer ownership.

## Exact-head G6 evidence

G6 evidence commit head:

`312ebae9279e6c5082fca76924e1123ea73a1e4d`

Site Integrity / Release Readiness:

- workflow run: `#1179` / Actions run `34999591341`;
- conclusion: `SUCCESS`;
- every workflow step through `Validate production artifact release gate`: `SUCCESS`.

This proves the exact G6 evidence head, not only the implementation candidate.

## Exact-head G7 authorization evidence

G7 authorization head:

`32530297b466cd6c4d813417950f0dd1df9b2b27`

Site Integrity / Release Readiness:

- workflow run: `#1180` / Actions run `35001511990`;
- conclusion: `SUCCESS`;
- every workflow step through `Validate production artifact release gate`: `SUCCESS`.

Documentation-only evidence head:

`a60afcb3cc8116127699dad41d14c486e11cc347`

Site Integrity / Release Readiness:

- workflow run: `#1181` / Actions run `35001881613`;
- conclusion: `SUCCESS`;
- every workflow step through `Validate production artifact release gate`: `SUCCESS`.

This proves the exact owner-authorized production-merge candidate before merge.

## G7 authorization boundary

Owner authorized production merge on 2026-09-15 after the full G6 PASS.

The exact owner-authorization head also passed the full release-readiness workflow. PR #208 may therefore be merged into `dementor-club-production` from the recorded production baseline without any blind `dementor-club-site → production` merge.

**Production deploy remains unauthorized.**

## Non-goals

No payment, Merch commerce, Membership/access redesign, Fuengirola registration opening, `НЕ КОМАНДА` stabilization, full History, Intervention resolver, Telegram automation, recommendations, broad schema migration or deploy.

## Gate plan

- **G5 BUILD — COMPLETE**
- **G6 VALIDATION — COMPLETE**
- **G7 RELEASE — production merge authorized; exact authorization head full CI PASS; deploy not authorized**
- G8 CLEANUP — after authorized release/live evidence

`commit ≠ merge ≠ deploy`

## Active ownership rule

Use this same Result and this same branch. Do not create a second Current Program implementation Result or branch.