---
artifactId: dementor-club.plan.board-information-architecture-batch-a-2026-09-12
project: dementor-club
documentType: IMPLEMENTATION_PLAN
projectStage: BUILD
gate: G3_BUILD_BATCH_A
status: READY_FOR_BUILD
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
result: dementor-club.result.board-information-architecture-v1
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
inventoryEvidence: operations/BOARD_INFORMATION_ARCHITECTURE_G2_CLOSURE_2026-09-12.md
branch: agent/board-information-architecture-v1
productionBaseline: fe7a86a024f1c316c93b800ba66e70933082e927
---

# Board Information Architecture v1 — Batch A Build Plan

## Goal
Implement the smallest coherent slice that makes Community Board truth persistent across time and begins canonical entity projection without creating new Board/history/entity owners.

Batch A is intentionally narrower than the full approved architecture.

## Scope

### Included

1. Artifact lifecycle normalization.
2. Current + historical Artifact rendering for Member/Dementor/Owner Admin.
3. Current + historical Artifact rendering for authenticated Guest/Applicant.
4. Guest historical Artifact detail access through a Board-safe read owner.
5. Historical reactions enabled; historical new responses frozen.
6. Canonical Event/Program/Project projections enabled on fullscreen Board through a Board-safe projection read owner.
7. Existing Artifact positions preserved; deterministic fallback for historical rows without positions.
8. Existing deterministic projection placement reused.

### Excluded

- Artifact subtypes;
- approved object-type filter rewrite;
- generic relation table/UI;
- Person↔Entity participation UI;
- board-hide;
- final continuous-aging formula;
- coordinate schema redesign;
- retirement of current drag livefix;
- production merge/deploy/live DB mutation.

## Canonical owner map

| Responsibility | Extend | Do not create |
|---|---|---|
| Artifact lifecycle | `dc_artifacts` + one normalization DB function | second history table |
| Guest Board list | `dc_guest_board_read_v1` owner | parallel Guest list API |
| Member Board list | `community/board/board.js` | second Member Board loader |
| Guest interest | `dc_guest_board_interest_toggle_v1` | second historical reaction table |
| Member reaction | existing `dc_artifact_reactions` + RLS | historical reaction duplicate |
| Responses | existing Member/Guest response paths | history response subsystem |
| Artifact detail | `community/artifact/artifact.js` + one Board-safe Guest detail RPC | duplicate detail page |
| Entity projection | `board-entity-model-v1.js` + `board-integrations-v1.js` + one safe projection RPC | second entity store |
| Artifact positions | `dc_artifact_board_positions` + existing spatial fallback | history positions table |
| Projection positions | existing deterministic platform placement | projection positions table in Batch A |

## Database migration shape

One tracked Batch A migration should contain only compatible owner extensions:

1. `dc_normalize_artifact_lifecycle_v1()`
   - moves Community `active` Artifacts with `expires_at <= now()` to `expired`;
   - idempotent;
   - no deletion;
   - returns normalized row count for contract tests.

2. `dc_guest_board_read_v1`
   - evolves existing canonical Guest Board read owner;
   - calls lifecycle normalizer before read;
   - returns `active / expired / archived` published Community Artifacts;
   - includes `status`, `closed_at`, existing board coordinates and safe author/reaction/Guest-interest fields;
   - does not expose draft/removed/publishing rows.

3. `dc_guest_board_interest_toggle_v1`
   - permits Board-readable `active / expired / archived` published Community Artifacts;
   - continues rejecting Members/Owner Admin so canonical Member reactions remain separate.

4. Member reaction INSERT RLS
   - keeps own-profile + Member/Owner authorization;
   - changes target predicate from current-only to Board-readable `active / expired / archived` Community Artifact.

5. `dc_guest_board_artifact_detail_read_v1(p_artifact_id)`
   - SECURITY DEFINER safe read;
   - authenticated non-member states only;
   - returns one JSON/detail record with Board-approved Artifact fields, public author identity, Member reaction count, Guest-interest count/state, own Guest response state, and attached media descriptors;
   - excludes unrelated private responses and canonical entity internals.

6. Narrow storage SELECT policy for Guest Board media
   - only objects referenced by `dc_artifact_media` attached to published Board-readable Community Artifacts;
   - no draft-media access;
   - does not broaden bucket-wide Guest access.

7. `dc_board_entity_projection_read_v1()`
   - authenticated Board read;
   - SECURITY DEFINER safe projection owner;
   - returns only confirmed `event / program / project` source fields plus `dc_events` / `dc_programs` projection fields;
   - does not change `dc_can_read_entity` or canonical entity RLS;
   - Board visibility status mapping remains in the existing Board entity model for this batch, then is regression-tested against source rows.

## Frontend file diff

### `community/board/board.js`
- call lifecycle normalizer once before Member Board load, or consume a canonical Board read path that already does it;
- select statuses `active / expired / archived`;
- remove client expiry exclusion;
- add stable `data-artifact-status` / `is-history` marker;
- historical reaction button remains enabled;
- historical response button disabled/absent;
- closing already archived/expired remains governed by canonical close semantics.

### `community/board/board-entry-v2.js`
- consume expanded Guest Board result;
- render status/history marker;
- update empty-state language from “no live artifacts” to true Board/history state;
- keep Guest interest owner;
- do not introduce Guest composer.

### `community/artifact/artifact.js`
- resolve Board user state rather than only `membership_active`;
- Member/Owner path may keep direct canonical reads under existing RLS;
- Guest/Applicant path uses `dc_guest_board_artifact_detail_read_v1`;
- Guest historical reactions call Guest-interest owner;
- historical response CTA disabled;
- live Guest response uses existing Guest response RPC;
- no private response disclosure.

### `community/board/board-integrations-v1.js`
- remove fullscreen “notice-only” early return;
- load canonical projections via `dc_board_entity_projection_read_v1` instead of direct `dc_entities/dc_events/dc_programs` queries;
- reuse `entityToBoardProjection`, filters and projection render owner;
- do not add new projection component.

### `community/board/board-spatial-v1.js`
- no new persistent owner;
- historical Artifact rows use existing position map or deterministic fallback;
- canonical projections use existing deterministic platform placement;
- no projection movement in Batch A.

## Spatial guardrail

Do not merge display-world and persisted-coordinate spaces in Batch A.

Current compatibility:

- display world: `12000×8000`;
- DB position domain: `0..5000 × 0..3500`;
- own-drag livefix applies display offset and persists raw coordinates.

Any Batch A card-placement change must pass reload and phone↔desktop persistence regression before touching this compatibility layer.

## Contract tests required before G6A

1. Normalizer is idempotent.
2. Stale active row becomes expired; archived remains archived.
3. Guest Board read returns active + expired + archived, excludes draft/removed.
4. Guest history reaction succeeds.
5. Guest historical response fails.
6. Member history reaction succeeds.
7. Member historical response fails.
8. Guest detail read returns Board-readable history and rejects draft/removed/non-Board targets.
9. Guest media read is limited to published Board-readable Artifact media.
10. Entity projection RPC returns only confirmed canonical projection records and does not alter canonical entity access policies.
11. Existing Artifact positions remain unchanged.
12. Missing historical position renders deterministically without a new table.

## Browser validation required before G6A PASS

Sequential states:

- Authenticated Guest DC9 incomplete;
- Guest DC9 complete;
- Applicant;
- Member first Artifact;
- Member activated;
- Dementor;
- Owner Admin.

For each applicable state verify:

- Board opens under current authority;
- current + historical Artifact visibility;
- historical detail open;
- reaction behavior;
- response-negative on history;
- pan/zoom/focus/open;
- create CTA boundary;
- no membership/role drift.

Also verify:

- desktop + mobile;
- existing own-card persisted location survives reload;
- historical missing-position card is stable across reload;
- entity projection opens its canonical route;
- Workspace/Public Header ownership unchanged.

## Release boundary

Batch A build and validation are integration-branch work only.

Production merge: **NOT AUTHORIZED**.  
Production deploy: **NOT AUTHORIZED**.  
Live Supabase mutation: **NOT AUTHORIZED**.

A tracked migration may be committed, but committing SQL is not applying it to live Supabase.
