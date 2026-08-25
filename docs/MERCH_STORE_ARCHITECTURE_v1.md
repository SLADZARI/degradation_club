# Dementor Club — Merch Store Architecture v1

Status: WIP / Git review only
Branch: `wip-merch-store-architecture`
Updated: 2026-08-25
Deployment: disabled for this branch by repository Vercel branch policy; do not merge to `dementor-club-site` until review.

## Goal

Build a minimal store that can start with two approved physical objects and later add Wear without redesigning commerce logic.

The site remains an implementation layer. Canonical product truth comes from `dementor-club`.

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

Artwork-only records do not receive public product routes.

## Entity layers

Mirrors canonical model:

`COLLECTION → ARTWORK → PRODUCT → VARIANT/SKU → OFFER → ASSET`

### PRODUCT

What the object physically is.

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
    wear-phase-01.json
```

`store.json` contains only entities allowed into the shop index.

`previews/` is non-public design state and must never be rendered by the public store runtime unless an explicit WIP/debug mode is used.

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
2. the selected SKU/OFFER has an approved purchase URL (or a configured global checkout URL).

Per-SKU URL overrides global URL because TSEL variants may have separate payment links.

If either condition is missing, the CTA is disabled.

## Inventory

Do not infer inventory.

Allowed site stock values:

`unknown / preorder / in-stock / low-stock / out-of-stock / made-to-order`

`unknown` must never display as “available”.

## Wear integration

The six artworks developed on 2026-08-24 are not yet physical products.

The store architecture supports later bindings such as:

- `TEE + DC-ARTWORK-003`;
- `HOODIE + DC-ARTWORK-003`.

Each binding becomes a separate PRODUCT with its own material, fit, sizes, colorways, price and SKUs.

This prevents a design mockup from silently becoming a sellable hoodie or T-shirt.

## Image policy

Images are in progress.

Until approved files are present:

- render no fabricated product image;
- show a neutral `IMAGE PENDING / PRODUCT MEDIA IN PRODUCTION` state;
- keep media arrays empty;
- add real paths only after assets are approved and placed under the agreed asset directory.

## Release gate

Before merge to `dementor-club-site`:

1. review product copy against canonical source;
2. review routes and product IDs;
3. approve website assets or accept explicit image-pending launch state;
4. decide whether sale remains closed or choose checkout provider;
5. if checkout opens, configure per-SKU offers/payment links;
6. privacy/terms check for provider;
7. run site/content validators;
8. merge to `dementor-club-site` only after approval.
