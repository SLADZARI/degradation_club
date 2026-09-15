# DEMENTOR CLUB — BOARD PRODUCT MODEL v1

Status: **WORKING CANON / board semantics authority**  
Updated: **2026-09-15**

## Authority scope

Этот документ определяет, **как Board показывает живущие объекты Dementor Club**, не превращая продукт в форум, marketplace, CRM или список внутренних сущностей.

Он опирается на:

- `concept/DEMENTOR_CLUB_JTBD_PRODUCT_THESIS_V2.md`;
- `concept/CJM_CLUB_V1.md`;
- `concept/CJM_BOARD_PARTICIPATION_V1.md`;
- `concept/AUDIENCE_ENTRY_MAP_V1.md`;
- `concept/VALUE_ARCHITECTURE_V1.md`;
- `concept/PRODUCT_MODEL_V1.md`.

Production compatibility и mapping текущего runtime зафиксированы отдельно:

`operations/BOARD_PRODUCT_MODEL_PRODUCTION_MAPPING_2026-09-15.md`

Этот документ **не требует** заменить существующие `dc_artifacts`, `dc_entities`, Event / Program / Project модели новой универсальной таблицей Thing.

Каноническое правило:

**WE DO NOT REPLACE ARTIFACT WITH THING. WE STOP LETTING ARTIFACT DEFINE PRODUCT MEANING.**

---

# 0. Главная роль Board

Board — не каталог объявлений.

Board — **редакционная поверхность живущих вещей**: того, что появилось, делается, вышло, снова ожило или куда прямо сейчас можно вписаться.

Board отвечает на три вопроса:

1. **Что это за вещь?**
2. **Почему она важна сейчас?**
3. **Что я могу сделать прямо отсюда?**

Главная формула:

**CURRENT SOURCES → SEMANTIC PROJECTION → CONTEXTUAL PRESENTATION**

То есть:

`dc_artifacts / dc_entities / events / programs / projects / system signals`

→ **Board semantic adapter**

→ `ThingProjection | AuxiliaryEntityProjection | SystemNotice`

→ contextual card / detail renderer.

Ключевой архитектурный вывод:

**Карточке не нужно становиться умнее. Умнее должен стать слой перед карточкой.**

---

# 1. PROGRAM BOARD = THINGS FIRST

Главный программный объект Board — **Thing**.

Board также может показывать ограниченные служебные projections:

- Project projection;
- Event / Program / другой entity projection, когда сам operational container важен аудитории;
- system / operational notice.

Они являются исключениями и не конкурируют с Things за роль основного содержимого Board.

Поэтому неверно:

**EVERY BOARD OBJECT = THING**

Канонически:

**PROGRAM BOARD = THINGS FIRST**

И:

**ARTIFACT MAY BACK A THING PROJECTION.**

Artifact не обязан автоматически становиться Thing. Он может быть contribution carrier, Observation carrier, native Board Thing или implementation shell.

---

# 2. BoardProjection

Канонический union v1:

```text
BoardProjection =
  ThingProjection
  | AuxiliaryEntityProjection
  | SystemNotice
```

## ThingProjection

Редакционная проекция самостоятельной Thing.

Она может быть backed by:

- native `dc_artifact`;
- Event;
- Program;
- Product / Object;
- другой canonical entity;
- future Thing registry, только если эксплуатация действительно этого потребует.

## AuxiliaryEntityProjection

Проекция operational entity, когда Board должен показать сам контейнер / процесс, а не одну из его Things.

Наиболее очевидный пример — **Project**.

## SystemNotice

Операционное сообщение, которое не притворяется Thing.

Пример:

> сегодня меняем место встречи.

Служебное сообщение не обязано получать Production State, Release или философскую идентичность Thing.

---

# 3. RICH MODEL → SPARSE CARD

Board может стоять на богатой модели, но карточка не обязана пересказывать модель.

Канонический принцип:

**RICH MODEL → SPARSE CARD**

Карточка показывает только то, что помогает человеку принять решение сейчас.

Минимальная логика:

- identity / premise;
- один contextual signal;
- один primary action;
- author / project context только если они реально меняют восприятие;
- media, когда media является опытом или сильным доказательством.

Запрещённый default:

> TYPE / STATUS / RELEASE / PRODUCTION / PARTICIPATION / PROJECT / FEATURED / SOURCE / VERSION

одновременно на одной карточке.

Каноническое редакционное правило:

> **Редакция выбирает, какая правда важна сейчас.**

Acceptance test:

> **Если убрать все badges и metadata, остаётся ли вещь, которую хочется открыть?**

Если нет — metadata маскирует слабую Thing / слабую подачу.

---

# 4. Source ontology ≠ Product semantics ≠ Form

Нельзя менять canonical source ontology ради карточки.

Пример:

```text
source entity: PROGRAM
program_type: COURSE
primary experience / Form: COURSE
```

`Program` остаётся operational source type.

`Course` может быть Form / presentation kind.

Поэтому:

**SOURCE TYPE ≠ FORM**

И аналогично:

- Artifact subtype не определяет Production State;
- наличие URL не определяет Release само по себе;
- media type не является вечной Form Thing;
- Project не является Form;
- `published` не означает `RELEASED`.

---

# 5. Production State

Board использует Product Model authority:

- `IDLE`;
- `MAKING`;
- `STOPPED`.

## IDLE

Сейчас активное производство новой доступной версии / формы не идёт.

`IDLE + UNRELEASED` может означать:

> вещь вошла в редакционное поле, но её пока не делают.

`IDLE + RELEASED`:

> вещь существует у аудитории, но сейчас новой работы нет.

## MAKING

Сейчас реально делают первую или следующую самостоятельную версию / форму.

Валидны обе комбинации:

- `MAKING + UNRELEASED`;
- `MAKING + RELEASED`.

Последняя даёт нормальный случай:

**ВЫШЛО + МУТЯТ v2**

## STOPPED

Продолжение сознательно остановлено.

Валидны:

- `STOPPED + UNRELEASED`;
- `STOPPED + RELEASED`.

## ПРИНЕСЛИ

`ПРИНЕСЛИ` **не Production State**.

Это presentation / editorial signal:

> Thing вошла в редакционное поле.

Он может быть выведен из контекста, но не должен становиться четвёртым Production State.

---

# 6. Release и Release State

Release — конкретный момент, когда самостоятельный experience становится доступен аудитории.

Каноническое определение:

> **Release — момент, когда самостоятельный experience становится доступен аудитории, а не момент его завершения.**

Thing может иметь 0..N Releases.

## RELEASED — derived state

В v1 предпочтительно не хранить второй ручной boolean `release_state`, если канонические Release objects уже существуют.

Правило:

```text
есть audience-available Release → RELEASED
нет audience-available Release → UNRELEASED
```

Это предотвращает расхождение вида:

> `release_state = UNRELEASED`, но public Release уже существует.

## Event

Event становится `RELEASED`, когда он опубликован как самостоятельное доступное событие с реальными условиями участия.

Не когда событие закончилось.

Факт:

> событие состоялось

фиксируется в **History**.

## Course / Program

Курс становится `RELEASED`, когда самостоятельная версия курса опубликована и доступна аудитории.

Прохождение курса конкретным человеком — не Release.

---

# 7. Form и primary experience

Thing может иметь несколько Forms через свои Releases.

Нельзя онтологически утверждать, что у Thing всегда одна вечная Form.

Board выбирает для конкретного view:

- `primary_form`;
- или точнее `primary_experience`.

Пример одной Thing:

В `Вышло`:

> GAME  
> **Играть**

Позже в History:

> VIDEO  
> **Смотреть, что из этого получилось**

Идентичность Thing остаётся той же.

Поэтому presentation layer может использовать `primary_form`, но source entity и Thing identity не переписываются под текущий renderer.

---

# 8. Participation

`МОЖНО ВПИСАТЬСЯ` — не state Thing.

Это наличие **Participation Opportunity**.

Board должен отвечать не на абстрактное:

> можно участвовать

а на конкретное:

> **что именно здесь сейчас можно сделать?**

Примеры:

- протестировать;
- прийти;
- дать взгляд;
- прислать материал;
- помочь собрать;
- записать звук;
- сыграть;
- стать соавтором.

Текущие reactions / responses / guest interest могут оставаться response plumbing, но сами по себе не определяют Participation Opportunity.

Канонический термин модели:

**ВПИСАТЬСЯ**

`влезть` допустимо как локальный копирайтинг / шутка, но не как термин Product Model.

---

# 9. History

History принадлежит Thing / Project.

Activity — projection подходящих событий на конкретную поверхность.

Поэтому:

**HISTORY ≠ ACTIVITY**

И:

**activity_at ≠ meaningful History event**

Meaningful History отвечает:

> что произошло с этой Thing и почему это имеет значение?

Примеры:

- вышла новая версия;
- первые 100 игроков;
- показали на фестивале;
- вернулись к Thing через полгода;
- появился remix;
- закончилось событие;
- Thing породила другую Thing.

History — одна из главных причин возвращать старую Thing на Board без искусственного `bump` публикации.

---

# 10. Contextual presentation views

Одна Thing **не имеет одной вечной карточки**.

Board выбирает presentation по причине показа сейчас.

Канонические views v1:

## RELEASE VIEW

Показываем, потому что появился доступный Release.

Приоритет:

- что вышло;
- primary experience;
- прямой CTA к experience.

Пример:

> новый public build  
> **Играть**

## MAKING VIEW

Показываем, потому что Thing сейчас делают.

Приоритет:

- что изменилось в производстве;
- сильный промежуточный сигнал / prototype;
- CTA к доступному proof, если он есть.

Пример:

> собрали новый бой  
> **Посмотреть prototype**

## PARTICIPATION VIEW

Показываем, потому что существует конкретная открытая Participation Opportunity.

Приоритет:

- ask;
- зачем нужен человек;
- commitment / условия;
- entry CTA.

Пример:

> нужны 5 человек проверить баланс  
> **Протестировать**

## HISTORY VIEW

Показываем, потому что в жизни Thing произошло значимое событие.

Приоритет:

- что произошло;
- почему это интересно сейчас;
- лучший доступный proof / experience.

Пример:

> спустя месяц сделали картонный город  
> **Посмотреть, что произошло**

## DEFAULT VIEW

Используется, когда нет более сильной текущей причины показа.

Приоритет:

- identity / premise Thing;
- primary experience, если он существует;
- detail только если experience отсутствует или контекст действительно нужен перед действием.

---

# 11. projection_reason

Semantic adapter должен уметь назвать причину, по которой объект показан сейчас.

Рабочий набор v1:

```text
release
making
participation
history
editorial
```

Это presentation concern, а не обязательный DB enum.

В Phase 0 он может вычисляться полностью in-memory.

`projection_reason` выбирает:

- contextual signal;
- primary experience;
- primary action;
- density metadata;
- возможный view renderer.

---

# 12. Card anatomy

Канонический порядок внимания:

1. Thing identity / title;
2. premise / короткое объяснение;
3. media / proof, если оно реально помогает;
4. **один contextual signal**;
5. **один primary action**;
6. author / Project context по необходимости.

Правило:

**ONE CONTEXTUAL SIGNAL + ONE PRIMARY ACTION**

Secondary actions допустимы в Detail, но не должны конкурировать на Board.

---

# 13. CTA hierarchy

Канонический принцип:

**RELEASE CTA > INTERNAL NAVIGATION**

Если самостоятельный experience уже доступен, Board по умолчанию ведёт туда.

Примеры:

- `Играть`;
- `Смотреть`;
- `Прийти`;
- `Протестировать`;
- `Читать`;
- `Слушать`;
- `Дать материал`.

Неверный обязательный путь:

> Board → Artifact Detail → внешняя ссылка → experience.

Detail — это контекст, а не toll booth.

Если контекст нужен перед действием, Detail может быть primary action. Но это редакционное решение, а не технический default.

---

# 14. Freshness

Каноническое правило:

**FRESHNESS ≠ CREATED_AT ≠ PUBLISHED_AT**

Причиной появления Thing наверху Board может быть:

- новый Release;
- MAKING progress;
- новая Participation Opportunity;
- meaningful History;
- редакционное возвращение в программу.

`created_at` и `published_at` остаются useful chronology / fallback fields, но не определяют редакционную актуальность.

Старая Thing может быть самой свежей вещью на Board, если с ней сегодня произошло что-то важное.

---

# 15. Detail view

Существующий Artifact Detail route может быть сохранён как implementation surface.

Но information hierarchy должна быть инвертирована.

Не default:

```text
ARTIFACT / ACTIVE
TYPE / REQUEST
STATUS / ACTIVE
ID / XXXXXXXX
EXTERNAL LINK
```

А:

```text
[Thing identity]
[что это]
[что с ней происходит сейчас]
[primary experience / action]
[Participation, если есть]
[History / Project context, если помогает]
```

Технические поля:

- internal ID;
- source mode;
- operational status;
- subtype;
- distribution state;

не исчезают из системы, но не обязаны быть главной пользовательской иерархией.

---

# 16. Artifact subtype

Текущие:

- `announcement`;
- `post`;
- `idea`;
- `request`

не являются Product ontology Thing.

Они могут сохраниться как:

- legacy metadata;
- editorial preset;
- migration hint;
- implementation compatibility field.

Но запрещено выводить автоматически:

```text
idea → IDLE + UNRELEASED
request → Participation
post → released text Thing
```

без фактической семантики объекта.

Create experience должен начинаться с намерения / содержимого, а не с обязанности пользователя понимать внутренний subtype enum.

---

# 17. BoardThingViewModel

Phase 0 target shape:

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
release_state              # derived when possible
primary_release?
primary_form?
primary_experience?

primary_participation?
latest_meaningful_history?

projection_reason
primary_signal
primary_action
```

Это **view model**, не новая canonical entity table.

Рядом существуют отдельные shapes:

```text
AuxiliaryEntityProjection
SystemNotice
```

---

# 18. Editorial control

Board не обязан автоматически показывать всю доступную правду.

Редакция выбирает:

- почему Thing возвращается сейчас;
- какой Release считать primary в конкретном view;
- какую Form показывать;
- какой History event заслуживает возвращения на Board;
- какую Participation Opportunity поднимать;
- когда Project projection полезнее Thing projection.

Это не означает ручной hardcode каждой карточки.

Это означает, что semantic adapter допускает editorial choice поверх canonical facts.

Projection никогда не становится вторым source of truth.

---

# 19. Activity relationship

Board — publication / discovery surface.

Activity — distribution / return projection.

Обе поверхности могут читать одну семантическую модель, но не обязаны иметь одинаковую presentation.

Правильное направление:

```text
Release / Production / Participation / History facts
→ semantic event / projection
→ Board / Activity / Home / Community
```

Неверно:

```text
Board card copied to Activity
→ becomes canonical history
```

`published_at` может оставаться fallback chronology.

`activity_at` может оставаться compatibility hint.

Но meaningful History требует собственной семантики.

---

# 20. Spatial Board

Spatial runtime остаётся presentation infrastructure.

Его ответственность:

- координаты;
- размер;
- rotation;
- pan / zoom;
- focus;
- размещение карточек.

Он не должен знать Product ontology глубже, чем необходимо renderer contract.

Новая модель не требует переписывать spatial engine.

---

# 21. Implementation sequence

## Phase 0 — Semantic projection in memory

**Без schema migration.**

На существующих production-compatible данных собрать `BoardThingViewModel` и доказать минимум на нескольких seed / test объектах:

- DEFAULT projection;
- RELEASE projection;
- MAKING projection;
- PARTICIPATION projection;
- HISTORY projection.

Цель Phase 0:

> понять, какие данные действительно невозможно корректно вывести из текущих sources.

Не создавать новые таблицы заранее ради симметрии Product Model.

## Phase 1 — Production + Release objects

Добавить только подтверждённые semantic gaps:

- `Production State`;
- Release object / relation, если текущий source не выражает multiple Releases.

`RELEASED` по возможности derived из доступных Releases.

## Phase 2 — Participation Opportunity

Добавить конкретный ask / entry action поверх существующего reaction / response plumbing.

## Phase 3 — Meaningful History

Добавить semantic events, которые могут возвращать Thing в Board / Activity без переиздания объекта.

## Phase 4 — Presentation migration

После проверки модели:

- заменить legacy composer language;
- включить contextual Board views;
- инвертировать Detail information hierarchy;
- перевести freshness с publication chronology на semantic reason;
- оставить compatibility fields там, где они ещё нужны runtime.

---

# 22. Non-goals

Board Product Model v1 **не требует**:

- новой universal `dc_things` table;
- удаления `dc_artifacts`;
- превращения Event / Program / Project в Artifact;
- переписывания spatial runtime;
- удаления reactions / responses;
- новой социальной ленты;
- marketplace taxonomy;
- mini-Jira для Projects;
- автоматического показа всех statuses на карточке;
- destructive migration старых Artifact subtypes.

---

# 23. Acceptance rules

Реализация соответствует Board Product Model v1, если одновременно выполняется следующее:

1. **PROGRAM BOARD = THINGS FIRST**, но system / auxiliary projections остаются возможны.
2. Artifact не определяет автоматически product meaning.
3. `artifact.status` не используется как Production State.
4. `published_at` не используется как Release fact.
5. Program / Course сохраняют distinction `source type ≠ Form`.
6. Одна Thing может иметь несколько Releases / Forms во времени.
7. `RELEASED` означает audience availability, а не completion.
8. Event считается released при доступности самостоятельного experience / участия, а occurrence идёт в History.
9. `ВПИСАТЬСЯ` выражается через конкретную Participation Opportunity.
10. History может вернуть старую Thing на Board без создания новой Thing.
11. Карточка показывает не более одного primary contextual signal и одного primary action.
12. Доступный Release CTA приоритетнее обязательной внутренней навигации.
13. Freshness не сводится к `created_at / published_at`.
14. Detail показывает смысл и действие раньше внутренних technical fields.
15. Projection не становится вторым canonical source of truth.
16. Phase 0 semantic adapter может быть реализован без schema migration.

---

# 24. Canonical summary

Board не должен отвечать:

> какой это Artifact и какой у него внутренний status?

Board должен отвечать:

> **Что это за вещь, почему она снова важна сейчас и что человек может сделать с ней прямо отсюда?**

Именно поэтому целевая архитектура — не новый Board, а новый смысловой слой над существующим Board:

**CURRENT SOURCES → SEMANTIC PROJECTION → CONTEXTUAL PRESENTATION**

Это и является authority `06 · Board Product Model`.
