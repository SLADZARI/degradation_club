---
artifactId: dementor-club.operations.catalog-release-truth-g6-2026-09-17
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.catalog-release-truth-v1
issue: 202
candidateCommit: e24c3811803b4bf6443f54a30bd9c15495cd54d1
integrationPullRequest: 222
validationRun: 1202
validationRunId: 35274121432
validationAttempt: 2
validationConclusion: SUCCESS
productionBaseCommit: 23d4266a4009d34042b29ec1fb73fb0cbad6b62e
---

# Catalog / Release Truth v1 — G6 validation evidence

## Verdict

**PASS / G6 VALIDATION** for candidate `e24c3811803b4bf6443f54a30bd9c15495cd54d1`.

This evidence authorizes progression to a clean G7 release candidate. It does **not** authorize production merge or deployment.

## Exact candidate scope

Compared with production baseline `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`, the Result changes exactly four files:

- `.github/production-release.txt`;
- `.github/workflows/site-integrity.yml`;
- `catalog/index.html`;
- `scripts/validate-catalog-release-truth-v1.mjs`.

No auth, membership, Board, database, #199, #204 or #214 runtime files are changed.

## #202 acceptance evidence

The dedicated `Validate Catalog and release truth contract` step passed and proves:

- hard global/category Catalog counts are absent;
- Catalog rows expose provenance/source labels rather than asserting lifecycle/readiness state;
- project-specific public routes include `DEMENTOR LAB` independently of `dc_entities` presence;
- `.github/production-release.txt` declares itself `NON_AUTHORITATIVE_REFERENCE`;
- current deployment truth points to the latest successful authorized GitHub Actions deployment rather than the text snapshot.

The production candidate build also passed canonical metadata generation and the normal release-readiness contract.

## Full regression evidence

PR #222 (`result/catalog-release-truth-v1` → `dementor-club-site`) ran Site Integrity / Release Readiness run `35274121432` / run #1202.

Attempt 1 reached the WebKit auth regression step after all preceding #202/build/browser checks had passed, then failed because the synthetic PKCE scenario remained at `/workspace/` instead of reaching `/workspace/board/` within the test timeout.

The same WebKit test had passed on the immediately preceding reconciled staging baseline in run `35265865615`. No #202 file touches auth or Workspace routing. The failed job was therefore rerun without any code mutation.

Attempt 2 on the **same candidate commit** completed with `SUCCESS`, including:

- Catalog/release truth contract;
- production candidate build;
- Google OAuth handoff;
- full Chromium/WebKit browser regression matrix;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

The non-reproducing attempt-1 WebKit failure is recorded as CI flake evidence, not hidden or rewritten as a product pass.

## Gate boundary

G6 is satisfied. Next permitted step is a clean release candidate from the current production baseline containing only the reviewed #202 diff, followed by full CI.

Production merge remains unauthorized. Production deploy remains unauthorized.
