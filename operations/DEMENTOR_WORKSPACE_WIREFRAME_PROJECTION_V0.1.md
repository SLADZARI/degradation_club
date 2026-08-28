# Dementor Club — Workspace Wireframe Projection v0.1

Дата: 2026-08-28
Статус: PRODUCT / IA DRAFT / NOT IMPLEMENTED
Ветка: `dementor-club`

Depends on:
- `operations/DEMENTOR_ENTITY_MAP_AND_WORKSPACE_MODULES_V0.1.md`
- `operations/IDENTITY_MEMBERSHIP_AND_ENTITY_BOUNDARY_V0.2.md`
- universal `WORKSPACE_WIREFRAME_SPEC_V0.1.md`

## 0. Назначение

Этот документ переводит подтверждённый Dementor Fact Map в конкретную информационную архитектуру кабинета.

Он НЕ создаёт новых сущностей, не утверждает новые permissions и не меняет публичные страницы.

Главная схема:

```text
DEMENTOR CLUB WORKSPACE
├── HOME
├── MY WORK
└── MY PROFILE
```

`MY WORK` собирается из активных assignments конкретного человека.

Не использовать имя дементора как источник логики UI.

---

## 1. HOME — общий принцип

HOME не является новой базой данных.

Он показывает только доступные пользователю данные из текущего Dementor Club context.

Структура:

```text
HOME
├── Current identity / system role
├── Attention
├── Next
├── My active work
└── Recent meaningful changes
```

Примеры возможных карточек:

- planned Program требует редакционного решения;
- upcoming recurring occurrence;
- Event получил дату;
- content draft изменился;
- registration mechanics открылись.

Не создавать фиктивные action cards, если реальных действий нет.

---

## 2. MY WORK — общий принцип

`MY WORK` показывает только фактически связанные с человеком сущности Dementor Club.

Возможные фильтры:

```text
ALL
PROGRAMS
EVENTS
PROJECTS
```

Фильтр не показывается, если соответствующих сущностей нет.

Каждая карточка:

```text
TYPE / STATUS
NAME
MY RELATION
DELIVERY / NEXT STATE
PRIMARY ALLOWED ACTION
```

Пример:

```text
PROGRAM · ACTIVE
НЕ КОМАНДА
FACILITATOR
Recurring · Monday 10:00 Europe/Madrid
[OPEN]
```

---

## 3. MY PROFILE — Dementor projection

Для системной роли `DEMENTOR` профиль относится только к Dementor Club.

Структура:

```text
MY PROFILE
├── Identity basics
├── Dementor profile
│   ├── role line
│   ├── hero quote
│   ├── doctrine
│   ├── origin story
│   ├── areas
│   ├── indications
│   ├── methods
│   └── quotes
├── Public preview
└── Connected DC entities
```

Не показывать здесь Modern Pilgrims, BEREG, Obitel или другие внешние системные assignments.

---

# 4. Валентин Лосев

## Confirmed assignment projection

```text
PERSON Valentin
→ Dementor Club membership
→ DEMENTOR
→ PROGRAM: Думай с опасностью
```

Текущая сущность:

```text
PROGRAM
program_type = course
delivery_mode = self_paced
status = approved-draft
```

## HOME

Минимум:

```text
HOME
├── Program status: Думай с опасностью
├── Current content/publication state
└── My active work → Думай с опасностью
```

Не показывать participant/session/event widgets.

## MY WORK

```text
PROGRAMS
└── ДУМАЙ С ОПАСНОСТЬЮ
```

## Program page

```text
ДУМАЙ С ОПАСНОСТЬЮ
├── Overview
├── Content / Modules
├── Materials
├── Public page status / preview
└── Management actions [permission-driven]
```

Не создавать RUNS в текущей self-paced модели.

Не создавать participant CRM.

---

# 5. Никита

## Confirmed assignment projection

```text
PERSON Nikita
→ Dementor Club membership
→ DEMENTOR
→ PROGRAM: Деньги на ветер
```

Текущая сущность:

```text
PROGRAM
program_type = course
delivery_mode = adaptive_digital
status = MVP in development
```

## HOME

```text
HOME
├── Program development state
├── content/card changes if meaningful
└── My active work → Деньги на ветер
```

## MY WORK

```text
PROGRAMS
└── ДЕНЬГИ НА ВЕТЕР
```

## Program page

```text
ДЕНЬГИ НА ВЕТЕР
├── Overview
├── Card library
├── Branching / structure
├── Materials
├── Public experience preview/status
└── Management actions [permission-driven]
```

Не добавлять participants, sessions или analytics до появления реального server-based flow.

---

# 6. Евгений

## Confirmed assignment projection

```text
PERSON Evgeniy
→ Dementor Club membership
→ DEMENTOR
→ PROGRAM: Слабоумие и отвага
```

Текущая сущность:

```text
PROGRAM
program_type = experience
delivery_mode = physical
status = planned
```

## HOME сейчас

```text
HOME
├── Program status: planned
├── missing confirmed launch data
└── My active work → Слабоумие и отвага
```

Не показывать fake upcoming dates.

## MY WORK

```text
PROGRAMS
└── СЛАБОУМИЕ И ОТВАГА
```

## Program page сейчас

```text
СЛАБОУМИЕ И ОТВАГА
├── Overview
├── Program / Materials
├── Public status
└── Delivery setup
```

## После открытия реального запуска

Использовать универсальный hierarchy:

```text
PROGRAM
└── RUN / OCCURRENCE
    ├── participant(s)
    ├── city
    ├── activity type
    ├── operational status
    ├── sessions if needed
    └── materials
```

RUN не активируется в интерфейсе до появления подтверждённого concrete delivery.

Не вводить неподтверждённые аэроклубы, даты, цены или медицинские поля.

---

# 7. Габиль

## Confirmed assignment projection

```text
PERSON Gabil
→ Dementor Club membership
→ DEMENTOR
→ PROGRAM: НЕ КОМАНДА
→ EVENT: Фуэнхирола
```

### Program

```text
program_type = practice
delivery_mode = recurring
status = active
```

### Event

```text
EVENT = Фуэнхирола
status = planned
location = Fuengirola, Spain
capacity = up to 7
```

## HOME

Габиль первым получает действительно событийный HOME:

```text
HOME
├── NEXT
│   └── НЕ КОМАНДА / Monday 10:00 Europe/Madrid
├── ATTENTION
│   └── Фуэнхирола / planned / incomplete launch data
├── MY ACTIVE WORK
│   ├── НЕ КОМАНДА
│   └── Фуэнхирола
└── RECENT CHANGES
```

Не показывать registrations до появления mechanics.

## MY WORK

```text
PROGRAMS
└── НЕ КОМАНДА

EVENTS
└── ФУЭНХИРОЛА
```

## НЕ КОМАНДА page

```text
НЕ КОМАНДА
├── Overview
├── Delivery
│   └── Occurrences
├── Materials
├── People / Participants [после утверждения модели]
└── Management actions [permission-driven]
```

Recurring delivery выражается через RUN/OCCURRENCE.

Не создавать отдельный special type `PracticeSession`.

## Фуэнхирола page

```text
ФУЭНХИРОЛА
├── Overview
├── Status
├── Location / capacity
├── Public/member visibility
├── Materials
├── Registrations [только после утверждения mechanics]
└── Archive [после completed]
```

Фуэнхирола остаётся EVENT и не превращается в occurrence «НЕ КОМАНДА» без отдельного source-of-truth решения.

---

# 8. Comparison matrix

| Person | HOME emphasis | MY WORK groups | Current entity pages | Reserved future modules |
|---|---|---|---|---|
| Валентин | program/content state | Programs | self-paced Program | none required now |
| Никита | program/card development | Programs | adaptive digital Program | analytics/server flow later |
| Евгений | planned launch state | Programs | physical Experience Program | Runs/Occurrences |
| Габиль | next recurring occurrence + planned event | Programs + Events | recurring Practice + Event | Participants / Registrations |

---

# 9. Shared component model

Do not create four different admin apps.

Reusable blocks:

```text
WORKSPACE_SHELL
HOME_ATTENTION_CARD
HOME_NEXT_CARD
WORK_ENTITY_CARD
ENTITY_HEADER
RELATION_SUMMARY
STATUS_BADGE
PROGRAM_OVERVIEW
PROGRAM_CONTENT
DELIVERY_LIST
RUN_CARD
RUN_DETAIL
EVENT_OVERVIEW
MATERIALS_LIST
PEOPLE_LIST          [conditional]
PUBLIC_PREVIEW
PROVENANCE_BADGE     [internal/admin only]
```

Entity-type-specific components may exist, but shell and relation logic remain shared.

---

# 10. Permission behavior

This document does not finalize permissions.

UI must be capability-driven.

Example future actions:

```text
VIEW
EDIT PROFILE
EDIT CONTENT
MANAGE DELIVERY
VIEW PARTICIPANTS
MANAGE PARTICIPANTS
PUBLISH
ARCHIVE
```

A role label alone does not unlock an action.

Until permissions are implemented:

- wireframes describe placement only;
- no frontend-only security assumptions;
- no hidden URL as access control.

---

# 11. Cross-system prohibition

Inside Dementor Club workspace, never render:

- BEREG;
- Obitel / Mycelium Modern Pilgrims project;
- Modern Pilgrims Team Board;
- Seven Clicks project data;
- another system's role assignments.

Even if the same PERSON has those assignments.

If a future system switcher exists, switching system context performs a complete workspace context change.

There is no merged `MY WORK` across systems.

---

# 12. Mobile IA

Bottom/primary navigation:

```text
HOME
MY WORK
MY PROFILE
```

Inside entity:

- sticky entity title/status;
- compact local section navigation;
- primary action fixed/contextual when useful;
- advanced/admin controls under secondary menu;
- no permanent empty nav entries.

---

# 13. Recommended first prototype

If/when implementation begins, prototype the four real differences with the smallest possible surface:

1. shared shell;
2. MY WORK assignment-driven list;
3. Valentin Program page as self-paced baseline;
4. Gabil Program + Event as recurring/event stress test;
5. Evgeniy RUN slot as hidden/planned structural test;
6. Nikita Card Library as content-specialized Program section.

This set exercises the architecture without implementing speculative participants/payments/registrations.

---

# 14. Release boundary

NOT IMPLEMENTED:

- routes;
- components;
- Supabase schema;
- RLS;
- permissions;
- participant model;
- registration model;
- deployment.

No deploy required.
