---
artifactId: dementor-club.evidence.board-information-architecture-g8-scheduler-validation-scope-2026-09-12
project: dementor-club
documentType: QA_SCOPE
projectStage: CLEANUP
gate: G8_CLEANUP
status: VALIDATION_CANDIDATE
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
branch: agent/board-information-architecture-v1-g8
---

# G8 trusted worker scheduler — validation scope

## Before any production mutation

Required static/browser validation:

- existing Board A/B contracts PASS;
- Telegram Promotion contract PASS;
- new G8 cleanup ownership contract PASS;
- build and JS syntax PASS;
- Board fullscreen browser matrix PASS after browser trigger removal;
- Workspace recovery + My Artifacts PASS;
- production release gate PASS.

Required production compatibility inventory remains read-only:

- `pg_cron` and `pg_net` are available but currently not installed;
- `supabase_vault` and `pgcrypto` are installed;
- Vault currently has no project-created scheduler secret names;
- production has no evidenced cron worker job;
- no actionable pending/eligible failed row is required for zero-claim auth smoke.

## After separate production authorization

Order is mandatory:

1. apply scheduler migration;
2. verify extension presence, cron job, grants and Vault secret **names only**;
3. deploy worker candidate with `verify_jwt=false`: this worker is service-to-service and authenticates the trusted scheduler explicitly with the private `x-dc-worker-token`; ordinary callers remain rejected in the handler;
4. issue one trusted scheduler-token zero-claim request without creating an Artifact or outbox row;
5. verify an ordinary publishable/browser-style request without the private scheduler token is rejected;
6. only then release frontend removal of browser trigger;
7. retest Board desktop/mobile shell and outbox state.

Do not manufacture Telegram delivery, membership, Dementor role, support votes or outbox rows solely for QA.
