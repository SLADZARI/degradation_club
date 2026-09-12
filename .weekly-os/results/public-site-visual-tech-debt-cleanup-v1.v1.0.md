---
artifactId: dementor-club.result.public-site-visual-tech-debt-cleanup-v1
project: dementor-club
documentType: RESULT
projectStage: CLEANUP
gate: G8_CLEANUP
status: APPROVED
version: 1.0
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.4
specification: operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md
integrationBranch: agent/public-site-visual-tech-debt-cleanup-v1-refresh
productionBaseCommit: af28404048dfc918ada81298b0d184df407d0595
productionCommit: 43b6dcaa11292f49564c989add219e0b095fbf8d
productionMergeAuthorized: true
productionDeployAuthorized: true
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | CLEANUP | Public Site Visual Tech-Debt Cleanup v1 | Result v1.0

## Status

**APPROVED / G8 CLOSED / RELEASED**

## Goal result

The public visual/merch cleanup was released without mixing Board, Membership/DC-9, Workspace/auth, Supabase or workflow changes.

Released scope:

- Ink runtime ownership narrowed to Home Hero + About + Logic;
- obsolete Community/Fuengirola runtime image injection retired where canonical visual owners already exist;
- accepted Home/Fuengirola compatibility geometry retained explicitly pending a separately scoped geometry refactor;
- Merch visible entity set stabilized to `SH-DEM-01..04`;
- Merch runtime resolves by explicit SKU rather than card position;
- missing runtime rows no longer remove public cards/details;
- visitor-facing unavailable states replace technical/TBD copy;
- visual contract strengthened around the accepted ownership boundary.

## Validation and release

Candidate `bf8156f0c8934aabfd062b6a2def3910c3921e44` passed full Site Integrity / Release Readiness #1026.

PR #155 was squash-merged to production commit:

`43b6dcaa11292f49564c989add219e0b095fbf8d`

Deploy #64 / run `34720912365` — SUCCESS.

Pages artifact `10305384132`.

Digest `sha256:ce4324fd48037817c7a5c188104611edde913477339106234bc1a890699905b2`.

Owner production smoke: PASS.

Client preview status at closure: READY.

## G8 cleanup

Evidence: `operations/PUBLIC_SITE_VISUAL_TECH_DEBT_CLEANUP_G8_2026-09-13.md`.

Completed cleanup actions:

- stale PR #144 explicitly closed as superseded / do not merge;
- original and refreshed integration branches retired from active ownership;
- no temporary compatibility owner introduced by this Result remains unclassified;
- retained Home/Fuengirola compatibility CSS is documented as behaviorally active and deferred to a dedicated geometry refactor;
- project kernel and artifact index point to exact released state.

Physical historical Git refs may remain for traceability; they no longer own active integration.

## Boundaries preserved

No project-wide PRODUCT / DOMAIN / ARCHITECTURE / DESIGN authority is inferred from this Result.

`operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md` remains DRAFT / REFERENCE.

No production authorization from this Result carries into future Results.

## Closure

This Result is completed history. Future Board UX work must use a separate Result and current production baseline.
