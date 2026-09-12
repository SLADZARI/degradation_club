---
artifactId: dementor-club.reference.board-visual-type-language-v0.1
project: dementor-club
documentType: DESIGN_WORKING_DRAFT
projectStage: CLARITY
gate: G1_DEFINITION
status: DRAFT
version: 0.1
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: REFERENCE
---

# Board Visual Type Language v0.1

**DRAFT / REFERENCE — NOT APPROVED, NOT IMPLEMENTATION AUTHORITY**

## Why this exists

Owner observation from production review: Board objects should become easier to distinguish by meaning, but this must not be mixed into the current navigation/adaptive-card edition.

Approved semantic types already exist in Board Information Architecture v1. This draft does not rename or add types.

Canonical visible type families remain:

- Объявления / публикации;
- События;
- Курсы / программы;
- Практики;
- Проекты / продукты;
- Статьи / контент.

Artifact subtypes remain:

- announcement;
- post;
- idea;
- request.

## Design direction to test later

Type distinction should not rely on color alone.

Candidate three-channel language:

1. **edge / frame behavior** — e.g. straight, tabbed, doubled, cut-corner, stamped treatment while preserving one canonical card component;
2. **small type marker** — compact label/icon/stamp tied to the existing canonical type;
3. **typographic character** — controlled variation in headline treatment or metadata rhythm, without creating different card templates.

Color may be a secondary accent only.

## Constraints

- one canonical Board card system;
- no new semantic type IDs merely for styling;
- no lifecycle meaning encoded only through appearance;
- no DB/RLS change;
- no separate Event card component;
- no separate Project card component;
- no role/permission inference from visual treatment;
- historical aging remains orthogonal to object type.

## Questions for a later workshop

- Should canonical entities and member Artifacts differ first by source, then by type, or only by type?
- How much difference is useful before the Board stops feeling like one coherent wall?
- Which distinctions still read in grayscale and at 70–80% zoom?
- Should Artifact subtypes receive a secondary micro-marker while object-family filters remain primary?
- Which type differences survive dense mobile composition without creating visual noise?

## Gate

No implementation in the current Board Navigation + Adaptive Cards Result.

Before implementation this draft requires explicit review/approval and a dedicated Result or approved extension of a future Board visual Result.
