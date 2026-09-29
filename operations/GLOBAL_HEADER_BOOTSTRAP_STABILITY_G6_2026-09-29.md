---
artifactId: dementor-club.operations.global-header-bootstrap-stability-g6-2026-09-29
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.global-header-bootstrap-stability-v1
productionBaseline: 260c5fe911fb0cad9902ad2db5d76060f47c18cc
candidateCommit: b0d9be502de1533c42530af55cde2b4dd692abf4
validationRun1: 1322
validationRunId1: 36565735746
validationRun2: 1323
validationRunId2: 36566203814
validationConclusion: SUCCESS
---

# Global Header Bootstrap Stability v1 · G6 validation

## Verdict

```text
G6 VALIDATION PASS
READY FOR CLEAN RELEASE DECISION
```

No production merge or deploy is authorized by this evidence.

## Exact identity

Production baseline:

`260c5fe911fb0cad9902ad2db5d76060f47c18cc`

Integration branch:

`result/global-header-bootstrap-stability-v1`

Exact candidate:

`b0d9be502de1533c42530af55cde2b4dd692abf4`

Production → candidate:

```text
status = ahead
changed files = exactly 3
```

1. `.github/workflows/site-integrity.yml`
2. `global-header.js`
3. `scripts/validate-global-header-bootstrap-browser.mjs`

No backend/schema/RLS change.

## Root cause

The shared canonical Header could boot in a non-loading document state while `document.body === null`.

Previous failing expression:

```js
document.body.insertBefore(header, document.body.firstChild);
```

Exact stack evidence:

```text
global-header.js:38:19
document.body === null
```

This was a shared-shell bootstrap race. It was not owned by Artifact Collaboration, Board Relations or Board composer.

## Corrective

Canonical Header owner remains unchanged.

`requestBoot()` now:

```text
if body exists
→ run existing boot

if body absent
→ establish one bounded bodyReadyWait
→ MutationObserver on documentElement
+ one-shot DOMContentLoaded fallback
→ first body availability
→ cleanup observer/listener
→ clear wait
→ run same canonical boot
```

Existing idempotency is preserved by:

`document.documentElement.dataset.dcGlobalHeader === '1'`

No polling, second Header, page-owned shell or alternate auth owner was introduced.

## Targeted regression

New validator:

`scripts/validate-global-header-bootstrap-browser.mjs`

It deliberately:
- removes body after DOMContentLoaded;
- loads `global-header.js` while body is null and readyState is not loading;
- restores body;
- asserts exactly one canonical Header;
- repeats runtime/DOMContentLoaded invocation and asserts no duplicate Header;
- verifies guest auth rendering;
- verifies mobile burger at 390 and 360;
- verifies ordinary boot path.

Targeted regression: PASS.

## Full exact-head validation

Because the defect is nondeterministic, two consecutive Site Integrity runs on the exact same SHA were required.

Run 1:

```text
Site Integrity / Release Readiness #1322
run id = 36565735746
head = b0d9be502de1533c42530af55cde2b4dd692abf4
conclusion = SUCCESS
```

Run 2:

```text
Site Integrity / Release Readiness #1323
run id = 36566203814
head = b0d9be502de1533c42530af55cde2b4dd692abf4
conclusion = SUCCESS
```

Both exact-head runs passed:
- canonical shell integration;
- Global Header bootstrap body-ready regression;
- Board Relations browser acceptance;
- Artifact Collaboration browser acceptance;
- browser shell / Workspace recovery;
- WebKit auth regression;
- production artifact release gate.

## Scope guard

No change to:
- Header visual design;
- public navigation semantics;
- auth lifecycle/identity meaning;
- Workspace ownership;
- Membership/DC-9;
- Board/Artifact semantics;
- Supabase schema/RPC/RLS.

## Gate

```text
G6_VALIDATION = PASS
gateReadiness = READY_FOR_CLEAN_RELEASE_DECISION
productionMergeAuthorized = false
productionDeployAuthorized = false
```

STOP at validated candidate.
