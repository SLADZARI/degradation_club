---
artifactId: dementor-club.operations.artifact-collaboration-live-corrective-g5-blocker-2026-09-29
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: BLOCKED
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
integrationBranch: result/artifact-collaboration-v1-live-ux-corrective
integrationHead: 39001d9949355b7482b0bff01d3b9d07281d96c4
productionBase: 260c5fe911fb0cad9902ad2db5d76060f47c18cc
siteIntegrityRun: 1320
siteIntegrityRunId: 36479754825
---

# Artifact Collaboration live corrective — exact-head G5 blocker · 2026-09-29

## Verified current branch state

Exact corrective branch:

`result/artifact-collaboration-v1-live-ux-corrective`

Exact HEAD:

`39001d9949355b7482b0bff01d3b9d07281d96c4`

Production base:

`260c5fe911fb0cad9902ad2db5d76060f47c18cc`

Current delta is five files:

```text
community/artifact/artifact.css
community/artifact/artifact.js
community/board/board-fullscreen-v2-1.css
community/board/board.js
scripts/validate-artifact-collaboration-browser.mjs
```

PR #245 is CLOSED / DRAFT / UNMERGED.

## Corrective acceptance assertions

The current branch contains both developer lanes:

```text
BQA-24  invitation discoverability
BQA-25  Artifact detail action hierarchy
BQA-26  LEFT / REMOVED destructive UX
BQA-28  roster/state freshness without reload
```

The focused Artifact Collaboration assertions reached the intended corrective scenarios without BQA-24/25/26/28 assertion failures before the runtime blocker.

Board Relations standalone browser acceptance also passed.

This is evidence that the corrective implementation is substantially present, but it is **not** evidence of exact-head green validation.

## Canonical CI truth

Site Integrity / Release Readiness:

```text
run       #1320
run id    36479754825
attempt   4
head      39001d9949355b7482b0bff01d3b9d07281d96c4
result    FAILURE
```

Failure step:

`Validate Artifact Collaboration v1 browser acceptance`

Skipped after failure:
- WebKit auth regression;
- production artifact release gate;
- downstream exact-head completion.

Therefore:

```text
FULL SITE INTEGRITY = FAIL
G5 = BLOCKED
G6 = NOT ENTERED
G7 = NOT AUTHORIZED
PRODUCTION = UNCHANGED
```

## Exact blocker root owner now proven

The diagnostic commit `39001d9...` added stack capture and resolved the prior ambiguous `insertBefore` failure.

Exact mobile 360 stack:

```text
TypeError: Cannot read properties of null (reading 'insertBefore')
    at boot (global-header.js:38:19)
    at global-header.js:163:106
    at global-header.js:164:3
```

Current code at the failing line:

```js
document.body.insertBefore(header, document.body.firstChild);
```

The receiver is `document.body`; the observed failure means the GlobalHeader boot path can run while `document.body === null`.

This is **not** the Board Relations `ensureLayer()` owner. The previous Relations suspicion is disproven by the stack.

## Ownership / scope decision

Canonical owner:

`global-header.js`

This is a boot-order/runtime robustness defect in the existing canonical Public Header owner.

It does not change:
- header semantics;
- navigation contract;
- authentication meaning;
- membership;
- roles;
- Artifact Collaboration semantics.

Therefore it may be fixed as a narrow current-Result validation blocker without Change Control.

Do not create a second header owner, retry loop, page-owned header, or special Artifact-only header path.

## Required corrective

Make GlobalHeader boot body-safe:

```text
boot requested
→ if document.body exists: continue current canonical boot
→ if body does not exist: wait for body availability once
→ then execute the same canonical boot
```

Preferred implementation should use a bounded DOM-ready/body-ready guard, not polling.

The fix must remain idempotent and preserve:
- one canonical Global Header;
- auth identity rendering;
- mobile burger;
- support-v1 injection;
- current public/Workspace ownership rules.

## Required validation

1. reproduce the mobile 360 Artifact Collaboration case;
2. no `global-header.js insertBefore` pageerror;
3. Artifact Collaboration browser PASS;
4. Board Relations browser PASS;
5. public Global Header browser/shell tests PASS;
6. desktop / 390 / 360;
7. full Site Integrity exact HEAD = SUCCESS;
8. no backend/schema/RLS change.

STOP after exact-head green evidence. No production merge/deploy.
