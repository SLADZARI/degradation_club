# Dementor Club × Modern Pilgrims — Identity & Access Model v0.1

Дата: 2026-08-28
Статус: APPROVED ARCHITECTURAL DRAFT / NOT DEPLOYED
Область: Dementor Club, Modern Pilgrims, project-scoped collaboration

## 0. Решение

Одна человеческая identity может существовать одновременно в нескольких пространствах экосистемы.

Google/Supabase Auth отвечает только на вопрос:

> кто это?

Роли и memberships отвечают на вопрос:

> к чему у этого человека есть доступ?

Нельзя хранить один глобальный `profile.role` и считать его универсальным для всей экосистемы.

Ключевой принцип:

**IDENTITY ≠ SPACE ROLE ≠ PROJECT ACCESS**

---

## 1. Пространства верхнего уровня

### 1.1 Dementor Club

Культурная платформа и клуб.

Текущая лестница доступа:

`OWNER_ADMIN → DEMENTOR → CLUB_MEMBER → AUTHENTICATED → GUEST`

`AUTHENTICATED` и `GUEST` — состояния identity, а не выдаваемые клубные роли.

### 1.2 Modern Pilgrims

Операционная и проектная экосистема.

Modern Pilgrims не является «верхним уровнем Dementor Club» и Dementor Club не является подразделом Modern Pilgrims.

У человека могут существовать независимые memberships в обоих пространствах.

Базовые роли пространства Modern Pilgrims для проектирования:

- `OWNER_ADMIN` — полный platform/portfolio access;
- `TEAM_MEMBER` — участник внутренней команды;
- отсутствие membership — нет доступа к внутренней платформе целиком.

Project access выдаётся отдельно и не требует полного `TEAM_MEMBER`.

---

## 2. Начальные назначения

Назначения фиксируются по человеку. Техническая привязка к Supabase `user_id` выполняется только при реализации.

### Женя

Dementor Club:
- `OWNER_ADMIN`;
- имеет возможности `DEMENTOR`, `CLUB_MEMBER`, `AUTHENTICATED` по наследованию.

Modern Pilgrims:
- `OWNER_ADMIN`;
- полный доступ к operating/portfolio/team board;
- доступ ко всем проектам по platform-owner inheritance.

### Никита

Dementor Club:
- `OWNER_ADMIN`;
- имеет возможности `DEMENTOR`, `CLUB_MEMBER`, `AUTHENTICATED` по наследованию.

Modern Pilgrims:
- `OWNER_ADMIN`;
- полный доступ к operating/portfolio/team board;
- доступ ко всем проектам по platform-owner inheritance.

### Валентин

Dementor Club:
- `DEMENTOR`;
- имеет `CLUB_MEMBER` и `AUTHENTICATED` capabilities по наследованию.

Modern Pilgrims:
- не получает полный доступ к platform/team board автоматически;
- получает project-scoped membership только в BEREG;
- точный project role при реализации: `COLLABORATOR` как минимальная безопасная исходная модель, пока отдельно не утверждены полномочия project lead/editor.

### Габиль

Dementor Club:
- `DEMENTOR`;
- имеет `CLUB_MEMBER` и `AUTHENTICATED` capabilities по наследованию.

Modern Pilgrims:
- не получает полный доступ к platform/team board автоматически;
- получает project-scoped membership только в «Обитель» / Mycelium-контуре;
- точный project role при реализации: `COLLABORATOR` как минимальная безопасная исходная модель, пока отдельно не утверждены полномочия project lead/editor.

---

## 3. Team Board boundary

На первом этапе полный Modern Pilgrims Team / Operating Board доступен только:

- Жене;
- Никите.

Валентин и Габиль не получают portfolio-wide visibility только потому, что работают с Modern Pilgrims над отдельным проектом.

Их доступ должен быть ограничен собственным project scope.

Пример:

```text
Женя   → Modern Pilgrims / ALL
Никита → Modern Pilgrims / ALL
Валентин → Modern Pilgrims / BEREG only
Габиль → Modern Pilgrims / OBITEL only
```

Если позже появляется новый совместный проект, добавляется новая `project_membership`, а не расширяется глобальная роль.

---

## 4. Dementor → Pilgrim

`DEMENTOR` не является младшей ступенью `PILGRIM`.

Это разные типы участия:

- Dementor — роль внутри культурной платформы Dementor Club;
- Pilgrim / Team Member — участие во внутренней операционной экосистеме Modern Pilgrims.

Поэтому переход только явный:

```text
DEMENTOR
↓
project collaboration / accumulated contribution
↓
PILGRIM CANDIDATE
↓
INVITATION
↓
ACCEPTED
↓
MODERN PILGRIMS TEAM_MEMBER
```

Переход:
- не автоматический;
- не зависит от результата DC-9;
- не происходит из-за длительности участия;
- не происходит из-за project membership;
- требует отдельного решения/приглашения Modern Pilgrims.

После перехода Dementor role не исчезает. У человека могут одновременно существовать:

`Dementor Club / DEMENTOR`
+
`Modern Pilgrims / TEAM_MEMBER`

---

## 5. Результат DC-9 не является access role

Уровень onboarding/assessment, включая результат «Дементор», является содержательной диагностикой клуба.

Он не должен:
- выдавать `DEMENTOR` system role;
- открывать admin/system tools;
- открывать Team Board;
- создавать project membership;
- переводить пользователя в Modern Pilgrims.

System roles назначаются явно.

---

## 6. Каноническая data model boundary

Рекомендуемые сущности общей базы:

```text
profiles
spaces
space_memberships
projects
project_memberships
transition_invitations
access_audit_log
```

### profiles

Одна identity на Supabase `auth.users.id`.

Не хранить здесь универсальный access role.

### spaces

Минимум:

- `dementor-club`
- `modern-pilgrims`

### space_memberships

Поля концептуально:

- `user_id`
- `space_id`
- `role`
- `status`
- `granted_by`
- `granted_at`
- `revoked_at`

### projects

Проект принадлежит одному space.

Для Modern Pilgrims минимум должны поддерживаться:

- BEREG;
- Обитель / Mycelium;
- следующие проекты без изменения access architecture.

### project_memberships

Поля концептуально:

- `user_id`
- `project_id`
- `role`
- `status`
- `granted_by`
- `granted_at`
- `revoked_at`

### transition_invitations

Отдельная сущность для явного Dementor → Pilgrim приглашения.

Не превращать её в hidden flag на `profiles`.

---

## 7. Permission inheritance

Роль может давать capabilities ниже по иерархии только внутри своего scope.

Пример Dementor Club:

`OWNER_ADMIN` включает `DEMENTOR`, `CLUB_MEMBER`, authenticated capabilities.

Но:

`Dementor Club / OWNER_ADMIN`

не должен автоматически означать

`Modern Pilgrims / OWNER_ADMIN`

если такое назначение отдельно не существует.

Для Жени и Никиты оба назначения существуют явно.

---

## 8. Security boundary

UI visibility не является защитой.

Не использовать как security:

- hidden URL;
- long press;
- отсутствие ссылки в navbar;
- `if (email === ...)` во frontend;
- client-side role array без RLS.

Long-press Design/System Tools может оставаться discovery-механикой, но фактический доступ обязан проверяться на уровне Supabase/RLS/server middleware.

---

## 9. Что должно быть доступно по уровням Dementor Club

### GUEST

- публичные страницы;
- публичные Events/Projects/Merch;
- onboarding без server identity, если продукт это допускает.

### AUTHENTICATED

- собственный профиль;
- собственная карта DC-9;
- cross-device sync собственных данных;
- собственные покупки/регистрации по мере реализации.

### CLUB_MEMBER

Добавляет только утверждённые member-only возможности клуба.

Конкретный membership product/mechanics пока не придумывать до отдельного решения.

### DEMENTOR

Добавляет Dementor-only внутренние функции, когда они будут утверждены:

- собственный Dementor profile management;
- связанные события/курсы/проекты;
- доступ к выделенным рабочим материалам клуба.

Не даёт Modern Pilgrims Team Board автоматически.

### OWNER_ADMIN

- Dementor Club system/admin access;
- управление ролями/memberships в Dementor Club;
- internal diagnostics/system tools;
- полный клубный content/operations scope.

---

## 10. Статус реализации

### Уже доказано в production Dementor Club

- Google OAuth;
- dedicated PKCE callback;
- persistent Supabase session;
- `profiles` identity;
- cross-device assessment sync;
- `assessment_snapshots`;
- `assessment_runs`;
- Auth Test / Sync Test diagnostics.

### Ещё НЕ реализовано

- `spaces`;
- `space_memberships`;
- `projects` как access scopes общей базы;
- `project_memberships`;
- role-aware RLS;
- role-aware middleware;
- Team Board project scoping;
- Dementor → Pilgrim invitations;
- admin UI для выдачи/отзыва ролей.

Не считать эту спецификацию задеплоенной системой.

---

## 11. Следующий gate перед реализацией

До SQL migration согласовать:

1. финальные enum names;
2. project roles;
3. точные permissions каждой роли;
4. какой UI Modern Pilgrims показывается project collaborators;
5. где физически живёт «Обитель» в Modern Pilgrims source-of-truth;
6. способ связывания существующих проектов с общей `projects` registry;
7. кто имеет право выдавать `TEAM_MEMBER` и `DEMENTOR`;
8. audit requirements.

После этого:

`approved model → SQL migration draft → RLS tests → staging → production deploy`
