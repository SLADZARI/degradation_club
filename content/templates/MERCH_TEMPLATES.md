# Merch implementation templates

WIP site-layer templates for the store architecture.

- `merch-collection.json` — collection/drop grouping.
- `merch-artwork.json` — statement/graphic independent from product.
- `merch-base-spec.json` — reusable physical garment/base specification.
- `merch.json` — public-capable physical PRODUCT record with nested variants/SKUs and offers.
- `merch-asset.json` — addressable media metadata.

## v1 nesting rule

SKU and OFFER are logical entities but remain nested inside `merch.json` product records for v1.

Promote them to independent files/service records only when stock/payment state changes independently enough to justify it.

## Visibility rule

Templates do not imply publication.

Prototype artwork/base/product records belong in private WIP data until source-of-truth promotion explicitly allows public catalog placement.
