---
artifactId: dementor-club.result.public-site-visual-tech-debt-cleanup-v1
project: dementor-club
documentType: RESULT
projectStage: CLEANUP
gate: G7_RELEASE
status: ACTIVE
version: 0.3
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.2
specification: operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md
integrationBranch: agent/public-site-visual-tech-debt-cleanup-v1-refresh
productionBaseCommit: af28404048dfc918ada81298b0d184df407d0595
productionMergeAuthorized: true
productionDeployAuthorized: true
liveDatabaseMutationAuthorized: false
---

# MP | Dementor Club | CLEANUP | Public Site Visual Tech-Debt Cleanup v1 | Result v0.3

## Status

**ACTIVE / G7 RELEASE — REBASED ISOLATED CANDIDATE VALIDATED**

The owner explicitly resumed this Result and authorized PR #155 for production with `разрешаю #155 в production` on 2026-09-12.

## Exact production baseline

Current live production after Board corrective #156:

`af28404048dfc918ada81298b0d184df407d0595`

Deploy #63 / run `34719474734` — SUCCESS.
Pages artifact: `10305938397`.
Artifact digest: `sha256:37e5cf886005fcaecc34757988b34f1aba8a774e944cb06bbbd834c6aa41e988`.

The deploy build explicitly checked out `dementor-club-production` and `git log -1` resolved to `af28404048dfc918ada81298b0d184df407d0595`.

## Release candidate

PR: **#155** — `Public visual tech-debt cleanup v1 — refreshed isolated candidate`.

Integration branch:

`agent/public-site-visual-tech-debt-cleanup-v1-refresh`

Exact candidate head:

`bf8156f0c8934aabfd062b6a2def3910c3921e44`

Candidate shape:

- 1 commit;
- 8 changed files;
- no `community/board/**` files;
- no Supabase, Membership/DC-9, Workspace/auth or workflow files;
- no change to `visual-standard-v2.css`, `home-event-fuengirola-20260828.css`, `ink-layout-v2.css`, or `ink-layout-v2-tuning.css`.

Changed files are limited to:

- `ink-layout-v2.js`;
- `merch-runtime-v1.js`;
- four Merch product detail pages;
- `operations/PUBLIC_SITE_VISUAL_TECH_DEBT_CLEANUP_REFRESH_2026-09-12.md`;
- `scripts/validate-visual-contract.mjs`.

## G6 evidence

Full Site Integrity / Release Readiness **#1026 / run `34720030176` — PASS** on exact SHA `bf8156f0c8934aabfd062b6a2def3910c3921e44`.

The run passed the full integrated matrix including:

- public visual contract;
- Home Fuengirola browser references and harmonization matrix;
- Board v2 / v2.1 contracts;
- Board G8 cleanup ownership contract;
- Board live corrective browser acceptance;
- Workspace recovery;
- My Artifacts history;
- WebKit auth regression;
- production route manifest;
- production release gate.

No visual baseline or tolerance relaxation is authorized by this Result.

## Scope

- narrow Ink runtime ownership to Home Hero + About + Logic;
- retire Community Ink runtime ownership and old runtime image injection where the canonical visual owner already exists;
- preserve behaviorally active compatibility CSS until a separate explicit geometry refactor exists;
- stabilize Merch to visible `SH-DEM-01..04` mapping by explicit SKU;
- keep public catalog/detail visible when runtime data is unavailable;
- replace internal/TBD commercial language with visitor-facing unavailable states;
- strengthen validation around canonical visual ownership.

## Hard boundaries

No changes to:

- Board implementation or semantics;
- DB / RLS;
- Membership / DC-9 lifecycle;
- Workspace/auth ownership;
- Telegram Promotion / outbox / trusted scheduler;
- workflow ownership;
- project-wide PRODUCT / DOMAIN / ARCHITECTURE / DESIGN authority.

`operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md` remains DRAFT / REFERENCE and is not promoted to project-wide design authority by this Result.

## Release boundary

Production merge and Pages deployment for PR #155 are explicitly authorized by the project owner. `Commit ≠ merge ≠ deploy`: repository merge must be recorded separately from successful Pages deployment.

## Acceptance before G8 closure

After merge/deploy, live smoke must confirm the changed public surfaces, especially Home/Fuengirola ownership and the four Merch detail/catalog states. Board #156 must remain unaffected in the integrated production composition.
