# Dementor Live · CIVIC UI / World Polish P1

20 October 2026 · implementation candidate (NOT production) · requirements from product owner.

Base: ONE ENGINE / CIVIC + UNIVERSE architecture, v0.4 release source. This is the CIVIC first implementation in a separate feature branch. Shared input / UI / label / chat logic should later be reconciled in ENGINE, without silently applying changes to the still-isolated UNIVERSE v0.3 experimental branch.

## UI / HUD acceptance matrix

| Requirement | Implementation | Caveat |
| --- | --- | --- |
| Topbar residents count instead of "Ты в мире" | "Жители · N" uses online players in server snapshot; connection dot retained | Distinguish connected from registered |
| Two-step tasks disclosure | Entire panel collapse; inside panel focus vs complete task list | Desktop/mobile browser preference survives reload |
| Completed objectives | Separate expandable "✓ N выполнено" disclosure | Done items don't clutter active task list |
| Remove repeated labels | Only "Твои задания" heading remains visible | Legacy telemetry DOM IDs retained but hidden for compatibility |
| Clicking objective | Route to actual target using navigateTo | Never teleports through obstacles |
| Label clutter | World canvas labels appear only near object/player or on hover | Further mobile QA needed |
| Axonometric arrows | Keyboard and touch input transformed to screen axes, automated routing stays world-relative | Other scenes preserve top-down controls |
| Nearby speech | Paper speech bubble and tail follow interpolated moving player | Visibility time-bound |
| Chat chime | Subtle oscillator on incoming chat only | Browser gesture may be required |

## World visuals and collision

- Five deterministic paper-cut tree silhouettes with varied canopies/trunks, a spruce and a miniature tree, tied to existing resource IDs; no resource mint.
- Paper-cut hemp foliage on cultivated plots.
- Trees/stones no longer draw after stock reaches zero; finite balance is untouched.
- Warehouse illustrated as open canopy and material stacks; tool shop includes hand-drawn tool signage; shop footprints have independent proportions.
- Central square monument enlarged visually by 1.6 while interaction ID remains unchanged.
- Hardcoded decorative dirt paths removed. New surfaces are physical purchased and placed objects.
- Authoritative public building collisions mirrored into browser pathfinding by serialized citySolids.
- Newly obstructed physical resource deposits relocate to nearest free clearance area deterministically while preserving their ID and stock; diagnostic movement recorded. This changes spatial coordinates and therefore requires migration acceptance on a **copy of production save** before release.

## CIVIC landscaping

Public paper store: landscape-shop near (16.7,4). Prices below are provisional.

| Product | Pack | Price | Effect |
| --- | ---: | ---: | --- |
| Road paving | 10 | 1 PAPER | ×1.2 walk speed on tile |
| Grass | 10 | 1 PAPER | Ground decoration |
| Flowers | 10 | 1 PAPER | Flower decoration |

Landscaping tiles are city-owned state and purchases belong to individual resident. Wallet PAPER transfers to treasury with requestId idempotency; no new money. Player selects an inventory material and clicks on a nearby free grid cell; the server validates identity, position, obstacles, existing placement and finite inventory. Full editor, taxes, private property rights, refunds, gifts or dismantling are future scope.

Receipt persistence currently uses per-player records with no archival cap. Require explicit retention design before wide deployment.

## Mandatory checks and release restrictions

- Node syntax/model, HTTP/SSE integration and restart persistence using disposable saves.
- Browser: connected-resident count, no duplicate active task, completed disclosure, screen-aligned arrow input, chat bubble, merchant buy/placement, free navigation.
- Real iOS Safari and independent mobile gameplay are **not** certified by Chromium mobile emulation alone.
- Migration/restoration tested on separate copy of real current production save, never against live volume.
- CIVIC and UNIVERSE shared engine changes must be tested together **after** experiment port; separate Universe integration remains pending.
- No production Docker deployment or destructive reset. publish-clean-world.sh --reset-world is prohibited for standard updates.
- Paper Cut 20-icon style canon is separately approved, but binary import into this runtime and production has NOT been proven. Current emoji assets do not satisfy that separate gate.
- All numbers and mockup geometries are prototype parameters, not immutable GDD.

**Status: implementation candidate; final QA evidence must use precise SHA.**