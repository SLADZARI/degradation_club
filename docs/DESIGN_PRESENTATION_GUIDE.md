# Dementor Club — Design & Presentation Guide

Status: approved implementation guide
Updated: 2026-08-23

Этот документ является обязательной визуальной спецификацией официального сайта. Смысловые правила подачи утверждаются в ветке `dementor-club`; здесь фиксируется их веб-реализация.

## 1. Reference responsibility map

| Source | Responsibility | Use for | Do not copy |
|---|---|---|---|
| Public Records | Architecture | Home, Events, ecosystem, archive | Gallery sterility, excessive calmness |
| Actual Source | Catalog / index | Projects, archive, merch, metadata | Total neutrality |
| 032c | Editorial attitude | Headlines, long-form, markers, quotes | Fashion/luxury look |
| Mouthwash | Composition | Whitespace, scale, rhythm, media | Premium smoothness |
| DIA Studio | Motion | Kinetic type, state changes, behaviour | Generic animation library |
| Dementor Ink | Proprietary disruption | Illustrations, UI intrusion, absurdity | Horror/fantasy branding |

Core order:

**structure → typography → composition → motion → disruption**

If disruption is designed first, the site becomes styling. If a strict system exists first and is then deliberately violated, the result becomes Dementor Club.

## 2. Information architecture

Follow Public Records logic: the site is a living cultural ecosystem, not a corporate brochure.

Primary areas:

- Club
- Events
- Projects
- Community
- Merch
- Archive
- Join

Home is a live navigation centre and should expose current activity when factual content exists.

Every major event and project should be addressable by URL.

Completed events remain online and change state to archive rather than disappearing.

## 3. Catalog and metadata

Follow Actual Source logic for dense entity browsing.

Prefer index rows over generic cards for Projects, Event archive, Merch and later Community.

Metadata is visual material:

`PROJECT / 001`

`STATUS / ACTIVE`

`TYPE / CULTURAL CAMPAIGN`

`DATE / 2026-08-23`

`LOCATION / FUENGIROLA`

`ACCESS / PUBLIC`

Desktop can use hover previews. Mobile converts hover to tap/reveal.

## 4. Editorial typography and content hierarchy

Follow 032c logic: the visible headline contains a thought, not merely a category label.

Use small service labels plus large meaningful headlines.

Example:

`ABOUT` as kicker

`МЫ НЕ УЧИМ СТАНОВИТЬСЯ ЛУЧШЕ.` as headline

Russian headlines of 2–5 lines are expected.

Three reading speeds:

1. 3 seconds — headline.
2. 15 seconds — headline + kicker + captions/status.
3. 2+ minutes — full text.

Approved editorial devices:

- section numbers;
- timestamps;
- statuses;
- arrows;
- captions;
- footnote-like notices;
- full-width quotations;
- continuation markers.

Text must remain readable and meaningful. Do not use copy as decorative texture.

## 5. Composition

Follow Mouthwash logic.

One viewport = one dominant thought.

Use rhythm rather than uniform density:

**dense → quiet → oversized → media → index → pause**

Approved patterns:

- full-width statement;
- 8/4 headline/support;
- 4/8 metadata/content;
- 6/6 contrast;
- 3/6/3 editorial.

Large important media may occupy 80–100vw.

Whitespace is intentional, especially around Dementor Ink.

Alternate paper / black / media / index modes sparingly.

## 6. Grid

Desktop:

- 12 columns;
- max width 1440–1600px;
- outer margin 24–40px;
- gutters 12–24px.

Tablet: 8 columns.

Mobile: 4 columns, commonly collapsing visually to one primary reading column.

UI follows the grid. Dementor Ink may violate it.

## 7. Typography

Two functional roles are required.

### Interface / Reading

Neutral grotesque with excellent Cyrillic.

Preferred direction: ABC Favorit or equivalent.

Current Inter is a temporary fallback, not final identity.

### Display

Heavy condensed / multi-width family with strong Cyrillic.

Preferred direction: Druk Cyrillic or equivalent.

Target scale:

- Display XL: 120–220px desktop / 56–90px mobile; line-height 0.78–0.90.
- Display L: 64–120px.
- H2: 40–72px.
- Lead: 24–36px.
- Body: 17–22px desktop / 17–20px mobile.
- Meta: 10–13px uppercase/tracked.

Mandatory Cyrillic test before approval:

НЕЭФФЕКТИВНОСТЬ
ОТРИЦАТЕЛЬНЫЙ
ОСОЗНАННОСТЬ
СОМНЕНИЕ

Reject any solution that works only in English.

## 8. Colour

Core:

- PAPER `#F2F0E8`
- INK `#111111`
- ACID `#D8FF3E`

Acid is a signal, not a general background system.

Use for:

- one highlighted word;
- CTA;
- selected state;
- status;
- small section marker.

Logic & Awareness / Ministry may use a separate muted bureaucratic red for seals, stamps and warnings. It does not become a core Dementor Club colour.

## 9. Navigation

Desktop:

- compact sticky bar;
- brand left;
- navigation/index right.

Expanded navigation should feel like a register:

`01 CLUB`
`02 EVENTS`
`03 PROJECTS`
`04 COMMUNITY`
`05 MERCH`
`06 JOIN`

Use `INDEX` when more appropriate than a generic decorative `MENU`.

Avoid oversized marketing overlays unless they serve an explicit editorial scene.

## 10. Motion — DIA-derived behaviour system

Do not create a generic animation library. Motion must belong to one of the approved behaviours.

### Pressure

Type expands until it challenges the viewport/grid.

### Drift

Selected elements move slightly off perfect alignment, typically 5–15px.

### Reclassification

Interaction changes an official state or wording.

Example:

`JOIN CLUB` → `START PROCEDURE` → `APPLICATION OPEN`

### Type Mutation

Animate width, weight, tracking or compression.

### Ink Intrusion

Ink crosses a clean UI boundary: line, hand, shadow, blot.

### Mechanical Ticker

Ticker may stop, reverse, replace one term or momentarily misclassify content.

### Generative Variation

Optional later layer: controlled variation in spacing, Ink fragment, caption or status while page structure remains stable.

Animation budget:

- Homepage: max 3 major moments.
- Project detail: max 2.
- Article/editorial page: max 1.
- Index: almost none beyond micro-interactions.

Preferred durations:

- UI 300–700ms;
- large typographic scene 800–1600ms;
- ambient motion 8–30s.

Forbidden:

- universal fade-up;
- constant glitch;
- cyberpunk effects;
- motion without semantic purpose.

Respect `prefers-reduced-motion`.

## 11. Dementor Ink

Dementor Ink is proprietary and must not be treated as a generic illustration style.

Core narrative rule:

**normal situation + one wrong condition**

Examples:

- calm worker / rebellious shadow;
- office chair / self-appointed throne;
- crowd obeying / one person reading the instruction;
- ordinary bureaucratic scene / absurd procedural fact.

Technique:

- black ink;
- nervous line;
- dry brush;
- blots and splashes;
- changing line weight;
- unfinished areas;
- exaggerated gesture;
- warm white/paper field.

Avoid by default:

- monsters;
- skulls;
- blood;
- horror eyes;
- gothic/fantasy;
- polished digital painting.

Ink density targets:

- Level 0 — no illustration: ~40%.
- Level 1 — small mark/hand/blot: ~30%.
- Level 2 — object/character: ~20%.
- Level 3 — full-screen takeover: ~10%.

Ink may cross borders, cover numbers, sit on rules, leave viewport edges and interrupt headlines. UI itself remains disciplined.

## 12. Homepage structure

Use only sections supported by real content.

Recommended order:

1. Hero — one statement + primary action.
2. Current notice / ticker.
3. Club statement.
4. Current activity/event when factual.
5. Ecosystem index.
6. Featured active project.
7. One deliberate Ink interruption.
8. Join/onboarding entry.
9. Archive/footer index.

Do not show empty categories or invent current activity to fill composition.

## 13. Events

Reference mix:

- architecture: Public Records;
- editorial: 032c;
- composition: Mouthwash;
- motion: DIA;
- commentary/disruption: Dementor Ink.

Event page should support:

- event ID;
- title;
- status;
- date/time;
- city/venue;
- format;
- audience;
- description;
- programme if approved;
- price/conditions if approved;
- registration URL if public;
- media;
- related projects;
- post-event documentation.

Completed state remains online with `COMPLETED` status and archive material.

## 14. Projects

Projects index uses Actual Source principles.

Project detail uses 032c + Mouthwash, with DIA only where justified.

Projects may change local typography, accent or image language, but retain global club navigation and provenance such as `A DEMENTOR CLUB PROJECT`.

`Logic & Awareness` retains its own Ministry / Soviet-propaganda satire subsystem. Never spread that subsystem across the entire club identity.

## 15. Merch

Do not lead with a generic Shopify grid.

Treat merch as object records:

`OBJECT / ID`
`TITLE`
`IMAGE`
`STATEMENT`
`MATERIAL`
`EDITION`
`PRICE`
`STATUS`

Cultural meaning may precede price visually.

## 16. Community

Do not implement or present unapproved membership mechanics.

When approved:

- Public Records for context/activity;
- Actual Source for index and structure;
- 032c for editorial character.

## 17. Join / onboarding

Join is an experience, not a standard form.

Visual language: administrative interface.

Behaviour: approved DIA-derived state changes.

Voice: Dementor / Ministry deadpan where contextually valid.

Examples of interface states:

`ШАГ 04 ИЗ 17`
`УРОВЕНЬ СОМНЕНИЯ: ДОПУСТИМЫЙ`
`ПОСЛЕДОВАТЕЛЬНОСТЬ ОТВЕТОВ ВЫЗЫВАЕТ ВОПРОСЫ`

Local progress persistence is a UX mechanism. Claims about membership, approval, access or status must correspond to real club rules.

## 18. Mobile

Mobile is a separate composition, not scaled desktop.

Rules:

- headlines may crop against viewport edges;
- ticker remains horizontal;
- index becomes rows;
- Ink may leave the frame;
- hover becomes tap/reveal;
- motion is reduced;
- type remains bold in scale.

## 19. Forbidden default language

Unless there is a specific approved concept, do not use:

- SaaS cards;
- glassmorphism;
- decorative gradients;
- 3D blobs;
- neon glow;
- cyberpunk;
- generic AI graphics;
- excessive rounded rectangles;
- stock smiling office photography;
- brutalism for its own sake;
- Soviet posters as the general Dementor Club visual identity.

## 20. Reference board requirement

Maintain approximately 30 annotated reference screens/clips.

### Public Records — 5

- homepage hierarchy;
- ecosystem structure;
- event navigation;
- event detail;
- archive/programme.

### Actual Source — 5

- project index;
- metadata;
- hover preview;
- information hierarchy;
- dense catalog.

### 032c — 5

- long headline;
- article opening;
- typographic hierarchy;
- pull quote;
- editorial markers.

### Mouthwash — 5

- oversized hero;
- whitespace composition;
- media scale;
- alternating layouts;
- project storytelling.

### DIA — 5

- variable typography;
- kinetic headline;
- modular transition;
- generative identity;
- motion + grid.

### Dementor Ink — 5 proprietary references

- shadow rebellion;
- office throne;
- crowd/instruction;
- human/system contradiction;
- full-page Ink invasion.

Every reference must record:

- source;
- exact page/project;
- principle taken;
- Dementor use case;
- what must not be copied.

## 21. Review checklist before shipping

- Is the content factual and current?
- Is the entity/status explicit?
- Is there one dominant thought?
- Is the reference source being used only in its assigned role?
- Does metadata help navigation?
- Does motion belong to an approved behaviour?
- Does Ink add meaning rather than decoration?
- Does the page work in Cyrillic and mobile?
- Is it understandable outside the team?
- Can the material be reused in social/archive contexts?
- Does it conflict with an independent project identity?

## 22. Source-of-truth

Meaning, club rules, products, event facts and approved texts: branch `dementor-club`.

Web design and implementation: branch `dementor-club-site`.

Independent project content: corresponding project branch.

Club-level presentation rules: `dementor-club/brand/PRESENTATION_RULES.md`.

Reference responsibility mapping: `references/REFERENCE_RESPONSIBILITIES.md`.
