# Dementor Club — Weekly Status Source

Updated: 2026-08-25
Owner: Yauhen / Женя
Project priority: P1

Этот файл — компактный источник для weekly report. Подробные решения лежат в `operations/MVP_PLAN_2026-08-25.md`, `operations/PRODUCT_GLOSSARY.md`, `operations/DUMAI_S_OPASNOSTYU_PROTOTYPE_V02_TZ.md`, `operations/DUMAI_S_OPASNOSTYU_TEST_02_DAY1_2026-08-25.md` и `courses/dumai-s-opasnostyu-production-stage-1.md`.

## Status

🟡 Двигается с проблемами

## Stage

Public MVP → Production Stage 1 / transactional layers pending

## What changed this week

- Зафиксирована продуктовая архитектура: Merch / Events / Courses / Join / Donations / Dementors.
- Уточнено ключевое разделение: Event = offline, Course = online.
- Для первого MVP выбран e-mail-first подход вместо полной авторизации.
- Merch MVP переопределён как preorder-first, без обязательной полноценной оплаты.
- Первым end-to-end Course выбран `ДУМАЙ С ОПАСНОСТЬЮ` / Валентин Лосев.
- Prototype v0.1 полностью протестирован Yauhen вручную end-to-end; базовая механика подтверждена, UX gaps документированы.
- Prototype v0.2 собран как screen-by-screen flow. Test 02 / Day 1 проведён Yauhen; утверждён паттерн `curated options → own variant → editable selected answer`.
- Для single-choice экранов принят паттерн `6 вариантов + Свой вариант`; для multi-answer — контекстный набор + повторяемый свой вариант.
- После initial confidence дальнейшая динамика confidence рассчитывается детерминированно из структуры ответов, без AI и без ручной подстройки пользователем.
- Каждый следующий день начинается с результата и динамики предыдущего дня.
- UX pattern распространён с Day 1 на аналогичные вопросы Days 2–7.
- Prototype harmonized with current site design tokens: paper / ink / acid; red оставлен только для danger/error/stamp semantics.
- Валентин используется как отдельный authorial intervention layer в ключевых точках курса.
- **Yauhen одобрил v0.2 как основу Production Stage 1.** Решение зафиксировано в `courses/dumai-s-opasnostyu-production-stage-1.md`.
- **COURSE-001 опубликован на production route `/courses/dumai-s-opasnostyu/` как `active-production-stage-1`.** Старый вариант страницы заменён новым flow.
- Production Stage 1 остаётся web/self-paced и browser-local: localStorage, без AI, без server-side course session и без реальной отправки e-mail. Эти возможности явно отнесены к Stage 2.
- `content/registry.json` и implementation record COURSE-001 синхронизированы с Production Stage 1; catalog placement остаётся `not-approved`.
- Release gate исправлен: Site Integrity проходит полностью, включая registry/routes/feature state и page content readiness.
- `/join` остаётся отдельным onboarding; его transactional e-mail слой ещё не реализован.
- Нужны минимум 2 event pages, минимум 1–2 законченных Dementor profiles и отдельный Donations flow.

## Current work

### Yauhen / Женя — Product / Operating

NOW:
- наблюдать Production Stage 1 курса на реальных прохождениях и фиксировать product feedback;
- подготовить Stage 2 course backend: e-mail → enrollment → server-side session → continuation/result delivery;
- довести merch preorder до рабочего end-to-end сценария;
- довести Join e-mail/result flow;
- структурировать MVP backlog и зависимости;
- синхронизировать `dementor-club` → `dementor-club-site`;
- обеспечить попадание production-статусов в weekly report.

Expected result:
- первый публичный Course уже доступен как Stage 1;
- следующий функциональный шаг курса — Stage 2 persistence/e-mail;
- стабильный public MVP с preorder, join/e-mail result, events, dementors и donations.

### Nikita — Design / Merch

NOW:
- первая серия merch;
- product visuals;
- подготовка/полировка визуалов для course/events/dementors/donations.

NEXT:
- merch shop presentation;
- production course visuals/hero refinements;
- event posters;
- OG/social assets.

## Known current assets/state

- `/join` и onboarding существуют в проекте.
- В source-of-truth есть 3 course documents: `dengi-na-veter`, `dumai-s-opasnostyu`, `slaboumie-i-otvaga`.
- `ДУМАЙ С ОПАСНОСТЬЮ` — первый Course, продвинутый до публичного Production Stage 1.
- Production approval: `courses/dumai-s-opasnostyu-production-stage-1.md`.
- Stable production route: `/courses/dumai-s-opasnostyu/`.
- Prototype v0.1 archive: ветка `prototype/dumai-s-opasnostyu-v0-1`, commit `8b6f0072c9ff2c1e2060f44f63ff373fd8866812`.
- v0.2 task: `operations/DUMAI_S_OPASNOSTYU_PROTOTYPE_V02_TZ.md`.
- Test 02 Day 1: `operations/DUMAI_S_OPASNOSTYU_TEST_02_DAY1_2026-08-25.md`.
- Prototype v0.2 archive branch: `prototype/dumai-s-opasnostyu-v0-2`.
- Site Integrity currently passes after release-gate fixes.
- В events source-of-truth сейчас есть `fuengirola`.
- В merch уже есть `PRODUCT_CARD_SCHEMA.md`, `README.md`, `products/`.

## Main blockers

1. Merch shop ещё зависит от финальных товаров/визуалов и рабочего preorder data flow.
2. Course Stage 2 backend ещё не реализован: real e-mail delivery, enrollment, server-side session/state и day continuation.
3. Автоматическая confidence-модель Stage 1 является детерминированной product heuristic; её нужно наблюдать на реальных прохождениях и калибровать при необходимости, не превращая в психологический score.
4. Второе офлайн-событие ещё не зафиксировано отдельной approved event entity.
5. Join e-mail capture/storage/result sending backend ещё не оформлен как рабочий слой.
6. Donations пока концепт: нет утверждённого final copy/working payment mechanism.
7. Privacy/terms/disclaimer должны быть пересмотрены перед Stage 2 и перед включением внешнего сбора данных/платежей.
8. Vercel может временно отклонять отдельные новые deploy попытки по build-rate-limit; последняя функциональная production-сборка курса до документационного commit была успешной. Это инфраструктурное ограничение, а не ошибка курса.

## Next milestone

`Public MVP transactional skeleton`

Definition:
- merch preorder works;
- Course Stage 1 публичен — DONE;
- Course Stage 2 умеет сохранять server-side session и продолжать/отправлять результат по e-mail;
- join result is saved/sent by e-mail;
- 2 events are correctly represented;
- 1–2 dementor profiles are complete;
- donations page exists with a working or explicitly staged CTA;
- mobile + smoke test pass;
- Site Integrity passes — DONE.

### Next externally testable result

`ДУМАЙ С ОПАСНОСТЬЮ — Production Stage 2 / persistence + e-mail`

Definition:
- e-mail становится реальным минимальным user ID;
- enrollment/session сохраняются server-side;
- browser localStorage остаётся draft/recovery cache;
- пользователь может продолжить курс по ссылке/идентификатору;
- результат и следующий доступный блок могут доставляться по e-mail;
- существующий Stage 1 UX не ломается;
- AI не является обязательным для прохождения и подключается только после отдельного решения.

## Weekly-report interpretation

Do not report ideas as completed work.

For current week report as completed:
- first passable Course prototype created;
- manual end-to-end v0.1 test completed by **Yauhen**;
- v0.2 screen-by-screen prototype created;
- Test 02 / Day 1 completed by **Yauhen**;
- option-first + editable answer UX pattern approved;
- deterministic confidence implemented without AI;
- Day 1 pattern propagated to analogous Days 2–7 interactions;
- current site color tokens applied;
- **Yauhen approved Production Stage 1**;
- **old public Valentin course page replaced by the approved Stage 1 flow**;
- **COURSE-001 status promoted to active-production-stage-1**;
- **Site Integrity release gate fixed and passing**.

Do not report as completed:
- Course Stage 2 backend;
- real e-mail delivery;
- server-side course state;
- production AI answer analysis;
- merch preorder transaction flow;
- Join e-mail/result backend.

Current readiness should continue to separate visual/content readiness from transactional readiness. Course Stage 1 is now a real public product surface, but the wider Public MVP still lacks several transactional/data flows.
