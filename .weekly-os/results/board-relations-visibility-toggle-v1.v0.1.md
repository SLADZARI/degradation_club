---
artifactId: dementor-club.result.board-relations-visibility-toggle-v1
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
  - STAB-03
  - BQA-16
integrationBranch: result/board-relations-visibility-toggle-v1
productionBaseCommit: 354d7ea9b176b55f2d4386b178f61cd9cd0e68ef
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | BUILD | Board Relations Visibility Toggle v1 | Result v0.1

## Goal

Fix the existing `СКРЫТЬ СВЯЗИ / ПОКАЗАТЬ СВЯЗИ` presentation contract so hiding relations removes all visible relation lines without mutating relation data.

Parent: #228 — STABILIZATION.

Scope: STAB-03 / BQA-16 only.

## Production baseline

`dementor-club-production@354d7ea9b176b55f2d4386b178f61cd9cd0e68ef`

Implementation must start from this exact production baseline. Do not use diverged `dementor-club-site` as a merge base.

## Confirmed root cause

Canonical runtime owner:

`community/board/board-relations-v1.js`

Current production uses:

```js
svg.hidden = !relationsVisible;
```

for the parent relation SVG layer while the existing presentation contract and individual relation lines use the actual `hidden` attribute through:

```js
line.toggleAttribute('hidden', !visible);
```

The corrective must align the parent layer with the same attribute contract:

```js
svg.toggleAttribute('hidden', !relationsVisible);
```

No second visibility owner is allowed.

## Acceptance criteria

1. With at least one visible relation, `СКРЫТЬ СВЯЗИ` removes all relation-line presentation immediately.
2. `ПОКАЗАТЬ СВЯЗИ` restores the same currently valid relation lines.
3. Relation rows/data are unchanged.
4. Filters and relation visibility compose correctly.
5. Drag/layout reconciliation still updates shown lines.
6. Refresh follows the current ephemeral visibility contract; do not invent persistence.
7. Desktop Chromium passes.
8. Mobile 390 and 360 pass.
9. Existing Board Relations regression suite passes.
10. No schema/RLS/relation ontology/permission changes.
11. Production→candidate diff contains only STAB-03-owned files.
12. Stop at validated candidate; no production merge/deploy without owner release decision.

## Expected owner boundary

Primary runtime:

`community/board/board-relations-v1.js`

Regression owner:

`scripts/validate-board-relations-runtime-browser.mjs`

Do not change Board Relations schema, relation types, persistence, permissions, Artifact detail, Public Activity, Membership or Contribution.

## Gate

`G5_BUILD`

```text
schemaMutationAuthorized = false
semanticMutationRequired = false
changeProposalRequired = false
productionMergeAuthorized = false
productionDeployAuthorized = false
gateReadiness = G5_BUILD_IN_PROGRESS
```

STAB-04 and STAB-05 remain queued; do not start them in parallel with this Result.
