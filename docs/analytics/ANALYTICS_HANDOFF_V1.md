# DEMENTOR CLUB — ANALYTICS / SEO HARMONIZATION HANDOFF v1

Status: READY FOR HARMONIZATION, NOT DEPLOYED
Date: 2026-08-29
Repository: `SLADZARI/degradation_club`
Production branch: `dementor-club-production`
Analytics PR: `#26` (`analytics/event-tracking-v1-clean`)
SEO PR: `#24` (`seo/metadata-cleanup-20260829`)

## 1. Core rule

Do not overwrite or reset `dementor-club-production`.
Before merge/deploy, reconcile current production + the agent's own approved work + incoming PRs.
Preserve production hotfixes and runtime dependencies.

ACTIVITY != PROGRESS. A merge/deploy is valid only when the resulting production candidate preserves source-of-truth, runtime closure, visual approvals and release gates.

## 2. Visible brand layer vs machine layer

The Dementor visible voice is authority for public copy and major editorial headlines.
Do not rewrite approved H1/hero slogans for SEO.
SEO clarity belongs primarily in metadata, canonical, schema, sitemap, internal linking and dedicated indexable entities.

Home is intentionally excluded from the current SEO rewrite.

## 3. Public/indexable vs private/noindex

Public content/entities intended for discovery may be indexed.
Session-bound/private/internal surfaces must remain `noindex`.

Minimum private contract:
- `/workspace/`
- `/profile/`
- `/account/`
- `/auth/*`
- personal/session-bound result surfaces
- admin/diagnostics/design-system/test/staging/internal routes

Existing confirmed headers:
- `/workspace/` => `noindex,nofollow,noarchive`
- `/auth/callback/` => `noindex,nofollow,noarchive`

Noindex does NOT disable analytics. Private routes may emit consented analytics events, but must never send PII.

## 4. Analytics runtime

Authority runtime: `/production-analytics-v1.js`
Production origin only: `https://dementor.club`
GA4: `G-QTZY2GKZ4R`
Microsoft Clarity: `y9yuo1zabw`
Consent key: `dc_analytics_consent_v1`

Analytics is consent-gated. Do not load/use GA4 or Clarity as unrestricted trackers before consent.
Do not introduce GTM in v1.

Public API:
`window.DEMENTOR_ANALYTICS.track(eventName, params)`

## 5. Event allowlist v1

Only these event names are approved:
- `join_start`
- `join_sphere_open`
- `assessment_complete`
- `auth_start`
- `auth_complete`
- `workspace_open`
- `project_open`
- `course_open`
- `course_cta_click`
- `event_open`
- `event_cta_click`
- `merch_open`
- `merch_cta_click`
- `recommendation_click`
- `external_community_click`

Do not create additional event names without updating the event map/source-of-truth first.

## 6. Event parameters / GA4 custom dimensions

Approved parameters:
- `entity_type`
- `entity_id`
- `placement`
- `source_page`
- `cta_id`
- `member_state`

All six have been manually created in GA4 as event-scoped custom dimensions.

Never send:
- email
- name/full_name
- phone
- Supabase/user IDs
- access/refresh tokens
- answers or assessment answer arrays
- free text
- any other directly identifying or sensitive personal payload

## 7. Confirmed success semantics

### assessment_complete
Not a click and not the final question opening.
It is emitted only when the existing Join runtime reaches its persisted result state: `/join/?sphere=<sphere>&result=1`. That URL state is produced after the assessment result is calculated and saved by the existing Join code.

### auth_complete
Not a login click.
`/auth/callback/` confirms:
1. PKCE exchange if code exists;
2. persisted Supabase session;
3. confirmed Supabase user.
Only then it sets one-shot `sessionStorage` marker `dc_auth_complete_pending_v1`.
The next page flushes the marker into GA4 and removes it only after successful tracking.

### workspace_open
Not a navigation click.
`/workspace/workspace-analytics-hook-v1.js` waits until:
- authenticated session UI exists;
- workspace main view is rendered;
- no gate/error state is present.
Then it publishes `dc:workspace-ready` + `window.__DC_WORKSPACE_READY_DETAIL__` with a non-PII `member_state`.
Approved member states: `registered`, `member`, `dementor`, `owner_admin`.

## 8. Clarity contract

Clarity complements GA4. GA4 answers WHAT happened; Clarity helps inspect HOW the session behaved.
Custom tags:
- `dc_page`
- `dc_entity_type`
- `dc_entity_id`
- `dc_member_state` where workspace state is confirmed

Do not attach identifying profile fields to Clarity tags.

## 9. SEO incoming PR #24

PR #24 is deliberately narrow:
- Home untouched.
- `/events/`: clean canonical/OG origin and clearer search metadata; visible H1/content preserved.
- `/projects/`: clean canonical/OG origin and clearer search metadata; visible H1/content preserved.

Do not let SEO copy replace approved Dementor editorial language.
When harmonizing, preserve any newer production metadata fixes if they are equivalent or stronger and still point exclusively to `https://dementor.club`.

## 10. Harmonization algorithm for another agent

1. Fetch latest `dementor-club-production`.
2. Inspect the agent's own unmerged/approved work.
3. Inspect PR #26 and PR #24 diffs.
4. Do NOT reset production to either incoming branch.
5. Merge/rebase/cherry-pick only after comparing overlapping files.
6. Resolve conflicts semantically:
   - preserve production runtime fixes;
   - preserve approved visual/UI work;
   - preserve analytics contracts above;
   - preserve noindex boundary;
   - preserve custom-domain root paths;
   - remove legacy GitHub Pages/Vercel production origins;
   - keep cart/checkout restrictions unless separately approved.
7. Re-run production build and integrity checks.
8. Verify no duplicate GA4/Clarity loaders or duplicate event dispatch.
9. Verify no PII leaves via analytics.
10. Verify internal routes are noindex.
11. Verify public canonical/OG URLs use `https://dementor.club`.
12. Create/refresh PR into `dementor-club-production`.
13. Do not deploy automatically.
14. Deploy only after explicit approval through `Deploy Dementor Production` with `APPROVED`.
15. Run post-deploy smoke tests.

## 11. Required smoke test

Public:
- Home
- About
- Events
- Projects
- Community
- Merch
- Join
- primary course/project/event/product pages

Private/runtime:
- Auth callback
- Account/Profile
- Workspace
- Supabase session persistence
- assessment save/result
- membership/roles
- course enrollment/progress

Analytics:
- consent prompt
- page_view once per navigation state
- join_start
- join_sphere_open
- assessment_complete only after result success
- auth_complete only after confirmed auth
- workspace_open only after rendered authenticated workspace
- project/course/event/merch opens
- CTA events
- recommendation_click
- external_community_click
- GA4 custom dimensions populated
- Clarity tags visible
- no duplicate events/loaders

SEO/privacy:
- private pages noindex
- canonical/OG on public pages
- no legacy production origins
- no PII in analytics payloads

## 12. Required final report

Return exactly one top-level status:
`READY_FOR_PRODUCTION` or `BLOCKED`

Then report:
- current production head
- agent's own changes preserved
- analytics PR #26 changes imported
- SEO PR #24 changes imported or intentionally deferred
- conflicts resolved
- production diff
- CI/build results
- analytics event status
- GA4 status
- Clarity status
- noindex/private-route status
- SEO/canonical status
- Supabase status
- runtime errors
- remaining blockers
- deploy plan
- post-deploy verification plan

No automatic production deploy without explicit user approval.
