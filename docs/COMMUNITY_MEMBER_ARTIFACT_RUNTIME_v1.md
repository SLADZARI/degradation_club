# Dementor Club — Community Member & Artifact Runtime v1

Status: **IMPLEMENTATION CONTRACT / SOURCE-APPROVED MECHANIC**  
Date: 2026-08-30  
Branch: `dementor-club-site`  
Product authority: `dementor-club/community/MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md`  
Diagnostic authority: `dementor-club/operations/ONBOARDING_SYSTEM.md`  
Design authority: `docs/DEMENTOR_DESIGN_CANON_CURRENT.md`

## 1. Goal

Implement the approved first-entry Community loop without creating a second identity/membership system:

`9 SPHERES → RESULT → IDENTITY → ACTIVE MEMBERSHIP → BOARD → FIRST ARTIFACT → REACTION/RESPONSE`

This document defines implementation mapping only. It must not change the product meaning approved in `dementor-club`.

## 2. Existing runtime to reuse

Current Supabase project already contains:

- `profiles` — authenticated user profile;
- `assessment_runs` — completed sphere assessment records (`profile_id`, `sphere_id`, `result_json`, `completed_at`, `source_key`);
- `assessment_snapshots` — in-progress/local-to-server assessment state;
- `dc_system_memberships` — Dementor Club membership state;
- `join_applications` — previous reviewed-application model;
- `dc_entities` / `dc_entity_assignments` — existing entity/assignment authorization model.

Do not create parallel `users`, `memberships` or second sphere-result tables.

## 3. Deprecated runtime path

`/join/apply/` currently implements a previous mechanic:

- required first/last name;
- required social URL;
- required `about`;
- optional `why_club`;
- separate manual 100% interest distribution;
- `join_applications` submission/review states.

For Community membership v1 this path is superseded by the approved 9/9 + minimal identity + automatic membership mechanic.

Do not delete `join_applications` or historical application rows during the first migration. Mark the flow legacy and stop creating new rows from the new member-entry path.

## 4. Gate computation

Membership entry eligibility must be computed from factual assessment data, not from a client-provided `9/9=true` flag.

Canonical spheres:

- personality
- work
- consumption
- relationships
- control
- information
- self_development
- meaning
- technology

Eligibility condition:

- authenticated `auth.uid()` exists;
- nine distinct canonical `sphere_id` values have completed assessment runs for the profile;
- display identity requirements are complete;
- required consent state is complete.

Duplicate/history runs for the same sphere must not increase the completed-sphere count.

## 5. Profile / member identity

Reuse `profiles.id = auth.users.id`.

Recommended profile extensions:

- `display_name text`;
- `nickname text null`;
- continue using `avatar_url` for selected/uploaded avatar.

Do not use user-editable Auth metadata for authorization.

### External identities

Add a separate normalized table rather than a single `social_url` column:

`dc_member_external_identities`

Recommended fields:

- `id uuid`;
- `profile_id uuid` FK → profiles;
- `provider text`;
- `handle text null`;
- `url text null`;
- `is_primary boolean`;
- `visibility text`;
- `created_at`;
- `updated_at`.

At least one supported identity/contact record is required before membership activation.

## 6. Membership

Reuse `dc_system_memberships`.

Do not create `members` as a replacement membership table.

For v1 activation, server-side logic must validate eligibility and then insert/upsert:

- `profile_id = auth.uid()`;
- `status = active`;
- `source_system = dementor-club`;
- source/provenance identifying the v1 member-entry mechanic;
- `valid_from = now()`.

Client code must not be able to arbitrarily create active membership without server-side eligibility validation.

The existing `dc_system_memberships` read policy can continue to expose a Member's own membership state.

## 7. Member activation state

Do not overload `dc_system_memberships.status` with first-artifact state.

Membership remains membership.

First-entry activation is derived from Artifact state:

- active membership + zero published Member Artifacts → `FIRST_ARTIFACT_REQUIRED`;
- active membership + at least one successfully published Member Artifact → `MEMBER_ACTIVATED`.

This avoids mixing Community participation state into the membership lifecycle.

## 8. Artifact tables

### `dc_artifacts`

Recommended fields:

- `id uuid primary key default gen_random_uuid()`;
- `author_profile_id uuid not null` FK → profiles;
- `artifact_type text not null default 'notice'`;
- `title text null`;
- `body text not null`;
- `status text not null`;
- `visibility text not null default 'community'`;
- `starts_at timestamptz null`;
- `expires_at timestamptz null`;
- `published_at timestamptz null`;
- `closed_at timestamptz null`;
- `promoted_entity_type text null`;
- `promoted_entity_id uuid null`;
- `source_system text not null default 'community-member'`;
- `source_ref text null`;
- `provenance_status text not null default 'confirmed'`;
- `created_at timestamptz not null default now()`;
- `updated_at timestamptz not null default now()`.

Initial allowed states:

`draft / publishing / active / expired / archived / removed`

Initial visibility:

`community`

### `dc_artifact_media`

Recommended fields:

- `id`;
- `artifact_id`;
- `owner_profile_id`;
- `media_type`;
- `storage_bucket`;
- `storage_path`;
- optional `external_url`;
- metadata;
- timestamps.

MVP supports one primary image or one file plus an optional external URL at composer level. Schema may support multiple media rows without exposing multiple-file UI yet.

### `dc_artifact_reactions`

Recommended unique relation:

`unique (artifact_id, profile_id, reaction_type)`

MVP should expose one semantic interest reaction rather than an emoji system.

### `dc_artifact_responses`

Fields should include:

- artifact;
- responder;
- optional message;
- status;
- timestamps.

A response is explicit interest/contact intent and is distinct from a reaction.

### `dc_artifact_slot_grants`

Ledger rather than mutable magic counter.

Recommended fields:

- `id`;
- `profile_id`;
- `amount integer`;
- `reason`;
- optional source entity type/id;
- source/provenance;
- timestamps.

Initial membership activation creates/grants exactly one initial slot according to the server transaction.

Future reward reasons remain disabled until separately approved.

## 9. Slot computation

Avoid trusting a client-maintained integer.

Available slot count should be calculated or transactionally maintained from:

`granted slots - currently consuming active/publishing artifact slots`

For v1, one initial grant is enough.

Publishing must atomically:

1. verify active membership;
2. verify available slot;
3. create/transition Artifact to active;
4. consume the slot exactly once.

Concurrent requests must not create two active Artifacts from one slot.

A failed publication/upload must not consume the slot.

## 10. Board read authorization

Board semantics differ from `dc_entities` assignment semantics.

Current `dc_can_read_entity()` requires active membership plus owner/admin or an explicit entity assignment. That is appropriate for assigned entities but not for the Community Board.

Artifact Board read rule v1:

> Any active Dementor Club Member may read active/eligible `visibility = community` Artifacts.

Therefore Artifact RLS must use active membership as the principal gate and must not require an assignment row per Artifact.

Owner/admin may retain moderation access to terminal/removed states according to policy.

## 11. Artifact write authorization

Authenticated Member may:

- insert/create only an Artifact whose `author_profile_id = auth.uid()`;
- modify own draft/eligible Artifact states;
- close/retire own Artifact through approved transition;
- never reassign `author_profile_id`;
- never self-promote the Artifact into an approved Event/Course/Project through arbitrary client update.

Promotion fields should be server/admin controlled.

RLS UPDATE policies require both `USING` and `WITH CHECK`.

## 12. Reaction/response authorization

An active Member may react/respond only as `auth.uid()`.

A Member may not create a reaction/response on behalf of another profile.

Read access follows Community Board visibility.

Artifact author may read responses to their own Artifact; responder may read their own response. If response threads become generally visible later, that is a separate product decision.

## 13. Storage

Create/use a Community Artifact storage bucket with explicit access policy.

Requirements:

- frontend uses only publishable key/session;
- never expose service-role key;
- upload path must encode/validate ownership;
- allowed MIME types and size limits enforced server-side/storage policy;
- Community media must not become globally public by accident;
- signed/authenticated reads for private Community media;
- upsert behavior, if enabled, must have INSERT + SELECT + UPDATE policies.

## 14. Stable routes

Recommended implementation routes:

- `/join/` — sphere onboarding entry;
- `/join/result/` — accumulated 9-sphere result / entry CTA;
- `/join/member/` — minimal Community identity + activation;
- `/community/` — existing public Community index;
- `/community/board/` — authenticated Board;
- `/community/artifact/:id` — stable Artifact detail/address;
- Member presence route can be added when profile presentation contract is approved.

Do not replace `/community/` with the authenticated Board.

## 15. Component/state contract

Reuse current Club primitives and service-state vocabulary.

New domain components:

- `SphereCompletionGate`;
- `MembershipIdentityForm`;
- `MembershipStatus`;
- `CommunityBoard`;
- `FirstArtifactGate`;
- `ArtifactNotice`;
- `ArtifactComposer`;
- `ArtifactMediaInput`;
- `ArtifactExpirationControl`;
- `ArtifactReaction`;
- `ArtifactResponse`;
- `ArtifactSlotIndicator`;
- `MemberMicroIdentity`.

Every interactive component must cover relevant states:

`default / hover / focus-visible / active / selected / disabled / loading / processing / error / offline / empty / complete`.

## 16. Responsive contract

Validate at:

- 1440;
- 1024;
- 768;
- 390;
- 320.

Desktop Board may use controlled spatial/wall composition.

Mobile Board must recompose into a readable vertical Artifact stream; do not scale an infinite desktop wall down.

No essential action may depend on hover.

## 17. Design contract

Follow current canon:

`PAPER / BLACK / ACID + editorial metadata + controlled system violation`.

Board physicality is local presentation behavior, not permission to make the whole page chaotic.

Avoid generic SaaS cards, pill-heavy controls, glass UI, random rotation/glitch and accidental clipping.

Artifact is a new entity family. Before propagation, add its approved presentation role to `ENTITY_PRESENTATION_STANDARD_v1.md` or a versioned successor and validate it in `/design-system/`.

## 18. Seed Artifacts

Historical/current Club seeds must be imported from source-backed records only.

Each seed must preserve:

- factual date if known;
- author/source if known;
- source reference;
- provenance status;
- current/archived state.

Do not fabricate narrative context to make an old asset look more complete.

## 19. Analytics events

Minimum MVP instrumentation:

- `spheres_completed_9`;
- `membership_started`;
- `membership_completed`;
- `board_first_view`;
- `artifact_composer_opened`;
- `first_artifact_published`;
- `artifact_reacted`;
- `artifact_response_created`;
- `return_after_reaction`.

Primary MVP metric:

`new active Members who publish first Artifact / new active Members`

Secondary:

`Artifacts receiving at least one real response / published Artifacts`

## 20. Migration order

1. Extend profile identity fields / external identities.
2. Add Artifact + media + reaction + response + slot ledger schema.
3. Add RLS and server-side membership/artifact transactions.
4. Verify security/performance advisors.
5. Implement `/join/result/` and `/join/member/`.
6. Retire new writes through legacy `join_applications` flow.
7. Implement Board read.
8. Implement first Artifact publish transaction.
9. Implement reaction/response.
10. Add Artifact presentation contract/UI Lab specimen.
11. Responsive/accessibility QA.
12. Update feature activation matrix only after runtime/data/provider checks pass.

## 21. Explicit non-goals

Not part of runtime v1:

- public Board;
- payment;
- ratings/points;
- complex reward economy;
- automatic Dementor promotion;
- automatic Artifact-to-Event promotion;
- Telegram as source-of-truth;
- one chat per Artifact;
- AI summary as membership gate.
