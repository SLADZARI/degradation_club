---
artifactId: dementor-club.result.current-program-projection-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
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
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | BUILD | Current Program Projection v1 | Result v0.1

## Status

**ACTIVE / G5_BUILD / IMPLEMENTATION AUTHORIZED**

Single implementation owner for the first Current Program runtime slice.

## Approval record · 2026-09-15

Owner explicitly accepted semantic stack `#196 → #205 → #207` as the implementation basis and opened G5 for this Result.

Narrow precedence:

> #207 supersedes the older #196 product-status wording for one claim: `Деньги на ветер` is **ready to take**.

This does not approve price, checkout, server/AI backend, Membership requirement, live Supabase mutation, production merge or deploy.

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
Before G6: desktop + mobile, Home render, Board hook, exact routes, blocked-claim sweep, no duplicate semantic/runtime owner, build/route integrity.

## Non-goals

No payment, Merch commerce, Membership/access redesign, Fuengirola registration opening, `НЕ КОМАНДА` stabilization, full History, Intervention resolver, Telegram automation, recommendations, broad schema migration or deploy.

## Gate plan

- **G5 BUILD — OPEN**
- G6 VALIDATION — pending implementation evidence
- G7 RELEASE — requires explicit release authorization
- G8 CLEANUP — after release/live evidence

`commit ≠ merge ≠ deploy`

## Active ownership rule

Use this same Result and this same branch. Do not create a second Current Program implementation Result or branch.
