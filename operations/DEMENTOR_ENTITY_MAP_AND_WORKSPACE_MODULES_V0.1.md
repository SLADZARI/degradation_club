# Dementor Club — Dementor Entity Map & Workspace Modules v0.1

Дата: 2026-08-28
Статус: ARCHITECTURAL / PRODUCT DESIGN DRAFT
Ветка: `dementor-club`

## 0. Назначение

Этот документ фиксирует две разные вещи:

1. **FACT MAP** — подтверждённые связи каждого дементора с курсами, событиями и проектами по текущему source-of-truth.
2. **SCREEN IMPLICATIONS** — какие внутренние экраны/модули кабинета логично проектировать из этих фактов.

Screen implications являются продуктовой гипотезой до отдельного утверждения интерфейса и permissions.

Ключевой принцип:

**Не существует одного одинакового рабочего кабинета дементора. Существует общий shell + модули, которые включаются по реальным сущностям конкретного дементора.**

Также сохраняется жёсткая граница:

**Dementor Club ≠ Modern Pilgrims.**

Этот документ относится только к Dementor Club. BEREG, Obitel и другие Modern Pilgrims client projects сюда не входят, даже если один и тот же человек присутствует в обеих системах.

---

# 1. Общий shell Dementor Workspace

Минимальный общий shell для пользователя с системной ролью `DEMENTOR`:

```text
DEMENTOR WORKSPACE
├── HOME
├── MY PROFILE
├── COURSES        [только если есть подтверждённые курсы]
├── EVENTS         [только если есть подтверждённые события]
├── PROJECTS       [только если есть подтверждённая связь с DC project]
├── PARTICIPANTS   [только когда конкретная сущность создаёт participant relation]
├── MATERIALS      [когда появляются управляемые материалы]
└── ARCHIVE        [когда появляется фактический архив]
```

Пустой модуль не показывается.

`MY PROFILE` относится к публичному профилю дементора и его утверждаемому содержанию: doctrine, origin story, areas, indications, methods, quotes и связанные сущности.

---

# 2. Валентин Лосев

## FACT MAP

Dementor slug: `valentin`

### Course

**«Думай с опасностью»**

- status: `approved-draft`;
- type: самостоятельный интерактивный онлайн-курс Dementor Club;
- delivery: `web / self-paced`;
- 7 самостоятельных модулей;
- сквозной инструмент: «Карта опасности»;
- первая версия не требует server account;
- прогресс в текущей спецификации сохраняется локально;
- курс не является частью события «Фуэнхирола»;
- отдельная публичная URL-сущность.

### Events

Подтверждённых событий Валентина в текущем roster нет.

### Dementor Club projects

Подтверждённой связи Валентина с существующим DC project в текущем source-of-truth нет.

### Participants

Текущая версия курса self-paced и не предусматривает личное ведение Валентином. Поэтому participant-management для Валентина сейчас **не является подтверждённой потребностью**.

## SCREEN IMPLICATIONS / DESIGN

Минимальный workspace Валентина:

```text
HOME
MY PROFILE
COURSES
  └── ДУМАЙ С ОПАСНОСТЬЮ
      ├── Overview
      ├── Modules / content state
      ├── Public page preview/status
      └── Course materials
```

Не проектировать сейчас:

- cohort management;
- индивидуальные записи;
- календарь сессий;
- participant CRM;
- event management.

Если позднее курс станет account-based или cohort-based, participants добавляются как модуль курса, а не как универсальная возможность дементора.

---

# 3. Никита

## FACT MAP

Dementor slug: `nikita`

### Course

**«Деньги на ветер»**

- status: `approved concept / digital card-course MVP in development`;
- type: цифровой адаптивный карточечный курс;
- Никита — автор doctrine, tone и базовых карточек;
- дементор не ведёт пользователя в личной сессии;
- цикл: `card → answer → analysis → next card`;
- MVP: минимум 8 карточек;
- локальное сохранение ответов в первой версии;
- production-направление предполагает server/AI session, но ещё не реализовано;
- цена не утверждена.

### Events

В roster: `none approved`.

### Dementor Club projects

Подтверждённой связи Никиты с существующим DC project в текущем source-of-truth нет.

### Participants

В MVP нет подтверждённой отдельной participant-management модели для Никиты.

## SCREEN IMPLICATIONS / DESIGN

Минимальный workspace Никиты:

```text
HOME
MY PROFILE
COURSES
  └── ДЕНЬГИ НА ВЕТЕР
      ├── Overview
      ├── Card library
      ├── Branching / course structure
      ├── Public page preview/status
      └── Course materials
```

Позже, если появится server-based course engine:

```text
COURSE ANALYTICS / RUNS
```

может появиться как отдельный модуль, но сейчас не считать его утверждённым.

Не проектировать сейчас:

- events;
- личные консультации;
- cohort management;
- participant CRM.

---

# 4. Евгений

## FACT MAP

Dementor slug: `evgeniy`

### Course

**«Слабоумие и отвага»**

- status: `planned / approved concept / public page allowed`;
- type: дементорский курс;
- cities: Warsaw / Gdansk;
- format: индивидуально или очень маленькая группа;
- последовательность: разговор до → авиационный опыт → разговор после;
- авиационный опыт: планер или прыжок с парашютом;
- конкретная активность зависит от выпуска, погоды, аэроклуба и допуска участника;
- фактические дата, аэроклуб и цена пока не утверждены;
- нельзя выдавать planned-format за открытый набор.

### Events

Отдельных подтверждённых events Евгения в roster нет.

Сам курс имеет физическую/авиационную delivery-механику, но не должен автоматически классифицироваться как Event без отдельной event-сущности.

### Dementor Club projects

Подтверждённой связи с DC project нет.

### Participants

Из самой утверждённой формы курса следует, что при запуске потребуется связь с конкретным участником или очень маленькой группой и конкретным выпуском/проведением. Однако регистрация ещё не открыта и participant records сейчас не существуют как утверждённый production workflow.

## SCREEN IMPLICATIONS / DESIGN

Для Евгения простой digital-course экран недостаточен. Нужна будущая сущность **COURSE RUN / EXPERIENCE RUN**.

Минимальная целевая архитектура:

```text
HOME
MY PROFILE
COURSES
  └── СЛАБОУМИЕ И ОТВАГА
      ├── Overview
      ├── Public status
      ├── Program / materials
      └── RUNS                 [активировать только при запуске]
          └── Run
              ├── participant(s)
              ├── city
              ├── activity type
              ├── operational status
              └── notes/materials allowed by policy
```

Не создавать сейчас неподтверждённые поля конкретного аэроклуба, цены, даты или medical/eligibility workflow.

`RUNS` проектируется как structural slot, но становится рабочим модулем только когда курс переходит из `planned` к реальному набору/проведению.

---

# 5. Габиль

## FACT MAP

Dementor slug: `gabil`

### Course / regular practice

**«НЕ КОМАНДА»**

- status: `active`;
- type: регулярный онлайн-курс / групповая практика Dementor Club;
- schedule: каждый понедельник, 10:00;
- timezone: `Europe/Madrid`;
- участники регулярно встречаются онлайн;
- конкретный состав участников не зафиксирован;
- registration URL, цена, max participants и формальный admission workflow не зафиксированы;
- публикация цитат/транскрипций требует отдельного согласия.

### Event

**«Фуэнхирола»**

- status: `planned`;
- type: камерная офлайн-сессия Dementor Club;
- location: Fuengirola, Spain;
- capacity: до 7 участников;
- Dementor: Габиль;
- подробности и возможность записаться должны быть доступны после вступления в Dementor Club;
- дата, конкретная площадка, duration, price и mechanics of registration ещё не зафиксированы;
- Fuengirola не является автоматически выездной версией «НЕ КОМАНДА».

### Dementor Club projects

Подтверждённой связи Габиля с текущим DC project registry нет.

Важно: **Obitel/Mycelium относится к Modern Pilgrims/client context и не должна появляться здесь только потому, что Габиль является тем же человеком.**

### Participants

Габиль — первый дементор, у которого participant/group dimension уже следует из фактического активного формата: регулярная групповая практика. Однако конкретный состав и admission mechanics ещё не утверждены.

## SCREEN IMPLICATIONS / DESIGN

Минимальный workspace Габиля:

```text
HOME
MY PROFILE
COURSES / PRACTICES
  └── НЕ КОМАНДА
      ├── Overview
      ├── Schedule
      ├── Sessions / occurrences
      ├── Materials
      └── Participants        [после фиксации participant model]

EVENTS
  └── ФУЭНХИРОЛА
      ├── Overview
      ├── Status
      ├── Capacity
      ├── Public/member visibility
      └── Registrations       [после утверждения mechanics]
```

Из всех текущих дементоров Габиль первым требует event-management module и recurring-practice/session model.

Не смешивать session history «НЕ КОМАНДА» и event records «Фуэнхирола».

---

# 6. Dementor Club projects inventory

На текущий момент в `dementor-club/projects` обнаружен один самостоятельный DC project:

**«Хит-парад промптов»**

- status: `IDEA / NOT ANNOUNCED / NO DEPLOY`;
- sphere: Technology;
- secondary sphere: Information;
- текущая спецификация не назначает ему дементора-владельца/ведущего.

Следовательно этот project **не должен появляться ни в одном Dementor Workspace**, пока связь с конкретным дементором не будет отдельно утверждена в source-of-truth.

---

# 7. Сводная матрица

| Dementor | Course / Practice | Status | Event | DC Project | Participant dimension | Required workspace modules now |
|---|---|---|---|---|---|---|
| Валентин | Думай с опасностью | approved-draft | none confirmed | none confirmed | no confirmed management need | Profile + Courses |
| Никита | Деньги на ветер | MVP in development | none approved | none confirmed | no confirmed management need | Profile + Courses |
| Евгений | Слабоумие и отвага | planned | none separate | none confirmed | future small-group/run relation | Profile + Courses; reserve Runs |
| Габиль | НЕ КОМАНДА | active | Фуэнхирола / planned | none confirmed | yes, but mechanics incomplete | Profile + Practice + Events; reserve Participants/Registrations |

---

# 8. Модульная модель интерфейса

Не делать четыре полностью независимых админки.

Использовать один Dementor Workspace shell и composable modules:

```text
PROFILE MODULE
COURSE MODULE
DIGITAL COURSE CONTENT MODULE
RECURRING PRACTICE / SESSION MODULE
COURSE RUN MODULE
EVENT MODULE
PARTICIPANT MODULE
REGISTRATION MODULE
MATERIALS MODULE
ARCHIVE MODULE
DC PROJECT MODULE
```

Каждый модуль активируется только при наличии соответствующей сущности и разрешения.

Пример:

```text
Valentin = PROFILE + COURSE
Nikita   = PROFILE + COURSE + DIGITAL COURSE CONTENT
Evgeniy  = PROFILE + COURSE + future COURSE RUN
Gabil    = PROFILE + RECURRING PRACTICE + EVENT + future PARTICIPANTS/REGISTRATIONS
```

---

# 9. Что не надо проектировать до появления факта

Не создавать заранее универсальные:

- CRM;
- payments dashboard;
- calendar for every Dementor;
- consultations;
- client projects;
- messaging;
- cohorts;
- analytics;
- certificates management;
- team management.

Они добавляются, когда конкретный продукт/курс/event создаёт такую потребность.

---

# 10. Следующий продуктовый шаг

Следующий документ должен быть **DEMENTOR WORKSPACE INFORMATION ARCHITECTURE / WIREFRAME SPEC v0.1**.

Он должен определить:

1. общий shell/navigation;
2. Home дементора;
3. Profile editor/view;
4. Course list/detail;
5. digital-course-specific content screen;
6. recurring-practice/session screen;
7. future Course Run screen;
8. Event list/detail;
9. conditional Participants/Registrations;
10. empty-state rules;
11. mobile behavior;
12. какие блоки read-only, а какие editable — только после отдельного permission decision.

До этого этапа не применять новые permissions/RLS в production.
