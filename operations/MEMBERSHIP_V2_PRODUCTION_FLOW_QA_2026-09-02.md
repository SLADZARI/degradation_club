# Dementor Club — Production Flow QA Ledger

Status: **ACTIVE / MEMBERSHIP V2 CORE PASS / QA BATCH 02 STAGED / PRODUCTION RETEST PENDING**  
Date opened: **2026-09-02**  
Environment: **PRODUCTION / https://dementor.club**  
Source of truth: `dementor-club`  
Implementation branch: `dementor-club-site`  
Production branch: `dementor-club-production`

## 0. Purpose

This is the **single live QA ledger** for Membership v2 and adjacent production surfaces encountered during the pre-advertising QA pass.

All findings stay here. A finding is closed only after:

1. root cause is identified;
2. implementation is staged in `dementor-club-site`;
3. the release passes production gates;
4. the fix is deployed only after explicit human deploy approval;
5. the behavior is retested on `https://dementor.club`.

Deployment remains manual. QA work must not deploy by itself.

## 1. Canonical Membership v2 flow

`AUTHENTICATED → DC9 9/9 → APPLICATION_AVAILABLE → APPLICATION_SUBMITTED → UNDER_REVIEW → 2 independent APPROVE → MEMBER_ACTIVE → COMMUNITY / POST-ADMISSION`

Boundary:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

Controlled QA account:

- `sharecraftwideo@gmail.com`;
- display identity observed: `Sled ZARI`;
- DC-9: `9/9`;
- historical artifacts / grants preserved.

Production reviewers:

- Евгений Казаков — active `dementor` + `owner_admin`;
- Nikita Lobushkin — active `dementor` + `owner_admin`.

Threshold: **2 independent APPROVE decisions**.

## 2. Severity model

- **P0 / BLOCKER** — breaks canonical flow, access, security or authoritative state.
- **P1 / MAJOR** — flow works technically but navigation, state, shell, privacy or release integrity can materially fail.
- **P2 / MINOR** — ambiguity/usability issue without authoritative state corruption.
- **P3 / POLISH** — refinement only.

## 3. Membership / account findings

### QA-MEM-001 — Legacy `/join/member/` remains in Membership v2 journey

Status: **FIX RELEASED / PRODUCTION RETEST TO KEEP IN REGRESSION SET**  
Severity: **P0 / BLOCKER**

Observed legacy surface duplicated identity/contact/legal and depended on disabled `dc_activate_membership_v1`.

Fix:

- `/join/member/` becomes compatibility routing to `/join/apply/`;
- no legacy auto-activation runtime;
- Membership v2 remains the admission authority.

---

### QA-MEM-002 — Reviewer decision was not visually final

Status: **FIX RELEASED / REGRESSION RETEST REQUIRED**  
Severity: **P1 / MAJOR**

Server behavior was correct: one review row per `(application, reviewer)`.

Fix behavior expected:

- own decision becomes visibly final;
- normal decision controls stop looking repeatable;
- approval progress shows `N / 2 DEMENTORS`.

---

### QA-MEM-003 — `ACCOUNT → CART` exposed a production 404

Status: **FIX RELEASED / REGRESSION RETEST REQUIRED**  
Severity: **P1 / MAJOR NAVIGATION**

Root cause:

- `cart/index.html` exists in source;
- production builder intentionally excludes top-level `cart`;
- production hardening sets `cartEnabled:false` and `checkoutEnabled:false`.

Correct behavior: do not publish Cart while commerce is disabled; do not expose the navigation action.

---

### QA-MEM-004 — Historical completed course is not distinguished from a repeat pass

Status: **OPEN / PRODUCT-STATE CLARIFICATION REQUIRED**  
Severity: **P2 / STATE AMBIGUITY**

Observed:

- Workspace shows `Думай с опасностью` as `completed`;
- course can simultaneously continue a new Day 2 repeat;
- completion certificate remains visible.

Database fact:

- historical completion and certificate are from **2026-08-28**;
- current Day 2 did not newly create that completion.

Required:

- identify repeat-attempt storage/model;
- preserve historical certificate;
- present previous completion and current repeat as separate states.

---

### QA-MEM-005 — Logout was not discoverable

Status: **FIX RELEASED / REGRESSION RETEST REQUIRED**  
Severity: **P1 / ACCOUNT UX + SESSION CONTROL**

Expected after fix:

- explicit `LOG OUT` in Workspace;
- Supabase session ends;
- protected surfaces do not retain authenticated data;
- switching account does not inherit stale role/member UI.

---

### QA-MEM-006 — Active Member application route used pre-admission hero copy

Status: **FIX RELEASED / REGRESSION RETEST REQUIRED**  
Severity: **P2 / COPY + STATE PRESENTATION**

Expected active state: Membership route reflects active membership and directs the user into Workspace instead of explaining how to apply.

---

### QA-MEM-007 — Membership application top navigation had low contrast

Status: **FIX RELEASED / REGRESSION RETEST REQUIRED**  
Severity: **P1 / NAVIGATION + ACCESSIBILITY**

Expected: readable global navigation on `/join/apply/` on desktop and mobile.

---

### QA-MEM-008 — Private Community Board was not discoverable from Workspace

Status: **FIX RELEASED / ACCESS PASS / DISCOVERABILITY REGRESSION RETEST REQUIRED**  
Severity: **P1 / INFORMATION ARCHITECTURE**

Access fact: accepted Member can open `/community/board/`.

Expected Workspace architecture exposes `COMMUNITY BOARD` inside authenticated navigation.

---

### QA-MEM-009 — Membership Review opened outside Workspace shell

Status: **FIX RELEASED / REGRESSION RETEST REQUIRED**  
Severity: **P1 / ROLE WORKFLOW**

Security test already passed: ordinary Member did not receive reviewer data.

Expected after fix:

- Review stays inside Workspace context;
- non-Dementor direct access does not expose review surface/data.

---

### QA-MEM-010 — Archived Artifacts existed in data but were not discoverable

Status: **FIX RELEASED / REGRESSION RETEST REQUIRED**  
Severity: **P1 / MEMBER HISTORY**

Known QA account records:

- `Куда двигаемся - народ?` — active;
- `гусь` — archived, closed 2026-08-30.

Expected:

- `/workspace/artifacts/` exposes own Active + Archive history;
- archived record never returns to live Board.

---

### QA-MEM-011 — Membership application mobile composition was oversized

Status: **FIX RELEASED / MOBILE REGRESSION RETEST REQUIRED**  
Severity: **P1 / RESPONSIVE UX**

Expected: compact mobile hero, spacing, fields and controls without desktop-scale scrolling overhead.

## 4. Membership v2 confirmed PASS

Core contract verified on production:

- application submitted after server-side 9/9;
- Евгений approved independently;
- first approval did not activate membership;
- Nikita approved independently;
- threshold reached at exactly 2 approvals;
- application → `accepted`;
- membership → `active`;
- source → `membership-review-v2`;
- accepted Member could not submit repeat application;
- accepted application disappeared from active review queue;
- accepted Member gained private Board access;
- ordinary Member could not read reviewer queue/data;
- Membership v2 did not duplicate initial Artifact grant.

Initial Artifact grant remains exactly one record with `grant_key = initial-membership-v1`.

## 5. QA Batch 02 — Site Shell & Route Integrity

Opened after live screenshots on **2026-09-03**.

Goal: remove shell drift and broken internal navigation before advertising the club.

Implementation status:

- implementation PR: **#86 — QA Batch 02: site shell and route integrity**;
- merged to `dementor-club-site`: `c4ed4a6a1f7a197e31d6a7563d9e27318fb82006`;
- Site Integrity / Release Readiness run **#671**: **PASS**;
- route manifest gate: **31 indexable / 15 private+compat / 1 disabled** — PASS;
- production has **not** been changed or deployed by this batch yet.

### QA-MEM-012 — Global Header can render twice on pages that load `site-config.js` in `<head>`

Status: **FIX STAGED / CI PASS / PRODUCTION RETEST PENDING**  
Severity: **P1 / GLOBAL NAVIGATION + SHELL**

Observed live on `/community/board/`:

- two public-looking headers appear one below another;
- both contain Dementor Club navigation.

Canonical conflict:

`docs/GLOBAL_HEADER_v1.md` requires one global header and forbids page-specific duplicated primary navigation.

Root cause verified:

- `/community/board/index.html` loads `/site-config.js` from `<head>` and also contains a static `<header class="topbar">` later in `<body>`;
- `site-config.js` dynamically loads `/global-header.js` immediately;
- `global-header.js` can execute before the parser reaches the static body header;
- when no `.topbar` exists yet, runtime inserts a new header at the start of body;
- the parser then continues and creates the page's original header, leaving two headers.

Staged fix:

- `global-header.js` boots after DOM readiness when needed;
- it normalizes the existing `.topbar` rather than racing the HTML parser;
- defensive cleanup removes additional duplicate `header.topbar` nodes.

Initial staging commit: `b8e72784beda8c62fe3e8be1aacb5020f5de2898`.

Required production regression matrix:

- `/`;
- `/about/`;
- `/events/`;
- `/projects/`;
- `/community/`;
- `/community/board/`;
- `/merch/`;
- `/join/`;
- courses;
- profile/workspace entry.

Each public surface must expose exactly one global navigation header.

---

### QA-MEM-013 — Footer is page-owned and visually/content-wise drifts across the site

Status: **FIX STAGED / CI PASS / PRODUCTION RETEST PENDING**  
Severity: **P2 / GLOBAL SHELL CONSISTENCY**

Verified examples:

- Home footer uses its own slogan and `HOME SYSTEM v2.4` marker;
- About footer uses a different slogan and `ABOUT SYSTEM v10` marker.

Root cause: public pages own independent footer markup; no shared footer runtime existed.

Staged contract/fix:

- one `global-footer.js` + `global-footer.css` owns the public footer shell;
- public navigation/legal/support structure is consistent;
- an existing page-local footer note/version may survive as page provenance instead of being silently deleted;
- private/authenticated product surfaces (`/workspace/*`, Board, Artifact, Membership Application/Result, auth callback/profile redirect) do not receive the public footer.

Required production retest: compare Home / About / Events / Projects / Community / Merch / Join / courses and verify one consistent footer shell without losing intentional page provenance.

---

### QA-MEM-014 — Workspace sidebar is copied per page and drifts between routes

Status: **FIX STAGED / CI PASS / PRODUCTION RETEST PENDING**  
Severity: **P1 / AUTHENTICATED INFORMATION ARCHITECTURE**

Observed:

- Home sidebar contained the fuller set of Workspace actions and role-aware additions;
- `/workspace/artifacts/` hardcoded a smaller menu;
- `/workspace/review/` hardcoded another variant;
- changing section therefore changed the left navigation itself.

Root cause:

Workspace pages owned separate HTML copies of `.dcw-sidebar/.dcw-nav` instead of a single shell/navigation renderer.

Staged fix:

- one `workspace/workspace-shell-v1.js` is the navigation owner;
- root Workspace, My Artifacts, Membership Review and Owner Admin use the same sidebar host;
- current section changes active state only;
- role visibility is derived from Supabase roles/assignments;
- `MY WORK`, `MEMBERSHIP REVIEW`, `SYSTEM TOOLS` appear only when applicable;
- `LOG OUT` is consistent;
- root Workspace subviews use stable hash routes rather than copied child navigation.

Canonical target:

`HOME / MY CLUB / COMMUNITY BOARD / MY ARTIFACTS / MY ACTIVITY / MY WORK when applicable / MY PROFILE / role-specific tools / LOG OUT`

---

### QA-MEM-015 — OWNER_ADMIN `SYSTEM TOOLS` links to a route stripped from production

Status: **FIX STAGED / CI PASS / PRODUCTION RETEST PENDING**  
Severity: **P1 / ADMIN TOOLING + BROKEN INTERNAL ROUTE**

Observed: admin System Tools / design panel returned branded 404.

Root cause verified:

- old runtime linked to `/design-system/admin/`;
- source contained `design-system/admin/index.html` and diagnostics;
- production builder intentionally stripped the top-level `design-system` tree.

Staged architecture:

- entire `design-system` remains source-only;
- production admin entry becomes `/workspace/admin/`;
- route is `OWNER_ADMIN` + `noindex`;
- only explicitly approved tools are projected during production build into `/workspace/admin/...`;
- current projected tools: UI Lab, system tests, auth diagnostics and sync diagnostics;
- direct non-owner access returns to Workspace / owner-gated surface;
- no reason to publish the complete source design-system tree.

SEO note: this is a private/noindex route; primary purpose is internal owner tooling.

---

### QA-MEM-016 — Production release validator misses JS-generated internal routes

Status: **FIX STAGED / CI PASS / PRODUCTION RETEST PENDING**  
Severity: **P1 / ROUTE INTEGRITY + SEO SAFETY**

Old validator correctly checked static HTML/CSS/file-like references but did not reliably validate route navigation created in JavaScript.

This allowed `/design-system/admin/` to be generated dynamically while absent from the production artifact.

Staged fix:

- production validator now checks real JS navigation assignments (`location.assign`, `location.replace`, `location.href`, `.href` and simple variable-to-navigation flows);
- route namespaces/feature literals are not falsely treated as navigations;
- a new `production-route-manifest.json` explicitly classifies indexable, private/noindex, compatibility, disabled and source-only surfaces;
- CI runs `validate-route-manifest.mjs` after production build;
- manual production deploy workflow runs the same manifest gate before release;
- disabled cart runtime and its production loader are removed from the built artifact while commerce is off.

Gate evidence from PR #86:

- source validation PASS;
- readiness PASS;
- visual contract PASS;
- production build PASS;
- route manifest PASS;
- final production release validator PASS.

---

### QA-MEM-017 — Sitemap contained a disabled 404 route and a noindex compatibility route

Status: **FIX STAGED / CI PASS / PRODUCTION RETEST PENDING**  
Severity: **P1 / SEO + ROUTE INTEGRITY**

Confirmed audit finding:

- sitemap contained `/cart/`, while production intentionally does not publish Cart;
- sitemap contained `/profile/`, which is a `noindex` compatibility redirect into Workspace;
- sitemap simultaneously omitted several current approved/indexable surfaces, including newer Logic & Awareness dossier routes, Object 001 / merch surface and newer course/project routes.

This proves the previous static link gate was not sufficient as an SEO route registry.

Staged fix:

- sitemap reconciled to **31 public indexable routes**;
- `/cart/` removed;
- `/profile/` removed;
- private auth/Workspace routes remain absent;
- all sitemap URLs must exist in the built artifact and must not be `noindex`;
- route manifest is now the explicit indexing contract;
- CI blocks sitemap URLs that resolve to no page, private/noindex routes in sitemap, disabled routes being published, or indexable routes missing from sitemap.

Production retest should include live HTTP checks of sitemap URLs after deployment and Search Console follow-up if historical 404s were already crawled.

## 6. Route / SEO audit model

Routes are now classified before deciding whether absence is a bug:

- `PUBLIC_INDEXABLE` — public page; must resolve and be represented by the indexable route contract;
- `PUBLIC_NOINDEX` — utility/auth flow; must resolve but should not be indexed;
- `PRIVATE_AUTH` — authenticated route; must resolve for authorized user and remain noindex;
- `INTERNAL_SOURCE_ONLY` — must not be emitted as a public route or linked from production navigation;
- `DISABLED_RESERVED` — source may exist, but production navigation/runtime/sitemap must not expose it while disabled.

Current examples:

- `/community/board/` → private/authenticated and noindex;
- `/workspace/*` → private/authenticated and noindex;
- `/workspace/admin/*` → selected private OWNER_ADMIN/noindex production projections;
- `/design-system/*` → source-only route namespace;
- `/cart/` → disabled/reserved because production commerce is off.

The sitemap remains public/indexable only; private Workspace/admin routes are deliberately excluded.

## 7. Current route integrity facts

Batch 02 introduces a manifest-driven production route gate.

Implementation candidate evidence:

- sitemap: **31 indexable URLs**;
- private + compatibility routes: **15**;
- disabled routes: **1 (`/cart/`)**;
- sitemap and production artifact cross-check: PASS in PR #86 CI;
- static + JS navigation release gate: PASS in PR #86 CI.

This is still **staged evidence**, not a live production crawl. Production deployment and live HTTP regression are required before closing QA-MEM-012..017.

## 8. Batch 01 release state

Fix Batch 01 was promoted to `dementor-club-production`; Production Candidate Integrity passed for production head `1ed25952cc5a05174a8c1e78cd722b5c5921f7b6` (`Merge PR #83: Membership v2 QA Fix Batch 01`).

Membership v2 core behavior remains PASS. Findings from Batch 01 stay in this ledger until their production regression checks are explicitly completed.

## 9. Batch 02 implementation state

Completed in `dementor-club-site`:

1. Global Header race/duplicate protection.
2. Shared Workspace shell and stable role-aware sidebar.
3. Owner Admin moved to `/workspace/admin/` with selective production projections.
4. Global Footer runtime and styling.
5. Production route manifest.
6. JS navigation-aware release validation.
7. Sitemap/indexability reconciliation.
8. Disabled cart runtime removed from production artifact while commerce is off.
9. CI/release workflows enforce the route manifest.

Implementation merge: `c4ed4a6a1f7a197e31d6a7563d9e27318fb82006`.

Next release step:

- create a clean selective release branch from the **current `dementor-club-production`**;
- promote only Batch 02 files without overwriting current production-only readiness/content changes;
- run full production candidate gates;
- inspect diff;
- do not deploy until explicit human instruction.

## 10. Exit criteria before advertising

QA is green only when:

- one global public header is rendered per page;
- footer contract is consistent across public page families;
- Workspace sidebar does not mutate structurally between child pages;
- no production UI points to an intentionally stripped internal route;
- every exposed internal route is covered by static or JS route validation;
- public sitemap routes resolve and match approved page readiness/indexability;
- disabled/reserved features are not exposed as working links or dormant production runtime;
- canonical/OG URLs remain on `https://dementor.club`;
- Membership v2 regression set remains green;
- mobile baseline is checked at 360 / 390 / 768 / 1024 / 1440 where applicable;
- no P0 or unresolved P1 navigation/security/release-integrity issue remains.