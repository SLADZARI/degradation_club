---
artifactId: dementor-club.decision.board-information-architecture-v1
project: dementor-club
documentType: ARCHITECTURE_DECISION
projectStage: CLARITY
status: APPROVED
version: 1.0
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: APPROVED_AUTHORITY
basis:
  - operations/BOARD_INFORMATION_ARCHITECTURE_V0.4.md
  - operations/BOARD_INFORMATION_ARCHITECTURE_CHANGE_PROPOSAL_V1.md
supersedesScope:
  - conflicting Board visibility/content-boundary statements in operations/BOARD_ACCESS_AND_OWNER_ADMIN_V2.md
---

# Dementor Club — Board Information Architecture v1

**STATUS: APPROVED / PROJECT-LOCAL SOURCE OF TRUTH**  
**VERSION: 1.0**  
**DATE: 2026-09-12**  
**SCOPE:** Community Board information architecture, persistent history, entity projections, Artifact subtypes, relation graph, historical interaction, Board hide semantics and related Board filters.  
**IMPLEMENTATION:** NOT YET AUTHORIZED. A dedicated Result and integration branch are required before code/schema work.

## 1. Board purpose

Community Board is the **persistent spatial map of club life**: what is happening now, what happened before, and what later grew out of earlier activity.

Board is intentionally hybrid but must not become:

- a duplicate of canonical Events / Projects / Courses;
- a second CMS;
- a task tracker;
- a second ownership/lifecycle system for canonical objects;
- a general-purpose social network.

Limited social behavior is part of the Board: viewing, reactions, responses and visible participation/context links.

## 2. Persistent history

Default Board shows current and historical Community objects together.

Historical activity does not disappear merely because time passed. Earlier objects remain traceable because they may later produce reports, videos, games, projects, events or other related objects.

Lifecycle meanings remain distinct:

- `active` = current;
- `expired` = time ended;
- `archived` = author/moderator deliberately closed the object from active state;
- `removed` remains a separate exceptional lifecycle state and is not redefined here.

`expired` and `archived` do not mean invisible history.

Stored lifecycle must not remain semantically `active` after `expires_at < now()`. Implementation must normalize this deterministically.

## 3. Historical presentation

Current cards use full visual contrast.

Historical cards remain spatially present and age continuously over time. Exact aging formula, accessibility floor and visual tokens are implementation/design details, but history must remain readable.

No lifecycle filter is required in v1. Historical fading carries the time signal by default.

## 4. Access model

This Decision extends Board Access v2 only where explicitly stated.

| State | Open Board | Live | History | React | Respond | Publish | Move | Archive |
|---|---|---|---|---|---|---|---|---|
| Unauthenticated | No | — | — | — | — | No | No | No |
| Authenticated Guest | Yes | Yes | Yes | Yes | live only | No | No | No |
| Applicant | Yes | Yes | Yes | Yes | live only | No | No | No |
| Member | Yes | Yes | Yes | Yes | live only for historical targets | Yes | own | own |
| Dementor | Yes | Yes | Yes | Yes | live only for historical targets | Yes | own | own |
| Owner Admin | Yes | Yes | Yes | Yes | live only for historical targets | Yes | all | all |

Historical cards are readable and reactable. **New responses are frozen on expired/archived cards**; existing response/reaction history remains visible.

Guest/Applicant historical read does not imply membership.

The membership lifecycle remains unchanged:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

`+ ПРИКОЛОТЬ / + СОЗДАТЬ` for Guest remains a conversion gate, not composer access.

## 5. Board representation model

Canonical rule:

```text
SOURCE OBJECT
    ↓ Board projection
BOARD CARD
    ↓ open / relation
DETAIL / CANONICAL SOURCE
```

### 5.1 Canonical entities

Event / Course / Practice / Project / Product appear as **projections of canonical source objects by default**.

A separate Artifact may coexist only when there is an independent authored publication/announcement with its own content and lifecycle.

Board must never become a duplicate owner of Event / Program / Project / Product semantics.

### 5.2 Product/application publication

A real Product/Project is represented by its canonical object projected to Board.

Membership Application is explicitly excluded from Community Board.

### 5.3 Article / long-form content

For v1, long-form/public content is treated as external/public content referenced by an Artifact unless a separately approved canonical Content owner is established later.

No new CMS/content subsystem is authorized by this Decision.

## 6. Member Artifact family

Member-created Board publication receives explicit semantic subtypes:

- `announcement`;
- `post`;
- `idea`;
- `request`.

These subtypes classify publication meaning. They do not by themselves change membership, slot, authoring or moderation permissions.

Tasks and Membership Applications are not Artifact subtypes for Community Board.

## 7. Filters

Default source view is `ВСЁ`.

Canonical visible object-type filter set for v1:

- Объявления / публикации;
- События;
- Курсы / программы;
- Практики;
- Проекты / продукты;
- Статьи / контент.

Source and object type are separate dimensions.

Existing `ОТ ЛЮДЕЙ / ОТ КЛУБА` controls are not required as canonical v1 controls by this Decision. They may be retained only if implementation inventory proves they remain useful without duplicating object-type semantics.

No lifecycle filter is required for v1.

`ФОРМИРУЕТСЯ` must not remain as an ambiguous global Board filter unless a later approved decision defines it as a canonical cross-object lifecycle state.

## 8. Relation graph v1

Board has a canonical typed relation layer. First version relations are created manually, not inferred automatically.

Approved relation meanings:

- `RELATED_TO` — СВЯЗАНО С;
- `RESULT_OF` — ПОЯВИЛОСЬ ИЗ / РЕЗУЛЬТАТ;
- `CONTINUES` — ПРОДОЛЖЕНИЕ / ОБНОВЛЕНИЕ;
- `ABOUT` — ОТНОСИТСЯ К;
- `PARTICIPATES_IN` — УЧАСТВУЕТ В;
- `REPORT_OF` — ОТЧЁТ / ИТОГ.

Implementation may choose stable technical identifiers, but user-facing meanings above are canonical.

Existing `promoted_entity_id/type` must not be repurposed as a universal relation owner.

## 9. Relation permissions

Scoped ownership applies:

- Member may create/edit/delete relations originating from own Artifact, subject to target validity;
- canonical entity owner / assigned Dementor may manage relations originating from their scoped entity;
- Owner Admin may manage all Board relations.

Relation operations must not mutate unrelated canonical entity meaning, membership, role or source ownership.

## 10. Person ↔ Project/Event participation

Person/Dementor ↔ Project/Event participation is a **canonical assignment/participation relation**, not decorative Board-only metadata.

Board projects this relation.

A Board relation line never creates a global role, membership, ownership or permission by itself.

## 11. Relation presentation

Relations are visible both:

- on spatial canvas;
- in object/card detail.

Canvas rules:

- only meaningful relations produce visible lines;
- relation layer renders beneath cards;
- lines attach between stable card anchors/centers;
- lines are semi-transparent to avoid visual noise;
- Board provides a `SHOW RELATIONS / HIDE RELATIONS` toggle.

Exact geometry is design/implementation work.

## 12. Hide / cleanup semantics

Two distinct hide mechanisms are approved:

1. **User hide/filter** — presentation-only; does not mutate canonical object/history.
2. **Owner/Admin board-hide** — removes an object from general Board presentation while retaining canonical object/history and auditability.

Hard deletion is not authorized by this Decision.

## 13. Card information hierarchy

One canonical card system is used across Board projections, with differences through label / accent / icon rather than parallel card components.

Card surface can expose:

- type / source;
- author;
- title;
- short text;
- date / deadline;
- lifecycle/status;
- reaction count;
- relation indicator;
- image/media when available.

Responsive density and exact field collapse belong to implementation/design validation.

## 14. Implementation sequence

Approved semantic sequence for implementation planning:

```text
Batch A — lifecycle/history + canonical entity projections
Batch B — filter harmonization
Batch C — relation model + permissions + canvas/detail UI
Batch D — cleanup / board-hide / continuous-aging tuning / regression hardening
```

This sequence is a planning constraint, not permission to mutate production.

## 15. Supersession and compatibility

This Decision supersedes only conflicting Board statements in `BOARD_ACCESS_AND_OWNER_ADMIN_V2`, specifically:

- live-only Guest visibility;
- fullscreen Member-Artifact-only content boundary;
- absence of historical interaction policy;
- absence of relation and board-hide capabilities.

All unaffected Board Access v2 rules remain valid, including:

- Guest cannot publish/move/archive;
- ordinary Member controls own Artifact only;
- Dementor role alone does not grant global moderation;
- Owner Admin retains global Board moderation authority;
- UI visibility is not authorization;
- writes must be enforced by canonical RPC/RLS paths.

Membership v2 lifecycle remains unchanged.

## 16. Non-goals / explicit exclusions

This Decision does not approve:

- a new general CMS;
- a task system on Board;
- automatic relation inference;
- hard deletion flow;
- synthetic membership or role assignment from Board links;
- new canonical Product/Content ownership systems beyond existing owners;
- production deployment;
- live database mutation.

## 17. Required next gate

Before implementation:

1. create a dedicated Board Result with Goal / Status / Branch / Acceptance Criteria / affected domain / evidence / Gate;
2. use one active integration branch for that Result;
3. inventory existing schema/runtime owners before creating any new table/state;
4. validate Guest / Applicant / Member / Dementor / Owner Admin states;
5. validate desktop/mobile spatial behavior, history, filters, entity projections and relations;
6. validate RPC/RLS authorization boundaries;
7. release from current production baseline using only required diff;
8. deploy/live DB migration only after separate explicit user authorization;
9. live retest after release;
10. complete G8 cleanup.

**Approval record:** project owner explicitly approved the final Board Information Architecture package on 2026-09-12 after Workshop 01 and Workshop 02 review.
