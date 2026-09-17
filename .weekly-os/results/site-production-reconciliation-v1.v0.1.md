---
artifactId: dementor-club.result.site-production-reconciliation-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
status: ACTIVE
version: 0.1
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
gate: G5_BUILD
issue: 221
integrationBranch: result/site-production-reconciliation-v1
productionBaseCommit: 23d4266a4009d34042b29ec1fb73fb0cbad6b62e
stagingHeadBefore: 919dbe7bfedc8bd97072db5d0716c29fd1a9a2ab
mergeBaseBefore: 8194f580b7fd26bc748e0c0a8514119d7764a7e5
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# Site / Production Reconciliation v1

**STATUS: ACTIVE / G5 BUILD**

## Goal

Restore `dementor-club-site` as a trustworthy development/staging baseline using current production as the runtime baseline, without blind-merging the historical divergent branch.

## Problem

At activation:

- production = `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`;
- staging = `919dbe7bfedc8bd97072db5d0716c29fd1a9a2ab`;
- merge base = `8194f580b7fd26bc748e0c0a8514119d7764a7e5`;
- staging is 397 commits ahead and 783 commits behind production;
- staging head dates to 2026-08-29.

The existing PR #21 is therefore evidence of divergence, not an authorized merge plan.

## Method

`PRODUCTION BASELINE → STAGING-ONLY INVENTORY → CLASSIFICATION → CLEAN RECONCILIATION CANDIDATE → G6 → STAGING REALIGNMENT`

Every staging-only delta must be classified as one of:

- `PRESERVE` — still has a current owner or demonstrated development/staging purpose;
- `SUPERSEDED` — current production contains a newer canonical implementation;
- `OBSOLETE` — dead/legacy/test residue with no current owner;
- `DECISION_REQUIRED` — meaning cannot be resolved without semantic/product decision.

No file survives merely because it exists on the old staging branch.

## Acceptance Criteria

1. Production remains unchanged throughout the Result.
2. No semantic meaning is changed without existing authority or a separate Decision.
3. No legacy auth, Board, DC-9, shell, Catalog, release or QA mechanism is revived by branch ancestry alone.
4. Every retained staging-only delta has evidence for retention.
5. Clean candidate starts from current production ancestry and contains only `PRESERVE` deltas.
6. Full exact-head Site Integrity and relevant browser/route/auth regression pass on the clean candidate.
7. `dementor-club-site` is realigned to the validated candidate, not merged blindly with PR #21.
8. PR #21 is retired only after replacement evidence exists.
9. End state has a comprehensible staging → production release path again.

## Explicit non-goals

- no Product/Board/Contribution semantic changes;
- no implementation of #199, #200, #202, #204 or #214;
- no DB/Supabase migration;
- no production merge;
- no production deploy;
- no new generic QA/release platform.

## Affected domain

Repository topology, staging branch lineage, release/readiness workflows, dev-only staging assets where evidence proves they are still required.

## G6 evidence required

- exact before/after topology;
- reconciliation inventory and classification;
- exact retained delta list;
- full Site Integrity on reconciled candidate;
- route/auth/shell/browser regression;
- proof production SHA did not move;
- proof no duplicate runtime owner was reintroduced.

## Gate

Current: **G5 BUILD**.

Do not realign `dementor-club-site` until clean candidate and G6 evidence exist.
