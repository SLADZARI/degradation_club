---
artifactId: dementor-club.result.qa-portal-harmonization
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: DRAFT
version: 0.3
updated: 2026-09-05
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.2
---

# MP | Dementor Club | RELEASE | Portal QA Harmonization | v0.3

## Goal
Bring the current Dementor Club portal through pre-advertising QA while harmonizing existing implementation owners, routes and auth entry points without duplicate UI/navigation/auth/domain systems, silent semantic mutation or blind site → production merges.

## Status
**ACTIVE / G7_RELEASE / LIVE DB MIGRATED + VERIFIED / DEPLOY #34 LIVE / CURRENT PRODUCTION AHEAD OF LIVE / FINAL TECHNICAL BATCH PRODUCTION MERGED / NOT DEPLOYED**

Implementation branch: `result/qa-portal-harmonization`  
Current release branch: `release/qa-portal-harmonization-v02-batch-final`  
Production branch: `dementor-club-production`  
Current production HEAD: `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`  
Current live deployed HEAD: `723c5404d28530ae9805a76c4442daa0b6bedfcb`

## Authority / protected boundaries
- Workspace-specific approved authority: `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md`.
- Canonical QA ledger: `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`.
- Protected admission boundary: `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`.
- Protected member activation: `MEMBER_ACTIVE → FIRST_ARTIFACT_REQUIRED → MEMBER_ACTIVATED`.
- First complete DC-9 baseline is immutable; repeat attempts remain separate history.
- No new universal Activity entity/table is authorized; My Activity remains a projection of existing canonical data.
- Public login remains owned by canonical `global-header.js`; PKCE callback remains `/auth/callback/`; existing private/login gates must converge on the same provider handoff contract rather than creating a parallel auth flow.
- Artifact creation remains owned by the existing Board slot/composer flow; admin role does not silently imply unlimited publication or a second composer.
- MP_DSL v0.1 remains global DRAFT/REFERENCE; only explicitly approved Dementor Club local operating rules apply.

## Inherited verified history from v0.2
Version 0.2 remains the detailed evidence record for:
- implementation PRs #95–#104 and their G6 passes;
- first clean production release PR #105 / readiness #739;
- live immutable DC-9 baseline migration + corrective migration and database verification;
- deploy #33;
- real Safari Google failure and provider-handoff investigation;
- Safari correction PRs #108/#109, readiness #750 and deploy #34;
- real Safari login + logout/relogin LIVE PASS;
- My Activity LIVE PASS;
- My Artifacts active/archive history LIVE PASS;
- Board drag/reposition persistence LIVE PASS;
- Board Artifact-slot discoverability correction PRs #110/#111 and readiness #753.

No meaning from those verified sections is changed by v0.3.

## Post-v0.2 integration convergence
After production `96d16391a60f8e400ff07f90f3d6a864fb861776` was merged but intentionally not deployed, current-Result audit continued without changing live production.

### Integration package A — Board/mobile regression locking
PR #112 was merged to `dementor-club-site` as `aa562b7ac8611242c155b93752be067675f1d365` after G6 #755 PASS.

The package strengthened existing regression coverage for:
- Board Artifact-slot discoverability;
- mobile Join/DC-9 geometry;
- mobile Application form geometry.

It did not introduce a second Board composer or new membership semantics.

### Integration package B — active-route + auth-owner convergence
Runtime inventory found two current-Result drift classes that were safe to correct without a Change Proposal.

1. **Artifact detail active destinations** still referenced compatibility routes from a current private surface.
Canonicalized to:
- Board → `/workspace/board/`;
- non-member gate → `/join/`.

Compatibility routes themselves remain available for migration and G8 cleanup; they were not deleted inside G7.

2. **Google OAuth provider handoff** was Safari-safe in Public Header but several existing user-facing auth owners still omitted explicit account selection.
Existing owners were converged on the same PKCE/provider contract using `prompt=select_account`:
- `community-runtime-v1.js` — shared Board / Artifact / Application auth helper;
- `workspace/workspace.js` — Workspace guest gate;
- `workspace/owner-admin-gate-v1.js` — OWNER_ADMIN gate;
- `workspace/review/review.js` — Membership Review guest gate;
- `required-auth-v1.js` — authenticated interactive-surface gate.

`global-header.js` already had this contract from the prior Safari correction and remained the public login owner.

`dementor-auth-preboot-v1.js` was inspected separately. It does not initiate Google OAuth and current `/join/` does not load it. Its implicit/hash compatibility behavior was not expanded; it is a G8 cleanup candidate.

Existing validators were extended rather than duplicated:
- provider-handoff validation now covers all published Google login owners and still verifies real Supabase `/authorize` → Google redirect behavior;
- shell contract prevents active Artifact detail from regressing to compatibility Board/Join destinations.

Integration PR #113 contained exactly 9 files and passed full G6 **#767 PASS**, including:
- registry/routes/feature state;
- content readiness;
- visual contract;
- DC-9 immutable baseline contract;
- production build;
- analytics + consent;
- canonical shell integration;
- built-JS syntax;
- real Google OAuth provider handoff;
- Chromium browser/Workspace recovery;
- My Artifacts history;
- WebKit auth regression;
- production route manifest;
- production artifact release guard.

PR #113 merged to `dementor-club-site` as `beb54447dd1a2ece0bd8fde5a2773b5bcaf3479a`.

## Final clean production candidate
The final release branch was created directly from current production `96d16391a60f8e400ff07f90f3d6a864fb861776`; the historical `dementor-club-site` divergence was not merged wholesale.

Release branch:
`release/qa-portal-harmonization-v02-batch-final`

Candidate commit:
`0855386b7e3dc8cf81447cee4e90ad51ce6cb9d2`

Candidate tree:
`ac8217ded93ecbdfe8aa630e764d99ce0435a7e5`

The candidate projected the exact 9 G6 #767-tested blobs onto the production tree.

Compare against production baseline:
- **1 commit ahead**;
- **0 behind**;
- **exactly 9 changed files**;
- no temporary or unrelated files in the final branch diff.

Changed files:
1. `community-runtime-v1.js`
2. `community/artifact/artifact.js`
3. `community/artifact/index.html`
4. `required-auth-v1.js`
5. `scripts/validate-google-oauth-handoff.mjs`
6. `scripts/validate-shell-contract.mjs`
7. `workspace/owner-admin-gate-v1.js`
8. `workspace/review/review.js`
9. `workspace/workspace.js`

Production PR #114 passed full Production Release Readiness **#769 PASS**.

PR #114 merged to `dementor-club-production` as:
`6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`

The production merge commit points to the exact same tree as the validated candidate:
`ac8217ded93ecbdfe8aa630e764d99ce0435a7e5`

Therefore readiness #769 validated the exact content tree now at the production branch HEAD.

## Current release boundary
`commit ≠ merge ≠ deploy ≠ live-validated`.

Current facts:
- live DB migrations: **APPLIED + VERIFIED**;
- current live deployed HEAD `723c5404...`: **DEPLOYED by run #34**;
- current production HEAD `6a7c4d61...`: **NOT DEPLOYED**;
- Board slot discoverability correction is included in current production HEAD but is not yet live;
- final 9-file active-route/auth-owner convergence batch is included in current production HEAD but is not yet live;
- Production Release Readiness #769: **PASS** on the exact production content tree;
- no Pages deploy has been authorized for `6a7c4d61...` in this release step.

The next live mutation still requires explicit user deploy authorization.

## Required post-deploy sequential live retest
Do not mark the Result RELEASED or LIVE PASS solely from merge/readiness evidence. After an explicitly authorized deploy of `6a7c4d61...`, retest the combined production delta sequentially:

1. production deploy resolves to exact expected commit/tree;
2. Board slot control exposes the existing canonical Artifact entry/management surface for free/occupied/no-slot states;
3. Artifact detail top/back, archive completion and dynamic Board actions resolve to `/workspace/board/` and do not depend on `/community/board/` as an active destination;
4. Artifact non-member gate resolves to canonical `/join/`;
5. real Safari public Google login still completes PKCE callback after the combined deploy;
6. Community/Application/Artifact Google login uses account selection and returns to the intended canonical surface;
7. Workspace guest login uses the same provider contract;
8. OWNER_ADMIN and Membership Review guest login gates use the same provider contract;
9. `required-auth-v1.js` interactive surfaces use the same provider contract;
10. public Header guest/authenticated/member identity states;
11. authenticated Workspace shell and guest boundary;
12. ordinary Member default → Community Board and Board root/child navigation including QA-MEM-033;
13. first Artifact spotlight without false activation;
14. owner-admin geometry without introducing an unapproved unlimited publication path;
15. mobile Join/DC-9 and Application surfaces;
16. immutable first-complete DC-9 baseline → repeat → application snapshot behavior;
17. live route/canonical/SEO integrity and production route count;
18. previously passed My Activity / My Artifacts / Board drag behavior remains regression-free.

Real Safari human validation remains required for the Safari-specific acceptance criterion; automated WebKit/provider-handoff checks are release evidence but do not replace the human Safari pass.

## Deferred / decision-required items
Do not pull these into the current technical release silently:
- unlimited owner/admin publication or a second system-card publisher — **DECISION REQUIRED**;
- product-state change for historical repeat-course behavior — separate product decision/current ledger item, not a silent bugfix;
- final DC-9 onboarding/result/application copy and visual polish items — better handled as a separate content/visual Result after current technical G7/G8 closure;
- compatibility-route deletion, implicit/hash auth preboot removal and other dead-runtime cleanup — G8 after live evidence.

## QA ledger reconciliation
The canonical QA ledger remains the closure ledger, but older sections can lag current merge/release evidence. Where wording conflicts with PROJECT / ARTIFACT_INDEX / this current Result / Git evidence, do not use stale ledger prose as release truth.

After live retest:
1. reconcile the ledger from observed evidence;
2. close or reclassify remaining P0/P1 items;
3. execute G8 cleanup;
4. remove only verified-stale Result/release branches, compatibility layers and duplicate/dead runtime;
5. promote durable lessons into regression gates where appropriate.

## Gate
Current gate remains **G7_RELEASE**.

No claim of `DONE`, `RELEASED`, `PRODUCTION READY` or full live validation is made until the new production HEAD is actually deployed and the required live sequence is evidenced.
