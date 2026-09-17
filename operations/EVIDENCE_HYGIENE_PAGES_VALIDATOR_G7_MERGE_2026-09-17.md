# Evidence Hygiene v1 — Pages validator corrective G7 merge evidence

Date: 2026-09-17
Result: `dementor-club.result.evidence-hygiene-v1`
Issue: #201
Gate: `G7_RELEASE`

## Owner authorization
Owner explicitly authorized merge of PR #218 only. Pages deploy remained separately gated.

## Pre-merge lock
- production branch: `dementor-club-production`
- exact production head before merge: `e8c8a1e3cac8aaf83e03696de8facd8167a29255`
- PR #218 exact head: `842d96b07b7ef20f298578e078467148cfa27675`
- PR state before merge: OPEN / DRAFT / MERGEABLE
- Site Integrity / Release Readiness: `#1199 / run 35161854100 / SUCCESS`
- validation exact head: `842d96b07b7ef20f298578e078467148cfa27675`
- corrective diff: exactly one file `.github/workflows/deploy-pages.yml`, one command aligned from `validate-browser-shell.mjs` to `validate-browser-shell-v21-compat.mjs`
- no product runtime, DB/RLS, Membership, DC-9, Telegram, Current Program or analytics semantic change

## Merge
PR #218 was changed Draft → Ready and merged using GitHub merge commit mode with expected-head guard:

`expected_head_sha=842d96b07b7ef20f298578e078467148cfa27675`

Merge commit / new production head:

`374defbe583fac0839a43611b151d1104b47a42b`

Exact parents:
1. `e8c8a1e3cac8aaf83e03696de8facd8167a29255` — prior production head
2. `842d96b07b7ef20f298578e078467148cfa27675` — exact validated corrective candidate

GitHub verification: merge commit verified.

PR #218 final state:
- state: CLOSED
- merged: true
- draft: false
- base SHA: `e8c8a1e3cac8aaf83e03696de8facd8167a29255`
- head SHA: `842d96b07b7ef20f298578e078467148cfa27675`
- merge commit SHA: `374defbe583fac0839a43611b151d1104b47a42b`

## Release boundary
No Pages deploy was performed in this merge step.
No Supabase/Telegram/Edge Function deploy was performed.
Backend remains previously deployed and verified; migration remains applied.
Live sequential retest remains pending.
G8 remains open.
Issue #201 remains open.
#213 remains inactive.

Current release boundary:

`G7_RELEASE / PAGES VALIDATOR CORRECTIVE MERGED / PAGES DEPLOY LOCKED`

`MERGE ≠ PAGES DEPLOY ≠ LIVE RETEST ≠ G8`
