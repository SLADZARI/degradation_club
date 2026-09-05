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
**ACTIVE / G7_RELEASE / LIVE DB MIGRATED + CORRECTED / PRODUCTION MERGED / PAGES DEPLOY DISPATCH PENDING**

Implementation branch: `result/qa-portal-harmonization`  
Release branch: `release/qa-portal-harmonization-v02-fix1`  
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

## Original clean production candidate evidence
Current production baseline before the original release candidate:
`337f5bc5ad92a1e18ab49dfafc093a23ec4542ac`.

Important baseline fact: production already contained Batch 05 plus the earlier PR #95 transfer via PR #96, both not deployed. The v0.2 release therefore did **not** blind-merge `dementor-club-site` into production and did not duplicate PR #95.

Original release candidate:
- branch: `release/qa-portal-harmonization-v02`;
- candidate commit: `e42de43fe637225bc4101095b67229bf8328d196`;
- exactly **1 commit ahead / 0 behind / 24 whitelisted files** from the then-current production baseline;
- production PR: **#105**;
- full Production Release Readiness: **run #739 PASS**;
- merged production commit: `1f383f2c2fe020ce8839286ab56ee29436dbf569`.

Run #739 passed registry/routes/feature state, content readiness, visual contract, DC-9 immutable baseline contract, production build, analytics + consent guard, canonical shell ownership, built-JS syntax, Chromium Workspace/browser regression, My Artifacts active/archive regression, WebKit auth regression, route manifest and production artifact release guard.

## G7 live release attempt and database correction — 2026-09-05

The user explicitly authorized the G7 live release with `деплой`.

Release sequence began with production SHA/schema preflight and then the validated DC-9 baseline migration was applied to live Supabase. **GitHub Pages deployment had not been started yet.**

### Live migration evidence
The first live migration was recorded by Supabase as:
- `20260905084028_dc9_immutable_first_baseline_v1`.

Post-DDL verification confirmed the baseline function, lock function and trigger existed; authenticated `assessment_runs` retained `SELECT + INSERT` but not `UPDATE/DELETE`; `anon` and `authenticated` could not execute the baseline function while `service_role` could.

### Runtime defect discovered before Pages deploy
A real PostgreSQL verification then exposed a defect that static migration validation had missed: the trigger function referenced nonexistent PostgreSQL function `jsonb_object_length(jsonb)`. This could have broken the first new Membership v2 application after release.

Pages deploy was therefore **stopped before execution**. No stale/known-defective site artifact was deployed.

### Corrective live migration
A semantic-preserving corrective migration was applied immediately and recorded as:
- `20260905084118_dc9_immutable_first_baseline_v1_fix_jsonb_key_count`.

The corrected trigger counts snapshot keys using `pg_catalog.jsonb_object_keys(...)` and preserves the exact approved 9-key gate, `SPHERE_GATE_INCOMPLETE`, immutable `candidate_snapshot`, and existing answer metadata.

Real live-history verification after correction:
- 4 profiles with assessment history;
- 3 profiles with complete first baselines;
- all 3 complete baselines contain exactly 9 keys;
- 2 complete baselines already have later runs/repeats after the immutable cutoff;
- 0 malformed complete baselines.

Supabase Security Advisor produced no new warning for the two new DC-9 functions. Existing unrelated legacy/public-function and archive warnings remain separate security debt.

### Git/live migration-history reconciliation
Because Supabase recorded the actual migration versions above, keeping the pre-release filename `20260904171500...` in Git would have created future migration-history drift.

The active Result therefore reconciled Git to live history without changing product semantics:
- canonical first migration renamed/aligned to `20260905084028...`;
- corrective migration `20260905084118...` added separately, preserving actual migration history;
- old pre-live migration timestamp removed;
- `validate-dc9-baseline-contract.mjs` extended to require the corrective migration and reject the invalid key-count call.

Integration PR **#106** merged to `dementor-club-site` as `6856baf23bc8a10e7c72ba31ee32fd05f89d745c` after full G6 **#745 PASS**.

### Corrected clean production candidate
A new clean release branch was created from the then-current production HEAD:
`release/qa-portal-harmonization-v02-fix1`.

Production compare was **0 behind** and contained only:
- `scripts/validate-dc9-baseline-contract.mjs` update;
- migration timestamp alignment recognized by GitHub as a rename;
- one corrective migration.

Production PR **#107** passed full Production Release Readiness **#747 PASS**, including DC-9 corrective migration contract, build, analytics, canonical shell, Chromium, My Artifacts, WebKit auth, route manifest and release guard.

PR #107 merged to `dementor-club-production` as:
`25dc061e292f79c996d2346c6d51fddc5245b642`.

Current production tree:
`0b5817431f1cfcebc9998802c86a31d20fa4f826`.

## Current release boundary
`commit ≠ merge ≠ deploy`.

Current facts:
- live Supabase baseline migration: **APPLIED**;
- live Supabase corrective migration: **APPLIED + VERIFIED**;
- corrected production code: **MERGED** at `25dc061e292f79c996d2346c6d51fddc5245b642`;
- corrected production readiness: **#747 PASS**;
- GitHub Pages production deploy: **NOT STARTED**.

The user has already explicitly authorized this exact release. No additional semantic/product decision is required before Pages deployment.

The remaining execution blocker is tooling capability: the connected GitHub toolset exposes repository writes, PR merge, Actions reads and reruns, but does not expose the `workflow_dispatch` action required by `.github/workflows/deploy-pages.yml`. Do not substitute a temporary trigger, old-run rerun, workflow mutation, or alternate hosting path merely to bypass that boundary.

Required manual dispatch parameters for the existing canonical workflow:
- workflow: `Deploy Dementor Production`;
- branch: `dementor-club-production`;
- `release_confirmation = APPROVED`.

## Acceptance criteria state
Implementation/G6 and live-DB release criteria are satisfied for the current technical cluster. Result is not complete until Pages deployment succeeds and post-release live evidence exists for the relevant surfaces.

Required live retest after Pages deployment:
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
Current gate remains **G7_RELEASE**.

Next execution sequence:
1. manually dispatch canonical `Deploy Dementor Production` from `dementor-club-production` with `release_confirmation = APPROVED`;
2. verify the deployment workflow completes successfully and that deployed content corresponds to production commit `25dc061e292f79c996d2346c6d51fddc5245b642`;
3. perform live sequential retest;
4. update the canonical QA ledger from evidence, including removal of stale §17 pre-release wording;
5. move to G8 cleanup only after live results are known.

Do not mark this Result `DONE`, `VALIDATED`, `RELEASED` or `PRODUCTION READY` until the required live evidence exists.
