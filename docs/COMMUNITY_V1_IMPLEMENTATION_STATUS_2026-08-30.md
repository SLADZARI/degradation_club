# Dementor Club — Community v1 implementation status

Date: **2026-08-30**  
Branch: `dementor-club-site`  
Status: **STAGING IMPLEMENTED / PRODUCTION NOT APPROVED**  
Design canon: **v10**

## 1. Implemented user path

```text
/join/
→ nine independent DC-9 sphere results
→ /join/result/
→ authenticated result sync
→ server 9/9 gate
→ /join/member/
→ minimal identity + legal acknowledgement
→ active membership
→ /community/board/
→ first Artifact
→ /community/artifact/:id/
```

This path implements the approved Community v1 source mechanics from `dementor-club`.

`User ≠ Member ≠ Dementor` remains enforced.

DC-9 remains nine independent sphere results. No aggregate Dementor score was added.

## 2. Supabase implementation

Project: `Dementor / exEDUplatform`

Applied migrations relevant to Community v1:

- `community_member_artifact_v1`
- `community_member_artifact_v1_hardening`

A later concurrently applied migration `harden_community_urls_v1` was detected and reviewed for compatibility. It adds HTTP(S) URL checks and does not replace the Community tables/RPC contract.

### Added/extended data

- `profiles.display_name`
- `profiles.nickname`
- `dc_member_external_identities`
- `dc_member_legal_acknowledgements`
- `dc_member_public_profiles`
- `dc_artifacts`
- `dc_artifact_media`
- `dc_artifact_reactions`
- `dc_artifact_responses`
- `dc_artifact_slot_grants`
- private Storage bucket `dc-community-artifacts`

### Critical RPC transitions

- `dc_member_entry_status_v1()`
- `dc_activate_membership_v1(...)`
- `dc_create_artifact_draft_v1(...)`
- `dc_update_artifact_draft_v1(...)`
- `dc_attach_artifact_media_v1(...)`
- `dc_publish_artifact_v1(...)`
- `dc_close_artifact_v1(...)`

Critical transitions are server-side. Direct client table access does not create active memberships or publish Artifacts.

## 3. Slot model

Community membership v1 grants one idempotent initial slot:

`initial-membership-v1 = +1`

A draft does not consume the slot.

`publishing / active` consumes a slot.

Closing an active Artifact moves it to `archived` and releases the slot.

No course/event/points reward rule is implemented yet. `dc_artifact_slot_grants` exists so later approved rules can grant additional capacity without rewriting Artifact ownership.

## 4. Access model

### Community Board

- anonymous: denied;
- authenticated non-member: denied;
- active member: can read `community` Artifact records;
- author: can read own draft/history according to RLS;
- owner/admin: administrative access through existing DC role checks.

### Member identity

The runtime stores:

- display name;
- optional nickname;
- one primary external identity/contact;
- existing avatar when available.

External contact identity defaults to `private` and is not automatically exposed on the Board.

`dc_member_public_profiles` is a deliberately limited Community directory projection used instead of exposing the full `profiles` table to other members.

### Artifact media

Private bucket:

`dc-community-artifacts`

v1 limits:

- max 8 MB;
- one attached media/file per Artifact at application level;
- JPEG / PNG / WebP / PDF / TXT;
- path starts with authenticated profile UUID;
- Community reads use signed URLs.

## 5. Implemented site files

### Shared runtime

- `/community-runtime-v1.js`

### Result gate

- `/join/result/index.html`
- `/join/result/result.css`
- `/join/result/result.js`

### Membership entry

- `/join/member/index.html`
- `/join/member/member.css`
- `/join/member/member.js`

### Existing Join bridge

- `/join/community-entry-bridge-v1.js`

### Legacy application

- `/join/apply/` now redirects to `/join/member/`.
- old application JS/CSS remain as historical implementation files; runtime no longer boots them from the route.
- existing `join_applications` rows remain untouched.

### Community Board

- `/community/board/index.html`
- `/community/board/board.css`
- `/community/board/board.js`

### Artifact detail

- `/community/artifact/index.html`
- `/community/artifact/artifact.css`
- `/community/artifact/artifact.js`

Stable URL rewrite:

`/community/artifact/:id/ → /community/artifact/?id=:id`

### Config / standards

- `/site-config.js`
- `/vercel.json`
- `/docs/FEATURE_ACTIVATION_MATRIX_v1.md`
- `/docs/ENTITY_PRESENTATION_ARTIFACT_EXTENSION_v1.md`

## 6. Runtime states implemented

Member entry:

- auth required;
- spheres incomplete;
- identity required;
- active membership;
- first Artifact required;
- member activated;
- error/loading.

Board/Artifact:

- membership required;
- empty active Board;
- free slot;
- occupied slot;
- draft exists;
- upload/publish processing;
- active Artifact;
- persistent Artifact;
- dated Artifact;
- reaction selected/unselected;
- response composer/submitted;
- archived by author;
- provider/error state.

## 7. Database QA completed

Completed against the live Supabase schema without leaving QA content:

1. authenticated status RPC using an existing active member;
2. full 9/9 activation path inside a transaction;
3. membership activation;
4. draft creation;
5. Artifact publication;
6. slot transition from `1 available` to `0 available`;
7. `MEMBER_ACTIVATED` final state;
8. transaction rollback;
9. verification that no QA Artifact remained;
10. anonymous RPC execution denied.

Existing active memberships were not revoked if they predate the new 9/9 gate. The gate is enforced by the new membership activation RPC.

## 8. Design implementation

Artifact presentation extension is documented in:

`docs/ENTITY_PRESENTATION_ARTIFACT_EXTENSION_v1.md`

Board follows v10:

- strict structure first;
- paper / black / acid;
- editorial metadata;
- controlled desktop notice offsets;
- no random rotation/glitch;
- mobile becomes a vertical notice stream rather than a scaled-down wall;
- ACID always carries INK foreground.

## 9. Intentionally not implemented

- public Community Board;
- paid events/products through Artifact;
- automatic Dementor role;
- automatic Artifact → Event/Course/Project conversion;
- points/ratings/gamification;
- automatic slot reward rules beyond initial membership slot;
- Telegram distribution/discussion;
- AI-generated member summary as a gate;
- fabricated seed/history content.

Historical club artifacts from 2024+ must be imported only after source/provenance review.

## 10. Production blockers

Community v1 must not be released to `dementor-club-production` until:

1. browser auth/OAuth callback QA;
2. local DC-9 → authenticated Supabase sync QA;
3. responsive QA at 1440 / 1024 / 768 / 390 / 320;
4. private upload/signed URL QA from real browser sessions;
5. two-member reaction/response QA;
6. duplicate-click/concurrent publish browser test;
7. full site validator stack;
8. Privacy/Terms review/update for Community data;
9. explicit production release approval;
10. live-domain smoke test after the production workflow.

### Legal blocker detail

Current runtime uses Terms v0.2 acceptance and Privacy v0.2 acknowledgement because those are the current site documents.

Privacy v0.2 correctly should not be represented as a separate processing consent. However, Community v1 introduces additional stored data categories (display identity, external contact identity, membership state, Artifacts, reactions, responses). The legal text should be reviewed and source-approved before production activation.

No legal wording was silently changed in `dementor-club-site` during this implementation.

## 11. Production statement

**Implemented ≠ deployed.**  
**Staging enabled ≠ production LIVE.**

`dementor-club-site` remains the staging/working branch and Git deployment is disabled by contract. Production must continue through the explicit `dementor-club-production` release path.
