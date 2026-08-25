# Dementor Club — Merch Entity Model v1

Status: WIP architecture
Branch: `wip-merch-source-entities`
Updated: 2026-08-25

## Principle

The store must not treat a visual slogan, a reusable garment specification, a physical product, a size/color SKU and a checkout link as one entity.

Canonical hierarchy:

`COLLECTION / DROP → ARTWORK + BASE SPEC → PRODUCT → VARIANT / SKU → OFFER → ASSET`

`BASE SPEC` is optional. It is useful for Wear, where several statements may use the same approved T-shirt or hoodie construction. Conceptual Objects such as `НЕ НАДО` and `ЦЕЛЬ` do not need a separate base spec.

This keeps one artwork reusable across T-shirt / hoodie / sweatshirt products and keeps one garment construction reusable across several artworks without duplicating production facts.

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

## 3. BASE SPEC

Reusable physical construction specification. Optional for non-wear objects.

Examples:

- heavyweight oversized white tee blank;
- heavyweight oversized black hoodie blank.

Required fields:

- `base_spec_id`
- `product_type`
- `status`: `idea / prototype / approved / archived / cancelled`
- `materials`
- `weight_gsm`
- `construction`
- `fit`
- `base_colorways`
- `print_methods`
- `production_region`
- `packaging_direction`
- `care`
- `updated_at`

A base spec has no statement and no retail price. It is production infrastructure, not a public product by itself.

## 4. PRODUCT

A physical retail item created by binding an artwork and, where relevant, a base spec.

Examples:

- tee base + `DO LESS.` artwork;
- hoodie base + `ANTI SELF HELP` artwork;
- brass object `НЕ НАДО` (no base spec, no artwork binding required).

Required fields:

- `product_id`
- `public_name`
- `category`
- `product_type`
- `artwork_id` or `null`
- `base_spec_id` or `null`
- `status`: `idea / prototype / approved / production / available / sold-out / archived / cancelled`
- `colorways`
- `size_system`
- `care_override`
- `packaging_override`
- `edition`
- `base_price_eur`
- `production_cost_ceiling_eur`
- `website_assets`
- `social_assets`
- `updated_at`

If `base_spec_id` is present, shared material/construction facts are inherited from the base spec and should not be duplicated unless a product intentionally overrides them.

Only `approved / production / available` products may be prepared for public presentation. Only `available` may expose a live checkout action.

## 5. VARIANT / SKU

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

## 6. OFFER

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

## 7. ASSET

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

## Canonical storage layout

For v1, canonical product truth stays intentionally simple:

```text
merch/
  README.md
  MERCH_ENTITY_MODEL.md
  PRODUCT_LIFECYCLE.md
  collections/
    ...
  artworks/
    ARTWORK_....md
  specs/
    ...BASE....md
  products/
    PRODUCT....md
  templates/
    PRODUCT_TEMPLATE.md
    BASE_SPEC_TEMPLATE.md
```

### v1 nesting rule

`VARIANT / SKU` and `OFFER` are separate **logical entities**, but they do not need separate files yet.

In v1 they may live inside the owning PRODUCT record as structured sections/records, provided they keep stable IDs (`sku`, `offer_id`). This matches the existing `OBJECT 002 — ЦЕЛЬ` variant model and avoids unnecessary file explosion.

Split SKU/OFFER into independent files or an inventory/commerce service only when one of these becomes true:

- stock changes independently and frequently;
- multiple channels/providers sell the same SKU;
- warehouse/inventory integration appears;
- payment/provider data should be managed separately from editorial product truth;
- the number of variants makes the product record impractical.

`ASSET` metadata may similarly stay as an array/reference list in PRODUCT while media volume is small. Physical files themselves live in the site/assets layer, not inside canonical merch text records.

## Store rules

1. `dementor-club` owns product truth.
2. `dementor-club-site` mirrors approved public fields and may keep clearly marked prototype/WIP data outside the public catalog.
3. Artwork can be reused across garment types.
4. A reusable tee/hoodie BASE SPEC can support multiple artwork products.
5. A T-shirt and hoodie using the same artwork are separate PRODUCTS and have separate SKUs.
6. Checkout URLs are commerce configuration, not editorial facts.
7. Inventory and sale status must be explicit; absence of stock data means `unknown`, not `in-stock`.
8. Images are optional for architecture but required before a public product launch unless the team explicitly approves a media-pending launch state.
9. Mockup/design-board presence never promotes status automatically.
10. Status promotion follows `PRODUCT_LIFECYCLE.md`.

## Current inventory boundary

Approved physical objects already present:

- `DC-OBJECT-001 — OBJECT 001 — НЕ НАДО`;
- `DC-OBJECT-002 — OBJECT 002 — ЦЕЛЬ`.

Recovered core merch concepts remain prototype/PENDING:

- `DC-M-001 — CAP / CORE STATEMENT PIECE`;
- `DC-M-002 — TEE / STATEMENT PIECE`;
- `DC-M-003 — HOODIE / ANTI STATEMENT PIECE`;
- `DC-M-004 — MUG / DAILY REMINDER`.

Recovered reusable Wear specs:

- `DC-WEAR-BASE-TEE-01`;
- `DC-WEAR-BASE-HOODIE-01`.

Recovered core artworks:

- `DC-ARTWORK-007 — ANTI SELF HELP`;
- `DC-ARTWORK-008 — УПАКУЕМ ЦЕЛИ В РАСТЕРЯННОСТЬ`.

Separate Wear Phase 01 contains six prototype typography artworks.

None of the recovered prototype products is promoted to `approved` or `available`. Retail prices, final size tables, production confirmation, SKU stock and checkout remain unresolved until explicitly approved.
