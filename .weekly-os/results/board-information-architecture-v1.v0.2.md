---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G2_INVENTORY
status: ACTIVE
version: 0.2
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
integrationBranch: agent/board-information-architecture-v1
productionBaseCommit: fe7a86a024f1c316c93b800ba66e70933082e927
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | BUILD | Board Information Architecture v1 | Result v0.2

## Goal
Implement the approved `operations/BOARD_INFORMATION_ARCHITECTURE_V1.md` as one coherent Community Board program without creating duplicate Board/entity/history/relation owners.

## Status
**ACTIVE / G2 INVENTORY**

Activated by explicit project-owner reprioritization on 2026-09-12.

Active integration branch:

`agent/board-information-architecture-v1`

Branch baseline:

`dementor-club-production@fe7a86a024f1c316c93b800ba66e70933082e927`

The prior active Result `dementor-club.result.public-site-visual-tech-debt-cleanup-v1` is now WAITING; its Pass 02 work is preserved and must not continue in parallel.

## Approved authority
Primary semantic authority:
- `operations/BOARD_INFORMATION_ARCHITECTURE_V1.md` — APPROVED project-local source of truth.

Compatible retained authority:
- `operations/BOARD_ACCESS_AND_OWNER_ADMIN_V2.md`, except explicitly superseded Board visibility/content-boundary semantics;
- Membership v2 lifecycle;
- canonical Event / Program / Project owners;
- Workspace shell/auth identity ownership.

## Current gate
**G2 INVENTORY**

No implementation mutation starts until the current production runtime/schema owners are re-inventoried against the branch baseline.

Required inventory:
1. `dc_artifacts` lifecycle and Artifact subtype shape;
2. Guest/member Artifact read/detail/reaction/response owners;
3. Board spatial-position ownership and historical-position coverage;
4. canonical Event / Program / Project entity owners and current Board projection code;
5. existing filters and fullscreen projection exclusions;
6. relation-equivalent tables/fields/RPCs before adding any new relation owner;
7. existing person↔entity participation/assignment equivalents;
8. RLS/RPC write boundaries for Guest / Applicant / Member / Dementor / Owner Admin;
9. archived/expired/live production data counts and stale `active + expires_at < now()` records;
10. mobile/desktop Board runtime ownership and canonical Header/Workspace shell boundary.

## Planned implementation sequence
`Batch A — lifecycle/history + canonical entity projections`
→ `Batch B — filter harmonization + Artifact subtypes`
→ `Batch C — relation model + permissions + canvas/detail UI`
→ `Batch D — board-hide + continuous aging + regression hardening`

Each batch requires targeted G6 evidence before the next batch can conceal or compound regressions.

## Hard boundaries
- no second Board;
- no duplicate Event/Project/Course owner;
- no second archive/history entity;
- no `promoted_entity_id/type` repurposing as universal relations;
- no membership/role inference from Board links;
- no generic CMS;
- no Board task or Membership Application publication type;
- no production deploy or live Supabase mutation without separate explicit authorization.

## Acceptance Criteria
The full acceptance criteria remain those prepared in Result v0.1, including lifecycle/history, Guest/Applicant history access, canonical entity projections, Artifact subtypes, relation graph, scoped permissions, stable spatial layout, desktop/mobile regression and sequential role-state browser validation.

## Authorization state
- implementation inventory/start: **authorized on active integration branch**;
- production merge: **false**;
- production deploy: **false**;
- live database mutation: **false**.

`Commit ≠ merge ≠ deploy.`
