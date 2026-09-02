# Dementor Club — Membership & Dementor Review Flow v2

STATUS: **APPROVED / SOURCE OF TRUTH**  
VERSION: **v2**  
DATE: **2026-09-02**  
SCOPE: DC-9 completion → membership application → Dementor review → Community membership  
IMPLEMENTATION TARGET: `dementor-club-site` + Supabase

## 1. Authority and supersession

This document is the canonical authority for Community membership admission from 2026-09-02.

It supersedes the automatic membership activation rule in `community/MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md`.

`MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md` remains authoritative for the post-admission Community Board / first Artifact mechanics unless explicitly superseded elsewhere.

Diagnostic meaning, sphere definitions, tags, levels, intentionality and responsibility remain governed by `operations/ONBOARDING_SYSTEM.md`.

Conflict rule:

`ONBOARDING_SYSTEM → diagnostic authority`

`MEMBERSHIP_AND_DEMENTOR_REVIEW_V2 → admission authority`

`MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1 → post-admission first-entry / Artifact authority`

## 2. Core distinction

Registration, completed diagnostics, application and membership are separate states.

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

Completion of all nine canonical spheres is mandatory for an application, but never activates Community membership by itself.

Community membership is created only after the approved Dementor review threshold is reached.

## 3. Active Dementors for v2 launch

The first production reviewers are:

- **Евгений Казаков** — active Dementor;
- **Nikita Lobushkin** — active Dementor.

They may simultaneously retain the operational role `owner_admin`.

`owner_admin ≠ dementor`.

Review authority is granted by an active `dementor` role assignment, not by administrative access alone.

Other people must not receive review authority until their Dementor role is explicitly approved and recorded.

## 4. Membership state model

Minimum semantic state model:

`ANONYMOUS`

→ `AUTHENTICATED`

→ `SPHERES_IN_PROGRESS`

→ `SPHERES_COMPLETE`

→ `APPLICATION_AVAILABLE`

→ `APPLICATION_SUBMITTED`

→ `UNDER_REVIEW`

→ one of:

- `MEMBER_ACCEPTED`
- `MORE_CONTEXT_REQUIRED`
- `CONTINUE_OUTSIDE_COMMUNITY`

After acceptance:

`MEMBER_ACTIVE → FIRST_ARTIFACT_REQUIRED → MEMBER_ACTIVATED`

Technical sub-states may exist but must not silently redefine these semantics.

## 5. Application gate

A user may create a Membership Application only when all conditions are true:

- authenticated user;
- platform profile exists;
- all nine canonical sphere onboardings have completed server-side results;
- server confirms exactly the canonical 9/9 set;
- no currently active application exists;
- no already-active confirmed Community membership exists, except an explicit QA/reset case.

The server is authority for the 9/9 gate.

LocalStorage, client UI state or a query-string state must never authorize application creation.

## 6. Sphere Map and Candidate Snapshot

The review must use factual onboarding results already collected by DC-9. The application must not force the user to repeat the same diagnostic questions.

At application submission the system creates a **Candidate Snapshot** representing the candidate at that moment.

For each canonical sphere the snapshot records the latest completed assessment run at submission time:

- `sphere_id`;
- `assessment_version`;
- `assessment_run_id`;
- sphere `level`;
- `tagLevels` / mapped canonical tags;
- `intentionality`;
- `responsibility`;
- completion timestamp.

Historical assessment runs remain intact. A later retake does not silently rewrite an already submitted Candidate Snapshot.

If a new application is permitted in the future, it receives a new snapshot.

The nine results remain independent and are never averaged into one universal Dementor score.

## 7. Application context

An application may additionally contain:

- display identity;
- primary social/contact identity;
- short `about` text;
- optional `why_club` text;
- optional **Interest Map** describing where the candidate wants to explore next.

Interest Map and Sphere Map are distinct objects:

- **Sphere Map** = diagnostic evidence already observed;
- **Interest Map** = directions the person wants to explore.

Interest Map must not alter, replace or reinterpret DC-9 diagnostic results.

## 8. Dementor Review

Each active Dementor may maintain one current decision per application.

Allowed review decisions:

- `APPROVE` — reviewer supports admission;
- `MORE_CONTEXT` — reviewer does not yet have enough context;
- `NOT_NOW` — reviewer does not support admission at this time.

A review record contains at minimum:

- application ID;
- Dementor profile ID;
- decision;
- optional internal note;
- created timestamp;
- updated timestamp.

Internal review notes are private to authorized Dementors / approved administration and are never automatically exposed to the candidate.

A Dementor may change their own decision while the application remains open. They cannot write a decision for another Dementor.

## 9. Acceptance threshold

Membership policy v2:

`required_approvals = 2`

Two independent `APPROVE` decisions from two active Dementors accept the application.

At v2 launch, because the only production reviewers are Евгений and Nikita, both must approve.

The implementation must not hardcode their profile UUIDs into the admission algorithm. Review eligibility is role-based and the threshold is policy-based.

If more Dementors are approved later, any two eligible active Dementors satisfy the current threshold unless this source-of-truth is explicitly changed.

## 10. Atomic admission

Reaching the threshold triggers one server-authoritative atomic admission operation.

It must:

1. lock / re-check the application;
2. verify the reviewer threshold against active Dementor roles;
3. prevent duplicate finalization;
4. set application state to `accepted`;
5. activate `dc_system_memberships`;
6. preserve provenance with `source_ref = membership-review-v2`;
7. create/update the public Member profile when required;
8. preserve required identity/legal state;
9. issue the initial Community Artifact slot exactly once;
10. record admission timestamp;
11. enqueue downstream notification/distribution.

The browser client must never be able to activate membership by direct table update.

## 11. Non-acceptance language

The club does not publicly frame a non-admission outcome as a judgment that a person is unsuitable or defective.

The preferred semantic outcome is:

`CONTINUE_OUTSIDE_COMMUNITY`

Meaning:

- account remains valid;
- Sphere Map remains valid;
- public Club content remains available;
- closed Community access is not activated now;
- the product may offer relevant public projects, materials, practices or events using existing Sphere Map / Interest Map evidence.

Do not invent a reason for non-admission if Dementors did not record one.

Exact public copy and any future re-application cooldown are separate editorial/product decisions and must be approved before implementation.

## 12. MORE_CONTEXT state

`MORE_CONTEXT` keeps the application open and does not grant membership.

A future version may allow a Dementor to ask the candidate a specific follow-up question.

Until such communication is explicitly approved, the system must not invent or automatically send questions on behalf of reviewers.

## 13. Notifications

Application submission creates the semantic event:

`JOIN_APPLICATION_SUBMITTED`

Review acceptance creates:

`JOIN_APPLICATION_ACCEPTED`

Downstream delivery may include Telegram notifications to Dementors and candidate-facing product notifications.

Telegram is not source-of-truth.

Canonical direction:

`SUPABASE APPLICATION / REVIEW → DISTRIBUTION OUTBOX → TELEGRAM / OTHER DELIVERY`

Telegram failure must not invalidate an application, review or membership.

Reviewer notification should contain enough factual context to identify the application and a stable link to the review surface, but private diagnostic details must only be exposed according to the approved access model.

## 14. Review surface

An authorized Dementor review card should expose:

- candidate identity;
- application time/state;
- 9/9 confirmation;
- Sphere Map;
- canonical tag interpretation;
- intentionality and responsibility values;
- Interest Map when supplied;
- `about` / `why_club` when supplied;
- current review decisions;
- the reviewer’s own available actions.

Actions:

- `ПОДТВЕРДИТЬ` → APPROVE;
- `НУЖЕН КОНТЕКСТ` → MORE_CONTEXT;
- `ПОКА НЕТ` → NOT_NOW.

A reviewer sees their own decision and the current factual decision state of other reviewers but cannot act on behalf of them.

## 15. Data boundaries

### Assessment authority

`assessment_runs` / `assessment_snapshots`

### Application authority

Membership Application + immutable Candidate Snapshot.

### Review authority

Dementor Review records.

### Membership authority

`dc_system_memberships`.

### Community participation authority

Artifacts, reactions, responses, events, projects and other approved Community entities.

These records must not be collapsed into one mutable universal profile JSON.

## 16. Existing v1 memberships

Existing confirmed Community memberships are not automatically revoked when v2 becomes active.

They retain their existing provenance and remain valid unless explicitly changed for QA or administration.

All new admissions after the v2 cutover must use Dementor Review v2.

A known QA account may be explicitly returned from legacy v1 active membership to a pre-membership state to test the full v2 flow. Such a reset is a test operation, not a general migration rule.

## 17. Security requirements

- RLS enabled on every exposed v2 table.
- Candidate reads only their own application state and approved candidate-facing outcome.
- Active Dementors can read review-required candidate data.
- Normal Members cannot read other candidates’ applications or review notes.
- A reviewer can write only their own review record.
- No user can self-assign `dementor`.
- No authenticated user can call the legacy automatic membership activation path after v2 cutover.
- Admission is server-authoritative and atomic.
- Role checks must use trusted database role assignments, never editable user metadata.
- New Data API tables/functions receive explicit grants only where required.

## 18. v2 launch reviewers

Production baseline on 2026-09-02:

- Евгений Казаков — `dementor` + `owner_admin`;
- Nikita Lobushkin — `dementor` + `owner_admin`.

No other review authority is implied by this document.

## 19. Definition of Done

Membership Review v2 is complete when a real QA user can:

1. authenticate;
2. complete / already possess all 9 server-side sphere results;
3. be blocked from application before 9/9;
4. submit one application after 9/9;
5. generate a stable Candidate Snapshot;
6. make the application visible to Евгений and Nikita as active Dementors;
7. receive no membership after only one APPROVE;
8. receive membership after the second independent APPROVE;
9. enter the existing post-admission Community / first Artifact flow;
10. see a stable candidate-facing state throughout the process;
11. preserve all RLS and privacy boundaries;
12. remain correct if Telegram delivery is unavailable.

## 20. First QA fixture

The existing test account `sharecraftwideo@gmail.com` may be used as the first controlled v2 fixture.

Its previous v1 membership may be reset explicitly for QA while preserving its assessment history.

Expected test path:

`SPHERES_COMPLETE → APPLICATION_AVAILABLE → APPLICATION_SUBMITTED → Евгений APPROVE → still not Member → Nikita APPROVE → MEMBER_ACTIVE`
