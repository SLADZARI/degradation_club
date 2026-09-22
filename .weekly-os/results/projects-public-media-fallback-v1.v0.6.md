---
artifactId: dementor-club.result.projects-public-media-fallback-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.6
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.5
parentIssue: 228
scope:
  - STAB-05
  - BQA-21
integrationBranch: result/projects-public-media-fallback-v1
productionBaseCommit: 4a8e95cb669dab660a7afe381e580278d4575a2a
candidateCommit: 91607fdbd02b815122ce25c7a8920691dda6320f
productionCommit: 287b485293d68098dfd3c9302785369a735d42e2
integrationPullRequest: 236
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: true
productionDeployAuthorized: false
---

# MP | Dementor Club | RELEASE | Projects Public Media Fallback v1 | Result v0.6

## Status

**ACTIVE / G7_RELEASE — CORRECTIVE MERGED / PAGES DEPLOY NOT YET RUN**

Exact corrective candidate:

`91607fdbd02b815122ce25c7a8920691dda6320f`

PR:

`#236 · MERGED`

Production:

`287b485293d68098dfd3c9302785369a735d42e2`

Validation:

`Site Integrity / Release Readiness #1233 / 35671603405 · SUCCESS`

## Exact production delta

Previous production:

`4a8e95cb669dab660a7afe381e580278d4575a2a`

New production:

`287b485293d68098dfd3c9302785369a735d42e2`

Files:

1. `projects/index.html`
2. `projects-hub-v2.css`
3. `scripts/validate-projects-v2-browser.mjs`

Candidate → production content diff:

`0 files`

## Backend

`Supabase deploy = NOT REQUIRED / NOT RUN`

## Gate

```text
projectStage = RELEASE
status = ACTIVE
gate = G7_RELEASE
gateReadiness = MERGED_AWAITING_PAGES_DEPLOY
```

Next release evidence must prove Pages deployed exact production SHA and live human-browser video behavior.

STAB-06 not started.
