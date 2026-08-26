# Dementor Club — UI Redesign Sync v1

Status: approved visual rules captured during review
Date: 2026-08-26
Scope: official site presentation only

## Source

Google Drive:
`03_Dementor Club Official Site / UI Redesign 2026-08`

Folder ID:
`1_4h7JjCQ-zbyRP_NnFfFDzV0VjdIV_kN`

Reviewed assets currently include:

- `HERO/web.png`
- `HERO/tablet.png`
- `HERO/mob.png`
- `Event/web.png`
- `vent/Event_image.png`
- `vent/Dementor_image.png`
- `vent/tablet.png`
- `vent/mob.png`
- `FEATURE/web.png`
- `Micro.png`
- `relation.png`

The Drive images are visual references. Approved factual content still comes from the entity/source-of-truth records.

## 1. Dementor personal background

Every Dementor receives one persistent background token. The token is part of the entity identity and is reused wherever the portrait or personal identity surface appears.

Current tokens:

- Valentin: `#EFE5D3`
- Nikita: `#F6E9D4`
- Gabil: `#EFE6D3`
- Evgeniy: `#F6EDD9`

Machine source:
`design-system/entity-visual-tokens.json`

CSS source:
`ui-redesign-drive-v1.css`

The same token is used for:

- micro / author / participant
- inline identity
- roster row
- relation
- feature
- hero
- quote with portrait
- preview / reveal where a portrait is shown

LLM rule: never choose a new background color for a known Dementor. If a new Dementor is added, their personal background must be explicitly assigned before production use.

## 2. Dementor hero responsive composition

The approved HERO references define one composition with three responsive states.

### Web

- identity/copy occupies the left field;
- portrait is the dominant right field;
- portrait background uses the Dementor token;
- formula/quote remains editorial copy, not a floating card.

### Tablet

- portrait becomes more dominant;
- portrait occupies a larger right field;
- title/copy may visually enter the portrait field;
- this is recomposition, not proportional shrinking of desktop.

### Mobile

Order:

1. Dementor meta / status;
2. name;
3. formula / quote;
4. portrait.

Portrait then uses the full content width. Do not keep a narrow desktop-style right column on mobile.

## 3. Event hero media

The approved event image is one stable asset.

Rules:

- anchor: `top right`;
- resize priority: height;
- crop instead of creating a new composition for another breakpoint;
- preserve the important right/top visual area;
- web/tablet/mobile use the same media source unless a separately approved replacement exists.

Implementation contract:

```text
object-position / background-position: right top
primary sizing logic: height
responsive behavior: crop
```

For the current Fuengirola entity the existing approved site asset remains the source image:
`/assets/event-fuengirola-03.webp`

## 4. Dementor inside Event

A Dementor connected to an Event is a relation, not a second hero.

Order:

1. relation type/context;
2. portrait on personal Dementor background;
3. Dementor name;
4. factual relation to the current Event;
5. profile action.

This matches the Drive `relation.png` / Event reference grammar.

## 5. Micro identity

Micro is allowed for author / participant / attribution.

It contains:

- small approved portrait;
- personal Dementor background token;
- public name;
- no invented doctrine or metadata.

The micro component must remain readable at touch/mobile density and must not become an arbitrary avatar chip family.

## 6. Implementation rule for future LLM work

Before changing a page containing a Dementor or Event, resolve:

```yaml
entity_type:
entity_id:
presentation_role:
dementor_background_token:
event_media_anchor:
viewport: web | tablet | mobile
```

If the entity is a known Dementor, use the stored token. If the page is an Event hero, use the approved media anchor/crop contract. Do not infer alternatives from aesthetics.

## 7. Relationship to existing standards

This document supplements:

- `docs/ENTITY_PRESENTATION_STANDARD_v1.md`
- `docs/COMPONENT_SYSTEM_v1.md`
- `presentation-standard-v1.css`

If a later approved visual review changes these rules, update the token JSON and implementation CSS in the same change. Do not leave visual decisions only in conversation history.
