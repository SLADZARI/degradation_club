---
artifactId: dementor-club.result.evidence-hygiene-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: CORRECTIVE_MERGED_PAGES_AUTHORIZED_AWAITING_DEPLOY
version: 0.5
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: .weekly-os/results/evidence-hygiene-v1.v0.4.md
---

# MP | Dementor Club | Evidence Hygiene v1 | Result v0.5

## Goal
Отделить QA/internal evidence от реальной editorial/public activity без новой публичной ontology и без изменения product semantics Board / Current Program / Membership.

Invariant:

`QA EVIDENCE ≠ AUDIENCE EVIDENCE ≠ PROGRAMMING MOMENT`

## Original validated release candidate
- baseline: `dementor-club-production@0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`
- exact G6 candidate: `0a9687266aa27ea2bd40fa12099052e1308b6ae2`
- PR: `#216`
- Site Integrity: `#1197 / run 35141615180 / SUCCESS`
- initial production merge: `b68cd84bd284e599f3adcce46659e4654e23d05d`
- G6 evidence: `operations/EVIDENCE_HYGIENE_G6_2026-09-16.md`
- G7 evidence: `operations/EVIDENCE_HYGIENE_G7_MERGE_2026-09-16.md`

## Backend production release
Backend release remains unchanged and verified:
- workflow: `Deploy Dementor Supabase Production`
- run: `#2 / 35150249462`
- exact source: `dementor-club-production@b68cd84bd284e599f3adcce46659e4654e23d05d`
- conclusion: `SUCCESS`
- migration `20260916213500_evidence_hygiene_v1.sql`: applied
- post-ledger pending migrations: none
- Telegram worker: not deployed

Evidence: `operations/EVIDENCE_HYGIENE_BACKEND_RELEASE_2026-09-16.md`

## Pages corrective
Canonical Pages run `35157794556` was correctly blocked before deploy by a stale browser-smoke fixture. The runtime Board was not changed.

Corrective candidate:
`234ee1f67a9b579a1c50caec5a701f54d01d3774`

Corrective scope relative to then-production `b68cd84bd284e599f3adcce46659e4654e23d05d`:
- exactly one file: `scripts/validate-browser-shell.mjs`
- `board_hidden_at:null` added to the two existing Activity fixture Artifact rows
- no runtime, DB/RLS, Membership, DC-9, Telegram, Current Program or analytics semantic mutation

Validation:
- PR: `#217`
- Site Integrity: `#1198 / run 35159581757 / SUCCESS`
- all release-readiness steps passed, including `Validate browser shell and Workspace recovery`

Corrective merge:
- PR #217 merged
- production commit: `e8c8a1e3cac8aaf83e03696de8facd8167a29255`
- parent 1: `b68cd84bd284e599f3adcce46659e4654e23d05d`
- parent 2: `234ee1f67a9b579a1c50caec5a701f54d01d3774`
- ancestry verified

Corrective evidence:
- `operations/EVIDENCE_HYGIENE_PAGES_CORRECTIVE_2026-09-17.md`
- `operations/EVIDENCE_HYGIENE_PAGES_CORRECTIVE_G7_MERGE_2026-09-17.md`

## Pages authorization
Owner explicitly authorizes only the canonical Pages release for:

`dementor-club-production@e8c8a1e3cac8aaf83e03696de8facd8167a29255`

Required workflow:
`.github/workflows/deploy-pages.yml`

Required branch:
`dementor-club-production`

Required confirmation:
`APPROVED`

No legacy/main deployment workflow is authorized. No additional Supabase, Telegram, Edge Function or runtime mutation is authorized.

## Release state
- `productionMergeAuthorized=true`
- `backendDeployAuthorized=true`
- `migrationApplied=true`
- `pagesDeployAuthorized=true`
- `productionDeployAuthorized=true` only for the canonical Pages workflow above
- canonical Pages deploy: pending
- live sequential retest: pending
- G8: open
- issue #201: open
- #213: not active

## Historical caveat
`pre-cutover evidence may contain QA/internal activity`

## Gate
**G7 RELEASE / CORRECTIVE MERGED / PAGES AUTHORIZED / DEPLOY PENDING.**

`AUTHORIZATION ≠ DEPLOY ≠ LIVE RETEST ≠ G8`
