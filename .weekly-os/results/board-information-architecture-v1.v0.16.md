---
artifactId: dementor-club.result.board-information-architecture-v1
project: dementor-club
documentType: RESULT
projectStage: CLEANUP
gate: G8_CLEANUP
status: ACTIVE
version: 0.16
updated: 2026-09-12
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.15
specification: operations/BOARD_INFORMATION_ARCHITECTURE_V1.md
changeDecision: operations/BOARD_TELEGRAM_PROMOTION_V1.md
integrationBranch: agent/board-g8-mobile-types-fix
productionBaseCommit: a22486840adaa08aa77b682461d947f85cb3ca88
productionMergeAuthorized: true
productionDeployAuthorized: true
liveDatabaseMutationAuthorized: false
telegramWorkerDeployAuthorized: false
---

# MP | Dementor Club | CLEANUP | Board Information Architecture v1 | Result v0.16

## Status

**ACTIVE / G8 CLEANUP — PR #153 MERGED / PAGES DEPLOY PENDING**

Owner release instruction: `деплой 153` on 2026-09-12.

## Current live baseline

Production deploy #60 remains the last evidenced live Pages release:

- live production commit: `a22486840adaa08aa77b682461d947f85cb3ca88`;
- Deploy Dementor Production run: **#60 / 34709240809 — SUCCESS**;
- Pages artifact: `10302399181`;
- artifact digest: `sha256:9a67fbe74199f2f75f306e1f3fa44c0fed3a9189558c2bbca043a233dc36b606`;
- scheduler correction and worker v11 are live.

## PR #153 corrective release

PR **#153** was expanded only within the same presentation-only corrective scope to include the owner-reported compact-control label alignment defect in addition to the mobile `ТИПЫ` drawer defect.

Final PR scope:

- 4 changed files;
- canonical mobile `ТИПЫ` drawer remains the existing drawer, rendered as a fixed bottom sheet on narrow viewports;
- `.dc-board-filters` no longer clips that drawer on mobile;
- drawer preserves vertical touch scrolling;
- canonical spatial controls, including `МОЁ`, use explicit `inline-flex / align-items:center / justify-content:center / text-align:center / box-sizing:border-box` centering;
- canonical Board filter buttons use the same centered-label contract;
- Board v2.1 contract guards cover drawer visibility and control-label centering;
- no DB/RLS/worker/membership/lifecycle/route/Telegram semantic changes.

Final validation before merge:

- Site Integrity / Release Readiness **#990 / 34710677853 — PASS**;
- all Board v2/v2.1, Board IA Batch A/B, Telegram promotion, G8 ownership, production artifact, browser matrix, Workspace, My Artifacts, WebKit and release-gate steps passed.

## Repository merge

PR **#153** was squash-merged into `dementor-club-production` after full CI PASS.

New production repository commit:

`638dd42d63d27bc43b524a1086b0904b6f9e671d`

Production merge is complete.

## Current release boundary

The Pages deploy workflow is `workflow_dispatch`-only. The connected GitHub tool surface available in this session exposes workflow reads/reruns but no workflow-dispatch mutation.

Therefore:

- production repository: `638dd42d63d27bc43b524a1086b0904b6f9e671d`;
- live Pages frontend: still `a22486840adaa08aa77b682461d947f85cb3ca88` from deploy #60;
- production deploy for PR #153: **PENDING_WORKFLOW_DISPATCH**;
- no claim of live PR #153 fix or client-preview readiness until deploy succeeds and narrow/mobile live smoke confirms `ТИПЫ` and centered controls.

## Required live smoke after deploy

Minimum post-deploy evidence:

1. narrow/mobile `/workspace/board/` loads;
2. `ТИПЫ` opens the type drawer;
3. a type can be selected and the drawer closes/updates the Board;
4. `МОЁ` and adjacent compact controls are optically centered;
5. an Artifact card still opens normally.

## Deferred operational evidence

Still deferred without synthetic actors/events:

- real non-owner Dementor promotion support `0/2 → 1/2 → 2/2 → pending`;
- real external Telegram delivery from a legitimate pending row;
- all eight Board states exercised by legitimate production actors.

These deferred observations must not be manufactured through role mutation merely to close evidence.
