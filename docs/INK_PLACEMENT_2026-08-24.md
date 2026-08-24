# Dementor Ink placement — 24.08.2026

Status: implementation map approved for the current site structure.

## Primary page scenes

| Asset | Page | Role | Runtime behavior |
|---|---|---|---|
| `home-interruption-03.webp` | `/` | L3 TAKEOVER — calm office subject + disruptive ink shadow | Replaces `home-interruption-02.webp` only after successful load |
| `about-service-03.webp` | `/about/` | L2 CONTAMINATION — service metaphor / brain served as an official product | Replaces `about-service-02.webp` only after successful load |
| `logic-awareness-03.webp` | `/projects/logic-awareness/` | L2 LEAK — internal maze / critical-thinking metaphor | Replaces `logic-awareness-02.webp` only after successful load |
| `event-fuengirola-03.webp` | `/events/fuengirola/` | L2 FIELD RECORD — Fuengirola place image | Replaces `event-fuengirola-02.webp` only after successful load |

## New supporting scenes

| Asset | Page | Placement | Meaning |
|---|---|---|---|
| `community-flow-01.webp` | `/community/` | after Community hero, before the dementor roster | people / movement / collective behavior; supports Community without inventing membership mechanics |
| `authority-chair-01.webp` | `/about/` | after `DEMENTOR / DEFINITION`, before final Join section | satirical authority object; visually reinforces “Дементор — не гуру” without making the chair a merch product |

## Production safety

The integration is progressive. Existing production images remain the fallback until each new binary exists at the expected path under `/assets/ink/`. Supporting scenes are inserted only after a successful image load. Missing binaries therefore do not produce broken image icons or empty layout gaps.

## Mobile behavior

- Community scene crops toward the moving group (`object-position: 66% center`).
- Authority chair crops from the left so the chair remains readable.
- Captions leave image overlay mode and become static black metadata bars.
- No image is allowed to widen the document beyond the viewport.

## Next QA after binaries are live

1. Desktop: 1440 / 1920 width.
2. Tablet: 768 / 1024.
3. Mobile: 360 / 390 / 430.
4. Check crop, paper-background seam, Ink/accent color match, section spacing, alt text and load performance.
5. After visual approval, update static OG metadata from `-02` to `-03` where appropriate.
