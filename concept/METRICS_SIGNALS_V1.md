# DEMENTOR CLUB — METRICS & SIGNALS v1

Status: **WORKING CANON / open stack**  
Updated: **2026-09-15**

## Authority scope

Этот документ является authority по вопросу:

> **Какие наблюдаемые сигналы действительно показывают, что Dementor Club создаёт ценность — а какие только создают видимость активности?**

Он определяет:

- различие между event, signal, metric, KPI и target;
- Product Health scorecard;
- entry / experience / continuation / return semantics;
- Contribution / Participation / Intervention measurement;
- Distribution quality measurement;
- Commercial evidence semantics;
- population / counting / attribution rules;
- event / payload principles;
- review cadence, targets, anti-signals и Phase 0 instrumentation.

Документ опирается на:

- `03 · Audience & Entry Map` — Source × Intent × Entry Object;
- `05 · Product Model` — Thing / Release / Production / Participation / History distinctions;
- `07 · Content & Programming` — Programming Moment / meaningful delta;
- `08 · Return Loops` — expectation / payoff / return;
- `09 · Contribution Model` — editorial outcome and closure;
- `10 · Dementor / Intervention` — Situation → relevant Intervention;
- `11 · Marketing Positioning & Messaging` — promise / proof / next Thing;
- `12 · Distribution Model` — routing / promise / Entry Object;
- `13A · Monetization Architecture` — valid paid value;
- `13B · Distribution Economics` — commercial path / experiment economics.

Каноническая граница:

> **PRODUCT MODELS DEFINE WHAT MATTERS. METRICS & SIGNALS DEFINE HOW WE OBSERVE WHETHER IT IS HAPPENING.**

`14` не переопределяет Product Value, Distribution logic, Return logic или commercial offer economics.

Главная Product Health chain:

**ENTRY → EXPERIENCE → CONTINUATION → RETURN → CONTRIBUTION / PARTICIPATION / INTERVENTION → RELEASE / HISTORY**

Commercial evidence extension:

**VALUE → INTENT → COMMITMENT → PAYMENT → DELIVERY → REPEAT**

---

# 0. Главный принцип

Dementor Club не должен оптимизироваться под то, что легче всего посчитать.

Pageviews, clicks, reactions и notification opens полезны как transport / diagnostic telemetry.

Но они не являются доказательством Product Value сами по себе.

Канонически:

**MEASURE THE VALUE CHAIN, NOT THE NOISE AROUND IT.**

**ACTIVITY IS NOT VALUE UNTIL IT CHANGES THE USER’S EXPERIENCE, EXPECTATION OR REAL OUTCOME.**

---

# 1. Event ≠ Signal ≠ Metric ≠ KPI ≠ Target

## Event

Технически наблюдаемое событие.

Event — observation, не вывод.

## Signal

Осмысленный факт или паттерн, который поддерживает или ослабляет product hypothesis.

## Metric

Агрегированная количественная мера.

## KPI

Metric, выбранная для регулярного управленческого контроля конкретной цели или риска.

## Target

Явно принятый ожидаемый диапазон / направление.

Target не появляется до baseline и operating context.

Канонически:

**AN EVENT IS NOT A SIGNAL BY ITSELF. A SIGNAL IS NOT AUTOMATICALLY A KPI. A KPI DOES NOT NEED A TARGET BEFORE A BASELINE EXISTS.**

---

# 2. No universal North Star

На текущем этапе Dementor не использует одну universal North Star Metric.

Причина:

- Thing может быть текстом, игрой, Event, Tool, Course или physical object;
- хороший one-off experience может быть complete use;
- Return важен не после каждой Thing;
- Contribution / Participation optional;
- Commercial action ещё более optional;
- high-frequency activity не является целью.

Поэтому v1 использует **Product Health Scorecard**.

Канонически:

**HEALTH = MULTIPLE INDEPENDENT SIGNALS THAT AGREE ABOUT VALUE.**

---

# 3. Product Health Scorecard v1

Регулярный Product Health review смотрит семь блоков.

## A. QUALIFIED EXPERIENCE ENTRY

Человек попал в конкретный Entry Object и реально начал experience.

Если существует explicit Distribution context, отдельно проверяется promise / intent fit.

## B. EXPERIENCE

Человек реально встретил обещанную Thing / Event / Tool / Course, а не только открыл URL.

## C. CONTINUATION

После experience часть людей добровольно открывает следующий релевантный объект.

## D. RETURN

Возникает реальная причина вернуться, а Return получает payoff.

## E. CONTRIBUTION / PARTICIPATION / INTERVENTION

Когда соответствующая ветка существует, человек получает meaningful response / action / outcome, а не просто interaction count.

## F. RELEASE / HISTORY

Things реально выходят, продолжаются и получают последствия.

## G. TRUST / DELIVERY

Promise совпадает с destination, availability, editorial response и paid fulfillment.

**Commercial Health** — отдельное расширение только после real payment evidence.

---

# 4. Evidence hierarchy

Уровни ниже описывают **силу evidence**, а не maturity ladder человека.

## LEVEL 0 · DELIVERY / EXPOSURE

Impression, delivered message, search impression, social view.

## LEVEL 1 · ENTRY / OPEN

Page view, entity open, Entry Object open.

## LEVEL 2 · EXPERIENCE

Человек реально начал experience соответствующего Form.

## LEVEL 3 · CONTINUATION / RETURN / ACTION

Thing → Thing, meaningful return, Share intent, Participation action, explicit value intent, Tool reuse.

## LEVEL 4 · CONSEQUENCE

Contribution closure, Participation output, Release / History, useful Intervention outcome, paid fulfillment, repeat.

Канонически:

**HIGHER EVIDENCE MEANS CLOSER TO REAL VALUE OR CONSEQUENCE — NOT A “BETTER USER”.**

---

# 5. Qualified Experience Entry ≠ Distribution Fit

Это принципиальное разделение `14`.

## Qualified Experience Entry

Существует, когда:

1. человек попал в конкретный Entry Object;
2. реально начал соответствующий experience;
3. visit не является явно bot / preview / internal test / broken navigation noise.

Рабочая формула:

**QUALIFIED EXPERIENCE ENTRY = VALID ENTRY OBJECT + EXPERIENCE START + HUMAN / VALID POPULATION**

## Distribution-qualified entry

Если существует explicit Distribution Decision / message / source context, дополнительно проверяется:

- promise → destination fit;
- target intent → Entry Object fit;
- routing context.

Рабочая формула:

**DISTRIBUTION-QUALIFIED ENTRY = QUALIFIED EXPERIENCE ENTRY + PROMISE / INTENT FIT**

Если source / intent неизвестны, experience может оставаться qualified, а Distribution Fit — `unknown`.

Канонически:

**UNKNOWN DISTRIBUTION CONTEXT ≠ FAILED EXPERIENCE.**

**CLICK / OPEN ≠ QUALIFIED EXPERIENCE ENTRY.**

Нельзя объявлять visit qualified только потому, что человек не bounced мгновенно.

---

# 6. Exposure ≠ Consumption

`page_view` и route open не являются consumption.

Для каждого Form нужен минимальный experience contract.

| Form | Минимальный meaningful evidence |
| --- | --- |
| Text / Article | meaningful dwell / progress / deliberate continuation |
| Video | play + meaningful watch threshold where observable |
| Game / Interactive | start + first meaningful action |
| Tool | real tool action / output |
| Event | detail consumption отдельно от commitment и attendance |
| Course / Program | meaningful lesson/module progression, не просто open |
| Physical Thing | order / pickup / ownership / QR continuation where observable |

Completion не обязана существовать для каждого Form.

Ни один proxy не должен притворяться доказательством понимания.

Канонически:

**CONSUMPTION MUST BE FORM-AWARE.**

---

# 7. Thing → Thing continuation

Ключевой ранний signal:

> **после одной самостоятельной Thing человек добровольно переходит к другой самостоятельной Thing.**

Canonical metric:

**THING → THING CONTINUATION RATE**

Denominator:

> qualified source Thing experiences, у которых существовала релевантная continuation opportunity.

Numerator:

> те из них, после которых человек в meaningful window начал experience другой самостоятельной Thing через contextual / program continuation.

Не считать автоматически:

- back navigation;
- generic nav click;
- Board refresh;
- forced redirect;
- prefetch;
- same-Thing asset navigation.

Канонически:

**THING → THING IS A PRODUCT CONTINUATION SIGNAL, NOT JUST AN INTERNAL LINK CLICK.**

---

# 8. Return

`08 · Return Loops` остаётся authority по смыслу Return.

`14` определяет observation / counting semantics.

Минимальные classes:

- Audience Return;
- Thing Continuity Return;
- Program Return;
- Dementor Work Return;
- Contributor / Participant Return;
- Utility Return.

Return считается относительно prior meaningful experience и соответствующего loop context, а не только как cookie revisit.

---

# 9. Return windows

Universal `D7 / D30 retention` не является продуктовой истиной.

Return window следует loop expectation:

- short editorial / continuation window;
- Program window;
- event-relative window;
- promise-relative window;
- situation-relative utility window;
- contributor-outcome-relative window.

Точные durations фиксируются после baseline и реального operating rhythm.

Канонически:

**RETURN WINDOW FOLLOWS THE EXPECTATION, NOT A GENERIC SAAS RETENTION TEMPLATE.**

---

# 10. Return Payoff

Revisit сам по себе — слабый signal.

Сначала определяется **eligible Return**: возвращение, которое можно разумно связать с prior meaningful experience / loop expectation.

Затем проверяется payoff.

Working derived metric:

**RETURN PAYOFF RATE**

Denominator:

> eligible Returns, для которых существовал обещанный или релевантный payoff opportunity.

Numerator:

> те Returns, где человек реально получил / начал этот payoff experience.

Payoff может быть:

- новая Thing;
- promised continuation;
- History outcome;
- editorial response;
- Event update;
- Tool reuse;
- Participation result.

Канонически:

**RETURN FREQUENCY WITHOUT PAYOFF IS NOT RETENTION HEALTH.**

---

# 11. Program Memory / Direct Return

Useful derived signal:

**DIRECT RETURN AFTER PRIOR QUALIFIED EXPERIENCE**

а не любой `Direct / None` session.

Direct traffic может включать bookmarks, autocomplete, internal use, auth redirects и referrer loss.

Program Memory можно дополнительно наблюдать через branded search, direct Home return, return to known Thing и другие privacy-safe signals.

---

# 12. Share

Различать:

- Share Intent;
- Share Completion, только если platform даёт reliable fact;
- Share Visit;
- Recipient Qualified Experience;
- Share Continuation.

Канонически:

**SHARE CLICK ≠ SUCCESSFUL WORD OF MOUTH.**

Более сильная цепочка:

**THING EXPERIENCE → SHARE → QUALIFIED EXPERIENCE BY RECIPIENT**

Если privacy / platform ограничения не позволяют доказать цепочку, не симулировать certainty.

---

# 13. Distribution quality

`12` отвечает за routing semantics.

`14` измеряет downstream quality.

Core views:

- Promise → Entry Fit;
- Qualified Experience Entry Rate;
- Distribution-qualified Entry Rate where context exists;
- Entry → Continuation;
- Channel → Experience → Continuation / Return;
- wrong-destination diagnostics.

Канонически:

**CHANNEL SUCCESS IS DOWNSTREAM OF EXPERIENCE QUALITY.**

Home, Board и Profile не считаются channels только потому, что через них происходит navigation.

---

# 14. Surface signals

## Home

Home — cover of current program.

Полезно смотреть:

- Home → Thing;
- Home → Thing → Thing;
- direct Home return → program entry;
- downstream continuation / share.

Home pageviews и CTA CTR сами по себе слабые.

## Board

Board — radar текущего происходящего.

Полезно смотреть:

- Thing / Project / Event open;
- Participation Opportunity open;
- meaningful continuation;
- return to current happening.

Не считать сильным Product Health signal:

- Board refresh;
- filter change;
- raw card impressions;
- generic scroll depth.

**BOARD ACTIVITY MUST NOT MASK THE ABSENCE OF RELEASES.**

---

# 15. Contribution / Participation / Intervention

## Contribution

`09` задаёт:

**BRING → ACKNOWLEDGE → EDITORIAL LOOK → DISPOSITION → CONSEQUENCE / CLOSURE**

Health:

- Contribution Received;
- Editorial Look Started;
- Meaningful Disposition;
- Closure Delivered;
- Contributor Return.

Канонически:

**CONTRIBUTION HEALTH = MEANINGFUL EDITORIAL RESPONSE, NOT MAXIMUM ACCEPTANCE.**

## Participation

Flow:

**OPPORTUNITY VIEW → JOIN INTENT → PARTICIPANT RELATION → ACTION / OUTPUT → CLOSURE / CONTINUATION**

Anti-signal:

> много «вписался», мало реального совместного действия.

## Intervention

`10` задаёт:

**SITUATION → INTERVENTION → RESOURCE / ACTION**

Success требует Situation fit + actual use / useful action.

Канонически:

**INTERVENTION SUCCESS = SITUATION FIT + USEFUL ACTION, NOT MAXIMUM SERVICE CONVERSION.**

---

# 16. Release / History / Programming

Product Health должен видеть, что Things выходят и продолжают жить.

Полезные signals:

- Thing → Release;
- Release → qualified experience;
- Release → continuation;
- meaningful History event;
- History → renewed attention;
- Project → standalone output.

Не считать сильными сами по себе:

- commits;
- internal status changes;
- generic Activity events;
- database updates.

Programming Moment оценивается downstream:

- qualified experience;
- continuation;
- return;
- meaningful share / reaction where relevant;
- closure promised continuation.

Канонически:

**OUTPUT / RELEASE / HISTORY > INTERNAL ACTIVITY VOLUME.**

**PROGRAM QUALITY IS NOT THE SAME AS MAXIMUM REACH.**

---

# 17. Commercial evidence

`13A` задаёт, за какую value допустим payment.

`13B` задаёт economics и experiment-specific commercial path.

`14` фиксирует evidence semantics.

Confidence ladder:

**SEEN → CONSUMED → RETURNED → EXPRESSED INTENT → COMMITTED → PAID → DELIVERED → REPEATED**

Это не user funnel.

Это evidence ladder для конкретной paid-value hypothesis.

Канонически:

**VALID MONETIZATION MODEL ≠ PROVEN PAID DEMAND.**

**REVENUE IS EVIDENCE OF EXCHANGE; DELIVERY AND REPEAT SHOW WHETHER THE EXCHANGE CREATED DURABLE VALUE.**

Semantic intent classes:

- Thing Interest;
- Experience Interest;
- Participation Interest — не payment intent;
- Intervention Interest;
- Support Interest.

---

# 18. Event contract

Event names описывают observable action, а не маркетинговую интерпретацию.

Rules:

1. lowercase `snake_case`;
2. action-oriented;
3. no PII;
4. channel не кодируется в event name;
5. не создавать event name на каждый slug;
6. Product state не выводится из одного analytics event;
7. derived metrics не притворяются raw events.

Existing production events сохраняются для compatibility.

Candidate semantic events вводятся только там, где существует реальный Product question.

### Experience

- `thing_experience_start`
- `thing_experience_complete` — только где completion имеет смысл
- `tool_action`
- `event_commitment`
- `event_attendance` — только из reliable attendance source

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

`repeat_purchase` предпочтительно derived из authoritative purchase history.

Канонически:

**NO QUESTION → NO EVENT.**

---

# 19. Payload / privacy / identity

Минимальный semantic payload, где applicable:

```text
entity_type
entity_id
thing_id?
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

Commercial events могут дополнительно использовать controlled value-object / amount / currency fields, если это соответствует payment / legal / privacy rules.

Не отправлять:

- email / name / phone;
- auth token;
- raw Contribution body;
- free-text Situation;
- private answers;
- payment credentials;
- sensitive profile fields.

Канонически:

**SEMANTIC ATTRIBUTION WITHOUT PERSONAL DATA.**

**MEASURABILITY DOES NOT OVERRIDE PRIVACY.**

Metrics должны различать:

- event count;
- session count;
- anonymous browser / device where technically and legally allowed;
- authenticated product relation where operationally necessary;
- entity count.

Authenticated account не является universal audience unit.

Cross-device identity не должна искусственно склеиваться ради красивой retention curve.

Канонически:

**COUNT THE UNIT THE QUESTION ACTUALLY ASKS ABOUT.**

---

# 20. Population quality

Минимальные reporting classes:

- `external_audience`;
- `authenticated_member_or_contributor`;
- `internal_admin_test`;
- `unknown`.

Bots, crawlers и social preview fetchers не попадают в qualified human experience where reasonably identifiable.

Market / monetization conclusions требуют явно описанной population.

Канонически:

**NO MARKET CLAIM FROM AN UNCLASSIFIED INTERNAL-HEAVY SAMPLE.**

`unknown` лучше ложной точности.

---

# 21. Attribution ownership

Attribution имеет несколько owners по смыслу.

## `12 · Distribution`

Определяет:

- trigger;
- target intent;
- channel / transport;
- promise;
- Entry Object;
- expected continuation.

## `13B · Distribution Economics`

Для commercial experiment определяет economic attribution policy:

- acquisition mode;
- cost scope;
- offer / experiment attribution rule;
- commercial eligibility.

## `14 · Metrics & Signals`

Определяет:

- какие observable events / dimensions нужны;
- как связать entry с routing / experiment context;
- как считать derived metrics;
- как реализовать и явно маркировать measurement windows;
- как показывать uncertainty / unknown attribution;
- thresholds / dashboards / review semantics.

Канонически:

**MEASUREMENT IMPLEMENTS ATTRIBUTION POLICY; IT DOES NOT INVENT PRODUCT OR COMMERCIAL CAUSALITY.**

---

# 22. Attribution windows

Нет одного universal attribution window.

Measurement window следует поведению, которое измеряется:

- distribution → entry: short / trigger-appropriate;
- Share → recipient experience: reasonable share-specific;
- Event intent → commitment: event-relative;
- Return: expectation-relative;
- utility: situation-relative.

Для commercial experiment конкретная attribution policy / window задаётся `13B` или самим approved experiment; `14` реализует её и делает её видимой в отчёте.

Канонически:

**ATTRIBUTION WINDOW FOLLOWS THE BEHAVIOUR OR APPROVED EXPERIMENT BEING MEASURED.**

Не использовать universal `last-click 30 days` как Product truth.

---

# 23. Review cadence / dashboards / targets

v1 не требует большого BI stack.

## Weekly Operating Review

Operational anomalies:

- broken destinations;
- tracking gaps;
- current Programming Moments;
- data-quality problems;
- closure / fulfillment incidents.

## Monthly Product Health Review

Patterns:

- qualified experience;
- Thing → Thing;
- Return + Return Payoff;
- source / intent / Entry Object fit where known;
- contributor / participant loops;
- value intent;
- Release / History;
- commercial evidence where real.

## Quarterly Model Review

Проверять:

- какие metrics оказались vanity;
- какие events лишние;
- появились ли baseline / targets;
- не искажают ли metrics editorial / product behaviour.

Dashboard должен сначала показывать causal chain, потом totals.

Target нужен только для решения.

Канонически:

**BASELINE BEFORE OPTIMIZATION TARGET.**

---

# 24. Vanity metrics / anti-signals

Vanity metric — не «плохая цифра».

Это цифра, которой приписали больше смысла, чем она имеет.

Типичные weak / diagnostic totals:

- pageviews;
- total users;
- followers;
- likes / reactions;
- Board cards;
- notification opens;
- registrations;
- submissions;
- sessions;
- time-on-site без context.

Критические anti-signals:

- pageviews ↑, qualified experience ↓;
- CTR ↑, destination mismatch ↑;
- Board activity ↑, Releases не появляются;
- notifications ↑, Return Payoff ↓;
- submissions ↑, editorial closure ↓;
- joins ↑, participation action отсутствует;
- Event opens высокие, commitments отсутствуют;
- Dementor profile views ↑, authored work не открывают;
- Intervention CTA clicks ↑, Situation fit неизвестен;
- Membership interest выводят из Join opens;
- revenue ↑, delivery / repeat ↓;
- internal/test traffic считается market demand;
- один power user создаёт видимость массового engagement;
- targets начинают влиять на editorial selection сильнее Product Model;
- instrumentation существует, но никто не знает, какое решение она поддерживает.

Главный anti-signal:

> **мы умеем показать рост активности, но не можем показать, какую самостоятельную ценность человек получил и почему захотел продолжить.**

---

# 25. Product QA for any metric

Перед добавлением metric ответить:

1. Какой Product question она отвечает?
2. Какое решение изменится?
3. Это event, signal, metric, KPI или target?
4. Какая единица счёта?
5. Какая population?
6. Как исключён / маркирован internal-test traffic?
7. Не путаем ли exposure с experience?
8. Не путаем ли click с success?
9. Не путаем ли activity с value?
10. Не стимулирует ли metric плохое behaviour?
11. Можно ли ответить меньшим instrumentation?
12. Нужен ли target или пока baseline?
13. Какая uncertainty / unknown attribution остаётся?

Если metric не меняет решение:

**НЕ ДЕЛАТЬ ЕЁ KPI.**

---

# 26. Phase 0 implementation contract

Phase 0 не требует новой analytics platform или schema migration.

Нужно:

1. сохранить текущую GA4 / Clarity foundation;
2. отделить external / internal / unknown population насколько practically possible;
3. выбрать 3–5 реальных Things / Events разных Forms;
4. для каждого определить Entry Object и experience-start contract;
5. добавить минимальный semantic instrumentation:
   - `thing_experience_start`;
   - `continuation_open`;
   - Share intent where real;
6. протянуть Distribution context только там, где он реально известен;
7. собрать первый simple Product Health review;
8. проверить Thing → Thing и Return на честной выборке;
9. не вводить optimization targets до baseline.

Первый инженерный приоритет:

**HONEST SAMPLE + QUALIFIED EXPERIENCE + CONTINUATION.**

Цель Phase 0:

> **получить первые честные product signals без строительства analytics bureaucracy.**

---

# 27. Non-goals v1

`14` не требует:

- universal North Star Metric;
- massive event taxonomy;
- new data warehouse;
- real-time executive dashboard;
- growth funnel for every user;
- mandatory login analytics;
- engagement scoring;
- predictive lead scoring / churn;
- gamification metrics;
- social graph metrics;
- revenue as Product truth;
- generic DAU target;
- tracking every click;
- PII enrichment;
- hidden identity stitching;
- instrumentation before Product question.

---

# 28. Acceptance test

Metrics & Signals Model считается рабочим, если на любую dashboard / report number можно ответить:

```text
WHAT HAPPENED?
→ WHAT PRODUCT QUESTION DOES IT ANSWER?
→ WHAT POPULATION?
→ WHAT EXPERIENCE / VALUE / RISK DOES IT REPRESENT?
→ IS IT RAW OR DERIVED?
→ WHAT ATTRIBUTION / WINDOW RULE APPLIES?
→ WHAT IS UNKNOWN?
→ WHAT DECISION CHANGES BECAUSE OF IT?
```

Если ответ только:

> **«эта цифра растёт»**

— этого недостаточно.

---

# Canonical summary

Главная Product Health chain:

**ENTRY → EXPERIENCE → CONTINUATION → RETURN → CONTRIBUTION / PARTICIPATION / INTERVENTION → RELEASE / HISTORY**

Commercial evidence:

**VALUE → INTENT → COMMITMENT → PAYMENT → DELIVERY → REPEAT**

Главные правила:

**MEASURE THE VALUE CHAIN, NOT THE NOISE AROUND IT.**

**CLICK / OPEN ≠ QUALIFIED EXPERIENCE ENTRY.**

**UNKNOWN DISTRIBUTION CONTEXT ≠ FAILED EXPERIENCE.**

**CONSUMPTION MUST BE FORM-AWARE.**

**THING → THING IS A PRODUCT CONTINUATION SIGNAL, NOT JUST AN INTERNAL LINK CLICK.**

**RETURN WINDOW FOLLOWS THE EXPECTATION, NOT A GENERIC SAAS RETENTION TEMPLATE.**

**RETURN FREQUENCY WITHOUT PAYOFF IS NOT RETENTION HEALTH.**

**PROGRAM QUALITY IS NOT THE SAME AS MAXIMUM REACH.**

**VALID MONETIZATION MODEL ≠ PROVEN PAID DEMAND.**

**MEASUREMENT IMPLEMENTS ATTRIBUTION POLICY; IT DOES NOT INVENT PRODUCT OR COMMERCIAL CAUSALITY.**

**NO QUESTION → NO EVENT.**

**BASELINE BEFORE OPTIMIZATION TARGET.**

**MEASURABILITY DOES NOT OVERRIDE PRIVACY.**

Главный anti-signal:

> **мы умеем показать рост активности, но не можем показать, какую самостоятельную ценность человек получил и почему захотел продолжить.**
