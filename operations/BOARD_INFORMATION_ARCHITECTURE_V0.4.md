---
artifactId: dementor-club.reference.board-information-architecture-v0.4
project: dementor-club
documentType: ARCHITECTURE_WORKING_DRAFT
projectStage: CLARITY
status: DRAFT
version: 0.4
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: REFERENCE
supersedes: dementor-club.reference.board-information-architecture-v0.3
---

# Dementor Club — Board Information Architecture v0.4

**Status:** DRAFT / REFERENCE / NOT IMPLEMENTED  
**Basis:** Workshop 01 + Workshop 02 answers, current production/runtime inventory, approved `BOARD_ACCESS_AND_OWNER_ADMIN_V2`.  
**Purpose:** preserve all resolved Board semantics before Change Proposal / Decision.  
**Boundary:** Discussion ≠ Decision. This document does not modify approved authority, production code, live Supabase schema, RLS or permissions.

# 0. Frozen decisions from Workshop 01

## 0.1 Board purpose

Community Board is a **persistent spatial map of club life**: what is happening, what happened before, and what later grew out of earlier activity.

Board is intentionally hybrid, but its primary job is continuity and visible club activity. It must not become a duplicate of Events / Projects / Courses, a second CMS, a task tracker, or a general-purpose social network.

Limited social behavior is allowed: read, reactions, responses and participation-related interaction.

## 0.2 Information visible on Board

Board should support visibility for:

- Announcement / Artifact;
- short post;
- idea / proposal;
- request to community;
- Article / long-form content;
- Event;
- Course / Program;
- Practice;
- Project;
- Product / application where a real publishable canonical object exists.

Explicitly excluded:

- internal operational Task;
- Membership Application.

## 0.3 History is part of the Board

Default Board shows **all** Board-visible objects, not only live/current ones.

Past objects remain spatially present. History is visually faded rather than removed.

`expired` and `archived` remain different states:

- `expired` = time ended;
- `archived` = author/moderator deliberately closed active participation/state.

Neither means deletion from Board history.

## 0.4 Access target

| State | Open | Live | History | React | Respond | Publish | Move | Archive |
|---|---|---|---|---|---|---|---|---|
| Unauthenticated | No | — | — | — | — | No | No | No |
| Authenticated Guest | Yes | Yes | Yes | Yes | Yes | No | No | No |
| Applicant | Yes | Yes | Yes | Yes | Yes | No | No | No |
| Member | Yes | Yes | Yes | Yes | Yes | Yes | own | own |
| Dementor | Yes | Yes | Yes | Yes | Yes | Yes | own | own |
| Owner Admin | Yes | Yes | Yes | Yes | Yes | Yes | all | all |

Workshop target extends authenticated Guest and Applicant read access to **all community history** while preserving the canonical lifecycle boundary:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`.

`+ ПРИКОЛОТЬ` remains a conversion gate for Guest/Applicant, not composer access.

## 0.5 Relation presentation

Relations are created manually in the first version, not inferred automatically.

Canvas presentation:

- visible on canvas and in detail;
- meaningful relations only;
- semi-transparent lines;
- lower visual layer beneath cards;
- center/anchor-to-center/anchor geometry;
- explicit `SHOW RELATIONS / HIDE RELATIONS` toggle.

## 0.6 Card system

One shared card system. Type/source differences use label / accent / icon instead of unrelated card components.

Front of card supports:

- type/source;
- author;
- title;
- short text;
- date/deadline;
- lifecycle/status;
- reaction count;
- relation indicator;
- media/image when available.

# 1. Workshop 02 — resolved semantic decisions

## 1.1 Entity representation — HYBRID

**Decision:** `Hybrid: projection by default, Artifact wrapper only for independent authored publication`.

Rule:

```text
canonical Event / Course / Practice / Project
    → Board projection by default

independent authored announcement/post about that entity
    → separate Artifact
       → relation/link to canonical entity
```

Board therefore does not duplicate canonical entity ownership.

An Artifact wrapper is justified only when there is a genuinely independent publication with its own author/content/lifecycle, not merely to make an entity visible on Board.

## 1.2 Article / long-form content

**Decision:** Article / long-form content is treated as **external/public content referenced by an Artifact** for this architecture version.

Board owner remains the Artifact publication. The external/public article itself is not automatically copied into Board storage.

This decision does **not** establish a new canonical Content system.

## 1.3 Product / application publication

**Decision:** a real Product/Project object is canonical and is **projected to Board**.

Membership Application remains excluded.

A product does not become a Member Artifact merely because it is visible on Board.

## 1.4 Artifact subtypes

**Decision:** explicit Member Artifact subtypes are required:

- `announcement`;
- `post`;
- `idea`;
- `request`.

This is a semantic schema change relative to the current effective `artifact_type = notice` production model and requires an approved migration/compatibility plan before implementation.

## 1.5 Filters

### Source

Workshop 02 selected only:

- `ВСЁ`.

No additional source filter was explicitly approved in Workshop 02. Existing `ОТ ЛЮДЕЙ / ОТ КЛУБА` controls therefore remain **not re-approved by this workshop** and must be retained/removed only by the final Decision.

### Type

Required type filters:

- Объявления / публикации;
- События;
- Курсы / программы;
- Практики;
- Проекты / продукты;
- Статьи / контент.

### Lifecycle

**Decision:** no lifecycle control in v1. Historical fading is sufficient.

Default Board remains all-time. No `СЕЙЧАС / ИСТОРИЯ` filter is required in the first architecture target.

`ФОРМИРУЕТСЯ` must not be treated as a general Board lifecycle filter unless a later entity-specific need proves it necessary.

## 1.6 Relation vocabulary v1

Workshop 02 selected the following canonical product meanings for v1:

1. `СВЯЗАНО С`
2. `ПОЯВИЛОСЬ ИЗ / РЕЗУЛЬТАТ`
3. `ПРОДОЛЖЕНИЕ / ОБНОВЛЕНИЕ`
4. `ОТНОСИТСЯ К`
5. `УЧАСТВУЕТ В`
6. `ОТЧЁТ / ИТОГ`

Implementation identifiers are not fixed here; user-facing semantics are.

Directionality must be preserved where meaningful:

- `ПОЯВИЛОСЬ ИЗ / РЕЗУЛЬТАТ` is directional;
- `ПРОДОЛЖЕНИЕ / ОБНОВЛЕНИЕ` is directional;
- `ОТНОСИТСЯ К` is directional;
- `УЧАСТВУЕТ В` is directional;
- `ОТЧЁТ / ИТОГ` is directional;
- `СВЯЗАНО С` may be symmetric.

## 1.7 Relation permissions

**Decision:** scoped ownership.

- Member may create/manage relations originating from own Artifact, subject to target visibility/eligibility;
- entity owner / assigned Dementor may create/manage relations for their scoped entity;
- Owner Admin may manage all Board relations.

No role may mutate unrelated canonical source entities merely by managing a Board relation.

Exact edit/delete RPC/RLS mechanics remain implementation detail but must preserve this authority boundary.

## 1.8 Person ↔ Project/Event

**Decision:** `Canonical participation/assignment relation, Board only projects it`.

A person-project/event link that means real participation is not Board decoration. It must have a canonical relation owner outside the drawing layer, and Board visualizes that relation.

This must follow the existing identity boundary:

`PERSON → SYSTEM_MEMBERSHIP → ROLE/ASSIGNMENT → ENTITY`.

A Board line must never create a global role or infer membership.

## 1.9 Historical interactions

**Decision:** history supports **read + reactions**, while **new responses are frozen**.

Target behavior for expired/archived cards:

- detail remains readable;
- existing responses/counts remain visible;
- reactions remain available;
- new response submission is disabled;
- external/public links remain readable/open unless independently unavailable.

This intentionally differs from current live-only interaction assumptions and must be included in access/RPC validation.

## 1.10 Hide / cleanup

Two distinct mechanisms are required:

1. **User filter/hide** = presentation only; does not mutate canonical object/history.
2. **Owner/Admin board-hide** = removes object from the general Board surface while retaining canonical data/history.

No hard-delete behavior is approved by Workshop 02.

Board-hide must not silently delete the source entity or historical record.

## 1.11 Historical visual aging

**Decision:** continuous aging based on time.

Historical cards progressively fade as time passes.

Workshop 01 set the visual direction that past ink/text is at least approximately 20–30% lighter than current while remaining readable. The exact aging function, floor opacity, accessibility threshold and whether archived cards use the same curve remain DESIGN/implementation questions, not semantic decisions.

## 1.12 Implementation decomposition

**Decision:**

```text
Lifecycle/history + entity projections together
    → filters
        → relations
```

Card visual hierarchy/aging is validated alongside the relevant increments rather than treated as an unrelated parallel system.

# 2. Consolidated Board model

## 2.1 Four canonical layers

```text
1. SOURCE OBJECT
   Artifact | Event | Program/Course | Practice | Project/Product | external/public Content

2. BOARD PROJECTION
   spatial card + Board visibility + Board position/presentation

3. RELATION GRAPH
   explicit typed links between eligible canonical objects / participants

4. INTERACTION LAYER
   reactions / responses according to object lifecycle and user state
```

No layer should silently become the owner of another layer's semantics.

## 2.2 Member Artifact family

Member-originated Board publications use the canonical Artifact family with explicit subtypes:

```text
Artifact
├── announcement
├── post
├── idea
└── request
```

Article is not included in this subtype set under the Workshop 02 decision; an article is external/public content referenced by an Artifact.

## 2.3 Canonical entity projection family

Projected by default:

- Event;
- Course / Program;
- Practice;
- Project / Product.

If a separately authored announcement/post exists, that publication is a separate Artifact linked to the entity.

## 2.4 Board history semantics

Board is all-time by default.

Objects remain spatially discoverable after becoming expired/archived unless a distinct board-hide action is applied.

Historical status affects:

- visual aging;
- ability to submit new responses;
- status labels;
- relation context.

Historical status does not mean deletion.

# 3. Compatibility with approved Board Access v2

`BOARD_ACCESS_AND_OWNER_ADMIN_V2` remains the current approved authority until a new Decision is approved.

Workshop 01/02 introduces these explicit deltas:

1. Guest/Applicant `See live Artifacts` expands to `See all community Board history`.
2. Fullscreen Board is no longer intentionally Member-Artifact-only; canonical entity projections become part of target Board architecture.
3. Historical interaction differs from live interaction: reactions remain active; new responses freeze.
4. Board relation permissions are added as a new scoped capability family.
5. Owner/Admin board-hide is added as a new moderation capability distinct from archive/source deletion.

These are meaning changes and cannot be implemented as an unreviewed refactor.

# 4. Required Change Proposal / Decision scope

A formal Board Information Architecture Decision must approve or reject the following package:

- persistent all-time Board semantics;
- Guest/Applicant community-history read;
- hybrid entity projection model;
- explicit Artifact subtypes;
- type-filter taxonomy and no lifecycle filter in v1;
- relation vocabulary v1;
- scoped relation permissions;
- canonical participation/assignment relations;
- historical read+reaction / response-freeze behavior;
- presentation hide vs Owner/Admin board-hide;
- continuous historical aging;
- lifecycle/history + entity projections → filters → relations implementation order.

# 5. Remaining implementation questions — not semantic blockers

The two workshops now close the primary product semantics. The following remain implementation/design questions and must not be confused with new product decisions:

- exact DB enum/check/compatibility migration for Artifact subtypes;
- exact relation table/RPC/RLS shape;
- exact canonical participation table reuse vs extension after existing-schema inventory;
- exact position owner for non-Artifact projections; extend existing before creating parallel;
- exact continuous-aging function and accessibility floor;
- exact UI placement for relation toggle;
- exact UI for manual relation target picker/grouping;
- exact board-hide storage field/table after inventory;
- backfill for historical Artifact positions missing `dc_artifact_board_positions`;
- deterministic expired-state normalization mechanism;
- detailed mobile relation rendering/performance behavior.

# 6. Validation requirements for future Result

At minimum G6 must prove:

- current and historical cards coexist on one Board;
- historical cards remain readable and progressively faded;
- Guest/Applicant can read community history but cannot publish/move/archive;
- historical reactions work; historical new responses are blocked;
- Member Artifact subtypes preserve current Artifact ownership and slot rules;
- Event/Program/Practice/Project projection does not duplicate canonical source entities;
- independent Artifact wrapper can link to canonical entity without becoming its source owner;
- relation permissions enforce scoped ownership;
- Board relation cannot create global role/membership;
- Owner Admin can manage all Board relations and board-hide without deleting source data;
- filters operate by object type without lifecycle hiding by default;
- relation toggle hides/shows relation lines without affecting data;
- existing pan/zoom/focus/card positioning remains usable;
- mobile/desktop regression passes;
- no duplicate Board, relation, entity, auth or layout owner is introduced.

# 7. Release boundary

No implementation, schema migration, merge, production deploy or live Supabase mutation is authorized by this document.

Required sequence:

`v0.4 reference → Change Proposal / Decision → explicit approval → Result → implementation → G6 → clean production release candidate → explicit deploy authorization → live retest → G8 cleanup`.
