---
artifactId: dementor-club.result.current-program-projection-v1
project: dementor-club
documentType: RESULT
projectStage: CLEANUP
gate: G8_CLEANUP
status: APPROVED
version: 1.0
updated: 2026-09-15
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
integrationBranch: result/current-program-projection-v1
productionBaseCommit: 688899e31b82e14c31f5f805b2bce4f00f3741c0
candidateCommit: 6708b517d8404f8af68b413eef7f9d179c933ecc
pullRequest: 208
implementationStartAuthorized: true
productionMergeAuthorized: true
productionDeployAuthorized: true
productionCommit: 7054c5c7cf3ccfb6cc15875e6c2db5c825a5cd75
productionObservedInCommit: 48a18b5567804d29219efcea217b846f1ebdd675
productionDeployRun: 85
productionDeployRunId: 35020704474
pagesArtifactId: 10417765961
pagesArtifactDigest: sha256:627cb5797efb4fc9587b2a0c27bf53a1ec55caa5ad376f796e557e57a759cae5
productionDeployStatus: SUCCESS
liveRetest: PASS_OWNER_SMOKE_2026-09-15
g8Evidence: operations/CURRENT_PROGRAM_PROJECTION_G8_2026-09-15.md
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | CLEANUP | Current Program Projection v1 | Result v1.0

## Status

**APPROVED / G8 CLOSED / RELEASED**

## Goal result

The first reviewed Current Program runtime slice is released through one shared ThingProjection/composition source without creating a parallel ontology.

Current Program v0 remains:

1. `Деньги на ветер` — ready to take;
2. `Dementor Lab` — approved public project presentation, not public playable Release;
3. `Фуэнхирола` — factual PLANNED event projection.

Exact actions remain:

- `Деньги на ветер` → `ПРОЙТИ КУРС` → `/courses/dengi-na-veter/`;
- `Dementor Lab` → `ПОСМОТРЕТЬ LAB` → `/projects/dementor-lab/`;
- `Фуэнхирола` → `ПОСМОТРЕТЬ СОБЫТИЕ` → `/events/fuengirola/`.

Home and Board consume the same reviewed projection source. Program Things remain separate from Artifacts and Board spatial persistence.

## Validation and release

Final candidate: `6708b517d8404f8af68b413eef7f9d179c933ecc`.

Full Site Integrity / Release Readiness #1182 — PASS on the exact final head.

PR #208 merged to production commit:

`7054c5c7cf3ccfb6cc15875e6c2db5c825a5cd75`

The current production ancestry containing Current Program plus its separate mobile presentation corrective is:

`48a18b5567804d29219efcea217b846f1ebdd675`

Deploy Dementor Production #85 / Actions run `35020704474` — SUCCESS.

Build logs prove exact checkout/build of `48a18b5567804d29219efcea217b846f1ebdd675`.

Pages artifact: `10417765961`.

Digest: `sha256:627cb5797efb4fc9587b2a0c27bf53a1ec55caa5ad376f796e557e57a759cae5`.

Project-owner post-deploy live smoke: **PASS**.

## G8 cleanup

Evidence: `operations/CURRENT_PROGRAM_PROJECTION_G8_2026-09-15.md`.

The post-release mobile composition finding was not hidden inside this Result. It was corrected in separate Result `dementor-club.result.board-mobile-harmonization-v1`, which changed presentation only and preserved Current Program truth.

Cleanup classification:

- PR #208 is merged/closed;
- `result/current-program-projection-v1` is retired from active integration ownership;
- `current-program-v1.js` remains the one shared Program projection/composition source;
- Home and Board keep separate render adapters but no duplicate semantic list;
- no universal `dc_things` table or second Thing ontology was introduced;
- Program Things are not converted into Artifacts;
- no duplicate analytics click owner remains;
- no temporary compatibility runtime or feature flag introduced by this Result remains;
- validation scripts remain intentionally as regression coverage.

## Scope boundaries preserved

No payment/Merch commerce, Membership/access redesign, Fuengirola registration opening, `НЕ КОМАНДА` stabilization, Telegram programming automation, recommendations, broad schema migration or live Supabase mutation was introduced.

Narrow semantic precedence remains: the reviewed source truth for this slice treats `Деньги на ветер` as ready to take. Closure does not create authority for unrelated claims.

No production authorization from this Result carries forward to future Results.

## Closure

This Result is completed history. Future Current Program composition changes require reviewed source truth and a new Result when meaning changes; presentation-only fixes should extend the existing canonical render owners rather than create a second Program system.
