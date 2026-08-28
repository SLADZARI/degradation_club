# Dementor Club × Modern Pilgrims — Identity & Access Model v0.2

Дата: 2026-08-28
Статус: APPROVED ARCHITECTURAL DRAFT / NOT DEPLOYED
Заменяет: `CROSS_ECOSYSTEM_IDENTITY_AND_ACCESS_MODEL_V0.1.md`

## 0. Главная поправка

BEREG и Обитель не являются проектами Modern Pilgrims в смысле владения.

- **BEREG — проект Валентина**, над которым работает Modern Pilgrims.
- **Обитель — проект Габиля**, над которым работает Modern Pilgrims.

Следовательно:

**PROJECT OWNERSHIP ≠ DELIVERY / OPERATING ACCESS**

Modern Pilgrims может вести, собирать, сопровождать и операционно обслуживать проект, не становясь его владельцем.

---

## 1. Identity и пространства

Одна Supabase identity используется всей экосистемой.

Ключевой принцип:

**IDENTITY ≠ SPACE ROLE ≠ PROJECT OWNERSHIP ≠ PROJECT DELIVERY ROLE**

Пространства:

- `dementor-club`
- `modern-pilgrims`

### Dementor Club

`OWNER_ADMIN → DEMENTOR → CLUB_MEMBER → AUTHENTICATED → GUEST`

### Modern Pilgrims

- `OWNER_ADMIN` — Женя, Никита; platform/portfolio authority.
- `TEAM_MEMBER` — внутренний участник команды Modern Pilgrims.
- `PILGRIMS_PARTNER` — клиент/партнёр Modern Pilgrims с partner portal.

`PILGRIMS_PARTNER` не является `TEAM_MEMBER`.

---

## 2. Начальные назначения

### Женя

- DC: `OWNER_ADMIN`
- MP: `OWNER_ADMIN`
- platform/portfolio/team access
- operating access к проектам, над которыми работает Modern Pilgrims

### Никита

- DC: `OWNER_ADMIN`
- MP: `OWNER_ADMIN`
- platform/portfolio/team access
- operating access к проектам, над которыми работает Modern Pilgrims

### Валентин

- DC: `DEMENTOR`
- MP: `PILGRIMS_PARTNER`
- **BEREG: CLIENT_OWNER / PROJECT_OWNER**
- видит свой BEREG partner portal
- не получает внутреннюю Team / Portfolio Board

### Габиль

- DC: `DEMENTOR`
- MP: `PILGRIMS_PARTNER`
- **OBITEL: CLIENT_OWNER / PROJECT_OWNER**
- видит свой Obitel partner portal
- не получает внутреннюю Team / Portfolio Board

---

## 3. Модель проекта

Проект должен хранить как минимум две разные оси:

### Ownership

Кому проект принадлежит как клиентский/предпринимательский объект.

Для текущих проектов:

```text
BEREG  → owner: Valentin
OBITEL → owner: Gabil
```

### Operating / delivery responsibility

Кто со стороны Modern Pilgrims работает над проектом.

Это отдельные memberships/assignments:

```text
project_owner_membership
project_team_membership
```

или эквивалентные scoped roles.

Нельзя моделировать владельца клиентского проекта как `COLLABORATOR` команды.

---

## 4. Project role vocabulary

Для партнёрских проектов разделяем роли владельца и delivery-команды.

### Client-side

- `CLIENT_OWNER` — владелец проекта / главный клиентский субъект.
- `CLIENT_MEMBER` — дополнительный представитель клиента, если появится.

### Modern Pilgrims delivery-side

- `MP_PROJECT_LEAD` — отвечает за delivery/operating core проекта.
- `MP_CONTRIBUTOR` — работает над проектом.
- `MP_VIEWER` — внутренний read-only доступ.

`CLIENT_OWNER` не означает `MP_PROJECT_LEAD`.

`MP_PROJECT_LEAD` не означает владение проектом.

---

## 5. Partner Portal

`PILGRIMS_PARTNER` получает вход в Modern Pilgrims, но его основной интерфейс — клиентский/партнёрский кабинет.

Валентин видит только BEREG и разрешённые поверхности BEREG.

Габиль видит только Обитель и разрешённые поверхности Обители.

Partner Portal может показывать:

- состояние проекта;
- agreed Results;
- Decisions, где нужен клиент;
- Waiting/Blockers, затрагивающие клиента;
- выбранные артефакты;
- delivery milestones;
- коммерческие/приёмочные материалы, если они относятся к проекту;
- историю согласований.

Partner Portal не должен автоматически показывать:

- полную Team Board;
- чужие проекты;
- внутренние оценки людей;
- внутренние черновики, не предназначенные клиенту;
- portfolio-wide Daily/Weekly;
- access administration.

---

## 6. Modern Pilgrims Board boundary

Полный Operating / Portfolio Board:

- Женя — yes
- Никита — yes
- TEAM_MEMBER — отдельное решение по уровню видимости
- PILGRIMS_PARTNER — no

Партнёру показывается производная project-scoped поверхность, а не внутренняя борда целиком.

---

## 7. Partner → Pilgrim

Партнёр может позже стать участником команды Modern Pilgrims.

Это не изменение ownership проекта и не автоматическое следствие сотрудничества.

```text
PILGRIMS_PARTNER
+
успешное сотрудничество
↓
PILGRIM CANDIDATE
↓
INVITATION
↓
ACCEPTED
↓
TEAM_MEMBER
```

После перехода человек может одновременно оставаться:

- владельцем своего проекта;
- Dementor в Dementor Club;
- TEAM_MEMBER в Modern Pilgrims.

Эти роли независимы.

---

## 8. Data model v0.2

Рекомендуемые сущности:

```text
profiles
spaces
space_memberships
projects
project_ownerships
project_memberships
transition_invitations
access_audit_log
```

### `projects`

Access registry / project identity.

Поля концептуально:

```text
id
slug
name
status
source_ref
created_at
updated_at
```

Не считать `space_id = modern-pilgrims` доказательством владения Modern Pilgrims.

### `project_ownerships`

Отдельно фиксирует клиентское владение:

```text
project_id
owner_user_id
owner_role = CLIENT_OWNER
status
created_at
```

Initial:

```text
BEREG  → Valentin
OBITEL → Gabil
```

### `project_memberships`

Фиксирует рабочий доступ:

```text
project_id
user_id
role
status
```

Roles:

```text
MP_PROJECT_LEAD
MP_CONTRIBUTOR
MP_VIEWER
CLIENT_MEMBER
```

`CLIENT_OWNER` лучше хранить в ownership-слое, а не смешивать с delivery membership.

---

## 9. Security

Default deny.

Права вычисляются по scope:

1. user identity;
2. space membership;
3. project ownership;
4. project membership;
5. capability.

Владельцу проекта доступен его project/client scope, но не внутренняя платформа Modern Pilgrims.

Внутренней команде доступен проект согласно delivery role, но ownership не передаётся.

RLS должен enforce эту границу независимо от UI.

---

## 10. Текущая фактическая карта

```text
Женя
DC OWNER_ADMIN
MP OWNER_ADMIN

Никита
DC OWNER_ADMIN
MP OWNER_ADMIN

Валентин
DC DEMENTOR
MP PILGRIMS_PARTNER
BEREG CLIENT_OWNER

Габиль
DC DEMENTOR
MP PILGRIMS_PARTNER
OBITEL CLIENT_OWNER
```

Modern Pilgrims работает над BEREG и Обитель как delivery/operating partner.

---

## 11. Что ещё не утверждено

До миграции отдельно определить:

1. кто со стороны MP является `MP_PROJECT_LEAD` для BEREG;
2. кто со стороны MP является `MP_PROJECT_LEAD` для Обители;
3. какие Result/Decision/Waiting/Blocker видит CLIENT_OWNER;
4. какие внутренние поля никогда не выходят в Partner Portal;
5. может ли CLIENT_OWNER менять project state напрямую или только подтверждать/комментировать;
6. как моделировать несколько представителей клиента;
7. как project ownership отражается в Operating Board;
8. точная source-of-truth привязка Обители.

---

## 12. Implementation status

Это архитектурная фиксация.

НЕ сделано:

- SQL migration;
- RLS rollout;
- Supabase role seeding;
- Partner Portal;
- production deploy.

Следующий порядок:

`approve v0.2 → permission surfaces → SQL/RLS v0.2 review → staging → deploy`
