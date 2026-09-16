# DEMENTOR CLUB — METRICS & SIGNALS PRODUCTION MAPPING

Status: **REFERENCE / IMPLEMENTATION MAPPING**  
Updated: **2026-09-15**

## Purpose

Этот документ сопоставляет `14 · Metrics & Signals v1` с фактической аналитической инфраструктурой Dementor Club.

Он отвечает:

> **Что уже можно KEEP, что нужно REFRAME, где есть PARTIAL GAP, а где реальный GAP между текущей telemetry и Product Health authority?**

Source branches checked:

- `dementor-club-production` — runtime analytics;
- `dementor/distribution-model-v1` — `12 · Distribution Model` authority / mapping;
- `dementor/monetization-map-v1` — monetization value-discovery evidence layer.

Этот mapping не меняет runtime и не вводит schema migration.

---

# 0. Executive conclusion

Текущая система **не является analytics blank slate**.

Уже существуют:

- GA4;
- Microsoft Clarity;
- explicit consent gate;
- production-origin guard;
- blocked sensitive payload keys;
- page views;
- route-aware entity opens;
- CTA tracking;
- placement classification;
- contextual recommendation tracking;
- Join / assessment / auth / Workspace events.

Это хороший transport / telemetry foundation.

Главный недостаток — не отсутствие аналитики, а отсутствие **Product Health semantics** поверх неё.

Канонический вывод:

> **KEEP THE ANALYTICS TRANSPORT. ADD THE VALUE SEMANTICS.**

---

# 1. Current production analytics runtime

Файл:

`production-analytics-v1.js`

Текущий runtime:

- работает только на `https://dementor.club`;
- загружает GA4 после consent;
- загружает Clarity после consent;
- отключает ad storage / personalization;
- использует allowlist events;
- очищает event payload;
- блокирует email / name / phone / token / user_id / answers / free_text и сходные поля;
- фиксирует SPA navigation pageviews;
- умеет определять project / course / event / merch routes;
- умеет классифицировать placement;
- фиксирует contextual recommendation click;
- фиксирует main CTA clicks на Course / Event / Merch;
- фиксирует Join / assessment / auth / Workspace flows.

Это нужно в основном **KEEP**.

---

# 2. Existing event allowlist

Production allowlist на момент проверки:

```text
join_start
join_sphere_open
assessment_complete
auth_start
auth_complete
workspace_open
project_open
course_open
course_cta_click
event_open
event_cta_click
merch_open
merch_cta_click
recommendation_click
external_community_click
```

Эти events полезны, но отражают преимущественно:

- route open;
- CTA click;
- account / workspace activity;
- section-level navigation.

Они **не покрывают** целиком:

- qualified entry;
- Thing experience;
- form-aware consumption;
- Thing → Thing;
- Return payoff;
- Contribution closure;
- Participation action;
- Situation → Intervention fit;
- Programming Moment attribution;
- monetization evidence ladder.

Классификация:

**KEEP + EXTEND SEMANTICALLY**

---

# 3. KEEP — GA4 / Clarity transport

### Decision

**KEEP**

Текущие GA4 / Clarity могут остаться первым telemetry layer.

Нет основания для Phase 0 строить:

- новый data warehouse;
- отдельную event bus;
- новую analytics vendor stack;
- собственный session replay;
- real-time BI infrastructure.

Сначала нужно доказать semantic instrumentation на текущем stack.

---

# 4. KEEP — consent and production guard

### Decision

**KEEP**

Сильные текущие свойства:

- analytics включается только на production origin;
- пользовательский consent сохраняется отдельно;
- analytics не должна автоматически работать на staging / local;
- ad personalization выключена.

Это согласуется с `14`:

**MEASURABILITY DOES NOT OVERRIDE PRIVACY.**

---

# 5. KEEP — payload sanitization

### Decision

**KEEP + EXPAND IF NEW SEMANTICS REQUIRE IT**

Текущий `BLOCKED_KEYS` уже запрещает:

- email;
- name;
- phone;
- tokens;
- user identifiers;
- answers;
- free text.

Это особенно важно перед будущими:

- Contribution events;
- Intervention events;
- Situation fit events;
- commercial events.

Нельзя передавать в GA4 raw Contribution body или Situation text.

Semantic payload должен использовать controlled IDs / classes.

---

# 6. KEEP — entity / placement primitives

### Decision

**KEEP**

Текущий runtime уже использует:

```text
entity_type
entity_id
placement
source_page
cta_id
```

Это хорошая основа для `14` payload contract.

Особенно полезен `placement`, который различает:

- nav;
- footer;
- hero;
- contextual recommendation;
- event programme;
- entity grid;
- content.

Не нужно создавать другой параллельный placement taxonomy без реальной причины.

---

# 7. KEEP — route-aware opens

### Decision

**KEEP, BUT DO NOT CALL THEM CONSUMPTION**

Текущие:

- `project_open`;
- `course_open`;
- `event_open`;
- `merch_open`.

Они полезны как `ENTRY / OPEN` layer.

Но:

**ENTITY OPEN ≠ QUALIFIED EXPERIENCE**

Особенно:

- Event page open ≠ attendance;
- Course open ≠ course consumption;
- Project open ≠ Project value;
- Merch open ≠ ownership intent.

Нужно сохранить события и перестать приписывать им слишком сильный смысл.

---

# 8. KEEP — contextual recommendation signal

### Decision

**KEEP + REFRAME AS CONTINUATION INPUT**

`recommendation_click` уже существует.

Это потенциально хороший primitive для Thing → Thing / contextual continuation.

Но сейчас он не доказывает:

- что source experience был qualified;
- что target является другой самостоятельной Thing;
- что click был relevant continuation;
- что target experience реально начался.

Поэтому правильная цепочка:

```text
qualified source experience
→ contextual continuation click
→ target Thing experience
```

Только после этого можно считать сильный Thing → Thing signal.

---

# 9. KEEP — CTA events

### Decision

**KEEP AS INTENT / ACTION TELEMETRY, NOT SUCCESS**

`course_cta_click`, `event_cta_click`, `merch_cta_click` дают полезный signal действия.

Но CTA click нельзя автоматически интерпретировать как:

- purchase;
- Event commitment;
- attendance;
- paid intent;
- fulfilled value.

Нужен downstream fact.

---

# 10. REFRAME — `page_view`

### Decision

**KEEP TECHNICALLY / REFRAME SEMANTICALLY**

Pageview нужен для:

- exposure;
- debugging;
- navigation understanding;
- broad traffic shape.

Pageview не является:

- Thing consumption;
- Program success;
- Return payoff;
- market demand.

Главный риск — использовать pageviews как главный KPI просто потому, что они уже доступны.

---

# 11. REFRAME — route opens as Product Health

### Decision

**REFRAME**

Current route events находятся на уровне:

**ENTRY**

Нужно добавить слой:

**EXPERIENCE**

Для выбранных real Forms / surfaces.

Не обязательно сразу универсализировать всю систему.

Phase 0 достаточно 3–5 реальных objects.

---

# 12. PARTIAL GAP — Thing identity in analytics

Current route mapper понимает:

- Project;
- Course;
- Event;
- Merch.

Но Product Model ставит в центр **Thing**, которая может быть backed разными source entities / surfaces.

### Decision

**PARTIAL GAP**

Нужен semantic adapter, который может передать в analytics:

```text
thing_id
source_entity_type?
source_entity_id?
form?
```

без требования универсальной `dc_things` table.

Thing identity может приходить из Product ViewModel / page data attributes / runtime config.

---

# 13. GAP — qualified entry

Текущий runtime фиксирует page open / entity open.

Он не различает:

- correct destination + experience start;
- accidental / generic landing;
- wrong promise / destination;
- bot / preview;
- internal navigation noise.

### Decision

**GAP**

Нужно внедрить definition из `14`:

**QUALIFIED ENTRY = CORRECT DESTINATION + EXPERIENCE START**

Это может быть derived metric, а не отдельный raw event.

---

# 14. GAP — form-aware consumption

### Decision

**GAP**

Current analytics почти полностью route/click based.

Нужно определить минимальные consumption contracts для:

- text;
- video;
- game / interactive;
- Tool;
- Event;
- Course;
- physical continuation.

Не нужен один generic `content_complete` для всего.

---

# 15. PARTIAL GAP — Thing → Thing

Есть `recommendation_click` и entity opens.

Это делает реализацию значительно проще.

### Decision

**PARTIAL GAP**

Не хватает:

- source Thing identity;
- proof source qualified experience;
- target Thing identity;
- continuation type;
- target experience confirmation.

Suggested minimal event:

`continuation_open`

Payload:

```text
entity_type
entity_id
source_thing_id
continuation_type
placement
```

Точный implementation может отличаться, если тот же signal можно надёжно получить из existing events + page context.

---

# 16. GAP — Return semantics

GA4 умеет показывать returning users / sessions, но это недостаточно для `08` / `14`.

### Decision

**GAP / DERIVED ANALYTICS**

Нужны derived views:

- return after qualified experience;
- Thing continuity return;
- Program return;
- promise-relative return;
- contributor / participant return;
- utility return.

Не требуется raw event `return_visit` на каждую загрузку страницы.

Return в основном лучше вычислять из session / entity history.

---

# 17. GAP — Return Payoff

Current runtime не измеряет, получил ли вернувшийся человек ожидаемое продолжение.

### Decision

**GAP**

Нужен derived signal:

**meaningful return → promised / relevant payoff consumed**

Это один из ключевых ways не превратить notifications / frequency в fake retention.

---

# 18. GAP — Programming Moment attribution

`12` уже выделил необходимость semantic routing context.

Current analytics не знает:

- Programming Moment;
- Distribution Trigger;
- target intent;
- promised Entry Object.

### Decision

**GAP**

Нужен безопасный optional attribution payload:

```text
programming_moment_ref
distribution_trigger
entry_intent
distribution_channel
entry_object_ref
```

Не обязательно хранить это как отдельную database entity на Phase 0.

---

# 19. PARTIAL GAP — channel attribution

GA4 / referrer already provide часть transport attribution.

`source_page` и external navigation также есть.

### Decision

**PARTIAL GAP**

Не хватает semantic channel / trigger context.

UTM не заменяет intent.

Referrer не заменяет Programming reason.

---

# 20. GAP — Share chain

Current audit не подтверждает full product-level Share instrumentation.

### Decision

**GAP / VERIFY PER SURFACE**

Минимум нужен:

- `thing_share_intent` или эквивалент;
- shared Entry Object preservation;
- source attribution where privacy-safe;
- recipient qualified experience if observable.

Не обещать deterministic person-to-person graph.

---

# 21. GAP — Contribution metrics

Current production analytics allowlist не содержит Contribution lifecycle events.

### Decision

**GAP**

Когда Contribution workflow реально внедрён, нужны:

- received;
- disposition;
- closure seen / delivered;
- contributor return.

Не инструментировать hypothetical workflow раньше runtime.

---

# 22. GAP — Participation metrics

### Decision

**GAP**

Нужны только после появления реальных Participation Opportunities / relations:

- interest;
- joined;
- action;
- output / continuation.

Не считать generic Join эквивалентом Participation.

---

# 23. GAP — Intervention metrics

### Decision

**GAP**

Future instrumentation должно начинаться с:

- Situation fit;
- resource use;
- meaningful action;
- optional paid action.

Нельзя начинать с Dementor profile CTA conversion.

---

# 24. PARTIAL GAP — Monetization value discovery

`13` уже предложил semantic intent classes:

- Thing Interest;
- Experience Interest;
- Participation Interest;
- Intervention Interest;
- Support Interest.

### Decision

**SEMANTICALLY READY / RUNTIME GAP**

`14` принимает classes и фиксирует candidate event names:

```text
thing_interest
experience_interest
participation_interest
intervention_interest
support_interest
```

Но events нужно добавлять только рядом с реальным UI / action.

Нельзя создавать fake buttons ради measurement.

---

# 25. GAP — payment / fulfillment / repeat

Current audited analytics не содержит authoritative payment events.

### Decision

**GAP UNTIL REAL PAID OFFER**

Когда появится первый payment test:

- `payment_start`;
- `purchase`;
- `refund`;
- fulfillment fact из product / operational source;
- repeat purchase — preferably derived.

Payment provider должен быть transaction truth.

GA4 event — аналитическая проекция, не финансовый ledger.

---

# 26. Critical data-quality problem — internal / test traffic

Current monetization evidence review уже зафиксировал сильное загрязнение выборки.

Dated snapshot на 2026-09-15:

- около 15 active users;
- 106 sessions;
- 649 page views;
- 1581 events;
- 71 / 106 sessions через `accounts.google.com / referral`;
- заметная доля связана с auth / Workspace / Board / internal testing.

### Decision

**HIGHEST-PRIORITY GAP**

До market / monetization conclusions необходимо отделить population.

Phase 0 должен ввести practical classification / exclusion для:

- internal/admin/test;
- authenticated operational traffic;
- external audience;
- unknown.

Точный technical mechanism требует implementation review.

---

# 27. Internal traffic implementation options

Возможные implementation approaches, которые нужно оценить отдельно:

- GA4 internal traffic filter;
- explicit admin/test marker;
- environment / role-derived analytics dimension without raw user ID;
- server-side / client-safe population class;
- known test devices only where operationally manageable.

Не канонизируем конкретный способ в docs-only phase.

Главное требование:

> **market report must declare what population it contains.**

---

# 28. Current source-page semantics

`cleanParams()` автоматически добавляет:

`source_page = location.pathname`

### Decision

**KEEP**

Но не путать:

- source page;
- acquisition source;
- channel;
- Distribution Trigger;
- Entry Object.

Это разные dimensions.

---

# 29. Clarity

### Decision

**KEEP AS QUALITATIVE DIAGNOSTIC**

Clarity useful для:

- broken UX;
- confusing flow;
- rage / dead clicks;
- visual behavior review;
- page-level qualitative inspection.

Clarity не является Product Health authority.

Session replay не доказывает value без semantic context.

---

# 30. GA4

### Decision

**KEEP AS PRIMARY V1 EVENT AGGREGATION**

GA4 достаточно для Phase 0 / Phase 1 при условии:

- event quality;
- population separation;
- semantic dimensions;
- simple derived analysis.

Причина менять analytics stack должна возникнуть из реального limitation, а не из желания построить data platform заранее.

---

# 31. Suggested event additions — Phase 0 only

Не внедрять весь `14` event catalog сразу.

Первый narrow slice:

```text
thing_experience_start
continuation_open
thing_share_intent   # только если реальный share action существует
```

Optional:

```text
thing_interest
experience_interest
```

только на реальных intent surfaces.

Цель — доказать:

```text
entry
→ qualified experience
→ Thing → Thing / share / explicit intent
```

---

# 32. Suggested payload additions — Phase 0

Для новых semantic events:

```text
thing_id
entity_type?
entity_id?
placement
source_page
entry_source?
entry_intent?
distribution_trigger?
distribution_channel?
continuation_type?
```

Не отправлять absent context как выдуманное значение.

`unknown` лучше ложной точности.

---

# 33. Dashboard — do not build yet as product feature

### Decision

**SIMPLE REVIEW FIRST**

До baseline достаточно:

- GA4 Exploration / simple reports;
- spreadsheet / manual review if necessary;
- Clarity for qualitative diagnostics;
- dated Product Health note.

Не нужно сейчас создавать public/admin dashboard feature только потому, что появился Metrics Model.

---

# 34. Recommended Product Health report v0

Еженедельный / месячный report может содержать:

```text
POPULATION
external / internal / unknown

ENTRY
qualified entries by Entry Object

EXPERIENCE
qualified Thing experiences

CONTINUATION
Thing → Thing
contextual continuation
share intent

RETURN
meaningful return
payoff where observable

PROGRAM / DISTRIBUTION
Programming Moment → qualified experience
source/channel → downstream quality

CONTRIBUTION / PARTICIPATION
only if real runtime exists

COMMERCIAL EVIDENCE
intent / commitment / payment / fulfillment only if real offer exists

DATA QUALITY
missing events / broken routes / sample contamination
```

---

# 35. KEEP / REFRAME / GAP summary

| Area | Decision | Why |
|---|---|---|
| GA4 transport | **KEEP** | already production-ready baseline |
| Clarity | **KEEP** | qualitative diagnostic |
| Consent | **KEEP** | aligned with privacy guardrail |
| Production-origin guard | **KEEP** | avoids staging contamination |
| Sensitive-key blocking | **KEEP** | strong privacy primitive |
| `entity_type/entity_id` | **KEEP** | useful semantic primitive |
| `placement/source_page` | **KEEP** | useful context primitive |
| route opens | **KEEP + REFRAME** | entry, not consumption |
| CTA clicks | **KEEP + REFRAME** | intent/action, not success |
| `recommendation_click` | **KEEP + REFRAME** | continuation primitive |
| pageviews | **KEEP + REFRAME** | diagnostic/exposure only |
| Thing identity | **PARTIAL GAP** | current routes are source-entity based |
| Qualified Entry | **GAP** | no promise→experience semantics |
| Form-aware consumption | **GAP** | route/click telemetry only |
| Thing → Thing | **PARTIAL GAP** | primitives exist, semantic chain missing |
| Return semantics | **GAP** | generic revisit insufficient |
| Return Payoff | **GAP** | no expected-value linkage |
| Programming Moment attribution | **GAP** | no semantic distribution context |
| Channel attribution | **PARTIAL GAP** | transport exists, intent missing |
| Share chain | **GAP / VERIFY** | no confirmed product-level contract |
| Contribution lifecycle | **GAP** | future runtime |
| Participation lifecycle | **GAP** | future runtime |
| Intervention value | **GAP** | future runtime |
| Commercial intent classes | **SEMANTIC READY / RUNTIME GAP** | defined in 13/14 |
| Payment / fulfillment / repeat | **GAP UNTIL OFFER** | no real paid object truth yet |
| Internal/test exclusion | **CRITICAL GAP** | current sample heavily contaminated |
| Dashboard | **DO NOT BUILD YET** | review can run on current tools |

---

# 36. Phase 0 implementation proposal

No schema migration.

## Step 1 — Data-quality gate

- define external / internal / unknown population;
- verify GA4 consent / production behavior;
- document auth referral distortion;
- exclude obvious test/admin where safely possible.

## Step 2 — Choose real objects

Pick 3–5 real Things / Events / experiences with different Forms.

For each define:

- Entry Object;
- experience start;
- meaningful continuation;
- possible Return.

## Step 3 — Add narrow semantic events

Minimum:

- `thing_experience_start`;
- `continuation_open`;
- share intent only where available.

## Step 4 — Connect `12`

Add optional:

- distribution trigger;
- entry intent;
- channel;
- programming moment ref.

Only where Distribution Decision exists.

## Step 5 — First Product Health review

Measure:

- qualified entry;
- experience;
- Thing → Thing;
- return where sample allows;
- data quality.

No optimization target yet.

---

# 37. What not to implement in Phase 0

Do not build yet:

- universal analytics schema;
- custom warehouse;
- BI dashboard app;
- lead scoring;
- user engagement score;
- global retention KPI;
- revenue dashboard;
- predictive churn;
- automated monetization funnel;
- full event catalog;
- arbitrary targets;
- tracking without Product question.

---

# 38. Boundary with `12 · Distribution`

Current production already has enough primitives to add distribution measurement without rebuilding transport.

`12` should provide or derive:

- trigger;
- channel;
- intent;
- Entry Object.

`14` should observe:

- entry;
- qualified experience;
- continuation;
- return.

Main implementation opportunity:

> **extend existing event payload rather than create parallel analytics infrastructure.**

---

# 39. Boundary with `13 · Monetization`

`13` currently has architecture + value-discovery evidence review.

`14` accepts the evidence ladder:

```text
SEEN
→ CONSUMED
→ RETURNED
→ EXPRESSED INTENT
→ COMMITTED
→ PAID
→ REPEATED
```

But runtime should add payment events only after a real paid test exists.

No payment test → no pretend commercial conversion dashboard.

---

# 40. Final implementation conclusion

По текущему runtime основная задача `14` — **не внедрить analytics**, потому что analytics уже есть.

Основная задача:

1. очистить population;
2. перестать считать opens consumption;
3. дать Thing semantic identity;
4. определить Form-aware experience;
5. связать continuation в Thing → Thing;
6. добавить Return semantics;
7. протянуть Distribution context;
8. подключать commercial evidence только по мере появления реальных offers.

Канонически:

> **KEEP THE ANALYTICS TRANSPORT. ADD THE VALUE SEMANTICS.**

И первым инженерным приоритетом является не dashboard, а:

> **HONEST SAMPLE + QUALIFIED EXPERIENCE + CONTINUATION.**
