# DEMENTOR CLUB — MONETIZATION VALUE DISCOVERY REVIEW

Status: **EVIDENCE / CURRENT-STAGE REVIEW — NOT PRODUCT AUTHORITY**  
Updated: **2026-09-15**

## Purpose

Этот документ фиксирует текущий этап проверки платной ценности Dementor Club и отделяет **наблюдение за value intent** от уже существующей `13 · Monetization Map`.

Он не заменяет:

- `concept/VALUE_ARCHITECTURE_V1.md` — authority по самостоятельной ценности;
- `concept/MONETIZATION_MAP_V1.md` — authority по допустимым моделям payment / payer / value object;
- будущий `concept/METRICS_SIGNALS_V1.md` — authority по метрикам и instrumentation.

Главная причина существования этого review:

> **архитектура монетизации уже может быть описана, но коммерческая ценность конкретных Things / Events / Interventions ещё не доказана поведением внешней аудитории.**

---

# 1. Текущий discovery principle

На текущем этапе нельзя начинать с вопроса:

> **«На чём мы будем зарабатывать?»**

Правильная последовательность:

**OBSERVE VALUE → MEASURE INTENT → FIND REPEATED SIGNAL → TEST ONE PAYMENT → VERIFY DELIVERY → CHECK REPEAT**

По-человечески:

1. смотрим, где человек уже получает самостоятельную ценность;
2. смотрим, хочет ли он продолжения;
3. ищем повторяющийся явный intent у разных людей;
4. проверяем один конкретный payment вокруг одного value object;
5. проверяем, была ли обещанная ценность реально доставлена;
6. только затем смотрим, возникает ли повторный спрос.

Это уточняет, но не меняет принцип `13`:

**MONETIZATION FOLLOWS VALUE.**

---

# 2. Что сейчас нельзя считать доказанной monetization hypothesis

На текущем evidence level нельзя утверждать, что люди готовы платить за:

- конкретную Thing;
- Event;
- Intervention;
- Membership;
- Merch / Physical Object;
- отдельный Project;
- продукт конкретного Dementor;
- recurring package.

Даже если соответствующая monetization model допустима архитектурно, её рыночная пригодность остаётся hypothesis до behavioural evidence.

Каноническое различие:

**VALID MONETIZATION MODEL ≠ PROVEN PAID DEMAND.**

---

# 3. Evidence ladder

Это **не user journey, не engagement funnel и не обязательная последовательность поведения пользователя**.

Это уровень уверенности в конкретной value / monetization hypothesis.

## LEVEL 0 · SEEN

Человек увидел Thing / offer context.

Слабый сигнал.

## LEVEL 1 · CONSUMED

Человек реально прочитал / посмотрел / сыграл / пришёл / использовал.

Есть evidence самостоятельной experience value.

## LEVEL 2 · RETURNED

Человек вернулся к Thing, продолжению или программе.

Есть evidence continuity / program value.

## LEVEL 3 · EXPRESSED INTENT

Человек явно выразил желание продолжения:

- хочу такую;
- хочу попробовать;
- сообщите, когда будет;
- хочу прийти;
- мне нужен этот формат;
- хочу поддержать;
- хочу вписаться.

Здесь начинается Value Discovery.

## LEVEL 4 · COMMITTED

Человек сделал действие, которое уже требует усилия или создаёт обязательство:

- оставил заявку;
- забронировал место;
- записался;
- сделал preorder intent;
- запросил Intervention;
- подтвердил участие;
- оставил контакт ради конкретного следующего действия.

## LEVEL 5 · PAID

Произошёл реальный payment за конкретный value object / action.

Только здесь появляется коммерческое доказательство.

## LEVEL 6 · REPEATED

Человек снова покупает сопоставимую ценность или повторяет платное действие, потому что первая ценность была реальной.

Только здесь можно начинать говорить о повторяемой economic model.

---

# 4. Value Intent classes

Ниже — **семантические классы intent**, а не утверждённый analytics contract. Точные event names и payload должны быть закреплены в `14 · Metrics & Signals` / instrumentation spec.

## A. THING INTEREST

Мысль:

> **«Хочу эту вещь / её продолжение».**

Примеры:

- хочу полную версию;
- сообщите, когда выйдет;
- хочу такую Thing;
- хочу следующую версию;
- хочу получить экземпляр.

Рабочее event-name предложение для `14`:

`thing_interest`

Важно:

**Thing Interest ≠ willingness to pay.**

---

## B. EXPERIENCE INTEREST

Мысль:

> **«Хочу это попробовать / туда прийти / сыграть».**

Может относиться к:

- Event;
- Game;
- workshop;
- поездке;
- публичному эксперименту;
- специальному показу;
- другому ограниченному experience.

Рабочее event-name предложение:

`experience_interest`

Возможная будущая hypothesis:

**Paid Experience / Ticket.**

Но только после повторяющегося demand signal.

---

## C. PARTICIPATION INTEREST

Мысль:

> **«Хочу сюда вписаться».**

Рабочее event-name предложение:

`participation_interest`

Это evidence интереса к участию / созданию / продолжению Thing.

Это **не monetization event** и не evidence willingness to pay.

Канонически:

**PARTICIPATION INTEREST ≠ PAYMENT INTENT.**

---

## D. INTERVENTION INTEREST

Мысль:

> **«У меня действительно такая Situation; мне нужен этот resource / action».**

Может выражаться как:

- хочу попробовать Method;
- мне нужен такой разбор;
- это моя Situation;
- нужен этот Tool;
- хочу пройти Course именно из-за этой Situation;
- нужен конкретный facilitated action.

Рабочее event-name предложение:

`intervention_interest`

Это важный future commercial signal, но он появляется **после Situation fit**, а не после просмотра профиля Dementor.

Канонически:

**RELEVANCE BEFORE COMMERCIALITY.**

---

## E. SUPPORT INTEREST

Мысль:

> **«Мне важно, что это существует; хочу помочь этому появиться / продолжаться».**

Может относиться к:

- Thing;
- Project output;
- конкретному следующему Release;
- Dementor-authored work;
- Club production в явно обозначенном support context.

Рабочее event-name предложение:

`support_interest`

Возможные будущие формы:

- preorder;
- crowdfunding;
- patronage;
- donation;
- production support.

Не смешивать purchase и support: exchange должен называться честно.

---

# 5. Current analytics snapshot · 2026-09-15

Этот snapshot перенесён из текущего рабочего review и является **датированным evidence**, а не каноном.

За последние 7 дней зафиксировано примерно:

- **15 active users**;
- **106 sessions**;
- **649 page views**;
- **1581 events**.

Критическое ограничение выборки:

- **71 из 106 sessions** пришли через `accounts.google.com / referral`;
- значительная часть активности связана с auth, Workspace, Board, внутренним использованием и тестированием продукта.

Следствие:

**ЭТА ВЫБОРКА НЕ ЯВЛЯЕТСЯ ДОСТАТОЧНОЙ РЫНОЧНОЙ ВЫБОРКОЙ ДЛЯ WILLINGNESS-TO-PAY ВЫВОДОВ.**

Нельзя делать выводы вида:

- «Board нужен людям больше Events, потому что у Board больше просмотров»;
- «Membership интересен рынку, потому что открывают Join»;
- «Course не нужен, потому что мало opens»;
- «Events работают, потому что много page views».

Сначала необходимо отделить internal / test traffic и получить поведение внешней аудитории вокруг конкретных Things / Experiences / Situations.

---

# 6. Surface questions for discovery

Эти вопросы не создают новый Surface Model. Они задают, **какой evidence полезно наблюдать на уже существующей поверхности**.

## HOME

Главный вопрос:

> **Находит ли человек Thing, ради которой стоило открыть Dementor?**

До monetization важнее:

- Thing open;
- Thing → Thing;
- Program continuation;
- Return.

Home не должен становиться витриной paid offers по умолчанию.

## THING

Главный вопрос:

> **Возникло ли желание продолжить отношения именно с этой Thing?**

Полезный evidence:

- repeat open;
- continuation open;
- share;
- Thing Interest;
- Experience Interest;
- History interest.

## BOARD

Главный вопрос:

> **Что из происходящего вызывает желание приблизиться?**

Полезный evidence:

- Thing open;
- Project open;
- History continuation;
- Participation open;
- Participation Interest.

Board остаётся radar / projection of living Things, а не checkout surface.

## PROJECT

Главный вопрос:

> **Хочет ли человек следить, помогать или участвовать вокруг конкретной Thing / output?**

Project не становится paid product автоматически.

## EVENT

Главный вопрос:

> **Есть ли реальные независимые люди, которые хотят прийти?**

Если Experience Interest повторяется и commitment подтверждается — появляется основание для маленького ticket test.

## DEMENTOR

Главный вопрос:

> **Ищет ли человек продолжение авторской практики через реальные works / Things / Situations?**

Не начинать с:

**profile → price.**

## SITUATION / INTERVENTION

Главный вопрос:

> **Распознал ли человек реальную Situation и нужен ли ему конкретный resource / action?**

Это один из наиболее значимых future commercial evidence layers.

## MERCH / PHYSICAL THING

Не строить магазин ради магазина.

Сначала:

**«Хочу такую штуку».**

Потом — маленький production / preorder test.

## MEMBERSHIP / JOIN

Join Interest отвечает на вопрос участия / доступа / принадлежности и **не доказывает recurring payment intent**.

Канонически:

**JOIN INTEREST ≠ MEMBERSHIP PAYMENT INTENT.**

---

# 7. Small payment test rule

Payment test начинается не по календарю, а после повторяющегося evidence.

Минимальная логика:

```text
real consumption
→ return / continuation interest
→ repeated explicit intent from different people
→ concrete commitment
→ one small payment test
```

Первый test прикрепляется к **одному конкретному value object / action**.

Не строить заранее:

- subscription infrastructure;
- tier system;
- marketplace;
- большой catalog;
- сложную billing architecture;
- recurring Membership economics.

Сначала проверить один exchange.

Канонически:

**TEST ONE PAYMENT BEFORE DESIGNING AN ECONOMIC SYSTEM.**

---

# 8. Что переносится в `14 · Metrics & Signals`

Будущий Metrics authority должен решить:

1. точные event names;
2. обязательные payload fields;
3. internal / test traffic exclusion;
4. unique-user / session / entity counting semantics;
5. exposure vs consumption definitions по Form;
6. Return windows;
7. intent → commitment mapping;
8. purchase / refund / repeat definitions;
9. attribution ownership относительно будущего `12 · Distribution Model`;
10. anti-signals и thresholds;
11. dashboard / review cadence;
12. как не превратить evidence ladder в growth funnel.

Рабочие candidate events из этого review:

- `thing_interest`;
- `experience_interest`;
- `participation_interest`;
- `intervention_interest`;
- `support_interest`;
- позже: `payment_start`, `purchase`, `repeat_purchase`.

Они **не становятся production contract только потому, что перечислены здесь**.

---

# 9. Monetization Review format

Когда данных станет достаточно, review должен быть построен не вокруг общего revenue dashboard, а вокруг конкретных value objects / situations.

Минимальная таблица:

| Thing / Situation | Exposed | Consumed | Returned | Expressed Intent | Committed | Paid | Repeated |
|---|---:|---:|---:|---:|---:|---:|---:|

Цель:

> **увидеть, где действительно существует самостоятельная ценность, где возникает желание продолжения и где payment подтверждает exchange.**

---

# 10. Decision from this review

Новая discovery-логика **не заменяет** `concept/MONETIZATION_MAP_V1.md`.

Существующая Monetization Map сильнее как архитектура:

- value object;
- payer ≠ user;
- access / ownership / intervention / production support / recurring value;
- Membership test;
- partner / sponsor firewalls;
- pricing / literal transaction terms;
- payment ≠ editorial priority;
- payment ≠ programming moment;
- fulfillment / afterlife;
- distribution-economics boundary.

Этот review добавляет недостающий operational вопрос:

> **Как понять, что архитектурно допустимую monetization hypothesis вообще пора тестировать?**

Ответ:

**OBSERVE VALUE → MEASURE INTENT → FIND REPEATED SIGNAL → TEST ONE PAYMENT → VERIFY DELIVERY → CHECK REPEAT.**

До repeated external evidence:

**COMMERCIAL OPTIONS REMAIN HYPOTHESES.**
