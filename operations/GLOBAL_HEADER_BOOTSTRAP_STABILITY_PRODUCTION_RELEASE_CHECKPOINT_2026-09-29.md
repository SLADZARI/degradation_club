---
artifactId: dementor-club.operations.global-header-bootstrap-stability-production-release-checkpoint-2026-09-29
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PARTIAL
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.global-header-bootstrap-stability-v1
releaseCandidateCommit: cdd6c4aa962f95f560d9fd9936944d623d005fca
releasePullRequest: 247
productionCommit: fd184be3306911c4ddb6acbcb77acdd977ea84f8
productionTree: 7c9c4a749a80c6ecb69f314565cf36300af868d0
---

# Global Header Bootstrap Stability v1 — production release checkpoint

## Owner authorization

On 2026-09-29 the owner explicitly authorized:

```text
merge + deploy PR #247
```

The authorization applies to the exact validated release candidate only:

`cdd6c4aa962f95f560d9fd9936944d623d005fca`.

## Production merge

PR #247 was first moved from draft to ready with the exact head unchanged, then merged with an expected-head lock.

```text
PR #247            MERGED
expected RC head   cdd6c4aa962f95f560d9fd9936944d623d005fca
production SHA     fd184be3306911c4ddb6acbcb77acdd977ea84f8
production tree    7c9c4a749a80c6ecb69f314565cf36300af868d0
```

The production tree equals the validated clean RC tree.

Exact production delta from the pre-release baseline
`260c5fe911fb0cad9902ad2db5d76060f47c18cc`
contains only:

1. `.github/workflows/site-integrity.yml`
2. `global-header.js`
3. `scripts/validate-global-header-bootstrap-browser.mjs`

No backend, migration, RPC, schema or RLS change is present.

## Pages deploy control plane

Canonical production workflow:

`Deploy Dementor Production`

Workflow file:

`.github/workflows/deploy-pages.yml`

The workflow is `workflow_dispatch` only and requires:

```text
branch = dementor-club-production
release_confirmation = APPROVED
```

The available GitHub connector in this execution context has merge/read/rerun actions but no workflow-dispatch write action.

No current-SHA Pages run has therefore been started from this session.

Latest observed successful Pages deployment remains:

```text
run #135 / 36432865028
head = 260c5fe911fb0cad9902ad2db5d76060f47c18cc
```

That run belongs to the previous production SHA. It MUST NOT be rerun as a substitute for a current workflow dispatch because a rerun would preserve the old release context.

## Current release state

```text
production merge = COMPLETE
Pages deploy      = NOT STARTED
backend deploy    = NOT REQUIRED
Supabase deploy   = NOT REQUIRED
live smoke        = NOT STARTED
G8                = NOT AUTHORIZED
```

## Required next action

Dispatch the canonical `Deploy Dementor Production` workflow from
`dementor-club-production` with `release_confirmation=APPROVED`.

Acceptance for the deploy step:

- workflow head SHA = `fd184be3306911c4ddb6acbcb77acdd977ea84f8`;
- build/deploy conclusion = SUCCESS;
- GitHub Pages deployment reports success;
- no Supabase workflow is run.

After that, perform the canonical live Header smoke before G8.
