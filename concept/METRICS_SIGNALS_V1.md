# DEMENTOR CLUB — METRICS & SIGNALS v1

Status: **DRAFT / WORKING CANON CANDIDATE**  
Updated: **2026-09-15**

## Authority scope

Этот документ является authority по вопросу:

> **Какие наблюдаемые сигналы действительно показывают, что Dementor Club создаёт ценность — а какие только создают видимость активности?**

Он определяет:

- различие между event, signal, metric, KPI и target;
- Product Health scorecard;
- qualified entry и consumption semantics;
- Thing → Thing / continuation measurement;
- Return measurement;
- Contribution / Participation / Intervention signals;
- Distribution quality signals;
- Commercial extension из `13 · Monetization Map`;
- internal / test traffic exclusion;
- event naming principles;
- payload contract;
- counting semantics;
- review cadence;
- thresholds / alert discipline;
- anti-signals и vanity metrics.

Документ опирается на:

- `03 · Audience & Entry Map` — Source × Intent × Entry Object;
- `05 · Product Model` — Thing / Release / Production / Participation / History distinctions;
- `07 · Content & Programming` — Programming Moment / meaningful delta;
- `08 · Return Loops` — expectation / payoff / return;
- `09 · Contribution Model` — editorial outcome and closure;
- `10 · Dementor / Intervention` — Situation → relevant Intervention;
- `11 · Marketing Positioning & Messaging` — promise / proof / next Thing;
- `12 · Distribution Model` — promise → precise Entry Object / qualified entry;
- `13 · Monetization Map` — paid value / fulfillment / repeat, without making revenue the definition of product value.

Каноническая граница:

> **PRODUCT MODELS DEFINE WHAT MATTERS. METRICS & SIGNALS DEFINE HOW WE OBSERVE WHETHER IT IS HAPPENING.**

Главная система:

**ENTRY → EXPERIENCE → CONTINUATION → RETURN → CONTRIBUTION / PARTICIPATION / INTERVENTION → RELEASE / HISTORY**

Коммерческий extension:

**VALUE → INTENT → COMMITMENT → PAYMENT → DELIVERY → REPEAT**

---

# 0. Главный принцип

Dementor Club не должен оптимизироваться под то, что легче всего посчитать.

Pageviews, clicks, reactions и notification opens полезны как transport / diagnostic telemetry.

Но они не являются доказательством Product Value сами по себе.

Канонически:

> **MEASURE THE VALUE CHAIN, NOT THE NOISE AROUND IT.**

И:

> **ACTIVITY IS NOT VALUE UNTIL IT CHANGES THE USER’S EXPERIENCE OR EXPECTATION.**

---

# 1. Event ≠ Signal ≠ Metric ≠ KPI ≠ Target

Эти понятия нельзя смешивать.

## Event

Технически зафиксированное событие.

Примеры:

- человек открыл Event page;
- нажал CTA;
- открыл следующую Thing;
- отправил Contribution;
- сделал purchase.

Event — наблюдение, а не вывод.

## Signal

Осмысленный факт или паттерн, который поддерживает / ослабляет product hypothesis.

Пример:

> человек открыл следующую самостоятельную Thing после завершения первой.

Это сильнее, чем просто `page_view`.

## Metric

Агрегированная количественная мера.

Пример:

> доля qualified Thing entries, после которых была meaningful continuation.

## KPI

Metric, выбранная для регулярного управленческого контроля конкретной цели / риска.

Не каждая metric должна стать KPI.

## Target

Явно принятый ожидаемый диапазон / направление.

Target нельзя придумывать до появления baseline и реального operating context.

Канонически:

**AN EVENT IS NOT A SIGNAL BY ITSELF. A SIGNAL IS NOT AUTOMATICALLY A KPI. A KPI DOES NOT NEED A TARGET BEFORE A BASELINE EXISTS.**

---

# 2. No single universal North Star

На текущем этапе Dementor не должен выдумывать одну universal North Star Metric, которая якобы объясняет весь продукт.

Причина:

- Thing может быть текстом, игрой, Event, Tool, Course, physical object;
- audience use может завершиться хорошим one-off experience;
- Return важен, но не обязателен после каждой Thing;
- Contribution / Participation — optional branches;
- Commercial action — ещё более optional;
- high-frequency activity не является целью.

Поэтому v1 использует **Product Health Scorecard**, а не одну магическую цифру.

Главная логика:

**HEALTH = MULTIPLE INDEPENDENT SIGNALS THAT AGREE ABOUT VALUE**

---

# 3. Product Health Scorecard v1

Регулярный Product Health review должен смотреть минимум на семь блоков.

## A. QUALIFIED ENTRY

Люди приходят в тот объект, который соответствует promise / intent.

## B. EXPERIENCE

Люди реально получают обещанный experience, а не просто открывают страницу.

## C. CONTINUATION

После хорошего experience часть людей добровольно открывает следующий релевантный объект.

## D. RETURN

Возникают реальные причины вернуться и они получают payoff.

## E. CONTRIBUTION / PARTICIPATION

Часть людей хочет не только смотреть, но и принести / сделать / вписаться там, где это уместно.

## F. RELEASE / HISTORY

Things реально живут: выходят, продолжаются, получают последствия, а не остаются вечной внутренней активностью.

## G. TRUST / DELIVERY

Обещания совпадают с реальностью: destination, availability, editorial response, paid fulfillment.

Commercial Health добавляется отдельным блоком после реального payment evidence.

---

# 4. Metric hierarchy

Чтобы не смешивать transport и product health, используем четыре уровня.

## LEVEL 0 · DELIVERY / EXPOSURE

Показ / доставка сообщения.

Примеры:

- impression;
- delivered Telegram message;
- search impression;
- social view;
- email delivered, если появится.

Это слабые signals.

## LEVEL 1 · ENTRY

Человек перешёл / открыл destination.

Примеры:

- page_view;
- entity_open;
- entry_object_open.

Это ещё не Product Value.

## LEVEL 2 · EXPERIENCE

Человек реально встретил обещанную Thing / Event / Tool / Course.

Это первый сильный слой.

## LEVEL 3 · CONTINUATION / RETURN / ACTION

Человек добровольно продолжил:

- Thing → Thing;
- вернулся;
- поделился;
- вписался;
- принёс Contribution;
- выразил конкретный value intent;
- пришёл на Event;
- использовал Tool повторно.

Это более сильные сигналы.

## LEVEL 4 · CONSEQUENCE

Появилось реальное последствие:

- Contribution получила closure;
- Participation привела к output;
- Thing получила Release / History;
- Intervention помогла изменить Situation;
- paid value была доставлена;
- покупка повторилась.

Это не funnel stages человека.

Это **уровни evidence strength**.

---

# 5. Qualified Entry

`12 · Distribution` задаёт принцип:

> **A CLICK IS NOT SUCCESS IF THE THING DISAPPOINTS.**

`14` определяет измерительный слой.

Qualified Entry существует, когда:

1. известен или разумно выведен Entry Object;
2. promise / source соответствует этому объекту;
3. человек действительно начал обещанный experience;
4. visit не является явно internal / test / bot / broken navigation noise.

Канонически:

**CLICK / OPEN ≠ QUALIFIED ENTRY**

Рабочая формула:

**QUALIFIED ENTRY = CORRECT DESTINATION + EXPERIENCE START**

Если intent неизвестен, допускается weaker classification:

`unclassified_entry`.

Нельзя задним числом объявлять любой landing visit qualified только потому, что человек не bounced мгновенно.

---

# 6. Exposure vs Consumption

Главная проблема обычной web analytics: `page_view` слишком легко принять за consumption.

Поэтому для каждого Form / surface нужен минимальный consumption contract.

## Text / Article / Long-form Thing

Possible consumption evidence:

- meaningful dwell time;
- scroll / section progress;
- explicit continue / next action;
- return to same Thing.

Ни один из signals по отдельности не гарантирует понимание текста.

## Video

Possible:

- play;
- meaningful watch threshold;
- completion;
- next Thing after watch.

## Game / Interactive Thing

Possible:

- game start;
- first meaningful action;
- session completion / result where applicable;
- replay;
- continuation.

## Tool

Possible:

- tool action executed;
- output produced;
- repeated use;
- return when Situation repeats.

## Event

Page open ≠ attendance.

Possible layers:

- Event detail consumed;
- registration / commitment;
- actual attendance;
- post-Event continuation.

## Course / Program

Possible:

- course open;
- lesson / module engagement;
- meaningful progression;
- return to sequence;
- completion only where completion matters.

## Physical Thing

Possible:

- order / pickup;
- QR / digital continuation;
- repeat / History action;
- explicit ownership / usage signal where available.

Канонически:

**CONSUMPTION MUST BE FORM-AWARE.**

---

# 7. Thing → Thing

Один из ключевых ранних product signals Dementor:

> **после одной самостоятельной Thing человек добровольно открывает другую самостоятельную Thing.**

Это показывает не только интерес к одному объекту, но и вероятность того, что человек начал распознавать Dementor как программу / источник взгляда.

Каноническая metric:

**THING → THING CONTINUATION RATE**

Рабочий denominator:

> qualified Thing experiences, у которых реально существовал релевантный next Thing opportunity.

Рабочий numerator:

> те из них, после которых человек в осмысленном окне открыл другую самостоятельную Thing через contextual / program continuation.

Не считать автоматически:

- back navigation;
- случайный nav click;
- Board refresh;
- forced redirect;
- technical prefetch;
- same-Thing asset navigation.

Канонически:

**THING → THING IS A PRODUCT CONTINUATION SIGNAL, NOT JUST AN INTERNAL LINK CLICK.**

---

# 8. Return

`08 · Return Loops` остаётся authority по смыслу Return.

`14` определяет measurement.

Return должен считаться относительно объекта ожидания / программы, а не только cookie revisit.

Минимальные classes:

## Audience Return

Человек возвращается в Dementor после предыдущего completed / meaningful experience.

## Thing Continuity Return

Возвращается к той же Thing / continuation / History.

## Program Return

Возвращается посмотреть, что нового в программе.

## Dementor Work Return

Возвращается к body of work конкретного Dementor.

## Participation / Contributor Return

Возвращается за реальным outcome / continuation своей Contribution / Participation.

## Utility Return

Возвращается к Method / Tool / Situation resource, потому что Situation снова релевантна.

---

# 9. Return windows

Нельзя выбрать один universal 7-day / 30-day retention window для всех Loops.

Event, Tool, editorial Program и Contribution живут в разном ритме.

Поэтому Return window должен быть связан с loop semantics.

Рабочий v1 подход:

- **short window** — быстрые editorial / Thing continuation loops;
- **medium window** — Program return;
- **event-relative window** — before / after Event;
- **promise-relative window** — когда обещано продолжение;
- **situation-relative** — utility;
- **contributor outcome-relative** — editorial response.

Точные durations фиксируются после baseline.

Канонически:

**RETURN WINDOW FOLLOWS THE EXPECTATION, NOT A GENERIC SAAS RETENTION TEMPLATE.**

---

# 10. Return Quality

Сам по себе revisit слаб.

Strong Return должен иметь payoff.

Working derived metric:

**RETURN PAYOFF RATE**

Вопрос:

> среди meaningful returns — сколько привели к обещанной / релевантной новой ценности?

Примеры payoff:

- новая Thing;
- promised continuation;
- History outcome;
- editorial response;
- Event update;
- Tool reuse;
- Participation result.

Anti-signal:

> человек возвращается часто, но всё реже может объяснить, зачем стоило вернуться.

---

# 11. Program Memory / Direct Return

Direct return — важный сигнал, потому что человек сам вспомнил источник.

Но его нельзя читать изолированно.

Direct traffic может включать:

- bookmarks;
- browser autocomplete;
- internal team use;
- developer testing;
- auth redirects;
- unknown referrer loss.

Поэтому полезный signal:

**DIRECT RETURN AFTER PRIOR QUALIFIED EXPERIENCE**

а не любой `Direct / None` session.

Program Memory можно дополнительно наблюдать через:

- branded search;
- direct Home return;
- return to known Thing;
- external share then later direct return.

Это derived signal, не один event.

---

# 12. Share

Share — один из сильнейших voluntary signals, но требует аккуратности.

Нужно различать:

## Share Intent

Человек нажал share / copy link.

## Share Completion

Мы знаем, что native share completed — только если platform даёт такой факт.

## Share Visit

Новый visit пришёл по shared link / attribution.

## Share Continuation

Получатель реально consumed Thing / продолжил дальше.

Канонически:

**SHARE CLICK ≠ SUCCESSFUL WORD OF MOUTH.**

Сильнее:

**THING → SHARE → QUALIFIED ENTRY BY ANOTHER PERSON**

Если privacy / platform ограничения не позволяют доказать цепочку, не симулировать certainty.

---

# 13. Distribution quality

`12` отвечает за routing semantics.

`14` измеряет качество.

Core metrics:

## Promise → Entry Fit

Доля distribution entries, которые landed on intended Entry Object без generic detour.

## Qualified Entry Rate

Qualified experiences / entries по channel / trigger class.

## Entry → Continuation

Доля qualified entries, после которых человек сделал meaningful next step.

## Channel Quality

Не CTR, а downstream quality:

**CHANNEL → QUALIFIED ENTRY → EXPERIENCE → CONTINUATION / RETURN**

## Wrong Destination / Bounce Diagnostics

Используется как negative signal, не как автоматический proof bad content.

Канонически:

**CHANNEL SUCCESS IS DOWNSTREAM OF EXPERIENCE QUALITY.**

---

# 14. Home

Home — cover of current program.

Главные вопросы:

- нашёл ли человек текущую Thing;
- открыл ли её;
- продолжил ли к другой Thing;
- вернулся ли позже.

Home pageviews сами по себе мало значат.

Working signals:

- `Home → Thing`;
- `Home → Thing → Thing`;
- direct return to Home followed by program entry;
- share / continuation after Home-originated Thing.

Не оптимизировать Home только под CTA CTR.

---

# 15. Board

Board — radar текущего происходящего.

Главные signals:

- Thing / Project / Event open from Board;
- Participation Opportunity open;
- meaningful continuation;
- return to current happening.

Не считать сильным product signal:

- Board refresh;
- filter change;
- raw card impressions;
- generic scroll depth.

Board activity не должна маскировать отсутствие standalone Things / Releases.

---

# 16. Contribution signals

`09` задаёт:

**BRING → ACKNOWLEDGE → EDITORIAL LOOK → DISPOSITION → CONSEQUENCE / CLOSURE**

Metrics должны следовать этой модели.

Core signals:

## Contribution Received

Технический receipt.

## Editorial Look Started

Contribution реально попала в review.

## Meaningful Disposition

Есть явный editorial outcome.

## Closure Delivered

Contributor увидел / получил outcome.

## Contributor Return

После closure человек вернулся с новым вкладом / продолжил работу.

Не оптимизировать:

- количество submissions само по себе;
- time-in-queue как engagement;
- % публикации как цель.

Канонически:

**CONTRIBUTION HEALTH = MEANINGFUL EDITORIAL RESPONSE, NOT MAXIMUM ACCEPTANCE.**

---

# 17. Participation signals

Participation Opportunity — конкретная возможность действия.

Core flow:

**OPPORTUNITY VIEW → JOIN INTENT → PARTICIPANT RELATION → ACTION / OUTPUT → CLOSURE / CONTINUATION**

Не каждая opportunity должна конвертироваться массово.

Важно:

- relevant joins;
- participant action;
- real output / continuation;
- no-reaction-vacuum avoidance.

Anti-signal:

> много «вписался», мало реального совместного действия.

---

# 18. Intervention signals

`10` задаёт:

**SITUATION → INTERVENTION → RESOURCE / ACTION**

Success не равен booking / click.

Сильнее:

- Situation recognised;
- relevant resource chosen;
- resource actually used;
- user reports / demonstrates useful change;
- smaller sufficient Intervention worked;
- no unnecessary escalation.

Commercial Interest — отдельный signal.

Канонически:

**INTERVENTION SUCCESS = SITUATION FIT + USEFUL ACTION, NOT MAXIMUM SERVICE CONVERSION.**

---

# 19. Release / History signals

Product Health требует наблюдать, что Things выходят и продолжают жить.

Possible metrics:

- Things with at least one Release;
- Release → qualified experience;
- Release → continuation;
- meaningful History events;
- History → renewed Thing attention;
- Projects producing actual standalone outputs.

Не считать сильным:

- commits;
- internal status changes;
- generic Activity events;
- database updates.

Канонически:

**OUTPUT / RELEASE / HISTORY > INTERNAL ACTIVITY VOLUME.**

---

# 20. Programming signals

`07` отвечает, почему Thing важна сейчас.

`14` наблюдает, работает ли этот выбор.

Для Programming Moment полезно видеть:

- distribution / surface exposure;
- qualified experience;
- continuation;
- return;
- meaningful reaction / share;
- whether promised continuation later closed.

Не следует оптимизировать editorial selection только по click-rate.

Некоторые сильные Things могут быть нишевыми, но очень качественно работать для своего intent.

Канонически:

**PROGRAM QUALITY IS NOT THE SAME AS MAXIMUM REACH.**

---

# 21. Monetization Value Discovery extension

`13` задаёт архитектуру денег.

`14` фиксирует evidence semantics.

Current evidence ladder:

**SEEN → CONSUMED → RETURNED → EXPRESSED INTENT → COMMITTED → PAID → REPEATED**

Это не user funnel.

Это confidence ladder для конкретной paid-value hypothesis.

Главное различие:

**VALID MONETIZATION MODEL ≠ PROVEN PAID DEMAND.**

---

# 22. Intent classes

v1 фиксирует следующие semantic intent classes как допустимые instrumentation concepts:

## THING INTEREST

> «Хочу эту Thing / продолжение / экземпляр»

## EXPERIENCE INTEREST

> «Хочу попробовать / прийти / сыграть»

## PARTICIPATION INTEREST

> «Хочу вписаться»

Не является payment intent.

## INTERVENTION INTEREST

> «Это моя Situation; мне нужен этот resource / action»

## SUPPORT INTEREST

> «Хочу помочь этой Thing / Release появиться / продолжаться»

Эти classes — Product semantics.

Event names ниже — instrumentation contract v1.

---

# 23. Event naming principles

Event names должны описывать observable action, а не маркетинговую интерпретацию.

Правила:

1. lowercase `snake_case`;
2. action-oriented;
3. без PII;
4. не кодировать channel в name — channel идёт payload;
5. не плодить отдельное event name для каждого page slug;
6. Product state не выводится только из analytics event;
7. derived metrics не должны притворяться raw events.

Неправильно:

- `telegram_user_loves_thing`;
- `high_intent_user`;
- `premium_person`;
- `successful_return` как raw click event.

---

# 24. Event contract v1

Существующие production events сохраняются для compatibility.

Дополнительный semantic layer рекомендуется вводить постепенно.

## Existing compatible events — KEEP

- `project_open`
- `course_open`
- `event_open`
- `merch_open`
- `*_cta_click`
- `recommendation_click`
- `external_community_click`
- Join / auth / workspace operational events

Они не являются всей Product Health model.

## New semantic candidate events — ADD WHERE EVIDENCE EXISTS

### Experience

- `thing_experience_start`
- `thing_experience_complete` — только где completion имеет реальный смысл
- `tool_action`
- `event_commitment`
- `event_attendance` — только из достоверного attendance source

### Continuation

- `continuation_open`
- `thing_share_intent`

### Contribution / Participation

- `contribution_received`
- `contribution_disposition`
- `contribution_closure_viewed`
- `participation_interest`
- `participation_joined`
- `participation_action`

### Value intent

- `thing_interest`
- `experience_interest`
- `intervention_interest`
- `support_interest`

### Commercial

- `payment_start`
- `purchase`
- `refund`
- `repeat_purchase` should preferably be **derived** from purchase history, not manually emitted as an independent truth.

Не нужно внедрять весь список сразу.

Instrumentation добавляется только там, где существует понятный Product question.

Канонически:

**NO QUESTION → NO EVENT.**

---

# 25. Event payload contract

Для semantic events минимальный безопасный payload, где applicable:

```text
entity_type
entity_id
placement
source_page
entry_source?
entry_intent?
distribution_trigger?
distribution_channel?
programming_moment_ref?
continuation_type?
value_intent_class?
```

Дополнительно для commercial events:

```text
value_object_type
value_object_id
payment_model?
currency?
amount?
```

Financial fields должны соответствовать legal / privacy / payment infrastructure rules.

Не отправлять в analytics:

- email;
- имя;
- phone;
- auth token;
- raw Contribution body;
- free-text Situation;
- private answers;
- payment credentials;
- sensitive profile fields.

Канонически:

**SEMANTIC ATTRIBUTION WITHOUT PERSONAL DATA.**

---

# 26. Identity and counting semantics

Metrics должны различать:

- event count;
- session count;
- unique anonymous user / browser where technically allowed;
- authenticated product relation where operationally necessary;
- entity count.

Нельзя смешивать:

> 100 events = 100 people.

Нельзя также считать authenticated account универсальной единицей аудитории, потому что watching alone is complete use и login не обязателен.

Канонически:

**COUNT THE UNIT THE QUESTION ACTUALLY ASKS ABOUT.**

---

# 27. Internal / test traffic exclusion

Текущая analytics history существенно загрязняется:

- auth flows;
- Workspace / Board internal use;
- product testing;
- developer / admin activity;
- Google auth referrals.

Поэтому market / product conclusions должны использовать явно отделённый population.

Минимальные classes:

- `external_audience`;
- `authenticated_member_or_contributor`;
- `internal_admin_test`;
- `unknown`.

Implementation может использовать другие безопасные механизмы, но отчёт обязан показывать population definition.

Канонически:

**NO MARKET CLAIM FROM AN UNCLASSIFIED INTERNAL-HEAVY SAMPLE.**

---

# 28. Bot / crawler / preview traffic

Search crawlers, social preview fetchers и automation могут создавать page requests без человеческого experience.

Они не должны попадать в qualified consumption.

Система может сохранять server / platform telemetry отдельно, но Product Health считает human experience only where reasonably identifiable.

---

# 29. Attribution ownership

`12` владеет смыслом routing / distribution.

`14` владеет measurement contract.

Рабочее разделение:

## `12`

- trigger;
- target intent;
- channel / transport;
- promise;
- Entry Object;
- expected continuation.

## `14`

- какие события фиксировать;
- как связать entry с routing context;
- как считать qualified experience;
- attribution windows;
- derived metrics;
- thresholds / dashboards.

Attribution не должна переопределять Product semantics.

---

# 30. Attribution windows

Attribution window зависит от вопроса.

Примеры:

- immediate distribution → entry: short window;
- share → recipient visit: longer reasonable window;
- Event interest → commitment: event-relative;
- paid value discovery: object-specific;
- return: expectation-relative.

Не использовать один рекламный `last-click 30 days` как универсальную истину продукта.

Канонически:

**ATTRIBUTION WINDOW FOLLOWS THE BEHAVIOUR BEING MEASURED.**

---

# 31. Dashboard architecture

v1 не требует большого BI stack.

Достаточно нескольких рабочих views.

## A. Product Health

- qualified entry;
- experience;
- Thing → Thing;
- Return;
- share / continuation;
- Release / History.

## B. Programming / Distribution

- Programming Moment;
- source / channel;
- Entry Object;
- qualified consumption;
- continuation;
- return.

## C. Contribution / Participation

- received;
- editorial disposition / join;
- closure / action;
- return.

## D. Intervention

- situation-fit intent;
- resource use;
- useful continuation;
- paid action only where applicable.

## E. Commercial Evidence

- expressed intent;
- commitment;
- paid;
- fulfillment;
- refund / failure;
- repeat.

Главный принцип dashboard:

> **show the causal product chain before aggregate totals.**

---

# 32. Review cadence

Рекомендуемый v1 cadence:

## Weekly Operating Review

Смотреть operational anomalies и current Program signals:

- broken destinations;
- tracking gaps;
- current Programming Moments;
- qualified entry changes;
- Contribution / Participation closure problems;
- paid fulfillment incidents if any.

## Monthly Product Health Review

Смотреть patterns:

- Thing → Thing;
- Return quality;
- source / intent / entry fit;
- repeated high-quality Things / Forms;
- contributor / participant loops;
- value intent;
- monetization evidence.

## Quarterly Model Review

Проверять:

- нужны ли новые metrics;
- какие metrics оказались vanity;
- какие event names лишние;
- появились ли baseline / targets;
- не начали ли metrics искажать editorial behaviour.

Не делать ежедневный KPI ritual ради ощущения контроля.

---

# 33. Thresholds

Threshold нужен для принятия решения, а не для украшения dashboard.

Типы threshold:

## Operational threshold

Например tracking failure / broken destination.

Можно задать сразу.

## Baseline deviation

После достаточной истории.

## Product hypothesis threshold

Например repeated explicit intent from different people before payment test.

Должен быть связан с конкретной hypothesis.

## Commercial threshold

Появляется только после real payments / fulfillment.

Нельзя выдумывать CAC / conversion targets до реального channel economics.

Канонически:

**BASELINE BEFORE OPTIMIZATION TARGET.**

---

# 34. Leading vs Lagging signals

## Leading

- qualified experience;
- continuation;
- explicit intent;
- commitment;
- editorial closure;
- repeat utility use.

## Lagging

- durable Return;
- repeated Thing consumption;
- repeat purchase;
- sustainable Project output;
- long-term Program Memory.

Нельзя заменять lagging value красивыми leading activity numbers.

Но нельзя и ждать год ради любого решения.

Используем оба класса с ясной подписью.

---

# 35. Vanity metrics

Vanity metric — не «плохая цифра».

Это цифра, которой приписали больше смысла, чем она реально имеет.

Типичные примеры:

- total pageviews;
- total users;
- followers;
- likes;
- reaction count;
- number of artifacts;
- number of Board cards;
- notification opens;
- raw registrations;
- total submissions;
- total sessions;
- time-on-site без context.

Они могут быть useful diagnostics.

Они не должны становиться доказательством Product Health без downstream evidence.

---

# 36. Anti-signals

Критические anti-signals:

- pageviews растут, qualified experience падает;
- CTR растёт, destination mismatch растёт;
- Board activity растёт, Releases не появляются;
- notifications растут, Return Payoff падает;
- submissions растут, editorial closure падает;
- joins растут, participation action отсутствует;
- Event pageviews высокие, independent commitments отсутствуют;
- Dementor profile views растут, authored work не открывают;
- Intervention CTA clicks растут, Situation fit неизвестен;
- Membership interest выводят из Join opens;
- revenue растёт, fulfillment / repeat падают;
- internal/test traffic считается market demand;
- один power user создаёт видимость массового engagement;
- targets начинают влиять на editorial selection сильнее, чем Product Model;
- instrumentation существует, но никто не знает, какое решение она поддерживает.

Главный anti-signal:

> **мы умеем показать рост активности, но не можем показать, какую самостоятельную ценность человек получил и почему захотел продолжить.**

---

# 37. Commercial Health extension

Когда реальные paid objects появляются, Product Health получает дополнительный блок.

Core commercial metrics:

## Paid Value Usage

Использована ли купленная ценность?

## Fulfillment Rate

Доставили ли обещанное?

## Refund / Failure Rate

Где promise ломается?

## Paid → Product Return

Вернулся ли человек к программе / Things, а не только в billing?

## Repeat Purchase by Value

Повторяется ли purchase сопоставимой самостоятельной ценности?

## Revenue by Value Object

Какие объекты реально создают revenue?

## Payer / User split

Кто платит и кто получает experience?

Revenue не заменяет Product Health.

Канонически:

**REVENUE IS EVIDENCE OF EXCHANGE. FULFILLMENT AND REPEAT TELL US WHETHER THE EXCHANGE CREATED DURABLE VALUE.**

---

# 38. Value discovery review

До масштабирования monetization review должен отвечать:

1. где есть real consumption;
2. где есть continuation / return;
3. где repeated explicit intent;
4. где commitment;
5. где первый payment;
6. была ли value delivered;
7. повторилось ли поведение у разных людей.

Не начинать review с revenue dashboard, если payments ещё являются единичными experiments.

---

# 39. Privacy / consent

Analytics measurement подчиняется privacy / consent authority и runtime rules.

Metrics Model не даёт права собирать данные только потому, что они удобны аналитически.

Principles:

- minimum necessary data;
- consent where required;
- no sensitive payloads;
- no raw private Contribution / Situation text;
- aggregation where sufficient;
- deletion / retention according to legal policy;
- no hidden identity stitching ради красивой retention curve.

Канонически:

**MEASURABILITY DOES NOT OVERRIDE PRIVACY.**

---

# 40. Product QA for any new metric

Перед добавлением metric ответить:

1. **Какой Product question она отвечает?**
2. **Какое решение изменится в зависимости от значения?**
3. **Это raw event, derived signal, metric или KPI?**
4. **Какая единица счёта?**
5. **Какой population?**
6. **Как исключён internal / test traffic?**
7. **Не путаем ли exposure с consumption?**
8. **Не путаем ли click с success?**
9. **Не путаем ли activity с value?**
10. **Не стимулирует ли metric плохое editorial / product behaviour?**
11. **Можно ли получить ответ меньшим количеством instrumentation?**
12. **Нужен ли target сейчас или пока только baseline?**

Если metric не меняет решение:

**НЕ ДЕЛАТЬ ЕЁ KPI.**

---

# 41. Phase 0 implementation contract

Phase 0 не требует новой analytics platform или schema migration.

Нужно:

1. сохранить текущую GA4 / Clarity foundation;
2. отделить internal / test population насколько practically possible;
3. определить 3–5 реальных Things / Events для consumption semantics;
4. добавить минимальный semantic instrumentation для:
   - experience start;
   - continuation;
   - share intent where relevant;
   - source / entry-object attribution;
5. построить ручной / простой Product Health review;
6. не вводить targets до baseline;
7. проверить Thing → Thing и qualified entry на реальных sessions.

Цель Phase 0:

> **получить первые честные product signals без строительства analytics bureaucracy.**

---

# 42. Suggested implementation order

## Phase 0 — Population + semantic baseline

Internal/test exclusion, current events audit, small sample of Things.

## Phase 1 — Qualified experience

Form-aware `experience_start` / minimal completion where meaningful.

## Phase 2 — Continuation / Thing → Thing

Contextual continuation attribution.

## Phase 3 — Return semantics

Expectation-relative derived Return metrics.

## Phase 4 — Contribution / Participation / Intervention

Add closure / action signals only where corresponding product flows are real.

## Phase 5 — Commercial evidence

Intent / commitment / payment / fulfillment / repeat after actual offer experiments.

## Phase 6 — Dashboards / targets

Only after stable event quality and baseline.

---

# 43. Non-goals v1

`14` не требует:

- universal North Star Metric;
- massive event taxonomy;
- new data warehouse;
- real-time executive dashboard;
- growth funnel for every user;
- mandatory login analytics;
- scoring people by engagement;
- predictive lead scoring;
- gamification metrics;
- social graph metrics;
- revenue as product truth;
- daily active user target just because it is standard SaaS practice;
- tracking every click;
- PII enrichment;
- instrumentation before Product question.

---

# 44. Boundary with `12 · Distribution`

`12`:

> **как организовать точную встречу.**

`14`:

> **как понять, состоялась ли эта встреча и привела ли к ценности / продолжению.**

Каноническая связка:

**PROMISE → ENTRY OBJECT → QUALIFIED EXPERIENCE → CONTINUATION**

---

# 45. Boundary with `13 · Monetization`

`13`:

> **за какую конкретную ценность допустим payment.**

`14`:

> **какое evidence показывает, что value существует, есть intent, exchange состоялся, promise выполнен и demand повторяется.**

Канонически:

**MONETIZATION MODEL ≠ MONETIZATION EVIDENCE.**

---

# 46. Acceptance test

Metrics & Signals Model работает, если на любой dashboard number можно ответить:

```text
WHAT HAPPENED?
→ WHAT PRODUCT QUESTION DOES IT ANSWER?
→ WHAT POPULATION?
→ WHAT VALUE / RISK DOES IT REPRESENT?
→ IS IT RAW OR DERIVED?
→ WHAT DECISION CHANGES BECAUSE OF IT?
```

Если ответ только:

> **«эта цифра растёт»**

— этого недостаточно.

---

# Canonical summary

Главный вопрос:

> **Какие наблюдаемые сигналы доказывают, что Dementor создаёт ценность — а какие только создают видимость активности?**

Главная product chain:

**ENTRY → EXPERIENCE → CONTINUATION → RETURN → CONTRIBUTION / PARTICIPATION / INTERVENTION → RELEASE / HISTORY**

Commercial evidence:

**VALUE → INTENT → COMMITMENT → PAYMENT → DELIVERY → REPEAT**

Главные правила:

**MEASURE THE VALUE CHAIN, NOT THE NOISE AROUND IT.**

**CLICK / OPEN ≠ QUALIFIED ENTRY.**

**CONSUMPTION MUST BE FORM-AWARE.**

**THING → THING IS A PRODUCT CONTINUATION SIGNAL, NOT JUST AN INTERNAL LINK CLICK.**

**RETURN WINDOW FOLLOWS THE EXPECTATION, NOT A GENERIC SAAS RETENTION TEMPLATE.**

**PROGRAM QUALITY IS NOT THE SAME AS MAXIMUM REACH.**

**VALID MONETIZATION MODEL ≠ PROVEN PAID DEMAND.**

**NO QUESTION → NO EVENT.**

**BASELINE BEFORE OPTIMIZATION TARGET.**

**MEASURABILITY DOES NOT OVERRIDE PRIVACY.**

И главный anti-signal:

> **мы умеем показать рост активности, но не можем показать, какую самостоятельную ценность человек получил и почему захотел продолжить.**
