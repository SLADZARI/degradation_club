---
artifactId: dementor-club.result.commerce-truth-guard-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G6_VALIDATION
status: ACTIVE
version: 0.2
supersedes: 0.1
updated: 2026-09-16
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
branch: result/commerce-truth-guard-v1
baseline: dementor-club-production@88a5efdb92a7a30678c5fcc74f02de7886c46d65
candidateCommit: c8bb64c2045caee634a9c5600e2d9355b2756129
pullRequest: 215
validationRun: 1196
validationRunId: 35093437784
validationConclusion: SUCCESS
g6Evidence: operations/COMMERCE_TRUTH_GUARD_G6_2026-09-16.md
issue: 198
implementationStartAuthorized: true
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# Dementor Club · Commerce Truth Guard v1

## Current Gate

**G6 VALIDATION PASS / G7 CANDIDATE**

Candidate:
`c8bb64c2045caee634a9c5600e2d9355b2756129`

PR:
`#215`

Full Site Integrity:
`#1196 / 35093437784 / SUCCESS`

G6 evidence:
`operations/COMMERCE_TRUTH_GUARD_G6_2026-09-16.md`

Production remains unchanged at:
`dementor-club-production@88a5efdb92a7a30678c5fcc74f02de7886c46d65`

## Goal

Eliminate the factual conflict between real commerce readiness and the public Merch projection before advertising readiness work proceeds.

Canonical invariant:

**PUBLIC PROMISE MUST NEVER BE STRONGER THAN CURRENT COMMERCE READINESS.**

This Result resolves GitHub issue #198 only. It does not activate commerce.

## Validated implementation

Existing owners were extended rather than duplicated:

- `site-config.js` remains the canonical commerce-readiness owner;
- `merch-runtime-v1.js` derives public commerce state from source state + readiness;
- Object 001 pre-runtime HTML fails closed instead of exposing stale price/state;
- the existing production release validator enforces the truth guard;
- a focused browser acceptance is part of the existing Site Integrity workflow.

Current source/readiness projection validated at G6:

- raw `preorder` + checkout disabled → public `NOT OPEN`;
- raw `available` + checkout disabled → public `NOT OPEN`;
- raw `sold_out` without separately approved historical sales evidence → public `NOT OPEN`;
- Object 001 runtime price → canonical `€520`;
- runtime failure → `PRICE UNAVAILABLE / NOT OPEN`;
- no stale `EUR 220 / €220`;
- no actionable order/checkout control while checkout is disabled.

## Source confirmation

Read-only Supabase validation confirmed:

- `DC-OBJECT-001 = EUR 520 / raw preorder`;
- `SH-DEM-01 = raw sold_out`.

No database write or schema change was performed.

## Acceptance criteria status

- `EUR 220` never appears as current public Object 001 price — **PASS**;
- checkout disabled never produces actionable preorder/open state — **PASS**;
- public state is never stronger than commerce readiness — **PASS**;
- JS/runtime failure exposes no stale commercial truth — **PASS**;
- raw `sales_state` is not directly equivalent to public commercial truth — **PASS**;
- Object 001 current runtime price remains `EUR 520` — **PASS**;
- no DB/payment/Membership changes — **PASS**;
- full CI on exact candidate/baseline merge ref — **PASS**;
- production merge/deploy remain separate authorization operations — **PRESERVED**.

## Explicit non-goals preserved

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

The Result may advance to G7 only after explicit production merge authorization.

**G6 PASS ≠ merge ≠ deploy ≠ live G8 closure.**
