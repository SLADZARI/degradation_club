---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G3_BUILD_BATCH_B
status: ACTIVE
version: 0.5
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.4
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
integrationBranch: agent/board-information-architecture-v1
productionBaseCommit: fe7a86a024f1c316c93b800ba66e70933082e927
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: true
---

# MP | Dementor Club | BUILD | Board Information Architecture v1 | Result v0.5

## Status
**ACTIVE / G3 BUILD — BATCH B**

## G6A closure

Batch A validation is **PASS** for the pre-release gate.

Evidence:

- Site Integrity / Release Readiness `#940` — PASS before production DB application;
- Site Integrity / Release Readiness `#943` — PASS on the exact post-hardening/evidence integration head;
- `operations/BOARD_INFORMATION_ARCHITECTURE_BATCH_A_PRODUCTION_DB_VALIDATION_2026-09-12.md`;
- production DB lifecycle normalization: 3 stale active Artifacts normalized to `expired`;
- authenticated Guest history read: PASS;
- Guest expired Artifact detail: PASS;
- Guest historical interest: PASS in rollback-safe transaction;
- historical Guest response negative: PASS;
- Member historical reaction: PASS in rollback-safe transaction;
- canonical entity projection RPC: PASS;
- anonymous execute on `dc_guest_board_read_v1()`: revoked; authenticated execute retained;
- post-DDL security advisor: no remaining new anon SECURITY DEFINER finding attributable to Batch A.

G6A PASS is **not** a production-code release claim. The Batch A frontend remains on the integration branch until a later authorized release.

## Production DB authorization

Project owner explicitly authorized production database mutation for this Result on 2026-09-12 with risk minimization.

Applied Batch A migrations:

- `board_information_architecture_batch_a`;
- `board_information_architecture_batch_a_security_hardening`.

Production merge/deploy remain separately unauthorized.

## Batch B objective

Implement the approved Board taxonomy without introducing a second publication owner.

Batch B scope:

1. Canonical Artifact subtypes:
   - `announcement`;
   - `post`;
   - `idea`;
   - `request`.
2. Migrate legacy `notice` semantics into the canonical subtype family without losing Artifact IDs/history/positions/reactions/responses.
3. Preserve Artifact slot, authoring and moderation semantics.
4. Canonical visible filters:
   - Объявления / публикации;
   - События;
   - Курсы / программы;
   - Практики;
   - Проекты / продукты;
   - Статьи / контент.
5. Default view remains `ВСЁ`.
6. Remove `ФОРМИРУЕТСЯ` as a global Board filter.
7. Do not introduce a lifecycle filter.
8. Retain source dimensions only if they remain non-duplicative; Workshop 02 selected `ВСЁ` as the only required source filter.

## Hard boundaries

Batch B must not:

- create a new publication/content table;
- turn Article/Content into a new CMS;
- change membership, first-Artifact activation or slot accounting;
- introduce relation schema/UI early;
- change Board hide/continuous aging early;
- merge/deploy production code without separate authorization.

## Current branch

`agent/board-information-architecture-v1`

`Commit ≠ merge ≠ deploy.`
