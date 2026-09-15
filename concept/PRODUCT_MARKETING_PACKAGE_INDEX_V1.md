# DEMENTOR CLUB — PRODUCT & MARKETING PACKAGE v1

Status: **WORKING INDEX / source map**  
Updated: **2026-09-15**

## Purpose

This file is the navigation layer for the complete Dementor Club product + marketing package.

It does not replace the documents below. It records which source owns which question and what still needs to be completed.

Core rule:

**One question → one primary authority.**

Do not create parallel definitions of Dementor Club in briefs, presentations or implementation tickets.

---

# Package structure

## 01 · Product Thesis / JTBD

**Question:** What is Dementor Club, why do people come, and what product logic must implementation preserve?

**Status:** CANON

Source:
`concept/DEMENTOR_CLUB_JTBD_PRODUCT_THESIS_V2.md`

Companion product framing:
`concept/DEGRADATION_AS_A_SERVICE.md`

---

## 02 · Customer Journey Map

**Question:** How does a person experience Dementor over time?

**Status:** CANON

Primary audience journey:
`concept/CJM_CLUB_V1.md`

Participation / Board journey:
`concept/CJM_BOARD_PARTICIPATION_V1.md`

Key separation:

- CLUB CJM = encounter, experience, return;
- PARTICIPATION CJM = bring, approach, join, make, release.

---

## 03 · Audience & Entry Map

**Question:** Why does a person first encounter Dementor, through which door, and what should they see next?

**Status:** CANON

Source:
`concept/AUDIENCE_ENTRY_MAP_V1.md`

Canonical entry model:

**SOURCE × INTENT × ENTRY OBJECT**

Canonical audience journey:

**THING → EXPERIENCE → VIEW → PROGRAM → IMPACT → RETURN**

Core rule:

**Thing first.** Do not bring the person into the club first; let them meet a thing that makes them want to see what this place is.

Audience modes are not a maturity ladder. Program Audience is a complete valid state; Contributor, Participant and Maker are optional modes, not higher levels.

---

## 04 · Value Architecture

**Question:** What independent value does a person receive in each mode without being forced deeper?

**Status:** WORKING CANON

Source:
`concept/VALUE_ARCHITECTURE_V1.md`

Core formula:

**THING WORTH ATTENTION → PROGRAM WORTH RETURNING TO → OPTIONAL VALUE WHEN CONTEXT APPEARS**

Optional value may include:

- editorial reaction;
- participation;
- making / authorship;
- contextual utility;
- paid value.

Core rule:

**Value is not a ladder.** Viewer, Program Audience, Contributor, Participant, Maker and contextual users are valid independent modes, not steps toward one preferred end state.

---

## 05 · Product Model

**Question:** What exists in the product semantically, how are those objects related, and what must implementation preserve without confusing ontology with database tables?

**Status:** WORKING CANON

Source:
`concept/PRODUCT_MODEL_V1.md`

Production review:
`operations/PRODUCT_MODEL_PRODUCTION_ENTITY_REVIEW_2026-09-15.md`

Core semantic loop:

**OBSERVATION → THING → FORM → RELEASE → HISTORY**

When needed:

**THING ↔ PROJECT**

**THING / PROJECT → PARTICIPATION OPPORTUNITY → PARTICIPANT RELATION**

**SITUATION → INTERVENTION → DEMENTOR / METHOD / RESOURCE THING**

Key decisions:

- `THING` is product semantics, not an automatic request for a new `dc_things` table;
- existing Artifact / Event / Program / entity sources may back a Thing;
- Artifact remains an implementation term, not the universal public ontology;
- Form, Release State and Production State are separate dimensions;
- `ВЫШЛО` and `МУТЯТ` may coexist when a released Thing is producing a new version;
- Dementor is a public authorial projection of Person + scoped role + body of work, not a duplicate identity entity;
- Participation Opportunity and Participant Relation are separate concepts;
- Board / Home / Activity / Profile / Card are projections, not core entities.

---

## 06 · Board Product Model

**Question:** How does the stage of the club display living Things, Projects, Releases, History and Participation without becoming a forum or marketplace?

**Status:** WORKING CANON

Source:
`concept/BOARD_PRODUCT_MODEL_V1.md`

Production mapping:
`operations/BOARD_PRODUCT_MODEL_PRODUCTION_MAPPING_2026-09-15.md`

Core architecture:

**CURRENT SOURCES → SEMANTIC PROJECTION → CONTEXTUAL PRESENTATION**

Canonical projection union:

**ThingProjection | AuxiliaryEntityProjection | SystemNotice**

Key decisions:

- **PROGRAM BOARD = THINGS FIRST**, not every Board object is a Thing;
- Artifact may back a ThingProjection but does not define product meaning;
- `source type ≠ Form`;
- operational Artifact lifecycle remains separate from Production / Release semantics;
- Production State = `IDLE / MAKING / STOPPED`;
- `ПРИНЕСЛИ` is an editorial signal, not a Production State;
- `RELEASED` should preferably be derived from audience-available Releases;
- one Thing may have multiple Forms through multiple Releases;
- Event Release means audience availability, not occurrence/completion;
- `ВПИСАТЬСЯ` is Participation Opportunity, not lifecycle state;
- **RICH MODEL → SPARSE CARD**;
- one contextual signal + one primary action;
- **RELEASE CTA > INTERNAL NAVIGATION**;
- **FRESHNESS ≠ CREATED_AT ≠ PUBLISHED_AT**;
- one Thing can receive different RELEASE / MAKING / PARTICIPATION / HISTORY / DEFAULT presentations depending on why it matters now;
- Detail route may stay, but its information hierarchy must move from internal metadata to Thing meaning + action;
- implementation starts with **Phase 0 semantic projection in memory**, before schema migration.

---

## 07 · Content & Programming Model

**Question:** What makes Dementor feel like an ongoing program rather than a repository, and how does editorial programming decide what returns, repeats, develops anticipation, and becomes a recognizable rhythm over time?

**Status:** WORKING CANON

Source:
`concept/CONTENT_PROGRAMMING_MODEL_V1.md`

Core formula:

**THING + WHY NOW + SEQUENCE + REAL CONTINUATION = PROGRAM**

Canonical programming unit:

**Programming Moment** = editorial decision to make an existing Thing noticeable now for a concrete reason.

Key decisions:

- Programming Moment is not a new Thing/entity/table by default;
- Thing existence ≠ program relevance;
- freshness is editorial, not chronology;
- meaningful delta is required for a new programming moment;
- programming reasons may include New Release, Continuation, Making Proof, Open Participation, History Event, Resurface, Series Episode, Editorial Pairing and Time Window;
- `NO DELTA → NO UPDATE`;
- `SEQUENCE BY ATTENTION, NOT DATABASE CHRONOLOGY`;
- Series ≠ Project;
- Editorial Format ≠ Product Form;
- Project activity requires editorial selection before it becomes program;
- anticipation is allowed only for a real next move;
- resurfacing requires changed meaning/context, not a need to fill the feed;
- editorial retirement is not Product State;
- Home, Board, Activity, Thing Detail, Project, Dementor Profile and external distribution consume one programming truth differently;
- Programming Model does not replace the thematic content taxonomy: taxonomy answers `о чём / где в карте клуба`, programming answers `почему сейчас`.

Boundary with `06`:

- `06` owns **how Board presents a Thing now**;
- `07` owns **why this Thing is in the program now, what comes before/after it, and what recurring editorial structure makes people expect more**.

Boundary with `08`:

- `07` = **PROGRAM CREATES REASONS TO RETURN**;
- `08` = **PERSON EXPERIENCES A REASON AND RETURNS**.

---

## 08 · Return Loops

**Question:** Why does a person come back tomorrow, next week or next month?

**Status:** NEXT / PARTIALLY DEFINED IN CJM + CONTENT PROGRAMMING MODEL

Known loops:

- Editorial;
- Serial;
- Dementor;
- Project;
- History;
- External trigger;
- Anticipation;
- Contributor;
- Participation;
- contextual Utility.

Must formalize:

- trigger → expectation → return → payoff;
- passive return vs active follow;
- direct return vs external re-entry;
- Thing follower / Dementor follower / Project follower loops;
- how anticipation closes;
- contributor return after editorial reaction;
- participant return after joining action;
- utility return without turning Dementor into service marketplace;
- Activity / notification role without notification-driven retention;
- failed / broken loops and anti-signals;
- measurement boundaries for each return mode.

Target source:
`concept/RETURN_LOOPS_V1.md`

---

## 09 · Contribution Model

**Question:** How does a person move from watching to bringing something without turning Dementor into UGC feed?

**Status:** PARTIALLY DEFINED IN CJM + PRODUCT MODEL

Must define:

- entry prompt;
- Observation / contribution boundary;
- editorial reaction;
- submission states;
- mapping of existing Artifact to contribution / native Thing;
- merge with existing Thing;
- when contribution becomes a Thing;
- when Project starts;
- author credit;
- rejection / no-action outcomes.

Target source:
`concept/CONTRIBUTION_MODEL_V1.md`

---

## 10 · Dementor / Intervention Model

**Question:** How are authors, methods, courses, tools and expertise discovered through situations rather than profiles?

**Status:** PARTIALLY DEFINED IN JTBD + CJM + VALUE ARCHITECTURE + PRODUCT MODEL

Core rule:

**Situations > Skills**

Must define:

- Dementor as public authorial projection, not duplicate Person identity;
- point of view + practice + body of work;
- intervention triggers;
- contextual products;
- free vs paid intervention;
- attribution;
- cross-linking from Things and Projects.

Target source:
`concept/DEMENTOR_INTERVENTION_MODEL_V1.md`

---

## 11 · Marketing Positioning & Messaging

**Question:** What do we say outside the product to different entry intents without explaining the internal ontology?

**Status:** TODO

Must include:

- master external promise;
- entry-specific messaging;
- message hierarchy;
- proof through Things;
- CTA rules;
- what not to say;
- relation to `DEGRADATION_AS_A_SERVICE.md`.

Target source:
`concept/MARKETING_POSITIONING_MESSAGING_V1.md`

---

## 12 · Distribution Model

**Question:** Where does a person meet Dementor before they intentionally visit the club?

**Status:** TODO

Channels may include:

- social;
- Telegram;
- direct share;
- search;
- video;
- events;
- physical objects;
- individual Dementors;
- project surfaces;
- partner / earned distribution.

Target source:
`concept/DISTRIBUTION_MODEL_V1.md`

---

## 13 · Monetization Map

**Question:** Where can money appear naturally without making monetization the reason the club exists?

**Status:** PARTIALLY DEFINED IN VALUE ARCHITECTURE

Working principle:

**Paid value is not a higher user level.**

Payment appears when a concrete Thing / event / intervention has standalone value and literally stated terms.

Possible paid layers may include:

- contextual course;
- method;
- tool;
- event;
- authored product;
- consultation / intervention;
- physical object;
- project-specific paid experience.

Target source:
`concept/MONETIZATION_MAP_V1.md`

---

## 14 · Metrics & Signals

**Question:** How do we know the club is alive without optimizing it into a social network or marketplace?

**Status:** PARTIALLY DEFINED IN JTBD + CJM + VALUE ARCHITECTURE

Primary signal groups:

- Audience Return;
- Editorial Consumption;
- Emergence;
- Editorial rhythm;
- Participation health;
- Release health.

Anti-signals must be tracked explicitly.

Target source:
`concept/METRICS_SIGNALS_V1.md`

---

## 15 · Product Principles / Anti-patterns

**Question:** What must future design, product and marketing decisions not break?

**Status:** PARTIALLY DEFINED IN JTBD + VALUE ARCHITECTURE + PRODUCT MODEL + BOARD PRODUCT MODEL + CONTENT PROGRAMMING MODEL

Known principles:

- Observation before joke;
- Reframe before punchline;
- Editorial > Social;
- Objects > Profiles;
- Situations > Skills;
- Form ≠ Project;
- Source type ≠ Form;
- Release State ≠ Production State ≠ Participation ≠ History;
- Release > Completion;
- Editorial reaction > Infinite publishing;
- Intervention > Catalog;
- Participation > Management;
- Utility is contextual;
- Value is not a ladder;
- Value before CTA;
- Paid value is not paid belonging;
- Product semantics ≠ database table list;
- Projection never becomes a second source of semantic truth;
- Rich model → sparse card;
- Release CTA > internal navigation;
- Freshness ≠ created_at / published_at;
- Thing existence ≠ program relevance;
- No delta → no update;
- Sequence by attention, not database chronology;
- Promise only what actually exists as a next move;
- Resurface because meaning changed, not because the feed needs filling.

Target source:
`concept/PRODUCT_PRINCIPLES_ANTIPATTERNS_V1.md`

---

# Recommended build order

Current recommended sequence:

1. **Return Loops**
2. **Contribution Model**
3. **Dementor / Intervention Model**
4. **Marketing Positioning & Messaging**
5. **Distribution Model**
6. **Monetization Map**
7. **Metrics & Signals**
8. **Product Principles / Anti-patterns final consolidation**

Content & Programming Model is now established as WORKING CANON. The next question is audience-side continuity: which triggers and expectations actually cause a person to come back, and how those loops close without making retention depend on notifications or social pressure.

---

# Current status snapshot

**CANON**

- Product Thesis / JTBD
- CJM CLUB
- CJM BOARD / PARTICIPATION
- Audience & Entry Map

**WORKING CANON**

- Value Architecture
- Product Model
- Board Product Model
- Content & Programming Model

**NEXT**

- Return Loops

Everything else should reference the authorities above and must not redefine them silently.
