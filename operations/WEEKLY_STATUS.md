# Dementor Club — Weekly Status Source

Updated: 2026-08-25
Owner: Yauhen / Женя
Project priority: P1

Этот файл — компактный источник для weekly report. Подробные решения лежат в `operations/MVP_PLAN_2026-08-25.md`, `operations/PRODUCT_GLOSSARY.md`, `operations/DUMAI_S_OPASNOSTYU_PROTOTYPE_V02_TZ.md` и `operations/DUMAI_S_OPASNOSTYU_TEST_02_DAY1_2026-08-25.md`.

## Status

🟡 Двигается с проблемами

## Stage

Сборка → проверка MVP

## What changed this week

- Зафиксирована продуктовая архитектура: Merch / Events / Courses / Join / Donations / Dementors.
- Уточнено ключевое разделение: Event = offline, Course = online.
- Для первого MVP выбран e-mail-first подход вместо полной авторизации.
- Merch MVP переопределён как preorder-first, без обязательной полноценной оплаты.
- Course MVP определён как многодневный flow с дневными блоками, сохранением незавершённых вопросов, e-mail и точечным AI-анализом.
- Первым end-to-end Course выбран `ДУМАЙ С ОПАСНОСТЬЮ` / Валентин Лосев.
- Создан изолированный проходной prototype v0.1 в ветке `prototype/dumai-s-opasnostyu-v0-1`; production route и canonical course не изменялись.
- **Prototype v0.1 полностью протестирован Yauhen вручную end-to-end.** Базовая механика подтверждена; выявлен UX gap: версия ощущалась как длинная форма, недостаточно реагировала на качество ответов и перегружала отдельные экраны.
- Создано ТЗ на prototype v0.2: `operations/DUMAI_S_OPASNOSTYU_PROTOTYPE_V02_TZ.md`.
- Prototype v0.2 собран как отдельный screen-by-screen flow и передан на повторный тест.
- **Yauhen начал Test 02 и проверил Day 1.** Зафиксирован новый approved prototype UX pattern: `curated options → own variant → editable selected answer` вместо blank free-text-first там, где пространство ответов предсказуемо.
- Для single-choice экранов выбран базовый UI-паттерн `6 вариантов + Свой вариант`; для предпосылок и других multi-answer блоков — контекстный набор + повторяемый свой вариант.
- После initial confidence дальнейшая динамика confidence в prototype рассчитывается детерминированно из структуры ответов, без AI и без ручной подстройки пользователем.
- На старте каждого следующего дня теперь должна показываться динамика предыдущего дня и краткое объяснение результата.
- UX pattern распространён с Day 1 на аналогичные вопросы Days 2–7.
- Prototype harmonized with current site design tokens: paper / ink / acid; red оставлен только для danger/error/stamp semantics.
- Валентин сохраняется как отдельный authorial intervention layer с цитатами в ключевых точках курса.
- Test 02 Day 1 record: `operations/DUMAI_S_OPASNOSTYU_TEST_02_DAY1_2026-08-25.md`.
- `/join` остаётся отдельным onboarding, результаты 9 сфер должны сохраняться с привязкой к e-mail и отправляться пользователю.
- Нужны минимум 2 event pages, минимум 1–2 законченных Dementor profiles и отдельный Donations flow.
- Visual production теперь ведётся по продуктовым сущностям, а не просто «иллюстрации для сайта».

## Current work

### Yauhen / Женя — Product / Operating

NOW:
- повторно пройти `ДУМАЙ С ОПАСНОСТЬЮ` prototype v0.2 после option-first / auto-confidence итерации;
- проверить Day 2 continuity и понятность автоматической динамики;
- структурировать MVP backlog;
- следить за зависимостями и блокерами;
- синхронизировать `dementor-club` → `dementor-club-site`;
- довести public MVP до end-to-end сценариев;
- обеспечить попадание статуса проекта в weekly report.

Expected result:
- повторно тестируемый course prototype v0.2 с option-first UX и deterministic confidence;
- стабильный public MVP с preorder, первым production course flow, join/e-mail result, events, dementors и donations.

### Nikita — Design / Merch

NOW:
- первая серия merch;
- product visuals;
- подготовка визуалов для course/events/dementors/donations.

NEXT:
- merch shop presentation;
- course hero/screens;
- event posters;
- OG/social assets.

## Known current assets/state

- `/join` и onboarding уже существуют в проекте.
- В source-of-truth есть 3 course documents: `dengi-na-veter`, `dumai-s-opasnostyu`, `slaboumie-i-otvaga`.
- `ДУМАЙ С ОПАСНОСТЬЮ` выбран как первый Course для end-to-end MVP.
- Frozen prototype reference: `courses/dumai-s-opasnostyu-production-prototype-v0.1.md`.
- Prototype v0.1: ветка `prototype/dumai-s-opasnostyu-v0-1`, commit `8b6f0072c9ff2c1e2060f44f63ff373fd8866812`.
- v0.2 task: `operations/DUMAI_S_OPASNOSTYU_PROTOTYPE_V02_TZ.md`.
- Test 02 Day 1: `operations/DUMAI_S_OPASNOSTYU_TEST_02_DAY1_2026-08-25.md`.
- Prototype v0.2 implementation branch: `prototype/dumai-s-opasnostyu-v0-2`.
- В events source-of-truth сейчас есть `fuengirola`.
- В merch уже есть `PRODUCT_CARD_SCHEMA.md`, `README.md`, `products/`.
- Site/Ink/raster work активно производится.

## Main blockers

1. Site Integrity / release readiness — главный технический блокер public MVP.
2. Merch shop ещё зависит от финальных товаров/визуалов.
3. Первый Course имеет протестированный UX prototype, но production e-mail/session backend, server-side state и day delivery ещё не реализованы.
4. Prototype v0.2 находится во втором UX-тесте; Day 1 feedback уже применён, но нужен новый walkthrough минимум через Day 2 и затем полный end-to-end pass.
5. Автоматическая confidence-модель пока является prototype heuristic и должна быть проверена на понятность/адекватность до production contract.
6. Второе офлайн-событие ещё не зафиксировано отдельной approved event entity.
7. E-mail capture/storage/sending backend ещё не оформлен как единый слой.
8. Donations пока концепт, нет утверждённого final copy/working payment mechanism.
9. Privacy/terms/disclaimer нужно делать после фиксации фактических data flows, но до полноценного публичного сбора данных/платежей.

## Next milestone

`Public MVP transactional skeleton`

Definition:
- merch preorder works;
- one online course works end-to-end over e-mail;
- join result is saved/sent by e-mail;
- 2 events are correctly represented;
- 1–2 dementor profiles are complete;
- donations page exists with a working or explicitly staged CTA;
- mobile + smoke test pass;
- Site Integrity no longer blocks release.

### Next externally testable result

`ДУМАЙ С ОПАСНОСТЬЮ — Prototype v0.2 / option-first iteration`

Definition:
- screen-by-screen focused flow;
- contextual curated choices + editable own answer where appropriate;
- Day 1 confidence calculated automatically without AI;
- same deterministic approach propagated through Days 2–7;
- each next day starts with previous-day result/dynamics;
- stronger contextual Valentin interventions;
- site paper/ink/acid color standards applied;
- Danger Map, exam and certificate remain explicit stages.

## Weekly-report interpretation

Do not report ideas as completed work.

Report separately:
- approved product decisions;
- implemented site functionality;
- visual assets completed;
- blocked items;
- next externally testable result.

For current week report as completed:
- first passable Course prototype created;
- manual end-to-end v0.1 test completed by **Yauhen**;
- core course mechanics validated;
- v0.2 screen-by-screen prototype created;
- Test 02 / Day 1 completed by **Yauhen**;
- option-first + editable answer UX pattern approved for prototype;
- deterministic confidence approach implemented for prototype without AI;
- Day 1 feedback propagated to analogous Days 2–7 interactions;
- current site color tokens applied to prototype.

Do not report as completed:
- Test 02 full end-to-end pass;
- production course backend;
- real e-mail delivery;
- server-side course state;
- production AI analysis;
- new public production flow.

Current readiness estimate from previous report (~75%) should be treated cautiously: visual/content production is advanced, but transactional/user-data flows are materially less complete than the overall page count suggests.
