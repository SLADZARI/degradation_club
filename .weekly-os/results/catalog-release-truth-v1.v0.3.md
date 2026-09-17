---
artifactId: dementor-club.result.catalog-release-truth-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: DRAFT
version: 0.3
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
issue: 202
integrationBranch: result/catalog-release-truth-v1
releaseBranch: release/catalog-release-truth-v1
productionBaseCommit: 23d4266a4009d34042b29ec1fb73fb0cbad6b62e
candidateCommit: e24c3811803b4bf6443f54a30bd9c15495cd54d1
integrationPullRequest: 222
stagingMergeCommit: 61d85d95bd95dfb536acdd363b45d2773a4b2ca5
releasePullRequest: 223
validationRunId: 35274121432
releaseValidationRunId: 35275186704
validationConclusion: SUCCESS
productionCommit: 2dae3b6ece79652c81af780c049521fda7262726
activationAuthorized: true
implementationStartAuthorized: true
productionMergeAuthorized: true
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# Catalog / Release Truth v1

**STATUS: G7 RELEASE / PRODUCTION MERGED / DEPLOY LOCKED**  
**ISSUE:** #202  
**INTEGRATION BRANCH:** `result/catalog-release-truth-v1`  
**RELEASE BRANCH:** `release/catalog-release-truth-v1`  
**PRODUCTION BASELINE:** `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`  
**RC:** `e24c3811803b4bf6443f54a30bd9c15495cd54d1`  
**PRODUCTION PR:** #223

## Goal

Remove stale-truth behavior from the public Catalog and production release-status documentation without creating a universal registry, second Product authority, or new deployment-status owner.

## Implemented boundary

- Catalog no longer exposes hard volatile global/category counts as current truth.
- Catalog row state cells now identify source/provenance rather than reasserting lifecycle/readiness.
- Approved `DEMENTOR LAB` Project navigation is present independently of any `dc_entities` row.
- `.github/production-release.txt` is explicitly a non-authoritative reference pointing to GitHub Actions deployment truth.
- CI prevents these stale-truth semantics from being silently reintroduced.

## Validation evidence

- G6: `operations/CATALOG_RELEASE_TRUTH_G6_2026-09-17.md`
- Staging PR #222 merged only after successful validation; staging merge `61d85d95bd95dfb536acdd363b45d2773a4b2ca5`.
- Clean RC exact diff from production: four files, `behind_by=0`, production merge-base exact.
- G7 RC: `operations/CATALOG_RELEASE_TRUTH_G7_RELEASE_CANDIDATE_2026-09-17.md`
- Production-target PR #223 full CI run `35275186704` / #1204: SUCCESS.
- Production merge evidence: `operations/CATALOG_RELEASE_TRUTH_G7_MERGE_2026-09-17.md`.
- Production commit: `2dae3b6ece79652c81af780c049521fda7262726`; post-merge compare contains only the four approved #202 files.

## Incident note

G6 run `35274121432` attempt 1 had one non-reproducing synthetic WebKit PKCE timeout after all preceding checks had passed. The same test was green on the immediately preceding reconciled staging baseline. Attempt 2 on the exact same candidate commit, without code changes, passed the complete workflow including WebKit auth and final release guards. The first failure remains recorded as CI-flake evidence.

## Explicit non-goals / exclusions

- no universal Thing/entity registry;
- no `dc_entities` expansion for Projects;
- no #199 merch source-truth decision;
- no #204 Fuengirola eligibility decision;
- no #214 activation/contribution decision;
- no Board IA / Relations work;
- no membership/auth changes;
- no database migration.

## Current authorization boundary

`productionMergeAuthorized = true`  
`productionDeployAuthorized = false`

Production code is merged but not deployed. No live retest or G8 cleanup is claimed. No next runtime Result may start before the separate deploy gate, deploy, live retest and G8 closure of #202.
