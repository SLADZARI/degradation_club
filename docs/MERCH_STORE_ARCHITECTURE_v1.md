# Dementor Club — Merch Store Architecture v1

Status: WIP / Git review only
Branch: `wip-merch-store-architecture`
Updated: 2026-08-25
Deployment: explicitly disabled for `wip-merch-store-architecture` in this branch's `vercel.json`; do not merge to `dementor-club-site` until review.

## Goal

Build a minimal store that can start with two approved physical objects and later add Wear without redesigning commerce logic.

The site remains an implementation layer. Canonical product truth comes from `dementor-club`; prototype recovery work is staged in `wip-merch-source-entities` until reviewed.

## MVP user flow

`/merch/` → product → variant (when applicable) → direct checkout

No cart in v1.
No account in v1.
No internal order backend in v1.

Checkout is an external provider adapter and remains disabled until provider/payment links are approved.

## Route model

- `/merch/` — shop index / collection entry.
- `/merch/ne-nado/` — OBJECT 001.
- `/merch/tsel/` — OBJECT 002 with size variants.
- future `/merch/<product-slug>/` — one physical product per route.

Artwork-only, BASE SPEC and prototype records do not receive public product routes.

## Entity layers

Mirrors WIP canonical model:

`COLLECTION → ARTWORK + BASE SPEC → PRODUCT → VARIANT/SKU → OFFER → ASSET`

### ARTWORK

The statement/graphic independent from a garment.

### BASE SPEC

Reusable wear construction: fabric, GSM, fit, base color, print methods and production direction. It has no retail price by itself.

### PRODUCT

A concrete retail object. For Wear this binds an ARTWORK to a BASE SPEC. Objects such as `НЕ НАДО` and `ЦЕЛЬ` do not require a BASE SPEC.

### VARIANT / SKU

What the user chooses: size / color / material variant.

### OFFER

Whether a SKU is actually for sale and where checkout goes.

### ASSET

Cover/gallery/packaging/OG media. Assets may be empty during development.

## Site data layout

```text
content/merch/
  store.json
  products/
    object-001-ne-nado.json
    object-002-tsel.json
  previews/
    core-wear-brief-2026-08-24.json
    wear-phase-01.json
```

`store.json → products[]` contains only entities allowed into the shop index.

`previews/` is non-public design/product state and must never be rendered by the public store runtime unless an explicit WIP/debug mode is later designed.

Current private WIP includes:

- `DC-M-002 — TEE / STATEMENT PIECE` / prototype / source PENDING;
- `DC-M-003 — HOODIE / ANTI STATEMENT PIECE` / prototype / source PENDING;
- tee base direction: 100% cotton, 220–240 g/m², oversized, white;
- hoodie base direction: heavyweight cotton-fleece, 400 g/m², oversized, black;
- `DC-ARTWORK-007 — ANTI SELF HELP` for the hoodie concept;
- six later typography artworks from `TEE COLLECTION / PHASE 01`.

None of the Wear prototype data is in the public `products[]` list.

## Store index

The index should expose:

- product ID;
- title;
- category/line;
- status;
- from-price;
- media if approved;
- route.

Status is not the same as sale availability.

Example:

`APPROVED / SALE CLOSED`

is valid and means the product exists but checkout is not open.

## Product page

Required blocks:

1. object/product identity;
2. statement;
3. media rail or factual `IMAGE PENDING` state;
4. material / dimensions / weight;
5. edition;
6. variant selector when multiple variants exist;
7. canonical EUR price;
8. sale state;
9. direct checkout CTA;
10. provenance / object ID.

## Currency

Canonical value is EUR.

MVP ships EUR-only until an FX source and refresh policy are explicitly chosen. Do not hard-code stale PLN/USD/GBP values.

Future currency display layer may convert from `basePriceEur` client-side or server-side, but canonical records remain EUR.

## Checkout

V1 uses direct checkout, not cart checkout.

Button activation requires both:

1. `site-config.js → merch.checkoutEnabled = true`;
2. the selected SKU/OFFER has an approved purchase URL (or a deliberately configured global checkout URL).

Per-SKU URL overrides global URL because TSEL variants may have separate payment links.

If either condition is missing, the CTA is disabled.

## Inventory

Do not infer inventory.

Allowed site stock values:

`unknown / preorder / in-stock / low-stock / out-of-stock / made-to-order`

`unknown` must never display as “available”.

## Wear integration

Recovered Wear is deliberately split into two layers:

1. reusable tee/hoodie BASE SPEC;
2. statement ARTWORK;
3. final PRODUCT binding them together.

Examples of future product bindings:

- `DC-WEAR-BASE-TEE-01 + DC-ARTWORK-003 (DO LESS.)`;
- `DC-WEAR-BASE-HOODIE-01 + DC-ARTWORK-007 (ANTI SELF HELP)`.

The early `DC-M-002` tee concept currently has `artwork_id: pending` because its briefboard showed several candidate graphics. It must not be silently bound to all six later tee artworks.

Each approved binding becomes a distinct PRODUCT with its own public route, SKU set, price and offer state.

## Image policy

Images are in progress.

Until approved files are present:

- render no fabricated product image;
- show a neutral `IMAGE PENDING / PRODUCT MEDIA IN PRODUCTION` state;
- keep public media arrays empty;
- add real paths only after assets are approved and placed under the agreed asset directory.

## Validation boundary

`content/` also contains non-entity JSON such as store manifests, page-readiness and private previews. The site validator now limits orphan-entity checks to explicit entity-record directories rather than treating every JSON file as a public entity.

Product routes are included in `content/page-readiness.json` so content readiness remains source-aware.

## Release gate

Before merge to `dementor-club-site`:

1. review WIP source entities and promote only accepted facts into the canonical `dementor-club` branch;
2. review product copy against canonical source;
3. review routes and product IDs;
4. approve website assets or explicitly approve an image-pending launch state;
5. decide whether sale remains closed or choose checkout provider;
6. if checkout opens, configure per-SKU offers/payment links;
7. privacy/terms check for provider;
8. run site/content validators;
9. merge to `dementor-club-site` only after approval.
