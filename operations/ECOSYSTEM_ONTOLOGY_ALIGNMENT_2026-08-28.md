# Dementor Club — Ecosystem Ontology Alignment

Date: 2026-08-28
Status: APPLIED ALIGNMENT / SITE PASS

## Purpose

This pass aligns the public site and private account model with `DEMENTOR_CLUB_ENTITY_ONTOLOGY_V0.1.md`.

## Public directions vs entities

Public ecosystem directions remain:

- Merch
- Community
- Events / Offline
- Projects

They are navigation/product directions, not database entity types.

Canonical public entity vocabulary:

- PERSON
- PROGRAM
- EVENT
- PROJECT
- OBJECT / PRODUCT
- RUN
- SESSION

Participation and transaction relations remain separate: enrollment, registration, assessment, order.

## Applied site corrections

1. Home ecosystem language changed from “four entity types” to “four directions”.
2. Public Catalog now indexes Programs, Events, Projects and Objects instead of treating Merch as an entity type.
3. `НЕ КОМАНДА` is represented internally/publicly as PROGRAM / PRACTICE / RECURRING rather than a generic Course entity.
4. `/profile/` no longer develops as a second account root; it redirects to the unified `/workspace/` account shell.
5. Merch commerce claims were returned to source-of-truth:
   - OBJECT 001 canonical price EUR 220;
   - OBJECT 001 sales state NOT OPEN;
   - no checkout/preorder UI while OWNER MARK / checkout / legal flow is incomplete;
   - SH-DEM-01/02/03 are working visual assets only; price, production spec and availability remain TBD / NOT OPEN.
6. `site-config.js` keeps checkout disabled and removes BLIK as an active preorder payment method.
7. Canonical metadata normalization uses GitHub Pages origin for pages that load `site-config.js`.

## Supabase decision

No schema expansion was required in this pass.

Current runtime registry contains the Programs and Event needed for access/workspace flows. PROJECT and OBJECT remain Git/source-backed until a concrete account/access/transaction workflow requires runtime rows.

This is intentional: database symmetry is not a goal by itself.

## Remaining non-blocking cleanup

Some older static pages still contain legacy Vercel OpenGraph URLs in source HTML and some public copy may use the user-facing subtype word `course`. These do not change entity semantics, but should be normalized during the next metadata/editorial sweep.

User-facing subtype terms remain allowed:

- course
- practice
- experience

provided internal architecture remains PROGRAM + program_type + delivery_mode.

## P0 commerce rule

No public sale/preorder claim may appear unless the canonical merch record has an approved sales_state and required production/legal fields.

Site display never overrides merch source-of-truth.
