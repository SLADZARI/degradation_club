# DEMENTOR CLUB — PRODUCT PRINCIPLES & ANTI-PATTERNS v1

Status: **WORKING CANON / OPEN STACK — consolidation authority**  
Updated: **2026-09-15**

## Authority scope

Этот документ является финальным consolidation layer для Product & Marketing Package `01–15`.

Он отвечает на вопрос:

> **Что будущие design / product / editorial / marketing / distribution / monetization / metrics решения не имеют права сломать, даже если локально они выглядят разумными?**

Документ:

- консолидирует уже существующие принципы из `01–14`;
- дедублирует близкие формулировки;
- отделяет global principles от scoped guardrails;
- задаёт product drift classes;
- задаёт порядок разрешения конфликтов между двумя разумными решениями;
- определяет governance для будущих изменений принципов.

Он **не создаёт новую продуктовую философию**.

Если принцип в этом документе не поддерживается source authority из `01–14`, его нельзя считать каноническим только потому, что он красиво сформулирован здесь.

Каноническое governance rule:

**PRIMARY AUTHORITY DEFINES MEANING. `15` CONSOLIDATES AND RESOLVES — IT DOES NOT SILENTLY REDEFINE.**

Если `15` обнаруживает реальное противоречие между source authorities, исправление должно происходить в соответствующем primary authority, а не маскироваться новой формулировкой здесь.

---

# 0. Как пользоваться этим документом

`15` нужен не для ежедневного цитирования лозунгов.

Он нужен в четырёх случаях:

1. когда новое решение выглядит полезным, но меняет продуктовый смысл;
2. когда два хороших принципа дают разные ответы;
3. когда локальная оптимизация начинает влиять на весь продукт;
4. когда нужно проверить, не превращается ли Dementor в другой тип продукта.

Для обычного вопроса сначала используйте его primary authority.

Примеры:

- почему Thing в программе сейчас → `07 · Content & Programming`;
- почему человек возвращается → `08 · Return Loops`;
- что происходит с contribution → `09 · Contribution`;
- когда уместен Dementor / Intervention → `10`;
- что говорить снаружи → `11`;
- куда и как распространять → `12`;
- где валиден платёж → `13A`;
- как считать economics distribution path → `13B`;
- что и как измерять → `14`.

`15` вступает в силу, когда решение затрагивает несколько authorities одновременно или создаёт риск product drift.

---

# 1. Conflict-resolution order

Когда два разумных решения конфликтуют, нельзя автоматически выбирать то, которое:

- быстрее;
- проще реализовать;
- лучше конвертит;
- больше растит engagement;
- приносит больше revenue;
- легче измеряется.

Проверка идёт в таком порядке:

## 1. TRUTH

**Соответствует ли решение фактической реальности?**

Нельзя искажать:

- availability;
- состояние Thing / Release / Project;
- авторство;
- permissions;
- цену / commercial terms;
- реальный next move;
- фактический outcome;
- наличие Intervention / Event / Product;
- evidence.

Если решение требует неправды — оно остановлено.

---

## 2. VALUE

**Остаётся ли самостоятельная ценность для человека?**

Рост conversion не компенсирует ухудшение самого experience.

---

## 3. PRODUCT / EDITORIAL MEANING

**Не меняется ли смысл продукта ради activity, growth, revenue или удобства?**

Пример:

платёж не может купить editorial priority, даже если это увеличит revenue.

---

## 4. SEMANTIC INTEGRITY

**Не смешиваются ли разные продуктовые понятия ради простоты реализации?**

Например:

- Form ≠ Project;
- Release State ≠ Production State;
- Participation ≠ lifecycle state;
- History ≠ Activity;
- Person ≠ Dementor role;
- Programming Moment ≠ Thing;
- source type ≠ Product Form;
- DB table ≠ product ontology.

---

## 5. HUMAN AUTONOMY

**Не заставляет ли решение человека идти глубже, возвращаться, вступать, участвовать или покупать без необходимости?**

Человек имеет право:

- просто посмотреть;
- закончить experience;
- не вступить;
- не вернуться;
- не публиковать contribution;
- не продолжать participation;
- получить меньшую достаточную Intervention;
- не покупать.

---

## 6. OPTIMIZATION

Только после предыдущих пяти слоёв можно оптимизировать:

- reach;
- CTR;
- continuation;
- return;
- conversion;
- revenue;
- CAC / CPA;
- frequency;
- dashboard targets;
- production efficiency.

Короткая формула:

**TRUTH → VALUE → MEANING → SEMANTICS → AUTONOMY → OPTIMIZATION**

Это не означает, что optimization неважна.

Это означает, что optimization не имеет права переписывать продуктовую правду.

---

# 2. Global principles

Ниже — принципы, которые имеют cross-authority scope.

Их должно быть мало.

Локальные правила конкретного authority не поднимаются сюда автоматически.

---

## P01 · OBSERVATION BEFORE JOKE

### Protects

Связь Dementor с реальностью.

### Means

Сначала существует узнаваемая реальность, правило, противоречие или ситуация.

Потом:

**OBSERVATION → REFRAME → FORM.**

Юмор, сатира, naming, bureaucratization и другие механики являются способом увидеть наблюдение точнее, а не заменой наблюдения.

### Does not mean

- каждая Thing обязана быть смешной;
- наблюдение должно быть серьёзным;
- нельзя начинать с неожиданной формы;
- нельзя делать абсурдную вещь.

Форма может быть любой, если исходное наблюдение настоящее.

### Anti-pattern

Начать с желания «сделать мем / шутку / прикольный сервис» и потом искать реальность, которую можно к нему приклеить.

### Decision test

> **Если убрать шутку или эффектный приём, остаётся ли настоящее наблюдение?**

### Source authorities

- `01 · Product Thesis / JTBD`;
- editorial canon.

---

## P02 · THING FIRST

### Protects

Первичный опыт человека до необходимости понимать организацию.

### Means

Человек по возможности сначала встречает конкретную Thing / Release / Event / Tool / другой самостоятельный experience.

Клуб, Board, Membership, profile system и внутренняя ontology не обязаны предшествовать этому опыту.

### Does not mean

- Home не нужен;
- About не нужен;
- нельзя рассказывать о Club;
- любой route обязан быть Thing detail;
- человек никогда не может специально прийти на Home / Profile / Board.

Принцип относится к тому, **что должно быть доказательством ценности**, а не к запрету навигационных поверхностей.

### Anti-pattern

Сначала объяснить человеку организацию, membership и ecosystem, а только потом показать, зачем он вообще пришёл.

### Decision test

> **Может ли человек сначала встретить обещанную Thing, а не устройство клуба?**

### Source authorities

- `01 · Product Thesis / JTBD`;
- `03 · Audience & Entry Map`;
- `04 · Value Architecture`;
- `11 · Messaging`;
- `12 · Distribution`.

---

## P03 · VALUE BEFORE CTA

### Protects

Порядок обмена между продуктом и человеком.

### Means

Сначала должна возникнуть понятная ценность или убедительный proof.

Только потом продукт просит:

- продолжить;
- подписаться;
- вступить;
- участвовать;
- принести своё;
- зарегистрироваться;
- купить.

### Does not mean

- CTA должен всегда быть внизу страницы;
- нельзя показывать action до completion;
- нельзя иметь transactional CTA там, где intent уже конкретный.

Если человек пришёл купить билет или открыть Tool, CTA может быть сразу — потому что value object уже понятен.

### Anti-pattern

Оптимизировать следующий шаг до того, как стало ясно, зачем его делать.

### Decision test

> **Если убрать CTA, человек уже получил или ясно увидел ценность?**

### Source authorities

- `04 · Value Architecture`;
- `11 · Messaging`;
- `12 · Distribution`;
- `13 · Monetization`.

---

## P04 · VALUE IS NOT A LADDER

### Protects

Самостоятельную ценность разных способов быть рядом с Dementor.

### Means

Viewer, Program Audience, Follower, Contributor, Participant, Maker, contextual user и payer — не уровни одного правильного пути.

Человек не обязан становиться глубже вовлечённым, чтобы считаться успешным пользователем.

### Does not mean

- разные permissions не существуют;
- Membership не существует;
- человеку нельзя предлагать следующий шаг;
- разные продукты не могут иметь разный уровень commitment.

Operational access ladder может существовать, но она не определяет product value человека.

### Anti-pattern

`VIEWER → MEMBER → PAID MEMBER → PREMIUM → DEMENTOR` как модель продуктовой зрелости.

### Decision test

> **Может ли человек закончить путь здесь и всё равно получить полную ценность этого режима?**

### Source authorities

- `03 · Audience & Entry Map`;
- `04 · Value Architecture`;
- `08 · Return Loops`;
- `09 · Contribution`;
- `13A · Monetization Architecture`.

---

## P05 · EDITORIAL > SOCIAL

### Protects

Dementor как редакционную систему вокруг Things, а не social network.

### Means

Программная значимость определяется:

- Thing;
- наблюдением;
- Release;
- meaningful continuation;
- editorial reason;
- History;
- реальной Participation Opportunity.

Не количеством социальной активности вокруг объекта.

### Does not mean

- комментарии запрещены;
- community не нужна;
- люди не важны;
- социальная реакция никогда не является signal.

Социальная активность может быть следствием ценности, но не должна автоматически определять editorial priority.

### Anti-pattern

Люди возвращаются в основном ради профилей, сообщений, комментариев, networking и статуса, а программа становится вторичной.

### Decision test

> **Это важно потому, что произошло что-то содержательное, или потому, что вокруг этого много активности?**

### Source authorities

- `01 · Product Thesis / JTBD`;
- `02 · CJM`;
- `04 · Value Architecture`;
- `07 · Programming`;
- `09 · Contribution`.

---

## P06 · OBJECTS > PROFILES

### Protects

Discovery через работу, контекст и происходящее, а не через социальную личность.

### Means

Thing, body of work, Situation, Project, Method или реальный context обычно сильнее объясняют релевантность человека, чем profile-first discovery.

### Does not mean

- Profile запрещён;
- авторство не важно;
- Dementor не может иметь followers;
- известный автор не может быть самостоятельной причиной визита.

Dementor Return Loop валиден, но должен вести к работе, а не к активности профиля ради активности.

### Anti-pattern

Creator/influencer feed или marketplace, где человек становится главным товаром раньше его работы или contextual fit.

### Decision test

> **Что здесь ценно, если временно убрать имя, аватар и статус автора?**

### Source authorities

- `01 · Product Thesis / JTBD`;
- `08 · Return Loops`;
- `10 · Dementor / Intervention`;
- `11 · Messaging`.

---

## P07 · SITUATIONS > SKILLS

### Protects

Contextual utility и честную релевантность Intervention.

### Means

Сначала существует Situation / Blocker / Thing / Project context.

Потом становится понятно, какой Dementor / Method / Tool / Course / Event / resource здесь имеет смысл.

### Does not mean

- skills metadata бесполезны;
- нельзя искать автора по имени;
- нельзя иметь профессию или specialization;
- Situation всегда требует human Intervention.

### Anti-pattern

Каталог экспертов, которому затем подбирают проблему.

### Decision test

> **Какая реальная Situation делает этот ресурс или Dementor релевантным именно сейчас?**

### Source authorities

- `01 · Product Thesis / JTBD`;
- `10 · Dementor / Intervention`;
- `13A · Monetization Architecture`.

---

## P08 · PRODUCT SEMANTICS ≠ IMPLEMENTATION SHAPE

### Protects

Продуктовый смысл от случайной формы текущей базы, UI или legacy implementation.

### Means

Product semantics определяет, что существует по смыслу.

Implementation решает, как это хранить и показывать.

Поэтому:

- Thing не требует автоматически отдельной `dc_things` table;
- Artifact может backing a Thing, но не определяет universal public ontology;
- source type ≠ Form;
- Programming Moment не обязан быть новой entity;
- Board Projection не становится вторым source of truth;
- operational status не становится product lifecycle только потому, что он уже есть в DB.

### Does not mean

- реализация не важна;
- нельзя переиспользовать текущие сущности;
- нужно постоянно переделывать schema;
- semantic abstraction должна быть сложнее implementation.

Наоборот: предпочитается минимальная совместимая реализация, если она сохраняет смысл.

### Anti-pattern

Изменить продуктовую модель потому, что текущий enum / table / card устроены иначе.

### Decision test

> **Мы выбираем этот смысл потому, что он верен для продукта, или потому, что так уже устроена реализация?**

### Source authorities

- `05 · Product Model`;
- `06 · Board Product Model`;
- `07 · Programming`;
- production compatibility mappings.

---

## P09 · RELEASE > COMPLETION

### Protects

Появление реальной вещи вместо бесконечной внутренней работы.

### Means

Making имеет смысл, когда приводит к experience, который уже может встретить другой человек.

Release важнее внутреннего ощущения «мы закончили».

### Does not mean

- всё нужно выпускать быстро;
- качество не важно;
- любой prototype должен стать публичным;
- Project должен иметь один Release;
- после Release работа заканчивается.

Released Thing может одновременно снова быть `MAKING` для следующей версии.

### Anti-pattern

Проект хорошо организован, roadmap заполнен, встречи проходят, но в мире всё ещё нечего открыть / посмотреть / попробовать.

### Decision test

> **Что уже может реально встретить живой человек?**

### Source authorities

- `01 · Product Thesis / JTBD`;
- `04 · Value Architecture`;
- `05 · Product Model`;
- `07 · Programming`.

---

## P10 · RETURN FOLLOWS VALUE, NOT DEBT

### Protects

Добровольное возвращение за ожидаемой ценностью.

### Means

Return Loop начинается с реальной памяти / ожидания:

> **«там может быть что-то стоящее для меня».**

Notification, email, Telegram, Activity и другие transports могут доставить trigger, но не должны заменять return reason.

### Does not mean

- notifications запрещены;
- нельзя напоминать;
- частый Return плохой;
- unread state всегда вреден.

Проблема начинается, когда долг перед интерфейсом становится сильнее ожидаемого payoff.

### Anti-pattern

Streak, fear of missing out, unread pressure, social obligation или notification debt как основной retention engine.

### Decision test

> **Какую будущую ценность человек ожидает получить, когда возвращается?**

### Source authorities

- `04 · Value Architecture`;
- `07 · Programming`;
- `08 · Return Loops`;
- `14 · Metrics & Signals`.

---

## P11 · PROMISE MUST MATCH REALITY

### Protects

Доверие между тем, что продукт обещает, и тем, что реально существует.

### Means

Promise, preview, availability, destination, CTA, commercial terms и следующий шаг должны буквально соответствовать реальности.

Это касается:

- `СКОРО`;
- Event availability;
- playable / not playable;
- participation;
- Intervention;
- paid offers;
- distribution destination;
- editorial anticipation;
- fulfillment.

### Does not mean

- нельзя показывать будущие планы;
- нельзя делать teaser;
- нельзя строить anticipation;
- нельзя экспериментировать.

Можно показывать uncertainty, если она названа честно.

### Anti-pattern

Promise debt: продукт регулярно обещает continuation / availability / result, который не существует или не закрывается.

### Decision test

> **Получит ли человек именно то состояние мира, которое мы ему сейчас обещаем?**

### Source authorities

- `07 · Programming`;
- `08 · Return Loops`;
- `11 · Messaging`;
- `12 · Distribution`;
- `13A · Monetization`;
- `14 · Metrics & Signals`.

---

## P12 · PAYMENT FOLLOWS VALUE, NOT STATUS OR POWER

### Protects

Экономику, которая усиливает продукт, а не покупает влияние внутри него.

### Means

Платёж прикрепляется к конкретной standalone value / action:

- Thing;
- Event;
- Experience;
- Tool;
- Method;
- Intervention;
- Physical Object;
- Production Support;
- доказанной recurring value.

Платёж не должен автоматически покупать:

- editorial priority;
- Board ranking;
- статус Dementor;
- более высокий human status;
- гарантированную публикацию;
- proximity к человеку без конкретной value object;
- программную значимость.

### Does not mean

- Membership никогда не может быть платным;
- Club не может получать revenue share;
- sponsorship запрещён;
- paid distribution запрещён.

Каждая такая модель должна сначала назвать конкретную value и сохранить editorial firewall.

### Anti-pattern

Монетизировать принадлежность, влияние или редакционное внимание вместо ценности.

### Decision test

> **За какую конкретную ценность человек или payer платит — и что этот платёж принципиально не даёт купить?**

### Source authorities

- `04 · Value Architecture`;
- `10 · Intervention`;
- `13A · Monetization Architecture`;
- `13B · Distribution Economics`;
- `14 · Metrics & Signals`.

---

# 3. Scoped guardrails

Следующие правила фундаментальны внутри своего scope, но **не являются универсальными законами для каждой части продукта**.

Это защищает систему от чрезмерного применения хороших формул.

---

## G01 · PROGRAM FOLLOWS MEANING, NOT ACTIVITY

**Scope:** `07 · Content & Programming`

В программу попадает то, для чего существует реальный editorial why-now.

Следствия:

- `THING EXISTENCE ≠ PROGRAM RELEVANCE`;
- `NO DELTA → NO UPDATE`;
- freshness ≠ created_at / published_at;
- sequence by attention, not DB chronology;
- resurfacing требует изменившегося смысла / context.

**Does not mean:** техническое обновление нельзя делать без user-visible delta.

**Test:**

> **Что изменилось для человека, которому эта Thing уже была интересна?**

---

## G02 · CONTRIBUTION ≠ PUBLICATION

**Scope:** `09 · Contribution`

Submission не создаёт автоматически Thing / Release / Programming Moment.

Editorial reaction сама является ценностью.

Следствия:

- submission status ≠ editorial outcome;
- no-action — валидный outcome;
- merge before duplicate creation;
- material first → classification later.

**Does not mean:** готовая сильная Thing не может быть принята и выпущена быстро.

**Test:**

> **Нужна ли аудитории новая самостоятельная Thing или редакции достаточно другого outcome?**

---

## G03 · USE THE SMALLEST SUFFICIENT INTERVENTION

**Scope:** `10 · Dementor / Intervention`, `13A · Monetization`

Если существующей Thing достаточно — не нужен человек.

Если Method достаточно — не нужен Course.

Если короткого Reframe достаточно — не нужна paid session.

**Does not mean:** всегда выбирать самое дешёвое или короткое решение.

Достаточность определяется Situation, а не ценой.

**Test:**

> **Какое минимальное вмешательство реально достаточно этой Situation?**

---

## G04 · RICH MODEL → SPARSE SURFACE

**Scope:** `06 · Board Product Model`, UI / projection surfaces

Система может знать много.

Конкретная поверхность должна показать только то, что нужно здесь и сейчас.

Следствия:

- one contextual signal + one primary action;
- internal ontology не обязана отображаться человеку;
- release/action usually beats internal navigation.

**Does not mean:** сама domain model должна быть бедной.

**Test:**

> **Что из всего известного системе человеку действительно нужно увидеть здесь?**

---

## G05 · DISTRIBUTE THE THING, NOT THE ORG CHART

**Scope:** `12 · Distribution`, `11 · Messaging`

Distribution route начинается с конкретного trigger / promise / Entry Object.

Home, Board и Profile не являются default acquisition destinations только потому, что они существуют.

Следствия:

- destination matches promise;
- not every Release needs every channel;
- source ≠ channel ≠ transport ≠ Entry Object;
- paid amplification не создаёт editorial meaning.

**Does not mean:** brand / Home / About никогда не могут быть destination.

**Test:**

> **Попадает ли человек туда, что ему только что пообещали?**

---

## G06 · MEASURE THE VALUE CHAIN, NOT THE NOISE AROUND IT

**Scope:** `14 · Metrics & Signals`

Pageviews, clicks, reactions и notification opens — telemetry, а не доказательство value сами по себе.

Следствия:

- event ≠ signal ≠ metric ≠ KPI ≠ target;
- click/open ≠ qualified experience;
- consumption is Form-aware;
- Return frequency без payoff не является retention health;
- baseline before optimization target;
- no question → no event.

**Does not mean:** raw telemetry бесполезна.

**Test:**

> **Какой конкретный product question отвечает эта метрика?**

---

## G07 · COMMERCIAL EVIDENCE FOLLOWS THE FULL EXCHANGE

**Scope:** `13A`, `13B`, `14`

Revenue, click-to-checkout или payment intent сами по себе не доказывают устойчивую commercial value.

Рабочая evidence chain:

**VALUE → INTENT → COMMITMENT → PAYMENT → DELIVERY → REPEAT**

До repeated external evidence commercial options остаются hypotheses.

**Does not mean:** первый платёж ничего не значит.

Первый платёж — важный evidence, но не доказанная повторяемая business model.

**Test:**

> **Мы доказали только willingness to pay или уже delivery / use / repeat?**

---

## G08 · DISTRIBUTION ECONOMICS DO NOT REWRITE PRODUCT VALUE

**Scope:** `13B · Distribution Economics`

CAC, CPA, attribution window, retargeting, paid amplification и referral economics оценивают distribution path вокруг уже валидного value object.

Они не определяют, что должно быть ценно в продукте.

Следствия:

- source ≠ channel ≠ acquisition mode;
- CPA ≠ CAC;
- acquisition cost ≠ delivery cost ≠ production cost;
- no media spend ≠ no cost;
- unknown attribution ≠ zero-cost acquisition;
- do not invent LTV before repeat exists.

**Test:**

> **Мы оптимизируем способ доставить уже доказанную ценность или пытаемся через economics доказать, что ценность существует?**

---

# 4. Product drift classes

Anti-patterns лучше отслеживать как drift families, а не как бесконечный список частных ошибок.

---

## D01 · SOCIAL DRIFT

Признак:

профили, комментарии, сообщения, social graph, networking или статус становятся важнее Things / Program / Releases.

Риск:

Dementor превращается в social network / community platform общего назначения.

Главные защиты:

- Editorial > Social;
- Objects > Profiles;
- Thing First.

---

## D02 · FEED DRIFT

Признак:

поток activity считается достаточной программой.

Типичные симптомы:

- каждое изменение становится update;
- project activity автоматически выходит аудитории;
- freshness = timestamp;
- приходится регулярно заполнять паузу контентом.

Главная защита:

`G01 · Program follows meaning, not activity`.

---

## D03 · STATUS LADDER

Признак:

люди начинают восприниматься как находящиеся на уровнях одной шкалы:

Viewer → Member → Premium → Dementor.

Главная защита:

`P04 · Value is not a ladder`.

---

## D04 · MARKETPLACE DRIFT

Признак:

Dementors становятся карточками услуг / skill profiles; Situation появляется после человека.

Главные защиты:

- Situations > Skills;
- Objects > Profiles;
- Smallest sufficient Intervention.

---

## D05 · FUNNEL DRIFT

Признак:

free Things существуют главным образом как teaser регистрации, membership или следующего paid product.

Главные защиты:

- Thing First;
- Value Before CTA;
- Value is not a ladder;
- Payment follows value.

---

## D06 · IMPLEMENTATION DRIFT

Признак:

legacy DB / enum / page / card / source type начинает определять product meaning.

Главная защита:

`P08 · Product semantics ≠ implementation shape`.

---

## D07 · PROMISE DEBT

Признак:

продукт регулярно создаёт ожидания, которые не закрывает:

- вечное `СКОРО`;
- неправильная availability;
- fake participation;
- wrong destination;
- paid offer without fulfillment;
- anticipation без следующего move.

Главная защита:

`P11 · Promise must match reality`.

---

## D08 · COMMERCIAL CAPTURE

Признак:

revenue / sponsor / advertiser / payer начинает влиять на editorial selection, ranking, Dementor status или program priority.

Главная защита:

`P12 · Payment follows value, not status or power`.

---

## D09 · METRICS THEATER

Признак:

то, что легко посчитать, начинает называться product success.

Типичные подмены:

- pageview = consumption;
- click = qualified entry;
- return = retention без payoff;
- Board activity = healthy releases;
- revenue = fulfilled paid value;
- maximum reach = program quality.

Главная защита:

`G06 · Measure the value chain, not the noise around it`.

---

# 5. Cross-authority decision protocol

Для нового feature / campaign / surface / revenue idea / metric / workflow пройти следующие вопросы.

## A. Truth

- Что фактически существует сейчас?
- Что мы обещаем?
- Совпадает ли promise с reality?

## B. Thing / Value

- Какой конкретный value object / experience получает человек?
- Работает ли он без обязательного следующего CTA?

## C. Program / Meaning

- Почему это важно сейчас?
- Есть meaningful delta или реальный programming reason?

## D. Semantic integrity

- Не смешали ли мы Form / Project / State / Participation / History / Person / Role / Programming?
- Не диктует ли implementation смысл?

## E. Human path

- Может ли человек остановиться после полученной ценности?
- Не создаём ли мы artificial debt / status pressure?

## F. Distribution

- Какой trigger / intent?
- Какой Entry Object?
- Совпадает ли destination с promise?

## G. Commercial

- За какую конкретную ценность платят?
- Что платёж не должен купить?
- Есть ли delivery / fulfillment?

## H. Measurement

- Какой question измеряем?
- Какое событие действительно является evidence?
- Отделены ли internal / test / bot / preview populations?

Если решение проходит этот протокол, оно совместимо с Product & Marketing Package на уровне `15`.

---

# 6. Governance

## One question → one primary authority

`15` не становится universal replacement для `01–14`.

Он хранит cross-cutting constraints.

Если возникает вопрос о конкретном domain meaning, отвечает соответствующий authority.

---

## Principle promotion rule

Новое правило не становится global principle только потому, что:

- хорошо звучит;
- повторилось в двух документах;
- удобно для текущего feature;
- решает локальную проблему.

Чтобы попасть в Global Principles, правило должно:

1. уже иметь source authority;
2. работать минимум через несколько product layers;
3. останавливать реальный drift class или cross-authority conflict;
4. иметь ясный `Does not mean`;
5. иметь один decision test.

Иначе правило остаётся scoped guardrail.

---

## Conflict rule

Если `15` и primary authority противоречат друг другу:

1. проверить, не устарел ли один из документов;
2. определить, является ли конфликт semantic или wording;
3. semantic conflict исправлять в primary authority;
4. затем синхронизировать `15`;
5. не создавать третью параллельную формулировку.

---

## Status discipline

Не смешивать:

- `MERGED CANON`;
- `MERGED WORKING CANON`;
- `OPEN STACK / WORKING CANON`;
- `DRAFT / CANDIDATE`;
- production implementation state;
- empirical evidence state.

Семантически зрелая модель может быть не merged.

Merged модель может быть не instrumented.

Instrumented модель может быть ещё не empirically validated.

Эти состояния не заменяют друг друга.

---

# 7. Definition of Done for Principle v1

Каждый global principle в `15` должен иметь:

- **Principle**;
- **Protects**;
- **Means**;
- **Does not mean**;
- **Anti-pattern**;
- **Decision test**;
- **Source authorities**.

Scoped guardrail обязан дополнительно иметь явный **Scope**.

Принцип нельзя считать закрытым, если он:

- не имеет source authority;
- дублирует другой принцип без отдельной функции;
- нельзя применить как decision test;
- настолько широк, что ломает валидные локальные решения;
- описывает implementation choice вместо product constraint.

---

# 8. Package-level anti-pattern

Самый важный anti-pattern самого Product & Marketing Package:

> **архитектура начинает существовать ради архитектуры.**

Документы нужны, чтобы:

- сохранять смысл при реализации;
- быстрее принимать решения;
- не переизобретать продукт на каждой поверхности;
- видеть реальные противоречия;
- переходить к evidence.

Если новый документ:

- не закрывает новый authority question;
- не снимает конфликт;
- не улучшает decision quality;
- не помогает проверке reality;

его не нужно добавлять в package только ради полноты.

Канонически:

**THE PACKAGE IS COMPLETE WHEN IT STOPS NEEDING NEW THEORY AND STARTS PRODUCING TESTABLE DECISIONS.**

---

# 9. Final constitution

Короткая форма `15`:

**OBSERVE REALITY BEFORE INVENTING THE JOKE.**  
**LET THE THING PROVE THE CLUB.**  
**DELIVER VALUE BEFORE ASKING FOR THE NEXT STEP.**  
**DO NOT TURN PEOPLE INTO A MATURITY LADDER.**  
**KEEP EDITORIAL MEANING ABOVE SOCIAL ACTIVITY.**  
**FOLLOW THE WORK BEFORE THE PROFILE.**  
**FIND THE SITUATION BEFORE THE EXPERT.**  
**DO NOT LET IMPLEMENTATION DEFINE PRODUCT SEMANTICS.**  
**GET THINGS INTO THE WORLD.**  
**EARN RETURN WITH VALUE, NOT DEBT.**  
**PROMISE ONLY WHAT REALITY CAN DELIVER.**  
**LET MONEY FOLLOW VALUE — NEVER STATUS OR EDITORIAL POWER.**

И при конфликте:

**TRUTH → VALUE → MEANING → SEMANTICS → AUTONOMY → OPTIMIZATION.**

---

# Source map

Primary source authorities consolidated here:

- `concept/DEMENTOR_CLUB_JTBD_PRODUCT_THESIS_V2.md`;
- `concept/CJM_CLUB_V1.md`;
- `concept/CJM_BOARD_PARTICIPATION_V1.md`;
- `concept/AUDIENCE_ENTRY_MAP_V1.md`;
- `concept/VALUE_ARCHITECTURE_V1.md`;
- `concept/PRODUCT_MODEL_V1.md`;
- `concept/BOARD_PRODUCT_MODEL_V1.md`;
- `concept/CONTENT_PROGRAMMING_MODEL_V1.md`;
- `concept/RETURN_LOOPS_V1.md`;
- `concept/CONTRIBUTION_MODEL_V1.md`;
- `concept/DEMENTOR_INTERVENTION_MODEL_V1.md`;
- `concept/MARKETING_POSITIONING_MESSAGING_V1.md`;
- `concept/DISTRIBUTION_MODEL_V1.md`;
- `concept/MONETIZATION_MAP_V1.md`;
- `concept/MONETIZATION_DISTRIBUTION_ECONOMICS_V1.md`;
- `concept/METRICS_SIGNALS_V1.md`.

---

# Final status of `15`

`15 · Product Principles / Anti-patterns` is semantically complete for v1 when this document is reviewed against the current `01–14` stack and no source conflict is found.

Further work after v1 belongs primarily to:

- package integration / merge governance;
- source index synchronization;
- production alignment;
- instrumentation;
- empirical validation;
- revision only when real evidence invalidates an existing principle or exposes a missing cross-authority constraint.
