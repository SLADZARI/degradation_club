---
artifactId: dementor-club.operations.thing-projection-runtime-g7-release-candidate-2026-09-17
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS_CLEAN_RC_VALIDATED
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.thing-projection-runtime-v1
---

# ThingProjection Runtime v1 — G7 clean release candidate evidence

## Result
`dementor-club.result.thing-projection-runtime-v1`

## Source evidence
G6 exact-head evidence:
`operations/THING_PROJECTION_RUNTIME_G6_2026-09-17.md`

Validated integration head:
`7dc040fe90696caf303b0fb43f1f53296ad7fd97`

## Production baseline
Current production remained unchanged during preparation:

`dementor-club-production@374defbe583fac0839a43611b151d1104b47a42b`

## Clean release candidate
Release branch:
`release/thing-projection-runtime-v1`

Exact clean RC:
`40b5d55cdf8c1fd137dacc7fd2fcee9f62438f01`

Topology:
- parent = exact production baseline `374defbe...`;
- ahead by 1 release commit;
- behind by 0;
- tree equals validated integration tree for the approved seven-file boundary.

The release branch was constructed directly from production baseline and contains only the #213 diff. It does not inherit `dementor-club-site` divergence.

## Exact production-target diff
1. `thing-projection-v1.js`
2. `current-program-v1.js`
3. `courses/dumai-s-opasnostyu/data.js`
4. `courses/dumai-s-opasnostyu/index.html`
5. `scripts/validate-current-program-v1.mjs`
6. `scripts/validate-dumai-release-loop-v1.mjs`
7. `scripts/validate-visual-contract.mjs`

## Production-target PR
Draft PR `#220`:
`release/thing-projection-runtime-v1 → dementor-club-production`

PR remains DRAFT and unmerged.

## Full release-candidate validation
Canonical workflow:
`Site Integrity / Release Readiness`

Run:
- run number: `#1200`
- run id: `35256632481`
- exact PR head: `40b5d55cdf8c1fd137dacc7fd2fcee9f62438f01`
- conclusion: `SUCCESS`

All workflow steps completed successfully, including production build, Current Program static/browser acceptance, DSO static/browser acceptance, mobile/public harmonization, Project regression, DC-9 and Board regressions, WebKit auth, route manifest and production artifact release gate.

## Release boundary
State after validation:

`G7 CLEAN RC VALIDATED / MERGE LOCKED / DEPLOY LOCKED`

Explicitly not performed:
- no merge into `dementor-club-production`;
- no Pages deployment;
- no backend/Supabase deployment or migration;
- no live production retest;
- no G8 cleanup/closure.

Production merge remains separately owner-authorized.
Production deploy remains separately owner-authorized after merge.

`VALIDATED RC ≠ MERGE AUTHORIZATION ≠ MERGE ≠ DEPLOY AUTHORIZATION ≠ DEPLOY ≠ LIVE RETEST ≠ G8`
