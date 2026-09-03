# Dementor Club — Production Flow QA Ledger

Status: **ACTIVE / MEMBERSHIP V2 CORE PASS / BATCH 03 DEPLOYED / LIVE RETEST IN PROGRESS**  
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
Status: **LIVE PASS FOR LOGOUT ACTION / LOGIN RECOVERY OPEN THROUGH QA-MEM-025** · P1  
User can log out. Reliable return through Google auth is not closed because post-login redirect currently reaches a 404.

### QA-MEM-006 — Active Member `/join/apply/` copy
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P2

### QA-MEM-007 — Membership application nav contrast
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P1

### QA-MEM-008 — Private Board discoverability
Status: **WORKSPACE SHELL PASS / BOARD FUNCTIONAL REGRESSION QA-MEM-028** · P1  
Board is now discoverable inside Workspace, but the migrated surface lost prior spatial/integration behavior.

### QA-MEM-009 — Membership Review outside Workspace shell
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P1  
Ordinary Member negative access test previously PASS.

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

Live Batch 03 retest: public navigation now appears visually canonical and consistent across tested pages. `Join` and `Account` still have functional descendants, tracked separately as QA-MEM-025 / QA-MEM-030 / QA-MEM-031.

### QA-MEM-013 — Footer ownership / geometry drift
Status: **BROWSER PASS / LIVE CROSS-PAGE RETEST PARTIAL** · P1

Batch 03 browser gate confirms one canonical footer and no surviving `.dc-utility-strip` on tested public routes including `/join/`. Live screenshot of 404 also shows the canonical footer. Full cross-page visual pass is still pending before closure.

### QA-MEM-014 — Shared Workspace shell incompatible with existing controller
Status: **CORRECTIVE FIX RELEASED / LIVE PARTIAL PASS** · P0

The previous null-DOM crash is no longer visible in current guest Workspace and Board screenshots. `MY ACTIVITY` / `MY CLUB` need one explicit live click retest before this parent finding closes.

### QA-MEM-015 — OWNER_ADMIN route exists but layout is broken
Status: **CORRECTIVE FIX RELEASED / LIVE RETEST PENDING** · P1

Batch 03 restored the missing canonical Workspace layout CSS and CI computed-layout check. Needs one production visual retest on `/workspace/admin/`.

### QA-MEM-016 — JS-generated route validator
Status: **IMPLEMENTATION PASS / KEEP IN RELEASE GATES** · P1

The manifest/static/JS route hardening remains useful. New stale destinations found in Join prove the validator still needs broader template/runtime coverage; see QA-MEM-031 / QA-MEM-032.

### QA-MEM-017 — Sitemap/indexability reconciliation
Status: **STATIC PASS / LIVE HTTP RETEST PENDING** · P1

Contract remains 31 public indexable routes; `/cart/` and `/profile/` are excluded from sitemap. Live HTTP/canonical verification remains required after the corrective release.

## 6. Browser regression findings from Batch 02 deployment

### QA-MEM-018 — Public shell has multiple effective header contracts
Status: **CLOSED / LIVE VISUAL PASS 2026-09-03** · P1

Batch 03 made canonical PublicShell the sole primary header owner. Current live screenshots show the expected shared header language. Functional problems behind `Join` / `Account` are separate route/auth findings, not header-ownership drift.

### QA-MEM-019 — Public footer duplicates utility/navigation ownership
Status: **FIX RELEASED / BROWSER PASS / LIVE VISUAL RETEST PARTIAL** · P1

Global footer runtime removes legacy `<footer>` and `.dc-utility-strip`; production browser smoke asserts the duplicate utility strip is absent on `/join/`. Keep open until a short live visual pass across Home / Join / one entity page.

### QA-MEM-020 — Workspace null-DOM crash
Status: **FIX RELEASED / LIVE PARTIAL PASS** · **P0**

Corrective implementation restored `id="sessionBox"` and `data-work-nav`. Guest Workspace now renders a stable Google-login gate instead of the previous `sessionBox.innerHTML` crash. Authenticated Activity/My Club live click retest remains required.

### QA-MEM-021 — Community Board still escapes Workspace
Status: **CLOSED FOR ROUTE/SHELL / FUNCTIONAL DESCENDANT QA-MEM-028** · P1

Canonical member route is now `/workspace/board/` and current live screenshot confirms the Board sits inside Workspace shell. Functional spatial behavior regressed during the move and is tracked separately.

### QA-MEM-022 — Admin shell missing layout dependency
Status: **FIX RELEASED / LIVE RETEST PENDING** · P1

Corrective implementation adds the canonical Workspace layout stylesheet and browser-computed grid check.

### QA-MEM-023 — Logout has no reliable recovery to login
Status: **PARTIAL PASS / POST-AUTH REDIRECT BLOCKED BY QA-MEM-025** · **P0 ACCESS**

Guest Workspace now reliably renders `ВОЙТИ ЧЕРЕЗ GOOGLE`, so the old pre-login crash is fixed. Google auth itself succeeds and persists a session, but callback/navigation then lands on a 404 instead of returning to Workspace.

### QA-MEM-024 — Static CI passed while real browser integration was broken
Status: **BROWSER GATE IMPLEMENTED / COVERAGE GAP REMAINS** · P1 RELEASE INTEGRITY

Chromium/Playwright now validates PublicShell, guest/auth Workspace, Workspace Board shell and Admin layout. Current live defects reveal missing end-to-end coverage for real OAuth callback routing, unauthenticated sidebar visibility, Board spatial integrations and Join member-return destinations. See QA-MEM-032.

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

**Batch 03 is LIVE. Production retest is now the authoritative state.**

## 8. Canonical shell contract after corrective work

### Public header
One primary header only. Canonical Home language:
`Club / Events / Projects / Community / Merch / Archive / Join`
with a stable `Account → /workspace/` entry for authentication recovery.

### Product/local bars
Allowed only below the global header for product/session/progress state. They must not duplicate the club brand or global navigation.

### Public footer
One footer owner only. It contains public section navigation plus Join / Account / Contacts / Support / Privacy / Terms. No separate `UTILITY / PUBLIC` strip beside it.

### Workspace
Authenticated/member sidebar target:
`HOME / MY CLUB / COMMUNITY BOARD / MY ARTIFACTS / MY ACTIVITY / MY WORK when applicable / MY PROFILE / role tools / LOG OUT`.

**Guest boundary:** an unauthenticated visitor is not a Workspace member shell. Before Google authentication they should see only the login gate plus a clear route back to the public Club; member/role navigation and logout must not be exposed.

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
- `/auth/callback/` → compatibility/auth/noindex, must resolve successful auth to approved `next` route;
- `/design-system/*` → source-only;
- `/cart/` → disabled/reserved;
- `/account/` is **not** a production route and must not be emitted by runtime navigation.

## 10. Exit criteria before advertising

QA is green only when:

- live public pages show the same canonical header;
- no page-owned competing primary header remains;
- one consistent footer exists and no duplicate utility strip remains;
- Workspace guest state exposes only login + public escape, not member navigation;
- Google login returns to `/workspace/` without legacy `/degradation_club/` or 404;
- Workspace My Club / My Activity / My Profile work without runtime errors;
- Workspace has an explicit route back to public Club Home;
- Board stays inside Workspace shell **and** retains its approved spatial/integration behavior;
- OWNER_ADMIN tools resolve and render with normal Workspace geometry;
- Join member-return CTAs use canonical production routes and stable typography;
- browser-level CI passes on the production candidate and covers OAuth callback + guest nav + Board integrations;
- 31 indexable sitemap routes resolve live and canonical/OG URLs remain on `https://dementor.club`;
- Membership v2 regression set remains green;
- mobile baseline is checked at 360 / 390 / 768 / 1024 / 1440 where applicable;
- no unresolved P0 or P1 navigation/security/release-integrity issue remains.

## 11. Live production retest — Batch 03 + analytics hotfix

Observed by the user on production after successful GitHub Pages deployment on **2026-09-03**.

### QA-MEM-025 — Google auth succeeds but post-login redirect lands on legacy 404
Status: **OPEN / LIVE P0 ACCESS** · **P0**

Live evidence:
- unauthenticated `/workspace/` correctly shows `ВОЙТИ ЧЕРЕЗ GOOGLE`;
- Google/Supabase login succeeds and the session is persisted;
- browser is then sent to a `СТРАНИЦА УШЛА` 404 on a legacy `/degradation_club/...` path instead of returning to Personal Workspace;
- opening `/workspace/` manually after the failure sees the authenticated session.

Source evidence:
- `workspace.js` and `community-runtime-v1.js` still carry legacy `basePath()` compatibility logic;
- `/auth/callback/` also derives `base`, `safeNext` and fallback target from `/degradation_club/` compatibility state;
- production build normalizes external JS and inline HTML differently, so authentication must stop depending on legacy base-path inference.

Required correction:
- production OAuth callback and all auth entry points use root canonical routes only;
- successful Workspace login resolves to `/workspace/`;
- no successful auth flow can emit `/degradation_club/*`;
- add end-to-end callback browser test asserting final pathname `/workspace/`.

### QA-MEM-026 — Guest Workspace exposes member navigation and logout before authentication
Status: **OPEN / LIVE P1 ACCESS UX** · P1

Live evidence: before login, sidebar shows `HOME / MY CLUB / COMMUNITY BOARD / MY ARTIFACTS / MY ACTIVITY / MY PROFILE / LOG OUT` although the user is unauthenticated.

Root cause confirmed in `workspace-shell-v1.js`: the full basic sidebar is rendered synchronously before `getSession()`. The guest branch only changes the session label and never hides member navigation.

Required correction:
- unauthenticated Workspace renders login gate only;
- member/role tools, Artifact/Board/Profile navigation and Logout appear only after authenticated identity is resolved;
- include a public Club-home escape for the guest.

### QA-MEM-027 — Workspace has no route back to public Club Home
Status: **OPEN / LIVE P1 NAVIGATION** · P1

Live evidence: clicking `HOME` stays in Personal Workspace, and the current Workspace brand also points to `/workspace/`. User can return to public Home only by manually navigating to `/`.

Required correction: keep `HOME` as Workspace Home if desired, but add an explicit, discoverable public escape (`DEMENTOR CLUB` brand → `/` or `BACK TO CLUB / CLUB HOME`).

### QA-MEM-028 — Board move to Workspace dropped spatial/integration behavior
Status: **OPEN / LIVE P1 FUNCTIONAL REGRESSION** · P1

Live evidence:
- Board now sits correctly inside `/workspace/board/`;
- active Artifact is visible;
- user can no longer move/reposition Board items as before;
- test/activity cards visually collapse/scatter compared with the pre-move Board.

Root cause confirmed by source comparison:
- pre-Batch-03 `/community/board/` loaded `board-qa-fix-v1.css`, `community-v1-responsive-fix.css`, `board-integrations-v1.css/js`, `board-activation-gate-v1.js`, `board-spatial-v1.css/js`, Telegram worker trigger and Board filters;
- new `/workspace/board/` currently loads only Workspace CSS + `board.css` + `board.js` and omits those integration/spatial modules and the filter host.

Required correction: restore the approved Board spatial/integration stack inside Workspace rather than restoring the old standalone page.

### QA-MEM-029 — Join member-return uses stale production destinations
Status: **OPEN / SOURCE-CONFIRMED P1 ROUTE** · P1

`join/dc9-entry-state-v1.js` currently emits:
- `ВОЙТИ В COMMUNITY → /community/board/` (compatibility route instead of canonical `/workspace/board/`);
- `МОЙ АККАУНТ → /account/`, but `/account/` does not exist in the production route manifest.

Required correction: member return must link directly to `/workspace/board/`, `/join/result/`, and `/workspace/`.

### QA-MEM-030 — Join leaves a black visual strip under canonical header
Status: **OPEN / LIVE P2 VISUAL** · P2

Live screenshot shows a black horizontal residue immediately below the canonical header on Join state. Header ownership itself is now canonical; this is a Join page/layout descendant, not a return of multi-header ownership.

Root cause: **TBD during corrective implementation**. Do not solve by changing the global header contract.

### QA-MEM-031 — Join member-return CTA typography/layout is broken
Status: **OPEN / LIVE P2 VISUAL** · P2

Live evidence: `ВОЙТИ В COMMUNITY` and `МОЯ КАРТА DC-9` text/alignment is visually broken.

Source note: `.dc9-button` is used both on buttons and anchors but the base rule does not define a stable inline-flex/flex alignment contract for anchor CTAs. Corrective CSS must preserve the current visual language while making button/anchor geometry identical.

### QA-MEM-032 — Browser smoke still misses critical auth/state/integration paths
Status: **OPEN / P1 RELEASE INTEGRITY** · P1

The Chromium gate correctly prevented prior DOM/CSS regressions but current live defects were outside its assertions:
- Supabase stub returns success without exercising `/auth/callback/` redirect semantics;
- guest smoke checks that Google-login exists but does not assert member navigation is hidden;
- Board smoke stubs `board.js` and checks only shell/host existence, not spatial/integration behavior;
- Join smoke checks shell/footer but not member-return route destinations or CTA geometry.

Required gate additions:
- OAuth callback redirect test;
- guest-nav visibility boundary test;
- Board spatial/integration dependency + interaction smoke;
- Join member-return canonical-route and CTA-layout checks.
