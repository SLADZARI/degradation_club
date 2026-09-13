# Dementor Club — current development tasks

Дата первоначальной фиксации: 2026-08-25  
Обновлено: 2026-09-13  
Статус: current internal working backlog
Область: внутренняя работа над продуктом Dementor Club

> Это не публичная презентация клуба и не контент для сайта. Документ описывает текущую последовательность, параллельность, зависимости и точки синхронизации разработки. Публичная реализация выполняется отдельно в `dementor-club-site` после фиксации решений здесь.

## 0. Обязательная основа

До расширения функционала держать зафиксированным разделение сущностей:

- `Merch` — физические товары;
- `Course` — онлайн-продукт / онлайн-процесс;
- `Event` — офлайн-событие;
- `Project` — самостоятельный культурный / продуктовый мир внутри экосистемы клуба;
- `Join` — отдельный onboarding / вход в клуб;
- `Dementor` — человек/ведущий, связанный с продуктами, событиями и сферами;
- `Donation` — добровольная поддержка клуба.

Не смешивать `Event`, `Course` и `Project`. `Project` может иметь собственные материалы, программы, события, людей, архив и отдельный runtime, но не обязан включать всё перечисленное.

Каноническая классификация по 9 сферам остаётся обязательной там, где она применима к конкретной сущности.

### 0.1 Projects / самостоятельные проектные миры — IDEA / BACKLOG

Статус этого блока: **IDEA / NOT APPROVED / NO PUBLIC IMPLEMENTATION**.

Рабочая продуктовая гипотеза для дальнейшей проработки:

- `/projects/` — не единая подробная продуктовая страница и не новый универсальный runtime;
- `/projects/` должен работать как **реестр / вход / маршрутизатор** в самостоятельные проекты Dementor Club;
- подробная логика, контент, gameplay/runtime и собственный product lifecycle могут жить внутри отдельного проекта и отдельного repository/source-of-truth;
- главная Dementor Club и другие публичные поверхности могут вести человека непосредственно в конкретный Project;
- у разных Projects могут быть разные режимы доступа, но конкретная access matrix пока **не определена и не утверждена**;
- Project access не должен создавать параллельный auth или параллельную membership-модель: при необходимости он должен опираться на существующую identity/membership boundary Dementor Club и явно утверждённые project-scoped permissions;
- существование repository, прототипа или документа не означает автоматический public/active status;
- при подключении внешнего project repository сначала читать его `PROJECT / ARTIFACT_INDEX / APPROVED_STATE` и authority pointers, а не выводить статус по имени, дате или степени готовности кода.

Текущий обнаруженный inventory для дальнейшей проработки реестра:

- `Логика и осознанность` — существующий публичный Project в Dementor Club;
- `Fermentation` — отдельный Project / internal R&D, public launch не утверждён; implementation repository: `SLADZARI/dementor-fermentation`;
- `DEMENTOR LAB` — самостоятельный игровой Project в проработке; repository: `SLADZARI/dementor_lab`; текущие клубные product/game specs не считать автоматически public approval;
- `Dementor Battle` — самостоятельный GAME Project; repository: `SLADZARI/Dementor-Battle`; собственный kernel находится на `G1_PRODUCT_LOCK`, protected Product/Domain/Architecture/Design pointers пока не разрешены;
- `DEMENTOR Robo Games` — самостоятельный GAME Project; repository: `SLADZARI/dementor_robo_games`; G1–G4 пройдены в собственном kernel, текущая работа находится в G5 Build; интеграция в публичный Projects register отдельно не утверждена;
- `Хит-парад промптов` — Project idea внутри semantic repo; `IDEA / NOT ANNOUNCED / NO DEPLOY`.

Backlog для этой гипотезы:

1. собрать полный cross-repository Project inventory без автоматического включения посторонних продуктов;
2. для каждого кандидата зафиксировать canonical name, canonical repository/source, semantic status, public status, current Gate и owner;
3. разделить `project exists` / `project visible in register` / `project publicly accessible` / `project access restricted`;
4. определить минимальный контракт Project card / Project entry на `/projects/`;
5. определить, какие access modes реально нужны, только после проверки существующей auth/membership/permission архитектуры;
6. определить, какие Projects показываются на Home и по какому правилу;
7. не создавать `dc_projects`, новый universal project backend или parallel auth до появления реальной operational необходимости;
8. после решения оформить отдельный Result на Projects registry / entry harmonization и только затем менять публичный `/projects/`.

---

# 1. Параллельные рабочие потоки

После фиксации архитектуры работа идёт не одной очередью, а параллельно четырьмя потоками.

## Поток A — Product / Content

### A1. Merch

- выбрать первые 3–5 товаров для MVP;
- зафиксировать название;
- описание;
- цену либо режим preorder;
- варианты;
- статус;
- подготовить фактические данные для карточек.

### A2. Первый Course

Для первого полного end-to-end теста выбрать один курс.

Текущий рекомендуемый кандидат: `Думай с опасностью`.

Закрыть:
- landing/content structure;
- кому предназначен;
- обещание/механика;
- структура прохождения;
- Day 1;
- 7–10 вопросов/заданий на дневной блок;
- правила незавершённых вопросов;
- результат;
- следующий шаг;
- e-mail коммуникацию;
- точку AI-анализа: вход или выход, без избыточного AI внутри каждого шага.

Не распыляться на одновременное доведение всех курсов до одинаковой функциональной готовности.

### A3. Events

Минимум 2 отдельные офлайн-сущности.

Текущее подтверждённое событие: Fuengirola.

Для второго события сначала оформить внутреннюю карточку и статус; не публиковать внутреннюю идею как подтверждённое событие.

Для каждого Event зафиксировать:
- название;
- статус;
- Dementor/ведущего;
- концепцию;
- город/место, если известно;
- дату, если утверждена;
- следующий пользовательский шаг.

### A4. Dementors

Закончить минимум 2 профиля как рабочие сущности системы.

Для каждого:
- кто это;
- функция/роль;
- сферы;
- связанные courses;
- связанные events;
- проекты;
- программы;
- портрет/visual asset.

### A5. Join

Не превращать onboarding в Course.

Зафиксировать рабочий flow:
`вопросы → результат по 9 сферам → e-mail → сохранение результата → отправка результата пользователю`.

---

## Поток B — Visual Production

Визуальная работа идёт параллельно продуктовой и технической.

### B1. Merch

- product images / mockups;
- карточка товара;
- крупные изображения товара;
- состояния preorder / confirmed.

### B2. Course

- hero;
- карточка курса;
- стартовый экран;
- дневной экран вопросов;
- progress/state;
- submit/result state;
- e-mail/result visual pattern.

### B3. Events

На каждое событие:
- hero/poster;
- карточка;
- 2–4 supporting images при необходимости;
- OG/social-ready export после утверждения события.

### B4. Dementors

- минимум 2 законченных портрета;
- единый утверждённый Dementor Ink style.

### B5. Join

- финальный экран 9 сфер;
- e-mail capture;
- success/result state.

### B6. Donations

- отдельная visual concept;
- hero/poster;
- псевдо-финансовый UI как сатирическая механика;
- не имитировать состоявшееся реальное списание денег, если его нет.

Ответственный за визуальный поток: Никита.

---

## Поток C — Technical Foundation

Техническая основа строится параллельно наполнению.

### C1. Data model

Минимальные сущности:

- `User`;
- `Course`;
- `CourseProgress`;
- `JoinResult`;
- `MerchProduct`;
- `Preorder`;
- `Event`;
- `EventInterest` / позднее registration;
- `Dementor`;
- `Donation` / donation intent при необходимости.

### C2. E-mail first identity

На текущем MVP:

`email = временный пользовательский идентификатор`.

Данные должны быть устроены так, чтобы позднее можно было выполнить связь:

`email → account → user_id`.

Полноценная авторизация сейчас не должна блокировать MVP.

### C3. Storage

Минимально предусмотреть хранение:

- users;
- join results;
- course progress;
- preorders.

Events и часть merch на первом этапе могут оставаться статическими данными, если это не мешает дальнейшей миграции.

### C4. E-mail channel

На первом этапе использовать один канал — e-mail.

Минимальные сообщения:
- join result;
- course started;
- daily course result;
- next lesson/reminder;
- preorder received.

Не добавлять Telegram/WhatsApp до проверки e-mail flow.

### C5. Auth readiness

Архитектура должна допускать дальнейший Google login / полноценный аккаунт без переделки продуктовых данных.

### C6. Privacy / disclaimer readiness

После фиксации реальных data flows подготовить:
- privacy policy;
- consent;
- terms/disclaimer;
- правила обработки e-mail и результатов onboarding/course.

Не использовать формальные тексты до понимания фактически собираемых данных.

Ответственный за структуру, зависимости и техническую готовность: Женя.

---

## Поток D — Site Implementation

Этот поток является реализацией утверждённых сущностей и механик, а не source-of-truth продукта.

Выполняется в ветке `dementor-club-site` после фиксации решений в `dementor-club`.

### D1. Home / navigation integrity

Проверить, что архитектура сайта позволяет добраться до:
- merch;
- courses;
- events;
- projects;
- dementors;
- join;
- donations.

### D2. Merch flow

`listing → product → preorder → confirmation`.

Это первый простой транзакционный flow, который стоит довести до фактической работы.

### D3. Join flow

`questions → 9 dimensions → email → save → send result`.

### D4. Course flow

`course → start → email → Day 1 → submit → save → result/next step`.

### D5. Events flow

`events → event → оставить интерес/e-mail`.

Полная event registration не обязательна на первом шаге.

### D6. Donations

Страница/механика поддержки после сборки основных продуктовых flows. Платёжная интеграция может быть отдельным техническим этапом.

### D7. Projects entry / router — IDEA

После отдельного решения проверить модель:

`Home / Projects index → конкретный Project → project-owned surface/runtime`.

До approval не менять публичный register и не создавать универсальный Project runtime внутри Dementor Club.

---

# 2. Точки синхронизации

## Gate 1 — продуктовая комплектность

Должны существовать как оформленные сущности:

- [ ] минимум 1 реальный merch product;
- [ ] 1 выбранный Course;
- [ ] 1 подтверждённый Event + 1 второй внутренне оформленный Event;
- [ ] минимум 1 полностью оформленный Dementor, цель — 2;
- [ ] рабочая логика Join.

После Gate 1 можно уверенно связывать сайт целиком.

## Gate 2 — функциональный MVP

Должны реально работать:

- [ ] `Preorder → сохранение заявки`;
- [ ] `Join → email → сохранение результата`;
- [ ] `Course → email → Day 1 → сохранение ответов`.

Это главный технический milestone.

## Gate 3 — сквозная проверка

Проверить систему человеком, который не участвовал в разработке.

Он должен без пояснений команды суметь:

1. определить, какие типы сущностей существуют;
2. выбрать физический товар;
3. оставить preorder;
4. пройти Join;
5. начать Course;
6. увидеть Event;
7. понять связь с Dementor;
8. при наличии donation-механики — понять, как поддержать клуб.

Если flow ломается или сущности смешиваются, Gate 3 не пройден.

---

# 3. Текущая критическая последовательность

Параллельная подготовка идёт постоянно, но интеграционная последовательность такая:

1. Архитектура сущностей.
2. Merch preorder.
3. Join + e-mail + storage.
4. Один Course end-to-end.
5. Два Events.
6. Два Dementors.
7. Donations.
8. Полноценный auth/login.
9. Платёжная автоматизация там, где она действительно нужна.

Короткая цепочка:

`Merch preorder → Join/e-mail → Course → Events → Dementors → Donations → Auth/Payments`.

Projects registry / entry hypothesis пока ведётся отдельно как IDEA и не вставляется в эту последовательность до отдельного решения о приоритете.

---

# 4. Владельцы

## Женя

Operating / Product owner:
- держит порядок и зависимости;
- фиксирует решения в `dementor-club`;
- следит за блокерами;
- связывает product decisions с задачами реализации;
- контролирует перенос только утверждённых решений в `dementor-club-site`;
- обновляет weekly status по фактическому прогрессу.

## Никита

Visual / Merch owner:
- merch production;
- product visuals;
- Dementor portraits;
- Course visuals;
- Event visuals;
- визуальные состояния Join/Donation;
- отмечает готовые visual deliverables.

## Совместно

- финальная продуктовая логика Course;
- Events;
- Dementor profiles;
- тексты/смыслы после фактического утверждения.

---

# 5. Не делать сейчас

- сложную CRM;
- несколько каналов сообщений одновременно;
- Telegram/WhatsApp до проверки e-mail;
- сложную membership billing system;
- AI-agent на каждом шаге Course;
- полноценный Google auth как обязательный блокер MVP;
- масштабирование на много курсов до проверки одного end-to-end;
- универсальный Project backend только ради единого списка Projects;
- параллельный auth/membership внутри Projects без отдельного approved boundary;
- автоматизацию, которая не нужна для проверки текущего flow.

---

# 6. Правило обновления

Этот файл является текущим внутренним backlog по разработке Dementor Club.

При изменении приоритетов:
1. обновлять этот документ;
2. отмечать фактически закрытые Gate/задачи;
3. отражать изменения в `operations/WEEKLY_STATUS.md`;
4. не переносить внутренние рабочие гипотезы в публичный сайт до утверждения.
