---
artifactId: dementor-club.result.global-header-bootstrap-stability-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G6_VALIDATION
status: ACTIVE
workStatus: ACTIVE
version: 0.2
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
integrationBranch: result/global-header-bootstrap-stability-v1
integrationBaseRef: dementor-club-production
integrationBaseCommit: 260c5fe911fb0cad9902ad2db5d76060f47c18cc
productionBaseCommit: 260c5fe911fb0cad9902ad2db5d76060f47c18cc
implementationStartAuthorized: true
schemaMutationAuthorized: false
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
candidateCommit: b0d9be502de1533c42530af55cde2b4dd692abf4
g6Status: PASS
g6Evidence: operations/GLOBAL_HEADER_BOOTSTRAP_STABILITY_G6_2026-09-29.md
g6ValidationRun1: 1322
g6ValidationRunId1: 36565735746
g6ValidationRun2: 1323
g6ValidationRunId2: 36566203814
gateReadiness: READY_FOR_CLEAN_RELEASE_DECISION
---

# Global Header Bootstrap Stability v1 · Result v0.2

## Goal

Fix one proven boot-order defect in the existing canonical Global Header owner without changing Header design, navigation, auth semantics or Workspace ownership.

Exact defect:

```text
global-header.js:38:19
document.body.insertBefore(header, document.body.firstChild)
document.body === null
```

G6 exact candidate:

`b0d9be502de1533c42530af55cde2b4dd692abf4`

Validation:

```text
Site Integrity #1322 / 36565735746 = SUCCESS
Site Integrity #1323 / 36566203814 = SUCCESS
same exact SHA = YES
```

Evidence:

`operations/GLOBAL_HEADER_BOOTSTRAP_STABILITY_G6_2026-09-29.md`

Status:

```text
G6_VALIDATION = PASS
READY_FOR_CLEAN_RELEASE_DECISION
production merge = NOT AUTHORIZED
production deploy = NOT AUTHORIZED
```

## Existing owner

Canonical owner remains:

`global-header.js + global-header.css`

Do not create a second Header, page-owned Header, Artifact-specific Header or alternative auth owner.

## Scope

Only:
- body-ready bootstrap guard;
- idempotent canonical boot;
- regression coverage for boot requested before `document.body` exists;
- exact-head full Site Integrity.

No visual change.

## Acceptance

```text
early boot before body          PASS
ordinary public boot            PASS
one canonical header            PASS
auth identity                   PASS
mobile burger 390/360           PASS
Artifact Collaboration browser  PASS
Board Relations browser         PASS
WebKit auth                     PASS
release gate                    PASS
Full Site Integrity exact HEAD  PASS
backend/schema/RLS changes      NO
```

Because the defect is nondeterministic, require two consecutive successful full Site Integrity runs on the exact same candidate SHA before G6 checkpoint.

## Boundary

This Result does not absorb Artifact Collaboration implementation.

Artifact Collaboration v1 remains WAITING on this shared-shell dependency. After this Result is released/live-smoked, rebuild the Artifact Collaboration corrective from the then-current production baseline and rerun its exact validation.

## Stop

Commit != merge != deploy.

No production merge or deploy without explicit owner authorization.
