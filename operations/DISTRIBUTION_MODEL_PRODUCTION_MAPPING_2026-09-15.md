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

- **KEEP** — существующий механизм полезен в новой модели без смыслового разворота;
- **REFRAME** — transport / runtime нужно сохранить, но изменить семантическую причину или роль;
- **PARTIAL GAP** — фундамент есть, но покрытие / consistency / semantics неполны;
- **GAP** — требуемый semantic/runtime слой в проверенном production/staging не подтверждён.

Главный вывод:

> **Текущий Dementor уже имеет значительную часть transport-инфраструктуры. Главный дефицит — не новые каналы, а единый routing decision `CHANNEL × INTENT × ENTRY OBJECT`, Programming Moment–driven delivery и post-click measurement.**

---

# 1. Executive map

| Surface / capability | Status | Production reading |
|---|---|---|
| Sitemap | **KEEP** | `sitemap.xml` существует как discoverability transport |
| Robots | **KEEP** | `robots.txt` существует как crawler control |
| Canonical runtime | **KEEP** | `seo-runtime.js` нормализует canonical URL и `og:url` через `canonicalOrigin` |
| Search intent → precise Entry Object | **GAP** | sitemap/canonical не принимают semantic routing decision |
| Page OG/Twitter metadata | **KEEP** | Home и Event имеют social metadata |
| Thing-specific preview coverage | **PARTIAL GAP** | entity-specific preview есть выборочно; formal social raster pipeline всё ещё `ASSETS PENDING` |
| Canonical host consistency in static metadata | **PARTIAL GAP** | Fuengirola static OG URLs всё ещё используют `degradation-club.vercel.app`, хотя runtime canonical может исправлять `og:url` |
| Dedicated native Share action | **GAP** | в проверенном коде не подтверждён `navigator.share`; preview transport существует отдельно |
| Telegram delivery plumbing | **KEEP** | worker/outbox invocation и delivery states уже существуют |
| Telegram semantic trigger | **REFRAME** | staging worker запускается после Artifact submit; причина доставки слишком близка к публикационному событию |
| Programming Moment → outbound decision | **GAP** | отдельный semantic gate перед Telegram/social delivery не подтверждён |
| Event detail surfaces | **KEEP** | конкретный Event имеет самостоятельную public destination и event-specific metadata |
| Event/QR continuation routing | **GAP** | dedicated QR mechanics в проверенном repo не подтверждены; semantic physical→digital continuation layer отсутствует |
| Board entity projection routes | **KEEP** | Board projection умеет вести на конкретный `publicRoute` |
| Board as external acquisition router | **REFRAME** | Board должен оставаться destination только для intent «что сейчас происходит?» |
| Home public destination | **KEEP** | Home существует как direct/program-cover surface |
| Home as default acquisition destination | **REFRAME** | текущая структура допускает generic brand/section entry, но `12` запрещает использовать Home как default для precise promises |
| Route/entity analytics | **KEEP** | analytics знает project/course/event/merch opens и CTA clicks |
| Placement/context analytics | **KEEP** | `source_page`, placement, contextual recommendation и entity context уже пишутся |
| Programming Moment / target intent / entry object attribution | **GAP** | semantic Distribution dimensions не представлены в текущих allowed events/payloads |
| Qualified experience consumption | **PARTIAL GAP** | route opens/CTA clicks есть, но consumption конкретного promised experience системно не подтверждён |
| Thing → Thing / continuation measurement | **PARTIAL GAP** | `recommendation_click` есть, но универсальный Thing→Thing semantics отсутствует |
| Return measurement by distribution intent | **GAP** | current analytics не связывает return с Programming Moment / intent / entry object |

---

# 2. SEO / sitemap / canonical

## KEEP — `sitemap.xml`

Production имеет `sitemap.xml`.

Сохранить как discoverability infrastructure.

Каноническая граница:

> **SITEMAP MAKES THINGS DISCOVERABLE. IT DOES NOT DECIDE WHAT SHOULD RANK.**

Sitemap не должен становиться:

- программным приоритетом;
- ranking strategy;
- источником target intent;
- списком того, что редакция обязана распространять.

## KEEP — `robots.txt`

Production имеет `robots.txt`.

Это crawler control, а не editorial distribution decision.

## KEEP — `seo-runtime.js`

Production `seo-runtime.js`:

- читает `window.DEMENTOR_SITE_CONFIG.canonicalOrigin`;
- формирует canonical из текущего pathname;
- создаёт / обновляет `<link rel="canonical">`;
- создаёт / обновляет `meta[property="og:url"]`.

Это правильный transport-level механизм и должен сохраниться.

## GAP — Search intent routing

В проверенном runtime не подтверждён слой, который выражает:

```text
QUERY / SITUATION
→ TARGET INTENT
→ PRECISE ENTRY OBJECT
```

Наличие sitemap и canonical URL не закрывает этот вопрос.

### Implementation implication

Phase 0 не требует SEO schema migration.

Нужна policy / adapter, который для выбранных public objects подтверждает:

- какой search intent они реально закрывают;
- является ли object лучшим destination;
- совпадает ли title/description с обещанным experience.

---

# 3. Social metadata / preview

## KEEP — базовая OG/Twitter инфраструктура

Production Home уже содержит:

- `og:title`;
- `og:description`;
- `og:type`;
- `og:locale`;
- `og:url`;
- `og:image`;
- `og:image:alt`;
- Twitter card/title/description/image.

Event `events/fuengirola/` также имеет entity-specific OG/Twitter metadata.

Это подтверждает, что preview infrastructure не нужно строить с нуля.

## PARTIAL GAP — Thing-specific preview coverage

Staging `assets/social/README.md` фиксирует raster pipeline и required 1200×630 social assets, но статус файла:

> **RASTER PIPELINE / ASSETS PENDING**

То есть design/technical contract существует, но coverage не завершён.

Кроме того, текущая metadata система подтверждена для Home и отдельных entity pages, но не как универсальный Thing-aware preview layer для всех будущих Things.

Целевой contract:

```text
ENTRY OBJECT
→ identity / premise
→ relevant preview image
→ canonical URL
→ same promised experience after click
```

## PARTIAL GAP — canonical host consistency

`events/fuengirola/index.html` содержит static:

- `og:url = https://degradation-club.vercel.app/events/fuengirola/`
- `og:image = https://degradation-club.vercel.app/...`

при том, что production runtime уже знает canonical `dementor.club` через `seo-runtime.js`.

`og:url` может быть нормализован runtime-скриптом в браузере, но social crawlers не всегда исполняют JS одинаково; image host также остаётся static.

Поэтому static metadata host consistency остаётся **PARTIAL GAP**.

---

# 4. Share

## PARTIAL GAP — preview transport exists

OG/Twitter metadata уже позволяет обычной ссылке получать preview на supporting platforms.

Это нужно сохранить.

## GAP — dedicated native Share action not confirmed

Поиск по проверенному repo не подтвердил использование `navigator.share`.

Это не означает, что человек не может скопировать / переслать URL.

Это означает только, что отдельный native Share control / contract не подтверждён в inspected runtime.

Не следует строить большой Share subsystem ради `12`.

Минимально достаточно:

- exact Thing URL;
- correct preview;
- source context;
- destination matching the promise.

Канонически:

> **SHARE SHOULD PRESERVE THE THING’S CONTEXT AND PREVIEW, NOT TURN INTO A BRAND INVITE.**

### Reframe needed

Если dedicated Share UI будет добавляться, его задача — делиться **текущим Entry Object**, а не отправлять generic Home URL.

---

# 5. Telegram

## KEEP — worker / delivery plumbing

Staging `community/board/telegram-worker-trigger-v3.js` уже вызывает:

`telegram-outbox-worker`

через Supabase Functions.

Production `community/board/board.js` уже умеет отображать delivery states:

- `sent`;
- `pending`;
- `processing`;
- `suppressed`;
- `delivery_unknown`;
- `cancelled`;
- `failed`;
- `held`.

Это сильный готовый transport foundation.

Не нужно переписывать Telegram transport ради `12`.

## REFRAME — current trigger semantics

Staging worker trigger:

- стартует после load;
- слушает submit `artifactForm`;
- после submit планирует worker invocation.

Это связывает delivery pipeline с Artifact composer / publication flow слишком напрямую.

Новая семантическая цепочка:

```text
PROGRAMMING MOMENT
→ DISTRIBUTION DECISION
→ TELEGRAM OUTBOX / DELIVERY
```

Не:

```text
ARTIFACT SUBMIT
→ TELEGRAM WORKER
```

Важно: worker invocation может остаться тем же.

Меняется **причина появления сообщения в outbox / eligibility for delivery**, а не обязательно сама доставка.

## GAP — Programming Moment gate

В проверенном runtime не подтверждён единый semantic gate, который до Telegram send отвечает:

- почему сейчас;
- target intent;
- chosen message;
- exact Entry Object;
- promised experience;
- next step.

Это один из главных implementation gaps `12`.

---

# 6. Event surfaces / physical continuation

## KEEP — Event as precise Entry Object

`events/fuengirola/` — самостоятельная public destination с:

- Event title;
- description;
- event-specific OG metadata;
- Dementor relation;
- full experience context.

То есть Event уже может быть точным destination вместо Home / Events index.

## GAP — QR mechanics not confirmed

Поиск в repo не подтвердил отдельный QR/qrcode implementation.

Поэтому `12` не должен притворяться, что QR transport уже существует.

Если физический Event требует QR, v1 может использовать простой canonical Event/Thing URL и generated QR вне Product ontology.

## GAP — physical context continuation policy

Не подтверждён общий слой:

```text
PHYSICAL CONTEXT
→ EXACT DIGITAL CONTINUATION
```

например:

- Event → related Thing;
- Event → History;
- Event → Participation action;
- Event → next relevant object.

Это semantic routing gap, не причина строить новый Event subsystem.

---

# 7. Board

## KEEP — concrete public routes from projections

Production `community/board/board-integrations-v1.js` строит platform projections и использует `publicRoute` для `ОТКРЫТЬ →`.

Это правильный primitive:

Board может показать живой объект и вести прямо к нему.

## REFRAME — Board acquisition role

Board должен остаться surface для intent:

> **«Что сейчас происходит?»**

Не нужно удалять Board routes или projection infrastructure.

Нужно перестать использовать Board как возможный default external destination только потому, что там много объектов.

Канонически:

> **BOARD IS NOT THE DEFAULT ACQUISITION SURFACE.**

`12` добавляет semantic guardrail, а не новую Board ontology.

---

# 8. Home

## KEEP — Home as direct/program-cover destination

Home существует как самостоятельная public surface и естественно подходит под direct intent:

> **«Что у них сейчас?»**

Это нужно сохранить.

## REFRAME — generic acquisition use

Текущий Home всё ещё содержит сильный brand-level DaaS hero и section/ecosystem navigation.

Для Distribution это не проблема само по себе.

Проблемой будет использовать Home как default destination после promise конкретной Thing / Event / Release.

Канонически:

> **HOME IS NOT THE DEFAULT LANDING PAGE.**

Новая разработка здесь может быть нулевой, если routing policy просто перестанет отправлять precise invitations на `/`.

---

# 9. Analytics / attribution

Production `production-analytics-v1.js` уже является полезным semantic-ish transport foundation.

## KEEP — current route/entity analytics

Allowed events уже включают:

- `project_open`;
- `course_open`;
- `course_cta_click`;
- `event_open`;
- `event_cta_click`;
- `merch_open`;
- `merch_cta_click`;
- `recommendation_click`;
- `external_community_click`;
- join/workspace signals.

Runtime распознаёт project/course/event/merch routes и сохраняет:

- `entity_type`;
- `entity_id`;
- `placement`;
- `source_page`.

Это нужно сохранить.

## KEEP — contextual recommendation signal

`linkPlacement()` отдельно распознаёт contextual recommendations, а internal navigation к supported entities может дать `recommendation_click`.

Это уже полезный primitive для future Thing → Thing measurement.

## GAP — semantic Distribution attribution

Текущая analytics schema не выражает системно:

- `programming_moment`;
- `channel` как Distribution decision;
- `target_intent`;
- `entry_object` как promise destination;
- `message_variant`;
- `promised_experience`.

`source_page` / placement не заменяют intent.

UTM / referrer также не заменяют intent.

Целевой payload может быть добавлен инкрементально и не требует отдельной Distribution database.

## PARTIAL GAP — qualified consumption

Current analytics хорошо видит route opens и отдельные CTA clicks.

Но:

> **route open ≠ promised experience consumed**

Например открытие страницы игры ещё не обязательно означает `game started`.

Для каждого Form / experience потребуется минимальный success event там, где это имеет смысл.

Не нужен универсальный fake `consumed=true`.

## PARTIAL GAP — Thing → Thing

`recommendation_click` уже даёт primitive для contextual continuation.

Но текущая route model ограничена operational entity types и не выражает universal Product Thing semantics.

Поэтому:

- infrastructure exists;
- Product-level Thing → Thing measurement ещё неполно.

## GAP — Return by Distribution context

Current analytics не связывает последующий direct/re-entry return с исходным:

- Programming Moment;
- target intent;
- Entry Object.

Полная Return attribution может быть сложнее и относится также к `08` / Metrics.

Для `12` достаточно сначала сохранять semantic dimensions на entry и не требовать perfect multi-touch attribution.

---

# 10. Dementor / author path

Существующие public Dementor routes присутствуют в runtime (например Event связывает Габиля с `/community/gabil/`).

## KEEP — public author destination

Profile route уже может быть destination при прямом author intent.

## PARTIAL GAP — authored Thing → body of work continuation

Проверенный Event показывает relation к Dementor, но единый body-of-work routing contract для всех Things не подтверждён.

Целевой путь:

```text
AUTHORED THING
→ DEMENTOR BODY OF WORK
→ ANOTHER AUTHORED THING
```

Не требуется новый Person/Dementor model — это presentation/distribution continuation.

---

# 11. Social / external community / partner

## KEEP — manual outbound remains valid

`12` не требует отдельного software channel для каждого внешнего места.

Ручная отправка в social / partner/community канал остаётся валидным transport.

## GAP — unified routing decision

Независимо от того, отправляется сообщение вручную или automation, в runtime/operations пока нет подтверждённого единого contract:

```text
Programming Moment
+ Channel
+ Target Intent
+ Message
+ Entry Object
+ Experience
+ Next Step
```

Это основной semantic gap.

Не следует решать его созданием «таблицы всех каналов» до Phase 0.

---

# 12. KEEP / REFRAME / GAP by layer

## KEEP

Сохранить без архитектурного rewrite:

- `sitemap.xml`;
- `robots.txt`;
- canonical URL runtime;
- existing OG/Twitter tags;
- standalone Event pages;
- Board `publicRoute` projection primitive;
- Telegram worker/outbox delivery plumbing;
- Telegram delivery states;
- GA4 / Clarity consented analytics foundation;
- entity open / CTA tracking;
- placement / source-page context;
- contextual recommendation tracking;
- public Dementor routes.

## REFRAME

Сохранить механизм, изменить его смысловую роль:

- Artifact submit/publication must not itself be Telegram reason;
- Home must not be default destination for precise invitations;
- Board must not be default acquisition surface;
- share/preview should preserve exact Entry Object rather than brand invitation;
- channel cadence must consume Programming Moments, not create them.

## PARTIAL GAP

Фундамент есть, но нужен completion:

- Thing-specific social previews;
- static canonical host consistency;
- authored Thing → Dementor body-of-work continuation;
- qualified experience consumption events;
- Thing → Thing analytics beyond current supported entity routes.

## GAP

Нужен новый semantic layer / small implementation:

- `CHANNEL × INTENT × ENTRY OBJECT` routing decision;
- Programming Moment–driven outbound eligibility;
- target intent / Entry Object / Programming Moment analytics dimensions;
- destination QA before send;
- physical Event → exact digital continuation policy;
- dedicated QR mechanic, only if actually needed;
- direct Return attribution to Distribution context, if later justified.

---

# 13. What this means for engineering

Production review подтверждает исходную гипотезу:

> **новой разработки значительно меньше, чем новой семантики.**

Главное НЕ нужно строить заново:

- crawler discovery;
- canonical transport;
- social metadata primitives;
- Event detail pages;
- Telegram delivery worker/outbox;
- basic analytics;
- Board entity routes.

Главное нужно добавить / изменить:

1. **semantic routing decision** перед distribution;
2. **Programming Moment gate** для outbound channels;
3. точный **Entry Object** вместо generic Home/Board routing;
4. destination-specific preview consistency;
5. semantic attribution;
6. минимальные qualified-consumption / continuation signals.

Это лучше делать adapter/policy-first, а не schema-first.

---

# 14. Recommended production phases

## Phase 0 — NO SCHEMA MIGRATION

Взять 3–5 реальных Programming Moments разных типов и вручную / config-level выразить:

```text
programming_moment
channel
target_intent
message
entry_object
promised_experience
next_step
```

Проверить:

- destination;
- preview;
- channel fit;
- analytics payload;
- continuation.

## Phase 1 — Telegram semantic gate

Не переписывая worker/outbox, изменить eligibility/source so that send follows DistributionDecision / Programming Moment rather than raw Artifact submit/publication semantics.

## Phase 2 — Share / preview consistency

Закрыть Thing-specific OG coverage и canonical host consistency.

Dedicated native Share UI добавлять только если он реально улучшает product flow.

## Phase 3 — semantic analytics

Расширить allowed payload/event contract нужными Distribution dimensions.

Не добавлять PII.

## Phase 4 — qualified consumption / Thing → Thing

Для ключевых Forms определить минимальные success signals и continuation events.

## Phase 5 — Event physical continuation

Добавить QR/short route только для реального Event use case, не как обязательную платформенную сущность.

---

# 15. Production acceptance gate

Перед реализацией channel-specific feature задавать:

1. **Есть ли уже transport?** Если да — KEEP.
2. **Проблема transport или semantic trigger?**
3. **Какой Programming Moment запускает действие?**
4. **Какой target intent?**
5. **Какой exact Entry Object?**
6. **Совпадает ли preview с promise?**
7. **Какой qualified-consumption signal?**
8. **Что является естественным next Thing / continuation?**

Если ответы требуют новой таблицы раньше, чем доказан routing policy, реализация преждевременна.

---

# Production conclusion

Текущая система — **частично готовый фундамент**, а не отсутствующая Distribution system.

Самая точная формула production gap:

```text
EXISTING TRANSPORT
+ EXISTING PUBLIC OBJECTS
+ EXISTING BASIC ATTRIBUTION

MISSING:

PROGRAMMING MOMENT
→ CHANNEL × INTENT × ENTRY OBJECT
→ EXACT PROMISE / DESTINATION
→ QUALIFIED CONSUMPTION
→ CONTINUATION / RETURN SIGNAL
```

Поэтому `12` не оправдывает новый большой infrastructure project.

Первый правильный implementation move:

> **добавить semantic routing layer перед уже существующими transport-механизмами и измерить качество встречи после click.**
