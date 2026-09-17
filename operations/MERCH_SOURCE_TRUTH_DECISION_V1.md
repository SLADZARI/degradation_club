# Dementor Club — Merch Source Truth Decision v1

Status: **APPROVED LOCAL PRODUCT DECISION**  
Owner decision: **Yauhen**  
Decision date: **2026-09-18**  
Issue: **#199**  
Scope: **source truth for SH-DEM-01 and SH-DEM-04 only**

## 0. Decision boundary

This Decision resolves the product/source-truth questions tracked in #199 for exactly two Merch SKUs:

- `SH-DEM-01` — `OVERTHINKING IS MY CARDIO.`
- `SH-DEM-04` — `ВАШ ПОТЕНЦИАЛ СЛИШКОМ ДОЛГО ОСТАВАЛСЯ РАСКРЫТЫМ.`

It is a project-local source-truth authority. It does not create a new Merch architecture, database, registry or commerce model.

This approval authorizes alignment of the canonical Merch product source documents only. It does **not** authorize runtime, Supabase, checkout, sales-opening or other commerce implementation.

Canonical direction:

```text
OWNER PRODUCT DECISION
→ canonical merch product source
→ later operational/runtime alignment
→ later public projection
```

Not:

```text
latest Supabase/WIP/runtime value
→ inferred product truth
```

## 1. SH-DEM-01 — approved product truth

Canonical identity remains:

```text
product_id: SH-DEM-01
name: OVERTHINKING IS MY CARDIO.
line: Classic Dementor T-Shirts
drop: DROP 001
```

Approved current product truth:

```text
CURRENT VARIANT MODEL:
LIGHT

Meaning:
LIGHT is the current real product version, not merely a mockup/presentation artifact.

CANONICAL BASE PRICE:
EUR 89

REAL CURRENT SALES STATUS:
NOT OPEN

Meaning:
the product has not yet been sold publicly, but is planned for future sale.

sold_out PROVENANCE:
NOT REAL PUBLIC SALES HISTORY

Meaning:
the current operational/Supabase sold_out value is classified as test/internal/legacy state and must not be used as product truth.
```

Therefore:

- no public `SOLD OUT` claim is authorized;
- no historical public sale may be inferred or invented;
- EUR 89 is the canonical base product price;
- `sales_state = not-open` remains the canonical sales state;
- LIGHT is the current canonical variant model for this SKU.

This Decision does not open sales, enable checkout or assert current availability.

## 2. SH-DEM-01 — source/runtime distinction

Canonical source truth after source alignment:

```text
variant: LIGHT
base_price_eur: 89
sales_state: not-open
historical_public_sales: none established
sold_out operational value: legacy/test/internal, non-authoritative
```

Current runtime or database state may remain inconsistent until a separately authorized implementation boundary aligns it.

Canonical invariant:

```text
OPERATIONAL sold_out
≠
PRODUCT SOLD OUT
```

and:

```text
NOT OPEN
≠
SOLD OUT
```

## 3. SH-DEM-04 — approved product truth

Canonical identity remains:

```text
product_id: SH-DEM-04
name: ВАШ ПОТЕНЦИАЛ СЛИШКОМ ДОЛГО ОСТАВАЛСЯ РАСКРЫТЫМ.
line: Classic Dementor T-Shirts
drop: DROP 001
```

Approved disposition:

```text
PRODUCT DISPOSITION:
ACTIVE_PUBLIC_PRODUCT

Meaning:
a real future Dementor Club product, not concept and not preview.

CURRENT SALES STATE:
NOT OPEN

PRICE:
NOT APPROVED / UNKNOWN

AVAILABILITY:
NOT APPROVED / UNKNOWN
```

A public route/card may exist as representation of a real future product, but it must not claim:

- an invented price;
- approved availability;
- open sales;
- preorder;
- sold out;
- checkout readiness.

`ACTIVE_PUBLIC_PRODUCT` means real product identity and valid public representation. It does **not** mean commerce is open.

## 4. SH-DEM-04 — operational registry question remains separate

This Decision intentionally does **not** decide whether an operational `dc_merch_items` row must exist now.

The absence or presence of such a row is an implementation/operational-alignment question, not a Product truth inference.

Canonical distinction:

```text
ACTIVE_PUBLIC_PRODUCT
≠
PROOF THAT A CURRENT dc_merch_items ROW MUST EXIST
```

and:

```text
MISSING dc_merch_items ROW
≠
PRODUCT DOES NOT EXIST
```

Any future operational alignment must first determine the canonical owner and reuse boundary for the existing Merch source model and `dc_merch_items`.

## 5. Canonical product-source updates authorized by this Decision

The following source updates are authorized now:

### SH-DEM-01

- record LIGHT as current real/canonical variant;
- record `base_price_eur: 89`;
- keep `sales_state: not-open`;
- remove price from missing fields;
- explicitly prohibit deriving `SOLD OUT` or sales history from legacy operational state.

### SH-DEM-04

- record disposition/status as real active public future product;
- keep `sales_state: not-open`;
- retain `base_price_eur: null` until owner approves price;
- retain availability as unknown/unapproved;
- allow public representation without implying open commerce.

No other product/commercial fields are approved by this Decision.

## 6. Commerce guardrail

This Decision does not authorize:

- checkout;
- public sales opening;
- preorder;
- stock allocation;
- availability assertion;
- payment integration;
- shipment promises;
- production quantity;
- public sales-history claims.

The existing Commerce Truth Guard remains the runtime protection boundary until separately changed.

## 7. Future implementation boundary

A later, separately authorized implementation may reconcile runtime/DB/public projection with this Decision.

That future scope may include:

- removing/replacing legacy `sold_out` operational truth for SH-DEM-01;
- aligning runtime price projection to canonical EUR 89 where appropriate;
- deciding how `ACTIVE_PUBLIC_PRODUCT / NOT OPEN` for SH-DEM-04 maps into existing operational representation;
- verifying public Merch routes/cards remain fail-closed for unknown availability and unopened sales.

This Decision itself opens no Result and authorizes no runtime or database mutation.

## 8. Owner / Merch Management Surface — future backlog principle

A future Owner-facing Merch Management Surface is desirable for managing existing products and adding new ones.

Candidate managed fields include:

- SKU / product_id;
- title;
- variant;
- base price;
- sales state;
- availability;
- assets;
- public visibility;
- other explicitly approved commercial fields.

This is **backlog only**, not implementation authorization and not an architecture decision.

Before implementation, a separate authority/inventory must determine:

```text
CANONICAL PRODUCT OWNER
+
REUSE OF EXISTING merch source model / dc_merch_items
→ Owner management UI
```

The Owner UI must not become a second product database or competing registry.

No new table, registry or schema is approved here.

## 9. Canonical invariant

```text
SH-DEM-01
= LIGHT
+ EUR 89
+ NOT OPEN
+ no real sold-out/public-sales history

SH-DEM-04
= ACTIVE_PUBLIC_PRODUCT
+ NOT OPEN
+ price unknown
+ availability unknown
```

Operational/runtime alignment is separate and requires explicit future authorization.
