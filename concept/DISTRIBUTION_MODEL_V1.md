# DEMENTOR CLUB — DISTRIBUTION MODEL v1

Status: **DRAFT / WORKING CANON CANDIDATE**  
Updated: **2026-09-15**

## Authority scope

Этот документ является **distribution semantics authority** Dementor Club.

Он определяет не список каналов, а правило, по которому редакционный момент превращается в точную внешнюю встречу человека с конкретной вещью.

Каноническая граница:

> **AUDIENCE & ENTRY MAP DESCRIBES THE VISIT.**  
> **DISTRIBUTION MODEL DESIGNS THE INVITATION.**

`12 · Distribution Model` отвечает:

> **кого → с каким intent → через какой канал → каким сообщением → в какую конкретную точку продукта → ради какого experience → с каким естественным следующим шагом.**

Документ опирается на:

- `03 · Audience & Entry Map` — кто пришёл, зачем и куда;
- `07 · Content & Programming Model` — почему Thing важна сейчас;
- `11 · Marketing Positioning & Messaging` — что человеку сказать и какое proof показать;
- `08 · Return Loops` — почему после хорошего experience человек возвращается;
- Product Model — что является Thing / Release / History / Project / Event;
- Board Product Model — как живые Things показываются внутри Board.

Он не переопределяет ни один из этих слоёв.

---

# 0. Главная модель

Каноническая цепочка Distribution:

**PROGRAMMING MOMENT → CHANNEL FIT → TARGET INTENT → MESSAGE → ENTRY OBJECT → EXPERIENCE → NEXT THING / RETURN**

Со стороны человека:

**SOURCE → INTENT → PROMISE → ENTRY OBJECT → PROOF → NEXT THING**

Это две стороны одной встречи.

Programming решает, **почему сейчас есть смысл что-то вынести наружу**.

Messaging решает, **что именно обещать и чем это доказать**.

Distribution решает, **где, кому и в какую точку продукта доставить это обещание**.

Return решает, **почему после первого удачного контакта человек снова появляется**.

---

# 1. Главный принцип

> **DISTRIBUTE THE THING, NOT THE ORG CHART.**

Distribution не должен вести человека через структуру Dementor, если его intent уже соответствует конкретной Thing / Release / Event / History / Dementor body of work.

Плохая цепочка:

**POST → HOME → SECTION → LIST → DETAIL → EXPERIENCE**

если пост уже обещал конкретную игру.

Предпочтительно:

**POST → GAME**

а уже после experience:

**GAME → NEXT THING / PROGRAM / DEMENTOR / RETURN**

Структура продукта может быть видна позже.

Она не должна становиться обязательным тамбуром перед обещанным experience.

---

# 2. Destination contract

Главное правило routing:

> **DESTINATION MUST MATCH THE PROMISE.**

Если сообщение обещает:

- игру — человек должен попасть к игре;
- Event — к Event;
- конкретный release — к доступному release;
- «что случилось дальше» — к relevant History / Thing context;
- автора — к authored Thing или body of work;
- участие — к реальной Participation Opportunity;
- текущую программу — к Home;
- «что сейчас происходит» — к Board.

Нельзя использовать generic landing page только потому, что он организационно удобнее.

Distribution route — часть обещания.

Неправильный destination превращает даже хороший message в misleading acquisition.

---

# 3. Home и Board не являются default acquisition surfaces

Канонически:

> **HOME IS NOT THE DEFAULT LANDING PAGE.**

Home — обложка текущей программы.

Его естественный intent:

> **«Что у них сейчас?»**

Поэтому Home хорошо подходит для:

- direct return;
- brand/direct traffic;
- общего curiosity без более точного объекта;
- текущей программной обложки.

Но если канал уже обещал конкретную Thing, Home не должен вставать между человеком и Thing.

Канонически:

> **BOARD IS NOT THE DEFAULT ACQUISITION SURFACE.**

Board отвечает на:

> **«Что сейчас происходит?»**

Он уместен как entry object только когда именно этот intent обещан человеку.

Board не является универсальным destination для social / search / share / Telegram.

---

# 4. DistributionDecision

Для реализации v1 достаточно семантического решения перед transport layer.

Рабочая модель:

```text
DistributionDecision
  programming_moment
  channel
  target_intent
  message_ref
  entry_object
  promised_experience
  next_step
  attribution_key?
```

Это **не обязательная DB table** и не новая Product ontology.

Это может быть:

- редакционная запись;
- in-memory adapter;
- config;
- analytics payload;
- параметр automation;
- вычисляемый view model.

Главная функция — заставить каждый distribution action ответить на один и тот же набор смысловых вопросов до отправки.

---

# 5. CHANNEL × INTENT × ENTRY OBJECT

Единый routing decision:

> **CHANNEL × INTENT × ENTRY OBJECT**

Ни один из трёх элементов не определяет остальные автоматически.

## Channel ≠ audience

Telegram не является «аудиторией Telegram».

Search не является «SEO-аудиторией».

Social не означает один общий intent.

Один канал может обслуживать разные intent.

Один intent может приходить из разных каналов.

## Intent ≠ destination by default

Даже одинаковый intent может требовать разных entry objects в зависимости от promise.

Например curiosity может вести:

- к конкретной игре;
- к Event;
- к History;
- к authored Thing.

## Entry Object ≠ navigation section

Entry Object — **самый точный объект, который выполняет promise**.

Это не обязательно route первого уровня.

---

# 6. Channel matrix v1

| Канал | Основной intent | Куда вести |
|---|---|---|
| **Share / личная ссылка** | «посмотри, это про нас/тебя» | конкретная Thing |
| **Social** | поржать / узнать себя / curiosity | Thing или самостоятельный social experience |
| **Telegram** | следующая Thing / meaningful continuation | Thing / Release / History / Event |
| **Search** | конкретная ситуация / Thing / автор | самый точный соответствующий объект |
| **Dementor** | интерес к автору / подходу | authored Thing → body of work |
| **Event / QR** | продолжить физический experience | Event / Thing / History |
| **External community / partner** | контекстный интерес | конкретная Thing / Event / Project |
| **Direct** | «что у них сейчас?» | Home как обложка программы |
| **Board** | «что сейчас происходит?» | Board — только при таком intent |

Матрица задаёт default fit, а не жёсткую taxonomy.

Editorial decision может выбрать другой destination, если он точнее выполняет promise.

---

# 7. Programming Moment как причина distribution

Distribution не начинается с события в CMS.

Он начинается с **Programming Moment**.

Programming Moment отвечает:

> **Почему эта Thing / Release / History / Participation / Event достойна внимания именно сейчас?**

Канонически:

> **NOT EVERY RELEASE NEEDS EVERY CHANNEL.**

И шире:

- не каждый Release вообще требует external distribution;
- не каждый Programming Moment подходит каждому каналу;
- новый History event может быть сильнее нового Release;
- открытая Participation Opportunity может быть причиной отдельной отправки;
- Event может требовать повторной distribution из-за реального изменения условий или близости даты;
- редакционное resurfacing старой Thing может быть полноценным Programming Moment без новой публикации.

Поэтому:

**PUBLISHED ≠ DISTRIBUTE**

**RELEASED ≠ SEND EVERYWHERE**

**NEW ≠ IMPORTANT NOW**

---

# 8. Channel fit

Channel fit определяется не только доступностью transport.

Нужно проверить:

1. **Есть ли Programming Moment?**
2. **Есть ли на этом канале человек с релевантным intent?**
3. **Можно ли передать promise без искажения?**
4. **Есть ли точный Entry Object?**
5. **Работает ли experience после перехода?**
6. **Есть ли естественный next step?**

Если один канал требует слишком сильно обрезать смысл или ведёт к слабому destination — канал можно не использовать.

Distribution coverage не является целью само по себе.

---

# 9. Share / личная ссылка

Share — не маленькая брендовая рекламная кампания.

Канонически:

> **SHARE SHOULD PRESERVE THE THING’S CONTEXT AND PREVIEW, NOT TURN INTO A BRAND INVITE.**

Получатель уже имеет сильный social proof:

> **«Мне это прислал конкретный человек».**

Поэтому shared destination должен сохранять:

- identity конкретной Thing;
- понятный title / premise;
- релевантный preview;
- прямой путь к experience;
- при необходимости минимальный source / Dementor context.

Нельзя подменять shared Thing generic Home invitation.

После experience можно показать:

- related Thing;
- next release;
- Dementor body of work;
- relevant History;
- Program continuation.

---

# 10. Social

Social может выполнять две разные роли.

## A. Самостоятельный experience

Мем / короткое видео / observation / fragment может быть завершённым опытом прямо в social surface.

Click не обязателен.

## B. Invitation к product experience

Если post обещает продолжение, destination должен соответствовать обещанию.

Например:

- «сыграть» → game;
- «посмотреть полный эксперимент» → Thing;
- «прийти» → Event;
- «что из этого получилось» → History / relevant Thing view.

Social не должен автоматически вести на Home только ради traffic capture.

---

# 11. Telegram

Telegram — канал **meaningful continuation**, а не зеркало публикационной базы.

Канонически:

> **Причиной сообщения должен быть Programming Moment, а не факт «мы что-то опубликовали».**

Telegram подходит, когда есть:

- новая Thing, которую реально стоит открыть;
- сильный Release;
- meaningful History;
- Event moment;
- конкретное продолжение предыдущей программы;
- важная Participation Opportunity;
- editorial resurfacing с новой причиной внимания.

Telegram transport может быть автоматизирован.

Но автоматизация не должна заменять semantic decision.

Правильная архитектура:

**PROGRAMMING DECISION → DISTRIBUTION DECISION → TELEGRAM DELIVERY**

Не:

**ARTIFACT PUBLISHED → TELEGRAM**

---

# 12. Search / SEO

Search — discovery surface с высоким риском перепутать discoverability и editorial strategy.

Канонически:

> **SITEMAP MAKES THINGS DISCOVERABLE. IT DOES NOT DECIDE WHAT SHOULD RANK.**

Sitemap / robots / metadata отвечают за доступность и машинное понимание surfaces.

Они не определяют:

- приоритет программы;
- поисковый intent;
- какую Thing нужно продвигать;
- какую страницу считать лучшим answer;
- какой message соответствует ситуации человека.

Для Search destination должен быть максимально точным:

**QUERY / SITUATION / INTENT → RELEVANT OBJECT**

Не:

**QUERY → HOME BY DEFAULT**

Search copy должен сохранять clarity из `11`:

**SITUATION → CONCRETE RESOURCE → WHAT IT DOES → optional Dementor context**

---

# 13. Dementor distribution path

Когда intent связан с человеком / автором / подходом, default путь:

**AUTHORED THING → DEMENTOR BODY OF WORK**

Не обязательно:

**PROFILE → BIO → LIST → THING**

Лучшее первое proof Dementor — его работа.

Dementor profile / body of work становится продолжением после конкретной Thing или точкой entry при прямом author intent.

---

# 14. Event / QR

Физический experience создаёт особый distribution context: человек уже находится внутри события или рядом с ним.

QR / короткая ссылка должны продолжать конкретное состояние человека.

Возможные destinations:

- сам Event;
- Thing, которую использовали на Event;
- инструкция / action;
- History после Event;
- related Thing;
- конкретная Participation Opportunity.

Не нужно после физического experience отправлять человека на Home, если существует точное продолжение.

Канонически:

**PHYSICAL CONTEXT SHOULD SURVIVE THE CLICK.**

---

# 15. External community / partner

В partner / community distribution главный asset — контекст источника.

Сообщение должно объяснять, почему конкретная Thing / Event / Project релевантны именно этой среде.

Default destination:

- Thing;
- Event;
- Project, если обещан именно долгий совместный контекст.

Нельзя использовать чужую аудиторию как generic top-of-funnel для Home без соответствующего intent.

---

# 16. Direct

Direct traffic отличается тем, что человек уже знает Dementor достаточно, чтобы прийти без внешнего promise.

Основной intent:

> **«Что у них сейчас?»**

Здесь Home как обложка актуальной программы является естественным destination.

Direct return — один из важных признаков, что distribution + experience создают узнаваемую программу, а не только одноразовые clicks.

---

# 17. Board

Board — внутренняя editorial surface living Things.

Его естественный acquisition intent:

> **«Что сейчас происходит?»**

Поэтому Board может быть destination:

- из direct navigation;
- из message, обещающего current activity;
- из operational/member context.

Но generic external campaigns не должны использовать Board как универсальный landing page только потому, что там собрано много объектов.

**BOARD DENSITY IS NOT A REPLACEMENT FOR ENTRY PRECISION.**

---

# 18. Message adaptation by channel

`11 · Marketing Positioning & Messaging` остаётся authority для meaning / promise / proof.

Distribution не изобретает новое positioning для каждого канала.

Он адаптирует:

- длину;
- формат;
- media crop;
- preview;
- CTA surface;
- timing;
- context available in channel.

Нельзя адаптировать:

- факты;
- availability;
- смысл Thing;
- обещанный result;
- authorship;
- actual destination.

Канонически:

**ADAPT DELIVERY, NOT TRUTH.**

---

# 19. Preview contract

Preview является частью Distribution, потому что он формирует promise до click.

Для destination-specific distribution желательно сохранять:

- Thing / Event / Project identity;
- relevant image / media;
- premise;
- literal availability where useful;
- canonical URL;
- source attribution.

Generic brand OG image допустим как fallback.

Но он не должен заменять Thing-specific preview, когда конкретная Thing является объектом invitation.

Preview и landing должны выглядеть как одна и та же встреча.

---

# 20. Attribution

Distribution attribution имеет два уровня.

## Transport attribution

Что уже обычно измеряют web / channel systems:

- source;
- referrer;
- UTM source;
- UTM campaign;
- source page;
- outbound / inbound click.

## Semantic attribution

Что нужно понимать для Product Distribution:

- `programming_moment`;
- `channel`;
- `target_intent`;
- `entry_object`;
- optional `message_variant`;
- whether promised experience was actually consumed;
- what happened next.

Semantic attribution не обязана становиться новой таблицей.

Она может быть частью analytics event payload / routing config.

Главное — не терять смысл после click.

---

# 21. Success model

Канонически:

> **A CLICK IS NOT SUCCESS IF THE THING DISAPPOINTS.**

Impression и click — transport metrics.

Они полезны, но не доказывают quality of distribution.

Основная цепочка успеха:

**QUALIFIED ENTRY CONSUMPTION → THING → THING → SHARE / MEANINGFUL CONTINUATION → RETURN**

Возможные ранние сигналы:

- promised experience реально начат / consumed;
- человек открыл следующую Thing;
- прошёл к relevant History / Event / body of work;
- поделился;
- выполнил promised Participation action;
- вернулся напрямую позже.

Пример:

**10 000 clicks на Home с нулевым пониманием / experience слабее, чем 500 людей, которые открыли конкретную игру и после неё сами открыли ещё одну Thing.**

Оптимизация channel CTR не имеет права ухудшать promise-to-experience fit.

---

# 22. Qualified entry

Qualified entry — не отдельный membership state.

Это аналитическое понятие:

> **человек пришёл в тот объект, который соответствовал его intent и promise, и реально встретил обещанный experience.**

Примеры:

- game invitation → game loaded / started;
- Event invitation → meaningful Event detail consumed / registration action reached;
- text invitation → text actually opened/read beyond immediate bounce;
- author invitation → authored work/body of work reached;
- History invitation → relevant continuation viewed.

Точные event definitions относятся к Metrics / Analytics implementation, не к Product ontology.

---

# 23. Editorial control

Distribution является editorial decision до того, как становится automation.

Редакция / programming layer определяет:

- какой Programming Moment достоин distribution;
- кому он релевантен;
- какой channel fit достаточен;
- какой promise использовать;
- какой Entry Object является точным;
- какой next step естественен.

Система может затем автоматизировать:

- formatting;
- scheduling;
- preview generation;
- delivery;
- UTM / attribution;
- repeatable channel mechanics.

Но automation не должна сама создавать editorial importance из факта технической публикации.

---

# 24. Persistent discovery vs outbound distribution

Не вся Distribution является «отправкой».

Search / sitemap / persistent links создают **discoverability layer**.

Telegram / social / partner posts создают **outbound invitation layer**.

Share создаёт **person-mediated invitation layer**.

Direct создаёт **self-initiated return layer**.

Все они используют один routing principle:

**INTENT → PROMISE → PRECISE ENTRY OBJECT**

Но timing model у них разный.

---

# 25. Distribution does not own Programming

Distribution не определяет, что важно сейчас.

Он получает Programming Moment из `07`.

Поэтому нельзя строить программу из channel cadence:

- «пора ежедневного Telegram»;
- «нужно 5 постов в неделю»;
- «надо что-то отправить, потому что канал молчит».

Channel calendar может помогать operations.

Но он не является источником editorial reason.

Канонически:

**PROGRAM FIRST. CHANNEL SECOND.**

---

# 26. Distribution does not own Return

Distribution может показать natural next step.

Но он не определяет весь Return system.

Граница:

- `12` — как первая / следующая встреча доставлена и куда она ведёт;
- `08` — почему у человека возникает ожидание / привычка / причина вернуться.

Distribution success может включать Return as downstream signal, но не переопределяет Return Loop.

---

# 27. Distribution does not own Product ontology

Channel-specific needs не создают новые Product states.

Нельзя вводить:

- `TELEGRAMMED` как состояние Thing;
- `SEO READY` как Release State;
- `SOCIAL` как Form только потому, что Thing была опубликована в social;
- `SHARED` как History автоматически;
- `FEATURED` как Product lifecycle state.

Distribution facts могут существовать как analytics / delivery history.

Они не должны мутировать Product Model.

---

# 28. Phase 0 implementation contract

Первый implementation slice не требует schema migration.

Нужно уметь для ограниченного набора реальных Programming Moments собрать:

```text
programming_moment
channel
intent
message
entry_object
promised_experience
next_step
attribution
```

и проверить:

- destination correctness;
- preview correctness;
- channel fit;
- attribution survival;
- post-entry continuation.

Цель Phase 0 — доказать routing semantics на реальных Things до создания новых storage abstractions.

---

# 29. Suggested implementation order

## Phase 0 — Semantic routing policy

Без новой schema.

На нескольких Things / Events / History moments проверить `CHANNEL × INTENT × ENTRY OBJECT`.

## Phase 1 — Destination-aware Share / Preview

Сохранить существующий share / OG transport, но обеспечить Thing-specific context, canonical URL и preview consistency.

## Phase 2 — Programming Moment–driven outbound routing

Telegram / social / partner distribution должны получать semantic decision, а не реагировать только на raw publication.

## Phase 3 — Semantic attribution

Дополнить transport analytics значениями intent / entry object / programming moment там, где это реально нужно.

## Phase 4 — Qualified consumption / continuation signals

Измерять не только click, но promised experience consumption, Thing → Thing и meaningful continuation.

## Phase 5 — Automation where justified

Автоматизировать repeatable delivery только после того, как routing policy доказана вручную / на ограниченном scope.

---

# 30. Non-goals v1

`12` не требует:

- нового universal distribution database;
- полного marketing automation platform;
- обязательного paid media layer;
- публикации каждой Thing во все каналы;
- нового social network внутри Dementor;
- funnel-first growth architecture;
- переноса Programming в Telegram calendar;
- переноса Messaging в channel templates;
- превращения Home в универсальный acquisition landing;
- превращения Board в универсальный acquisition landing;
- переписывания Product ontology;
- переписывания Return Loops;
- новой taxonomy ради UTM;
- schema migration на Phase 0.

---

# 31. Anti-patterns

Критические anti-patterns:

- every publish → every channel;
- Telegram as publication mirror;
- social post → Home by default;
- share → generic brand invite;
- search query → Home despite a precise object;
- author intent → generic Community index;
- Event QR → Home;
- Board as universal landing page;
- sitemap treated as ranking strategy;
- UTM treated as understanding intent;
- CTR optimization that worsens destination fit;
- channel calendar creating fake Programming Moments;
- generic preview for a strong specific Thing;
- measuring success only as impressions/clicks;
- routing via internal org structure instead of promised experience.

Главный anti-signal:

> **Distribution знает, куда отправить пост, но не может объяснить, почему этот человек должен попасть именно в этот объект.**

---

# 32. Distribution QA

Перед external distribution проверить:

1. **Какой Programming Moment является причиной?**
2. **Какой target intent?**
3. **Почему выбран именно этот channel?**
4. **Какой promise / message утверждён?**
5. **Какой exact Entry Object выполняет promise?**
6. **Можно ли перейти прямо к experience?**
7. **Не вставили ли Home / Board только ради удобства?**
8. **Совпадает ли preview с destination?**
9. **Не искажены ли факты ради channel format?**
10. **Какой один natural next step существует после experience?**
11. **Что будет означать qualified consumption?**
12. **Как поймём, что человек пошёл Thing → Thing / продолжил / вернулся?**

Если на вопросы 1–6 нет ответа, distribution decision ещё не готов.

---

# 33. Acceptance test

Distribution Model работает, если для любого реального external action можно коротко ответить:

```text
КТО / INTENT
→ ПОЧЕМУ СЕЙЧАС / PROGRAMMING MOMENT
→ ГДЕ / CHANNEL
→ ЧТО ОБЕЩАЕМ / MESSAGE
→ КУДА ВЕДЁМ / ENTRY OBJECT
→ ЧТО ОН ТАМ ДЕЛАЕТ / EXPERIENCE
→ ЧТО ЕСТЕСТВЕННО ДАЛЬШЕ / NEXT THING OR RETURN
→ КАК ПОЙМЁМ, ЧТО ВСТРЕЧА СОСТОЯЛАСЬ / SUCCESS SIGNAL
```

Фраза:

> **«Запостим это в Telegram / Instagram / SEO».**

не является Distribution Model.

---

# Canonical summary

Главная рамка:

> **AUDIENCE & ENTRY MAP DESCRIBES THE VISIT.**  
> **DISTRIBUTION MODEL DESIGNS THE INVITATION.**

Главная цепочка:

**PROGRAMMING MOMENT → CHANNEL FIT → TARGET INTENT → MESSAGE → ENTRY OBJECT → EXPERIENCE → NEXT THING / RETURN**

Главный routing decision:

**CHANNEL × INTENT × ENTRY OBJECT**

Главные guardrails:

> **DISTRIBUTE THE THING, NOT THE ORG CHART.**

> **DESTINATION MUST MATCH THE PROMISE.**

> **NOT EVERY RELEASE NEEDS EVERY CHANNEL.**

> **HOME IS NOT THE DEFAULT LANDING PAGE.**

> **BOARD IS NOT THE DEFAULT ACQUISITION SURFACE.**

> **A CLICK IS NOT SUCCESS IF THE THING DISAPPOINTS.**

Для Search:

> **SITEMAP MAKES THINGS DISCOVERABLE. IT DOES NOT DECIDE WHAT SHOULD RANK.**

Для Share:

> **SHARE SHOULD PRESERVE THE THING’S CONTEXT AND PREVIEW, NOT TURN INTO A BRAND INVITE.**

Для Telegram:

> **Причиной сообщения должен быть Programming Moment, а не факт «мы что-то опубликовали».**

И итоговый success path:

**QUALIFIED ENTRY CONSUMPTION → THING → THING → SHARE / MEANINGFUL CONTINUATION → RETURN**
