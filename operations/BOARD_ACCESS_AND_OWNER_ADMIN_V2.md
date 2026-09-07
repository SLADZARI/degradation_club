# Dementor Club — Board Access & Owner Admin v2

STATUS: **APPROVED / PROJECT-LOCAL SOURCE OF TRUTH**  
VERSION: **v2**  
DATE: **2026-09-07**  
SCOPE: Community Board user-state permissions, pre-membership Board participation, first-Artifact focus boundary, Owner Admin Board authority  
IMPLEMENTATION TARGET: `dementor-club-production` through a clean Result branch and release gate

## 1. Decision

This decision records the Board access model explicitly approved by the project owners during Board QA on 2026-09-07.

It supersedes only the conflicting Board-access statements in §7 of `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md` and the prior implementation behavior that used `FIRST_ARTIFACT_REQUIRED` as a reaction/response permission lock.

It does **not** change Membership v2 lifecycle semantics:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

and post-admission state remains:

`MEMBER_ACTIVE → FIRST_ARTIFACT_REQUIRED → MEMBER_ACTIVATED`

The first Artifact remains the only transition from `FIRST_ARTIFACT_REQUIRED` to `MEMBER_ACTIVATED`. The change is that this state is an onboarding/focus state, not a ban on reacting or responding.

## 2. Canonical Board user states

1. `UNAUTHENTICATED`
2. `AUTHENTICATED_GUEST_DC9_INCOMPLETE`
3. `AUTHENTICATED_GUEST_DC9_COMPLETE`
4. `APPLICANT`
5. `MEMBER_NOT_ACTIVATED`
6. `MEMBER_ACTIVATED`
7. `DEMENTOR`
8. `OWNER_ADMIN`

One state resolver remains the canonical owner: `community/board/board-user-state-v2.js`.

## 3. Capability matrix

| Capability | 1 Unauth | 2 Guest incomplete | 3 Guest complete | 4 Applicant | 5 Member first Artifact | 6 Member activated | 7 Dementor | 8 Owner Admin |
|---|---|---|---|---|---|---|---|---|
| Open Board | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| See live Artifacts | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Pan / zoom / focus / open | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| React / `Интересно` | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Respond to Artifact | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| See `Создать` CTA | No | Yes, gated | Yes, gated | Yes, gated | Yes | Yes | Yes | Yes |
| Create Artifact | No | No | No | No | Yes, first Artifact | Yes, subject to Member slot | Yes, subject to role/member rules | Yes, privileged Board operation |
| Move own Artifact | No | No | No | No | Not applicable before first publish | Yes | Yes | Yes |
| Move another Member Artifact | No | No | No | No | No | No | No by role alone | Yes |
| Close/archive own Artifact | No | No | No | No | After Artifact exists | Yes | Yes | Yes |
| Close/archive another Member Artifact | No | No | No | No | No | No | No by role alone | Yes |
| Persistent Member-Artifact layout moderation | No | No | No | No | No | No | No by role alone | Yes |

## 4. Guest states 2–4

Authenticated Guest states use the real spatial Board surface. They can inspect, pan, zoom, focus and open live Community Artifacts.

They can:
- react through the dedicated Guest-interest path;
- submit an Artifact response owned by their authenticated profile;
- use external Artifact links;
- see `Создать` as a conversion CTA.

They cannot:
- create or publish Artifacts;
- move cards;
- close/archive cards;
- moderate Board layout.

`Создать` never opens the composer for states 2–4:
- state 2 → DC-9 continuation;
- state 3 → application;
- state 4 → application/review status.

Guest interaction does not imply membership.

## 5. State 5 — first Artifact focus, not interaction lock

`MEMBER_NOT_ACTIVATED` / `FIRST_ARTIFACT_REQUIRED` keeps the approved spotlight/focus treatment and first Artifact slot.

The Member may nevertheless react and respond to existing Board Artifacts immediately after admission.

Therefore:
- remove the UI interception/disabled state for reaction and response controls;
- preserve spotlight and `Пропустить сейчас` as presentation only;
- `Пропустить` must not activate membership;
- only successful publication of the first Artifact changes activation state.

Permissions must be monotonic: admission to membership cannot remove interaction capabilities the same account had as an authenticated Guest.

## 6. Owner Admin

`OWNER_ADMIN` is a privileged Club operational role, not a substitute membership state.

On the Community Board, Owner Admin has explicit authority to:
- read the full live Board regardless of ordinary Member activation state;
- use canonical reactions/responses;
- create and publish a Board Artifact through the existing composer without requiring a Member Artifact slot;
- move any live Member Artifact using the existing `dc_artifact_board_positions` owner rather than creating a parallel layout system;
- close/archive any Member Artifact through the existing close operation;
- see moderation controls clearly distinguished from ordinary Member ownership controls.

Owner Admin does not gain permission to mutate the semantic source entity behind an Artifact merely by moving/closing its Board representation.

Current fullscreen Board is intentionally a Member-Artifact notice surface; official project/event/program projections are not rendered into that canvas. This Result therefore does not create a second persistent position system for non-Artifact projections.

## 7. Authorization boundary

UI visibility is not authorization.

Database policies/functions must enforce all writes. In particular:
- ordinary Members retain own-position update only;
- Owner Admin receives an explicit additional position-update path;
- `dc_close_artifact_v1` must distinguish author close from Owner Admin moderation;
- privileged create/publish must be explicit and must not falsify Membership v2 state or create synthetic slot grants;
- Guest writes remain separate from canonical Member reaction records where already established.

## 8. Existing owners to extend

No parallel Board/auth/layout systems are authorized.

Extend:
- `board-user-state-v2.js` for state resolution only if necessary;
- `board-activation-gate-v1.js` for first-Artifact focus behavior;
- `board.js` for canonical Artifact controls/composer;
- `board-spatial-v1.js` for persistent Artifact movement;
- `board-fullscreen-v2-1.js` only for fullscreen control exposure;
- `dc_artifact_board_positions` for persistent Artifact layout;
- existing Artifact/reaction/response RPCs and RLS policies.

## 9. Required validation

Minimum G6 evidence:
- Guest states 2–4 retain read/react/respond and cannot create/move/close;
- `MEMBER_NOT_ACTIVATED` can react/respond while first-Artifact spotlight remains;
- first Artifact publication remains the only activation transition;
- ordinary Member cannot move/close another Member Artifact;
- Owner Admin can move and close another Member Artifact;
- Owner Admin can open the existing composer and publish without a Member slot grant;
- Owner Admin actions do not create membership or slot grants;
- desktop/mobile spatial Board remains usable;
- Board fullscreen/open-card behavior remains intact;
- RLS/RPC security contract passes;
- no duplicate Board owner or parallel layout table is introduced.

## 10. Release rule

Implementation, database migration, merge and deployment are distinct gates.

A commit or merge is not a deployment. Production deployment remains manual and requires explicit owner approval after G6/release readiness.
