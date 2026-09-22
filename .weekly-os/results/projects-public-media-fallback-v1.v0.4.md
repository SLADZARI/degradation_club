---
artifactId: dementor-club.result.projects-public-media-fallback-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: ACTIVE
version: 0.4
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
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

# MP | Dementor Club | RELEASE | Projects Public Media Fallback v1 | Result v0.4

## Status

**ACTIVE / G7_RELEASE — LIVE CORRECTIVE VALIDATED / READY FOR RELEASE DECISION**

Owner correction supersedes the prior unavailable-source Product conclusion.

Current corrective candidate:

`91607fdbd02b815122ce25c7a8920691dda6320f`

Draft PR:

`#236`

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

## Exact diff

Production `4a8e95cb...` → candidate:

1. `projects/index.html`
2. `projects-hub-v2.css`
3. `scripts/validate-projects-v2-browser.mjs`

## Gate

`G7_RELEASE / READY_FOR_RELEASE_DECISION`

STOP. No merge. No deploy. No Supabase. No STAB-06.
