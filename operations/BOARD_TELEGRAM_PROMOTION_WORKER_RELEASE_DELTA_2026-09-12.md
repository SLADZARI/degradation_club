---
artifactId: dementor-club.evidence.board-telegram-promotion-worker-release-delta-2026-09-12
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: BUILD
gate: G6_PROMOTION_VALIDATION
status: PRE_DEPLOY_EVIDENCE
version: 1.0
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
decision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
---

# Board Telegram Promotion v1 — worker release delta — 2026-09-12

## Purpose

Record the exact delta between the currently deployed Telegram worker and the validated candidate before any worker deployment is authorized.

This document is evidence only. It does not authorize deployment.

## Production worker now

Supabase production function:

- slug: `telegram-outbox-worker`;
- status: `ACTIVE`;
- deployed version: `9`;
- `verify_jwt: true`.

The deployed v9 worker:

- uses `withSupabase({ auth: "user" })`;
- obtains `supabaseAdmin` inside the function;
- directly reads `dc_distribution_outbox` rows with status `pending` **or** `failed`;
- directly mutates outbox rows to `processing / sent / failed`;
- does not use the new service-role-only worker RPC boundary;
- has no `delivery_unknown` distinction;
- treats all delivery failures as retryable `failed`;
- does not check `board_hidden_at`;
- does not include `activity_at` in Telegram output.

This is the pre-Decision runtime and must not be treated as the canonical worker for Telegram Promotion v1.

## Validated candidate

Integration branch:

`agent/board-information-architecture-v1`

Candidate path:

`supabase/functions/telegram-outbox-worker/index.ts`

Candidate properties:

- requires POST;
- requires the exact service-role Bearer credential in the worker request;
- uses service-role client only after trusted-request verification;
- requeues eligible known failed deliveries through `dc_distribution_requeue_failed_v1`;
- atomically claims only `pending` rows through `dc_distribution_claim_pending_v1`;
- relies on DB `FOR UPDATE SKIP LOCKED` claim authority;
- checks Artifact is still `active / community / not board-hidden` before delivery;
- includes `activity_at` in the Telegram text when present;
- marks confirmed Telegram success via `dc_distribution_mark_sent_v1`;
- marks known non-delivery via `dc_distribution_mark_failed_v1`;
- marks network/5xx/ambiguous external outcome via `dc_distribution_mark_unknown_v1`;
- if Telegram success is known but the DB `sent` write fails, attempts to persist `delivery_unknown` instead of blindly retrying;
- does not auto-retry `delivery_unknown`.

## Production transitional-state safety

After the DB migrations and before worker deployment:

- new Artifact publication creates outbox status `held`;
- deployed v9 worker does **not** select `held`, so it cannot bypass the new promotion gate for newly published Artifacts;
- production currently contains no `pending` row;
- the only `failed` historical outbox row has `attempts = 5`, while deployed v9 selects only rows with `attempts < 5`, so it is not eligible for another v9 retry;
- that failed row belongs to an archived/expired historical Artifact;
- production database has neither `pg_cron` nor `pg_net` extension installed, so no database-owned cron/net invocation path exists.

An external scheduler or manual invocation outside Postgres cannot be proven absent from database inventory alone. This is a release-environment question, not a schema claim.

## Why worker deploy remains a separate release action

DB authority is already installed, but deploying the candidate changes the trusted external-delivery runtime and invocation contract. That is a production deployment boundary, not a database migration detail.

Required before worker deploy:

- explicit worker deployment authorization;
- preserve existing `TELEGRAM_BOT_TOKEN` and `TELEGRAM_COMMUNITY_CHAT_ID` secrets;
- keep `verify_jwt` enabled;
- ensure the invoking scheduler/job can provide the service-role Bearer credential expected by the candidate;
- post-deploy smoke must not manufacture a real club post merely for QA;
- if no legitimate `pending` item exists, verify worker auth/claim returns zero claimed rather than synthesizing delivery data.

## Current conclusion

The DB-first transition is safe for new publications because `held` is invisible to deployed v9. The live worker remains semantically obsolete for the approved Promotion v1 contract and should be replaced only as an explicitly authorized, isolated deployment.
