---
artifactId: dementor-club.operations.artifact-collaboration-g6-corrective-validation-2026-09-28
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-28
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
productionBaseCommit: df8a24eca2bcca25339f128c7da93982515cf442
validatedCandidate: bee577a93de26952927d2e9cdca60f7aad425b0d
validationRun: 1312
validationRunId: 36421497144
validationConclusion: SUCCESS
liveDatabaseMutation: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# Artifact Collaboration v1 — G6 corrective validation

## Verdict

**G6 CORRECTIVE VALIDATION PASS**

**READY FOR NEW CLEAN G7 RELEASE CANDIDATE PREPARATION**

This evidence does not authorize live Supabase apply, production merge or production deploy.

## Exact identities

Production baseline:

`df8a24eca2bcca25339f128c7da93982515cf442`

Prior G6 candidate:

`5769fb10a19fbc2fe492d0b706f07d35df5e8be6`

Corrected exact candidate:

`bee577a93de26952927d2e9cdca60f7aad425b0d`

Previously blocked G7 RC remains historical and unchanged:

`030d7fece9dee1b8502bde6ac89bef95dbdfeda7`

Draft PR #243 remains OPEN / DRAFT / UNMERGED.

## Diff boundary

Production baseline → corrected candidate:

```text
status        ahead
ahead_by      65
behind_by     0
changed_files 31
```

The corrected candidate preserves the same 31-path Result boundary as the previous validated candidate.

Prior G6 candidate → corrected candidate:

```text
ahead_by      4
behind_by     0
changed_files 2
```

Exactly two files differ:

1. `community/board/board-relations-v1.js`
2. `scripts/validate-artifact-collaboration-browser.mjs`

No `supabase/**`, migration, RPC, RLS, grant/revoke, schema, membership or slot backend file changed after the prior G6 candidate.

## S2 corrective

Diagnostic evidence established that an active Artifact-detail Relations form was being destroyed by a canonical presentation refresh.

The runtime corrective is narrowly bounded:

- successful relation create closes the current form before canonical reread/rebuild;
- RPC error leaves the form available;
- cancelling a detail form closes it and permits the existing presentation refresh;
- `injectArtifactDetail()` resolves the endpoint before rebuilding;
- the detail host carries `data-relation-detail-key = endpoint.key`;
- when the same endpoint has an active add-form, the existing canonical host is preserved rather than replaced;
- no timeout, retry, debounce, parallel owner or external state store was introduced;
- desktop `renderCardBlocks()` was not expanded.

## Regression contract

The cleaned validator proves the S2 lifecycle:

```text
open Artifact detail
→ open Relations
→ open +СВЯЗЬ
→ choose target
→ canonical presentation refresh
→ same host/block/form/select/save remain connected
→ selected value preserved
→ save reaches create RPC
→ canonical reread
→ closed old host is replaced
→ created relation visible
→ delete succeeds
```

Mobile contract remains:

- 390 fresh run ×3 PASS;
- 360 PASS;
- mobile IDEA inline Relations hidden;
- Artifact detail remains canonical Relations owner;
- no horizontal overflow;
- no pan;
- no drag;
- no position write;
- focus remains on the same Artifact.

## Exact-head Site Integrity

```text
Site Integrity / Release Readiness
run       #1312
run id    36421497144
head SHA  bee577a93de26952927d2e9cdca60f7aad425b0d
result    SUCCESS
```

Relevant checks are green:

- Board Relations runtime contract;
- Board Relations browser acceptance;
- Artifact Collaboration browser acceptance;
- Board deeplink/auth-return;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

## Release boundary

```text
LIVE SUPABASE APPLY = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
RELEASE BRANCH MUTATION = NO
```

The old release branch is not promoted. A new clean G7 release candidate must be rebuilt from the unchanged production baseline using the corrected validated Result diff.
