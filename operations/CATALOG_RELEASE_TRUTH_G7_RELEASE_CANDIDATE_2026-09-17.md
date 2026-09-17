---
artifactId: dementor-club.operations.catalog-release-truth-g7-release-candidate-2026-09-17
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS_CLEAN_RC_VALIDATED
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.catalog-release-truth-v1
issue: 202
releaseBranch: release/catalog-release-truth-v1
releaseCandidateCommit: e24c3811803b4bf6443f54a30bd9c15495cd54d1
pullRequest: 223
productionBaseCommit: 23d4266a4009d34042b29ec1fb73fb0cbad6b62e
validationRun: 1204
validationRunId: 35275186704
validationConclusion: SUCCESS
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# Catalog / Release Truth v1 — G7 clean release candidate

## Verdict

**PASS_CLEAN_RC_VALIDATED**.

Release branch `release/catalog-release-truth-v1` points to candidate `e24c3811803b4bf6443f54a30bd9c15495cd54d1` and is based directly on production commit `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`.

`compare(dementor-club-production → release/catalog-release-truth-v1)` at RC creation proved:

- `behind_by = 0`;
- `ahead_by = 4` commits;
- exactly four changed files;
- merge base equals the production baseline.

This avoids any blind `dementor-club-site → dementor-club-production` merge.

## Exact RC diff

- `.github/production-release.txt` — current-status ownership removed; non-authoritative Actions pointer retained;
- `.github/workflows/site-integrity.yml` — #202 contract guard added;
- `catalog/index.html` — volatile counts/status assertions removed; source/provenance navigation retained; DEMENTOR LAB Project route included independently of `dc_entities`;
- `scripts/validate-catalog-release-truth-v1.mjs` — regression guard for the above boundary.

## Validation

Production-target PR #223 triggered Site Integrity / Release Readiness run `35275186704` / #1204 on the exact RC commit.

The complete workflow passed, including:

- #202 Catalog/release truth contract;
- production candidate build;
- canonical metadata and shell checks;
- OAuth handoff and WebKit auth regression;
- sequential browser regression matrix;
- production route manifest;
- production artifact release gate.

Conclusion: `SUCCESS`.

## Authorization boundary

The RC is validated and ready for an explicit production merge decision.

This evidence does **not** authorize production merge. It does **not** authorize production deployment.
