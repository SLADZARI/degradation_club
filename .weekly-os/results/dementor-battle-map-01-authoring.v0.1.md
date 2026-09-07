# Result — Dementor Battle MAP-01 Authoring v0.1

**Artifact ID:** `dementor-club.result.dementor-battle-map-01-authoring`  
**Status:** DRAFT / IN PROGRESS  
**Branch:** `agent/dementor-battle-map-01-authoring`  
**Target Gate:** G6 Validation after playable map test  

## Goal

Create one canonical, editable MAP-01 level-design contract for Dementor Battle so Figma composition, gameplay geometry and implementation data cannot drift apart.

## Scope

- 9×9 orthogonal logical grid with isometric 2:1 presentation.
- Hero spawn cells.
- Three capture cells.
- Named full-cover/blocked object footprints.
- Named half-cover objects and directional cover edges.
- Editable Figma map-authoring frame.
- Machine-readable reference artifact in Git.

## Figma evidence

File: `DEMENTOR BATTLE — MAP AUTHORING MASTER`  
URL: https://www.figma.com/design/NRl9XrUMzJeds5558ttijA  
Canonical working frame: `04 MAP-01 OBJECT CONTRACT`

## Current MAP-01 contract

### Spawns

- Nikita: `B5`
- Zhenya: `H5`

### Capture cells

- Bar: `A3`
- Archive: `F2`
- Printshop: `E8`

### Full-cover / blocked footprints

- `A2+B2` — Bar Counter
- `E1+F1` — Archive Shelves
- `D4` — Concrete Planter
- `F4` — Bust Pedestal
- `C6` — Storage Cabinet
- `G4` — Crate Stack
- `D7` — Filing Cabinet Stack
- `F7` — Paper Pallet
- `D9+E9` — Printing Press

### Half-cover objects

- `A4` — Bar Stools
- `B3` — Side Table
- `C4` — Coffee Table
- `C5` — Lounge Chair
- `E3` — Archive Desk
- `G2` — Reading Table
- `H3` — Side Cabinet
- `D5` — Planter Edge
- `E5` — Bench
- `F5` — Bench Extension
- `G5` — Low Crate Barrier
- `C7` — Poster Stand
- `E7` — Print Worktable
- `F8` — Rolling Cart

## Acceptance Criteria

- Figma contains editable, named placement for every gameplay object.
- Capture cells remain walkable and are visually separate from object footprints.
- Spawn cells are explicit and non-ambiguous.
- Full-cover footprints are blocked.
- Half-cover cells remain walkable.
- Directional cover is specified in the machine-readable artifact.
- Figma and Git reference contain the same coordinates and names.
- No production merge or deploy occurs from this Result without explicit approval.

## Validation still required

- Playtest path lengths to all three capture points from both spawns.
- First-move advantage check.
- LOS and cover sanity check.
- Confirm no capture point is visually or logically obstructed after art assets are placed.
- Sync the validated contract into the actual battle implementation map data.

## Evidence

- Figma frame created and obsolete `PRINTSHOP = G7` note corrected.
- Reference artifact: `operations/DEMENTOR_BATTLE_MAP_01_AUTHORING_V0.1.json`.
- Initial Git commit: `778203a85f066659da78dece2a8afa7be0f151e5`.

## Gate

Not validated yet. Do not label APPROVED / DONE / PRODUCTION READY until the playable map has passed G6-style functional validation.
