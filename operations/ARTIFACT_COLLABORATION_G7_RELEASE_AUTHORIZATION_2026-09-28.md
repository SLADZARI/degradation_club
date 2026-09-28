---
artifactId: dementor-club.operations.artifact-collaboration-g7-release-authorization-2026-09-28
project: dementor-club
documentType: RELEASE_AUTHORIZATION
projectStage: RELEASE
gate: G7_RELEASE
status: AUTHORIZED
version: 1.0
updated: 2026-09-28
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: OWNER_AUTHORIZATION
result: dementor-club.result.artifact-collaboration-v1
releaseCandidateCommit: f3078ceb227a0221b99b4e286f783986a33aea6f
releasePullRequest: 244
productionBaseCommit: df8a24eca2bcca25339f128c7da93982515cf442
---

# Artifact Collaboration v1 — owner release authorization

Owner release authorization received after G7 CLEAN RC PASS.

Authorized exact release surface:

```text
RC  f3078ceb227a0221b99b4e286f783986a33aea6f
PR  #244
base df8a24eca2bcca25339f128c7da93982515cf442
```

Authorized actions:

```text
productionMergeAuthorized = true
liveDatabaseMutationAuthorized = true
backendProductionDeployAuthorized = true
pagesProductionDeployAuthorized = true
productionDeployAuthorized = true
telegramWorkerDeployAuthorized = false
```

Execution must stay on canonical release mechanisms only. No ad-hoc production writes.

Any release failure stops the release path before corrective mutation.
