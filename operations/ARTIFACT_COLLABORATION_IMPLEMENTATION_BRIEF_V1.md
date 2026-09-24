---
artifactId: dementor-club.operations.artifact-collaboration-implementation-brief-v1
project: dementor-club
documentType: IMPLEMENTATION_BRIEF
projectStage: BUILD
gate: G5_BUILD
status: APPROVED
version: 1.0
updated: 2026-09-24
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_COORDINATION
result: dementor-club.result.artifact-collaboration-v1
productionBaseCommit: df8a24eca2bcca25339f128c7da93982515cf442
integrationBranch: result/artifact-collaboration-v1
---

# Artifact Collaboration v1 — Implementation Brief

## 1. Purpose

This brief is the operating handoff for the next implementation cycle of Dementor Club.

The approved product move is:

```text
IDEA Artifact
→ author / initiator
→ invite registered people
→ explicit JOIN / DECLINE
→ visible participant circle
→ each Idea has its own independent roster
→ joined participants may bring RELATED_TO Board connections
→ author capacity is limited by Artifact slots
→ an Idea may be COMMUNITY or CIRCLE
```

This Result is the last bounded product capability planned before self-hosted infrastructure migration #237.

## 2. Canonical authority

Read in this order:

1. `.weekly-os/PROJECT.json`
2. `.weekly-os/ARTIFACT_INDEX.json`
3. `.weekly-os/APPROVED_STATE.json`
4. `operations/ARTIFACT_COLLABORATION_V1.md`
5. `.weekly-os/results/artifact-collaboration-v1.v0.2.md`
6. `operations/ARTIFACT_COLLABORATION_BACKEND_G4_CONTRACT_2026-09-24.md`
7. `operations/ARTIFACT_COLLABORATION_BACKEND_G5_CHECKPOINT_2026-09-24.md`
8. this brief
9. implementation branch

Do not infer truth from file date/name/"latest".

## 3. Exact current state

Production baseline:

`df8a24eca2bcca25339f128c7da93982515cf442`

Current Result:

`dementor-club.result.artifact-collaboration-v1@0.2`

Current gate:

`G5_BUILD`

Canonical integration branch:

`result/artifact-collaboration-v1`

Backend candidate checkpoint:

`06ba2aa94c990a2e0bce4a6729a4f6963acb0e19`

Current backend truth:

- G4 exact-owner inventory = PASS;
- one new Artifact-scoped participation owner is justified;
- branch-only migration exists;
- static security validator = PASS;
- PostgreSQL execution validation = NOT RUN;
- live Supabase mutation = NOT AUTHORIZED;
- production merge = NOT AUTHORIZED;
- production deploy = NOT AUTHORIZED.

## 4. Approved semantic contract

### 4.1 Artifact scope

Collaboration v1 applies only to:

`artifact_type = idea`

Other Artifact subtypes keep their current behavior.

### 4.2 Author / participant distinction

```text
AUTHOR / INITIATOR ≠ PARTICIPANT
INVITED ≠ JOINED
JOINED ≠ OWNER
JOINED ≠ MEMBER
JOINED ≠ DEMENTOR
INTEREST ≠ JOIN
RESPONSE ≠ JOIN
```

One canonical author remains:

`dc_artifacts.author_profile_id`

No co-ownership.

### 4.3 Participation states

```text
INVITED
JOINED
DECLINED
LEFT
REMOVED
```

Invites are per-Artifact. Gabil may have multiple Ideas and each Idea may have a completely different participant set.

### 4.4 Invite identity

v1 invite target:

`existing registered profile only`

No email invite system.

Safe selector must never expose private account email.

### 4.5 Visibility

Approved Idea visibility:

```text
COMMUNITY  = ВЕСЬ КЛУБ
CIRCLE     = СВОЙ КРУГ
```

CIRCLE read is limited to:

- author;
- current INVITED;
- current JOINED;
- Owner Admin.

CIRCLE must fail closed across Board, detail, media, Relations, public activity, OG/social preview and Telegram.

Share URL is transport only and never grants access.

### 4.6 Capacity / slots

Existing capacity owner stays canonical:

`dc_artifact_slot_grants`

Rules:

- initial Member capacity = 1;
- one active/publishing Artifact consumes 1;
- CIRCLE and COMMUNITY consume identically;
- close/archive/expiry releases capacity under existing accounting;
- additional capacity is an explicit durable grant;
- no reward economy;
- no automatic grant from reactions/participants;
- Dementor role does not mean unlimited slots;
- Owner Admin operational bypass remains admin-only.

A canonical Owner Admin grant action must extend the existing slot-grant owner rather than create a new capacity system.

### 4.7 Participant-scoped Board relations

Board Relations remains canonical.

Person is NOT added as a generic Board relation endpoint.

Current supported object endpoint kinds remain:

```text
artifact
event
program
```

JOINED participant receives one narrow extra permission:

`RELATED_TO only`

One endpoint must be the joined Idea, and the other endpoint must already be readable by that participant.

Participant may delete only the participant-created RELATED_TO edge they created, while still JOINED.

No participant authority for:

- RESULT_OF;
- CONTINUES;
- ABOUT;
- REPORT_OF.

## 5. Backend owner contract

Existing owners to extend:

- `dc_artifacts` — identity/author/visibility;
- `profiles` — registered identity;
- `dc_artifact_slot_grants` — capacity;
- `dc_artifact_media` + private bucket — media;
- `dc_artifact_reactions` / guest interest / responses — interactions;
- `dc_artifact_board_positions` — spatial ownership;
- `dc_board_relations` — typed object graph;
- current Share/Auth return owner;
- current Telegram outbox/worker;
- current Public Activity owner.

New owner justified by inventory:

`dc_artifact_participation_events`

Append-only current-state transition ledger only.

Do not introduce:

- second slot table;
- second relation graph;
- generic People graph;
- second auth/share owner;
- second membership system.

## 6. Two-developer operating model

One Result. One canonical integration branch.

`result/artifact-collaboration-v1`

Developers may use short-lived working branches if needed, but all work must integrate into the one Result branch. No second Result or parallel integration branch.

### DEV1 — backend / Supabase lane

DEV1 has Supabase access.

Owns:

- migration / SQL;
- participation ledger;
- ACL helper(s);
- invite/read/mutation RPCs;
- safe profile lookup;
- CIRCLE RLS;
- Storage access hardening;
- reactions/responses CIRCLE authorization;
- slot-grant admin RPC;
- participant-scoped RELATED_TO server authorization;
- Telegram/Public Activity fail-closed guarantees;
- schema/security/static/integration validators;
- backend evidence.

Current immediate task:

```text
G5 static schema PASS
→ execute migration contract in NON-PRODUCTION validation environment
→ prove PostgreSQL execution / rollback / repeatability
→ prove RLS/RPC negative cases
→ do NOT apply to live Supabase
```

If no safe non-production SQL execution path exists, STOP and report the exact missing validation path. Do not substitute live production mutation.

DEV1 must not redesign UI.

### DEV2 — frontend / UX / browser lane

Owns:

- current UI owner inventory;
- Idea visibility control in existing composer;
- safe registered-profile selector;
- author/invite/joined roster presentation;
- invitation accept/decline;
- leave/remove controls;
- CIRCLE unavailable/no-oracle presentation;
- collaboration state on Board card/detail;
- participant RELATED_TO entry through existing Relations UI;
- responsive/mobile behavior;
- browser/visual/route/access validators.

DEV2 MUST use the frozen backend contract from Result v0.2/G4 evidence.

DEV2 must not:

- create schema;
- invent alternative RPC/table names;
- create parallel card/detail/modal owner;
- expose email;
- expand relation ontology.

If backend contract must change, both lanes STOP and reconcile the contract first.

## 7. File collision rules

DEV1 owns:

- `supabase/migrations/**`;
- backend SQL/RPC/RLS validators;
- server-contract evidence.

DEV2 owns:

- existing Board/Artifact frontend owners;
- CSS presentation;
- browser/visual validators.

Shared files such as Result/kernel/index are updated by the coordinator only after evidence checkpoint, not concurrently by both developers.

## 8. Required UI behavior

Target card/detail hierarchy:

```text
ИДЕЯ

[title / premise]

ИНИЦИАТОР
[avatar] Габиль

В ДЕЛЕ
[JOINED avatars]

ПОЗВАНЫ
[INVITED count / compact avatars]

[viewer-specific primary action]
```

Invitee:

```text
ГАБИЛЬ ЗОВЁТ ВАС В ЭТУ ИДЕЮ

[ПРИСОЕДИНИТЬСЯ]
[НЕ СЕЙЧАС]
```

Joined participant:

```text
ВЫ В ДЕЛЕ
[ВЫЙТИ]
```

Author:

- invite registered profiles;
- see current invite/join state;
- remove participant;
- close/archive Idea;
- manage visibility while allowed by the approved contract.

Sparse Board card stays sparse. Full management belongs in existing Artifact detail/fullscreen composition.

## 9. Privacy / no-oracle requirements

CIRCLE must not leak existence or content to unauthorized users through:

- Board query;
- direct Artifact URL;
- profile/activity projections;
- media metadata/storage;
- signed media URLs;
- relation lines;
- relation target picker;
- Telegram;
- Public Activity;
- OG/social preview;
- error copy.

Unauthorized request must converge on the existing generic unavailable/denied boundary without confirming hidden Artifact identity.

## 10. Acceptance scenario

Required real scenario before closure:

```text
Gabil has >1 granted slot
→ creates Idea A
→ CIRCLE
→ invites Andrus, Zhenya, Nikita
→ invite states display
→ at least two JOIN
→ one remains INVITED or DECLINES
→ unrelated authenticated user cannot discover/open A
→ JOINED participant creates RELATED_TO to one readable Board object
→ no relation leak to unrelated user
→ Gabil creates Idea B with different participant set
→ Idea A/B rosters remain independent
→ slot ceiling blocks creation above capacity
→ closing one active Idea releases capacity
```

Must pass desktop + mobile.

This real scenario should also feed the existing behavioral QA program where applicable.

## 11. Gates

### G5 BUILD
Required before leaving G5:

- backend SQL execution validated outside production;
- backend contract tests pass;
- frontend implementation exists against frozen contract;
- no schema/UI owner collision;
- exact branch diff understood.

### G6 VALIDATION
Minimum:

- build/syntax;
- migration execution;
- RPC positive + negative matrix;
- RLS/no-oracle matrix;
- Guest/Applicant/Member/Dementor/Owner Admin relevant states;
- COMMUNITY regression;
- CIRCLE author/invited/joined/outsider;
- Storage/media;
- Share/Auth return;
- Relations read/write/delete;
- slot capacity;
- Telegram/Public Activity exclusion;
- desktop/mobile;
- sequential browser scenario;
- no duplicate shell/Board/Artifact owners.

### G7 RELEASE
Only after exact G6 candidate is frozen.

Release from current production baseline through clean exact diff.

Backend deployment and Pages deployment are separate operations.

### G8 CLEANUP
After live acceptance:

- owner live scenario;
- stale work branches;
- temporary flags;
- duplicate/dead code;
- Result/kernel/index reconciliation.

## 12. Explicit stop boundaries

At this checkpoint:

```text
LIVE SUPABASE APPLY = NOT AUTHORIZED
PRODUCTION MERGE = NOT AUTHORIZED
PRODUCTION DEPLOY = NOT AUTHORIZED
```

No developer may interpret implementation progress as release approval.

## 13. After this Result

After Artifact Collaboration v1 live acceptance:

```text
freeze product baseline
→ activate infrastructure migration #237
→ staging self-hosted stack
→ backup/restore proof
→ auth/storage/DB/worker validation
→ controlled cutover
→ continue product development on own infrastructure
```

Do not mix infrastructure migration into Artifact Collaboration v1.
