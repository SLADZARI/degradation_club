# Dementor Club — Member Entry & First Artifact Flow v1

STATUS: **APPROVED / SOURCE OF TRUTH**  
VERSION: **v1**  
DATE: **2026-08-30**  
SCOPE: Community membership entry, first Community action, Artifact baseline  
IMPLEMENTATION TARGET: `dementor-club-site`

## 1. Purpose

Community entry must not end with account creation or a passive welcome screen.

The first successful club session must move a person from completed profile diagnostics into visible participation:

`9 SPHERES → RESULT → IDENTITY → MEMBERSHIP → BOARD → FIRST ARTIFACT → COMMUNITY REACTION`

The first activation criterion is not merely `membership = active`.

A newly admitted Member is considered **Community-activated** after their first Artifact has been successfully published.

## 2. Canonical distinctions

### User

An authenticated platform user.

`Authentication ≠ Membership`.

### Member

A person with active Dementor Club Community membership.

### Dementor

A separate club role/entity.

`Member ≠ Dementor`.

A Member may be asked to imagine acting "as if they were a Dementor" when creating their first proposal. This does not grant Dementor status.

### Artifact

A persistent Community contribution/object created by a Member or by the Club as a source-backed historical/current record.

The first implemented Artifact presentation is:

`type = notice`

Public/member-facing wording for this first form: **объявление**.

## 3. Membership entry gate v1

For v1, Community membership entry becomes available only after all nine canonical sphere onboardings have been completed.

The nine sphere results remain independent profile results. They are not averaged into one universal score.

Required preconditions for membership activation:

- authenticated user;
- completed results for all 9 canonical spheres;
- display name;
- at least one social/contact identity;
- required legal/privacy consent state for the implementation.

When all required gates are satisfied, membership v1 becomes active automatically.

There is no manual review committee in v1.

If a later version introduces review, invitation, sponsorship or approval, that must be approved as a new membership mechanic in this source-of-truth before implementation.

## 4. Nine-sphere result

Completion of all nine spheres produces a **Sphere Map**, not one total Dementor score.

The result surface may show:

- 9/9 completion state;
- sphere-specific levels/results;
- source-backed tags;
- completion metadata;
- later AI-generated interpretation when available.

AI interpretation is not a membership gate.

If AI summary generation is pending, processing or unavailable, entry to Community must still work from the factual sphere results.

## 5. Identity v1

The first membership identity step collects only what Community needs to identify a participant.

Required:

- `display_name` — the name shown to other Members;
- one `social/contact identity` — for example Telegram, Instagram, LinkedIn, personal site or another supported identity/contact URL.

Optional:

- nickname;
- avatar;
- additional social identities;
- later profile description.

Legal surname is not required by the Community mechanic itself.

`about`, `why_club` and a second manual 100% distribution across the nine spheres are not required for v1 entry.

A separate future interest map may exist only if it is explicitly defined as "where the Member wants to explore next" and must not replace or reinterpret diagnostic Sphere Map results.

## 6. Membership state model

Minimum v1 state model:

`ANONYMOUS → AUTHENTICATED → SPHERES_IN_PROGRESS → SPHERES_COMPLETE → IDENTITY_REQUIRED → MEMBER_ACTIVE → FIRST_ARTIFACT_REQUIRED → MEMBER_ACTIVATED`

Important distinctions:

- `MEMBER_ACTIVE` means Community access exists;
- `FIRST_ARTIFACT_REQUIRED` means the Member has not completed first-entry activation;
- `MEMBER_ACTIVATED` means the first Artifact has been published.

The system may retain more technical sub-states, but they must not redefine these semantic states.

## 7. Community Board

After membership activation, the Member enters the closed Community Board.

Recommended stable route for implementation:

`/community/board/`

`/community/` remains the canonical Community root/index page and must not be replaced by the Board.

The Board is an authenticated Community surface, not a generic dashboard.

Its function is to show current and historical club activity through Artifacts and to give Members a direct action surface.

The first Board version may contain:

- current Member notices;
- source-backed Club Artifacts;
- historical materials with factual provenance;
- current invitations/proposals;
- dated Artifacts that remain active.

Historical Club material must preserve source, factual date and provenance. Old media must not be given invented context.

## 8. First-entry ritual

A new Member receives one first Artifact slot.

The primary first-entry prompt is conceptually:

> Если бы вы были дементором — что бы вы предложили другим участникам клуба?

The exact editorial wording may be refined while preserving the semantic distinction `Member ≠ Dementor`.

The first Artifact may be a proposal, meeting, thought, practice, invitation, experiment or something not yet classified as an Event/Course/Project.

The user must not be forced to classify the proposal into a mature entity type before publishing it.

## 9. Artifact v1 model

Minimum semantic fields:

- `id`;
- `author_member_id`;
- `type`;
- optional `title`;
- required `body`;
- optional media/link;
- `status`;
- `visibility`;
- optional `starts_at`;
- optional `expires_at`;
- `created_at`;
- `updated_at`;
- `published_at`;
- optional promotion relation to a mature Club entity.

Recommended statuses:

`draft / publishing / active / expired / archived / removed`

A normal expiry is not deletion.

## 10. Artifact visibility v1

Default v1 Artifact visibility:

`visibility = community`

An Artifact created by a Member is visible to active Members of the closed Community.

Do not introduce public/private/friends/custom-audience or paid visibility in v1.

Public reuse or external distribution must be an explicit later publishing/distribution action.

## 11. Artifact lifetime

Two basic lifetime modes are supported conceptually:

- persistent;
- dated/expiring.

A dated Artifact moves from active to expired after its configured validity/event time and leaves the current Board surface.

It remains in historical records and may remain visible on the Member profile/archive according to implementation policy.

## 12. Artifact slots

A newly activated Member starts with one available Artifact slot.

After a successful active Artifact publication, the available first slot is consumed.

A Member may create another Artifact when:

1. the current Artifact is closed/retired according to the approved implementation rule; or
2. the Member receives an additional slot grant from future approved Community participation mechanics.

The reward conditions that grant future slots are **not defined in v1**.

The data model must allow future slot grants without hardcoding an unapproved reward economy.

`publish artifact + consume slot` must be atomic at runtime. A failed publication must not consume the slot.

## 13. Reactions and responses

An Artifact must support a lightweight signal from another Member and a stronger response/interest action.

Minimum semantic distinction:

- **reaction** — low-friction interest signal;
- **response** — explicit interest/contact intent toward the Artifact.

Exact labels/copy may be refined in the interface.

The existence of reactions/responses does not automatically promote an Artifact into an Event, Course, Project or other mature entity.

## 14. Promotion path

A Community Artifact may later become evidence/source material for another Club entity.

Possible path:

`ARTIFACT → INTEREST → ACTIVITY → EVENT / COURSE / PROJECT / PRACTICE / OTHER APPROVED ENTITY`

Promotion is an explicit Club/product action.

The original Artifact retains its identity and provenance after promotion.

## 15. Member profile relationship

Member Community presence may expose:

- display identity;
- member-since metadata;
- Sphere Map or approved summary of it;
- active/historical Artifacts;
- later participation relations to events/courses/projects.

Sphere results belong to the user/profile diagnostic model.

Membership belongs to Community.

Artifacts belong to the Member relationship.

These must not be collapsed into one undifferentiated record.

## 16. Telegram boundary

Telegram is downstream Community runtime/distribution, not the authority for Artifact data.

Canonical direction:

`DEMENTOR PLATFORM / ARTIFACT → WEBSITE COMMUNITY → TELEGRAM DISTRIBUTION / DISCUSSION`

Telegram posting, closed chat access, discussion/topic creation and return synchronization are a separate integration flow.

Artifact publication must not depend on Telegram availability.

## 17. Out of scope for v1

Do not include in this first implementation unless separately approved:

- paid membership;
- paid events as part of this flow;
- points/rating economy;
- public Community Board;
- automatic Dementor status;
- automatic Artifact-to-Event/Course promotion;
- AI-generated profile summary as a gate;
- complex Artifact taxonomy;
- one Telegram chat per Artifact;
- complex role hierarchy;
- unapproved slot reward rules.

## 18. Implementation requirements

Implementation in `dementor-club-site` must preserve:

- current design authority and component contracts;
- responsive independence for desktop/tablet/mobile;
- accessibility and focus states;
- explicit loading/empty/error/offline states;
- authenticated access control;
- server-side authorization/RLS;
- media ownership/access policy;
- atomic Artifact-slot consumption;
- stable Artifact identifiers/URLs;
- factual provenance for historical Club seed Artifacts.

No public claim of membership availability is allowed until the provider/data path, privacy impact, QA and release gates pass.

## 19. Definition of Done — first-entry flow

The v1 first-entry loop is complete when a real user can:

1. complete all 9 sphere onboardings;
2. authenticate without losing completed results;
3. see the accumulated Sphere Map;
4. provide minimal Community identity;
5. receive active membership automatically when all gates are valid;
6. enter the closed Community Board;
7. see existing source-backed Community activity;
8. publish one first Artifact using the available slot;
9. see the Artifact on the Board through a stable identifier/URL;
10. see it linked to their Member presence;
11. receive at least one supported reaction/response from another active Member.

## 20. Production QA clarifications — approved 2026-08-30

The following implementation clarifications are approved after the first real non-member production flow. They refine v1 without changing the semantic model above.

### 20.1 External links

- The database remains the final authority and must continue to accept only `http://` / `https://` Artifact URLs.
- The client must validate before RPC and may safely normalize a hostname-like value by adding `https://`.
- Invalid links must produce a human-readable field error, never expose raw PostgreSQL constraint text to the Member.
- External links open with safe browser semantics (`noopener` / `noreferrer` where applicable).
- A generic Artifact is not restricted to meeting providers. A future explicit Event/meeting field may use a narrower provider allowlist.

### 20.2 Composer error preservation

- Validation or server errors must not replace/remove the composer.
- Already entered title, body, link and expiry values remain visible and editable after an error.
- File selection may need to be re-selected only when required by browser security; this should be explained in UI rather than silently losing state.

### 20.3 Expiry

- The client must not allow an Artifact expiry in the past.
- Persistent Artifacts keep expiry empty.
- The server remains authoritative even when client validation exists.

### 20.4 Member contact identity

- Provider/contact mismatch must not be silently accepted when the provider can be inferred from a URL or handle.
- LinkedIn / Instagram / Telegram URLs should select the matching provider automatically.
- When the value cannot be inferred reliably, the Member may choose provider manually.
- The stored identity remains private by default and is not automatically published on the Board.

### 20.5 First-release media policy

For the first stable Community Artifact release:

- one attachment maximum;
- maximum file size: **4 MiB**;
- accepted types: **JPG / PNG / WebP**;
- PDF / TXT and other generic files are not accepted in this first stable release;
- media remains in the private Community Storage bucket;
- a failed draft/publication must not leave an orphan media record/object where cleanup is possible.

This is a security/operational restriction, not a permanent Artifact taxonomy rule.

### 20.6 “Если бы вы были дементором…” explainer

The first-Artifact prompt must have a compact contextual explanation available without leaving the composer.

The explainer must make clear:

- this is an imaginative framing for proposing an action/idea;
- answering does **not** grant Dementor status;
- examples may include a meeting, practice, proposal, experiment or useful provocation;
- a link may lead to the canonical Community/Dementor explanation, but the essential meaning must be readable inside the popup itself.

### 20.7 Board seed content

The Board should not be populated with invented activity merely to avoid an empty state.

When source-backed Club objects are available, the implementation should show a small set of factual Club/historical Artifacts with explicit provenance. Current Club projects/objects may be used only when their title/status/source are already approved. If no such record has been prepared with provenance, the honest empty state remains preferable.

### 20.8 Telegram delivery boundary

Artifact publication remains successful based on platform/Supabase state alone.

Approved integration direction:

`PUBLISHED ARTIFACT → DISTRIBUTION OUTBOX → TELEGRAM WORKER → TELEGRAM MESSAGE / DISCUSSION REFERENCE`

Telegram failure must not roll back or invalidate an already published Artifact. Telegram message/topic identifiers are downstream references, not semantic authority.

This clarification approves preparing an outbox-compatible integration boundary; it does not require one Telegram chat/topic per Artifact and does not make Telegram a source-of-truth.

This document defines the approved product mechanic. Technical schema, RLS, component implementation and Telegram distribution are downstream implementation layers and must not change this meaning silently.
