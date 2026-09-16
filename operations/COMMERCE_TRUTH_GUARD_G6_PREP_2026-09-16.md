# Commerce Truth Guard v1 — G6 preparation

Date: 2026-09-16
Result: `dementor-club.result.commerce-truth-guard-v1`
Issue: #198
Integration branch: `result/commerce-truth-guard-v1`
Production baseline: `88a5efdb92a7a30678c5fcc74f02de7886c46d65`
Status: IMPLEMENTED / AWAITING EXACT-HEAD G6

## Invariant

**PUBLIC PROMISE MUST NEVER BE STRONGER THAN CURRENT COMMERCE READINESS.**

## Existing owners changed

- `site-config.js` remains the canonical commerce-readiness config; no second config was created.
- `merch-runtime-v1.js` now derives public commerce state from source state + readiness.
- `objects/001-ne-nado/index.html` fails closed before runtime and no longer exposes stale EUR 220 or a public list that could imply current PREORDER/SOLD OUT truth.
- `scripts/validate-production-release.mjs` enforces the readiness truth and Object 001 fallback contract.
- `scripts/validate-commerce-truth-guard-browser.mjs` covers public Merch/Object behavior at desktop/mobile and runtime failure.
- `.github/workflows/site-integrity.yml` runs the focused browser acceptance inside the existing release workflow.

## Source confirmation

Read-only production Supabase check on 2026-09-16 confirmed:

- `DC-OBJECT-001`: `base_price_eur = 520.00`, raw `sales_state = preorder`, `public_visible = true`;
- `SH-DEM-01`: raw `sales_state = sold_out`, `public_visible = true`.

No database write was performed.

## Expected public projection while checkout is disabled

- source `preorder` → public `NOT OPEN`;
- source `available` → public `NOT OPEN`;
- source `sold_out` without separately approved historical commerce evidence → public `NOT OPEN`;
- Object 001 normal runtime price → `€520`;
- runtime/pre-runtime failure → `PRICE UNAVAILABLE / NOT OPEN`;
- checkout/order actions remain hidden/disabled.

## Explicit non-goals preserved

No checkout/payment implementation, provider choice, preorder backend, new commerce ontology, new table, Membership, Board, Contribution, ThingProjection or Phase 3 changes.

## Gate discipline

This document is preparation for G6 only. CI success does not authorize production merge or deploy.
