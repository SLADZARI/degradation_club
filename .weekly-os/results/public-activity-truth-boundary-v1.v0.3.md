---
artifactId: dementor-club.result.public-activity-truth-boundary-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.3
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
integrationBranch: result/public-activity-truth-boundary-v1
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

# MP | Dementor Club | RELEASE | Public Activity Truth Boundary v1 | Result v0.3

## Goal

Restore the released product boundary:

```text
BOARD COMMUNITY VISIBILITY
≠
ANONYMOUS EDITORIAL / PUBLIC ACTIVITY
```

No released generic public/editorial eligibility owner exists for arbitrary Board Artifacts. Therefore this stabilization corrective is fail-closed rather than a new product model.

## Status

**ACTIVE / G7_RELEASE — RELEASE CANDIDATE PRECHECK PASS / READY FOR RELEASE DECISION**

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
