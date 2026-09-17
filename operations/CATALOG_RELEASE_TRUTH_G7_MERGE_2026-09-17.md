---
artifactId: dementor-club.operations.catalog-release-truth-g7-merge-2026-09-17
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS_PRODUCTION_MERGED_DEPLOY_LOCKED
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.catalog-release-truth-v1
---

# Catalog / Release Truth v1 — G7 production merge evidence

Owner explicitly authorized only production merge of PR #223 at unchanged head `e24c3811803b4bf6443f54a30bd9c15495cd54d1`. Production deploy remained unauthorized.

## Validated RC
- baseline: `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`
- RC: `e24c3811803b4bf6443f54a30bd9c15495cd54d1`
- PR: #223
- production-target Site Integrity: run `35275186704` / #1204 — SUCCESS

## Production merge
- resulting production commit: `2dae3b6ece79652c81af780c049521fda7262726`
- parent 1: `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`
- parent 2: `e24c3811803b4bf6443f54a30bd9c15495cd54d1`
- compare from prior production: `behind_by=0`
- changed files exactly four:
  - `.github/production-release.txt`
  - `.github/workflows/site-integrity.yml`
  - `catalog/index.html`
  - `scripts/validate-catalog-release-truth-v1.mjs`

## Deploy guard
No `Deploy Dementor Production` run exists for `2dae3b6ece79652c81af780c049521fda7262726`. Latest deploy remains manual `workflow_dispatch` run `35259685738` on `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`.

- production merge: COMPLETE
- production deploy authorization: FALSE
- production deploy: NOT RUN
- live retest: NOT RUN
- G8 cleanup: NOT STARTED
- next runtime Result: NOT STARTED

`MERGE ≠ DEPLOY AUTHORIZATION ≠ DEPLOY ≠ LIVE RETEST ≠ G8`
