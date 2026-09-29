---
artifactId: dementor-club.operations.global-header-bootstrap-stability-production-deploy-2026-09-29
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS_DEPLOYED
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.global-header-bootstrap-stability-v1
productionCommit: fd184be3306911c4ddb6acbcb77acdd977ea84f8
productionTree: 7c9c4a749a80c6ecb69f314565cf36300af868d0
pagesRun: 136
pagesRunId: 36580299418
pagesArtifactId: 11039012286
pagesArtifactDigest: sha256:de2d2db18a9c32f32d545f48c49f48bf4a827751782a89440c41bba05e4cd656
---

# Global Header Bootstrap Stability v1 — production deploy evidence

## Verdict

```text
PRODUCTION MERGE       PASS
PAGES DEPLOY           PASS
BACKEND DEPLOY         NOT REQUIRED
SUPABASE DEPLOY        NOT REQUIRED
DEPLOYED ARTIFACT QA   PASS
LIVE DOMAIN QA         PENDING_EXTERNAL_OBSERVATION
G8                     NOT AUTHORIZED
```

## Exact production

`fd184be3306911c4ddb6acbcb77acdd977ea84f8`

Tree:

`7c9c4a749a80c6ecb69f314565cf36300af868d0`

This is the same validated tree as the G7 clean RC.

## Canonical Pages production release

Workflow:

`Deploy Dementor Production`

Run:

```text
#136 / 36580299418
branch     = dementor-club-production
head       = fd184be3306911c4ddb6acbcb77acdd977ea84f8
conclusion = SUCCESS
```

Both jobs passed:

- build = SUCCESS;
- deploy = SUCCESS.

The deploy job created a Pages deployment for the exact production SHA and evaluated the environment URL as:

`http://dementor.club/`

No Supabase workflow was run.

## Pages artifact

Artifact:

```text
id      = 11039012286
name    = github-pages
digest  = sha256:de2d2db18a9c32f32d545f48c49f48bf4a827751782a89440c41bba05e4cd656
head    = fd184be3306911c4ddb6acbcb77acdd977ea84f8
```

The exact artifact from run #136 was downloaded and inspected.

## Deployed artifact browser smoke

The exact Header runtime and CSS from the deployed artifact were exercised in Chromium.

Desktop 1280:

- exactly one `header.dc-global-header`;
- guest state;
- `Вступить в клуб`;
- `Войти`;
- desktop navigation visible;
- mobile menu control hidden;
- Header inserted before page content;
- second boot remains exactly one Header.

Mobile 390:

- exactly one Header;
- guest state;
- CTA visible;
- burger visible;
- navigation initially closed;
- burger opens navigation;
- `aria-expanded=true`;
- body receives `dc-global-menu-open`;
- Escape closes navigation;
- second boot remains exactly one Header.

Mobile 360:

- same acceptance matrix as 390 = PASS.

Authenticated identity controlled browser check:

- exactly one Header;
- identity state rendered;
- identity points to `/workspace/`;
- Public Header remains before Workspace shell.

This controlled identity check validates the exact deployed Header runtime but is not a live authenticated production-session claim.

## Live-domain boundary

The current execution environment cannot establish a browser/network session to `dementor.club` itself: direct external fetch is blocked/cache-unavailable in the available browser/web surfaces.

Therefore deployment success + exact deployed artifact browser acceptance are proven, but an external live-domain observation is not being falsely promoted to PASS.

Required before G8:

- external live page visibly loads the canonical Header;
- no duplicate Header after refresh/navigation;
- mobile 390/360 behavior matches artifact acceptance;
- authenticated identity is observed on production if an authenticated session is available.

Until that observation exists:

```text
Result = ACTIVE
gateReadiness = LIVE_DOMAIN_ACCEPTANCE_PENDING
G8 = NOT AUTHORIZED
```
