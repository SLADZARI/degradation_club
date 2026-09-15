# DEMENTOR CLUB — DISTRIBUTION MODEL / PRODUCTION MAPPING

Status: **REFERENCE / production compatibility map**  
Updated: **2026-09-15**

Authority model:

- `concept/DISTRIBUTION_MODEL_V1.md`

Runtime branches inspected:

- `dementor-club-production` — production candidate/runtime;
- `dementor-club-site` — staging implementation.

## Purpose

Этот документ сопоставляет текущую distribution-инфраструктуру с `12 · Distribution Model`.

Он не создаёт новую Product ontology и не заменяет authority-модель.

Статусы:

- **KEEP** — механизм полезен без смыслового разворота;
- **REFRAME** — transport сохраняется, но меняется причина / роль;
- **PARTIAL GAP** — фундамент есть, semantic coverage неполно;
- **GAP** — требуемый semantic/runtime layer не подтверждён.

Главный вывод:

> **Текущий Dementor уже имеет большую часть transport-инфраструктуры. Главный дефицит — единая semantic routing policy: trigger → intent → precise Entry Object → experience, а не новые каналы.**

Ключевое уточнение authority:

> **Programming Moment нужен для controlled editorial outbound, но не является обязательным gate для Search, person-mediated Share, direct return или contextual QR handoff.**

---

# 1. Executive map

| Surface / capability | Status | Production reading |
|---|---|---|
| Sitemap | **KEEP** | discoverability transport существует |
| Robots | **KEEP** | crawler control существует |
| Canonical runtime | **KEEP** | canonical URL / `og:url` нормализуются runtime |
| Search intent → precise Entry Object | **GAP** | discoverability infrastructure не выражает semantic intent routing |
| OG / Twitter metadata | **KEEP** | primitives существуют |
| Thing-specific preview coverage | **PARTIAL GAP** | entity-specific coverage неполна |
| Static canonical-host consistency | **PARTIAL GAP** | отдельные static metadata всё ещё указывают старый Vercel host |
| Share URL / preview transport | **KEEP / PARTIAL** | обычная ссылка и preview возможны; universal Thing-aware contract неполон |
| Dedicated native Share action | **OPTIONAL GAP** | `navigator.share` не подтверждён и не требуется для закрытия модели |
| Telegram worker / outbox | **KEEP** | transport и delivery states существуют |
| Telegram publication trigger | **REFRAME** | raw Artifact submit слишком близок к причине send |
| Programming Moment → editorial outbound gate | **GAP** | semantic gate до send не подтверждён |
| Event detail surfaces | **KEEP** | Event может быть exact Entry Object |
| Event / physical → digital continuation | **GAP** | general contextual handoff policy не подтверждена |
| Board public routes | **KEEP** | projection может вести на concrete object |
| Board as generic acquisition destination | **REFRAME** | допустим только для intent «что сейчас происходит?» |
| Home | **KEEP** | хороший program-cover / direct destination |
| Home as default landing | **REFRAME** | precise promise должен вести к precise object |
| Entity / CTA analytics | **KEEP** | open/click primitives есть |
| Placement / source-page context | **KEEP** | basic attribution foundation есть |
| Distribution trigger / intent / Entry Object attribution | **GAP** | semantic dimensions не представлены системно |
| Qualified experience consumption | **PARTIAL GAP** | route opens есть, experience-consumption покрытие неполно |
| Thing → Thing continuation | **PARTIAL GAP** | `recommendation_click` даёт primitive, но Product-level semantics неполны |
| Delivery permission / suppression semantics | **PARTIAL GAP** | Telegram states включают suppression, но общий channel eligibility contract не подтверждён |
| Return linked to distribution context | **GAP / LATER** | не нужен perfect multi-touch для Phase 0; owner также `08/14` |

---

# 2. Что уже можно KEEP

Не нужно строить заново:

- `sitemap.xml`;
- `robots.txt`;
- canonical URL runtime;
- existing OG / Twitter primitives;
- standalone Event routes;
- Board `publicRoute` primitive;
- Telegram worker / outbox;
- Telegram delivery states;
- GA4 / Clarity foundation;
- entity open / CTA tracking;
- placement / source-page context;
- contextual recommendation tracking;
- public Dementor routes.

Это transport / destination foundation.

`12` добавляет semantic routing поверх него.

---

# 3. SEO / persistent discovery

## KEEP

Production уже имеет sitemap, robots и canonical runtime.

Канонически:

> **SITEMAP MAKES THINGS DISCOVERABLE. IT DOES NOT DECIDE WHAT SHOULD RANK.**

## GAP — semantic Search routing

Не подтверждён единый contract:

```text
QUERY / SITUATION / INTENT
→ PRECISE ENTRY OBJECT
→ PROMISED EXPERIENCE
```

Это важно отличать от editorial outbound.

Search route **не требует активного Programming Moment**.

Старая публичная Thing может оставаться правильным destination после выхода из текущей программы.

### Phase 0 requirement

Для нескольких public objects вручную подтвердить:

- какой query / intent они реально закрывают;
- является ли object лучшим destination;
- совпадают ли title / description / preview с реальным experience;
- не ведёт ли Search unnecessarily на Home.

---

# 4. Social preview / canonical consistency

## KEEP

Home и отдельные Event pages уже имеют OG / Twitter metadata.

## PARTIAL GAP — Thing-specific coverage

Нужен общий contract:

```text
ENTRY OBJECT
→ identity / premise
→ relevant preview
→ canonical URL
→ same experience after click
```

Не требуется новая Product entity.

## PARTIAL GAP — static host consistency

`events/fuengirola/` содержит static OG URL/image на `degradation-club.vercel.app`, хотя runtime canonical уже знает production origin.

Так как social crawler может не исполнять runtime JS одинаково, static metadata желательно привести к canonical host.

---

# 5. Share

Share относится к **person-mediated distribution**.

Поэтому новый Programming Moment не нужен.

Канонически:

> **SHARE MAY EXTEND THE LIFE OF A THING WITHOUT CREATING A NEW PROGRAMMING MOMENT.**

Existing URL + OG transport уже даёт полезный фундамент.

Минимальный product contract:

- exact Thing / Entry Object URL;
- correct preview;
- canonical host;
- destination matching the shared context.

Dedicated native Share UI — optional implementation, а не gap authority-модели.

Если он добавляется, должен делиться текущим Entry Object, не generic Home.

---

# 6. Telegram / editorial outbound

## KEEP — transport

Staging worker уже вызывает `telegram-outbox-worker`.

Production Board знает delivery states, включая:

- sent;
- pending;
- processing;
- suppressed;
- cancelled;
- failed;
- held.

Transport переписывать не нужно.

## REFRAME — trigger semantics

Staging worker привязан к `artifactForm` submit слишком близко к raw publication event.

Целевая цепочка:

```text
PROGRAMMING MOMENT
→ DISTRIBUTION DECISION
→ DELIVERY ELIGIBILITY
→ TELEGRAM OUTBOX / DELIVERY
```

Не:

```text
ARTIFACT SUBMIT
→ TELEGRAM
```

## GAP — semantic outbound gate

До send нужно уметь выразить:

- Programming Moment;
- target intent;
- message / promise;
- exact Entry Object;
- promised experience;
- delivery eligibility;
- next step.

Это semantic adapter/policy problem, не новый Telegram subsystem.

---

# 7. Delivery eligibility / permission

Authority `12` добавляет слой, которого ранний mapping не выделял отдельно.

Даже хороший outbound reason не означает право доставлять его любым способом.

## PARTIAL GAP

Telegram уже знает suppression / held-like delivery states, что является полезным primitive.

Но общий semantic contract для future individualized / owned channels не подтверждён:

```text
DISTRIBUTION DECISION
→ CAN / SHOULD THIS CHANNEL DELIVER?
```

Potential dimensions там, где применимо:

- explicit follow / subscription / consent;
- suppression / unsubscribe;
- audience eligibility;
- duplicate / frequency pressure;
- geographic / Event eligibility.

Не нужно строить universal permission engine до появления конкретных channels.

---

# 8. Event / physical continuation

## KEEP

`events/fuengirola/` подтверждает, что Event уже может быть precise public Entry Object.

## GAP — contextual handoff policy

Не подтверждён общий semantic layer:

```text
PHYSICAL / EVENT CONTEXT
→ EXACT DIGITAL CONTINUATION
```

Например:

- Event → related Thing;
- Event → Participation;
- Event → History;
- Event → exact instruction.

QR — transport и добавляется только под реальный use case.

Отдельная QR Product entity не нужна.

---

# 9. Home / Board

## Home — KEEP + REFRAME

Home полезен для:

- direct traffic;
- program-cover intent;
- «что у них сейчас?».

Но precise external invitation не должен вести на `/` по умолчанию.

## Board — KEEP + REFRAME

Board projections уже умеют открывать concrete `publicRoute`.

Board должен оставаться destination только при intent:

> **«Что сейчас происходит?»**

Board — destination surface, не distribution channel.

---

# 10. Dementor / author path

## KEEP

Public Dementor routes уже существуют.

## PARTIAL GAP

Нужен общий authored-work continuation contract:

```text
AUTHORED THING
→ DEMENTOR BODY OF WORK
→ ANOTHER AUTHORED THING
```

При direct author intent profile/body of work может быть первым Entry Object.

При незнакомом авторе сильнее:

**WORK BEFORE BIOGRAPHY.**

Новая Person / Dementor ontology не требуется.

---

# 11. Partner / social / manual outbound

Ручная distribution остаётся валидным transport.

Не нужен software channel для каждой внешней среды.

Для **controlled editorial outbound** нужен единый semantic contract:

```text
Programming Moment
+ Source / Channel
+ Target Intent
+ Message
+ Entry Object
+ Experience
+ Eligibility where relevant
+ Next Step
```

Для **earned mention / personal Share** Programming Moment не является обязательным полем.

---

# 12. Analytics / attribution

## KEEP

Current analytics уже знает operational entity opens / CTA clicks и такие dimensions, как:

- `entity_type`;
- `entity_id`;
- `placement`;
- `source_page`.

`recommendation_click` уже является primitive для continuation measurement.

## GAP — semantic Distribution dimensions

Current contract не выражает системно:

- `distribution_trigger`;
- `programming_moment?`;
- `source`;
- `channel`;
- `target_intent`;
- `entry_object`;
- `message_variant?`;
- `promised_experience`.

`programming_moment` должен быть optional.

UTM / referrer не заменяют intent.

## PARTIAL GAP — qualified experience

Route open не равен consumption.

Для ключевых Forms нужен minimum success signal, например game start вместо page load.

Точные event names / thresholds принадлежат `14 · Metrics & Signals`.

`12` только определяет semantic question.

## PARTIAL GAP — Thing → Thing

`recommendation_click` — хороший primitive, но universal Product Thing semantics ещё нет.

Не нужно из-за этого создавать новую Thing table.

---

# 13. Revised KEEP / REFRAME / GAP

## KEEP

- crawler discovery infrastructure;
- canonical runtime;
- OG / Twitter primitives;
- standalone Event routes;
- Board concrete routes;
- Telegram transport / delivery states;
- basic analytics;
- source-page / placement context;
- public Dementor routes.

## REFRAME

- Artifact submit cannot itself be Telegram reason;
- Home is not default destination for precise promise;
- Board is a destination surface, not generic channel;
- Share must preserve exact object;
- channel cadence cannot create Programming Moments;
- Programming Moment requirement applies to editorial outbound, not all discovery.

## PARTIAL GAP

- Thing-specific previews;
- static canonical-host consistency;
- authored Thing → body of work;
- delivery eligibility / permission beyond existing Telegram primitives;
- qualified consumption;
- Product-level Thing → Thing analytics.

## GAP

- unified trigger-aware routing policy;
- `SOURCE / CHANNEL × INTENT × ENTRY OBJECT` decision for controlled distribution;
- Programming Moment outbound gate;
- semantic attribution dimensions;
- destination QA;
- physical Event → exact digital continuation.

## NOT A REQUIRED GAP

- native Share API;
- universal QR system;
- universal distribution database;
- perfect multi-touch attribution;
- paid media infrastructure.

---

# 14. Engineering implication

Самая точная engineering формула:

```text
EXISTING TRANSPORT
+ EXISTING PUBLIC OBJECTS
+ BASIC ATTRIBUTION

MISSING:

TRIGGER CLASSIFICATION
→ INTENT
→ PRECISE ENTRY OBJECT
→ PROMISE / PREVIEW FIT
→ ELIGIBILITY WHERE NEEDED
→ QUALIFIED EXPERIENCE
```

Для editorial outbound дополнительно:

```text
PROGRAMMING MOMENT
→ DISTRIBUTION DECISION
→ DELIVERY
```

Новой разработки действительно меньше, чем новой semantic policy.

---

# 15. Recommended production phases

## Phase 0 — NO SCHEMA MIGRATION

Проверить 4–5 случаев разных trigger classes:

1. Telegram/social editorial outbound с Programming Moment;
2. Search → existing Thing;
3. personal Share → exact Thing;
4. Event / physical → exact continuation;
5. direct return → Home / known object.

Для controlled outbound вручную / config-level выразить:

```text
trigger_type
programming_moment?
source
channel
intent
message
entry_object
promised_experience
next_step
eligibility
attribution
```

Проверить destination / preview / fit / permission / consumption / continuation.

## Phase 1 — Share / preview consistency

Закрыть exact-object preview и canonical-host consistency.

## Phase 2 — Telegram semantic gate

Сохранить worker/outbox, изменить eligibility/source of send так, чтобы outbound следовал Programming Moment + DistributionDecision.

## Phase 3 — semantic attribution / eligibility

Добавить только необходимые dimensions и suppression rules.

Не добавлять PII и universal marketing platform.

## Phase 4 — qualified consumption / continuation

Совместно с `14` определить minimum success signals для ключевых Forms.

## Phase 5 — Event physical continuation

Добавить QR / short link только под доказанный Event use case.

---

# 16. Production acceptance gate

Перед channel-specific feature спросить:

1. **Какой trigger class?**
2. **Если editorial outbound — какой Programming Moment?**
3. **Есть ли уже transport?**
4. **Какой intent?**
5. **Какой exact Entry Object?**
6. **Совпадает ли preview / message с destination?**
7. **Нужна ли delivery eligibility / permission?**
8. **Что считается qualified experience?**
9. **Какой continuation уместен?**
10. **Принадлежит ли требуемая метрика `12` или уже `14`?**

Если Search / personal Share / direct return не имеют Programming Moment — это нормально.

---

# Production conclusion

Текущая система — **частично готовый фундамент**, а не отсутствующая Distribution system.

Основной gap:

> **Dementor умеет технически доставлять и открывать objects, но пока не имеет единой trigger-aware policy, которая сохраняет intent от источника до experience.**

Первый правильный move:

> **добавить semantic routing policy поверх существующих transport-механизмов, а Programming Moment использовать как обязательный gate только для controlled editorial outbound.**