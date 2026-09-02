# Dementor Club — Membership v2 Production Flow QA

Status: **DISCOVERY PASS COMPLETE / FIX BATCH 01 STAGED / PRODUCTION RETEST PENDING**  
Date opened: **2026-09-02**  
Environment tested: **PRODUCTION / https://dementor.club**  
Source of truth: `dementor-club`  
Implementation branch: `dementor-club-site`  
Production branch: `dementor-club-production`

## 0. Purpose

This is the single live QA ledger for Membership v2 and the immediately connected authenticated surfaces encountered during the production pass.

For every finding we distinguish:

- observed production behavior;
- authoritative data behavior;
- severity;
- staged implementation fix;
- production retest status.

Admission authority remains `community/MEMBERSHIP_AND_DEMENTOR_REVIEW_V2.md`. DC-9 authority remains `operations/ONBOARDING_SYSTEM.md`.

Production deployment remains manual and requires explicit human approval.

## 1. Canonical flow verified

`AUTHENTICATED → DC9 9/9 → APPLICATION_AVAILABLE → APPLICATION_SUBMITTED → UNDER_REVIEW → 2 independent APPROVE → MEMBER_ACTIVE → COMMUNITY / POST-ADMISSION`

Boundary:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

Controlled QA account:

- `sharecraftwideo@gmail.com`
- display identity observed: `Sled ZARI`
- DC-9: `9/9`
- historical artifacts / grants preserved.

Production reviewers:

- Евгений Казаков — active `dementor` + `owner_admin`;
- Nikita Lobushkin — active `dementor` + `owner_admin`.

Threshold: **2 independent APPROVE decisions**.

## 2. Severity model

- **P0 / BLOCKER** — breaks canonical flow, access, security or authoritative membership state.
- **P1 / MAJOR** — flow works technically but UI/state can cause materially wrong action or interpretation.
- **P2 / MINOR** — usability/state-model ambiguity that does not corrupt authoritative state.
- **P3 / POLISH** — refinement only.

## 3. Findings

### QA-MEM-001 — Legacy `/join/member/` remains in Membership v2 journey

Status: **FIX STAGED / RETEST PENDING**  
Severity: **P0 / BLOCKER**

Observed:

- legacy screen duplicated identity/contact/legal;
- exposed `ВОЙТИ В COMMUNITY →`;
- still depended on disabled `dc_activate_membership_v1`.

Staged fix:

- `/join/member/` becomes a compatibility redirect to `/join/apply/`;
- no legacy auto-activation runtime is used;
- `/join/apply/` restored as the actual Membership v2 application entry in `dementor-club-site`.

Important branch-drift correction:

During implementation it was discovered that `dementor-club-site/join/apply/index.html` was still an old redirect to `/join/member/`, while production already had the newer v2 entry. That stale branch state was corrected before release preparation to avoid a redirect loop.

Retest: **PENDING AFTER DEPLOY**.

---

### QA-MEM-002 — Reviewer decision is not visually final

Status: **FIX STAGED / RETEST PENDING**  
Severity: **P1 / MAJOR**

Observed:

- one Dementor could repeatedly click decision controls;
- database correctly stored only one current decision per `(application, reviewer)`;
- UI did not communicate that the reviewer's decision was already recorded.

Server behavior: **PASS**.

Staged UX fix:

- after own decision, decision controls are hidden;
- note becomes read-only;
- reviewer sees `ВАШЕ РЕШЕНИЕ: ... ✓`;
- approval progress is shown as `N / 2 DEMENTORS`.

Retest: **PENDING AFTER DEPLOY**.

---

### QA-MEM-003 — `ACCOUNT → CART` routes to production 404

Status: **FIX STAGED / RETEST PENDING**  
Severity: **P1 / MAJOR NAVIGATION**

Observed:

- ACCOUNT menu exposed `CART`;
- `/cart/` returned branded 404.

Root cause verified:

- `cart/index.html` does exist in repository;
- production builder intentionally excludes top-level `cart`;
- production hardening forces `cartEnabled:false` and `checkoutEnabled:false`.

Therefore the correct fix is **not** to publish Cart now.

Staged fix:

- global header reads `DEMENTOR_SITE_CONFIG.merch.cartEnabled`;
- `CART` is not rendered when production disables commerce;
- cart runtime is not loaded when disabled.

Retest: **PENDING AFTER DEPLOY**.

---

### QA-MEM-004 — Historical completed course is not distinguished from a new repeat pass

Status: **OPEN / NEEDS PRODUCT-STATE CLARIFICATION**  
Severity: **P2 / STATE AMBIGUITY**

Observed:

- Workspace showed `Думай с опасностью` as `completed`;
- course runtime simultaneously allowed a new Day 2 continuation;
- completion certificate remained visible.

Database verification:

- historical enrollment completion = **2026-08-28**;
- certificate completion = **2026-08-28**;
- current Day 2 did not newly complete the course.

Current diagnosis:

This is a historical completed pass plus a current repeat/restart whose attempt state is not separately represented in Workspace.

Required follow-up:

1. identify where current repeat progress is stored;
2. determine canonical attempt model;
3. show previous completion and current repeat without contradiction;
4. preserve historical certificate.

Retest/diagnosis: **OPEN, not included in Fix Batch 01**.

---

### QA-MEM-005 — No discoverable sign-out / logout action

Status: **FIX STAGED / RETEST PENDING**  
Severity: **P1 / ACCOUNT UX + SESSION CONTROL**

Observed:

- tester could not discover a usable logout control;
- an implementation-level logout existed in Workspace session box but was not sufficiently discoverable.

Staged fix:

- explicit `LOG OUT` added directly to Workspace left navigation;
- action performs canonical Supabase `signOut()`;
- user is returned to public site after session termination.

Retest must verify:

- protected surfaces no longer expose authenticated data;
- relogin under another account does not inherit stale role/member UI.

Retest: **PENDING AFTER DEPLOY**.

---

### QA-MEM-006 — Active Member route still speaks as a pre-admission application page

Status: **FIX STAGED / RETEST PENDING**  
Severity: **P2 / COPY + STATE PRESENTATION**

Observed:

- lower state correctly said `ВЫ УЖЕ В КЛУБЕ`;
- dominant hero still said `ПОДАТЬ ЗАЯВКУ В КЛУБ`.

Staged fix:

For `MEMBERSHIP / ACTIVE`, hero becomes state-aware:

`ЧЛЕНСТВО АКТИВНО.`

and the copy sends the Member into Workspace rather than explaining application mechanics again.

Retest: **PENDING AFTER DEPLOY**.

---

### QA-MEM-007 — Global public navigation low contrast on membership application

Status: **FIX STAGED / RETEST PENDING**  
Severity: **P1 / NAVIGATION + ACCESSIBILITY**

Observed on `/join/apply/`:

- public top navigation became hard to read;
- experienced tester needed substantial time to locate `COMMUNITY`.

Clarification:

This issue does not justify keeping Membership Review standalone. Review-specific navigation disappears through `QA-MEM-009`.

Staged fix:

- `/join/apply/` explicitly uses a readable light topbar/dark text state;
- mobile layout also receives a compact header/layout treatment.

Retest: **PENDING AFTER DEPLOY**.

---

### QA-MEM-008 — Private Community Board is orphaned from Member Workspace navigation

Status: **FIX STAGED / RETEST PENDING**  
Severity: **P1 / INFORMATION ARCHITECTURE + DISCOVERABILITY**

Production access result:

- accepted Membership v2 Member can open `/community/board/` directly — **ACCESS PASS**;
- Member could not discover it naturally from Workspace.

Architecture conclusion:

**PUBLIC TOP NAV** = public club/site architecture.  
**WORKSPACE LEFT PANEL** = authenticated member/work architecture.

Staged fix:

Workspace left navigation now exposes:

- `MY CLUB`
- `COMMUNITY BOARD`
- `MY ARTIFACTS`
- `MY ACTIVITY`
- `MY WORK` when applicable
- `MY PROFILE`
- role-specific tools.

Retest: **ACCESS PASS / DISCOVERABILITY RETEST PENDING**.

---

### QA-MEM-009 — Membership Review breaks the Workspace shell

Status: **FIX STAGED / RETEST PENDING**  
Severity: **P1 / INFORMATION ARCHITECTURE + ROLE WORKFLOW**

Observed:

- reviewer clicked Membership Review inside Workspace;
- full navigation opened a standalone dark mini-site without the Workspace sidebar.

Staged fix:

- `/workspace/review/` now renders inside the same Workspace shell;
- Workspace sidebar stays visible;
- Board and My Artifacts remain reachable;
- Dementor-only role boundary remains explicit.

Negative-role production test:

- ordinary Member could open direct URL but saw `ACCESS DENIED / НЕ ВАША ОЧЕРЕДЬ`;
- no application or reviewer data leaked — **SECURITY PASS**.

Staged negative-role UX change:

- direct non-Dementor access redirects back to Workspace instead of rendering a full reviewer surface.

Retest: **PENDING AFTER DEPLOY**.

---

### QA-MEM-010 — Archived member Artifacts exist in data but are not discoverable

Status: **FIX STAGED / RETEST PENDING**  
Severity: **P1 / MEMBER HISTORY + DISCOVERABILITY**

Production data verification:

Sharecraft has two Community Artifact records:

1. `Куда двигаемся - народ?` — `active`;
2. `гусь` — `archived`, closed 2026-08-30.

Production UI result:

- `МОЁ` correctly shows the one current active Artifact;
- archived `гусь` cannot be reached from UI.

Staged fix:

New internal Workspace surface:

`/workspace/artifacts/`

with filters:

- `ВСЕ`
- `АКТИВНЫЕ`
- `АРХИВ`

It reads the current user's own `dc_artifacts` under RLS and keeps archived records out of the live Board while preserving personal history.

Retest requirement:

- active artifact visible;
- `гусь` visible in Archive;
- archive item remains `archived` and does not return to live Board.

Retest: **PENDING AFTER DEPLOY**.

---

### QA-MEM-011 — Membership application mobile composition is oversized

Status: **FIX STAGED / RETEST PENDING**  
Severity: **P1 / RESPONSIVE UX**

Observed during mobile QA:

- `/join/apply/` was functionally usable;
- buttons remained accessible;
- composition was strongly desktop-shaped on mobile;
- oversized hero/media/blocks consumed excessive viewport space;
- content that could fit into a compact mobile flow required unnecessary scrolling.

Other checked authenticated links opened correctly and their controls remained available.

Staged fix:

- compact mobile hero;
- reduced page padding and section spacing;
- smaller state headings;
- reduced field/textarea footprint;
- tighter Interest Map rows;
- full-width submit action;
- compact phone breakpoint.

Retest: **PENDING AFTER DEPLOY**.

## 4. Confirmed production PASS

The core Membership v2 admission contract is verified:

- Sled ZARI submitted application;
- Евгений independently APPROVE;
- first approval did not activate membership;
- Nikita independently APPROVE;
- exactly 2 approvals reached threshold;
- application → `accepted`;
- membership → `active`;
- provenance → `membership-review-v2`;
- accepted Member could not submit a repeat application;
- accepted request disappeared from active Dementor queue;
- accepted Member gained private Board access;
- ordinary Member could not read reviewer queue/data;
- Membership v2 did not duplicate initial Artifact grant.

Artifact grant verification:

- Sharecraft has exactly one grant;
- `grant_key = initial-membership-v1`;
- created 2026-08-30;
- no v2 duplicate was created.

Therefore:

`APPLICATION → APPROVE #1 → WAIT → APPROVE #2 → MEMBER_ACTIVE`

is **PASS**.

## 5. Discovery checklist

### A. Entry / DC-9

- [x] authentication works.
- [x] server recognizes 9/9.
- [x] assessment history survives Membership v2 reset.
- [~] legacy member surface found — `QA-MEM-001`, fix staged.

### B. Membership Application

- [x] application opens after 9/9.
- [x] application submits.
- [x] Candidate Snapshot contains 9/9.
- [x] candidate context / Why Club / contact / Interest Map reach Dementor.
- [x] active Member blocked from repeat application.
- [~] active Member hero stale — `QA-MEM-006`, fix staged.
- [~] mobile composition oversized — `QA-MEM-011`, fix staged.

### C. Dementor Review

- [x] authorized Dementor opens queue.
- [x] first APPROVE stored once authoritatively.
- [x] first APPROVE does not activate membership.
- [~] own decision not visually final — `QA-MEM-002`, fix staged.
- [~] standalone Review broke Workspace context — `QA-MEM-009`, fix staged.
- [x] non-Dementor direct access exposes no reviewer data.

### D. Admission closure

- [x] second independent APPROVE.
- [x] threshold exactly 2.
- [x] application accepted.
- [x] membership active.
- [x] accepted application disappears from active queue.
- [x] initial Artifact grant not duplicated.

### E. Post-admission Member

- [x] Member state survives refresh/login.
- [x] public Community remains public landing.
- [x] private Board direct access works.
- [~] Board not discoverable from Workspace — `QA-MEM-008`, fix staged.
- [x] `МОЁ` correctly shows active artifact only.
- [~] archived artifact not reachable — `QA-MEM-010`, fix staged.

### F. Account / adjacent

- [x] ACCOUNT → PROFILE works.
- [~] CART exposed while disabled — `QA-MEM-003`, fix staged.
- [~] course repeat/history ambiguity — `QA-MEM-004`, remains open.
- [~] logout not discoverable — `QA-MEM-005`, fix staged.
- [~] `/join/apply/` topbar contrast — `QA-MEM-007`, fix staged.

### G. Security / resilience

- [x] normal Member cannot enter reviewer data surface.
- [x] legacy direct `dc_activate_membership_v1` disabled.
- [x] direct authenticated INSERT to `join_applications` disabled.
- [ ] MORE_CONTEXT branch not yet end-to-end tested.
- [ ] NOT_NOW / continue_outside branch not yet end-to-end tested.
- [ ] Telegram delivery failure independence not yet tested.

## 6. Fix Batch 01 — staged implementation map

Staged in `dementor-club-site`, not deployed:

- legacy Membership redirect → v2;
- corrected stale `/join/apply/` branch entry;
- active-Member hero state;
- mobile Membership Application layout;
- application topbar contrast;
- explicit Workspace logout;
- Workspace `COMMUNITY BOARD` link;
- Workspace `MY ARTIFACTS` history/archive surface;
- Membership Review inside Workspace shell;
- non-Dementor Review redirect;
- visually final own Dementor decision;
- production-disabled CART hidden from global Account menu;
- stale Workspace guest Membership copy aligned to v2.

## 7. Architecture fixed by this pass

### Public top navigation

`Club / Events / Projects / Community / Merch / Blog / Join / Account`

This remains public site architecture.

### Authenticated Workspace

`Home / My Club / Community Board / My Artifacts / My Activity / My Work / My Profile / role-specific tools / Log out`

Membership Review is a role-specific Dementor tool inside this Workspace context.

## 8. Remaining before production deploy of Fix Batch 01

1. prepare a clean release branch from `dementor-club-production`;
2. selectively promote only Fix Batch 01 runtime files — do **not** merge all of `dementor-club-site`;
3. add new Workspace Artifact route to production readiness registry if required by gate;
4. run Production Candidate Integrity;
5. inspect release diff for unrelated files;
6. only after explicit deploy instruction: run `Deploy Dementor Production`.

## 9. Production retest after deploy

Required retest:

- `/join/member/` resolves safely to v2;
- active Member `/join/apply/` shows active-state hero;
- mobile `/join/apply/` fits compactly and controls remain accessible;
- Account menu no longer exposes disabled CART;
- Workspace shows Board / My Artifacts / Log out;
- My Artifacts shows active + archived `гусь` correctly;
- Membership Review stays inside Workspace shell;
- ordinary Member direct Review URL resolves back to Workspace;
- first Dementor decision becomes visually final;
- second decision still closes queue and activates membership;
- logout removes protected access and relogin does not retain stale role UI.

## 10. Exit criteria

This QA cycle is green only when:

- Fix Batch 01 passes production retest;
- P0 is closed;
- P1 navigation/session/IA/history/responsive findings are closed or explicitly deferred;
- core two-Dementor admission remains stable;
- Member can reach current and archived Artifact history;
- privacy/RLS negative-role behavior remains correct;
- course repeat-attempt ambiguity is resolved or explicitly moved to its own product-state task;
- all remaining warnings stay recorded here.
