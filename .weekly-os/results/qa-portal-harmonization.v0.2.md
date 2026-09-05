---
artifactId: dementor-club.result.qa-portal-harmonization
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: DRAFT
version: 0.2
updated: 2026-09-05
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
---

# MP | Dementor Club | RELEASE | Portal QA Harmonization | v0.2

## Goal
Bring the current Dementor Club portal through pre-advertising QA while progressively harmonizing implementation with the project kernel and approved local operating rules, without duplicate UI/navigation/auth/domain systems or silent semantic mutation.

## Status
**ACTIVE / G7_RELEASE / PRODUCTION MERGED / NOT DEPLOYED / LIVE DB UNCHANGED**

Implementation branch: `result/qa-portal-harmonization`  
Release branch: `release/qa-portal-harmonization-v02`  
Production branch: `dementor-club-production`

## Authority / protected boundaries
- Workspace-specific approved authority: `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md`.
- Canonical QA ledger: `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`.
- Protected admission boundary: `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`.
- Protected member activation: `MEMBER_ACTIVE → FIRST_ARTIFACT_REQUIRED → MEMBER_ACTIVATED`.
- First complete DC-9 baseline is immutable; repeat attempts remain separate history.
- No new universal Activity entity/table is authorized; My Activity is a projection of existing canonical data.
- MP_DSL v0.1 remains global DRAFT/REFERENCE; only explicitly approved Dementor Club local operating rules apply.

## Implemented coherent packages
All related implementation stayed inside one active Result/integration branch and was individually G6-validated before site merge:

1. PR #95 — canonical Russian public header/auth identity — G6 #715 PASS.
2. PR #97 — canonical application auth handoff — G6 #718 PASS.
3. PR #98 — direct DC-9 result → application — G6 #720 PASS.
4. PR #99 — merged DC-9 intro/sphere picker — G6 #722 PASS.
5. PR #100 — canonical private Workspace shell + Member activation spotlight — G6 #727 PASS.
6. PR #101 — immutable first-complete DC-9 baseline — G6 #729 PASS.
7. PR #102 — Community participation → My Activity projection — G6 #732 PASS.
8. PR #103 — WebKit auth regression gate — corrected G6 #735 PASS; first #734 failure was a mobile-burger test interaction defect, not runtime auth evidence.
9. PR #104 — My Artifacts archive-history harmonization — G6 #737 PASS.

Source-backed no-op: current `/join/` already opens directly on the nine-sphere picker and runtime defaults to `renderPicker()`; no redundant pre-DC-9 confirmation/start owner remains, so no parallel fix was introduced.

## Clean production candidate evidence
Current production baseline before this release candidate:
`337f5bc5ad92a1e18ab49dfafc093a23ec4542ac`.

Important baseline fact: production already contained Batch 05 plus the earlier PR #95 transfer via PR #96, both not deployed. The v0.2 release therefore did **not** blind-merge `dementor-club-site` into production and did not duplicate PR #95.

Release candidate:
- branch: `release/qa-portal-harmonization-v02`;
- candidate commit: `e42de43fe637225bc4101095b67229bf8328d196`;
- exactly **1 commit ahead / 0 behind / 24 whitelisted files** from the current production baseline;
- production PR: **#105**;
- full Production Release Readiness: **run #739 PASS**.

Run #739 passed:
- registry/routes/feature state;
- content readiness;
- visual contract;
- DC-9 immutable baseline contract;
- production build;
- analytics + consent guard;
- canonical shell ownership;
- built-JS syntax;
- Chromium Workspace/browser regression;
- My Artifacts active/archive regression;
- WebKit auth regression;
- route manifest;
- production artifact release guard.

PR #105 merged to `dementor-club-production` as:
`1f383f2c2fe020ce8839286ab56ee29436dbf569`.

## Pre-deploy verification evidence — 2026-09-05

A final non-mutating G7 check confirmed:
- current `dementor-club-production` HEAD remains `1f383f2c2fe020ce8839286ab56ee29436dbf569`;
- that production merge commit points to tree `7eba86a036e8fe3ecd588c68accfb6dd9cdefa79`;
- the validated release candidate `e42de43fe637225bc4101095b67229bf8328d196` points to the **same tree** `7eba86a036e8fe3ecd588c68accfb6dd9cdefa79`, so run #739 validated the exact production content tree now awaiting deployment;
- live Supabase still has no `dc_first_complete_baseline_v1(uuid)`, no `dc_lock_join_application_baseline_v1()` and no `dc_join_application_first_baseline_v1` trigger; live DB therefore remains unchanged by this Result;
- the canonical QA ledger §17 still contains stale pre-PR-#105 wording that says the current packages are not merged to production and that the clean production candidate is still pending. Where that wording conflicts with `PROJECT.json`, `ARTIFACT_INDEX.json`, this Result and Git evidence, it is bookkeeping debt rather than current release state. It must be reconciled from live evidence during the mandatory ledger update after release and before Result closure/G8 completion.

No production deployment or database mutation was performed by this verification.

## Current release boundary
`commit ≠ merge ≠ deploy`.

The production branch now contains the validated v0.2 candidate, but **live production is still unchanged** because no deploy was triggered.

The migration `supabase/migrations/20260904171500_dc9_immutable_first_baseline_v1.sql` is present in production code but is **NOT applied to live Supabase**.

No live database mutation and no GitHub Pages deployment may occur without explicit user authorization.

## Acceptance criteria state
Implementation/G6 criteria are satisfied for the current technical cluster. Result is not complete until post-release live evidence exists for the relevant surfaces.

Required live retest after an explicitly authorized release:
- real Safari Google auth/callback;
- DC-9 first baseline → repeat → application snapshot;
- public Header/auth-aware states;
- authenticated private Workspace shell and guest boundary;
- ordinary Member default → Community Board;
- Board root/child navigation including QA-MEM-033;
- first Artifact spotlight without false activation;
- My Activity response/reaction/Artifact projection;
- My Artifacts active + archived history including archived `гусь`;
- Board spatial behavior / drag-reposition;
- owner-admin geometry;
- mobile Join/application surfaces;
- live route/canonical/SEO integrity.

## Next gate
Current gate: **G7_RELEASE**.

Next action requires explicit user authorization for the live release steps. If authorized, sequence is:
1. apply the validated Supabase baseline migration;
2. deploy current `dementor-club-production` through the existing manual production workflow;
3. perform live sequential retest;
4. update the canonical QA ledger from evidence, including removal of stale §17 pre-release wording;
5. move to G8 cleanup only after live results are known.

Until that authorization, stop before live DB mutation and deploy.
