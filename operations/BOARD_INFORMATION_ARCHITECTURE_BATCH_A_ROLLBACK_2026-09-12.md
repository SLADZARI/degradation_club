---
artifactId: dementor-club.evidence.board-information-architecture-batch-a-rollback-2026-09-12
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G6A_VALIDATION
status: DRAFT
version: 0.1
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_EVIDENCE
result: dementor-club.result.board-information-architecture-v1
branch: agent/board-information-architecture-v1
---

# Board Information Architecture v1 — Batch A rollback notes

This document is a rollback/readiness note only. It does not authorize migration, production merge, deployment, or live database mutation.

## Scope of tracked migration

`supabase/migrations/20260912131000_board_information_architecture_batch_a.sql`

The migration changes existing canonical Board access/runtime contracts without creating a second Board/history owner:

- adds `dc_normalize_artifact_lifecycle_v1()`;
- replaces `dc_guest_board_read_v1()` with an expanded history-aware return shape;
- replaces `dc_guest_board_interest_toggle_v1(uuid)` with history-aware behavior;
- replaces the Member reaction INSERT policy to permit reactions on historical Community Artifacts;
- adds `dc_guest_board_artifact_detail_read_v1(uuid)`;
- adds `dc_can_read_guest_board_media_v1(text,text)` and one Storage SELECT policy for Board Guests;
- adds `dc_board_entity_projection_read_v1()`.

No new history table and no generic relation table are introduced in Batch A.

## Rollback principle

Rollback must restore the exact pre-Batch-A function/policy definitions from the production baseline used by this Result rather than inventing alternate compatibility owners.

Production baseline for this Result:

`dementor-club-production@fe7a86a024f1c316c93b800ba66e70933082e927`

Required restoration targets if Batch A is ever applied and must be rolled back:

1. drop the newly introduced functions:
   - `dc_normalize_artifact_lifecycle_v1()`;
   - `dc_guest_board_artifact_detail_read_v1(uuid)`;
   - `dc_can_read_guest_board_media_v1(text,text)`;
   - `dc_board_entity_projection_read_v1()`;
2. drop `dc_community_artifacts_storage_select_board_guests`;
3. restore the previous `dc_guest_board_read_v1()` definition and return shape from the production baseline;
4. restore the previous `dc_guest_board_interest_toggle_v1(uuid)` definition from the production baseline;
5. restore the previous `dc_artifact_reactions_insert_own` policy from the production baseline.

## Lifecycle data caveat

`dc_normalize_artifact_lifecycle_v1()` performs a real data transition:

`active + expires_at <= now() → expired`.

That transition is semantically correct under the approved Board Information Architecture, but it is not safely reversible by a generic rollback because an `expired` row may have been expired before Batch A or may have legitimately changed after migration application.

Therefore, if a production rollout is ever authorized, pre-migration evidence must capture the IDs/status/expires_at values of rows that satisfy:

`visibility='community' AND status='active' AND published_at IS NOT NULL AND expires_at IS NOT NULL AND expires_at <= now()`.

Only that explicit pre-migration set could be considered for a targeted data rollback, and only if no subsequent legitimate lifecycle changes occurred. No blanket `expired → active` rollback is acceptable.

## Frontend rollback

Frontend rollback is the inverse diff of the Batch A integration commit set for:

- `community/board/board-entry-v2.js`;
- `community/board/board.js`;
- `community/artifact/artifact.js`;
- `community/board/board-integrations-v1.js`;
- Batch A validation additions.

Existing spatial owners are not modified by Batch A and therefore do not require spatial-schema rollback.

## Release safety condition

Before any future live application, release evidence must include:

- exact pre-migration stale-active Artifact set;
- exact pre-migration definitions of replaced RPCs/policies;
- migration success evidence;
- post-migration role-state read/write verification;
- confirmation that production rollback can restore code and schema from the same production baseline.

Until live DB mutation is explicitly authorized, this remains preparation/evidence only.
