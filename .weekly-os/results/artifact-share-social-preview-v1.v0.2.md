---
artifactId: dementor-club.result.artifact-share-social-preview-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.2
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
releaseCandidateCommit: e51d4bee5b5722bc419f8dd78e0012e8a5ab1907
integrationPullRequest: 233
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | RELEASE | Artifact Share Social Preview v1 | Result v0.2

## Goal

Make Artifact share transport expose a stable public-safe 1200×630 social preview without exposing private Artifact media or body content.

Parent: #228 — STABILIZATION.

Scope: STAB-04 / BQA-14 only.

## Status

**ACTIVE / G7_RELEASE — VALIDATED CANDIDATE / READY FOR RELEASE DECISION**

## Production baseline

`dementor-club-production@692c87da4a15a986861c18d41fc9861aa1cb08f6`

Integration branch:

`result/artifact-share-social-preview-v1`

Validated candidate:

`e51d4bee5b5722bc419f8dd78e0012e8a5ab1907`

Draft PR:

`#233`

## Corrective

Canonical owner remains:

`scripts/social-head-v1.mjs`

Dedicated public-safe asset:

`assets/social/dementor-artifact-share-v1-20260921.png`

Built `/share/artifact/` now uses that versioned URL and validates:

- binary 1200×630;
- complete raster/container;
- binary MIME = declared OG MIME;
- OG dimensions = binary dimensions;
- `twitter:image == og:image`;
- no private Artifact media/Storage/signed URL leakage.

Raw `share/artifact/index.html` is source-aligned, but no second OG owner was created.

Existing share/deeplink static and browser validators were extended.

## G6

Evidence:

`operations/ARTIFACT_SHARE_SOCIAL_PREVIEW_G6_2026-09-21.md`

Canonical CI:

```text
runNumber = 1230
runId = 35648978456
headSha = e51d4bee5b5722bc419f8dd78e0012e8a5ab1907
conclusion = SUCCESS
```

Key built-artifact evidence:

```text
Canonical social metadata PASS
production candidate build PASS
fresh built share URL + dedicated public-safe 1200x630 PNG PASS
Board deep-link auth-return browser PASS
production route manifest PASS
production artifact release gate PASS
```

## G7 release candidate

Evidence:

`operations/ARTIFACT_SHARE_SOCIAL_PREVIEW_G7_RELEASE_CANDIDATE_2026-09-21.md`

Production remained exactly:

`692c87da4a15a986861c18d41fc9861aa1cb08f6`

Production → candidate:

```text
ahead = 5
behind = 0
changed files = 5
```

Exact files:

1. `assets/social/dementor-artifact-share-v1-20260921.png`
2. `scripts/social-head-v1.mjs`
3. `scripts/validate-board-deeplink-auth-return-browser.mjs`
4. `scripts/validate-board-deeplink-auth-return-contract.mjs`
5. `share/artifact/index.html`

## Change control

```text
schema mutation = NO
semantic mutation = NO
Change Proposal = NO
backendProductionDeployRequired = false
liveDatabaseMutationRequired = false
```

Not changed:

- `dc_artifact_media`;
- private bucket;
- Storage RLS;
- Artifact schema;
- Board Relations;
- Artifact detail;
- Membership;
- Contribution.

## Gate

`G7_RELEASE`

```text
productionMergeAuthorized = false
productionDeployAuthorized = false
gateReadiness = READY_FOR_RELEASE_DECISION
```

PR #233 remains DRAFT / UNMERGED.

STOP at validated candidate.

STAB-05 is not started.
