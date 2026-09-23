---
artifactId: dementor-club.evidence.artifact-collaboration-backend-g5-2026-09-24
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: PASS_STATIC
version: 1.0
updated: 2026-09-24
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
productionBaseCommit: df8a24eca2bcca25339f128c7da93982515cf442
candidateBranch: result/artifact-collaboration-v1
candidateCommit: 06ba2aa94c990a2e0bce4a6729a4f6963acb0e19
liveDatabaseMutationAuthorized: false
---

# Artifact Collaboration v1 — Backend G5 checkpoint

## Verdict

G4 owner contract: PASS.

G5 branch schema draft: CREATED.

G5 static security preflight: PASS.

SQL execution validation: NOT RUN.

LIVE DB APPLY: NOT AUTHORIZED / NOT RUN.

G6: NOT ENTERED.

This checkpoint does not claim that the migration has executed successfully against PostgreSQL.

No DDL or DML mutation was sent to the live Supabase project, including no transactional rollback smoke.

## Exact identities

Production baseline remains df8a24eca2bcca25339f128c7da93982515cf442.

Production branch was rechecked after branch work and still resolved to that exact SHA.

Backend candidate is result/artifact-collaboration-v1 at 06ba2aa94c990a2e0bce4a6729a4f6963acb0e19.

Compare against production:

- ahead_by = 8;
- behind_by = 0;
- merge base = exact production baseline;
- Result-owned diff = 4 files.

Changed files:

1. operations/ARTIFACT_COLLABORATION_BACKEND_G4_CONTRACT_2026-09-24.md
2. supabase/migrations/20260924002500_artifact_collaboration_v1.sql
3. scripts/validate-artifact-collaboration-v1.mjs
4. .github/workflows/site-integrity.yml

## Live inventory was read-only

Supabase project: mmekfydwbvptbdatwitj.

Live migration head observed: 20260921134959_public_activity_truth_boundary_v1.

Proposed migration timestamp: 20260924002500_artifact_collaboration_v1.

Timestamp collision: none observed.

No apply_migration, raw DDL, DML write, Storage mutation, Auth mutation or Edge Function deploy was performed.

## Exact owner contract outcome

No equivalent Dementor Club Artifact participation or CIRCLE ACL owner exists.

Rejected collisions:

- mp_accept_client_team_invite belongs to WeeklyOS / MP project-client assignment;
- mp_project_artifact_access is an MP project artifact-key ACL;
- generic Board Person relation is forbidden by approved authority.

Existing canonical owners are composed and extended:

- dc_artifacts;
- profiles;
- dc_artifact_slot_grants;
- dc_artifact_media and the private dc-community-artifacts bucket;
- dc_artifact_reactions, dc_guest_board_interests and dc_artifact_responses;
- dc_artifact_board_positions;
- dc_board_relations;
- Share/Auth return;
- Telegram outbox/worker;
- fail-closed Public Activity.

Exactly one new persistence owner is justified: dc_artifact_participation_events.

## Branch migration scope

The branch migration:

- extends dc_artifacts.visibility to COMMUNITY/CIRCLE with CIRCLE restricted to Idea;
- adds append-only INVITED/JOINED/DECLINED/LEFT/REMOVED transitions;
- validates invite targets against existing registered profiles;
- exposes bounded safe profile lookup without email;
- keeps author ownership solely in dc_artifacts.author_profile_id;
- composes CIRCLE read through Artifact, Guest Board/detail, media, Storage, reaction/response and relation boundaries;
- preserves INVITED as read plus accept/decline only;
- gives JOINED participant only the approved extra RELATED_TO relation write;
- limits participant relation deletion to their own created edge while still JOINED;
- reuses dc_artifact_slot_grants;
- adds Owner Admin slot grant RPC with actor and source provenance;
- keeps capacity visibility-neutral and preserves Owner Admin-only bypass;
- extends the existing Board-position trigger/policies to CIRCLE instead of creating a second layout owner;
- prevents CIRCLE Telegram outbox creation and hardens pending claim to COMMUNITY;
- leaves anonymous Public Activity fail-closed;
- leaves Share transport-only.

## Inventory corrective found during G5

The existing Board-position trigger had a trigger-level predicate requiring visibility=community.

Replacing only the trigger function would therefore not have created positions for CIRCLE cards.

The branch migration now replaces that existing trigger predicate with COMMUNITY/CIRCLE while preserving dc_artifact_board_positions as the one layout owner.

## Static validator

Added scripts/validate-artifact-collaboration-v1.mjs and wired it into Site Integrity.

It checks:

- one participation owner only;
- exact state vocabulary;
- CIRCLE=Idea invariant;
- no email in invite lookup;
- no parallel slot/capacity/reward table;
- no Dementor capacity bypass;
- Storage follows Artifact ACL;
- INVITED cannot use JOINED interaction path;
- relation read checks both endpoints;
- participant relation writes are RELATED_TO only;
- participant relation deletion is creator-scoped;
- no Person relation endpoint;
- CIRCLE cannot enqueue or claim Telegram;
- Telegram worker independently rejects non-community;
- Public Activity remains fail-closed;
- Share/Auth return does not become a participation owner.

Offline/static preflight against exact branch content:

- validator JavaScript syntax: PASS;
- validator execution: PASS;
- focused branch contract checks: PASS.

## What is not proven

Not proven yet:

- PostgreSQL parser/DDL execution success;
- migration apply/rollback behavior;
- live RLS behavior under real identities;
- browser/frontend behavior;
- G6 release readiness.

Those require a later authorized validation stage and must not use production as a migration sandbox.

## Stop boundary

liveDatabaseMutationAuthorized = false.

productionMergeAuthorized = false.

productionDeployAuthorized = false.

STOP before any live Supabase apply.
