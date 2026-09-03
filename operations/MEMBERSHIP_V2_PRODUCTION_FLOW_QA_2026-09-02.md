# Dementor Club — Production Flow QA Ledger

Status: **ACTIVE / MEMBERSHIP V2 CORE PASS / SITE SHELL & ROUTE INTEGRITY PASS IN PROGRESS**  
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

### QA-MEM-012 — Global Header can render twice on pages that load `site-config.js` in `<head>`

Status: **FIX STAGED IN `dementor-club-site` / PRODUCTION RETEST PENDING**  
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

- `global-header.js` now boots after DOM readiness when needed;
- it normalizes the existing `.topbar` rather than racing the HTML parser;
- defensive cleanup removes additional duplicate `header.topbar` nodes.

Staging commit: `b8e72784beda8c62fe3e8be1aacb5020f5de2898`.

Required regression matrix:

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

Status: **OPEN / CONTRACT REQUIRED BEFORE IMPLEMENTATION**  
Severity: **P2 / GLOBAL SHELL CONSISTENCY**

Verified examples:

- Home footer uses its own slogan and `HOME SYSTEM v2.4` marker;
- About footer uses a different slogan and `ABOUT SYSTEM v10` marker.

Current architecture has a Global Header contract but no discovered equivalent Global Footer contract.

Required decision:

- define one global footer shell owned by Club;
- decide which fields are global and which page-specific metadata may remain local;
- do not silently delete page/version provenance until the contract is fixed.

Implementation must be shared/runtime-owned rather than copied into every page.

---

### QA-MEM-014 — Workspace sidebar is copied per page and drifts between routes

Status: **OPEN / ROOT CAUSE CONFIRMED / FIX DESIGN IN PROGRESS**  
Severity: **P1 / AUTHENTICATED INFORMATION ARCHITECTURE**

Observed:

- Home sidebar contains the fuller set of Workspace actions and role-aware additions;
- `/workspace/artifacts/` hardcodes a smaller menu;
- `/workspace/review/` hardcodes another variant;
- changing section therefore changes the left navigation itself.

Root cause:

Workspace pages own separate HTML copies of `.dcw-sidebar/.dcw-nav` instead of a single shell/navigation renderer.

Canonical target:

`HOME / MY CLUB / COMMUNITY BOARD / MY ARTIFACTS / MY ACTIVITY / MY WORK when applicable / MY PROFILE / role-specific tools / LOG OUT`

Required fix:

- one Workspace shell/navigation source;
- current section changes active state only;
- role visibility is derived from authoritative roles/assignments;
- logout exists consistently;
- child routes own content, not navigation structure.

---

### QA-MEM-015 — OWNER_ADMIN `SYSTEM TOOLS` links to a route stripped from production

Status: **OPEN / ROOT CAUSE CONFIRMED**  
Severity: **P1 / ADMIN TOOLING + BROKEN INTERNAL ROUTE**

Observed: admin System Tools / design panel returns branded 404.

Root cause verified:

- `workspace-owner-admin-tools-v1.js` creates a card with `href='/design-system/admin/'` for `owner_admin`;
- source contains `design-system/admin/index.html` and related diagnostics;
- production builder intentionally excludes the entire top-level `design-system` directory except approved CSS runtime dependencies;
- production release guard likewise treats internal design-system pages as forbidden production material.

Therefore this is not a missing file accident. Production UI and production packaging disagree by design.

Required product/architecture decision:

A. keep design-system source-only and stop exposing `SYSTEM TOOLS` in production; or

B. promote a **selected authenticated/noindex owner-admin tool surface** into an approved Workspace route (for example `/workspace/admin/`) with explicit readiness, RLS/role gate and only the dependencies actually needed.

Do **not** publish the entire design-system tree merely to make the link work.

SEO note: this route is internal/noindex; the primary damage is broken admin UX, not search indexing.

---

### QA-MEM-016 — Production release validator misses JS-generated internal routes

Status: **OPEN / ROOT CAUSE CONFIRMED / RELEASE-GATE GAP**  
Severity: **P1 / ROUTE INTEGRITY + SEO SAFETY**

Current production validator correctly checks:

- HTML `href/src/poster/srcset`;
- CSS imports/URLs;
- JS file-like asset references.

But it does not validate route-like navigation created in JavaScript, including patterns such as:

- `element.href = '/route/'`;
- `location.assign('/route/')`;
- `location.replace('/route/')`;
- `location.href = '/route/'`.

That is why `/design-system/admin/` could be generated dynamically while absent from the production artifact and still pass Production Candidate Integrity.

Required fix:

- extend release validation to root-relative JS navigation routes;
- resolve them against the production artifact / explicit route registry;
- allow intentional external/dynamic URLs only through an explicit allowlist;
- keep private/noindex routes separate from sitemap logic.

This is the main automated guard required for the user's requested full 404 pass.

## 6. Route / SEO audit model

Routes must be classified before deciding whether absence is a bug:

- `PUBLIC_INDEXABLE` — public page; must resolve and may belong in sitemap;
- `PUBLIC_NOINDEX` — public utility/auth flow; must resolve but should not be indexed;
- `PRIVATE_AUTH` — authenticated route; must resolve for authorized user and remain noindex;
- `INTERNAL_SOURCE_ONLY` — must not be emitted or linked from production;
- `DISABLED_RESERVED` — source may exist, but production navigation must not expose it while disabled.

Current confirmed examples:

- `/community/board/` → private/authenticated and noindex;
- `/workspace/*` → private/authenticated and noindex;
- `/design-system/*` → currently internal source-only;
- `/cart/` → currently disabled/reserved because production commerce is off.

The sitemap itself contains public routes only; Workspace/admin routes should not be added merely to eliminate 404s.

## 7. Current route integrity facts

Production release tooling already statically validates shipped HTML references and blocks missing static targets. This is useful but incomplete because of `QA-MEM-016`.

Current sitemap remains the public SEO registry candidate and must be checked against:

1. actual shipped public routes;
2. approved readiness state;
3. canonical metadata;
4. internal links;
5. JS-generated routes;
6. removed/renamed historical URLs that may need redirects rather than 404.

No claim of a complete live-HTTP 404 crawl is made yet. The current environment could not directly resolve `dementor.club` from the container, so route integrity is being audited from the production artifact/contracts and will require live smoke retest after the staged fixes.

## 8. Batch 01 release state

Fix Batch 01 was promoted to `dementor-club-production`; Production Candidate Integrity passed for production head `1ed25952cc5a05174a8c1e78cd722b5c5921f7b6` (`Merge PR #83: Membership v2 QA Fix Batch 01`).

Membership v2 core behavior remains PASS. Findings from Batch 01 stay in this ledger until their production regression checks are explicitly completed.

## 9. Batch 02 implementation order

1. **Global Header race / duplicate shell** — staged first (`QA-MEM-012`).
2. **Workspace sidebar single-source architecture** — stage next (`QA-MEM-014`).
3. **Owner Admin route decision + implementation** — resolve without leaking full design-system (`QA-MEM-015`).
4. **JS-generated route validation** — extend production gate (`QA-MEM-016`).
5. **Global Footer contract** — define then stage shared runtime (`QA-MEM-013`).
6. Run production artifact route inventory and compare with sitemap/readiness.
7. Only after explicit deploy instruction: selective promotion → integrity gate → production deploy → live regression crawl.

## 10. Exit criteria before advertising

QA is green only when:

- one global public header is rendered per page;
- footer contract is consistent across public page families;
- Workspace sidebar does not mutate structurally between child pages;
- no production UI points to an intentionally stripped internal route;
- every exposed internal route is covered by static or JS route validation;
- public sitemap routes resolve and match approved page readiness;
- disabled/reserved features are not exposed as working links;
- canonical/OG URLs remain on `https://dementor.club`;
- Membership v2 regression set remains green;
- mobile baseline is checked at 360 / 390 / 768 / 1024 / 1440 where applicable;
- no P0 or unresolved P1 navigation/security/release-integrity issue remains.
