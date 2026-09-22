---
artifactId: dementor-club.operations.board-controls-live-qa-corrective-2026-09-22
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: APPROVED
version: 1.0
updated: 2026-09-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
---

# STAB-06 · Board controls live QA corrective

## Production under test

`bdd23f80d12bd38a82b5afe2c1257e22d4e64beb`

Pages:

`Deploy Dementor Production #131 / 35781834222 · SUCCESS`

## Owner live observations

Desktop owner QA found two release blockers.

### 1. View drawer stacking

Opening the Board View drawer can place it visually below the standalone desktop Current Program cards.

Expected:

`View drawer > Current Program presentation > spatial cards`

The drawer must remain fully visible and clickable.

### 2. Stale Artifact deep-link focus interferes with controls

The live URL may retain:

`?focus=artifact:<uuid>`

After that, explicit Board controls such as `ВСЁ` or the pager arrows can be followed by the previously focused Artifact being focused/opened again.

Expected:

- View controls only change the active Board View;
- pager arrows only move/focus the pager target;
- an old URL focus must not reassert itself after explicit Board navigation;
- controls must not open the owner's Artifact as a side effect.

## Root-owner direction approved by owner

Continue the same STAB-06 Result.

Use existing owners only:

- `community/board/board-fullscreen-v2-1.js` for fullscreen composition/pager;
- `community/board/board-deeplink-auth-return-v1.js` for URL focus lifecycle;
- `community/board/board-integrations-v1.js` for explicit View navigation signal;
- existing Board CSS owners only if required;
- existing validators only.

Do not change Current Program composition or create a second renderer/filter/navigation owner.

Schema/RPC/RLS/auth semantics are out of scope.
STAB-07 is not started.
