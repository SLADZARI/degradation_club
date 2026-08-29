# Dementor Club — Community v1 security QA

Date: **2026-08-30**  
Branch: `dementor-club-site`  
Runtime: Supabase project `Dementor / exEDUplatform`  
Status: **DB QA PASSED / BROWSER QA PENDING**

## Migrations reviewed

Community-related migration sequence currently present in Supabase:

1. `community_member_artifact_v1`
2. `community_member_artifact_v1_hardening`
3. `harden_community_urls_v1` — concurrent compatible hardening detected after the first two migrations
4. `community_membership_state_guard_v1`

## Verified security properties

### Anonymous RPC access

All Community v1 RPC functions were checked with `has_function_privilege`.

For:

- `dc_member_entry_status_v1`
- `dc_activate_membership_v1`
- `dc_create_artifact_draft_v1`
- `dc_update_artifact_draft_v1`
- `dc_attach_artifact_media_v1`
- `dc_publish_artifact_v1`
- `dc_close_artifact_v1`

result:

- `anon EXECUTE = false`
- `authenticated EXECUTE = true`

An explicit anonymous call to `dc_member_entry_status_v1` also returned permission denied.

### Membership state bypass

`dc_activate_membership_v1` now refuses self-reactivation when an existing membership is:

- `suspended`
- `revoked`
- `archived`

Rollback QA temporarily changed an existing active membership to `suspended`, invoked activation with that member's authenticated JWT context and received:

`MEMBERSHIP_STATE_BLOCKED`

The transaction was rolled back and the real membership remained unchanged.

### Self-response

Artifact response RLS now requires the responder to be different from `author_profile_id`.

A member may react to their own Artifact if the UI allows it, but cannot create a formal response to their own Artifact.

### Artifact publication race

Publication locks the author's profile row and evaluates slot capacity within the same RPC transaction before moving a draft to `active`.

A draft does not consume a slot. A successful `publishing/active` Artifact does.

### Private media

`dc-community-artifacts` remains private.

Storage insert requires:

- authenticated role;
- active DC membership;
- first object-path segment equal to `auth.uid()`.

Community reads are membership-gated and UI delivery uses signed URLs.

## Rollback smoke test

A full DB path was exercised inside a transaction:

`temporary 9/9 → membership activation → draft → publish → MEMBER_ACTIVATED`

Expected state was observed:

- published Artifact count increased inside transaction;
- slot available became `0`;
- activation state became `MEMBER_ACTIVATED`.

After `ROLLBACK`:

- QA Artifact count = `0`;
- QA assessment run count = `0`;
- existing active membership count remained `2`;
- initial membership slot grants remained `2`.

## Supabase advisor result

The new Community tables are not reported for missing RLS or missing foreign-key indexes.

Security advisor continues to warn that signed-in users can execute `SECURITY DEFINER` functions. For the seven Community RPCs this is intentional: they are the authenticated server-side mutation boundary and each performs explicit `auth.uid()` / ownership / membership / state checks. Anonymous execution has been explicitly revoked.

Reference remediation/documentation:

https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable

The advisor also reports the project-level leaked-password-protection setting as disabled. Community v1 currently uses Google OAuth, but this remains a project-level Auth hardening item if password authentication is or becomes available.

Reference:

https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

Performance advisor findings are primarily pre-existing `legacy_edu`, Modern Pilgrims and older DC policy/index warnings. Newly created Community indexes show as unused because no production Artifact traffic exists yet; they should not be removed based on zero-traffic staging statistics.

## Remaining security/production QA

Database QA does not replace browser QA.

Still required before production:

- real OAuth callback / session persistence;
- two real member sessions to verify cross-member Board reads;
- signed Storage upload/download/delete in browser;
- concurrent double-click publication test;
- response/reaction UI test;
- responsive/accessibility pass;
- legal text review for new Community data categories;
- full site validator stack;
- explicit production release approval.
