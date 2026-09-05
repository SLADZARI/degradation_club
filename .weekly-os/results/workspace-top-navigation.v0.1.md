---
artifactId: dementor-club.result.workspace-top-navigation
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: DRAFT
version: 0.1
updated: 2026-09-05
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: null
---

# MP | Dementor Club | BUILD | Workspace Top Navigation | v0.1

## Goal
Move the existing authenticated Workspace navigation from the persistent left sidebar into one canonical top navigation surface without changing membership semantics, route ownership, role permissions or creating a second parallel menu.

## Status
**ACTIVE / G5_BUILD / IMPLEMENTATION NOT YET VALIDATED**

Integration branch: `result/workspace-top-navigation`  
Implementation baseline: `dementor-club-site`  
Production branch: `dementor-club-production`

## Decision / authority
The user explicitly confirmed after portal QA that the current left Workspace navigation is temporary and the intended target is top navigation. This Result changes presentation/IA placement only; it does not authorize new membership states, roles, routes or permissions.

Approved Workspace shell authority remains `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md`.

## Canonical ownership rules
- authenticated `/workspace/*` keeps one canonical Workspace Shell;
- do not render the old left sidebar and a new top menu simultaneously;
- do not reintroduce the public GlobalHeader inside Workspace;
- Workspace brand/logo remains the public escape to `/`;
- identity/avatar remains the profile/identity owner;
- logout remains inside Workspace;
- Board, Artifacts, Activity, Review and Admin remain existing routes/surfaces rather than new parallel pages.

## Navigation content
Ordinary Member target:
- `COMMUNITY BOARD`;
- `МОЙ КЛУБ`;
- `МОИ АРТЕФАКТЫ`;
- `МОЯ АКТИВНОСТЬ`;
- `МОЯ РАБОТА` where the existing role/surface already permits it;
- identity/profile.

Role-aware additions preserve current authorization:
- `MEMBERSHIP REVIEW` only for authorized reviewer/Dementor roles;
- `SYSTEM TOOLS` only for owner/admin roles;
- internal `HOME` remains role/internal behavior and must not become a duplicate public Home concept.

## Acceptance criteria
1. Desktop authenticated Workspace has one top navigation owner and no persistent left sidebar.
2. Mobile Workspace uses one compact responsive top-navigation pattern; it must not create a second navigation implementation.
3. Every existing Workspace destination retains its canonical route/state owner.
4. Ordinary Member default entry remains Community Board.
5. Guest `/workspace/*` boundary still hides private/member/role navigation.
6. Member / Dementor / owner-admin role visibility remains unchanged semantically.
7. Board spatial viewport and Artifact return-context behavior are not regressed.
8. My Artifacts and My Activity projections remain unchanged.
9. Review and System Tools remain inside the same Workspace Shell with normal geometry.
10. Workspace brand/logo still exits to public `/`; public GlobalHeader/Footer remain absent inside authenticated Workspace.
11. Desktop/mobile browser regression passes with no duplicate navigation, horizontal overflow or inaccessible controls.
12. Production release, if later approved, follows a clean candidate from current production baseline; commit/merge does not imply deploy.

## Affected surfaces
- `/workspace/`;
- `/workspace/board/`;
- `/workspace/artifacts/`;
- `/workspace/review/`;
- `/workspace/admin/*`;
- canonical Workspace Shell CSS/JS and existing shell regression tests.

## Non-goals
- no Membership v2 lifecycle changes;
- no new Workspace page family;
- no public Header redesign;
- no DC-9 changes;
- no new role/permission system;
- no new admin publication bypass;
- no unrelated content/visual polish.

## Gate
Current gate: **G5_BUILD**.  
Do not call this Result validated, production-ready, released or done until implementation evidence and G6 validation exist.
