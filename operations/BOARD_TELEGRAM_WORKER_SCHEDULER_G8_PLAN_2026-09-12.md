---
artifactId: dementor-club.evidence.board-telegram-worker-scheduler-g8-plan-2026-09-12
project: dementor-club
documentType: IMPLEMENTATION_PLAN
projectStage: CLEANUP
gate: G8_CLEANUP
status: VALIDATION_CANDIDATE
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
branch: agent/board-information-architecture-v1-g8
productionBaseCommit: 8adee2d8708393d7ba56de0bc53790152fb5c69c
---

# Board Telegram worker — G8 trusted scheduler correction

## Problem

Worker v10 correctly rejects ordinary authenticated browser invocation, but the canonical Board still shipped a browser trigger and no trusted automatic invoker was evidenced. A legitimate `pending` outbox row therefore had no canonical automatic execution path.

## Candidate

One operational owner remains `telegram-outbox-worker`; no second delivery mechanism is introduced.

The candidate adds:

- `pg_cron` + `pg_net` scheduler infrastructure;
- scheduler inputs in Supabase Vault;
- a random scheduler token generated inside Postgres;
- service-role-only token validation RPC;
- one canonical cron job `dc-telegram-outbox-worker-v1`;
- a scheduler tick that calls the existing Edge worker only when actionable outbox work exists;
- worker auth that permits direct service-role operation or the Vault-backed DB scheduler token, but never an ordinary user session;
- removal of the Board-owned browser worker trigger and retirement of v1/v2/v3 trigger files;
- contract assertions preventing browser worker ownership from returning.

## Security boundary

- browser does not receive scheduler token;
- scheduler token plaintext is not committed;
- scheduler token is stored in Vault;
- validator returns only boolean and is executable only by `service_role`;
- worker retains internal service-role DB access;
- worker request still must pass the Supabase Edge gateway using the project publishable key, matching the supported Supabase Cron → Edge Function pattern;
- real Telegram delivery is not manufactured for QA.

## Planned production sequence after explicit authorization

1. apply scheduler migration;
2. verify extensions, Vault names, validator grants and canonical cron job without exposing decrypted secret values;
3. deploy worker candidate with `verify_jwt=true`;
4. perform scheduler-auth zero-claim smoke while there are no actionable rows;
5. verify ordinary user invocation remains rejected;
6. merge/deploy frontend cleanup removing browser trigger;
7. retest Board and inspect cron/Edge logs;
8. only then continue G8 branch/runtime cleanup.

## Rollback boundary

If scheduler validation fails:

- unschedule only `dc-telegram-outbox-worker-v1`;
- redeploy known-good worker v10 if worker auth is implicated;
- do not reopen ordinary authenticated browser processing authority;
- leave generated Vault secret inert rather than exposing/decrypting it for manual recovery;
- extensions may remain installed because removing extensions is broader than this Result and can destroy unrelated future jobs.

No production action is authorized by this plan alone.
