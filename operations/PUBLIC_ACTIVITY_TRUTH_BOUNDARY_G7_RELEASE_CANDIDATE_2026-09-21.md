---
artifactId: dementor-club.operations.public-activity-truth-boundary-g7-release-candidate-2026-09-21
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS
version: 1.0
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.public-activity-truth-boundary-v1
parentIssue: 228
correctiveIssue: 229
productionBaseline: 2b17d54faaf3eb3eafb287cef1211554b28871b2
releaseCandidateCommit: 40ba7ecea44206ded37ceb714d2becb6f2698c12
pullRequest: 230
validationRunId: 35608787457
validationRunNumber: 1224
validationConclusion: SUCCESS
---

# STAB-01 · G7 release candidate precheck

## Verdict

```text
G7 RELEASE CANDIDATE PRECHECK PASS
READY FOR RELEASE DECISION
```

This evidence does not authorize or perform production merge, live database mutation, backend deploy or Pages deploy.

## Fresh identity

```text
production =
2b17d54faaf3eb3eafb287cef1211554b28871b2

candidate =
40ba7ecea44206ded37ceb714d2becb6f2698c12

PR #230 =
OPEN / DRAFT / UNMERGED

production → candidate =
ahead 5
behind 0
changed files exactly 5

CI #1224 / 35608787457 =
SUCCESS on exact candidate SHA
```

## Clean RC boundary

The candidate branch was created directly from the exact production baseline, so no second release branch is required.

```text
releaseCandidateCommit =
40ba7ecea44206ded37ceb714d2becb6f2698c12
```

Exact production→RC files:

1. `public-activity-v1.js`
2. `scripts/validate-board-public-activity-browser.mjs`
3. `scripts/validate-board-public-activity-contract.mjs`
4. `scripts/validate-evidence-hygiene-browser.mjs`
5. `supabase/migrations/20260921134959_public_activity_truth_boundary_v1.sql`

Absent from RC:
- `README.md` reconciliation delta;
- reconciliation evidence documents;
- Board Relations implementation delta;
- unrelated migrations;
- `dementor-club-site` staging debt.

The RC does not depend on `dementor-club-site`.

## Supabase production preflight — read only

Canonical production project:

`mmekfydwbvptbdatwitj`

Read-only migration ledger comparison:

```text
candidate migration files = 58
live migrations = 57

latest live =
20260918094000_board_relations_v1

exact pending =
20260921134959_public_activity_truth_boundary_v1.sql

extra pending =
none

remote-only migrations =
none

version/name drift =
none
```

All 57 live migration versions align to local candidate migration versions and names.

No Supabase mutation was performed.

## Canonical dry-run capability

The canonical workflow `Deploy Dementor Supabase Production` contains:

```text
supabase migration list --linked
node scripts/validate-supabase-release-contract.mjs --migration-status ...
supabase db push --linked --dry-run
supabase db push --linked
```

However, the workflow exposes no dry-run-only input or job path. A manual dispatch that reaches the dry-run step will continue to `supabase db push --linked` when pending_count != 0.

Because:

```text
liveDatabaseMutationAuthorized = false
```

the canonical workflow was NOT dispatched.

Therefore:

```text
dryRunResult =
NOT_EXECUTED_NO_SAFE_DRY_RUN_ONLY_PATH
```

The read-only ledger comparison proves the same pending-set boundary expected by the workflow validator:

```text
pending_count = 1
pending_versions = 20260921134959
remote_max_version = 20260918094000
```

No claim is made that the Supabase CLI dry-run itself was executed.

## Product/schema boundary

```text
schema expansion = NO
new table = NO
new field = NO
new enum = NO
new generic visibility/editorial state = NO
semantic mutation = NO
staging dependency = NO
```

The technical corrective migration only replaces/restricts the existing `dc_public_activity_read_v1` behavior.

## Release authorization boundary

Still false:

```text
liveDatabaseMutationAuthorized = false
productionMergeAuthorized = false
productionDeployAuthorized = false
```

PR #230 remains draft and unmerged. Production branch and live Supabase remain unchanged.

## Gate

```text
projectStage = RELEASE
gate = G7_RELEASE
gateReadiness = READY_FOR_RELEASE_DECISION
```

STOP pending owner release authorization.
