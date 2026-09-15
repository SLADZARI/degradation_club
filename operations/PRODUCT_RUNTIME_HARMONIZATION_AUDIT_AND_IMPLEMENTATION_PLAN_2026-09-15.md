# DEMENTOR CLUB — PRODUCT / RUNTIME HARMONIZATION AUDIT & IMPLEMENTATION PLAN

Status: **REFERENCE / ACTION PLAN — CURRENT-STATE AUDIT**  
Updated: **2026-09-15**

## Purpose

Этот документ отвечает на два вопроса:

1. **Насколько текущий Dementor Club соответствует собранному Product & Marketing Package 01–15?**
2. **В каком порядке внедрять пакет в текущий runtime без разрушительной переписки существующей системы?**

Документ является operational reference, а не новой product authority.

Он не заменяет authority-документы 01–14 и не создаёт новую ontology.

Основной принцип внедрения:

> **KEEP THE SOURCE TRUTH. ADD THE SEMANTIC LAYER. REMOVE USER-FACING CONTRADICTIONS FIRST.**

И ещё короче:

> **НЕ ПЕРЕПИСЫВАТЬ DEMENTOR. ПЕРЕСТАТЬ ЗАСТАВЛЯТЬ СТАРУЮ ТЕХНИЧЕСКУЮ МОДЕЛЬ ОБЪЯСНЯТЬ НОВЫЙ ПРОДУКТ.**

---

# 0. Executive conclusion

Product & Marketing Package уже описывает Dementor как достаточно цельную систему.

Главная проблема текущего проекта — **не отсутствие сущностей и не отсутствие инфраструктуры**.

Существующий runtime уже имеет значительную часть нужного фундамента:

- самостоятельные Event / Course / Project surfaces;
- `dc_entities` и специализированные domain entities;
- Artifact publication runtime;
- Board projections;
- Telegram outbox / worker;
- sitemap / robots / canonical runtime;
- OG / Twitter metadata primitives;
- GA4 / Clarity / semantic CTA telemetry;
- profiles / memberships / moderation;
- public routes и operational state.

Но продуктовые смыслы распределены по системе неравномерно.

В результате текущий пользовательский experience всё ещё часто говорит:

```text
CLUB / COMMUNITY / JOIN / ARTIFACT / ACTIVITY
```

там, где собранная модель требует:

```text
THING / EXPERIENCE / WHY NOW / CONTINUATION / RETURN
```

Поэтому основная программа внедрения должна быть не schema-first, а **contradiction-first + projection-first**.

Главные противоречия текущего runtime:

1. **Thing-first ↔ Join / Community-first**;
2. **watching alone is complete ↔ first Artifact / membership gates**;
3. **Product semantics ↔ Artifact subtype / slot mechanics**;
4. **Contribution inbound ↔ Direct public publish**;
5. **Programming Moment ↔ created/published/activity chronology**;
6. **History ↔ generic Activity**;
7. **Release truth ↔ published / URL proxies**;
8. **Return follows value ↔ notification / activity mechanics**;
9. **Situations > Skills ↔ profile-first discovery**;
10. **external message ↔ ecosystem explanation**;
11. **precise destination ↔ generic Home / Board routing**;
12. **value signals ↔ pageview/open/click telemetry**;
13. **monetization follows value ↔ no external paid-demand evidence yet**;
14. **authority package ↔ stale index / forked stacked PRs**;
15. **additive semantic evolution ↔ risk of premature universal tables / rewrites**.

Главный implementation conclusion:

> **Dementor Club можно привести в соответствие с 01–14 в основном через frontend / adapter / projection / routing / analytics semantics и несколько узких additive data changes. Universal rewrite не нужен.**

---

# 1. Audit method

Для каждого package layer используется один из статусов:

- **ALIGNED** — runtime в основном выражает authority правильно;
- **PARTIAL** — фундамент существует, но пользовательский смысл / routing / state неполны;
- **CONFLICT** — runtime активно создаёт противоположное поведение;
- **NOT IMPLEMENTED** — authority описана, runtime layer ещё отсутствует;
- **CORRECTLY DEFERRED** — отсутствие реализации сейчас является правильным решением.

Отдельно оценивается не только наличие кода, но и:

- entry behavior;
- public copy;
- product state semantics;
- editorial behavior;
- routing;
- lifecycle truth;
- measurement;
- operational compatibility.

---

# 2. 15-point harmonization audit

## 01 · Product Thesis / JTBD

### Authority

Dementor замечает странное / абсурдное в нормальной жизни и превращает это в Things, которые можно посмотреть, прочитать, сыграть, попробовать или сделать вместе.

### Runtime status

**PARTIAL**

### Что уже совпадает

- существуют реальные standalone experiences: Course, Event, Project worlds;
- DaaS tone последовательно выражает авторский взгляд;
- отдельные surfaces действительно можно воспринимать как самостоятельные вещи.

### Где конфликт

Production Home по-прежнему в первую очередь объясняет:

- сервис;
- клуб;
- культурную платформу;
- ecosystem;
- Join.

Primary CTA ведёт к процедуре вступления, а не к первой сильной Thing.

В результате первая product promise часто выглядит как:

```text
WHAT IS THIS CLUB?
→ JOIN
```

вместо:

```text
HERE IS A THING
→ EXPERIENCE
→ ANOTHER THING
```

### Required change

Home должен стать **current program cover**, где DaaS остаётся brand frame, но proof создают реальные Things.

---

## 02 · CJM CLUB / Audience Journey

### Authority

Базовый journey:

```text
ENCOUNTER
→ EXPERIENCE
→ REACTION
→ RETURN
```

Watching alone является complete use.

Bring / Join / Make / Participate — optional branches.

### Runtime status

**CONFLICT / PARTIAL**

### Главный конфликт

Board runtime содержит модель:

```text
FIRST ARTIFACT / REQUIRED
```

и предлагает человеку сначала оставить публикацию, прежде чем нормально осматриваться.

Это превращает contribution в prerequisite к audience experience.

### Required change

- browsing / watching не зависит от публикации;
- Join не является обязательным успехом audience journey;
- Contribution и Participation появляются только после собственного intent.

---

## 03 · Audience & Entry Map / Board Participation CJM

### Authority

```text
SOURCE × INTENT × ENTRY OBJECT
```

Home:

> **Что у них сейчас?**

Board:

> **Что сейчас происходит?**

Entry principle:

> **Не приводить человека в клуб. Дать ему встретить вещь, после которой он сам захочет посмотреть, что это за место.**

### Runtime status

**PARTIAL**

### Aligned

- Event имеет самостоятельный exact destination;
- Course / Project имеют самостоятельные public routes;
- direct navigation существует;
- Board существует отдельной surface.

### Gaps

- Home не является чистой current-program cover;
- Board смешивает living Things и member publication mechanics;
- некоторые flows по-прежнему ведут к membership / generic section раньше promised experience.

### Required change

Routing должен быть построен от intent к точному Entry Object.

---

## 04 · Value Architecture

### Authority

Самостоятельная ценность существует до membership, social graph, payment и platform mechanics.

### Runtime status

**PARTIAL**

### Aligned

Event / Course / Project уже могут нести самостоятельную ценность.

### Conflict

Система всё ещё визуально переоценивает:

- Join;
- Community;
- membership state;
- Artifact slot;
- account mechanics.

### Required change

Публичная архитектура должна сначала доказывать value через Things, затем показывать дополнительные отношения с клубом.

---

## 05 · Product Model

### Authority

```text
OBSERVATION → THING → FORM → RELEASE → HISTORY
```

Parallel:

```text
THING ↔ PROJECT
```

Participation и Contribution — отдельные отношения.

Artifact — implementation carrier, не universal ontology.

### Runtime status

**PARTIAL — FOUNDATION READY**

### Aligned

Production уже имеет хорошие operational sources:

- `dc_entities`;
- Events;
- Programs / Courses;
- Projects;
- Artifacts;
- profiles / membership / moderation;
- public routes.

### Gaps

- Thing не выражена единым semantic projection layer;
- Artifact выполняет слишком много продуктовых ролей;
- Release truth недостаточно выделена;
- History часто подменяется Activity;
- Participation семантически слабее membership / Artifact mechanics.

### Required change

Не создавать universal `dc_things` сейчас.

Создать **ThingProjection / Product ViewModel поверх существующих source entities**.

---

## 06 · Board Product Model

### Authority

Board = editorial surface living Things.

```text
CURRENT SOURCES
→ SEMANTIC PROJECTION
→ CONTEXTUAL PRESENTATION
```

Card:

- Thing identity / premise;
- useful proof/media;
- one contextual signal;
- one primary action.

### Runtime status

**PARTIAL**

### Aligned

Уже существует adapter / projection foundation:

- Entity projections;
- source modes;
- public routes;
- Event / Program / Practice mappings.

### Conflicts

Current Board presentation продолжает выводить технические признаки:

- source type;
- status;
- provenance;
- Artifact subtype;
- slot mechanics;
- Telegram delivery state.

Composer в production всё ещё требует Artifact subtype.

### Required change

Сохранить source adapter, но ввести richer ThingProjection перед renderer.

Technical metadata уйдёт в admin/debug context, а не в primary audience card.

---

## 07 · Content & Programming Model

### Authority

Programming Moment:

```text
THING
+ MEANINGFUL DELTA / EDITORIAL REASON
+ WHY NOW
+ EDITORIAL WINDOW
+ SEQUENCE
```

No delta → no update.

### Runtime status

**GAP / CONFLICT**

### Current behavior

Current surfaces и distribution всё ещё в значительной степени опираются на:

- created / published time;
- operational status;
- raw activity;
- submission / publication events.

### Critical conflict

Telegram staging worker может запускаться после `artifactForm` submit.

Факт публикации слишком близко связан с distribution reason.

### Required change

Ввести ProgrammingDecision / ProgrammingMoment semantic layer сначала без новой таблицы.

Editorial outbound:

```text
Programming Moment
→ Distribution Decision
→ Delivery
```

---

## 08 · Return Loops

### Authority

```text
TRIGGER → EXPECTATION → RETURN → PAYOFF → NEXT EXPECTATION
```

**RETURN FOLLOWS VALUE, NOT DEBT.**

### Runtime status

**PARTIAL / GAP**

### Foundation

- Telegram может доставлять meaningful continuation;
- contextual recommendation primitive уже существует;
- direct return возможен;
- самостоятельные Thing routes существуют.

### Gaps

- expectation не фиксируется семантически;
- payoff не измеряется;
- Thing continuity слабая;
- generic activity / notification может конкурировать с real continuation.

### Required change

Сначала построить Thing → Thing и meaningful continuation.

Follow / notification layer не нужен как prerequisite.

---

## 09 · Contribution Model

### Authority

```text
BRING
→ ACKNOWLEDGE
→ EDITORIAL LOOK
→ DISPOSITION
→ CONSEQUENCE / CLOSURE
```

Contribution ≠ Thing ≠ Publication.

Direct public publish — separate explicit path.

### Runtime status

**STRONG CONFLICT**

### Current conflict

Artifact runtime одновременно выступает:

- contribution-like entry;
- direct public publication;
- Board object;
- member slot;
- Telegram promotion source.

UI требует subtype и использует publication-oriented language.

### Required change

Разделить два пользовательских договора:

#### A. ПРИНЁС

Editorial inbound.

- private/editorial by default;
- material first;
- classification later;
- editorial disposition / closure.

#### B. PUBLISH READY THING

Explicit public action.

- standalone Thing semantics;
- Artifact может оставаться carrier;
- publication не означает programming / editorial endorsement.

### Migration policy

Старые `announcement / post / idea / request` можно оставить как compatibility metadata.

Не использовать их как обязательную product taxonomy.

---

## 10 · Dementor / Intervention Model

### Authority

**Situations > Skills**.

Dementor = public authorial projection + Practice + body of work.

Intervention начинается с Situation / Blocker и выбирает smallest sufficient resource.

### Runtime status

**PARTIAL**

### Aligned

- Event уже может показывать Dementor relation;
- Courses / authored entities существуют;
- профили существуют;
- concrete expertise может быть показана через work.

### Gaps

- discovery всё ещё в основном profile / section oriented;
- нет Situation → relevant resource resolver;
- Practice / body-of-work semantics неполны;
- нет чёткой границы между profile activity и authored work.

### Required change

Dementor surface:

```text
VIEWPOINT
→ PRACTICE
→ BODY OF WORK
→ RELEVANT SITUATIONS / RESULTS
```

Situation flow:

```text
SITUATION
→ THING / METHOD / TOOL / COURSE
→ HUMAN INTERVENTION only if needed
```

---

## 11 · Marketing Positioning & Messaging

### Authority

```text
INTERNAL MODEL ≠ EXTERNAL MESSAGE
PROMISE → PROOF THROUGH THING → NEXT THING
```

### Runtime status

**PARTIAL / HOME CONFLICT**

### Aligned

DaaS является сильным brand frame и не конфликтует с authority как таковой.

About может использовать:

- club;
- platform;
- Community;
- Events;
- Projects;

потому что это глубокая explanatory surface.

### Conflict

Home сейчас объясняет system / service раньше proof.

### Required change

Home lead:

- короткий external semantic frame;
- immediately visible Thing proof;
- next Thing;
- structural explanation ниже / позже.

Не требуется удалять DaaS.

Нужно изменить его роль: **brand voice / frame, не единственный product explanation**.

---

## 12 · Distribution Model

### Authority

General:

```text
DISTRIBUTION TRIGGER
→ INTENT HYPOTHESIS
→ SOURCE / CHANNEL FIT
→ PROMISE / PREVIEW
→ ENTRY OBJECT
→ EXPERIENCE
→ CONTINUATION
```

Editorial outbound:

```text
PROGRAMMING MOMENT
→ DISTRIBUTION DECISION
→ DELIVERY ELIGIBILITY
→ CHANNEL / TRANSPORT
→ ENTRY OBJECT
→ EXPERIENCE
```

### Runtime status

**PARTIAL — STRONG FOUNDATION**

### KEEP

- sitemap / robots;
- canonical runtime;
- OG / Twitter primitives;
- standalone destinations;
- Telegram worker / outbox;
- delivery statuses;
- analytics / placements / referrer primitives.

### Reframe

- Artifact submit не является Telegram reason;
- Home не default landing для precise promise;
- Board не default acquisition surface;
- Share должен сохранять Thing context.

### Gaps

- trigger-aware routing decision;
- semantic intent / Entry Object attribution;
- Programming Moment gate for editorial outbound;
- destination QA;
- Event / QR exact continuation;
- Thing-specific preview coverage.

---

## 13 · Monetization Map

### Authority

```text
VALUE OBJECT
→ PAYER
→ MOMENT OF NEED
→ OFFER
→ PAYMENT
→ DELIVERY
→ AFTERLIFE
```

### Runtime status

**CORRECTLY DEFERRED / ARCHITECTURE READY**

### Important finding

Сейчас нет достаточного external behavioural evidence, чтобы утверждать willingness to pay за:

- Membership;
- Event;
- Thing;
- Intervention;
- Course;
- Merch;
- recurring package.

### Required change now

Не строить monetization infrastructure.

Сначала измерить real value / intent.

Evidence ladder:

```text
SEEN
→ CONSUMED
→ RETURNED
→ EXPRESSED INTENT
→ COMMITTED
→ PAID
→ REPEATED
```

### Guardrail

DaaS phrase «по подписке» остаётся brand joke / frame и не должна автоматически превращаться в subscription business model.

---

## 14 · Metrics & Signals

### Authority

```text
ENTRY
→ EXPERIENCE
→ CONTINUATION
→ RETURN
→ CONTRIBUTION / PARTICIPATION / INTERVENTION
→ RELEASE / HISTORY
```

### Runtime status

**PARTIAL — STRONG TRANSPORT / WEAK VALUE SEMANTICS**

### KEEP

- GA4;
- Clarity;
- consent;
- production-only guard;
- PII blocking;
- route opens;
- CTA events;
- `recommendation_click`;
- placement / source-page context.

### Critical problem

Текущий sample загрязнён:

- auth;
- Workspace;
- Board;
- internal / test activity.

Поэтому raw current analytics нельзя использовать как proof market demand.

### Required change

Первый analytics priority:

**honest population + qualified experience + continuation**.

Не новый dashboard.

---

## 15 · Product Principles / Anti-patterns consolidation

### Authority status

**NOT YET FORMALIZED**

### Runtime status

**NOT IMPLEMENTED — CORRECTLY DEFERRED**

### Recommendation

15 нельзя писать как ещё одну ontology.

Он должен появиться **после landing / harmonization 01–14** как короткий implementation constitution.

Предварительный набор principles, который уже повторяется во всех authority layers:

1. **THING FIRST.**
2. **EXPERIENCE BEFORE EXPLANATION.**
3. **PRODUCT SEMANTICS BEFORE STORAGE TYPE.**
4. **RELEASE > COMPLETION.**
5. **PROGRAM REASON > CHRONOLOGY.**
6. **RETURN FOLLOWS VALUE, NOT DEBT.**
7. **CONTRIBUTION ≠ PUBLICATION.**
8. **SITUATIONS > SKILLS.**
9. **MONETIZATION FOLLOWS VALUE.**
10. **PRECISE DESTINATION > GENERIC TRAFFIC.**
11. **MEASURE THE VALUE CHAIN, NOT THE NOISE.**
12. **ADDITIVE ADAPTERS BEFORE DESTRUCTIVE MIGRATION.**
13. **ONE PRIMARY ACTION PER CONTEXT.**
14. **EXISTING OPERATIONAL ENTITIES REMAIN SOURCE TRUTH UNTIL A REAL GAP REQUIRES OTHERWISE.**
15. **DO NOT BUILD AN ABSTRACTION BEFORE REPEATED NEED.**

Финальный `15` нужно сделать после landing stack и первых implementation waves.

---

# 3. Overall score

## Fully aligned

На runtime level полностью aligned слоёв пока нет.

Это нормально: пакет собран быстрее implementation.

## Strong foundation / partial

- 01 Product Thesis;
- 03 Audience & Entry;
- 04 Value Architecture;
- 05 Product Model;
- 06 Board Model;
- 08 Return;
- 10 Intervention;
- 11 Messaging;
- 12 Distribution;
- 14 Metrics transport.

## Direct contradictions to remove first

- 02 audience journey ↔ first-Artifact / Join gating;
- 07 Programming ↔ publish/activity-driven outbound;
- 09 Contribution ↔ direct public Artifact conflation;
- 11 Thing-proof ↔ Home service/ecosystem-first hierarchy.

## Correctly deferred

- 13 monetization implementation;
- 15 principles consolidation.

---

# 4. Current runtime: KEEP / REFRAME / GAP

## KEEP

### Domain source truth

- Event entities / Event detail pages;
- Programs / Courses;
- Projects;
- `dc_entities` registry;
- Artifact storage/carrier;
- profiles;
- membership/access infrastructure;
- moderation infrastructure.

### Distribution transport

- sitemap;
- robots;
- canonical runtime;
- OG / Twitter metadata mechanism;
- Telegram outbox / worker;
- public entity routes.

### Analytics transport

- GA4;
- Clarity;
- consent;
- production guard;
- blocked sensitive params;
- basic semantic route / CTA events.

### Board foundation

- source modes;
- Entity projection adapter;
- public route mapping;
- member Artifact read path.

---

## REFRAME

- Home: ecosystem/service landing → current Program cover;
- Board: technical/member board → editorial surface of living Things;
- Artifact: product meaning → carrier / source relation;
- subtype: ontology → compatibility metadata / optional preset;
- publication: programming trigger → one possible product fact;
- activity: history → operational input only;
- Telegram: publication echo → Programming/Distribution delivery;
- profiles: activity identity → body of work / Practice;
- analytics opens: success → entry/exposure telemetry;
- Join: primary success → optional branch;
- DaaS: product definition → brand frame.

---

## GAP

- ThingProjection across source types;
- explicit Release truth;
- meaningful History semantics;
- Participation Opportunity model where needed;
- Contribution inbound workflow;
- editorial disposition / closure;
- Programming Moment decision layer;
- trigger-aware DistributionDecision;
- Situation → Intervention resolver;
- Thing → Thing continuation;
- Return Payoff measurement;
- Thing-specific previews;
- external/internal analytics population separation;
- qualified experience / form-aware consumption;
- commercial evidence only after real offers.

---

# 5. Target runtime architecture

Не строить новую платформу рядом со старой.

Целевая архитектура:

```text
EXISTING SOURCE TRUTH

Artifacts
Entities
Events
Programs
Projects
Profiles
Membership
Operational signals

        ↓

PRODUCT SEMANTIC ADAPTERS

ThingProjection
ReleaseProjection
ParticipationOpportunity
MeaningfulHistory
ProgrammingDecision
DistributionDecision
InterventionResolution

        ↓

CONTEXTUAL SURFACES

Home
Board
Thing / Artifact detail
Event
Project
Dementor
Search / Share
Telegram / external distribution

        ↓

VALUE SIGNALS

Qualified Entry
Experience
Thing → Thing
Return
Contribution / Participation
Release / History
Commercial evidence when real
```

Главное техническое правило:

> **SOURCE ENTITY DOES NOT HAVE TO BECOME PRODUCT ENTITY IN STORAGE TO BEHAVE LIKE ONE IN THE PRODUCT.**

---

# 6. Migration policy

## Default

**ADDITIVE / COMPATIBILITY-FIRST**

### Do

- add adapters;
- add projections;
- add optional semantic fields only when runtime needs them;
- preserve existing IDs / routes;
- derive state where possible;
- hide old technical taxonomy from user before deleting storage;
- add new tables only for facts that cannot be represented safely elsewhere.

### Do not

- create universal `dc_things` immediately;
- convert Events / Programs / Projects into Artifacts;
- delete Artifact subtypes as first move;
- migrate all Activity into History automatically;
- infer Release from URL existence;
- infer Participation from membership;
- infer Programming from publication;
- infer commercial intent from Join / click;
- rebuild analytics platform;
- build a marketplace / CRM / social feed.

---

# 7. Reference objects for implementation

До масштабного внедрения выбрать небольшой cross-section реальных objects.

Recommended initial set:

## A. Course

**Думай с опасностью**

Проверяет:

- Thing identity;
- Form = Course;
- Program source;
- author relation;
- release;
- next Thing;
- experience measurement.

## B. Event

**Фуэнхирола**

Проверяет:

- exact external destination;
- Situation framing;
- Dementor relation;
- Event lifecycle;
- physical → digital continuation;
- preview / canonical correctness.

## C. Project world

**Логика и осознанность**

Проверяет:

- Project ≠ Thing;
- multiple outputs / Things;
- body of work;
- History / continuation;
- resurfacing.

## D. Native Board / Artifact-backed Thing

Выбрать одну реальную public member publication, которая проходит standalone Thing test.

Проверяет:

- Artifact carrier ≠ ontology;
- direct public publish;
- ThingProjection;
- Board card;
- share.

## E. Editorial inbound Contribution

Создать test contribution только после UX split.

Проверяет:

- private inbound;
- editorial disposition;
- no automatic publication;
- closure / contributor return.

Эти objects являются **implementation fixtures**, не новой content taxonomy.

---

# 8. Implementation roadmap

## WAVE 0 — Governance + honest baseline

### Goal

Стабилизировать authority stack и измерение до изменения продукта.

### Product work

1. Land / restack Product & Marketing authority chain.
2. Зафиксировать reference objects.
3. Зафиксировать Product Semantic ViewModel v0.
4. Отделить internal / test analytics population.
5. Не обновлять package index частями.

### Required PR landing order

Текущий clean path:

```text
#188 Return Loops
→ #189 Contribution
→ #190 Dementor / Intervention
→ #191 Marketing Positioning & Messaging
→ #193 Distribution
→ RESTACK #192 Monetization ON #193
→ RESTACK #194 Metrics ON updated #192
→ ONE package-index update
→ #15 Product Principles / Anti-patterns
```

Причина restack:

`12` и `13` сейчас ответвлены после `11`, а `14` сидит поверх `12`.

Финальный authority package должен быть линейно читаемым.

### Analytics

Implement first:

- external / internal / unknown population classification;
- keep consent / privacy;
- no market conclusions before population is honest.

### Acceptance

- authority stack читается в одном порядке;
- package index соответствует reality;
- 3–5 reference objects названы;
- baseline report отделяет internal/test;
- никаких destructive schema changes.

---

## WAVE 1 — Remove first-experience contradictions

### Goal

Человек должен получить Dementor value до Join / Contribution.

### Main changes

#### Home

Current Home → **Program Cover v1**.

Above-fold / first program block должен показать:

- external master frame / DaaS-compatible voice;
- 1–3 актуальные Things;
- immediate proof;
- one next Thing path.

`Join` перестаёт быть default primary conversion.

#### Board

Remove audience gate:

- browsing не требует first Artifact;
- contribution CTA не блокирует discovery;
- member state может менять available actions, но не доступ к public value.

#### Event / Course / Project

External links должны вести прямо к promised object.

Если Event реально требует membership — это literal eligibility condition.

Если не требует — убрать copy вроде `ACCESS AFTER JOIN`.

### Likely files

- `/index.html`;
- `/home-v1.css`;
- Home runtime scripts;
- `/community/board/board.js`;
- Event detail pages;
- relevant navigation / CTA components.

### Acceptance

Новый anonymous visitor может:

1. открыть Home;
2. понять viewpoint без изучения ontology;
3. открыть реальную Thing;
4. получить standalone experience;
5. открыть следующую Thing;

без обязательных:

- account;
- Join;
- publication;
- Community participation.

---

## WAVE 2 — Semantic spine / ThingProjection

### Goal

Перестать позволять source types определять product meaning.

### Implement

Product ViewModel v0:

```text
thing_id
source_ref
identity / title
premise
media
primary_form?
primary_experience?
production_state
release_state
primary_release?
primary_participation?
latest_meaningful_history?
author?
project?
projection_reason
primary_signal
primary_action
```

### Source mapping

- Event → possible ThingProjection;
- Course/Program → ThingProjection with Course Form;
- Project output → ThingProjection related to Project;
- native Artifact → ThingProjection if standalone;
- Contribution does not automatically map to Thing.

### Board presentation

Replace technical density with:

```text
Thing identity
premise / proof
ONE contextual signal
ONE primary action
```

Technical status/provenance stays admin/debug.

### Likely files

- `/community/board/board-entity-model-v1.js`;
- `/community/board/board-integrations-v1.js`;
- new semantic adapter module if cleaner;
- relevant RPC only if source read shape lacks required fields.

### Schema

**No universal `dc_things` migration.**

### Acceptance

One renderer can show Event-backed, Program-backed and Artifact-backed Things without exposing source ontology as the main meaning.

---

## WAVE 3 — Contribution / Direct Publish split

### Goal

Implement authority `09` and remove the strongest current product contradiction.

### New entry contracts

#### Bring / Contribution

UI intent:

> **Что заметил / что хочешь показать?**

Properties:

- editorial inbound;
- private by default;
- material first;
- no mandatory subtype;
- acknowledgement;
- editorial disposition;
- closure.

#### Publish ready Thing

UI intent:

> **Публикуешь готовую самостоятельную вещь.**

Properties:

- explicit public action;
- standalone Thing test;
- sufficient provenance / authorship;
- moderation possible;
- publication does not imply editorial program inclusion.

### Compatibility

Artifact can remain common transport/storage carrier where useful.

But:

```text
Artifact record
≠ same user contract
```

### Likely files

- `/community/board/board.js`;
- `/community/board/board-composer-sheet-v2.js` on staging;
- Artifact detail;
- minimal additive migrations for Contribution status/disposition/provenance only if needed.

### Acceptance

- inbound contribution never becomes public accidentally;
- direct publisher understands immediate public action;
- subtype not required for human comprehension;
- NO_ACTION / DECLINE still produce closure;
- raw Contribution never automatically creates Programming Moment.

---

## WAVE 4 — Programming / Release / History truth

### Goal

Move runtime from chronology/activity semantics to editorial/product semantics.

### ProgrammingDecision v0

Can initially be config / editorial record / adapter:

```text
thing_ref
reason
why_now
window
sequence_context
surface_eligibility
```

No table required until repeated operational need.

### Home

Current program is selected by editorial reason, not `created_at`.

### Release

Derive or record actual audience availability.

Do not use:

- URL alone;
- draft/public flag alone;
- source operational status alone.

### History

Meaningful History includes:

- consequence;
- meaningful version;
- external event;
- post-release outcome;
- real Project milestone that changes meaning.

Do not promote generic activity log automatically.

### Telegram

Target:

```text
Programming Moment
→ DistributionDecision
→ delivery eligibility
→ Telegram outbox
```

Remove semantic dependency:

```text
Artifact submit
→ send
```

### Acceptance

- every editorial outbound has a human-readable `why now`;
- old Thing can resurface for real reason;
- publish without reason does not auto-distribute;
- activity without meaning does not become History;
- Release state corresponds to real audience availability.

---

## WAVE 5 — Continuation / Return

### Goal

Make `Thing → Thing` and truthful continuation visible and measurable.

### Implement

- one natural next object per important Thing where real;
- contextual related Thing;
- series continuation if real;
- History continuation;
- contributor outcome continuation;
- participation continuation.

### No requirement

- Follow relation;
- subscription;
- notification center;
- social feed.

### Analytics

Add narrow semantics:

- `thing_experience_start`;
- `continuation_open`;
- form-aware consumption;
- meaningful return derived where possible;
- Return Payoff review.

### Acceptance

For each reference Thing answer:

> **Если человеку это понравилось, что реально стоит открыть дальше?**

If answer is “ничего” — truthful closure beats fake recommendation.

---

## WAVE 6 — Dementor / Intervention

### Goal

Move from profile discovery toward Situation-based utility.

### Dementor profiles

Prioritize:

- viewpoint;
- Practice;
- authored Things;
- body of work;
- relevant Situations;
- meaningful results / History.

De-emphasize generic activity.

### Situation resolver v0

Can start as curated mappings:

```text
Situation class
→ relevant Thing
→ Method / Tool / Course
→ Human Intervention only if needed
```

No expert marketplace.

No skill directory required.

### Acceptance

A person with a concrete Situation can find useful Dementor value without first choosing an expert profile.

---

## WAVE 7 — Distribution hardening

### Goal

Connect existing transport to semantic routing.

### DistributionDecision v0

```text
distribution_trigger
target_intent
source
channel
message_ref
entry_object
promised_experience
next_step
delivery_eligibility
```

### Reuse

- sitemap;
- canonical runtime;
- Telegram transport;
- public routes;
- OG/Twitter metadata;
- GA4 transport.

### Improve

- Thing-specific social preview;
- canonical-host consistency;
- Share preserves exact Thing;
- Event QR → exact continuation;
- channel / intent / entry-object semantic attribution;
- destination QA before send.

### Acceptance

Every outbound / discoverability flow can answer:

```text
WHO / INTENT
→ WHY / TRIGGER
→ WHAT PROMISE
→ WHERE EXACTLY
→ WHAT EXPERIENCE
→ WHAT NEXT
```

---

## WAVE 8 — Monetization evidence / first small payment test

### Goal

Do not implement monetization architecture until value demand appears.

### Observe

- Thing Interest;
- Experience Interest;
- Intervention Interest;
- Support Interest;
- commitment;
- repeat demand.

### First paid test

Only after repeated external signal from different people.

Test:

- one value object;
- one price / exchange;
- one fulfillment contract;
- one small cohort.

Do not start with:

- Membership tiers;
- subscription platform;
- marketplace;
- complex catalog;
- CRM funnel.

### Acceptance

A paid hypothesis reaches:

```text
INTENT
→ COMMITMENT
→ PAYMENT
→ DELIVERY
→ observed satisfaction / repeat or explicit no-repeat
```

before scaling infrastructure.

---

## WAVE 9 — Product Principles / Anti-patterns v1

### Goal

Consolidate 01–14 into a short engineering/editorial constitution.

### Timing

После:

- authority stack landing;
- Waves 1–4 implemented at least on reference objects;
- first Product Health review.

### Output

`15 · PRODUCT PRINCIPLES / ANTI-PATTERNS`

Не больше 10–20 durable rules.

Не повторять ontology.

---

# 9. Priority order by impact

## P0 — remove active contradictions

1. Board browse without first Artifact requirement.
2. Home Thing-first / Program-cover hierarchy.
3. Contribution vs Direct Publish explicit split.
4. Telegram no longer semantically triggered by raw publication.
5. Internal/test analytics separation.

Почему P0:

Эти места **сейчас обучают человека неправильной модели Dementor**.

---

## P1 — semantic spine

1. ThingProjection;
2. Release truth;
3. ProgrammingDecision;
4. meaningful History;
5. Thing → Thing continuation;
6. qualified experience instrumentation.

Почему P1:

Они позволяют остальным surfaces гармонизироваться без duplicated ad-hoc logic.

---

## P2 — utility / distribution quality

1. Dementor body of work;
2. Situation resolver;
3. DistributionDecision;
4. Thing-specific previews;
5. Event / physical continuation;
6. semantic attribution.

---

## P3 — commercial validation

1. intent signals;
2. commitment;
3. first paid test;
4. fulfillment;
5. repeat.

Не раньше P0/P1 baseline.

---

# 10. Dependency graph

```text
AUTHORITY STACK LANDING
        ↓
W0 honest analytics + reference objects
        ↓
W1 first experience correction
        ↓
W2 ThingProjection semantic spine
        ↓
 ┌──────┼────────────┐
 ↓      ↓            ↓
W3      W4           W5 instrumentation starts
Contribution Programming  Continuation
 │      │            │
 └──┬───┴─────┬──────┘
    ↓         ↓
   W6        W7
Intervention Distribution
    \         /
     \       /
      ↓     ↓
       W8
 Monetization evidence
       ↓
       W9
 Principles consolidation
```

Analytics instrumentation проходит поперёк всех waves, а не отдельным финальным проектом.

---

# 11. PR implementation strategy

Не делать один mega-PR runtime harmonization.

Recommended PR sequence:

## Runtime PR A — Audience entry correction

Scope:

- Home hierarchy;
- Board browse gate;
- first-experience contradictions.

No semantic DB migration.

## Runtime PR B — ThingProjection v0

Scope:

- adapter;
- Board contextual renderer;
- reference object mappings.

## Runtime PR C — Contribution entry split

Scope:

- inbound vs public publish;
- composer contracts;
- optional additive schema.

## Runtime PR D — Programming / Release / History v0

Scope:

- why-now config / adapter;
- Home program selection;
- Release / History semantics;
- Telegram gating.

## Runtime PR E — Continuation + Product Health instrumentation

Scope:

- Thing→Thing;
- experience start;
- continuation;
- population-safe measurement.

## Runtime PR F — Dementor / Situation utility

Scope:

- body of work;
- Practice;
- Situation mapping.

## Runtime PR G — Distribution hardening

Scope:

- semantic routing;
- previews;
- share;
- QR;
- attribution.

Commercial runtime PR появляется только после evidence.

---

# 12. Staging → production rollout

Каждый runtime PR должен проходить:

```text
semantic acceptance
→ staging visual / browser QA
→ anonymous entry QA
→ authenticated/member regression
→ analytics event QA
→ production release gate
```

Нельзя проверять только:

- «страница открывается»;
- «RPC работает»;
- «тесты зелёные».

Нужно проверять authority-level question.

Пример Board:

> **Понимает ли anonymous person, что происходит и что можно открыть, не понимая Artifact taxonomy?**

Пример Home:

> **Можно ли получить первое доказательство Dementor до Join?**

Пример Telegram:

> **Есть ли реальная причина получить именно это сообщение сейчас?**

---

# 13. Acceptance gates by package layer

## 01–04 Audience / Value gate

- first value before account;
- Thing proof visible;
- Join optional;
- Home functions as Program cover.

## 05–06 Product / Board gate

- source entity type does not define public meaning;
- ThingProjection handles multiple source types;
- Board card sparse/contextual;
- no universal Thing table required.

## 07–08 Program / Return gate

- outbound has why-now;
- meaningful continuation exists;
- no notification debt;
- return points to expected value.

## 09 Contribution gate

- inbound ≠ direct publish;
- no automatic public exposure;
- editorial closure exists;
- provenance preserved.

## 10 Intervention gate

- Situation can resolve to useful resource without expert browsing;
- human Intervention not default upsell.

## 11–12 Message / Distribution gate

- promise matches destination;
- Thing can be shared directly;
- Home/Board not generic catch-all destinations;
- transport reuses existing infra.

## 13 Monetization gate

- no paid model without real value evidence;
- one concrete value object per first test;
- payment does not buy status/editorial priority.

## 14 Metrics gate

- external/internal population declared;
- opens not called consumption;
- form-aware experience defined;
- Thing→Thing measurable;
- baseline before target.

## 15 Principles gate

- rules consolidate actual authorities;
- no new ontology;
- rules are usable in review / implementation decisions.

---

# 14. Measurement plan during implementation

## Baseline before Wave 1

Record:

- population quality;
- Home → concrete Thing opens;
- Event / Course / Project direct opens;
- Board anonymous/member behavior;
- recommendation clicks;
- direct returns where observable.

Do not interpret these as final Product Health yet.

## After Wave 1–2

Measure:

- Qualified Entry;
- experience starts;
- Thing → Thing;
- Home → Thing vs Home → Join;
- Board → Thing;
- direct Thing entry.

## After Wave 3

Measure:

- Contribution submitted;
- acknowledgement;
- disposition;
- closure;
- direct publish separately.

## After Wave 4–5

Measure:

- Programming Moment → qualified experience;
- continuation;
- meaningful return;
- Return Payoff where observable.

## After Wave 6–7

Measure:

- Situation → resource;
- authored Thing → body of work;
- channel/intent → qualified experience;
- Share → recipient experience where privacy-safe.

## After evidence appears

Measure 13:

- explicit intent;
- commitment;
- payment;
- fulfillment;
- refund/failure;
- repeat.

---

# 15. What NOT to build now

Do not build as part of harmonization:

- universal `dc_things` table;
- full content migration into new ontology;
- social feed;
- marketplace;
- expert directory;
- mandatory Follow system;
- notification center as retention engine;
- membership tiers;
- subscription billing because DaaS says «по подписке»;
- universal workflow engine;
- universal History from every Activity;
- separate analytics platform;
- data warehouse before current telemetry is semantically usable;
- AI recommendation system before curated Thing→Thing works;
- universal distribution database before routing decisions repeat enough to require one.

---

# 16. Technical-debt items that should be folded into waves

These are not separate product initiatives.

## Canonical / previews

- remove stale non-production canonical/OG hosts;
- complete Thing-specific social preview coverage.

Fold into Wave 7.

## Board subtype legacy

- keep DB compatibility initially;
- remove mandatory UX dependency.

Fold into Wave 3.

## Activity / History ambiguity

- stop using generic Activity as audience meaning;
- add explicit meaningful History only where needed.

Fold into Wave 4.

## Telegram publication coupling

- preserve worker/outbox;
- replace semantic eligibility.

Fold into Wave 4/7.

## Analytics contamination

- solve before interpreting growth / demand.

Wave 0.

## Package index drift

- one clean update after authority stack landing.

Wave 0 governance.

---

# 17. Definition of Done — package implemented in Dementor Club

01–14 can be considered materially implemented when all conditions below are true.

## Audience

- anonymous person can encounter meaningful value immediately;
- watching alone is complete;
- account / Join / Contribution are optional branches.

## Product

- key public objects resolve to Thing semantics through projection;
- Forms / Releases / Projects remain distinct;
- current source truth remains operationally intact.

## Program

- current program is editorial, not chronological;
- meaningful updates have why-now;
- Home reflects current Program.

## Board

- Board answers «что сейчас происходит?»;
- cards are contextual Things, not database rows;
- user is not forced to understand Artifact subtype.

## Contribution

- inbound editorial path and direct publish path are visibly separate;
- closure exists.

## Return

- important Things have truthful continuation / closure;
- return can happen without Follow;
- notifications do not manufacture debt.

## Dementor / Utility

- body of work proves Dementor;
- Situation can lead to smallest sufficient Intervention.

## Marketing / Distribution

- Thing proves positioning;
- promise matches exact destination;
- outbound is semantically gated;
- share/search/direct work without forcing generic landing pages.

## Monetization

- no status-based paid ladder;
- commercial hypothesis, if any, is backed by behavioural evidence and fulfillment.

## Metrics

- population is honest;
- qualified experience is measurable;
- Thing→Thing and Return are observable;
- clicks / opens are not treated as value proof.

## Governance

- package index reflects current authorities;
- `15` consolidates principles after implementation evidence;
- no duplicate competing ontology has been introduced.

---

# 18. Recommended immediate execution

If implementation begins immediately, the next concrete actions should be:

### 1. Finish authority landing / restack

Do before multiple runtime branches start citing different package states.

### 2. Create Runtime PR A

**Audience Entry Correction**:

- Home Program Cover v1;
- Board browse without publication prerequisite;
- direct promised destinations;
- no forced Join before value.

### 3. In parallel, analytics baseline

- internal/test separation;
- select reference Things;
- define experience start semantics.

### 4. Then Runtime PR B

ThingProjection v0 over current sources.

### 5. Then Runtime PR C + D

Contribution split and Programming/Release/History.

These steps give the highest semantic payoff without large schema risk.

---

# Final decision

Current Dementor Club should **not** be rebuilt around the 15-point package.

It should be **reinterpreted through it**.

The existing project already contains enough operational structure to make that practical.

The implementation strategy is therefore:

```text
REMOVE CONTRADICTIONS
→ ADD SEMANTIC PROJECTION
→ SPLIT USER CONTRACTS
→ ADD EDITORIAL TRUTH
→ BUILD CONTINUATION
→ HARDEN DISTRIBUTION
→ MEASURE VALUE
→ TEST MONEY ONLY AFTER VALUE
→ CONSOLIDATE PRINCIPLES
```

Canonical implementation stance:

> **PRESERVE WORKING INFRASTRUCTURE. REPLACE WRONG PRODUCT MEANING.**

And the most important sequencing rule:

> **FIRST FIX WHAT THE USER IS BEING TAUGHT ABOUT DEMENTOR. THEN ADD THE MISSING SEMANTICS. ONLY THEN ADD NEW INFRASTRUCTURE WHERE THE SEMANTICS PROVE IT IS NEEDED.**
