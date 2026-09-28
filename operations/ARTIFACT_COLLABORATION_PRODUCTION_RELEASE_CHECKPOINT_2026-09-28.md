---
artifactId: dementor-club.operations.artifact-collaboration-production-release-checkpoint-2026-09-28
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PARTIAL
version: 1.0
updated: 2026-09-28
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
releaseCandidateCommit: f3078ceb227a0221b99b4e286f783986a33aea6f
releasePullRequest: 244
productionCommit: 260c5fe911fb0cad9902ad2db5d76060f47c18cc
supabaseProjectRef: mmekfydwbvptbdatwitj
---

# Artifact Collaboration v1 — production release checkpoint

## Production merge

Exact validated RC:

`f3078ceb227a0221b99b4e286f783986a33aea6f`

PR:

`#244`

Production merge:

```text
PR #244 = MERGED
production SHA = 260c5fe911fb0cad9902ad2db5d76060f47c18cc
changed_files = 31
```

## Backend migration preflight

Canonical production Supabase project:

`mmekfydwbvptbdatwitj`

Read-only ledger check after production merge:

```text
tracked migration files = 59
live migrations         = 58
pending                 = 20260924002500_artifact_collaboration_v1
extra live / drift      = none
```

Therefore backend release preflight is clean and has exactly one pending tracked migration.

## Deploy execution

Canonical workflows are manual-only:

- `Deploy Dementor Supabase Production`
- `Deploy Dementor Production`

No ad-hoc production mutation is authorized.

The current tool session could not submit the workflow dispatch without an additional interactive GitHub/browser authorization. That interactive path was not completed.

Therefore:

```text
production merge = COMPLETE
backend deploy    = NOT STARTED
Pages deploy      = NOT STARTED
live migration    = NOT APPLIED
live retest       = NOT STARTED
G8               = NOT AUTHORIZED
```

STOP before any non-canonical production mutation.
