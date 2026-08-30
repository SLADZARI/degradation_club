# Dementor Club — Platform Community Artifact Types v1

STATUS: **APPROVED / SOURCE OF TRUTH**  
VERSION: **v1**  
DATE: **2026-08-30**  
SCOPE: platform-owned Community Board Artifact presentation types, authority, interaction rules  
IMPLEMENTATION TARGET: `dementor-club-site`

This document extends `COMMUNITY_ARTIFACT_CARD_CONTRACT_V1.md` and `COMMUNITY_BOARD_ACCESS_AND_SPATIAL_MODEL_V2.md`.

It does not change the canonical Member Artifact model or automatic promotion rules.

## 1. Principle

The Community Board contains both Member-created Artifacts and source-backed Club/System Artifacts.

Some Club/System Artifacts require stronger platform-native visual treatment so that operationally important information is distinguishable from ordinary Member notices.

**Presentation priority is authority-controlled.**

A normal Member may not choose a platform/system severity merely to make their Artifact more prominent.

Color/style is not an author-controlled popularity mechanic.

## 2. Approved presentation authority classes

### MEMBER_NOTICE

Authority: Member.

Default Community Artifact presentation.

May contain the modules already approved in `COMMUNITY_ARTIFACT_CARD_CONTRACT_V1.md`: title, body, image, date, timer, location, link and derived metadata.

Visual direction: paper/off-white member notice with normal Board styling.

### CLUB_EVENT_NOTICE

Authority: Club/platform only.

Purpose: a source-backed Club announcement referring to an approved Club Event or other explicitly approved Club activity.

Visual direction: high-visibility **acid/yellow full-card treatment** with black typography/borders.

Required provenance/source relation must exist. A Member notice with a date/location is **not** automatically a `CLUB_EVENT_NOTICE`.

This presentation must not be used for an idea-stage or unapproved event.

### PLATFORM_ALERT

Authority: platform/system or explicitly authorized Club operator only.

Purpose: serious time-sensitive Community notice where Members should notice the message before ordinary Board exploration.

Examples of category shape: access interruption, urgent schedule/location change for an approved Club activity, safety/operational notice, action deadline.

Visual direction: **acid/yellow alert card** with explicit `ALERT` marker and stronger hierarchy than a normal Club notice.

`PLATFORM_ALERT` is not available in the Member composer.

It must not be used as promotional decoration.

### SYSTEM_BLACK

Authority: system/platform only.

Purpose: machine/platform state that materially affects Community usage or requires an explicit platform message.

Visual direction: **full black card, light text**, strong system label.

Typical content is operational/systemic rather than editorial Member content.

It may be non-reactable depending on the specific message.

### PLATFORM_WHITE

Authority: Club/platform only.

Purpose: neutral official platform/club information that should be clearly distinguished from Member-authored paper notices without implying urgency.

Visual direction: **clean white card**, black typography, reduced decorative irregularity, explicit platform/club marker.

Examples: Community rule clarification, official information, onboarding/platform guidance, source-backed Club record.

### SOURCE_BACKED_ARCHIVE

Authority: Club/platform only.

Purpose: historical/source-backed Club Artifact with explicit provenance.

Visual direction may use neutral white/paper archival treatment plus source/date marker.

It must never be made to look current if its source/date is historical.

## 3. Member authority boundary

The normal Member composer must not expose direct choices for:

- `CLUB_EVENT_NOTICE`;
- `PLATFORM_ALERT`;
- `SYSTEM_BLACK`;
- `PLATFORM_WHITE` as an authority marker;
- `SOURCE_BACKED_ARCHIVE`.

A Member creates a normal Community Artifact (`MEMBER_NOTICE`).

If a Member Artifact later becomes evidence/source for an approved Club Event/Project/Practice/other entity, promotion remains an explicit Club/product operation.

A promoted entity may receive a Club-owned Board Artifact or platform presentation through an explicit relation. The original Member Artifact keeps its identity and provenance.

## 4. Interaction policy

Platform presentation type does not automatically grant or remove reactions/responses.

Each platform Artifact must define an interaction policy from this approved small set:

- `normal` — activated Members may react/respond according to normal Community rules;
- `reaction_only` — activated Members may react, but no response action;
- `read_only` — no reaction/response; informational/system card;
- `action_link` — primary platform CTA/link may be shown; reactions/responses are optional according to one of the above policies.

Member `MEMBER_NOTICE` defaults to `normal` unless another existing approved rule applies.

`SYSTEM_BLACK` defaults to `read_only` unless explicitly configured otherwise.

`PLATFORM_ALERT` defaults to `read_only` or `action_link`; it is not a discussion object by default.

`CLUB_EVENT_NOTICE` may be `normal`, `reaction_only`, or `action_link` depending on the approved Event mechanics.

## 5. Board placement and prominence

Platform Artifacts still occupy the same spatial Board world.

They may have stronger visual contrast and a somewhat larger deterministic footprint, but they must not create a separate infinite overlay/feed that destroys the spatial model.

A platform Alert may optionally request temporary camera/navigation prominence, but this must be explicit presentation state and must not silently move Member Artifacts.

Members cannot move platform/system Artifacts.

Only the author/authorized platform operator may move/retire platform-owned Artifacts.

## 6. Deletion / retirement

Normal UI language should prefer `close`, `retire` or `archive` for published Artifacts rather than destructive delete.

Prototype/sandbox may offer a literal delete action for testing local synthetic objects, but production semantics remain lifecycle-based and provenance-preserving.

Platform/system Artifacts must preserve source/audit metadata where required.

## 7. Required card identity markers

Platform-owned cards must show enough identity to prevent confusion with Member speech.

At minimum, depending on type:

- authority label (`DEMENTOR CLUB`, `SYSTEM`, `ALERT`, etc.);
- Artifact short ID;
- timestamp/status where relevant;
- provenance/source marker for source-backed records;
- date/location/timer modules when actually present.

User-authored body text must not be fabricated to populate official/system cards.

## 8. Prototype requirements

The Spatial Board sandbox must demonstrate at least:

1. normal Member text notice;
2. Member image notice;
3. Member date/location/countdown notice;
4. Club Event yellow card;
5. Platform Alert yellow high-priority card;
6. System Black card;
7. Platform White card;
8. source-backed/archive card;
9. own Member Artifact;
10. expired Artifact.

The sandbox must support:

- creating synthetic cards;
- selecting a Member or Platform prototype authoring role;
- preventing Member role from selecting platform-only presentation types;
- drag/reposition behavior;
- opening/detail;
- local reaction/response simulation according to access state and card interaction policy;
- closing/removing synthetic cards;
- access-state switching (`OUTSIDER / ONBOARDING / FIRST_ARTIFACT_REQUIRED / MEMBER_ACTIVATED`);
- local reset to seed Board;
- no production data writes.

## 9. Definition of Done

This contract is represented correctly when:

1. Member and platform authority are visually and semantically distinguishable;
2. a Member cannot self-assign system/alert/event authority styling;
3. yellow is reserved for approved Club/Event/Alert high-visibility platform use rather than ordinary Member emphasis;
4. black system cards are clearly machine/platform authored;
5. white official cards remain neutral rather than urgent;
6. interaction controls respect both Member activation state and per-card interaction policy;
7. platform cards remain part of the spatial Board rather than replacing it with a second feed;
8. production lifecycle remains archive/retire-oriented even if the sandbox supports literal local deletion for testing.
