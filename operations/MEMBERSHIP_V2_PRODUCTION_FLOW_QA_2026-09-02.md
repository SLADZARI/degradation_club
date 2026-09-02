# Dementor Club — Membership v2 Production Flow QA

Status: **ACTIVE LIVE QA LEDGER**  
Date opened: **2026-09-02**  
Environment: **PRODUCTION / https://dementor.club**  
Source of truth: `dementor-club`  
Implementation branch: `dementor-club-site`  
Production branch: `dementor-club-production`

## 0. Purpose

This document is the live QA ledger for the full Membership v2 user journey.

We move through the real production flow screen by screen and record:

- route / state;
- test account / role;
- expected behavior from approved source-of-truth;
- actual behavior observed in production;
- defect or ambiguity;
- severity;
- required fix;
- retest status.

This is not a place to redesign membership semantics. Admission authority remains `community/MEMBERSHIP_AND_DEMENTOR_REVIEW_V2.md`. DC-9 diagnostic authority remains `operations/ONBOARDING_SYSTEM.md`. Site implementation belongs in `dementor-club-site`. Production deploy remains manual and requires explicit human approval.

## 1. Authority chain

1. `community/MEMBERSHIP_AND_DEMENTOR_REVIEW_V2.md` — admission semantics.
2. `operations/ONBOARDING_SYSTEM.md` — DC-9 diagnostic semantics.
3. `community/MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md` — post-admission Artifact flow where not superseded by v2.
4. `operations/DC9_ENTRY_STATE_ROUTING_AND_QA_V0.1.md` — Join/DC-9 entry-state QA.
5. `dementor-club-site/docs/QA_RELEASE_CONTRACT_v1.md` — release and post-deploy QA contract.

Canonical admission path:

`AUTHENTICATED → DC9 9/9 → APPLICATION_AVAILABLE → APPLICATION_SUBMITTED → UNDER_REVIEW → 2 independent APPROVE → MEMBER_ACTIVE → FIRST_ARTIFACT_REQUIRED → MEMBER_ACTIVATED`

Important boundaries:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

## 2. Live QA fixture

Primary controlled account:

- email: `sharecraftwideo@gmail.com`
- display identity observed in review: `Sled ZARI`
- production DC-9: `9/9`
- membership was intentionally reset to `waiting` for v2 QA
- previous assessment history preserved
- previous Community artifacts preserved
- previous Artifact grant preserved

Production reviewers:

- Евгений Казаков — active `dementor` + `owner_admin`
- Nikita Lobushkin — active `dementor` + `owner_admin`

Acceptance threshold: **2 independent APPROVE decisions**.

## 3. Severity model

- **P0 / BLOCKER** — breaks or contradicts the canonical flow, access, security or membership state.
- **P1 / MAJOR** — flow technically works but UI/state can cause materially wrong user action or reviewer interpretation.
- **P2 / MINOR** — usability/copy/visual defect that does not invalidate state.
- **P3 / POLISH** — refinement only.

A P0 remains a release blocker for the affected flow until retested green.

## 4. Current production QA findings

### QA-MEM-001 — Legacy `/join/member/` remains in Membership v2 journey

Status: **OPEN**  
Severity: **P0 / BLOCKER**  
Route: `https://dementor.club/join/member/`

Observed in live QA:

- legacy screen asks again for Community display name, nickname, contact and legal confirmations;
- UI exposes `ВОЙТИ В COMMUNITY →`;
- primary button appears non-functional after v2 cutover;
- the page feels like a duplicate admission form after the real Membership v2 application.

Technical finding:

- production `join/member/member.js` still calls legacy RPC `dc_activate_membership_v1`;
- v2 production cutover has intentionally revoked that legacy automatic activation path;
- therefore the screen is now a dead/obsolete admission surface.

Canonical conflict:

Membership v2 requires:

`9/9 → Membership Application → Dementor Review → Membership`

The old screen implies:

`9/9 → identity/contact/legal → direct Membership`

Required fix:

1. remove `/join/member/` from the primary Membership v2 routing;
2. after completed 9/9 + non-member state route to `/join/apply/`;
3. keep `/join/member/` only as a compatibility redirect/state resolver if old inbound links may exist;
4. do not call `dc_activate_membership_v1` from public runtime;
5. do not ask the user to repeat identity/contact/legal data already captured in Membership v2 application unless a later approved profile-edit flow explicitly requires it.

Retest acceptance:

- non-member 9/9 user cannot encounter an automatic membership activation screen;
- every admission path resolves to `/join/apply/` or an explicit application status;
- old `/join/member/` URL cannot create membership and does not dead-end.

Evidence: live QA screenshot supplied 2026-09-02.

---

### QA-MEM-002 — Dementor can repeatedly press the same review decision without a visually final state

Status: **OPEN**  
Severity: **P1 / MAJOR**  
Route: `https://dementor.club/workspace/review/`

Observed in live QA:

- Sharecraft submitted Membership v2 application successfully;
- application appeared in Dementor review surface;
- Евгений selected `APPROVE` and added internal note;
- `Review state` correctly shows `Вы / APPROVE`;
- application correctly remains `reviewing`, waiting for the second Dementor;
- however all three action buttons remain available;
- the same reviewer can press `ПОДТВЕРДИТЬ` repeatedly, or switch to `НУЖЕН КОНТЕКСТ` / `ПОКА НЕТ`, with no clear visual transition into a completed-own-review state.

Server behavior already confirmed:

- one current review record exists per `(application, reviewer)`;
- repeated action from the same reviewer does **not** create multiple independent approvals;
- a repeated action updates the reviewer’s existing current decision;
- one reviewer therefore cannot satisfy the `2 APPROVE` threshold alone.

Problem classification:

The data contract is correct, but the UI suggests voting is repeatable and gives insufficient feedback that the reviewer’s decision has already been registered.

Required UX behavior after own decision:

- show a prominent state such as `ВАШЕ РЕШЕНИЕ: ПОДТВЕРЖДЕНО ✓`;
- show factual threshold progress, e.g. `1 / 2 DEMENTORS`;
- show `ЖДЁМ ЕЩЁ ОДНО РЕШЕНИЕ` while application remains open;
- hide/disable normal decision buttons after the reviewer has submitted a decision;
- if changing a decision remains allowed by the approved v2 semantics, expose a separate explicit control such as `ИЗМЕНИТЬ РЕШЕНИЕ`, rather than leaving all decision buttons looking like fresh votes;
- after second independent APPROVE, show final state `ПРИНЯТ В COMMUNITY · 2/2` and remove the application from the active queue.

Retest acceptance:

- first reviewer sees own decision as registered and final-looking;
- first reviewer cannot mistake repeated click for a second vote;
- progress clearly communicates `1/2`;
- second Dementor can still submit an independent decision;
- after second APPROVE, membership becomes active once and card becomes closed/final.

Evidence: live QA screenshot supplied 2026-09-02.

## 5. Flow checklist — live pass

Legend:

- `[ ]` not tested yet
- `[~]` tested with issue / incomplete
- `[x]` passed

### A. Entry / account / DC-9

- [x] controlled QA account authenticates in production.
- [x] server recognizes existing DC-9 `9/9`.
- [x] assessment history survives QA membership reset.
- [ ] returning 9/9 non-member resolves to the correct Membership v2 application route from every relevant Join entry point.
- [~] `/join/member/` still exists as legacy duplicate/dead-end — `QA-MEM-001`.

### B. Membership Application

- [x] 9/9 user can open Membership v2 application.
- [x] application can be submitted in production.
- [x] application creates one open request.
- [x] Candidate Snapshot reaches review surface with `DC-9 / 9/9`.
- [x] candidate context / Why Club / contact / Interest Map are visible to authorized Dementor.
- [ ] candidate-facing state after submission is clear and stable after refresh/login on another session.
- [ ] duplicate application submission is blocked while application remains open.
- [ ] non-9/9 account is server-blocked from submitting application.

### C. Dementor authorization / review

- [x] authorized Dementor can open `/workspace/review/`.
- [x] submitted application appears in review queue.
- [x] reviewer can see Candidate Snapshot and application context.
- [x] first `APPROVE` is stored as the reviewer’s own decision.
- [x] first `APPROVE` does not activate membership.
- [~] reviewer decision lacks visually final state — `QA-MEM-002`.
- [ ] non-Dementor account is denied access to review queue.
- [ ] reviewer cannot create a review on behalf of another Dementor.
- [ ] `MORE_CONTEXT` behavior is tested.
- [ ] `NOT_NOW` behavior is tested.

### D. Second review / admission

- [ ] Nikita opens the same application under his own account.
- [ ] Nikita sees Евгений’s factual existing decision.
- [ ] Nikita submits independent `APPROVE`.
- [ ] threshold becomes exactly `2/2`.
- [ ] application changes to `accepted` exactly once.
- [ ] `dc_system_memberships` becomes active with v2 provenance.
- [ ] public member profile is created/updated as required.
- [ ] initial Artifact slot is not duplicated if one already exists.
- [ ] accepted application leaves active review queue.

### E. Candidate after acceptance

- [ ] Sharecraft refresh/login resolves to Member state.
- [ ] candidate no longer sees application form as available.
- [ ] Community access is available only after accepted membership state.
- [ ] post-admission route leads into the approved first-Artifact/Community flow.
- [ ] existing artifacts remain intact.
- [ ] existing Artifact grant remains intact / no duplicate grant appears.

### F. Privacy / security / resilience

- [ ] normal Member cannot read another candidate’s application.
- [ ] normal Member cannot read Dementor internal notes.
- [ ] candidate cannot read private reviewer notes.
- [ ] user cannot self-assign `dementor`.
- [x] legacy direct `dc_activate_membership_v1` admission path disabled after cutover.
- [x] direct authenticated INSERT to `join_applications` disabled after cutover.
- [ ] Telegram notification failure does not affect application/review/admission state.

### G. Responsive / UX

- [ ] Membership application desktop pass.
- [ ] Membership application mobile pass.
- [ ] Dementor review desktop pass.
- [ ] Dementor review mobile pass.
- [ ] long Candidate Snapshot remains usable without broken overflow.
- [ ] decision controls are obvious and accessible at narrow viewport.

## 6. QA operating rule for this pass

We do not batch-fix the entire product blindly while testing.

Loop:

`OPEN SCREEN → OBSERVE → RECORD → CLASSIFY → CONTINUE FLOW WHEN SAFE`

For a defect:

- P0: record immediately; stop that broken branch of the flow if continuing would corrupt state or invalidate the test;
- P1/P2: record and continue when server state remains trustworthy;
- no production deploy during this QA pass unless explicitly requested by the user;
- fixes are prepared in `dementor-club-site`, then validated and promoted through the normal production release gate.

## 7. Current next QA action

Continue the existing real application from its current state:

`Sled ZARI application = UNDER_REVIEW`

Current verified state:

- candidate application exists;
- Евгений decision = `APPROVE`;
- membership must still be inactive;
- second independent Dementor decision is still required.

Next controlled step:

**Login as Nikita → open `/workspace/review/` → verify existing Евгений decision → inspect full card → submit Nikita decision once.**

Before pressing the final second `APPROVE`, visually verify that the correct candidate/application is open. After the action, verify both UI state and authoritative membership state before proceeding into Community.

## 8. Exit criteria

The Membership v2 QA pass is green only when:

- all canonical states in the real journey have been exercised;
- P0 defects are fixed and retested;
- P1 defects affecting decision clarity are fixed and retested;
- two independent Dementor approvals create exactly one active membership;
- candidate state, reviewer state and membership state remain synchronized after refresh/relogin;
- post-admission Community/Artifact flow works without legacy auto-membership surfaces;
- privacy/RLS boundaries survive negative-role tests;
- mobile and desktop versions of application and review are usable;
- QA evidence and final unresolved warnings are recorded here.
