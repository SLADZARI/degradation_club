# Dementor Club — Site Harmonization Audit

Date: 2026-08-26
Status: production migration candidate
Standard: `docs/ENTITY_PRESENTATION_STANDARD_v1.md`
Visual reference: `/design-system/`

## Goal

Apply the approved UI Lab presentation grammar to the existing official site without rewriting approved content or changing entity facts.

Shared production layers introduced:

- `/presentation-standard-v1.css`
- `/course-bridge-v1.css`

The standard is loaded through `/styles.css`. Existing page-specific CSS remains responsible for local composition; the shared layer owns cross-site presentation invariants.

## Global invariants now enforced

- PAPER / INK / ACID surface contract; ACID always uses INK foreground.
- Square editorial actions; no pill-button drift.
- One register grammar for entity/index/activity/profile rows.
- Dementor portrait scale and roster behavior.
- Dementor relations remain visibly secondary to the parent entity.
- Shared quote hierarchy: pull quote / attributed quote / profile quote.
- Shared service/status presentation for saved, disabled, pending, warning and empty states.
- Shared form/test control states and visible focus.
- Desktop / tablet / mobile reflow instead of desktop shrinking.
- Reduced-motion fallback.
- Local project visual subsystems remain local.

## Page-family audit

| Route | Family | Standard status | Notes |
|---|---|---|---|
| `/` | Home | harmonized | Existing editorial/feature/index structure retained; shared rows/actions/mobile contract applied. |
| `/about/` | About / manifesto | harmonized | Existing editorial rhythm retained; shared type/actions/quotes/surfaces. |
| `/events/` | Event index | reference-aligned | Programme lifecycle already follows the standard; entity rows inherit shared register grammar. |
| `/events/fuengirola/` | Event detail | reference-aligned | Existing Event hero, relation and mobile composition retained; shared status/action/quote rules applied. |
| `/projects/` | Project index | reference-aligned | Project register remains index-first. |
| `/projects/logic-awareness/` | Project detail / local subsystem | harmonized boundary | Soviet/pseudo-institutional visual language remains local to the project; global navigation, accessibility and entity rules remain club-owned. |
| `/projects/logic-awareness/dossiers/` | Project index / local subsystem | harmonized boundary | Local dossier presentation retained. |
| `/projects/logic-awareness/dossiers/logic/` | Editorial dossier | harmonized boundary | Local project system retained. |
| `/projects/logic-awareness/dossiers/awareness/` | Editorial dossier | harmonized boundary | Local project system retained. |
| `/community/` | Dementor roster + mixed activity | harmonized | Four real Dementor portraits now follow shared roster/portrait scale; relations and current-activity rows use the common grammar. |
| `/community/valentin/` | Dementor detail | harmonized | Profile hero, pending facts, related course and quote behavior follow standard. |
| `/community/nikita/` | Dementor detail | harmonized | Pending content remains pending; presentation standardized without inventing fields. |
| `/community/evgeniy/` | Dementor detail | harmonized | Pending content remains pending; presentation standardized without inventing fields. |
| `/community/gabil/` | Dementor detail | harmonized | Existing approved quotes and Event/Course relations retained; quote cards normalized. |
| `/courses/dumai-s-opasnostyu/` | Interactive course | harmonized + bridged | Added club header and shared course bridge; course engine/data/screens preserved. |
| `/courses/ne-komanda/` | Course/practice detail | harmonized | Already used club entity primitives; shared relationship/quote/action rules applied. |
| `/courses/dengi-na-veter/` | Interactive course | harmonized | Local money-* interaction retained; shared course bridge applies controls, service states, hero/mobile/action rules. |
| `/courses/slaboumie-i-otvaga/` | Planned course | harmonized | Local course voice retained; planned/registration facts unchanged; shared course bridge applies presentation rules. |
| `/merch/` | Object index | harmonized | Entity rows/actions/statuses use shared grammar. |
| `/objects/001-ne-nado/` | Object detail | harmonized | Product-specific gallery/state model retained; global presentation invariants inherited. |
| `/catalog/` | Actual Source register | reference-aligned | Existing register/filter/preview system is compatible with UI Lab. No entity is added when its catalog placement is not approved. |
| `/archive/` | Terminal-state index | reference-aligned | Empty/terminal states retained and standardized. |
| `/join/` | Test / onboarding | harmonized | Existing logic and localStorage preserved; answer, selection, progress, result, action and service-state presentation normalized. |
| `/contacts/` | Utility / form | harmonized | Form logic unchanged; fields/actions/service status normalized. |
| `/donate/` | Utility / pending service | harmonized | Payment remains disabled until provider approval; pending/disabled states normalized. |
| `/legal/privacy/` | Legal | harmonized | Content unchanged; shared entity hero/status system inherited. |
| `/legal/terms/` | Legal | harmonized | Content unchanged; shared entity hero/status system inherited. |
| `/404.html` | Error / service state | harmonized | Existing editorial 404 retained; global actions/focus/mobile contract inherited. |
| `/design-system/` | Internal UI Lab | approved reference | `noindex`; canonical visual/component reference for future manual and LLM layout work. |

## Intentional exceptions

### Logic & Awareness

Its muted bureaucratic red, Soviet campaign language and dossier composition are a project-owned local subsystem. These visuals must not leak into global Club pages.

### Course local voices

Courses may keep authored local visual devices when those devices carry course meaning. They may not replace Club navigation, accessibility, action grammar, service states or mobile rules.

### Object detail

OBJECT-001 uses a product/object composition rather than an Event/Project hero. It still inherits global typography, focus, action and status rules.

## Content safety

Harmonization does not:

- promote ideas to public events;
- change event status;
- open registration/payment/checkout;
- create missing Dementor doctrine or practice areas;
- put COURSE-001 into public catalog when `catalogPlacement` remains unapproved;
- convert local project drafts into approved Club copy.

## Future page-build contract

Before creating a new page or block, resolve:

1. `entity_type`
2. `entity_id`
3. factual `status`
4. `page_family`
5. `presentation_role`
6. `context`
7. `required_metadata`
8. `relations`
9. `viewport_contract`
10. local visual subsystem, if explicitly allowed

Then use the shared presentation grammar. Do not redesign a new entity from scratch.

## QA matrix

Required visual widths:

- 1440 — desktop
- 1024 — compact desktop/tablet
- 768 — tablet
- 390 — mobile
- 320 — narrow fallback

At each width verify:

- core headline is readable and not clipped;
- required metadata remains visible;
- primary action remains visible;
- relation blocks do not outrank the parent entity;
- Dementor portraits retain readable composition;
- register rows reflow rather than shrink;
- hover-only behavior has tap/focus equivalent;
- ACID never carries light foreground text;
- test/service states are distinguishable without color alone;
- Ink does not block text or CTA.
