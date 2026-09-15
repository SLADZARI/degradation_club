# DEMENTOR CLUB — DISTRIBUTION MODEL v1

Status: **WORKING CANON / distribution semantics authority**  
Updated: **2026-09-15**

## Authority scope

Этот документ определяет, **как Dementor Club организует точную встречу человека с конкретной Thing / Release / Event / History / Project / authored work до и вокруг первого product experience**.

Он не является списком каналов и не является marketing calendar.

Каноническая граница:

> **AUDIENCE & ENTRY MAP DESCRIBES THE VISIT.**  
> **DISTRIBUTION MODEL DESIGNS THE INVITATION / DISCOVERY PATH.**

`12 · Distribution Model` отвечает:

> **откуда человек приходит → с каким предполагаемым intent → через какой distribution path → какое обещание видит → в какой Entry Object попадает → какой experience получает → что естественно дальше.**

Документ опирается на:

- `03 · Audience & Entry Map` — `SOURCE × INTENT × ENTRY OBJECT`;
- `07 · Content & Programming Model` — почему Thing важна программе сейчас;
- `08 · Return Loops` — почему человек потом возвращается;
- `11 · Marketing Positioning & Messaging` — что обещаем и чем доказываем;
- `05 · Product Model` — что является Thing / Release / History / Project / Event;
- `06 · Board Product Model` — как живые Things показываются внутри Board.

Он не переопределяет ни один из этих слоёв.

---

# 0. Главная модель

Distribution шире, чем outbound-публикация.

Человек может встретить Dementor через:

- редакционную отправку;
- Search;
- чужой Share;
- QR / physical handoff;
- ссылку от Dementor / партнёра;
- прямой возврат;
- persistent discoverability уже существующей Thing.

Поэтому общая цепочка:

**DISTRIBUTION TRIGGER → INTENT HYPOTHESIS → SOURCE / CHANNEL FIT → PROMISE / PREVIEW → ENTRY OBJECT → EXPERIENCE → CONTINUATION**

Со стороны человека она совместима с `03`:

**SOURCE → INTENT → ENTRY OBJECT → EXPERIENCE → NEXT THING / RETURN**

Для **editorial outbound** действует специальная цепочка:

**PROGRAMMING MOMENT → DISTRIBUTION DECISION → CHANNEL / TRANSPORT → ENTRY OBJECT → EXPERIENCE**

Это важная граница:

> **PROGRAMMING MOMENT GATES EDITORIAL OUTBOUND. IT DOES NOT GATE ALL DISCOVERY.**

Старая Thing может быть найдена через Search или переслана человеком без нового Programming Moment.

---

# 1. Пять типов Distribution Trigger

Distribution action должен понимать, **почему встреча вообще возникла**.

## A. EDITORIAL OUTBOUND

Клуб сознательно выносит что-то наружу сейчас.

Примеры:

- Telegram post;
- social post с invitation;
- partner/community post;
- authored outbound от Dementor, если он действует как часть программы.

Здесь обязателен реальный **Programming Moment**.

Не:

**PUBLISHED → SEND**

А:

**PROGRAMMING MOMENT → DISTRIBUTION DECISION → DELIVERY**

---

## B. PERSISTENT DISCOVERY

Человек сам находит уже доступный объект.

Примеры:

- Search;
- sitemap / indexed route;
- сохранённая внешняя ссылка;
- старый материал, найденный спустя месяцы.

Здесь новый Programming Moment **не требуется**.

Нужно, чтобы:

- объект всё ещё существовал;
- destination был корректным;
- preview / metadata не лгали;
- experience соответствовал intent.

---

## C. PERSON-MEDIATED SHARE

Один человек пересылает Thing другому.

Причина distribution здесь — **акт конкретного человека**, а не редакционная актуальность программы.

Канонически:

> **SHARE MAY EXTEND THE LIFE OF A THING WITHOUT CREATING A NEW PROGRAMMING MOMENT.**

---

## D. CONTEXTUAL HANDOFF

Человек уже находится в конкретном физическом / внешнем контексте и получает точное продолжение.

Примеры:

- Event → QR → Event / Thing / Participation;
- physical object → digital continuation;
- partner experience → конкретная Thing;
- выступление Dementor → authored work.

Главное:

> **PHYSICAL / EXTERNAL CONTEXT SHOULD SURVIVE THE CLICK.**

---

## E. SELF-INITIATED RE-ENTRY

Человек сам возвращается без нового внешнего сообщения.

Примеры:

- direct visit;
- bookmark;
- сохранённая ссылка;
- повторное открытие знакомой Thing.

Это связано с `08 Return Loops`, но routing всё равно должен дать ему точный destination.

---

# 2. Source ≠ Channel ≠ Transport ≠ Entry Object

Чтобы не смешивать уровни, `12` использует четыре разных понятия.

## SOURCE

Откуда фактически пришёл человек.

Это authority-понятие из `03`.

Примеры:

- search;
- social;
- Telegram;
- direct share;
- Event;
- partner/community;
- individual Dementor;
- direct.

## CHANNEL / DISTRIBUTION PATH

Среда, через которую invitation / discovery происходит.

Например Telegram, Instagram, Google Search, QR, personal link.

## TRANSPORT

Технический механизм доставки.

Например:

- canonical URL;
- sitemap;
- OG metadata;
- Telegram outbox / worker;
- UTM;
- QR code;
- copied link.

Transport не определяет смысл distribution.

## ENTRY OBJECT

Самый точный продуктовый объект, который выполняет обещание / intent.

Например:

- конкретная Thing;
- Release;
- Event;
- History context;
- Project;
- Dementor body of work;
- Home;
- Board, когда intent именно «что сейчас происходит?».

Канонически:

**TRANSPORT ≠ MESSAGE ≠ ENTRY OBJECT.**

И:

**BOARD / HOME / PROFILE ARE DESTINATION SURFACES, NOT CHANNELS.**

---

# 3. Главный routing principle

`03` уже фиксирует:

**SOURCE × INTENT × ENTRY OBJECT**

`12` добавляет operational question:

**WHICH DISTRIBUTION PATH BEST PRESERVES THAT FIT?**

Рабочая routing-формула:

**TRIGGER × SOURCE / CHANNEL × INTENT × ENTRY OBJECT**

Ни один элемент не определяет остальные автоматически.

Telegram не является одной аудиторией.

Search не является одним intent.

Social не означает автоматически Home.

Dementor profile не обязан быть первым destination при author intent.

---

# 4. DistributionDecision

Для editorial / controlled distribution v1 достаточно semantic decision перед transport layer.

Рабочая модель:

```text
DistributionDecision
  trigger_type
  programming_moment?      # required for editorial outbound
  source
  channel
  target_intent
  message_ref / promise
  entry_object
  promised_experience
  next_step
  delivery_eligibility?
  attribution_key?
```

Это **не обязательная DB table** и не новая Product ontology.

Это может быть:

- редакционная запись;
- in-memory adapter;
- config;
- analytics payload;
- automation parameter;
- вычисляемый view model.

Для Search / personal Share / direct return полноценный `DistributionDecision` может вообще не сохраняться как объект.

Важно сохранить смысловые dimensions, а не навязать всем путям одну implementation structure.

---

# 5. Destination contract

Главное правило:

> **DESTINATION MUST MATCH THE PROMISE.**

Если invitation обещает:

- игру — человек попадает к игре;
- Event — к Event;
- конкретный Release — к этому Release / experience;
- «что случилось дальше» — к relevant History context;
- автора — к authored Thing или body of work;
- участие — к реальной Participation Opportunity;
- текущую программу — к Home;
- «что сейчас происходит» — к Board.

Плохая цепочка:

**POST → HOME → SECTION → LIST → DETAIL → EXPERIENCE**

если пост уже обещал конкретную игру.

Предпочтительно:

**POST → GAME → NEXT THING / PROGRAM**

Канонически:

> **DISTRIBUTE THE THING, NOT THE ORG CHART.**

---

# 6. Home и Board

## Home

Home — обложка текущей программы.

Естественный intent:

> **«Что у них сейчас?»**

Поэтому Home подходит для:

- direct / brand traffic;
- общего curiosity без более точного объекта;
- self-initiated return к программе.

Но:

> **HOME IS NOT THE DEFAULT LANDING PAGE.**

Если invitation уже обещал конкретную Thing, Home не должен быть промежуточным тамбуром.

## Board

Board отвечает:

> **«Что сейчас происходит?»**

Он может быть Entry Object только при таком intent.

Канонически:

> **BOARD IS NOT THE DEFAULT ACQUISITION SURFACE.**

И:

**BOARD DENSITY IS NOT A REPLACEMENT FOR ENTRY PRECISION.**

---

# 7. Distribution path matrix v1

| Source / path | Typical intent | Preferred Entry Object |
|---|---|---|
| **Personal Share** | «посмотри это» / узнавание | exact Thing / Release |
| **Social** | curiosity / узнавание / самостоятельный social experience | Thing или experience прямо в social |
| **Telegram editorial outbound** | следующая Thing / meaningful continuation | Thing / Release / History / Event |
| **Search** | конкретная Situation / Thing / автор / вопрос | самый точный relevant object |
| **Individual Dementor** | автор / подход / конкретная работа | authored Thing → body of work |
| **Event / QR / physical** | продолжить уже начатый experience | Event / Thing / action / History |
| **Partner / external community** | контекстный интерес | Thing / Event / Project |
| **Direct / bookmark** | «что сейчас?» или вернуться к знакомому | Home или exact known object |

Это default fit, не жёсткая taxonomy.

Home и Board здесь не каналы — это возможные destination surfaces.

---

# 8. Programming Moment и editorial outbound

Programming Moment отвечает:

> **Почему эта Thing достойна редакционного внимания именно сейчас?**

Для controlled editorial outbound это обязательный gate.

Канонически:

**PUBLISHED ≠ DISTRIBUTE**

**RELEASED ≠ SEND EVERYWHERE**

**NEW ≠ IMPORTANT NOW**

**NOT EVERY RELEASE NEEDS EVERY CHANNEL.**

Сильными reasons могут быть:

- New Release;
- meaningful Continuation;
- History event;
- real Event window;
- Open Participation;
- editorial resurfacing с новой причиной внимания.

Но это правило **не распространяется** на Search indexing, person-mediated Share или direct return.

---

# 9. Channel fit

Для editorial outbound проверить:

1. **Есть ли Programming Moment?**
2. **Какой target intent мы предполагаем?**
3. **Почему именно этот channel подходит этому intent?**
4. **Можно ли передать promise без искажения?**
5. **Есть ли precise Entry Object?**
6. **Работает ли experience после перехода?**
7. **Есть ли natural next step?**
8. **Разрешена / уместна ли доставка в этом channel context?**

Для persistent discovery / Share первый вопрос заменяется на:

> **Какой trigger привёл человека сюда и сохраняет ли route его intent?**

Distribution coverage не является целью само по себе.

---

# 10. Delivery eligibility / permission

Наличие хорошего Programming Moment не означает право доставлять его человеку любым способом.

Канонически:

> **RELEVANCE DOES NOT OVERRIDE DELIVERY PERMISSION.**

Для owned / individualized channels система должна учитывать там, где это применимо:

- explicit subscription / follow / consent;
- channel-level permissions;
- audience eligibility;
- suppression / unsubscribe state;
- frequency / duplicate pressure;
- literal Event / geographic eligibility, если invitation зависит от места.

Эти правила не создают editorial importance.

Они только отвечают:

> **можно ли и уместно ли доставить уже принятое distribution decision именно сюда.**

Не использовать consent как новый engagement trap.

`08` остаётся authority: **RETURN FOLLOWS VALUE, NOT DEBT.**

---

# 11. Share

Share — person-mediated distribution, а не маленькая brand campaign.

Канонически:

> **SHARE SHOULD PRESERVE THE THING’S CONTEXT AND PREVIEW, NOT TURN INTO A BRAND INVITE.**

Shared destination должен сохранять:

- identity конкретной Thing;
- title / premise;
- relevant preview;
- canonical URL;
- прямой путь к experience;
- минимальный author / source context, если он действительно нужен.

Получатель уже имеет отдельный proof:

> **«Мне это прислал человек».**

Для Share не нужен новый Programming Moment.

---

# 12. Social

Social имеет два валидных режима.

## A. Standalone experience

Мем / видео / fragment / observation может закончиться прямо в social.

Click не обязателен.

Это полноценный success, если experience был самостоятельным.

## B. Invitation

Если social message обещает product continuation:

- «сыграть» → game;
- «прийти» → Event;
- «посмотреть полную вещь» → Thing;
- «что случилось дальше» → History context.

Social не должен автоматически вести на Home ради traffic capture.

---

# 13. Telegram

Telegram — существующий outbound transport и канал meaningful continuation.

Для editorial Telegram canonical chain:

**PROGRAMMING MOMENT → DISTRIBUTION DECISION → DELIVERY ELIGIBILITY → TELEGRAM OUTBOX / DELIVERY**

Не:

**ARTIFACT SUBMIT / PUBLISH → TELEGRAM**

Telegram может быть автоматизирован после semantic decision.

Automation не должна сама создавать причину отправки.

---

# 14. Search / SEO

Search — persistent discovery, а не только outbound distribution.

Канонически:

> **SITEMAP MAKES THINGS DISCOVERABLE. IT DOES NOT DECIDE WHAT SHOULD RANK.**

Sitemap / robots / canonical / metadata отвечают за discoverability infrastructure.

`12` отвечает за semantic fit:

**QUERY / SITUATION / INTENT → RELEVANT ENTRY OBJECT**

Не:

**QUERY → HOME BY DEFAULT**

Search destination не требует активного Programming Moment.

Старая Thing может быть правильным answer сегодня, даже если она не находится в текущей editorial program.

Search copy наследует `11`:

**CONCRETE NEED / SITUATION → CONCRETE OBJECT → WHAT IT DOES**

---

# 15. Dementor-authored distribution

Dementor может быть Source, но не universal catalog entry.

При интересе к конкретному автору / подходу возможны два валидных entry:

- direct author intent → Dementor body of work;
- interest generated by a work → authored Thing → body of work.

Предпочтительный proof:

> **работа раньше биографии, когда человек ещё не знает автора.**

Это сохраняет `Objects > Profiles` и `Situations > Skills`.

---

# 16. Event / QR / physical continuation

Физический context уже содержит часть intent.

Поэтому QR / short link должны продолжать именно этот context.

Возможные destinations:

- Event details;
- конкретная Thing на Event;
- инструкция / action;
- Participation Opportunity;
- History после Event;
- related next Thing.

Канонически:

> **PHYSICAL CONTEXT SHOULD SURVIVE THE CLICK.**

QR — transport, не новая Product entity.

---

# 17. Partner / earned distribution

Partner / external community / earned mention имеет сильный source context.

Нужно сохранять:

> **почему конкретная Thing / Event / Project релевантна именно этой среде.**

Default destination — конкретный object, а не generic Home.

Если partner является payer / sponsor, economic / disclosure boundary принадлежит `13`, но destination и promise fit остаются под `12`.

---

# 18. Message adaptation

`11` остаётся authority для meaning / promise / proof.

`12` может адаптировать под channel:

- длину;
- format;
- media crop;
- preview;
- CTA surface;
- timing;
- доступный context.

Нельзя адаптировать:

- факты;
- availability;
- authorship;
- смысл Thing;
- обещанный result;
- destination truth.

Канонически:

> **ADAPT DELIVERY, NOT TRUTH.**

---

# 19. Preview contract

Preview является частью promise до click.

Для destination-specific distribution желательно сохранять:

- object identity;
- relevant image / media;
- premise;
- canonical URL;
- literal availability, если materially relevant;
- source / author attribution, если materially relevant.

Generic brand preview допустим как fallback.

Но:

> **PREVIEW AND DESTINATION MUST DESCRIBE THE SAME EXPERIENCE.**

---

# 20. Attribution

Distribution attribution имеет два уровня.

## Transport attribution

Например:

- referrer;
- source;
- UTM;
- source page;
- delivery id;
- click.

## Semantic attribution

Там, где она реально нужна:

- `distribution_trigger`;
- `programming_moment?`;
- `source`;
- `channel`;
- `target_intent`;
- `entry_object`;
- `message_variant?`;
- `promised_experience`.

`programming_moment` является optional, потому что Search / Share / direct discovery не обязаны иметь его.

UTM не заменяет intent.

Referrer не заменяет promise.

Semantic attribution не требует отдельной Distribution database по умолчанию.

---

# 21. Success model

Канонически:

> **A CLICK IS NOT SUCCESS IF THE THING DISAPPOINTS.**

Impression и click — transport signals.

Distribution quality проверяется ближе к experience:

**QUALIFIED ENTRY → PROMISED EXPERIENCE → NATURAL CONTINUATION / SATISFIED EXIT → OPTIONAL RETURN**

Если continuation уместен:

**THING → THING**

может быть сильным ранним сигналом Program discovery.

Но не каждая хорошая Thing обязана породить второй click.

Это сохраняет Value Architecture:

> самостоятельный experience может закончиться сам на себе и всё равно быть успешным.

---

# 22. Qualified Entry

Qualified Entry — аналитическое понятие, не Product state.

Оно означает:

> **человек попал в объект, соответствующий его intent / promise, и реально встретил обещанный experience.**

Примеры:

- game invitation → game started;
- Event invitation → Event context реально просмотрен / relevant action reached;
- text invitation → человек действительно начал читать, а не только загрузил route;
- History invitation → relevant continuation viewed.

Точные event names / thresholds принадлежат `14 · Metrics & Signals`.

`12` определяет только semantic meaning.

---

# 23. Persistent discovery vs outbound

Канонические distribution layers:

- **persistent discoverability** — Search / sitemap / public routes / persistent links;
- **editorial outbound** — Telegram / social / partner posts, инициированные клубом;
- **person-mediated** — Share;
- **contextual handoff** — Event / physical / external context;
- **self-initiated re-entry** — direct / bookmark / known route.

Все они используют точность:

**INTENT → PRECISE ENTRY OBJECT**

Но только controlled editorial outbound требует Programming Moment как обязательный gate.

---

# 24. Distribution does not own Programming

`07` решает:

> **почему Thing важна программе сейчас.**

`12` решает:

> **если / когда возникает distribution opportunity, каким путём человек должен встретить эту Thing.**

Нельзя строить программу из channel cadence:

- «пора поста»;
- «надо пять публикаций»;
- «канал молчит».

Для outbound:

> **PROGRAM FIRST. CHANNEL SECOND.**

Для Search / Share / Direct:

> **DISCOVERY MAY OUTLIVE THE PROGRAMMING MOMENT.**

---

# 25. Distribution does not own Return

`12` может доставить следующую встречу и сохранить continuation.

Но `08` остаётся authority для:

**TRIGGER → EXPECTATION → RETURN → PAYOFF.**

Notification / delivery не должна сама становиться причиной retention.

---

# 26. Boundary with Monetization

`12` определяет:

- source / channel fit;
- destination;
- promise-to-entry consistency;
- distribution attribution semantics.

`13` определяет:

- что является paid value;
- payer / offer / payment / delivery;
- CAC / commercial attribution, когда paid acquisition реально существует;
- channel economics / commercial CTA boundary после завершения `12`.

Канонически:

> **DISTRIBUTION MAY DELIVER AN OFFER. IT DOES NOT INVENT THE PAID VALUE.**

Paid amplification не отменяет ни одного guardrail `12`.

---

# 27. Boundary with Metrics & Signals

`12` определяет, **что distribution success означает семантически**:

- precise entry;
- promise fulfilled;
- qualified experience;
- continuation when relevant.

`14` должен определить:

- event names;
- instrumentation;
- thresholds;
- dashboards;
- attribution windows;
- internal / test traffic exclusion;
- metric ownership.

Канонически:

> **DISTRIBUTION DEFINES THE QUESTION. METRICS DEFINES THE MEASUREMENT CONTRACT.**

---

# 28. Distribution does not own Product ontology

Нельзя вводить Product states:

- `TELEGRAMMED`;
- `SEO READY`;
- `SHARED`;
- `FEATURED`;
- `SOCIAL` как Form только из-за канала.

Distribution facts могут существовать как delivery / analytics history.

Они не мутируют Thing lifecycle.

---

# 29. Phase 0 implementation contract

Phase 0 не требует schema migration.

Нужно проверить несколько **разных trigger classes**, а не только Programming Moments.

Минимальный test set:

1. editorial Telegram / social outbound с реальным Programming Moment;
2. Search → precise existing Thing;
3. personal Share → exact Thing preview;
4. Event / physical handoff → exact continuation;
5. direct return → Home или known object.

Для controlled outbound выразить:

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

Проверить:

- destination correctness;
- preview correctness;
- channel fit;
- permission / eligibility where applicable;
- attribution survival;
- experience start;
- post-entry continuation.

Цель — доказать routing semantics до новых storage abstractions.

---

# 30. Suggested implementation order

## Phase 0 — Semantic routing policy

Без новой schema.

Проверить trigger classes и precise destinations на ограниченном наборе реальных objects.

## Phase 1 — Destination-aware Share / Preview

Закрыть Thing-specific context, canonical URL и preview consistency.

## Phase 2 — Programming Moment–driven outbound gate

Telegram / editorial social / partner outbound получают semantic decision, а не raw publication event.

## Phase 3 — Eligibility + semantic attribution

Добавить только необходимые dimensions / suppression logic, не создавая universal marketing platform.

## Phase 4 — Qualified consumption / continuation

Для ключевых Forms определить minimal success signals совместно с `14`.

## Phase 5 — Automation where justified

Автоматизировать repeatable delivery только после доказанной routing policy.

---

# 31. Non-goals v1

`12` не требует:

- universal distribution database;
- полного marketing automation platform;
- обязательного paid media layer;
- публикации каждой Thing во все каналы;
- нового social network;
- funnel-first growth architecture;
- channel calendar как Programming authority;
- Home / Board redesign только ради acquisition;
- новой Product taxonomy ради UTM;
- schema migration на Phase 0;
- идеального multi-touch attribution до появления доказанной необходимости.

---

# 32. Anti-patterns

Критические anti-patterns:

- every publish → every channel;
- Programming Moment required for Search / personal Share;
- Telegram as publication mirror;
- social → Home by default;
- share → generic brand invite;
- search query → Home despite precise object;
- Event QR → Home;
- Board treated as channel / universal landing;
- Dementor profile treated as universal author entry;
- sitemap treated as ranking strategy;
- UTM treated as understanding intent;
- paid promotion bypasses destination truth;
- CTR optimization worsens promise-to-experience fit;
- channel cadence creates fake Programming Moments;
- repeated delivery ignores permission / suppression / fatigue;
- generic preview replaces specific Thing;
- success measured only by impressions / clicks;
- routing follows org structure instead of promised experience.

Главный anti-signal:

> **Distribution знает, куда отправить ссылку, но не может объяснить, почему этот человек должен попасть именно в этот объект.**

---

# 33. Distribution QA

Для любого distribution path проверить:

1. **Какой trigger?**
2. **Если это editorial outbound — какой Programming Moment?**
3. **Какой предполагаемый intent?**
4. **Какой source / channel / path?**
5. **Какой promise / preview?**
6. **Какой exact Entry Object выполняет promise?**
7. **Можно ли перейти прямо к experience?**
8. **Не вставили ли Home / Board только ради удобства?**
9. **Разрешена / уместна ли доставка там, где permission применим?**
10. **Совпадает ли preview с destination?**
11. **Что считается qualified entry?**
12. **Какой natural next step существует, если он вообще нужен?**

Для Search / Share / Direct отсутствие Programming Moment **не является ошибкой**.

---

# 34. Acceptance test

Distribution Model работает, если для реального случая можно коротко ответить:

```text
TRIGGER
→ SOURCE / CHANNEL
→ INTENT
→ PROMISE
→ ENTRY OBJECT
→ EXPERIENCE
→ CONTINUATION OR SATISFIED EXIT
→ SUCCESS SIGNAL
```

Для editorial outbound дополнительно:

```text
PROGRAMMING MOMENT
→ DISTRIBUTION DECISION
→ ELIGIBILITY
→ DELIVERY
```

Фраза:

> **«Запостим это в Telegram / Instagram / SEO».**

не является Distribution Model.

---

# Canonical summary

Главная рамка:

> **AUDIENCE & ENTRY MAP DESCRIBES THE VISIT.**  
> **DISTRIBUTION MODEL DESIGNS THE INVITATION / DISCOVERY PATH.**

Общая цепочка:

**DISTRIBUTION TRIGGER → INTENT HYPOTHESIS → SOURCE / CHANNEL FIT → PROMISE / PREVIEW → ENTRY OBJECT → EXPERIENCE → CONTINUATION**

Для editorial outbound:

**PROGRAMMING MOMENT → DISTRIBUTION DECISION → CHANNEL / TRANSPORT → ENTRY OBJECT → EXPERIENCE**

Главные guardrails:

**PROGRAMMING MOMENT GATES EDITORIAL OUTBOUND. IT DOES NOT GATE ALL DISCOVERY.**

**DISTRIBUTE THE THING, NOT THE ORG CHART.**

**DESTINATION MUST MATCH THE PROMISE.**

**HOME IS NOT THE DEFAULT LANDING PAGE.**

**BOARD IS NOT THE DEFAULT ACQUISITION SURFACE.**

**NOT EVERY RELEASE NEEDS EVERY CHANNEL.**

**RELEVANCE DOES NOT OVERRIDE DELIVERY PERMISSION.**

**A CLICK IS NOT SUCCESS IF THE THING DISAPPOINTS.**

Для Search:

**SITEMAP MAKES THINGS DISCOVERABLE. IT DOES NOT DECIDE WHAT SHOULD RANK.**

Для Share:

**SHARE MAY EXTEND THE LIFE OF A THING WITHOUT CREATING A NEW PROGRAMMING MOMENT.**

Для Telegram editorial outbound:

**PROGRAMMING MOMENT → DISTRIBUTION DECISION → TELEGRAM DELIVERY.**

И главный смысл:

> **Distribution не максимизирует охват. Она сохраняет соответствие между причиной встречи, ожиданием человека и тем experience, который он реально получает.**