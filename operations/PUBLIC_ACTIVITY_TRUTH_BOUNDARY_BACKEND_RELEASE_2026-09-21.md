---
artifactId: dementor-club.operations.public-activity-truth-boundary-backend-release-2026-09-21
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS
version: 1.0
updated: 2026-09-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
---

# Public Activity Truth Boundary v1 — backend production release

Owner-authorized STAB-01 backend release completed successfully.

## Production identity

```text
productionCommit = 0852d2602df5593deead797b20c50daa36fe1c1c
releaseCandidate = 40ba7ecea44206ded37ceb714d2becb6f2698c12
pullRequest = #230
```

## Canonical Supabase production workflow

```text
workflow = Deploy Dementor Supabase Production
runNumber = #7
runId = 35621963033
jobId = 106406947641
conclusion = SUCCESS
branch = dementor-club-production
```

All required release steps passed:
- production gate
- exact production checkout / SHA proof
- Supabase project validation
- `supabase link`
- migration ledger inspection
- drift / ordering guard
- exact pending migration dry-run
- migration apply
- post-apply clean ledger verification

Telegram worker deployment was explicitly skipped.

## Migration evidence

Before apply:

```text
aligned = 57
remoteMax = 20260918094000
pending = 20260921134959
```

Dry-run:

```text
Would push exactly:
20260921134959_public_activity_truth_boundary_v1.sql
```

Apply:

```text
Applying migration 20260921134959_public_activity_truth_boundary_v1.sql
SUCCESS
```

Independent live Supabase verification after the workflow:

```text
liveMigrationCount = 58
liveLatestMigration = 20260921134959_public_activity_truth_boundary_v1
```

No extra pending migration or drift was introduced.

## Release state

```text
productionMergeCompleted = true
backendProductionDeployCompleted = true
liveMigrationApplied = true
telegramWorkerDeployed = false
pagesProductionDeployCompleted = false
liveRetestStatus = NOT_STARTED
```

Next required step: deploy the already-merged exact production commit through the canonical Pages production workflow, then run live anonymous + authenticated STAB-01 retest.
