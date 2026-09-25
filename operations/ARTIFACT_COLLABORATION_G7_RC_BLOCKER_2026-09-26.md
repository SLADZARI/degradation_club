---
artifactId: dementor-club.operations.artifact-collaboration-g7-rc-blocker-2026-09-26
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: BLOCKED
version: 1.0
updated: 2026-09-26
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
releaseCandidateCommit: 030d7fece9dee1b8502bde6ac89bef95dbdfeda7
releasePullRequest: 243
validationRun: 1308
validationRunId: 36198771555
validationAttempt: 2
validationConclusion: FAILURE
---

# Artifact Collaboration v1 — G7 clean RC blocker

## Verdict

```text
G7 CLEAN RC VALIDATION = BLOCKED
DEPLOY = NOT READY
```

Exact RC:

`030d7fece9dee1b8502bde6ac89bef95dbdfeda7`

Draft production-target PR:

`#243`

Site Integrity:

```text
run      #1308
run id   36198771555
attempt  2
result   FAILURE
```

## Attempt 1

The first exact-head run failed in Artifact Collaboration browser acceptance on the desktop Space keyboard event target:

```text
RELATION_KEYBOARD_EVENT_TARGET_MISMATCH
keydown target = BODY
current Relations summary connected
block open = false
focus URL = null
Artifact overlay = false
```

No code was changed before rerunning the exact same RC.

## Attempt 2

The exact-head rerun progressed past Board Relations browser acceptance and failed in Artifact Collaboration browser acceptance on the mobile 390 flow:

```text
mobile 390 page error:
Cannot read properties of null (reading 'insertBefore')
```

Downstream checks were skipped, including:

- Board deeplink/auth-return browser acceptance;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

The two failures are distinct observations on the same immutable RC. Therefore the RC cannot be promoted from validation to release decision.

## Boundary

```text
LIVE SUPABASE APPLY = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
```

Next action is diagnostic only: reproduce the mobile 390 `insertBefore` page error and identify the exact runtime owner/root cause before any corrective mutation.
