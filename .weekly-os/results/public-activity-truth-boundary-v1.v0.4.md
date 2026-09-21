---
artifactId: dementor-club.result.public-activity-truth-boundary-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G8_CLEANUP
status: WAITING
version: 0.4
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 228
correctiveIssue: 229
scope:
  - BQA-11
  - BQA-12
  - BQA-13
integrationBranch: null
productionBaseCommit: 2b17d54faaf3eb3eafb287cef1211554b28871b2
implementationStartAuthorized: true
technicalCorrectiveMigrationAuthorized: true
liveDatabaseMutationAuthorized: true
productionMergeAuthorized: true
productionDeployAuthorized: true
semanticMutationRequired: false
changeProposalRequired: false
schemaExpansionAuthorized: false
---

# MP | Dementor Club | G8 | Public Activity Truth Boundary v1 | Result v0.4

## Goal

Restore the released product boundary:

```text
BOARD COMMUNITY VISIBILITY
≠
ANONYMOUS EDITORIAL / PUBLIC ACTIVITY
```

No released generic public/editorial eligibility owner exists for arbitrary Board Artifacts. Therefore this stabilization corrective is fail-closed rather than a new product model.

## Status

**WAITING / G8_CLEANUP — RELEASED / LIVE RETEST PASS / NO ACTIVE IMPLEMENTATION OWNERSHIP**

Parent: #228 — STABILIZATION.

Corrective: #229 — STAB-01 · Public Activity truth boundary · BQA-11/12/13.

## Production baseline

`dementor-club-production@2b17d54faaf3eb3eafb287cef1211554b28871b2`

Implementation branch must be created directly from this exact production commit because `dementor-club-site` contains unrelated reconciliation delta and is not the STAB-01 owner.

## Root corrective

Canonical public read owner:

`public.dc_public_activity_read_v1`

Until an explicit approved generic editorial eligibility owner exists:

```text
ordinary Member Artifact
club/publisher-scope Artifact
YouTube Board Artifact
private-image Board Artifact

+ Board publication

DOES NOT imply anonymous Home/Community Public Activity
```

Current Program v0 remains a separate reviewed composition and is not a generic Artifact whitelist.

## Scope boundaries

Allowed:
- one corrective migration replacing/restricting the existing public Activity read contract;
- narrow public Activity copy correction where existing wording becomes false;
- extension of existing public Activity / evidence-hygiene validators;
- targeted/browser/full CI evidence.

Not allowed:
- new table, field, enum, visibility level or generic editorial state;
- Current Program or ThingProjection semantic changes;
- Board publication owner changes;
- private Board media exposure;
- Membership/Auth/DC9/Application changes;
- Contribution, Project/Course creation, STAB-02+ work.

## Acceptance criteria

1. Board publication alone cannot make any generic Artifact anonymously readable through `dc_public_activity_read_v1`.
2. Publisher scope, media provider/type, YouTube capability and private image presence do not act as editorial eligibility.
3. Pagination cannot bypass the fail-closed boundary.
4. Anonymous Home/Community do not expose private Board storage paths or signed URLs.
5. Current Program v0 remains unchanged.
6. Authenticated Board publication/media lifecycle remains unchanged.
7. Existing YouTube media capability remains intact outside generic anonymous Artifact promotion.
8. Production→candidate diff contains only STAB-01-owned files.
9. Full Site Integrity passes exact candidate.
10. Stop at validated candidate; no live Supabase apply, production merge or deploy without separate owner authorization.

## Gate

`G6_VALIDATION`

Evidence will be attached after targeted validation, browser regression, full Site Integrity and exact production-baseline diff review.


## G6 validated candidate

```text
candidateCommit = 40ba7ecea44206ded37ceb714d2becb6f2698c12
pullRequest = 230
validationRunNumber = 1224
validationRunId = 35608787457
validationConclusion = SUCCESS
exactDiffFileCount = 5
```

Evidence:

`operations/PUBLIC_ACTIVITY_TRUTH_BOUNDARY_G6_2026-09-21.md`

Live production remains intentionally unchanged; the corrective migration is committed only in the candidate and is not present in the live migration ledger.

```text
gateReadiness = READY_FOR_CLEAN_RELEASE_DECISION
liveDatabaseMutationAuthorized = false
productionMergeAuthorized = false
productionDeployAuthorized = false
```

STOP at validated candidate. STAB-02 is not started.


## G7 release candidate precheck

```text
releaseCandidateCommit = 40ba7ecea44206ded37ceb714d2becb6f2698c12
pullRequest = 230
productionBaseline = 2b17d54faaf3eb3eafb287cef1211554b28871b2
exactDiffFileCount = 5
validationRunNumber = 1224
validationRunId = 35608787457
validationConclusion = SUCCESS
liveMigrationLedgerCount = 57
liveLatestMigration = 20260918094000_board_relations_v1
pendingMigration = 20260921134959_public_activity_truth_boundary_v1.sql
extraPendingMigrations = none
migrationDrift = none
dryRunResult = NOT_EXECUTED_NO_SAFE_DRY_RUN_ONLY_PATH
```

G7 evidence:

`operations/PUBLIC_ACTIVITY_TRUTH_BOUNDARY_G7_RELEASE_CANDIDATE_2026-09-21.md`

The canonical backend workflow contains a dry-run step but no dry-run-only execution path; dispatching it with one pending migration would continue to the apply step, so it was not run under the current no-live-mutation authorization.

```text
gateReadiness = READY_FOR_RELEASE_DECISION
liveDatabaseMutationAuthorized = false
productionMergeAuthorized = false
productionDeployAuthorized = false
```

STOP pending owner release authorization.


## Owner release authorization + execution checkpoint

Owner explicitly authorized release after G7 PASS.

PR #230 was marked ready and merged with expected head:

```text
RC = 40ba7ecea44206ded37ceb714d2becb6f2698c12
production merge commit = 0852d2602df5593deead797b20c50daa36fe1c1c
```

Post-merge production diff from the prior baseline contains the same exact five STAB-01 files and no unrelated staging/reconciliation delta.

Backend and Pages production release are authorized for the exact merged production commit. Live DB mutation is authorized only through the canonical Supabase production workflow; Telegram worker deployment remains excluded.

Canonical backend workflow dispatch could not be completed with the available tooling because the browser session was unauthenticated and the connected GitHub integration exposes no workflow_dispatch action.

Evidence:

`operations/PUBLIC_ACTIVITY_TRUTH_BOUNDARY_RELEASE_TOOLING_BLOCKER_2026-09-21.md`

```text
productionMergeCompleted = true
productionCommit = 0852d2602df5593deead797b20c50daa36fe1c1c
releaseExecutionStatus = BLOCKED_TOOLING_AUTH
backendWorkflowRunId = null
pagesWorkflowRunId = null
liveMigrationApplied = false
liveRetestStatus = NOT_STARTED
```

Owner authorization remains valid. Resume from the canonical backend workflow; do not apply the migration ad hoc.


## Backend production release

Owner-authorized backend release completed through the canonical workflow.

```text
productionCommit = 0852d2602df5593deead797b20c50daa36fe1c1c
workflow = Deploy Dementor Supabase Production
runNumber = 7
runId = 35621963033
jobId = 106406947641
conclusion = SUCCESS
```

Migration boundary:

```text
before = 57
pending = 20260921134959_public_activity_truth_boundary_v1
dryRun = exactly one pending migration
apply = SUCCESS
after = 58
latest = 20260921134959_public_activity_truth_boundary_v1
extraPending = none
drift = none
```

Telegram worker deployment was skipped.

Evidence:

`operations/PUBLIC_ACTIVITY_TRUTH_BOUNDARY_BACKEND_RELEASE_2026-09-21.md`

```text
productionMergeCompleted = true
backendProductionDeployCompleted = true
liveMigrationApplied = true
pagesProductionDeployCompleted = false
liveRetestStatus = NOT_STARTED
releaseExecutionStatus = BACKEND_RELEASED_PAGES_PENDING
```

Next checkpoint: canonical Pages production deploy for exact production commit, then live retest.


## Pages production deploy + anonymous live smoke

```text
workflow = Deploy Dementor Production
runNumber = 123
runId = 35622547055
conclusion = SUCCESS
productionCommit = 0852d2602df5593deead797b20c50daa36fe1c1c
artifactId = 10650177738
artifactDigest = sha256:9f3062f3cb0177b0b5319fdc17a7912e95fd973559c55773ef9dca91de573e9b
```

The build checked out the exact production commit and the deploy job created the Pages deployment for that same SHA.

Anonymous live smoke passed on Home and `/community/`:

- ordinary Board artifacts `Сайт за Еду` and `Новые связи - новая борда` are absent;
- Current Program remains present on Home;
- Community public editorial activity is empty rather than leaking Board publications;
- no obvious private Board media URL/token/storage-path strings were detected.

Evidence:

`operations/PUBLIC_ACTIVITY_TRUTH_BOUNDARY_PAGES_LIVE_SMOKE_2026-09-21.md`

```text
pagesProductionDeployCompleted = true
anonymousLiveSmoke = PASS
authenticatedBoardLiveRetest = PENDING
releaseExecutionStatus = LIVE_ANON_PASS_AUTH_PENDING
```

Do not close STAB-01 until authenticated Board live smoke confirms publication/media behavior remains intact.


## Production release + ownership handoff

```text
productionCommit = 0852d2602df5593deead797b20c50daa36fe1c1c
backendWorkflowRunId = 35621963033
backendWorkflowRunNumber = 7
backendWorkflowConclusion = SUCCESS
pagesWorkflowRunId = 35622547055
pagesWorkflowRunNumber = 123
pagesWorkflowConclusion = SUCCESS
liveMigrationLedgerCount = 58
liveLatestMigration = 20260921134959_public_activity_truth_boundary_v1
anonymousLiveSmoke = PASS
authenticatedLiveRetest = PASS
integrationBranch = null
status = WAITING
gate = G8_CLEANUP
```

Authenticated live evidence:

`operations/PUBLIC_ACTIVITY_TRUTH_BOUNDARY_AUTHENTICATED_LIVE_RETEST_2026-09-21.md`

STAB-01 is released and no longer owns active implementation. Parent stabilization #228 remains open.
