---
artifactId: dementor-club.result.thing-projection-runtime-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: PRODUCTION_MERGED_DEPLOY_LOCKED
version: 0.3
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: .weekly-os/results/thing-projection-runtime-v1.v0.2.md
issue: 213
integrationBranch: result/thing-projection-runtime-v1
releaseBranch: release/thing-projection-runtime-v1
productionBaseCommit: 374defbe583fac0839a43611b151d1104b47a42b
validatedIntegrationHead: 7dc040fe90696caf303b0fb43f1f53296ad7fd97
releaseCandidateCommit: 40b5d55cdf8c1fd137dacc7fd2fcee9f62438f01
releasePullRequest: 220
validationRun: 1200
validationRunId: 35256632481
validationConclusion: SUCCESS
productionCommit: 23d4266a4009d34042b29ec1fb73fb0cbad6b62e
activationAuthorized: true
implementationStartAuthorized: true
productionMergeAuthorized: true
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | RELEASE | ThingProjection Runtime v1 | Result v0.3

## Status

**G7 RELEASE / PRODUCTION MERGED / DEPLOY LOCKED**

The validated clean release candidate has been merged into `dementor-club-production` after explicit owner authorization. Scope and architecture are unchanged from v0.2.

## Release chain
- production baseline: `374defbe583fac0839a43611b151d1104b47a42b`
- validated integration head: `7dc040fe90696caf303b0fb43f1f53296ad7fd97`
- clean release candidate: `40b5d55cdf8c1fd137dacc7fd2fcee9f62438f01`
- production-target PR: `#220`
- Site Integrity: `#1200 / 35256632481 / SUCCESS`
- production merge commit: `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`

Merge evidence:
`operations/THING_PROJECTION_RUNTIME_G7_MERGE_2026-09-17.md`

G6 evidence:
`operations/THING_PROJECTION_RUNTIME_G6_2026-09-17.md`

G7 RC evidence:
`operations/THING_PROJECTION_RUNTIME_G7_RELEASE_CANDIDATE_2026-09-17.md`

## Preserved architecture
`SOURCE OWNER → thin read adapter → ThingProjection → ProgrammingDecision / continuation choice → Surface VM`

- `program:dengi-na-veter` and `project:dementor-lab` remain the only extracted source kinds;
- `event:fuengirola` remains composition-local;
- ThingProjection remains read-side only;
- existing source owners remain authority;
- Current Program remains shared Home + Board composition;
- DSO continuation reuses the Program projection boundary;
- no `dc_things`, universal registry, DB migration, generic repository/service, Catalog rewrite, Contribution/#214, Membership/auth or History/Activity ontology was introduced.

## Release control
Current state:
- G6: PASS;
- clean G7 RC: VALIDATED;
- production merge: COMPLETE;
- production deploy: NOT AUTHORIZED;
- production deploy: NOT RUN;
- live production retest: NOT RUN;
- G8 cleanup: NOT STARTED.

#202 remains an ownership guardrail outside this Result. #214 remains excluded and unresolved.

`PRODUCTION MERGED ≠ DEPLOY AUTHORIZATION ≠ DEPLOY ≠ LIVE RETEST ≠ G8`
