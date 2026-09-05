---
artifactId: dementor-club.result.workspace-top-navigation
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G8_CLEANUP
status: APPROVED
version: 1.0
updated: 2026-09-06
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.4
---

# MP | Dementor Club | RELEASE | Workspace Top Navigation | v1.0

## Goal
Move the existing authenticated Workspace navigation from the persistent left sidebar into one canonical top navigation surface without changing membership semantics, route ownership, role permissions or creating a second parallel menu.

## Final status
**APPROVED / RELEASED / LIVE VALIDATED / G8 CLEANUP COMPLETE**

Production branch: `dementor-club-production`  
Final production HEAD: `64a0de9c6f9c3accc033950b1f757224edde3c19`  
Final live deployed content HEAD: `64a0de9c6f9c3accc033950b1f757224edde3c19`  
Final deploy run: `#38` (`33995419692`)

## Scope delivered
- existing canonical Workspace navigation moved from persistent left sidebar presentation into the top shellbar;
- no second menu owner introduced;
- desktop and mobile use the same Workspace Shell owner;
- role-aware links, identity/profile and logout remain owned by the existing shell runtime;
- public GlobalHeader/Footer remain absent inside authenticated Workspace;
- ordinary Member route semantics, Board default entry, Review/Admin authorization, DC-9/Application behavior and membership lifecycle remain unchanged.

## Validation evidence
Implementation PR #117 passed G6 / Site Integrity #773 and merged into `dementor-club-site`.

The clean production candidate for the shell change passed Production Readiness #775 and merged as `019f8ac0f79aad2c7cd457022eca3b2c1a532d55`. Deploy #37 succeeded from that exact production commit.

Live retest after deploy #37 confirmed:
- one top navigation and no persistent left sidebar on desktop;
- same canonical top navigation owner on mobile;
- navigation destinations, identity/logout and Workspace shell remained functional.

A desktop-only Board geometry regression was then observed: the full-bleed Board surface still inherited the historical Workspace max-width associated with the former left-column layout.

Corrective PR #119 changed only `workspace/board/index.html`, removing the stale max-width from `.dcw-board-view` while preserving readable width limits on other Workspace pages. G6 / Site Integrity #776 passed.

A clean corrective candidate was created directly from live production baseline `019f8ac0f79aad2c7cd457022eca3b2c1a532d55`:
- candidate `2743b549ff99bbbf4cbdfc0782956f47522760af`;
- tree `f8585ebe1e5cf0c35c956c2baceebee647a16281`;
- ahead 1 / behind 0;
- exactly one changed file: `workspace/board/index.html`.

Production Readiness #778 passed completely. PR #120 merged the exact validated tree as `64a0de9c6f9c3accc033950b1f757224edde3c19`.

Deploy #38 succeeded and build logs confirmed checkout of `dementor-club-production` at exact commit `64a0de9c6f9c3accc033950b1f757224edde3c19`. Site validation, content readiness, visual contract, analytics/consent and production release guard all passed. Pages artifact id `9977897382`, digest `sha256:2297500f5f495a15b01ec7a7a91c1332c688a3a229618d5cdc846004af003020`.

## Final live visual evidence
Final desktop `/workspace/board/` retest after deploy #38 confirmed:
- Board hero/wall now uses the available desktop width;
- the large unused right-side sheet caused by the old max-width is gone;
- top Workspace navigation remains present and functional;
- no persistent left sidebar reappeared.

Mobile top-navigation behavior had already been live-confirmed after deploy #37 and was not affected by the one-line Board geometry correction.

## G8 cleanup
No parallel menu, temporary route, auth owner, compatibility state or additional Workspace shell was introduced by this Result.

The historical sidebar DOM host is intentionally reused as the canonical top shellbar owner; it is not a second navigation system. The Board-only width override is scoped to the canonical full-bleed Board surface and does not require a temporary flag or compatibility layer.

No additional cleanup mutation is required for this Result.

## Closure
Acceptance criteria are met with implementation evidence, production readiness evidence, exact production/deploy provenance and final live desktop/mobile confirmation.

**Result closed at G8_CLEANUP.**
