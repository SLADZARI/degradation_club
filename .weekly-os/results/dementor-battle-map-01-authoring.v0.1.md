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
- Explicit per-cell `cellIndex` for all 81 cells.
- Editable Figma map-authoring frame.
- Units/debug frame with route-distance evidence.
- First editable environment-art frame anchored to gameplay cells.
- Machine-readable reference artifact in Git.
- Short playtest protocol before art lock.

## Figma evidence

File: `DEMENTOR BATTLE — MAP AUTHORING MASTER`  
URL: https://www.figma.com/design/NRl9XrUMzJeds5558ttijA

Working frames:
- `04 MAP-01 OBJECT CONTRACT`
- `05 MAP-01 UNITS + DEBUG`
- `06 MAP-01 ENVIRONMENT ART`

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

## Derived route-distance evidence

Shortest walkable path lengths under the current blocked-cell contract:

- Nikita `B5 → A3 BAR` = 3
- Nikita `B5 → F2 ARCHIVE` = 7
- Nikita `B5 → E8 PRINTSHOP` = 6
- Zhenya `H5 → A3 BAR` = 9
- Zhenya `H5 → F2 ARCHIVE` = 5
- Zhenya `H5 → E8 PRINTSHOP` = 6

This is intentionally recorded as a playtest warning, not as a failure verdict yet. Objective proximity is asymmetric and must be validated in real play before art lock.

## Acceptance Criteria

- Figma contains editable, named placement for every gameplay object.
- Capture cells remain walkable and are visually separate from object footprints.
- Spawn cells are explicit and non-ambiguous.
- Full-cover footprints are blocked.
- Half-cover cells remain walkable.
- Directional cover is specified in the machine-readable artifact.
- All 81 cells have explicit debug metadata in `cellIndex`.
- Figma and Git reference contain the same coordinates and names.
- A playtest protocol exists before environment art is treated as locked.
- No production merge or deploy occurs from this Result without explicit approval.

## Playtest protocol

`operations/DEMENTOR_BATTLE_MAP_01_PLAYTEST_PROTOCOL_V0.1.md`

Minimum validation:
- 6 scripted opening scenarios;
- 4 real hot-seat matches;
- opening reachability;
- first-move advantage;
- center value;
- cover usefulness;
- objective contesting;
- congestion / forced-lane check.

## Environment art status

Environment art has started in Figma as editable isometric props anchored to the formal gameplay contract. This is an **art pass**, not an art lock.

The current pass includes:
- floor grid treatment;
- Bar Counter;
- Archive Shelves;
- Printing Press;
- central full-cover props;
- half-cover props;
- capture landmark signs;
- hero standees at the correct spawn cells.

Next art pass replaces primitive editable geometry with Dementor Club / Dementor Ink illustrated assets while preserving the same anchors and footprints.

## Validation still required

- Run the playtest protocol.
- Check first-move advantage.
- LOS and cover sanity check.
- Confirm no capture point is visually or logically obstructed after illustrated art assets are placed.
- Sync the validated contract into the actual battle implementation map data.

## Evidence

- Figma object contract and obsolete `PRINTSHOP = G7` note corrected.
- Figma `05 MAP-01 UNITS + DEBUG` created.
- Figma `06 MAP-01 ENVIRONMENT ART` created.
- Formal reference artifact: `operations/DEMENTOR_BATTLE_MAP_01_AUTHORING_V0.1.json`.
- Playtest protocol: `operations/DEMENTOR_BATTLE_MAP_01_PLAYTEST_PROTOCOL_V0.1.md`.
- Formal contract commit: `ca04248ebd3191bcb7e653af342792014abadbbf`.
- Playtest protocol commit: `f7b2a0141a03e1f51f787998ed8ddfd4ca2cf766`.

## Gate

Not validated yet. Do not label APPROVED / DONE / PRODUCTION READY until the playable map has passed G6-style functional validation.
