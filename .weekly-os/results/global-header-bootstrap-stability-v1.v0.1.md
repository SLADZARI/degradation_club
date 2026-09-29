---
artifactId: dementor-club.result.global-header-bootstrap-stability-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
workStatus: ACTIVE
version: 0.1
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
---

# Global Header Bootstrap Stability v1 · Result v0.1

## Goal

Fix one proven boot-order defect in the existing canonical Global Header owner without changing Header design, navigation, auth semantics or Workspace ownership.

Exact defect:

```text
global-header.js:38:19
document.body.insertBefore(header, document.body.firstChild)
document.body === null
```

Evidence:

`operations/ARTIFACT_COLLABORATION_LIVE_CORRECTIVE_G5_BLOCKER_2026-09-29.md`

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
