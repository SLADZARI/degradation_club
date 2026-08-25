# Dementor Club — Weekly Status Source

Updated: 2026-08-25
Owner: Yauhen / Женя
Project priority: P1

Этот файл — компактный источник для weekly report. Подробные решения лежат в `operations/MVP_PLAN_2026-08-25.md` и `operations/PRODUCT_GLOSSARY.md`.

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
- `/join` остаётся отдельным onboarding, результаты 9 сфер должны сохраняться с привязкой к e-mail и отправляться пользователю.
- Нужны минимум 2 event pages, минимум 1–2 законченных Dementor profiles и отдельный Donations flow.
- Visual production теперь ведётся по продуктовым сущностям, а не просто «иллюстрации для сайта».

## Current work

### Yauhen / Женя — Product / Operating

NOW:
- структурировать MVP backlog;
- следить за зависимостями и блокерами;
- синхронизировать `dementor-club` → `dementor-club-site`;
- довести public MVP до end-to-end сценариев;
- обеспечить попадание статуса проекта в weekly report.

Expected result:
- стабильный public MVP с preorder, первым course flow, join/e-mail result, events, dementors и donations.

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
- В events source-of-truth сейчас есть `fuengirola`.
- В merch уже есть `PRODUCT_CARD_SCHEMA.md`, `README.md`, `products/`.
- Site/Ink/raster work активно производится.

## Main blockers

1. Site Integrity / release readiness — главный технический блокер public MVP.
2. Merch shop ещё зависит от финальных товаров/визуалов.
3. Первый course end-to-end ещё не выбран и не реализован как рабочий flow.
4. Второе офлайн-событие ещё не зафиксировано отдельной approved event entity.
5. E-mail capture/storage/sending backend ещё не оформлен как единый слой.
6. Donations пока концепт, нет утверждённого final copy/working payment mechanism.
7. Privacy/terms/disclaimer нужно делать после фиксации фактических data flows, но до полноценного публичного сбора данных/платежей.

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

## Weekly-report interpretation

Do not report ideas as completed work.

Report separately:
- approved product decisions;
- implemented site functionality;
- visual assets completed;
- blocked items;
- next externally testable result.

Current readiness estimate from previous report (~75%) should be treated cautiously: visual/content production is advanced, but transactional/user-data flows are materially less complete than the overall page count suggests.
