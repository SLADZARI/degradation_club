# Dementor Club — Home Community Block

STATUS: APPROVED
DATE: 2026-08-28
SCOPE: Home → Community entry block
SOURCE OF TRUTH: `dementor-club`

## Purpose

The Home page contains one dedicated visual entry into the Community section.

This block is not a separate Community mechanic and does not define membership rules. Its role is navigational and editorial: it signals that Community is an active entity of the Dementor Club ecosystem and routes the visitor to `/community/`.

## Approved composition

- Full-width illustration field using the existing Community illustration already present in the project asset system.
- Background/surface color: `#F1E9D8`.
- One HTML/CSS CTA layer only; do not use a rasterized button/caption image.
- CTA text: `COMMUNITY / PEOPLE / ACTIVITY →`.
- Destination: `/community/`.
- No dark overlay, no opacity reduction, no `mix-blend-mode:multiply`, no image filter.
- Do not duplicate the caption as part of the illustration asset.

## Desktop behavior

- Illustration can occupy the dominant media area.
- CTA is placed over the illustration as a large black editorial strip.
- The block remains visually continuous with the illustration surface color.

## Mobile behavior

Mobile is not a cropped desktop composition.

- Entire illustration must remain visible.
- Use containment behavior (`object-fit: contain`) rather than cropping.
- Free space around the illustration remains `#F1E9D8`.
- CTA stretches to the full available width of the block.

## Asset rule

Use the existing Community illustration from the project asset system. Do not create or introduce a new derivative image for this block when the existing clean source can be composed in HTML/CSS.

Current site asset path:

`/assets/ink/home-community-01.webp`

## Community page relationship

The Home block links to `/community/`.

The Community page itself should act as the index/context page for Community entities once those entities are approved. It may contain people, activity, formats, related events, and other approved Community records, but must not invent membership mechanics, access rules, pricing, statuses, rituals, or participation flows that are not already approved in club source-of-truth materials.

## Integration order

`dementor-club` approved rule → `dementor-club-site` implementation → public Home.
