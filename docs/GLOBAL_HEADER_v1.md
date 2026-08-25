# Dementor Club — Global Header v1

Status: production navigation contract
Updated: 2026-08-25

## Purpose

All public Dementor Club pages use one global header. Entity-specific pages and interactive products may add a secondary local bar below it, but may not replace the global navigation.

## Desktop

- clickable `DEMENTOR CLUB` brand at left;
- brand always links to `/`;
- direct primary navigation at right;
- fixed route set: `Club / Events / Projects / Community / Merch / Archive / Join`;
- current primary section receives a simple active state;
- no page-specific duplicated primary navigation.

## Mobile / tablet

At `<= 900px` primary links collapse into a burger button.

Burger requirements:
- three-line icon, not the word `INDEX`;
- `aria-expanded` and `aria-controls` required;
- expanded navigation uses the same route set as desktop;
- Escape closes the menu;
- navigation click closes the menu;
- body scrolling is locked while the menu is open;
- brand remains visible and continues to link to `/`.

## Runtime ownership

Shared assets:

- `/global-header.css`
- `/global-header.js`

`/site-config.js` loads the shared header layer. Pages using `motion-v1.js` already bootstrap `site-config.js`; standalone interactive products must load `/site-config.js` explicitly.

The runtime normalizes legacy `.topbar` markup into the shared header, so existing pages do not need page-by-page header copies.

## Entity/product local bars

A local bar may exist under the global header for product-specific state such as:

- course title;
- progress;
- session status;
- local reset/action controls.

It must not contain the global club logo as a duplicate. Example: `Думай с опасностью` uses the global club header plus a secondary course bar.

## Visual rules

- PAPER `#f2f0e8` background;
- INK `#111` text;
- ACID `#d8ff3e` only as light signal surface;
- square geometry;
- no pill navigation;
- navigation remains readable over dark page families because header is its own light surface.

## Acceptance criteria

1. Clicking the brand from every public page returns to `/`.
2. Desktop shows direct primary links.
3. Mobile/tablet shows burger instead of the full link row.
4. Menu is keyboard operable and closes on Escape.
5. Active primary section is marked.
6. Interactive product local bars sit below the global header and do not overlap it.
7. `/join` remains a separate product flow; navigation changes do not alter onboarding state.
8. Course localStorage/session logic is unaffected by the header.
