# Dementor Club × Modern Pilgrims — Shared Auth Only Boundary v0.4

Дата: 2026-08-28
Статус: ARCHITECTURAL RULE / NOT DEPLOYED

## Главный принцип

**SHARED AUTH ONLY**

Dementor Club и Modern Pilgrims используют общую identity/auth инфраструктуру только для того, чтобы один человек мог входить одним аккаунтом.

Общими допустимо иметь только:

- Supabase Auth identity (`auth.users.id`);
- login/session infrastructure;
- базовый human profile (`profiles`: имя, аватар, технические метаданные пользователя);
- минимальный общий Access Kernel только как технический механизм проверки scoped memberships.

Все продуктовые данные, роли, проекты и интерфейсы должны оставаться раздельными.

## Жёстко запрещённое смешение

Нельзя:

- хранить DC и MP проекты в одном смысловом project registry;
- автоматически выдавать MP role из DC role;
- автоматически выдавать DC role из MP role;
- считать DC-9 результат access-сигналом для Modern Pilgrims;
- показывать MP project data на Dementor Club сайте;
- показывать DC project data на Modern Pilgrims сайте;
- использовать один общий project role vocabulary для двух продуктов;
- делать cross-product inheritance прав;
- считать один сайт административным интерфейсом другого.

## Namespaces

Dementor Club product data:

`dc_*`

Modern Pilgrims product data:

`mp_*`

Общие identity tables могут оставаться без product prefix только если они действительно product-neutral.

## Проекты

### Dementor Club

Имеет собственный project/content/event registry и собственный source-of-truth.

### Modern Pilgrims

Имеет собственный operating/project registry.

BEREG и Obitel существуют в Modern Pilgrims как клиентские проекты, над которыми работает команда Modern Pilgrims.

Они не являются проектами Dementor Club даже если их владельцы одновременно имеют роль DEMENTOR.

## Люди могут пересекаться, проекты — нет

Один человек может одновременно быть:

- Dementor Club / DEMENTOR;
- Modern Pilgrims / PILGRIMS_PARTNER;
- владельцем клиентского проекта Modern Pilgrims.

Это не объединяет две системы.

Пересечение человека означает только повторное использование identity.

## Стартовое дерево Modern Pilgrims

OWNER_ADMIN
- Zhenya
- Nikita

TEAM_MEMBER
- internal Modern Pilgrims team

PILGRIMS_PARTNER
- Valentin
  - BEREG / CLIENT_OWNER
  - his team / PARTNER_TEAM_MEMBER
- Gabil
  - OBITEL / CLIENT_OWNER
  - his team / PARTNER_TEAM_MEMBER

PARTNER_TEAM_MEMBER всегда слабее CLIENT_OWNER и видит только явно разрешённый клиентский project scope.

## Стартовое дерево Dementor Club

OWNER_ADMIN
- Zhenya
- Nikita

DEMENTOR
- Valentin
- Gabil

CLUB_MEMBER
AUTHENTICATED
GUEST

Это дерево не должно использоваться для Modern Pilgrims authorization.

## Data isolation rule

Даже при общей Supabase-инсталляции:

- DC rows должны ссылаться только на DC scope;
- MP rows должны ссылаться только на MP scope;
- RLS policies пишутся отдельно;
- project ids не переиспользуются между продуктами;
- cross-product joins допустимы только через neutral `user_id` и только когда это явно нужно для identity-level UX.

## Причина общей аутентификации

Общая аутентификация используется только ради удобства людей, которые часто пересекаются между экосистемами.

Она не означает общую операционную систему, общий сайт, общий project graph или общую продуктовую модель.

## Release rule

Любая будущая миграция, которая объединяет DC и MP product data в общую semantic table без явного архитектурного решения, считается нарушением этой границы.
