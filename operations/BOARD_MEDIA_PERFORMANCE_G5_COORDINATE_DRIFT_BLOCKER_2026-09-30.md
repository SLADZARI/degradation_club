---
artifactId: dementor-club.operations.board-media-performance-g5-coordinate-drift-blocker-2026-09-30
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: BLOCKED
version: 1.0
updated: 2026-09-30
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
result: dementor-club.result.board-media-performance-v1
candidateCommit: 0eac2c9b00bc6a493ec331780948693e16c2a654
integrationPullRequest: 250
siteIntegrityRun: 1327
siteIntegrityRunId: 36691834625
siteIntegrityAttempt: 2
---

# Board / Media Performance v1 — G5 world-coordinate drift blocker

## Attempt reconciliation

Attempt #1 on exact candidate:

`Site Integrity #1327 / 36691834625 · attempt 1`

failed in OWNER_ADMIN drag persistence.

Forensic replay plus attempt #2 on the exact same candidate did not reproduce that failure.

Attempt #2 exact owner-admin result:

```text
Validate Board v2.1 fullscreen browser state matrix = PASS
```

Therefore:

```text
OWNER_ADMIN drag deterministic candidate regression = NOT PROVEN
runtime patch for that failure = NOT AUTHORIZED
```

## Current exact blocker

The same unchanged candidate then failed:

`Validate Board navigation and adaptive cards browser acceptance`

with six consistent failures:

```text
view-390:     ВСЁ fit mutated persisted card coordinates
pager-390:    View switch after pager mutated persisted coordinates
view-360:     ВСЁ fit mutated persisted card coordinates
pager-360:    View switch after pager mutated persisted coordinates
view-desktop: ВСЁ fit mutated persisted card coordinates
pager-desktop: View switch after pager mutated persisted coordinates
```

The pattern reproduces at all tested viewport classes.

## Important evidence boundary

The validator's `boardState().positions` is:

```js
Object.fromEntries(nodes.map(node=>[
  normalize(node),
  {left:node.style.left,top:node.style.top}
]))
```

Therefore the failing assertion proves:

```text
inline Board world/display coordinates changed
```

It does NOT by itself prove:

```text
dc_artifact_board_positions was written
```

The QA message uses "persisted coordinates" as contract language, but no live DB mutation is evidenced by this assertion.

## Candidate source-level difference

The Board/media candidate introduces progressive enrichment and emits:

- `dc:board-projections-updated {source:'artifact-secondary-enrichment'}`
- `dc:board-projections-updated {source:'artifact-media-enrichment'}`

Existing canonical spatial owners react to projection/filter/view events.

This is a plausible interaction boundary, not yet proven root cause.

## Required diagnostic before patch

Compare exact production base vs candidate using the same navigation/adaptive fixture.

For each viewport 390 / 360 / desktop capture exact artifact world positions:

1. initial stabilized Board;
2. Current Program view;
3. Program view;
4. Project view;
5. restored ВСЁ;
6. pager movement;
7. Current Program after pager;
8. restored ВСЁ after pager.

For every first coordinate change capture:

- artifact id;
- before/after `style.left/top`;
- `data-size-class`;
- card width/height;
- current Board camera transform;
- `boardOffsetX/Y` if present;
- last `dc:board-projections-updated` source;
- last `dc:board-filter-changed`;
- last `dc:board-view-changed`;
- whether `board-spatial-v1::placeCards()` ran;
- whether `board-own-drag-livefix-v2-2::ensureCenteredCloud()` ran;
- whether any `dc_artifact_board_positions.update()` occurred.

Determine the FIRST divergent step between production and candidate.

Specific hypotheses to test, not assume:

A. late progressive enrichment event re-runs `placeCards()` after centered display coordinates were established;

B. enrichment changes card geometry/size-class, causing centering math to shift world coordinates;

C. view/filter event ordering between `placeCards()` and `ensureCenteredCloud()` changes because of the new projection events;

D. actual persistence write occurs unexpectedly.

No runtime patch until one is proven.

## Gate

```text
G5 = BLOCKED
owner-admin drag patch = NO
coordinate-drift patch = NO UNTIL ROOT CAUSE
DEV1 backend integration = HOLD
production merge/deploy = NO
```
