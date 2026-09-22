---
artifactId: dementor-club.result.projects-public-media-fallback-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G7_RELEASE
status: REVIEW
workStatus: ACTIVE
version: 0.5
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.4
parentIssue: 228
scope:
  - STAB-05
  - BQA-21
integrationBranch: result/projects-public-media-fallback-v1
productionBaseCommit: 4a8e95cb669dab660a7afe381e580278d4575a2a
candidateCommit: 91607fdbd02b815122ce25c7a8920691dda6320f
releaseCandidateCommit: 91607fdbd02b815122ce25c7a8920691dda6320f
integrationPullRequest: 236
implementationStartAuthorized: true
schemaMutationAuthorized: false
semanticMutationRequired: false
changeProposalRequired: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | BUILD | Projects Public Media Fallback v1 | Result v0.5

## Work status

**ACTIVE / G7_RELEASE — LIVE CORRECTIVE VALIDATED / READY FOR RELEASE DECISION**

Artifact lifecycle: `REVIEW`.

Owner correction supersedes the prior unavailable-source Product conclusion.

Current corrective candidate:

`91607fdbd02b815122ce25c7a8920691dda6320f`

Draft PR:

`#236`

## MP_DSL lifecycle guard

This Result is in project lifecycle `BUILD` while its engineering gate is `G7_RELEASE`.

Advancing a Result through G5/G6/G7 must not rewrite:
- `projectStage` to `VALIDATION` or `RELEASE`;
- Artifact lifecycle `status` to operational values such as `ACTIVE`.

For this Result:
- projectStage = `BUILD`;
- gate = `G7_RELEASE`;
- Artifact status = `REVIEW`;
- workStatus = `ACTIVE`.

Commit, merge, deploy and live acceptance remain separate events.

## Intended hero contract

- 9:16 video;
- `youtube-nocookie.com/embed/dWokndhJLKQ`;
- silent autoplay requested;
- muted;
- playsinline;
- loop;
- visible controls if autoplay is blocked;
- explicit `ОТКРЫТЬ ВИДЕО ↗` fallback;
- no unavailable message;
- no empty black rectangle.

## Validation

`Site Integrity / Release Readiness #1233 / 35671603405 · SUCCESS`

Targeted Projects browser regression PASS on 1440 / 390 / 360 + reload.

Parent-page browser preview confirmed a real rendered YouTube player and visible external fallback. Automated playback itself was blocked by YouTube anti-bot verification in that environment; this is not treated as Product/source failure. Post-deploy human playback remains a release acceptance item.

## Exact production boundary

Production branch:
`dementor-club-production@4a8e95cb669dab660a7afe381e580278d4575a2a`

Corrective branch:
`result/projects-public-media-fallback-v1@91607fdbd02b815122ce25c7a8920691dda6320f`

Draft PR #236 targets the exact production baseline above.

Exact code diff remains:

1. `projects/index.html`
2. `projects-hub-v2.css`
3. `scripts/validate-projects-v2-browser.mjs`

## Gate

`G7_RELEASE / READY_FOR_RELEASE_DECISION`

STOP. No merge. No deploy. No Supabase. No STAB-06.
