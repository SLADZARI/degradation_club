---
artifactId: dementor-club.result.artifact-detail-terminal-state-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
version: 0.1
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 228
scope:
  - STAB-02
  - BQA-19
integrationBranch: result/artifact-detail-terminal-state-v1
productionBaseCommit: 0852d2602df5593deead797b20c50daa36fe1c1c
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | BUILD | Artifact Detail Terminal State v1 | Result v0.1

## Goal

Guarantee that the canonical Artifact detail flow always reaches a terminal state and cannot remain in `LOADING` forever.

Invariant:

```text
OPTIONAL ENRICHMENT
!=
OWNER OF PRIMARY CONTENT VISIBILITY
```

## Status

**ACTIVE / G5_BUILD**

Parent: #228 — STABILIZATION.

Scope: STAB-02 / BQA-19 only.

## Production baseline

`dementor-club-production@0852d2602df5593deead797b20c50daa36fe1c1c`

Because `dementor-club-site` still contains unrelated reconciliation divergence, the implementation branch must be created directly from this exact production commit.

## Canonical owners

Primary Artifact page:
- `community/artifact/index.html`
- `community/artifact/artifact.js`

Existing Board shell/history owners may be inspected for regression only and changed only if exact evidence requires it.

Relations runtime is explicitly outside scope.

## Acceptance criteria

1. Normal accessible Artifact reaches SUCCESS.
2. Invalid/missing/inaccessible Artifact reaches an explicit terminal state.
3. Optional enrichment stall/failure cannot indefinitely block primary title/body when primary Artifact data is already available.
4. Truly essential dependency failure is bounded into a recoverable terminal state.
5. Static bootstrap/module failure cannot leave the page in permanent LOADING if a narrow page-level watchdog is required.
6. Board open/close/reopen, direct detail route, refresh, back and forward remain recoverable.
7. Desktop Chromium + mobile 390/360 pass.
8. Existing WebKit auth regression passes where canonical CI covers it.
9. No schema/RLS/access/membership semantics are changed.
10. Production→candidate diff contains only STAB-02-owned files.
11. Stop at validated candidate; no production merge/deploy without separate owner authorization.

## Gate

`G5_BUILD`
