---
artifactId: dementor-club.result.artifact-collaboration-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: REVIEW
workStatus: ACTIVE
version: 0.2
updated: 2026-09-24
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
parentDecision: dementor-club.decision.artifact-collaboration-v1
scope:
  - idea participation
  - invitation / join
  - circle visibility
  - explicit slot grants
  - participant-scoped RELATED_TO
integrationBranch: result/artifact-collaboration-v1
integrationBaseRef: dementor-club-production
integrationBaseCommit: df8a24eca2bcca25339f128c7da93982515cf442
productionBaseCommit: df8a24eca2bcca25339f128c7da93982515cf442
implementationStartAuthorized: true
schemaMutationAuthorized: true
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
g4BackendEvidence: operations/ARTIFACT_COLLABORATION_BACKEND_G4_CONTRACT_2026-09-24.md
g4BackendStatus: PASS
g5BackendEvidence: operations/ARTIFACT_COLLABORATION_BACKEND_G5_CHECKPOINT_2026-09-24.md
g5BackendCandidateCommit: 06ba2aa94c990a2e0bce4a6729a4f6963acb0e19
g5BackendMigration: supabase/migrations/20260924002500_artifact_collaboration_v1.sql
g5BackendValidator: scripts/validate-artifact-collaboration-v1.mjs
g5BackendStaticStatus: PASS
g5SqlExecutionStatus: NOT_RUN
gateReadiness: G5_SCHEMA_DRAFT_STATIC_PASS
---

# Artifact Collaboration v1 · Result v0.2

## Current state

Backend G4 exact-owner inventory is complete and passed.

The owner-authorized branch-only schema draft has been created after the owner contract was proven.

Current movement:

G4_SEMANTIC_CONTRACT → PASS

G5_BUILD → schema draft + static security contract PASS

SQL execution validation → NOT RUN

G6 → NOT ENTERED

Live database mutation remains explicitly forbidden.

## Existing-owner verdict

Compose existing canonical owners:

- dc_artifacts for Artifact identity, author and visibility;
- profiles for registered invite target identity;
- dc_artifact_slot_grants for capacity;
- dc_artifact_media and the private Artifact Storage bucket for media;
- dc_artifact_reactions / dc_guest_board_interests / dc_artifact_responses for interactions;
- dc_artifact_board_positions for spatial Board ownership;
- dc_board_relations for typed relations;
- current Share/Auth return owner;
- current Telegram outbox/worker;
- current fail-closed Public Activity owner.

No equivalent Artifact participation/CIRCLE ACL owner exists.

One new owner is justified:

dc_artifact_participation_events.

MP project-client ACL/invite mechanisms are a separate domain and are not reused.

## Frozen backend contract for DEV2

Participation states:

INVITED / JOINED / DECLINED / LEFT / REMOVED.

Invite target:

existing registered profile only, selected through bounded safe server lookup without email.

CIRCLE read:

author OR current INVITED OR current JOINED OR Owner Admin.

INVITED:

read + accept/decline only.

JOINED:

uses the existing reaction/response lane appropriate to the actor's existing Board state and receives the approved extra participant-scoped RELATED_TO permission.

JOINED does not imply Membership.

Participant relation write:

RELATED_TO only; one endpoint must be the joined Idea; the other endpoint must be readable.

Participant relation delete:

only the caller's own participant-created RELATED_TO while caller remains JOINED.

Author and Owner Admin retain canonical authority.

Capacity:

dc_artifact_slot_grants remains the only owner; CIRCLE and COMMUNITY consume identically; archived/expired/removed release capacity through existing publish accounting; Dementor does not bypass; Owner Admin operational bypass remains.

Share:

transport only; no invite/access grant.

Telegram/Public Activity:

CIRCLE is fail-closed.

## Branch evidence

Exact backend candidate:

result/artifact-collaboration-v1@06ba2aa94c990a2e0bce4a6729a4f6963acb0e19

Exact production baseline:

df8a24eca2bcca25339f128c7da93982515cf442

At checkpoint:

- ahead_by = 8;
- behind_by = 0;
- production remained exact baseline;
- branch diff contained only the backend contract evidence, migration, validator and Site Integrity wiring.

## Validation truth

Static validator execution passed against exact branch content.

This does not establish PostgreSQL execution validity.

No migration has been applied to live Supabase, even temporarily.

## Gate

Current: G5_BUILD.

Next backend gate requires non-production SQL/schema validation evidence on the exact candidate or another explicitly authorized validation path.

Do not enter live DB apply.

## Stop boundary

liveDatabaseMutationAuthorized = false

productionMergeAuthorized = false

productionDeployAuthorized = false
