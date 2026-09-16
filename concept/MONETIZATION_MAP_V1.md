# DEMENTOR CLUB — MONETIZATION MAP v1

Status: **WORKING CANON / monetization authority**  
Updated: **2026-09-15**

## Authority scope

Этот документ определяет, **где и на каком основании деньги могут естественно появляться в Dementor Club, не становясь причиной существования клуба и не превращая продукт в membership ladder, expert marketplace или sales funnel**.

Он является authority для:

- типов платной ценности;
- связи payment с конкретным value object / action;
- payer / user distinctions;
- границы free / paid;
- роли Membership;
- partner / sponsor funding;
- pricing / terms discipline;
- editorial firewalls;
- monetization anti-patterns;
- product-level monetization metrics and QA.

Документ опирается на:

- `concept/VALUE_ARCHITECTURE_V1.md` — какая самостоятельная ценность уже существует до monetization;
- `concept/PRODUCT_MODEL_V1.md` — Thing / Release / Project / Participation / History;
- `concept/DEMENTOR_INTERVENTION_MODEL_V1.md` — contextual utility, Practice и paid intervention boundary;
- `concept/CONTENT_PROGRAMMING_MODEL_V1.md` — почему Thing находится в программе сейчас;
- `concept/RETURN_LOOPS_V1.md` — почему человек возвращается;
- `concept/CONTRIBUTION_MODEL_V1.md` — editorial inbound и credit boundaries;
- `concept/MARKETING_POSITIONING_MESSAGING_V1.md` — promise / proof / literal commercial messaging;
- `concept/DISTRIBUTION_MODEL_V1.md` — routing / discovery authority;
- `concept/MONETIZATION_DISTRIBUTION_ECONOMICS_V1.md` — companion authority для channel / acquisition economics.

Он **не определяет**:

- конкретные цены, если они не утверждены отдельным source-of-truth;
- коммерческую availability конкретной Thing / Event / Course / Dementor;
- checkout provider / payment processor;
- налоги / юридические условия;
- refund policy конкретного продукта;
- channel economics / CAC / attribution windows / paid acquisition mechanics — это `13B · Distribution Economics`;
- exact event names, analytics instrumentation, dashboards, thresholds и reporting cadence — это `14 · Metrics & Signals` / implementation.

Каноническая граница:

**VALUE ARCHITECTURE DEFINES VALUE. MONETIZATION DEFINES WHEN PAYMENT IS A VALID EXCHANGE FOR THAT VALUE.**

Главная формула:

**VALUE OBJECT → PAYER → MOMENT OF NEED → OFFER → PAYMENT → DELIVERY → AFTERLIFE**

Главные guardrails:

**MONETIZATION FOLLOWS VALUE.**

**PAYMENT ATTACHES TO A CONCRETE VALUE OBJECT / ACTION — NOT TO HIGHER STATUS.**

**FREE VS PAID IS A PROPERTY OF THE VALUE OBJECT / OFFER — NOT OF THE PERSON.**

**PAYMENT ≠ EDITORIAL PRIORITY.**

**DO NOT INVENT A SUBSCRIPTION BEFORE A RECURRING VALUE EXISTS.**

---

# 0. Главный принцип

Dementor Club не должен строить ценность как лестницу:

```text
Viewer
→ Member
→ Paid Member
→ Premium Member
→ Dementor
```

Это противоречит Value Architecture.

Человек может:

- бесплатно посмотреть десять Things;
- купить один билет на Event;
- никогда не вступать в Membership;
- через год купить Physical Thing;
- бесплатно принести Observation;
- получить бесплатный Method;
- заплатить за конкретный Tool;
- участвовать в Project бесплатно;
- никогда не становиться «более высоким уровнем пользователя».

Все эти траектории валидны.

Канонически:

**PAYMENT IS A TRANSACTION AROUND VALUE, NOT A MATURITY LEVEL.**

---

# 1. Монетизация не является центром Product Model

Dementor начинается с:

**THING WORTH ATTENTION**

затем:

**PROGRAM WORTH RETURNING TO**

и только в конкретной ситуации:

**PAID VALUE WORTH PAYING FOR**

Нельзя перестраивать программу так, чтобы каждый бесплатный experience существовал только как верхушка monetization funnel.

Free Thing может быть полностью законченной ценностью.

Paid Thing может быть полностью законченной ценностью.

Одна не обязана быть teaser другой.

Канонически:

**FREE VALUE MAY CLOSE THE LOOP.**

И:

**PAID VALUE MUST STAND ON ITS OWN.**

---

# 2. Value Object

Платёж всегда должен прикрепляться к достаточно ясному value object или конкретному action.

Рабочие value-object классы v1:

- **Thing**;
- **Release / Edition**;
- **Event**;
- **Course / Program experience**;
- **Method**;
- **Tool**;
- **Intervention / facilitated action**;
- **Physical Object / Merch**;
- **Project-specific Experience / Output**;
- **Recurring Value Package / Membership**, только если повторяемая ценность доказана;
- **Production Support**, когда человек платит за появление будущей Thing;
- **Partner / Sponsor Package**, когда payer отличается от user.

Этот список не утверждает, что все эти объекты должны быть платными.

Он только задаёт валидные места, где коммерческий обмен **может** существовать.

---

# 3. Пять причин денег

Монетизацию полезно классифицировать не по типу аккаунта, а по тому, **за что именно происходит обмен**.

## A. ACCESS

Платёж за доступ к конкретному experience.

Примеры:

- Event ticket;
- Course access;
- paid Game / digital Thing;
- project-specific experience.

Ключевой вопрос:

> **Что именно становится доступно после оплаты?**

Не должно быть ответа:

> «больше клуба».

Нужен конкретный объект / experience.

---

## B. OWNERSHIP

Платёж за владение конкретной вещью / экземпляром / edition.

Примеры:

- physical object;
- merch;
- printed edition;
- collectible / limited object;
- downloadable owned asset, если такая модель реально используется.

Ключевой вопрос:

> **Что становится моим?**

---

## C. INTERVENTION

Платёж за конкретное действие в конкретной Situation.

Примеры:

- facilitated session;
- consultation, если формат реально утверждён;
- Method implementation;
- Tool применительно к ситуации;
- Course, если ситуации нужен последовательный опыт.

Этот слой наследует `10`:

**USE THE SMALLEST SUFFICIENT INTERVENTION.**

Нельзя искусственно эскалировать:

```text
free Thing
→ call
→ paid call
→ course
→ premium program
```

если меньшего resource достаточно.

---

## D. PRODUCTION SUPPORT

Платёж помогает Thing / Release появиться.

Примеры:

- preorder;
- crowdfunding;
- advance purchase;
- patronage вокруг конкретной работы;
- sponsor funding;
- partner underwriting.

Здесь человек может платить **до** Release.

Поэтому promise требует особой дисциплины:

- что именно пытаются сделать;
- что уже существует;
- что человек получит / не получит;
- что произойдёт, если Thing не выйдет;
- является ли payment purchase, donation, preorder или sponsorship.

Не маскировать uncertainty.

---

## E. CONTINUITY / RECURRING VALUE

Платёж за реальную повторяемую ценность во времени.

Это единственное основание для subscription / Membership economics.

Не достаточно:

- «быть внутри»;
- badge;
- статус;
- закрытый чат сам по себе;
- обещание proximity к Dementors;
- неопределённый доступ к будущему.

Нужен повторяемый value package, который можно назвать без слова `membership`.

Канонический Membership test:

> **Если убрать слово “членство”, остаётся ли конкретная повторяемая ценность, за которую человек рационально может платить регулярно?**

Если нет:

**NO RECURRING OFFER YET.**

---

# 4. Free vs Paid

Free / paid нельзя приклеивать к человеку как к уровню.

Неверно:

```text
free user
paid user
premium user
```

как продуктовая ontology Dementor.

Допустимо использовать billing terminology технически, если инфраструктуре это необходимо, но оно не должно определять product identity человека.

Канонически:

**FREE VS PAID IS A PROPERTY OF THE VALUE OBJECT / OFFER — NOT OF THE PERSON.**

Например один и тот же человек может одновременно иметь:

- free access к Program;
- paid Event ticket;
- free Participation;
- paid Tool;
- free Contribution entry;
- preorder Physical Thing.

---

# 5. Payer ≠ User

Монетизация не должна предполагать, что payer всегда совпадает с человеком, который получает experience.

Минимальные модели:

## USER = PAYER

Человек покупает конкретную ценность для себя.

Примеры:

- билет;
- Tool;
- Course;
- Physical Thing.

## COMPANY = PAYER, PERSON / TEAM = USER

Организация оплачивает contextual Intervention / Event / Course / Tool для команды.

Это не превращает Dementor в B2B consultancy по умолчанию.

Просто payer другой.

## PARTNER = PAYER, AUDIENCE = USER

Partner финансирует Thing / Event / Program experience, а аудитория получает value бесплатно или дешевле.

## COLLECTIVE = PAYER

Несколько людей финансируют появление Thing / Release.

Например crowdfunding / preorder pool.

## GIFT PAYER

Один человек оплачивает конкретный value object другому.

Необязательный v1 capability, но модель не должна его запрещать.

---

# 6. Payer не покупает редакционную власть

Критический firewall:

**PAYMENT ≠ EDITORIAL PRIORITY**

Нельзя продавать:

- попадание Thing в Editorial Program как editorial endorsement;
- положительный editorial disposition Contribution;
- роль Dementor;
- более высокий Content / DC9 status;
- favorable History;
- ranking в Board как editorial choice;
- право считать sponsored object органически отобранной Thing;
- авторство;
- редакционную реакцию с заранее заданным результатом.

Commercial placement / sponsorship, если когда-либо существует, должен быть **явно обозначен как commercial / partner context** и не притворяться редакционным фактом.

Канонически:

**MONEY MAY FUND A THING. MONEY MAY NOT RETROACTIVELY BECOME THE REASON THE THING IS GOOD.**

---

# 7. Payment ≠ Programming Moment

Факт покупки или появления paid offer не создаёт автоматически Programming Moment.

Неверно:

```text
price added
→ Program updated
```

Правильно:

```text
meaningful Thing / Release / Event / History
→ editorial Programming decision
```

Commercial availability может быть частью why-now только если она реально меняет audience experience.

Например:

> вышел первый physical edition, который теперь можно купить.

Но:

> мы добавили checkout

само по себе не Programming Moment.

---

# 8. Payment ≠ Release

Оплата и Release — независимые понятия.

Thing может быть:

- free + unreleased;
- paid + unreleased preorder;
- free + released;
- paid + released;
- sponsored + free for audience;
- funded + later released publicly.

Release по-прежнему определяется audience availability самостоятельного experience.

Price не определяет lifecycle Thing.

---

# 9. Access и entitlement

Коммерческий слой может создавать entitlement:

> человек имеет право получить конкретный experience / object / service.

Entitlement должен быть буквальным и ограниченным конкретным offer.

Он не должен автоматически означать:

- Membership;
- доступ ко всему клубу;
- доступ ко всем Dementors;
- priority Contribution review;
- право на future products;
- unrestricted Community access;
- permanent status.

Канонически:

**ENTITLEMENT SCOPE MUST MATCH THE OFFER SCOPE.**

---

# 10. Thing monetization

Thing может быть платной, если сама самостоятельная Thing имеет коммерческую ценность.

Примеры:

- paid Game;
- digital authored product;
- edition;
- publication;
- physical Thing.

Требование:

> человек должен понимать, **что именно он покупает**, а не платить за обещание «Dementor experience» вообще.

Thing может также быть бесплатной даже при высокой производственной стоимости.

Способ финансирования не обязан совпадать с access model.

Например sponsor может покрыть производство, а access остаётся free.

---

# 11. Event monetization

Event — естественный standalone value object.

Возможные модели:

- free;
- paid ticket;
- pay-what-you-want, если сознательно утверждено;
- partner-funded free access;
- invitation / eligibility without payment;
- ticket bundled into recurring value package, если такой package доказан.

Commercial copy должна буквально сообщать:

- цену;
- валюту;
- что входит;
- дату / время / место;
- eligibility;
- capacity, если релевантно;
- refund / transfer terms, если утверждены.

Шутка не может скрывать transaction terms.

---

# 12. Course / Program monetization

Source ontology остаётся:

`PROGRAM` entity

с `program_type`, например Course.

Monetization не меняет source type.

Course / Program может быть платным, если ценность состоит в последовательном experience.

Не продавать Course только потому, что short Method можно растянуть на пять модулей.

Канонический тест:

> **Последовательность действительно создаёт дополнительную ценность по сравнению с меньшим Intervention?**

Если нет — не превращать Method в Course ради price point.

---

# 13. Method monetization

Method может быть:

- free public Method;
- paid standalone Method;
- частью Tool;
- частью Course;
- частью human Intervention.

Цена не делает Method более «настоящим».

Free Method не должен быть заведомо неполным teaser по умолчанию.

Если платный Method продаётся отдельно, он должен иметь самостоятельную delivery form и понятный use case.

---

# 14. Tool monetization

Tool платен, если существует конкретная полезная функция / опыт, который человек может получить.

Необходимы:

- ясная Situation / job;
- что Tool делает;
- что он не делает;
- access / ownership terms;
- duration, если временно;
- data / privacy implications, если они существуют.

Tool не должен быть искусственной SaaS-оболочкой вокруг одного совета только ради recurring billing.

---

# 15. Human Intervention monetization

Human Intervention — не default commercial endpoint каждого пути.

Платная human action допустима, если:

- context действительно индивидуален;
- меньшего resource недостаточно;
- у Dementor есть релевантная Practice;
- сам формат утверждён и доступен;
- scope действия понятен;
- нельзя ошибочно прочитать offer как обещание гарантированного результата.

Нельзя продавать:

> доступ к личности Dementor сам по себе.

Правильный объект:

> **конкретное действие / формат вокруг конкретного класса ситуаций.**

Канонически:

**PAY FOR THE ACTION, NOT FOR PROXIMITY TO THE PERSON.**

---

# 16. Physical Object / Merch

Physical Thing может монетизироваться через ownership.

Dementor Merch не обязан быть generic branded merchandise.

Сильный physical object:

- является самостоятельной Thing;
- продолжает клубный взгляд;
- может иметь cultural / comic / functional value;
- не требует Membership для легитимности.

Коммерческие факты должны быть буквальными:

- цена;
- variant / size, если есть;
- stock / availability;
- delivery / pickup;
- material / production facts, если заявлены.

---

# 17. Project-specific monetization

Project сам по себе не обязан быть paid product.

Деньги прикрепляются к конкретному value object, который Project произвёл или обеспечивает.

Например:

- Event;
- Game;
- physical edition;
- Workshop;
- Tool;
- Release;
- preorder;
- sponsor package;
- project-specific experience.

Не:

> заплати за «доступ к Project»

если непонятно, какая самостоятельная ценность возникает после оплаты.

---

# 18. Participation и деньги

Participation Opportunity и commercial offer — разные сущности.

Человек может:

- бесплатно участвовать;
- платить за Event, внутри которого есть Participation;
- получать compensation за вклад;
- участвовать как volunteer, если это ясно и уместно;
- покупать Thing и затем добровольно участвовать в testing;
- получать free access в обмен на реальное действие только если условия явно названы и этически уместны.

Нельзя автоматически считать платящего человека Participant.

И нельзя автоматически превращать Participation в unpaid labor funnel.

Канонически:

**PAYMENT DOES NOT CREATE PARTICIPATION. PARTICIPATION DOES NOT IMPLY FREE LABOR.**

---

# 19. Contribution и деньги

Contribution остаётся editorial inbound.

Нельзя продавать:

- право на editorial look как способ купить favorable outcome;
- guaranteed publication;
- guaranteed Programming Moment;
- авторство;
- статус Dementor.

Если когда-либо существует paid professional service вокруг материала, он должен быть **отдельным явным value object**, а не скрытым условием Contribution path.

Канонически:

**CONTRIBUTION IS NOT A PAY-TO-PUBLISH PIPELINE.**

---

# 20. Membership

Membership — самый опасный объект для преждевременной монетизации, потому что легко спутать:

- ценность;
- принадлежность;
- статус;
- доступ;
- recurring revenue desire.

Membership может стать paid only if существует самостоятельный повторяемый value package.

Рабочие потенциальные типы recurring value, которые **могут** когда-либо обосновать paid Membership, если реально утверждены:

- recurring physical access / club infrastructure;
- понятный набор recurring Events;
- periodic edition / physical package;
- recurring Practice / facilitated format;
- конкретный bundle доступов, который повторяется и реально используется;
- другая самостоятельная recurring utility.

Не являются достаточным основанием сами по себе:

- badge;
- «быть среди своих»;
- private chat;
- generic networking;
- статус;
- приоритет внимания;
- vague access to Dementors;
- «поддержать проект» без ясной модели patronage;
- страх потерять доступ к бесплатной Program.

Канонический тест:

**REMOVE THE WORD “MEMBERSHIP”. IS THE RECURRING VALUE STILL CLEAR?**

Если нет — не запускать recurring payment как продуктовый default.

---

# 21. Patronage / Support

Поддержка клуба как такового возможна, но должна называться честно.

Если человек платит не за entitlement, а чтобы поддержать существование / производство:

это:

- patronage;
- donation;
- sponsorship;
- support.

Не нужно притворяться purchase.

И наоборот, purchase нельзя маскировать под donation, если существует обязательная встречная ценность.

Канонически:

**NAME THE EXCHANGE TRUTHFULLY.**

Patronage не должно покупать editorial control.

---

# 22. Partner / Sponsor funding

Partner / sponsor может быть payer, а audience — user.

Это валидная модель, особенно для:

- Event;
- physical production;
- research / experiment;
- edition;
- public Tool;
- large Thing / Project output.

Но нужны firewalls.

Partner funding не должно автоматически означать:

- editorial endorsement partner-а;
- скрытую рекламу;
- изменение History;
- ложный organic Programming reason;
- обязательное положительное изображение sponsor-а;
- ownership аудитории / contributor data без отдельного основания.

Commercial relation должна быть обозначена там, где это materially relevant для понимания audience.

Канонически:

**SPONSORSHIP MAY FUND THE EXPERIENCE. IT MUST NOT COUNTERFEIT EDITORIAL INDEPENDENCE.**

---

# 23. Pricing discipline

`13` не устанавливает конкретные цены.

Но pricing должен следовать буквальной коммерческой логике.

Любое paid offer должно уметь ответить:

- сколько стоит;
- в какой валюте;
- за что именно платёж;
- разовый он или recurring;
- когда списывается;
- что человек получает;
- как долго действует entitlement;
- какие ограничения;
- что происходит при cancellation / no-show / failed delivery, если это релевантно;
- кто является seller / provider, если это необходимо указать.

Юмор может жить вокруг offer.

Transaction terms должны оставаться literal.

Канонически:

**JOKE AROUND THE OFFER. LITERAL TERMS INSIDE THE TRANSACTION.**

---

# 24. No fake scarcity

Scarcity допустима, если она реальна:

- физический тираж ограничен;
- Event venue имеет capacity;
- human Intervention имеет реальную availability;
- конкретное временное окно действительно существует.

Нельзя производить fake urgency:

- «осталось 2 места», если это не факт;
- бесконечный countdown;
- искусственно закрывать free value;
- создавать FOMO вместо реальной причины купить.

Канонически:

**SCARCITY MUST BE A FACT, NOT A RETENTION MECHANIC.**

---

# 25. Commercial CTA

CTA должен называть transaction / value action.

Предпочтительно:

- Купить билет;
- Купить Thing / edition;
- Забронировать конкретный формат;
- Получить доступ к Course;
- Предзаказать;
- Поддержать выпуск;
- Купить Tool;
- Оплатить участие;
- Выбрать session, если такой формат действительно существует.

Слабее:

- Upgrade;
- Go Premium;
- Unlock Dementor;
- Become Pro;
- Level Up;
- Join Inner Circle;

если реальная ценность может быть названа буквально.

Канонически:

**NAME THE VALUE, NOT THE STATUS.**

---

# 26. Checkout не должен объяснять продукт

К моменту payment человек уже должен понимать:

- что это за value object;
- почему он ему нужен;
- что произойдёт после оплаты.

Checkout не должен впервые объяснять:

> «что вообще такое этот Course / Event / Tool».

Marketing / Thing / Intervention surface создаёт understanding.

Checkout подтверждает terms и завершает exchange.

---

# 27. Afterlife paid value

Платёж не заканчивает product relationship автоматически.

После delivery может появиться:

- Release History;
- meaningful continuation;
- utility Return Loop;
- Event History;
- новая версия;
- support / operational follow-up;
- Participation Opportunity;
- related free Thing;
- другая paid value только если реально релевантна.

Не строить compulsory upsell chain.

Канонически:

**AFTER PAYMENT, RETURN TO PRODUCT SEMANTICS — NOT TO A SALES LADDER.**

---

# 28. Refund / failure / cancellation semantics

Paid value имеет право не состояться, особенно Event / preorder / production support.

Но коммерческое обещание обязано закрываться.

При failure человек должен получить literal outcome согласно утверждённым terms:

- refund;
- reschedule;
- alternative delivery;
- cancellation;
- honest status.

History может редакционно показать, что Thing / Project не получились.

Но History не заменяет коммерческое fulfillment obligation.

Канонически:

**EDITORIAL HONESTY DOES NOT REPLACE TRANSACTIONAL OBLIGATIONS.**

---

# 29. Monetization matrix v1

| Value object | Основная причина платежа | Возможный payer | Delivery | Natural return / afterlife | Главный риск |
|---|---|---|---|---|---|
| **Thing** | Access / ownership | Person / gift payer / sponsor | Digital / physical experience | History / new Release | paywall before proof |
| **Event** | Access | Person / company / sponsor | attendance / event experience | Event History / next Event only if meaningful | FOMO / unclear terms |
| **Course / Program** | Access / sequential utility | Person / company | structured experience | Utility / authored work | stretching small Method into course |
| **Method** | Utility / implementation | Person / company | standalone method / material / action | Utility return | paid branding of generic advice |
| **Tool** | Utility | Person / company / sponsor | usable tool | reuse when Situation returns | fake SaaS / recurring billing without recurring value |
| **Human Intervention** | Concrete action | Person / company | facilitated action / session | contextual return | selling proximity / expert marketplace |
| **Physical / Merch** | Ownership | Person / gift payer / sponsor | object | Thing History / editions | generic merch detached from program |
| **Project output** | Access / ownership | Person / company / sponsor | concrete Release / Event / object | History / continuation | charging for vague project access |
| **Production Support** | Make future Thing possible | Person / collective / sponsor | promised future outcome / support relation | Release / closure | hiding uncertainty / unclosed promise |
| **Recurring Value / Membership** | Continuity | Person / company in specific cases | repeated concrete package | recurring value loop | status subscription without recurring value |
| **Partner / Sponsor package** | Funding / association / access depending contract | Organization | funded experience / agreed partner value | project / program outcome | editorial capture / hidden ads |

Эта матрица задаёт semantic possibilities, а не утверждённый commercial catalog.

---

# 30. Offer QA

Перед созданием paid offer ответить:

1. **Какой конкретный value object / action продаётся?**
2. **Какая самостоятельная ценность уже существует до checkout?**
3. **Почему payment уместен именно здесь?**
4. **Кто payer? Кто user?**
5. **Что получает payer / user после оплаты?**
6. **Это access, ownership, intervention, production support или recurring value?**
7. **Можно ли назвать offer без слов Premium / Membership / Exclusive?**
8. **Не продаём ли мы статус вместо value?**
9. **Не покупает ли payer editorial priority?**
10. **Не превращаем ли free value в искусственный teaser?**
11. **Не существует ли меньшего достаточного бесплатного / дешёвого Intervention?**
12. **Понятны ли price / terms буквально?**
13. **Есть ли реальная scarcity или мы создаём FOMO?**
14. **Как закрывается failure / cancellation?**
15. **Что происходит после delivery?**
16. **Нужен ли recurring payment или мы просто хотим recurring revenue?**

Если нельзя назвать value object:

**НЕ СОЗДАВАТЬ PAID OFFER.**

---

# 31. Metrics

`13` не устанавливает финансовую модель компании целиком, но monetization health нельзя оценивать только revenue.

Нужны как минимум:

## Paid Value Usage

Получил / использовал ли человек то, за что заплатил?

## Fulfillment Rate

Доставляется ли обещанная ценность?

## Refund / Failure Rate

Где paid promise ломается?

## Repeat Purchase by Value

Возвращается ли человек к другому самостоятельному value object без forced subscription?

## Free → Paid Relevance

Если free experience приводит к paid, был ли paid offer действительно контекстно релевантен?

Это не universal funnel conversion KPI.

## Paid → Product Return

Возвращается ли человек в Program / Things после покупки, а не только в billing surface?

## Revenue Concentration by Object

Какие value objects реально несут economic value?

## Membership Value Usage

Если recurring product существует: пользуются ли его конкретной повторяемой ценностью?

Не достаточно:

> subscription active.

## Sponsor / Partner Integrity

Не ухудшает ли funding editorial trust / program quality?

---

# 32. Anti-signals

Критические anti-signals:

- paid tier становится «настоящим Dementor»;
- Membership используется как обязательный gateway к первой ценности;
- free Things существуют только как bait;
- весь contextual utility превращается в lead generation;
- каждый Dementor автоматически получает booking page;
- Intervention всегда escalates к paid human action;
- Course создаётся из маленького Method ради price point;
- Tool существует только ради subscription;
- paid user получает editorial priority;
- Contribution превращается в pay-to-publish;
- Project selling precedes a concrete value object;
- Board ranking становится commercial ranking;
- sponsor content маскируется под organic editorial choice;
- pricing / availability скрываются за юмором;
- fake scarcity;
- recurring billing появляется раньше recurring value;
- revenue растёт, но paid value usage / fulfillment падают;
- человек не может объяснить, за что именно он заплатил кроме «членства».

Главный anti-signal:

> **деньги начинают объяснять структуру клуба лучше, чем Things и программа.**

---

# 33. 13A / 13B authority split

После завершения `12 · Distribution Model` пункт `13` состоит из двух согласованных authority-слоёв.

## 13A — Monetization Architecture

Этот документ отвечает:

> **За какую конкретную ценность здесь вообще уместно платить?**

Он определяет:

- value object;
- payer / user;
- free / paid boundary;
- offer semantics;
- Membership test;
- pricing / fulfillment discipline;
- sponsor / editorial firewall.

## 13B — Distribution Economics

`concept/MONETIZATION_DISTRIBUTION_ECONOMICS_V1.md` отвечает:

> **Когда paid value уже существует, как оценивать экономику её доставки через уже валидный distribution path?**

`13B` владеет:

- channel × value-object fit;
- acquisition mode;
- commercial CTA fit by path;
- Paid CAC / CPA semantics;
- attribution windows;
- paid acquisition economics;
- retargeting guardrails;
- referral / affiliate economics;
- partner acquisition economics;
- discounts / campaign economics;
- external platform fees where they materially exist.

Каноническая связка:

```text
11
MESSAGE / PROMISE / PROOF

→

12
DISTRIBUTION TRIGGER / ROUTING / ENTRY OBJECT

→

13A
VALID VALUE / OFFER / PAYMENT SEMANTICS

→

13B
COMMERCIAL ATTRIBUTION / CHANNEL ECONOMICS

→

14
OBSERVABILITY / METRICS / SIGNALS
```

При этом особенности канала **не имеют права переписывать 13A**.

Канонически:

**PAID DISTRIBUTION DOES NOT CREATE PRODUCT VALUE.**

---

# 34. Boundary with 14 · Metrics & Signals

`13` определяет **экономический смысл** того, что имеет значение.

Например:

- что считать paid value;
- что такое fulfillment;
- где Paid CAC вообще имеет смысл;
- почему CPA не равен CAC;
- почему sponsor revenue не доказывает user willingness-to-pay;
- почему repeat purchase нельзя подменять recurring billing.

`14 · Metrics & Signals` определяет, **как эти понятия наблюдать и измерять**:

- event names;
- payload / counting semantics;
- internal / test traffic exclusions;
- attribution instrumentation;
- windows для конкретных measurement questions;
- dashboards;
- baselines;
- thresholds / alerts;
- reporting cadence.

Граница:

**13 DEFINES ECONOMIC MEANING. 14 DEFINES OBSERVABILITY.**

`14` не решает, что продавать, и не создаёт monetization hypothesis только потому, что её легко измерить.

`13` не должен изобретать event schema или numeric targets вместо Metrics authority.

---

# 35. Boundary with Marketing Positioning

`11` отвечает:

> **Что обещаем и чем доказываем.**

`13` отвечает:

> **В каком месте этого value exchange уместен payment и что именно продаётся.**

Marketing не должен придумывать paid value, которой Product / Monetization Model не подтверждает.

Paid messaging наследует:

**PROMISE MUST BE SMALLER THAN OR EQUAL TO REAL PRODUCT VALUE.**

И:

**NAME THE VALUE, NOT THE STATUS.**

---

# 36. Boundary with Dementor / Intervention

`10` отвечает:

> **Что релевантно конкретной Situation и какой минимально достаточный resource / action нужен.**

`13` отвечает:

> **Является ли этот конкретный resource / action платным, почему и на каких условиях.**

Сначала contextual fit.

Потом commercial condition.

Не наоборот.

Канонически:

**RELEVANCE BEFORE COMMERCIALITY.**

---

# 37. Boundary with Program

`07` остаётся authority по вопросу:

> **почему это важно сейчас?**

Revenue не является Programming reason сам по себе.

High-margin Thing не обязана получать место в актуальной программе.

Free Thing не является editorially второсортной.

Канонически:

**PROGRAM PRIORITY ≠ REVENUE PRIORITY.**

---

# 38. Boundary with Return Loops

`08` остаётся authority:

**RETURN FOLLOWS VALUE, NOT DEBT.**

Paid purchase может создать legitimate return expectation:

- Event скоро состоится;
- preorder выйдет;
- Course продолжится;
- новая версия purchased Tool доступна;
- intervention имеет согласованный next step.

Но billing / renewal notification не должен становиться главным retention loop продукта.

Recurring payment должен следовать recurring value.

Не наоборот.

---

# Canonical summary

Dementor Club может зарабатывать деньги на реальной ценности, не превращая деньги в лестницу статуса или механизм редакционного контроля.

Главная формула:

**VALUE OBJECT → PAYER → MOMENT OF NEED → OFFER → PAYMENT → DELIVERY → AFTERLIFE**

Пять основных причин payment:

**ACCESS**  
**OWNERSHIP**  
**INTERVENTION**  
**PRODUCTION SUPPORT**  
**RECURRING VALUE**

Главные guardrails:

**MONETIZATION FOLLOWS VALUE.**

**PAYMENT ATTACHES TO A CONCRETE VALUE OBJECT / ACTION — NOT TO HIGHER STATUS.**

**FREE VS PAID IS A PROPERTY OF THE VALUE OBJECT / OFFER — NOT OF THE PERSON.**

**PAYMENT ≠ EDITORIAL PRIORITY.**

**PAYMENT ≠ PROGRAMMING MOMENT.**

**PROGRAM PRIORITY ≠ REVENUE PRIORITY.**

**DO NOT INVENT A SUBSCRIPTION BEFORE A RECURRING VALUE EXISTS.**

**NAME THE VALUE, NOT THE STATUS.**

**PAID DISTRIBUTION DOES NOT CREATE PRODUCT VALUE.**

И главный тест:

> **Если убрать цену и billing mechanics, остаётся ли ясная самостоятельная ценность, за которую вообще имеет смысл платить?**

Если нет — monetization появилась раньше продукта.
