---
artifactId: dementor-club.result.thing-projection-runtime-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G8_CLEANUP
status: APPROVED
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: .weekly-os/results/thing-projection-runtime-v1.v0.3.md
issue: 213
integrationBranch: result/thing-projection-runtime-v1
releaseBranch: release/thing-projection-runtime-v1
productionBaseCommit: 374defbe583fac0839a43611b151d1104b47a42b
validatedIntegrationHead: 7dc040fe90696caf303b0fb43f1f53296ad7fd97
releaseCandidateCommit: 40b5d55cdf8c1fd137dacc7fd2fcee9f62438f01
releasePullRequest: 220
validationRunId: 35256632481
productionCommit: 23d4266a4009d34042b29ec1fb73fb0cbad6b62e
productionDeployRun: 120
productionDeployRunId: 35259685738
pagesArtifactId: 10514141329
pagesArtifactDigest: sha256:4e10d17049a3280d0ec219e1344b73ca94a7a4a07c363a637e76993b12b6844d
productionDeployStatus: SUCCESS
liveRetest: PASS_LIVE_RUNTIME_BOUNDARY
g8Status: CLOSED
---

# MP | Dementor Club | ThingProjection Runtime v1 | Result v1.0

## Status

**APPROVED / RELEASED / LIVE RETEST PASS / G8 CLOSED**

## Goal achieved

The smallest repeated runtime boundary is now released:

`SOURCE OWNER → thin read adapter → ThingProjection → ProgrammingDecision / continuation choice → Surface VM`

without creating a universal Thing registry or moving authority away from existing source owners.

## Released scope

Only the proven source kinds were extracted:

- `program:dengi-na-veter`
- `project:dementor-lab`

`event:fuengirola` remains composition-local.

The released implementation provides:

- one thin ThingProjection runtime/read boundary;
- Program adapter for Dengi;
- Project adapter for DEMENTOR LAB identity;
- Current Program consuming the shared projection while keeping contextual fields local;
- DSO continuation reusing the Dengi projection boundary;
- aligned validators for the new physical boundary.

## Evidence chain

G6 exact-head validation:
`operations/THING_PROJECTION_RUNTIME_G6_2026-09-17.md`

G7 clean RC validation:
`operations/THING_PROJECTION_RUNTIME_G7_RELEASE_CANDIDATE_2026-09-17.md`

Production merge:
`operations/THING_PROJECTION_RUNTIME_G7_MERGE_2026-09-17.md`

Pages release:
`operations/THING_PROJECTION_RUNTIME_PAGES_RELEASE_2026-09-17.md`

Live retest:
`operations/THING_PROJECTION_RUNTIME_LIVE_RETEST_2026-09-17.md`

G8 cleanup:
`operations/THING_PROJECTION_RUNTIME_G8_2026-09-17.md`

## Final invariants

- `thingRef` is the stable cross-context identity reference proven by this Result;
- projection fields do not become source authority;
- Current Program remains one reviewed composition for Home + Board;
- DSO does not become owner of Program facts;
- no `dc_things`, universal Project/Event registry, DB migration or generic repository/service was created;
- Project identity remains project-local and does not depend on `dc_entities`;
- #202 remains a separate ownership/release-truth concern;
- #214 remains unresolved and outside this Result.

`RELEASED ≠ UNIVERSAL ONTOLOGY`
