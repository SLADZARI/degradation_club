# Dementor Club × Modern Pilgrims — Identity & Access Model v0.3

Дата: 2026-08-28
Статус: APPROVED ARCHITECTURAL DRAFT / NOT DEPLOYED
Заменяет: v0.1, v0.2

## 0. Главный принцип

Dementor Club и Modern Pilgrims — две разные системы.

Они могут использовать общую identity/auth инфраструктуру, потому что одни и те же люди часто пересекаются между проектами и ролями.

Но это НЕ означает объединение продуктов, сайтов, проектов, команд или прав доступа.

Ключевые границы:

**SHARED IDENTITY ≠ SHARED PRODUCT**

**DEMENTOR CLUB PROJECTS ≠ MODERN PILGRIMS PROJECTS**

**DEMENTOR ROLE ≠ PILGRIMS ROLE**

**ONE PERSON CAN HAVE INDEPENDENT ROLES IN BOTH SYSTEMS**

---

## 1. Два независимых пространства

### 1.1 Dementor Club

Отдельная культурная платформа, сайт, клуб и собственные проекты.

Свой source-of-truth: `degradation_club / dementor-club` и проектные ветки клуба.

Начальная лестница доступа:

`OWNER_ADMIN → DEMENTOR → CLUB_MEMBER → AUTHENTICATED → GUEST`

Проекты Dementor Club принадлежат только Dementor Club и не появляются в Modern Pilgrims автоматически.

### 1.2 Modern Pilgrims

Отдельная операционная и проектная система.

Свой source-of-truth: `modernpilgrims-platform` и отдельные проектные источники/ветки Modern Pilgrims.

Начальные space roles:

- `OWNER_ADMIN` — владельцы/администраторы платформы;
- `TEAM_MEMBER` — внутренняя команда Modern Pilgrims;
- `PILGRIMS_PARTNER` — клиент/партнёр Modern Pilgrims;
- отсутствие membership — нет внутреннего доступа к Modern Pilgrims.

Проекты Modern Pilgrims не являются проектами Dementor Club даже если один и тот же человек одновременно является Dementor.

---

## 2. Почему identity общая

Общая identity нужна только потому, что реальные люди могут одновременно участвовать в нескольких контурах.

Пример:

```text
Валентин
├── Dementor Club / DEMENTOR
└── Modern Pilgrims / PILGRIMS_PARTNER
    └── BEREG / CLIENT_OWNER
```

Это один человек и один login, но две независимые роли в двух независимых системах.

Никакое действие в одной системе не должно автоматически создавать роль или проект в другой.

---

## 3. Modern Pilgrims: клиентский контур

### 3.1 PILGRIMS_PARTNER

`PILGRIMS_PARTNER` — главный клиентский/партнёрский профиль Modern Pilgrims.

Он представляет владельца проекта со стороны клиента.

Примеры:

- Валентин — партнёр Modern Pilgrims и владелец BEREG;
- Габиль — партнёр Modern Pilgrims и владелец «Обители».

Партнёр не становится `TEAM_MEMBER` автоматически.

### 3.2 Команда партнёра

У партнёра может быть своя команда.

Для этого нужен отдельный более слабый уровень:

`PARTNER_TEAM_MEMBER`

Это участник команды клиента/партнёра, а не сотрудник Modern Pilgrims.

Он:

- входит в client account конкретного партнёра;
- получает доступ только к назначенным клиентским проектам;
- имеет меньше прав, чем `PILGRIMS_PARTNER`;
- не получает Modern Pilgrims Team Board;
- не получает чужие клиентские проекты;
- не становится `TEAM_MEMBER` Modern Pilgrims.

Точные capabilities будут определяться позже по мере разработки реальных экранов.

---

## 4. Стартовое дерево Modern Pilgrims

```text
MODERN PILGRIMS
│
├── OWNER_ADMIN
│   ├── Женя
│   └── Никита
│
├── TEAM_MEMBER
│   └── внутренняя команда Modern Pilgrims
│
└── PILGRIMS_PARTNER
    │
    ├── Валентин
    │   └── BEREG / CLIENT_OWNER
    │       └── PARTNER_TEAM_MEMBER × N
    │
    └── Габиль
        └── OBITEL / CLIENT_OWNER
            └── PARTNER_TEAM_MEMBER × N
```

Это стартовое дерево. Другие права и роли добавляются только при появлении реальной необходимости.

---

## 5. Владение клиентским проектом

### BEREG

- внешний/клиентский проект Валентина;
- Валентин: `PILGRIMS_PARTNER` + `CLIENT_OWNER`;
- Modern Pilgrims работает над проектом как operating/delivery team;
- команда Валентина может получать `PARTNER_TEAM_MEMBER` с project-scoped доступом.

### Обитель

- внешний/клиентский проект Габиля;
- Габиль: `PILGRIMS_PARTNER` + `CLIENT_OWNER`;
- Modern Pilgrims работает над проектом как operating/delivery team;
- команда Габиля может получать `PARTNER_TEAM_MEMBER` с project-scoped доступом.

Владелец клиентского проекта не является project collaborator в своём собственном проекте.

---

## 6. Кто над проектом работает

Ownership и work membership — разные сущности.

```text
CLIENT OWNERSHIP
Валентин → BEREG
Габиль   → OBITEL

MODERN PILGRIMS DELIVERY
Женя / Никита / TEAM_MEMBER
→ назначаются на клиентский проект по необходимости

CLIENT TEAM
PARTNER_TEAM_MEMBER
→ назначаются владельцем/по согласованному access flow
```

Ни client owner, ни его команда не получают portfolio-wide visibility Modern Pilgrims.

---

## 7. Проекты Dementor Club и Modern Pilgrims нельзя смешивать

Это обязательная архитектурная граница.

Запрещено:

- один общий project registry без domain namespace;
- автоматическое отображение Dementor project в Modern Pilgrims;
- автоматическое отображение Modern Pilgrims project на сайте Dementor Club;
- наследование project membership между DC и MP;
- считать человека участником MP проекта только потому, что он Dementor;
- считать человека Dementor только потому, что он Partner/Team Member Modern Pilgrims.

Если один и тот же реальный проект когда-нибудь должен быть представлен в обеих системах, это должно быть две отдельные сущности/представления с явной reference-link, а не одна смешанная project row.

---

## 8. Data boundary

Общими могут быть:

```text
auth.users
profiles
identity/account metadata
access audit infrastructure
```

Но project/domain data должны быть namespaced.

Предпочтительная модель:

```text
shared:
  profiles
  spaces
  space_memberships

Modern Pilgrims only:
  mp_partner_accounts
  mp_partner_account_members
  mp_projects
  mp_project_ownerships
  mp_project_memberships

Dementor Club only:
  dc_* domain/project tables
  assessment_snapshots
  assessment_runs
  club-specific entities
```

Не использовать универсальную `projects` таблицу как общую semantic базу двух продуктов.

---

## 9. Partner account

Для поддержки команды Валентина/Габиля вводится концепция `mp_partner_accounts`.

Пример:

```text
partner_account: Valentin / BEREG side
owner: Valentin
members:
  Valentin → PARTNER_OWNER
  Employee A → PARTNER_TEAM_MEMBER
  Employee B → PARTNER_TEAM_MEMBER

partner_account: Gabil / Obitel side
owner: Gabil
members:
  Gabil → PARTNER_OWNER
  Person A → PARTNER_TEAM_MEMBER
```

Partner account — сущность Modern Pilgrims. Она не имеет отношения к membership в Dementor Club.

---

## 10. Dementor → Pilgrim transition

Поскольку системы независимы, переход означает не перенос роли, а создание новой membership в Modern Pilgrims.

Возможный путь:

```text
DEMENTOR
+
PILGRIMS_PARTNER
↓
долгая совместная работа
↓
PILGRIM CANDIDATE
↓
INVITATION
↓
TEAM_MEMBER
```

При этом `DEMENTOR` может остаться активной ролью в Dementor Club.

---

## 11. Что фиксируем сейчас, а что нет

### Фиксируем сейчас

- две системы строго разделены;
- shared identity допустима;
- MP roles: OWNER_ADMIN / TEAM_MEMBER / PILGRIMS_PARTNER;
- client sublevel: PARTNER_TEAM_MEMBER;
- Валентин владеет BEREG;
- Габиль владеет Обителью;
- их команды могут получать более слабый project-scoped доступ;
- projects DC и MP не смешиваются.

### НЕ фиксируем сейчас

- детальную permission matrix;
- кто может редактировать конкретные поля;
- approval mechanics;
- notification rules;
- exact UI Partner Portal;
- billing;
- сложные delegation rules.

Эти права добавляются по мере разработки продукта.

---

## 12. Статус реализации

NOT DEPLOYED.

Не применено:

- migrations;
- RLS;
- partner account tables;
- role-aware middleware;
- Partner Portal;
- TEAM_MEMBER access model.

Документ задаёт только стартовое дерево и архитектурные границы.