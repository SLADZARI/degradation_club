---
artifactId: dementor-club.reference.board-information-architecture-v0.2
project: dementor-club
documentType: ARCHITECTURE_WORKING_DRAFT
projectStage: CLARITY
status: DRAFT
version: 0.2
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: REFERENCE
supersedes: dementor-club.reference.board-information-architecture-v0.1
---

# Dementor Club — Board Information Architecture v0.2

**Status:** DRAFT / REFERENCE / NOT IMPLEMENTED  
**Basis:** workshop answers 2026-09-12 + current production/runtime inventory + approved Board Access v2 baseline.  
**Boundary:** Discussion ≠ Decision. This document does not change Membership v2, Board Access v2, production runtime, live Supabase schema or permissions until separately approved.

## 0. Core product intent captured from workshop

Community Board is a **persistent spatial map of club life**: what is happening now, what happened before, and what later grew out of earlier activity.

The Board is intentionally hybrid, but its primary purpose is not a generic feed, CMS, task tracker or duplicated entity registry. It should give the impression of an active club with visible continuity and memory.

Historical activity must not disappear merely because time has passed. A past event, notice or other published object may later produce a report, video, game, project, new event or another related object. That chain must remain traceable.

The Board may have limited social behavior — view, reactions, responses — but it is not intended to become a general-purpose social network.

## 1. Non-goals

The Board must not become:

- a duplicate of canonical Events / Projects / Courses;
- a second CMS;
- a general task tracker;
- a second ownership/lifecycle system for objects that already have canonical owners;
- a general-purpose social network.

## 2. Foundational model

Working architectural rule:

```text
SOURCE OBJECT
    ↓ Board projection
BOARD CARD
    ↓ open / relation
DETAIL / CANONICAL SOURCE
```

A Board card is a presentation/projection layer. It is not automatically the canonical source entity.

This rule is compatible with the workshop intent that Events, Courses, Practices, Projects and other objects must be visible on Board while avoiding duplication of their source records.

## 3. Board scope: what can appear

### 3.1 Member-originated Board publications

Workshop confirms these should appear on Board and may be represented by the existing Member Artifact family unless a later concrete use-case proves a separate canonical entity is required:

- Announcement / notice;
- short post;
- idea / proposal;
- request to community.

Current production owner remains `dc_artifacts` until changed by an approved semantic decision.

### 3.2 Club/content/entity projections

Workshop confirms Board visibility is desired for:

- Event;
- Course / Program;
- Practice;
- Project;
- Article / long-form content;
- Application / product, where a real canonical object exists and publication is appropriate.

**Important unresolved semantic conflict:** workshop form selections marked several of these as `Member Artifact`, while the same workshop also states Board must not duplicate Events / Projects / Courses, and current architecture already has canonical entity layers for Event / Program / Project. Therefore v0.2 does **not** convert these entities into Artifacts. The required decision is whether they appear as projections of canonical entities, or whether some subset should first create a Member Artifact that links to the entity.

### 3.3 Objects excluded from Community Board

Workshop explicitly excludes:

- internal operational tasks;
- Membership Application.

These remain operational/private flows and do not become Community Board publication types.

## 4. Time model: live, expired, archived

### 4.1 Default Board view

Workshop decision:

**Default Board shows everything, without hiding historical objects by time.**

Past objects remain spatially present.

### 4.2 Visual aging

Historical cards remain visible but visually fade after they cease to be current.

Initial workshop direction:

- live/current = full contrast;
- past/expired/archive = reduced black opacity / faded presentation;
- first implementation target: historical text/ink approximately 20–30% lighter than current, while preserving readability;
- later versions may apply progressive aging, but this is not yet specified.

Exact visual tokens are DESIGN work and are not approved by this architecture draft.

### 4.3 Expired vs Archived

Workshop decision preserves distinct meaning:

- `expired` = time ended;
- `archived` = author/moderator deliberately closed/removed it from active state.

Both remain available on Board/history unless a future explicit hide/remove operation is approved.

### 4.4 Current production defect to resolve

Current production can retain `status='active'` after `expires_at < now()` while runtime independently hides the record. This creates semantic drift between stored status and visible state.

Target requirement:

`active + expires_at < now()` must resolve deterministically to the historical/expired state instead of remaining semantically active while hidden.

Implementation mechanism is not decided here.

## 5. Access model

Existing approved Board Access v2 remains baseline unless this draft is later approved as a change.

Workshop target matrix:

| State | Open Board | Live | History | React | Respond | Publish | Move | Archive |
|---|---|---|---|---|---|---|---|---|
| Unauthenticated | No | — | — | — | — | No | No | No |
| Authenticated Guest | Yes | Yes | **Yes** | Yes | Yes | No | No | No |
| Applicant | Yes | Yes | **Yes** | Yes | Yes | No | No | No |
| Member | Yes | Yes | Yes | Yes | Yes | Yes | own | own |
| Dementor | Yes | Yes | Yes | Yes | Yes | Yes | own | own |
| Owner Admin | Yes | Yes | Yes | Yes | Yes | Yes | all | all |

### 5.1 Required access change

Workshop explicitly extends authenticated Guest and Applicant read access from live-only history behavior to **all community history**.

This is a semantic permission change relative to current runtime and must be approved before implementation.

### 5.2 Membership boundary remains unchanged

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

Guests may read/react/respond according to approved Board policy but may not publish, move or archive cards. `+ ПРИКОЛОТЬ` remains a conversion gate to DC-9/application, not composer access.

## 6. Filter architecture

Workshop intent is to avoid mixing different dimensions into one flat set.

The architecture should separate at least three independent dimensions:

### 6.1 Source dimension

Current confirmed choice:

- `ВСЁ` as default.

Existing source candidates remain:

- `ОТ ЛЮДЕЙ`;
- `ОТ КЛУБА`.

Whether both stay visible as first-level controls is not yet explicitly decided by the workshop.

### 6.2 Object-type dimension

Workshop says effectively “all” but does not finalize taxonomy.

Candidate types requiring final semantic classification:

- Announcement / Member Artifact;
- Event;
- Course / Program;
- Practice;
- Project;
- Article / Content;
- Application / Product, if canonical and publishable.

`Task` and `Membership Application` are excluded.

### 6.3 Lifecycle dimension

Not finalized.

Because workshop default is “show everything”, lifecycle may be represented as optional filters such as:

- Current;
- Historical;
- Forming / planned, if this is truly a lifecycle/status and not an object-specific state.

The existing `ФОРМИРУЕТСЯ` filter requires semantic review before retention.

## 7. Relation model

### 7.1 Product intent

The Board should make the evolution of club activity traceable.

Canonical example from workshop:

```text
call / meeting
   → decision / idea
      → project
         → later call
            → project update
               → report / video / game / event
```

For ordinary users, the visible meaning should be simple: “we talked → something appeared / changed”. Internal operating detail may remain private.

Relations may also connect:

- an Event to resulting Project(s);
- a Project to subsequent Event(s);
- a Member/Dementor to a Project where participation is explicit;
- a published Artifact to another Artifact;
- a Board publication to Event / Program / Project / Content object;
- a report/video/result back to the activity that produced it.

### 7.2 Relation creation

Workshop decision for first versions:

**Relations are created manually, not inferred automatically.**

Creation UX direction:

1. create/open publication;
2. choose a relation group/category;
3. choose the target from existing Board/canonical objects;
4. save relation.

Automation may be introduced only after real usage validates relation semantics.

### 7.3 Relation presentation

Workshop decision:

- relations visible both on canvas and in detail;
- canvas lines only for meaningful relations;
- relation lines render on a lower layer beneath cards;
- attach visually from card center/anchor to related card center/anchor;
- lines are semi-transparent to reduce visual noise;
- dedicated toggle: **show relations / hide relations**.

Exact geometry and visual style remain DESIGN work.

### 7.4 Data model requirement

Current schema has no canonical Artifact↔Artifact relation owner. Existing `promoted_entity_id/type` must not be reused as a universal relation field without an approved meaning change.

A new explicit relation model is likely required if this direction is approved.

## 8. Card information hierarchy

Workshop confirms the front of a card should be able to expose:

- type / source;
- author;
- title;
- short text;
- date / deadline;
- lifecycle/status;
- reaction count;
- relation indicator;
- image/media where available.

Visual system decision:

**One shared card system with differences through label / accent / icon**, rather than unrelated card components per type.

Exact density and which fields collapse into detail on smaller cards/mobile remain unresolved design work.

## 9. First implementation scope requested by workshop

All of the following were marked as priorities:

1. normalize expired lifecycle;
2. keep archive/history visible on Board;
3. harmonize filters;
4. extend Guest history read access;
5. add Artifact/object relations;
6. enable Club entity projections;
7. harmonize card visual hierarchy.

This is too broad for one safe implementation batch without decomposition. One Result may own the coherent Board architecture program, but implementation should be split into validated increments/gates rather than a single uncontrolled mutation.

## 10. Change-control assessment

This workshop introduces meaning changes, not merely refactoring.

At minimum the following require explicit Change Proposal / Decision before implementation:

- Board changes from live-only surface to persistent activity-history surface;
- Guest/Applicant read-access extends to historical community content;
- canonical relation model between Board objects/entities;
- entity projection policy for Event / Program / Practice / Project / Content/Product;
- lifecycle semantics and expired normalization if stored state behavior changes.

Pure visual fading, filter UI arrangement, or card presentation can be implementation/design work only after the semantic decisions above are approved.

## 11. Unresolved decisions — must not be invented

Before this draft can become approved authority, resolve:

1. **Event/Course/Practice/Project ownership on Board:** projection of canonical entity vs linked Member Artifact wrapper.
2. **Article/content canonical owner:** no approved production owner identified in this workshop.
3. **Application/product canonical owner and publication rule:** candidate only.
4. **Artifact subtypes:** one Artifact/Notice vs explicit subtypes is still undecided.
5. **Final object-type filter taxonomy:** workshop selected “all”, not a canonical list.
6. **Lifecycle filter taxonomy:** not decided.
7. **Relation type vocabulary:** intent is clear, exact canonical names are not.
8. **Who may create/edit relations:** workshop says “we manually connect”, but exact role matrix is not fixed.
9. **Participation relations:** relation between Member/Dementor and Project/Event needs separate ownership/permission rule; do not infer global role assignment.
10. **Historical reactions/responses:** history is readable, but whether reactions/responses remain active on historical cards was not explicitly distinguished from current baseline.
11. **Permanent hiding/removal:** workshop wants history retained, but future owner/admin mechanism to hide obsolete/noise cards is only mentioned as a future possibility.
12. **Progressive visual aging:** concept mentioned, formula/timing not defined.

## 12. Recommended decision sequence

Before implementation:

1. approve Board purpose + persistence/history rule;
2. resolve source object vs projection policy;
3. approve history access matrix;
4. define minimal relation vocabulary + relation permissions;
5. define filter taxonomy from those decisions;
6. approve lifecycle normalization rule;
7. define Result with acceptance criteria;
8. implement in increments with G6 validation;
9. release from current production baseline with only required diff;
10. deploy/live DB mutation only after explicit authorization;
11. live retest Guest / Applicant / Member / Dementor / Owner Admin;
12. G8 cleanup.

## 13. Current authority relationship

This v0.2 remains **REFERENCE/DRAFT** and does not supersede:

- `operations/BOARD_ACCESS_AND_OWNER_ADMIN_V2.md` (APPROVED local Board access authority);
- Membership v2 lifecycle authority;
- current canonical entity owners.

It is the working semantic input for a future Board Information Architecture Decision / Change Proposal.
