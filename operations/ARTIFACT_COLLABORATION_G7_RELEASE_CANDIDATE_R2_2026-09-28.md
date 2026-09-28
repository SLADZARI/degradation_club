---
artifactId: dementor-club.operations.artifact-collaboration-g7-release-candidate-r2-2026-09-28
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS_CLEAN_RC_VALIDATED
version: 1.0
updated: 2026-09-28
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
productionBaseCommit: df8a24eca2bcca25339f128c7da93982515cf442
validatedCandidate: bee577a93de26952927d2e9cdca60f7aad425b0d
releaseBranch: release/artifact-collaboration-v1-r2
releaseCandidateCommit: f3078ceb227a0221b99b4e286f783986a33aea6f
pullRequest: 244
validationRun: 1313
validationRunId: 36429691568
validationConclusion: SUCCESS
liveDatabaseMutation: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# Artifact Collaboration v1 — G7 clean release candidate r2

## Current state

**G7 CLEAN RC PASS**

**READY FOR RELEASE DECISION**

Production baseline:

`df8a24eca2bcca25339f128c7da93982515cf442`

Corrected G6 candidate:

`bee577a93de26952927d2e9cdca60f7aad425b0d`

Fresh release branch:

`release/artifact-collaboration-v1-r2`

Exact clean RC r2:

`f3078ceb227a0221b99b4e286f783986a33aea6f`

Draft production-target PR:

`#244`

## Clean topology

The release branch was created directly from the exact production baseline. The integration branch was not merged, rebased or cherry-picked into production.

```text
parent        df8a24eca2bcca25339f128c7da93982515cf442
ahead_by      1
behind_by     0
commits       1
changed_files 31
```

The RC tree is exactly identical to the corrected G6 candidate tree:

```text
tree = 0266507dfb7d185dfb75c30d5edc5b818e68bf20
```

Therefore the release candidate contains the exact corrected Result delta already validated at G6.

## Historical blocked RC

The previous blocked release surface remains unchanged:

```text
old RC   030d7fece9dee1b8502bde6ac89bef95dbdfeda7
old PR   #243
state    historical blocked / unmerged
```

It is not the active release candidate.

## Exact-head validation

Canonical workflow:

`Site Integrity / Release Readiness`

Current run:

```text
#1313 / 36429691568
head SHA = f3078ceb227a0221b99b4e286f783986a33aea6f
result = SUCCESS
```

Exact-head validation completed successfully. This evidence still does not authorize live Supabase apply, production merge or production deploy.

## Boundary

```text
LIVE SUPABASE APPLY = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
```

This clean RC and draft PR are validation surfaces only.
