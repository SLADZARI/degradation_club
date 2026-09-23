---
artifactId: dementor-club.result.artifact-collaboration-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G4_SEMANTIC_CONTRACT
status: REVIEW
workStatus: ACTIVE
version: 0.1
updated: 2026-09-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
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
schemaMutationAuthorized: false
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# Artifact Collaboration v1 · Result v0.1

## Goal

Implement the approved contract:

`operations/ARTIFACT_COLLABORATION_V1.md`

from exact production baseline:

`df8a24eca2bcca25339f128c7da93982515cf442`

## Current gate

`G4_SEMANTIC_CONTRACT`

First implementation checkpoint is existing-owner/schema/permission inventory.

No live Supabase mutation, production merge or production deploy is authorized.

## Two-developer ownership

### DEV1 — backend / Supabase authority lane

Own:

- current production schema inventory;
- minimal Artifact participation persistence proposal;
- circle RLS/read boundary;
- invite/join/decline/leave/remove RPC contract;
- slot-grant administrative operation using existing `dc_artifact_slot_grants`;
- participant-scoped RELATED_TO server authorization;
- migration + static security validators after schema authorization.

DEV1 has Supabase access, but live DB mutation remains forbidden until an explicit later gate.

### DEV2 — frontend / UX / contract lane

Own:

- current Board/detail/card owner inventory;
- safe registered-profile selection UX;
- author/roster/invite/join presentation;
- CIRCLE visibility composer control for IDEA only;
- no-oracle/missing-state UX;
- participant relation UI through existing Relations owner;
- desktop/mobile/browser acceptance validators.

DEV2 does not create schema or a parallel participant owner.

## Collision rule

One Result → one active integration branch.

DEV1 freezes the server contract first.
DEV2 may perform read-only inventory in parallel but must not code against guessed RPC/table shapes.

After G4/G5 contract checkpoint, DEV2 implements UI against the frozen server contract on the same Result branch with file ownership separation.

## Stop conditions

STOP if existing owner inventory reveals:

- an equivalent Artifact participation owner;
- an existing ACL owner that should be composed rather than duplicated;
- a conflict with Membership semantics;
- profile lookup that would expose private account data;
- circle visibility leakage through Board Relations/media/public activity.

Changing meaning beyond the approved Decision requires a new Change Proposal.
