---
artifactId: dementor-club.result.evidence-hygiene-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: PAGES_DEPLOYED_LIVE_RETEST_PENDING
version: 0.8
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: .weekly-os/results/evidence-hygiene-v1.v0.7.md
---

# MP | Dementor Club | Evidence Hygiene v1 | Result v0.8

## Goal
Отделить QA/internal evidence от реальной editorial/public activity без новой публичной ontology и без изменения product semantics Board / Current Program / Membership.

Invariant:

`QA EVIDENCE ≠ AUDIENCE EVIDENCE ≠ PROGRAMMING MOMENT`

## Validated implementation chain
Original candidate:
`0a9687266aa27ea2bd40fa12099052e1308b6ae2`

Original validation:
`Site Integrity #1197 / 35141615180 / SUCCESS`

Initial production merge:
`b68cd84bd284e599f3adcce46659e4654e23d05d`

Pages fixture corrective:
- candidate `234ee1f67a9b579a1c50caec5a701f54d01d3774`
- PR #217
- Site Integrity #1198 / `35159581757` / SUCCESS
- merged production `e8c8a1e3cac8aaf83e03696de8facd8167a29255`

Pages validator corrective:
- candidate `842d96b07b7ef20f298578e078467148cfa27675`
- PR #218
- Site Integrity #1199 / `35161854100` / SUCCESS
- merged production `374defbe583fac0839a43611b151d1104b47a42b`
- corrective ancestry verified

## Backend release
Already deployed and verified:
- canonical Supabase workflow run `35150249462`
- conclusion `SUCCESS`
- migration `20260916213500_evidence_hygiene_v1.sql` applied
- Telegram worker not deployed

Evidence:
`operations/EVIDENCE_HYGIENE_BACKEND_RELEASE_2026-09-16.md`

## Canonical Pages release
Production source:

`dementor-club-production@374defbe583fac0839a43611b151d1104b47a42b`

Workflow:
`.github/workflows/deploy-pages.yml`

Run:
- number `#119`
- id `35211118478`
- attempt `2`
- final conclusion `SUCCESS`
- exact checkout/build version `374defbe583fac0839a43611b151d1104b47a42b`
- canonical Board shell validator `scripts/validate-browser-shell-v21-compat.mjs` PASS
- route manifest PASS
- production artifact/release gate PASS
- deploy job SUCCESS

Pages artifact:
- id `10492111474`
- digest `sha256:e076fe6c94bb5b009d52d1f2395987b9ad05e2a478d63b875966903087e3ca8a`
- deployment id `355b02cde90bbf14706cdff2698573a57c6b0a34`
- deployment URL `http://dementor.club/`

Attempt 1 of the same run built and uploaded the same exact artifact successfully but was blocked by the existing `github-pages` environment branch rule. The environment allow-list was corrected to admit `dementor-club-production`; no application/runtime/database semantics changed. Attempt 2 then deployed successfully.

Evidence:
`operations/EVIDENCE_HYGIENE_PAGES_RELEASE_2026-09-17.md`

## Current release state
- `implementationStartAuthorized=true`
- `productionMergeAuthorized=true`
- `backendDeployAuthorized=true`
- `migrationApplied=true`
- `pagesDeployAuthorized=true`
- `productionDeployAuthorized=true`
- `pagesDeployStatus=SUCCESS`
- `liveRetest=PENDING`
- `g8Status=OPEN`
- issue `#201=OPEN`
- `#213=NOT ACTIVE`

## Semantic boundary remains unchanged
- prospective QA provenance only through `dc_artifacts.source_ref = qa:...`;
- OWNER_ADMIN-only canonical QA provenance creation;
- QA analytics hard suppression before GA4/Clarity boot;
- public Activity read model excludes `qa:` source evidence;
- normal public Artifacts remain eligible;
- `current-program-v1.js` semantics unchanged;
- Artifact publication does not become a Programming Moment automatically;
- Membership / DC-9 / Telegram semantics unchanged;
- no historical Artifact rewrite.

Historical caveat:

`pre-cutover evidence may contain QA/internal activity`

## Gate
**G7 RELEASE / PAGES DEPLOYED / LIVE RETEST PENDING.**

`PAGES DEPLOYED ≠ LIVE RETEST PASS ≠ G8 CLOSED`
