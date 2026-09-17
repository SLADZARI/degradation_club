---
artifactId: dementor-club.result.evidence-hygiene-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: PAGES_VALIDATOR_CORRECTIVE_MERGED_PAGES_DEPLOY_LOCKED
version: 0.7
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: .weekly-os/results/evidence-hygiene-v1.v0.6.md
---

# MP | Dementor Club | Evidence Hygiene v1 | Result v0.7

## Goal
Отделить QA/internal evidence от реальной editorial/public activity без новой публичной ontology и без изменения product semantics Board / Current Program / Membership.

Invariant:

`QA EVIDENCE ≠ AUDIENCE EVIDENCE ≠ PROGRAMMING MOMENT`

## Original Evidence Hygiene release chain
- baseline: `dementor-club-production@0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`
- original G6 candidate: `0a9687266aa27ea2bd40fa12099052e1308b6ae2`
- PR #216
- Site Integrity `#1197 / 35141615180 / SUCCESS`
- initial production merge: `b68cd84bd284e599f3adcce46659e4654e23d05d`

Evidence:
- `operations/EVIDENCE_HYGIENE_G6_2026-09-16.md`
- `operations/EVIDENCE_HYGIENE_G7_MERGE_2026-09-16.md`

## Backend release — unchanged and already verified
- canonical workflow: `Deploy Dementor Supabase Production`
- run `#2 / 35150249462`
- conclusion `SUCCESS`
- migration `20260916213500_evidence_hygiene_v1.sql` applied
- post-ledger clean
- Telegram worker not deployed

Evidence:
`operations/EVIDENCE_HYGIENE_BACKEND_RELEASE_2026-09-16.md`

## Pages corrective #1 — merged
- candidate: `234ee1f67a9b579a1c50caec5a701f54d01d3774`
- PR #217
- Site Integrity `#1198 / 35159581757 / SUCCESS`
- production merge: `e8c8a1e3cac8aaf83e03696de8facd8167a29255`
- production ancestry verified

Evidence:
- `operations/EVIDENCE_HYGIENE_PAGES_CORRECTIVE_2026-09-17.md`
- `operations/EVIDENCE_HYGIENE_PAGES_CORRECTIVE_G7_MERGE_2026-09-17.md`

## Accidental legacy Pages incident
Documented separately and not counted as canonical #201 Pages release evidence:

`operations/EVIDENCE_HYGIENE_PAGES_CONTROL_PLANE_INCIDENT_2026-09-17.md`

## Canonical Pages run #118 — blocked before deploy
Owner-authorized canonical Pages attempt for exact production `e8c8a1e3...`:
- workflow: `.github/workflows/deploy-pages.yml`
- run number: `#118`
- run id: `35161462557`
- exact checkout: `e8c8a1e3cac8aaf83e03696de8facd8167a29255`
- conclusion: `FAILURE`
- deploy job: `SKIPPED`
- Pages artifacts produced: `0`

Root cause was release-validator drift, not product runtime regression.

Evidence:
`operations/EVIDENCE_HYGIENE_PAGES_VALIDATOR_DRIFT_CORRECTIVE_2026-09-17.md`

## Pages validator corrective #2 — validated and merged
Corrective candidate:

`842d96b07b7ef20f298578e078467148cfa27675`

Validation:
- Site Integrity `#1199`
- run id `35161854100`
- exact head `842d96b07b7ef20f298578e078467148cfa27675`
- conclusion `SUCCESS`
- all 51 validation steps passed

PR #218:
- final state: CLOSED / MERGED / READY
- base before merge: `e8c8a1e3cac8aaf83e03696de8facd8167a29255`
- exact head: `842d96b07b7ef20f298578e078467148cfa27675`
- merge commit / current production head: `374defbe583fac0839a43611b151d1104b47a42b`

Exact merge parents:
1. `e8c8a1e3cac8aaf83e03696de8facd8167a29255`
2. `842d96b07b7ef20f298578e078467148cfa27675`

Corrective ancestry: VERIFIED.

Merge evidence:
`operations/EVIDENCE_HYGIENE_PAGES_VALIDATOR_G7_MERGE_2026-09-17.md`

## Current release boundary
Current production:

`dementor-club-production@374defbe583fac0839a43611b151d1104b47a42b`

State:
- `implementationStartAuthorized=true`
- `productionMergeAuthorized=true` for completed PR #218 merge
- `backendDeployAuthorized=true` for the already completed backend release
- `migrationApplied=true`
- `productionDeployAuthorized=false`
- `pagesDeployAuthorized=false`
- canonical Pages deploy for production `374defbe...`: NOT RUN
- `liveRetest=PENDING`
- `g8Status=OPEN`
- issue `#201=OPEN`
- `#213=NOT ACTIVE`

The prior Pages authorization applied only to exact production `e8c8a1e3...` and was exercised by failed predeploy run #118. It does not carry over to production `374defbe...`.

## Semantic boundary remains unchanged
- prospective QA Artifact provenance via `dc_artifacts.source_ref = qa:...`;
- OWNER_ADMIN-only canonical QA provenance creation;
- QA analytics hard suppression before GA4/Clarity boot;
- QA rows excluded by canonical public Activity read model;
- normal public Artifacts preserved;
- `current-program-v1.js` semantics unchanged;
- Artifact publication does not become a Programming Moment automatically;
- no Membership / DC-9 / Telegram semantic mutation;
- no historical Artifact rewrite.

Historical caveat:

`pre-cutover evidence may contain QA/internal activity`

## Gate
**G7 RELEASE / PAGES VALIDATOR CORRECTIVE MERGED / PAGES DEPLOY LOCKED.**

`MERGE ≠ PAGES DEPLOY AUTHORIZATION ≠ PAGES DEPLOY ≠ LIVE RETEST ≠ G8`
