# Evidence Hygiene v1 — canonical Pages release evidence — 2026-09-17

## Scope
Canonical GitHub Pages release for Result `dementor-club.result.evidence-hygiene-v1` after PR #218 validator corrective merge.

This evidence records deployment only. It does **not** establish live browser acceptance or G8 closure.

## Owner authorization
Owner explicitly authorized canonical Pages deploy for exact production source:

`dementor-club-production@374defbe583fac0839a43611b151d1104b47a42b`

Required workflow:

`.github/workflows/deploy-pages.yml`

Required branch/input:
- branch: `dementor-club-production`
- `release_confirmation=APPROVED`

No Supabase, Telegram, DB migration or unrelated runtime mutation was authorized in this step.

## Preflight
Verified before dispatch:
- production head: `374defbe583fac0839a43611b151d1104b47a42b`
- kernel production commit matched production head
- PR #218 merged
- Site Integrity #1199 / run `35161854100` = `SUCCESS`
- Evidence Hygiene backend migration already applied
- #213 remained `NEXT CANDIDATE / NOT ACTIVE / BLOCKED`
- canonical Pages workflow at exact production SHA used `scripts/validate-browser-shell-v21-compat.mjs`

## Canonical workflow
Workflow run:
- workflow: `Deploy Dementor Production`
- workflow file: `.github/workflows/deploy-pages.yml`
- run number: `#119`
- run id: `35211118478`
- event: `workflow_dispatch`
- head branch: `dementor-club-production`
- head SHA: `374defbe583fac0839a43611b151d1104b47a42b`

### Attempt 1
Build job completed `SUCCESS` and produced the Pages artifact, but deploy was rejected by the pre-existing `github-pages` environment branch protection rule:

`Branch "dementor-club-production" is not allowed to deploy to github-pages due to environment protection rules.`

This failure occurred after the full build/validation chain and artifact upload; no Pages deployment occurred in attempt 1.

The environment rule was corrected by explicitly allowing `dementor-club-production`. No application code, workflow code, database or runtime semantics were changed for this correction.

### Attempt 2
Only the failed deployment path was retried for the same canonical run and exact source/artifact.

Result:
- run attempt: `2`
- workflow conclusion: `SUCCESS`
- build job: `SUCCESS`
- deploy job: `SUCCESS`
- deployed Pages build version: `374defbe583fac0839a43611b151d1104b47a42b`
- deployment id: `355b02cde90bbf14706cdff2698573a57c6b0a34`
- environment URL: `http://dementor.club/`

## Build / release checks
The canonical build on exact production SHA passed:
- registry/routes/feature state validation
- page content readiness
- visual contract
- production Pages build
- canonical shell integration
- built JavaScript syntax
- browser smoke runtime installation
- `scripts/validate-browser-shell-v21-compat.mjs` — PASS
- production route manifest — PASS
- production artifact/release gate — PASS
- Pages configuration — PASS
- Pages artifact upload — PASS

Evidence Hygiene candidate-specific browser acceptance had already passed in Site Integrity #1199 ancestry and the canonical deploy used the corrected Board v2.1 compatibility shell validator.

## Pages artifact
- artifact name: `github-pages`
- artifact id: `10492111474`
- size: `15448724` bytes
- digest: `sha256:e076fe6c94bb5b009d52d1f2395987b9ad05e2a478d63b875966903087e3ca8a`
- artifact workflow head SHA: `374defbe583fac0839a43611b151d1104b47a42b`

## Release boundary after deploy
- `pagesDeployAuthorized=true`
- `productionDeployAuthorized=true`
- backend deploy remains the previously verified `35150249462 / SUCCESS`
- migration remains applied
- no new Supabase deploy
- no Telegram deploy
- no DB migration or runtime mutation
- live sequential retest: `PENDING`
- G8: `OPEN`
- #201: `OPEN`
- #213: `NOT ACTIVE`

## Gate statement
`PAGES DEPLOYED ≠ LIVE RETEST PASS ≠ G8 CLOSED`

The Result must remain active until real production live evidence is recorded.