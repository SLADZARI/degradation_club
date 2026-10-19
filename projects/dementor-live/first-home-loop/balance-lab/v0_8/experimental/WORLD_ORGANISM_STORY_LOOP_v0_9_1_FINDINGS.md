# WORLD ORGANISM v0.9.1 · One shared story / economics loop

19 October 2026 · isolated synthetic integration experiment · not the production game.

## Canon and provenance
The world design comes from the latest [WORLD EXPANSION v0.4](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-city-ownership-and-wilderness-01/projects/dementor-live/design/WORLD_EXPANSION_NEXT_BIG_LOOP_2026-10-19.md), [MAYOR OWNERSHIP/LABOR v0.2](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-city-ownership-and-wilderness-01/projects/dementor-live/design/MAYOR_OWNERSHIP_LABOR_MARKET_v0.2.md), [WILDERNESS](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-city-ownership-and-wilderness-01/projects/dementor-live/design/WILDERNESS_FOG_ENCOUNTERS_v0.1_CANDIDATE.md), [COMBAT ALPHA](https://github.com/SLADZARI/degradation_club/pull/267) and [PLAYER STORIES FIRST](https://github.com/SLADZARI/degradation_club/pull/263).
The source of v0.9 roles is [WORLD_ORGANISM_ROLE_LAB_v0_9_FINDINGS](WORLD_ORGANISM_ROLE_LAB_v0_9_FINDINGS.md).

## Integrated scenario implemented
1. Mayor places a finite job reserve from town treasury, hired NPC carries out a physical WOOD/STONE build; settled wage is one-time and cannot make the treasury negative.
2. Courier located in neighboring city accepts finite WOOD quantity, paid by receiving city. Shipment ID is stable, held materials cannot be overcommitted, town stocks move once on completed delivery, escrow pays courier once.
3. Tourist buys a map from a legitimate town shop, city receives actual PAPER, no free teleport.
4. Explorer traverses graph CITY→FOREST→RUINS, voluntarily handles one PvE encounter.
5. University course issues +20 slots once, not carrying mass.
6. World reload/serialized replay preserves money and physical material accounting.

**This is a deliberately small transaction/state-machine integration test**, not full map pathfinding or combat. Courier cargo is recorded as *reserved source stock* until delivery rather than an independent spatial cargo container, so a future authoritative runtime must model physical in-transit custody before this design may be deployed. The combat encounter is an idempotent event in this lab, not an actual enemy encounter. No permanent land grants or enemy loot are simulated.

## Results
[GitHub Actions #39331183024](https://github.com/SLADZARI/degradation_club/actions/runs/39331183024) **1217/1217 PASS**:
- 22 v0.8 published D30 snapshot consistency checks.
- 374 prior synthetic economy tests.
- 672 federation/equity tests.
- 149 role and integrated-story tests (117 v0.9 roles + 32 new integrated tests).
- New scenario matrix: 10/15/20/30 human users × 2/3/4 towns × 1/3 hired NPC, plus focused negative and persistence checks.

## Next engineering gates
- Replace `role` as a mutually exclusive Character attribute with persistent CharacterId and separately permitted Job, CityOwnership, SocialGrants, ExpeditionMembership.
- Replace graph-edge transition mock with runtime-backed walkable polygon/collision/portals and test return routes with players on real browser devices.
- Reify physical cargo container, custodian, warehouse reservation and transfer with transaction/escrow; test disconnection en route, parallel workers and rollback.
- Bind actual PvE runtime to same CharacterId, inventory and one-time economy reward without battle-specific PAPER emission.
- Extend the scenario to museum, wilderness noncombat NPC requests, tourist kiosk entitlements, real university minigame, hemp processing and scooter fuel ledger by separately gated modules.
- Independently reconcile deployed 0.3.0-rc.2 exact SHA and original autonomous v0.8 simulator before declaring any release-ready coverage.

No production deployment, world edits, migration or changes to real user saves occurred.
