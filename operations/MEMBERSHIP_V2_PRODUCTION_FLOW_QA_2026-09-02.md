# Dementor Club — Production Flow QA Ledger

Status: **ACTIVE / MEMBERSHIP V2 CORE PASS / BATCH 04 LIVE / BATCH 05 MERGED NOT DEPLOYED / QA PORTAL HARMONIZATION ACTIVE / ACTIVITY SITE G6 PASS / DC-9 BASELINE SITE G6 PASS**  
Date opened: **2026-09-02**  
Last live regression pass: **2026-09-03**  
Operating update: **2026-09-04**  
Environment: **PRODUCTION / https://dementor.club**  
Source of truth: `dementor-club`  
Implementation branch: `dementor-club-site`  
Production branch: `dementor-club-production`

## 0. Purpose and release rule

This is the **single live QA ledger** for Membership v2 and adjacent production/site-shell surfaces discovered during pre-advertising QA.

A finding is closed only after root cause → implementation → release gates → explicit human deploy → live retest.

**Deployment is always manual. QA work must not deploy by itself.**

From 2026-09-04, Dementor Club QA also acts as a controlled project-harmonization loop. A bug is not implemented directly from observation. Before implementation, the project must resolve existing ownership, canonical semantics, duplicate risk, affected routes/surfaces and the current Result/Gate.

## 1. Canonical Membership v2 flow

`AUTHENTICATED → DC9 9/9 → APPLICATION_AVAILABLE → APPLICATION_SUBMITTED → UNDER_REVIEW → 2 independent APPROVE → MEMBER_ACTIVE → COMMUNITY / POST-ADMISSION`

Boundary: `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`.

Controlled QA account: `sharecraftwideo@gmail.com` / Sled ZARI / DC-9 9/9. Historical records and grants are preserved.

Production reviewers: Евгений Казаков + Nikita Lobushkin. Threshold: **2 independent APPROVE**.

## 2. Severity

- **P0 / BLOCKER** — canonical flow, access, security or authoritative state is broken.
- **P1 / MAJOR** — material navigation, shell, privacy, UX or release-integrity failure.
- **P2 / MINOR** — ambiguity/usability issue without state corruption.
- **P3 / POLISH** — refinement only.

## 3. Membership / account findings

### QA-MEM-001 — Legacy `/join/member/`
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P0  
Legacy v1 activation removed; compatibility route resolves to Membership v2 `/join/apply/`.

### QA-MEM-002 — Reviewer decision not visually final
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P1  
Expected: own decision visibly final; progress `N / 2 DEMENTORS`; no misleading repeat controls.

### QA-MEM-003 — `ACCOUNT → CART` 404
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P1  
Production commerce remains disabled; Cart must not be exposed or indexed while disabled.

### QA-MEM-004 — Historical completion vs repeat course attempt
Status: **OPEN / PRODUCT-STATE CLARIFICATION REQUIRED** · P2  
Historical `Думай с опасностью` completion/certificate is from 2026-08-28. A later repeat pass must not overwrite or masquerade as that historical completion. Repeat-attempt storage/model still needs clarification. This remains separate from the DC-9 baseline fix in QA-MEM-034.

### QA-MEM-005 — Logout discoverability
Status: **LIVE PASS FOR LOGOUT + LOGIN RECOVERY 2026-09-03** · P1  
User can log out and log back in through Google. Batch 04 production retest confirms the session returns to Workspace rather than the legacy 404. Remaining post-navigation Workspace failure is separate QA-MEM-033.

### QA-MEM-006 — Active Member `/join/apply/` copy
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P2

### QA-MEM-007 — Membership application nav contrast
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P1

### QA-MEM-008 — Private Board discoverability
Status: **WORKSPACE SHELL PASS / BOARD RESTORATION DEPLOYED / LIVE FUNCTIONAL RETEST PARTIAL** · P1  
Board remains discoverable inside Workspace; Batch 04 restores the previously approved spatial/integration behavior. Child-surface navigation regression is tracked separately as QA-MEM-033.

### QA-MEM-009 — Membership Review outside Workspace shell
Status: **WORKSPACE CHILD SURFACE PASS / NAVIGATION DESCENDANT QA-MEM-033** · P1  
Review is inside Workspace. Ordinary Member negative access test previously PASS. Child-route navigation recovery is corrected in Batch 05 production code and awaits deployment/live retest.

### QA-MEM-010 — Archived Artifact history unavailable
Status: **FIX RELEASED / PARTIAL LIVE RETEST / ACTIVITY PROJECTION SITE G6 PASS** · P1  
Known QA records: active `Куда двигаемся - народ?`; archived `гусь`. Live Board shows active Artifact data; archived history still needs explicit live retest. Current site Result additionally projects existing own Artifacts, responses and reactions into `МОЯ АКТИВНОСТЬ` without a new Activity entity.

### QA-MEM-011 — `/join/apply/` mobile oversized
Status: **FIX RELEASED / MOBILE REGRESSION RETEST REQUIRED** · P1

### QA-MEM-034 — DC-9 first-complete baseline can be overwritten by later repeats
Status: **IMPLEMENTED IN SITE / PR #101 / G6 #729 PASS / SUPABASE MIGRATION NOT APPLIED / NOT DEPLOYED** · P1 DATA SEMANTICS

FACT / root cause:
- current `assessment_runs` already stores separate runs and is the correct history owner;
- current Membership v2 submit RPC built `candidate_snapshot` from the latest run per sphere, so a repeat after first 9/9 could change the admission snapshot;
- guest localStorage stored only the current result per sphere, so a pre-auth repeat could erase evidence of the original 9/9 locally.

Canonical target:
- no parallel baseline table;
- first baseline = map visible at the first moment all 9 canonical spheres have completed runs;
- server derives `baseline_completed_at = max(min(completed_at per canonical sphere))`, then selects the latest run for each sphere at or before that cutoff;
- later repeats remain separate history and never overwrite that snapshot;
- legacy `self-development` is canonicalized to `self_development` during derivation.

Implementation evidence:
- local `firstBaseline` is locked at first 9/9 and survives repeat/reset;
- later local repeats are stored separately in `repeatRuns`;
- application entry synchronizes baseline + repeats + current results before application logic runs;
- migration `20260904171500_dc9_immutable_first_baseline_v1.sql` overrides new application `candidate_snapshot` at insert time while keeping exactly the 9 sphere keys expected by reviewer UI;
- baseline rule/timestamp are stored in application `answers`, not as a tenth snapshot key;
- authenticated `assessment_runs` privileges are reduced to explicit `SELECT + INSERT` to make append-only intent explicit;
- dedicated executable regression contract verifies first 9/9 → repeat → reset without baseline mutation.

Live DB status:
- read-only Supabase audit confirmed the existing model can derive complete first baselines from current history without a new table;
- **no DDL/migration was applied to live Supabase during implementation**;
- do not close until migration is explicitly released, production code is deployed and live baseline/repeat/application retest passes.

## 4. Membership v2 authoritative PASS evidence

Verified on production before shell regression work:

- server-side DC-9 9/9 gate;
- Membership Application submit;
- first independent Dementor approval does not activate membership;
- second independent approval reaches exactly 2;
- application → `accepted`;
- membership → `active`;
- source → `membership-review-v2`;
- accepted Member blocked from repeat application;
- accepted application removed from active review queue;
- accepted Member gained private Board access;
- ordinary Member denied reviewer queue/data;
- Membership v2 did not duplicate initial Artifact slot grant.

Initial Artifact grant remains exactly one authoritative record with `grant_key = initial-membership-v1`.

## 5. Batch 02 — Site Shell & Route Integrity

Implementation PR #86 merged to `dementor-club-site` as `c4ed4a6a1f7a197e31d6a7563d9e27318fb82006`.

Production PR #87 merged as:
`52091b5c6e21c818a7e32d306f964f1c5242bee8`

Production Candidate Integrity #675 and post-merge #676 both passed. The user then **manually deployed Batch 02** and performed live browser QA on 2026-09-03.

The live pass proved that static/build gates were insufficient for DOM/CSS/runtime integration. Batch 02 therefore remained **NOT CLOSED** and led to Corrective Batch 03.

### QA-MEM-012 — Global Header ownership drift
Status: **LIVE PUBLIC-SITE VISUAL PASS AFTER BATCH 03 / WORKSPACE RULE SUPERSEDED BY APPROVED PRIVATE SHELL** · P1

Live Batch 03 retest: public navigation appears visually canonical and consistent across tested public pages. Current Result extends this single public owner, while authenticated `/workspace/*` is now governed by the approved private Workspace Shell authority in `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md`.

### QA-MEM-013 — Footer ownership / geometry drift
Status: **BROWSER PASS / LIVE CROSS-PAGE RETEST PARTIAL** · P1

Batch 03 browser gate confirms one canonical footer and no surviving `.dc-utility-strip` on tested public routes including `/join/`. Live screenshot of 404 also shows the canonical footer. Full cross-page visual pass is still pending before closure.

### QA-MEM-014 — Shared Workspace shell incompatible with existing controller
Status: **ROOT WORKSPACE PASS / CHILD-SURFACE FIX MERGED IN BATCH 05 / CURRENT PRIVATE-SHELL SITE G6 PASS / NOT DEPLOYED** · P0

Root `/workspace/` internal views work after authentication. Child-route navigation defect is tracked as QA-MEM-033. The current Result additionally makes the Workspace Shell the canonical identity/navigation owner and removes the duplicate root `sessionBox` renderer.

### QA-MEM-015 — OWNER_ADMIN route exists but layout is broken
Status: **CURRENT PRIVATE WORKSPACE SHELL BROWSER PASS / LIVE RETEST PENDING** · P1

Chromium verifies `/workspace/admin/` keeps Workspace grid geometry under the canonical private Workspace Shell. Production visual retest still required.

### QA-MEM-016 — JS-generated route validator
Status: **IMPLEMENTATION PASS / KEEP IN RELEASE GATES** · P1

Route manifest + browser coverage now include stale member-return/auth destinations that previously escaped static route checks.

### QA-MEM-017 — Sitemap/indexability reconciliation
Status: **STATIC PASS / LIVE HTTP RETEST PENDING** · P1

Contract remains 31 public indexable routes; `/cart/` and `/profile/` are excluded from sitemap. Batch 04 route manifest PASS: `31 indexable · 16 private/compat · 1 disabled`.

## 6. Browser regression findings from Batch 02 deployment

### QA-MEM-018 — Public shell has multiple effective header contracts
Status: **CLOSED / LIVE VISUAL PASS 2026-09-03 / PERMANENT SINGLE-OWNER CHECK REQUIRED** · P1

Batch 03 made canonical PublicShell the sole primary header owner on public surfaces. Future QA must re-check ownership before modifying header/menu/navigation so duplicate primary navigation cannot reappear.

### QA-MEM-019 — Public footer duplicates utility/navigation ownership
Status: **FIX RELEASED / BROWSER PASS / LIVE VISUAL RETEST PARTIAL** · P1

Global footer runtime removes legacy `<footer>` and `.dc-utility-strip`; production browser smoke asserts the duplicate utility strip is absent on `/join/`. Keep open until a short live visual pass across Home / Join / one entity page.

### QA-MEM-020 — Workspace null-DOM crash
Status: **ROOT WORKSPACE LIVE PASS / CHILD NAVIGATION FIX MERGED IN BATCH 05 / CURRENT OWNER CLEANUP SITE G6 PASS / NOT DEPLOYED** · **P0**

Guest and authenticated root Workspace no longer show the previous `sessionBox.innerHTML` crash. Current Result removes the root controller as a second `sessionBox`/logout rendering owner; canonical identity/session presentation remains in Workspace Shell.

### QA-MEM-021 — Community Board still escapes Workspace
Status: **CLOSED FOR ROUTE/SHELL / FUNCTIONAL DESCENDANTS QA-MEM-028 + QA-MEM-033** · P1

Canonical member route is `/workspace/board/` and the Board remains a Workspace child surface.

### QA-MEM-022 — Admin shell missing layout dependency
Status: **CURRENT PRIVATE WORKSPACE SHELL BROWSER PASS / LIVE RETEST PENDING** · P1

Admin grid/layout is part of the browser release gate.

### QA-MEM-023 — Logout has no reliable recovery to login
Status: **LIVE PASS 2026-09-03** · **P0 ACCESS**

Live Batch 04 retest: user can log out, use Google login again, and regain an authenticated Workspace session. The subsequent failure after Board/Review navigation is QA-MEM-033 and does not indicate auth-session loss.

### QA-MEM-024 — Static CI passed while real browser integration was broken
Status: **CURRENT RESULT BROWSER COVERAGE EXTENDED / PRODUCTION LIVE RETEST PENDING** · P1 RELEASE INTEGRITY

Browser coverage includes a one-session sequence crossing Workspace root and child surfaces and now also verifies persisted Board participation → `МОЯ АКТИВНОСТЬ`. Keep this as a permanent release-gate regression.

## 7. Corrective Batch 03 release state

Implementation PR:
**#88 — QA Batch 03: canonical shell and auth recovery** → merged to `dementor-club-site`.

Production release PR:
**#89 — Release QA Batch 03: canonical shell and auth recovery** → merged to `dementor-club-production` as `bf316726865403805a9f85383669f2b772f016a3`.

Release Readiness run **#699 PASS** included registry, content readiness, visual contract, production build, canonical shell contract, built-JS syntax, real Chromium shell/Workspace smoke, route manifest and final production artifact gate.

First manual production deploy run `33761755697` exposed a release-gate mismatch: production deploy checked analytics/consent while release readiness did not. The build stopped before deployment.

Hotfix PR **#90 — production analytics gate sync** changed only builder/gate synchronization:
- production builder injects `/production-analytics-v1.js` exactly once into every production HTML;
- Site Integrity now runs the same analytics/consent gate as manual deploy.

Hotfix merged to production as `18bfdc63239c95902d6e2f899bd0a903163399e3`.

The same manual deployment was rerun after the hotfix:
- registry/readiness/visual/build PASS;
- production analytics + explicit consent PASS;
- production release guard PASS (`48 HTML routes`);
- Pages artifact upload PASS;
- GitHub Pages deployment PASS.

**Batch 03 is LIVE. Production retest is the source of the Batch 04 findings below.**

## 8. Canonical shell contract after corrective work

### Public header
One primary header only on public surfaces. Any future public-header change must modify the existing canonical GlobalHeader rather than add another page-owned menu/header.

Historical decision recorded 2026-09-03: the canonical public header remained visible above Workspace.

**SUPERSEDED 2026-09-04:** `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md` is the current approved authority for authenticated Workspace. Public GlobalHeader/Footer are public-site owners only and must not render inside authenticated `/workspace/*`.

Current Result implementation contains both the approved Russian/auth-aware public header target and the separated private Workspace Shell in `dementor-club-site`; production remains unchanged until a separate G7 release.

### Product/local bars
Allowed only where they have a distinct product/session/progress responsibility. They must not duplicate the public Club navigation or another canonical shell owner.

### Public footer
One footer owner only on public surfaces. No separate utility/public strip may duplicate it. Public footer does not render inside Workspace.

### Workspace
Current approved authenticated/member shell target:
- Workspace brand/logo → public `/` as the clear escape;
- ordinary Member default surface = `COMMUNITY BOARD`;
- ordinary Member primary navigation includes `COMMUNITY BOARD / МОЙ КЛУБ / МОИ АРТЕФАКТЫ / МОЯ АКТИВНОСТЬ` plus role-owned tools where applicable;
- `HOME` is role-only/internal and is not an ordinary Member primary item;
- name/avatar owns profile entry;
- logout remains inside Workspace;
- public GlobalHeader/Footer do not render inside authenticated Workspace.

**Guest boundary:** before Google authentication, member/role navigation and logout must not be exposed. The Workspace brand remains the public escape; the login gate owns authentication entry.

Board, Artifacts, Review and Admin are Workspace child surfaces, not independent mini-sites.

## 9. Route / SEO model

- `PUBLIC_INDEXABLE` — must resolve, canonicalize and appear in sitemap.
- `PUBLIC_NOINDEX` — utility/auth compatibility surface.
- `PRIVATE_AUTH` — authorized Workspace/member route; always noindex.
- `INTERNAL_SOURCE_ONLY` — must never be emitted or linked as public production route.
- `DISABLED_RESERVED` — source may exist, but production must not expose it while disabled.

Current intent:
- `/workspace/*` including `/workspace/board/` → private/noindex;
- `/community/board/` → compatibility/noindex;
- `/auth/callback/` → compatibility/auth/noindex;
- `/design-system/*` → source-only;
- `/cart/` → disabled/reserved;
- `/account/` is not a production route and must not be emitted by runtime navigation;
- `/degradation_club/*` is legacy/staging-only and must not survive in production runtime navigation or generated internal tests.

## 10. Exit criteria before advertising

QA is green only when:

- live public pages show one canonical header owner and no duplicate primary menu/header implementation;
- public header language and auth-aware states match the approved §15 decision;
- one consistent public footer exists and no duplicate utility strip remains;
- authenticated Workspace uses the canonical private Workspace Shell and does not duplicate the Public Header/Footer;
- Workspace brand/logo provides the public-site escape to `/`;
- Workspace guest state exposes login but not member navigation/logout;
- Google login returns to canonical Workspace/member destinations without legacy `/degradation_club/` or 404;
- ordinary Member defaults to Community Board; Workspace My Club / My Activity / profile identity entry work without runtime errors from root and child surfaces;
- `МОЯ АКТИВНОСТЬ` exposes existing own Artifact / response / reaction history without creating a parallel Activity domain entity;
- persisted Board response/reaction has visible confirmation and a discoverable path to Activity history;
- Board stays inside Workspace shell and retains its approved spatial/integration behavior;
- OWNER_ADMIN tools resolve and render with normal Workspace geometry;
- DC-9/onboarding preserves the canonical Membership v2 boundary;
- DC-9 first 9/9 baseline is immutable and repeat attempts remain separate history after the baseline migration is released;
- browser-level CI covers OAuth callback, guest boundary, Workspace child/root transitions, Board integrations, Member Activity projection, Join/onboarding routes and Admin;
- 31 indexable sitemap routes resolve live and canonical/OG URLs remain on `https://dementor.club` unless a separately approved route-map change supersedes this count;
- mobile baseline is checked at 360 / 390 / 768 / 1024 / 1440 where applicable;
- G6 validation includes semantic, duplicate-owner, route, auth-state, browser and visual checks;
- G8 cleanup checks stale branches, compatibility layers, dead code, duplicate assets/styles and superseded routes after each released Result;
- no unresolved P0 or P1 navigation/security/release-integrity issue remains.

## 11. Live production retest — Batch 03 + analytics hotfix

Observed by the user on production after successful GitHub Pages deployment on **2026-09-03**.

### QA-MEM-025 — Google auth succeeds but post-login redirect lands on legacy 404
Status: **LIVE PASS AFTER BATCH 04 DEPLOY 2026-09-03** · **P0**

Batch 04 correction is now live. User confirms logout followed by Google login restores the authenticated Workspace instead of the previous legacy 404. No evidence of auth-session loss in the current regression.

### QA-MEM-026 — Guest Workspace exposes member navigation and logout before authentication
Status: **CURRENT PRIVATE-SHELL BROWSER PASS / EXPLICIT LIVE GUEST RETEST STILL PENDING** · P1

Current Result keeps Workspace private navigation hidden until authenticated identity is resolved. Chromium asserts guest cannot see private navigation/member tools. Public escape is the Workspace brand → `/`; authentication entry remains the login gate.

### QA-MEM-027 — Workspace has no route back to public Club Home
Status: **LIVE HISTORICAL PASS / IMPLEMENTATION RULE SUPERSEDED 2026-09-04 / CURRENT PRIVATE-SHELL SITE G6 PASS** · P1

Historical 2026-09-03 decision used the public header as the escape. That implementation rule is superseded by `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md`.

Current canonical decision:
- authenticated Workspace has one private Workspace Shell;
- ordinary Member does not carry the public GlobalHeader inside Workspace;
- Workspace brand/logo → `/` is the clear public-site escape;
- `HOME` remains internal/role-specific, not public Home.

### QA-MEM-028 — Board move to Workspace dropped spatial/integration behavior
Status: **BATCH 04 DEPLOYED / CURRENT RESULT BROWSER PASS / LIVE FUNCTIONAL RETEST PARTIAL** · P1

Batch 04 restores the existing production Board modules inside `/workspace/board/` rather than recreating them. Current Result preserves filters, spatial viewport, pan/zoom and own-card positioning in Chromium while extending Board participation discoverability. Drag/reposition on live production still requires explicit human confirmation after release.

### QA-MEM-029 — Join member-return uses stale production destinations
Status: **BATCH 04 DEPLOYED + BROWSER PASS / CURRENT RESULT REMOVES LEGACY PRIMARY HANDOFFS IN SITE** · P1

The dead `/account/` destination is blocked by browser assertions. Current Result removes `/join/member/` and `/community/board/` from primary continuation paths; Board guest OAuth returns to `/workspace/board/` and authenticated non-member Board gate returns to canonical `/join/`.

### QA-MEM-030 — Join leaves a black visual strip under canonical header
Status: **BATCH 04 DEPLOYED + BROWSER PASS / LIVE RETEST PENDING** · P2

Root cause was the authenticated `.dc-account-panel`, a second sticky account UI directly under the canonical header. Batch 04 stops rendering this duplicate panel for an already authenticated user.

### QA-MEM-031 — Join member-return CTA typography/layout is broken
Status: **BATCH 04 DEPLOYED + BROWSER PASS / LIVE RETEST PENDING** · P2

Join member-return geometry is normalized. Any replacement CTA must reuse the canonical header/design owner rather than reintroduce page-local CTA ownership.

### QA-MEM-032 — Browser smoke misses critical auth/state/integration paths
Status: **CURRENT RESULT COVERAGE EXTENDED THROUGH PR #102 / LIVE RETEST PENDING** · P1 RELEASE INTEGRITY

Current browser coverage includes child/root navigation, ordinary Member Board default, first-Artifact focus, role navigation, spatial Board and persisted Board participation → My Activity projection.

## 12. Corrective Batch 04 release state

Implementation PR #91 merged to `dementor-club-site` as `6afb2fa4e81ec0a8b65aa01d6146f70194a518b9`.

Production PR #92 merged to `dementor-club-production` as `6782521d8145f0e3327d6595f17c633ab43c91b6`.

Manual Deploy Dementor Production run **#30 / `33776664149` — SUCCESS** on 2026-09-03.

**Batch 04 live state:** DEPLOYED.

## 13. Live production retest — Batch 04 / Corrective Batch 05

### QA-MEM-033 — Workspace root-view controls become inert on child surfaces
Status: **FIX MERGED TO PRODUCTION IN BATCH 05 / NOT DEPLOYED / CURRENT PRIVATE-SHELL REGRESSION PASS** · P1

Live evidence after Batch 04 deployment:
- authenticated root Workspace initially works;
- `HOME`, `MY CLUB`, `MY ACTIVITY`, `MY WORK`, `MY PROFILE` work while the browser remains on `/workspace/`;
- entering `COMMUNITY BOARD` or `MEMBERSHIP REVIEW` leaves the same sidebar visible, but root-view controls become inert;
- logout/login or returning through the then-current public header restores `/workspace/`;
- session persists throughout; this is not an auth failure.

Root cause confirmed in `workspace/workspace-shell-v1.js`: root views were button controls whose handler only worked on `/workspace/`.

Batch 05 correction:
- root Workspace views become addressable `/workspace/#...` links;
- root controller continues to own in-place rendering on `/workspace/`;
- child surfaces can always navigate back to the intended root view;
- Chromium sequence validates one session through `Workspace → Board → Home → Review → My Activity → Board → My Club`.

Implementation PR #93 merged to `dementor-club-site` as `6ddb60acdf7cadecbad1c32fbd9cdd6667c3178a` after Site Integrity run #707 PASS.

Production release PR #94 passed production Release Readiness run #709 and merged to `dementor-club-production` as:
`689105fc1c7ec772cecc9b4248bc16c47cd40935`.

Production release diff was exactly **1 commit ahead / 0 behind / 3 files**:
- `workspace/workspace-shell-v1.js`;
- `scripts/validate-shell-contract.mjs`;
- `scripts/validate-browser-shell.mjs`.

**Current live state:** Batch 05 is NOT DEPLOYED. Do not close QA-MEM-033 until explicit manual deployment and live retest.

## 14. Product / UX backlog from live QA discussion — 2026-09-04

Status: **PARTIALLY APPROVED / ACTIVE IMPLEMENTATION UNDER §16 HARMONIZATION PROTOCOL**

This section captures product/UX work derived from live QA. Items with explicit decisions are promoted in §15 and in the later approved Workspace authority. Implemented site-only items remain unclosed until production release + live retest.

Backlog scope:
1. Unify public interface language in Russian. — **IMPLEMENTED IN SITE / PR #95 / NOT DEPLOYED**
2. Separate club-entry from authentication. — **IMPLEMENTED IN SITE / PR #95 + #97 + #98 / NOT DEPLOYED**
3. Persistent primary club-entry CTA in the canonical header. — **IMPLEMENTED IN SITE / PR #95 / NOT DEPLOYED**
4. Replace public `Join` service role with login behavior after club-entry is separated. — **IMPLEMENTED IN SITE / PR #95 / NOT DEPLOYED**
5. Define auth-aware header states. — **IMPLEMENTED IN SITE / PR #95 / NOT DEPLOYED**
6. Investigate Safari login regression and add Safari auth/browser coverage where reproducible. — **OPEN**
7. Keep `Запросить обработку` as a future feature idea only; no implementation yet. — **OPEN / IDEA ONLY**
8. Remove redundant pre-DC-9 application/confirmation screen if current source confirms it is only duplicate intent confirmation. — **OPEN**
9. Remove redundant `НАЧАТЬ DC-9` step if the user is already inside the DC-9 entry experience. — **IMPLEMENTED IN SITE / PR #99 / NOT DEPLOYED**
10. Merge DC-9 intro and sphere selection. — **IMPLEMENTED IN SITE / PR #99 / NOT DEPLOYED**
11. Rewrite DC-9 onboarding copy using canonical club language. — **OPEN; PR #99 REUSES EXISTING COPY ONLY**
12. Clarify post-9/9 admission copy without changing Membership v2 semantics. — **PARTIAL; ROUTE/AUTH HANDOFF IMPLEMENTED, FINAL COPY OPEN**
13. Remove low-value completion interstitials. — **OPEN**
14. Make completed sphere cards informative. — **IMPLEMENTED IN SITE USING EXISTING LEVEL NAMES / PR #99 / NOT DEPLOYED**
15. Restore humorous payoff after each sphere using existing approved/source material first. — **PARTIAL; EXISTING RESULT LEVEL PAYOFF EXPOSED, DEDICATED POST-SPHERE PAYOFF OPEN**
16. Design immutable first-pass DC-9 baseline ID on top of existing data model where possible. — **STORAGE/RULE IMPLEMENTED IN SITE / PR #101 / DISPLAY-ID FORMULA STILL OPEN / DB MIGRATION NOT APPLIED**
17. Separate initial baseline from repeat attempts; coordinate with QA-MEM-004. — **IMPLEMENTED TECHNICALLY FOR DC-9 IN SITE / `firstBaseline` + `repeatRuns` + APPEND-ONLY `assessment_runs`; REPEAT-HISTORY UX OPEN**
18. Define 9/9 result screen. — **OPEN FOR FINAL CONTENT/VISUAL; ROUTE HANDOFF HARMONIZED IN PR #98**
19. Review application form/email ownership and local draft → authenticated application transition. — **AUTH/DATA HANDOFF IMPLEMENTED IN SITE / PR #97 + #101 / EMAIL OWNERSHIP STILL OPEN**
20. Implement one canonical end-to-end onboarding flow only after source/authority/route harmonization. — **IN PROGRESS UNDER CURRENT RESULT**
21. Project existing Member Artifacts / responses / reactions into `МОЯ АКТИВНОСТЬ` with visible Board confirmation and no new Activity entity. — **IMPLEMENTED IN SITE / PR #102 / G6 #732 PASS / NOT DEPLOYED**

## 15. Approved Dementor Club product decisions — 2026-09-04

Status: **DECISION / PROJECT-LOCAL APPROVAL FOR UPCOMING WORK**

These decisions were explicitly approved by the project owner during QA discussion. They govern upcoming Dementor Club work. They do **not** promote the global MP_DSL v0.1 Drive artifacts from DRAFT/REFERENCE to APPROVED_AUTHORITY.

### 15.1 Public header / CTA

Desktop target:
`DEMENTOR CLUB  [Вступить в клуб]  О клубе · События · Проекты · Сообщество · Мерч  |  Войти`

Mobile target:
`DEMENTOR CLUB  [Вступить в клуб]  ☰`

Burger target:
`О клубе / События / Проекты / Сообщество / Мерч / Войти`

Decision:
- `Вступить в клуб` is the primary persistent CTA and must remain visible on desktop/mobile;
- it is not an ordinary equal-weight menu item;
- `Войти` is a weaker service action;
- future implementation must modify the existing canonical GlobalHeader rather than introduce a second header/menu implementation.

### 15.2 Join / Account ownership

Decision:
- current public `Join` menu role is retired as the club-entry mechanism;
- club-entry moves to the persistent `Вступить в клуб` CTA;
- service entry becomes `Войти`;
- public `Account` link is removed as a separate permanent guest navigation item;
- after authentication, the login area becomes identity state: user name/nickname + avatar → Workspace;
- logout remains inside Workspace;
- member state must not continue offering a redundant join CTA.

### 15.3 Authentication placement

Decision:
- authentication is required **only before application**;
- DC-9 may be explored/completed before login;
- when the user proceeds to application after 9/9, identity/authentication is required and the relevant first-pass state must be associated with the authenticated profile;
- implementation must preserve `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`.

### 15.4 DC-9 first baseline

Decision:
- first complete DC-9 creates an immutable historical baseline;
- later attempts must not overwrite the first baseline;
- exact baseline-ID formula/storage implementation is delegated to technical design after inspection of current `assessment_runs` and related existing model;
- no parallel baseline entity may be introduced if the existing model can be safely extended.

Technical resolution under PR #101:
- existing `assessment_runs` remains the history authority;
- no new baseline table is introduced;
- first-complete baseline is derived from existing runs at the first 9/9 cutoff and projected into new application snapshots;
- display ID remains a separate unresolved presentation decision.

### 15.5 Remaining visual approval

Nikita/user final review is still required for the concrete visual treatment of the persistent CTA and final public copy refinements. That review may tune typography, spacing, accent, underline/plaque treatment and mobile composition, but must not silently change the approved information architecture above.

### 15.6 Workspace shell / Member activation authority

The separately approved project-local authority `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md` supersedes the historical 2026-09-03 Workspace-header rule. It governs authenticated Workspace shell ownership, ordinary Member Board default, first-Artifact spotlight and `МОЯ АКТИВНОСТЬ` projection. It does not change the public Header target in §15.1.

## 16. MP_DSL harmonization protocol for Dementor Club QA

Status: **DECISION / REQUIRED OPERATING RULE BEFORE BUG IMPLEMENTATION**

Purpose: use every QA cycle to reduce project entropy rather than only patch visible defects. This protocol is mandatory for upcoming portal bug fixes unless the user explicitly narrows the task to emergency service restoration.

The referenced MP_DSL v0.1 standards are currently DRAFT/REFERENCE globally. The project owner nevertheless explicitly approves the following operating sequence for Dementor Club. This is a project-local working Decision, not a silent global MP_DSL status change.

### 16.1 Entry sequence

Before substantial implementation:

`project/repository → PROJECT.json → ARTIFACT_INDEX.json → APPROVED_STATE.json → PROJECT.json.readFirst → current PRODUCT/DOMAIN/ARCHITECTURE/DESIGN authority → current Result → current Gate → implementation inspection`

If kernel files do not exist or are incomplete:
- do not invent parallel project-specific conventions;
- work from verified current evidence;
- record the gap;
- propose/create only the smallest useful migration toward the MP_DSL Project Kernel when appropriate to the Result.

### 16.2 Source and authority reconciliation

For every material rule or artifact used in a fix, distinguish:
- `sourceSystem`: GIT / DRIVE / SUPABASE / EXTERNAL;
- `authorityType`: APPROVED_AUTHORITY / IMPLEMENTATION_AUTHORITY / RUNTIME / EVIDENCE / REFERENCE / HISTORY.

Do not infer authority from storage, recency, filename, branch name or implementation detail alone.

Use fact labels where ambiguity matters:
`FACT / INFERENCE / PROPOSAL / DECISION / UNKNOWN`.

If authoritative sources conflict, stop semantic mutation and record the decision needed.

### 16.3 Existing-before-new / duplicate-owner inventory

Before changing any shared UI or system behavior, search existing implementation and identify the current owner.

At minimum check ownership for:
- Public GlobalHeader;
- public footer;
- desktop navigation;
- mobile header/burger;
- club-entry CTA;
- auth/login/identity control;
- Workspace sidebar;
- Workspace topbar;
- Join/DC-9 local controls;
- account/session panels;
- route redirects/compatibility routes;
- design-system components/tokens used by the affected surface.

Every shared responsibility must end with one canonical owner. Existing compatibility/deprecated implementations may remain temporarily only when their migration role is explicit.

No fix may create a second menu/header/auth owner merely because the local page is easier to patch.

### 16.4 Route and state harmonization

For navigation/auth/onboarding work, map before implementation:

`control → guest destination/state → authenticated guest destination/state → member destination/state → dementor/owner destination/state`

Also record:
- canonical route;
- compatibility/deprecated route;
- auth requirement;
- membership requirement;
- indexability class;
- owner/runtime responsible for emitting the route.

A route generated by JS is part of the same contract as a static `<a href>`.

### 16.5 Domain and semantic protection

Before introducing/redefining terms, inspect current DOMAIN/canonical semantics where available.

Protected boundary for current admission work:
`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`.

Wording cleanup that preserves meaning may proceed inside an approved Result. A change to entity meaning, lifecycle, permission, auth/data ownership, approved core flow or architecture boundary requires an explicit Decision/Change Proposal path rather than silent refactoring.

### 16.6 Design harmonization

Before adding a new visual component/pattern:
- inspect current design-system implementation and existing component/token ownership;
- reuse/extend existing patterns where semantically equivalent;
- verify desktop and mobile ownership together;
- avoid page-local CSS/components that recreate an existing global pattern.

For the approved header CTA, visual treatment is still subject to final user/Nikita review, but implementation must remain inside the one canonical GlobalHeader system.

### 16.7 QA finding enrichment

Before a QA finding becomes implementation work, capture as applicable:
- FACT / observed failure;
- severity;
- current owner;
- duplicate-owner risk;
- canonical target;
- affected routes/screens;
- affected domain/auth/state;
- source/authority evidence;
- decision requirement;
- Result pointer;
- Gate;
- acceptance criteria;
- validation evidence required;
- cleanup requirement.

### 16.8 Result / branch rule

Implementation is grouped into the smallest coherent Result.

Default:
`One Result → one active integration branch`.

Do not create separate branches for unrelated convenience and do not mix unrelated Results into one branch. Because `dementor-club-site` and `dementor-club-production` have divergent history, production release candidates must continue to be projected from the current production baseline with a minimal explicit diff until branch reconciliation is completed.

### 16.9 G6 validation extension

For Dementor Club portal work, G6 validation should include where applicable:
- build/static integrity;
- semantic consistency with approved flow;
- duplicate-owner scan;
- route/redirect consistency;
- guest/authenticated/member/role state matrix;
- real-browser regression;
- Safari auth check for auth-related changes;
- mobile/desktop visual check;
- canonical header/footer/Workspace-shell ownership;
- no stale `/account/` or `/degradation_club/` runtime destinations;
- existing Membership v2 regression preservation;
- DC-9 first-baseline/repeat/reset contract for changes touching assessment history or application snapshots.

A green isolated component test is not sufficient when the affected responsibility is shared across routes.

### 16.10 G7 release rule

`commit ≠ merge ≠ deploy`.

Production deploy remains manual and requires explicit user authorization. QA/harmonization work must not silently deploy.

A database migration is also a release mutation: committing a migration file does **not** authorize applying it to live Supabase.

### 16.11 G8 cleanup / entropy check

After a released Result, inspect:
- stale Result/release branches;
- superseded routes;
- compatibility redirects whose migration is complete;
- dead code;
- duplicate CSS/assets/components;
- temporary flags/fixtures;
- obsolete menu/header/account implementations;
- superseded QA assumptions;
- lessons that should become permanent regression checks.

A Result is not fully clean while an old parallel owner remains active without an explicit compatibility purpose.

### 16.12 Standard QA execution loop

From now on, default portal QA flow is:

`QA observation → Project/Authority check → Existing implementation inventory → Duplicate/semantic/route check → Decision if required → Result → G5 Build → G6 Validation → G7 explicit release → live retest → G8 Cleanup → ledger update`
This sequence is intended to make each bug-fix pass also improve Dementor Club structural coherence.

## 17. Current Result implementation state — 2026-09-04

Status: **ACTIVE / SEVEN COHERENT PACKAGES G6 PASS + MERGED TO `dementor-club-site` / PRODUCTION RELEASE NOT AUTHORIZED**

Current Result:
`dementor-club.result.qa-portal-harmonization`

Active integration branch:
`result/qa-portal-harmonization`

Implementation evidence:
1. **PR #95 — canonical Russian header and auth identity**  
   G6: Site Integrity / Release Readiness **#715 PASS**.  
   Merged to `dementor-club-site` as `47cc670d12b03e600460176916e15a4de7c890b0`.  
   Effect: one canonical GlobalHeader, Russian primary navigation, persistent `Вступить в клуб`, guest `Войти`, authenticated identity → Workspace, mobile contract, no second public header/auth owner.

2. **PR #97 — canonical application auth handoff**  
   G6: Site Integrity / Release Readiness **#718 PASS**.  
   Merged to `dementor-club-site` as `334f1faacb8d170acce9b82634e2ddc11787fee6`.  
   Effect: `/join/apply/` reuses `community-runtime-v1.js`; duplicate Supabase/auth owner removed; Google returns to application; anonymous/local DC-9 runs sync before server 9/9 gate evaluation.

3. **PR #98 — direct DC-9 result → application**  
   G6: Site Integrity / Release Readiness **#720 PASS**.  
   Merged to `dementor-club-site` as `5f1ccf1ecba91ea317b428ea6daf175a85709ec9`.  
   Effect: `/join/result/` no longer starts Google auth; non-member continuation goes directly to `/join/apply/`; active Member goes to `/workspace/board/`; legacy `/join/member/` and `/community/board/` are no longer primary continuation destinations.

4. **PR #99 — merged DC-9 intro and sphere picker**  
   G6: Site Integrity / Release Readiness **#722 PASS**.  
   Merged to `dementor-club-site` as `8fab18931baa4e470bf5ed3f2ef15f92cb5bf3ef`.  
   Effect: standalone `НАЧАТЬ DC-9` screen removed; user lands directly on the nine-sphere picker; existing explanatory copy is reused rather than silently rewritten; completed sphere cards expose existing level/result meaning; reset capability remains.

5. **PR #100 — canonical Workspace shell and Member activation**  
   G6: Site Integrity / Release Readiness **#727 PASS**.  
   Merged to `dementor-club-site` as `596aba91b4f158aa8875fb80285825f8f34e09b8`.  
   Effect: public shell is separated from authenticated Workspace; ordinary Member defaults to Community Board; identity/profile remains in Workspace Shell; first-Artifact spotlight extends the existing activation gate without changing membership state.

6. **PR #101 — immutable first-complete DC-9 baseline**  
   G6: Site Integrity / Release Readiness **#729 PASS** including executable baseline contract, build, shell, Chromium, route manifest and release guard.  
   Merged to `dementor-club-site` as `759c93af280af05bae89c3b17a5de809ffcd83cb`.  
   Effect: guest first 9/9 is preserved, repeats are separated, all local history syncs before application, and a server migration derives/locks the first-complete 9/9 application snapshot from existing append-only `assessment_runs` without a parallel baseline table.

7. **PR #102 — Community participation → My Activity projection**  
   G6: Site Integrity / Release Readiness **#732 PASS** after a first browser run correctly exposed an unrealistic owner-role test fixture; fixture was corrected rather than weakening the regression.  
   Merged to `dementor-club-site` as `9adef4a6691e88a63030f2925bfbc004ebdc93a6`.  
   Effect: `МОЯ АКТИВНОСТЬ` projects existing own `dc_artifacts`, `dc_artifact_responses` and `dc_artifact_reactions`; Board persisted response/reaction state has visible confirmation and an Activity path; no new Activity table/entity was introduced; duplicate root session/identity renderer was removed; Board guest/non-member destinations were reconciled to `/workspace/board/` and `/join/`.

Current branch synchronization:
- `result/qa-portal-harmonization` is synchronized to `9adef4a6691e88a63030f2925bfbc004ebdc93a6` after PR #102;
- no parallel Result/integration branch was created for these related changes.

Production / database status:
- **none of PR #95/#97/#98/#99/#100/#101/#102 is deployed or merged to `dementor-club-production` yet**;
- migration `20260904171500_dc9_immutable_first_baseline_v1.sql` is committed and G6-validated but **NOT applied to live Supabase**;
- Batch 05 (`689105fc1c7ec772cecc9b4248bc16c47cd40935`) remains merged to `dementor-club-production` but **not deployed**;
- live production therefore still reflects the pre-current-Result header/onboarding/baseline/Activity state plus Batch 04;
- do not mark current-Result findings LIVE PASS before a clean production candidate, explicit database/deploy authorization and live retest.

Next harmonized priorities:
1. investigate the reported Safari auth regression and determine whether a Safari-specific compatibility fix/test is required;
2. continue onboarding/result UX cleanup only where existing copy/source supports it; final 9/9 visual/copy and baseline display-ID remain separate approval items;
3. when the current QA cluster is ready for release, create a clean production candidate **from the current `dementor-club-production` baseline**, transfer only validated current-Result files/migration, run full production readiness, then stop for explicit user authorization before applying the Supabase migration or deploying the site;
4. live-retest first-baseline → repeat → application snapshot, auth placement, Header/Workspace, My Activity and QA-MEM-033 after release;
5. perform G8 cleanup including legacy Join/member compatibility, dead picker-copy/runtime state, stale branches and any superseded shell/auth code.
