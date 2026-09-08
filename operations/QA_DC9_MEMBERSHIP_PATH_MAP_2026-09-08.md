# Dementor Club — QA Path Map: DC-9 / Membership Semantic Integrity

Status: **HANDOFF PATH MAP / DO-NOT-IMPROVISE**  
Prepared: **2026-09-08**

This file tells an external developer/LLM where the relevant ownership currently lives and what must not be recreated in parallel.

## 1. Repository / branch authority

Repository:

`SLADZARI/degradation_club`

Semantic source-of-truth:

`dementor-club`

Production implementation baseline:

`dementor-club-production`

Historical development branch:

`dementor-club-site`

**Do not use `dementor-club-site` as the production merge base.** It has divergent history relative to production. Inspect it only as historical evidence when necessary.

At package creation:

- `dementor-club` HEAD = `3714fce66703258234ea5ea8ab8a84d46c4c73dd`
- `dementor-club-production` HEAD = `f74eeb7267e664ed61f6bc3ad08ebe3e6191c0a5`
- audited `dementor-club-site` HEAD = `7a036ba4cd7ccd635ba273931c2087227d0f4c94`

Always re-read branch HEADs before implementation.

---

# 2. Mandatory project-kernel read order

Read from `dementor-club` before coding:

1. `.weekly-os/PROJECT.json`
2. `.weekly-os/ARTIFACT_INDEX.json`
3. `.weekly-os/APPROVED_STATE.json`
4. all `PROJECT.json.readFirst` paths relevant to Membership/DC-9
5. current Result from `PROJECT.json.currentResult`
6. current Gate
7. only then implementation/runtime.

Current package preparation observed:

- current Result: `dementor-club.result.board-access-control-v2`
- Result file: `.weekly-os/results/board-access-control-v2.v0.3.md`
- Gate: `G7_RELEASE`
- production deployed: true
- targeted authenticated live retest still pending in that Result.

Do not silently mark or overwrite the Board Result while working on this DC-9 cluster.

---

# 3. Canonical QA / approved decision paths

## Canonical QA ledger

`operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`

Purpose:
- single live Membership/portal QA ledger;
- findings/status/evidence;
- QA → Result → G6 → G7 → live retest → G8 operating loop.

## This bug-cluster specification

`operations/QA_DC9_MEMBERSHIP_SEMANTIC_INTEGRITY_2026-09-08.md`

## External handoff entry

`operations/QA_EXTERNAL_DEVELOPER_PACKAGE_2026-09-08.md`

## Workspace / Member activation authority

`operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md`

Do not change first-Artifact activation semantics or Workspace ownership accidentally while touching Entry Status.

## Board access authority

`operations/BOARD_ACCESS_AND_OWNER_ADMIN_V2.md`

Do not regress Guest / Member / Dementor / Owner Admin Board permissions when membership-state resolution changes.

---

# 4. DC-9 runtime ownership

## Canonical DC-9 entry page

`join/index.html`

Expected responsibility:
- loads the nine-sphere DC-9 runtime;
- DC-9 remains usable without mandatory login;
- first-baseline preservation runtime loads before the DC-9 engine.

Do not create another Join page/engine.

## Current DC-9 engine

`join/dc9-immersive-v1.js`

Relevant state:
- storage key: `dementorClubOnboardingV3`;
- current quiz version: `dc9-immersive-v1`;
- canonical sphere IDs include `self_development`;
- incomplete answers live in `db.drafts`;
- `db.active` is a pointer to sphere/question position;
- completed current results live in `db.results`.

Important: changing sync must preserve this state contract unless a separately approved design changes it.

## Immutable local first baseline owner

`join/dc9-baseline-v1.js`

Relevant responsibilities:
- preserve `firstBaseline`;
- preserve/collect `repeatRuns`;
- canonicalize historical `self-development` input;
- lock first baseline at first complete 9/9;
- prevent reset/repeat from erasing the first baseline.

Do not introduce a second local baseline store.

## Storage capability / compatibility guard

`join-storage-guard.js`

Current relevant behavior:
- verifies localStorage capability;
- blocks DC-9 controls when storage unavailable;
- contains temporary historical `self-development` / `self_development` alias bridge;
- current raw path guard is part of QA-MEM-040;
- dual alias interval is a G8 cleanup candidate after safe canonical migration.

Do not remove compatibility blindly before legacy-state evidence exists.

---

# 5. Account sync ownership

## Active production sync selected by configuration

`site-config.js`

Relevant area:
- `onboarding.accountSync`;
- Join runtime loader;
- at package creation, canonical Join still loads `dementor-account-sync-v8.js`.

Any account-sync version switch must be explicit here and regression-tested.

## Current active sync

`dementor-account-sync-v8.js`

Known findings:
- QA-MEM-035: destructive `mergeStates()` shape;
- QA-MEM-036: raw sphere persistence/source key;
- QA-MEM-041: creates its own Supabase client.

Do not patch only one symptom and leave this file as a parallel domain owner without deciding its post-Result status.

## Existing newer candidate source

`dementor-account-sync-v9.js`

This already contains some improvements such as sphere canonicalization and local-field preservation, but it is **not automatically approved as the final fix**.

Audit against the full QA specification first. In particular test remote draft recovery and immutable-state merge semantics.

---

# 6. Shared community/auth/domain runtime

`community-runtime-v1.js`

This is the key existing reusable runtime owner.

Relevant exports/meaning:
- `DC_SPHERES`
- `DC_ASSESSMENT_VERSION`
- `DC_LOCAL_STORAGE_KEY`
- `canonicalSphereId()`
- `basePath()`
- `route()`
- `getClient()`
- `currentSession()`
- `loginWithGoogle()`
- `syncLocalAssessmentRuns()`
- `getEntryStatus()`

**Do not create another shared Supabase client helper if this owner can be extended/reused.**

`getClient()` is the preferred singleton owner for Supabase JS session/token lifecycle.

---

# 7. Application flow

## Application entry / pre-sync owner

`join/apply/apply-entry-v1.js`

Responsibility:
- acquire canonical client/session;
- synchronize local first baseline + repeat history before application logic;
- only then load application UI/controller.

Do not bypass this file by directly restoring a second application runtime path.

## DC-9 history synchronization before application

`join/apply/dc9-baseline-sync-v1.js`

Responsibility:
- collect `firstBaseline.results`;
- collect `repeatRuns`;
- collect current `results`;
- canonicalize sphere IDs;
- persist completed history into `assessment_runs` with canonical source keys.

Coordinate any account-sync source-key fix with this existing correct behavior. Do not create a third history-sync implementation.

## Application UI/controller

`join/apply/apply.js`

Relevant responsibilities:
- authenticated application UX;
- Interest Map generation;
- current frontend 100-point validation;
- current client-side membership display decision;
- call to `dc_submit_membership_application_v2`.

QA-MEM-038 requires server validation in addition to, not instead of, useful frontend UX validation.

QA-MEM-039 requires this surface to stop using a conflicting membership-active meaning.

---

# 8. Result / post-DC9 path

`join/result/index.html`

Runtime modules under:

`join/result/`

Do not change result content/visual/product flow as part of semantic-integrity fixes unless needed to preserve routing/auth state and backed by existing authority.

---

# 9. OAuth / auth surfaces

## Canonical public header auth owner

`global-header.js`

Relevant behavior:
- reuses `window.DEMENTOR_SUPABASE_CLIENT` if present;
- owns public login/identity presentation;
- already applies an active validity-window check for memberships/roles.

Do not create a second public login UI in Join.

## PKCE callback

`auth/callback/index.html`

Responsibility:
- exchange OAuth code for Supabase session;
- validate stored session/user;
- route to safe canonical next destination.

Account-client consolidation must not break this flow.

## Existing WebKit auth regression

Inspect the current auth/browser validators under `scripts/`; preserve WebKit coverage as Safari-engine proxy.

Real Safari live retest remains human evidence after deployment.

---

# 10. Board state dependency

`community/board/board-user-state-v2.js`

This file consumes `getEntryStatus()` and derives:

- `UNAUTHENTICATED`
- `AUTHENTICATED_GUEST_DC9_INCOMPLETE`
- `AUTHENTICATED_GUEST_DC9_COMPLETE`
- `APPLICANT`
- `MEMBER_NOT_ACTIVATED`
- `MEMBER_ACTIVATED`
- `DEMENTOR`
- `OWNER_ADMIN`

Do not duplicate Board user-state logic in DC-9 fixes.

Fix canonical Entry Status upstream and run Board regression.

---

# 11. Supabase / server authority

Live project used by current production:

`mmekfydwbvptbdatwitj`

## Migration directory

`supabase/migrations/`

Never edit an already-released migration to represent a new production mutation. Add a new migration.

## Historical sphere canonicalization migration

`supabase/migrations/20260830084000_canonicalize_self_development_sphere.sql`

Use as historical evidence of intended canonical ID and deterministic duplicate handling. It is not enough to prevent future legacy writes by itself.

## Immutable first-baseline migrations

`supabase/migrations/20260905084028_dc9_immutable_first_baseline_v1.sql`

`supabase/migrations/20260905084118_dc9_immutable_first_baseline_v1_fix_jsonb_key_count.sql`

Relevant server primitives introduced/maintained there include:

- `dc_first_complete_baseline_v1(profile_id)`;
- join-application baseline locking trigger/function;
- append-only-oriented `assessment_runs` privilege hardening.

Do not create a parallel baseline table.

## Existing active-membership primitive

Live DB function:

`public.dc_membership_active(uuid)`

Target meaning:
- status active;
- validity start reached;
- validity end not expired.

Reuse this meaning for server permission/lifecycle decisions.

## Server functions to reconcile by new migration

`public.dc_submit_membership_application_v2(...)`

`public.dc_member_entry_status_v1()`

Do not manually edit live function definitions outside a tracked migration.

---

# 12. Tables/entities relevant to this Result

Existing owners only; do not create replacements:

- `public.assessment_runs` — completed assessment history;
- `public.assessment_snapshots` — synced account assessment state;
- `public.join_applications` — membership application;
- `public.dc_system_memberships` — membership lifecycle records;
- `public.dc_role_assignments` — role lifecycle;
- `public.profiles` — profile identity;
- `public.dc_member_external_identities` — external identity/contact;
- `public.dc_member_legal_acknowledgements` — application/legal acknowledgement.

Potential Interest Map currently lives inside `join_applications.answers.interest_distribution`; do not introduce an Interest Map table merely to validate it.

---

# 13. QA/test owners

## Existing immutable-baseline validator

`scripts/validate-dc9-baseline-contract.mjs`

Preserve existing first 9/9 / repeat / reset protection.

Known gap: this validator currently does not prove account-merge state preservation, canonical source-key writes, single-client ownership, Interest Map backend validation or membership validity consistency.

## Recommended new/extended validators

Preferred coherent names:

`scripts/validate-dc9-sync-integrity.mjs`

`scripts/validate-membership-semantic-authority.mjs`

The developer may extend existing validators instead if that creates a cleaner single-owner test architecture. Do not weaken existing gates simply to obtain green CI.

## Browser regression

Inspect current Playwright/browser scripts under `scripts/` before adding another browser harness.

Required new behavior must be added to the existing release-readiness ecosystem rather than a standalone test that is never run by CI.

---

# 14. Build / release owners

## Production build

`scripts/build-pages.mjs`

Important:
- production candidate is generated from repository source into `_site`;
- production normalizes legacy `/degradation_club/` URLs to root canonical paths;
- this build behavior does not excuse runtime compatibility bugs in source where those routes are intentionally tested.

## Site Integrity / Release Readiness

`.github/workflows/site-integrity.yml`

Any new executable semantic-integrity validator must be wired into the existing release-readiness path if it protects this release.

## Manual production deploy

`.github/workflows/deploy-production.yml`

Deployment checks out:

`dementor-club-production`

Production deployment requires explicit manual confirmation/input.

External developer must not deploy.

---

# 15. Branch and PR rules for the external developer

1. Read semantic source first.
2. Fetch current `dementor-club-production` HEAD.
3. Create one Result branch from that production HEAD.
4. Suggested: `agent/dc9-membership-semantic-integrity-v1`.
5. Do not branch from `dementor-club-site`.
6. Do not merge unrelated open PRs into the branch.
7. Do not write directly to production branch.
8. Keep migration committed but unapplied until explicit authorization.
9. Run full G6 before asking for merge/release.
10. In PR body list QA-MEM-035 through QA-MEM-042 and evidence for each.

---

# 16. Do-not-touch / stop-and-ask boundaries

Stop and ask for a project Decision if implementation would change:

- `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`;
- first complete 9/9 immutability;
- application review/acceptance lifecycle;
- number/meaning of DC-9 spheres;
- role or Board permission model;
- profile/application entity ownership;
- public Header or Workspace shell ownership;
- whether expired membership can immediately reapply;
- a new architecture boundary.

Do not invent:

- new pricing;
- new membership states;
- new roles;
- new tables solely to avoid extending existing owners;
- new auth callbacks;
- new Board state machines;
- new baseline entities.

---

# 17. Minimum changed-file expectation

The exact diff must follow root cause, but likely source scope is limited to a subset of:

- `site-config.js`
- chosen canonical `dementor-account-sync-*.js`
- `community-runtime-v1.js` only if a shared primitive genuinely belongs there
- `join-storage-guard.js`
- `join/apply/apply.js`
- existing/new `supabase/migrations/<timestamp>_dc9_membership_semantic_integrity_v1.sql`
- `scripts/validate-dc9-baseline-contract.mjs` and/or new coherent validators
- existing browser test/workflow wiring.

Do **not** edit every file in this map just because it is listed.

---

# 18. Handoff completion checklist

Before returning work to the owner, developer/LLM must answer:

- Which file is now the one canonical account-sync owner?
- Does partial draft survive local→remote and remote→local merge?
- Can any active path still persist `self-development` to server?
- Do Application and Entry Status use the same 9/9 meaning?
- Can malformed Interest Map be inserted by direct RPC?
- Can an expired/future `status='active'` membership be treated as active anywhere in scope?
- How many Supabase clients exist on `/join/` after all runtimes boot?
- Did OAuth callback regress?
- Did Board Guest/Member/Dementor/Owner Admin state regress?
- Which compatibility layers remain intentionally for G8?
- What exact CI/G6 run proves the candidate?
- Has any live DB mutation or deploy happened? Expected answer before owner authorization: **NO**.
