---
artifactId: dementor-club.result.commerce-truth-guard-v1
project: dementor-club
documentType: RESULT
projectStage: CLEANUP
gate: G8_CLEANUP
status: APPROVED
version: 1.0
supersedes: .weekly-os/results/commerce-truth-guard-v1.v0.3.md
updated: 2026-09-16
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
branch: null
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
productionDeployAuthorized: true
productionDeployRun: 87
productionDeployRunId: 35102436561
pagesArtifactId: 10448339424
pagesArtifactDigest: sha256:a86bae8679a72d7abb476217da785061f55ec77615f408dc4917d55402ab5e08
productionDeployStatus: SUCCESS
liveRetest: PASS_OWNER_MERCH_2026-09-16
g8Evidence: operations/COMMERCE_TRUTH_GUARD_G8_2026-09-16.md
issue: 198
---

# Dementor Club · Commerce Truth Guard v1

## Status

**APPROVED / RELEASED / LIVE-VALIDATED / G8 CLOSED**

Evidence:
`operations/COMMERCE_TRUTH_GUARD_G8_2026-09-16.md`

Issue:
`#198 · P0 · Gate public Merch state by commerce readiness`

## Proven invariant

**PUBLIC PROMISE MUST NEVER BE STRONGER THAN CURRENT COMMERCE READINESS.**

Public commerce truth is now derived from:

`ITEM / SOURCE STATE + COMMERCE READINESS → PUBLIC COMMERCE STATE`

Raw source `sales_state` does not directly become an actionable public commercial claim.

## Released behavior

- `checkoutEnabled=false` prevents actionable `PREORDER` / `OPEN` commerce projection;
- raw `sold_out` without separately approved historical-sales evidence does not become a confirmed public sold-out claim;
- Object 001 stale EUR 220 client-visible fallback is removed;
- Object 001 runtime price resolves to canonical EUR 520 source truth;
- runtime/pre-runtime failure fails closed rather than exposing stale commercial truth;
- no order/checkout CTA is exposed while commerce readiness is disabled.

## Release evidence

G6 exact candidate:
`c8bb64c2045caee634a9c5600e2d9355b2756129`

Site Integrity:
- #1196;
- run `35093437784`;
- SUCCESS.

Production merge:
- PR #215;
- production commit `0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`;
- ancestry verified from `88a5efdb92a7a30678c5fcc74f02de7886c46d65` + exact candidate `c8bb64c2045caee634a9c5600e2d9355b2756129`.

Production deploy:
- Deploy Dementor Production #87;
- run `35102436561`;
- exact production checkout `0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`;
- Pages artifact `10448339424`;
- digest `sha256:a86bae8679a72d7abb476217da785061f55ec77615f408dc4917d55402ab5e08`;
- SUCCESS.

Owner live Merch retest:
`PASS_OWNER_MERCH_2026-09-16`

## Canonical ownership preserved

- `site-config.js` remains commerce-readiness owner;
- `merch-runtime-v1.js` remains public Merch projection owner;
- existing production release validation owns the truth guard;
- no second commerce config, ontology, state machine or table was created.

## Explicit non-goals preserved

No sales activation, payment provider, checkout, preorder backend, DB/schema mutation, Membership, Board, Contribution or ThingProjection Runtime change occurred in this Result.

## Cleanup

No temporary runtime layer or compatibility owner was introduced, so G8 requires governance retirement only:

- retire this Result from `currentResult`;
- clear active integration/release ownership;
- retain G6/G7/G8 evidence;
- close issue #198 as completed;
- leave unrelated WAITING Results unchanged;
- leave `APPROVED_STATE.json` unchanged.

## Handoff

The next P0 candidate is **#201 Evidence Hygiene**. It is a separate Result because evidence classification/measurement is a different responsibility from commerce truth projection.

ThingProjection Runtime / Phase 3 remains separate and is not approved by this closure.
