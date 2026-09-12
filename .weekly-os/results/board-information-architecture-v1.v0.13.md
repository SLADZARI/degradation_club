---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: CLEANUP
gate: G8_CLEANUP
status: ACTIVE
version: 0.13
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.12
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
changeDecision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
integrationBranch: agent/board-information-architecture-v1-g8
productionBaseCommit: 8adee2d8708393d7ba56de0bc53790152fb5c69c
productionMergeAuthorized: true
productionDeployAuthorized: true
liveDatabaseMutationAuthorized: true
telegramWorkerDeployAuthorized: true
---

# MP | Dementor Club | CLEANUP | Board Information Architecture v1 | Result v0.13

## Status

**ACTIVE / G8 CLEANUP — TRUSTED SCHEDULER CORRECTION AUTHORIZED**

On 2026-09-12 the project owner explicitly authorized the corrective package with:

`разрешаю scheduler correction`

This authorization applies only to the already reviewed G8 scheduler correction on `agent/board-information-architecture-v1-g8` / PR #151 and permits the ordered production sequence below. It does not authorize unrelated production changes.

## Authorized corrective sequence

1. apply `board_telegram_worker_scheduler_v1` to production Supabase;
2. verify extensions, Vault secret names, grants and the single canonical cron job without exposing secret plaintext;
3. deploy the reviewed `telegram-outbox-worker` candidate using explicit service-to-service custom authentication;
4. perform zero-claim trusted scheduler smoke without manufacturing Artifacts, roles, support votes or Telegram deliveries;
5. verify an ordinary non-trusted request is rejected;
6. only if backend validation passes, merge the clean PR #151 into `dementor-club-production` and deploy the frontend removal of obsolete browser triggers;
7. retest Board runtime and inspect outbox/scheduler state.

## Worker gateway correction discovered during pre-mutation review

The reviewed scheduler uses the new Supabase publishable API key plus a private Vault-backed `x-dc-worker-token`. Current Supabase service-to-service guidance requires custom-auth Edge Functions to use handler authorization rather than user-JWT verification. Therefore the worker deploy for this package uses `verify_jwt=false`, while the handler itself accepts only:

- direct service-role authority; or
- the private scheduler token validated by the service-role-only backend RPC.

Ordinary browser/user/publishable requests without that private token remain rejected by the handler. This preserves the approved trust boundary and avoids relying on a user JWT for a database scheduler.

## Safety boundary

- no synthetic Dementor/member role mutation;
- no synthetic outbox row or Telegram send for QA;
- no second delivery owner;
- no restoration of browser processing authority;
- rollback remains limited to unscheduling the named cron job and worker/frontend corrective rollback as documented.

Do not claim G8 closure until production evidence for this correction is recorded.
