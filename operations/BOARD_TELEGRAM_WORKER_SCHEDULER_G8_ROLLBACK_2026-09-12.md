---
artifactId: dementor-club.evidence.board-telegram-worker-scheduler-g8-rollback-2026-09-12
project: dementor-club
documentType: ROLLBACK_PLAN
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

# Trusted worker scheduler — rollback boundary

If production scheduler validation fails, rollback must preserve Board data and promotion state.

## Safe rollback order

1. Unschedule only cron job `dc-telegram-outbox-worker-v1`.
2. If worker auth is implicated, redeploy known-good worker v10 source blob `0d61d6091c84352fc90f7537f5be510cf3451f14` with `verify_jwt=true`.
3. Do **not** restore browser worker trigger as processing authority.
4. Keep outbox rows in their current canonical states; do not mass-rewrite `held/pending/processing/sent/failed/delivery_unknown`.
5. Generated Vault scheduler secret may remain inert. Do not expose/decrypt it for manual recovery.
6. Keep `pg_cron` / `pg_net` installed unless a separate inventory proves they have no other users; extension removal is broader than this correction.
7. If frontend cleanup was already deployed, it may remain without browser trigger while trusted scheduling is paused; Owner/Admin promotion rows remain safely queued rather than being processed by an unauthorized client.

## Data preservation

Rollback does not delete:

- Artifacts;
- promotion support ledger;
- distribution outbox;
- external Telegram references;
- Board positions/history;
- membership/role state.

No rollback step authorizes duplicate Telegram delivery.
