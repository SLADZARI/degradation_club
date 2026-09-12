---
artifactId: dementor-club.evidence.board-information-architecture-g8-cleanup-inventory-2026-09-12
project: dementor-club
documentType: INVENTORY
projectStage: CLEANUP
gate: G8_CLEANUP
status: ACTIVE_EVIDENCE
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.board-information-architecture-v1
productionCommit: 8adee2d8708393d7ba56de0bc53790152fb5c69c
---

# Board Information Architecture v1 — G8 cleanup inventory — 2026-09-12

## Release baseline

Current production frontend baseline:

`8adee2d8708393d7ba56de0bc53790152fb5c69c`

Deploy Dementor Production #59 is successful. Owner live screenshot confirms the corrected persistent-history copy on `/workspace/artifacts/`.

## 1. Release branches

Board-related branch inventory currently includes:

- active Result integration branch: `agent/board-information-architecture-v1`;
- released corrective branches: `release/board-ia-live-retest-001`, `release/board-ia-live-retest-002`;
- numerous older Board implementation/hotfix branches predating the current Result.

The two `release/board-ia-live-retest-*` branches are stale release-candidate branches after successful production merges and are cleanup candidates. The Result integration branch must not be removed before final Result closure.

Older Board branches require merge/relevance checks before deletion; branch age/name alone is not authority.

## 2. Telegram worker trigger ownership — G8 blocker found

Canonical Workspace Board currently loads:

`community/board/telegram-worker-trigger-v3.js`

That browser script obtains the ordinary authenticated session and invokes `telegram-outbox-worker` from the client.

Production worker v10 now explicitly requires:

`Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>`

and returns HTTP 403 for ordinary authenticated invocations.

Therefore the current v3 browser trigger is no longer a valid worker authority. It is a compatibility remnant from the previous worker model.

Production also still ships:

- `telegram-worker-trigger-v1.js`;
- `telegram-worker-trigger-v2.js`;
- `telegram-worker-trigger-v3.js`.

v1/v2 are not loaded by the canonical Workspace Board entry. v3 is loaded but cannot satisfy worker v10 authorization.

## 3. Trusted scheduler inventory

Read-only production DB inspection on 2026-09-12:

- `supabase_vault` extension: present;
- `pg_cron`: absent;
- `pg_net`: absent.

Canonical production repository workflow inventory contains only site deploy/integrity/asset workflows; no scheduled Telegram worker workflow is present.

No other trusted worker invoker has yet been evidenced.

### Implication

The delivery state machine itself is released and protected, but a legitimate row reaching `pending` currently has no evidenced trusted execution path to worker v10.

This converts the prior “external Telegram delivery not yet observed” item into a concrete G8 runtime blocker: **trusted worker scheduling/invocation must exist before Result closure.**

Do not solve this by reopening ordinary authenticated browser invocation. The approved trust boundary remains: ordinary Guest/Member/Dementor sessions do not own worker processing authority.

## 4. Safe corrective direction

Preferred correction must preserve the approved authority boundary:

1. establish one trusted scheduler/service invoker for worker v10+;
2. validate a zero-claim invocation first;
3. only after trusted scheduling exists, remove browser worker-trigger compatibility scripts from the canonical Board runtime;
4. retire v1/v2/v3 files if repository-wide reference inventory confirms no remaining owner;
5. add a release-contract assertion preventing client-side worker invocation from returning;
6. do not manufacture a real Telegram delivery solely for QA.

Exact scheduler implementation remains an implementation detail, but it must not expose the Supabase service-role key to browser code or stored public content.

## 5. Spatial/runtime overlap retained for now

Existing Board spatial layers still include overlapping responsibilities across:

- `board-spatial-v1.js`;
- `board-layout-v2.js`;
- `board-own-drag-livefix-v2-1.js`.

Prior inventory established a real world-coordinate vs DB-coordinate compatibility mismatch. These layers are **not safe deletion candidates merely because they overlap**. Consolidation requires its own sequential desktop/mobile drag/reload evidence. For G8, retain unless a no-behavior-change cleanup can be proved.

## 6. QA and semantic cleanup

Authenticated live target routes are PASS and `QA-BOARD-LIVE-001/002` are closed.

Still deferred, not fabricated:

- real non-owner Dementor `0/2 → 1/2 → 2/2` support;
- all eight states as legitimate live production actors;
- external Telegram delivery after a legitimate row reaches pending.

The missing trusted worker invoker itself is **not deferred**; it is a concrete runtime ownership gap and must be corrected before G8 closure.

## Current G8 status

**G8 CLEANUP ACTIVE / NOT DONE**

Immediate blocker:

`trusted worker scheduler/service invocation absent; browser trigger obsolete under worker v10 trust contract`.
