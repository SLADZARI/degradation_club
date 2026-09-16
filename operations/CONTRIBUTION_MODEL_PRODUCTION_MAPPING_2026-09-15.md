# CONTRIBUTION MODEL — PRODUCTION MAPPING

Status: **REFERENCE / production compatibility map**  
Date: **2026-09-15**

## Purpose

Этот документ связывает `concept/CONTRIBUTION_MODEL_V1.md` с уже известным production / staging runtime Dementor Club.

Он не меняет код и не требует миграции.

Классификация:

- **KEEP** — существующий plumbing пригоден;
- **REFRAME** — данные можно сохранить, но их product meaning нужно изменить;
- **GAP** — семантики нет;
- **PARTIAL GAP** — hook существует, но relation / meaning недостаточны.

Каноническая implementation-граница:

**CONTRIBUTION PATH ≠ DIRECT PUBLISH PATH**

Текущий Artifact runtime может участвовать в обоих путях, но с разным product contract.

---

# 1. Artifact as carrier

Product Model уже определяет две валидные роли Artifact:

1. Contribution / Observation carrier;
2. native Board Thing.

Verdict: **KEEP + REFRAME**.

Нельзя делать mapping:

```text
Artifact == Contribution == Thing
```

Канонически:

```text
Artifact MAY carry Contribution
Artifact MAY back Thing
Contribution MAY exist without Thing
```

Это же позволяет сохранить direct public publish готовой native Board Thing без превращения любого publish action в Contribution workflow.

---

# 2. Current Artifact payload

Из текущего runtime уже пригодны как carrier / evidence:

- `title`;
- `body`;
- `external_url`;
- media;
- `author_profile_id` как submitter / owner hint;
- created / activity timestamps;
- visibility / operational lifecycle;
- existing draft / publish ownership plumbing.

Verdict: **KEEP AS PLUMBING**.

Эти поля не должны автоматически решать editorial disposition.

---

# 3. Legacy artifact type

Текущие значения:

```text
announcement
post
idea
request
```

Verdict: **REFRAME**.

Не использовать shortcuts:

```text
idea -> Observation
post -> Thing
request -> Participation Opportunity
announcement -> public Program item
```

без editorial context.

Staging composer уже является evidence, что user-facing taxonomy можно убирать без замены Artifact runtime.

Для Contribution entry направление:

> **Что заметил / что хочешь показать?**

Для Direct publish готовой Thing taxonomy-first UX также не обязателен; Form / presentation могут выводиться позже из semantic context.

---

# 4. Operational lifecycle

Текущий Artifact lifecycle (`draft / publishing / active / expired / archived / removed`) остаётся operational.

Verdict: **KEEP**.

Но:

```text
artifact.status != contribution editorial disposition
```

Нужны отдельные semantics хотя бы на adapter / editorial layer:

```text
RECEIVED
REVIEWING
WAITING_ON_CONTRIBUTOR
RESOLVED
WITHDRAWN
```

Они не обязаны становиться новым DB enum в первой реализации.

Для Direct publish текущий operational lifecycle может по-прежнему обслуживать public Artifact record, не создавая Contribution statuses.

---

# 5. Editorial disposition

Current runtime не выражает достаточно надёжно:

- `NEEDS_CONTEXT`;
- `KEEP_AS_OBSERVATION`;
- `REFRAME`;
- `MERGE_EXISTING`;
- `DEVELOP_NEW_THING`;
- `READY_THING_CANDIDATE`;
- `INVITE_TO_MAKE`;
- `LINK_TO_EXISTING_PROJECT`;
- `NO_ACTION`;
- `DECLINE`.

Verdict: **GAP**.

Необязательно реализовывать это одним enum.

Сначала нужно доказать реальный editorial workflow на примерах.

Direct public publish не обязан получать editorial disposition только потому, что Thing опубликована; editorial review и programming selection остаются отдельными решениями.

---

# 6. Public visibility

Current Board / Artifact runtime исторически ориентирован на опубликованные Board records.

Contribution Model требует product distinction:

```text
editorial inbound
!=
direct public publish
!=
editorial program inclusion
```

Verdict: **PARTIAL GAP / REFRAME**.

## Editorial inbound

По умолчанию не создаёт публичную карточку.

Existing visibility / draft mechanisms могут помочь, но необходимо проверить, позволяют ли они безопасно выразить private / editorial inbound без создания public Board unit.

Не считать наличие draft достаточным доказательством законченной Contribution workflow.

## Direct public publish

Existing Artifact draft / publish runtime является хорошим compatibility path для готовой native Board Thing, если продукт явно разрешает такой capability.

Это не требует предварительного Contribution workflow.

Но:

```text
public Artifact
!=
editorial endorsement
!=
Programming Moment
```

Публикация Thing на Board не должна автоматически включать её в Home / editorial programming / external distribution.

Verdict for runtime: **KEEP + REFRAME**.

---

# 7. Editorial acknowledgement

Current infrastructure умеет подтверждать технические действия, но canonical Contribution payoff требует:

> material received → editorial look → meaningful outcome.

Verdict: **PARTIAL GAP**.

Operational receipt можно строить на текущем plumbing.

Meaningful editorial reaction требует отдельной семантики.

Для Direct publish acknowledgement другой:

> публичная Thing создана / опубликована

и не должен обещать editorial reaction, если пользователь не входил в Contribution path.

---

# 8. Merge

Current `promoted_entity_type / promoted_entity_id` и другие cross-domain hooks не равны Contribution merge semantics.

Verdict: **PARTIAL GAP**.

Нужно уметь выразить как минимум:

```text
Contribution -> Observation
Contribution -> existing Thing
Contribution -> existing Project
```

с сохранением provenance.

Не использовать generic promotion relation, если её смысл иной.

---

# 9. Contribution → Thing

Current runtime может публиковать Artifact, но публикация Board record сама по себе не доказывает создание Product Thing из Contribution.

Verdict: **REFRAME**.

Для Contribution path нужен editorial decision:

```text
standalone identity exists?
audience experience exists / can exist?
should this become a Thing?
```

Только после этого Thing semantics применимы как consequence Contribution.

Отдельно Direct publish path может сразу создавать / back-ить native public Thing, если intent пользователя именно такой и самостоятельность Thing уже существует.

Это не отменяет Programming selection gate.

---

# 10. Project start

Existing Project registry можно сохранить.

Verdict: **KEEP**.

Но Contribution не должна автоматически создавать Project.

Нужен реальный transition:

```text
Contribution
-> Invite to make
-> continued collaborative action actually begins
-> Project becomes useful
```

Project creation остаётся downstream decision.

Direct publish готовой Thing также не обязан создавать Project.

---

# 11. Credit / authorship

Current `author_profile_id` полезен как ownership / submitter signal.

Verdict: **KEEP + REFRAME**.

Он не решает автоматически:

- source provenance;
- contributor credit;
- final Thing authorship;
- co-authorship;
- editorial credit;
- participant relation.

Confirmed gap:

**final public credit semantics are not safely derivable from one Artifact author field.**

Для Direct publish `author_profile_id` может быть хорошим initial authorship hint только если человек действительно публикует собственную Thing, но не должен использоваться как универсальная provenance model.

---

# 12. Responses / reactions

Current member / guest responses and reactions можно сохранить как communication / interaction plumbing.

Verdict: **KEEP AS PLUMBING**.

Но:

- reaction count не является editorial disposition;
- response не является editorial look автоматически;
- likes не должны решать, становится ли Contribution Thing;
- reactions на direct-published Thing не превращают её автоматически в Programming Moment.

---

# 13. Telegram / promotion

Current Artifact promotion / Telegram machinery работает вокруг опубликованных Board artifacts.

## Raw Contribution

Verdict: **DO NOT APPLY BY DEFAULT**.

Contribution должен попасть во внешнюю distribution только после явного public consequence:

- Thing / Release;
- intentional published contribution;
- другой editorial programming decision.

Submission receipt не является distribution event.

## Direct public publish

Даже если native Board Thing уже публична, Telegram / external distribution остаётся отдельным editorial / operational decision.

Канонически:

```text
DIRECT PUBLICATION != EXTERNAL DISTRIBUTION
```

---

# 14. Confirmed semantic GAPs

## GAP 1 — editorial disposition

Содержательный outcome редакции.

## GAP 2 — contribution provenance graph

Откуда material пришёл и во что вошёл.

## GAP 3 — merge semantics

Contribution → Observation / Thing / Project.

## GAP 4 — public credit resolution

Contributor ≠ automatic Author.

## GAP 5 — meaningful closure

`NO_ACTION / DECLINE / KEEP_AS_OBSERVATION` должны закрывать loop, а не исчезать в queue.

## GAP 6 — explicit editorial inbound semantics

Нужно явно выразить receipt материала для editorial look отдельно от public Board publication.

## PARTIAL GAP — direct publish intent

Runtime public Artifact path уже существует, но product UX должен явно отличать:

```text
Bring for editorial look
vs
Publish ready Thing
```

Нельзя оставлять различие только неявным следствием technical status / button label.

---

# 15. Phase 0 target

До миграций проверить на реальных contributions semantic adapter / editorial record вида:

```text
ContributionViewModel

contribution_id
source_ref
submitter
payload
context
source / provenance

target_thing?
target_project?
participation_opportunity?

operational_status
editorial_disposition?
editorial_response?

merge_target?
created_thing?
next_action?
closed_at?

credit_resolution?
```

Unavailable semantics должны быть явно `unmapped`, а не выводиться из legacy artifact type.

Параллельно Direct publish должен иметь отдельный minimal contract примерно вида:

```text
DirectThingPublishIntent

source_ref
publisher
thing_payload
visibility
primary_experience?
authorship_hint
```

Это не требование новой DB entity; это различие product intent / adapter contract.

---

# 16. Recommended implementation order

## Phase 0 — editorial mapping without schema migration

Прогнать реальные examples через dispositions:

- raw Observation;
- ready Thing contribution;
- merge with existing Thing;
- contribution to Project;
- needs context;
- no action;
- decline.

Отдельно прогнать минимум один Direct publish example и убедиться, что он не проходит Contribution disposition pipeline по ошибке.

## Phase 1 — contribution receipt / editorial outcome projection

Сделать понятный contributor-facing outcome поверх существующего carrier plumbing.

## Phase 2 — explicit merge / provenance relations where Phase 0 proves need

Добавлять relation только после подтверждения реальных cases.

## Phase 3 — credit resolution

Развести submitter / contributor / author / editor / participant там, где это реально требуется публичной Thing.

## Phase 4 — entry split / reframe

Contribution path:

> **Что заметил / что хочешь показать?**

Direct publish path:

> **Публикуешь готовую самостоятельную Thing**

Оба могут использовать общий carrier plumbing, но пользовательский contract и downstream semantics различаются.

---

# Final conclusion

Текущий runtime не требует новой универсальной Contribution platform.

Большая часть carrier infrastructure уже существует.

Главная недостающая часть — не upload mechanics, а **editorial semantics**:

> что человек принёс, что редакция в этом увидела, куда это пошло и чем история закончилась.

При этом существующий public Artifact runtime может продолжить обслуживать отдельный Direct publish capability для готовой native Board Thing.

Канонически:

**KEEP THE CARRIER. ADD THE EDITORIAL MEANING.**

И:

**KEEP DIRECT PUBLISH SEPARATE FROM EDITORIAL INBOUND.**