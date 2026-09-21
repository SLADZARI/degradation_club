---
artifactId: dementor-club.operations.projects-public-media-fallback-g7-merge-2026-09-22
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

# STAB-05 · Projects Public Media Fallback · G7 merge evidence

## Release decision

Owner authorized release of exact validated candidate:

`581468fbf4b2b321bd2c2a16bd9e65a9e12e3a4f`

PR:

`#234`

## Pre-merge identity

Exact production baseline:

`440ebce65efc46831a5736fc74a9bf798bf991d5`

Candidate:

`581468fbf4b2b321bd2c2a16bd9e65a9e12e3a4f`

CI:

`Site Integrity / Release Readiness #1232 / 35660069754 · SUCCESS`

PR before mutation:

```text
OPEN
DRAFT
UNMERGED
mergeable = true
base = 440ebce65efc46831a5736fc74a9bf798bf991d5
head = 581468fbf4b2b321bd2c2a16bd9e65a9e12e3a4f
changed files = 3
```

Production had no drift from the exact baseline.

## Merge

PR #234 was marked ready and merged using the exact expected head SHA.

New production merge commit:

`4a8e95cb669dab660a7afe381e580278d4575a2a`

Merge parents:

1. `440ebce65efc46831a5736fc74a9bf798bf991d5`
2. `581468fbf4b2b321bd2c2a16bd9e65a9e12e3a4f`

GitHub signature verification:

`verified = true`

## Exact production delta

Old production → new production:

```text
ahead = 6
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

Therefore production content is exactly the validated candidate plus merge history only.

## Backend boundary

No Supabase deploy was started for STAB-05.

No schema/database/RLS changes are present in this Result.

## Current state

```text
PR #234                 MERGED
production branch       4a8e95cb669dab660a7afe381e580278d4575a2a
exact 3-file delta      PASS
candidate→production    0 files
Supabase deploy         NOT RUN / NOT REQUIRED
Pages deploy            NOT RUN IN THIS STEP
live retest             NOT RUN IN THIS STEP
```

Do not call STAB-05 fully released/live until Pages exact-SHA deployment and live public Projects retest are recorded.
