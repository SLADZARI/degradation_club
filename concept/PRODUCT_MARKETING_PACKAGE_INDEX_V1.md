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

**Question:** What value does the person receive at each depth without forcing them deeper?

**Status:** NEXT

Expected layers:

- watched / experienced;
- returned;
- brought something;
- joined;
- made something;
- received contextual utility;
- paid for a useful intervention / product / event.

Target source:
`concept/VALUE_ARCHITECTURE_V1.md`

---

## 05 · Product Model

**Question:** What entities exist and how are they related?

**Status:** PARTIALLY DEFINED IN JTBD

Must formalize:

- Thing;
- Observation;
- Form;
- Project;
- Dementor / Author;
- State;
- Participation;
- Release;
- History / Reaction;
- Intervention.

Target source:
`concept/PRODUCT_MODEL_V1.md`

---

## 06 · Board Product Model

**Question:** How does the stage of the club display living things without becoming a forum or marketplace?

**Status:** PARTIALLY DEFINED IN JTBD + CJM

Must formalize:

- card anatomy;
- information priority;
- Form / State / Participation display rules;
- detail view;
- transitions;
- History presentation;
- Project relation;
- editorial control;
- Activity relationship.

Target source:
`concept/BOARD_PRODUCT_MODEL_V1.md`

---

## 07 · Content & Programming Model

**Question:** What makes Dementor feel like an ongoing program rather than a repository?

**Status:** TODO

Must define:

- editorial rhythm;
- release types;
- series;
- recurring formats;
- fresh / making / continuing;
- relationship between authored program and contributions;
- anticipation mechanics.

Target source:
`concept/CONTENT_PROGRAMMING_MODEL_V1.md`

---

## 08 · Return Loops

**Question:** Why does a person come back tomorrow, next week or next month?

**Status:** PARTIALLY DEFINED IN CJM

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

Target source:
`concept/RETURN_LOOPS_V1.md`

---

## 09 · Contribution Model

**Question:** How does a person move from watching to bringing something without turning Dementor into UGC feed?

**Status:** PARTIALLY DEFINED IN CJM

Must define:

- entry prompt;
- editorial reaction;
- submission states;
- merge with existing Thing;
- when contribution becomes Form;
- when Project starts;
- author credit;
- rejection / no-action outcomes.

Target source:
`concept/CONTRIBUTION_MODEL_V1.md`

---

## 10 · Dementor / Intervention Model

**Question:** How are authors, methods, courses, tools and expertise discovered through situations rather than profiles?

**Status:** PARTIALLY DEFINED IN JTBD + CJM

Core rule:

**Situations > Skills**

Must define:

- Dementor public role;
- point of view + practice;
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

**Status:** TODO

Working model:

**FREE EXPERIENCE → PARTICIPATION → CONTEXTUAL VALUE → PAID VALUE**

Possible paid layers:

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

**Status:** PARTIALLY DEFINED IN JTBD + CJM

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

**Status:** PARTIALLY DEFINED IN JTBD

Known principles:

- Observation before joke;
- Reframe before punchline;
- Editorial > Social;
- Objects > Profiles;
- Situations > Skills;
- Form ≠ Project;
- State ≠ Participation ≠ History;
- Release > Completion;
- Editorial reaction > Infinite publishing;
- Intervention > Catalog;
- Participation > Management;
- Utility is contextual.

Target source:
`concept/PRODUCT_PRINCIPLES_ANTIPATTERNS_V1.md`

---

# Recommended build order

Current recommended sequence:

1. **Value Architecture**
2. **Product Model**
3. **Board Product Model**
4. **Content & Programming Model**
5. **Return Loops**
6. **Contribution Model**
7. **Dementor / Intervention Model**
8. **Marketing Positioning & Messaging**
9. **Distribution Model**
10. **Monetization Map**
11. **Metrics & Signals**
12. **Product Principles / Anti-patterns final consolidation**

Reason: entry doors are now mapped. Next clarify **what value a person receives at each depth**; only then lock entities, surfaces, growth, marketing and monetization.

---

# Current status snapshot

**CANON**

- Product Thesis / JTBD
- CJM CLUB
- CJM BOARD / PARTICIPATION
- Audience & Entry Map

**NEXT**

- Value Architecture

Everything else should reference the authorities above and must not redefine them silently.
