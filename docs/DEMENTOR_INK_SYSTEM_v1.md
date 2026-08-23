# Dementor Club — Dementor Ink Intervention System v1

Status: IMPLEMENTATION CONTRACT
Updated: 2026-08-23

Dementor Ink is the proprietary visual interruption layer of Dementor Club. It is not a generic illustration style and not decoration added to every page.

## 1. Core rule

Strict system first. Ink arrives last and breaks it deliberately.

Narrative formula:

**normal situation + one wrong condition**

Ink must add contradiction, commentary or a second reading. If the page means exactly the same thing without the intervention, the art is probably decorative and should be reduced or removed.

Artistic delivery is raster-only. CSS may position, crop, mask, frame and move approved raster art, but must not manufacture fake splatter/grunge as a substitute for artwork.

## 2. Density levels

Target distribution across the public site:

- L0 / SILENCE — no illustration, approximately 40%.
- L1 / TRACE — small mark, label, edge violation or minor raster contamination, approximately 30%.
- L2 / SCENE — object/character image that interrupts a section, approximately 20%.
- L3 / TAKEOVER — full-width/full-screen or major grid rupture, approximately 10%.

L3 must remain rare. Multiple L3 scenes on the same page are prohibited by default.

## 3. Intervention roles

### TRACE
Low-density intervention. Used on registers, metadata-heavy pages, archive, catalog and other places where the system should dominate.

Behaviour:
- small raster fragment or existing scene preview may intrude near an edge;
- editorial/service label may identify the intrusion;
- must not compete with factual rows.

### LEAK
A scene appears to escape its assigned media rectangle.

Behaviour:
- image crosses an imagined grid boundary;
- a rule/line can pass through the scene;
- neighboring content remains readable and structurally stable.

### CONTAMINATION
The visual appears inside an otherwise controlled service/editorial page and changes its tone.

Behaviour:
- deliberate rotation or offset;
- administrative label names the contamination;
- image may overlap section rhythm but never factual controls.

### FIELD RECORD
Used for event/documentary contexts.

Behaviour:
- treated as evidence or field material rather than a decorative poster;
- event facts must remain outside the image unless separately approved;
- status/date/venue/price are never invented by the artwork.

### TAKEOVER
Highest-density interruption.

Behaviour:
- visually dominates viewport or section transition;
- may violate grid and section boundaries;
- one main meaning only;
- no essential text embedded in the raster;
- must survive 390/360 mobile crop.

## 4. Current page map

- Home: L3 / TAKEOVER / `home-interruption-02.webp`.
- About: L2 / CONTAMINATION / `about-service-02.webp`.
- Logic & Awareness: L2 / LEAK / local project subsystem / `logic-awareness-02.webp`.
- Fuengirola: L2 / FIELD RECORD / `event-fuengirola-02.webp`.
- Events index: L1 / TRACE only.
- Projects index: L1 / TRACE only.
- Catalog: L1 / TRACE only.
- Archive: L0 by default until real archived evidence exists.
- Community: L0 by default until approved mechanics/assets exist.
- Merch: L0 until approved physical objects exist; product art must not be invented.
- Join: L0 by default; procedure UI is the dominant experience.

## 5. UI safety

Ink may break the visual grid. It may not break the layout.

Required:
- no horizontal document overflow;
- controls remain clickable;
- factual metadata stays readable;
- focus indicators remain visible;
- mobile keeps `width:100%` for large scenes;
- no essential meaning only on hover;
- `prefers-reduced-motion` removes movement/rotation transitions where necessary.

## 6. Motion relationship

DIA may animate positioning of an Ink intervention only within bounded values.

Allowed:
- slight deterministic rotation;
- slight image scale shift;
- label reveal;
- scroll-safe overlap.

Not allowed:
- random splatter generation;
- continuous chaotic motion;
- motion that changes event/project facts;
- Ink following the cursor continuously;
- motion that causes layout reflow on mobile.

## 7. Project independence

The independent project `logic-awareness` may use its own local additions such as bureaucratic red, stamps/seals and propaganda-like composition. Those additions do not become global Dementor Club identity.

## 8. Approval rule

Raster status remains separate from code status:

DRAFT → APPROVED MASTER → WEB READY → LIVE.

A CSS integration does not make an image LIVE. Production fetch/render still has to be verified separately.
