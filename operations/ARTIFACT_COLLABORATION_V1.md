---
artifactId: dementor-club.decision.artifact-collaboration-v1
project: dementor-club
documentType: PRODUCT_DECISION
projectStage: BUILD
gate: G4_SEMANTIC_CONTRACT
status: APPROVED
version: 1.0
updated: 2026-09-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: APPROVED_AUTHORITY
changeControl: APPROVED_BY_OWNER_2026-09-23
scope:
  - Artifact ideas
  - participation
  - invitations
  - circle visibility
  - Artifact capacity / slots
  - participant-scoped RELATED_TO
supersedesScope:
  - community/MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md section 10 only for IDEA visibility
  - community/MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md section 12 only to approve explicit manual slot grants
---

# Dementor Club — Artifact Collaboration v1

**STATUS: APPROVED / PROJECT-LOCAL SOURCE OF TRUTH**

## 1. Why this exists

The Board already supports an Artifact subtype `idea`, a canonical author, reactions/responses, Share/Auth return, slot accounting and generic Board Relations.

What is missing is the club mechanic that lets a real idea become a small working circle:

```text
AUTHOR CREATES IDEA
→ INVITES SPECIFIC REGISTERED PEOPLE
→ THEY EXPLICITLY JOIN / DECLINE
→ CARD SHOWS WHO IS ACTUALLY AROUND THE IDEA
→ EACH JOINED PARTICIPANT MAY BRING RELEVANT BOARD CONNECTIONS
```

This Decision adds that collaboration layer without turning participants into owners, Members or generic relation endpoints.

## 2. Core distinctions

```text
AUTHOR / INITIATOR ≠ PARTICIPANT
INVITED ≠ JOINED
JOINED ≠ OWNER
JOINED ≠ MEMBER
JOINED ≠ DEMENTOR
INTEREST ≠ JOIN
RESPONSE ≠ JOIN
ARTIFACT SLOT ≠ MEMBERSHIP
CIRCLE VISIBILITY ≠ PUBLIC / COMMUNITY VISIBILITY
```

No invitation or join action changes Membership, DC-9, Application, Dementor or Owner Admin semantics.

## 3. Scope v1

Artifact Collaboration v1 applies to:

```text
artifact_type = idea
```

Other Artifact subtypes keep their existing behavior unless separately approved.

## 4. Author / initiator

Every Idea keeps exactly one canonical author through the existing Artifact owner:

`dc_artifacts.author_profile_id`

Presentation may call this person:

`ИНИЦИАТОР`

No co-ownership model is introduced.

Only the author, plus Owner Admin for moderation/recovery, may in v1:

- invite registered profiles;
- remove an invitee/participant;
- close/archive the Idea;
- manage the Idea's collaboration settings.

Joined participants do not gain author-edit or close/archive authority.

## 5. Participation lifecycle

Each Idea has its own independent participant set.

Canonical v1 states:

```text
INVITED
JOINED
DECLINED
LEFT
REMOVED
```

Meaning:

- `INVITED` — author invited the profile; the person has not joined yet.
- `JOINED` — invitee explicitly accepted and is in the Idea circle.
- `DECLINED` — invitee explicitly declined / chose not to join.
- `LEFT` — a previously joined participant left the Idea.
- `REMOVED` — author/Owner Admin removed access/participation.

Re-invitation after DECLINED / LEFT / REMOVED is allowed as a new auditable transition.

An interest reaction or response never silently creates JOINED.

## 6. Who can be invited

v1 invite target is an **existing registered Dementor Club profile**.

No email-address invitation system is introduced in this Result.

UI must use a safe platform identity selector. It must not expose private account email merely to make profile search convenient.

An unregistered person must first create/authenticate an account before becoming a canonical invite target.

## 7. Visibility

Existing default remains:

```text
COMMUNITY
```

Artifact Collaboration v1 adds exactly one additional Idea visibility:

```text
CIRCLE
```

Human labels:

```text
ВЕСЬ КЛУБ
СВОЙ КРУГ
```

This is a scoped supersession of the old v1 prohibition on private/custom audience. It does **not** authorize generic friends lists, arbitrary ACL products, paid visibility or public/private matrices.

### COMMUNITY Idea

Readable under the existing Board access model.

The participant roster may be shown to readers who are already authorized to read the Idea.

### CIRCLE Idea

Readable only by:

- author;
- profiles currently INVITED, so they can make the join decision;
- profiles currently JOINED;
- Owner Admin for moderation/recovery.

After DECLINED / LEFT / REMOVED, circle read access ends unless the user is re-invited.

A CIRCLE Idea must not be exposed through:

- Board list/card to unauthorized viewers;
- Artifact detail to unauthorized viewers;
- guest/public activity;
- Telegram promotion/distribution;
- public metadata/OG body/media;
- relation lines that reveal the hidden endpoint;
- media signed URLs to unauthorized viewers.

Unauthorized access must preserve the existing generic missing/denied boundary and must not become an Artifact-existence oracle.

## 8. Circle and Share/Auth

The existing Share/Auth/Return owner remains canonical.

For a CIRCLE Idea:

- sharing a URL does not grant access;
- access comes from the canonical circle authorization state;
- an invited authenticated profile may use the share URL to reach the Idea;
- an authenticated profile outside the circle receives the generic unavailable state;
- Share must not create an implicit invitation.

No second auth/share owner is allowed.

## 9. Capacity / slots

The existing Artifact-slot model remains canonical.

Baseline:

```text
initial Member capacity = 1 slot
one active/publishing Artifact = consumes 1 slot
closed / archived / expired non-consuming Artifact = frees active capacity according to existing accounting
```

Artifact Collaboration v1 approves **explicit additional slot grants** through the existing slot-grant owner.

```text
dc_artifact_slot_grants
```

No reward economy is introduced.

No automatic rules such as:

- N reactions = slot;
- N participants = slot;
- Dementor role = unlimited slots.

Dementor role alone does not bypass slot limits.

Owner Admin's existing operational bypass remains an admin capability and is not a Member/Dementor entitlement.

v1 must provide a canonical Owner Admin operation to grant additional capacity to a registered profile, with durable amount, reason and provenance. Extend the existing grant owner; do not create a parallel capacity table.

COMMUNITY and CIRCLE Ideas consume capacity identically.

Each Idea has its own participant set regardless of who authored the author's other Ideas.

## 10. Card/detail presentation

Sparse Board card should expose collaboration without turning into a CRM panel.

Target hierarchy:

```text
ИДЕЯ

[title / premise]

ИНИЦИАТОР
[avatar] Габиль

В ДЕЛЕ
[avatars of JOINED participants]

ПОЗВАНЫ
[count / compact avatars when useful]

[primary action appropriate to viewer]
```

Detailed invite state management belongs in the existing Artifact detail/fullscreen composition, not a parallel page/modal owner.

For an invitee:

```text
ГАБИЛЬ ЗОВЁТ ВАС В ЭТУ ИДЕЮ

[ПРИСОЕДИНИТЬСЯ]
[НЕ СЕЙЧАС]
```

For a joined participant:

```text
ВЫ В ДЕЛЕ
[ВЫЙТИ]
```

Copy may be refined without changing the state semantics above.

## 11. Participant-scoped Board connections

Board Relations v1 remains the canonical generic object↔object graph.

Person must **not** be added as a generic Board relation endpoint.

A JOINED participant may add only:

```text
RELATED_TO
```

between the joined Idea and Board objects the participant can already read, limited to currently supported relation endpoint kinds:

```text
artifact
event
program
```

This is a scoped collaboration permission, not generic relation ownership.

A JOINED participant may not gain authority to create:

- RESULT_OF;
- CONTINUES;
- ABOUT;
- REPORT_OF;
- any future directional semantic relation

on behalf of the author.

Deletion rule v1:

- author / Owner Admin may manage the Idea's permitted relations under existing authority;
- joined participant may delete only the RELATED_TO edge they themselves created through the participant path.

Relation reads must require viewer access to both endpoints. A CIRCLE Idea must never leak through a relation shown on a COMMUNITY object.

## 12. Reactions and responses

Existing reactions/responses remain separate from participation.

For COMMUNITY Ideas:

- existing authorized readers keep current reaction/response capabilities;
- only explicit invitation + acceptance produces JOINED.

For CIRCLE Ideas:

- INVITED may read the Idea and accept/decline;
- JOINED may use normal collaboration actions according to access policy;
- users outside the circle have no read/reaction/response path.

No reaction/response row is backfilled into a participant relation.

## 13. Existing owners to extend

Existing before new:

- `dc_artifacts` — Artifact identity, author, lifecycle, visibility field;
- `dc_artifact_slot_grants` — capacity grants;
- existing Artifact publish/close accounting — slot consumption;
- `profiles` / safe profile projection — invite identity;
- Share/Auth return owner — invitation transport/navigation only;
- `dc_board_relations` — object↔object relations;
- canonical Artifact detail/fullscreen/card owners — collaboration presentation;
- existing Board access resolver/RLS — base access semantics;
- existing private Community media bucket — media boundary.

A new Artifact-scoped participation persistence owner is justified only if G4/G5 inventory proves no existing equivalent. It must not be implemented as generic Person relations or a second Membership system.

## 14. Explicit non-goals v1

Not authorized:

- co-ownership;
- participant editing of Idea body/title;
- open self-join without invitation;
- email invite system;
- generic friends/groups ACL system;
- unlimited Idea creation;
- automated slot rewards;
- participant role hierarchy;
- chat/thread system;
- new Membership states;
- new generic Person endpoint in Board Relations;
- Project creation/promotion;
- Contribution runtime changes;
- public CIRCLE previews;
- migration to self-hosted infrastructure inside this Result.

## 15. Required real acceptance scenario

Before this Result can close, production must prove the real club scenario.

Example:

```text
Gabil has >1 granted slot
→ creates Idea A
→ visibility = CIRCLE
→ invites Andrus, Zhenya, Nikita
→ each invite state is visible correctly
→ at least two explicitly JOIN
→ roster updates
→ one invitee DECLINES or remains INVITED
→ unauthorized authenticated user cannot discover/open Idea A
→ JOINED participant links one accessible Board Artifact/Event/Program with RELATED_TO
→ unrelated user does not see a relation leak
→ Gabil creates Idea B with a different participant set
→ Idea A and Idea B rosters remain independent
→ slot ceiling blocks Idea N+1 above granted capacity
→ closing one active Idea releases capacity under existing slot accounting
```

Desktop and mobile must both pass.

No production merge/deploy is authorized by this Decision alone.

## 16. Pre-migration boundary

This is the last bounded product capability planned before infrastructure migration #237.

After Artifact Collaboration v1 reaches validated production/live acceptance:

```text
freeze product baseline
→ activate self-hosted infrastructure migration Result
→ staging restore / auth / DB / storage / worker proof
→ controlled cutover
```

Infrastructure migration remains a separate Result and release decision.
