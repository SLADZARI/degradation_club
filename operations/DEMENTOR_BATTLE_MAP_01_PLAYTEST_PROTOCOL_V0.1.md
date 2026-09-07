# DEMENTOR BATTLE · MAP-01 PLAYTEST PROTOCOL V0.1

**Status:** DRAFT  
**Branch:** `agent/dementor-battle-map-01-authoring`  
**Related map contract:** `operations/DEMENTOR_BATTLE_MAP_01_AUTHORING_V0.1.json`

## Goal
Validate MAP-01 gameplay geometry before environment art lock.

## What we test
- spawn fairness;
- opening reachability;
- value of the center;
- full/half cover usefulness;
- LOS sanity;
- whether all three capture points are contestable;
- whether the map creates congestion or one forced lane.

## Canonical test map

### Spawns
- Nikita — `B5`
- Zhenya — `H5`

### Capture cells
- Bar — `A3`
- Archive — `F2`
- Printshop — `E8`

### Temporary test profile
- movement: 4 cells / turn;
- attack range: 4 cells;
- full-cover cells: blocked;
- half-cover cells: walkable;
- capture: 1 action while standing on capture cell;
- test horizon: 6 rounds;
- test win: control 2 points at end of round 6 or elimination.

These values are for geometry validation only and are not final combat balance.

## Required scenarios

### S1 · Opening reachability
Check which capture points each player can threaten by turn 2.

**Pass:** no player can establish an effectively uncontested two-point lock by turn 2.

### S2 · Center value
Test whether D4 / F4 / C6 / G4 create meaningful movement or firing decisions.

**Pass:** at least one viable opening line benefits from contesting center rather than ignoring it.

### S3 · Cover value
Track which half-cover and full-cover objects are actually used.

**Pass:** cover materially changes routes or attack decisions; half-cover is not decorative only.

### S4 · Objective contesting
Attack and defend BAR, ARCHIVE and PRINTSHOP from multiple approaches.

**Pass:** each objective has at least two practical contest lines.

### S5 · Spawn fairness
Swap opening styles and compare route safety / tempo.

**Pass:** no repeatable structural advantage greater than one tempo step.

### S6 · Congestion
Test aggressive center play and objective racing.

**Pass:** by rounds 2–4 both players still have 2–3 meaningful route choices.

## Minimum matrix
Run at least:
1. Nikita → Archive / Zhenya → Printshop
2. Nikita → Center / Zhenya → Printshop
3. Nikita → Bar / Zhenya → Center
4. Both contest center
5. Both split edge objectives
6. Aggressive duel vs objective-control play

Recommended minimum: 6 scripted simulations + 4 real hot-seat matches.

## Record after every match
- opening routes;
- first meaningful attack turn;
- first capture attempt turn;
- cover cells used;
- forced-route moments;
- strongest / weakest capture point;
- object cells that should move.

## Decision

### KEEP
If no point is obviously broken, center matters, cover matters, and first move does not dominate.

### REVISE
If one point is rarely worth contesting, one spawn is structurally stronger, half-cover has near-zero value, center is irrelevant, or the map collapses into one lane.

## Art lock rule
Environment art may be treated as locked only after:
1. geometry is accepted;
2. Figma and JSON match;
3. object footprints are stable;
4. capture cells remain unobstructed.
