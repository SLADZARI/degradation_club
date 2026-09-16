---
artifactId: dementor-club.result.evidence-hygiene-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: BACKEND_DEPLOYED_PAGES_LOCKED
version: 0.4
updated: 2026-09-16
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: .weekly-os/results/evidence-hygiene-v1.v0.3.md
---

# MP | Dementor Club | Evidence Hygiene v1 | Result v0.4

## Goal
Отделить QA/internal evidence от реальной editorial/public activity без новой публичной ontology и без изменения product semantics Board / Current Program / Membership.

Invariant:

`QA EVIDENCE ≠ AUDIENCE EVIDENCE ≠ PROGRAMMING MOMENT`

## Validated candidate
- baseline: `dementor-club-production@0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`
- integration branch: `result/evidence-hygiene-v1`
- exact G6 candidate: `0a9687266aa27ea2bd40fa12099052e1308b6ae2`
- PR: `#216`
- Site Integrity: `#1197 / run 35141615180 / SUCCESS`
- G6 evidence: `operations/EVIDENCE_HYGIENE_G6_2026-09-16.md`

## G7 merge
Exact G6 candidate was merged to production through two-parent merge commit:

`b68cd84bd284e599f3adcce46659e4654e23d05d`

Parents:
1. `0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`
2. `0a9687266aa27ea2bd40fa12099052e1308b6ae2`

`productionAncestryVerified=true`

G7 merge evidence: `operations/EVIDENCE_HYGIENE_G7_MERGE_2026-09-16.md`

## Backend production release
Owner separately authorized **backend deploy only**.

Canonical workflow:

`Deploy Dementor Supabase Production`

- run: `#2 / 35150249462`
- event: `workflow_dispatch`
- exact source: `dementor-club-production@b68cd84bd284e599f3adcce46659e4654e23d05d`
- conclusion: `SUCCESS`
- ledger before: `20260914090000`
- only pending migration: `20260916213500_evidence_hygiene_v1.sql`
- ledger after: `20260916213500`
- pending after: `none`
- Telegram worker deploy: `SKIPPED`

Backend evidence: `operations/EVIDENCE_HYGIENE_BACKEND_RELEASE_2026-09-16.md`

## Backend smoke
Read-only production verification after migration confirms:

- canonical `dc_create_artifact_draft_v1` has the optional sixth `p_source_ref` while ordinary omitted-parameter calls remain resolvable through defaults;
- QA provenance remains OWNER_ADMIN-only and requires canonical lowercase `qa:` prefix;
- `source_ref` is written only through canonical Artifact creation behavior;
- canonical `dc_public_activity_read_v1` excludes `qa:%` rows;
- its 15-field result contract, keyset predicate and descending pagination order remain intact;
- ordinary production Activity rows remain eligible;
- no production write-test Artifact was introduced solely for verification.

The migration performs no migration-time historical Artifact rewrite and does not mutate Membership / DC-9 / Telegram / Current Program semantics.

## Release locks
- `productionMergeAuthorized=true`
- `backendDeployAuthorized=true`
- `migrationApplied=true`
- `pagesDeployAuthorized=false`
- `productionDeployAuthorized=false`
- Pages deploy has not been executed for this Result;
- live production browser retest has not been performed;
- G8 is not closed;
- issue #201 remains open.

## Implemented semantic boundary remains unchanged
- prospective QA Artifact provenance via existing `dc_artifacts.source_ref` and `qa:` prefix;
- canonical Artifact create owner only;
- QA analytics hard suppression before consent/GA4/Clarity boot;
- QA Artifact exclusion at canonical public Activity read model;
- `current-program-v1.js` unchanged;
- no Membership / DC-9 / Contribution / Programming / Telegram semantic mutation;
- no historical Artifact rewrite.

Historical rule remains:

`pre-cutover evidence may contain QA/internal activity`

## Gate
**G7 RELEASE / BACKEND DEPLOYED + VERIFIED / PAGES LOCKED.**

Next release step requires separate explicit owner authorization for Pages deploy.

`MERGE ≠ BACKEND DEPLOY ≠ PAGES DEPLOY ≠ LIVE RETEST ≠ G8`
