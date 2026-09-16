# DEMENTOR / INTERVENTION MODEL — PRODUCTION MAPPING

Status: **REFERENCE / production compatibility map**  
Date: **2026-09-15**

## Purpose

Этот документ связывает `concept/DEMENTOR_INTERVENTION_MODEL_V1.md` с уже существующими Dementor / identity / profile / course / event / membership-review contracts.

Он не меняет код, permissions, membership policy или schema.

Классификация:

- **KEEP** — текущая модель уже пригодна;
- **REFRAME** — data / surface можно сохранить, но product meaning нужно уточнить;
- **GAP** — нужной семантики сейчас нет;
- **PARTIAL GAP** — hooks существуют, но contextual relation недостаточна.

---

# 1. Person / Profile

Product Model уже определяет Person / Profile как canonical identity layer.

Verdict: **KEEP**.

Не создавать отдельную независимую identity table `dementors` только ради Product Model.

Канонически:

```text
Person / Profile
+
scoped role
+
body of work / practice relations
=
public Dementor projection
```

---

# 2. Active `dementor` role

`community/MEMBERSHIP_AND_DEMENTOR_REVIEW_V2.md` уже использует active `dementor` role assignment как trusted permission source для membership review.

Verdict: **KEEP** для operational authority.

Но Product meaning требует guardrail:

```text
dementor role
!= universal expertise
!= universal intervention permission
!= owner_admin
```

Membership review authority остаётся своим scope.

Нельзя вывести из неё право автоматически рекомендовать человека для любой Situation.

---

# 3. owner_admin

Current authority explicitly separates:

```text
owner_admin != dementor
```

Verdict: **KEEP**.

Admin access не должен участвовать в situational fit / public credibility ranking.

---

# 4. Public roster

`people/dementors.md` уже является approved source-of-truth для:

- public roster;
- slugs;
- profile status;
- approved courses / events / projects;
- doctrine / methods / public profile architecture where approved.

Verdict: **KEEP**.

Но discovery semantics требуют **REFRAME**:

profile fields не должны превращаться в marketplace faceting по generic skills.

`areas / indications / methods` полезны как contextual evidence только после editorial approval.

---

# 5. Profile architecture

Current public profile model includes:

- hero;
- doctrine;
- origin story;
- areas;
- indications;
- methods;
- quotes;
- courses;
- events;
- projects;
- archive;
- contextual CTA.

Verdict: **KEEP + REFRAME**.

Target hierarchy under `10`:

```text
point of view
→ body of work
→ practice / methods
→ situations where relevant
→ real linked Things / Courses / Events / Projects
→ real available action, if one exists
```

Do not add generic booking / consultation CTA unless a concrete source-of-truth creates that action.

---

# 6. `Показания к обращению`

Current profile architecture contains a satirical `Показания к обращению` block.

Verdict: **KEEP AS EDITORIAL SURFACE + REFRAME PRODUCT MEANING**.

It should express recognizable situations, not medical diagnosis, professional claim or service category.

Target meaning:

```text
situation examples / contextual fit hints
```

not:

```text
conditions treated / expert service list
```

---

# 7. Methods

Current roster supports approved named Methods for a Dementor.

Verdict: **KEEP + PARTIAL GAP**.

What exists:

- method names / editorial content can be stored in profile source.

What is not yet formalized product-semantically:

- Situation relation;
- required context / input;
- standalone Thing relation;
- availability;
- whether human Dementor participation is required;
- evidence / body-of-work relation.

Do not create a universal Methods table before recurring runtime needs are proven.

---

# 8. Courses / Programs

Current system already has canonical Course / Program entities and approved author/Dementor relations.

Verdict: **KEEP**.

A Course can be a contextual resource in an Intervention without changing its source ontology.

Guardrail:

```text
Course exists
!= Course is relevant to every person
```

Contextual fit remains a separate semantic decision.

---

# 9. Events / Practices

Current roster and domain model already support Event and recurring Practice-like programs.

Verdict: **KEEP**.

They can participate as Intervention resources when the real Situation makes them relevant and literal availability is confirmed.

Do not infer registration, price, capacity or availability from Dementor relation alone.

---

# 10. Projects

Project registry and Dementor / entity relation hooks already exist conceptually.

Verdict: **KEEP + PARTIAL GAP**.

A Project can expose a real Blocker and request Intervention.

Missing semantic relation:

```text
Project / Thing Situation
→ Intervention
→ Method / Resource / Dementor
→ Outcome
```

Current ownership / assignment relations are not equivalent to this contextual relation.

---

# 11. Dementor Workspace

`operations/DEMENTOR_ENTITY_MAP_AND_WORKSPACE_MODULES_V0.1.md` already establishes:

- one shared shell;
- modules activated only by real linked entities;
- no universal identical Dementor admin;
- no participant CRM unless the underlying resource needs it;
- no invented consultations / events / runs.

Verdict: **KEEP**.

This aligns strongly with `10`:

**CAPABILITY FOLLOWS REAL ENTITY / FORMAT, NOT ROLE FANTASY.**

Workspace remains operational and does not become a public expert marketplace.

---

# 12. Intervention object

No canonical production object currently represents:

```text
Situation / Blocker
→ diagnosis
→ reframe
→ selected resource / Dementor
→ outcome
```

Verdict: **GAP**.

Do not immediately create `dc_interventions` table.

First prove recurring use cases through adapter / editorial records / Project Blockers.

---

# 13. Situation / Blocker model

Project Product Model already conceptually recognizes real blocker context.

But no confirmed universal production contract expresses Situation across:

- public utility entry;
- contribution/editorial context;
- Project making;
- contextual recommendation.

Verdict: **PARTIAL GAP**.

Start with contextual structures owned by their source surface instead of one universal CRM/problem table.

---

# 14. Practice relation

Public roster contains areas, doctrine, methods and linked resources, but `Practice` is not currently a single normalized production object.

Verdict: **PARTIAL GAP**.

This is acceptable.

Phase 0 can derive a Dementor Practice projection from:

- approved public profile content;
- role assignment;
- authored Things;
- approved Methods;
- Courses / Events / Projects.

Do not create a new Practice registry unless multiple surfaces need stable shared relations that cannot be derived safely.

---

# 15. Body of work

Existing links from profiles to Courses / Events / Projects / archive materials provide the start of body-of-work projection.

Verdict: **KEEP + PARTIAL GAP**.

Product Model broadens this to Things / Releases / Methods / History.

Need eventual semantic aggregation, but not a new duplicate content source.

---

# 16. Situational discovery

Current public profile model is primarily person/profile-oriented.

There is no confirmed cross-product surface that takes:

```text
recognizable situation
→ relevant practices / Things / Methods / Dementors
```

Verdict: **GAP**.

This is the central product gap of `10`.

It should be solved semantically before building an expert-search UI.

---

# 17. Skills directory

No need to introduce one.

Verdict: **DO NOT ADD**.

If internal tags / taxonomy help retrieval, they remain supporting evidence.

Public default remains:

**SITUATIONS > SKILLS**.

---

# 18. Human consultation / booking

Current approved sources do not establish a universal booking system for Dementors.

Verdict: **DO NOT INFER / GAP BY FORMAT**.

Some concrete Courses / Practices may later create session / registration mechanics.

Do not add:

- `Book Dementor`;
- generic availability calendar;
- hourly pricing;
- universal consultations;

without a specific approved resource / format.

---

# 19. Free contextual resource recommendation

Existing Things / Courses / Events can already be linked manually from relevant surfaces.

Verdict: **KEEP AS CONTENT + GAP AS SEMANTIC SELECTION**.

Missing layer:

> why this resource is relevant to this Situation now.

The semantic adapter / editorial layer can initially provide this without schema changes.

---

# 20. Paid value

Existing individual product sources may eventually define prices / paid terms.

Verdict: **KEEP SOURCE-SPECIFIC AUTHORITY**.

`10` must not centralize prices or invent commercial availability.

Monetization remains future `13` authority.

Guardrail:

```text
paid resource relation
!= higher user status
!= paid belonging
!= generic expert access
```

---

# 21. Membership

Membership review flow is already mature and server-authoritative.

Verdict: **KEEP WHOLE**.

`10` must not change:

- 9/9 gate;
- review threshold;
- role permissions;
- admission states;
- RLS / privacy.

Membership does not imply access to all Dementors / Interventions.

---

# 22. Membership review as Intervention?

Operationally, Dementors review applications.

Product-semantically this is **not** a contextual Intervention by default.

Verdict: **KEEP SEPARATE**.

Membership review remains admission governance.

Do not add review decisions to public body of work or utility recommendations.

---

# 23. Privacy

Current membership review model already enforces strong privacy boundaries.

Verdict: **KEEP**.

Intervention model must reuse the same principle:

private Situation / Blocker data does not become public case / profile proof automatically.

Public reuse requires an explicit separate content / editorial authority.

---

# 24. Current production compatibility summary

## KEEP

- Person / Profile identity;
- active role assignment model;
- `owner_admin != dementor` separation;
- membership-review permission scope;
- public Dementor roster;
- linked Courses / Events / Projects;
- modular Dementor Workspace principle;
- source-specific availability / price authority;
- existing privacy / RLS separation.

## REFRAME

- Dementor profile from person-first directory toward body-of-work / practice projection;
- areas / indications toward Situation language;
- Method metadata toward contextual resource evidence;
- linked products as resources only when situational fit exists;
- role assignment as permission, not universal credibility.

## GAP

- normalized Intervention semantic relation;
- cross-surface situational discovery;
- contextual fit explanation;
- Intervention outcome / closure semantics.

## PARTIAL GAP

- Practice projection;
- body-of-work aggregation;
- Project blocker → Intervention relation;
- Method → Situation relation;
- resource recommendation semantics.

## DO NOT ADD YET

- expert marketplace;
- universal skills directory;
- generic booking engine;
- universal consultation product;
- Dementor rating / leaderboard;
- new Dementor identity table;
- universal Intervention table before use cases prove it.

---

# 25. Phase 0 target

Before schema migration, prove an in-memory / editorial structure such as:

```text
InterventionContext

situation_summary
source_ref
privacy_scope
blocker?
next_move_blocked?

candidate_resources[]
  resource_ref
  resource_type
  dementor_ref?
  fit_reason
  evidence_ref[]
  availability_status

selected_resource?
reframe?
outcome?
closure?
```

This is not a required final DB schema.

Purpose: prove that contextual recommendation can work without profile-first expert search.

---

# 26. Final production conclusion

Current Dementor infrastructure is broadly compatible with the new Product Model.

The key work is not to rebuild identity.

It is to separate three meanings that production can otherwise accidentally collapse:

```text
ROLE / PERMISSION
PUBLIC AUTHORIAL PROJECTION
SITUATIONAL FIT
```

Canonical conclusion:

> **Keep Person, roles, roster and linked resources. Add contextual fit before adding marketplace mechanics.**

And:

> **A Dementor should appear because the situation makes the connection legible — not because the product has an empty expert card to fill.**
