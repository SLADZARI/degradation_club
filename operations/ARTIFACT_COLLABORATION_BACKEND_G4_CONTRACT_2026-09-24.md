---
artifactId: dementor-club.evidence.artifact-collaboration-backend-g4-2026-09-24
project: dementor-club
documentType: CONTRACT_EVIDENCE
projectStage: BUILD
gate: G4_SEMANTIC_CONTRACT
status: PASS
version: 1.0
updated: 2026-09-24
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.artifact-collaboration-v1
productionBaseCommit: df8a24eca2bcca25339f128c7da93982515cf442
supabaseProjectId: mmekfydwbvptbdatwitj
liveDatabaseMutationAuthorized: false
---

# Artifact Collaboration v1 — Backend G4 exact owner contract

## Verdict

**G4 BACKEND OWNER CONTRACT = PASS**

Exact production inventory proves there is no existing Dementor Club Artifact participation / invitation / CIRCLE ACL owner to compose directly.

A single new Artifact-scoped participation persistence owner is therefore justified.

Existing canonical owners MUST be extended rather than duplicated:

- Artifact: `dc_artifacts`;
- profile identity: `profiles` + safe projections;
- capacity: `dc_artifact_slot_grants` + `dc_publish_artifact_v1`;
- media metadata/storage: `dc_artifact_media` + private `dc-community-artifacts` bucket;
- reactions/responses: `dc_artifact_reactions`, `dc_guest_board_interests`, `dc_artifact_responses`;
- Board relations: `dc_board_relations` + existing relation RPCs;
- Share/Auth return: `community/board/board-deeplink-auth-return-v1.js`;
- Telegram: `dc_distribution_outbox` + canonical worker;
- anonymous Public Activity: `dc_public_activity_read_v1`.

No live Supabase mutation was performed.

## Exact production evidence

Production:
`df8a24eca2bcca25339f128c7da93982515cf442`

Result branch was created exactly at that SHA and contained no implementation delta at inventory start.

Live Supabase:
`mmekfydwbvptbdatwitj / Dementor / exEDUplatform`
Postgres 17.

Live migration head:
`20260921134959_public_activity_truth_boundary_v1`.

## Existing-before-new inventory

### Artifact participation

No public/storage table, view or function matching Artifact participant / participation / CIRCLE / collaboration ownership exists.

The only live invite-named function is:

`mp_accept_client_team_invite`

It belongs to WeeklyOS / MP client project assignment semantics and operates on `mp_project_refs`, `mp_project_assignments`, `mp_system_memberships`.

It MUST NOT be repurposed for Dementor Club Artifact collaboration.

`mp_project_artifact_access` is likewise a project/client artifact-key ACL keyed by MP project/user. It is not an ACL for `dc_artifacts`.

### Profile identity

`profiles` is the canonical registered-profile owner and is FK-backed by `auth.users`.

Direct authenticated SELECT is own-profile only.

`dc_member_public_profiles` is a safe Member projection, but it does not represent all registered profiles and therefore cannot satisfy the approved invite target by itself.

Production counts at inventory time:

- registered profiles: 9;
- profiles with display_name: 6;
- profiles with nickname: 1;
- profiles without display_name/nickname: 3;
- all 9 have full_name.

Therefore invite discovery requires a bounded author/Owner-Admin server lookup over canonical `profiles`, returning safe identity fields and never email.

### Artifact visibility

`dc_artifacts.visibility` is canonical.

Current DB constraint is exactly community-only.

Artifact Collaboration v1 extends that existing field to:

- `community`;
- `circle`, only when `artifact_type='idea'`.

No second ACL/visibility table is authorized.

### Capacity / slots

`dc_artifact_slot_grants` is canonical and already stores:

- profile_id;
- amount;
- grant_key;
- reason;
- source/provenance fields.

Live grants are existing initial-membership grants only.

No live slot/grant/capacity RPC exists.

`dc_publish_artifact_v1` currently computes:

`sum(slot_grant.amount) - count(publishing|active non-expired Artifacts)`.

Therefore:

- one publishing/active Artifact consumes one slot;
- archived/expired/removed do not consume;
- visibility does not affect capacity;
- CIRCLE can consume exactly the same capacity as COMMUNITY;
- only Owner Admin bypasses the slot check;
- Dementor role does not bypass capacity.

The existing slot table MUST be extended with a narrow Owner Admin grant operation. No second slot table and no reward economy.

### Board relations

`dc_board_relations` is the canonical typed-edge owner.

Direct browser table access is revoked; read/create/delete use RPCs.

Persisted endpoint kinds remain:
`artifact / event / program`.

Persisted relation types remain:
`RELATED_TO / RESULT_OF / CONTINUES / ABOUT / REPORT_OF`.

No Person endpoint is authorized.

`created_by` already supplies sufficient provenance to enforce participant deletion of only their own participant-created RELATED_TO edge; no parallel relation table/column is required.

### Reactions / responses

Canonical owners already exist:

- Member reaction: `dc_artifact_reactions`;
- Guest interest: `dc_guest_board_interests` + narrow RPC;
- response: `dc_artifact_responses` + existing Guest RPC.

Participation MUST NOT be inferred from these rows.

For CIRCLE:
- INVITED may read but may not react/respond merely because they are invited;
- JOINED may use the existing interaction lane appropriate to their existing Board user state;
- JOINED does not imply Membership.

### Media

Bucket `dc-community-artifacts` is private.

Critical current fact:
the Member storage SELECT policy authorizes any active Member/Owner Admin for the bucket, while Guest storage read uses a community-only helper.

That is safe for current COMMUNITY-only Artifact visibility but would leak CIRCLE media if visibility were extended without a Storage policy change.

CIRCLE implementation MUST bind Storage SELECT to Artifact readability, not membership alone.

### Share / Auth return

Canonical share owner remains:
`community/board/board-deeplink-auth-return-v1.js`.

Share URL is transport only:
`/share/artifact/?id=<uuid>`.

It MUST NOT create participation or bypass Artifact ACL.

For an unauthorized CIRCLE viewer, Board target resolution must fail into the existing generic unavailable state.

### Public Activity

Current `dc_public_activity_read_v1` is fail-closed and returns no generic Board Artifact.

Artifact Collaboration v1 does not create a new public eligibility path.

CIRCLE must remain absent from anonymous Public Activity.

### Telegram

Promotion/admin RPCs and the deployed worker require `visibility='community'`.

The worker independently re-reads the Artifact and rejects non-community rows before send.

However `dc_publish_artifact_v1` currently creates a held Telegram outbox row for every publish. G5 must stop outbox creation for CIRCLE and harden claim eligibility to COMMUNITY only.

## Canonical participation persistence proposal

One new owner only:

`dc_artifact_participation_events`

Append-only state-transition ledger:

- id uuid;
- artifact_id -> dc_artifacts;
- profile_id -> profiles;
- transition_no integer per artifact/profile;
- state: `INVITED | JOINED | DECLINED | LEFT | REMOVED`;
- actor_profile_id;
- created_at.

No co-ownership field.

Current state is the latest transition_no for an artifact/profile.

Re-invitation after DECLINED / LEFT / REMOVED appends a new INVITED transition.

Direct browser access is revoked. All mutations go through bounded RPCs.

## Transition contract

Allowed transitions:

```text
NONE / DECLINED / LEFT / REMOVED -> INVITED   author or Owner Admin
INVITED -> JOINED                            invited profile
INVITED -> DECLINED                          invited profile
JOINED  -> LEFT                              joined profile
INVITED / JOINED -> REMOVED                  author or Owner Admin
```

Author may not be invited as a participant.

Target profile MUST already exist in `profiles`.

No email invite owner is introduced.

## Server RPC contract

Read / lookup:

- `dc_artifact_invite_candidates_v1(artifact_id, query, limit)`
  - author / Owner Admin only;
  - query is bounded;
  - returns profile_id + safe identity only;
  - never returns email.

- `dc_artifact_participants_read_v1(artifact_id)`
  - viewer must be able to read the Artifact;
  - returns current INVITED/JOINED participant roster only.

Mutation:

- `dc_artifact_invite_v1(artifact_id, profile_id)`;
- `dc_artifact_invitation_respond_v1(artifact_id, decision)` where decision is JOINED or DECLINED;
- `dc_artifact_leave_v1(artifact_id)`;
- `dc_artifact_remove_participant_v1(artifact_id, profile_id)`.

Visibility:

- `dc_set_artifact_visibility_v1(artifact_id, visibility)`;
- v1 setter is draft-only;
- CIRCLE only for Idea.

Capacity:

- `dc_admin_grant_artifact_slots_v1(profile_id, amount, reason, source_ref)`;
- Owner Admin only;
- uses `dc_artifact_slot_grants`;
- no Dementor bypass;
- no reward semantics.

## Canonical read rule

CIRCLE Artifact content is readable only by:

- author;
- current INVITED;
- current JOINED;
- Owner Admin.

This rule must be composed into each server surface independently where required, including Storage.

COMMUNITY retains current Board access semantics.

## Relation contract

For CIRCLE relation read:
viewer must be able to read BOTH endpoints.

JOINED participant special write path:

- relation type MUST be RELATED_TO;
- one endpoint MUST be an Idea on which caller is current JOINED;
- other endpoint must be a Board endpoint caller can read;
- endpoint kinds remain artifact/event/program;
- no Person endpoint;
- participant cannot use RESULT_OF / CONTINUES / ABOUT / REPORT_OF.

Participant delete path:

- relation_type = RELATED_TO;
- `created_by = auth.uid()`;
- caller is still JOINED on the involved Idea;
- both endpoints remain readable.

Existing author / scoped Dementor / Owner Admin relation authority remains canonical for its existing scope.

## RLS / access matrix target

| Surface | COMMUNITY | CIRCLE |
|---|---|---|
| dc_artifacts member raw read | existing Member/author/Admin | author; authorized Member INVITED/JOINED; Admin |
| Guest Board read/detail | existing authenticated Guest path | current INVITED/JOINED |
| participation ledger | RPC only | RPC only |
| media metadata | existing | author; authorized reader via proper lane; Admin |
| Storage object | current readable Artifact | exact Artifact read ACL |
| Member reaction | existing | JOINED/author/Admin under existing Member lane |
| Guest interest | existing | JOINED only under Guest lane |
| response submit | existing | JOINED only under existing Guest/Member lane |
| response read | existing parties | existing parties AND current Artifact read |
| relations read | endpoint availability | viewer reads BOTH endpoints |
| participant relation write | n/a | RELATED_TO only |
| share | no ACL mutation | no ACL mutation |
| Public Activity | current fail-closed | never eligible |
| Telegram | promotion gate | never enqueued/promoted |

## G5 migration scope

One migration only. No new slot, relation, profile or media table.

Expected mutation set:

1. extend `dc_artifacts.visibility` constraint with circle + Idea invariant;
2. create `dc_artifact_participation_events`;
3. add bounded participant/profile lookup/read/mutation RPCs;
4. add current-viewer Artifact ACL helper(s);
5. add draft visibility setter;
6. extend Artifact/media/reaction/response RLS and Guest RPCs;
7. replace broad Storage member read with Artifact-aware read;
8. extend existing Board relation RPCs;
9. keep capacity accounting on `dc_artifact_slot_grants`;
10. add Owner Admin slot grant RPC + durable actor provenance on existing grant owner;
11. stop CIRCLE Telegram outbox creation and harden pending claim to COMMUNITY;
12. preserve Public Activity fail-closed contract.

## Security validator requirements

Static validation must fail if G5 introduces:

- generic Person relation endpoint;
- new slot/capacity table;
- email return from invite candidate RPC;
- CIRCLE without Idea constraint;
- CIRCLE Storage read based only on membership;
- CIRCLE Public Activity eligibility;
- CIRCLE Telegram enqueue/promotion;
- participant relation type beyond RELATED_TO;
- participant delete without `created_by=auth.uid()`;
- relation read without both-endpoint authorization;
- direct authenticated mutation grant on participation ledger;
- Dementor capacity bypass;
- Share URL as access grant.

## Collision verdict

No canonical equivalent participation owner exists.

Create exactly one new Artifact participation ledger; compose every other requirement into current owners.

## Stop boundary

G4 contract proof does NOT authorize live DB apply.

Allowed next movement: branch-only migration + static validation on `result/artifact-collaboration-v1`.

Hard stop remains:

```text
LIVE DB APPLY = NOT AUTHORIZED
production merge = NOT AUTHORIZED
production deploy = NOT AUTHORIZED
```
