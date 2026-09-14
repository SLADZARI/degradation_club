# DEMENTOR CLUB — PRODUCT MODEL / PRODUCTION ENTITY REVIEW

Date: **2026-09-15**  
Status: **REVIEW / product-to-production mapping**  
Source product model: `concept/PRODUCT_MODEL_V1.md`

## Purpose

This document checks the new Product Model against the current production contracts and live Supabase structure.

It does **not** authorize a database migration.

Goal:

- preserve what already works;
- identify semantic mismatches;
- avoid destructive renaming for aesthetic consistency;
- separate product ontology from implementation terminology;
- define where future technical proposals are actually needed.

---

# 1. Production evidence reviewed

Repository contracts:

- `community/COMMUNITY_BOARD_ENTITY_MODEL_V1.md`;
- `community/COMMUNITY_ARTIFACT_CARD_CONTRACT_V1.md`;
- `community/COMMUNITY_PLATFORM_ARTIFACT_TYPES_V1.md`;
- `operations/DEMENTOR_CLUB_ENTITY_ONTOLOGY_V0.1.md`.

Live Supabase project reviewed read-only:

**Dementor / exEDUplatform**

No schema writes were made.

---

# 2. Current live shape

At review time the live database contains the following relevant structures:

## Board / contributions

- `dc_artifacts`;
- `dc_artifact_board_positions`;
- `dc_artifact_media`;
- `dc_artifact_reactions`;
- `dc_artifact_responses`;
- `dc_artifact_promotion_support`;
- publisher / slot / distribution support tables.

## Canonical entity registry

- `dc_entities`;
- `dc_entity_assignments`;
- `dc_programs`;
- `dc_events`;
- role / membership tables.

## Current row counts observed

- `dc_artifacts`: **17**;
- `dc_entities`: **5**;
- `dc_programs`: **4**;
- `dc_events`: **1**;
- `dc_artifact_board_positions`: **15**;
- `dc_artifact_promotion_support`: **0**.

Current Artifact data observed:

- `announcement / active / community`: 4;
- `announcement / archived / community`: 4;
- `announcement / expired / community`: 8;
- `post / expired / community`: 1.

Current entity registry observed:

- Event / planned: 1;
- Program / active: 1;
- Program / approved-draft: 1;
- Program / mvp-in-development: 1;
- Program / planned: 1.

This is a small enough production surface that semantics can still be aligned without treating current naming as permanent product truth.

---

# 3. KEEP — production concepts already aligned

## A. Board as projection

Existing approved Board contract already separates:

- native Artifact;
- projection of canonical Event / Course / Project / Activity;
- system communication.

This aligns strongly with Product Model v1.

**KEEP.**

Do not turn Board into a second semantic source.

---

## B. Board placement as presentation state

`dc_artifact_board_positions` stores spatial state separately from Artifact semantics.

This is correct.

**KEEP.**

Movement / size / rotation must remain presentation metadata.

---

## C. Generic entity registry + specialized extensions

`dc_entities` plus `dc_programs` / `dc_events` already expresses the important distinction:

**canonical entity identity → operational extension**

This is compatible with Product Model v1.

**KEEP.**

A Thing with Form `course` can still be operationally backed by Program.

A Thing with Form `event` can still be backed by Event.

---

## D. Scoped assignments

`dc_entity_assignments` already supports person-to-entity relations with scoped role and provenance.

This is compatible with authorship / facilitation / ownership semantics.

**KEEP.**

Do not create a global Person field such as `is_dementor_author_of_everything`.

---

## E. Provenance

Current Artifact and Entity records include `source_system`, `source_ref`, `provenance_status`.

This remains useful under the new Product Model.

**KEEP.**

---

# 4. REFRAME — existing terms that should not remain product truth

## A. Artifact

Current production uses `dc_artifacts` as native Board contribution objects.

This is not inherently wrong.

The mismatch is only semantic if Product starts treating Artifact as the universal name for every public thing.

### Decision

Keep `Artifact` as implementation term for:

- Board-native contribution;
- observation carrier;
- native Board Thing where the Artifact itself is the released object.

Do **not** require Event / Program / Project / Product to become Artifact.

### Product mapping

`dc_artifact` may map to:

- Contribution / Observation carrier;
- or Thing-backed native Board content.

Mapping is contextual.

---

## B. `artifact_type`

Current live values include `announcement` and `post`.

These should not be reused as the canonical future Form taxonomy without review.

Why:

- `announcement` is often presentation intent, not mature Form ontology;
- `post` is too generic to carry the new Product Model by itself.

### Decision

**KEEP as transitional implementation field.**

Do not make a breaking rename now.

Future Board Product Model should define whether it remains presentation metadata, becomes Form mapping, or is replaced by a clearer derived field.

---

## C. `dc_artifacts.status`

Current live statuses include:

- active;
- archived;
- expired.

These describe Artifact availability / Board lifecycle.

They are **not equivalent** to Product Model:

- ПРИНЕСЛИ;
- МУТЯТ;
- ВЫШЛО;
- ОСТАНОВИЛИ.

### Decision

Do not rename current Artifact status into Thing production state.

They answer different questions.

Artifact status remains delivery / visibility lifecycle until a separate technical proposal says otherwise.

---

# 5. PRODUCT MODEL CORRECTION — STATE MUST NOT BE ONE SCALAR

The proposed first Product Model draft used:

**ПРИНЕСЛИ → МУТЯТ → ВЫШЛО / ОСТАНОВИЛИ**

as if one scalar could always represent the current state.

This breaks as soon as a released Thing starts a new version.

Example:

> v0.1 is already public;
> v1 is currently being made.

The Thing is simultaneously:

**ВЫШЛО**

and:

**МУТЯТ**.

### Product decision

Split semantic state into:

## Release State

- `UNRELEASED`;
- `RELEASED`.

## Production State

- `IDLE`;
- `MAKING`;
- `STOPPED`.

Public wording can still use the familiar labels as derived editorial states.

This is a product-model clarification, **not a database migration request yet**.

---

# 6. PRODUCT MODEL CORRECTION — DEMENTOR IS NOT A SECOND PERSON ENTITY

The draft Product Model initially listed Dementor among core entities.

Current identity architecture already correctly treats roles as scoped relations rather than separate identities.

### Product decision

Dementor is:

**public authorial projection of Person + scoped role + body of work + practice**.

Current production basis can remain:

- `profiles` / Person identity;
- `dc_role_assignments`;
- `dc_entity_assignments`;
- linked work.

No `dc_dementors` duplicate identity table is required by Product Model v1.

---

# 7. PRODUCT MODEL CORRECTION — PARTICIPATION HAS TWO OBJECTS

The first draft used one word `Participation` for both:

- an open opportunity;
- a person's actual relation to a Thing / Project.

These are different semantics.

### Product decision

Separate:

## Participation Opportunity

> what can a person do here right now?

and:

## Participant Relation

> how is this Person actually participating?

Current production can use specialized relations where they already exist:

- registration;
- enrollment;
- entity assignment;
- future dedicated participation relation only if a real generic flow appears.

No universal participant CRM is requested.

---

# 8. THING — SHOULD WE CREATE `dc_things` NOW?

## Decision: NO

Product Model defines Thing as central semantics, but current production already has several canonical source families.

Creating a universal Thing table immediately would force premature migration of:

- Artifacts;
- Programs;
- Events;
- future Projects;
- Products / Objects.

There is no evidence yet that such a migration is required.

### v1 implementation requirement

Create a **semantic adapter contract**, not necessarily a new table.

A public product object should be able to answer:

- stable identity;
- title / summary;
- primary Form;
- Release State;
- Production State where relevant;
- author relations;
- Project relation where relevant;
- Releases;
- Participation Opportunities;
- History.

The canonical source may still be Artifact, Event, Program or another Entity.

---

# 9. EXISTING BOARD SOURCE MODEL CAN SURVIVE

Current approved Board model:

`artifact | entity_projection | system`

is compatible with Product Model v1.

### Mapping

## `artifact`

Native contribution / Board-native Thing.

## `entity_projection`

Event / Program / Project / other canonical Thing-backed entity.

## `system`

Operational communication outside the creative Thing model.

This adapter should be preserved unless Board Product Model later demonstrates a concrete limitation.

---

# 10. WHAT IS MISSING IN PRODUCTION SEMANTICS

The current system does not yet expose first-class generic records for several concepts in Product Model v1.

This is **not automatically technical debt**.

Missing / not generic today:

- Observation relation model;
- explicit Thing semantic identity across source families;
- generic Release records;
- generic History Events;
- Participation Opportunities;
- generic Participant Relation for arbitrary Things / Projects;
- Intervention records;
- generic Situation / Blocker record.

### Rule

Do not create all of these at once.

Each one becomes a technical requirement only when a real product flow needs persistence, querying or cross-surface projection.

---

# 11. WHAT CAN BE IMPLEMENTED WITHOUT MIGRATION

Several new product semantics can initially be expressed through read models / adapters / existing sources:

- map Event / Program / Artifact to a common Thing presentation contract;
- derive author relations from existing assignments / Artifact author;
- use existing Board projection contract;
- distinguish Form from presentation_type in surface logic;
- derive released/unreleased from canonical availability where reliable;
- keep current Artifact active/archive/expired lifecycle independent;
- show Project relation only when source exists;
- preserve source provenance.

This should be preferred before schema expansion.

---

# 12. WHERE A FUTURE MIGRATION MAY BECOME JUSTIFIED

A technical proposal becomes justified when product needs at least one of the following across source families:

## Cross-source History

One Activity / History surface must query events consistently from Artifact, Event, Program, Project, Thing.

## Multiple Releases per Thing

The product must show v0.1 → v1 → physical edition / festival build consistently.

## Participation Opportunities

Open invitations must work uniformly across Game / Event / Project / Tool.

## Observation lineage

The product must show how a submitted Observation became one or more Things.

## Intervention history

Contextual methods / courses / Dementors must be persisted and later shown as part of Project history.

Until one of these flows is approved, migration is premature.

---

# 13. CURRENT PRODUCT / PRODUCTION MAPPING

| Product Model | Current production basis | Review status |
|---|---|---|
| Observation | Artifact body/source or external editorial source | PARTIAL |
| Thing | Artifact or canonical `dc_entity` / domain source | ADAPTER NEEDED |
| Form | artifact type / entity type / program type / surface metadata | SEMANTIC NORMALIZATION NEEDED |
| Project | generic entity / project source docs; no generic live project registry required yet | PARTIAL |
| Person / Author | profiles + assignments + Artifact author | ALIGNED |
| Dementor projection | Person + role assignment + body of work | ALIGNED CONCEPTUALLY |
| Release State | derivable only per source today | PARTIAL |
| Production State | not generic | GAP WHEN NEEDED |
| Participation Opportunity | ad hoc / Event registration / Board interaction | GAP WHEN NEEDED |
| Participant Relation | enrollments / registrations / assignments | SPECIALIZED, KEEP |
| Release | current published_at / source availability; no generic multi-release record | PARTIAL |
| History Event | no generic cross-source history model | GAP WHEN NEEDED |
| Intervention | no generic persisted model | GAP WHEN NEEDED |
| Board projection | artifact / entity_projection / system | ALIGNED |

---

# 14. WHAT SHOULD NOT BE CHANGED YET

No product requirement currently justifies immediately:

- deleting or renaming `dc_artifacts`;
- replacing `dc_entities`;
- creating `dc_things`;
- merging Events and Programs into one table;
- replacing `dc_entity_assignments`;
- rewriting Board placement storage;
- changing RLS / permissions;
- normalizing all content into one universal registry;
- migrating Artifact statuses;
- creating a universal participant CRM.

Those are technical decisions, not consequences that follow automatically from Product Model language.

---

# 15. CONFLICT WITH OLD APPROVED DOCS

There is a semantic version shift between the older Community model and the new Product & Marketing package.

Older Board contracts were designed around:

**Member Artifact + platform entity projections + member interaction**.

New Product Model says the higher-level product is organized around:

**Observation → Thing → Form → Release → History**.

These are not mutually exclusive if:

- Artifact remains a source type, not the universal product object;
- Board remains a projection, not the product center;
- profiles do not become the primary discovery surface;
- interaction remains subordinate to Things and program.

Therefore old contracts should be treated as **implementation baselines subject to the new product authority**, not deleted historical errors.

---

# 16. REQUIRED PRODUCT CHANGES BEFORE BOARD MODEL

Before `BOARD_PRODUCT_MODEL_V1.md`, product semantics must assume:

1. Board can show a Thing regardless of canonical backing source.
2. Artifact type is not automatically Form.
3. Artifact status is not Thing production state.
4. `ВЫШЛО` and `МУТЯТ` may coexist for one Thing when a new Release is being produced.
5. Dementor is a projection of Person / roles / work.
6. Participation Opportunity is separate from Participant Relation.
7. History is source truth; Activity is projection.
8. System notices may remain outside Thing ontology.

These are product requirements for the next Board model, not implementation instructions.

---

# 17. REVIEW CONCLUSION

## KEEP

- Artifact as native Board implementation object;
- canonical entity registry;
- Program / Event extensions;
- scoped person assignments;
- provenance model;
- Board projection architecture;
- separate Board placement metadata.

## REFRAME

- Artifact is not the universal public ontology;
- `artifact_type` is not automatically Form;
- Artifact `status` is not Thing State;
- Dementor is not a duplicate identity entity;
- Participation must split opportunity and relation.

## ADD WHEN PRODUCT NEEDS IT

- cross-source Thing adapter;
- Release model;
- History model;
- Observation lineage;
- Participation Opportunities;
- Intervention persistence.

## DO NOT DO YET

- destructive schema rewrite;
- universal `dc_things` table;
- broad migration of existing data solely to match terminology.

---

# Final product requirement

**The new Product Model must become more expressive than the current implementation without forcing the current implementation to imitate the document word-for-word.**

First preserve meaning.

Then change storage only where the product needs behavior that current storage cannot support.
