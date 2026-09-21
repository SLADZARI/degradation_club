---
artifactId: dementor-club.operations.artifact-share-social-preview-g7-merge-2026-09-21
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

# STAB-04 · Artifact Share Social Preview · G7 merge evidence

## Release decision

Owner authorized release of exact validated candidate:

`e51d4bee5b5722bc419f8dd78e0012e8a5ab1907`

PR:

`#233`

## Pre-merge identity

Exact production baseline:

`692c87da4a15a986861c18d41fc9861aa1cb08f6`

Candidate:

`e51d4bee5b5722bc419f8dd78e0012e8a5ab1907`

CI:

`Site Integrity / Release Readiness #1230 / 35648978456 · SUCCESS`

PR before mutation:

```text
OPEN
DRAFT
UNMERGED
mergeable = true
base = 692c87da4a15a986861c18d41fc9861aa1cb08f6
head = e51d4bee5b5722bc419f8dd78e0012e8a5ab1907
changed files = 5
```

Production had no drift from the exact baseline.

## Merge

PR #233 was marked ready and merged using the exact expected head SHA.

New production merge commit:

`440ebce65efc46831a5736fc74a9bf798bf991d5`

Merge parents:

1. `692c87da4a15a986861c18d41fc9861aa1cb08f6`
2. `e51d4bee5b5722bc419f8dd78e0012e8a5ab1907`

GitHub signature verification:

`verified = true`

## Exact production delta

Old production → new production:

```text
ahead = 6
behind = 0
changed files = 5
```

Exact files:

1. `assets/social/dementor-artifact-share-v1-20260921.png`
2. `scripts/social-head-v1.mjs`
3. `scripts/validate-board-deeplink-auth-return-browser.mjs`
4. `scripts/validate-board-deeplink-auth-return-contract.mjs`
5. `share/artifact/index.html`

Validated candidate → new production:

```text
ahead = 1
changed files = 0
```

Therefore production content is exactly the validated candidate plus merge history only.

## Backend boundary

No Supabase deploy was started for STAB-04.

No schema/database/RLS/private media changes are present in this Result.

## Current state

```text
PR #233                 MERGED
production branch       440ebce65efc46831a5736fc74a9bf798bf991d5
exact 5-file delta      PASS
candidate→production    0 files
Supabase deploy         NOT RUN / NOT REQUIRED
Pages deploy            NOT RUN IN THIS STEP
live retest             NOT RUN IN THIS STEP
```

Do not call STAB-04 fully released/live until Pages exact-SHA deployment and live/fresh-preview retest are recorded.
