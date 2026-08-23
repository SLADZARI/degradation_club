# Dementor Club — Typography, Mobile & Accessibility Spec

Status: mandatory supplement to `DESIGN_PRESENTATION_GUIDE.md`.
Updated: 2026-08-23

## 1. Typography source decision

### Interface / reading candidate

**ABC Favorit Cyrillic**
Official source: https://abcdinamo.com/typefaces/favorit-cyrillic

Why it fits:
- full Cyrillic coverage;
- localized Bulgarian / Serbian / Macedonian forms;
- rigid grotesque base with subtle oddity/humour;
- multiple weights and useful numeral/features for metadata-heavy UI.

### Display candidate

**Druk / Druk Condensed Cyrillic**
Official sources:
- https://commercialtype.com/catalog/druk/druk
- https://commercialtype.com/catalog/druk_condensed
- https://commercialtype.com/news/new_release_druk_cyrillic

Why it fits:
- strong editorial headline character;
- Cyrillic support;
- condensed widths support very long Russian statements.

Important: Druk Condensed and especially narrower variants are display faces. Do not force them into small UI/body sizes.

### Production rule

Commercial font binaries are never committed to public GitHub. Licensing must be resolved before shipping. Until then, preserve typography roles with fallbacks rather than pretending the identity is final.

## 2. Mandatory Cyrillic tests

Every display treatment is tested using:

- НЕЭФФЕКТИВНОСТЬ
- ОТРИЦАТЕЛЬНЫЙ РОСТ
- ОСОЗНАННОСТЬ
- СОМНЕНИЕ
- ПРИЧИННО-СЛЕДСТВЕННЫЕ СВЯЗИ
- УПАКУЕМ ЦЕЛИ В РАСТЕРЯННОСТЬ

Check:
- shape quality;
- line breaks;
- tight tracking collisions;
- Ж / Щ / Д / Ы / Й / Ф;
- punctuation and numerals;
- 2–5 line headline compositions.

## 3. Mobile composition

Mobile is not scaled desktop.

### Headline
- maintain strong scale;
- cropping at viewport edge is allowed when intentional;
- never lose the core phrase because of clipping;
- do not auto-shrink every long Russian title into mediocrity.

### Indexes
Desktop metadata columns collapse into ordered rows. Preserve ID, title and status first. Secondary metadata can reveal on tap.

### Hover conversion
Anything that communicates meaning on hover must have a tap/focus equivalent.

### Ink
Ink may leave viewport edges, but cannot cover primary CTA or essential reading content.

### Ticker
Horizontal overflow is allowed. With reduced motion, freeze it or provide a static repeatable line.

## 4. Accessibility rules

### Reduced motion
When `prefers-reduced-motion: reduce`:
- Pressure → final static typography state;
- Drift → zero displacement;
- Type Mutation → no interpolation, choose stable endpoint;
- Ink Intrusion → static final asset or no intrusion;
- Mechanical Ticker → static content;
- Generative Variation → fixed deterministic layout.

Reclassification remains functional because it represents state, not decoration.

### Meaning
No critical information may depend only on:
- hover;
- movement;
- colour;
- visual overlap;
- illustration.

### Focus
All navigation, rows, filters and onboarding controls require visible keyboard focus states. Focus style must belong to the Dementor system but remain unmistakable.

### Contrast
Paper/Ink is the primary reading pair. Acid is not used as small text on light backgrounds unless contrast is verified. Acid is primarily a field/highlight/CTA signal.

### Touch
Interactive targets on mobile should be comfortably tappable; dense editorial layout cannot reduce controls to microscopic type-only targets.

## 5. Responsive review matrix

Every major page must be reviewed at minimum at:
- 1440 desktop;
- 1024 tablet/compact desktop;
- 768 tablet;
- 390 mobile;
- 320 narrow fallback.

Review:
- headline break;
- metadata priority;
- CTA visibility;
- Ink collision;
- index legibility;
- menu behavior;
- reduced-motion state.

## 6. Rule

A layout is not approved because the desktop screenshot looks good. It is approved only when Cyrillic, mobile, keyboard and reduced-motion modes preserve the same editorial idea.