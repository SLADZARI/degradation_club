---
artifactId: dementor-club.operations.thing-projection-runtime-g6-2026-09-17
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.thing-projection-runtime-v1
---

# ThingProjection Runtime v1 — G6 validation evidence

## Result
`dementor-club.result.thing-projection-runtime-v1`

## Production baseline
`dementor-club-production@374defbe583fac0839a43611b151d1104b47a42b`

## Exact validated candidate
- integration branch: `result/thing-projection-runtime-v1`
- original implementation candidate: `a8c7b6384939220213b4670972e72fdd5e789d66`
- corrective candidate / exact validated head: `7dc040fe90696caf303b0fb43f1f53296ad7fd97`
- topology against production baseline: `ahead_by=2`, `behind_by=0`
- exact diff: 7 files

The corrective commit only aligned the pre-existing canonical visual validator with the new ThingProjection boundary after the first exact-head G6 run exposed validator drift. It did not change product semantics or broaden runtime scope.

## Exact diff boundary
1. `thing-projection-v1.js`
2. `current-program-v1.js`
3. `courses/dumai-s-opasnostyu/data.js`
4. `courses/dumai-s-opasnostyu/index.html`
5. `scripts/validate-current-program-v1.mjs`
6. `scripts/validate-dumai-release-loop-v1.mjs`
7. `scripts/validate-visual-contract.mjs`

No DB/Supabase migration, Catalog rewrite, Contribution/#214 mutation, Membership/auth change, Event adapter, universal registry, generic repository/service layer, production merge or deployment is part of the candidate.

## Architecture proven
`SOURCE OWNER → thin read adapter → ThingProjection → ProgrammingDecision / continuation choice → Surface VM`

Initial source kinds remain exactly:
- `program:dengi-na-veter`
- `project:dementor-lab`

`event:fuengirola` remains composition-local and is not promoted into the shared abstraction.

## Exact-head validation
A one-shot workflow checked out exact candidate `7dc040fe90696caf303b0fb43f1f53296ad7fd97` and asserted the SHA before validation.

GitHub Actions:
- workflow: `ThingProjection #213 exact-head G6 rerun`
- run id: `35254861885`
- conclusion: `SUCCESS`

All validation steps completed successfully, including:
- Supabase release contract;
- registry/routes/feature state;
- page content readiness;
- visual contract;
- Membership/DC-9/Board static contracts;
- production candidate build;
- Current Program v1 contract;
- DSO Release Loop v1 contract;
- production analytics + consent;
- canonical shell integration;
- built JavaScript syntax;
- Google OAuth handoff;
- Playwright browser runtime installation;
- Current Program Home + Board browser acceptance;
- DSO Release Loop browser acceptance;
- desktop/mobile/public harmonization browser regressions;
- Projects v2 regression;
- DC-9 sync;
- Board fullscreen/live/deep-link/share regressions;
- Workspace recovery;
- Artifact history;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

## Acceptance result
PASS:
- stable `thingRef` preserved for Program and Project;
- two source kinds cross the shared read boundary;
- Home + Board continue to consume one reviewed Current Program composition;
- DSO continuation reuses the Dengi projection boundary;
- canonical routes remain intact;
- contextual fields remain outside canonical identity;
- no Project dependency on `dc_entities` was introduced;
- no Event abstraction was added;
- no parallel registry/DB owner/compatibility runtime was introduced.

## Gate
**G6 PASS / READY FOR CLEAN G7 RELEASE CANDIDATE PREPARATION.**

This evidence does not authorize production merge or deployment.

`G6 PASS ≠ production merge ≠ deploy ≠ live retest ≠ G8`
