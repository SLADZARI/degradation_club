# Dementor Club — Identity, Membership & Entity Boundary v0.2

Date: 2026-08-28
Status: ARCHITECTURAL BOUNDARY / NOT IMPLEMENTED

## 0. Purpose

This document sits above `operations/DEMENTOR_ENTITY_MAP_AND_WORKSPACE_MODULES_V0.1.md`.

The v0.1 Fact Map remains the source for factual Dementor-specific inventory: which Dementor is connected to which approved Course/Program/Event/Project and which workspace modules follow from those facts.

This v0.2 boundary defines how those facts fit into the shared cross-system identity architecture.

It does NOT merge Dementor Club with Modern Pilgrims, Seven Clicks or any other product.

---

## 1. Core model

```text
PERSON
  → SYSTEM_MEMBERSHIP
      → ROLE_ASSIGNMENT
          → ENTITY / PROJECT
```

Never:

```text
PERSON → DEMENTOR
```

Correct:

```text
PERSON
  → membership in Dementor Club
      → role DEMENTOR
```

The same PERSON may independently have unrelated assignments in other systems.

---

## 2. Shared-auth boundary

The reason for the cross-system layer is one authentication/identity infrastructure.

Shared may include:

- Supabase auth user identity;
- neutral person/profile identity fields;
- generic membership/assignment mechanics if implemented safely.

Not shared semantically:

- Dementor Club projects;
- Modern Pilgrims projects;
- Seven Clicks projects;
- content;
- public pages;
- product-specific permissions;
- release lifecycle.

**Shared person does not mean shared product membership.**

---

## 3. Dementor as scoped role

`DEMENTOR` is a role assignment inside Dementor Club.

It is not a universal person type and must not be stored as a global role on the human profile.

Example:

```text
Evgeniy
  Dementor Club → DEMENTOR
  Modern Pilgrims → independent role assignment
```

No assignment in one system is inferred from another.

---

## 4. Entity architecture for Dementor Club

Dementor Club should normalize delivery objects as follows.

### PROGRAM

Upper entity for reusable course/practice/experience/workshop formats.

Fields conceptually include:

```text
program_type = course | practice | experience | workshop | other
delivery_mode = self_paced | adaptive_digital | recurring | cohort | physical | hybrid
```

Current factual projection:

```text
Думай с опасностью
  PROGRAM / course / self_paced

Деньги на ветер
  PROGRAM / course / adaptive_digital

НЕ КОМАНДА
  PROGRAM / practice / recurring

Слабоумие и отвага
  PROGRAM / experience / physical
```

### EVENT

Separate addressable event entity.

Current factual example:

```text
Фуэнхирола → EVENT
```

It does not become a PROGRAM merely because the same Dementor participates.

### PROJECT

Standalone Dementor Club project entity only.

Modern Pilgrims and other-system projects never enter this registry automatically.

---

## 5. Delivery hierarchy

Use:

```text
PROGRAM
  → RUN / OCCURRENCE
      → SESSION
      → PARTICIPANTS
      → MATERIALS
```

Rules:

- self-paced Program may have no Run;
- recurring practice may create recurring Runs;
- physical experience may create Experience Runs;
- cohort program may create Cohort Runs;
- SESSION is optional and subordinate to Run.

Avoid separate parallel entities such as `PracticeOccurrence`, `CourseRun`, `ExperienceOccurrence` when one Run model is sufficient.

---

## 6. Relationships

Dementor Club should treat these relationships independently:

- system membership;
- role assignment;
- project membership;
- entity assignment;
- ownership;
- authorship/editorial contribution;
- operation/facilitation;
- participation.

Examples:

```text
Valentin → Program Думай с опасностью → owner/author
Nikita → Program Деньги на ветер → author
Gabil → Program НЕ КОМАНДА → facilitator
Gabil → Event Фуэнхирола → host/dementor
```

Do not collapse ownership, authorship and facilitation into one role.

---

## 7. Provenance

Any future database assignment should preserve:

```text
source_system
source_ref
confidence
confirmed_at
status
valid_from
valid_to
```

Recommended evidence states:

```text
CONFIRMED
INFERRED
PLANNED
LEGACY
```

Only confirmed active assignments may drive authoritative UI/permissions unless a product flow explicitly supports another state.

---

## 8. Role ≠ Permission

A Dementor role alone must not mean unlimited workspace access.

Permissions remain scope-aware.

Examples:

- Dementor may edit own profile, not another Dementor profile;
- Program owner may manage that Program;
- Content editor may edit content without Participants access;
- Event host may operate that Event without club-admin access.

Default authorization remains deny unless granted.

---

## 9. Workspace shell

Do not make every entity type a permanent top-level navigation item.

Preferred future shell:

```text
HOME
MY WORK
MY PROFILE
```

`MY WORK` is generated from active scoped assignments and may show:

```text
Programs
Events
Projects
```

Only groups/entities that actually exist for the user are rendered.

The workspace is assignment-driven, not persona-name-driven.

---

## 10. Cross-system non-intersection

Examples of prohibited inference:

```text
Gabil is a Dementor
→ therefore show Obitel in Dementor Workspace   // WRONG

Valentin owns BEREG
→ therefore BEREG is a Dementor Club project   // WRONG

Alla is a Modern Pilgrims team member
→ therefore she exists in Dementor Club        // WRONG
```

Correct behavior is a separate explicit membership/assignment in each system.

---

## 11. Relationship to Fact Map v0.1

`DEMENTOR_ENTITY_MAP_AND_WORKSPACE_MODULES_V0.1.md` remains unchanged and continues to answer:

- who the approved Dementors are;
- what factual Programs/Events/Projects they are connected to;
- which workspace modules those facts imply.

This document answers a different question:

> how is one real person represented safely across multiple independent systems and entities?

Future Dementor workspace design must use both layers:

```text
Universal scoped identity/entity architecture
  +
Dementor-specific Fact Map
  →
Dementor Workspace UI
```

---

## 12. Implementation status

Design only.

Not deployed:

- schema;
- migration;
- RLS;
- permissions;
- workspace UI.

Do not deploy until a concrete product flow requires these entities and isolation tests are written.
