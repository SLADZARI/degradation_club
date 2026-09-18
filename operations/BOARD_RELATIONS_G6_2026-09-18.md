---
artifactId: dementor-club.operations.board-relations-g6-2026-09-18
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.board-relations-v1
productionBaseline: 2dae3b6ece79652c81af780c049521fda7262726
integrationBase: 61d85d95bd95dfb536acdd363b45d2773a4b2ca5
candidateCommit: 20aa71c1db76cbe238c96587523012ecdec7d46f
validationRunId: 35332109233
validationRunNumber: 1222
validationRunAttempt: 2
validationConclusion: SUCCESS
liveDatabaseMutation: false
productionMutation: false
---

# Board Relations v1 — G6 validation evidence

## Verdict

**G6 PASS**

**READY FOR CLEAN G7 RELEASE CANDIDATE PREPARATION**

This does not authorize G7 execution, live DB mutation, staging merge, production merge or deploy.

## Exact validation identities

Production baseline:

`2dae3b6ece79652c81af780c049521fda7262726`

Integration base:

`61d85d95bd95dfb536acdd363b45d2773a4b2ca5`

Exact implementation candidate:

`20aa71c1db76cbe238c96587523012ecdec7d46f`

Integration branch:

`result/board-relations-v1`

## SHA assertion

Before G6 release-readiness rerun:

- integration branch head was read and matched the candidate SHA;
- PR #225 head matched the same candidate SHA;
- authoritative GitHub Actions run record for run `35332109233` reported:
  - `head_branch = result/board-relations-v1`
  - `head_sha = 20aa71c1db76cbe238c96587523012ecdec7d46f`

The full validate job was then rerun as **attempt 2** on that same immutable candidate.

GitHub Actions:

```text
workflow: Site Integrity / Release Readiness
run: #1222 / 35332109233
attempt: 2
head SHA: 20aa71c1db76cbe238c96587523012ecdec7d46f
conclusion: SUCCESS
```

## Diff provenance

The earlier G6 preflight blocker remains preserved as historical evidence:

`operations/BOARD_RELATIONS_G6_DIFF_BOUNDARY_BLOCKER_2026-09-18.md`

It was resolved by provenance, not by changing branch history.

### IMPLEMENTATION DELTA — Result-owned

```text
integration base:
61d85d95bd95dfb536acdd363b45d2773a4b2ca5
→
candidate:
20aa71c1db76cbe238c96587523012ecdec7d46f
```

Exactly 11 reviewed files:

1. `.github/workflows/site-integrity.yml`
2. `community/board/board-deeplink-auth-return-v1.js`
3. `community/board/board-entity-model-v1.js`
4. `community/board/board-integrations-v1.js`
5. `community/board/board-relations-v1.css`
6. `community/board/board-relations-v1.js`
7. `scripts/validate-board-relations-runtime-browser.mjs`
8. `scripts/validate-board-relations-runtime-v1.mjs`
9. `scripts/validate-board-relations-v1.mjs`
10. `supabase/migrations/20260918094000_board_relations_v1.sql`
11. `workspace/board/index.html`

This is the complete Result-owned delta.

### INHERITED INTEGRATION-BASE DELTA — not Result-owned

```text
production baseline:
2dae3b6ece79652c81af780c049521fda7262726
→
integration base:
61d85d95bd95dfb536acdd363b45d2773a4b2ca5
```

Exactly four inherited files:

1. `README.md`
2. `operations/SITE_PRODUCTION_RECONCILIATION_CLASSIFICATION_2026-09-17.md`
3. `operations/SITE_PRODUCTION_RECONCILIATION_INVENTORY_2026-09-17.md`
4. `operations/SITE_PRODUCTION_RECONCILIATION_RESIDUAL_REVIEW_2026-09-17.md`

They are:

- **NOT Result-owned**;
- **NOT part of the approved Board Relations implementation delta**;
- **MUST NOT enter the clean G7 release candidate**.

No rebase, branch rewrite or cherry-pick was performed on the integration branch to hide this provenance.

## Canonical identity contract

PASS:

- Board entity identity remains `id=entity:<dc_entities UUID>`;
- Board `sourceId` remains the existing `dc_entities` UUID;
- Event relation endpoint identity is canonical Event slug;
- Program relation endpoint identity is canonical Program slug;
- Course/Practice remain presentation variants normalized to `program` only for relation identity;
- Artifact relation endpoint identity is Artifact UUID;
- relation identity is additive and does not repurpose Board-local identity fields.

## Schema / RPC / RLS contract

PASS:

- one dedicated `public.dc_board_relations` persistence owner;
- endpoint kinds exactly `artifact,event,program`;
- persisted types exactly:
  - `RELATED_TO`
  - `RESULT_OF`
  - `CONTINUES`
  - `ABOUT`
  - `REPORT_OF`;
- `PARTICIPATES_IN` is not persisted;
- no Project/Product/Person endpoint namespace exists;
- RELATED_TO normalized ordering remains enforced;
- logical delete only;
- RLS enabled;
- direct table browser privileges revoked;
- browser mutation uses canonical RPCs:
  - `dc_board_relations_read_v1()`
  - `dc_board_relation_create_v1(...)`
  - `dc_board_relation_delete_v1(uuid)`;
- static schema validator passed on exact candidate.

CI log evidence:

```text
Board Relations v1 schema contract PASS
PARTICIPATES_IN generic persistence rejection fixture PASS
```

## Runtime ownership / endpoint mapping

PASS:

- one canonical Board Relations runtime owner: `community/board/board-relations-v1.js`;
- one canonical relation read truth and one in-memory index;
- no direct browser access to `dc_board_relations`;
- no second spatial/layout engine;
- relation coordinates remain presentation-only over existing card coordinates;
- no second detail modal/drawer/shell;
- existing Artifact fullscreen/detail owner is reused;
- canonical filter owner is reused;
- canonical deep-link history owner is reused;
- the deep-link corrective only applies the same existing `boardJustDragged < 650ms` suppression contract;
- no new drag owner, click owner, permission owner or compatibility runtime was introduced.

CI log evidence:

```text
Board Relations v1 runtime contract PASS
- endpoint projection mapping PASS
```

## Permission model

PASS:

- UI mirrors permission only;
- server RPC remains final authority;
- OWNER_ADMIN may manage;
- Artifact management requires owned Artifact + active member;
- Event/Program management requires active member + system Dementor + exact confirmed active scoped assignment;
- directional relations require origin management;
- RELATED_TO permits either endpoint management;
- permission reject remains fail-closed.

Browser log:

```text
- create/delete + permission reject fixtures PASS
```

## Sequential browser flow

PASS on exact candidate:

- filter visibility;
- canonical drag suppression;
- no stale `focus=artifact:<dragged-id>` after drag;
- relation line follows canonical drag;
- create success;
- canonical reread;
- server permission reject;
- delete;
- mobile/fullscreen;
- backend unavailable;
- invalid payload fail-closed.

CI:

```text
Board Relations v1 browser acceptance PASS
- desktop endpoint mapping + relation canvas/detail PASS
- create/delete + permission reject fixtures PASS
- mobile/fullscreen PASS
- RPC unavailable + invalid payload fail-closed PASS
```

## Auth / Workspace / route regressions

Full release-readiness attempt 2 passed:

- DC-9 login sync and cross-device recovery;
- Board fullscreen browser state matrix;
- Board live corrective browser acceptance;
- Board navigation/adaptive cards;
- deep-link auth-return browser acceptance;
- movable own-card share;
- browser shell and Workspace recovery;
- My Artifacts history;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

CI evidence includes:

```text
WebKit auth regression PASS
Production route manifest passed
```

## No dead / parallel owner

PASS.

The validated Result-owned delta does not introduce:

- second Board relation read owner;
- second layout owner;
- second Artifact detail shell;
- second filter state owner;
- second drag owner;
- Project/Product/Person relation endpoints;
- `PARTICIPATES_IN` persistence;
- generic ontology/Thing registry;
- Membership/Activation mutation;
- Catalog semantic mutation.

## Migration boundary

Candidate contains the migration file:

`supabase/migrations/20260918094000_board_relations_v1.sql`

That is **not** evidence of live application.

Live Supabase was read-only verified after G6 validation:

```text
migration count: 56
latest live migration: 20260916213500_evidence_hygiene_v1

public.dc_board_relations: absent
dc_board_relations_read_v1(): absent
dc_board_relation_create_v1(...): absent
dc_board_relation_delete_v1(uuid): absent
```

Therefore:

**MIGRATION COMMITTED IN CANDIDATE ≠ MIGRATION APPLIED LIVE**

## Release boundary after G6

```text
integration head:
20aa71c1db76cbe238c96587523012ecdec7d46f

dementor-club-site:
61d85d95bd95dfb536acdd363b45d2773a4b2ca5
UNCHANGED / UNMERGED

dementor-club-production:
2dae3b6ece79652c81af780c049521fda7262726
UNCHANGED

PR #225:
OPEN / DRAFT / UNMERGED
```

## G7 preparation contract

G7, if separately authorized, must **not** merge or cherry-pick the current integration branch into production.

It must start from a fresh release branch created from current production baseline:

`2dae3b6ece79652c81af780c049521fda7262726`

and reproduce only the 11 Result-owned files/diff.

Before any G7 merge consideration:

```text
production baseline → clean RC
= exactly approved Board Relations Result-owned diff
```

and full CI must run again on the clean RC.

The four inherited reconciliation/evidence files must not enter the release candidate.

## Gate

**G6 PASS**

**READY FOR CLEAN G7 RELEASE CANDIDATE PREPARATION**

Boundary:

```text
G6 PASS
≠ staging merge
≠ live Supabase apply
≠ production merge
≠ deploy
```

Current authorizations remain:

```text
liveDatabaseMutationAuthorized = false
productionMergeAuthorized = false
productionDeployAuthorized = false
```
