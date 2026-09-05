---
artifactId: dementor-club.result.workspace-top-navigation
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: DRAFT
version: 0.3
updated: 2026-09-05
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.2
---

# MP | Dementor Club | RELEASE | Workspace Top Navigation | v0.3

## Goal
Move the existing authenticated Workspace navigation from the persistent left sidebar into one canonical top navigation surface without changing membership semantics, route ownership, role permissions or creating a second parallel menu.

## Status
**ACTIVE / G7_RELEASE / DEPLOY #37 SUCCESS / MOBILE TOP NAV PASS / DESKTOP BOARD GEOMETRY CORRECTIVE MERGED / DEPLOY REQUIRED**

Integration branch: `result/workspace-top-navigation`  
Release branch: `release/workspace-top-navigation-v02-board-width`  
Production branch: `dementor-club-production`  
Current production HEAD: `64a0de9c6f9c3accc033950b1f757224edde3c19`  
Current live deployed content HEAD: `019f8ac0f79aad2c7cd457022eca3b2c1a532d55`

## Evidence through deploy #37
Deploy #37 succeeded and built from exact production commit `019f8ac0f79aad2c7cd457022eca3b2c1a532d55`.

Live retest after deploy #37 confirmed:
- desktop Workspace uses top navigation and no persistent left sidebar;
- mobile Workspace uses the same top navigation owner and behaves correctly;
- navigation destinations, identity/logout and Workspace shell continue to work.

A desktop-only geometry defect was observed on Community Board: the full-bleed Board surface inherited the historical `.dcw-view{max-width:1400px}` limit that was appropriate when content lived beside the old sidebar, leaving unused space on the right after the shell moved to the top.

## Corrective implementation
The correction is scoped only to the canonical full-bleed Board view in `workspace/board/index.html`:
- `.dcw-board-view` now explicitly uses `max-width:none`, `width:100%`, `margin:0`;
- no global Workspace width change;
- other Workspace pages retain their readable max-width behavior;
- no route/auth/membership/role/nav semantic change.

Integration PR #119 passed G6 / Site Integrity #776 and merged into `dementor-club-site` as `7a036ba4cd7ccd635ba273931c2087227d0f4c94`.

## Clean corrective production candidate
Candidate branch was created directly from current live production baseline `019f8ac0f79aad2c7cd457022eca3b2c1a532d55`.

Candidate commit: `2743b549ff99bbbf4cbdfc0782956f47522760af`  
Candidate tree: `f8585ebe1e5cf0c35c956c2baceebee647a16281`

Compare to live production baseline:
- ahead: 1;
- behind: 0;
- exactly 1 changed file: `workspace/board/index.html`.

Production PR #120 passed Production Readiness #778 completely and merged as `64a0de9c6f9c3accc033950b1f757224edde3c19`.

Production merge tree is exactly `f8585ebe1e5cf0c35c956c2baceebee647a16281`, equal to the validated candidate tree.

## Deployment boundary
The corrective production merge is **NOT DEPLOYED**. Deploy #37 authorization was consumed by deploy #37 and does not authorize this correction.

A new explicit `деплой` is required for production commit `64a0de9c6f9c3accc033950b1f757224edde3c19`.

## Required final live retest after corrective deploy
Only one focused check is required:
1. open `/workspace/board/` on desktop;
2. confirm Board hero/wall use the available width with no large unused right-side sheet caused by the old max-width;
3. confirm top navigation remains present and functional.

Mobile top-navigation behavior was already live-confirmed after deploy #37 and is not affected by this one-line Board geometry correction.

## Gate
Current gate remains **G7_RELEASE** until corrective deploy + focused desktop live retest.
