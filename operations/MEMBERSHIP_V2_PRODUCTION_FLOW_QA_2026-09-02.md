# Dementor Club — Membership v2 Production Flow QA

Status: **ACTIVE LIVE QA LEDGER**  
Date opened: **2026-09-02**  
Environment: **PRODUCTION / https://dementor.club**  
Source of truth: `dementor-club`  
Implementation branch: `dementor-club-site`  
Production branch: `dementor-club-production`

## 0. Purpose

This document is the single live QA ledger for the Membership v2 production journey and the immediately connected account/workspace surfaces encountered while testing it.

For every observation record:

- route / state;
- expected behavior;
- actual production behavior;
- severity;
- required fix or clarification;
- retest status.

Admission authority remains `community/MEMBERSHIP_AND_DEMENTOR_REVIEW_V2.md`. DC-9 authority remains `operations/ONBOARDING_SYSTEM.md`. Site implementation belongs in `dementor-club-site`. Production deployment remains manual and requires explicit human approval.

## 1. Canonical flow

`AUTHENTICATED → DC9 9/9 → APPLICATION_AVAILABLE → APPLICATION_SUBMITTED → UNDER_REVIEW → 2 independent APPROVE → MEMBER_ACTIVE → COMMUNITY / POST-ADMISSION`

Important boundary:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

Controlled QA account:

- `sharecraftwideo@gmail.com`
- display identity observed: `Sled ZARI`
- DC-9: `9/9`
- legacy artifacts / grants intentionally preserved during Membership v2 reset.

Production reviewers:

- Евгений Казаков — active `dementor` + `owner_admin`;
- Nikita Lobushkin — active `dementor` + `owner_admin`.

Threshold: **2 independent APPROVE decisions**.

## 2. Severity model

- **P0 / BLOCKER** — breaks canonical flow, access, security or authoritative membership state.
- **P1 / MAJOR** — flow works technically but UI/state can cause materially wrong action or interpretation.
- **P2 / MINOR** — usability/state-model ambiguity that does not corrupt authoritative state.
- **P3 / POLISH** — refinement only.

## 3. Open production findings

### QA-MEM-001 — Legacy `/join/member/` remains in Membership v2 journey

Status: **OPEN**  
Severity: **P0 / BLOCKER**  
Route: `https://dementor.club/join/member/`

Observed:

- legacy screen repeats Community display name, nickname, contact and legal confirmations;
- exposes `ВОЙТИ В COMMUNITY →`;
- primary action is non-functional after v2 cutover;
- duplicates the real Membership v2 application surface.

Technical cause:

- legacy runtime still calls `dc_activate_membership_v1`;
- v2 cutover revoked this automatic activation path.

Required fix:

1. remove `/join/member/` from primary Membership v2 routing;
2. completed 9/9 + non-member must resolve to `/join/apply/` or application status;
3. keep `/join/member/` only as compatibility redirect/state resolver if needed;
4. never call `dc_activate_membership_v1` from public runtime;
5. do not recollect identity/contact/legal already captured by Membership v2 unless explicitly required by a future profile-edit flow.

Retest: **NOT RUN**.

---

### QA-MEM-002 — Reviewer decision is not visually final

Status: **OPEN**  
Severity: **P1 / MAJOR**  
Route: `https://dementor.club/workspace/review/`

Observed:

- Евгений submitted `APPROVE`;
- application correctly remained `reviewing` after first approval;
- UI showed `Вы / APPROVE`, but all decision buttons remained active;
- same reviewer could repeatedly press `ПОДТВЕРДИТЬ` or switch decision without an explicit edit mode.

Server behavior is correct:

- one current review record per `(application, reviewer)`;
- repeated click does not create extra independent approvals;
- one reviewer cannot satisfy the 2-approval threshold alone.

Required UX:

- after decision show `ВАШЕ РЕШЕНИЕ: ПОДТВЕРЖДЕНО ✓`;
- show threshold progress, e.g. `1 / 2 DEMENTORS`;
- show `ЖДЁМ ЕЩЁ ОДНО РЕШЕНИЕ` while open;
- hide/disable fresh decision controls after own decision;
- if changing is allowed, use a separate explicit `ИЗМЕНИТЬ РЕШЕНИЕ` action;
- after second approval show final `ПРИНЯТ В COMMUNITY · 2/2` state or remove from active queue.

Retest: **NOT RUN**.

---

### QA-MEM-003 — `ACCOUNT → CART` routes to production 404

Status: **OPEN**  
Severity: **P1 / MAJOR NAVIGATION**  
Route: `ACCOUNT → CART → https://dementor.club/cart/`

Observed:

- ACCOUNT dropdown exposes `PROFILE` and `CART`;
- `PROFILE` correctly opens the profile/workspace surface — **PASS**;
- `CART` opens the branded 404 page (`СТРАНИЦА УШЛА`).

Expected:

An exposed production navigation action must resolve to a working approved cart/order surface, or it must not be exposed until such a surface exists.

Required fix:

- either restore/implement the canonical `/cart/` route;
- or remove/hide `CART` from account navigation until the route is real;
- do not leave a knowingly dead primary account action.

Retest: **NOT RUN**.

---

### QA-MEM-004 — Historical completed course is not distinguished from a new repeat pass

Status: **OPEN / NEEDS PRODUCT-STATE CLARIFICATION**  
Severity: **P2 / STATE AMBIGUITY**  
Surfaces: course runtime + `Workspace → My Activity`

Initial observation:

- course `Думай с опасностью` was shown in Workspace as `completed`;
- the live course screen was simultaneously on Day 2 and allowed `ОТКРЫТЬ СЛЕДУЮЩИЙ ДЕНЬ`;
- Workspace also displayed a completion certificate.

Database verification changed the diagnosis:

- the Sharecraft enrollment was already `completed` on **2026-08-28**;
- the completion certificate was also issued on **2026-08-28**;
- certificate result contains its own historical `completed_at` from that earlier pass;
- therefore current Day 2 activity did **not** newly mark the course complete during this QA session.

Current interpretation:

This is most likely a historical completed run from earlier development/testing plus a new repeat/restart being opened now. The bug is therefore **not currently proven to be premature completion**.

Remaining product/UX question:

Workspace currently shows only the historical enrollment state `completed` and does not distinguish:

`previous completed attempt` vs `current repeat attempt in progress`.

The database already permits an `active` enrollment status, so no new generic status enum is required just to represent an in-progress enrollment. What still needs verification is how repeat attempts are modeled: new enrollment row, run/attempt entity, reset of one enrollment, or course-local progress only.

Required follow-up:

1. continue current repeat pass without resetting test history;
2. determine where current Day progress is stored;
3. verify whether a repeat pass creates a new authoritative attempt/enrollment;
4. ensure Workspace can present historical completion and current active repeat without contradiction;
5. never overwrite or remove the legitimate 2026-08-28 certificate merely because a repeat pass starts.

Retest/diagnosis status: **RECLASSIFIED — not a premature-completion bug based on current evidence**.

---

### QA-MEM-005 — No discoverable sign-out / logout action

Status: **OPEN**  
Severity: **P1 / ACCOUNT UX + SESSION CONTROL**  
Surfaces: global authenticated navigation, ACCOUNT menu, Workspace/Profile

Observed during live production QA:

- authenticated user can discover `ACCOUNT → PROFILE` and `ACCOUNT → CART`;
- tester could not find any visible action to sign out / log out from the current account;
- repository search for visible `signOut`, `logout` or `ВЫЙТИ` control did not surface an obvious global account action during this QA check.

Why this matters:

- a user must be able to terminate their own authenticated session without clearing browser storage or relying on developer tools;
- it is especially important for shared devices and for QA that switches between Candidate / Member / Dementor accounts;
- sign-out belongs to account/session control, not to hidden implementation behavior.

Expected:

A clearly discoverable `ВЫЙТИ` / `SIGN OUT` action should exist in the authenticated account surface, preferably in the same `ACCOUNT` menu that exposes Profile and other account-level actions. It must call the canonical auth sign-out path, clear the current application session, and resolve the user to an appropriate public/signed-out state.

Required fix / verification:

1. inspect current auth runtime for an existing hidden or route-specific sign-out implementation before adding a duplicate;
2. if one exists, expose it consistently in the global authenticated ACCOUNT menu;
3. if none exists, implement one canonical Supabase sign-out action and reuse it across authenticated surfaces;
4. after sign-out, protected/reviewer surfaces must no longer expose authenticated data;
5. verify relogin under another account works without stale role/member state.

Retest: **NOT RUN**.

---

### QA-MEM-006 — Active Member route still speaks as a pre-admission application page

Status: **OPEN**  
Severity: **P2 / COPY + STATE PRESENTATION**  
Route: `https://dementor.club/join/apply/`

Observed:

- active Member state is technically recognized correctly;
- panel correctly says `ВЫ УЖЕ В КЛУБЕ` and blocks repeat application;
- CTA `ОТКРЫТЬ ЛИЧНЫЙ КАБИНЕТ →` works;
- however the dominant page hero still says `ПОДАТЬ ЗАЯВКУ В КЛУБ` and explains how membership differs from an account.

Problem:

The route is state-aware only inside the lower card, while the most visually dominant copy still describes a state the current user has already passed. This creates unnecessary cognitive noise after acceptance.

Expected / recommended behavior:

- active Member should receive a state-aware hero, e.g. `ВЫ В КЛУБЕ` / `ЧЛЕНСТВО АКТИВНО`;
- application explanation should disappear for an already accepted Member;
- the main next action should lead into the personal Workspace / member surfaces;
- alternatively, `/join/apply/` may resolve directly to the appropriate Member status surface after a short explicit state message.

Retest: **NOT RUN**.

---

### QA-MEM-007 — Global public navigation becomes hard to read on dark membership surface

Status: **OPEN**  
Severity: **P1 / NAVIGATION + ACCESSIBILITY**  
Observed route: `https://dementor.club/join/apply/`

Observed:

- top navigation remains present but most navigation labels have very low visual contrast against the light/dark transitional header state;
- tester needed substantial time to locate `COMMUNITY` despite already knowing the site;
- a first-time visitor is likely to lose orientation faster.

Clarification from later QA:

- this issue is **not** treated as a separate reason to keep Membership Review standalone;
- if Review is integrated into the normal Workspace shell, its standalone dark-page navigation problem disappears as part of `QA-MEM-009`;
- `QA-MEM-007` remains open only for public/special pages where low contrast is independently reproducible, especially `/join/apply/`.

Expected:

- global public navigation must remain immediately legible on every supported page theme;
- active, inactive and hover states need explicit dark/light surface tokens rather than inheriting a low-contrast value;
- `COMMUNITY`, `JOIN`, `ACCOUNT` and other primary destinations must be discoverable without scanning effort.

Required fix:

1. audit topbar/nav contrast on special dark/onboarding pages where the issue actually reproduces;
2. use theme-aware navigation tokens or an explicit dark-header variant;
3. retest desktop and mobile after correction.

Retest: **NOT RUN**.

---

### QA-MEM-008 — Private Community Board exists but is orphaned from Member Workspace navigation

Status: **OPEN**  
Severity: **P1 / INFORMATION ARCHITECTURE + DISCOVERABILITY**  
Relevant production route: `/community/board/`

Verified in production code and live QA:

- the private board exists as a dedicated Member surface;
- production labels it `COMMUNITY / PRIVATE BOARD` and `ОБЩАЯ ДОСКА`;
- accepted Membership v2 Member can open it directly — **ACCESS PASS**;
- current Workspace sidebar exposes `HOME`, `MY CLUB`, `MY ACTIVITY`, optional `MY WORK`, `MY PROFILE`, plus Dementor-only Membership Review;
- no Board or Artifact destination is present in the left Workspace navigation.

Observed user effect:

- Member opened public `COMMUNITY` and correctly found the public landing/people page;
- tester could not discover the private Board from the cabinet and interpreted it as having disappeared.

Architecture conclusion:

Public `COMMUNITY` and private Member Board are different surfaces and should stay different:

- top navigation = public club/site architecture;
- Workspace left navigation = authenticated personal/member/work architecture.

Recommended placement:

- keep `/community/` as the public landing page;
- expose private Board from Workspace, preferably under `MY CLUB` or as a clear `COMMUNITY BOARD` / `BOARD` entry in the left panel;
- expose the member's own Artifacts near the same internal Club surface;
- do not require an authenticated Member to infer that a private operational Board hides behind the public Community landing.

Retest: **ACCESS PASS / DISCOVERABILITY NOT FIXED**.

---

### QA-MEM-009 — Membership Review breaks the Workspace shell and role workflow context

Status: **OPEN**  
Severity: **P1 / INFORMATION ARCHITECTURE + ROLE WORKFLOW**  
Route: `Workspace → MEMBERSHIP REVIEW → /workspace/review/`

Verified in production code:

- Dementor-only nav button is injected into the Workspace left panel;
- clicking it performs a full navigation to `./review/`;
- `/workspace/review/` is a separate standalone page with its own header and no Workspace sidebar.

Observed effect:

- reviewer feels ejected from the personal/role workspace into a different product surface;
- returning to `MY CLUB`, `MY ACTIVITY`, `MY WORK` or profile requires leaving that context rather than switching inside the same cabinet.

Expected / recommended architecture:

- role-specific working tools should remain inside the Workspace shell;
- `MEMBERSHIP REVIEW` should behave like another internal Workspace route/view, not like a separate mini-site;
- Member status belongs in `MY CLUB`;
- private Board/Artifacts belong in the authenticated Club area;
- Dementor-only review tooling is layered on top of the same left-panel workspace according to role.

Retest: **NOT RUN**.

---

### QA-MEM-010 — Archived member Artifacts exist in data but are not discoverable in the UI

Status: **OPEN**  
Severity: **P1 / MEMBER HISTORY + DISCOVERABILITY**  
Surface: `https://dementor.club/community/board/`

Observed during live QA:

- accepted Member can open the private Board;
- `МОЁ` shows one current Artifact: `Куда двигаемся - народ?`;
- tester could not find an Archive/history view and could not reach the older Artifact from the UI.

Database verification:

The Sharecraft account has two Community Artifact records:

1. `Куда двигаемся - народ?` — `status = active`;
2. `гусь` — `status = archived`, closed on 2026-08-30.

Therefore `МОЁ` showing one item is not a data-loss bug if it intentionally filters to active items. The defect is that the archived item remains in authoritative data but has no discoverable member-facing history/archive surface.

Expected:

- current Board can continue to default to active/current Artifacts;
- Member must have a clear way to inspect their historical/archived Artifacts;
- archived items should be visibly distinguished from active ones and should not silently disappear from the member's own history;
- archive access should live in the authenticated Workspace/Club IA, not be hidden behind undocumented filters.

Recommended fix:

1. add `ARCHIVE` / `HISTORY` for member Artifacts, or expose archived items in `MY ARTIFACTS` inside Workspace;
2. preserve existing status semantics (`active` vs `archived`) rather than mixing them in one undifferentiated current Board;
3. make the archived `гусь` record reachable in the retest without changing its authoritative status;
4. confirm that archiving an Artifact removes it from the live Board but not from the member's personal history.

Retest: **NOT RUN**.

## 4. Confirmed Membership v2 pass

The core admission sequence is now verified in production.

Observed and database-confirmed:

- Sled ZARI application submitted successfully;
- Евгений submitted independent `APPROVE`;
- first approval did not activate membership;
- Nikita opened the same application and independently approved it;
- authoritative application state = `accepted`;
- authoritative membership state = `active`;
- membership provenance = `membership-review-v2`;
- authoritative approve count = `2`;
- after acceptance the candidate account renders `MEMBER ✓` / active club membership.

Therefore the core contract:

`APPLICATION → APPROVE #1 → still waiting → APPROVE #2 → MEMBER_ACTIVE`

is **PASS**.

## 5. Flow checklist — live pass

Legend: `[ ]` not tested, `[~]` issue/incomplete, `[x]` passed.

### A. Entry / DC-9

- [x] controlled QA account authenticates in production.
- [x] server recognizes existing DC-9 9/9.
- [x] assessment history survives Membership v2 reset.
- [ ] all returning 9/9 non-member Join entry points resolve to Membership v2 correctly.
- [~] legacy `/join/member/` remains — `QA-MEM-001`.

### B. Membership Application

- [x] 9/9 user can open v2 application.
- [x] application submits in production.
- [x] one open request is created.
- [x] Candidate Snapshot reaches authorized review with 9/9.
- [x] candidate context / Why Club / contact / Interest Map are visible to Dementor.
- [x] accepted Member is blocked from repeat application.
- [~] accepted Member page retains pre-admission hero/copy — `QA-MEM-006`.
- [ ] candidate-facing submitted state after refresh/relogin before acceptance.
- [ ] duplicate application blocked while application remains open.
- [ ] non-9/9 application server-blocked.

### C. Dementor Review

- [x] authorized Dementor opens review workspace.
- [x] application appears.
- [x] Candidate Snapshot/context visible.
- [x] first APPROVE stored.
- [x] first APPROVE does not activate membership.
- [~] own decision lacks visually final state — `QA-MEM-002`.
- [~] Membership Review leaves Workspace shell — `QA-MEM-009`.
- [ ] non-Dementor denied review access.
- [ ] reviewer cannot act as another reviewer.
- [ ] MORE_CONTEXT tested.
- [ ] NOT_NOW tested.

### D. Second Review / Admission

- [x] Nikita opened same application under own account.
- [x] second independent APPROVE submitted.
- [x] threshold reached exactly 2 approvals.
- [x] application authoritative state = `accepted`.
- [x] membership authoritative state = `active`.
- [x] membership provenance = `membership-review-v2`.
- [ ] final review-card UX clearly shows accepted/closed state after refresh.
- [ ] accepted application absent from active queue.
- [ ] initial Artifact slot non-duplication rechecked after admission.

### E. Candidate after acceptance

- [x] candidate refresh/login resolves to Member state.
- [x] candidate cannot submit a new application while already active Member.
- [x] public Community landing remains accessible and behaves as public Community/people surface.
- [x] private Board direct access works for accepted Member.
- [~] private Board is not discoverable from Workspace — `QA-MEM-008`.
- [x] `МОЁ` correctly shows current active Artifact rather than archived history.
- [~] archived Artifact history is not discoverable — `QA-MEM-010`.
- [ ] post-admission Artifact creation flow checked.
- [ ] previous Artifact grant preserved / no duplicate grant.

### F. Account / adjacent surfaces encountered during pass

- [x] ACCOUNT → PROFILE works.
- [~] ACCOUNT → CART → 404 — `QA-MEM-003`.
- [~] historical course completion vs current repeat pass ambiguous — `QA-MEM-004`.
- [~] no discoverable sign-out/logout action — `QA-MEM-005`.
- [~] public top navigation low contrast on `/join/apply/` — `QA-MEM-007`.

### G. Privacy / security / resilience

- [ ] normal Member cannot read another candidate application.
- [ ] normal Member cannot read Dementor internal notes.
- [ ] candidate cannot read private reviewer notes.
- [ ] user cannot self-assign Dementor.
- [x] legacy direct `dc_activate_membership_v1` disabled.
- [x] direct authenticated INSERT to `join_applications` disabled.
- [ ] Telegram failure does not affect canonical admission state.

### H. Responsive / UX

- [ ] Membership application mobile pass.
- [ ] Dementor review mobile pass.
- [ ] long Candidate Snapshot overflow pass.
- [ ] decision controls narrow viewport pass.
- [ ] public topbar theme/contrast pass across light and dark authenticated/onboarding surfaces.
- [ ] Workspace IA pass: public site nav vs private left-panel navigation remains understandable to a new Member.

## 6. QA operating rule

`OPEN SCREEN → OBSERVE → RECORD → CLASSIFY → CONTINUE WHEN SAFE`

Do not batch-fix while collecting this production pass. P0/P1 items stay open until a fix is prepared in `dementor-club-site`, promoted through release gates, deployed only on explicit human instruction, and retested in production.

## 7. Current IA conclusion from live QA

Current evidence supports a clean boundary:

**PUBLIC TOP NAV**  
`Club / Events / Projects / Community / Merch / Blog / Join / Account`

This remains the public website/landing architecture.

**AUTHENTICATED WORKSPACE LEFT PANEL**  
`Home / My Club / Community Board / My Artifacts / My Activity / My Work / My Profile / role-specific tools`

Role-specific tools such as Membership Review should remain in this Workspace shell rather than opening a visually separate mini-site.

Member Artifact history should be reachable from `My Artifacts` or an explicit internal Archive/History state.

This is a QA-derived implementation recommendation, not a new change to Membership admission semantics.

## 8. Current next QA actions

Continue from the now-active Member account without resetting historical test data:

1. revisit `/workspace/review/` under a Dementor and confirm the accepted request is closed/removed from active queue;
2. verify the initial Artifact grant was not duplicated by Membership v2 acceptance;
3. test the post-admission Artifact creation path if an available slot/action is exposed;
4. continue current repeat of `Думай с опасностью` only far enough to understand repeat-attempt storage;
5. later run negative-role access and logout/relogin checks after current positive flow is fully mapped.

## 9. Exit criteria

The pass is green only when:

- P0 findings are fixed and retested;
- P1 decision/navigation/session-control/IA/history defects are fixed and retested;
- core two-Dementor admission remains stable after relogin;
- candidate/reviewer/membership states remain synchronized;
- public Community and private Member Board have clear, discoverable boundaries;
- active and archived member Artifacts are both reachable in the appropriate surfaces;
- Community/Artifact post-admission path works;
- user can explicitly terminate an authenticated session and relogin without stale role state;
- privacy/RLS negative-role tests pass;
- mobile review/application surfaces are usable;
- historical course runs and repeat attempts are presented without contradictory state;
- all remaining warnings are recorded here.
