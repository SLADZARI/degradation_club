# COMMERCE TRUTH GUARD V1 · G6 VALIDATION EVIDENCE

Status: **G6 VALIDATION PASS / G7 CANDIDATE**  
Date: **2026-09-16**  
Result: `dementor-club.result.commerce-truth-guard-v1`  
Issue: **#198**  
Candidate branch: `result/commerce-truth-guard-v1`  
Production baseline: `88a5efdb92a7a30678c5fcc74f02de7886c46d65`  
Candidate commit: `c8bb64c2045caee634a9c5600e2d9355b2756129`  
Pull request: **#215**  
Site Integrity run: **#1196**  
Run id: `35093437784`  
Job id: `104784948759`  
Conclusion: **SUCCESS**

## Validated invariant

**PUBLIC PROMISE MUST NEVER BE STRONGER THAN CURRENT COMMERCE READINESS.**

The implementation keeps `site-config.js` as the existing readiness owner and derives public commerce state from:

`ITEM / SOURCE STATE + COMMERCE READINESS → PUBLIC COMMERCE STATE`

No second Merch config, commerce ontology, table, checkout backend or payment system was introduced.

## Current source truth confirmed read-only

A read-only Supabase check on 2026-09-16 confirmed the live source conflict that #198 describes:

- `DC-OBJECT-001`: `base_price_eur = 520.00`, raw `sales_state = preorder`, `public_visible = true`;
- `SH-DEM-01`: `base_price_eur = 89.00`, raw `sales_state = sold_out`, `public_visible = true`;
- checkout readiness in `site-config.js` remains disabled: no enabled checkout, provider, URL or preorder payment method.

No database write or migration was performed.

## Exact candidate validation

PR #215 current head is:

`c8bb64c2045caee634a9c5600e2d9355b2756129`

The pull-request workflow checked out GitHub merge ref:

`db003942cafa7c4928a6b090b94ad281fb6661d7`

with the explicit log relation:

`Merge c8bb64c2045caee634a9c5600e2d9355b2756129 into 88a5efdb92a7a30678c5fcc74f02de7886c46d65`

Therefore #1196 validates the exact candidate against the exact current production baseline, without production merge.

## Focused Commerce Truth Guard acceptance

The dedicated Chromium acceptance passed on desktop `1440` and mobile `390` and proved:

- public Merch + Object 001 remain usable at both widths;
- raw source `PREORDER` + disabled checkout projects to public `NOT OPEN`;
- raw source `SOLD OUT` without separate canonical historical sales evidence projects to public `NOT OPEN`;
- Object 001 normal runtime price resolves to canonical `€520`;
- runtime/CDN failure fails closed to `PRICE UNAVAILABLE / NOT OPEN`;
- stale `EUR 220 / €220` is absent from client-visible current fallback;
- no actionable commerce control is exposed while checkout is disabled.

## First validation run and corrective

Site Integrity #1195 on the previous candidate failed only because the new focused test incorrectly required the responsive `.dc-entity-row__status` subcolumn to remain visually displayed at `390px`.

The existing Merch responsive composition intentionally hides that subcolumn on mobile while keeping the Object 001 catalog row accessible. The corrective changed only the acceptance assertion to validate the row and the commerce truth in DOM/runtime.

No CSS or commerce runtime behavior was changed to satisfy that failed assertion.

The corrected candidate was then rerun through the full matrix as #1196 and passed.

## Full Site Integrity evidence

Run #1196 completed all release checks successfully, including:

- Supabase release contract;
- registry, routes and feature state;
- content readiness and visual contract;
- DC-9 and Membership contracts;
- Board static/browser regressions;
- production candidate build;
- Current Program static/browser acceptance;
- DSO Release Loop static/browser acceptance;
- production analytics and consent;
- canonical shell and built JavaScript syntax;
- OAuth and WebKit auth regression;
- public harmonization matrix;
- Projects v2 regression;
- route manifest;
- final production artifact release gate.

The final release guard reported:

`Production release guard passed: 52 HTML routes covered; runtime references closed; commerce truth guard enforced.`

## Scope lock at G6

The candidate changes only the existing public commerce projection/fallback and release validation owners needed by #198.

Still explicitly excluded:

- enabling sales;
- payment provider selection;
- checkout implementation;
- preorder backend;
- database/schema mutation;
- Membership changes;
- Board changes;
- Contribution semantics;
- ThingProjection Runtime / Phase 3.

## Release boundary

`productionMergeAuthorized=false`  
`productionDeployAuthorized=false`

This evidence establishes **G6_VALIDATION** only.

**G6 PASS ≠ production merge ≠ deploy ≠ live G8 closure.**
