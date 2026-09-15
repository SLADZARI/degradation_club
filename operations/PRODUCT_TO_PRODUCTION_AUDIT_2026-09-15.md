# DEMENTOR CLUB — PRODUCT → PRODUCTION AUDIT

Status: **WORKING AUDIT / READ-ONLY PRODUCT REQUIREMENTS**  
Updated: **2026-09-15**

## Purpose

This document compares three simultaneously existing realities:

1. **LIVE PUBLIC SITE** — what a person can encounter on `dementor.club` now;
2. **CURRENT PRODUCTION BRANCH** — `dementor-club-production` at commit `688899e31b82e14c31f5f805b2bce4f00f3741c0`;
3. **PRODUCT & MARKETING PACKAGE 01–15** — the newest semantic model, ending with `15 · Product Principles / Anti-patterns` in PR #195.

The purpose is not to redesign the site from scratch.

It is to answer, surface by surface and object by object:

- what already exists;
- what remains valid;
- what conflicts with the new product model;
- what must move, be reframed, removed from the primary journey or newly built;
- what the resulting product experience should become.

No runtime, schema, production data, permissions or deployment is changed by this audit.

---

# 0. Audit actions

Every finding uses one primary action.

## KEEP

The existing surface / object already has the correct product role. Improve only factual correctness, presentation or integration where needed.

## REFRAME

Keep the route / source / implementation, but change its product meaning, hierarchy, projection or message.

## MOVE

Keep the content / function, but move it out of the primary journey or into a more appropriate context.

## REMOVE

Remove from the primary product experience because it creates a false promise, duplicate ontology, stale truth or product drift. This does **not** automatically mean deleting source data.

## BUILD

A missing semantic or experience layer is needed. `BUILD` does **not** automatically mean a new database entity or a new page. Prefer projection / composition over new ontology where possible.

---

# 1. Executive diagnosis

The current product is not missing functionality.

It already contains:

- standalone interactive courses;
- recurring practices;
- planned physical experiences;
- Events;
- Projects;
- physical Objects / Wear;
- Dementor profiles;
- DC-9;
- Membership;
- Community Board;
- Artifacts;
- Contribution / responses / reactions;
- direct Share;
- Telegram distribution;
- Workspace;
- History-like archive states;
- analytics primitives;
- Supabase source data.

The main mismatch is **causal architecture**.

The current public site is still largely organized as:

```text
CLUB
→ SECTIONS / ECOSYSTEM
→ JOIN / PEOPLE / PROJECTS / EVENTS / MERCH
```

The 01–15 package defines the product primarily as:

```text
THING
→ EXPERIENCE
→ CONTINUATION / PROGRAM
→ RETURN
→ optional CONTRIBUTION / PARTICIPATION / INTERVENTION
→ optional PAYMENT
```

Therefore the required transformation is primarily:

> **FROM AN ECOSYSTEM PORTAL TO A PROGRAM OF THINGS.**

This does not require deleting the ecosystem.

It changes which layer has semantic priority.

---

# 2. Three-reality problem

Before product redesign, the current truth must be synchronized.

## 2.1 LIVE site ≠ current production branch

Examples observed on 2026-09-15:

### Projects

LIVE `/projects/` still presents:

- `01 ACTIVE PROJECT`;
- only `ЛОГИКА И ОСОЗНАННОСТЬ` as registered Project.

Current `dementor-club-production` contains Projects Hub v2 with:

- Dementor Lab;
- Dementor Battle;
- Robo Games;
- Logic & Awareness.

The production branch commit states that #183 was merged but **deploy was not authorized**.

### Merch

LIVE `/merch/` still says:

- `SALES / NOT OPEN`;
- `CHECKOUT / DISABLED`;
- T-shirt prices `TBD`;
- Object 001 `€220 / NOT OPEN`.

Current production branch has a newer `LIVE CATALOG / LIVE PRICE + STATUS` presentation intended to read runtime state.

Therefore a product audit that reads only LIVE or only the branch will produce a false current-state picture.

---

## 2.2 Current production branch ≠ current data source

Current Supabase source inspection shows:

### `dc_merch_items`

- `DC-OBJECT-001` — `€520`, `preorder`, public;
- `SH-DEM-01` — `€89`, `sold_out`, public;
- `SH-DEM-02` — `€79`, `not_open`, public;
- `SH-DEM-03` — `€79`, `not_open`, public;
- no current row for `SH-DEM-04`.

But production HTML for Object 001 contains a static fallback:

- `€220`;
- `SALES / NOT OPEN`.

And the current production Merch page statically includes four T-shirts.

This is a **P0 promise/reality conflict**.

The runtime may replace static values after load, but crawlers, partial failures, screenshots and pre-runtime rendering can still expose contradictory facts.

### Product requirement

There must be one approved owner for:

- price;
- availability;
- sales state;
- whether the product exists publicly;
- whether a CTA may appear.

Every public projection must render the same truth or explicitly declare itself a concept / historical state.

---

## 2.3 Static catalog ≠ current source truth

`/catalog/` statically declares:

- four Programs;
- one Event;
- one Project;
- one Object;
- four Wear items.

Current `dc_entities` contains only:

- 4 Programs;
- 1 Event.

Current `dc_entities` has no Project rows.

Projects currently rely on project-specific sources / code-level public pages rather than the canonical entity registry.

This is not automatically wrong: Product Model explicitly allows different source entities to back Things.

But the public Catalog must not imply a single current registry if it is actually a manually maintained cross-source snapshot.

### Action

**REFRAME / MOVE** Catalog as a secondary registry / provenance tool.

Do not use it as primary product navigation.

Either:

- generate it from authoritative sources;
- or remove hard counts / statuses that can become stale.

---

# 3. P0 truth gates before product transformation

These are blockers because `15` defines:

**PROMISE MUST MATCH REALITY.**

## P0.1 Reconcile LIVE / branch / source truth

Create one reviewed reality map for:

- route deployed state;
- public availability;
- entity / Thing status;
- prices;
- dates;
- participation availability;
- current Releases.

## P0.2 Canonical URL debt

Current production files contain non-canonical public metadata in several places.

Examples:

- Fuengirola OG URL / image points to `degradation-club.vercel.app`;
- Gabil profile OG URL / image points to `degradation-club.vercel.app`;
- Object 001 OG URLs point to `sladzari.github.io/degradation_club`;
- `НЕ КОМАНДА` OG URLs point to `sladzari.github.io/degradation_club`.

### Product requirement

All current public Things / Events / Dementor works must identify their canonical public address consistently as `dementor.club` unless the external address is intentionally the canonical source.

This is Distribution + Trust, not cosmetic SEO cleanup.

## P0.3 Internal / test activity separation

Current Board data contains 17 Artifacts:

- 3 active;
- 4 archived;
- 10 expired.

Several recent expired records are explicit smoke / test publications (`#176 SMOKE ON`, `#176 SMOKE OFF`, Board test posts).

This means production activity cannot be interpreted as audience/program activity without classification.

### Product requirement

Before using Board activity or analytics as evidence:

- exclude / tag internal test records;
- separate editorial/public activity from QA activity;
- do not treat raw Artifact count as Program Health.

---

# 4. Target product topology

The desired product is not a completely new IA.

Use existing surfaces, but give them new roles.

| Surface | Target role |
| --- | --- |
| Home | Cover of the current Editorial Program |
| Thing | Primary unit of experience |
| Projects | Temporary making contexts connecting multiple Things |
| Board | Radar of meaningful current changes around Things |
| Community | People, contribution and participation around Things |
| Dementor | Body of work + Practice + relevant Situations |
| Events | Things experienced in a real time/place window |
| Courses / Games / Tools | Standalone Things / experiences |
| Merch / Objects | Physical Things |
| DC-9 | Standalone experience + optional Membership branch |
| Join / Apply | Access / membership flow, not main product progression |
| Workspace | Operational personal surface, not public product center |
| Catalog | Secondary registry / provenance utility |
| Archive | Terminal-state register; not Product History itself |
| History | Consequences and continuation attached to Things |
| Analytics | Observation of the value chain |
| Monetization | Evidence test after repeated value intent |

---

# 5. Surface-by-surface audit

## 5.1 Global navigation / shell

### Current

Public navigation is consistently section-led:

`Club / Events / Projects / Community / Merch / Archive / Join`.

### Action

**KEEP + REFRAME**

Do not rebuild navigation first.

The section navigation is still useful as utility navigation.

But it must stop defining the main journey.

### Target

A person should be able to spend most of a session moving:

`Thing → related Thing → continuation → Thing History`

without repeatedly returning to section indexes.

### Requirements

- keep section navigation available;
- make contextual continuation stronger than global navigation;
- remove pressure for `Join` to act as the default main CTA;
- exact external entries should land on exact Things, not Home first.

---

## 5.2 Home

### Current strengths — KEEP

- strong DaaS visual/world;
- memorable hero;
- real Course proof;
- real Event proof;
- Project proof;
- DC9 entry;
- strong brand character.

### Current mismatch

Home currently performs too many jobs:

- brand definition;
- service satire;
- Join acquisition;
- Course showcase;
- Event showcase;
- ecosystem index;
- Community entry;
- Project showcase;
- DC9 / nine-sphere directory.

Primary hero CTA is `Начать процедуру → /join/`.

This implies:

```text
UNDERSTAND CLUB
→ JOIN
→ DISCOVER VALUE
```

instead of:

```text
SEE SOMETHING WORTH ATTENTION
→ EXPERIENCE IT
→ SEE WHAT CONTINUES
```

### Action

**REFRAME**

### Target state

Home becomes:

> **CURRENT PROGRAM COVER**

It answers:

1. What is the strongest Thing / Programming Moment now?
2. What else is worth experiencing now?
3. What is continuing?
4. What can be tried now?
5. What is being made?
6. Is there one real Participation Opportunity?

### Keep

- DaaS as brand frame;
- strong editorial hero language;
- course / Event / Project visual assets;
- DC9 as one Thing / entry option.

### Move

- ecosystem directory lower;
- nine-sphere directory lower or into About / DC9 context;
- Join out of hero-primary position unless Join itself is the current promoted Thing.

### Remove from primary logic

- `ecosystem section count` as proof of value;
- direction-first browsing as the main mental model.

### Build

A program composition layer that can select / label:

- `WHAT MATTERS NOW`;
- `WHAT CONTINUES`;
- `WHAT MAY HAPPEN NEXT` only when real.

No new Product entity is required by default.

---

## 5.3 About

### Current strengths — KEEP

Strong existing statements already align with the new system:

- no mandatory trajectory;
- not everything must become a Project;
- temporary formats are valid;
- Dementor is not a guru;
- one Thing can lead to another;
- participation does not need to scale.

### Policy tension

Current About still frames the Club primarily as:

> a club/cultural platform for people who have already worked enough on themselves.

That is narrower than current JTBD/Product Thesis.

Current copy also contains:

> `ИНОГДА ГЛАВНОЕ — НЕ КОНТЕНТ. А ЛЮДИ.`

This can conflict with `EDITORIAL > SOCIAL` if interpreted as a product-priority rule rather than a human observation.

### Action

**REFRAME**

### Target state

Explain the Club in this order:

1. what Dementor notices in normal reality;
2. how observation becomes a Thing;
3. examples of different Things / Forms;
4. how Things continue as Program / Projects / History;
5. how people can enter around them;
6. what a Dementor is;
7. why the Club exists around this activity.

### Requirement

DaaS remains a brand frame, not the only product definition.

### Editorial requirement

Reword the `people > content` section so it does not establish Social activity as product priority.

The intended idea can remain:

> sometimes the consequence of a Thing is that people actually meet.

---

## 5.4 Projects Hub

### LIVE

Old generation:

- one public registered Project;
- Project independence doctrine.

### Production branch

New Hub v2:

- Dementor Lab;
- Dementor Battle;
- Robo Games;
- Logic & Awareness;
- Board as shared table.

### Action

**KEEP + REFRAME**

The v2 Hub is one of the strongest existing moves toward the target model.

### Target state

Projects page answers:

> What are people actually making, what already exists to experience, and where can I enter concretely?

### Requirements

For each Project show only meaningful layers:

- existing Things / Releases;
- current meaningful delta;
- real next Release if known;
- current Participation Opportunity if real;
- recent History consequence where useful.

Do not show Project management activity as audience value.

---

## 5.5 Dementor Lab

### Current

Production branch has a strong approved landing / visual proof.

Current project package explicitly preserves:

- public page;
- `PUBLIC ACCESS / SOON`;
- not `PLAYABLE/LIVE`.

### Action

**KEEP**

### Target

Treat the current page as a Thing / proof of Project direction, not as a playable Release.

### Build later

When a playable Release exists:

- exact Play action;
- Release identity;
- History / version continuation.

### Guardrail

Do not use CTA language that implies playability before a playable Release actually exists.

---

## 5.6 Dementor Battle

### Current

Production Projects Hub says:

- tactical game in development;
- field / characters / movement / cover exist;
- rules still being agreed;
- CTA → generic Board discussion.

### Action

**BUILD + REFRAME**

### Target

Project detail should expose the strongest real proof that already exists:

- visual playable / prototype artifact if available;
- current Release or prototype;
- one meaningful current delta;
- one concrete Participation Opportunity when real.

### Remove from target

Generic `обсудить на Board` as the default Project CTA.

Board is a valid destination only when there is a **specific contextual Board object / opportunity**.

---

## 5.7 Robo Games

### Current

Production Hub presents a game concept in development and sends the user to generic Board.

### Action

**BUILD + REFRAME**

Same principle as Battle.

### Target

The first independent experience may be:

- actual HTML game;
- prototype;
- playable challenge;
- visual proof;
- open specific contribution.

Do not require the Project to be complete before one Thing can be released.

---

## 5.8 Logic & Awareness

### Current

Strong independent project identity and editorial source.

### Action

**KEEP**

### Target

Preserve project-specific editorial authority.

Add Product-level relations without flattening the project voice:

- current Release(s);
- series / continuation;
- History;
- related Things;
- exact Participation if one exists.

### Guardrail

Project-specific voice > generic Humor Engine when the Project source is authoritative.

---

## 5.9 Community

### Current strengths

Community already contains:

- concrete Things / formats;
- current Dementors;
- `СЕЙЧАС ПРОИСХОДИТ`;
- create-your-own idea flow;
- Board entry.

### Current mismatch

Its first mental model is strongly people/creator-led:

- `ЛЮДИ ЕСТЬ`;
- Club begins from one person / idea;
- Dementor develops a format and gathers like-minded people;
- People roster is central.

This risks:

- Social drift;
- creator-platform drift;
- status interpretation of Dementor.

### Action

**REFRAME**

### Target state

Community answers:

> How do people enter the life of Things?

Primary structure:

1. current Things / active contexts;
2. concrete Participation / Contribution opportunities;
3. editorial reaction / outcomes;
4. people / Dementors connected to those Things;
5. bring your own Observation / material.

### Move

Roster below Things / current activity.

### Reframe `CREATE YOUR OWN`

From:

`IDEA → PEOPLE → FORMAT → OWN CLUB STORY`

Toward:

`NOTICE / BRING → EDITORIAL LOOK → POSSIBLE THING / MERGE / PROJECT / NO ACTION`

No promise that every idea will become a format, community or Project.

---

## 5.10 Dementor roster

### Current

Current Dementors are shown as people with short associated formats.

### Action

**REFRAME**

### Target

Roster remains valid, but each row should be anchored by:

- body of work;
- recognizable Practice;
- existing Things;
- relevant situations.

Not primarily biography / status / social activity.

---

## 5.11 Dementor profile

### Current strength

Gabil profile already includes excellent `Situations > Skills` material:

- meetings without shared result;
- calls without decisions;
- strong specialists without joint work;
- different expectations under one `we`;
- one permanent driver;
- real value occurring outside the supposed product agenda.

It also links to real authored work:

- `НЕ КОМАНДА`;
- Fuengirola.

### Current mismatch

Profile structure starts from:

`Person → doctrine → history → practice fields → symptoms → methods → quotes → products`.

### Action

**REFRAME**

### Target

Prefer:

`WORK / THING → SITUATIONS → PRACTICE → METHODS / RESOURCES → PERSON`

Person remains important, but proof comes from work.

### P0 metadata requirement

Fix canonical OG URL / image host to `dementor.club` where that is the intended canonical public address.

---

## 5.12 Events index

### Current strengths

- one current Event;
- literal status `PLANNED`;
- literal location / capacity;
- direct Event route.

### Action

**KEEP**

### Reframe

Events index should not become a large calendar if there is only one meaningful Event.

Use it as a current Event program surface.

### Build

Event lifecycle support in product presentation:

`ANNOUNCED / PLANNED → COMMITMENT → EXPERIENCE → HISTORY`

Only show states that actually exist.

---

## 5.13 Fuengirola Event

### Current strengths

- clear premise;
- literal `PLANNED`;
- location and capacity are explicit;
- date and price explicitly `НЕ ОПУБЛИКОВАНА`;
- linked Dementor;
- no invented details.

### Action

**KEEP + DECISION REQUIRED**

### Decision required

Current page says:

> details and registration available after joining the Club.

This is valid only if Membership genuinely controls Event access.

If it is merely inherited funnel logic, it conflicts with:

- Thing First;
- Value before CTA;
- Payment/value separation;
- non-ladder audience modes.

### Target

Before a date / price exists, useful intent signal can be:

- interested;
- notify when details are published.

Do not invent payment or registration before the offer exists.

### P0 metadata

Fix OG URL/image host from Vercel fallback to canonical Dementor address.

---

## 5.14 DC-9 `/join/`

### Current

A real standalone interactive experience:

- 9 spheres;
- 6 scenes per sphere;
- no total score;
- independent results;
- persistent flow.

### Action

**KEEP**

This is already one of the best examples of `Value before CTA`.

### Move

Move DC-9 conceptually from:

> mandatory first step to get to the product

into:

> one strong Thing that can optionally lead to Membership.

The route can remain `/join/` for compatibility, but external messaging does not always need to frame DC-9 as joining.

---

## 5.15 DC-9 Result

### Current strength

The page explicitly says:

> `ДАЛЬШЕ — ПО ЖЕЛАНИЮ.`

This strongly aligns with:

- Value is not a ladder;
- participation optional;
- viewer / user can stop after value.

### Action

**KEEP**

### Build

After result, contextual next steps should depend on real relevance:

- another Thing;
- optional Membership application;
- relevant current Program;
- no next step.

Do not force Apply.

---

## 5.16 Membership application

### Current

Separate application route after DC-9 readiness.

Correct distinction already exists:

> account ≠ Membership.

### Action

**KEEP**

### Reframe

Membership remains access / relationship, not the next level of product value.

### Target

Application should explain:

- what Membership enables operationally;
- what it does not mean;
- what happens after submission.

Do not market it as status advancement.

---

## 5.17 Workspace

### Current

Authenticated noindex operational product:

- account;
- membership;
- roles;
- assignments;
- Board;
- personal actions.

### Action

**KEEP + MOVE**

Keep it as operational account surface.

Do not make Workspace the default product Home for an authenticated user unless there is a clear personal task.

A member should still be able to enter the public Program as an audience member.

---

## 5.18 Board

### Current strengths

Board already has substantial infrastructure:

- guest read;
- member read/write;
- Artifact detail;
- reactions;
- guest interest;
- responses;
- media;
- expiry/history states;
- positions;
- filters;
- personal state cards;
- Share;
- Telegram promotion support;
- Project/entity projections.

### Current semantic problem

Primary semantics are still operational:

- Artifact subtype;
- Artifact status;
- expiry;
- member state;
- Telegram delivery;
- reactions;
- response mechanics.

Current data confirms that Board also contains QA / smoke content.

Raw Board activity therefore does not equal Editorial Program.

### Action

**REFRAME — HIGH PRIORITY**

### Target

Board becomes:

> **RADAR OF WHAT IS HAPPENING TO THINGS.**

Use existing sources, but project cards through contextual meaning such as:

- `RELEASE`;
- `MAKING PROOF`;
- `OPEN PARTICIPATION`;
- `HISTORY EVENT`;
- `DEFAULT / CONTEXT`.

### Critical rule

`Artifact` remains a valid implementation container.

Do **not** migrate every Artifact into a new Thing entity.

Instead decide:

- this Artifact is only a Contribution / post / operational record;
- this Artifact updates an existing Thing;
- this Artifact is itself a Thing candidate;
- this Artifact creates a Programming Moment;
- this Artifact is QA/test and should not enter Program evidence.

### Remove from audience priority

- raw Telegram delivery status;
- internal workflow detail;
- Artifact ID / subtype when not needed;
- membership state as content hierarchy.

Those may remain admin/operational metadata.

---

## 5.19 Artifact Detail

### Current

Strong operational detail surface:

- author;
- title/body/media/link;
- status;
- interested;
- response;
- support promotion;
- owner admin actions;
- History state;
- Board return.

### Action

**REFRAME**

### Target

There are two different product cases and they should not be forced into one public meaning:

## A. Contribution / Board Artifact

Operational detail remains appropriate.

## B. Thing / Thing update

Detail should project:

- what this Thing is;
- why it matters now;
- current Release / State;
- related Project / Dementor where relevant;
- History;
- next Thing / continuation;
- concrete Participation if one exists.

### Requirement

Do not rename implementation table / route just for semantic purity.

Create presentation semantics over current infrastructure.

---

## 5.20 Share ritual

### Current

Recent Board Share / Receive work already creates an explicit recipient acceptance moment and preserves exact Artifact context.

### Action

**KEEP**

### Target

Extend exact-object sharing to Thing semantics where appropriate.

The recipient should receive the exact promised object, not generic Board/Home.

### Distribution rule

Personal Share must not become hidden ad inventory.

---

## 5.21 Telegram promotion

### Current

Telegram delivery / promotion is deeply integrated into Artifact infrastructure.

### Action

**KEEP + MOVE**

Keep as Distribution transport.

Move Telegram delivery status out of primary audience-facing meaning except where delivery itself is relevant.

### Target

`Programming Moment → Distribution Decision → Telegram delivery`

Not:

`Artifact exists → Telegram threshold → therefore important`.

---

## 5.22 `Думай с опасностью`

### Current

A real interactive route with course state and actual experience.

Current canonical data says:

- entity status `approved-draft`;
- `course / self_paced`.

Home publicly says `Открыть курс`.

### Action

**KEEP + TRUTH REVIEW**

### Required decision

Define what `approved-draft` means publicly.

If the current course is a public Stage 1 / prototype, say so.

If it is a released Course, source status must reflect that.

Do not allow:

`source = draft` + `public promise = finished course`

without an explicit semantic distinction such as public prototype Release.

### Build

- experience-start signal;
- completion / meaningful action semantics appropriate to the course;
- next related Thing after experience.

---

## 5.23 `НЕ КОМАНДА`

### Current

Canonical source says:

- `ACTIVE`;
- recurring practice;
- Monday 10:00 Europe/Madrid.

Page has strong Situation framing.

### Action

**KEEP + REFRAME CTA**

### Problem

Current page ends mainly with:

- Dementor profile;
- `Вступить в клуб`.

This does not answer whether a person can actually attend / join this active Practice.

### Target

If participation is actually open:

- show exact Participation Opportunity;
- exact action;
- eligibility / availability literally.

If participation is not open:

- say so;
- allow interest / notification only if useful.

Do not substitute generic Membership CTA for a Practice action.

### P0 metadata

Fix GitHub Pages OG URL / image if Dementor is canonical host.

---

## 5.24 `Деньги на ветер`

### Current

Canonical source:

- `mvp-in-development`;
- adaptive digital Course.

Public production page contains an actual interactive runner and labels itself `MVP 0.1`.

### Action

**KEEP**

This is a good example of `MAKING` coexisting with an experience.

### Target

Treat the current MVP as a real prototype Release:

- people can experience it;
- it is not falsely presented as finished commercial Course;
- reactions / continuation can inform development.

### Monetization

The page correctly says concrete price is not approved.

Keep price as hypothesis until real paid value test exists.

---

## 5.25 `Слабоумие и отвага`

### Current

Canonical source:

- `planned`;
- physical experience.

Page has extensive concept / method / price-positioning content, but factual price and registration are not published.

### Action

**REFRAME**

### Target

Make `PLANNED / CONCEPT` unmistakable throughout the experience.

Separate:

- approved premise;
- possible mechanics;
- real available offer;
- actual price / date / location / eligibility when approved.

### Monetization guardrail

Do not treat `high price as part of the method` as proven product truth before:

- an actual offer exists;
- actual willingness to pay exists;
- delivery is defined.

That remains a hypothesis.

---

## 5.26 Merch index

### Current contradiction

LIVE site:

- Sales not open;
- checkout disabled;
- shirts TBD.

Production branch:

- Live Catalog / runtime status model.

Current Supabase:

- Object 001 preorder €520;
- shirt 01 sold out €89;
- shirts 02–03 not open €79;
- shirt 04 absent.

### Action

**BLOCK / REFRAME**

Do not deploy the newer Merch projection until source ownership is explicitly reviewed.

### Target

One literal catalog state per item:

- concept;
- not open;
- available;
- preorder;
- production;
- sold out.

### Product principle

A physical Thing may exist publicly before it is purchasable.

Do not add checkout merely because price exists.

---

## 5.27 Object 001 — `НЕ НАДО`

### Current strengths

The page is a strong standalone physical Thing.

### Current contradiction

Static production HTML says:

- €220;
- sales not open.

Current Supabase says:

- €520;
- preorder.

### Action

**KEEP + P0 TRUTH FIX**

### Target

- one canonical price;
- one canonical sales state;
- exact CTA based on that state;
- no checkout / preorder action unless the complete offer/fulfillment flow is valid.

### Value Discovery

Before scaling ecommerce, measure explicit Thing intent / preorder commitment around this exact Object.

---

## 5.28 Wear `SH-DEM-01/02/03/04`

### Current

Static production page contains four Wear concepts.

Current Supabase contains only three.

Current states differ from LIVE public page.

### Action

**REFRAME + TRUTH FIX**

### Target

Each Wear item is an independent physical Thing.

A Drop can group them editorially, but one item’s commercial state must not imply another item’s availability.

### Requirement

Resolve `SH-DEM-04` ownership before presenting it as current live catalog item.

---

## 5.29 Catalog

### Current

Public entity register organized by implementation/source categories.

### Action

**MOVE + REFRAME**

### Target

Secondary utility for:

- registry;
- provenance;
- all public entities;
- SEO / administrative inspection.

Not the default discovery experience.

### Requirement

No manually maintained hard counts or states unless source freshness is guaranteed.

---

## 5.30 Archive

### Current

Terminal-state register centered on Events:

- COMPLETED;
- CANCELLED;
- stable URL;
- results added after event.

### Action

**KEEP + REFRAME**

### Target

Archive remains a registry of terminal / historical records.

But Product `History` does **not** live only in Archive.

Thing History belongs with the Thing:

- what happened after Release;
- what changed;
- what continued;
- what failed;
- what it produced.

### Build

History projection on Thing / Project / Program surfaces.

---

# 6. Dynamic object audit

## 6.1 Board Artifacts

Current inspected state:

- 17 total;
- 3 active;
- 4 archived;
- 10 expired.

Recent records include explicit testing/smoke items.

### Active records observed

- `Важен процесс`;
- `Движение - это жизнь`;
- `Главное в шаге верная поступь`.

### Product conclusion

Current active Artifact status alone is not enough to place an item into current Editorial Program.

Before any Home/Board program projection, each candidate needs editorial disposition:

- independent Thing;
- update to existing Thing;
- Program Moment;
- contribution only;
- historical record;
- QA/test/noise.

### Action

**BUILD editorial classification / programming decision over existing data.**

Do not auto-convert all active Artifacts into Things.

---

# 7. Current Thing inventory — working semantic map

This is a product-semantic working inventory, not a new database registry.

| Current object / experience | Source type today | Working semantic role | Action |
| --- | --- | --- | --- |
| DC-9 | Join interactive | standalone Thing / entry experience | KEEP |
| DC-9 personal result | Join result | payoff / personal artifact | KEEP |
| Думай с опасностью | Program / Course | interactive Thing; release truth needs review | KEEP + truth review |
| НЕ КОМАНДА | Program / recurring Practice | recurring experience / Thing line | KEEP + participation CTA |
| Деньги на ветер | Program / Course MVP | prototype Release / Thing in Making | KEEP |
| Слабоумие и отвага | Program / planned physical experience | concept / future Thing | REFRAME |
| Фуэнхирола | Event | planned Event Thing | KEEP + access decision |
| Logic & Awareness | Project-specific source | editorial Project with Things / series | KEEP |
| Dementor Lab | Project landing | approved public proof; not playable | KEEP |
| Dementor Battle | Project / external repo + Hub | Project in Making | BUILD proof / exact entry |
| Robo Games | Project / external repo + Hub | Project in Making | BUILD proof / exact entry |
| OBJECT 001 — НЕ НАДО | Merch Object | physical Thing | KEEP + P0 truth fix |
| SH-DEM-01 | Wear | physical Thing | truth fix |
| SH-DEM-02 | Wear | physical Thing | truth fix |
| SH-DEM-03 | Wear | physical Thing | truth fix |
| SH-DEM-04 | static Wear concept | source ownership unclear in current DB | HOLD / truth review |
| Board Artifacts | `dc_artifacts` | mixture: contribution / update / candidate Thing / QA | editorial disposition required |

---

# 8. What should NOT be rebuilt

The 01–15 package does **not** justify replacing the following merely for conceptual cleanliness:

- Supabase schema;
- `dc_artifacts` table;
- Board spatial implementation;
- Membership state machine;
- DC-9;
- Project-specific pages;
- course runtimes;
- Workspace auth / account infrastructure;
- existing Share ritual;
- existing Event URL structure;
- physical product pages;
- current source authorities.

The primary change is a semantic / editorial projection layer and the connections between existing experiences.

---

# 9. Missing layers to BUILD

## 9.1 Current Program composition

Need one editorial authority/view answering:

- what matters now;
- what continues;
- what can be tried now;
- what is being made with meaningful proof;
- what participation is genuinely open.

This can be implemented over existing Things / sources.

## 9.2 Thing continuity

For a Thing, show when relevant:

- current Release;
- next / related Thing;
- meaningful History;
- Project relation;
- Dementor / body-of-work relation;
- Participation Opportunity.

## 9.3 Editorial disposition of Contribution

Existing Board composer must gain an editorial semantic outcome layer:

`BRING → EDITORIAL LOOK → DISPOSITION → CONSEQUENCE / CLOSURE`

Operational status is not enough.

## 9.4 Exact Participation Opportunity

Replace generic:

- `обсудить на Board`;
- `вступить в клуб`;

with specific action where real:

- test this;
- send this type of material;
- join this occurrence;
- help solve this blocker;
- notify me when this Release is ready.

## 9.5 History

History should be attached to Things / Projects, not only terminal Archive.

## 9.6 Value Intent

Before broad commerce, allow explicit intent signals where useful:

- Thing interest;
- Experience interest;
- Participation interest;
- Intervention interest;
- Support interest.

## 9.7 Metrics Phase 0

Before optimization:

- exclude internal / test traffic;
- define experience-start for 3–5 real Things;
- track Thing → Thing continuation;
- define Return / Return Payoff;
- do not invent universal retention targets.

---

# 10. REMOVE / de-prioritize list

These should be removed from **primary product meaning**, not necessarily deleted from the system.

## 10.1 `Join` as universal primary CTA

Membership is optional.

## 10.2 Ecosystem counts as proof of value

`04 PROJECTS`, `11 entities`, etc. are inventory, not a reason to care.

## 10.3 Generic Board as default destination

If a Project / Thing has a real action, link to that exact context.

## 10.4 Raw operational metadata as audience hierarchy

Artifact subtype, Telegram delivery state, internal workflow and membership state should not determine what the audience sees as important.

## 10.5 Automatic publication logic

Contribution does not earn Program placement by being submitted or technically active.

## 10.6 Static status claims without source freshness

Especially prices, availability, counts and release status.

---

# 11. Prioritized transformation plan

## PHASE 0 — TRUTH / REALITY ALIGNMENT

**Goal:** one factual world before better presentation.

1. Resolve LIVE vs production branch state.
2. Resolve Merch source-of-truth conflicts.
3. Fix canonical public metadata URLs.
4. Review source/public status conflicts (`approved-draft` vs public Course, planned vs offer language).
5. Tag/exclude QA/test Board activity.
6. Produce reviewed current Thing inventory.

### Result

No surface can accidentally promise a different product from the source truth.

---

## PHASE 1 — PROGRAM LAYER

**Goal:** make the current product understandable through Things.

1. Define current Programming Moments from real Things.
2. Reframe Home as current Program cover.
3. Add meaningful Thing projection to Board.
4. Keep section navigation as secondary utility.

### Result

A first-time visitor encounters something worth attention before being asked to understand the Club.

---

## PHASE 2 — CONTINUATION / RETURN

**Goal:** create reasons to come back without debt.

1. Thing → related / next Thing.
2. Project continuation.
3. Dementor body-of-work continuation.
4. Thing History.
5. honest open-loop closure.

### Result

The product can create Return through remembered value rather than notifications / unread / Membership pressure.

---

## PHASE 3 — CONTRIBUTION / PARTICIPATION

**Goal:** make entry into making concrete and editorial.

1. Material-first contribution.
2. Editorial disposition / closure.
3. exact Participation Opportunities.
4. Project-specific entry instead of generic Board.

### Result

A person can bring something without becoming a creator profile and can participate without acquiring status.

---

## PHASE 4 — DISTRIBUTION / METRICS

**Goal:** know whether external encounters produce real experiences.

1. exact Entry Object per promise;
2. canonical metadata / OG;
3. source / channel / message context;
4. qualified experience;
5. Thing → Thing continuation;
6. Return payoff;
7. privacy-safe measurement.

### Result

We measure whether people actually experience and continue, not whether URLs were opened.

---

## PHASE 5 — VALUE DISCOVERY / MONETIZATION TESTS

**Goal:** test payment only where repeated value intent already exists.

Possible experiment classes only after evidence:

- paid Thing;
- paid Experience / Event;
- physical Object preorder;
- Intervention;
- Support.

### Result

Monetization follows observed value rather than determining Program priority.

---

# 12. Expected final user experience

## Current mental model

```text
Here is Dementor Club.
It has Club / Events / Projects / Community / Merch / Archive / Join.
Choose a section.
```

## Target mental model

```text
Here is a Thing.
↓
That was worth my attention.
↓
Here is what it is connected to / what happened next.
↓
There is another Thing worth opening.
↓
I remember this place.
↓
Sometimes I return.
↓
Sometimes I bring something / participate / need an Intervention / buy a Thing.
```

The Club becomes understandable through repeated encounters with its work.

---

# 13. Expected final product result

After applying this audit, Dementor Club should no longer feel primarily like:

- a club portal;
- a list of directions;
- a creator roster;
- a membership funnel;
- a Board of posts;
- a catalog of entities.

It should feel like:

> **a place where people keep noticing something, turning it into Things, releasing them, seeing what happens, and sometimes doing the next Thing together.**

The existing ecosystem remains.

But the semantic center moves from:

**ORGANIZATION / SECTION / STATUS**

to:

**THING / EXPERIENCE / CONTINUATION / CONSEQUENCE.**

---

# 14. Definition of Done for the next implementation review

The package is considered aligned with production only when all of the following can be answered from evidence:

1. What are the actual current public Things?
2. Which are Releases, prototypes, planned concepts or unavailable objects?
3. What is the current Program and why is each Thing in it now?
4. Does Home show that Program rather than the org chart?
5. Does Board project meaningful changes rather than raw activity?
6. Can every promoted Project / Event / Thing lead to an exact experience/action?
7. Can a viewer receive value without Join?
8. Can a contributor receive editorial closure without publication?
9. Can a participant know exactly what action is needed and when it ends?
10. Can a Dementor be discovered through work / situation rather than only profile?
11. Is History attached to Things, not only Archive?
12. Does every public price/status/date/availability match source truth?
13. Does every external promise land on the promised Entry Object?
14. Are internal/test analytics excluded from market evidence?
15. Can Product Health be reviewed without using raw pageviews/activity as value?
16. Are payment tests limited to repeated observed value intent?
17. Does any optimization violate `TRUTH → VALUE → MEANING → SEMANTICS → AUTONOMY → OPTIMIZATION`?

If the answer is yes across this list, the 01–15 package is not merely documented; it is operating in the product.
