---
artifactId: dementor-club.result.thing-projection-runtime-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: CLEAN_RC_VALIDATED_MERGE_LOCKED
version: 0.2
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: .weekly-os/results/thing-projection-runtime-v1.v0.1.md
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
activationAuthorized: true
implementationStartAuthorized: true
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | RELEASE | ThingProjection Runtime v1 | Result v0.2

## Status

**G7 RELEASE / CLEAN RC VALIDATED / MERGE LOCKED / DEPLOY LOCKED**

The implementation scope from v0.1 is unchanged. This snapshot records completed G6 validation and a clean production-target release candidate validated from the current production baseline.

## Goal

Preserve the smallest repeated runtime boundary:

`SOURCE OWNER → thin read adapter → ThingProjection → ProgrammingDecision / continuation choice → Surface VM`

without creating a universal Thing registry or moving authority away from existing source owners.

## Implemented scope

Only the approved source kinds are extracted:

- `program:dengi-na-veter`
- `project:dementor-lab`

`event:fuengirola` remains composition-local and is not generalized.

The implementation contains:
- one thin ThingProjection runtime/read boundary;
- Program adapter for Dengi;
- Project adapter for DEMENTOR LAB identity;
- Current Program composition consuming the shared boundary;
- DSO continuation reusing the Dengi projection boundary;
- validator alignment for the new physical boundary.

Contextual presentation/telemetry fields remain outside canonical identity.

## G6 evidence

Exact validated integration head:
`7dc040fe90696caf303b0fb43f1f53296ad7fd97`

Evidence:
`operations/THING_PROJECTION_RUNTIME_G6_2026-09-17.md`

Exact-head G6 run:
`35254861885 / SUCCESS`

## Clean G7 release candidate

Production baseline:
`374defbe583fac0839a43611b151d1104b47a42b`

Release branch:
`release/thing-projection-runtime-v1`

Release candidate:
`40b5d55cdf8c1fd137dacc7fd2fcee9f62438f01`

Draft production-target PR:
`#220`

The release branch is one commit ahead of the current production baseline and contains only the validated seven-file diff. It does not merge or inherit `dementor-club-site` divergence.

Production-target Site Integrity:
- run `#1200`
- run id `35256632481`
- conclusion `SUCCESS`

Evidence:
`operations/THING_PROJECTION_RUNTIME_G7_RELEASE_CANDIDATE_2026-09-17.md`

## Exact release diff

1. `thing-projection-v1.js`
2. `current-program-v1.js`
3. `courses/dumai-s-opasnostyu/data.js`
4. `courses/dumai-s-opasnostyu/index.html`
5. `scripts/validate-current-program-v1.mjs`
6. `scripts/validate-dumai-release-loop-v1.mjs`
7. `scripts/validate-visual-contract.mjs`

## Architecture invariants preserved

1. Existing source owners remain fact owners.
2. ThingProjection is a read contract, not a registry or mutation authority.
3. `thingRef` remains the stable cross-context identity reference.
4. Current Program remains one reviewed composition for Home + Board.
5. DSO continuation consumes projection truth without becoming Program authority.
6. Project identity does not depend on `dc_entities`.
7. Event abstraction remains excluded until independently proven.
8. No `dc_things`, universal Project/Event registry, DB migration, generic repository/service or compatibility runtime was introduced.
9. #202 remains an ownership guardrail outside this Result.
10. #214 remains excluded and unresolved by this Result.

## Release control

Current state:

- G6: PASS;
- clean G7 RC: VALIDATED;
- production merge: NOT AUTHORIZED;
- production deploy: NOT AUTHORIZED;
- live production retest: NOT RUN;
- G8 cleanup: NOT STARTED.

No merge or deploy may be inferred from PR/CI success.

`VALIDATED RC ≠ MERGE AUTHORIZATION ≠ MERGE ≠ DEPLOY AUTHORIZATION ≠ DEPLOY ≠ LIVE RETEST ≠ G8`
