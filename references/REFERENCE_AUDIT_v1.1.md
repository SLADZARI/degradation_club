# Dementor Club — Reference Audit & Missing Coverage v1.1

Status: canonical audit for the site reference system.
Updated: 2026-08-23

## Closed coverage

- 30 annotated reference positions exist.
- Every reference uses `TAKE / DON'T TAKE / USE IN`.
- Source responsibilities are fixed: Public Records / Actual Source / 032c / Mouthwash / DIA / Dementor Ink.
- Club presentation rules and web implementation rules exist.
- Typography direction, grid, colour, motion, events, projects, merch, community and onboarding are documented.

## Missing coverage discovered in audit

### 1. Physical screenshots

The Drive `Screenshots` folder is currently empty. URLs and written analysis exist, but captured source screens do not.

Required minimum per external source position:
- desktop capture at ~1440 px;
- mobile capture at ~390 px where responsive behaviour matters;
- capture date;
- source URL;
- annotation describing the exact principle.

### 2. Mobile reference layer

Mobile must be documented separately for:
- oversized Cyrillic headlines;
- index rows;
- ticker overflow;
- Ink cropping/overflow;
- hover → tap/reveal conversion;
- reduced motion.

### 3. Typography source layer

Preferred interface/reading candidate: **ABC Favorit Cyrillic**.
Official source: https://abcdinamo.com/typefaces/favorit-cyrillic

Preferred display candidate: **Druk / Druk Condensed Cyrillic**.
Official sources:
- https://commercialtype.com/catalog/druk/druk
- https://commercialtype.com/catalog/druk_condensed
- https://commercialtype.com/news/new_release_druk_cyrillic

Do not store commercial font binaries in public GitHub. Until licensing is resolved, production uses approved fallbacks.

### 4. Navigation & component capture set

Need explicit reference/capture coverage for:
- sticky header;
- index menu;
- metadata row;
- status badge;
- event row;
- project row;
- CTA state changes;
- footer/archive index.

### 5. Events & projects patterns

Need dedicated captures for:
- event index;
- event detail;
- completed event archive;
- projects index;
- project detail;
- related-content graph.

### 6. Accessibility and reduced motion

Mandatory fallback rules:
- `prefers-reduced-motion` disables Pressure, Drift, Ink drawing and generative motion;
- ticker may become static;
- Reclassification still works without animation;
- essential meaning must never exist only in hover/motion;
- contrast and keyboard/focus states are checked independently of the visual concept.

### 7. Current site baseline

Before any major redesign, preserve current desktop + mobile screenshots of production/deploy. This is the before-state for regression review.

### 8. Approved / rejected pattern memory

Maintain two visual buckets on Drive:
- `Approved Patterns` — only explicitly approved treatments;
- `Do Not Use` — rejected treatments with a short reason.

This prevents rejected ideas from returning in later iterations.

## Drive reference structure

`References/`
- Visual Reference Board
- Reference Sources & Usage Map
- Reference Audit
- Screenshots/
- Dementor Ink/
- Typography/
- Motion/
- Mobile/
- Navigation & Components/
- Events & Projects Patterns/
- Current Site Baseline/
- Accessibility & Reduced Motion/
- Source Pages/
- Research Notes/
- Approved Patterns/
- Do Not Use/
- Capture Manifest/

## Readiness

Documentation: **closed**.
Reference taxonomy: **closed**.
Typography source validation: **closed**.
Mobile rules: **closed**.
Accessibility fallbacks: **closed**.
Capture manifest: **closed**.
External screenshot assets: **open**.
Dedicated Dementor Ink raw asset folder: **open**.
Current site baseline captures: **open**.

v1.2 completion criterion: minimum 25 external source captures + 5 internal Ink assets + desktop/mobile current-site baseline.