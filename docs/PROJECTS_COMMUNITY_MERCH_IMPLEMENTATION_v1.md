# Dementor Club — Projects / Community / Merch implementation v1

Status: implementation baseline
Updated: 2026-08-23

## What was added

- `/projects/` — canonical projects index.
- `/projects/logic-awareness/` — public project landing for «Логика и осознанность».
- `/community/` — factual placeholder that exposes only approved state.
- `/merch/` — factual placeholder and future artifact-record model.
- `projects-v1.css` — shared entity/project presentation layer.

## Source boundaries

### Projects

Club-level project existence and ecosystem role come from `dementor-club`.
Project editorial meaning comes from the project branch.

For «Логика и осознанность» the source is branch `logic-awareness`.
The site may summarize the approved project premise, tone and editorial logic, but it must not silently promote draft posts to published materials.

At implementation time the branch contained three editorial units:

- LA-004 — draft;
- LA-005 — draft/editorial unit;
- LA-006 — draft/editorial unit.

Therefore the public landing exposes the series logic but does not expose these units as published website articles.

## Community

The club source-of-truth states that membership format, internal channels, rituals, roles and participation mechanics require separate approval.

The page therefore explicitly renders these as `NOT APPROVED` rather than inventing community functionality.

The already implemented global onboarding may be linked as an available path, but it must not be described as a final approved membership contract unless that rule is later approved.

## Merch

Merch is treated as cultural artifacts, not a generic shop grid.

Future record schema:

`OBJECT ID / TITLE / STATEMENT / IMAGE / MATERIAL / EDITION / PRICE / STATUS`

No working product title, price, edition size or product description becomes public merely because it exists in ideation notes.

## Home wiring

Homepage ecosystem rows now route to real section URLs:

- Merch → `/merch/`
- Community → `/community/`
- Offline → `/events/`
- Projects → `/projects/`

Featured Logic & Awareness routes to `/projects/logic-awareness/`.

## Design rule

The club shell remains stable. Independent project identity may alter the internal visual language after crossing into the project page.

For Logic & Awareness the local subsystem uses bureaucratic/ministry cues and muted red, while global navigation remains Dementor Club.

## Next implementation gates

1. Add approved real assets rather than simulated Ink/grunge.
2. Add semantic motion behaviours shared across Home/About/Events/Projects.
3. Normalize all navigation links across legacy pages.
4. Add OG images once approved project/event visuals exist.
5. Publish article routes only when the corresponding project source changes status from draft to public/approved.
