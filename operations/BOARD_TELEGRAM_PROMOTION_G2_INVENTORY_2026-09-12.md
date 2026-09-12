---
artifactId: dementor-club.evidence.board-telegram-promotion-g2-inventory-2026-09-12
project: dementor-club
documentType: INVENTORY
projectStage: BUILD
gate: G3_BUILD_TELEGRAM_PROMOTION
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

# Board Telegram Promotion v1 — existing-owner inventory

## Purpose

Inventory the existing publication, delivery, role and Board-hide equivalents before mutation. Existing owners are extended rather than duplicated.

## 1. Artifact publication owner

Canonical owner remains `public.dc_artifacts` + `public.dc_publish_artifact_v1(uuid)`.

Current production publish RPC:

- authenticates caller;
- enforces Membership or Owner/Admin;
- locks caller profile;
- normalizes the caller's expired live Artifact;
- locks the caller's draft;
- enforces existing slot accounting for non-Owner/Admin;
- transitions draft → active;
- does **not** currently create the Telegram outbox row inside the publication transaction.

Therefore the approved change should extend this function in place rather than add a second publication owner.

## 2. Current frontend bypass

Current integration Board composer still invokes `dc_enqueue_artifact_distribution_v1` after successful publication.

This follow-up call is not a safe authority boundary and must be removed after canonical publish itself ensures a `held` outbox row.

## 3. Existing delivery owner

Canonical Telegram delivery owner already exists:

`public.dc_distribution_outbox`

Existing uniqueness:

`UNIQUE (artifact_id, channel)`

Current production status vocabulary:

- `pending`;
- `processing`;
- `sent`;
- `failed`;
- `cancelled`.

Current table has no RLS policies and direct privileges are closed; worker/admin paths use privileged access.

Approved implementation must extend this same table with:

- `held`;
- `suppressed`;
- `delivery_unknown`.

No second Telegram queue table is justified.

## 4. Current direct enqueue authority

Current `dc_enqueue_artifact_distribution_v1(uuid,text)` is `SECURITY DEFINER`, executable by authenticated users, and currently allows the Artifact author to create the Telegram outbox row for their own active Community Artifact.

This is the exact backend bypass identified by the approved Decision.

Implementation must close this authority server-side. Keeping the function callable as an author-enqueue path would violate the Decision even if the frontend call were removed.

## 5. Current worker

Deployed Edge Function:

`telegram-outbox-worker`, production version 9, JWT verification enabled.

Current behavior:

- wrapped with user authentication;
- reads both `pending` and `failed` rows;
- claims the selected current row state directly to `processing`;
- retries failures up to five attempts;
- converts general delivery exceptions to `failed` with `available_at + 5 minutes`;
- does not distinguish known non-delivery from ambiguous post-dispatch outcome;
- can therefore automatically retry a case where Telegram may already have accepted the message.

Approved implementation must change this to:

- trusted operational invocation only;
- pending-only atomic claim;
- controlled `failed → pending` retry path if retained;
- ambiguous post-dispatch outcome → `delivery_unknown`;
- no automatic retry from `delivery_unknown`.

## 6. Current production outbox data boundary

Read-only production snapshot before the promotion migration:

- 7 Telegram outbox rows total;
- 6 `sent`;
- 1 `failed`;
- 0 `pending`;
- 0 `processing`.

The historical failed row is already exhausted at 5 attempts and records `Artifact is no longer distributable`.

Approved migration must preserve all seven historical rows exactly by identity/current state. No mass conversion to `held` or reopening is authorized.

## 7. Role owner

Canonical role checks already exist:

- `dc_has_role(role, profile_id)`;
- `dc_is_owner_admin(profile_id)`.

Dementor support should use existing canonical role assignment authority via `dc_has_role('dementor', actor)` at action time.

Owner/Admin must be rejected from the support path even if the account separately has Dementor role authority.

## 8. Activity datetime

`dc_artifacts.starts_at` already participates in Board visibility gating. It must not be reused for activity meaning.

No existing `activity_at` equivalent was found on `dc_artifacts`.

Approved extension:

`dc_artifacts.activity_at timestamptz null`

## 9. Board-hide equivalent

Schema inventory found no existing `hidden`, `board_hidden`, `hide` or moderation-state column/table in the public Board model.

A new narrow Board presentation state is therefore justified. It must not redefine Artifact lifecycle status or delete history.

For the pre-release Artifact-only scope, the minimal extension is Board-specific metadata on the existing Artifact row (`board_hidden_at`, `board_hidden_by`) rather than a second Artifact lifecycle/table.

## 10. Support equivalent

No existing table represents immutable Dementor promotion support distinct from reactions, Guest interest or responses.

A dedicated `dc_artifact_promotion_support` ledger is justified and explicitly approved. It must remain separate from the later generic Board relation graph.

## 11. Threshold owner

No promotion threshold owner currently exists.

Implementation should establish one backend canonical threshold function/value and expose the resolved threshold through promotion-state reads, so frontend does not become authority for the number `2`.

## 12. Implementation boundary

Use existing owners where available:

- publish → extend `dc_publish_artifact_v1`;
- delivery → extend `dc_distribution_outbox`;
- role checks → reuse `dc_has_role` / `dc_is_owner_admin`;
- Board cards/detail → extend existing Board/detail controllers;
- worker → update existing `telegram-outbox-worker`.

Create only genuinely missing state:

- `activity_at`;
- Artifact Board-hide metadata;
- immutable promotion support ledger;
- narrow promotion/admin RPCs.

No production frontend merge/deploy is authorized by this inventory.
