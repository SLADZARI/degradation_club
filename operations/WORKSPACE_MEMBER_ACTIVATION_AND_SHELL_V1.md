# Dementor Club — Workspace Member Activation & Shell v1

STATUS: **APPROVED / SOURCE OF TRUTH**  
VERSION: **v1**  
DATE: **2026-09-04**  
SCOPE: authenticated Workspace shell ownership, default Member entry, first-entry activation focus, Board access boundary, Activity projection  
IMPLEMENTATION TARGET: `dementor-club-site`

## 1. Decision status

This document records the product/architecture decision explicitly approved by the project owners on 2026-09-04 after live Member Workspace review.

It is a **project-local approved authority** for the scope below. It does not create project-wide PRODUCT / DOMAIN / ARCHITECTURE / DESIGN approval in `.weekly-os/APPROVED_STATE.json`.

It supersedes the earlier local rule that the canonical Public Header remains visible above authenticated Workspace surfaces.

Public-site header ownership remains unchanged outside `/workspace/*`.

## 2. Protected boundaries

This decision does not change Membership v2 semantics:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

Post-admission semantics remain:

`MEMBER_ACTIVE → FIRST_ARTIFACT_REQUIRED → MEMBER_ACTIVATED`

No new membership state, onboarding entity, recommendation entity, tutorial entity or reward economy is authorized by this decision.

## 3. Canonical shell ownership

For authenticated `/workspace/*` surfaces there is one canonical **Workspace Shell**.

The public landing navigation is not displayed inside authenticated Workspace.

Workspace owns its own header/navigation/control surface.

The `DEMENTOR CLUB` logo inside Workspace is the canonical escape to the public site and routes to `/`.

Do not solve this by layering a second header over the existing Workspace shell. Existing Public Header injection must be disabled for authenticated Workspace surfaces through the canonical shell/build owner.

Guest/authentication boundary behavior may retain the public shell where needed before authenticated Workspace ownership is established, but authenticated Workspace must not show simultaneous public and private primary navigation.

## 4. Default Member entry

For an active Member, Workspace default entry is the **Community Board**.

Canonical Member intent:

`LOGIN / WORKSPACE ENTRY → COMMUNITY BOARD`

`/workspace/` may resolve or redirect to `/workspace/board/` for active Members while preserving role-aware alternatives for future Dementor/owner contexts.

Community Board is the primary Member surface, not a generic dashboard.

The concept of Workspace Home may remain internally where required for role/admin compatibility, but it is not a primary ordinary-Member navigation item.

## 5. Workspace Member navigation target

For an ordinary active Member, target primary navigation is:

- `COMMUNITY BOARD` — first/default and always discoverable on mobile;
- `МОЙ КЛУБ` — membership, Sphere Map and participation context;
- `МОИ АРТЕФАКТЫ`;
- `МОЯ АКТИВНОСТЬ`;
- identity control: name/avatar → profile/account surface;
- role tools only when authorized;
- logout inside identity/profile controls rather than as a competing primary section where practical.

`HOME` is removed from ordinary Member primary navigation.

Identity control is not renamed to Home; name/avatar remains identity ownership.

## 6. First-entry activation focus

A newly admitted Member whose semantic state is `FIRST_ARTIFACT_REQUIRED` enters Community Board with the existing first-Artifact mechanic in focus.

The approved UX direction is a **spotlight / focus treatment** over the existing Board and first Artifact action.

The surrounding Board may remain visible but visually de-emphasized so the next action is unmistakable.

The system must reuse the existing first Artifact slot and activation state. Do not create a parallel tutorial-task state.

Primary action: create/publish the first Artifact through the existing canonical composer/publication flow.

A low-emphasis `Пропустить` action may dismiss the spotlight for the current session/view.

`Пропустить` **must not** change `FIRST_ARTIFACT_REQUIRED` to `MEMBER_ACTIVATED`, consume the Artifact slot, create a synthetic Artifact, or alter membership state.

Member activation occurs only when the first Artifact is successfully published under the existing approved mechanic.

## 7. Board access boundary

Closed Community Board remains available only to active Community Members and authorized Club roles.

An authenticated non-member does not gain Board read/comment/respond access merely by having an account or DC-9 results.

Before membership, the canonical path remains:

`DC9 9/9 → APPLICATION_AVAILABLE → APPLICATION_SUBMITTED → REVIEW → MEMBER_ACTIVE`

Only after admission does the user enter the closed Board and receive Member participation capabilities.

This decision does not introduce a pre-membership commenting exception.

## 8. My Activity projection

Existing Community actions must be observable after the user performs them.

`МОЯ АКТИВНОСТЬ` is the canonical Member-facing projection for at least:

- responses sent by the Member;
- reactions made by the Member;
- Member-created Artifacts and their current state;
- other already-approved participation relations when available.

This is a presentation/projection requirement over existing Community entities, not authorization for a new universal Activity domain entity.

After a response is submitted, the UI must provide visible confirmation and the Member must have a discoverable way to find that participation later.

## 9. Future backlog explicitly excluded

The following ideas are valuable but are **not part of this v1 implementation**:

- DC-9 / Sphere Map personalized content recommendations;
- recommendation ranking or personalized event selection;
- generalized fog-of-war progression engine;
- reward economy for completing Board actions;
- dynamic content unlocking beyond the approved first Artifact focus;
- synthetic onboarding events or invented Club activity.

These require separate future product decisions and must not be smuggled into the shell/activation implementation.

## 10. Implementation constraints

Implementation must extend existing canonical owners before creating anything new:

- Workspace shell/navigation;
- GlobalHeader/build injection logic;
- Board first-entry/activation gate;
- Artifact slot/publication state;
- existing reaction/response storage;
- existing Activity view/controller.

Required validation:

- ordinary Member desktop/mobile;
- first-entry Member with `FIRST_ARTIFACT_REQUIRED`;
- activated Member;
- authenticated non-member negative Board access;
- Dementor and owner-admin role tools;
- login → Workspace → Board route integrity;
- logo → public `/` escape;
- no simultaneous public/private primary headers;
- no duplicate shell owner;
- response persistence/confirmation and Activity discoverability;
- first Artifact publication remains the only transition to `MEMBER_ACTIVATED`.

## 11. Acceptance outcome

The target is successful when a first ordinary Member can enter the club and immediately understand the next action without losing access to the broader Community context:

`MEMBER_ACTIVE → BOARD IN FOCUS → FIRST ARTIFACT → MEMBER_ACTIVATED → CONTINUED BOARD PARTICIPATION`

The Workspace should feel like the club system itself, while the public landing site remains one logo click away.
