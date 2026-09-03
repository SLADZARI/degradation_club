# Dementor Club — Production Flow QA Ledger

Status: **ACTIVE / MEMBERSHIP V2 CORE PASS / BATCH 04 IMPLEMENTATION MERGED / PRODUCTION RELEASE NOT DEPLOYED**  
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
Status: **LIVE PASS FOR LOGOUT ACTION / LOGIN RECOVERY IMPLEMENTED IN BATCH 04 / LIVE RETEST PENDING** · P1  
User can log out. Reliable Google return is covered by Batch 04 and must be verified on production after manual deployment.

### QA-MEM-006 — Active Member `/join/apply/` copy
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P2

### QA-MEM-007 — Membership application nav contrast
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P1

### QA-MEM-008 — Private Board discoverability
Status: **WORKSPACE SHELL PASS / BOARD RESTORATION IMPLEMENTED IN BATCH 04 / LIVE RETEST PENDING** · P1  
Board remains discoverable inside Workspace; Batch 04 restores the previously approved spatial/integration behavior.

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

Live Batch 03 retest: public navigation now appears visually canonical and consistent across tested pages. `Join` and `Account` descendants are tracked separately.

### QA-MEM-013 — Footer ownership / geometry drift
Status: **BROWSER PASS / LIVE CROSS-PAGE RETEST PARTIAL** · P1

Batch 03 browser gate confirms one canonical footer and no surviving `.dc-utility-strip` on tested public routes including `/join/`. Live screenshot of 404 also shows the canonical footer. Full cross-page visual pass is still pending before closure.

### QA-MEM-014 — Shared Workspace shell incompatible with existing controller
Status: **CORRECTIVE FIX RELEASED / BATCH 04 BROWSER PASS / LIVE RETEST PENDING** · P0

Batch 04 Chromium gate explicitly validates authenticated `MY ACTIVITY` and `MY CLUB` transitions under the shared Workspace controller.

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
Status: **BATCH 04 BROWSER PASS / LIVE RETEST PENDING** · **P0**

Guest and authenticated Workspace are both exercised by Chromium without the previous `sessionBox.innerHTML` crash.

### QA-MEM-021 — Community Board still escapes Workspace
Status: **CLOSED FOR ROUTE/SHELL / FUNCTIONAL DESCENDANT QA-MEM-028** · P1

Canonical member route is `/workspace/board/` and the Board remains a Workspace child surface.

### QA-MEM-022 — Admin shell missing layout dependency
Status: **BATCH 04 BROWSER PASS / LIVE RETEST PENDING** · P1

Admin grid/layout is now part of the browser release gate.

### QA-MEM-023 — Logout has no reliable recovery to login
Status: **BATCH 04 IMPLEMENTATION + BROWSER PASS / LIVE RETEST PENDING** · **P0 ACCESS**

Guest Workspace shows a stable Google-login gate and successful callback is asserted to finish at `/workspace/` with no `/degradation_club/` prefix.

### QA-MEM-024 — Static CI passed while real browser integration was broken
Status: **BATCH 04 COVERAGE EXPANDED / RELEASE GATE PASS** · P1 RELEASE INTEGRITY

Chromium now covers OAuth callback, guest/private boundary, Workspace internal view transitions, spatial Board integrations, Join member-return destinations/geometry and Admin layout.

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
- Workspace My Club / My Activity / My Profile work without runtime errors;
- Board stays inside Workspace shell **and** retains its approved spatial/integration behavior;
- OWNER_ADMIN tools resolve and render with normal Workspace geometry;
- Join member-return CTAs use canonical production routes and stable typography;
- browser-level CI passes on the production candidate and covers OAuth callback + guest boundary + Board integrations + Join;
- 31 indexable sitemap routes resolve live and canonical/OG URLs remain on `https://dementor.club`;
- Membership v2 regression set remains green;
- mobile baseline is checked at 360 / 390 / 768 / 1024 / 1440 where applicable;
- no unresolved P0 or P1 navigation/security/release-integrity issue remains.

## 11. Live production retest — Batch 03 + analytics hotfix

Observed by the user on production after successful GitHub Pages deployment on **2026-09-03**.

### QA-MEM-025 — Google auth succeeds but post-login redirect lands on legacy 404
Status: **BATCH 04 IMPLEMENTATION + BROWSER PASS / LIVE RETEST PENDING** · **P0**

Live Batch 03 defect: successful Google/Supabase auth landed on a legacy `/degradation_club/...` 404, although the session itself persisted.

Batch 04 correction:
- `/auth/callback/` accepts root-canonical `next` routes and defaults to root production routes;
- auth entry points stop emitting legacy `/degradation_club/` callback destinations;
- production HTML normalization no longer rewrites JavaScript inside inline callback code;
- Chromium simulates successful PKCE exchange and asserts final pathname exactly `/workspace/`.

### QA-MEM-026 — Guest Workspace exposes member navigation and logout before authentication
Status: **BATCH 04 IMPLEMENTATION + BROWSER PASS / LIVE RETEST PENDING** · P1

Batch 04 hides the Workspace private sidebar until authenticated identity is resolved. Chromium asserts the guest cannot see private sidebar, member tools or logout while the public header remains available.

### QA-MEM-027 — Workspace has no route back to public Club Home
Status: **PRODUCT DECISION APPROVED / BATCH 04 IMPLEMENTATION PASS / LIVE RETEST PENDING** · P1

Approved decision from user on **2026-09-03**:
- do **not** remove the canonical public header from Workspace;
- `HOME` remains the internal Workspace Home;
- the public header provides the public-site escape, with brand → `/` and the normal public navigation.

No duplicate sidebar `BACK TO CLUB` control is required under this contract.

### QA-MEM-028 — Board move to Workspace dropped spatial/integration behavior
Status: **BATCH 04 IMPLEMENTATION + BROWSER PASS / LIVE RETEST PENDING** · P1

Batch 04 restores the existing production Board modules inside `/workspace/board/` rather than recreating them:
- Board QA/responsive CSS;
- filters;
- integration projections;
- activation gate;
- spatial CSS/JS with pan/zoom and member-card positioning;
- Telegram worker trigger.

Chromium asserts spatial viewport, filters, controls and movable positioned member Artifact behavior.

### QA-MEM-029 — Join member-return uses stale production destinations
Status: **BATCH 04 IMPLEMENTATION + BROWSER PASS / LIVE RETEST PENDING** · P1

Member-return destinations are now canonical:
- Community → `/workspace/board/`;
- DC-9 map → `/join/result/`;
- Account → `/workspace/`.

The dead `/account/` destination is blocked by browser assertions.

### QA-MEM-030 — Join leaves a black visual strip under canonical header
Status: **ROOT CAUSE FIXED IN BATCH 04 / BROWSER PASS / LIVE RETEST PENDING** · P2

Root cause was the authenticated `.dc-account-panel` created by `dementor-account-sync-v8.js`: a second sticky account UI directly under the canonical header.

Batch 04 keeps DC-9 account synchronization active but does not render that duplicate sticky account panel for an already authenticated user. Guest save/login behavior remains available. Chromium now finds no unexplained dark full-width block under the header.

### QA-MEM-031 — Join member-return CTA typography/layout is broken
Status: **BATCH 04 IMPLEMENTATION + BROWSER PASS / LIVE RETEST PENDING** · P2

Join member-return anchor/button geometry is normalized and the browser gate verifies stable flex layout and minimum target height.

### QA-MEM-032 — Browser smoke still misses critical auth/state/integration paths
Status: **BATCH 04 RELEASE-GATE PASS / KEEP AS PERMANENT COVERAGE** · P1 RELEASE INTEGRITY

Run #704 PASS now exercises:
- OAuth callback final redirect;
- guest member-navigation boundary;
- canonical public header above Workspace;
- authenticated Workspace `MY ACTIVITY` / `MY CLUB` transitions;
- spatial Board integrations and movable own Artifact;
- Join canonical member-return routes, CTA geometry and dark-strip regression;
- Owner Admin Workspace geometry;
- production route manifest;
- final production artifact release guard.

## 12. Corrective Batch 04 implementation state

Implementation PR:
**#91 — QA Batch 04: auth boundary, Workspace header, Board restoration, Join routes**.

Final candidate head:
`f52bde7a978df8fe97a002257bc7a0dfb4ea8f33`

Release Readiness run:
**#704 / run `33773784154` — PASS**.

The run passed all current gates:
- registry/routes/feature state;
- content readiness;
- visual contract;
- production build;
- production analytics + consent;
- canonical shell contract;
- built-JS syntax (`85 files`);
- Chromium browser shell/recovery suite;
- route manifest (`31 indexable · 16 private/compat · 1 disabled`);
- production artifact release guard.

One final static blocker discovered by the release guard was also removed before the green run: `design-system/admin/tests/index.html` still contained legacy `/degradation_club/` base-path logic. System Tests now use root production routes only.

PR #91 merged to `dementor-club-site` as:
`6afb2fa4e81ec0a8b65aa01d6146f70194a518b9`.

**Production state:** Batch 04 is **not deployed** and none of QA-MEM-025…031 is closed yet. Next release step is to prepare and validate a production PR, then wait for explicit manual deployment authorization before any deploy.