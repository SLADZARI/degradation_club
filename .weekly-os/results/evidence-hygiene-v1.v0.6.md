---
artifactId: dementor-club.result.evidence-hygiene-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: PAGES_VALIDATOR_CORRECTIVE_VALIDATED_AWAITING_MERGE_AUTHORIZATION
version: 0.6
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: .weekly-os/results/evidence-hygiene-v1.v0.5.md
---

# MP | Dementor Club | Evidence Hygiene v1 | Result v0.6

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

## Backend release — unchanged
Backend is already deployed and verified:
- canonical workflow `Deploy Dementor Supabase Production`
- run `#2 / 35150249462`
- conclusion `SUCCESS`
- migration `20260916213500_evidence_hygiene_v1.sql` applied
- post-ledger clean
- Telegram worker not deployed

Evidence:
`operations/EVIDENCE_HYGIENE_BACKEND_RELEASE_2026-09-16.md`

## First Pages fixture corrective — merged
The first canonical Pages attempt exposed a stale browser fixture missing `board_hidden_at:null`.

Corrective #1:
- candidate `234ee1f67a9b579a1c50caec5a701f54d01d3774`
- PR #217
- Site Integrity `#1198 / 35159581757 / SUCCESS`
- production merge `e8c8a1e3cac8aaf83e03696de8facd8167a29255`
- production ancestry verified

Evidence:
- `operations/EVIDENCE_HYGIENE_PAGES_CORRECTIVE_2026-09-17.md`
- `operations/EVIDENCE_HYGIENE_PAGES_CORRECTIVE_G7_MERGE_2026-09-17.md`

## Accidental legacy Pages incident
The accidental legacy/default-branch run remains documented and is not canonical #201 Pages release evidence:

`operations/EVIDENCE_HYGIENE_PAGES_CONTROL_PLANE_INCIDENT_2026-09-17.md`

This incident remains a cleanup observation. It does not authorize silent release-architecture redesign.

## Canonical Pages run #118 — blocked before deploy
Owner authorized canonical Pages deploy for exact production:

`dementor-club-production@e8c8a1e3cac8aaf83e03696de8facd8167a29255`

Run:
- workflow `.github/workflows/deploy-pages.yml`
- run number `#118`
- run id `35161462557`
- branch `dementor-club-production`
- workflow head SHA `e8c8a1e3cac8aaf83e03696de8facd8167a29255`
- checkout SHA `e8c8a1e3cac8aaf83e03696de8facd8167a29255`
- conclusion `FAILURE`
- deploy job `SKIPPED`
- Pages artifacts produced: `0`

Failure was isolated to the browser-shell validation step. No new Pages artifact was deployed by this run.

## Root cause — release validator drift
Site Integrity and canonical Pages workflow were using different validators for the same Board shell checkpoint:

- Site Integrity: `scripts/validate-browser-shell-v21-compat.mjs`
- canonical Pages workflow: legacy `scripts/validate-browser-shell.mjs`

The v2.1 compatibility validator explicitly models the current open-first Board semantics: spatial Artifact card is the discovery/open target; persisted response/reaction evidence remains available through canonical Artifact/Workspace surfaces and is not rendered as direct spatial-card controls.

This is a QA/release-control drift correction, not a Board product semantic change.

## Pages validator corrective #2
Exact candidate:

`842d96b07b7ef20f298578e078467148cfa27675`

Base:

`e8c8a1e3cac8aaf83e03696de8facd8167a29255`

Scope:
- exactly one changed file: `.github/workflows/deploy-pages.yml`
- one command aligned:
  - `validate-browser-shell.mjs`
  - → `validate-browser-shell-v21-compat.mjs`
- no runtime product files changed
- no DB/RLS/Membership/DC-9/Telegram/Current Program/analytics semantic mutation

PR:
- `#218 Evidence Hygiene v1: align canonical Pages smoke validator`
- OPEN
- DRAFT
- MERGEABLE
- merged: false

Validation:
- Site Integrity `#1199`
- run id `35161854100`
- exact head `842d96b07b7ef20f298578e078467148cfa27675`
- conclusion `SUCCESS`
- all 51 validation steps passed

Evidence:
`operations/EVIDENCE_HYGIENE_PAGES_VALIDATOR_DRIFT_CORRECTIVE_2026-09-17.md`

## Current production and authorization boundary
Current production remains:

`dementor-club-production@e8c8a1e3cac8aaf83e03696de8facd8167a29255`

Current authorization state for the **next** release target:
- `implementationStartAuthorized=true`
- previous production merges remain historical facts
- PR #218 merge authorization: `false`
- `backendDeployAuthorized=true` for the already completed backend release
- `migrationApplied=true`
- next `pagesDeployAuthorized=false`
- next `productionDeployAuthorized=false`
- Pages status: `BLOCKED_CORRECTIVE_VALIDATED_AWAITING_MERGE`
- live sequential retest: `PENDING`
- G8: `OPEN`
- issue #201: `OPEN`
- #213: `NOT ACTIVE`

The prior Pages authorization applied only to exact production `e8c8a1e3...` and was exercised by run #118. It does not carry over to a future production SHA created by merging PR #218.

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
**G7 RELEASE / PAGES VALIDATOR CORRECTIVE VALIDATED / AWAITING MERGE AUTHORIZATION.**

`VALIDATION SUCCESS ≠ MERGE AUTHORIZATION ≠ PAGES DEPLOY AUTHORIZATION ≠ LIVE RETEST ≠ G8`
