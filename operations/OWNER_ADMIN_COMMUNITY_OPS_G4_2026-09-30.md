---
artifactId: dementor-club.operations.owner-admin-community-ops-g4-2026-09-30
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G4_CONTRACT
status: PASS
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.owner-admin-community-ops-v1
productionBaseline: cde332779ab0e256dd1e498660d6fa651e91846e
parentQa: BQA-23
---

# Owner Admin Community Ops v1 — G4 contract

## Verdict

**G4 PASS**

BQA-23 can proceed without a semantic Change Proposal.

The Result exposes already-authorized Owner Admin operations through the existing canonical Workspace admin surface. It does not add roles, permissions, Membership transitions, slot economy rules or collaboration states.

## Existing canonical surface

Owner Admin shell already exists:

`/workspace/admin/`

Existing files:

- `workspace/admin/index.html`
- `workspace/admin/owner-admin-access-v1.js`
- shared canonical Workspace shell / sidebar.

The Result must extend this surface. No second admin shell or Workspace is allowed.

## Existing authority

Approved local decision:

`operations/BOARD_ACCESS_AND_OWNER_ADMIN_V2.md`

Owner Admin already has explicit authority to:

- create/publish Board Artifacts through existing owners;
- move any live Artifact through canonical Board positioning;
- close/archive another Member Artifact through `dc_close_artifact_v1`;
- use moderation controls clearly separated from ordinary Member controls.

Artifact Collaboration production already authorizes Owner Admin to use the canonical collaboration mutation path.

No Membership or Dementor authority changes are in scope.

## Existing backend owners

### Artifact slot grants

Canonical mutation:

`dc_admin_grant_artifact_slots_v1(profile_id, amount, reason, source_ref)`

It already:

- requires authenticated Owner Admin;
- rejects invalid/missing profile;
- requires positive amount;
- requires reason;
- requires source provenance;
- writes durable `dc_artifact_slot_grants`;
- returns post-grant total.

Canonical capacity formula already exists in `dc_member_entry_status_v1`:

```text
granted = SUM(dc_artifact_slot_grants.amount)
consuming = active/publishing unexpired Artifacts
available = max(granted - consuming, 0)
```

Do not duplicate this formula as a second semantic owner in browser code.

A bounded Owner Admin read projection is allowed in this Result so the existing formula/history can be presented for another profile. It may not create state or new authority.

### Profile identity

Safe human identity fields already exist:

- display name;
- nickname;
- avatar;
- safe profile projection.

No email-first selector and no raw UUID-first workflow.

If generic Owner Admin profile search needs a server projection, it must return only safe identity fields and current membership status; it must be Owner Admin-only and read-only.

### Idea collaboration

Existing canonical operations:

- `dc_artifact_invite_candidates_v1`;
- `dc_artifact_invite_v1`;
- `dc_artifact_participants_read_v1`;
- `dc_artifact_remove_participant_v1`.

Existing Artifact detail already uses these contracts.

The Admin tool may orchestrate these RPCs but must not create a second participation ledger/cache/state machine.

### Artifact operations

Existing canonical operations/data:

- Owner Admin RLS read on `dc_artifacts`;
- `dc_close_artifact_v1`;
- canonical Artifact detail route;
- existing author/visibility/status truth.

No direct table mutation UI.

## Change-control boundary

Not authorized:

- new roles/permissions;
- Membership activation;
- DC-9/Application/review bypass;
- invite-by-email;
- generic user management;
- arbitrary SQL/table editor;
- new slot reward/economy rules;
- new collaboration states;
- generic friends/groups ACL.

If implementation needs any of these, STOP and open Change Control.

## Canonical UI target

Add one bounded tool under the existing System Tools surface:

`/workspace/admin/community-ops/`

It must reuse:

- canonical Workspace shell;
- existing Owner Admin access guard;
- existing RPC owners;
- canonical Artifact detail/Board routes where handoff is safer than duplicating UI.

## Minimum G5 acceptance

### Access

- Owner Admin positive route access;
- ordinary Member direct-route negative;
- unauthenticated negative;
- desktop + mobile.

### Profile / slots

- human-readable profile search;
- ambiguity/same-name disambiguation without email-first identity;
- server-owned granted / consuming / available snapshot;
- durable grant history;
- amount > 0 validation;
- reason required;
- provenance/source_ref required;
- explicit confirmation;
- mutation button protected against duplicate UI submission;
- post-mutation server reread.

### Idea collaboration

- inspect author + INVITED + JOINED;
- invite through existing canonical RPC;
- remove only current INVITED/JOINED through existing canonical RPC;
- already INVITED/JOINED behavior handled;
- CIRCLE no-oracle/privacy preserved;
- affected Board/detail state refreshes through existing projection events/owners.

### Artifact operations

- human search/select;
- show author / type / status / visibility;
- close/archive only through `dc_close_artifact_v1`;
- clear handoff to canonical Artifact detail;
- no direct table edit.

### Structural integrity

- one admin shell;
- one Workspace sidebar;
- no duplicate Header;
- no parallel permission owner;
- no second slot/collaboration state owner;
- full Site Integrity on exact head.

## G4 conclusion

```text
authority change          NO
Change Proposal required  NO
new persistent state      NO
new role/permission       NO
bounded read projection   ALLOWED
existing mutations reused YES

G4 = PASS
next = G5_BUILD
```
