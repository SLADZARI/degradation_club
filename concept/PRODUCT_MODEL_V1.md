# DEMENTOR CLUB — PRODUCT MODEL v1

Status: **WORKING CANON / product ontology authority**  
Updated: **2026-09-15**

## Authority scope

This document defines the **product-semantic model** of Dementor Club: what the core objects mean, how they relate, and which distinctions every implementation and surface must preserve.

It refines the ontology already established in:

- `concept/DEMENTOR_CLUB_JTBD_PRODUCT_THESIS_V2.md`;
- `concept/CJM_CLUB_V1.md`;
- `concept/CJM_BOARD_PARTICIPATION_V1.md`;
- `concept/AUDIENCE_ENTRY_MAP_V1.md`;
- `concept/VALUE_ARCHITECTURE_V1.md`.

It does **not** by itself require a new database table for every term below.

Canonical rule:

**PRODUCT SEMANTICS ≠ DATABASE TABLE LIST ≠ UI COMPONENT LIST**

A product-semantic object may be backed by an existing `dc_artifact`, `dc_entity`, Event, Program or another canonical source. Conversely, Board, Home, Activity, Profile and Card are projections, not product entities.

---

# 0. Главная модель

Dementor начинается не с пользователя и не с поста.

Базовый цикл:

**OBSERVATION → THING → FORM → RELEASE → HISTORY**

Если для появления вещи требуется продолжительное совместное действие:

**THING ↔ PROJECT**

Если в Thing / Project можно войти:

**THING / PROJECT → PARTICIPATION OPPORTUNITY → PARTICIPANT RELATION**

Если работа упёрлась в реальную ситуацию:

**SITUATION / BLOCKER → INTERVENTION → DEMENTOR / METHOD / TOOL / COURSE / OTHER THING**

После Release History может породить новое Observation и новую Thing.

---

# 1. OBSERVATION

## Определение

**OBSERVATION — зафиксированное наблюдение о реальности, которое может, но не обязано, породить Thing.**

Observation отвечает:

**«Что мы заметили?»**

Observation может быть:

- коротким текстом;
- фотографией;
- скриншотом;
- ссылкой;
- новостью;
- голосовой мыслью;
- описанием ситуации;
- чужой фразой;
- повторяющимся паттерном.

Observation ещё не является произведением, продуктом, Project или обещанием Release.

## Связи

- одно Observation может породить 0..N Things;
- одна Thing может опираться на 1..N Observations;
- Observation может остаться только Observation.

**Не каждое наблюдение надо спасать продуктом.**

---

# 2. THING

## Определение

**THING — центральная продуктово-редакционная идентичность самостоятельной штуки, за жизнью которой имеет смысл следить.**

Thing отвечает:

**«Что это за штука?»**

Thing удерживает смысловую идентичность через изменение формы, производство, Releases и History.

Пример:

> заметили абсурд → решили сделать игру → появился prototype → игра вышла → вышла новая версия → кто-то сделал remix.

Это может оставаться одной Thing, пока человек воспринимает происходящее как жизнь одной самостоятельной работы.

## Важная граница

**Thing — продуктовая семантика, а не обязательное имя таблицы.**

В production Thing может быть представлена через разные канонические источники:

- Board-native Artifact, если сама публикация является самостоятельной вещью;
- Event;
- Program / Course;
- Product / Object;
- другой `dc_entity`;
- отдельную Thing registry в будущем, если реальная эксплуатация этого потребует.

Нельзя создавать новую таблицу `things` только потому, что слово появилось в этом документе.

## Когда нужна отдельная Thing

Тест:

**Может ли человек встретить эту штуку отдельно и считать её самостоятельным произведением / опытом / продуктом?**

Если да — это сильный кандидат на отдельную Thing.

Project может породить несколько самостоятельных Things.

---

# 3. ARTIFACT — IMPLEMENTATION TERM

`Artifact` уже существует в production и сохраняется как полезный implementation term.

## Product meaning

Artifact может выполнять две разные функции:

### A. Contribution / Observation carrier

Пользователь принёс текст, скрин, приглашение, заметку или другой материал.

Это ещё не обязательно полноценная Thing.

### B. Native Board Thing

Сам Artifact уже является самостоятельной опубликованной вещью: например короткий текст, объявление, изображение или другая Board-native форма.

## Каноническое правило

**ARTIFACT ≠ универсальный публичный тип всех Things.**

Event, Program, Project и другие mature domain entities не обязаны превращаться в Artifact, чтобы существовать.

Board может показывать их как projection.

Текущие production-поля `promoted_entity_type / promoted_entity_id` рассматриваются как transitional relation, а не как доказательство того, что весь будущий Product Model должен строиться вокруг promotion ladder.

---

# 4. FORM

## Определение

**FORM — способ, которым Thing становится воспринимаемой или переживаемой человеком.**

Form отвечает:

**«Во что эта Thing превратилась?»**

Примеры:

- text;
- post;
- meme;
- image;
- video;
- game;
- tool;
- service;
- course;
- event;
- experiment;
- physical object;
- audio;
- performance;
- другой формат.

## Form ≠ Thing

Thing — идентичность.

Form — выражение.

## Form ≠ operational entity

Если Thing имеет Form `event`, production всё равно может использовать специализированный Event entity с датой, capacity и location.

Если Thing имеет Form `course`, production может использовать Program entity с delivery semantics.

Form описывает опыт аудитории, а не отменяет доменную модель.

## Primary Form

В v1 у Thing может быть один `primary_form` для основной редакционной классификации.

Конкретный Release может иметь собственную release-form / version expression, если это нужно.

---

# 5. PROJECT

## Определение

**PROJECT — временный контейнер для продолжительного совместного действия, необходимого для появления одной или нескольких Things.**

Project отвечает:

**«Что мы сейчас вместе пытаемся довести до существования?»**

Project появляется, когда реально нужны:

- продолжительность;
- несколько участников;
- координация;
- несколько шагов;
- blockers;
- несколько Releases;
- одна или несколько связанных Things.

## Project ≠ Form

Project не является `game`, `course`, `event` или `post`.

Например:

**Dementor Battle** — Project.

Внутри могут появиться:

- игра — Thing / Form;
- лендинг — Thing;
- видео — Thing;
- мероприятие — Thing.

## Кардинальность v1

- Project может иметь 1..N Things;
- Thing может существовать без Project;
- у Thing допустим один `primary_project` в v1;
- cross-project relations могут появиться позже, если возникнет реальная потребность.

## Project не mini-Jira

Product Model требует только смыслового continuity:

- premise / исходное Observation;
- что пытаемся сделать;
- какие Things уже существуют;
- кто участвует;
- что сейчас мешает;
- что должно появиться следующим.

---

# 6. AUTHOR / PERSON / DEMENTOR

Здесь важно не создать вторую систему идентичности.

## PERSON

Canonical identity человека остаётся Person / Profile в identity layer.

## AUTHOR RELATION

Авторство — связь человека с Thing / Release / Project.

Возможные роли:

- author;
- co-author;
- editor;
- contributor;
- facilitator;
- participant;
- intervention source.

## DEMENTOR

**DEMENTOR — публичная авторская проекция Person + подтверждённая scoped role + body of work + practice.**

Dementor не является отдельным дубликатом Person и не должен требовать отдельной независимой identity record.

Продуктово Dementor раскрывается через:

**point of view + body of work + practice**

а технически может собираться из:

- Profile / Person;
- `dc_role_assignments`;
- `dc_entity_assignments`;
- связанных Things / Projects / Interventions.

## Product rule

Dementor обычно обнаруживается через:

**THING**

или:

**INTERVENTION**

а не через каталог навыков.

---

# 7. STATE — ВАЖНОЕ УТОЧНЕНИЕ

Предыдущий продуктовый shorthand:

**ПРИНЕСЛИ → МУТЯТ → ВЫШЛО / ОСТАНОВИЛИ**

остаётся полезен для первого Release, но **не должен реализовываться как единственный необратимый scalar state всей Thing**.

Причина:

Thing может уже иметь Release и одновременно снова находиться в производстве следующей версии.

Например:

> игра уже вышла v0.1;
> команда мутит v1.

Поэтому Product Model v1 разводит два измерения.

## RELEASE STATE

Отвечает:

**«Есть ли уже что-то, что живёт самостоятельно у аудитории?»**

Минимально:

- `UNRELEASED`;
- `RELEASED`.

## PRODUCTION STATE

Отвечает:

**«Что сейчас происходит с производством?»**

Минимально:

- `IDLE` — сейчас активное производство не идёт;
- `MAKING` — реально делают следующую доступную версию / форму;
- `STOPPED` — продолжение сознательно остановлено.

## Derived editorial labels

Публичные слова можно получать из комбинации состояния и контекста:

### ПРИНЕСЛИ
`UNRELEASED + IDLE`, Observation удерживается как объект внимания.

### МУТЯТ
`PRODUCTION_STATE = MAKING`.

### ВЫШЛО
`RELEASE_STATE = RELEASED`.

### ОСТАНОВИЛИ
`PRODUCTION_STATE = STOPPED`.

Это позволяет валидные комбинации:

- **ВЫШЛО + МУТЯТ v2**;
- **ВЫШЛО + ОСТАНОВИЛИ дальнейшее развитие**.

## Что не является State

- `МОЖНО ВПИСАТЬСЯ` — Participation;
- `СЛУЧИЛОСЬ` — History;
- `GAME / COURSE / EVENT` — Form;
- `FEATURED` — editorial presentation.

---

# 8. PARTICIPATION OPPORTUNITY

## Определение

**PARTICIPATION OPPORTUNITY — конкретная открытая точка, через которую человек может войти в жизнь Thing или Project.**

Отвечает:

**«Можно ли сюда вписаться и что именно сделать?»**

Примеры:

- протестировать;
- прийти;
- дать взгляд;
- прислать материал;
- помочь собрать;
- записать звук;
- сыграть;
- принять участие в эксперименте;
- стать соавтором.

Минимальные свойства:

- target Thing / Project;
- `ask`;
- context;
- commitment;
- entry action;
- status: `OPEN | PAUSED | CLOSED`.

Thing / Project может иметь 0..N Participation Opportunities.

---

# 9. PARTICIPANT RELATION

Participation Opportunity и участие человека — не одно и то же.

## Определение

**PARTICIPANT RELATION — связь Person ↔ Thing / Project, возникшая после конкретного входа в действие.**

Она может фиксировать:

- через какую Opportunity человек вошёл;
- какую роль фактически выполняет;
- когда вошёл;
- активна ли связь сейчас;
- на какой Thing / Project относится.

В production эта relation может быть реализована разными существующими механизмами: assignment, registration, enrollment или отдельной participation relation — в зависимости от типа объекта.

Не создаём одну универсальную CRM-таблицу только ради симметрии.

---

# 10. RELEASE

## Определение

**RELEASE — конкретный момент, когда Thing или её новая самостоятельная версия становится доступна аудитории.**

Release отвечает:

**«Что именно стало существовать самостоятельно и когда?»**

Thing может иметь 0..N Releases.

Release может фиксировать:

- Thing;
- version / label;
- Form;
- released_at;
- destination / URL / location;
- editorial framing;
- authors;
- availability state.

## RELEASE > COMPLETION

Release важнее абстрактного 100% completion.

## Event clarification

Для Event нельзя автоматически считать `анонс опубликован` и `событие состоялось` одним и тем же Release.

- публикация анонса / регистрационной страницы может быть публичной availability milestone;
- occurrence события остаётся Event / Run fact и может фиксироваться в History;
- отдельные материалы после события могут стать собственными Releases / Things.

Конкретная operational semantics Events определяется Event model, а не этой общей онтологией.

---

# 11. HISTORY EVENT

## Определение

**HISTORY EVENT — значимое событие в жизни Thing или Project.**

History отвечает:

**«Что с этим происходило?»**

History append-only на смысловом уровне: новые факты добавляются, а не переписывают прошлое.

Примеры:

- выбрали Form;
- начали Project;
- появился prototype;
- открылась Participation Opportunity;
- случился Release;
- сыграли 100 человек;
- что-то сломалось;
- появился remix;
- показали на фестивале;
- остановили продолжение;
- спустя полгода Thing ожила;
- появился новый Release;
- из Thing выросла другая Thing.

## REACTION

Reaction — один из классов History Event:

**что произошло с Thing после того, как она стала жить у аудитории.**

Reaction не lifecycle stage.

## History ≠ Activity

History принадлежит Thing / Project.

Activity — projection подходящих History / Release / Participation событий для конкретной поверхности или человека.

---

# 12. SITUATION / BLOCKER

Situation / Blocker — контекст, в котором становится объяснимым вмешательство.

Он отвечает:

**«Во что мы реально упёрлись?»**

Не требуется превращать каждый blocker в отдельную публичную entity.

Это может быть structured record только там, где продукт реально использует его для continuity или Intervention.

---

# 13. INTERVENTION

## Определение

**INTERVENTION — контекстное подключение Dementor, метода, инструмента, курса или другой Thing к конкретной Situation / Blocker.**

Intervention отвечает:

**«Почему именно сейчас это предложение имеет смысл?»**

Схема:

**SITUATION → DIAGNOSIS → INTERVENTION → RESOURCE / DEMENTOR → NEXT ACTION**

Resource может быть:

- Dementor;
- method;
- Tool Thing;
- Course / Program Thing;
- article / text Thing;
- consultation;
- другая существующая Thing.

## Канонический принцип

**SITUATIONS > SKILLS**

Если нельзя объяснить, почему предложение появляется сейчас, это обычная recommendation / advertising, а не Dementor Intervention.

---

# 14. SPECIALIZED DOMAIN ENTITIES

Product Model не отменяет специализированные operational entities.

Например:

- Event может иметь location, capacity, registrations;
- Program может иметь delivery_mode, enrollments, runs;
- Product может иметь price / inventory / orders;
- Project может иметь собственную operational model.

Эти сущности могут одновременно участвовать в продуктовой семантике Thing.

Пример:

**Course**

- Product semantic: Thing, Form = Course;
- Operational entity: Program;
- Release: опубликованная доступная версия курса;
- Intervention resource: этот же Course может появиться в другой Situation.

Никакого конфликта между слоями нет, если semantics и operational fields не смешиваются.

---

# 15. RELATION MODEL v1

## Observation ↔ Thing

Many-to-many допустим семантически.

## Project → Thing

1 Project → N Things.

## Thing → Form

Thing имеет primary Form; Releases могут уточнять выражение версии.

## Person ↔ Thing

Через author / co-author / editor / contributor relations.

## Person ↔ Project

Через scoped assignment / participant relation.

## Thing / Project → Participation Opportunity

0..N.

## Person ↔ Participation Opportunity

Через Participant Relation.

## Thing → Release

0..N.

## Thing / Project → History Event

0..N.

## Thing / Project → Intervention

0..N, только при объяснимом Situation context.

## Intervention → Person / Resource Thing

0..N depending on actual intervention.

## Thing → Thing

Допустимы явные смысловые relations, например:

- inspired_by;
- continuation_of;
- remix_of;
- produced_from;
- related.

Не вводить большой relation taxonomy до реальной потребности.

---

# 16. ENTITY / RECORD / DIMENSION / PROJECTION

Чтобы не распухала архитектура, различаем уровни.

## Product-semantic entities / records

- Observation;
- Thing;
- Project;
- Release;
- Participation Opportunity;
- Participant Relation;
- History Event;
- Intervention;
- Person / author relation.

## Controlled dimensions

- Form;
- Release State;
- Production State;
- attribution role;
- Participation Opportunity status.

## Operational specialized entities

- Event;
- Program / Run / Session;
- Product / Order;
- other domain objects only when required by real operations.

## Projections / surfaces

- Board;
- Home;
- Activity;
- Dementor public profile;
- Project page;
- Card;
- Feed;
- search result;
- Telegram / social projection.

**Projection never becomes a second source of semantic truth.**

---

# 17. BOARD ADAPTER MODEL

Текущий production Board уже использует полезную границу:

- native Artifact;
- entity projection;
- system communication.

Product Model сохраняет этот implementation pattern.

## Native Artifact

Может представлять:

- contribution / observation carrier;
- самостоятельную Board-native Thing.

## Entity projection

Board показывает канонический Event / Program / Project / другую Thing-backed entity без создания независимой копии смысла.

## System

Operational system notices могут существовать вне Thing ontology, если это чистое сообщение платформы.

Например maintenance notice не обязан становиться Thing.

---

# 18. HOME / BOARD / ACTIVITY

## Home

Editorial projection программы.

Отвечает:

**«Что стоит посмотреть?»**

## Board

Projection живущих Things / Projects / opportunities.

Отвечает:

**«Что сейчас происходит?»**

## Activity

Projection значимых изменений:

- Releases;
- History Events;
- Participation changes;
- editorial reaction to contribution;
- new Thing from followed Dementor.

Activity не создаёт собственную ontology.

---

# 19. Что НЕ является самостоятельной core entity по умолчанию

## Skill

Проявляется через Person / Dementor + Situation + Intervention.

## Opportunity

Это Participation Opportunity.

## Announcement

Presentation / Form / Artifact, но не новая универсальная domain entity.

## Update

History Event.

## Result

Может быть Release, History Event или новая Thing — отдельной универсальной entity не требуется.

## Community

Культурная / навигационная среда, а не core Product Model object.

## Card

UI representation.

## Feed

Presentation strategy.

---

# 20. INVARIANTS

Эти правила нельзя ломать интерфейсом или техническим удобством.

1. **Thing — смысловая идентичность, не карточка.**
2. **Artifact не становится универсальным именем всех вещей.**
3. **Form ≠ Thing.**
4. **Project ≠ Form.**
5. **Release ≠ final completion.**
6. **History ≠ State.**
7. **Participation Opportunity ≠ Participant Relation.**
8. **Не каждое Observation становится Thing.**
9. **Не каждой Thing нужен Project.**
10. **Не каждой Thing нужна Participation Opportunity.**
11. **Dementor не дублирует Person identity.**
12. **Intervention всегда имеет объяснимый Situation context.**
13. **Board / Home / Activity не создают параллельные копии semantic objects.**
14. **Production может сохранять существующие canonical entities, если они способны выразить эту семантику.**
15. **Новая таблица создаётся только под реальный operational flow, а не ради красивой ontology.**

---

# 21. PRODUCT EXAMPLES

## Короткий пост

Observation  
→ Thing / Artifact-backed  
→ Form: Text  
→ Production: MAKING  
→ Release  
→ Release State: RELEASED  
→ History

Без Project.

Без Participation.

## Игра

Observation  
→ Thing  
→ Form: Game  
→ Project  
→ Production: MAKING  
→ Participation Opportunity: тестировать prototype  
→ Situation / blocker  
→ Intervention  
→ Release v0.1  
→ Release State: RELEASED  
→ Production: MAKING v1  
→ Release v1  
→ History

Здесь видно, почему `ВЫШЛО` и `МУТЯТ` должны уметь сосуществовать.

## Event

Observation / premise  
→ Thing  
→ Form: Event  
→ operational Event entity  
→ Participation Opportunity: прийти / зарегистрироваться  
→ public availability  
→ occurrence  
→ History  
→ post-event Things / materials if they become independent

## Course

Observation / repeated Situation  
→ Thing  
→ Form: Course  
→ operational Program entity  
→ Release  
→ может позже выступать Resource Thing внутри Intervention.

---

# 22. PRODUCT DATA CONTRACT — НЕ DB SCHEMA

Минимальная семантика, которую implementation должен уметь выразить.

## Thing

- stable identity;
- title / working title;
- summary;
- linked observations;
- primary form;
- release state;
- production state;
- primary project optional;
- author relations;
- releases;
- participation opportunities;
- history;
- related Things optional.

## Observation

- content / source;
- submitter / provenance;
- created_at;
- linked Things.

## Project

- premise;
- Things;
- participants;
- current blocker optional;
- opportunities;
- interventions;
- history.

## Participation Opportunity

- target;
- ask;
- context;
- commitment;
- status;
- entry action.

## Participant Relation

- person;
- target;
- opportunity / source;
- scoped role;
- active state;
- timestamps.

## Release

- Thing;
- version / label;
- form;
- released_at;
- destination;
- framing;
- authors;
- availability.

## History Event

- target;
- event type;
- timestamp;
- description;
- related objects.

## Intervention

- target;
- situation;
- diagnosis;
- resource / Dementor;
- next action;
- timestamp.

Это продуктовый contract. Конкретная нормализация БД определяется production review и реальными flows.

---

# 23. CURRENT PRODUCTION COMPATIBILITY PRINCIPLE

В текущей системе уже существуют полезные канонические слои:

- `dc_artifacts`;
- `dc_entities`;
- `dc_programs`;
- `dc_events`;
- `dc_entity_assignments`;
- Board position / projection model.

Product Model v1 **не требует их немедленно заменять**.

Порядок изменений:

1. зафиксировать semantic contract;
2. определить mapping существующих объектов;
3. сохранить working production flows;
4. добавить недостающую semantics только там, где она нужна новому поведению;
5. миграцию делать отдельным техническим решением после product approval.

Текущий mapping и gaps описываются отдельно в:

`operations/PRODUCT_MODEL_PRODUCTION_ENTITY_REVIEW_2026-09-15.md`

---

# 24. Вопрос для любой новой функции

Перед новой entity / type / card команда спрашивает:

- Это новая Thing или новая Form существующей Thing?
- Это Project или просто несколько действий вокруг Thing?
- Это Release или History Event?
- Это Participation Opportunity или человек уже участвует?
- Это публичная авторская проекция Dementor или новая identity сущность действительно нужна?
- Это Intervention в конкретной Situation или generic recommendation?
- Это semantic object или всего лишь новая projection существующих данных?

Если последнее — **не создаём новую core entity без необходимости.**

---

# Каноническая схема

**OBSERVATION**  
что заметили

↓

**THING**  
какую самостоятельную штуку удерживаем

↓

**FORM**  
как её можно пережить

↘ при необходимости

**PROJECT**  
как совместно доводим до существования

↘

**PARTICIPATION OPPORTUNITY → PARTICIPANT RELATION**  
куда и как можно вписаться

↘ при blocker

**SITUATION → INTERVENTION → DEMENTOR / METHOD / RESOURCE THING**

↓

**RELEASE**  
что стало жить самостоятельно

↓

**HISTORY**  
что с этим произошло

↓

возможно:

**NEW OBSERVATION → NEW THING**

---

# Главное правило

**Dementor Club не состоит из пользователей и их постов.**

Он состоит из:

**наблюдений → вещей → форм → выпусков → последствий.**

Люди появляются как наблюдатели, авторы, редакторы, участники и Dementors — и собираются **вокруг вещей**, а не наоборот.
