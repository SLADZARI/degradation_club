---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G3_BUILD_TELEGRAM_PROMOTION
status: ACTIVE
version: 0.6
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.5
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
changeDecision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
integrationBranch: agent/board-information-architecture-v1
productionBaseCommit: fe7a86a024f1c316c93b800ba66e70933082e927
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: true
---

# MP | Dementor Club | BUILD | Board Information Architecture v1 | Result v0.6

## Status

**ACTIVE / G3 BUILD — TELEGRAM PROMOTION PRE-RELEASE BATCH**

## Authority

Canonical Board IA:

`operations/BOARD_INFORMATION_ARCHITECTURE_V1.md`

Approved change Decision:

`operations/BOARD_TELEGRAM_PROMOTION_V1.md`

The project owner explicitly approved the Telegram Promotion Decision and requested continuation on 2026-09-12.

No parallel Result is created. Existing integration branch remains:

`agent/board-information-architecture-v1`

## Batch A closure

Batch A remains **G6A PASS**.

Production DB migrations already applied and evidenced:

- `board_information_architecture_batch_a`;
- `board_information_architecture_batch_a_security_hardening`.

Evidence:

`operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_PRODUCTION_DB_VALIDATION_2026-09-12.md`

## Batch B factual closure

Batch B taxonomy/filter implementation is built and CI-validated on the integration branch.

Production DB migrations applied:

- `board_information_architecture_batch_b_subtypes`;
- `board_information_architecture_batch_b_default_hardening`.

Production DB factual state after hardening:

- `artifact_type` table default = `announcement`;
- 8 persisted historical Artifacts = `announcement`;
- 0 drafts;
- canonical constraint allows only `announcement / post / idea / request`.

Validation:

- Site Integrity / Release Readiness `#953` — PASS;
- Site Integrity / Release Readiness `#954` — PASS;
- `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_B_PRODUCTION_DB_VALIDATION_2026-09-12.md`.

Production frontend remains not merged/deployed.

## Current pre-release batch objective

Implement the approved Board Telegram Promotion v1 flow without creating a second publication or delivery owner:

`Canonical Artifact → Board presentation → Dementor promotion decision → dc_distribution_outbox → Telegram`

### Included

1. `dc_artifacts.activity_at timestamptz null` and composer/card/detail presentation.
2. Dedicated immutable promotion-support ledger `dc_artifact_promotion_support`.
3. One canonical backend threshold owner with threshold `2`.
4. New outbox state vocabulary:
   - `held`;
   - `pending`;
   - `processing`;
   - `sent`;
   - `failed`;
   - `suppressed`;
   - `delivery_unknown`;
   - `cancelled`.
5. New publication flow ensures Telegram delivery row in `held` from the canonical backend publish path.
6. Remove frontend enqueue authority and close direct backend bypass.
7. Atomic support + threshold promotion.
8. Atomic worker claim and strict pending-only processing.
9. Ambiguous Telegram outcomes → `delivery_unknown`, no automatic retry.
10. Owner/Admin manual publish, suppression, Board-hide and explicit `delivery_unknown` resolution.
11. Trusted worker invocation boundary.
12. Concurrency, bypass, worker, browser and regression validation.

## Existing production outbox migration boundary

Current production historical outbox state before this batch is preserved:

- existing `sent` rows remain `sent`;
- existing `failed` rows remain historical `failed` unless separately handled;
- no historical row is mass-converted to `held` or reopened;
- prospective `held` semantics apply to new publication flow only.

## Hard boundaries

This batch must not:

- create a second Artifact publication owner;
- create a second Telegram delivery subsystem;
- reuse `starts_at` as activity datetime;
- merge support with reaction/response/relation semantics;
- change Membership lifecycle;
- change first-Artifact activation;
- change Artifact slot accounting;
- break Batch A history/Guest behavior;
- change Batch B subtype taxonomy/filter ownership;
- redesign Board spatial coordinates;
- implement generic relation graph early;
- create speculative multi-destination architecture;
- merge/deploy production frontend without separate authorization.

## Gate plan

`G3 BUILD` → tracked DB/worker/frontend implementation  
`G6 PROMOTION VALIDATION` → DB/RLS + concurrency + bypass + worker + browser + regression evidence  
`G7 RELEASE` → clean release candidate from current production baseline only after PASS and explicit merge/deploy authorization

## Authorization boundary

The owner previously authorized production DB mutation for this active Board Result with explicit instruction to minimize risk. Production merge and production site deploy remain separately unauthorized.

`Commit ≠ merge ≠ deploy.`
