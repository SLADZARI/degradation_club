---
artifactId: dementor-club.change-proposal.board-information-architecture-v1
project: dementor-club
documentType: CHANGE_PROPOSAL
projectStage: CLARITY
status: DRAFT
version: 1.0
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: REFERENCE
basis: operations/BOARD_INFORMATION_ARCHITECTURE_V0.4.md
---

# Dementor Club — Board Information Architecture Change Proposal v1

**Status:** DRAFT / NOT APPROVED / NOT IMPLEMENTED  
**Purpose:** request explicit approval for semantic Board changes consolidated in `BOARD_INFORMATION_ARCHITECTURE_V0.4.md`.  
**Existing authority affected:** `operations/BOARD_ACCESS_AND_OWNER_ADMIN_V2.md` only within the Board scopes listed below. Membership v2 lifecycle is not changed.

## 1. Why a Change Proposal is required

The proposed work changes product meaning, permissions and architecture boundaries rather than only refactoring code.

Current approved Board Access v2 defines a live Member-Artifact notice surface for Guest/Member participation and explicitly keeps official Event/Program/Project projections out of fullscreen Board.

Workshop 01 + 02 now define a broader target: persistent all-time club-memory Board, canonical entity projections, explicit relation graph, historical interaction rules and new moderation semantics.

These changes require approval before implementation.

## 2. Proposed semantic changes

### CP-1 — Persistent Board memory

Change Board from a live-only visibility model to an all-time spatial club-memory surface.

Expired and archived objects remain visible by default, with continuous visual aging.

### CP-2 — Guest/Applicant historical read

Authenticated Guest and Applicant gain read access to all community Board history.

They still cannot publish, move or archive.

Membership lifecycle remains unchanged:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`.

### CP-3 — Hybrid canonical entity representation

Event / Course / Practice / Project/Product appear as projections of their canonical entities by default.

A separate Artifact may coexist only when there is an independent authored publication/announcement with its own content and lifecycle.

Board must not duplicate entity ownership.

### CP-4 — Explicit Artifact subtypes

Member Artifact family gains semantic subtypes:

- announcement;
- post;
- idea;
- request.

Current Artifact ownership/slot semantics remain unless separately changed.

### CP-5 — Filter taxonomy

Board v1 target uses object-type filters:

- Объявления / публикации;
- События;
- Курсы / программы;
- Практики;
- Проекты / продукты;
- Статьи / контент.

No lifecycle filter is required in v1; historical fading carries time state.

Workshop 02 explicitly selected `ВСЁ` for source filtering. Existing `ОТ ЛЮДЕЙ / ОТ КЛУБА` controls are not made canonical by this proposal unless retained during final Decision review.

### CP-6 — Relation graph v1

Approve a canonical typed relation layer with the following product meanings:

- СВЯЗАНО С;
- ПОЯВИЛОСЬ ИЗ / РЕЗУЛЬТАТ;
- ПРОДОЛЖЕНИЕ / ОБНОВЛЕНИЕ;
- ОТНОСИТСЯ К;
- УЧАСТВУЕТ В;
- ОТЧЁТ / ИТОГ.

First version relations are created manually, not inferred automatically.

### CP-7 — Relation permissions

Scoped ownership:

- Member manages relations originating from own Artifact;
- entity owner/assigned Dementor manages relations for their scoped entity;
- Owner Admin manages all relations.

Relation management must not mutate unrelated canonical entity semantics.

### CP-8 — Canonical participation boundary

`Person ↔ Project/Event` participation is a canonical assignment/participation relation, not Board decoration.

Board only projects it.

A relation line never creates global role or membership.

### CP-9 — Historical interaction

Historical cards remain readable and reactable.

New responses are frozen on expired/archived cards while existing response/reaction history remains visible.

### CP-10 — Hide / cleanup

Distinguish:

- user hide/filter = presentation only;
- Owner/Admin board-hide = remove from general Board presentation while retaining canonical object/history.

Hard deletion is not approved by this proposal.

### CP-11 — Visual aging

Historical cards age continuously over time. Exact formula/accessibility floor remains implementation/design work.

## 3. Explicit non-changes

This proposal does **not** change:

- DC-9 completion semantics;
- Application lifecycle;
- Membership review or activation semantics;
- first Artifact activation rule unless separately proposed;
- public Header/Footer ownership;
- canonical Event/Program/Project source ownership;
- global person/role model;
- production deploy authorization.

## 4. Compatibility / supersession boundary

If approved, this Decision would supersede only conflicting Board statements in `BOARD_ACCESS_AND_OWNER_ADMIN_V2`, specifically:

- live-only Guest visibility;
- fullscreen Member-Artifact-only content boundary;
- absence of historical interaction policy;
- absence of relation and board-hide capabilities.

All unaffected Board Access v2 rules remain valid, including Guest no-publish/no-move/no-archive and Owner Admin moderation authority.

## 5. Proposed implementation sequence after approval

```text
Batch A — lifecycle/history + canonical entity projections
Batch B — filter harmonization
Batch C — relation data model + permissions + canvas/detail UI
Batch D — cleanup, visual aging tuning, regression hardening
```

Each batch requires its own acceptance evidence inside one coherent Board Result or clearly separated Results if scope/risk requires it.

## 6. Approval gate

No implementation is authorized by this draft.

To approve, project owners must explicitly confirm that the CP-1…CP-11 semantic package is accepted, or identify exceptions/amendments.

After approval:

1. convert this proposal into an APPROVED local Decision;
2. update authority pointers/index;
3. create a dedicated Board Result and one active integration branch;
4. inventory existing schema/runtime owners before any new table/state;
5. implement and validate G6;
6. release from current production baseline using only required diff;
7. deploy/live DB migration only after separate explicit authorization;
8. live retest all Board user states;
9. G8 cleanup.
