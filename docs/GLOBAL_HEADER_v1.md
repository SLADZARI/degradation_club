# Dementor Club — Global Header v1

Status: production navigation contract  
Updated: 2026-09-10

## Purpose

All public Dementor Club pages use one canonical global header. Entity-specific pages and interactive products may add a secondary local bar below it, but may not replace or duplicate the global navigation.

Canonical runtime owners:

- `/global-header.js`
- `/global-header.css`
- `/site-config.js` loads the shared header on public surfaces.

## Desktop

Canonical information architecture:

`DEMENTOR CLUB · [Вступить в клуб] · О клубе · События · Проекты · Сообщество · Мерч | identity/login`

Rules:

- clickable `DEMENTOR CLUB` brand at left; brand always links to `/`;
- `Вступить в клуб` is the primary CTA, not an ordinary navigation item;
- primary navigation is `О клубе / События / Проекты / Сообщество / Мерч`;
- `Archive` is not part of primary navigation;
- Guest service state is `Войти`;
- authenticated identity replaces `Войти` with avatar/name linking to `/workspace/`;
- for an active member, the Join CTA is hidden;
- current primary section receives a simple active state;
- no page-specific duplicated primary navigation.

## Mobile / tablet

At `<= 900px` primary links collapse into the canonical burger button.

Target composition:

`DEMENTOR CLUB · [Вступить в клуб] · ☰`

Burger requirements:

- three-line icon, not the word `INDEX`;
- `aria-expanded` and `aria-controls` required;
- expanded navigation uses the same canonical route set as desktop;
- Escape closes the menu;
- navigation click closes the menu;
- body scrolling is locked while the menu is open;
- brand remains visible and continues to link to `/`.

## Auth identity

Authentication state does not create a second header.

Guest:

- `Вступить в клуб`;
- `Войти`.

Authenticated non-member:

- `Вступить в клуб` remains available;
- avatar/name replaces `Войти` and links to Workspace.

Member / Dementor / owner-admin identity:

- Join CTA is hidden;
- avatar/name links to Workspace.

This document describes presentation ownership only. It does not change Membership, role or authentication semantics.

## Entity/product local bars

A local bar may exist under the global header for product-specific state such as:

- course title;
- progress;
- session status;
- local reset/action controls.

It must not contain the global club logo as a duplicate and must not behave as a second primary navigation. `HOME` inside Workspace means Workspace home, not public Home.

## Visual rules

- PAPER `#f2f0e8` background;
- INK `#111` text;
- ACID `#d8ff3e` only as light signal surface;
- square geometry;
- no pill navigation;
- navigation remains readable over dark page families because header is its own light surface.

## Acceptance criteria

1. Clicking the brand from every public page returns to `/`.
2. Desktop shows the canonical direct primary links and separate Join CTA/service state.
3. `Archive` and legacy ordinary-nav `Join` do not return to primary navigation.
4. Mobile/tablet shows the burger instead of the full link row.
5. Menu is keyboard operable and closes on Escape.
6. Active primary section is marked.
7. Interactive product local bars sit below the global header and do not overlap or duplicate it.
8. Authentication changes only the service/identity state owned by the canonical header.
9. `/join` remains a separate product flow; navigation changes do not alter DC-9 or Membership state.
