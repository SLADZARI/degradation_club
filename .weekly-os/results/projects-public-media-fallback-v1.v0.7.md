---
artifactId: dementor-club.result.projects-public-media-fallback-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G8_CLEANUP
status: WAITING
version: 0.7
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.6
parentIssue: 228
scope:
  - STAB-05
  - BQA-21
integrationBranch: null
productionBaseCommit: 4a8e95cb669dab660a7afe381e580278d4575a2a
candidateCommit: 91607fdbd02b815122ce25c7a8920691dda6320f
productionCommit: 287b485293d68098dfd3c9302785369a735d42e2
integrationPullRequest: 236
validationRunNumber: 1233
validationRunId: 35671603405
validationConclusion: SUCCESS
productionDeployRun: 129
productionDeployRunId: 35708869679
productionDeployStatus: SUCCESS
liveRetestStatus: PASS
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: true
productionDeployAuthorized: true
---

# MP | Dementor Club | RELEASE | Projects Public Media Fallback v1 | Result v0.7

## Status

**WAITING / G8_CLEANUP**

STAB-05 runtime release and live acceptance are complete.

## Exact identity

Candidate:

`91607fdbd02b815122ce25c7a8920691dda6320f`

Production:

`287b485293d68098dfd3c9302785369a735d42e2`

PR:

`#236 · MERGED`

Validation:

`Site Integrity / Release Readiness #1233 / 35671603405 · SUCCESS`

Pages:

`Deploy Dementor Production #129 / 35708869679 · SUCCESS`

Pages head SHA:

`287b485293d68098dfd3c9302785369a735d42e2`

## Live acceptance

Owner human-browser live retest on `/projects/`:

```text
real YouTube player renders     PASS
video playback works            PASS
9:16 media surface              PASS
unavailable-state copy absent   PASS
empty black media absent        PASS
```

`liveRetestStatus = PASS`

## Backend

`Supabase = NOT REQUIRED / NOT RUN`

## G8 handoff

`integrationBranch = null`

Remaining work is G8 cleanup only: stale branch/code/evidence/compatibility inventory as applicable.

No STAB-06 implementation is activated by this Result.

Evidence:

`operations/PROJECTS_PUBLIC_MEDIA_FALLBACK_LIVE_ACCEPTANCE_2026-09-22.md`
