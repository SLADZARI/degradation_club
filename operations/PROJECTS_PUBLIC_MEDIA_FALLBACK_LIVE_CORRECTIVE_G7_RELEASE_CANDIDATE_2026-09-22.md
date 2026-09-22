---
artifactId: dementor-club.operations.projects-public-media-fallback-live-corrective-g7-release-candidate-2026-09-22
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

# STAB-05 · LIVE corrective · G7 release candidate

Production baseline:

`4a8e95cb669dab660a7afe381e580278d4575a2a`

Production remains identical to baseline during validation.

Corrective candidate:

`91607fdbd02b815122ce25c7a8920691dda6320f`

PR:

`#236 · OPEN / DRAFT / UNMERGED`

CI:

`Site Integrity / Release Readiness #1233 / 35671603405 · SUCCESS`

Exact production → candidate:

```text
ahead = 3
behind = 0
changed files = 3
```

Exact files:

1. `projects/index.html`
2. `projects-hub-v2.css`
3. `scripts/validate-projects-v2-browser.mjs`

No schema, Supabase, auth, Membership, Contribution, Board, Project-entity semantics or STAB-06 changes.

```text
productionMergeAuthorized = false
productionDeployAuthorized = false
SupabaseDeployRequired = false
gateReadiness = READY_FOR_RELEASE_DECISION
```

STOP at corrective validated candidate.
