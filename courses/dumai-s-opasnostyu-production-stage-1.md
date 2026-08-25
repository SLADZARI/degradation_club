# ДУМАЙ С ОПАСНОСТЬЮ — Production Stage 1

Status: **approved for public production**
Approved by: **Yauhen**
Approval date: **2026-08-25**
Entity: `COURSE-001`
Dementor: Валентин Лосев
Canonical course: `courses/dumai-s-opasnostyu.md`
Approved prototype basis: `prototype/dumai-s-opasnostyu-v0-2`
Public route: `/courses/dumai-s-opasnostyu/`

## Decision

Prototype v0.2 после второго тестового прохода первого дня утверждён как основа первой публичной production-стадии курса. Текущий старый вариант страницы курса должен быть заменён на новый screen-by-screen flow.

## Production Stage 1 contract

Первая публичная стадия:
- web / self-paced;
- один реальный decision на пользователя;
- option-first UX: curated options → свой вариант → редактируемый итоговый ответ;
- один основной вопрос/действие на экран;
- 7 последовательных дней/блоков;
- initial confidence задаётся пользователем один раз;
- Day 1–7 confidence рассчитывается детерминированно по структуре ответов, без AI;
- каждый следующий день начинаетcя с результата и динамики предыдущего;
- Валентин Лосев появляется как отдельный authorial intervention layer в ключевых точках;
- финальные стадии: verdict → exam → Danger Map → certificate;
- прогресс Stage 1 хранится локально в браузере (`localStorage`).

## E-mail boundary for Stage 1

E-mail может использоваться в интерфейсе как локальный идентификатор сессии, но на Stage 1:
- адрес не отправляется на сервер;
- письмо не отправляется;
- серверная course session ещё не создаётся;
- интерфейс обязан прямо сообщать об этом и не имитировать работающий backend.

## Stage 2 remains planned

Следующая техническая стадия после публичной проверки Stage 1:

`email → enrollment → server-side session → day delivery / continuation → result e-mail`

Stage 2 не является блокером публикации Stage 1 и не должна изображаться как уже реализованная.

## Visual contract

Использовать актуальные site tokens Dementor Club:
- paper `#f2f0e8`;
- ink `#111`;
- acid `#d8ff3e`;
- red только для danger / error / stamp semantics.

## Publication rules

- production route `/courses/dumai-s-opasnostyu/` становится текущей публичной версией курса;
- prototype route остаётся внутренним архивом тестирования;
- курс пока не добавляется автоматически в главный каталог, если отдельное решение о catalog placement не принято;
- `/join` не меняется;
- другие курсы не меняются;
- Event / Course граница не меняется.

## Weekly report interpretation

Report as completed:
- `ДУМАЙ С ОПАСНОСТЬЮ` approved for Production Stage 1 by Yauhen;
- tested prototype mechanics promoted to the public course route;
- Stage 1 is browser-local and deterministic, without AI/backend claims.

Do not report as completed:
- server-side course state;
- real e-mail sending;
- AI answer analysis;
- Stage 2 enrollment/backend.
