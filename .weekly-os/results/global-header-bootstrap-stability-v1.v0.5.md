---
artifactId: dementor-club.result.global-header-bootstrap-stability-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
workStatus: ACTIVE
version: 0.5
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.4
integrationBranch: result/global-header-bootstrap-stability-v1
integrationBaseRef: dementor-club-production
integrationBaseCommit: 260c5fe911fb0cad9902ad2db5d76060f47c18cc
productionBaseCommit: 260c5fe911fb0cad9902ad2db5d76060f47c18cc
implementationStartAuthorized: true
schemaMutationAuthorized: false
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: true
productionDeployAuthorized: true
pagesProductionDeployAuthorized: true
backendDeployRequired: false
candidateCommit: b0d9be502de1533c42530af55cde2b4dd692abf4
g6Status: PASS
g6Evidence: operations/GLOBAL_HEADER_BOOTSTRAP_STABILITY_G6_2026-09-29.md
g6ValidationRun1: 1322
g6ValidationRunId1: 36565735746
g6ValidationRun2: 1323
g6ValidationRunId2: 36566203814
releaseBranch: release/global-header-bootstrap-stability-v1
releaseCandidateCommit: cdd6c4aa962f95f560d9fd9936944d623d005fca
releaseCandidateTree: 7c9c4a749a80c6ecb69f314565cf36300af868d0
releasePullRequest: 247
g7Status: PASS
g7Evidence: operations/GLOBAL_HEADER_BOOTSTRAP_STABILITY_G7_RELEASE_CANDIDATE_2026-09-29.md
g7ValidationRun: 1324
g7ValidationRunId: 36572884226
g7ValidationConclusion: SUCCESS
productionCommit: fd184be3306911c4ddb6acbcb77acdd977ea84f8
productionTree: 7c9c4a749a80c6ecb69f314565cf36300af868d0
productionMergeStatus: COMPLETE
pagesDeployStatus: PASS
pagesDeployRun: 136
pagesDeployRunId: 36580299418
pagesArtifactId: 11039012286
pagesArtifactDigest: sha256:de2d2db18a9c32f32d545f48c49f48bf4a827751782a89440c41bba05e4cd656
backendDeployStatus: NOT_REQUIRED
deployedArtifactBrowserSmokeStatus: PASS
liveDomainSmokeStatus: PENDING_EXTERNAL_OBSERVATION
gateReadiness: LIVE_DOMAIN_ACCEPTANCE_PENDING
releaseCheckpointEvidence: operations/GLOBAL_HEADER_BOOTSTRAP_STABILITY_PRODUCTION_RELEASE_CHECKPOINT_2026-09-29.md
productionDeployEvidence: operations/GLOBAL_HEADER_BOOTSTRAP_STABILITY_PRODUCTION_DEPLOY_2026-09-29.md
---

# Global Header Bootstrap Stability v1 · Result v0.5

## Current state

Exact validated RC is merged and the canonical Pages production workflow has deployed the exact production SHA successfully.

```text
production SHA     fd184be3306911c4ddb6acbcb77acdd977ea84f8
production tree    7c9c4a749a80c6ecb69f314565cf36300af868d0
Pages run          #136 / 36580299418
Pages              SUCCESS
backend             NOT REQUIRED
Supabase            NOT REQUIRED
```

The exact deployed Pages artifact also passes the Header browser matrix on desktop, 390 and 360, including burger behavior and duplicate prevention.

## Gate boundary

The current tool environment cannot independently open the public `dementor.club` domain, so external live-domain observation remains pending.

This does not invalidate the production deploy. It prevents claiming final live acceptance or G8 closure without evidence.

```text
G6                           PASS
G7 clean RC                  PASS
production merge             PASS
Pages deploy                 PASS
deployed artifact browser QA PASS
external live-domain QA      PENDING
G8                           NOT AUTHORIZED
```

Artifact Collaboration remains blocked until the Header Result has live-domain acceptance and G8 cleanup.
