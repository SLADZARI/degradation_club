# Dementor Club — Community Board Entity Model v1

STATUS: **APPROVED / SOURCE OF TRUTH**  
VERSION: **v1**  
DATE: **2026-08-30**  
SCOPE: how Member Artifacts and Club/platform entities appear together on Community Board without duplicating canonical data  
IMPLEMENTATION TARGET: `dementor-club-site`

This document extends `MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md`, `COMMUNITY_BOARD_ACCESS_AND_SPATIAL_MODEL_V2.md`, `COMMUNITY_ARTIFACT_CARD_CONTRACT_V1.md` and `COMMUNITY_PLATFORM_ARTIFACT_TYPES_V1.md`.

## 1. Core principle

Community Board is a shared activity surface, not a second source of truth for Club products or events.

Two families may appear together on the Board:

1. **Native Board Artifact** — authored contribution/activity object whose canonical identity is the Artifact itself.
2. **Board Projection** — Board representation of another canonical Club/platform entity such as Event, Course, Project or approved Activity.

Canonical rule:

`CANONICAL ENTITY → BOARD PROJECTION`

Never:

`BOARD COPY → separate independently edited Event/Course/Project copy`

Member Artifacts remain canonical Artifacts:

`MEMBER → ARTIFACT → BOARD`

## 2. Source model

Every Board object must resolve one of these source modes:

### `artifact`
Canonical source is a Community Artifact record.

Required relation:
- `artifact_id`

Typical examples:
- Member notice
- Member invitation
- Member experiment
- Member proposal
- source-backed Club Artifact where Artifact itself is canonical

### `entity_projection`
Canonical source is a separate Club/platform entity.

Required relation:
- `source_type`
- `source_id`

Initial approved `source_type` values:
- `event`
- `course`
- `project`
- `activity`

Additional source types require explicit approval before production use.

### `system`
Canonical source is a platform/system record intended only as system communication.

Typical examples:
- platform alert
- maintenance notice
- access/rule notice

System messages must not impersonate Member content.

## 3. Board object/read-model shape

The Board may expose a unified read model for rendering and filtering.

Recommended logical fields:

- `board_object_id`
- `source_mode`: `artifact | entity_projection | system`
- `artifact_id` nullable
- `source_type` nullable
- `source_id` nullable
- `presentation_type`
- `title`
- `body` / teaser according to permission
- `author_label` / owner identity according to source
- `image_ref` / media projection where permitted
- `starts_at`
- `expires_at`
- `location_label`
- `status`
- `interaction_policy`
- `visibility`
- `x`
- `y`
- `rotation`
- `size_class`
- `created_at`
- `updated_at`

The read model may denormalize display fields for performance, but canonical edits remain in the underlying source entity.

## 4. Projection freshness

For `entity_projection`, Board content must not become an independently editable semantic copy.

Preferred approaches:

1. render/query directly from canonical source + Board placement metadata; or
2. maintain a projection/read model refreshed transactionally/event-driven from canonical source.

The implementation must avoid stale duplicate date, title, status, location or URL values after source updates.

## 5. Initial platform projections

### Event projection

Source:
`Event`

Board behavior:
- may use `CLUB EVENT` visual treatment;
- title/date/location/image derive from Event source;
- card links to stable Event URL;
- Event status controls active/upcoming/completed presentation;
- completed Event may leave the active field and remain in archive/history according to product rules.

An event-like Member Artifact is still not an Event projection unless explicit promotion created an Event entity.

### Course projection

Source:
`Course`

Board behavior:
- official platform card;
- title/hero/status/availability derive from canonical Course source;
- links to Course page;
- may expose start/enrollment timing where the Course source actually contains it;
- no invented schedule or enrollment state.

### Project projection

Source:
`Project`

Board behavior:
- represents an approved Club project already present in the ecosystem;
- links to the Project page;
- may expose current project activity/status only if canonical source provides it;
- a project card must not turn Board into a Projects catalog by default; only currently relevant/approved projections belong in active Board space.

### Activity projection

Source:
`Activity`

Use for an approved Club/platform activity that is real but has not become a mature Event/Course/Project entity.

Important distinction:
- `forming` may communicate that participation/conditions are being assembled;
- it must not visually or semantically claim `announced Event` status;
- once explicitly promoted, projection source changes to the new canonical entity rather than maintaining two independent representations.

## 6. System communication

Approved platform/system visual types may include:
- `PLATFORM ALERT`
- `SYSTEM BLACK`
- `PLATFORM WHITE`

These are controlled by Club/platform authority.

Members cannot select these types for their own Artifact.

System messages must have explicit lifecycle and status. They should not remain forever on the active Board merely because they are visually prominent.

## 7. Filtering model

Board filters are derived from real source/presentation attributes, not decorative tags.

Initial factual navigation/filter dimensions may include:
- `all`
- `member`
- `platform`
- `event`
- `course`
- `project`
- `activity/forming`
- `alert/system`
- `has_location`
- `has_time`
- `mine`

Filters preserve spatial context where practical: nonmatches may dim while matches remain navigable via camera routes.

Semantic/topic filters require a separately approved metadata model.

## 8. Interaction policy

Interaction is not determined solely by visual type.

Each Board object resolves an `interaction_policy`, initially one of:
- `normal`
- `reaction_only`
- `read_only`
- `action_link`

Examples:
- Member Artifact: usually `normal`.
- forming Club activity: may be `normal` to collect interest/responses.
- official Course/Event projection: usually `action_link` to canonical page; reactions/responses only if product rules explicitly permit them.
- maintenance/System message: `read_only`.

Existing membership activation gates remain authoritative:
`REACTION_ALLOWED = MEMBER_ACTIVATED`
`RESPONSE_ALLOWED = MEMBER_ACTIVATED`

## 9. Ownership and movement

Movement is Board presentation state, not semantic entity editing.

Initial rule:
- Member may move own native Artifact where movement is enabled.
- Member may not move Club/system projections.
- Club/platform operator may place/move projections according to Board operational controls.

Changing x/y never changes the canonical Event/Course/Project semantics.

## 10. Lifecycle mapping

Native Member Artifact follows Artifact lifecycle.

Projection lifecycle follows its source entity plus Board placement rules.

Examples:
- cancelled Event projection must reflect cancelled Event status;
- completed Event should stop looking upcoming;
- closed enrollment Course must not continue showing open enrollment;
- forming Activity promoted to Event must stop presenting as ambiguous forming Activity after the transition is approved.

No Board-only manual override may silently contradict the canonical source.

## 11. Public preview

Public/fog preview remains a separate safe projection.

For `entity_projection`, public teaser may reuse fields already intentionally public on the canonical source.
For Member Artifacts, default remains `community` visibility and only explicit public-safe preview fields may be exposed.

The Board must not infer public visibility merely from source type.

## 12. Integration surfaces

One Board source/read model may feed multiple presentations:

- full `/community/board/` spatial surface;
- Home `Now on the Board` teaser;
- Community root preview;
- Event-related Board slice;
- Course-related Board slice;
- Project-related Board slice;
- Member profile Artifact history/current presence;
- Archive/history;
- Telegram/social distribution where explicitly allowed.

These are projections of the same underlying records, not separate manually maintained card copies.

## 13. Definition of Done

This model is implemented when:

1. Board can render native Artifacts and canonical entity projections in one spatial field;
2. every projected object has resolvable `source_mode` and source relation;
3. Event/Course/Project edits propagate without manual Board copy editing;
4. Member cannot create platform/system authority types;
5. filters operate on real object attributes;
6. interaction policy is explicit and server-authorized;
7. movement affects presentation state only;
8. lifecycle/status changes cannot leave misleading stale Board cards;
9. public preview preserves the existing safe projection boundary;
10. Home/Community/Event/Course/Project/Profile/Archive surfaces can reuse the same Board object model without duplicating canonical data.
