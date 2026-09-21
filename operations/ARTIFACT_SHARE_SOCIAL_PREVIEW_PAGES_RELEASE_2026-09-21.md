---
artifactId: dementor-club.operations.artifact-share-social-preview-pages-release-2026-09-21
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS
version: 1.0
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
---

# STAB-04 · Artifact Share Social Preview · Pages release evidence

## Production identity

Production commit:

`440ebce65efc46831a5736fc74a9bf798bf991d5`

PR:

`#233 · MERGED`

Validated candidate ancestry:

`e51d4bee5b5722bc419f8dd78e0012e8a5ab1907`

## Pages deployment

Canonical workflow:

`Deploy Dementor Production`

Run:

```text
runNumber = 126
runId = 35658317210
headSha = 440ebce65efc46831a5736fc74a9bf798bf991d5
status = COMPLETED
conclusion = SUCCESS
```

Jobs:

```text
build  = SUCCESS
deploy = SUCCESS
```

The build job also passed:

- production Pages artifact build;
- canonical shell validation;
- built JavaScript syntax;
- browser shell / Workspace recovery;
- production route manifest;
- production artifact and release gate;
- Pages artifact upload.

Therefore Pages deployment is proven against the exact STAB-04 production SHA.

## Backend boundary

`Supabase deploy = NOT REQUIRED / NOT RUN FOR STAB-04`

## Live verification status

An external production fetch was attempted after deployment.

Current tooling status:

- direct web fetch for `https://dementor.club/share/artifact/` was unavailable from the generic web fetcher;
- browser automation run `f74332d6-6eb2-497f-b41c-2a5b568ee1a5` remains in RUNNING state and has not returned an acceptance verdict.

Therefore no live/fresh-preview PASS is claimed yet.

## Gate consequence

```text
production merge       PASS
Pages exact SHA        PASS
Pages deployment       PASS
live fresh-preview QA  PENDING / NOT YET EVIDENCED
STAB-04 -> WAITING/G8  NOT YET
```
