---
artifactId: dementor-club.reference.board-information-architecture-v0.1
project: dementor-club
documentType: ARCHITECTURE_WORKING_DRAFT
projectStage: CLARITY
status: DRAFT
version: 0.1
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: REFERENCE
---

# Dementor Club — Board Information Architecture v0.1

**Status:** DRAFT / REFERENCE / NOT IMPLEMENTED  
**Purpose:** рабочее место для гармонизации информационной архитектуры Community Board до изменения production-кода, схемы БД или permissions.  
**Boundary:** Discussion ≠ Decision. Этот документ не меняет утверждённые Membership v2 и Board Access v2 правила автоматически.

## 0. Зачем этот документ

Community Board уже существует как spatial surface внутри Workspace, но на одном экране сейчас пересекаются несколько разных смыслов:

- Member Artifact / приколотое объявление;
- клубная информация;
- фильтры по источнику и типу сущности;
- live / expired / archived lifecycle;
- будущие связи между публикациями;
- переходы на Course / Event / Project и другие содержательные объекты;
- разные уровни доступа Guest / Member / Dementor / Owner Admin.

Цель текущей работы — сначала определить **что именно является объектом Board, что только отображается на Board, кто это видит и на каком уровне**, и только потом менять runtime.

Главный принцип:

> **Board card is a projection, not automatically the source entity.**

Карточка на доске не должна становиться новой параллельной сущностью, если источник уже существует как Artifact, Program, Event, Project или другой canonical object.

---

# 1. Current factual inventory

Ниже — текущие подтверждённые факты production/runtime. Это inventory, а не целевая архитектура.

## 1.1 Board surface

Canonical member route:

`/workspace/board/`

Board работает как spatial canvas:

- pan;
- zoom;
- focus;
- persistent Member Artifact positions;
- open card;
- filters;
- own-card locator;
- create/pin CTA depending on user state.

## 1.2 Current canonical Member publication object

Current DB owner:

`public.dc_artifacts`

Сейчас `artifact_type` фактически ограничен значением:

`notice`

То есть production-модель пока не подтверждает отдельные Artifact-типы `post`, `article`, `task`, `application`, `course` и т.п.

Current Artifact lifecycle:

`draft → publishing → active → expired / archived`

Дополнительно существует terminal-ish state:

`removed`

Current visibility:

`community`

## 1.3 Current live Board rule

Member Board runtime отображает только `status = active` и дополнительно скрывает записи с прошедшим `expires_at`.

Authenticated Guest использует `dc_guest_board_read_v1`, который также показывает только фактически live записи:

- authenticated session exists;
- `visibility = community`;
- `status = active`;
- `published_at IS NOT NULL`;
- `starts_at` уже наступил или пуст;
- `expires_at` ещё не наступил или пуст.

Следствие: запись может физически существовать в `dc_artifacts`, но исчезнуть с live Board.

## 1.4 Archive / history current owner

Архив не удаляет Artifact.

`dc_close_artifact_v1` переводит активную/истёкшую запись в `archived` и сохраняет сам объект.

Current personal history owner:

`/workspace/artifacts/`

Он читает существующие `dc_artifacts` и показывает собственные active/archive records без создания второй archive-сущности.

## 1.5 Production snapshot observed 2026-09-12

Read-only audit live Supabase:

- total Artifact records: **8**;
- DB status `active`: **3**;
- `archived`: **3**;
- `expired`: **2**;
- все 3 записи со status `active` на момент проверки уже имели `expires_at < now()`;
- у части archived/expired records сохранилась spatial position;
- две старые archived records не имеют `dc_artifact_board_positions` row;
- `promoted_entity_id` / `promoted_entity_type` сейчас не используются ни одним из 8 Artifact;
- отдельной Artifact↔Artifact relation table сейчас нет.

Это snapshot evidence, не долгоживущий authority.

## 1.6 Existing entity layer

В production уже существуют canonical entity records:

- `PROGRAM`;
- `EVENT`;
- `PROJECT`.

Отдельный Board entity model уже умеет conceptually превращать их в Board projections:

- event;
- program;
- course;
- practice;
- project;
- forming.

Но current fullscreen Workspace Board **намеренно не рендерит** эти entity projections в spatial canvas.

## 1.7 Current filter vocabulary

Current Board filter model содержит два уровня.

Primary:

- `ВСЁ`;
- `ОТ ЛЮДЕЙ`;
- `ОТ КЛУБА`.

Detail filters:

- `МЕРОПРИЯТИЯ`;
- `ПРОГРАММЫ`;
- `КУРСЫ`;
- `ПРАКТИКИ`;
- `ФОРМИРУЕТСЯ`;
- `ПРОЕКТЫ`.

Но fullscreen Board сейчас не показывает platform/entity projections. Поэтому часть filter vocabulary существует в коде, но не имеет полноценного содержательного соответствия на текущем canvas.

Это один из главных harmonization вопросов.

---

# 2. Approved access baseline — не менять молча

Board Access v2 остаётся текущим approved project-local authority для user-state permissions.

Canonical states:

1. `UNAUTHENTICATED`
2. `AUTHENTICATED_GUEST_DC9_INCOMPLETE`
3. `AUTHENTICATED_GUEST_DC9_COMPLETE`
4. `APPLICANT`
5. `MEMBER_NOT_ACTIVATED`
6. `MEMBER_ACTIVATED`
7. `DEMENTOR`
8. `OWNER_ADMIN`

Approved current Guest baseline:

- open Board — yes;
- see live Artifacts — yes;
- pan / zoom / focus / open — yes;
- react / interest — yes;
- respond — yes;
- create/publish — no;
- move cards — no;
- archive/close — no;
- moderate layout — no.

`+ ПРИКОЛОТЬ / + СОЗДАТЬ` для Guest является conversion gate, а не composer access.

Membership lifecycle boundary remains:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

Любая новая archive/history visibility должна отдельно определить, распространяется ли Guest read-access на historical cards. Это **ещё не approved**.

---

# 3. Working Board object model

Ниже — рабочая рамка для обсуждения. Не implementation schema.

## 3.1 Source object vs Board projection

Предлагаем разделять:

```text
SOURCE OBJECT
    ↓ projection
BOARD CARD
    ↓ open
DETAIL / SOURCE ROUTE
```

Примеры:

```text
Member Artifact / notice
    → Member card on Board

Event entity
    → Club Event card on Board

Program / Course entity
    → Club Program/Course card on Board

Project entity
    → Club Project card on Board
```

Board не должен копировать сущность целиком или становиться вторым владельцем её lifecycle.

## 3.2 Candidate source families

### A. MEMBER ARTIFACT

**Already exists / production.**

Текущий смысл: пользователь прикалывает Community notice / предложение / сообщение.

Нужно определить, достаточно ли одного semantic type `Artifact / Notice`, а «пост», «идея», «предложение» и т.п. являются presentation labels, либо нужны реальные subtypes.

### B. CLUB ENTITY PROJECTION

**Underlying entities already exist; fullscreen projection currently disabled.**

Candidates already supported by entity model:

- Event;
- Program;
- Course;
- Practice;
- Project.

Нужно решить, какие статусы сущности достойны Board projection и кто их видит.

### C. CONTENT / EDITORIAL

**Not yet established as a canonical Board source family by current inventory.**

Potential examples raised for discussion:

- post;
- article;
- blog publication;
- editorial note.

Перед реализацией необходимо найти canonical content owner или утвердить его. Нельзя создавать `board_posts`, если Content уже имеет другой owner.

### D. TASK / REQUEST

**Not currently approved as Community Board object.**

Нужно отделить:

- community call / request to people;
- internal operational task;
- personal task;
- project task.

Internal task по умолчанию не должен автоматически попадать на Community Board.

### E. APPLICATION

Membership Application является private membership-flow object и **не должна автоматически становиться Board content**.

Если слово «application» используется в смысле software/app/product, это отдельная entity/content classification и требует canonical source.

---

# 4. Five independent classification axes

Главная причина текущей путаницы: source, type, lifecycle, audience и visual filter могут смешиваться в одно поле. Их нужно разделить.

## Axis 1 — SOURCE / кто источник

Candidate canonical vocabulary:

- `MEMBER`
- `CLUB`
- `SYSTEM` — только если реально нужен системный projection

Current UI mapping:

- `ОТ ЛЮДЕЙ` → MEMBER
- `ОТ КЛУБА` → CLUB

## Axis 2 — OBJECT FAMILY / что это

Confirmed now:

- Artifact / Notice
- Event
- Program
- Course
- Practice
- Project

Unresolved candidates:

- Post
- Article
- Editorial
- Community Request
- App / Product
- Task

Не добавлять тип только ради фильтра. У каждого типа должен быть canonical source owner и lifecycle.

## Axis 3 — LIFECYCLE / что с объектом сейчас

Для Artifact уже существуют:

- draft
- publishing
- active
- expired
- archived
- removed

Board presentation needs a simpler user-facing lifecycle vocabulary, например:

- `LIVE`
- `HISTORY`
- `ARCHIVED`

Но mapping пока не утверждён.

В частности нужно решить:

- `expired` = автоматически History?
- `archived` = сознательно убрано автором/модератором?
- должны ли обе категории оставаться визуально доступны на Board?

## Axis 4 — AUDIENCE / кто видит

Must be evaluated independently from object type:

- PUBLIC / unauthenticated
- AUTHENTICATED GUEST
- APPLICANT
- MEMBER
- DEMENTOR
- OWNER ADMIN

Возможен отдельный scope на конкретную entity/group later, но он не должен появиться без real use case.

## Axis 5 — INTERACTION / что можно сделать

Independent capabilities:

- read;
- open detail;
- follow source link;
- react;
- respond;
- create;
- edit own;
- move own card;
- close/archive own;
- moderate others;
- connect objects;
- edit/delete connection.

Role name сам по себе не должен заменять capability matrix.

---

# 5. Information levels visible to user

Предлагаем проектировать Board не как один flat screen, а как несколько уровней информации.

## Level 0 — MAP / Board canvas

Задача: быстро понять, что происходит.

Card should contain only scan-level information:

- source marker;
- object family/type;
- title;
- short body/summary;
- author/club identity;
- current lifecycle marker;
- minimal activity signal;
- relation indicators if relations exist.

Не пытаться помещать всю сущность на карту.

## Level 1 — CARD DETAIL

Задача: понять конкретный объект без потери Board context.

Possible content:

- full Artifact body;
- media;
- reactions;
- responses;
- status/history;
- visible relations;
- CTA to canonical source.

Current Artifact detail route exists but Guest access is not yet harmonized with approved Board Access v2.

## Level 2 — CANONICAL SOURCE

Examples:

- Event page;
- Course page;
- Project page;
- Article/Post page if such canonical content type is approved;
- source Artifact record/detail.

Board does not own canonical editing of these source entities.

## Level 3 — PRIVATE OPERATION

Workspace-only management:

- author controls;
- moderation;
- member history;
- entity operation;
- internal task/project management;
- review/application flows.

Не смешивать private operation с community information display.

---

# 6. Archive / History working model

Current problem:

```text
Artifact exists in DB
→ expires or gets archived
→ disappears from Board
→ historical context and future relations become invisible
```

Target question is not «удалять ли архив», а:

> **как historical object продолжает существовать в информационной карте клуба, не превращая live Board в кладбище?**

Working direction for discussion:

### Default mode

`LIVE`

Показывает происходящее сейчас.

### Historical mode

`HISTORY / ARCHIVE`

Позволяет увидеть inactive records и переходить к ним по relations.

### Relation override

Если live object связан с historical object, пользователь может открыть/focus historical object независимо от current live filter.

### Visual treatment

Historical card должна выглядеть иначе, но оставаться тем же object projection, а не отдельной archive copy.

Need decisions:

- один canvas или отдельный archive view;
- показывать archived и expired вместе или отдельно;
- сохранять последнюю spatial position;
- что делать со старыми historical records без position row;
- доступны ли historical cards authenticated Guest;
- можно ли реагировать/respond на historical card или только читать.

---

# 7. Relations — working area

Current state:

- Artifact↔Artifact relations отсутствуют;
- `promoted_entity_type / promoted_entity_id` существуют, но это отдельная semantic boundary и не должны использоваться как generic relation;
- Board entity projections уже имеют source IDs.

Relation model should connect **source objects**, not random DOM cards.

Conceptually:

```text
SOURCE A
   ── relation ──> SOURCE B
```

Board then renders that relation between their projections.

Potential relation meanings for discussion only:

- `RELATED_TO`
- `CONTINUES`
- `RESULT_OF`
- `RESPONDS_TO`
- `BECAME / PROMOTED_TO`

Не утверждать список до проверки реальных сценариев клуба.

Key questions:

- directed or undirected relation;
- who may create relation;
- can Member connect only own Artifact or any visible object;
- may Club/Admin curate relations;
- can relation cross live/archive boundary;
- can Artifact relate to Event/Program/Project;
- what happens when source becomes archived/removed.

---

# 8. Current access map vs questions to decide

| Surface/capability | Unauth | Auth Guest | Applicant | Member | Dementor | Owner Admin | Status |
|---|---:|---:|---:|---:|---:|---:|---|
| Open Workspace Board | No | Yes | Yes | Yes | Yes | Yes | APPROVED |
| See live Member Artifacts | No | Yes | Yes | Yes | Yes | Yes | APPROVED |
| Pan/zoom/focus/open live card | No | Yes | Yes | Yes | Yes | Yes | APPROVED |
| React/respond live Artifact | No | Yes | Yes | Yes | Yes | Yes | APPROVED |
| Publish Member Artifact | No | No | No | Yes* | role/member rules | privileged | APPROVED |
| Move own active Artifact | No | No | No | Yes after activation | Yes | Yes | APPROVED |
| Archive own Artifact | No | No | No | Yes after Artifact exists | Yes | Yes | APPROVED |
| Moderate another Member Artifact | No | No | No | No | No by role alone | Yes | APPROVED |
| See historical/archived cards on Board | — | ? | ? | ? | ? | ? | OPEN |
| React/respond historical card | — | ? | ? | ? | ? | ? | OPEN |
| See Club entity projections | — | ? | ? | ? | ? | ? | OPEN / runtime currently disabled in fullscreen |
| Create relations | — | ? | ? | ? | ? | ? | OPEN |
| Moderate relations | — | — | — | ? | ? | ? | OPEN |

`*` subject to first Artifact / slot rules.

---

# 9. Filter architecture — to harmonize

Не делать filter taxonomy копией database schema.

Working proposal to evaluate:

## Row A — TIME / STATE

- `СЕЙЧАС`
- `ИСТОРИЯ`

## Row B — SOURCE

- `ВСЕ`
- `ОТ ЛЮДЕЙ`
- `ОТ КЛУБА`

## Row C — TYPE

Показывать только реально существующие canonical families.

Сегодня factual candidates:

- Events
- Programs/Courses/Practices
- Projects
- Member Artifacts

Posts/Articles/Tasks/Apps не добавлять до решения object ownership.

Alternative: type filters live only in a drawer to keep spatial Board simple.

This section is proposal only.

---

# 10. Anti-entropy rules for Board work

1. Existing owner before new table/module.
2. Artifact ≠ Event ≠ Program ≠ Project.
3. Board card ≠ source entity.
4. Archive ≠ deletion.
5. Expired ≠ deleted.
6. Filter label ≠ new entity type.
7. Role ≠ permission.
8. Authenticated Guest ≠ Member.
9. Membership Application ≠ Board publication.
10. Internal project task ≠ Community Board item by default.
11. Relation connects canonical source IDs, not visual coordinates.
12. Position remains owned by canonical Board position model; do not create archive-position v2 in parallel.
13. Fullscreen Board and My Artifacts history must not become competing history owners.

---

# 11. Inventory tasks before any implementation

This document becomes the collection point for the following passes.

### Pass A — Current object inventory

For every object currently capable of appearing or being referenced on Board record:

- canonical name;
- canonical source/table/file;
- owner;
- lifecycle;
- public/private surface;
- current Board projection;
- current permissions;
- current filters;
- current route.

### Pass B — Current production cards

Classify all existing Artifact records:

- semantic purpose;
- why it was pinned;
- live/history state;
- whether it refers to Course/Event/Project/content;
- whether it should have a relation instead of embedded text/link.

### Pass C — Content taxonomy

Resolve real need for:

- Notice;
- Post;
- Article;
- Community Request;
- Task;
- App/Product;
- Event;
- Program/Course/Practice;
- Project.

For each candidate answer:

`canonical entity or merely presentation label?`

### Pass D — Visibility matrix

For each approved object family:

- Public;
- Auth Guest;
- Applicant;
- Member;
- Dementor;
- Owner Admin.

Separate READ from ACTION permissions.

### Pass E — Archive/history

Fix:

- lifecycle transition;
- history visibility;
- interaction policy;
- spatial persistence/backfill;
- filter behavior;
- relation behavior.

### Pass F — Relations

Collect 5–10 real examples before choosing relation types/schema.

---

# 12. Decisions explicitly NOT made in v0.1

This draft does **not** decide:

- that Post is a new DB entity;
- that Article is a new DB entity;
- that Task belongs on Community Board;
- that every Club Event/Course/Project must appear on Board;
- that Guest can see archives;
- that archived cards are displayed by default;
- relation type vocabulary;
- relation permissions;
- new tables;
- production migrations;
- redesign of current spatial Board;
- merge/deploy.

---

# 13. Exit criteria for architecture phase

Before implementation Result is opened, we should have:

1. one canonical Board object/source map;
2. one agreed content taxonomy;
3. one lifecycle map for live/history/archive;
4. one role/capability matrix including archive;
5. one relation model grounded in real examples;
6. filter taxonomy derived from the object model rather than vice versa;
7. clear list of existing owners to extend;
8. explicit list of legacy/dead filters or mechanics to remove;
9. G6 acceptance criteria;
10. no parallel Board/history/content owner introduced.

Only after this should we decide whether the work extends `board-access-control-v2` or requires a new Board Information Architecture Result.
