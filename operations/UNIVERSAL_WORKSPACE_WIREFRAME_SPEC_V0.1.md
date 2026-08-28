# Universal Workspace Wireframe Spec v0.1

Date: 2026-08-28
Status: PRODUCT / IA DRAFT / NOT IMPLEMENTED
Branch: `dementor-club`

Depends on:
- `operations/IDENTITY_MEMBERSHIP_AND_ENTITY_BOUNDARY_V0.2.md`
- `operations/DEMENTOR_ENTITY_MAP_AND_WORKSPACE_MODULES_V0.1.md`
- `operations/DEMENTOR_WORKSPACE_WIREFRAME_PROJECTION_V0.1.md`

## 0. Purpose

This document defines the universal workspace interaction model above product-specific workspaces.

It does NOT merge Dementor Club, Modern Pilgrims, Seven Clicks or other systems into one semantic database.

It defines:

1. how one PERSON enters a workspace;
2. how system context is selected;
3. how HOME and MY WORK are generated from assignments;
4. how entities open into their own product/system workspace;
5. how status, role and capabilities determine visible actions;
6. how WAITING/BLOCKED/VALIDATE states change the UI;
7. how external projects such as Seven Clicks appear only in their owning system context.

Core rule:

**One identity may access multiple systems. Work remains system-scoped.**

And operationally:

**ACTIVITY ≠ PROGRESS.**

The workspace should surface state change, next gate and required decision before raw activity.

---

# 1. Universal shell

```text
PERSON WORKSPACE
│
├── SYSTEM SWITCHER
│   ├── Dementor Club
│   ├── Modern Pilgrims
│   └── other explicit memberships
│
└── CURRENT SYSTEM
    ├── HOME
    ├── MY WORK
    └── MY PROFILE
```

The system switcher is visible only when the authenticated PERSON has more than one active system membership.

Switching context is a full semantic context switch.

Never create a merged cross-system `MY WORK` by default.

Example:

```text
Evgeniy
  Dementor Club      → DEMENTOR assignments
  Modern Pilgrims    → operating/project assignments
```

The two sets are not merged into one project list.

---

# 2. Identity header

Persistent workspace header:

```text
[System name]                     [System switcher]
Person name
Current scoped role(s)
```

Optional secondary status:

```text
3 active assignments · 1 waiting decision
```

Do not show unrelated roles from other systems.

Do not use global labels such as `OWNER` or `DEMENTOR` without context.

Correct:

```text
Modern Pilgrims · Project Owner
Dementor Club · Dementor
```

---

# 3. HOME

HOME answers in under 20 seconds:

1. What needs me now?
2. What is active?
3. What is waiting on somebody/something else?
4. What changed meaningfully?
5. What is the next gate?

Recommended structure:

```text
HOME
├── NEEDS ATTENTION
├── CONTINUE / ACTIVE
├── UPCOMING
├── WAITING / BLOCKED
└── RECENT MEANINGFUL CHANGES
```

Do not show an empty section.

Do not create fake activity cards to fill the screen.

## 3.1 Needs Attention

Only items where a current user capability can move the state.

Examples:

```text
BEREG / K-16
VALIDATE
Decision required
[REVIEW]

Maria acquisition page
ACTIVE
Next gate: launch measurable traffic test
[OPEN]
```

## 3.2 Continue / Active

Recent active entities where continued work is legitimate.

Maximum recommended: 3–5.

The card must show the next result/gate, not only last activity.

## 3.3 Upcoming

Only concrete scheduled occurrences, runs, sessions, events or deadlines.

No speculative dates.

## 3.4 Waiting / Blocked

Waiting must be visually distinct from active work.

A WAITING entity is not a call to keep building.

Example:

```text
SEVEN CLICKS
WAITING
Owner: Roman
Waiting for: external/client decision
[VIEW DEPENDENCY]
[RECORD DECISION]
```

Do not show `CONTINUE WORK` unless a separate active result exists.

## 3.5 Recent Meaningful Changes

Examples:

- status changed;
- next gate changed;
- decision recorded;
- blocker resolved;
- result accepted;
- new assignment created;
- run/event date became confirmed.

Do not treat every commit/edit as meaningful change.

---

# 4. MY WORK

`MY WORK` is assignment-driven.

Source conceptually:

```text
PERSON
→ SYSTEM_MEMBERSHIP
→ ROLE_ASSIGNMENT / PROJECT_MEMBERSHIP / ENTITY_ASSIGNMENT
→ visible entities
```

The UI must never infer ownership from name, authorship, repository activity or shared Git account.

Recommended layout:

```text
MY WORK
├── NEEDS ME
├── ACTIVE
├── WAITING / BLOCKED
├── PLANNED
└── DONE / ARCHIVE
```

Optional entity-type filters may appear inside the current system:

```text
ALL
PROJECTS
PROGRAMS
EVENTS
RUNS
```

Filters only appear when relevant.

---

# 5. Universal work card

Every entity card uses the same information hierarchy:

```text
[ENTITY TYPE] · [STATUS]
ENTITY NAME

MY ROLE / RELATION
NEXT RESULT / NEXT GATE

PRIMARY ACTION
SECONDARY ACTION
```

Optional:

```text
source health
confidence
freshness
```

Internal/admin only unless useful to the end user.

Example — Modern Pilgrims:

```text
PROJECT · ACTIVE
INbetweenME / Maria

Role: Operator
Next gate: acquisition test live

[OPEN]
[VIEW SOURCE]
```

Example — Dementor Club:

```text
PROGRAM · ACTIVE
НЕ КОМАНДА

Role: Facilitator
Next: Monday 10:00 Europe/Madrid

[OPEN]
```

---

# 6. Entity opening behavior

Universal workspace does not own product-specific entity screens.

Opening an entity routes into the owning system/product workspace.

```text
Universal Workspace
  → Modern Pilgrims Project Workspace
  → Dementor Program Workspace
  → Dementor Event Workspace
  → Seven Clicks Project Workspace (if/when it has its own product workspace)
```

No data is copied merely to make the navigation work.

The entity link should carry stable identifiers, not display names.

Conceptual route pattern:

```text
/{system}/work/{entity_type}/{entity_id}
```

Exact routes remain product implementation details.

---

# 7. Project workspace — generic wireframe

For project-like entities:

```text
PROJECT
├── HEADER
│   ├── status
│   ├── stage
│   ├── movement
│   ├── my role
│   └── next gate
│
├── CURRENT RESULT
├── NEEDS ATTENTION
├── DECISIONS
├── WAITING / BLOCKERS
├── RECENT RESULTS / HISTORY
├── PEOPLE / ROLES
└── SOURCES / ARTIFACTS
```

Activity stream is secondary.

Primary screen order:

```text
STATE → NEXT RESULT → GATE → DECISION/BLOCKER → SOURCE
```

not:

```text
TASKS → COMMITS → CHATTER
```

---

# 8. Status-driven UI behavior

Status determines default information priority and available actions.

## IDEA

Show:

```text
Problem / intent
Owner status
Evidence / source
```

Typical actions:

```text
DEFINE OWNER
DEFINE NEXT GATE
ARCHIVE IDEA
```

Do not show execution controls.

## PLANNED

Show:

```text
Scope
Owner
Entry gate
Dependencies
```

Typical actions:

```text
CONFIRM SCOPE
ACTIVATE
CHANGE PLAN
```

## ACTIVE

Show first:

```text
Current result
Next gate
Blockers
Recent meaningful delta
```

Typical actions, capability-dependent:

```text
OPEN / CONTINUE
ADD RESULT
RECORD DECISION
ADD BLOCKER
OPEN SOURCE
```

## WAITING

Show first:

```text
Waiting for whom/what
Since when
Expected signal
Owner of follow-up
```

Typical actions:

```text
VIEW DEPENDENCY
RECORD RESPONSE
NUDGE / REQUEST DECISION
CHANGE WAITING STATE
```

Do NOT present generic `CONTINUE WORK` as primary action.

## BLOCKED

Show first:

```text
Blocker
Impact
Owner
Possible unblock action
```

Typical actions:

```text
RESOLVE BLOCKER
ESCALATE
CHANGE GATE
RECORD DECISION
```

## VALIDATE

Show first:

```text
Result under review
Acceptance criteria
Reviewer
Evidence
```

Typical actions:

```text
ACCEPT
RETURN
REQUEST EVIDENCE
```

Only for users with review capability.

## DONE

Show:

```text
Final result
Outcome
Evidence
History
```

Typical actions:

```text
VIEW RESULT
REUSE / LINK
ARCHIVE
```

No active-work affordance by default.

## ARCHIVED

Read-only by default.

---

# 9. Role + capability action matrix

Role labels communicate relation. Capabilities authorize actions.

Never implement:

```text
role === OWNER → allow everything
```

Use scoped capabilities.

Recommended conceptual capabilities:

| Capability | UI action examples |
|---|---|
| `VIEW_ENTITY` | Open entity |
| `EDIT_ENTITY` | Edit overview/settings |
| `MANAGE_STATE` | Change status/stage |
| `ADD_RESULT` | Add Result Object |
| `REVIEW_RESULT` | Accept/return result |
| `MANAGE_DECISIONS` | Record/close decision |
| `MANAGE_BLOCKERS` | Add/resolve blocker |
| `MANAGE_ASSIGNMENTS` | Change people/roles |
| `EDIT_CONTENT` | Edit program/card/content |
| `MANAGE_DELIVERY` | Runs/sessions/occurrences |
| `VIEW_PARTICIPANTS` | View participant list |
| `MANAGE_PARTICIPANTS` | Admission/participant actions |
| `PUBLISH` | Make public/release |
| `ARCHIVE` | Archive entity |

Role examples:

```text
PROJECT_OWNER
OPERATOR
CONTRIBUTOR
CONTENT_EDITOR
DEMENTOR
PROGRAM_OWNER
FACILITATOR
EVENT_HOST
REVIEWER
PARTICIPANT
```

Actual permissions remain system-specific.

---

# 10. Modern Pilgrims projection

Modern Pilgrims workspace may include portfolio/project operational data unavailable in Dementor Club.

Recommended HOME emphasis:

```text
HOME
├── P1 / needs attention
├── commercial gates
├── current results
├── waiting / blockers
└── meaningful changes
```

Recommended project card fields:

```text
priority
status
stage
movement
next result
next gate
my role
source health
confidence
```

Optional operating layer:

```text
effort
money proximity
capacity decision
```

This layer must not replace project state.

---

# 11. Example — Roman / Seven Clicks

Roman is represented by explicit Modern Pilgrims/Seven Clicks scoped assignment, not by a universal global owner label.

Conceptual projection:

```text
PERSON Roman
→ relevant system membership
→ PROJECT_OWNER assignment
→ PROJECT Seven Clicks
```

When project state is WAITING:

```text
PROJECT · WAITING
SEVEN CLICKS

Role: Project Owner
Waiting for: external/client decision
Next gate: confirmed decision

[VIEW CURRENT STATE]
[RECORD DECISION]
```

Do not encourage production work while the project has no active result requiring it.

If Seven Clicks later becomes its own isolated product/system, its assignment should move to/also exist in that explicit system context rather than being inferred from Modern Pilgrims.

---

# 12. Example — Alla

Alla must appear only where explicit assignments exist.

Possible conceptual example:

```text
PERSON Alla
→ Modern Pilgrims membership
→ CONTENT / EDITORIAL assignment
→ specific Project or Entity
```

Her MY WORK should contain only assigned entities.

If no active assignment exists:

```text
MY WORK
No active work assigned.

Available system: Modern Pilgrims
```

Do not generate tasks from team membership alone.

Do not expose Dementor Club unless separate Dementor Club membership exists.

---

# 13. Example — Nikita

Nikita may have assignments in multiple contexts.

In Dementor Club:

```text
PROGRAM · MVP IN DEVELOPMENT
Деньги на ветер
Role: Author / scoped program relation
```

In Modern Pilgrims:

```text
Only explicit Modern Pilgrims project/entity assignments
```

Do not infer Modern Pilgrims ownership from Git activity.

Do not infer Dementor Club project access from general team membership.

---

# 14. Example — Evgeniy

One identity may expose different workspace projections:

```text
SYSTEM: Dementor Club
MY WORK
  Слабоумие и отвага

SYSTEM: Modern Pilgrims
MY WORK
  only explicit MP project/entity assignments
```

A system switch does not merge history, participants, content or project permissions.

---

# 15. Dementor Club projection

Dementor Club continues to use the existing product-specific projection:

```text
HOME
MY WORK
MY PROFILE
```

Programs, Events and Projects appear only from confirmed scoped assignments.

Dementor-specific details remain governed by:

`operations/DEMENTOR_WORKSPACE_WIREFRAME_PROJECTION_V0.1.md`

This universal spec does not replace it.

---

# 16. Context switcher behavior

The switcher is not a filter over one shared dataset.

It changes:

- navigation;
- available entities;
- roles;
- permissions;
- status vocabulary when product-specific;
- sources;
- recent changes;
- actions.

Example:

```text
[Dementor Club ▼]
  Dementor Club
  Modern Pilgrims
```

On switch:

```text
clear product-local entity state
resolve new system membership
resolve new assignments
render new HOME / MY WORK
```

Do not preserve inaccessible entity URLs across switch.

---

# 17. Empty states

Empty states are meaningful state, not missing design.

## No system membership

```text
No workspace access is currently assigned.
```

## System membership but no work

```text
You have access to Modern Pilgrims.
No active work is assigned.
```

## All assigned work waiting

```text
Nothing requires active production now.
2 items are waiting for external decisions.
```

This is preferable to inventing a task list.

---

# 18. Source / provenance behavior

Internal operational UI should be able to show source provenance when confidence matters.

Examples:

```text
Source: GitHub
Source: Supabase
Source: Manual confirmation
Confidence: CONFIRMED / INFERRED
Updated: ...
```

Provenance is especially important for:

- role assignments;
- project ownership;
- WAITING dependencies;
- status changes;
- participant access;
- cross-system membership.

Do not use inferred assignments to grant permissions.

---

# 19. Mobile wireframe

Primary navigation:

```text
HOME
MY WORK
MY PROFILE
```

System switcher remains in header/account menu.

HOME order on mobile:

```text
NEEDS ATTENTION
ACTIVE
WAITING
UPCOMING
RECENT CHANGES
```

Entity card should fit without horizontal scrolling.

Primary action is single and explicit.

Secondary actions go to overflow or entity page.

---

# 20. Action visibility rules

For every action, frontend should resolve:

```text
entity status
+ assignment relation
+ capability
+ system context
= visible action
```

Examples:

```text
WAITING + PROJECT_OWNER + MANAGE_DECISIONS
→ RECORD DECISION visible
→ CONTINUE WORK hidden unless separate active result exists

VALIDATE + REVIEWER + REVIEW_RESULT
→ ACCEPT / RETURN visible

ACTIVE + CONTENT_EDITOR + EDIT_CONTENT
→ EDIT CONTENT visible
→ MANAGE PARTICIPANTS hidden
```

Hidden controls are not authorization.

Server/RLS/API enforcement remains mandatory where applicable.

---

# 21. Recommended first implementation slice

Implement the smallest slice that stress-tests the architecture:

1. universal shell + system switcher;
2. HOME from assignments and states;
3. MY WORK grouped by operational state;
4. generic work card;
5. generic entity header;
6. status-driven action resolver;
7. Dementor Club product projection;
8. Modern Pilgrims Project projection;
9. Seven Clicks WAITING example;
10. explicit empty state for a member with no active assignment.

Do not begin with participant CRM, universal notifications or cross-system search.

---

# 22. Data contract required from backend

Minimum resolved workspace payload conceptually:

```text
workspace_context
  system
  person
  memberships
  scoped_roles
  capabilities
  assignments[]
    entity_id
    entity_type
    entity_system
    relation
    status
    stage
    movement
    next_result
    next_gate
    waiting
    blocker
    source_health
    confidence
    updated_at
```

The exact schema may differ per system, but frontend should receive a resolved view rather than reconstruct permissions from raw tables.

---

# 23. Supabase / shared identity boundary

Shared Supabase identity infrastructure may provide:

```text
auth user
neutral person identity
system memberships
scoped assignments
```

But product data must remain isolated by explicit system/entity scope.

When the new role/project tables are introduced, verify:

- stable person identity;
- explicit system_id;
- explicit entity/project scope;
- role assignment validity;
- source/provenance;
- RLS isolation;
- no global role leakage;
- no cross-system project leakage.

Do not use legacy global `profile.role` as the universal role model.

---

# 24. Non-goals v0.1

Not part of this spec:

- unified cross-system task manager;
- universal participant CRM;
- shared content CMS across systems;
- automatic role inference from Git;
- automatic ownership inference from repository activity;
- merged Dementor + Modern Pilgrims project registry;
- payment architecture;
- notification engine;
- full audit log UI.

---

# 25. Acceptance criteria for wireframe implementation

A prototype is architecturally correct if:

1. one PERSON can switch between two explicit system memberships;
2. each system renders different MY WORK from explicit assignments;
3. Dementor data does not leak into Modern Pilgrims and vice versa;
4. WAITING does not look like active production;
5. actions change by status and capability;
6. Roman can appear as Seven Clicks owner without becoming a Dementor;
7. Alla can be a system member with zero active work;
8. a project opens into its owning product workspace;
9. role labels do not themselves grant unrestricted access;
10. UI can explain provenance/confidence for operational facts;
11. empty modules are not rendered;
12. activity volume is never used as a substitute for progress state.

---

# 26. Release boundary

NOT IMPLEMENTED by this document:

- routes;
- frontend components;
- Supabase tables;
- RLS;
- role resolver;
- capability resolver;
- assignment API;
- system switcher UI;
- Modern Pilgrims workspace routes;
- Seven Clicks workspace routes.

This is the product/wireframe contract for the next implementation step.
