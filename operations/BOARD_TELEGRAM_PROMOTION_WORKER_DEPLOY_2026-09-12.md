---
artifactId: dementor-club.evidence.board-telegram-promotion-worker-deploy-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G6_PROMOTION_VALIDATION
status: ACTIVE_EVIDENCE
version: 1.0
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
decision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
integrationBranch: agent/board-information-architecture-v1
productionDatabaseProject: mmekfydwbvptbdatwitj
---

# Board Telegram Promotion v1 — production worker deploy evidence — 2026-09-12

## Authorization

The project owner explicitly authorized the production Telegram Edge worker deployment on 2026-09-12 with the instruction: `деплой worker`.

This authorization is scoped to the existing `telegram-outbox-worker` deployment only. It does not authorize production frontend merge or site deploy.

## Deployed source

Canonical integration source:

`supabase/functions/telegram-outbox-worker/index.ts`

Integration branch:

`agent/board-information-architecture-v1`

Source blob SHA at deployment:

`0d61d6091c84352fc90f7537f5be510cf3451f14`

The deployed worker uses the approved Telegram Promotion v1 contract:

- trusted service-role request boundary;
- `dc_distribution_requeue_failed_v1`;
- atomic `dc_distribution_claim_pending_v1`;
- service-role-only mark sent / failed / delivery_unknown RPCs;
- `delivery_unknown` for ambiguous Telegram outcomes;
- current Artifact eligibility and Board-hide checks;
- no direct frontend queue ownership.

## Production deployment result

Supabase project:

`mmekfydwbvptbdatwitj`

Function:

`telegram-outbox-worker`

Deployment result:

- status: `ACTIVE`;
- version: `10`;
- `verify_jwt`: `true`;
- deployed bundle SHA-256: `e391baaf5082f03e3650cff36f7b15fa8161b756bec92bd2b44594cf77f0946f`.

Post-deploy function fetch confirmed version `10` contains the candidate source above.

## Post-deploy database safety check

Immediately after deployment, production outbox state was read-only checked:

- `sent`: 6;
- `failed`: 1;
- `pending`: 0;
- `delivery_unknown`: 0;
- currently eligible worker rows: 0.

Therefore deployment itself did not create, claim, retry or mutate any delivery row.

## Validation status

The worker implementation contract had already passed Site Integrity / Release Readiness `#973` on integration commit `d74fe6e255de7b4dea186f6bfaa069e46c1d4908` before deployment.

A real trusted service-role HTTP invocation was not executed by this deployment action because the available production connector supports Edge Function deployment/introspection but does not expose a service-role invocation action, and production has no database scheduler invocation path. No secret was extracted or copied solely to manufacture this smoke.

Thus this evidence proves **deployed runtime identity/source + zero-row post-deploy safety**, not a successful external Telegram delivery.

## Remaining G6 gap

The worker-runtime deployment gap is closed.

The principal remaining live validation gap is the real non-owner Dementor support path:

`0/2 → 1/2 → 2/2 → held → pending`

Production currently has no legitimate non-owner Dementor actor available for that test. No synthetic role assignment is authorized or created.

External Telegram delivery evidence will become naturally testable when a legitimate eligible Artifact reaches `pending` through the approved promotion path or an explicitly authorized Owner/Admin manual promotion test is scheduled.

## Release boundary

- Telegram Edge worker deploy — **DONE / version 10 ACTIVE**;
- production DB migrations — already applied;
- production frontend merge — **NOT AUTHORIZED / NOT DONE**;
- production site deploy — **NOT AUTHORIZED / NOT DONE**;
- full Result G6 PASS — **NOT CLAIMED**.

`Commit ≠ merge ≠ deploy.`
