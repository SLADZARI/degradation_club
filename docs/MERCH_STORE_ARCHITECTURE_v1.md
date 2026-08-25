# Dementor Club — Merch Store Architecture v1

Status: WIP / Git review only
Branch: `wip-merch-store-architecture`
Updated: 2026-08-25
Deployment: explicitly disabled for `wip-merch-store-architecture` in this branch's `vercel.json`; do not merge to `dementor-club-site` until review.

## Goal

Build a minimal store that can start with two approved physical objects and later add Wear / Paper / Editions without redesigning commerce logic.

The site remains an implementation layer. Canonical product truth comes from `dementor-club`; prototype recovery work is staged in `wip-merch-source-entities` until reviewed.

## MVP user flow

`/merch/` → category → product → variant (when applicable) → direct checkout

No cart in v1.
No account in v1.
No internal order backend in v1.

Checkout is an external provider adapter and remains disabled until product/offer/payment details are approved.

## Route model

- `/merch/` — shop index / category entry.
- `/merch/ne-nado/` — OBJECT 001.
- `/merch/tsel/` — OBJECT 002 with size variants.
- future `/merch/<product-slug>/` — one physical product per route.

Artwork-only, BASE SPEC and prototype records do not receive public product routes.

## Entity layers

Mirrors WIP canonical model:

`COLLECTION → ARTWORK + BASE SPEC → PRODUCT → VARIANT/SKU → OFFER → ASSET`

### COLLECTION

Editorial/drop grouping independent from sale state.

### ARTWORK

The statement/graphic independent from a garment.

### BASE SPEC

Reusable physical construction: fabric, GSM, fit, base color, print methods and production direction. It has no retail price by itself.

### PRODUCT

A concrete retail object. For Wear this binds an ARTWORK to a BASE SPEC. Objects such as `НЕ НАДО` and `ЦЕЛЬ` do not require a BASE SPEC.

### VARIANT / SKU

Concrete purchasable configuration: size / color / material variant / dimensions.

### OFFER

Whether a SKU is actually for sale and where checkout goes.

### ASSET

Cover/gallery/detail/scale/packaging/OG/social media. Assets are replaceable without changing product facts.

## Site data layout

```text
content/merch/
  store.json
  products/
    object-001-ne-nado.json
    object-002-tsel.json
  previews/
    core-merch-brief-2026-08-24.json
    wear-phase-01.json

content/templates/
  MERCH_TEMPLATES.md
  merch.json
  merch-collection.json
  merch-artwork.json
  merch-base-spec.json
  merch-asset.json
```

`store.json → products[]` contains only entities allowed into the public shop index.

`previews/` is non-public design/product state and must never be rendered by the public store runtime unless an explicit WIP/debug mode is later designed.

For v1, SKU and OFFER remain logical entities nested inside the owning `merch.json` PRODUCT record. They should move into separate records/services only when inventory or payment state begins changing independently enough to justify it.

## Current public store

Public products: `2`.

- `DC-OBJECT-001 — OBJECT 001 — НЕ НАДО`;
- `DC-OBJECT-002 — OBJECT 002 — ЦЕЛЬ`.

Both are currently:

- product status: `approved`;
- sale status: `closed`;
- checkout disabled;
- website media pending.

## Current private prototype register

Recovered early merch concepts:

- `DC-M-001 — CAP / CORE STATEMENT PIECE` / prototype / source PENDING;
- `DC-M-002 — TEE / STATEMENT PIECE` / prototype / source PENDING;
- `DC-M-003 — HOODIE / ANTI STATEMENT PIECE` / prototype / source PENDING;
- `DC-M-004 — MUG / DAILY REMINDER` / prototype / source PENDING.

Wear base directions:

- tee: 100% cotton, 220–240 g/m², oversized, white primary base;
- hoodie: heavyweight cotton-fleece direction, 400 g/m², oversized, black primary base.

Recovered core artworks:

- `DC-ARTWORK-007 — ANTI SELF HELP`;
- `DC-ARTWORK-008 — УПАКУЕМ ЦЕЛИ В РАСТЕРЯННОСТЬ`.

Later Wear Phase 01 typography artworks:

- SUCCESS IS BORING.
- DON'T IMPROVE YOURSELF.
- DO LESS.
- PERSONAL GROWTH CANCELLED.
- OPTIMIZED FOR NOTHING.
- 10X LESS.

None of these prototype records are in public `products[]`.

## Public categories

The store manifest already contains stable category entries:

- `Objects`;
- `Wear`;
- `Paper`;
- `Editions`;
- `Project Editions`.

Public counts are derived from `products[]` and validated against the manifest.

Current state:

- ALL / 02;
- OBJECTS / 02;
- WEAR / 00;
- PAPER / 00;
- EDITIONS / 00;
- PROJECT EDITIONS / 00.

Filtering a category with zero public products returns an explicit empty state. Prototype records are not leaked into that category.

## Store index

The index exposes:

- product ID;
- title;
- category/line;
- product status;
- sale status;
- from-price;
- approved media if present;
- route.

Status is not the same as sale availability.

Example:

`APPROVED / SALE CLOSED`

is valid and means the product exists but checkout is not open.

## Product page

Required blocks:

1. product identity;
2. statement;
3. media rail or factual `IMAGE PENDING` state;
4. material / dimensions / weight;
5. edition;
6. variant selector when multiple variants exist;
7. canonical EUR price;
8. stock state;
9. sale state;
10. direct checkout CTA;
11. provenance / object ID.

## Currency

Canonical value is EUR.

MVP ships EUR-only until an FX source and refresh policy are explicitly chosen. Do not hard-code stale PLN/USD/GBP values.

Future currency display layer may convert from `basePriceEur` client-side or server-side, but canonical records remain EUR.

## Checkout

V1 uses direct checkout, not cart checkout.

A live CTA requires all four gates:

1. product status = `available`;
2. selected SKU offer status = `open` or `preorder`;
3. an approved purchase URL exists for the selected SKU or deliberately configured global checkout;
4. `site-config.js → merch.checkoutEnabled = true`.

Per-SKU URL overrides global URL because product variants may require separate payment links.

Current state: checkout disabled.

## Inventory

Do not infer inventory.

Allowed site stock values:

`unknown / preorder / in-stock / low-stock / out-of-stock / made-to-order`

`unknown` must never display as “available”.

## Wear integration

Recovered Wear is deliberately split into three layers:

1. reusable tee/hoodie BASE SPEC;
2. statement ARTWORK;
3. final PRODUCT binding them together.

Examples of future product bindings:

- `DC-WEAR-BASE-TEE-01 + DC-ARTWORK-003 (DO LESS.)`;
- `DC-WEAR-BASE-HOODIE-01 + DC-ARTWORK-007 (ANTI SELF HELP)`.

The early `DC-M-002` tee concept currently has `artwork_id: pending` because its board showed several candidate graphics. It must not be silently bound to all six later tee artworks.

Each approved binding becomes a distinct PRODUCT with its own public route, SKU set, price and offer state.

## Image policy

Images are in progress.

Until approved files are present:

- render no fabricated product image;
- show a neutral `IMAGE PENDING / PRODUCT MEDIA IN PRODUCTION` state;
- keep public media arrays empty;
- add real paths only after assets are approved and placed under the agreed asset directory.

`merch-asset.json` defines the future metadata contract for `cover / gallery / detail / scale / packaging / og / social` assets without coupling media files to editorial product truth.

## Validation

GitHub Actions runs `Site Integrity` on `wip-merch-store-architecture` without deploying anything.

Checks:

1. `node --check merch-store-v1.js`;
2. `node --check service-adapters.js`;
3. `node scripts/validate-site.mjs`;
4. `node scripts/validate-merch-store.mjs`;
5. `node scripts/validate-content-readiness.mjs`.

The merch validator checks:

- category counts;
- public product ↔ registry ↔ product record consistency;
- unique SKU IDs;
- positive EUR prices;
- stock values;
- offer states;
- `available` gate for live checkout;
- private prototype isolation;
- explicit Vercel-disable flag for WIP branch.

## Review entry point

For human review use:

`docs/MERCH_REVIEW_CHECKLIST_v1.md`

For implementation template details use:

`content/templates/MERCH_TEMPLATES.md`

## Release gate

Before merge to `dementor-club-site`:

1. review WIP source entities and promote only accepted facts into canonical `dementor-club`;
2. review product copy against canonical source;
3. review routes and product IDs;
4. approve website assets or explicitly approve an image-pending launch state;
5. decide whether sale remains closed or choose checkout provider;
6. if checkout opens, configure per-SKU offers/payment links;
7. privacy/terms check for provider;
8. obtain green Site Integrity;
9. merge to `dementor-club-site` only after approval;
10. deploy only after that merge is deliberately approved.
