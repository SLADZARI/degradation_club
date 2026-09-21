---
artifactId: dementor-club.result.artifact-share-social-preview-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.4
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 228
scope:
  - STAB-04
  - BQA-14
integrationBranch: result/artifact-share-social-preview-v1
productionBaseCommit: 692c87da4a15a986861c18d41fc9861aa1cb08f6
candidateCommit: e51d4bee5b5722bc419f8dd78e0012e8a5ab1907
productionCommit: 440ebce65efc46831a5736fc74a9bf798bf991d5
integrationPullRequest: 233
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: true
productionDeployAuthorized: true
---

# MP | Dementor Club | RELEASE | Artifact Share Social Preview v1 | Result v0.4

## Status

**ACTIVE / G7_RELEASE — PAGES DEPLOYED / LIVE FRESH-PREVIEW RETEST PENDING**

Production:

`440ebce65efc46831a5736fc74a9bf798bf991d5`

Pages:

```text
Deploy Dementor Production #126
run id = 35658317210
head SHA = 440ebce65efc46831a5736fc74a9bf798bf991d5
build = SUCCESS
deploy = SUCCESS
```

Supabase:

`NOT REQUIRED / NOT RUN`

## Evidence

- `operations/ARTIFACT_SHARE_SOCIAL_PREVIEW_G6_2026-09-21.md`
- `operations/ARTIFACT_SHARE_SOCIAL_PREVIEW_G7_RELEASE_CANDIDATE_2026-09-21.md`
- `operations/ARTIFACT_SHARE_SOCIAL_PREVIEW_G7_MERGE_2026-09-21.md`
- `operations/ARTIFACT_SHARE_SOCIAL_PREVIEW_PAGES_RELEASE_2026-09-21.md`

## Remaining acceptance

Need external live/fresh-preview evidence for:

- live `/share/artifact/` OG head;
- dedicated versioned public raster;
- intrinsic 1200×630;
- MIME;
- `twitter:image == og:image`;
- no private Artifact media leakage;
- human share redirect to exact Board focus.

Do not move to WAITING/G8 until that evidence exists.

STAB-05 remains not started.
