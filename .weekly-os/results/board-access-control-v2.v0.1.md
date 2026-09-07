---
artifactId: dementor-club.result.board-access-control-v2
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G3_BUILD
status: ACTIVE
version: 0.1
updated: 2026-09-07
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
---

# MP | Dementor Club | BUILD | Board Access Control v2 | v0.1

## Goal
Harmonize the Community Board permission model from authenticated Guest through Owner Admin and complete the two remaining access gaps: first-Artifact Member interaction monotonicity and Owner Admin moderation/layout authority.

## Status
**ACTIVE / G3 BUILD**

Implementation branch: `agent/board-access-control-v2`  
Production baseline: `dementor-club-production`  
Semantic authority: `operations/BOARD_ACCESS_AND_OWNER_ADMIN_V2.md`

## Scope
1. Preserve Guest states 2–4 Board read/react/respond with gated `Создать`.
2. Convert `FIRST_ARTIFACT_REQUIRED` from a reaction/response hard gate to spotlight-only onboarding.
3. Give `OWNER_ADMIN` explicit Board authority to move/close any Member Artifact and use privileged create/publish without synthetic membership or slot grants.
4. Reuse canonical Board owners and `dc_artifact_board_positions`; do not introduce a parallel layout/state system.
5. Add security/browser regression evidence for the eight-state access matrix.

## Affected surfaces
- `/workspace/board/`
- Community Artifact composer/publication controls
- Board spatial movement
- Artifact close/archive action
- Artifact reaction/response authorization
- Supabase Board RLS/RPCs
- Board browser/security validation

## Acceptance criteria
- State 5 can react/respond before first Artifact while spotlight remains and activation semantics are unchanged.
- State 6 ordinary Member cannot moderate another Member Artifact.
- State 8 Owner Admin can move and close another Member Artifact.
- State 8 Owner Admin can create/publish through the existing composer without a Member slot grant.
- Guest states 2–4 cannot create/move/close and keep existing read/react/respond behavior.
- No new membership state, slot grant, Board layout table or duplicate Board controller is created.
- G6 Site Integrity and Board browser/security state matrix pass.
- Clean production candidate contains only this Result diff.
- No deploy without explicit owner approval.

## Evidence
Pending implementation and G6 validation.

## Gate
Current: **G3_BUILD**.
