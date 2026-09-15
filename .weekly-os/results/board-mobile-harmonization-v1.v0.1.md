---
artifactId: dementor-club.result.board-mobile-harmonization-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: ACTIVE
version: 0.1
updated: 2026-09-15
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: null
branch: result/board-mobile-harmonization-v1
baseline: dementor-club-production@7054c5c7cf3ccfb6cc15875e6c2db5c825a5cd75
implementationStartAuthorized: true
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# MP | Dementor Club | BUILD | Board Mobile Harmonization v1 | Result v0.1

## Status

**ACTIVE / G5 BUILD**

Owner selected Variant 3 from the reviewed mobile Board concepts and explicitly asked to implement it comprehensively before G8 closure.

## Goal

Harmonize the existing canonical mobile Workspace Board at 390 / 360 px without changing Board semantics or introducing parallel mechanics.

The spatial world may remain larger than the viewport and pannable. The interface chrome must remain fully readable and usable inside the viewport.

## Scope

1. compact mobile Workspace shell/navigation using the existing canonical Header/Workspace owner;
2. one-row Board utility composition: `ВСЁ / ТИПЫ` + the existing publish action;
3. Variant 3 Current Program strip: all three reviewed Things visible at once, no horizontal clipping;
4. one safe-area-aware bottom baseline for pager + existing spatial controls;
5. responsive evidence at 390 and 360 px;
6. no change to Artifact/world semantics, permissions, Membership, Current Program truth, Supabase or persistence.

## Canonical owners extended

- `workspace/workspace-shell-v1.js` remains the Workspace nav/state owner; no duplicate nav is introduced;
- `community/board/board-fullscreen-v2-1.js` remains the fullscreen/pager/primary-action owner;
- `community/board/board-spatial-v1.js` remains the spatial controls/camera owner;
- `community/board/board-program-v1.js` remains the Program render owner;
- `community/board/board-mobile-harmonization-v1.css` owns only cross-component mobile composition for this Board surface.

## Acceptance criteria

### AC1 · Viewport integrity
At 390 and 360 px the Workspace shell, primary member nav, filter row, publish action, Current Program strip, pager and spatial controls remain within the viewport.

### AC2 · Primary nav completeness
`COMMUNITY BOARD / МОЙ КЛУБ / МОИ АРТЕФАКТЫ / МОЯ АКТИВНОСТЬ` remain accessible without one of them being clipped off-screen for the ordinary member state.

### AC3 · Variant 3 Program strip
All three Current Program cards are visible simultaneously. The strip itself does not require horizontal scrolling. Program Things remain separate from Artifacts and only explicit CTA arrows receive pointer events.

### AC4 · Utility hierarchy
Filters and `+ ПРИКОЛОТЬ` share one compact row and do not overlap. Program strip begins below that row.

### AC5 · Bottom dock
Pager and spatial controls share one safe-area-aware baseline without overlap or viewport escape.

### AC6 · Fullscreen ownership
The Board spatial viewport keeps canonical fullscreen geometry; this corrective must not reintroduce the previous viewport displacement regression.

### AC7 · No semantic mutation
No Membership/DC-9/Application change, no Artifact lifecycle or Board IA change, no Current Program composition change, no DB/RLS/migration and no Supabase mutation.

### AC8 · Validation
Focused Chromium acceptance at 390/360 plus the complete existing Site Integrity / Release Readiness workflow must pass before production merge.

## G8 relation

This Result addresses the live mobile Board composition finding observed immediately after release of `dementor-club.result.current-program-projection-v1`.

A successful release + live retest of this corrective may be used as the missing live mobile evidence for Current Program G8 closure, but does not automatically close unrelated WAITING Board Results.

`commit ≠ merge ≠ deploy`
