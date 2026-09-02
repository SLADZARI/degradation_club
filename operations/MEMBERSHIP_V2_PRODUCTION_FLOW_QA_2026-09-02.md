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
- [ ] candidate-facing submitted state after refresh/relogin.
- [ ] duplicate application blocked while open.
- [ ] non-9/9 application server-blocked.

### C. Dementor Review

- [x] authorized Dementor opens review workspace.
- [x] application appears.
- [x] Candidate Snapshot/context visible.
- [x] first APPROVE stored.
- [x] first APPROVE does not activate membership.
- [~] own decision lacks visually final state — `QA-MEM-002`.
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
- [ ] candidate cannot submit a new application while already active Member.
- [ ] Community route/access checked end to end.
- [ ] post-admission Artifact flow checked.
- [ ] previous artifacts preserved visually.
- [ ] previous Artifact grant preserved / no duplicate grant.

### F. Account / adjacent surfaces encountered during pass

- [x] ACCOUNT → PROFILE works.
- [~] ACCOUNT → CART → 404 — `QA-MEM-003`.
- [~] historical course completion vs current repeat pass ambiguous — `QA-MEM-004`.

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

## 6. QA operating rule

`OPEN SCREEN → OBSERVE → RECORD → CLASSIFY → CONTINUE WHEN SAFE`

Do not batch-fix while collecting this production pass. P0/P1 items stay open until a fix is prepared in `dementor-club-site`, promoted through release gates, deployed only on explicit human instruction, and retested in production.

## 7. Current next QA actions

Continue from the now-active Member account without resetting historical test data:

1. verify accepted application behavior on `/join/apply/` after refresh/relogin;
2. verify Community entry and post-admission access;
3. verify old artifacts and Artifact grant remain intact;
4. revisit `/workspace/review/` under a Dementor and confirm the accepted request is closed/removed from active queue;
5. continue the current repeat of `Думай с опасностью` only far enough to understand how the repeat attempt is stored, without deleting the historical 2026-08-28 completion/certificate.

## 8. Exit criteria

The pass is green only when:

- P0 findings are fixed and retested;
- P1 decision/navigation defects are fixed and retested;
- core two-Dementor admission remains stable after relogin;
- candidate/reviewer/membership states remain synchronized;
- Community/Artifact post-admission path works;
- privacy/RLS negative-role tests pass;
- mobile review/application surfaces are usable;
- historical course runs and repeat attempts are presented without contradictory state;
- all remaining warnings are recorded here.
