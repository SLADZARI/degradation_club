---
artifactId: dementor-club.result.owner-admin-community-ops-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
workStatus: ACTIVE
version: 0.1
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentQa: BQA-23
integrationBranch: result/owner-admin-community-ops-v1
integrationBaseRef: dementor-club-production
integrationBaseCommit: cde332779ab0e256dd1e498660d6fa651e91846e
productionBaseCommit: cde332779ab0e256dd1e498660d6fa651e91846e
implementationStartAuthorized: true
schemaChangeImplementationAuthorized: true
schemaChangeBoundary: READ_ONLY_OWNER_ADMIN_PROJECTION_ONLY
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
changeControlRequired: false
g4Status: PASS
g4Evidence: operations/OWNER_ADMIN_COMMUNITY_OPS_G4_2026-09-30.md
gateReadiness: G5_BUILD_ACTIVE
---

# Owner Admin Community Ops v1 · Result v0.1

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
integration branch  = result/owner-admin-community-ops-v1
G4                  = PASS
G5                  = ACTIVE

live DB mutation    = NO
production merge    = NO
deploy              = NO
```
