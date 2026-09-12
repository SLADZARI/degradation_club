---
artifactId: dementor-club.reference.board-information-architecture-v0.3
project: dementor-club
documentType: ARCHITECTURE_WORKING_DRAFT
projectStage: CLARITY
status: DRAFT
version: 0.3
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: REFERENCE
supersedes: dementor-club.reference.board-information-architecture-v0.2
---

# Dementor Club — Board Information Architecture v0.3

**Status:** DRAFT / REFERENCE / NOT IMPLEMENTED  
**Basis:** workshop answers 2026-09-12 + current production/runtime inventory + approved Board Access v2 baseline.  
**Purpose of v0.3:** freeze everything already answered so later clarification work cannot silently erase or reinterpret it.  
**Boundary:** Discussion ≠ Decision. This document records agreed workshop direction but does not change approved authority, production runtime, live Supabase schema or permissions until a separate Change Proposal / Decision is approved.

# 0. Frozen workshop decisions — do not reopen without explicit reason

## 0.1 Board purpose

Community Board is a **persistent spatial map of club life**: what is happening now, what happened before, and what later grew out of earlier activity.

The Board is intentionally hybrid, but its main job is to show club activity and continuity rather than act as a generic feed, CMS, task tracker, duplicated registry or general-purpose social network.

Past activity is part of the club's visible memory and must not disappear simply because time passed. Earlier activity can later produce a report, video, game, project, event or other object, so historical objects must remain traceable.

## 0.2 Non-goals

The Board must not become:

- a duplicate of canonical Events / Projects / Courses;
- a second CMS;
- a task tracker;
- a second ownership/lifecycle system for existing canonical objects;
- a full general-purpose social network.

Limited social behavior is allowed: viewing, reactions, responses and related participation flows.

## 0.3 Information that should appear on Board

Workshop direction confirms Board visibility for:

- Announcement / Artifact;
- short post;
- idea / proposal;
- request to community;
- Article / long-form content;
- Event;
- Course / Program;
- Practice;
- Project;
- Application / product where a real publishable canonical object exists.

Explicitly excluded from Community Board:

- internal operational Task;
- Membership Application.

The canonical ownership of several Board-visible object families remains unresolved and is listed later. The fact that an object is visible on Board does **not** itself make it a Member Artifact.

## 0.4 Time and history

**Default Board view shows everything, not only current/live objects.**

Historical cards remain on the spatial Board.

Historical visual treatment:

- current/live card = full contrast;
- past/expired/archived card = visually faded;
- initial direction: black/text/ink becomes approximately 20–30% lighter than current while remaining readable;
- progressive aging may be explored later but no formula is approved yet.

`expired` and `archived` keep different meanings:

- `expired` = time ended;
- `archived` = author/moderator deliberately closed the object from active state.

Neither state means the object disappears from Board history.

## 0.5 Access target captured from workshop

| State | Open Board | Live | History | React | Respond | Publish | Move | Archive |
|---|---|---|---|---|---|---|---|---|
| Unauthenticated | No | — | — | — | — | No | No | No |
| Authenticated Guest | Yes | Yes | Yes | Yes | Yes | No | No | No |
| Applicant | Yes | Yes | Yes | Yes | Yes | No | No | No |
| Member | Yes | Yes | Yes | Yes | Yes | Yes | own | own |
| Dementor | Yes | Yes | Yes | Yes | Yes | Yes | own | own |
| Owner Admin | Yes | Yes | Yes | Yes | Yes | Yes | all | all |

Explicit workshop change target:

- Authenticated Guest sees all community history;
- Applicant sees all community history;
- Guest/Applicant still cannot publish, move or archive;
- Membership lifecycle boundary remains `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`;
- `+ ПРИКОЛОТЬ` for Guest remains a conversion gate, not composer access.

Historical reaction/response behavior is not separately finalized yet and is listed as unresolved.

## 0.6 Relations: product intent and presentation

Board relations should make the evolution of club activity traceable.

Typical chain:

```text
call / meeting
  → decision / idea
    → project
      → later call
        → project update
          → report / video / game / event
```

For ordinary users, the visible meaning stays simple: **something happened / was discussed → something appeared or changed**.

Internal operational detail may remain private.

First-version relation creation is **manual**, not inferred automatically.

Working creation flow:

1. create/open publication or object;
2. choose relation group/category;
3. choose the target from existing Board/canonical objects;
4. save relation.

Relation UI direction is frozen:

- relations visible both on canvas and in detail;
- canvas lines only for meaningful relations;
- lines render in a lower layer beneath cards;
- line attaches from card center/anchor to related card center/anchor;
- lines are semi-transparent;
- dedicated toggle: `SHOW RELATIONS / HIDE RELATIONS`.

Exact canonical relation vocabulary and permissions remain unresolved.

## 0.7 Card information hierarchy

Front of Board card should support:

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

**one shared card system with variation through label / accent / icon**, not unrelated components per source type.

## 0.8 First implementation program priorities

Workshop marked all of these as required work areas:

1. normalize expired lifecycle;
2. keep archive/history visible on Board;
3. harmonize filters;
4. extend Guest history read access;
5. add Artifact/object relations;
6. enable Club entity projections;
7. harmonize card visual hierarchy.

They must be decomposed into safe validated increments rather than implemented as one uncontrolled mutation.

# 1. Current production facts that constrain the design

## 1.1 Current Member publication owner

Current DB owner: `public.dc_artifacts`.

Current production `artifact_type` is effectively `notice`; no approved production subtype system for post/article/task/application/course currently exists.

## 1.2 Current lifecycle mismatch

Current runtime can leave a record with:

`status = active` + `expires_at < now()`

while filtering it out visually.

Target requirement already captured by workshop:

`active + expires_at < now()` must resolve deterministically to historical/expired semantics rather than remain semantically active but invisible.

Implementation mechanism remains open.

## 1.3 Current entity layer

Canonical entity layers already exist for Event / Program / Project and the Board code already contains entity-projection concepts, but current fullscreen Workspace Board intentionally does not render these projections.

This is why the Board ownership decision below matters: Board must not duplicate canonical entities.

## 1.4 Current relation gap

No canonical Artifact↔Artifact relation owner currently exists.

Existing `promoted_entity_id/type` must not be repurposed as a universal relation field without an explicit meaning change.

# 2. Unresolved decisions — second workshop scope

Only the questions below remain open. They must not be silently invented during implementation.

## Q1. Canonical Board representation for Event / Course / Practice / Project

Need to choose between:

- **Projection model:** canonical entity exists once; Board renders its projection/card;
- **Artifact wrapper model:** a separate publication Artifact announces/references the canonical entity;
- **Hybrid rule:** projection by default, wrapper only when a separate authored publication has independent meaning.

This is the most important unresolved ownership decision.

## Q2. Article / long-form content owner

Need to decide whether Article is:

- a Member Artifact subtype;
- a dedicated Content object projected to Board;
- external/public content referenced by an Artifact;
- another existing canonical content owner if found during implementation inventory.

Do not create a new content system unless existing inventory proves it is necessary.

## Q3. Application / product publication rule

Need to distinguish:

- product/application as a canonical club object;
- a publication announcing it;
- external application/tool linked from Board.

Membership Application remains explicitly excluded.

## Q4. Artifact subtype policy

Need to decide whether Member-created publication stays one canonical `Artifact / Notice` with labels/relations, or gets explicit subtypes such as:

- announcement;
- short post;
- idea;
- request.

Prefer no new subtype unless behavior/permissions/lifecycle actually differ.

## Q5. Final filter taxonomy

Three dimensions must not be mixed:

1. **Source** — e.g. `ВСЁ / ОТ ЛЮДЕЙ / ОТ КЛУБА`;
2. **Object type** — Announcement / Event / Course / Practice / Project / Article / Product;
3. **Lifecycle/time** — current / historical / possibly forming/planned.

Need to decide exact visible controls and whether `ФОРМИРУЕТСЯ` belongs here at all.

## Q6. Canonical relation vocabulary

Need the minimum relation types for v1. Candidate meanings include:

- related to;
- created from / resulted from;
- continuation/update of;
- belongs to / about;
- participant/member relation to Project/Event;
- report/result of.

Do not over-model before real usage.

## Q7. Relation permissions

Need exact rights for:

- Member;
- Dementor;
- Owner Admin;
- possibly author/owner of each endpoint.

Need to distinguish creating, editing and deleting a relation.

## Q8. Person ↔ Project/Event relation boundary

Workshop wants manual ability to connect Dementors/participants to projects and events.

Need to decide whether this is:

- only a Board-visible relation/projection;
- a real canonical entity assignment/participation relation that Board merely displays.

Must not infer global role assignment from Board links.

## Q9. Historical interactions

History is readable, but need to decide whether a past card remains interactive:

- reactions allowed or frozen;
- responses allowed or frozen;
- external links/details still open;
- existing counts/history always visible.

## Q10. Hide / cleanup mechanism

Workshop wants history retained, but future noise control may be needed.

Need to distinguish:

- normal expired/archived history — stays visible;
- user filter/hide — presentation only;
- admin moderation hide — removed from general Board but retained in data;
- hard removal — exceptional/security/legal only, if needed.

## Q11. Historical visual aging

Base decision is already fixed: history fades.

Still need only the implementation policy:

- one fixed historical opacity;
- two levels (recent past / old history);
- continuous aging over time.

Avoid complexity unless visual testing proves it useful.

## Q12. Implementation decomposition

Need to decide implementation order/batches after semantics are resolved.

Likely independent increments:

- lifecycle normalization + historical read;
- history rendering + Guest access;
- filters;
- entity projections;
- relation model + relation UI;
- final card hierarchy / visual aging.

This sequencing is not yet an approved Result plan.

# 3. Change-control status

The captured workshop direction contains semantic changes and requires an explicit Change Proposal / Decision before implementation, especially for:

- persistent-history Board semantics;
- Guest/Applicant historical read access;
- relation data model;
- entity projection policy;
- lifecycle normalization semantics.

This v0.3 remains a **REFERENCE working specification**. It preserves workshop intent and narrows the remaining decisions without promoting them to approved project authority.
