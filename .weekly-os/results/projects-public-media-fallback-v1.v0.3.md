---
artifactId: dementor-club.result.projects-public-media-fallback-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.3
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 228
scope:
  - STAB-05
  - BQA-21
integrationBranch: result/projects-public-media-fallback-v1
productionBaseCommit: 440ebce65efc46831a5736fc74a9bf798bf991d5
candidateCommit: 581468fbf4b2b321bd2c2a16bd9e65a9e12e3a4f
productionCommit: 4a8e95cb669dab660a7afe381e580278d4575a2a
integrationPullRequest: 234
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: true
productionDeployAuthorized: false
---

# MP | Dementor Club | RELEASE | Projects Public Media Fallback v1 | Result v0.3

## Status

**ACTIVE / G7_RELEASE — MERGED TO PRODUCTION / PAGES DEPLOY NOT YET RUN**

Validated candidate:

`581468fbf4b2b321bd2c2a16bd9e65a9e12e3a4f`

PR:

`#234 · MERGED`

New production:

`4a8e95cb669dab660a7afe381e580278d4575a2a`

## Exact delta

Old production:

`440ebce65efc46831a5736fc74a9bf798bf991d5`

New production:

`4a8e95cb669dab660a7afe381e580278d4575a2a`

Exact three files:

1. `projects/index.html`
2. `projects-hub-v2.css`
3. `scripts/validate-projects-v2-browser.mjs`

Candidate → production content diff:

`0 files`

## Validation

`Site Integrity / Release Readiness #1232 / 35660069754 · SUCCESS`

## Backend

`Supabase deploy = NOT REQUIRED / NOT RUN`

## Evidence

`operations/PROJECTS_PUBLIC_MEDIA_FALLBACK_G7_MERGE_2026-09-22.md`

## Gate

```text
production merge         PASS
exact candidate identity PASS
exact 3-file delta       PASS
Pages deployment         NOT YET
live Projects retest     NOT YET
```

Remain at G7_RELEASE until Pages deployment and live public Projects evidence are recorded.

STAB-06 is not started.
