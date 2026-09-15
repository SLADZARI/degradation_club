# BOARD PRODUCT MODEL — PRODUCTION MAPPING

Status: **REFERENCE / production compatibility map**  
Date: **2026-09-15**

## Purpose

Этот документ связывает `concept/BOARD_PRODUCT_MODEL_V1.md` с текущими production / staging runtime contracts.

Он отвечает на вопрос:

> что уже можно сохранить, что нужно переосмыслить и каких semantic fields / relations действительно не хватает?

Классификация:

- **KEEP** — текущая реализация уже соответствует новой модели или нейтральна к ней;
- **REFRAME** — data / plumbing можно сохранить, но Product meaning должен измениться;
- **GAP** — нужной продуктовой семантики сейчас нет;
- **PARTIAL GAP** — hooks есть, но relation / semantics неполные.

---

# 1. Branch roles

Текущий repository contract разводит роли веток:

- `dementor-club` — semantic / product source;
- `dementor-club-site` — staging site implementation;
- `dementor-club-production` — production-candidate runtime.

Product authority фиксируется в `dementor-club` и не должен молча выводиться из staging / production UI.

---

# 2. Source modes

Production Board уже определяет:

```text
artifact
entity_projection
system
```

Mapping:

| Current source mode | Product projection | Verdict |
|---|---|---|
| `artifact` | MAY BACK `ThingProjection` | **REFRAME** |
| `entity_projection` | `AuxiliaryEntityProjection` или Thing-backed domain projection | **KEEP + REFRAME by context** |
| `system` | `SystemNotice` | **KEEP** |

Ключевое правило:

**Artifact MAY BACK a ThingProjection.**

Нельзя трактовать каждую Board row как Thing 1:1.

---

# 3. Artifact subtype

Production enum:

```text
announcement
post
idea
request
```

Verdict: **REFRAME**.

Эти значения могут остаться как:

- legacy metadata;
- composer / editorial preset;
- migration hint;
- compatibility field.

Они не должны автоматически определять:

- Production State;
- Release State;
- Participation;
- Form.

Forbidden shortcuts:

```text
idea -> IDLE + UNRELEASED
request -> Participation Opportunity
post -> released Text Thing
announcement -> system notice
```

без фактического контекста объекта.

---

# 4. Operational Artifact lifecycle

`dc_artifacts.status` уже выражает lifecycle Board record:

```text
draft
publishing
active
expired
archived
removed
```

Verdict: **KEEP**.

Но canonical guardrail:

```text
artifact.status != Production State
artifact.published_at != Release fact
```

Пример валидной комбинации:

```text
Artifact status: active
Thing production_state: MAKING
Thing release_state: UNRELEASED
```

Board publication и Product lifecycle — разные слои.

---

# 5. Current Artifact fields

| Current field | New meaning | Verdict |
|---|---|---|
| `title` | Thing / projection title candidate | **KEEP** |
| `body` | premise / framing candidate | **KEEP + REFRAME** |
| `external_url` | candidate experience / Release destination | **REFRAME** |
| `starts_at` | availability / schedule metadata | **KEEP** |
| `expires_at` | Board / opportunity availability metadata | **KEEP** |
| `published_at` | publication chronology | **KEEP, not freshness authority** |
| `closed_at` | operational Board closure | **KEEP** |
| `activity_at` | compatibility activity hint | **REFRAME** |
| `promoted_entity_type` | transitional cross-domain hook | **PARTIAL GAP** |
| `promoted_entity_id` | transitional cross-domain hook | **PARTIAL GAP** |
| `visibility` | access / distribution | **KEEP** |
| `source_system` | provenance | **KEEP** |
| `provenance_status` | provenance confidence | **KEEP** |

`external_url` alone does not prove a Release.

`activity_at` alone does not prove meaningful History.

---

# 6. Media

Current Artifact media plumbing supports Board-hosted image/file media, and public Activity can identify YouTube links as video presentation.

Verdict: **KEEP + REFRAME**.

Media remains presentation / evidence infrastructure.

It may help derive `primary_experience`, but:

**MEDIA TYPE ≠ THING FORM FOREVER**

Одна Thing может иметь разные release expressions over time.

---

# 7. Entity projections

Current safe projection reads confirmed entity types:

```text
event
program
project
```

Current presentation code derives narrower kinds using operational attributes such as `program_type`.

Canonical mapping:

```text
source entity = PROGRAM
program_type = COURSE / PRACTICE / ...
primary Form / experience = possibly COURSE / PRACTICE
```

Verdict: **KEEP** for source ontology, **REFRAME** for presentation.

Core guardrail:

**SOURCE TYPE ≠ FORM**

Не менять `program` на `course` в canonical DB только ради карточки.

---

# 8. Project projection

Current Board can project Project entities separately.

Verdict: **KEEP**.

Product interpretation:

Project projection — допустимая auxiliary projection, когда аудитории важен сам ongoing container / process.

Не каждую Project card нужно превращать в Thing.

---

# 9. System communication

Current source model reserves `system` as a separate Board source mode.

Verdict: **KEEP**.

Operational notices remain operational notices.

Не добавлять им Production State / Release / Participation, если у сообщения нет самостоятельной Thing semantics.

---

# 10. Spatial runtime

Current Board spatial engine отвечает за:

- coordinates;
- size class;
- rotation;
- focus;
- pan / zoom;
- placement.

Verdict: **KEEP WHOLE**.

Semantic adapter должен отдать renderer-ready projection; spatial engine не должен превращаться в ontology engine.

---

# 11. Artifact Detail

Production Detail сейчас подчёркивает internal implementation metadata:

```text
ARTIFACT / <status>
ID
TYPE
STATUS
EXPIRES / PERSISTENT
external link
```

Verdict: **KEEP ROUTE + REFRAME INFORMATION HIERARCHY**.

Target hierarchy:

```text
Thing identity
premise
what is happening now
primary experience / CTA
Participation, if present
History / Project context when useful
```

Internal fields остаются debug / admin / compatibility data, но перестают быть public information hierarchy.

---

# 12. CTA

Current Detail treats `external_url` as generic external link after internal detail.

Target behavior:

**RELEASE CTA > INTERNAL NAVIGATION**

If a standalone audience experience exists, Board should prefer:

- Играть;
- Смотреть;
- Прийти;
- Читать;
- Слушать;
- Протестировать;
- Дать материал.

Detail remains available when context is necessary.

Verdict: **REFRAME renderer/action selection**.

---

# 13. Reactions / guest interest / responses

Current runtime already has:

- member reactions;
- guest interest;
- member / guest responses.

Verdict: **KEEP AS PLUMBING**.

They are not Participation Opportunity themselves.

Needed semantic layer:

```text
What exactly can a person do here now?
```

The existing plumbing can execute / record that action where suitable.

---

# 14. Publisher identity

Production supports profile publisher and institutional `DEMENTOR CLUB` publisher while retaining real author ownership/audit.

Verdict: **KEEP**.

This matches Product Model separation between public authorial projection and underlying identity.

---

# 15. Activity read model

Current public Activity read model reuses active Board Artifacts and exposes:

- artifact type;
- media kind / provider;
- source URL;
- `published_at`;
- `activity_at`.

Verdict:

- transport / distribution projection — **KEEP**;
- semantic meaning — **REFRAME**.

Current chronology still depends primarily on publication order.

Target direction:

```text
Release / Production / Participation / History fact
-> semantic projection/event
-> Board / Activity / Home / Community
```

Do not promote Activity into canonical History storage.

---

# 16. Production vs staging composer

## Production

Production-candidate composer still exposes / supports Artifact subtype semantics (`announcement / post / idea / request`) in the newer Board implementation stack.

Verdict: **REFRAME REQUIRED**.

## Staging

The `dementor-club-site` staging Board composer already demonstrates a simpler create experience:

- title;
- body;
- external link;
- expiry;
- image;
- same existing draft / publish pipeline.

No source taxonomy selection is required in the user-facing form.

Verdict: **EVIDENCE FOR LOW-RISK CREATE REFRAME**.

This is strong implementation evidence that legacy taxonomy can disappear from create UX without replacing Artifact runtime.

---

# 17. KEEP list

- three source modes;
- operational Artifact lifecycle;
- spatial Board runtime;
- current draft / publish ownership and RPC flow;
- media storage / rendering plumbing;
- member / guest reaction infrastructure;
- response infrastructure;
- profile + Club publisher identity;
- canonical Event / Program / Project registry;
- Project projection;
- system communication source mode;
- existing Artifact Detail route as an implementation surface;
- Activity as a distribution/read projection.

---

# 18. REFRAME list

- Artifact as universal Board meaning;
- Artifact subtypes as ontology;
- `external_url` as generic secondary link;
- `published_at` as freshness;
- `activity_at` as History;
- media kind as permanent Form;
- Detail metadata-first hierarchy;
- Create taxonomy-first language;
- Board chronology as primary editorial relevance;
- Entity source type as presentation Form.

---

# 19. Confirmed GAPs

## GAP 1 — Production State

Need semantic state:

```text
IDLE
MAKING
STOPPED
```

No existing operational Artifact field can safely replace it.

## GAP 2 — Release model

Need ability to represent:

```text
one Thing -> 0..N audience Releases
```

A Release needs, where relevant:

- Thing relation;
- version / label;
- released_at;
- Form / experience expression;
- destination / location;
- availability;
- editorial framing.

`RELEASED` should preferably be derived from accessible Releases.

## GAP 3 — Participation Opportunity

Need explicit semantic object / relation for:

> what can a person do here now?

Existing response plumbing is reusable below it.

## GAP 4 — Meaningful History

Need semantic events owned by Thing / Project, not generic publication timestamps.

Examples:

- Release shipped;
- prototype appeared;
- first 100 players;
- festival showing;
- remix;
- resumed after six months;
- event occurred.

---

# 20. PARTIAL GAP — Project relation

Current Artifact already has transitional hooks:

```text
promoted_entity_type
promoted_entity_id
```

But:

```text
promoted entity != Thing belongs to / produced within Project
```

Use as compatibility bridge only where semantics match.

Canonical `Thing -> primary Project` relation remains a partial gap until real data contracts are defined.

---

# 21. Phase 0 mapping target

Before schema changes, build in-memory:

```text
BoardThingViewModel

thing_id
source_ref

title
premise
media

author
project?

production_state
release_state
primary_release?
primary_form?
primary_experience?

primary_participation?
latest_meaningful_history?

projection_reason
primary_signal
primary_action
```

For unavailable semantic data, Phase 0 may use explicit adapter-level `unknown / unmapped` diagnostics.

Do **not** add `UNKNOWN` as a fourth Product Production State.

---

# 22. Phase order

## Phase 0 — Semantic projection in memory

No migration.

Prove:

- DEFAULT;
- RELEASE;
- MAKING;
- PARTICIPATION;
- HISTORY.

## Phase 1 — Production + Release

Add only fields / relations Phase 0 proves impossible to derive safely.

## Phase 2 — Participation Opportunity

Layer explicit asks/actions over current response plumbing.

## Phase 3 — Meaningful History

Introduce semantic facts that can refresh Board / Activity without republishing.

## Phase 4 — Presentation migration

- contextual Board cards;
- semantic freshness;
- Detail hierarchy inversion;
- composer language reframe;
- preserve compatibility fields as needed.

---

# 23. Final production conclusion

The production audit supports the Product Model without requiring a Board rewrite.

Canonical conclusion:

> **We do not replace Artifact with a Thing system.**
> **We stop allowing Artifact to define product meaning.**

Existing infrastructure remains valuable:

- Artifact runtime;
- `dc_entities` registry;
- Program / Event / Project domain models;
- spatial Board;
- draft / publish RPCs;
- media;
- reactions / responses;
- publisher identity;
- Activity distribution.

The new semantic layer answers a different question:

> **Что это за вещь, почему она снова важна сейчас и что человек может сделать с ней прямо отсюда?**
