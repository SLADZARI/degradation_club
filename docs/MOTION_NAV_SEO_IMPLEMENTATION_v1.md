# Dementor Club — Motion / Navigation / Metadata Implementation v1

Status: **IMPLEMENTED BASELINE**
Updated: 2026-08-25

## 1. Shared navigation

All public pages use one global route model:

`Club / Events / Projects / Community / Merch / Archive / Join`

The shared header runtime is:

- `global-header.css`;
- `global-header.js`;
- bootstrap through `site-config.js`.

Rules:
- compact sticky topbar;
- `DEMENTOR CLUB` brand is always clickable and always returns to `/`;
- desktop uses direct links;
- mobile/tablet uses a burger button and the same primary route set;
- active section is indicated by a simple underline/state, not a decorative navigation treatment;
- routes use dedicated pages instead of homepage anchors wherever a dedicated page exists;
- product/entity pages may add a secondary local bar, but it must sit below the global header and may not replace it.

`styles.css` still contains the legacy topbar baseline for graceful fallback. `global-header.css` is the production navigation owner.

Standalone interactive products must load `site-config.js` explicitly if they do not already use `motion-v1.js`.

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

Canonical origin is controlled by `site-config.js` and the production domain contract.

## 5. Dementor Ink integration

Real site slots exist on Home, About, Logic & Awareness and selected entity/editorial pages.

Asset contract is stored in `assets/ink/README.md`.

## 6. Mobile baseline

Shared primary navigation switches to a burger-controlled administrative index at `<= 900px`.

Rules:
- brand remains visible while menu is closed or open;
- burger is an icon, not the word `INDEX`;
- menu exposes the same routes as desktop;
- Escape closes the menu;
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
`/archive/`
`/join/`
`/courses/dumai-s-opasnostyu/`

## 8. Product-local navigation example

`/courses/dumai-s-opasnostyu/` uses:

1. global Dementor Club header;
2. secondary course bar with course title / reset / day-state;
3. course progress below the local bar.

The global logo returns to the club home. The local course title returns to the course landing without deleting state.

## 9. Release gate

Before production release:
1. run Site Integrity;
2. run real-device checks at 360 / 390 / 768 / 1024 / 1440+ widths;
3. verify keyboard navigation and focus states;
4. verify burger open/close/Escape behaviour;
5. verify logo `/` return from every page family;
6. verify product-local bars do not overlap the global header;
7. verify every public factual event/project claim against source-of-truth one final time.
