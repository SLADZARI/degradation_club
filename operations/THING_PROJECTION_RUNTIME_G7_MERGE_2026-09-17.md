---
artifactId: dementor-club.operations.thing-projection-runtime-g7-merge-2026-09-17
project: dementor-club
documentType: RELEASE_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS_PRODUCTION_MERGED_DEPLOY_LOCKED
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: RELEASE_EVIDENCE
result: dementor-club.result.thing-projection-runtime-v1
---

# ThingProjection Runtime v1 — G7 production merge evidence

## Result
`dementor-club.result.thing-projection-runtime-v1`

## Authorized action
Owner explicitly authorized merge of PR #220 on 2026-09-17.

## Validated release candidate
- production baseline before merge: `374defbe583fac0839a43611b151d1104b47a42b`
- clean release candidate: `40b5d55cdf8c1fd137dacc7fd2fcee9f62438f01`
- PR: `#220`
- production-target Site Integrity: `#1200`
- run id: `35256632481`
- conclusion: `SUCCESS`
- exact diff: 7 files only

## Production merge
- merge method: merge commit
- production commit: `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`
- parent 1: `374defbe583fac0839a43611b151d1104b47a42b`
- parent 2: `40b5d55cdf8c1fd137dacc7fd2fcee9f62438f01`
- ancestry: exact validated RC merged into current production baseline

## Release boundary
Production code is merged, but no Pages/production deploy was authorized or started as part of this action.

- production merge: COMPLETE
- production deploy authorization: FALSE
- production deploy: NOT RUN
- live retest: NOT RUN
- G8 cleanup: NOT STARTED

`MERGE ≠ DEPLOY AUTHORIZATION ≠ DEPLOY ≠ LIVE RETEST ≠ G8`
