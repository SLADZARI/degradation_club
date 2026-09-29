---
artifactId: dementor-club.result.artifact-collaboration-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
workStatus: ACTIVE
version: 1.14
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 1.13
parentDecision: dementor-club.decision.artifact-collaboration-v1
integrationBranch: result/artifact-collaboration-v1-live-ux-corrective-r2
integrationBaseRef: dementor-club-production
integrationBaseCommit: fd184be3306911c4ddb6acbcb77acdd977ea84f8
productionBaseCommit: fd184be3306911c4ddb6acbcb77acdd977ea84f8
implementationStartAuthorized: true
schemaMutationAuthorized: false
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: true
productionDeployAuthorized: true
pagesProductionDeployAuthorized: true
costBoundary: NO_PAID_INFRASTRUCTURE
correctiveQa: BQA-24,BQA-25,BQA-26,BQA-28
qaReconciliation: operations/QA_RECONCILIATION_2026-09-28.md
validatedCandidate: c402783924b5393cba5c9ab572576ca29bb4b0c0
g6Status: PASS
g6Evidence: operations/ARTIFACT_COLLABORATION_LIVE_UX_CORRECTIVE_R2_G6_2026-09-29.md
g6ValidationRun: 1325
g6ValidationRunId: 36585332043
releaseBranch: release/artifact-collaboration-v1-live-ux-corrective-r2
releaseCandidateCommit: 49a545c68f63248c60b0591176a016f07e559e76
releaseCandidateTree: c525d2467247253a48ac0b3dbe14d8f9382278c4
releasePullRequest: 249
g7Status: PASS
g7Evidence: operations/ARTIFACT_COLLABORATION_LIVE_UX_CORRECTIVE_R2_G7_RELEASE_CANDIDATE_2026-09-29.md
g7ValidationRun: 1326
g7ValidationRunId: 36586121661
productionCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
productionTree: c525d2467247253a48ac0b3dbe14d8f9382278c4
productionMergeStatus: COMPLETE
pagesDeployStatus: PASS
pagesDeployRun: 137
pagesDeployRunId: 36598659696
pagesArtifactId: 11047841976
pagesArtifactDigest: sha256:bdeca55650b9dcd1b6254b7d363433494cb8679cceb5fd8c7903c1f432cb5376
backendDeployStatus: NOT_REQUIRED
liveAcceptanceStatus: PENDING
gateReadiness: LIVE_ACCEPTANCE_PENDING
productionDeployEvidence: operations/ARTIFACT_COLLABORATION_LIVE_UX_CORRECTIVE_R2_PRODUCTION_DEPLOY_2026-09-29.md
---

# Artifact Collaboration v1 · Result v1.14

## Current state

Exact production SHA has been deployed successfully through the canonical Pages workflow.

```text
production SHA   a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
production tree  c525d2467247253a48ac0b3dbe14d8f9382278c4
Pages            #137 / 36598659696 · SUCCESS
backend           NOT REQUIRED
Supabase          NOT REQUIRED
```

All pre-release exact-head validation remains PASS.

## Final acceptance boundary

Production is deployed, but G8 is intentionally not closed until owner live acceptance proves the four CJM/JTBD jobs:

- BQA-24 invitation is discoverable and opens the exact invited Idea;
- BQA-25 join action is primary and JOINED becomes compact `ВЫ В ДЕЛЕ`;
- BQA-26 leave/removal semantics are deliberate and unambiguous;
- BQA-28 roster state refreshes canonically without manual reload.

```text
G6                PASS
G7 clean RC       PASS
production merge  PASS
Pages deploy      PASS
live acceptance   PENDING
G8                NOT AUTHORIZED
```
