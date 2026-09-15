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

Contribution entry должен двигаться к:

> **Что заметил / что хочешь показать?**

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

---

# 6. Public visibility

Current Board / Artifact runtime исторически ориентирован на опубликованные Board records.

Contribution Model требует отдельного product distinction:

```text
editorial inbound
!=
automatic public program inclusion
```

Verdict: **PARTIAL GAP / REFRAME**.

Existing visibility / draft mechanisms могут помочь, но необходимо проверить, позволяют ли они безопасно выразить private / editorial inbound без создания публичной карточки.

Не считать наличие draft достаточным доказательством законченной contribution workflow.

---

# 7. Editorial acknowledgement

Current infrastructure умеет подтверждать технические действия, но canonical Contribution payoff требует:

> material received → editorial look → meaningful outcome.

Verdict: **PARTIAL GAP**.

Operational receipt можно строить на текущем plumbing.

Meaningful editorial reaction требует отдельной семантики.

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

Current runtime может публиковать Artifact, но публикация Board record сама по себе не доказывает создание Product Thing.

Verdict: **REFRAME**.

Нужен editorial decision:

```text
standalone identity exists?
audience experience exists / can exist?
should this be a Thing?
```

Только после этого Thing semantics применимы.

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

---

# 12. Responses / reactions

Current member / guest responses and reactions можно сохранить как communication / interaction plumbing.

Verdict: **KEEP AS PLUMBING**.

Но:

- reaction count не является editorial disposition;
- response не является editorial look автоматически;
- likes не должны решать, становится ли Contribution Thing.

---

# 13. Telegram / promotion

Current Artifact promotion / Telegram machinery работает вокруг опубликованных Board artifacts.

Verdict: **DO NOT APPLY BY DEFAULT TO RAW CONTRIBUTION**.

Contribution должен попасть во внешнюю distribution только после явного public consequence:

- Thing / Release;
- intentional published contribution;
- другой editorial programming decision.

Submission receipt не является distribution event.

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

## GAP 6 — editorial inbound vs public program

Нужно явно развести receipt материала и public inclusion.

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

---

# 16. Recommended implementation order

## Phase 0 — editorial mapping without schema migration

Прогнать реальные examples через dispositions:

- raw Observation;
- ready Thing;
- merge with existing Thing;
- contribution to Project;
- needs context;
- no action;
- decline.

## Phase 1 — contribution receipt / editorial outcome projection

Сделать понятный contributor-facing outcome поверх существующего carrier plumbing.

## Phase 2 — explicit merge / provenance relations where Phase 0 proves need

Добавлять relation только после подтверждения реальных cases.

## Phase 3 — credit resolution

Развести submitter / contributor / author / editor / participant там, где это реально требуется публичной Thing.

## Phase 4 — contribution entry reframe

Убрать taxonomy-first UX и дать material-first entry.

---

# Final conclusion

Текущий runtime не требует новой универсальной Contribution platform.

Большая часть carrier infrastructure уже существует.

Главная недостающая часть — не upload mechanics, а **editorial semantics**:

> что человек принёс, что редакция в этом увидела, куда это пошло и чем история закончилась.

Канонически:

**KEEP THE CARRIER. ADD THE EDITORIAL MEANING.**
