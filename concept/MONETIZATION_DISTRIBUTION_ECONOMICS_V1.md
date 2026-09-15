# DEMENTOR CLUB — MONETIZATION / DISTRIBUTION ECONOMICS v1

Status: **WORKING CANON / distribution economics authority**  
Updated: **2026-09-15**

## Authority scope

Этот документ является **13B · Distribution Economics** внутри `13 · Monetization Map`.

Он отвечает на вопрос:

> **Когда paid value уже существует, как она встречает человека через конкретный distribution path и как честно измерять экономику этой встречи?**

Документ не создаёт paid value и не решает, что продавать.

Это уже определяет `13A · Monetization Architecture` в:

- `concept/MONETIZATION_MAP_V1.md`.

`13B` опирается на:

- `concept/DISTRIBUTION_MODEL_V1.md` — routing / discovery authority;
- `concept/MARKETING_POSITIONING_MESSAGING_V1.md` — promise / proof / external messaging;
- `concept/MONETIZATION_MAP_V1.md` — value object / payer / offer / payment semantics;
- `concept/RETURN_LOOPS_V1.md` — `RETURN FOLLOWS VALUE, NOT DEBT`;
- `concept/DEMENTOR_INTERVENTION_MODEL_V1.md` — contextual utility и paid Intervention boundary;
- `operations/MONETIZATION_VALUE_DISCOVERY_REVIEW_2026-09-15.md` — current-stage evidence discipline.

Он не переопределяет:

- Product ontology;
- Programming Moment;
- Distribution routing;
- commercial availability конкретной Thing / Event / Course / Dementor;
- конкретные цены;
- accounting policy;
- tax / legal / payment-provider rules;
- event names, analytics schemas, dashboards и numeric thresholds — это зона `14 · Metrics & Signals` / implementation.

Каноническая граница:

**12 DECIDES WHERE THE ENCOUNTER HAPPENS.**  
**13A DECIDES WHETHER PAYMENT IS A VALID EXCHANGE FOR THE VALUE.**  
**13B DECIDES WHETHER THE ECONOMICS OF DELIVERING THAT PAID VALUE THROUGH THIS PATH ARE VALID.**

Главная формула:

**VALID OFFER → DISTRIBUTION PATH → QUALIFIED COMMERCIAL ENTRY → PAYMENT INTENT → PAYMENT → FULFILLMENT → PRODUCT RETURN / REPEAT**

Главные guardrails:

**MONETIZATION FOLLOWS VALUE.**

**PAID DISTRIBUTION DOES NOT CREATE PRODUCT VALUE.**

**PAID AMPLIFICATION ≠ EDITORIAL PRIORITY.**

**DESTINATION MUST STILL MATCH THE PROMISE.**

**UNKNOWN ATTRIBUTION ≠ ZERO-COST ACQUISITION.**

**DO NOT INVENT LTV BEFORE REPEATED PAID VALUE EXISTS.**

---

# 0. Главный принцип

Distribution Economics начинается только после двух уже принятых решений.

Сначала `13A`:

> существует конкретная самостоятельная ценность и валидный offer.

Потом `12`:

> существует точный distribution path к соответствующему Entry Object.

И только затем `13B`:

> сколько стоит доставить эту встречу, что считается коммерческим результатом и не ломает ли экономика продукт.

Неверная последовательность:

```text
есть дешёвый канал
→ давайте что-нибудь туда продадим
→ придумываем offer
→ перестраиваем продукт
```

Правильная:

```text
VALUE OBJECT
→ VALID OFFER
→ RELEVANT DISTRIBUTION PATH
→ COMMERCIAL TEST
→ DELIVERY
→ ECONOMIC EVIDENCE
```

Канонически:

**CHANNEL ECONOMICS MAY SELECT BETWEEN VALID PATHS. IT MAY NOT INVENT THE VALUE.**

---

# 1. 13A и 13B — две разные задачи

## 13A · Monetization Architecture

Отвечает:

> **За что здесь вообще уместно платить?**

Определяет:

- Value Object;
- payer / user;
- free / paid boundary;
- offer;
- entitlement;
- pricing discipline;
- fulfillment;
- Membership test;
- sponsor / partner funding;
- editorial firewalls.

## 13B · Distribution Economics

Отвечает:

> **Как экономически оценивать путь, через который человек встретил уже существующий offer?**

Определяет:

- acquisition mode;
- commercial entry;
- commercial attribution semantics;
- channel × value-object fit;
- paid amplification boundary;
- CAC / CPA usage boundaries;
- partner / referral economics;
- discount economics;
- retargeting guardrails;
- external platform costs;
- campaign economics;
- organic / paid / partner separation.

Канонически:

**13B DOES NOT CREATE OFFERS. IT EVALUATES DISTRIBUTION OF VALID OFFERS.**

---

# 2. Boundary with `12 · Distribution Model`

`12` уже фиксирует:

**DISTRIBUTION TRIGGER → INTENT HYPOTHESIS → SOURCE / CHANNEL FIT → PROMISE / PREVIEW → ENTRY OBJECT → EXPERIENCE → CONTINUATION**

И отдельно:

**PROGRAMMING MOMENT GATES EDITORIAL OUTBOUND. IT DOES NOT GATE ALL DISCOVERY.**

`13B` наследует это полностью.

Поэтому коммерческая экономика не имеет права:

- менять Entry Object только потому, что другой landing легче конвертирует;
- отправлять precise promise на Home ради большего funnel volume;
- использовать Board как generic sales surface;
- превращать paid campaign в Programming Moment;
- объявлять paid placement editorial priority;
- использовать более агрессивный commercial message, который перестаёт соответствовать реальному experience.

Канонически:

**COMMERCIAL OPTIMIZATION HAPPENS INSIDE A VALID DISTRIBUTION PATH — NOT INSTEAD OF IT.**

---

# 3. Commercial Distribution Path

Для коммерческого анализа достаточно следующей semantic-модели:

```text
CommercialDistributionPath
  distribution_trigger
  acquisition_mode
  source
  channel
  transport?
  target_intent
  entry_object
  value_object
  offer
  payer_model
  message_variant?
  commercial_cta?
  cost_scope?
  attribution_key?
```

Это **не новая Product ontology** и не требование новой DB table.

Модель может жить:

- в campaign config;
- analytics payload;
- operational review;
- spreadsheet / report;
- ad-platform metadata;
- checkout context;
- in-memory adapter.

Главное — сохранить semantic connection:

**кто / с каким intent → увидел какое обещание → попал в какой объект → встретил какой offer → что произошло после оплаты.**

---

# 4. Acquisition Mode

Channel сам по себе не говорит, как была оплачена доставка внимания.

Поэтому `13B` использует отдельное измерение:

## ORGANIC

Встреча произошла без прямой оплаты за конкретную доставку пользователя.

Например:

- Search;
- organic social;
- editorial Telegram;
- direct;
- person-mediated Share;
- organic partner mention.

`ORGANIC` не означает:

> стоимость = 0.

Существуют production, editorial, infrastructure и labor costs.

Просто они не являются автоматически acquisition spend.

## PAID ACQUISITION

Клуб платит внешней системе / площадке / партнёру за доставку конкретного коммерческого сообщения или трафика.

Например:

- paid social;
- search ads;
- paid placement;
- performance campaign.

## PARTNER DISTRIBUTION

Distribution идёт через партнёра по отдельному соглашению.

Она может быть:

- бесплатной;
- reciprocal;
- flat-fee;
- revenue-share;
- sponsor-funded.

## REFERRAL / AFFILIATE

Вознаграждение связано с конкретным результатом referral path.

Не является default-моделью клуба.

Допустима только при явных правилах и disclosure там, где оно materially relevant.

## OWNED RE-ENTRY

Повторная доставка через собственный permissioned channel человеку, у которого уже есть контекст.

Например будущий email / push / direct notification, если такие механики существуют и permission подтверждён.

Это не автоматически «бесплатный acquisition» и не способ создать notification debt.

Канонически:

**SOURCE ≠ CHANNEL ≠ ACQUISITION MODE.**

---

# 5. Commercial Entry

Не каждый вход в продукт является коммерческим входом.

`13B` использует понятие:

## QUALIFIED COMMERCIAL ENTRY

Человек:

1. пришёл по релевантному intent;
2. попал в точный Entry Object;
3. встретил обещанный experience / value context;
4. увидел коммерческий offer в месте, где он не противоречит исходному promise.

Это не означает, что человек обязан купить.

Канонически:

**COMMERCIAL ENTRY IS QUALIFIED BY RELEVANCE, NOT BY PURCHASE.**

Например:

- поиск «билет на событие X» → Event с ценой и покупкой — qualified commercial entry;
- social-мем → Home → generic Membership upsell — обычно нет;
- Situation → релевантный Tool → понятный paid offer — может быть;
- чужой Share бесплатной Thing → немедленный unrelated paid CTA — плохой commercial entry.

---

# 6. Channel × Value Object Fit

Эта матрица задаёт **default fit**, а не обязательный funnel.

| Distribution path | Естественная paid value | Допустимый commercial handoff | Главный риск |
|---|---|---|---|
| **Search / Situation** | Tool / Method / Course / Event / concrete Intervention | precise object → literal offer | продавать до contextual fit |
| **Search / Thing name** | конкретная paid Thing / edition / Event | exact Thing → purchase / access | отправить на generic store/Home |
| **Organic Social** | Thing / Event / physical object | proof first; direct buy если сам объект уже понятен | весь social становится витриной |
| **Paid Social** | concrete Thing / Event / Tool / preorder | ad promise → exact commercial Entry Object | платить за vague club awareness и считать это demand |
| **Telegram** | meaningful paid availability / Event / release / preorder | Programming Moment → exact offer | превращение канала в sales calendar |
| **Person Share** | конкретная Thing / Event | сохранить исходный объект; commercial CTA только если он ему присущ | подмена рекомендации человека upsell-ом |
| **Direct / Home** | актуальная paid Thing среди программы | Thing → literal offer | Home становится магазином |
| **Board** | paid Thing / Event может иметь literal CTA | только в контексте самой Thing | commercial ranking |
| **Event / QR** | ticket continuation / merch / preorder / next experience | physical context → exact handoff | потеря контекста после click |
| **Dementor-authored** | Method / Tool / Event / Course / Intervention | body of work → concrete offer | selling access to person |
| **Partner / Community** | Thing / Event / sponsored experience | relevant context → exact object | hidden ad / borrowed audience as generic funnel |
| **Sponsor-funded** | audience may receive free value | explicit funded context where relevant | sponsor revenue mistaken for user WTP |

Матрица не утверждает, что все перечисленные offers существуют.

Commercial availability всегда берётся из отдельного source-of-truth.

---

# 7. Search / Utility Economics

Search часто содержит самый ясный declared intent.

Но поисковый запрос не даёт права сразу эскалировать человека в платную услугу.

Правильная последовательность:

**QUERY / SITUATION → RELEVANT OBJECT → VALUE UNDERSTANDING → OFFER, IF VALID**

Особенно для contextual utility сохраняется `10`:

**USE THE SMALLEST SUFFICIENT INTERVENTION.**

Если бесплатной Thing / Method достаточно, Search не должен искусственно вести к paid human Intervention.

Commercial Search может быть сильным, когда query уже указывает на конкретный объект:

- билет;
- курс;
- инструмент;
- edition;
- конкретное событие;
- конкретный product name.

Канонически:

**SEARCH INTENT MAY JUSTIFY A COMMERCIAL ENTRY. IT DOES NOT JUSTIFY COMMERCIAL ESCALATION.**

---

# 8. Social Economics

Social может быть самостоятельным бесплатным experience.

Нельзя считать post unsuccessful только потому, что он не привёл к checkout.

Если существует paid Thing / Event / physical object, social может:

- показать самостоятельный fragment / proof;
- дать direct CTA к конкретному объекту;
- объяснить availability;
- вернуть к History / next Release.

Но нельзя:

- превращать каждый social post в lead magnet;
- скрывать цену до checkout ради CTR;
- вести на generic paid Membership;
- создавать fake scarcity;
- считать engagement willingness-to-pay.

Paid social особенно требует точной границы:

> **PAID REACH IS PURCHASED ATTENTION, NOT PROOF OF PRODUCT VALUE.**

---

# 9. Telegram Economics

Telegram в `12` — meaningful continuation, а не publication mirror.

Commercial сообщение уместно, когда paid availability является реальным изменением audience experience.

Например:

- Event открыл продажу билетов;
- вышла физическая edition;
- появился preorder уже знакомой Thing;
- конкретный Course / Tool действительно доступен;
- production support открылся вокруг понятной будущей Thing.

Не уместно:

- продавать что-то только потому, что канал давно не монетизировался;
- слать повторный checkout CTA без нового контекста;
- делать billing reminder заменой Return Loop;
- выдавать скидку за Programming Moment.

Канонически:

**COMMERCIAL AVAILABILITY MAY BE PART OF WHY-NOW. REVENUE NEED IS NOT WHY-NOW.**

---

# 10. Person-mediated Share

Когда один человек делится Thing с другим, основной trust source — сам отправитель.

Dementor не должен перехватывать этот social context и превращать его в generic sales funnel.

Правила:

- сохранять exact Entry Object;
- сохранять preview;
- если Thing paid — честно показать commercial condition;
- если Thing free — не вставлять обязательный unrelated offer перед experience;
- referral economics, если когда-либо используются, должны быть отдельным явным механизмом.

Канонически:

**A PERSONAL SHARE IS NOT FREE AD INVENTORY OWNED BY THE CLUB.**

---

# 11. Direct / Home / Board

## Direct / Home

Home остаётся обложкой программы.

Paid Things могут быть частью программы наравне с бесплатными, если editorially relevant.

Но:

**HOME ≠ STORE FRONT BY DEFAULT.**

Revenue priority не должна определять hero / ordering без отдельной commercial маркировки и редакционного основания.

## Board

Board может показать paid Thing и literal CTA.

Но:

**PAYMENT ≠ BOARD PRIORITY.**

Нельзя:

- повышать карточку за payment;
- смешивать sponsored placement с organic programming без disclosure;
- превращать Board в commercial ranking.

---

# 12. Event / Physical Economics

Event и physical context имеют естественный короткий handoff к transaction.

Примеры:

- Event page → ticket;
- Event venue → merch / edition;
- physical display → preorder;
- Event → следующий конкретный paid experience.

Здесь особенно важно буквальное fulfillment:

- цена;
- валюта;
- availability;
- место;
- время;
- capacity;
- delivery / pickup;
- refund / no-show terms, если применимо.

QR / short route не должны терять физический контекст.

Канонически:

**PHYSICAL CONTEXT MAY SHORTEN THE PATH TO PAYMENT. IT MAY NOT REDUCE TRANSACTION CLARITY.**

---

# 13. Dementor-authored Economics

Dementor discovery начинается с body of work / Practice / Situation context, а не с прайса.

Допустимый commercial path:

**AUTHORED THING / SITUATION → RELEVANT PRACTICE → CONCRETE VALUE OBJECT / ACTION → OFFER**

Не:

**PROFILE → PRICE LIST → BOOK A PERSON**

Paid authored products могут включать только реально утверждённые:

- Method;
- Tool;
- Course;
- Event;
- facilitated action;
- Intervention;
- physical / digital Thing.

Если Dementor сам распространяет коммерческий объект через личный канал, attribution авторства / commercial relation должна сохраняться.

Канонически:

**SELL THE VALUE OBJECT, NOT PROXIMITY TO THE PERSON.**

---

# 14. Partner / Sponsor Economics

Partner может быть:

- distribution source;
- acquisition channel;
- payer;
- sponsor;
- co-producer;
- referral source.

Это разные отношения.

Не смешивать их одной меткой `partner`.

Особенно важно:

## SPONSOR REVENUE ≠ USER WILLINGNESS TO PAY

Если partner оплачивает Event / Thing, а audience получает её бесплатно:

- это доказательство partner-funded model;
- это **не** доказательство, что audience заплатила бы ту же цену.

## PARTNER DISTRIBUTION ≠ EDITORIAL ENDORSEMENT

Если partner привёл аудиторию:

- source нужно сохранить;
- коммерческую relation раскрыть, если она materially relevant;
- partner не получает автоматический Programming priority.

## PARTNER ACQUISITION COST

Если за distribution платится flat fee / revshare / commission, это отдельный acquisition cost scope.

Не прятать его внутри sponsor revenue.

---

# 15. Paid Acquisition Gate

Перед тем как платить за acquisition, должны существовать минимум:

1. **валидный Value Object / Offer из 13A;**
2. **точный Entry Object из 12;**
3. **literal commercial terms;**
4. **working fulfillment path;**
5. **минимальное measurement definition;**
6. **budget / cost scope;**
7. **stop condition;**
8. **permission / compliance, если применяется персональная доставка;**
9. **понятный источник спроса, который мы хотим проверить.**

Paid acquisition допустим как маленький discovery experiment.

Но результаты надо интерпретировать правильно.

Например:

- click доказывает интерес к promise;
- checkout start — более сильный commercial intent;
- purchase — payment evidence;
- fulfillment + use — evidence delivered value;
- repeat — evidence of repeatable paid value.

Канонически:

**DO NOT BUY SCALE BEFORE YOU CAN NAME WHAT A SUCCESSFUL PAID ENCOUNTER IS.**

---

# 16. CAC

CAC не является обязательной метрикой для всего Dementor.

Он становится полезен там, где реально существует **paid acquisition**.

Рабочее определение:

## PAID CAC

```text
attributable acquisition spend
+
directly attributable acquisition fees / commissions
÷
new paying customers attributed to that paid acquisition scope
```

CAC считать:

- по конкретному offer / value object;
- по acquisition mode / campaign, когда возможно;
- на согласованном временном окне;
- без internal/test traffic.

Не включать автоматически в CAC:

- production cost самой Thing;
- fulfillment cost;
- общий редакционный overhead;
- fixed team cost;
- unrelated brand work.

Эти расходы могут быть важны для полной экономики, но должны жить отдельными cost buckets.

Канонически:

**ACQUISITION COST ≠ DELIVERY COST ≠ PRODUCTION COST.**

---

# 17. CPA и CAC — не одно и то же

Иногда campaign приводит не нового payer, а конкретное действие существующего человека.

Тогда полезнее:

## CPA / COST PER COMMERCIAL ACTION

Например cost per:

- valid booking;
- paid ticket;
- preorder;
- completed purchase;
- qualified intervention request.

`CPA` не надо автоматически называть `CAC`.

Если человек уже был payer, purchase не создаёт нового customer acquisition.

Канонически:

**NAME THE ECONOMIC EVENT YOU ACTUALLY MEASURED.**

---

# 18. Organic economics

Organic не означает free.

Но `13B` не должен искусственно распределять весь editorial overhead на каждую organic visit и выдавать это за CAC.

Поэтому:

- direct media spend = 0 может быть фактом;
- CAC = 0 без определённой cost model — не факт;
- editorial / production cost учитываются отдельно, если мы считаем contribution economics;
- organic path прежде всего сравнивается по quality / intent / payment evidence.

Канонически:

**NO MEDIA SPEND ≠ NO COST. UNKNOWN COST ≠ ZERO COST.**

---

# 19. Attribution

`12` уже разделяет transport attribution и semantic attribution.

`13B` добавляет commercial dimensions.

Минимально полезно уметь связать:

```text
distribution_trigger
acquisition_mode
source
channel
entry_object
value_object
offer
message_variant?
campaign / referral key?
commercial action
payment
fulfillment
```

Точные event names и implementation принадлежат `14`.

Главный принцип:

**ATTRIBUTION SHOULD BE GOOD ENOUGH FOR THE DECISION — NOT PRETEND TO BE PERFECT HISTORY.**

Разрешён результат:

`UNKNOWN`.

Запрещено:

- превращать unknown в organic;
- превращать unknown в zero-cost;
- присваивать paid campaign весь последующий lifetime пользователя без доказанного основания.

---

# 20. Attribution Windows

У Dementor не должно быть одного магического attribution window для всех value objects.

Контекст разный:

- Event ticket может иметь короткий decision cycle;
- preorder — более длинный;
- contextual Intervention может требовать deliberation;
- physical object может быть куплен после повторных встреч;
- recurring value вообще требует отдельного анализа.

Поэтому window задаётся на уровне commercial experiment / offer class.

Правила:

- окно объявляется до анализа, если это experiment;
- не расширяется задним числом ради красивой конверсии;
- direct return не обязательно должен «принадлежать» последнему ad click;
- explicit source / referral evidence может быть сильнее heuristic attribution;
- неизвестность допустима.

Канонически:

**ATTRIBUTION WINDOW IS A MEASUREMENT RULE, NOT PRODUCT TRUTH.**

---

# 21. Cost Model

Для каждой коммерческой гипотезы полезно разделять минимум четыре cost bucket.

## A. ACQUISITION COST

Стоимость доставки коммерческой встречи.

Например:

- ad spend;
- paid placement;
- affiliate commission;
- partner distribution fee.

## B. PAYMENT COST

Стоимость самого transaction layer.

Например:

- payment processor fee;
- platform commission;
- marketplace fee, если такая площадка реально используется.

## C. FULFILLMENT / DELIVERY COST

Стоимость исполнения обещания.

Например:

- venue variable cost;
- shipping;
- production per physical unit;
- human delivery time, если он действительно variable;
- external service usage per delivered Tool experience.

## D. PRODUCTION / FIXED COST

Стоимость создания и поддержания value object.

Она важна для полной business economics, но не является acquisition cost.

Канонически:

**DO NOT COLLAPSE ALL COSTS INTO CAC.**

---

# 22. Revenue Model

Revenue тоже нужно различать по природе.

Минимально:

- **user purchase revenue**;
- **recurring value revenue**, если реально существует;
- **production support / preorder**;
- **patronage / donation**;
- **partner / sponsor funding**;
- **company-paid contextual value**;
- **affiliate / referral revenue**, если существует.

Не смешивать их в один показатель «монетизация работает».

Особенно:

**SPONSOR FUNDING ≠ USER PURCHASE REVENUE.**

**PREORDER CASH ≠ FULFILLED REVENUE EVIDENCE.**

Для финансового accounting используются отдельные юридические/бухгалтерские правила; `13B` фиксирует только продуктовую семантику.

---

# 23. Contribution Economics

Когда достаточно данных, коммерческий path можно смотреть как:

```text
realized commercial value
-
attributable acquisition cost
-
transaction cost
-
variable fulfillment cost
=
contribution before fixed / production allocation
```

Это не является официальной accounting формулой клуба.

Это decision model для сравнения experiments / offers.

Если cost data неполна — так и указывать.

Нельзя публиковать «прибыльный канал», если часть materially relevant costs неизвестна.

---

# 24. LTV

LTV особенно опасен на ранней стадии, потому что легко превратить гипотетическое будущее в текущий факт.

До повторяемого paid behavior не канонизируем:

- «средний LTV участника»;
- lifetime paid Membership value;
- predicted recurring revenue;
- LTV:CAC как главный growth KPI.

Право на LTV появляется, когда:

- существует повторяемая paid value;
- повтор реально наблюдается;
- cohort definition имеет смысл;
- enough data exists для осмысленной оценки.

До этого главный факт:

**PURCHASE ≠ LIFETIME.**

Канонически:

**DO NOT INVENT LTV BEFORE REPEAT EXISTS.**

---

# 25. Discount / Promo Economics

Discount является свойством конкретного offer / commercial experiment.

Он не должен становиться:

- новой user tier;
- скрытой системой статуса;
- способом создать fake urgency;
- бесконечной «акцией»;
- заменой доказанной ценности.

Channel-specific price / code допустимы, если:

- условия буквальны;
- price truth не сфальсифицирована;
- нет fake crossed-out price;
- причина различия понятна операционно;
- fairness / disclosure соблюдены там, где materially relevant.

Важно учитывать discount как economic cost / reduced revenue, а не как бесплатный рост conversion.

Канонически:

**A DISCOUNT MAY CHANGE THE OFFER. IT DOES NOT CREATE THE VALUE.**

---

# 26. Referral / Affiliate Economics

Referral / affiliate model не является default механикой Dementor.

Если она появляется, необходимо определить:

- кто referrer;
- какое действие оплачивается;
- fixed fee или revenue share;
- attribution rule;
- window;
- self-referral rules;
- refund / cancellation effect;
- disclosure;
- suppression of abuse.

Referral не должен давать:

- editorial priority;
- higher Board rank;
- contributor preference;
- право называться author;
- скрытую рекламу.

Канонически:

**REFERRAL MAY REWARD DISTRIBUTION. IT MAY NOT PURCHASE EDITORIAL MEANING.**

---

# 27. Retargeting

Retargeting допустим только как продолжение **реального commercial context**, а не как способ преследовать любого Viewer-а.

Необходимы:

- допустимый legal / consent basis;
- конкретный value object;
- понятное исходное намерение;
- frequency discipline;
- suppression после purchase / cancellation / opt-out;
- отсутствие fake urgency;
- отсутствие notification debt.

Особенно осторожно с Situation / Intervention paths.

Нельзя переносить чувствительный или потенциально чувствительный контекст человека в ad targeting только потому, что система технически умеет это сделать.

Канонически:

**RETARGET THE VALUE CONTEXT, NOT THE PERSON’S VULNERABILITY.**

И наследуем `08`:

**RETURN FOLLOWS VALUE, NOT DEBT.**

---

# 28. Commercial Re-entry

После первого purchase допустимы следующие commercial re-entry только при реальном новом контексте:

- следующая edition;
- meaningful new Release;
- продолжение Course;
- новый Event той же линии;
- повтор Situation, где Tool / Method реально снова нужен;
- fulfilled preorder → next related Thing;
- естественная renewal точка recurring value.

Не:

- бесконечный upsell sequence;
- «вы уже покупали, поэтому купите ещё»;
- renewal без понятной recurring value;
- reactivation скидкой без продукта.

Канонически:

**COMMERCIAL RE-ENTRY NEEDS A NEW VALUE REASON.**

---

# 29. External Platform Economics

Если commercial transaction / distribution происходит через внешнюю платформу, нужно различать:

- platform fee;
- payment fee;
- ad spend;
- partner commission;
- delivery fee;
- taxes / withholding, если применимо — по отдельным legal/accounting rules.

Platform convenience не должна мутировать Product Model.

Например platform-specific purchase route не создаёт новый Form / Release State.

Commercial terms должны оставаться понятными независимо от platform.

---

# 30. Commercial Message Adaptation

`11` остаётся authority для promise / proof.

`12` адаптирует delivery по channel.

`13B` разрешает commercial adaptation только в пределах истины offer.

Можно адаптировать:

- CTA wording;
- price display format;
- campaign framing;
- promo code;
- media crop;
- short vs long offer explanation.

Нельзя адаптировать:

- реальную цену без изменения самого offer;
- availability;
- scarcity;
- refund / cancellation facts;
- authorship;
- seller/provider;
- scope entitlement;
- обещанный result.

Канонически:

**ADAPT THE COMMERCIAL PRESENTATION, NOT THE TRANSACTION TRUTH.**

---

# 31. Paid Amplification

Paid amplification может увеличить встречаемость Thing / Event / offer.

Она не может доказать:

- что Thing editorially важнее;
- что она должна попасть на Home;
- что Programming Moment существует;
- что аудитория органически хочет эту Thing;
- что paid Membership подтверждён;
- что high CTR означает delivered value.

Канонически:

**PAID AMPLIFICATION BUYS DISTRIBUTION. IT DOES NOT BUY MEANING.**

Если paid placement materially affects how audience interprets the message, commercial context должен быть обозначен согласно применимым правилам.

---

# 32. Experiment Model

Первый economic test должен быть маленьким и локальным.

Не тестировать сразу:

- весь Club;
- universal paid Membership;
- десять channels;
- множество offers;
- сложный attribution stack.

Хороший test:

```text
ONE VALUE OBJECT
+ ONE VALID OFFER
+ ONE OR FEW RELEVANT DISTRIBUTION PATHS
+ ONE CLEAR COMMERCIAL ACTION
+ CLEAR FULFILLMENT
+ PREDEFINED STOP / REVIEW POINT
```

До теста зафиксировать:

- hypothesis;
- target intent;
- value object / offer;
- acquisition mode;
- cost scope;
- commercial action;
- fulfillment definition;
- review point;
- anti-signal / kill condition.

Канонически:

**TEST THE EXCHANGE BEFORE BUILDING THE MACHINE AROUND IT.**

---

# 33. Commercial Metrics Semantics

`13B` определяет **что экономически означает сигнал**.

`14 · Metrics & Signals` определит:

- exact event names;
- instrumentation contract;
- dashboards;
- source exclusions;
- thresholds;
- reporting cadence.

Минимальные semantic группы `13B`:

## Qualified Commercial Entry

Человек встретил offer в релевантном context.

## Commercial Intent

Сделал явное действие в сторону exchange.

## Checkout / Payment Start

Начал transaction.

## Payment Success

Реальный payment подтверждён.

## Fulfillment

Обещанная paid value доставлена / доступна.

## Paid Value Usage

Человек реально использовал / пережил value.

## Refund / Failure

Paid promise не закрылся стандартным образом.

## Repeat Purchase by Value

Следующая самостоятельная покупка / повтор конкретной recurring value.

## Paid → Product Return

После exchange человек возвращается к Program / Things, а не только billing surface.

## Acquisition Cost

Только там, где cost scope определён.

## Contribution Economics

Только там, где достаточно revenue + cost data.

Канонически:

**REVENUE WITHOUT DELIVERY IS NOT PRODUCT SUCCESS.**

---

# 34. Internal / Test Traffic

Нельзя строить commercial economics на внутреннем использовании команды.

Для economic review должны быть по возможности исключены:

- внутренние тесты;
- QA sessions;
- admin/workspace flows;
- bot / crawler traffic;
- payment-provider callbacks;
- repeated developer testing;
- известные internal accounts, если analytics architecture позволяет исключение без нарушения privacy.

Это особенно важно на ранней стадии, когда небольшой объём команды способен полностью исказить conversion / CAC.

---

# 35. Anti-signals

Критические anti-signals `13B`:

- channel выбирается только потому, что у него самый высокий revenue per click;
- paid campaign ведёт не в тот Entry Object, который обещает message;
- paid traffic становится причиной Programming priority;
- sponsor-funded usage записывается как user willingness-to-pay;
- organic acquisition объявляется CAC=0 без cost model;
- unknown attribution записывается как organic;
- LTV придумано до repeat behavior;
- retargeting создаёт notification debt / FOMO;
- revenue растёт, fulfillment / Paid Value Usage падают;
- скидка становится главным value proposition;
- affiliate commission покупает editorial priority;
- Board / Home перестраиваются под highest-margin objects;
- paid media скрывает слабый first experience;
- CAC считается на internal/test traffic;
- acquisition cost смешивается с production cost;
- recurring revenue оптимизируется до recurring value;
- campaign ROI выглядит хорошо только потому, что часть costs исключили молча.

Главный anti-signal:

> **мы научились покупать или перенаправлять внимание, но не научились доставлять ценность после оплаты.**

---

# 36. Commercial Distribution QA

Перед запуском commercial distribution ответить:

1. **Какой конкретный Value Object продаётся?**
2. **Почему offer валиден по 13A?**
3. **Какой Distribution Trigger / intent / Entry Object по 12?**
4. **Acquisition mode: organic / paid / partner / referral / owned re-entry?**
5. **Совпадает ли commercial promise с Entry Object?**
6. **Что является commercial action?**
7. **Что является payment evidence?**
8. **Что является fulfillment?**
9. **Какой cost scope?**
10. **Какое attribution rule / window?**
11. **Что произойдёт при unknown attribution?**
12. **Какой stop / review condition?**
13. **Есть ли disclosure / permission requirements?**
14. **Не покупаем ли мы editorial priority?**
15. **Не превращается ли free experience в bait?**
16. **Что происходит после payment?**
17. **Какой anti-signal заставит остановить test?**

Если нельзя ответить на 1–8:

**COMMERCIAL DISTRIBUTION TEST ЕЩЁ НЕ ГОТОВ.**

---

# 37. Phase 0 — No New Commercial Infrastructure

Первый implementation slice `13B` не требует:

- universal attribution DB;
- ad-tech stack;
- CRM;
- retargeting platform;
- affiliate system;
- dynamic pricing engine;
- LTV dashboard;
- marketing automation suite.

Нужно взять 2–3 реальных commercial hypotheses, когда они действительно существуют, и поверх routing из `12` выразить:

```text
value_object
offer
payer_model
distribution_trigger
acquisition_mode
source / channel
entry_object
commercial_action
payment evidence
fulfillment
cost scope
attribution rule
```

Сначала вручную / config-level.

Автоматизация — только после повторяющегося use case.

---

# 38. Boundary with `14 · Metrics & Signals`

`13B` не фиксирует технические event names.

Он задаёт semantic questions:

- было ли commercial entry релевантным;
- какой offer встретил человек;
- какой acquisition mode;
- был ли intent;
- состоялся ли payment;
- доставлена ли value;
- что стоило acquisition;
- повторилась ли paid value;
- вернулся ли человек в продукт после покупки.

`14` должен превратить эти вопросы в:

- instrumentation;
- events / properties;
- source-quality rules;
- exclusions;
- dashboard dimensions;
- review cadence.

Канонически:

**13B DEFINES ECONOMIC MEANING. 14 DEFINES MEASUREMENT IMPLEMENTATION.**

---

# 39. Boundary with `08 · Return Loops`

Commercial re-entry не создаёт отдельную retention philosophy.

Сохраняется:

**RETURN FOLLOWS VALUE, NOT DEBT.**

Payment может создать legitimate expectation:

- delivery;
- Event;
- next Course unit;
- preorder Release;
- Tool access;
- agreed intervention next step;
- actual recurring value renewal.

Но:

- billing reminder ≠ product payoff;
- retargeting ≠ Return Loop;
- discount ≠ reason to belong;
- renewal ≠ value evidence без usage.

---

# 40. Boundary with Programming

Revenue / margin / CAC не создают Programming Moment.

High-performing commercial object может оставаться editorially неактуальным.

Low-margin или free Thing может быть центральной вещью программы.

Канонически:

**PROGRAM PRIORITY ≠ REVENUE PRIORITY.**

И:

**PAID ACQUISITION MAY AMPLIFY A VALID COMMERCIAL PATH. IT MAY NOT BECOME THE REASON THE CLUB TALKS ABOUT IT.**

---

# Canonical summary

`13A` отвечает:

> **За какую реальную ценность здесь уместно платить?**

`13B` отвечает:

> **Экономически оправдан ли путь, через который человек встречает этот валидный offer, и остаётся ли продукт здоровым после payment?**

Главная связка:

```text
11
PROMISE / PROOF

→

12
DISTRIBUTION TRIGGER / INTENT / ENTRY OBJECT / EXPERIENCE

→

13A
VALUE OBJECT / OFFER / PAYMENT / FULFILLMENT

→

13B
ACQUISITION MODE / ATTRIBUTION / COST / COMMERCIAL EVIDENCE

→

14
INSTRUMENTATION / DASHBOARDS / SIGNAL QUALITY
```

Главные правила:

**CHANNEL ECONOMICS MAY SELECT BETWEEN VALID PATHS. IT MAY NOT INVENT THE VALUE.**

**COMMERCIAL OPTIMIZATION HAPPENS INSIDE A VALID DISTRIBUTION PATH — NOT INSTEAD OF IT.**

**PAID AMPLIFICATION BUYS DISTRIBUTION. IT DOES NOT BUY MEANING.**

**ACQUISITION COST ≠ DELIVERY COST ≠ PRODUCTION COST.**

**SPONSOR REVENUE ≠ USER WILLINGNESS TO PAY.**

**UNKNOWN ATTRIBUTION ≠ ZERO-COST ACQUISITION.**

**DO NOT INVENT LTV BEFORE REPEAT EXISTS.**

**RETARGET THE VALUE CONTEXT, NOT THE PERSON’S VULNERABILITY.**

**REVENUE WITHOUT DELIVERY IS NOT PRODUCT SUCCESS.**

И главный тест:

> **Если убрать paid traffic, discount и attribution tricks, остаётся ли самостоятельная ценность, точный offer и человек, который после оплаты получает обещанное?**

Если нет — проблема не в Distribution Economics.
