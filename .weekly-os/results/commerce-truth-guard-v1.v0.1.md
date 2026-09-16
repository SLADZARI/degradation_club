---
artifactId: dementor-club.result.commerce-truth-guard-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
version: 0.1
updated: 2026-09-16
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
branch: result/commerce-truth-guard-v1
baseline: dementor-club-production@88a5efdb92a7a30678c5fcc74f02de7886c46d65
issue: 198
implementationStartAuthorized: true
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# Dementor Club · Commerce Truth Guard v1

## Goal

Eliminate the factual conflict between real commerce readiness and the public Merch projection before advertising readiness work proceeds.

Canonical invariant:

**PUBLIC PROMISE MUST NEVER BE STRONGER THAN CURRENT COMMERCE READINESS.**

This Result resolves GitHub issue #198 only. It does not activate commerce.

## Current truth

Current production baseline:
`dementor-club-production@88a5efdb92a7a30678c5fcc74f02de7886c46d65`

Current canonical readiness in `site-config.js`:
- `checkoutEnabled = false`;
- checkout provider is absent;
- checkout URL is absent;
- preorder payment method is absent.

Issue #198 confirms:
- Object 001 canonical current price = `EUR 520`;
- legacy static fallback `EUR 220` is stale and must not be exposed as current public truth;
- public state remains `NOT OPEN / CHECKOUT DISABLED` until payment flow is separately approved.

## Existing owners

Extend existing owners only:
- `site-config.js` — canonical commerce readiness source; no parallel config;
- `merch-runtime-v1.js` — current public Merch projection owner;
- public Merch/Object HTML — pre-runtime / JS-failure fallback;
- existing Supabase item fields remain source data, not direct public commerce truth;
- existing production/release validators own release enforcement.

Observed drift:
- `merch-runtime-v1.js` currently maps raw `sales_state` directly to public status;
- `available/preorder` currently contributes directly to `OPEN ITEMS`;
- Object 001 static fallback contains stale `€220` / `EUR 220`.

## Required behavior

Public commerce state is a projection of:

`ITEM / SOURCE STATE + COMMERCE READINESS → PUBLIC COMMERCE STATE`

When `checkoutEnabled=false`, the public projection must not expose actionable or stronger-than-readiness states.

Forbidden as actionable current public truth while checkout is disabled:
- `PREORDER`;
- `OPEN` / `OPEN ITEMS`;
- checkout/order CTA;
- any wording implying the item can currently be bought or ordered.

Raw `sales_state` may remain source data but may not directly become public commercial truth.

Raw `sold_out` must not be presented as a confirmed historical sales result unless a canonical source separately confirms that historical fact.

Safe readiness-limited public state for the current configuration is `NOT OPEN / CHECKOUT DISABLED` (or an equivalent existing neutral non-actionable rendering that is no stronger than readiness).

## Object 001

- `EUR 220` must disappear from every client-visible current fallback.
- Canonical current price is `EUR 520`.
- JS/runtime failure must not expose a contradictory price or sale state.
- If showing a price before canonical runtime would create a truth risk, hiding/neutralizing the static price is preferred over a stale or speculative fallback.

## Architecture constraints

Do not create:
- a new commerce ontology;
- a second Merch config;
- a new database table;
- checkout/payment implementation;
- preorder backend;
- a parallel commerce state machine.

Fix canonical owners.

No DB/Supabase migration is authorized by this Result.

## Validation

Minimum evidence:
1. normal runtime load;
2. JS/runtime failure or pre-runtime HTML;
3. `checkoutEnabled=false + source PREORDER`;
4. `checkoutEnabled=false + source SOLD OUT`;
5. Object 001 current price/fallback;
6. desktop/mobile public Merch and Object 001;
7. route integrity;
8. full Site Integrity on exact candidate head.

The existing release validator should be extended where possible rather than creating a parallel QA system.

## Acceptance criteria

- `EUR 220` never appears as current public Object 001 price;
- checkout disabled never produces actionable preorder/open state;
- public state is never stronger than commerce readiness;
- JS failure/pre-runtime HTML exposes no stale commercial truth;
- raw `sales_state` is not directly equivalent to public commercial truth;
- Object 001 canonical current price remains `EUR 520` where price is intentionally rendered;
- no DB/payment/Membership changes;
- full CI passes on the exact candidate head;
- production merge and deploy remain separately authorized operations.

## Explicit non-goals

- enabling sales;
- choosing a payment provider;
- implementing checkout;
- launching preorder;
- ThingProjection Runtime / Phase 3;
- Board changes;
- Membership changes;
- Contribution semantics.

## Release boundary

`implementationStartAuthorized=true`  
`productionMergeAuthorized=false`  
`productionDeployAuthorized=false`

`commit ≠ merge ≠ deploy`.
