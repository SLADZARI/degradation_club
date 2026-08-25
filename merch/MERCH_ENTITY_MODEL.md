# Dementor Club — Merch Entity Model v1

Status: WIP architecture
Branch: `wip-merch-source-entities`
Updated: 2026-08-25

## Principle

The store must not treat a visual slogan, a physical garment, a size/color SKU and a checkout link as one entity.

Canonical hierarchy:

`COLLECTION / DROP → ARTWORK → PRODUCT → VARIANT / SKU → OFFER → ASSET`

This keeps one approved artwork reusable across a T-shirt, hoodie or sweatshirt without duplicating the statement or silently inventing production facts.

## 1. COLLECTION / DROP

Groups related merchandise into one release or editorial family.

Required fields:

- `collection_id`
- `title`
- `status`
- `category_scope`
- `artwork_ids`
- `product_ids`
- `launch_status`
- `updated_at`

A collection can exist before products are sale-ready.

## 2. ARTWORK

The graphic/cultural statement independent from the physical blank.

Required fields:

- `artwork_id`
- `title`
- `statement`
- `status`: `idea / prototype / approved / archived / cancelled`
- `language`
- `palette`
- `style`
- `print_approach`
- `placement_guidance`
- `design_source`
- `approved_phrases`
- `prohibited_presentation`
- `updated_at`

An artwork is **not** a sellable product.

## 3. PRODUCT

A physical item that binds one artwork to a garment/object specification.

Examples:

- T-shirt + ARTWORK-003;
- hoodie + ARTWORK-003;
- brass object `НЕ НАДО`.

Required fields:

- `product_id`
- `public_name`
- `category`
- `product_type`
- `artwork_id` or `null`
- `status`: `idea / prototype / approved / production / available / sold-out / archived / cancelled`
- `materials`
- `construction`
- `fit`
- `colorways`
- `size_system`
- `care`
- `packaging`
- `edition`
- `base_price_eur`
- `production_cost_ceiling_eur`
- `website_assets`
- `social_assets`
- `updated_at`

Only `approved / production / available` products may be prepared for public sale. Only `available` may expose a live checkout action.

## 4. VARIANT / SKU

A concrete purchasable configuration.

Required fields:

- `sku`
- `product_id`
- `size`
- `color`
- `material_variant`
- `weight`
- `edition_limit`
- `stock_status`: `unknown / preorder / in-stock / low-stock / out-of-stock / made-to-order`
- `base_price_eur`
- `shipping_class`
- `active`

Price remains canonical in EUR.

## 5. OFFER

Commerce state, separated from product identity.

Required fields:

- `offer_id`
- `sku`
- `sale_status`: `closed / preview / preorder / open / paused / sold-out`
- `checkout_provider`
- `checkout_reference`
- `purchase_url`
- `starts_at`
- `ends_at`
- `regions`

A product may be approved while its offer is still `closed`.

## 6. ASSET

Media is addressable and replaceable without editing product facts.

Required fields:

- `asset_id`
- `entity_id`
- `role`: `cover / gallery / detail / scale / packaging / og / social`
- `status`: `draft / approved / retired`
- `path`
- `alt`
- `width`
- `height`

Until approved images exist, the site may render a factual no-image state. Placeholder art must never be mistaken for a product photograph.

## Store rules

1. `dementor-club` owns product truth.
2. `dementor-club-site` mirrors approved public fields and may also render clearly marked prototype/WIP entities when the page itself is non-public/WIP.
3. Artwork can be reused across garment types.
4. A T-shirt and hoodie using the same artwork are separate PRODUCTS and have separate SKUs.
5. Checkout URLs are commerce configuration, not editorial facts.
6. Inventory and sale status must be explicit; absence of stock data means `unknown`, not `in-stock`.
7. Images are optional for architecture but required before a public product launch.

## Current canonical inventory boundary

Approved physical objects already present:

- `DC-OBJECT-001 — OBJECT 001 — НЕ НАДО`;
- `DC-OBJECT-002 — OBJECT 002 — ЦЕЛЬ`.

Wear artwork work from 2026-08-24 is captured separately as prototype artwork entities. Garment blanks, hoodie bindings, sizes, materials, prices and SKU inventory remain unapproved until explicitly fixed.
