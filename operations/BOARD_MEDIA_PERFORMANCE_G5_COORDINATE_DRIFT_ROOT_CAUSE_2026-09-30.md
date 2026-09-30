---
artifactId: dementor-club.operations.board-media-performance-g5-coordinate-drift-root-cause-2026-09-30
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: ROOT_CAUSE_CONFIRMED_CORRECTIVE_AUTHORIZED
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
result: dementor-club.result.board-media-performance-v1
candidateCommit: 0eac2c9b00bc6a493ec331780948693e16c2a654
integrationPullRequest: 250
---

# Board / Media Performance v1 — coordinate drift root cause

## Root cause

Exact candidate remains:

`0eac2c9b00bc6a493ec331780948693e16c2a654`

Production base:

`a24f8d900cc29e5ae922a9a62b751cc02e88f8d9`

First deterministic divergence is:

```text
Project → ВСЁ
→ board-integrations emits filter/view changes
→ board-spatial::placeCards() restores persisted raw positions
→ board-own-drag-livefix-v2-2::ensureCenteredCloud()
→ non-zero boardOffset is reapplied
→ Artifact style.left/top shifts uniformly
```

390 example:

```text
qa-artifact-own
1200 / 900
→
5240 / 3655

delta
+4040 / +2755
```

The same signature repeats for all Artifact cards and across 390 / 360 / desktop.

No `dc_artifact_board_positions.update()` occurs at the drift point.

Therefore:

```text
DB truth = intact
media normalization = not root cause
backend = not root cause
presentation/world-coordinate ownership conflict = root cause
```

## Ownership conflict

Canonical `board-spatial-v1.js` already owns:

- loading persisted Board positions;
- `placeCards()`;
- camera fit/focus;
- own/admin drag;
- `persistPosition()`.

`board-own-drag-livefix-v2-2.js` duplicates part of drag responsibility and additionally owns a second coordinate translation system:

- `boardOffset`;
- `offsetReady`;
- `cardState`;
- `ensureCenteredCloud()`;
- projection/filter/resize centering listeners.

This second coordinate owner is what drifts after progressive Board projection events.

## Historical evidence

The livefix was originally introduced as a document-capture own-card drag reliability patch.

Its original behavior persisted `style.left/top` directly.

A later separate change added "center existing card cloud in expanded world":

- boardOffset;
- ensureCenteredCloud;
- raw/display conversion;
- filter/projection/resize centering listeners.

The current spatial owner now already owns camera fitting and canonical world coordinates.

## Corrective boundary

Do not remove progressive Board enrichment events to hide the conflict.

Do not change:

- `community/board/board.js`;
- `community/board/board-media-v1.js`;
- media normalization;
- Supabase/backend;
- Board view/filter semantics;
- `board-spatial-v1.js` unless validation proves necessary.

Authorized corrective is limited to:

`community/board/board-own-drag-livefix-v2-2.js`

Restore this compatibility layer to its narrow own-card drag responsibility:

1. remove the secondary cloud-centering/world-offset ownership;
2. keep document-capture own-card drag reliability;
3. persist raw `style.left/top` directly;
4. preserve interactive-control exclusion;
5. do not introduce another event/state owner.

Expected removals:

- `CENTER`;
- `DISPLAY_MARGIN`;
- `boardOffset`;
- `offsetReady`;
- `cardState`;
- `cards()`;
- `cardBoundsFromRaw()`;
- `readRaw()`;
- `ensureCenteredCloud()`;
- `scheduleCenter()`;
- MutationObserver centering;
- `dc:board-spatial-ready` centering listener;
- `dc:board-filter-changed` centering listener;
- `dc:board-projections-updated` centering listener;
- resize centering listener.

`persist()` returns to direct canonical world coordinates:

```js
const x=parseFloat(card.style.left)||0;
const y=parseFloat(card.style.top)||0;
update({x,y})
```

`start()` must not translate the whole cloud before drag.

## Required validation

Exact corrective must prove:

1. `validate-board-navigation-adaptive-cards-browser.mjs` PASS on 390 / 360 / desktop;
2. Project → ВСЁ preserves `style.left/top`;
3. pager → View → ВСЁ preserves coordinates;
4. `validate-board-v21-browser.mjs` PASS including own-card and OWNER_ADMIN movement;
5. DEV2 Board/media validator PASS;
6. BQA-24/BQA-28 regressions PASS;
7. no media/performance runtime file changes;
8. no Supabase/backend changes.

Then rerun full PR #250 Site Integrity.

## Gate

```text
ROOT CAUSE = CONFIRMED
CORRECTIVE = AUTHORIZED
PATCH SCOPE = ONE EXISTING LIVEFIX FILE
G5 = BLOCKED UNTIL EXACT CI PASS
```
