# DEMENTOR CLUB — PREORDER / PAYMENT / CUSTOMER RULES v0.1

Status: INTERNAL / WIP / DO NOT DEPLOY
Branch: wip-merch-preorder-size-payment

## 1. Sales model

Current commercial mode for DROP 001: **PREORDER**.

Meaning:
- customer chooses product + variant + size;
- customer pays before production/fulfilment;
- order enters the next production window;
- no claim of immediate stock availability;
- estimated dispatch window should be shown separately from carrier transit time.

Recommended public status copy:

**PREORDER / NEXT PRODUCTION WINDOW**

Recommended customer explanation:

> This item is produced in scheduled preorder windows. After payment, your order is assigned to the next production batch. Dispatch timing is shown before payment.

Do not use fake scarcity counters. FOMO should come from real production windows / drop windows only.

## 2. Product status changes for next site iteration

Replace client-facing `SALES NOT OPEN` / `NOT OPEN` with `PREORDER` only when payment flow is actually ready.

Remove from customer-facing pages all internal production-control wording such as:
- sample test required;
- wash test required;
- sample approval;
- internal QC test notes.

These are internal production controls and must not be presented as unresolved customer-facing product facts.

An approved physical sample already exists; do not mention sample status to the customer.

## 3. T-shirt size model

Working blank: Stanley/Stella Freestyler STTU788, 240 GSM, relaxed/unisex, 100% organic cotton.

Canonical internal size guide for current Drop 001 shirts:
`merch/size-guides/FREESTYLER_STTU788.md`

Working public size range: **XXS–3XL**.

Customer rule:
- show garment measurements in cm;
- explain `half chest` as flat garment width;
- ask customer to compare against a T-shirt they already own;
- do not invent S/M/L body measurements.

## 4. Prices

- SH-DEM-01 — OVERTHINKING IS MY CARDIO. / LIGHT — EUR 79
- SH-DEM-02 — PERSONAL GROWTH CANCELLED. / LIGHT — EUR 79
- SH-DEM-03 — SUCCESS IS BORING. / LIGHT — EUR 79
- SH-DEM-03 — SUCCESS IS BORING. / BLACK — EUR 89
- OBJECT 001 — НЕ НАДО — EUR 520

## 5. Manual launch payment method

Initial proposed payment method: **BLIK transfer to phone**.

Payment phone: **+48 573 265 211**

Operational requirement before publishing this method:
- the phone number must be registered for BLIK transfers;
- transfers should land directly on the Polish business/JDG bank account used for sales accounting;
- each buyer should use an order reference in the transfer title, e.g. `DC-2026-0001`;
- payment should be manually reconciled to the preorder before marking it `PAID`;
- customer should receive a payment confirmation / order confirmation after reconciliation.

Recommended internal order states:
`NEW → PAYMENT PENDING → PAID → PRODUCTION WINDOW → IN PRODUCTION → READY → SHIPPED`

## 6. BLIK limitation

BLIK-to-phone is acceptable as a **manual launch payment rail for Polish customers** if the number is connected to the business account.

It should **not be treated as the final or sole Europe-wide checkout method**. Many EU customers will not have access to Polish BLIK banking. For broader Europe the next payment layer should support normal online checkout / card / bank-compatible payment methods.

## 7. Accounting rule

Because current sales are processed through a Polish JDG, every paid preorder must enter the normal Polish business sales/accounting flow. The payment rail does not replace invoicing/receipt, tax recognition, order evidence, refunds or bookkeeping requirements.

Do not mix private and business incoming payments if this can be avoided.

## 8. What remains before public preorder switch

- confirm the BLIK phone is linked to the actual business account;
- define customer order ID format;
- define confirmation message/e-mail flow;
- define preorder production-window wording and realistic dispatch range;
- define cancellation/refund rule before production starts;
- define return/exchange policy for apparel;
- define EU shipping tariff/collection logic;
- update site copy from NOT OPEN to PREORDER;
- add size guide UI;
- remove all internal testing language from public product pages.

No production deploy is authorized by this document.
