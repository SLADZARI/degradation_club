---
artifactId: dementor-club.result.commerce-truth-guard-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.3
supersedes: 0.2
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
productionCommit: 0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4
productionAncestryVerified: true
g7MergeEvidence: operations/COMMERCE_TRUTH_GUARD_G7_MERGE_2026-09-16.md
issue: 198
implementationStartAuthorized: true
productionMergeAuthorized: true
productionDeployAuthorized: false
---

# Dementor Club · Commerce Truth Guard v1

## Current Gate

**G7 RELEASE / PRODUCTION MERGED / DEPLOY LOCKED**

Validated candidate:
`c8bb64c2045caee634a9c5600e2d9355b2756129`

PR:
`#215`

G6:
`#1196 / 35093437784 / SUCCESS`

Production merge commit:
`0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`

G7 evidence:
`operations/COMMERCE_TRUTH_GUARD_G7_MERGE_2026-09-16.md`

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
- focused browser acceptance is part of the existing Site Integrity workflow.

Validated projection:

- raw `preorder` + checkout disabled → public `NOT OPEN`;
- raw `available` + checkout disabled → public `NOT OPEN`;
- raw `sold_out` without separately approved historical sales evidence → public `NOT OPEN`;
- Object 001 runtime price → canonical `€520`;
- runtime failure → `PRICE UNAVAILABLE / NOT OPEN`;
- no stale `EUR 220 / €220`;
- no actionable order/checkout control while checkout is disabled.

## Release state

The exact G6 candidate was merged to production with an expected-head lock.

Ancestry is verified:

`88a5efdb... + c8bb64c2... → 0e13e2d1...`

No automatic deploy was observed immediately after merge.

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
`productionMergeAuthorized=true`  
`productionDeployAuthorized=false`

Next allowed transition requires separate owner authorization to deploy production commit `0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`, followed by deploy evidence, live public Merch retest and G8 cleanup.

**MERGE ≠ DEPLOY ≠ LIVE G8 CLOSURE.**
