# COURSE COVER v1

Status: reusable site component / approved implementation base.

Source files:
- `/components/course-cover-v1.css` — canonical component owner.
- `/components/course-cover-v1.example.html` — copy-safe markup example.

## Purpose

One reusable cover/landing composition for Dementor Club courses. It must not be rewritten per course. Route-level code changes only content, mentor identity token, raster asset and crop positions.

## Required route inputs

1. `--dc-course-cover-bg` — mentor identity surface, e.g. `var(--dc-dementor-valentin-bg)`.
2. Course raster artwork.
3. Two controlled title lines.
4. Lead / description / CTA target.
5. Canonical Dementor portrait and profile URL.

## Visual contract

Desktop: artwork left / course panel right.
Mobile: artwork first / course panel below.
Panel uses a solid light surface with the global acid divider.

Artwork and portraits are RAW raster surfaces. The component explicitly forbids visual tinting:
- no `mix-blend-mode`;
- no CSS `filter`;
- no opacity overlays;
- no translucent pseudo-element wash;
- no `color-mix()` tint over raster media.

The mentor identity color belongs to the surrounding surface only; it must not recolor the raster image.

## Typography contract

The main title is split into explicit semantic lines in markup. Never rely on browser line wrapping for the display title.

`dc-course-cover__title-line` applies a horizontal width lock with `scaleX()` so the visible title proportion stays stable if a condensed local font is unavailable. New course titles must be visually checked at 390 / 768 / 1440 px, but the component geometry itself should not be forked.

## Asset convention

Preferred runtime path:
`/assets/courses/<course-slug>/cover.webp`

Mentor portrait:
`/assets/people/dementors/<mentor>/dementor_<mentor>.webp`

Do not embed base64 raster assets in production HTML after the approved asset has been committed to the repository. Base64 is acceptable only for local prototypes.

## Course integration

Add after `/styles.css`:

```html
<link rel="stylesheet" href="/components/course-cover-v1.css">
```

Place the cover after the global `.topbar` and before the interactive course shell. CTA should point to the course application anchor, normally `#course-app`.

## Ownership

Shared component geometry belongs only to `/components/course-cover-v1.css`.
Course-specific CSS may set variables/crops but must not duplicate the component selectors.
