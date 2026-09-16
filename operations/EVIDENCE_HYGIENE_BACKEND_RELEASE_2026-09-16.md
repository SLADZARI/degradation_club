---
artifactId: dementor-club.evidence.evidence-hygiene-backend-release-2026-09-16
project: dementor-club
documentType: QA_EVIDENCE
status: APPROVED_EVIDENCE
updated: 2026-09-16
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.evidence-hygiene-v1
issue: 201
productionCommit: b68cd84bd284e599f3adcce46659e4654e23d05d
backendDeployRunId: 35150249462
backendDeployStatus: SUCCESS
migrationApplied: true
pagesDeployAuthorized: false
---

# Evidence Hygiene v1 · backend production release evidence

## Authorization boundary

Project owner explicitly authorized **backend deploy only** for #201 / Evidence Hygiene v1.

Authorized production source:

`dementor-club-production@b68cd84bd284e599f3adcce46659e4654e23d05d`

Pages deploy remained separately unauthorized throughout this step.

## Preflight

Before backend mutation:

- production head = `b68cd84bd284e599f3adcce46659e4654e23d05d`;
- active Result = `dementor-club.result.evidence-hygiene-v1 v0.3 / G7_RELEASE`;
- G7 merge evidence existed at `operations/EVIDENCE_HYGIENE_G7_MERGE_2026-09-16.md`;
- production Supabase ledger ended at `20260914090000_board_public_activity_read_v1`;
- tracked production tree contained exactly one pending migration after that point: `20260916213500_evidence_hygiene_v1.sql`;
- no additional pending migration or migration drift was observed.

## Canonical backend workflow

Workflow: `Deploy Dementor Supabase Production`

- GitHub Actions run: `35150249462`
- run number: `2`
- trigger: `workflow_dispatch`
- release confirmation: `APPROVED`
- branch: `dementor-club-production`
- exact checked-out SHA: `b68cd84bd284e599f3adcce46659e4654e23d05d`
- remote production SHA during workflow: `b68cd84bd284e599f3adcce46659e4654e23d05d`
- conclusion: `SUCCESS`

The workflow drift guard reported:

- aligned before: `55`
- remote max before: `20260914090000`
- pending before: `20260916213500`

Dry-run reported exactly one migration:

`20260916213500_evidence_hygiene_v1.sql`

The tracked migration was then applied through canonical `supabase db push --linked`.

Post-apply release contract reported:

- aligned after: `56`
- remote max after: `20260916213500`
- pending after: `none`

Telegram worker deployment was explicitly skipped by the workflow. The existing function remained untouched.

## Production migration ledger

Before:

`20260914090000_board_public_activity_read_v1`

After:

`20260916213500_evidence_hygiene_v1`

`migrationApplied=true`

## Backend smoke · read-only production verification

Verification after migration intentionally used read-only catalog/read-model queries. No manual production Artifact was created for smoke testing and no ad-hoc DDL/DML mutation was performed.

### Canonical Artifact creation RPC

Production exposes one canonical signature:

`dc_create_artifact_draft_v1(text,text,text,timestamptz,timestamptz,text)`

Observed contract:

- six arguments with five trailing defaults, preserving calls that omit `p_source_ref`;
- argument names include canonical sixth `p_source_ref`;
- `authenticated` has EXECUTE;
- `anon` does not have EXECUTE;
- deployed function contains the OWNER_ADMIN QA provenance guard;
- deployed function requires the canonical lowercase `qa:` prefix for non-null QA provenance;
- `source_ref` is written at Artifact creation.

No production write-test Artifact was created solely to prove the rejection path; the deployed function definition plus G6 acceptance evidence establish the unauthorized-QA guard without introducing new operational evidence into production.

### Public Activity read model

Production signature remains:

`dc_public_activity_read_v1(integer,timestamptz,uuid)`

Observed contract:

- result shape remains the existing 15-field public Activity contract;
- `anon` and `authenticated` retain EXECUTE;
- deployed definition contains `(a.source_ref is null or a.source_ref not like 'qa:%')`;
- keyset predicate `(a.published_at,a.id) < (p_before_published_at,p_before_id)` remains present;
- ordering remains `a.published_at desc,a.id desc`.

Live read-only smoke returned:

- first page: `3` ordinary eligible rows;
- QA rows in first page: `0`;
- normal rows in first page: `3`;
- next page: `0` because only three current eligible rows existed at verification time;
- pagination overlap: `0`.

Differential QA exclusion was already proven in the exact G6 candidate with an explicit QA fixture; production verification confirms the same exclusion is present in the deployed canonical read owner while normal production rows remain eligible.

## Scope integrity

The tracked migration does not perform a migration-time historical rewrite of existing Artifact `source_ref` rows. The historical rule remains:

`pre-cutover evidence may contain QA/internal activity`

The backend release did not introduce unrelated Membership, DC-9, Telegram, Current Program, lifecycle or RLS semantic changes. Telegram Edge Function deployment did not run.

## Remaining release boundary

- `productionMergeAuthorized=true`
- `backendDeployAuthorized=true`
- `migrationApplied=true`
- `pagesDeployAuthorized=false`
- Pages deploy has not been executed for this Result;
- live browser retest has not been performed;
- G8 remains open;
- issue #201 remains open.

**G7 RELEASE / BACKEND DEPLOYED + VERIFIED / PAGES LOCKED.**

`BACKEND DEPLOY ≠ PAGES DEPLOY ≠ LIVE RETEST ≠ G8`
