---
artifactId: dementor-club.operations.projects-public-media-fallback-live-corrective-g7-merge-2026-09-22
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS
version: 1.0
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
---

# STAB-05 · LIVE corrective · G7 merge evidence

## Release decision

Owner authorized release of exact validated corrective candidate:

`91607fdbd02b815122ce25c7a8920691dda6320f`

PR:

`#236`

## Pre-merge identity

Production baseline:

`4a8e95cb669dab660a7afe381e580278d4575a2a`

Candidate:

`91607fdbd02b815122ce25c7a8920691dda6320f`

Validation:

`Site Integrity / Release Readiness #1233 / 35671603405 · SUCCESS`

Fresh pre-merge state:

```text
PR #236 = OPEN / DRAFT / UNMERGED
mergeable = true
base = 4a8e95cb669dab660a7afe381e580278d4575a2a
head = 91607fdbd02b815122ce25c7a8920691dda6320f
changed files = 3
production vs baseline = identical
```

## Merge

PR #236 was marked ready and merged with expected exact head SHA.

New production commit:

`287b485293d68098dfd3c9302785369a735d42e2`

Merge parents:

1. `4a8e95cb669dab660a7afe381e580278d4575a2a`
2. `91607fdbd02b815122ce25c7a8920691dda6320f`

GitHub merge signature:

`verified = true`

## Exact production delta

Old production → new production:

```text
ahead = 4
behind = 0
changed files = 3
```

Exact files:

1. `projects/index.html`
2. `projects-hub-v2.css`
3. `scripts/validate-projects-v2-browser.mjs`

Validated candidate → new production:

```text
ahead = 1
changed files = 0
```

Production content is therefore exactly the validated corrective candidate plus merge history only.

## Backend boundary

Supabase deploy was not run.

No schema / DB / Storage / RLS mutation exists in this Result.

## Current release state

```text
PR #236                 MERGED
production              287b485293d68098dfd3c9302785369a735d42e2
exact 3-file delta      PASS
candidate→production    0 files
Supabase deploy         NOT RUN / NOT REQUIRED
Pages deploy            NOT RUN IN THIS STEP
live human playback QA  NOT RUN IN THIS STEP
```

Remain at G7_RELEASE until Pages exact-SHA deployment and live human playback acceptance are recorded.
