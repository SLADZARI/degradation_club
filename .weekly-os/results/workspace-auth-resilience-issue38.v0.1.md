---
artifactId: dementor-club.result.workspace-auth-resilience-issue38
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G4_PASS
status: APPROVED
workStatus: WAITING
version: 0.1
updated: 2026-10-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 38
parentStage2Issue: 237
ownerDecisionRelay: https://github.com/SLADZARI/degradation_club/issues/38#issuecomment-6361599466
g4Status: PASS_LIMITED_CODE_ONLY_TWO_WORKSPACE_FILES
productionBaseRef: dementor-club-production
productionBaseCommit: cde332779ab0e256dd1e498660d6fa651e91846e
plannedCandidateBranch: fix/workspace-auth-resilience-issue38-20261023
activeIntegrationBranch: null
implementationStartAuthorized: true
sourceCandidatePreparationAuthorized: true
schemaChangeImplementationAuthorized: false
liveDatabaseMutationAuthorized: false
liveHostMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
changeControlRequired: true
---

# Workspace #38 · P0 optional-query resilience, no speculative enrollment · OWNER LIMITED G4

## Decision scope (not a release)

Owner explicitly authorized this **single two-file source-only G4** in the active conversation, relayed verbatim and bounded by Lead in [#38 owner-decision relay](https://github.com/SLADZARI/degradation_club/issues/38#issuecomment-6361599466). A Lead GitHub relay is not a distinct source/data/VM phase signature; authorization is ONLY for this code preparation. It is not a decision to merge, deploy, alter Cloud Auth or migrate Postgres.

**Exactly TWO implementation files allowed, based on original frozen production SHA `cde332779ab0e256dd1e498660d6fa651e91846e`:**

1. `workspace/workspace.js`: mandatory bounded `getSession`, `getUser`, `profiles`; optional `dc_system_memberships`, `dc_role_assignments`, `dc_entity_assignments`, courses, orders, DC9 history, Board and Work module reads each bounded/isolate failures independently; per-module one-at-a-time Retry; preserve verified Profile/Club/deep-link routing when optional backends time out; unavailable means **unknown**, not zero rows or new membership. Unknown membership/role/assignments must fail closed, hide Owner/Member/Work actions/sidebar, and show `СТАТУС ДОСТУПА НЕ ПРОВЕРЕН`.
2. `workspace/workspace-enhancements-v1.js`: `ensureEnrollment` shall not `INSERT` or `UPDATE` following failed/indeterminate `SELECT`; write error/timeout defers synchronization visibly while preserving independent local course state and existing `dc_progress_signals`, without inventing enrollment/certificate rights.

**Source-only author prep already independently inspected:** `/tmp/dc-f01-w48-workspace-20261023` disposable tree, exact base `cde332779...`, two modified tracked paths, `git diff --check` PASS, patch SHA256 `1baa550738dee14ed5230cc8b5e349efe6761e250ac24ad91c55b2abdd076ed1`. F-01 author fixture pass 16/16 baseline, 48/48 optional/roles, 6/6 sidebar, 2/2 stalled-query + deep-link; not independent G6 and not signed-in Google acceptance. Candidate file content must preserve this exact hash or report explicit delta/retest.

## File lease and serialization

- **ONE F-01/Lead code writer:** those two source files only; NO `.weekly-os` files in candidate code PR. Formal Result lives on semantic `dementor-club` branch, not under production source code diff.
- Current approved `dementor-club.result.pre-vm-webui-gate-correctives-v1` v0.3 remains **ACTIVE**, existing eight-file whitelist and Draft [PR #308](https://github.com/SLADZARI/degradation_club/pull/308) remain unchanged. This #38 candidate may have a separately isolated QA branch, but **may not become the active integration/release lane while PR308 owns it**. No second Board writer or code blending; Lead serializes later.
- Excluded: `auth/callback/index.html`, `profile/profile-v2.js`, `program-account-sync-v1.js`, all Board/Home PR308 files, SQL/RLS/GRANT/Storage/Edge, provider OAuth, Nginx/VM/GoTrue, ALPHA/BETA, game saves. No new public capabilities or changes to DC9 immutable first 9/9 and reviewed membership.

## Tests and release gates

**G5 source candidate:** exact Git commit, two-file only diff, `node --check`, site build, `git diff --check`; no paid CI starts without separate permission. Existing author synthetic regressions are historical, not fresh independent acceptance.

**G6 independent Q-01 after backend G4 v0.6 review queue:** Chrome+WebKit at 360/390px guest/member/owner, real private-owner link fail-close, valid profile + orders 403/timeout and missing `course_enrollments` 42P01, roles/membership/assignments ambiguous failures, Retry success and failure, no extra INSERT after read error, missing core user/profile remains fatal, lazy hash `#club` and Board/reload, no fake zero/empty history or privilege elevation. Verify **actual committed SHA**, not only disposable author clone. The real owner signed-in OAuth callback/workspace/Board stage is still UNKNOWN until a consented sanitized actual user trace; do not claim this source bug proves OAuth cause.

**Protected G7/G8:** requires Lead exact-SHA acceptance, independent QA evidence and **separate owner public release authorization**. No merge, deploy, Cloud/database/host action under this G4. Existing production remains live on prior source/Cloud. `G6_INDEPENDENT=NOT_RUN; G7=NO_GO; PRODUCTION_EFFECT=NONE`.
