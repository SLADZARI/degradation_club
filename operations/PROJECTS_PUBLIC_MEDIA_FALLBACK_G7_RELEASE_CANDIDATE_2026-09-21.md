---
artifactId: dementor-club.operations.projects-public-media-fallback-g7-release-candidate-2026-09-21
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

# STAB-05 · Projects Public Media Fallback · G7 release candidate

## Exact production baseline

`dementor-club-production@440ebce65efc46831a5736fc74a9bf798bf991d5`

Fresh compare after validation:

```text
production vs baseline = identical
ahead = 0
behind = 0
```

Production did not move during STAB-05 validation.

## Exact validated candidate

`581468fbf4b2b321bd2c2a16bd9e65a9e12e3a4f`

PR:

`#234 · OPEN / DRAFT / UNMERGED`

Base SHA:

`440ebce65efc46831a5736fc74a9bf798bf991d5`

Candidate validation:

```text
Site Integrity / Release Readiness #1232
run id = 35660069754
status = COMPLETED
conclusion = SUCCESS
```

## Exact production → candidate diff

```text
ahead = 5 commits
behind = 0
changed files = 3
```

Exact files:

1. `projects/index.html`
2. `projects-hub-v2.css`
3. `scripts/validate-projects-v2-browser.mjs`

No Project entity semantics, Board, Membership, auth, Storage/RLS, Contribution or generic media-pipeline files.

## Release boundary

```text
schema mutation = NO
semantic mutation = NO
Change Proposal = NO
backend production deploy required = NO
Supabase deploy required = NO
production merge authorized = NO
production deploy authorized = NO
```

## G7 verdict

`PASS · VALIDATED CANDIDATE / READY_FOR_RELEASE_DECISION`

STOP.

Do not mark PR ready, merge, deploy or start STAB-06 without a new owner instruction.
