---
artifactId: dementor-club.result.owner-admin-community-ops-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: WAITING
workStatus: WAITING
version: 0.2
supersedes: 0.1
updated: 2026-10-20
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentQa: BQA-23
integrationBranch: null
pausedIntegrationBranch: result/owner-admin-community-ops-v1
pausedCandidateCommit: 93baa5dd38f1cbf24d40bfac8966b7411ef958c6
pausedPullRequest: 252
pauseReason: OWNER_PRIORITY_STAGE1_VM_MIGRATION
pauseDecision: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6302633113
integrationBaseRef: dementor-club-production
integrationBaseCommit: cde332779ab0e256dd1e498660d6fa651e91846e
productionBaseCommit: cde332779ab0e256dd1e498660d6fa651e91846e
implementationStartAuthorized: false
schemaChangeImplementationAuthorized: false
schemaChangeBoundary: READ_ONLY_OWNER_ADMIN_PROJECTION_ONLY
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
changeControlRequired: false
g4Status: PASS
g4Evidence: operations/OWNER_ADMIN_COMMUNITY_OPS_G4_2026-09-30.md
gateReadiness: G5_PAUSED_BY_OWNER
---

# Owner Admin Community Ops v1 · Result v0.2 — OWNER-PAUSED

## Owner decision / current permission (2026-10-20)

**WAITING / PAUSED BY OWNER at last known G5_BUILD.** [Owner decision](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6302633113) formally prioritizes Stage1 VM migration and suspends **further** implementation/integration for BQA-23. This is **NOT** rejection, rollback of historical G4/G5 evidence, G8 completion, merge, live acceptance or loss of work.

- Freeze existing implementation in **Draft PR [#252](https://github.com/SLADZARI/degradation_club/pull/252)** at `93baa5dd38f1cbf24d40bfac8966b7411ef958c6`; branch `result/owner-admin-community-ops-v1` remains as **parked resume source**, NOT an active integration owner. Do not delete/rebase/merge/deploy this PR during pause.
- G4 `PASS` is historical authorization. As of this owner decision, **implementationStartAuthorized=false**, including the previously scoped Owner Admin read-only projections. No production SQL, Cloud Auth, Nginx, VM or game writes.
- Q-01 independently recorded [G6 technical QA PASS **only within local/CI BQA-23 scope**](https://github.com/SLADZARI/degradation_club/pull/252#issuecomment-6236653950), not overall G6/role/privacy/security acceptance or G7 release.
- Stage1 site-only VM hosting [Draft #309](https://github.com/SLADZARI/degradation_club/pull/309) is **scope confirmed / G4 preparation authorized only**. It is NOT active implementation; original Cloud remains and MDAO/Dementor Live remain untouched.
- **Resume only** after owner reprioritization, Lead conflict audit, new explicit authority for this Result/branch and fresh source/CI/QA revalidation against the then-current production baseline.

## Original goal and prior authorized scope

## Goal

Remove DevTools/raw-UUID dependence from routine, already-authorized Community / Artifact Owner Admin operations.

The Result extends the existing canonical:

`/workspace/admin/` → SYSTEM TOOLS

with one bounded:

`COMMUNITY OPS / ARTIFACT ADMIN`

tool.

## Problem

BQA-23 is a confirmed operational UX gap.

Approved backend operations already work, but routine Owner Admin tasks are scattered between Artifact detail, hidden RPCs and manual DevTools calls.

The live example was Artifact slot capacity: the canonical grant RPC worked, but the operation required a raw profile UUID and manual browser RPC call.

## Existing-before-new inventory

Canonical shell:

- `workspace/admin/index.html`
- `workspace/admin/owner-admin-access-v1.js`
- canonical Workspace shell/sidebar.

Canonical slot mutation:

- `dc_admin_grant_artifact_slots_v1`.

Canonical capacity truth:

- `dc_member_entry_status_v1` formula;
- `dc_artifact_slot_grants`;
- `dc_artifacts`.

Canonical collaboration:

- `dc_artifact_invite_candidates_v1`;
- `dc_artifact_invite_v1`;
- `dc_artifact_participants_read_v1`;
- `dc_artifact_remove_participant_v1`;
- existing Artifact detail.

Canonical Artifact operation:

- `dc_close_artifact_v1`.

## Implementation shape

### DEV1 — backend/read contract

Only if required by UI:

1. add Owner Admin-only safe profile search projection;
2. add Owner Admin-only slot status/history projection using the same canonical capacity formula;
3. no new tables/views/state;
4. no mutation semantic changes;
5. static + local DB runtime validator.

### DEV2 — existing Admin surface

Extend System Tools with:

`/workspace/admin/community-ops/`

The page must:

- reuse canonical Workspace shell;
- reuse Owner Admin access guard;
- provide safe person lookup;
- show slot status/history;
- call canonical slot-grant mutation;
- provide Artifact search/state;
- call canonical close/archive;
- expose Idea roster and canonical invite/remove operations or hand off to canonical Artifact detail when that avoids duplicate ownership;
- never require raw UUID as the normal path.

## Acceptance criteria

1. Owner Admin can find a person by display name/nickname and safely distinguish ambiguous matches.
2. Slot status shows granted / consuming / available from server-owned truth.
3. Grant requires amount + reason + provenance, confirmation and post-write reread.
4. No duplicate UI submit can issue two grants from one click sequence.
5. Idea collaboration uses existing participation owners only.
6. Artifact close/archive uses `dc_close_artifact_v1` only.
7. CIRCLE privacy/no-oracle remains unchanged.
8. Ordinary Member and unauthenticated direct route cannot use the tool.
9. Desktop / 390 / 360 are usable.
10. Existing Workspace shell/sidebar remain the sole owners.
11. No direct table-edit controls.
12. Full exact-head Site Integrity PASS.

## Scope boundary

Not part of this Result:

- new membership controls;
- new role assignment UI;
- new DC-9/Application/review controls;
- new slot reward rules;
- BQA-15 relation selector scale;
- BQA-07 Contribution runtime;
- BQA-29 richer Idea brief.

## Current gate

```text
production baseline = cde332779ab0e256dd1e498660d6fa651e91846e
parked branch       = result/owner-admin-community-ops-v1
G4                  = PASS
G5                  = HISTORICAL / CURRENT EXECUTION PAUSED

live DB mutation    = NO
production merge    = NO
deploy              = NO
```
