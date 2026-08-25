# Dementor Club — Weekly Status Source

Updated: 2026-08-25
Owner: Yauhen / Женя
Project priority: P1

Этот файл — компактный источник для weekly report. Подробные решения лежат в `operations/MVP_PLAN_2026-08-25.md`, `operations/PRODUCT_GLOSSARY.md` и `operations/DUMAI_S_OPASNOSTYU_PROTOTYPE_V02_TZ.md`.

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
- **Prototype v0.1 полностью протестирован Yauhen вручную end-to-end.** Базовая механика подтверждена; выявлен UX gap: текущая версия ощущается как длинная форма, недостаточно реагирует на качество ответов и перегружает отдельные экраны.
- Создано ТЗ на prototype v0.2: `operations/DUMAI_S_OPASNOSTYU_PROTOTYPE_V02_TZ.md`.
- `/join` остаётся отдельным onboarding, результаты 9 сфер должны сохраняться с привязкой к e-mail и отправляться пользователю.
- Нужны минимум 2 event pages, минимум 1–2 законченных Dementor profiles и отдельный Donations flow.
- Visual production теперь ведётся по продуктовым сущностям, а не просто «иллюстрации для сайта».

## Current work

### Yauhen / Женя — Product / Operating

NOW:
- довести `ДУМАЙ С ОПАСНОСТЬЮ` prototype v0.2 до повторного UX-теста;
- структурировать MVP backlog;
- следить за зависимостями и блокерами;
- синхронизировать `dementor-club` → `dementor-club-site`;
- довести public MVP до end-to-end сценариев;
- обеспечить попадание статуса проекта в weekly report.

Expected result:
- повторно тестируемый course prototype v0.2;
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
- Test result / v0.2 task: `operations/DUMAI_S_OPASNOSTYU_PROTOTYPE_V02_TZ.md`.
- В events source-of-truth сейчас есть `fuengirola`.
- В merch уже есть `PRODUCT_CARD_SCHEMA.md`, `README.md`, `products/`.
- Site/Ink/raster work активно производится.

## Main blockers

1. Site Integrity / release readiness — главный технический блокер public MVP.
2. Merch shop ещё зависит от финальных товаров/визуалов.
3. Первый Course имеет протестированный UX prototype, но production e-mail/session backend, server-side state и day delivery ещё не реализованы.
4. Prototype v0.2 требует переработки screen density, validation language, response-quality feedback, Danger Map и final sequence перед production harmonization.
5. Второе офлайн-событие ещё не зафиксировано отдельной approved event entity.
6. E-mail capture/storage/sending backend ещё не оформлен как единый слой.
7. Donations пока концепт, нет утверждённого final copy/working payment mechanism.
8. Privacy/terms/disclaimer нужно делать после фиксации фактических data flows, но до полноценного публичного сбора данных/платежей.

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

`ДУМАЙ С ОПАСНОСТЬЮ — Prototype v0.2`

Definition:
- screen-by-screen focused flow;
- meaningful deterministic feedback on weak/duplicate answers;
- stronger contextual Valentin reactions;
- confidence change explained, not gamified;
- Danger Map redesigned as an artifact;
- exam and certificate separated into explicit stages.

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
- manual end-to-end test completed by **Yauhen**;
- core course mechanics validated;
- UX/content-quality gaps documented;
- v0.2 technical task created.

Do not report as completed:
- production course backend;
- real e-mail delivery;
- server-side course state;
- AI analysis;
- new public production flow.

Current readiness estimate from previous report (~75%) should be treated cautiously: visual/content production is advanced, but transactional/user-data flows are materially less complete than the overall page count suggests.
