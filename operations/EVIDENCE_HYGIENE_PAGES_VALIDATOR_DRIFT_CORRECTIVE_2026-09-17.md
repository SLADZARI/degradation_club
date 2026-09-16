# Evidence Hygiene v1 — Pages validator drift corrective evidence

Date: 2026-09-17
Result: `dementor-club.result.evidence-hygiene-v1`
Issue: #201
Gate: `G7_RELEASE`

## Canonical Pages attempt #118

Owner had explicitly authorized the canonical Pages release for:

`dementor-club-production@e8c8a1e3cac8aaf83e03696de8facd8167a29255`

Canonical workflow:

`.github/workflows/deploy-pages.yml`

GitHub Actions:
- run number: `#118`
- run id: `35161462557`
- event: `workflow_dispatch`
- branch: `dementor-club-production`
- workflow head SHA: `e8c8a1e3cac8aaf83e03696de8facd8167a29255`
- checkout log SHA: `e8c8a1e3cac8aaf83e03696de8facd8167a29255`
- conclusion: `FAILURE`

The build passed registry/routes, content readiness, visual contract, Pages build, canonical shell integration and built JavaScript syntax. It failed before route-manifest/release-gate/artifact upload at:

`Validate browser shell and Workspace recovery`

The failed command was:

`node scripts/validate-browser-shell.mjs`

Observed failures:
- `Board participation: persisted response confirmation missing`
- `Board participation: persisted reaction state missing`
- `Board participation: My Activity discoverability link missing`

The deploy job was skipped. The run produced zero workflow artifacts. Therefore run #118 did **not** create or deploy a new canonical Pages artifact.

## Root cause — validator drift, not product regression

The release-readiness workflow and canonical Pages workflow were validating different browser-shell contracts:

- `.github/workflows/site-integrity.yml` used `scripts/validate-browser-shell-v21-compat.mjs`;
- `.github/workflows/deploy-pages.yml` still used legacy `scripts/validate-browser-shell.mjs`.

`validate-browser-shell-v21-compat.mjs` explicitly models the current Board v2.1 open-first contract: spatial Artifact cards are discovery/open targets, while persisted response/reaction evidence remains canonical through Artifact overlay / Workspace `MY ACTIVITY`. The old raw validator still expected response/reaction/My Activity controls directly on the spatial card.

No Board runtime, Membership, DC-9, Current Program, analytics, database, RLS, Telegram or product semantics were changed to satisfy this failure.

## Corrective candidate

Integration branch was fast-forwarded to current production and exactly one workflow command was aligned with the already-used release-readiness validator.

Candidate:

`842d96b07b7ef20f298578e078467148cfa27675`

Base:

`e8c8a1e3cac8aaf83e03696de8facd8167a29255`

Diff:
- exactly one file: `.github/workflows/deploy-pages.yml`
- exactly one command change:
  - from `node scripts/validate-browser-shell.mjs`
  - to `node scripts/validate-browser-shell-v21-compat.mjs`

PR:
- `#218 Evidence Hygiene v1: align canonical Pages smoke validator`
- state at evidence capture: OPEN / DRAFT / MERGEABLE
- base: `dementor-club-production@e8c8a1e3cac8aaf83e03696de8facd8167a29255`
- head: `842d96b07b7ef20f298578e078467148cfa27675`

## Validation

Site Integrity / Release Readiness:
- run number: `#1199`
- run id: `35161854100`
- exact head: `842d96b07b7ef20f298578e078467148cfa27675`
- conclusion: `SUCCESS`
- all 51 validation steps passed.

Relevant PASS coverage includes:
- Evidence Hygiene browser acceptance;
- Board public activity browser acceptance;
- Current Program Home/Board acceptance;
- Board v2.1 fullscreen acceptance;
- Board live corrective acceptance;
- Board navigation/adaptive cards acceptance;
- deep-link / share acceptance;
- `Validate browser shell and Workspace recovery` using the v2.1 compatibility validator;
- My Artifacts history;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

## Release boundary after validation

Current production remains:

`dementor-club-production@e8c8a1e3cac8aaf83e03696de8facd8167a29255`

Backend remains already deployed and verified:
- run `35150249462` = SUCCESS;
- migration `20260916213500_evidence_hygiene_v1.sql` = applied;
- no new Supabase / Telegram deploy was performed here.

The prior Pages authorization was exercised against exact production `e8c8a1e3...` and resulted in a blocked predeploy run. It does not authorize merging PR #218 or deploying a future production SHA.

Current boundary:
- PR #218 merge authorization: **NOT GRANTED**;
- next Pages deploy authorization: **NOT GRANTED**;
- live retest: PENDING;
- G8: OPEN;
- issue #201: OPEN;
- #213: NOT ACTIVE.

Historical caveat remains:

`pre-cutover evidence may contain QA/internal activity`

`VALIDATION SUCCESS ≠ MERGE AUTHORIZATION ≠ PAGES DEPLOY AUTHORIZATION ≠ LIVE RETEST ≠ G8`
