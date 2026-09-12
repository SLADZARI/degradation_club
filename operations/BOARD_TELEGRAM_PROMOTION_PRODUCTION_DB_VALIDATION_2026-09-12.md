---
artifactId: dementor-club.evidence.board-telegram-promotion-production-db-validation-2026-09-12
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

# Board Telegram Promotion v1 — production DB validation — 2026-09-12

## Scope

This evidence records the bounded production-database application and validation of the approved Board Telegram Promotion v1 change. It does **not** authorize or record a production frontend merge, production site deploy, or Telegram Edge worker deploy.

Canonical Decision:

`operations/BOARD_TELEGRAM_PROMOTION_V1.md`

Implementation branch:

`agent/board-information-architecture-v1`

## Preflight

Immediately before the Telegram promotion migrations, production state was checked read-only.

Observed:

- `dc_artifacts.activity_at` — absent;
- `dc_artifacts.board_hidden_at` — absent;
- `dc_artifacts.board_hidden_by` — absent;
- `dc_artifact_promotion_support` — absent;
- `dc_distribution_outbox.status` default — `pending`;
- outbox status constraint allowed only `pending / processing / sent / failed / cancelled`;
- canonical outbox historical rows = `7`;
- historical outbox composition = `6 sent + 1 failed`;
- no `held`, `suppressed`, `delivery_unknown` or other new-state row existed before migration.

The deployed frontend was also checked. Its legacy `dc_enqueue_artifact_distribution_v1` follow-up is fire-and-forget after successful `dc_publish_artifact_v1`; an enqueue error is only logged and does not convert the publication into a failed publish. This allowed backend enqueue authority to be closed without making the currently deployed frontend unable to publish, provided canonical publish itself succeeds.

## Applied production migrations

Under the existing explicit production-DB mutation authorization for the active Board Result, the following tracked migrations were applied to production:

1. `board_telegram_promotion_v1`
2. `board_telegram_promotion_v1_worker_hardening`

Supabase migration history recorded them as:

- `20260912144034 board_telegram_promotion_v1`
- `20260912144055 board_telegram_promotion_v1_worker_hardening`

No frontend merge/deploy and no Edge worker deploy occurred.

## Post-migration schema and state evidence

Read-only post-migration validation confirmed:

- canonical promotion threshold = `2`;
- outbox status constraint now permits exactly:
  - `held`;
  - `pending`;
  - `processing`;
  - `sent`;
  - `failed`;
  - `suppressed`;
  - `delivery_unknown`;
  - `cancelled`;
- outbox default = `held`;
- `activity_at`, `board_hidden_at`, `board_hidden_by` exist and are nullable;
- `dc_artifact_promotion_support` exists with RLS enabled;
- promotion support row count after migration = `0`;
- existing outbox rows remain exactly `6 sent + 1 failed`;
- historical rows transitioned into a new Telegram state = `0`;
- Board-hidden Artifact count = `0`;
- non-null `activity_at` count = `0`.

Therefore the migration changed prospective behavior without reopening or rewriting the seven historical delivery records.

## Worker authority / bypass evidence

Production privilege checks confirmed:

- `authenticated` cannot execute `dc_distribution_claim_pending_v1(integer)`;
- `service_role` can execute it;
- `authenticated` cannot execute `dc_distribution_mark_unknown_v1(uuid,text)`;
- `service_role` can execute it;
- `authenticated` cannot execute legacy `dc_enqueue_artifact_distribution_v1(uuid,text)`.

Function-definition checks confirmed:

- worker claim selects only `pending` rows;
- claim uses `FOR UPDATE SKIP LOCKED`;
- failed retry is restricted to current active, visible, non-hidden, non-expired eligible Artifacts;
- ambiguous outcome writes `delivery_unknown`;
- promotion support accepts only `held` / `pending` outbox state and cannot mutate final/terminal delivery states.

## Board history / hide regression evidence

Production function and policy checks confirmed:

- Guest Board list filters `board_hidden_at is null`;
- Guest Artifact detail filters `board_hidden_at is null`;
- Guest interest interaction filters `board_hidden_at is null`;
- canonical Member reaction policy still permits visible `active / expired / archived` history;
- canonical Member response policy requires `active`, not expired, not hidden;
- Guest response policy requires `active`, not expired, not hidden.

This preserves the approved Board rule: historical objects remain readable/reactable, while new responses are frozen for historical rows; hidden objects leave ordinary Board interaction.

## Rollback-safe transactional production smoke

A real production transaction was executed with existing identities and fully rolled back. No synthetic memberships or role assignments were created.

Validated inside the transaction:

- Owner/Admin publishes temporary draft → one canonical Telegram outbox row in `held`;
- Owner/Admin manual promote → `pending`;
- Owner/Admin suppress → `suppressed`;
- Owner/Admin Board-hide on a held Artifact → Artifact hidden + outbox `suppressed`;
- ordinary active Member promotion-support attempt → `DEMENTOR_REQUIRED`;
- Owner/Admin promotion-support attempt → `OWNER_ADMIN_USE_OVERRIDE`;
- explicit Owner/Admin `delivery_unknown → cancelled` resolution succeeds.

After rollback:

- persisted QA Artifact rows = `0`;
- production outbox remains exactly `6 sent + 1 failed`.

Result: **PASS_ROLLED_BACK**.

## CI evidence

Integration-branch commit:

`0d3a927a92f5f750733a327a2d1981663b332417`

Site Integrity / Release Readiness:

- run `#970`;
- run id `34698779364`;
- conclusion `success`.

The workflow includes Board v2/v2.1 contracts, Batch A, Batch B, Board Telegram Promotion v1 contract, build, JS syntax, OAuth handoff and browser regression gates.

## Remaining G6 gaps

This evidence is not a full G6 promotion PASS.

Two live-path gaps remain:

1. **No current non-owner Dementor actor exists in production.** Read-only role inventory found Owner/Admin identities and ordinary active Members, but no current account that can exercise the canonical Dementor-only support path. Therefore the live `0/2 → 1/2 → 2/2` threshold and real concurrent Dementor support cannot be tested without inventing a synthetic role. That is prohibited by the project rules and was not done.
2. **The new Telegram worker runtime is not deployed.** DB worker functions and authority boundaries are installed and validated, but the live Edge worker is still the previous implementation. Trusted worker delivery, real Telegram ambiguous-outcome handling and live worker claim behavior remain pending a separately authorized worker deployment.

CI/static contract coverage for Dementor support and worker state semantics is green, but it does not substitute for these two live-path checks.

## Release boundary

Current factual state:

- production DB migration — applied and rollback-safe validated;
- integration CI — green;
- production frontend merge — **NOT AUTHORIZED / NOT DONE**;
- production site deploy — **NOT AUTHORIZED / NOT DONE**;
- Telegram Edge worker deploy — **NOT AUTHORIZED / NOT DONE**;
- Result G6 promotion validation — **ACTIVE / NOT PASS**.

`Commit ≠ merge ≠ deploy.`
