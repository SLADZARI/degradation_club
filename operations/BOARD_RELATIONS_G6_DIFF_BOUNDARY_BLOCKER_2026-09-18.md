---
artifactId: dementor-club.evidence.board-relations-g6-diff-boundary-blocker-2026-09-18
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: BLOCKER_EVIDENCE
version: 1.0
updated: 2026-09-18
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.board-relations-v1
productionBaseline: 2dae3b6ece79652c81af780c049521fda7262726
candidateCommit: 20aa71c1db76cbe238c96587523012ecdec7d46f
validationConclusion: BLOCKED_BEFORE_RUN
blockingGate: G6_DIFF_BOUNDARY
liveDatabaseMutation: false
productionMutation: false
---

# Board Relations v1 — G6 diff-boundary blocker

## Verdict

**G6 BLOCKED BEFORE RELEASE-READINESS RUN**

The exact implementation head was confirmed before validation:

`result/board-relations-v1@20aa71c1db76cbe238c96587523012ecdec7d46f`

Required production baseline:

`dementor-club-production@2dae3b6ece79652c81af780c049521fda7262726`

No G6 Site Integrity run was launched after this preflight because the exact production diff failed the required scope boundary.

## Exact production-baseline diff

Topology:

```text
base: 2dae3b6ece79652c81af780c049521fda7262726
head: 20aa71c1db76cbe238c96587523012ecdec7d46f

status: diverged
ahead_by: 29
behind_by: 1
content diff: 15 files
```

### Expected Board Relations / QA / corrective files

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

These 11 files are exactly the content delta from the integration base:

```text
61d85d95bd95dfb536acdd363b45d2773a4b2ca5
→
20aa71c1db76cbe238c96587523012ecdec7d46f
```

and remain within the reviewed Board Relations runtime/schema/QA scope plus the canonical deep-link corrective.

### Unrelated inherited staging-only files in production-baseline diff

The production-baseline comparison additionally contains:

1. `README.md`
2. `operations/SITE_PRODUCTION_RECONCILIATION_CLASSIFICATION_2026-09-17.md`
3. `operations/SITE_PRODUCTION_RECONCILIATION_INVENTORY_2026-09-17.md`
4. `operations/SITE_PRODUCTION_RECONCILIATION_RESIDUAL_REVIEW_2026-09-17.md`

These four files are already present in the staging base and are not introduced by Board Relations.

Proof:

```text
production baseline
2dae3b6e...
→
staging base
61d85d95...
```

contains exactly those four files.

Therefore the Board Relations implementation delta itself is clean relative to its integration base, but the **exact candidate vs current production baseline is not clean**.

That fails the explicit G6 requirement:

`exact production diff contains only Board Relations schema/runtime/QA + reviewed deep-link corrective`

## Architecture checks completed before stop

Read-only inspection of exact candidate confirms:

- canonical entity identity remains `id=entity:<uuid>`;
- canonical Board `sourceId=dc_entities UUID` remains unchanged;
- Event/Program relation identity uses canonical slug;
- Artifact relation identity uses Artifact UUID;
- runtime endpoint kinds remain exactly `artifact,event,program`;
- persisted relation types remain exactly `RELATED_TO, RESULT_OF, CONTINUES, ABOUT, REPORT_OF`;
- no `PARTICIPATES_IN` persistence exists;
- no Project/Product/Person relation endpoint namespace exists;
- one Board relation read owner remains `board-relations-v1.js`;
- no direct browser table mutation exists;
- coordinates remain presentation-only over existing Board spatial/layout owners;
- the deep-link corrective only reuses the existing `boardJustDragged < 650ms` suppression contract;
- no new drag, click, layout, detail-shell or permission owner was introduced.

The G5 exact-head validation remains valid evidence for runtime behavior, but it does not override the failed G6 production-diff boundary.

## Migration boundary

Candidate contains committed migration:

`supabase/migrations/20260918094000_board_relations_v1.sql`

Live Supabase remains unchanged:

```text
migration count: 56
latest live migration: 20260916213500_evidence_hygiene_v1
public.dc_board_relations: absent
dc_board_relations_read_v1(): absent
dc_board_relation_create_v1(...): absent
dc_board_relation_delete_v1(uuid): absent
```

Therefore:

`MIGRATION COMMITTED IN CANDIDATE ≠ MIGRATION APPLIED LIVE`

No live Supabase mutation was performed.

## Release boundaries

At blocker capture:

```text
integration head:
20aa71c1db76cbe238c96587523012ecdec7d46f

dementor-club-site:
61d85d95bd95dfb536acdd363b45d2773a4b2ca5
unchanged / unmerged

dementor-club-production:
2dae3b6ece79652c81af780c049521fda7262726
unchanged

PR #225:
OPEN / DRAFT / UNMERGED
```

## Gate consequence

```text
gate = G6_VALIDATION
g6ValidationStatus = BLOCKED
blockingGate = G6_DIFF_BOUNDARY
releaseReadinessRun = NOT_LAUNCHED
```

A clean G6 candidate must first make the exact production-baseline diff contain only the reviewed Board Relations schema/runtime/QA + deep-link corrective scope.

No automatic branch rewrite, rebase, cherry-pick, staging merge, live migration apply, production merge, deploy, or G7 work is authorized by this evidence.
