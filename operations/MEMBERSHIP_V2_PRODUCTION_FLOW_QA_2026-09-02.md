# Dementor Club — Production Flow QA Ledger

Status: **ACTIVE / MEMBERSHIP V2 CORE PASS / QA BATCH 02 LIVE REGRESSIONS / CORRECTIVE BATCH 03 IN CI**  
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
Status: **FIX RELEASED / REGRESSION SET** · P0  
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
Status: **FIX RELEASED / REGRESSION LINKED TO QA-MEM-023** · P1

### QA-MEM-006 — Active Member `/join/apply/` copy
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P2

### QA-MEM-007 — Membership application nav contrast
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P1

### QA-MEM-008 — Private Board discoverability
Status: **REOPENED THROUGH QA-MEM-021** · P1  
Direct Board access worked, but live Batch 02 still left Board outside Workspace.

### QA-MEM-009 — Membership Review outside Workspace shell
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P1  
Ordinary Member negative access test previously PASS.

### QA-MEM-010 — Archived Artifact history unavailable
Status: **FIX RELEASED / REGRESSION RETEST REQUIRED** · P1  
Known QA records: active `Куда двигаемся - народ?`; archived `гусь`.

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

The live pass proved that static/build gates were insufficient for DOM/CSS/runtime integration. Batch 02 therefore remains **NOT CLOSED**.

### QA-MEM-012 — Global Header ownership drift
Status: **LIVE REGRESSION / CORRECTIVE BATCH 03** · P1

Live evidence:
- `/join/` displayed the Batch 02 runtime header;
- Projects / Community / Merch / Archive retained visually different page-owned headers;
- user requires the classic canonical Home header on all public pages.

Root cause:
- page HTML still owned local `.topbar` markup;
- `global-header.js` attempted runtime normalization;
- Batch 02 runtime introduced a third navigation contract (dropdowns / Blog / Account) rather than enforcing the Home contract.

Corrective target:
- one canonical public header owner;
- Home visual/navigation language;
- direct `Club / Events / Projects / Community / Merch / Archive / Join` plus stable Account entry;
- no page-owned primary headers or dropdown variants in production artifact;
- local product bars may exist only as secondary state bars without duplicated club navigation/logo.

### QA-MEM-013 — Footer ownership / geometry drift
Status: **LIVE REGRESSION / CORRECTIVE BATCH 03** · P1

Live evidence: `/join/` showed conflicting footer/utility structures.

Root cause:
- Batch 02 reused legacy `<footer>` element;
- old `footer{...}` CSS continued to impose flex/max-width/padding geometry;
- `UTILITY / PUBLIC` runtime duplicated Support/Contacts/Privacy/Terms already present in the new footer.

Corrective target: one fresh canonical footer; old page footer and utility strip do not survive production shell ownership.

### QA-MEM-014 — Shared Workspace shell incompatible with existing controller
Status: **LIVE BLOCKER / CORRECTIVE BATCH 03** · P0

Live error on Sharecraft account when opening `MY ACTIVITY` / `MY CLUB`:

`Cannot set properties of null (setting 'innerHTML')`

Root cause:
- `workspace.js` still requires `#sessionBox` and `[data-work-nav]`;
- Batch 02 shared shell removed those controller contract nodes.

Corrective target:
- one Workspace shell;
- controller compatibility restored or controller refactored atomically;
- My Club / My Activity / Profile / Work render without null-DOM runtime errors.

### QA-MEM-015 — OWNER_ADMIN route exists but layout is broken
Status: **PARTIAL PASS / CORRECTIVE BATCH 03** · P1

Live evidence: `/workspace/admin/` is no longer 404 and role access works, but layout is largely unstyled.

Root cause: admin page omitted canonical `design-system/dementor-workspace/workspace.css` layout layer.

### QA-MEM-016 — JS-generated route validator
Status: **IMPLEMENTATION PASS / KEEP IN RELEASE GATES** · P1

The manifest/static/JS route hardening itself remains useful and caught real residual routes during Batch 02 preparation. It does not replace browser integration QA.

### QA-MEM-017 — Sitemap/indexability reconciliation
Status: **STATIC PASS / LIVE HTTP RETEST PENDING** · P1

Contract remains 31 public indexable routes; `/cart/` and `/profile/` are excluded from sitemap. Live HTTP/canonical verification remains required after the corrective release.

## 6. New live regression findings from Batch 02 deployment

### QA-MEM-018 — Public shell has multiple effective header contracts
Status: **OPEN / FIX STAGED IN PR #88** · P1

This is the browser-level descendant of QA-MEM-012. A production page must not decide its own primary club header.

### QA-MEM-019 — Public footer duplicates utility/navigation ownership
Status: **OPEN / FIX STAGED IN PR #88** · P1

This is the browser-level descendant of QA-MEM-013. Canonical footer must own both footer navigation and utility/legal links.

### QA-MEM-020 — Workspace null-DOM crash
Status: **OPEN / FIX STAGED IN PR #88** · **P0**

Sharecraft live browser reproduced the exact `sessionBox.innerHTML` null crash. A second latent failure existed for `workNav.hidden`.

Corrective implementation restores `id="sessionBox"` and `data-work-nav` in the shared shell and adds authenticated browser navigation smoke for `MY ACTIVITY` + `MY CLUB`.

### QA-MEM-021 — Community Board still escapes Workspace
Status: **OPEN / FIX STAGED IN PR #88** · P1

Batch 02 navigation explicitly sent `COMMUNITY BOARD → /community/board/`, so the separate dark page was expected from the code.

Corrective target:
- canonical member route `/workspace/board/`;
- Board content uses shared Workspace sidebar;
- legacy `/community/board/` becomes a noindex compatibility resolver into Workspace.

### QA-MEM-022 — Admin shell missing layout dependency
Status: **OPEN / FIX STAGED IN PR #88** · P1

Corrective implementation adds the missing canonical Workspace layout stylesheet and browser-computed grid check.

### QA-MEM-023 — Logout has no reliable recovery to login
Status: **OPEN / FIX STAGED IN PR #88** · **P0 ACCESS**

Live sequence: user logged out and could not find/recover a working authorization path.

Root cause chain:
- inconsistent public headers did not guarantee an Account entry;
- `/profile/` is only compatibility redirect to Workspace;
- Workspace should render `ВОЙТИ ЧЕРЕЗ GOOGLE`, but crashed before that UI because `#sessionBox` was missing.

Corrective target:
- canonical public header always exposes `Account → /workspace/`;
- unauthenticated Workspace always reaches Google-login gate without runtime error.

### QA-MEM-024 — Static CI passed while real browser integration was broken
Status: **OPEN / BROWSER GATE ADDED IN PR #88** · P1 RELEASE INTEGRITY

Batch 02 release gates validated routes/build/readiness but did not execute the assembled DOM/CSS/runtime in a browser.

Corrective gate:
- Chromium/Playwright opens built public route families;
- checks exactly one canonical header/footer and absence of legacy shell;
- checks computed footer geometry;
- checks guest Workspace login recovery;
- checks authenticated `MY ACTIVITY` and `MY CLUB` rendering;
- checks Board remains in Workspace route;
- checks Admin computed grid layout.

A corrective release cannot be called green until this browser gate passes.

## 7. Corrective Batch 03 implementation state

Implementation branch:
`fix/qa-batch-03-canonical-shell-auth-recovery`

Implementation PR:
**#88 — QA Batch 03: canonical shell and auth recovery**

Staged scope:
1. canonical public header becomes sole primary-header owner;
2. production builder strips page-owned legacy `.topbar` markup;
3. canonical footer replaces page footer + utility-strip ownership;
4. Workspace shell restores controller DOM contract;
5. Board moves to `/workspace/board/`;
6. `/community/board/` becomes compatibility redirect;
7. Admin loads complete Workspace layout CSS;
8. route manifest reflects Board move;
9. static shell contract added;
10. real Chromium browser integration smoke added to CI and manual deploy gate.

Current state: **PR #88 open / CI in progress**. No production merge. No deploy.

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
One sidebar owner:
`HOME / MY CLUB / COMMUNITY BOARD / MY ARTIFACTS / MY ACTIVITY / MY WORK when applicable / MY PROFILE / role tools / LOG OUT`.

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
- `/design-system/*` → source-only;
- `/cart/` → disabled/reserved.

## 10. Exit criteria before advertising

QA is green only when:

- live public pages show the same canonical header;
- no page-owned competing primary header remains;
- one consistent footer exists and no duplicate utility strip remains;
- Workspace My Club / My Activity / My Profile work without runtime errors;
- Board stays inside Workspace shell;
- OWNER_ADMIN tools resolve and render with normal Workspace geometry;
- logout → Account → Google login recovery works;
- browser-level CI passes on the production candidate;
- 31 indexable sitemap routes resolve live and canonical/OG URLs remain on `https://dementor.club`;
- Membership v2 regression set remains green;
- mobile baseline is checked at 360 / 390 / 768 / 1024 / 1440 where applicable;
- no unresolved P0 or P1 navigation/security/release-integrity issue remains.
