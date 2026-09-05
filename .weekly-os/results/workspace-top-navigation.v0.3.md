---
artifactId: dementor-club.result.workspace-top-navigation
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: DRAFT
version: 0.4
updated: 2026-09-06
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.3
---

# MP | Dementor Club | RELEASE | Workspace Top Navigation | v0.4

## Goal
Move the existing authenticated Workspace navigation from the persistent left sidebar into one canonical top navigation surface without changing membership semantics, route ownership, role permissions or creating a second parallel menu.

## Status
**ACTIVE / G7_RELEASE / DEPLOY #38 SUCCESS / FINAL DESKTOP BOARD LIVE VISUAL RETEST REQUIRED**

Integration branch: `result/workspace-top-navigation`  
Release branch: `release/workspace-top-navigation-v02-board-width`  
Production branch: `dementor-club-production`  
Current production HEAD: `64a0de9c6f9c3accc033950b1f757224edde3c19`  
Current live deployed content HEAD: `64a0de9c6f9c3accc033950b1f757224edde3c19`

## Authority / protected boundaries
Approved Workspace authority remains `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md`.

This Result is a presentation/IA placement change only. It does not change:
- Membership v2 lifecycle or role semantics;
- auth ownership or callback behavior;
- ordinary Member default entry to Community Board;
- Board slot/composer ownership;
- Workspace route ownership;
- Review/Admin authorization;
- DC-9 or Application behavior;
- public GlobalHeader/Footer ownership.

One Workspace Shell remains the only authenticated navigation owner.

## Top-navigation implementation evidence
Implementation PR #117 moved the existing canonical Workspace navigation from the left sidebar presentation into the top shellbar. G6 / Site Integrity #773 passed. Production Readiness #775 passed. Production merge `019f8ac0f79aad2c7cd457022eca3b2c1a532d55` was deployed as deploy #37.

Live retest after deploy #37 confirmed:
- desktop Workspace uses top navigation and no persistent left sidebar;
- mobile Workspace uses the same top navigation owner and behaves correctly;
- navigation destinations, identity/logout and Workspace shell continue to work.

## Desktop Board corrective evidence
A desktop-only geometry defect was observed after deploy #37: Community Board inherited the historical `.dcw-view{max-width:1400px}` limit, leaving unused space on the right after the shell moved from a left column to the top.

The correction is scoped only to `workspace/board/index.html`:
- `.dcw-board-view` uses `max-width:none`, `width:100%`, `margin:0`;
- no global Workspace width change;
- other Workspace pages retain their readable max-width behavior;
- no route/auth/membership/role/nav semantic change.

Integration PR #119 passed G6 / Site Integrity #776 and merged into `dementor-club-site` as `7a036ba4cd7ccd635ba273931c2087227d0f4c94`.

Clean production candidate was created directly from live production baseline `019f8ac0f79aad2c7cd457022eca3b2c1a532d55`.

Candidate commit: `2743b549ff99bbbf4cbdfc0782956f47522760af`  
Candidate tree: `f8585ebe1e5cf0c35c956c2baceebee647a16281`

Compare to live production baseline:
- ahead: 1;
- behind: 0;
- exactly 1 changed file: `workspace/board/index.html`.

Production PR #120 passed Production Readiness #778 completely and merged as `64a0de9c6f9c3accc033950b1f757224edde3c19`.

Production merge tree is exactly `f8585ebe1e5cf0c35c956c2baceebee647a16281`, equal to the validated candidate tree.

## Deploy #38 evidence
The user explicitly authorized the corrective deploy and manually dispatched canonical `Deploy Dementor Production`.

Deploy run #38 (`33995419692`) completed successfully:
- build job: PASS;
- deploy job: PASS;
- checkout ref: `dementor-club-production`;
- `git log -1 --format=%H` inside build resolved exactly to `64a0de9c6f9c3accc033950b1f757224edde3c19`;
- site validation: 0 errors / 0 warnings;
- content readiness: PASS;
- visual contract: PASS;
- production analytics/consent: PASS;
- production release guard: PASS, 48 HTML routes covered;
- Pages artifact id: `9977897382`;
- artifact digest: `sha256:2297500f5f495a15b01ec7a7a91c1332c688a3a229618d5cdc846004af003020`;
- GitHub Pages deploy: PASS.

## Required final live retest
Only one focused live check remains:
1. open `/workspace/board/` on desktop;
2. confirm the Board hero/wall use the available width with no large unused right-side sheet caused by the old max-width;
3. confirm top navigation remains present and functional.

Mobile top-navigation behavior was already live-confirmed after deploy #37 and is unaffected by this one-line Board geometry correction.

## Gate
Current gate remains **G7_RELEASE** until this final desktop Board visual retest is confirmed. Do not mark this Result DONE/APPROVED before that evidence.
