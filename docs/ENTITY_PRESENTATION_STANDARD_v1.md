# Dementor Club — Entity Presentation Standard v1

Status: working standard / UI Lab companion
Branch: `agent/dementor-ui-lab-v3`
Scope: official site presentation grammar only
Source-of-truth: entity facts remain in `dementor-club`; this document defines how approved facts may be rendered in `dementor-club-site`.

## 1. Purpose

This standard prevents page-by-page redesign. An LLM or human layout author must not invent a new visual treatment every time an Event, Course, Dementor, Project, Quote, Test or service state appears.

The rendering chain is:

`source fact → entity type → presentation role → page context → responsive contract → component → tokens`

Content is not rewritten to fit a component. Components adapt to approved content.

## 2. Fact vs specimen

The UI Lab contains two classes of information:

1. **FACT** — values taken from approved/current entity records or source-backed page content.
2. **SPECIMEN** — a UI state used only to test layout, interaction or responsiveness.

Specimen values must never be interpreted as club facts. Examples: a 3/7 progress sample, generic test answers, future lifecycle states and module-title placeholders.

Unknown or unapproved values are rendered as null / pending / empty according to context. They are never inferred from visual copy.

## 3. Presentation role vocabulary

Every entity appearance must choose one explicit role:

- `link` — text-only reference inside prose or metadata.
- `micro` — compact identity marker; avatar/portrait may be present.
- `inline` — small structured entity reference inside another block.
- `row` — primary register/list representation.
- `relation` — one entity presented specifically because of its relationship to the current entity.
- `feature` — one dominant entity inside a larger page.
- `hero` — dominant opening of the entity's own detail page.
- `detail` — body sections belonging to the entity detail page.
- `preview` — hover/focus preview on pointer devices or tap/reveal on touch devices.

An LLM must not invent a tenth role without an explicit exception record.

## 4. Context vocabulary

Presentation is selected together with a context:

- `home`
- `index`
- `entity-detail`
- `related`
- `activity`
- `article`
- `test`
- `project-local`

The same entity can use different presentation roles in different contexts, but its factual status and metadata do not change.

## 5. Dementor system

### 5.1 Allowed roles

A Dementor may appear as:

- `micro`
- `inline`
- `row`
- `relation`
- `feature`
- `hero`
- `quote-author`
- `preview`

`quote-author` is a semantic specialization of `micro` / `relation`, not a separate arbitrary card system.

### 5.2 Portrait scale

Portrait assets use one controlled scale family:

- micro: ~32–40 px visual width
- inline: ~52–70 px
- row: ~70–110 px depending on viewport
- relation: ~88–128 px
- feature: ~180–240 px or equivalent grid share
- hero: large editorial portrait occupying a dedicated grid region

The exact CSS value belongs to the component implementation; authors select a role, not a raw size.

Portrait crop must preserve recognizability. On mobile the portrait may reduce or move, but the person's name cannot disappear.

### 5.3 Dementor row

Required:

- ID or sequence marker
- portrait
- public name
- factual state / relation metadata
- action affordance

Desktop may show fuller relation metadata. Mobile must recompose into a readable multi-line row rather than compress desktop columns.

### 5.4 Dementor relation

Use when a Dementor appears because they lead, organize, author or otherwise relate to another entity.

Order:

1. relation label (`DEMENTOR / EVENT`, `DEMENTOR / COURSE`, etc.)
2. portrait
3. name
4. approved relation metadata
5. profile action

Do not turn the relation into a second page hero.

### 5.5 Dementor feature

Use for one editorially dominant person block inside another page. Only one dominant person feature should compete for a viewport.

### 5.6 Dementor hero

Own-profile opening. May include role, portrait, approved quote/formula and metadata. If the quote/doctrine/practice areas are pending, render a pending state. Do not synthesize substitute copy.

## 6. Event system

### 6.1 Allowed roles

- `link`
- `inline`
- `row`
- `feature`
- `hero`
- `programme-item`
- `relation`
- `preview`
- `terminal`

### 6.2 Event row

The default event index and mixed-activity representation is a register row, not a generic card.

Recommended fields, when populated:

- ID
- title
- type
- location/date
- status
- action

Missing fields are omitted or explicitly unavailable according to the page context.

### 6.3 Event feature

Used on Home or curated surfaces. Contains one dominant event, factual metadata and one primary action.

### 6.4 Event hero

Own detail page. Must expose status and the most important known facts early. Related Dementors are rendered through the Dementor relation component.

### 6.5 Event lifecycle

Canonical factual statuses:

`idea / planned / announced / registration / sold-out / completed / cancelled`

A lifecycle visualization may show the full vocabulary, but only the entity's current factual state can be marked current.

### 6.6 Programme

Programme is rendered only when approved programme data exists. If the field is null, use a clear empty/pending programme state rather than generating agenda items.

### 6.7 Terminal states

Completed/cancelled events change action logic. A completed or cancelled event must not retain a misleading live-registration CTA.

## 7. Course system

### 7.1 Allowed roles

- `link`
- `inline`
- `row`
- `feature`
- `hero`
- `dementor-relation`
- `module-row`
- `progress`
- `result/completion`
- `locked`, only when access locking is factual
- `preview`

### 7.2 Course row

Default list representation. May include delivery, Dementor, module count and status when these fields are approved.

### 7.3 Course feature / hero

Must separate:

- course identity
- factual production/public status
- delivery mode
- course-to-Dementor relation
- module/progress data

Do not invent benefit copy, price, certification, AI behavior or email delivery unless approved.

### 7.4 Modules

Module row contains number/order, approved title and state. Placeholder titles in UI Lab are specimens only.

### 7.5 Progress

Progress is user/session data, not static entity metadata. Render only from current state storage. UI Lab progress numbers are explicitly specimens.

## 8. Project system

Projects can own a local visual subsystem, but must preserve:

- club-level navigation
- provenance
- accessibility
- stable project URL
- entity relations

Logic & Awareness may use its approved local campaign identity. This does not authorize Soviet/poster styling across unrelated Club pages.

## 9. Merch system

Merch remains an entity family even when the public register is empty.

Allowed future roles:

- `row`
- `object-preview`
- `feature`
- `hero/detail`

Fields such as price, material, edition and shop status appear only when approved.

An empty merch register must remain visibly empty rather than being populated with invented products.

## 10. Entity Register

`Entity Register` is the shared grammar for index/list/activity surfaces.

It can contain one type or a mixed set:

- Events
- Courses
- Projects
- Dementors
- Merch when populated

The row skeleton stays consistent while type-specific metadata changes.

Desktop:

- scan-first row
- optional hover/focus preview
- full metadata priority

Mobile:

- reflowed row
- first tap may reveal secondary detail
- explicit second action/tap opens detail
- no essential information depends on hover

## 11. Preview contract

A preview is evidence about an entity, not a promotional card.

### Desktop

Triggered by hover or keyboard focus when appropriate.

Possible content:

- approved preview image/portrait
- entity type
- title/name
- factual status
- one or two high-priority metadata fields

### Mobile

Use tap/reveal or inline expansion. Never simulate hover.

If an entity has no approved preview image, use a text-only preview rather than inventing media.

## 12. Quote system

Quote is a content type.

Allowed roles:

- `pullquote`
- `attributed`
- `portrait`
- `inline`

Rules:

- attribution requires an explicit source
- editorial statements are not automatically quotes
- never assign a phrase to a Dementor because it sounds appropriate
- if authorship/formula is pending, show pending state rather than placeholder quotation marks

## 13. Tests and form controls

All interactive diagnostic/course tests must share a system vocabulary.

### 13.1 Question

Contains:

- question/stage metadata
- question text
- optional context
- answer controls
- progress when applicable
- back/next actions

### 13.2 Choice states

Minimum supported states:

- default
- hover on pointer devices
- keyboard focus
- selected
- disabled
- returned/previous answer when applicable

Selected state cannot rely only on color.

### 13.3 Responsive

Desktop may use multi-column answers when content allows.
Mobile defaults to a single readable column and preserves ~44 px+ touch targets.

### 13.4 Result

Separate:

- dominant result
- interpretation/explanation
- supporting scales/metadata
- next actions

Do not invent diagnostic labels or values outside the test data/model.

## 14. Service messages

Standard service-state vocabulary:

- `info`
- `saved/success`
- `warning`
- `locked`
- `error`
- `offline`
- `complete`
- `empty`
- `loading/processing`

These states use Club typography, rules and surfaces. Avoid generic SaaS alerts, colored rounded cards, glass UI and standard green/red toast visual language.

Color does not carry meaning alone. Message type and copy remain visible text.

## 15. Interaction states

Any interactive component must be checked in all relevant states:

- default
- hover
- focus-visible
- active/pressed
- selected
- disabled
- loading/processing

ACID is always a light surface with INK foreground, including hover/focus/selected contexts.

## 16. Responsive contract

Responsive behavior is defined alongside every component, not in a disconnected appendix.

Validation sizes:

- 1440 web
- 1024 compact web/tablet
- 768 tablet
- 390 mobile
- 320 narrow fallback

Principles:

- mobile is not scaled desktop
- metadata reprioritizes rather than disappearing arbitrarily
- desktop columns become ordered mobile rows
- no essential hover-only content
- Dementor portrait and entity title remain identifiable
- CTA/action remains reachable
- no page-level horizontal overflow

## 17. Context bench

Before approving a new entity component, test the same entity in multiple real contexts.

Examples:

Dementor:

- roster
- event relation
- course relation
- quote author
- related content
- own profile hero

Event:

- Home feature
- Events register
- Dementor activity
- Project related
- mixed activity
- own detail page
- archive/terminal state

This exposes visual drift before it spreads across pages.

## 18. Wrong patterns

Do not introduce:

- generic SaaS cards where rows/registers fit
- pill-heavy UI
- glassmorphism
- decorative gradients
- generic success/error toast palettes
- random rounded rectangles
- invented promotional copy
- invented event/course metadata
- hover-only essential information
- white/PAPER text on ACID
- new portrait sizes without a presentation-role reason

## 19. LLM build contract

Before layout, fill this contract:

```yaml
entity_type: event | course | dementor | project | merch
entity_id: exact source id
presentation_role: link | micro | inline | row | relation | feature | hero | detail | preview
context: home | index | entity-detail | related | activity | article | test | project-local
status: exact factual state
primary_action: source-approved action only
metadata: populated/approved fields only
relations: source-backed entity IDs only
quote:
  text: explicit source text only
  author: explicit source author only
viewport_contract:
  - web
  - tablet
  - mobile
interaction_states: relevant states only
empty_state: explicit when data is absent
visual_subsystem: club | approved-project-local
ink_level: 0 | 1 | 2 | 3
motion: approved behaviour only
```

If a required fact is missing, the correct result is a pending/empty/omitted state, not creative inference.

## 20. Approval workflow

1. New/changed fact is approved in its source-of-truth branch.
2. Entity record mirrors that fact for the site.
3. UI Lab is used to select an existing presentation role.
4. If no role fits, propose an explicit addition to this standard before implementing it across pages.
5. Validate web/tablet/mobile and interaction states.
6. Only after visual approval may the component be propagated through production pages.

Current UI Lab route: `/design-system/`.
