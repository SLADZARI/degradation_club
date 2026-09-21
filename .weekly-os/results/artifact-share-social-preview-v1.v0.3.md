---
artifactId: dementor-club.result.artifact-share-social-preview-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.3
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
productionDeployAuthorized: false
---

# MP | Dementor Club | RELEASE | Artifact Share Social Preview v1 | Result v0.3

## Status

**ACTIVE / G7_RELEASE — MERGED TO PRODUCTION / PAGES DEPLOY NOT YET RUN**

Validated candidate:

`e51d4bee5b5722bc419f8dd78e0012e8a5ab1907`

PR:

`#233 · MERGED`

New production:

`440ebce65efc46831a5736fc74a9bf798bf991d5`

## Exact delta

Old production:

`692c87da4a15a986861c18d41fc9861aa1cb08f6`

New production:

`440ebce65efc46831a5736fc74a9bf798bf991d5`

Exact five files:

1. `assets/social/dementor-artifact-share-v1-20260921.png`
2. `scripts/social-head-v1.mjs`
3. `scripts/validate-board-deeplink-auth-return-browser.mjs`
4. `scripts/validate-board-deeplink-auth-return-contract.mjs`
5. `share/artifact/index.html`

Candidate → production content diff:

`0 files`

## Validation

`Site Integrity / Release Readiness #1230 / 35648978456 · SUCCESS`

## Backend

`Supabase deploy = NOT REQUIRED / NOT RUN`

## Evidence

`operations/ARTIFACT_SHARE_SOCIAL_PREVIEW_G7_MERGE_2026-09-21.md`

## Gate

```text
production merge         PASS
exact candidate identity PASS
exact 5-file delta       PASS
Pages deployment         NOT YET
live/fresh preview test  NOT YET
```

Remain at G7_RELEASE until Pages deployment and live/fresh-preview evidence are recorded.

STAB-05 is not started.
