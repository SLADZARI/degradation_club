# DEMENTOR CLUB — PHASE 1A · CURRENT PROGRAM COMPOSITION V0

Status: **DRAFT / OWNER-DECIDED COMPOSITION / NO RUNTIME CHANGE**  
Updated: **2026-09-15**  
Branch: `dementor/phase1a-current-program-composition-v0`  
Stacked on: PR #205 · `dementor/phase1-current-program-contract-v1`

## 0. Purpose

This document selects the first small set of Things that may form **Current Program v0** and freezes their audience-facing truth before Home / Board runtime implementation.

It does not redesign Home.  
It does not create a new Thing table or ontology.  
It does not change Membership, payment, event registration, Board permissions or production runtime.  
It does not make every existing Thing current merely because it exists.

Pipeline:

```text
SOURCE TRUTH
→ THING PROJECTION
→ PROGRAMMING DECISION
→ CURRENT PROGRAM V0
→ later HOME / BOARD SURFACE PROJECTION
```

The Phase 1 contract remains the structural authority. This artifact supplies the reviewed initial composition.

---

# 1. Owner decisions captured on 2026-09-15

Two explicit product decisions govern this composition:

1. **`Деньги на ветер` is a finished course ready to take.**
2. **`НЕ КОМАНДА` is expected to change and is therefore excluded from Current Program v0 until its model stabilizes.**

These decisions are narrower than a general product-model change.

They do not imply:

- a price for `Деньги на ветер`;
- payment readiness;
- a server / AI adaptive mode;
- Membership access requirements;
- any new semantics for `НЕ КОМАНДА`.

---

# 2. Source conflict notice

The owner decision for `Деньги на ветер` is newer than several inherited snapshots that still describe it as `mvp-in-development`, including:

- `courses/dengi-na-veter.md` before this branch correction;
- the Phase 0 truth snapshot;
- the current `dc_entities.status` snapshot inspected during Phase 1 preparation.

For **Phase 1A composition**, the newer explicit owner decision is the intended product truth:

> **READY TO TAKE / COURSE AVAILABLE FOR PASSAGE**

However runtime must not silently mix the new projection with stale operational status.

Before G6 runtime validation, the implementation Result must either:

1. align the operational source used by runtime; or
2. use an explicitly reviewed composition source that owns the public projection without pretending the stale operational status says the same thing.

No live Supabase mutation is authorized by this document.

---

# 3. Current Program v0 — selected set

Current Program v0 is deliberately small:

1. **Деньги на ветер** — ready course / immediate experience;
2. **Dementor Lab** — current approved public project presentation;
3. **Фуэнхирола** — planned real-world event with factual public frame.

This is not a ranking of all Dementor Club value. It is the first coherent program cover with three different honest states:

```text
TRY NOW
LOOK NOW
WATCH WHAT IS COMING
```

---

# 4. ThingProjection · Деньги на ветер

## THING

**thing_ref**  
`program:dengi-na-veter`

**source authority**  
- canonical editorial/product source: `courses/dengi-na-veter.md`;
- owner status correction: 2026-09-15;
- public route implementation exists at `/courses/dengi-na-veter/`.

**premise**  
Цифровой адаптивный карточечный курс о том, как человек рационально оправдывает отношение к тратам.

**current truth**  
**Курс готов к прохождению.**

This does not imply a paid commercial launch or server-AI mode.

**primary action**  
`ПРОЙТИ КУРС` → `/courses/dengi-na-veter/`

**continuation**  
After the course experience, continuation may point to another relevant Thing / Program surface only if that continuation already exists and is contextually useful. No generic Join is required as the default next step.

**blocked claims**

Do not claim without separate authority:

- approved price;
- payment / checkout availability;
- server-side AI adaptation;
- guaranteed course length;
- Membership requirement;
- commercial conversion status.

## PROGRAMMING MOMENT

**reason**  
The course moved from development framing to an experience that is ready to take.

**why_now**  
There is now a direct audience action with standalone value: the person can take the course rather than only read about its development.

**moment_type**  
`RELEASE / EXPERIENCE AVAILABLE`

**editorial_window**  
Current until a later meaningful course state supersedes it. Do not refresh merely because the page exists.

**Home eligibility**  
`YES`

**Board eligibility**  
`YES`, as a Thing projection if Board receives the reviewed Program composition; not as an automatically generated raw Artifact.

**sequence context**  
High priority for v0 because it has the strongest immediate action: **try the Thing now**.

---

# 5. ThingProjection · Dementor Lab

## THING

**thing_ref**  
`project:dementor-lab`

**source authority**  
- project authority: `SLADZARI/dementor_lab`;
- approved public landing authority: V19, approved 2026-09-12;
- Dementor Club project/runtime semantic sources under `projects/dementor-lab/`;
- public Club route: `/projects/dementor-lab/`.

**premise**  
Dementor Lab is a game/project where player-built causal BRAIN graphs produce deterministic behavior and collisions; the current public surface presents the project and its direction.

**current truth**  
**Public approved project presentation exists. The game is not yet a public playable Release.**

**primary action**  
`ПОСМОТРЕТЬ LAB` → `/projects/dementor-lab/`

**continuation**  
Project surface / related released material when it exists. Do not route to generic membership merely to deepen the funnel.

**blocked claims**

Do not claim:

- `PLAY NOW`;
- publicly playable game;
- finished game release;
- fixed final in-game Design / Domain / Architecture where project authority still leaves them unresolved;
- registration / purchase availability.

## PROGRAMMING MOMENT

**reason**  
Approved public landing V19 is the current public presentation authority.

**why_now**  
The project has a reviewed public representation that can now function as a Thing worth encountering, while still honestly separating presentation from playable release.

**moment_type**  
`CURRENT PROJECT PRESENTATION`

**editorial_window**  
Current while V19 remains public authority or until a later meaningful project/release change supersedes it.

**Home eligibility**  
`YES`

**Board eligibility**  
`YES`, as a reviewed Project/Thing projection; internal project activity does not automatically become programming.

**sequence context**  
Useful after the immediate course experience because it shows **what the Club is currently making** without pretending that making equals release.

---

# 6. ThingProjection · Фуэнхирола

## THING

**thing_ref**  
`event:fuengirola`

**source authority**  
- `events/fuengirola.md`;
- current event operational truth where available;
- public route: `/events/fuengirola/`.

**premise**  
Камерная офлайн-сессия Dementor Club в Фуэнхироле до 7 участников с Габилем, построенная вокруг демонтажа преждевременной ясности.

**current truth**

- status: `PLANNED`;
- location: Fuengirola / Spain;
- capacity: up to 7;
- Dementor: Габиль;
- date/time: not fixed for public claim;
- price: not fixed for public claim;
- registration-open state: not confirmed.

**primary action**  
`ПОСМОТРЕТЬ СОБЫТИЕ` → `/events/fuengirola/`

This is intentionally different from `ВСТУПИТЬ` or `ЗАПИСАТЬСЯ`.

**continuation**  
Event page may explain the current concept and factual state. Any future registration action must appear only after its own source explicitly confirms availability and eligibility.

**blocked claims**

Do not publish as fact:

- date/time;
- exact venue;
- duration;
- price;
- registration open;
- payment;
- confirmed participant list;
- Join as an eligibility promise for receiving this event unless that relation is explicitly re-approved.

## PROGRAMMING MOMENT

**reason**  
A concrete planned Club event exists with stable concept, place, capacity and Dementor attribution.

**why_now**  
It gives Current Program a truthful upcoming real-world horizon without fabricating registration or commercial readiness.

**moment_type**  
`PLANNED EVENT / ANTICIPATION`

**editorial_window**  
Current while the event remains planned and its factual frame remains valid. A date, registration opening, cancellation or completion would each be a new meaningful delta.

**Home eligibility**  
`YES`

**Board eligibility**  
`YES`, as Event/Thing projection; do not duplicate it as a parallel Artifact merely to make it appear on Board.

**sequence context**  
Provides **what may happen next** after the two currently inspectable/usable Things.

---

# 7. WATCH / excluded from v0

## НЕ КОМАНДА

State for Phase 1A:

`WATCH / MODEL CHANGING / NOT IN CURRENT PROGRAM V0`

Reason:

- the Practice exists;
- the owner explicitly says its model will change;
- publishing a new program projection now would freeze semantics that are already known to be unstable.

Rule:

> **DO NOT STABILIZE A CHANGING THING BY ACCIDENT THROUGH UI.**

No Home Program Cover card, Board amplification or new CTA should be created from the old model merely because a current page/record exists.

## DC-9

`EVERGREEN INVENTORY / NOT SELECTED FOR V0`

DC-9 remains a real standalone experience and Join entry mechanism, but Current Program v0 does not need to include it without a new meaningful programming reason.

## Logic & Awareness

`EVERGREEN PROJECT / NOT SELECTED FOR V0`

The project remains part of the ecosystem. Exclusion from the first three-item Current Program is not deprecation.

## Думай с опасностью

`CONDITIONAL`

Do not promote as released/commercial until its release truth is explicitly confirmed by its own authority.

## Merch

`BLOCKED FROM CURRENT PROGRAM COMMERCE AMPLIFICATION`

Do not use Phase 1A to work around unresolved commerce/payment truth.

---

# 8. Current Program Cover v0 — editorial projection

The first audience-facing composition should communicate three different kinds of current value without turning Home into a catalog.

Recommended order:

### 1 · ДЕНЬГИ НА ВЕТЕР

**Курс уже можно пройти.**  
Цифровой маршрут о логике трат, оправданиях и моменте, когда удовольствие превращается в сравнительную таблицу.

Primary action: **ПРОЙТИ КУРС**

### 2 · DEMENTOR LAB

**Смотрим, как устроен мозг, который потом будет спорить за вас.**  
Public project presentation is available; playable Release is not yet claimed.

Primary action: **ПОСМОТРЕТЬ LAB**

### 3 · ФУЭНХИРОЛА

**Планируем камерную лабораторию несовместимых очевидностей в Испании.**  
До 7 человек. Дементор — Габиль. Дату, цену и открытую регистрацию пока не обещаем.

Primary action: **ПОСМОТРЕТЬ СОБЫТИЕ**

The exact final Home copy remains an editorial implementation decision, but it must preserve these facts and actions.

---

# 9. Surface rules

## Home

Home answers:

> **Что у Dementor сейчас стоит попробовать, посмотреть или держать в поле зрения?**

For v0:

- 3 primary Things are enough;
- no generic `Подробнее`;
- no duplicate Join CTA inside every Thing;
- do not expose source/database terminology;
- state difference must remain visible: READY / PUBLIC PRESENTATION / PLANNED.

## Board

Board answers:

> **Что сейчас происходит с вещами?**

For the selected three:

- use the same Thing truth;
- show only one contextual signal + one useful action;
- do not create a second source of truth;
- do not auto-promote raw Artifact activity into Program.

---

# 10. Acceptance criteria for Phase 1A composition

This semantic composition is acceptable when:

1. Current Program v0 contains only the three selected Things above.
2. `Деньги на ветер` projects as **ready to take**, with `/courses/dengi-na-veter/` and `ПРОЙТИ КУРС`.
3. No price, payment or AI-backend claim is introduced for `Деньги на ветер`.
4. Dementor Lab is presented as an approved public project presentation, not a playable Release.
5. Fuengirola remains `PLANNED` with no invented date, price or registration state.
6. `НЕ КОМАНДА` is explicitly excluded from v0 while its model changes.
7. DC-9 and Logic & Awareness remain valid evergreen inventory rather than being falsely deprecated.
8. Home/Board may later consume the same reviewed Thing truth without page-owned duplicate semantics.
9. Runtime implementation does not begin while the stacked branch carries stale Weekly OS active-Result pointers; kernel state must be synchronized first.
10. No merge to production and no deploy is implied by this document.

---

# 11. Kernel / Result boundary

The canonical `dementor-club` branch currently has no active integration Result, but PR #205 was created from an older kernel snapshot that still carries `board-share-receive-ritual-v1` as `currentResult` / active integration branch.

Therefore this Phase 1A branch **must not register a second active Result on top of that stale kernel snapshot**.

Before runtime implementation:

1. synchronize/rebase the Phase 1 stack onto the current semantic kernel state;
2. verify `currentResult` / `activeIntegrationBranch` again;
3. then create exactly one implementation Result for Current Program runtime;
4. keep that Result to one active integration branch.

This composition artifact is a prerequisite/decision input, not evidence that runtime is DONE, VALIDATED, PRODUCTION READY or RELEASED.
