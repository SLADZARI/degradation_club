# DEMENTOR CLUB — PHASE 1 · CURRENT PROGRAM / THING PROJECTION IMPLEMENTATION CONTRACT v1

Status: **WORKING IMPLEMENTATION CONTRACT / NO RUNTIME CHANGE**  
Updated: **2026-09-15**  
Stack: Product & Marketing Package 01–15 → Product→Production Audit / Phase 0 (#196)

## Purpose

Phase 1 translates the product authorities into one small implementation contract before any Home redesign or broad runtime refactor.

The contract answers four questions:

1. **What may behave as a Thing in the current product?**
2. **How does a Thing become a Programming Moment?**
3. **What minimal semantic ViewModel may Home and Board consume?**
4. **Which current sources are safe, conditional or blocked by Phase 0?**

The goal is not to build a new ontology.

The goal is to stop each surface from independently guessing:

- what the object is;
- why it matters now;
- what may truthfully be promised;
- what the person can do next.

Canonical pipeline:

```text
SOURCE OBJECT
→ THING CANDIDATE
→ THING PROJECTION
→ PROGRAMMING DECISION
→ SURFACE PROJECTION
→ EXPERIENCE
```

---

# 1. Authority and boundaries

This contract is subordinate to:

- Product & Marketing Package 01–15;
- `PRODUCT_TO_PRODUCTION_AUDIT_2026-09-15.md`;
- `PHASE_0_TRUTH_REALITY_ALIGNMENT_2026-09-15.md`;
- `PHASE_0_ADDENDUM_RELEASE_ACCESS_DECISIONS_2026-09-15.md`.

If this contract conflicts with a primary authority, the primary authority wins.

Use the conflict order from `15`:

```text
TRUTH
→ VALUE
→ MEANING
→ SEMANTICS
→ AUTONOMY
→ OPTIMIZATION
```

## Non-goals

Phase 1 does **not** require:

- a universal `dc_things` table;
- migration of Events / Programs / Projects / Artifacts into one storage type;
- new Membership tiers;
- payment / checkout work;
- automatic ingestion of every Board Artifact;
- a social feed;
- recommendation AI;
- a full Home visual redesign before the semantic layer exists;
- a universal workflow engine;
- replacing project-specific editorial authorities;
- making every current object a Programming Moment.

---

# 2. Core rule

> **SOURCE OBJECTS KEEP THEIR OPERATIONAL IDENTITY. PRODUCT SURFACES RECEIVE A SEMANTIC PROJECTION.**

Examples:

- Event remains an Event in its source;
- Program remains a Program;
- Project remains a Project;
- Artifact remains an Artifact carrier;
- DC-9 remains its current system;
- a Project may contain or produce multiple Things.

The projection exists so the audience does not need to understand storage taxonomy before understanding the Thing.

---

# 3. Thing candidate test

A source object may become a **Thing candidate** only when it passes the following checks.

## 3.1 Standalone value

There is something a person can actually experience, inspect, understand, watch, read, play, try or meaningfully anticipate.

A Thing must not exist only to push the person toward Join, Membership or another CTA.

Test:

> **If the next CTA disappears, is there still a worthwhile object here?**

## 3.2 Identifiable object

The candidate has enough identity to be referred to consistently:

- stable source reference or public route;
- title / working identity;
- one understandable premise.

## 3.3 Factual source authority

Current public claims can be traced to an approved source.

Unknown dates, prices, availability, eligibility or Release state are not filled by inference.

## 3.4 Exact experience or honest state

At least one of these is true:

- a real public experience exists;
- a real public proof/prototype exists;
- a real current making state can be shown honestly;
- a real planned Event / experience can be shown honestly.

`URL EXISTS` is not sufficient on its own.

## 3.5 Primary action exists or truthful closure is possible

The Thing has one useful action, for example:

- open;
- watch;
- read;
- play;
- inspect current prototype;
- see project;
- see event;
- see what changed.

If no useful next action exists, truthful closure is preferable to a generic Join/Board CTA.

## 3.6 No Phase-0 conflict is amplified

A candidate may be visible while some facts are unresolved, but the unresolved fact cannot become the reason or promise of the Programming Moment.

---

# 4. ThingProjection v1

`ThingProjection` is a **read model / ViewModel contract**, not a new storage ontology.

It may be derived from current sources.

## 4.1 Required fields

```text
thing_ref
source_ref
source_kind
identity
premise
current_truth
primary_action
source_authority
```

### `thing_ref`

Stable semantic reference used across Program / Home / Board / continuation.

It may be derived from an existing stable ID/slug.

It does not require a new universal database ID in Phase 1.

### `source_ref`

Pointer to the operational source.

Examples:

- Program slug / entity id;
- Event id / slug;
- Project source / route;
- Artifact id;
- DC-9 experience id.

### `source_kind`

Implementation provenance only.

Examples:

- program;
- event;
- project;
- artifact;
- assessment;
- static editorial source.

This field must not become the primary audience label.

### `identity`

What the person should call the Thing.

### `premise`

One short explanation of what the Thing is / why it may be worth attention.

Not an ecosystem explanation.

### `current_truth`

Literal present state relevant to the audience.

Examples:

- playable;
- public prototype;
- in making;
- active recurring practice;
- planned Event;
- released;
- preview;
- continuation available.

The value must be supported by Phase 0 / source authority.

### `primary_action`

One exact action the person can take **now**.

It includes:

```text
action_label
destination
availability
```

No action may promise a stronger state than the Thing actually has.

### `source_authority`

Human-readable provenance used in review/admin context.

It is not necessarily shown to the audience.

---

## 4.2 Optional fields

Use only when real:

```text
form
media
release_truth
production_state
project_relation
dementor_relation
participation_opportunity
latest_meaningful_history
continuation
blocked_claims
```

### `form`

How the Thing is experienced.

Examples:

- course;
- game;
- article/series;
- physical Event;
- object;
- practice;
- interactive assessment.

Form is not identity.

### `release_truth`

Only where Release meaning is actually resolved.

Do not derive Release from URL existence.

### `production_state`

May coexist with Release state.

A Thing may be released and still being made.

### `participation_opportunity`

Only a concrete current action.

Not Membership by default.
Not generic `discuss on Board`.

### `latest_meaningful_history`

Only a consequence or meaningful change, not generic activity.

### `continuation`

One natural next Thing / next episode / History / Project continuation where real.

No fake recommendation is required.

### `blocked_claims`

Useful implementation guard from Phase 0.

Examples:

- no commerce claim;
- no finished-release claim;
- no Join-as-eligibility claim.

This may stay internal.

---

# 5. ProgrammingDecision / ProgrammingMoment v1

A Thing does not become part of the Current Program merely because it exists.

A Programming Moment is an **editorial decision**.

Canonical rule:

```text
THING EXISTS
≠ PROGRAMMING MOMENT
```

## 5.1 Minimal contract

```text
moment_ref
thing_ref
reason
why_now
moment_type
editorial_window
surface_eligibility
sequence_context
```

### `reason`

The actual editorial reason this Thing deserves attention now.

Examples:

- new public proof exists;
- first playable prototype exists;
- next episode/release appeared;
- Event became concrete enough to anticipate;
- meaningful consequence happened;
- old Thing became relevant again for a real reason.

### `why_now`

Human-readable sentence answering:

> **Почему именно сейчас?**

If the answer is only `because it was published today`, the decision is not automatically valid.

### `moment_type`

Controlled editorial presentation category, not storage ontology.

Initial vocabulary:

- `FRESH / ВЫШЛО`;
- `MAKING / СЕЙЧАС МУТЯТ`;
- `TRY / МОЖНО ПОПРОБОВАТЬ`;
- `CONTINUES / ПРОДОЛЖАЕТСЯ`;
- `PARTICIPATE / МОЖНО ВПИСАТЬСЯ` — only when a real Participation Opportunity exists.

A Thing may qualify for more than one semantic state internally, but a surface should normally present one dominant context.

### `editorial_window`

Defines when the moment is relevant.

It is not necessarily publication date.

### `surface_eligibility`

Where this moment may appear:

- Home;
- Board public projection;
- Telegram/outbound later;
- other editorial surfaces.

Phase 1 initially needs Home + Board compatibility only.

### `sequence_context`

Optional relationship to another Thing / previous episode / Project sequence.

---

# 6. Programming decision rules

## 6.1 Manual/curated first

Phase 1 starts with a small curated Program.

Do not auto-generate Programming Moments from:

- created_at;
- published_at;
- Artifact status;
- Page existence;
- database update;
- Telegram publication;
- high clicks;
- membership state.

## 6.2 No delta → no update

A Thing already known to the audience requires a meaningful delta before being presented as new/current again, unless a separate editorial reason exists.

## 6.3 Old Things may return

Freshness is not date.

An older Thing may re-enter the Program when the reason is real.

## 6.4 Participation is not a default CTA

`PARTICIPATE` requires a concrete open need/action.

Do not generate it from:

- Project existence;
- Board existence;
- Membership availability;
- generic comments/discussion.

## 6.5 Commercial priority does not set Program priority

Merch or paid Things do not enter the Program because revenue is possible.

---

# 7. SurfaceProjection v1

Home and Board should consume the same semantic truth but answer different questions.

## 7.1 Home contract

Home answers:

> **Что у Dementor сейчас стоит посмотреть / попробовать / заметить?**

Initial Program Cover may contain:

1. one lead Programming Moment;
2. 2–4 additional moments;
3. one continuation / what changed;
4. at most one Participation Opportunity if real.

Home does not need to expose source_kind, database status or internal taxonomy.

### Home priority

```text
THING / PROOF
→ WHY NOW
→ EXACT ACTION
```

Structural explanation of Club / Community / Projects may remain lower on the page.

Join is not the default Program action.

## 7.2 Board contract

Board answers:

> **Что сейчас происходит с вещами?**

Board may contain more operational breadth than Home, but each audience card should still resolve to:

```text
Thing identity
+ meaningful context
+ useful proof/media
+ one signal
+ one primary action
```

Board must not automatically promote every Artifact into Current Program.

Raw Artifacts may continue to exist operationally while editorial projection is curated separately.

---

# 8. Primary-action rules

A primary action must describe the real next experience.

Preferred patterns:

- `ОТКРЫТЬ`;
- `СМОТРЕТЬ`;
- `ИГРАТЬ` — only if playable;
- `ПОПРОБОВАТЬ` — only if usable now;
- `ПОСМОТРЕТЬ ПРОТОТИП`;
- `ПОСМОТРЕТЬ, ЧТО ИЗМЕНИЛОСЬ`;
- `ПОСМОТРЕТЬ ПРОЕКТ`;
- `ПОСМОТРЕТЬ СОБЫТИЕ`;
- `ВПИСАТЬСЯ` — only with concrete Participation Opportunity.

Avoid as generic defaults:

- `ВСТУПИТЬ`;
- `ОБСУДИТЬ НА BOARD`;
- `УЗНАТЬ БОЛЬШЕ`;
- `ПОСМОТРЕТЬ CLUB`;
- `ЗАРЕГИСТРИРОВАТЬСЯ` when account is not needed for the experience.

Decision test:

> **Does the action land on exactly what was promised?**

---

# 9. Phase-1 source safety matrix

## SAFE

These objects may be used as initial reference Things with literal current claims.

### DC-9

Safe meaning:

- standalone interactive experience;
- optional Membership branch after completion.

Blocked:

- treating completion as user-level promotion;
- making Membership the definition of success.

### Деньги на ветер

Safe meaning:

- Course / adaptive digital;
- MVP in development;
- prototype / making context only where supported by the actual surface.

Blocked:

- finished commercial course claim;
- payment/availability claim without source.

### НЕ КОМАНДА

Safe meaning:

- active recurring Practice;
- Monday 10:00 Europe/Madrid.

Blocked:

- `join now` / available participation unless a real Participation Opportunity is explicitly confirmed.

### Dementor Lab

Safe meaning:

- public Project presentation / proof;
- project in development;
- public access/playability only when explicitly released.

Blocked:

- `PLAY NOW` before a playable Release exists.

### Dementor Battle

Safe meaning:

- Project in development;
- show real current proof/prototype if available.

Blocked:

- generic Board discussion as the default Participation claim;
- finished game claim.

### Robo Games

Safe meaning:

- Project in development;
- show real prototype/game proof when available.

Blocked:

- finished game claim;
- generic Participation without specific need.

### Logic & Awareness

Safe meaning:

- editorial Project with its own source authority;
- existing releases/series may be projected when verified.

Project-specific editorial voice remains authoritative.

### Fuengirola

Safe meaning:

- PLANNED Event;
- Fuengirola / Spain;
- up to 7 people;
- Габиль;
- details currently after onboarding if operationally necessary to state.

Blocked until #204:

- Membership as intentional eligibility policy;
- `Join → get Event` as Program CTA.

Blocked generally until sourced:

- date;
- price;
- open registration;
- payment.

---

## CONDITIONAL / P0 DECISION

### Думай с опасностью

Operational truth: `approved-draft / self-paced`.

Until #203 resolves Release meaning:

Allowed:

- identify the Thing;
- link to real accessible surface where useful;
- call it approved draft / preview only when literal.

Blocked:

- finished Release claim;
- `готовый курс`;
- Programming Moment whose editorial reason depends on completed Release.

Initial Phase-1 reference implementation should preferably **not use it as the lead Program proof** until #203 is resolved.

---

## BLOCKED FROM PHASE-1 PROGRAM AMPLIFICATION

### Merch / Objects / Wear

Until #198/#199:

- no commerce-open Programming Moment;
- no preorder/sold-out value signal;
- no Program priority based on raw sales_state.

A physical object may later appear editorially for non-commerce reasons only after its factual presentation is clean.

### Raw Board Artifacts

Until #201 + editorial disposition:

- do not auto-ingest current active Artifacts into Program;
- do not use Artifact activity as why-now;
- do not call Board activity audience demand.

An individual Artifact may become a Thing only after it passes the standalone Thing candidate test.

---

# 10. Initial reference set

Use a deliberately small cross-section to prove the semantic layer.

Recommended first set:

1. **DC-9** — standalone interactive experience;
2. **Деньги на ветер** — in-making digital Program;
3. **НЕ КОМАНДА** — active recurring Practice;
4. **Dementor Lab** — Project-backed public proof;
5. **Logic & Awareness** — editorial Project / releases;
6. **Fuengirola** — planned physical Event with restricted safe claims.

This set tests multiple source types without Merch and without raw Artifact auto-ingestion.

`Думай с опасностью` joins the reference set after #203.

A native Artifact-backed Thing joins after #201 + editorial review identifies one real standalone example.

---

# 11. Resolver contract

Phase 1 needs one logical resolver sequence.

Implementation shape is intentionally left open.

```text
resolveSource(source_ref)
→ evaluateThingCandidate(source)
→ buildThingProjection(source, authority)
→ evaluateProgrammingDecision(thing, editorial_context)
→ buildSurfaceProjection(thing, moment, surface)
```

## Required behavior

The resolver must be able to return:

- `NOT_A_THING`;
- `THING_NOT_IN_PROGRAM`;
- `PROGRAMMING_MOMENT`;
- `BLOCKED_BY_TRUTH_GATE`.

This is important because existence must not force publication/programming.

## No persistence requirement yet

Programming decisions may initially live in a reviewed config/editorial source.

Do not create a new database table until repeated operational editing makes persistence necessary.

---

# 12. Editorial operation v1

For each candidate the editor answers, in order:

1. **What is the Thing?**
2. **What factual source owns its current state?**
3. **What can a person actually experience now?**
4. **What claim is blocked?**
5. **Why should anyone look now?**
6. **What is the one useful action?**
7. **What, if anything, naturally follows?**

If question 5 has no answer:

> keep the Thing available, but do not create a Programming Moment.

If question 6 has no answer:

> truthful closure is allowed.

---

# 13. Metrics semantics for Phase 1

Phase 1 does not need a new dashboard.

It needs enough semantics to answer three questions:

1. Did a person open a concrete Thing from the Program?
2. Did they actually start/consume the experience according to its Form?
3. Did they open a truthful continuation?

Minimum conceptual chain:

```text
PROGRAM EXPOSURE
→ PROGRAM → THING OPEN
→ FORM-AWARE EXPERIENCE
→ CONTINUATION OPEN
```

Event names are an implementation detail and should follow Metrics authority.

## Guardrails

- internal/test population must be separable;
- a click is not consumption;
- a page open is not automatically a qualified experience;
- no target is set before baseline exists;
- raw Board activity is not Program Health.

---

# 14. Phase-1 runtime PR boundary

The first runtime PR after this contract should remain small.

Recommended scope:

### A. Program composition source

A reviewed small set of Programming Moments built from safe reference Things.

### B. ThingProjection adapter v0

Enough fields for Home and Board to render consistent meaning.

### C. Home Program Cover v1

Use the projection to show:

- one lead Thing;
- a few secondary Things;
- literal why-now/context;
- exact actions.

This is a semantic change first; visual redesign may be incremental.

### D. Board projection hook

Allow Board to consume the same ThingProjection semantics for selected/reference Things.

Do not redesign Contribution in this PR.
Do not auto-promote raw Artifacts.

### E. Minimal semantic instrumentation

Only the events needed to distinguish Program→Thing and real experience/continuation, while respecting #201.

---

# 15. What explicitly stays out of the first runtime PR

- Merch commerce;
- payment;
- Membership model changes;
- Contribution / Direct Publish split;
- Telegram programming automation;
- full History model;
- Situation → Intervention resolver;
- automated recommendations;
- broad schema migration;
- universal Things table;
- automatic Artifact programming;
- deletion of legacy source taxonomy.

These belong to later phases once Program/Thing semantics prove themselves in runtime.

---

# 16. Acceptance tests

Phase 1 contract is implemented successfully on the initial reference set when all are true.

## Truth

- every surfaced claim traces to a source authority;
- blocked Phase-0 claims cannot appear through fallback or generic CTA;
- `Думай с опасностью` is not presented as finished before #203;
- Fuengirola does not use Join as intentional eligibility CTA before #204;
- Merch does not enter the Program through raw commerce state.

## Thing semantics

- Event-backed, Program-backed, Project-backed and DC-9 Things can share one audience-facing projection contract;
- the audience does not need to know source_kind to understand the object;
- Project itself is not automatically collapsed into Thing output;
- Artifact existence does not force Thing status.

## Programming

- every Program item has a human-readable `why_now`;
- Programming is not derived from chronology alone;
- no-delta objects can remain available without appearing as current;
- old Things may return for a real editorial reason.

## Home

- first meaningful proof appears before Join pressure;
- Home can answer `что сейчас стоит посмотреть?`;
- each Program card has one exact useful action;
- structural ecosystem explanation is secondary.

## Board

- selected cards can answer `что сейчас происходит с этой Thing?`;
- technical provenance/status is not primary meaning;
- raw Artifact chronology does not define Program.

## Autonomy

- viewing alone remains a complete use;
- Join / Contribution / Participation are optional branches;
- no fake Participation CTA is introduced.

## Measurement

- internal/test population can be separated;
- Program→Thing is distinguishable from generic pageview;
- experience is form-aware where measurable;
- continuation can be observed without manufacturing notification debt.

---

# 17. Definition of Done — Phase 1 contract

The contract itself is ready for runtime implementation when:

- [x] Thing candidate test is defined;
- [x] ThingProjection v1 is defined;
- [x] ProgrammingDecision / ProgrammingMoment v1 is defined;
- [x] Home and Board surface roles are distinct;
- [x] exact primary-action rule is defined;
- [x] safe / conditional / blocked inputs are listed;
- [x] initial reference set is defined;
- [x] resolver states include NOT_A_THING / NOT_IN_PROGRAM / MOMENT / BLOCKED;
- [x] no new universal storage ontology is required;
- [x] Phase-0 issues #198–#204 are respected;
- [x] first runtime PR boundary is explicit.

---

# Final implementation rule

> **DO NOT REDESIGN HOME TO DISCOVER THE PROGRAM. DEFINE THE PROGRAM SO HOME CAN RENDER IT.**

And:

> **DO NOT ASK BOARD WHAT IS IMPORTANT. GIVE BOARD THE SAME SEMANTIC TRUTH THAT MAKES HOME COHERENT.**

Phase 1 begins with a small curated Program, not with automation.