---
artifactId: dementor-club.operations.artifact-collaboration-live-ux-corrective-r2-production-release-checkpoint-2026-09-29
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
result: dementor-club.result.artifact-collaboration-v1
releaseCandidateCommit: 49a545c68f63248c60b0591176a016f07e559e76
releasePullRequest: 249
productionCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
productionTree: c525d2467247253a48ac0b3dbe14d8f9382278c4
---

# Artifact Collaboration live UX corrective r2 — production release checkpoint

## Owner authorization

On 2026-09-29 the owner explicitly authorized:

```text
merge + deploy PR #249
```

Authorization applies to the exact validated RC:

`49a545c68f63248c60b0591176a016f07e559e76`

## Production merge

PR #249 was moved from draft to ready with exact head unchanged and merged with expected-head SHA protection.

```text
PR #249            MERGED
expected RC head   49a545c68f63248c60b0591176a016f07e559e76
production SHA     a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
production tree    c525d2467247253a48ac0b3dbe14d8f9382278c4
```

Production tree equals the validated G7 RC tree.

Exact production delta from the previous production baseline
`fd184be3306911c4ddb6acbcb77acdd977ea84f8`
contains only:

1. `community/artifact/artifact.css`
2. `community/artifact/artifact.js`
3. `community/board/board-fullscreen-v2-1.css`
4. `community/board/board.js`
5. `scripts/validate-artifact-collaboration-browser.mjs`

No Global Header file changed.

No backend/schema/migration/RPC/RLS change exists.

Supabase deploy is not required.

## Pages deploy control plane

Canonical workflow:

`Deploy Dementor Production`

The workflow is manual `workflow_dispatch` and requires:

```text
branch = dementor-club-production
release_confirmation = APPROVED
```

The available GitHub connector does not expose workflow-dispatch write.

Latest Pages production run remains:

```text
#136 / 36580299418
head = fd184be3306911c4ddb6acbcb77acdd977ea84f8
result = SUCCESS
```

That run belongs to the previous production SHA and is not reused.

## Current release state

```text
production merge = COMPLETE
Pages deploy      = NOT STARTED
backend deploy    = NOT REQUIRED
Supabase deploy   = NOT REQUIRED
live acceptance   = NOT STARTED
G8                = NOT AUTHORIZED
```

Required next action: dispatch canonical Pages workflow for exact production SHA
`a24f8d900cc29e5ae922a9a62b751cc02e88f8d9`.

After Pages SUCCESS, perform live CJM/JTBD acceptance for BQA-24/25/26/28.
