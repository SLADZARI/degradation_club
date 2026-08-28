# Dementor Club — Entity Ontology v0.1

Date: 2026-08-28
Status: APPROVED ARCHITECTURAL BASELINE
Branch: `dementor-club`

## 0. Purpose

This document defines the canonical entity ontology of Dementor Club and separates three layers that must not be conflated:

1. **ECOSYSTEM DIRECTIONS** — public navigation / cultural framing;
2. **DOMAIN ENTITIES** — addressable data/product objects;
3. **RELATIONS & DELIVERY** — how people and entities are connected and how programs are delivered.

The public site may present the ecosystem more simply than the internal data model.

Key rule:

> **Merch / Community / Events / Projects are public ecosystem directions. They are not four database entity types.**

---

## 1. Ecosystem directions

Canonical public directions:

```text
MERCH
COMMUNITY
EVENTS / OFFLINE
PROJECTS
```

These are navigation and cultural domains.

### MERCH
Public domain for physical artifacts and releases.

Contains or exposes concrete entities such as:
- Product;
- Object;
- Drop / Release;
- Order.

### COMMUNITY
Public domain for people, club participation and activity.

Contains or exposes:
- Person;
- Membership;
- Role assignments;
- Dementor profiles;
- participation relations.

`COMMUNITY` itself is not a Person or Membership entity.

### EVENTS / OFFLINE
Public domain for club activity in time/place.

Canonical entity is `EVENT`.

`offline` is a delivery/context attribute, not a standalone entity type.

### PROJECTS
Public domain for standalone editorial/product worlds inside the club.

Canonical entity is `PROJECT`.

A project may have its own content, people relations, programs, events and archive, but these are not required.

---

## 2. Canonical domain entities

### Identity / people

```text
PERSON / PROFILE
SYSTEM_MEMBERSHIP
ROLE_ASSIGNMENT
ENTITY_ASSIGNMENT
```

`PERSON` is one real human represented by stable auth identity.

`PROFILE` stores product-neutral person-facing identity fields only.

Never store `DEMENTOR`, `MEMBER`, ownership or program access as global profile attributes.

### Programs

```text
PROGRAM
RUN / OCCURRENCE
SESSION
```

`PROGRAM` is the reusable upper entity.

Conceptual fields:

```text
program_type = course | practice | experience | workshop | other
delivery_mode = self_paced | adaptive_digital | recurring | cohort | physical | hybrid
```

Current canonical projection:

```text
Думай с опасностью
→ PROGRAM / course / self_paced

Деньги на ветер
→ PROGRAM / course / adaptive_digital

НЕ КОМАНДА
→ PROGRAM / practice / recurring

Слабоумие и отвага
→ PROGRAM / experience / physical
```

Delivery hierarchy:

```text
PROGRAM
  → RUN / OCCURRENCE
      → SESSION
```

Rules:
- self-paced Program may have no Run;
- recurring practice may have recurring Runs;
- physical experience may have Experience Runs;
- cohort program may have Cohort Runs;
- Session is optional and subordinate to Run.

### Events

```text
EVENT
```

Current canonical example:

```text
Фуэнхирола → EVENT
```

An Event is not converted into a Program because the same Dementor leads both.

### Projects

```text
PROJECT
```

Standalone Dementor Club project only.

Current public project example:

```text
Логика и осознанность → PROJECT
```

Project editorial authority may live on its own source branch while Dementor Club references it as part of the ecosystem.

### Commerce

```text
PRODUCT
OBJECT
DROP / RELEASE
ORDER
ORDER_ITEM
```

`MERCH` is the public domain; Product/Object/Order are actual entities.

Current implementation remains partially catalog/static and may use string product ids until a dedicated commerce registry is required.

### Participation

```text
REGISTRATION
ENROLLMENT
PARTICIPANT RELATION
ASSESSMENT RUN
```

These represent a Person's relation to an Event, Program, Run or club diagnostic flow.

They are not identity roles.

### Content

```text
MATERIAL
ARTICLE / EDITORIAL ITEM
MEDIA
ARCHIVE ITEM
```

Content may be attached to Project / Program / Event / Run / Session.

Do not create one global content dump without entity relation.

---

## 3. Person and scoped relations

Canonical identity formula:

```text
PERSON
  → SYSTEM_MEMBERSHIP
      → ROLE_ASSIGNMENT
          → ENTITY / PROJECT
```

Never:

```text
PERSON → ROLE
```

One person may hold independent roles across independent systems.

Inside Dementor Club examples:

```text
Evgeniy
→ membership in Dementor Club
→ role DEMENTOR
→ entity assignment to Program «Слабоумие и отвага»

Valentin
→ membership in Dementor Club
→ role DEMENTOR
→ Program «Думай с опасностью» → owner / author

Gabil
→ Program «НЕ КОМАНДА» → facilitator
→ Event «Фуэнхирола» → host
```

Ownership, authorship, facilitation and participation are independent relations.

---

## 4. Role is not permission

```text
ROLE ≠ PERMISSION
```

Permissions must be scoped to system/entity/action.

Examples:
- Dementor can have own profile edit rights without edit rights to another Dementor;
- Program owner can manage that Program;
- Content author can edit content without participant access;
- Event host can operate an Event without club-admin access.

Default authorization remains deny unless granted.

---

## 5. Provenance and validity

Assignments and authoritative entities should preserve:

```text
source_system
source_ref
provenance_status / confidence
confirmed_at
status
valid_from
valid_to
```

Recommended provenance states:

```text
CONFIRMED
INFERRED
PLANNED
LEGACY
```

Only confirmed active assignments should drive authoritative access unless a product flow explicitly supports another state.

---

## 6. Public ecosystem vs internal ontology

Public site may expose:

```text
MERCH
COMMUNITY
EVENTS
PROJECTS
```

Internal ontology remains:

```text
PEOPLE
  Person
  Membership
  Role Assignment
  Entity Assignment

PROGRAMS
  Program
  Run
  Session

EVENTS
  Event

PROJECTS
  Project

COMMERCE
  Product
  Object
  Drop
  Order

PARTICIPATION
  Registration
  Enrollment
  Participant relation
  Assessment Run

CONTENT
  Material
  Media
  Archive Item
```

Therefore public copy must say:

> **Четыре направления. Одна культурная среда.**

not:

> Четыре типа сущностей.

---

## 7. Current Supabase correspondence audit

### Already aligned

```text
profiles                    → PERSON / PROFILE
dc_system_memberships       → SYSTEM_MEMBERSHIP
dc_role_assignments         → ROLE_ASSIGNMENT
dc_entity_assignments       → ENTITY_ASSIGNMENT
dc_entities                 → generic DC entity registry
dc_programs                 → PROGRAM extension
dc_events                   → EVENT extension
assessment_runs             → ASSESSMENT RUN
assessment_snapshots        → derived current assessment state
course_enrollments          → ENROLLMENT
join_applications           → membership application / participation flow
orders                      → ORDER
order_items                 → ORDER_ITEM
```

### Transitional / legacy adapters

`course_enrollments.course_id` is currently a string identifier rather than a canonical `dc_entities.id` foreign key.

`order_items.product_id` is currently a string catalog identifier rather than a canonical commerce entity foreign key.

As of this baseline these tables contain no rows, so there is no active data conflict. Do not introduce a breaking migration until an actual production flow requires normalized Program/Product references.

### Intentionally not created yet

Do not create tables solely because ontology names exist.

Not required yet:
- `dc_runs`;
- `dc_sessions`;
- `dc_projects` registry table beyond actual need;
- `dc_products` / `dc_drops` normalized commerce registry;
- generic content registry;
- participant CRM.

Create them only when a real operational flow exists.

---

## 8. User profile contract

A user profile screen is a **projection of the Person and their relations**, not a storage model.

It may display:

```text
PERSON
├── identity: name / email / avatar
├── club state: guest / member
├── scoped roles
├── entity assignments / MY WORK
├── assessments
├── enrollments
├── orders
└── applications
```

Rules:
- guest is `authenticated + no active DC membership`;
- membership is read from `dc_system_memberships`;
- Dementor / Owner Admin comes from active `dc_role_assignments`;
- Dementor portrait can be used as profile avatar only for a confirmed mapped Person;
- public Dementor profile and private user profile are different surfaces;
- profile never infers roles from email, test results or content activity.

---

## 9. Cross-system boundary

This ontology is Dementor Club only.

Modern Pilgrims, Seven Clicks, BEREG, Obitel and other systems do not enter DC entity queries or assignments automatically.

Shared auth identity does not create shared product membership.

**People may overlap. Projects and rights do not.**

---

## 10. Implementation rule

Source-of-truth sequence:

```text
dementor-club ontology / facts
→ approved entity relation
→ Supabase representation when operationally needed
→ dementor-club-site projection
```

Do not let UI naming create new canonical entities by accident.
