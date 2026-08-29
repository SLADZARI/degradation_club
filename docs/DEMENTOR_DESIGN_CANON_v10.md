# Dementor Club — Design Canon v10

Status: **DESIGN AUTHORITY / APPROVED**  
Version: **v10**  
Effective: 2026-08-29  
Design authority: **approved by Nikita**  
Reference implementation: `dementor-club/concept/ABOUT_PAGE_APPROVED_V10.md`  
Implementation branch: `dementor-club-site`

## 1. Role of this document

This document is the primary visual canon for the Dementor Club web interface.

It extracts the reusable design rules proven and approved in About v10 and makes them authoritative for new pages, redesigns, shared components and visual QA.

`ABOUT_PAGE_APPROVED_V10.md` remains the approved reference implementation. This canon does not replace its content or page-specific wording.

## 2. Authority order

When design sources conflict, use this order:

1. `docs/DEMENTOR_DESIGN_CANON_v10.md` — visual law.
2. `dementor-club/concept/ABOUT_PAGE_APPROVED_V10.md` — approved reference implementation.
3. `docs/ENTITY_PRESENTATION_STANDARD_v1.md` — entity presentation behaviour.
4. `docs/COMPONENT_SYSTEM_v1.md`, `docs/GLOBAL_HEADER_v1.md`, `docs/MOTION_NAV_SEO_IMPLEMENTATION_v1.md` — implementation contracts.
5. `docs/DESIGN_PRESENTATION_GUIDE.md` — background/reference guide.
6. Legacy CSS, historical experiments and dated design branches.

If an older guide, legacy CSS rule, component override or historical reference conflicts with v10, **v10 wins**.

No LLM or implementation agent may reinterpret an older document as a higher-priority visual authority.

## 3. Core visual language

The approved Dementor Club base is:

**paper / black / acid + editorial metadata + controlled system violation**

The system must feel disciplined first and disturbed second.

The design is not generic brutalism, SaaS minimalism, luxury editorial styling or a collage of visual effects.

Preferred order of construction:

**structure → hierarchy → typography → composition → media → controlled disruption**

## 4. Composition

One screen should have one dominant thought.

Use strong editorial hierarchy rather than uniform card density.

Preferred qualities:

- large meaningful statements;
- deliberate whitespace;
- asymmetry only when composition remains controlled;
- metadata used as navigation/information, not decoration;
- image-led sections with clear hierarchy;
- visual pauses between dense sections;
- occasional controlled interruption of the grid.

Do not convert pages into repeated SaaS feature cards.

Do not solve every section with the same component pattern.

## 5. Colour

Core club palette:

- PAPER — warm/off-white paper field;
- BLACK / INK — dominant typography and structural colour;
- ACID — signal/accent colour.

Acid is an accent, not a universal background system.

Use it selectively for:

- CTA;
- active/selected state;
- one key word or phrase;
- small markers/statuses;
- deliberate visual interruption.

Project-specific colours may exist inside independent project systems but must not silently redefine the club-level palette.

## 6. Typography

Typography carries the primary visual hierarchy.

Rules:

- headlines contain a thought, not only a category label;
- service labels / metadata remain secondary;
- large type may challenge the viewport but must remain intentional;
- Cyrillic quality is mandatory;
- body copy remains readable and is never reduced to texture;
- avoid generic marketing heading/subheading/card rhythm.

The visual hierarchy must remain legible at 3-second, 15-second and long-read speeds.

## 7. Editorial metadata

Metadata is part of the interface language.

Approved uses include:

- section numbers;
- statuses;
- type labels;
- dates;
- locations;
- IDs;
- captions;
- route/index markers;
- small procedural notes.

Metadata must help orientation and classification. It must not become decorative noise.

## 8. Controlled system violation

Dementor Club is not visually chaotic by default.

First establish a strict interface system. Then violate it deliberately.

Approved controlled violations include:

- image or ink crossing a grid boundary;
- oversized type touching/cropping the viewport;
- intentional offset of an otherwise aligned element;
- one section breaking the previous rhythm;
- controlled visual intrusion over a rule, index or heading.

Forbidden behaviour:

- random glitching;
- uncontrolled overlaps;
- accidental clipping;
- decorative chaos without semantic purpose;
- stacking multiple disruptive effects in every section.

## 9. Dementor Ink

Dementor Ink is the proprietary illustration/interruption layer of the club.

It must remain subordinate to the page structure rather than replacing the interface system.

Use it as semantic disruption, not as generic decoration.

It may cross borders, leave the frame, interrupt a clean surface or create one intentionally wrong condition in an otherwise normal scene.

Do not drift into horror/fantasy branding, polished digital painting or generic AI illustration.

Production artwork follows the asset contract in `assets/ink/README.md`.

## 10. Mobile and tablet

**Mobile/tablet are independent compositions, not proportionally reduced desktop layouts.**

This rule is inherited directly from the approved About v10 guardrails.

For image-led sections:

- reposition media intentionally;
- re-evaluate crop and focal point;
- reflow type hierarchy;
- preserve dominant thought;
- avoid desktop leftovers creating accidental empty zones;
- do not accept overflow or clipped controls as an aesthetic choice.

Intentional headline/media cropping is allowed only when it remains readable and visibly designed.

## 11. Entity pages

New entities do not receive random bespoke visual systems.

First determine:

- `entity_type`;
- `presentation_role`;
- `context`;
- `state`;
- responsive contract.

Then use the shared system and `ENTITY_PRESENTATION_STANDARD_v1.md`.

Independent projects may have their own local visual language while retaining club-level provenance and navigation.

## 12. Logic & Awareness boundary

The visual language of “Логика и осознанность” is an independent project subsystem.

Its Ministry / Soviet editorial-propaganda satire language may appear when presenting that project, but it must **not** spread into the general Dementor Club identity.

This boundary is mandatory.

## 13. Reference implementation

`ABOUT_PAGE_APPROVED_V10.md` is the canonical practical example of the system in use.

It demonstrates the approved relationship between:

- strong statements;
- ecosystem explanation;
- editorial metadata;
- paper/black/acid language;
- restrained humour;
- image-led sections;
- controlled disruption;
- mobile/tablet recomposition.

When an abstract rule is unclear, compare the proposed implementation with About v10 before inventing a new solution.

## 14. LLM implementation rules

Any LLM modifying the site must:

1. Read this canon before changing visual architecture.
2. Treat About v10 as the approved reference implementation.
3. Reuse existing primitives before creating a new visual pattern.
4. Never revive legacy CSS just because it already exists.
5. Never overwrite an approved v10 pattern with an older guide or experiment.
6. Make the smallest visual change that solves the stated problem.
7. Preserve responsive independence.
8. Classify intentional visual changes separately from regressions.
9. Never update visual baselines automatically after a mismatch.
10. Escalate a genuine canon change for human approval instead of silently redefining the system.

## 15. QA enforcement

Visual QA should verify at minimum:

- layout ownership;
- responsive composition;
- overflow/clipping;
- broken assets;
- typography hierarchy;
- shared component consistency;
- legacy override pressure;
- unintended CSS cascade changes;
- route-specific presentation contracts;
- mobile guardrails;
- screenshot/reference evidence for critical approved screens.

A test may enforce this canon, but a failing implementation must not be “fixed” by weakening the canon or deleting the test without explicit approval.

## 16. Change control

This document is versioned.

Changes to the core visual language require an explicit design decision and a new canon version (`v11`, `v12`, etc.) rather than silent edits that change meaning.

Minor clarifications that do not change visual authority may be added to v10 with a dated note.

A new visual experiment does not become canon because it has been implemented.

**Implemented ≠ approved.**  
**Approved reference ≠ permission to rewrite the canon.**
