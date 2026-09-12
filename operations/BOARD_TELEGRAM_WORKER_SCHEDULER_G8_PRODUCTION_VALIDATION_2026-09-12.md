---
artifactId: dementor-club.evidence.board-telegram-worker-scheduler-g8-production-validation-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: CLEANUP
gate: G8_CLEANUP
status: ACTIVE_EVIDENCE
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
productionBaseCommit: 8adee2d8708393d7ba56de0bc53790152fb5c69c
candidateBranch: agent/board-information-architecture-v1-g8
pullRequest: 151
---

# Board Telegram worker scheduler — G8 production validation

## Authorization

Project owner explicitly authorized the corrective package on 2026-09-12 with:

`разрешаю scheduler correction`

Scope is limited to the reviewed trusted-scheduler correction: production scheduler migration, worker redeploy, zero-claim trust-boundary validation, then frontend removal of obsolete browser worker triggers if backend validation passes.

## Pre-mutation gate

PR #151 candidate CI run #984 (`34708483620`) passed the full Site Integrity / Release Readiness chain after correcting the QA tutorial fixture from the obsolete `v2` key to the canonical `v21` tutorial key. The earlier run #983 failure was a test-harness overlay interception, not a runtime scheduler failure.

Immediately before production mutation, the canonical outbox had:

- actionable `pending`: **0**;
- actionable eligible `failed`: **0**;
- stored status counts: `sent=6`, `failed=1`.

Therefore zero-claim scheduler/auth smoke could not dispatch a real Telegram message.

## Production migration

Applied through the canonical Supabase migration path:

`board_telegram_worker_scheduler_v1`

Result: **SUCCESS**.

Verified without exposing secret plaintext:

- extensions installed: `pg_cron`, `pg_net`;
- Vault secret names present:
  - `dc_worker_project_url_v1`
  - `dc_worker_publishable_key_v1`
  - `dc_telegram_worker_scheduler_token_v1`
- exactly one canonical cron job:
  - name: `dc-telegram-outbox-worker-v1`
  - schedule: `* * * * *`
  - active: `true`
- `dc_validate_telegram_worker_scheduler_token_v1(text)`:
  - public: no EXECUTE
  - anon: no EXECUTE
  - authenticated: no EXECUTE
  - service_role: EXECUTE
- `dc_telegram_worker_scheduler_tick_v1()`:
  - public: no EXECUTE
  - anon: no EXECUTE
  - authenticated: no EXECUTE
  - service_role: EXECUTE

## Worker deployment

Deployed reviewed `telegram-outbox-worker` candidate as production version **11**.

Deployment state:

- status: `ACTIVE`;
- version: `11`;
- `verify_jwt=false`;
- bundle SHA-256: `995ce279372d74d3b9cb2613a839e4119db83e9c822a0f8d34d22a9531c7d3c5`.

`verify_jwt=false` is intentional for this service-to-service custom-auth worker. Processing authority remains inside the handler and requires either direct service-role authority or the private Vault-backed scheduler token validated by the service-role-only RPC. The browser never receives that token.

## Trusted zero-claim smoke

A request was issued from Postgres using Vault subqueries directly, so credential plaintext was never returned through the QA channel.

Request id: `1`.

Response:

- HTTP `200`;
- `ok=true`;
- `invoker=db_scheduler`;
- `requeued=0`;
- `claimed=0`;
- `sent=0`;
- `failed=0`;
- `delivery_unknown=0`;
- `stage=complete`.

No Telegram delivery was manufactured.

## Untrusted request smoke

A second request used only the project publishable gateway key and deliberately omitted the private scheduler token.

Request id: `2`.

Response:

- HTTP `403`;
- `error=Trusted worker invocation required`;
- `stage=auth`.

This proves the Edge gateway being open for service-to-service custom auth does **not** grant worker processing authority to an ordinary publishable/browser-style request.

## Post-smoke outbox integrity

After both requests:

- actionable `pending`: **0**;
- actionable eligible `failed`: **0**;
- stored status counts remain `sent=6`, `failed=1`.

No outbox row was added, claimed, sent, retried or rewritten by QA.

## Release gate

Backend scheduler/worker correction: **PASS**.

The authorized package may now proceed to the clean PR #151 frontend/repository merge and Pages deployment that removes the obsolete browser worker trigger. This document does not by itself claim frontend deployment or final G8 closure.
