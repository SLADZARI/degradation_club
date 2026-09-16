---
artifactId: dementor-club.result.evidence-hygiene-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: PRODUCTION_MERGED_DEPLOY_LOCKED
version: 0.3
updated: 2026-09-16
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: .weekly-os/results/evidence-hygiene-v1.v0.2.md
---

# MP | Dementor Club | Evidence Hygiene v1 | Result v0.3

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
Owner authorized merge only. PR #216 was moved to Ready without changing head/base and merged using a merge commit with expected-head lock on the exact G6 candidate.

Production merge commit:

`b68cd84bd284e599f3adcce46659e4654e23d05d`

Parents:
1. `0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`
2. `0a9687266aa27ea2bd40fa12099052e1308b6ae2`

`productionAncestryVerified=true`

G7 evidence: `operations/EVIDENCE_HYGIENE_G7_MERGE_2026-09-16.md`

## Release locks
- `productionMergeAuthorized=true`
- `backendDeployAuthorized=false`
- `pagesDeployAuthorized=false`
- `productionDeployAuthorized=false`
- migration `20260916213500_evidence_hygiene_v1.sql` remains unapplied;
- no backend verification after migration exists yet;
- no Pages deploy exists for this Result;
- no production live sequential retest exists yet;
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
**G7 RELEASE / PRODUCTION MERGED / DEPLOY LOCKED.**

Next step requires separate owner authorization for backend-first release.

`MERGE ≠ BACKEND DEPLOY ≠ PAGES DEPLOY ≠ LIVE RETEST ≠ G8`
