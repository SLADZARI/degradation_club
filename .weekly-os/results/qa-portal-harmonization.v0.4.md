---
artifactId: dementor-club.result.qa-portal-harmonization
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: DRAFT
version: 0.4
updated: 2026-09-05
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.3
---

# MP | Dementor Club | RELEASE | Portal QA Harmonization | v0.4

## Goal
Complete pre-advertising technical QA and live convergence without parallel owners, semantic mutation or blind site → production merges.

## Status
**ACTIVE / G7_RELEASE / FINAL TECHNICAL BATCH DEPLOYED / DEPLOY #35 SUCCESS / LIVE SEQUENTIAL RETEST IN PROGRESS**

Implementation branch: `result/qa-portal-harmonization`  
Release branch: `release/qa-portal-harmonization-v02-batch-final`  
Production branch: `dementor-club-production`  
Current production HEAD: `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`  
Current live deployed content HEAD: `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`

## Authority / protected boundaries
All protected boundaries and detailed implementation history are inherited unchanged from v0.3 and v0.2. In particular:
- `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`;
- first complete DC-9 baseline is immutable;
- Workspace remains the canonical authenticated shell;
- Artifact creation remains owned by the existing Board slot/composer flow;
- admin role does not silently grant unlimited publication;
- MP_DSL v0.1 remains DRAFT / REFERENCE.

## Validated production artifact
Final clean candidate `0855386b7e3dc8cf81447cee4e90ad51ce6cb9d2` was built directly on production baseline `96d16391a60f8e400ff07f90f3d6a864fb861776` and contained exactly 9 intended files, 1 commit ahead / 0 behind.

Production Release Readiness #769 passed completely. PR #114 merged the exact validated tree `ac8217ded93ecbdfe8aa630e764d99ce0435a7e5` into production as `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`.

## Pages deploy #35
The user explicitly authorized deployment with `деплой` and manually dispatched canonical `Deploy Dementor Production` from the workflow definition on `main` with `release_confirmation=APPROVED`.

Run #35 (`33975300949`) completed successfully on 2026-09-05:
- build job: PASS;
- deploy job: PASS;
- `Checkout canonical production branch`: PASS;
- checkout ref: `dementor-club-production`;
- `git log -1 --format=%H` inside the build resolved exactly to `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`;
- registry/routes/feature validation: PASS;
- content readiness: PASS;
- visual contract: PASS;
- production Pages build: PASS;
- analytics + consent guard: PASS;
- production release guard: PASS, 48 HTML routes covered;
- Pages artifact upload: PASS;
- artifact id: `9972127612`;
- artifact digest: `sha256:006a0441db6a8a30ad8218e6bdd142025865dbf5663417dd3ced387e4a06c388`;
- GitHub Pages deployment: PASS / reported success.

GitHub Pages deployment metadata carries the workflow-definition `main` SHA as its build-version identifier, but the build log independently proves that the artifact content was produced from the exact canonical production commit above. Therefore deployed content authority is `6a7c4d61...`, not the `main` workflow-definition SHA.

## What is now live
The combined live delta includes:
- Board Artifact-slot discoverability control using the existing canonical composer/entry owner;
- active Artifact detail destinations canonicalized to `/workspace/board/` and `/join/`;
- Safari-safe `prompt=select_account` convergence across all identified production-facing Google login owners;
- strengthened existing auth, shell, Board slot and mobile Join/Application regression contracts.

No new route family, auth architecture, membership state, DB entity, role bypass or second composer was introduced.

## Existing live evidence inherited from earlier deploys
Already evidenced before deploy #35:
- real Safari public Google login/callback: LIVE PASS;
- Workspace logout → repeated Google login: LIVE PASS;
- ordinary Member authenticated landing → Community Board: LIVE PASS for observed sessions;
- My Activity projection: LIVE PASS;
- My Artifacts active + archive history including archived `гусь`: LIVE PASS;
- Board drag/reposition persistence: LIVE PASS;
- live immutable DC-9 database migrations/functions/trigger: APPLIED + VERIFIED.

These remain historical evidence but the combined deploy still requires regression confirmation for affected flows.

## Live evidence after deploy #35
### Board slot / Board surface
User live-checked `/workspace/board/` after deploy #35.
Observed evidence:
- Board loaded in authenticated Workspace shell;
- existing Artifact was visible on the Board;
- `SLOT ЗАНЯТ` control was present for the occupied slot state;
- Board geometry and controls behaved normally in the observed session.

Classification: **LIVE PASS** for the Board slot control / occupied-state discoverability check. Archive/remove mutation was intentionally not used during this observation.

### Artifact detail return behavior
User opened an Artifact from the live Board and returned successfully.
Observed:
- Artifact detail opens and closes normally;
- canonical Workspace Board destination works;
- return loses the previous Board viewport/scroll context and lands at the Board's initial/top state.

Classification: **BUG CURRENT RESULT / NAVIGATION-STATE PRESERVATION**.
Corrective integration work is prepared so Board-origin navigation can use browser history and preserve the previous Board context, with `/workspace/board/` retained as direct-entry fallback. Do not deploy separately; include in the post-live corrective batch.

### Public Header / auth states
Authenticated Member public Header:
- identity/avatar → Workspace is visible and works;
- no duplicate public header observed;
- Member does not retain the `Вступить в клуб` CTA after auth resolution, consistent with active-Member entry to Workspace/Board.

A separate visual defect was observed when returning from Workspace/Board to the public site: before auth/membership resolution, the guest CTA can flash briefly and then disappear.
Classification: **BUG CURRENT RESULT / AUTH-STATE FLASH**.
Corrective integration CSS hides auth-dependent Header controls only while `data-dc-header-auth="checking"`; final guest/authenticated/member semantics are unchanged.

### Guest Header + login flow
User live-tested the public site without an existing session.
Observed:
- guest Header displayed `Вступить в клуб` + `Войти`;
- Google login completed successfully;
- after authentication as an active Member, flow returned into the authenticated club surface/Board as expected;
- logout/exit also worked in the observed flow.

Classification: **LIVE PASS** for guest Header, Google login handoff and ordinary Member post-login routing.

### Owner/Admin + Membership Review
User live-tested owner/admin surfaces after deploy #35.
Observed:
- `/workspace/admin/` opened inside the canonical Workspace shell;
- `/workspace/review/` opened inside the same shell without duplicate public navigation;
- role-specific items `MEMBERSHIP REVIEW` and `SYSTEM TOOLS` were visible for the owner/admin session;
- Membership Review rendered its closed-workspace review surface normally;
- System Tools rendered the owner/admin tool surface normally;
- Board remained subject to the existing Artifact-slot model; no unapproved unlimited owner/admin publication path was introduced.

Classification: **LIVE PASS** for owner/admin geometry, role-tool visibility and Review access in the observed session.

### Mobile Join / DC-9 / Application
User live-tested `/join/` and `/join/apply/` on a phone-width browser after deploy #35.

Observed on `/join/apply/`:
- canonical mobile Header rendered with brand, `Вступить в клуб` CTA and burger;
- application/authentication content stayed within the viewport;
- text and authentication card were readable without observed horizontal clipping;
- consent controls remained within the viewport.

Classification: **LIVE PASS** for observed mobile Application responsive geometry in the logged-out state.

Observed on `/join/` picker:
- DC-9 sphere picker rendered as a single-column mobile list;
- progress state remained visible;
- typography and sphere cards stayed within the viewport;
- no horizontal clipping was observed;
- a large empty light band followed by a dark band appeared above the canonical Header in the captured mobile state.

Classification: **PARTIAL PASS + BUG OBSERVATION / MOBILE JOIN TOP GAP**.
Do not assume root cause from the screenshot alone. A legacy `/script.js` ownership question was investigated, but removal is not considered a proven safe fix because historical contracts indicate storage-guard/compatibility coupling. Any integration-only removal must be reverted or otherwise excluded until canonical persistence ownership is proven independently. Treat the top gap as its own observed layout defect until retested after an evidence-backed corrective change.

Observed inside an actual DC-9 question on mobile:
- long scene copy wrapped correctly;
- quote/highlight treatment remained within the viewport;
- answer choices A–D rendered in one column;
- chosen answer stayed visibly selected;
- progression button remained available without horizontal clipping.

Classification: **LIVE PASS** for the observed mobile DC-9 inner question/answer flow.

UX note: skipping without an answer is already blocked by the canonical scene owner. However, fast tapping can create a short moment of uncertainty between answer selection and reaction/continue state. Classify as **UX POLISH / NEXT RESULT**, not as a flow blocker: preserve immediate selected-state feedback and consider a lightweight `выбрано / можно продолжать` cue rather than a new modal system.

A timed `ПОДДЕРЖАТЬ ДЕГРАДАЦИЮ` prompt appeared during active DC-9 completion on mobile. Classification: **BUG CURRENT RESULT / CONTEXTUAL INTRUSION**. Support mechanics may remain elsewhere, but the timed support prompt should not interrupt active `/join/*` assessment flow.

The consent banner itself is not classified as a responsive defect; it intentionally occupies the lower viewport until the user chooses an analytics-consent option. Consent UX must preserve equally simple acceptance and refusal; any future wording polish belongs outside the current membership semantics.

### Guest 9/9 → Result → Application boundary
The user completed DC-9 as a guest in the live browser session and reached the result page with `9 / 9` and a complete map.
Observed:
- all nine spheres completed;
- `/join/result/` rendered the completed map;
- the `05 / ДАЛЬШЕ` block offered `ВСТУПИТЬ В КЛУБ`;
- that action reached canonical `/join/apply/`;
- Application correctly required Google authentication before submission.

The account available in that browser session was not controlled by the user, so the user intentionally did not complete Google login/application submission from that specific guest run.

Classification:
- **LIVE PASS** for guest DC-9 completion, 9/9 result, Join CTA and canonical Application auth boundary;
- **ACCEPTED / LOW RISK — MANUAL POST-LOGIN HANDOFF NOT REPEATED FOR THIS GUEST SESSION** for attaching this exact guest completion to an account and submitting Application.

This is not mislabeled as a manual LIVE PASS. Acceptance is based on the combination of: existing green auth/application contracts, prior real Google auth live evidence, previously verified live DB immutable-baseline functions/trigger, and the user's explicit decision not to repeat the account-specific handoff for this guest session. No additional user action is required for this item in the current QA pass unless new contradictory evidence appears.

### Owner/Admin System Tests A3
The read-only owner/admin test page reported `6 PASS / 1 FAIL`; only `A3 MEMBERSHIP APPLICATION` failed because `authenticated_insert_policy_present=false`.

Investigation against live Supabase shows this is a stale QA assertion, not a Membership Application production-flow defect:
- `/join/apply/` submits through canonical RPC `dc_submit_membership_application_v2`, not direct table INSERT;
- that RPC is `SECURITY DEFINER`;
- `authenticated` can execute it;
- `anon` cannot execute it;
- live `join_applications` RLS intentionally has SELECT policies but no authenticated direct-INSERT policy.

Classification: **QA TOOL DEFECT / STALE ASSERTION**, non-blocking for the product flow. Do not create a direct INSERT policy merely to turn A3 green. Reconcile the test assertion during QA-tool cleanup/G8 or in the smallest safe regression-maintenance change.

## Required sequential live retest
Do not close G7 from deploy success alone. Remaining sequence after the accepted 9/9 boundary:
1. live route/canonical/SEO integrity;
2. targeted regression confirmation where needed for the corrective-batch surfaces;
3. corrective batch for only evidenced live defects;
4. QA ledger reconciliation and G8 cleanup.

Already accepted/covered in this pass and not requiring another manual account run unless new contradictory evidence appears:
- Board slot/geometry;
- Artifact open/close and canonical destination, with return-context bug separately queued;
- guest Header/login/logout and Member → Board;
- owner/admin + Review surfaces;
- mobile Application geometry;
- mobile DC-9 inner question flow;
- guest DC-9 9/9 result → Application auth boundary;
- historical My Activity / My Artifacts / Board drag persistence evidence.

## Deferred / decision-required
Remain outside this technical batch unless explicitly decided:
- unlimited owner/admin/system-card publication;
- QA-MEM-004 historical course repeat-state product decision;
- final DC-9 onboarding/result/application copy and visual polish;
- answer-selection micro-feedback polish;
- compatibility-route deletion and old implicit/hash auth-preboot removal — G8 cleanup after live evidence;
- **post-QA Workspace navigation redesign:** move the current left Workspace sidebar/menu to a top navigation surface after G7/G8, preserving the same canonical Workspace shell ownership, role-aware items, identity ownership and route semantics. This is a NEXT RESULT / design-shell change, not part of the current QA bugfix batch and must not create a second simultaneous menu system.

## Closure path
`deploy #35 → sequential live QA → corrective batch for only evidenced live defects → reconcile canonical QA ledger → close/reclassify remaining P0/P1 → G8 cleanup → only then close this Result and open the separate pre-advertising content/visual Result.`

## Gate
Current gate remains **G7_RELEASE**. The production artifact is deployed, but the Result is not yet `DONE`, `VALIDATED`, or closed until corrective evidence and remaining route/SEO checks are complete.
