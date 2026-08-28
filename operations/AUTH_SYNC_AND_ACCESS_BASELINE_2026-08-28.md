# Dementor Club — Auth, Sync & Access Baseline

Дата: 2026-08-28
Статус: APPROVED BASELINE / ACCESS IMPLEMENTATION NEXT
Source of truth: `dementor-club`

## 1. Что уже закрыто

На 2026-08-28 подтвержден рабочий production-контур:

`Google OAuth → Supabase session → persistence after reload → profile → assessment_runs → assessment_snapshots → cross-device restore`.

Проверено практически:
- Google login работает на desktop и mobile;
- PKCE callback вынесен в `/auth/callback/` и не зависит от onboarding runtime `/join/`;
- сессия сохраняется в browser storage и восстанавливается после reload;
- профиль определяется на другом устройстве после входа тем же Google account;
- завершенные DC-9 результаты сохраняются в `assessment_runs`;
- актуальная карта сохраняется в `assessment_snapshots`;
- после исправления sync v8.1 завершенная сфера сразу обновляет snapshot и становится доступна на другом устройстве;
- `AUTH TEST` и `SYNC TEST` остаются внутренними diagnostics в Design System / System Tools.

Это заменяет более раннее MVP-предположение `email = временный user id` и статус `Google auth later` из старого backlog. Identity baseline теперь: `Supabase auth user_id`.

## 2. Следующий слой: Access Control

Google/Supabase authentication отвечает только на вопрос: **кто пользователь**.

Следующий этап системы отвечает на вопрос: **что этому пользователю разрешено**.

Утвержденная лестница доступа:

`OWNER_ADMIN → DEMENTOR → CLUB_MEMBER → AUTHENTICATED → GUEST`

Уровни наследуются сверху вниз: более высокий уровень включает возможности нижних уровней.

### L4 — OWNER_ADMIN

Полный системный / административный / операторский доступ.

Начальные назначения:
- Женя;
- Никита.

`OWNER_ADMIN` включает также права `DEMENTOR`, `CLUB_MEMBER`, `AUTHENTICATED`, `GUEST`.

Ожидаемая зона доступа:
- System Tools / diagnostics;
- служебные страницы Design System;
- управление ролями и разрешениями;
- внутренние операционные поверхности сайта;
- административные действия, которые будут отдельно реализованы.

### L3 — DEMENTOR

Дементорский доступ без системного администрирования.

Начальные назначения:
- Валентин;
- Габиль;
- Женя — через наследование от `OWNER_ADMIN`;
- Никита — через наследование от `OWNER_ADMIN`.

Ожидаемая зона доступа:
- закрытые Dementor-only материалы и инструменты;
- собственные программы / события / связанные внутренние поверхности после их реализации;
- возможности уровней ниже.

`DEMENTOR` сам по себе не дает права управлять системой, пользователями или ролями.

### L2 — CLUB_MEMBER

Утвержденный член клуба.

Конкретная механика получения/подтверждения членства пока не зафиксирована и не должна изобретаться в коде.

Ожидаемая зона доступа:
- member-only community/content/features после утверждения механики;
- возможности `AUTHENTICATED` и `GUEST`.

### L1 — AUTHENTICATED

Любой пользователь, успешно вошедший через поддерживаемый auth provider.

Доступ:
- собственный профиль;
- собственная карта DC-9;
- cross-device sync;
- собственные пользовательские данные и общие logged-in features;
- публичные возможности гостя.

Сам факт Google login **не означает членство в клубе** и не делает пользователя Dementor.

### L0 — GUEST

Неавторизованный посетитель.

Доступ только к публичной части сайта и публичным действиям.

## 3. Важные правила

### Роль не выводится из теста

Результат DC-9, включая уровень `Дементор`, является результатом клубной диагностической механики и **не назначает системную роль `DEMENTOR`**.

Системные роли назначаются клубом явно.

### Hidden UI ≠ security

Long-press в футере и скрытые URL являются только механизмом обнаружения internal UI.

Они не считаются защитой доступа.

Authorization должен проверяться серверно через Supabase / RLS / policy layer. UI также должен скрывать недоступные функции, но client-side hiding не является security boundary.

### Identity ≠ role

Не использовать имя профиля как authority.

Роли должны быть привязаны к стабильному Supabase `user_id` через отдельную серверную модель ролей/permissions.

### Явное назначение

Для `OWNER_ADMIN`, `DEMENTOR`, `CLUB_MEMBER` требуется явная запись/назначение роли. Не делать автоматических повышений по email domain, результатам тестов, activity score или другим косвенным признакам.

## 4. Реализация — следующий технический этап

Рекомендуемая production-модель:

- `profiles` — identity/profile data;
- отдельная таблица `user_roles` или эквивалент;
- enum/controlled role values: `owner_admin`, `dementor`, `club_member`;
- `authenticated` и `guest` определяются auth state и не требуют ручной записи;
- RLS policies / server checks проверяют роль;
- helper/view/function возвращает effective access level;
- frontend использует effective role только для UX, не как единственную защиту.

Первый implementation gate:
1. создать role storage + RLS;
2. назначить `OWNER_ADMIN` Жене и Никите по реальным Supabase `user_id`;
3. назначить `DEMENTOR` Валентину и Габилю после точного сопоставления их аккаунтов;
4. закрыть `/design-system/admin/`, `/design-system/auth-test/`, `/design-system/sync-test/` для `OWNER_ADMIN`;
5. подготовить Dementor-only route/feature gate;
6. затем реализовать `CLUB_MEMBER` после утверждения механики членства.

## 5. Граница текущего решения

Сейчас утверждены:
- hierarchy;
- первые персональные назначения верхних ролей;
- принцип наследования;
- server-side authorization requirement.

Пока НЕ утверждены:
- механика получения членства;
- платные/бесплатные уровни членства;
- автоматические правила promotion/demotion;
- полный permission matrix для каждой страницы и каждого действия.

Эти решения фиксировать отдельно до реализации публичной механики.
