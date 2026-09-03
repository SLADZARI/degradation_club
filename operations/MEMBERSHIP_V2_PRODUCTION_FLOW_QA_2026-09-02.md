# Dementor Club — Production Flow QA Ledger

Status: **ACTIVE / MEMBERSHIP V2 CORE PASS / BATCH 04 DEPLOYED / LIVE RETEST ACTIVE / QA-MEM-033 OPEN**  
Date opened: **2026-09-02**  
Last live regression pass: **2026-09-03**  
Environment: **PRODUCTION / https://dementor.club**  
Source of truth: `dementor-club`  
Implementation branch: `dementor-club-site`  
Production branch: `dementor-club-production`

## 0. Purpose and release rule

This is the **single live QA ledger** for Membership v2 and adjacent production/site-shell surfaces discovered during pre-advertising QA.

A finding is closed only after root cause → implementation → release gates → explicit human deploy → live retest.

**Deployment is always manual. QA work must not deploy by itself.**

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
Historical `Думай с опасностью` completion/certificate is from 2026-08-28. A later repeat pass must not overwrite or masquerade as that historical completion. Repeat-attempt storage/model still needs clarification.

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
Status: **WORKSPACE CHILD SURFACE PASS / NAVIGATION DESCENDANT QA-MEM-033 OPEN** · P1  
Review is inside Workspace, but entering the child route exposes a shared-shell navigation defect tracked in QA-MEM-033. Ordinary Member negative access test previously PASS.

### QA-MEM-010 — Archived Artifact history unavailable
Status: **FIX RELEASED / PARTIAL LIVE RETEST** · P1  
Known QA records: active `Куда двигаемся - народ?`; archived `гусь`. Live Board shows active Artifact data; archived history still needs explicit live retest from `MY ARTIFACTS`.

### QA-MEM-011 — `/join/apply/` mobile oversized
Status: **FIX RELEASED / MOBILE REGRESSION RETEST REQUIRED** · P1

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
Status: **LIVE VISUAL PASS AFTER BATCH 03 / ROUTE ISSUES SPLIT OUT** · P1

Live Batch 03 retest: public navigation now appears visually canonical and consistent across tested pages. `Join` and `Account` descendants are tracked separately.

### QA-MEM-013 — Footer ownership / geometry drift
Status: **BROWSER PASS / LIVE CROSS-PAGE RETEST PARTIAL** · P1

Batch 03 browser gate confirms one canonical footer and no surviving `.dc-utility-strip` on tested public routes including `/join/`. Live screenshot of 404 also shows the canonical footer. Full cross-page visual pass is still pending before closure.

### QA-MEM-014 — Shared Workspace shell incompatible with existing controller
Status: **ROOT WORKSPACE PASS / CHILD-SURFACE NAVIGATION REGRESSION QA-MEM-033** · P0

Root `/workspace/` internal views work after authentication. Live Batch 04 retest found a distinct shared-shell child-route navigation defect after entering Board/Review, tracked as QA-MEM-033.

### QA-MEM-015 — OWNER_ADMIN route exists but layout is broken
Status: **BATCH 04 BROWSER PASS / LIVE RETEST PENDING** · P1

Chromium verifies `/workspace/admin/` keeps Workspace grid geometry under the canonical public header. Production visual retest still required.

### QA-MEM-016 — JS-generated route validator
Status: **IMPLEMENTATION PASS / KEEP IN RELEASE GATES** · P1

Route manifest + browser coverage now include stale member-return/auth destinations that previously escaped static route checks.

### QA-MEM-017 — Sitemap/indexability reconciliation
Status: **STATIC PASS / LIVE HTTP RETEST PENDING** · P1

Contract remains 31 public indexable routes; `/cart/` and `/profile/` are excluded from sitemap. Batch 04 route manifest PASS: `31 indexable · 16 private/compat · 1 disabled`.

## 6. Browser regression findings from Batch 02 deployment

### QA-MEM-018 — Public shell has multiple effective header contracts
Status: **CLOSED / LIVE VISUAL PASS 2026-09-03** · P1

Batch 03 made canonical PublicShell the sole primary header owner. Current live screenshots show the expected shared header language.

### QA-MEM-019 — Public footer duplicates utility/navigation ownership
Status: **FIX RELEASED / BROWSER PASS / LIVE VISUAL RETEST PARTIAL** · P1

Global footer runtime removes legacy `<footer>` and `.dc-utility-strip`; production browser smoke asserts the duplicate utility strip is absent on `/join/`. Keep open until a short live visual pass across Home / Join / one entity page.

### QA-MEM-020 — Workspace null-DOM crash
Status: **ROOT WORKSPACE LIVE PASS / CHILD NAVIGATION DESCENDANT QA-MEM-033** · **P0**

Guest and authenticated root Workspace no longer show the previous `sessionBox.innerHTML` crash. The new failure after entering Board/Review is navigation ownership, not a return of the null-DOM crash.

### QA-MEM-021 — Community Board still escapes Workspace
Status: **CLOSED FOR ROUTE/SHELL / FUNCTIONAL DESCENDANTS QA-MEM-028 + QA-MEM-033** · P1

Canonical member route is `/workspace/board/` and the Board remains a Workspace child surface.

### QA-MEM-022 — Admin shell missing layout dependency
Status: **BATCH 04 BROWSER PASS / LIVE RETEST PENDING** · P1

Admin grid/layout is now part of the browser release gate.

### QA-MEM-023 — Logout has no reliable recovery to login
Status: **LIVE PASS 2026-09-03** · **P0 ACCESS**

Live Batch 04 retest: user can log out, use Google login again, and regain an authenticated Workspace session. The subsequent failure after Board/Review navigation is QA-MEM-033 and does not indicate auth-session loss.

### QA-MEM-024 — Static CI passed while real browser integration was broken
Status: **BATCH 04 COVERAGE EXPANDED / CHILD-ROUTE GAP QA-MEM-033** · P1 RELEASE INTEGRITY

Chromium covers OAuth callback, guest/private boundary, root Workspace internal view transitions, spatial Board integrations, Join member-return destinations/geometry and Admin layout. Live QA revealed that the suite did not test root-view controls after entering Workspace child routes.

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
One primary header only. Canonical Home language:
`Club / Events / Projects / Community / Merch / Archive / Join`
with a stable `Account → /workspace/` entry.

**Approved 2026-09-03:** the canonical public header remains visible above Workspace. It is the discoverable escape from private Workspace back to the public Club. The brand points to `/`; public navigation remains available.

### Product/local bars
Allowed only below the global header for product/session/progress state. They must not duplicate the club brand or global navigation.

### Public footer
One footer owner only. It contains public section navigation plus Join / Account / Contacts / Support / Privacy / Terms. No separate `UTILITY / PUBLIC` strip beside it.

### Workspace
Authenticated/member sidebar target:
`HOME / MY CLUB / COMMUNITY BOARD / MY ARTIFACTS / MY ACTIVITY / MY WORK when applicable / MY PROFILE / role tools / LOG OUT`.

`HOME` is **Workspace Home**, not the public site Home. No duplicate `BACK TO CLUB` item is required while the canonical public header is present and working.

**Guest boundary:** before Google authentication, member/role navigation and logout must not be exposed. The public header remains available as the route back to the public Club.

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
- `/auth/callback/` → compatibility/auth/noindex, successful auth resolves to approved root `next` route;
- `/design-system/*` → source-only;
- `/cart/` → disabled/reserved;
- `/account/` is **not** a production route and must not be emitted by runtime navigation;
- `/degradation_club/*` is legacy/staging-only and must not survive in production runtime navigation or generated internal tests.

## 10. Exit criteria before advertising

QA is green only when:

- live public pages show the same canonical header;
- no page-owned competing primary header remains;
- one consistent footer exists and no duplicate utility strip remains;
- Workspace retains the canonical public header for public-site escape;
- Workspace guest state exposes login but not member navigation/logout;
- Google login returns to `/workspace/` without legacy `/degradation_club/` or 404;
- Workspace My Club / My Activity / My Profile work without runtime errors from both root and Workspace child surfaces;
- Board stays inside Workspace shell **and** retains its approved spatial/integration behavior;
- OWNER_ADMIN tools resolve and render with normal Workspace geometry;
- Join member-return CTAs use canonical production routes and stable typography;
- browser-level CI passes on the production candidate and covers OAuth callback + guest boundary + Board integrations + Join + return navigation from child Workspace routes;
- 31 indexable sitemap routes resolve live and canonical/OG URLs remain on `https://dementor.club`;
- Membership v2 regression set remains green;
- mobile baseline is checked at 360 / 390 / 768 / 1024 / 1440 where applicable;
- no unresolved P0 or P1 navigation/security/release-integrity issue remains.

## 11. Live production retest — Batch 03 + analytics hotfix

Observed by the user on production after successful GitHub Pages deployment on **2026-09-03**.

### QA-MEM-025 — Google auth succeeds but post-login redirect lands on legacy 404
Status: **LIVE PASS AFTER BATCH 04 DEPLOY 2026-09-03** · **P0**

Batch 04 correction is now live. User confirms logout followed by Google login restores the authenticated Workspace instead of the previous legacy 404. No evidence of auth-session loss in the current regression.

### QA-MEM-026 — Guest Workspace exposes member navigation and logout before authentication
Status: **BATCH 04 DEPLOYED + BROWSER PASS / EXPLICIT LIVE GUEST RETEST STILL PENDING** · P1

Batch 04 hides the Workspace private sidebar until authenticated identity is resolved. Chromium asserts the guest cannot see private sidebar, member tools or logout while the public header remains available. A dedicated human guest-boundary screenshot/check is still pending.

### QA-MEM-027 — Workspace has no route back to public Club Home
Status: **LIVE PASS / PRODUCT DECISION CONFIRMED 2026-09-03** · P1

Approved decision from user on **2026-09-03**:
- do **not** remove the canonical public header from Workspace;
- `HOME` remains the internal Workspace Home;
- the public header provides the public-site escape, with brand → `/` and the normal public navigation.

Current live screenshot confirms the public header remains above Workspace.

### QA-MEM-028 — Board move to Workspace dropped spatial/integration behavior
Status: **BATCH 04 DEPLOYED / LIVE FUNCTIONAL RETEST PARTIAL** · P1

Batch 04 restores the existing production Board modules inside `/workspace/board/` rather than recreating them:
- Board QA/responsive CSS;
- filters;
- integration projections;
- activation gate;
- spatial CSS/JS with pan/zoom and member-card positioning;
- Telegram worker trigger.

Current live screenshot confirms Board renders inside Workspace with active member state and restored shell. Drag/reposition and scattered test/activity cards still require explicit live functional confirmation. The new inability to leave Board through root Workspace controls is tracked separately as QA-MEM-033.

### QA-MEM-029 — Join member-return uses stale production destinations
Status: **BATCH 04 DEPLOYED + BROWSER PASS / LIVE RETEST PENDING** · P1

Member-return destinations are now canonical:
- Community → `/workspace/board/`;
- DC-9 map → `/join/result/`;
- Account → `/workspace/`.

The dead `/account/` destination is blocked by browser assertions.

### QA-MEM-030 — Join leaves a black visual strip under canonical header
Status: **BATCH 04 DEPLOYED + BROWSER PASS / LIVE RETEST PENDING** · P2

Root cause was the authenticated `.dc-account-panel` created by `dementor-account-sync-v8.js`: a second sticky account UI directly under the canonical header.

Batch 04 keeps DC-9 account synchronization active but does not render that duplicate sticky account panel for an already authenticated user. Guest save/login behavior remains available. Chromium now finds no unexplained dark full-width block under the header.

### QA-MEM-031 — Join member-return CTA typography/layout is broken
Status: **BATCH 04 DEPLOYED + BROWSER PASS / LIVE RETEST PENDING** · P2

Join member-return anchor/button geometry is normalized and the browser gate verifies stable flex layout and minimum target height.

### QA-MEM-032 — Browser smoke still misses critical auth/state/integration paths
Status: **CHILD-ROUTE COVERAGE GAP OPEN THROUGH QA-MEM-033** · P1 RELEASE INTEGRITY

Batch 04 Chromium coverage successfully exercises OAuth callback, guest boundary, root Workspace views, spatial Board integrations, Join and Admin. Live QA found one missing path: after navigating from root Workspace into a child surface (`/workspace/board/` or `/workspace/review/`), root-view controls were never exercised. That gap is now explicit and must be added to the permanent browser suite.

## 12. Corrective Batch 04 release state

Implementation PR:
**#91 — QA Batch 04: auth boundary, Workspace header, Board restoration, Join routes**.

Final implementation candidate head:
`f52bde7a978df8fe97a002257bc7a0dfb4ea8f33`

Implementation Release Readiness:
**#704 / run `33773784154` — PASS**.

PR #91 merged to `dementor-club-site` as:
`6afb2fa4e81ec0a8b65aa01d6146f70194a518b9`.

Because `dementor-club-site` and `dementor-club-production` are heavily diverged, Batch 04 was **not** released through a direct branch-to-branch merge. A production-only branch was created from the current production commit and populated only with the exact Batch 04 file state.

Production release branch:
`release/qa-batch-04-production`

Release candidate commit:
`c3a7eae88e5368ec59e1ad84ed7a7af824739a2f`

Comparison against production before merge:
- exactly **1 commit ahead**;
- **0 behind**;
- actual production diff: **14 files**;
- remaining PR #91 files were already byte-identical to current production and produced no diff.

Production PR:
**#92 — Release QA Batch 04: auth boundary, Workspace header, Board restoration, Join routes**.

Production Release Readiness:
**#706 / run `33775142183` — PASS**.

The production candidate passed:
- registry/routes/feature state;
- content readiness;
- visual contract;
- production build;
- production analytics + consent;
- canonical shell contract;
- built-JS syntax;
- Chromium browser shell/recovery suite;
- route manifest;
- final production artifact release guard.

PR #92 merged to `dementor-club-production` as:
`6782521d8145f0e3327d6595f17c633ab43c91b6`.

Manual Deploy Dementor Production run **#30 / `33776664149` — SUCCESS** on 2026-09-03:
- canonical production branch checkout PASS;
- registry/readiness/visual/build PASS;
- production analytics + consent PASS;
- final production artifact/release gate PASS;
- Pages artifact upload PASS;
- GitHub Pages deployment PASS.

**Current production-code state:** Batch 04 is merged.  
**Current live-site state:** Batch 04 is **DEPLOYED**.  
**QA state:** live retest is active; QA-MEM-033 is open and blocks Workspace navigation closure.

## 13. Live production retest — Batch 04

### QA-MEM-033 — Workspace root-view controls become inert on child surfaces
Status: **OPEN / LIVE P1 NAVIGATION / SOURCE-CONFIRMED** · P1

Live evidence after Batch 04 deployment:
- authenticated root Workspace initially works;
- `HOME`, `MY CLUB`, `MY ACTIVITY`, `MY WORK`, `MY PROFILE` work while the browser remains on `/workspace/`;
- entering `COMMUNITY BOARD` (`/workspace/board/`) or `MEMBERSHIP REVIEW` (`/workspace/review/`) leaves the same sidebar visible, but the root-view controls stop responding;
- logout/login or leaving through the public header and returning through `Account` restores `/workspace/` and the controls work again until another child surface is entered;
- session persists throughout; this is not an auth failure.

Root cause confirmed in `workspace/workspace-shell-v1.js`:
- root Workspace views are rendered as `<button data-route>` rather than routable links;
- the click handler explicitly returns unless `current` is `/workspace/` or `/workspace/index.html`;
- Board and Review are separate child documents that load the shared shell but do not load the root `workspace.js` controller;
- therefore the buttons are intentionally inert on every child surface.

Required correction:
- one shared navigation contract must work from every Workspace surface;
- root views should be addressable from child routes, preferably as canonical links such as `/workspace/#home`, `/workspace/#club`, `/workspace/#activity`, `/workspace/#work`, `/workspace/#profile`;
- on root Workspace the controller may intercept these links for in-place view changes, but child surfaces must always be able to navigate back to the root route;
- Board / Artifacts / Review / Admin remain true child routes;
- add Chromium sequence coverage: `/workspace/` → Board → Home/My Club → Review → Home/My Activity, asserting every transition works without logout/relogin.
