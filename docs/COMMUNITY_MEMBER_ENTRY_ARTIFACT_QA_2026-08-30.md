# Community Member Entry + First Artifact v1 — QA

Date: 2026-08-30
Branch: `dementor-club-site`
Product authority: `dementor-club/community/MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md`
Runtime contract: `docs/COMMUNITY_MEMBER_ARTIFACT_RUNTIME_v1.md`
PR: #45
Status: **BACKEND/STATIC QA PASSED WITH RELEASE BLOCKERS**

## Scope

Critical user loop:

`DC-9 9/9 → result → auth → minimal identity → active membership → Board → first Artifact → reaction/response → archive`

## Confirmed

- [x] The Join runtime still stores nine independent sphere results; no aggregate score is introduced.
- [x] `/join/` has a Community-entry bridge which appears only at 9/9 and points to `/join/result/`.
- [x] `/join/result/` renders the nine sphere records separately and gates Community entry on 9/9.
- [x] Local assessment results are synced into `assessment_runs` for an authenticated profile before server-side gate evaluation.
- [x] Membership activation is server-side and recomputes 9 distinct canonical sphere completions; client cannot assert `9/9=true`.
- [x] Member entry asks only for Community display identity, optional nickname, one external identity/contact, Terms acceptance and Privacy acknowledgement.
- [x] `Auth ≠ Membership` is preserved.
- [x] Active membership and first-Artifact activation are separate states.
- [x] Two previously active memberships were backfilled with Community public-profile records and one initial Artifact slot each.
- [x] Artifact slot is ledger-derived; client does not maintain a mutable slot counter.
- [x] Publishing locks the profile row and verifies the available slot before transitioning a draft to `active`.
- [x] Failed draft/file preparation does not consume an active slot.
- [x] Closing an active Artifact archives it; closing a draft removes it.
- [x] Board read authorization is based on active Community membership, not per-entity assignment.
- [x] Member external identities and legal acknowledgements are not Board-public data.
- [x] Community member directory exposes only the dedicated public-member record.
- [x] Artifact Storage bucket `dc-community-artifacts` exists and is private.
- [x] Storage upload is limited to the authenticated member's own first-level folder.
- [x] Storage reads require active membership.
- [x] Frontend limits v1 upload to one JPG/PNG/WebP/PDF/TXT file up to 8 MB.
- [x] Artifact detail has a stable route contract `/community/artifact/:id/` through the site rewrite.
- [x] Server-side URL hardening added: persisted Artifact and external-identity URLs must use `http://` or `https://`.
- [x] The URL-hardening migration is persisted in Git as `supabase/migrations/20260829233814_harden_community_urls_v1.sql`.
- [x] Supabase security/performance advisors were run after schema changes.

## Advisor findings

No new `RLS enabled with no policy` finding was produced for the new Community tables.

The advisor reports `SECURITY DEFINER callable by authenticated` warnings for the Community RPC functions. These RPCs are intentionally the authenticated server-side transaction boundary. They validate `auth.uid()`, membership/ownership and/or the DC-9 gate before mutations. This warning is therefore reviewed, not silently ignored.

There are older advisor findings outside this Community change set (legacy archive tables, existing helper RPC grants, older RLS init-plan warnings). They are not caused by this feature and should be handled as a separate database-hardening task.

## Release blockers

### 1. No reachable staging deployment in the currently connected hosting account

The connected Vercel team currently exposes zero projects. The production architecture in Git shows that `dementor.club` is released through protected GitHub Pages from `dementor-club-production`, not by direct staging-branch Vercel auto-deploy.

Therefore actual browser QA of the new branch is still required on a reachable staging build.

### 2. Required visual/runtime browser matrix not yet executed

Still required:

- [ ] 1440 desktop
- [ ] 1024 tablet
- [ ] 768 tablet
- [ ] 390 mobile
- [ ] 360/320 narrow mobile
- [ ] no horizontal overflow
- [ ] keyboard focus visible
- [ ] global mobile menu works on new routes
- [ ] Composer form and file state survive normal interaction
- [ ] Artifact Board notices render correctly with long body, long URL, image and file variants

### 3. Real OAuth E2E not yet executed

Still required with a real non-admin test member:

- [ ] complete/sync 9 spheres
- [ ] Google OAuth callback returns to `/join/result/` or `/join/member/`
- [ ] membership activation succeeds only at 9/9
- [ ] one initial slot exists
- [ ] first Artifact publishes
- [ ] second simultaneous publish cannot exceed one slot
- [ ] another Member can react/respond
- [ ] Artifact author can archive it and regain availability
- [ ] expired dated Artifact leaves the active Board

### 4. Production branches currently diverged

At QA time `dementor-club-site` and `dementor-club-production` are significantly diverged. Draft PR #45 is not mergeable in its current state and contains broader staging changes beyond this Community feature.

Do not force-update production. Reconcile production changes into the staging/release candidate first, then rerun the production validators.

## Release decision

**DO NOT DEPLOY YET.**

The Community backend/data boundary is implemented and materially QA'd, but the release contract requires a reachable browser build, real OAuth smoke test, responsive visual QA and a mergeable production candidate.
