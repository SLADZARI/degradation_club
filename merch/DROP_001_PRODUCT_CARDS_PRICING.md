# DEMENTOR CLUB — DROP 001 PRODUCT CARDS & PRICING

Status: **WIP / DO NOT DEPLOY / DO NOT MERGE TO PRODUCTION YET**

Base branch: `wip-merch-source-entities`
Working branch: `wip-merch-drop-001-pricing-products`
Updated: `2026-08-26`

## Purpose

This document is the merchandising baseline for the current real products that already have working imagery/assets. It connects the existing merch entity model with current pricing and the draft economics model.

Each product must remain editable through a stable product passport. Public copy, physical specification, economics, assets and missing decisions are stored separately inside each product file.

## Current price architecture

- `LIGHT / STANDARD APPAREL`: `EUR 79`
- `BLACK / PREMIUM APPAREL`: `EUR 89`
- `NUMBERED COLLECTIBLE OBJECT`: `EUR 520`

No `.99` pricing. No automatic sale price. The public price is an object/collection price, not e-commerce discount signalling.

## Current products

| SKU | Product | Variant | Retail EUR | Working full one-unit cost EUR | Cost ceiling EUR | Status |
|---|---|---|---:|---:|---:|---|
| SH-DEM-01 | OVERTHINKING IS MY CARDIO. | LIGHT | 79 | 52.25 | 60 | priced draft / sample required |
| SH-DEM-02 | PERSONAL GROWTH CANCELLED. | LIGHT | 79 | 52.25 | 60 | priced draft / sample required |
| SH-DEM-03-LIGHT | SUCCESS IS BORING. | LIGHT | 79 | 52.25 | 60 | priced draft / sample required |
| SH-DEM-03-BLACK | SUCCESS IS BORING. | BLACK | 89 | 52.25 + dark-print delta MISSING | 65 | priced draft / dark-print RFQ required |
| DC-OBJECT-001 | OBJECT 001 — НЕ НАДО | BRASS / NUMBERED | 520 | 177.78 | 220 | priced draft / supplier RFQ required |

## Apparel production baseline

Working premium blank for all current T-shirts:

- `Stanley/Stella Freestyler STTU788`
- `240 GSM`
- `Single Jersey`
- `100% organic cotton — Organic Open End Carded`
- `fabric washed`
- `relaxed fit / unisex`
- `XXS–3XL`

Status: `PROPOSED / SAMPLE TEST REQUIRED`.

Rule: do not silently replace the approved premium benchmark with a cheaper blank. If the production blank changes, update the product passport and re-run unit economics before publishing.

Working print method: `premium DTG`, subject to physical sample / wash / hand-feel approval.

For BLACK garments, the exact dark-garment production delta remains MISSING until supplier RFQ/sample.

## Apparel quality gate

Before the material/print specification becomes approved:

1. order physical blank sample;
2. print real production artwork;
3. inspect hand-feel and colour;
4. wash-test multiple cycles;
5. check shrinkage, cracking, peeling and fading;
6. approve exact garment colour;
7. approve print dimensions/placement;
8. approve neck/care labels;
9. approve final packaging;
10. replace economics estimates with actual supplier cost.

## Product passport files

- `merch/products/SH_DEM_01_OVERTHINKING_IS_MY_CARDIO.md`
- `merch/products/SH_DEM_02_PERSONAL_GROWTH_CANCELLED.md`
- `merch/products/SH_DEM_03_SUCCESS_IS_BORING.md`
- `merch/products/OBJECT_001_NE_NADO.md`

## Asset mapping

### SH-DEM-01
- product: Drive ID `18_2sAwPXt4Gbxu8s832BJQP4Uh3ev9hz`
- sheet: Drive ID `1KY7LPEW6Wur0vvjJhTiVDFRHhzM7qQSk`

### SH-DEM-02
- product: Drive ID `1W_V9XAninkPyxyjI0YFbqlsWrZhWWU5W`

### SH-DEM-03
- LIGHT: Drive ID `14kKDxIk4G3BPYpK3O4DQneAOu1R5QsOS`
- BLACK: Drive ID `1pdZgXrOJFujVZGtC6G5gPjT9tOkyQSJE`

### OBJECT 001
Working visual package exists in the OBJECT 001 Drive folder: hero, front, top, side, back, macro, scale, lifestyle and packaging.

## Economics field semantics

`working_direct_cash_eur` — direct current modeled cash for physical production ingredients before team routing overhead.

`working_full_one_unit_cost_eur` — conservative one-unit operational cost from the current DEMENTOR economics model. It preserves the scenario where a single order may carry its own procurement/pickup/dispatch route.

`production_cost_ceiling_eur` — management boundary. If confirmed production exceeds the ceiling, first review pricing/process/spec; do not automatically lower product quality.

VAT, payment processing, corporate taxes and customer carrier are outside the product COGS field and belong to the economics/accounting layer.

## Public positioning rule

Dementor Club merch is treated as cultural artifacts, not generic branded merchandise.

Do not present these products as:
- cheap print-on-demand;
- corporate swag;
- souvenir products;
- motivational apparel;
- sale-first / discount-first ecommerce.

## Missing decisions shared by current apparel

- physical 240 GSM sample approval;
- supplier and actual blank purchase cost;
- exact DTG supplier;
- dark garment surcharge;
- exact print dimensions and placement;
- neck label spec;
- care label spec;
- packaging spec;
- shipping weight;
- actual one-unit RFQ;
- checkout tax implementation for Polish JDG / EU sales.

## Deployment rule

This branch is documentation/product-model work only. No production website records, public routes or checkout prices are changed until explicit approval to merge/deploy.
