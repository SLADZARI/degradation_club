# Dementor Club — Motion / Navigation / Metadata Implementation v1

Status: **IMPLEMENTED BASELINE**
Updated: 2026-08-23

## 1. Shared navigation

All public non-onboarding pages use the same route model:

`Club / Events / Projects / Community / Merch / Join`

The shared UI layer is `ui-v2.css`.

Rules:
- compact sticky topbar;
- administrative index behaviour on mobile;
- active section indicated by a simple underline, not a decorative navigation treatment;
- routes use dedicated pages instead of homepage anchors wherever a dedicated page exists.

`styles.css` imports `ui-v2.css`, so Join receives the shared navigation styling even while its interactive logic remains in `script.js`.

## 2. Motion behaviour system

Shared script: `motion-v1.js`.

Implemented behaviours:
- Reveal — one controlled reveal per content section;
- Pressure — selected display headlines compress/expand slightly as an interaction;
- Drift — selected metadata/aside elements move a few pixels relative to scroll;
- Mechanical state — active status pulse;
- Index wipe — rows receive a controlled acid-colour intervention on hover.

This is the DIA-inspired behaviour layer. It is not an effects library.

### Budget
- no more than 3 strong motion moments per page;
- minor hover/reveal interactions do not count as a major moment;
- no random glitch, glow, particle decoration or smooth animation without semantic function.

## 3. Reduced motion

`prefers-reduced-motion: reduce` disables:
- reveal transitions;
- drift;
- pulsing status;
- animated index wipes;
- motion-specific transitions.

Ticker behaviour is already disabled in page-specific CSS where required.

## 4. Metadata baseline

Home, About, Events, Fuengirola, Projects, Logic & Awareness, Community and Merch now include:
- unique `<title>`;
- unique meta description;
- Open Graph title/description/type where appropriate;
- `og:locale=ru_RU`;
- Twitter large-card metadata baseline.

Not yet added because the production domain and approved social image are not fixed:
- canonical absolute URLs;
- `og:url`;
- final `og:image`;
- sitemap absolute URLs.

Do not invent those values before production domain approval.

## 5. Dementor Ink integration

Real site slots exist on Home, About and Logic & Awareness.

Current state: `ASSET PENDING`.

Google Drive search did not return separately stored Dementor Ink source images ready for web delivery. Therefore the implementation intentionally keeps clean slots instead of manufacturing CSS splashes or generic grunge.

Asset contract is stored in `assets/ink/README.md`.

## 6. Mobile baseline

Shared mobile navigation switches to a two-column administrative index.

Rules:
- no hover-dependent critical information;
- large headlines may crop but may not make navigation unusable;
- buttons remain full-width on narrow screens when the page system requires it;
- motion is lighter than desktop;
- index metadata may progressively collapse before the entity title/action.

## 7. Current public architecture

`/`
`/about/`
`/events/`
`/events/fuengirola/`
`/projects/`
`/projects/logic-awareness/`
`/community/`
`/merch/`
`/join/`

## 8. Next release gate

Before production release:
1. place approved Dementor Ink web assets in `assets/ink/`;
2. define the production domain;
3. create approved OG image system;
4. run real-device checks at 360 / 390 / 768 / 1024 / 1440+ widths;
5. verify keyboard navigation and focus states;
6. verify every public factual event/project claim against source-of-truth one final time.
