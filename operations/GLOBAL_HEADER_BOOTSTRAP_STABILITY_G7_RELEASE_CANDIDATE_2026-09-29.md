---
artifactId: dementor-club.operations.global-header-bootstrap-stability-g7-release-candidate-2026-09-29
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: BUILD
gate: G7_RELEASE
status: PASS
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.global-header-bootstrap-stability-v1
productionBaseline: 260c5fe911fb0cad9902ad2db5d76060f47c18cc
integrationCandidate: b0d9be502de1533c42530af55cde2b4dd692abf4
releaseBranch: release/global-header-bootstrap-stability-v1
releaseCandidateCommit: cdd6c4aa962f95f560d9fd9936944d623d005fca
releaseCandidateTree: 7c9c4a749a80c6ecb69f314565cf36300af868d0
pullRequest: 247
validationRun: 1324
validationRunId: 36572884226
validationConclusion: SUCCESS
---

# Global Header Bootstrap Stability v1 · G7 clean release candidate

## Verdict

```text
G7 CLEAN RC = PASS
FULL CI      = SUCCESS
READY FOR RELEASE DECISION
```

No production merge or deploy is authorized by this evidence.

## Release construction

Current production baseline:

`260c5fe911fb0cad9902ad2db5d76060f47c18cc`

Validated G6 integration candidate:

`b0d9be502de1533c42530af55cde2b4dd692abf4`

Clean release branch was created directly from the exact current production baseline:

`release/global-header-bootstrap-stability-v1`

Release candidate:

`cdd6c4aa962f95f560d9fd9936944d623d005fca`

The RC is one commit ahead of production and contains exactly three files:

1. `.github/workflows/site-integrity.yml`
2. `global-header.js`
3. `scripts/validate-global-header-bootstrap-browser.mjs`

No backend, schema, migration, RPC or RLS change is present.

## Tree identity

Validated G6 candidate tree:

`7c9c4a749a80c6ecb69f314565cf36300af868d0`

Clean RC tree:

`7c9c4a749a80c6ecb69f314565cf36300af868d0`

```text
TREE EQUALITY = PASS
```

The histories differ by construction, but the complete candidate trees are identical.

## Pull request

PR #247:

```text
OPEN
DRAFT
UNMERGED
mergeable = true
base = dementor-club-production
head = release/global-header-bootstrap-stability-v1
head SHA = cdd6c4aa962f95f560d9fd9936944d623d005fca
changed files = 3
```

The PR remains draft because release authorization has not been granted.

## Exact RC validation

Site Integrity / Release Readiness:

```text
run #1324
run id = 36572884226
head = cdd6c4aa962f95f560d9fd9936944d623d005fca
event = pull_request
conclusion = SUCCESS
```

Key exact-head passes include:
- canonical shell integration;
- Global Header bootstrap body-ready regression;
- Board Relations browser acceptance;
- Artifact Collaboration browser acceptance;
- browser shell / Workspace recovery;
- WebKit auth regression;
- production artifact release gate.

## Release boundary

```text
productionMergeAuthorized  = false
productionDeployAuthorized = false
backendDeployRequired      = false
liveDatabaseMutation       = false
```

Next action requires explicit owner release authorization.

If authorized:
1. mark PR #247 ready;
2. merge exact RC only;
3. verify new production SHA;
4. verify exact 3-file production delta;
5. do not run Supabase deploy;
6. run Pages production deploy from `dementor-club-production`;
7. verify deployed Pages SHA;
8. live smoke canonical Header desktop/mobile + authenticated identity;
9. record release evidence;
10. only then unblock Artifact Collaboration from the new production baseline.

## Gate

```text
G7_RELEASE = READY_FOR_RELEASE_DECISION
STOP
```
