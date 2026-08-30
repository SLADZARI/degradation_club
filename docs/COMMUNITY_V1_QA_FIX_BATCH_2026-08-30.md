# Community v1 — production QA fix batch

Date: 2026-08-30  
Status: IMPLEMENTATION CANDIDATE / NOT DEPLOYED

This batch implements the approved production QA clarifications from `dementor-club/community/MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md` section 20.

## Included

- Artifact external URL client validation and safe `https://` normalization;
- composer state preserved on validation/server failure;
- human-facing errors instead of raw PostgreSQL constraint text;
- past expiry blocked before RPC;
- Member contact provider inferred from Telegram / Instagram / LinkedIn URLs;
- first stable attachment policy: one image, JPG/PNG/WebP, max 4 MiB;
- compact in-place explanation of “Если бы вы были дементором…” preserving `Member ≠ Dementor`;
- source-backed Board records for existing approved routes only;
- non-blocking Telegram distribution outbox boundary after successful Artifact publication;
- CI regression checks including JavaScript syntax parsing for changed authenticated runtimes.

## Explicit non-goals

- no Telegram bot/worker deployment in this batch;
- no one-topic-per-Artifact mechanic;
- no public Board;
- no new roles, points, paid mechanics or Artifact taxonomy;
- no fabricated historical content.

## Source-backed Board records in this candidate

Only routes already present in the production repository are surfaced:

- `/projects/logic-awareness/` — project;
- `/objects/001-ne-nado/` — club object;
- `/courses/dumai-s-opasnostyu/` — course.

They are presented as Club records, not as Member Artifacts, and therefore do not alter live Artifact count or slot mechanics.

## Required QA before merge

1. Production Candidate Integrity must pass, including interactive runtime safety.
2. Migration must succeed in rollback/dry-run against current live schema.
3. Bare `linkedin.com/...` must normalize to HTTPS before RPC.
4. `javascript:` / malformed URL must be rejected client-side.
5. Past expiry must be rejected without replacing composer.
6. JPG/PNG/WebP <=4 MiB accepted by client contract; PDF/TXT and >4 MiB rejected.
7. Member identity must infer LinkedIn / Instagram / Telegram from URL.
8. Board explainer and source-backed records must not create horizontal overflow on mobile.
9. Outbox enqueue must be idempotent and must not make Artifact publication dependent on Telegram.
10. No implementation is considered production-verified until a real browser Artifact is successfully published after deploy.
