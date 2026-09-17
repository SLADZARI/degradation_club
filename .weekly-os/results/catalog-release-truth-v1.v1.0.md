---
artifactId: dementor-club.result.catalog-release-truth-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G8_CLEANUP
status: APPROVED
version: 1.0
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
productionDeployRun: 121
productionDeployRunId: 35278971579
pagesArtifactId: 10521498813
pagesArtifactDigest: sha256:4952c20758f58244ce8c0fe0da1506e1d07f155202f9e4a3aa8c1806eea095d4
productionDeployStatus: SUCCESS
liveRetest: PASS_LIVE_CATALOG_RELEASE_TRUTH
activationAuthorized: true
implementationStartAuthorized: true
productionMergeAuthorized: true
productionDeployAuthorized: true
liveDatabaseMutationAuthorized: false
---

# Catalog / Release Truth v1

**STATUS: APPROVED / RELEASED / LIVE RETEST PASS / G8 CLOSED**

## Goal

Remove stale-truth behavior from the public Catalog and production release-status documentation without creating a universal registry, second Product authority, or new deployment-status owner.

## Released boundary

- Catalog no longer exposes hard volatile global/category counts as current truth.
- Catalog rows identify source/provenance rather than reasserting lifecycle/readiness.
- Projects retain project-specific source ownership; `DEMENTOR LAB` navigation does not depend on a `dc_entities` row.
- `.github/production-release.txt` is explicitly non-authoritative and points to successful GitHub Actions deployment evidence.
- CI guards these boundaries against regression.

## Evidence

- G6: `operations/CATALOG_RELEASE_TRUTH_G6_2026-09-17.md`
- G7 RC: `operations/CATALOG_RELEASE_TRUTH_G7_RELEASE_CANDIDATE_2026-09-17.md`
- G7 merge: `operations/CATALOG_RELEASE_TRUTH_G7_MERGE_2026-09-17.md`
- Pages release: `operations/CATALOG_RELEASE_TRUTH_PAGES_RELEASE_2026-09-17.md`
- live retest: `operations/CATALOG_RELEASE_TRUTH_LIVE_RETEST_2026-09-17.md`
- G8 cleanup: `operations/CATALOG_RELEASE_TRUTH_G8_2026-09-17.md`

## Final boundary

#202 is closed. No next runtime Result is activated by this document. #214 remains semantic authority without runtime implementation authorization.
