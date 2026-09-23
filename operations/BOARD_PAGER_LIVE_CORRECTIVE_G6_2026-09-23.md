---
artifactId: dementor-club.operations.board-pager-live-corrective-g6-2026-09-23
project: dementor-club
documentType: QA_EVIDENCE
projectStage: BUILD
gate: G6_VALIDATION
status: APPROVED
version: 1.0
updated: 2026-09-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
scope:
  - STAB-06
  - BQA-18
---

# STAB-06 · Board pager live corrective · G6 validation

## Baseline

Production:

`a26edad33839f0fef10c561570507e1ef0a4435d`

Pages live-QA baseline:

`Deploy Dementor Production #132 / 35834976559 · SUCCESS`

Owner live acceptance before corrective:

- filters desktop PASS;
- filters mobile PASS;
- pager arrows/count visible;
- pager did not visibly navigate/focus the next card;
- G8 NOT AUTHORIZED.

## Root cause

The defect had two parts inside existing Board owners.

### 1. Split camera ownership

`board-fullscreen-v2-1.js` owned pager UI/index but also directly mutated `boardHost.style.transform`.

`board-spatial-v1.js` separately owned canonical `camera`, `setCamera()`, and `applyCamera()`.

This produced two states for one camera.

Corrective ownership:

```text
pager selects target Thing
→ existing dc:board-focus-target event
→ board-spatial-v1.js
→ focusSpatialTarget()
→ setCamera()
→ applyCamera()
```

Fullscreen no longer owns pager camera movement.

### 2. Mobile rendered-center geometry

By CI #1256 the target identity, pager count, and canonical transform changes were already correct, but `centered=false` remained on 390/360.

One reproduced case:

```text
viewport = 390
target = qa-artifact-idea (#3)
scale = 0.92
expected viewport center X = 195.0 px
#1256 effective rendered center X ≈ 190.4 px
delta X = -4.6 px
validator tolerance = ±3 px
```

On 360:

```text
expected center X = 180.0 px
#1256 effective rendered center X ≈ 175.4 px
delta X = -4.6 px
```

The same-target camera transform changed from #1256 to the passing #1257 by exactly +4.6 screen px:

```text
390 target #3:
#1256 translateX = -1838.2 px
#1257 translateX = -1833.6 px

360 target #3:
#1256 translateX = -1853.2 px
#1257 translateX = -1848.6 px
```

At scale 0.92 this equals exactly 5 world px.

Therefore the validator metric was correct: this was a real mobile geometry error, not a false negative.

The old focus math derived the target center from layout-world bounds. The corrected spatial owner derives the actual rendered center from `getBoundingClientRect()`, maps it back through the current canonical camera, then calls `setCamera()`.

## Browser regression

Existing `scripts/validate-board-navigation-adaptive-cards-browser.mjs` now exercises real controls on:

- 1440
- 390
- 360

Required pager sequence PASS:

```text
1 / N
→ 2 / N
→ 3 / N
← 2 / N
← 1 / N
← N / N
→ 1 / N
```

For each transition it checks:

- exact pager counter;
- exact target Thing identity;
- focused target class;
- rendered target centered in viewport;
- canonical spatial transform changes;
- canonical camera status changes;
- pager navigation does not mutate persisted card coordinates.

After pager navigation it also verifies:

- zoom PASS;
- pan PASS;
- drag PASS;
- drag does not open Artifact;
- View switch PASS;
- ВСЁ PASS;
- Current Program PASS;
- Relations do not alter visible Thing set;
- stale `focus=artifact` companion regression remains covered.

## Canonical validation

```text
Site Integrity / Release Readiness #1257
run id = 35869634342
attempt = 2
head = 0780bcdbe663ac5ce1ce14357e6b416c38310167
conclusion = SUCCESS
```

The full job completed with no failing steps.

## Exact diff

Production → candidate:

```text
ahead = 10
behind = 0
changed files = 4
```

Exact files:

1. `community/board/board-fullscreen-v2-1.js`
2. `community/board/board-integrations-v1.js`
3. `community/board/board-spatial-v1.js`
4. `scripts/validate-board-navigation-adaptive-cards-browser.mjs`

No Current Program semantic change.
No Relations semantic change.
No schema/RPC/RLS/Supabase.
No STAB-07.

## G6 verdict

`APPROVED`
