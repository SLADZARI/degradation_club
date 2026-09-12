---
artifactId: dementor-club.evidence.public-site-visual-tech-debt-cleanup-refresh-2026-09-12
project: dementor-club
documentType: QA_EVIDENCE
projectStage: CLEANUP
gate: G8_CLEANUP
status: APPROVED_EVIDENCE
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.public-site-visual-tech-debt-cleanup-v1
---

# Public Site Visual Tech-Debt Cleanup — release + live evidence

## Release candidate

PR #155 was rebuilt directly on the post-Board-corrective production baseline `af28404048dfc918ada81298b0d184df407d0595`.

Validated candidate head: `bf8156f0c8934aabfd062b6a2def3910c3921e44`.

Final candidate shape before merge:

- 1 commit;
- 8 changed files;
- `ink-layout-v2.js`;
- `merch-runtime-v1.js`;
- four Merch product detail pages;
- this evidence artifact;
- `scripts/validate-visual-contract.mjs`;
- no `community/board/**`, Supabase, Membership/DC-9, Workspace/auth or workflow changes.

## G6 validation

Full Site Integrity / Release Readiness #1026 / run `34720030176` passed on exact candidate `bf8156f0c8934aabfd062b6a2def3910c3921e44`.

The integrated run included public visual validation, Home Fuengirola browser references, Board v2/v2.1 contracts, Board live corrective acceptance, Workspace recovery, My Artifacts, WebKit auth, route manifest and production release gate.

No baseline/tolerance relaxation was used.

## Production merge

PR #155 was squash-merged after explicit owner authorization `разрешаю #155 в production`.

Production commit: `43b6dcaa11292f49564c989add219e0b095fbf8d`.

## Production deploy

Deploy Dementor Production #64 / run `34720912365` completed successfully.

Build evidence:

- checkout ref: `dementor-club-production`;
- exact checked-out commit: `43b6dcaa11292f49564c989add219e0b095fbf8d`;
- build job: SUCCESS;
- deploy job: SUCCESS;
- Pages artifact: `10305384132`;
- artifact digest: `sha256:ce4324fd48037817c7a5c188104611edde913477339106234bc1a890699905b2`.

## Owner live smoke

After deploy #64 the project owner explicitly reported that the tested production release works.

This owner live smoke is accepted as direct production-browser evidence for the released visual/merch cleanup. It does not promote the DRAFT visual specification to project-wide DESIGN authority and does not close unrelated Board operational evidence.

## Current gate implication

Public Site Visual Tech-Debt Cleanup v1 may move from G7 RELEASE to G8 CLEANUP.

This is not a final DONE claim. Remaining work is cleanup/handoff only: stale branch/state cleanup and confirming that no temporary compatibility work introduced by this Result remains unowned.

## Scope boundary

No DB/RLS, Membership/DC-9, Board semantics, Telegram Promotion, scheduler, auth ownership or workflow behavior changed in this Result.
