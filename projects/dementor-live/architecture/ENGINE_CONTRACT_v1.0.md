# Dementor Live — Shared Engine Contract v1.0

**Status: target design / NOT fully implemented across CIVIC and UNIVERSE.**
**Snapshot 20 October 2026.** This document defines safety invariants and integration acceptance, not a claim that classes and schemas already implement all of these fields.

## E01 Identity and world state

- A resident has one persistent CharacterId, not cloned residents when changing world.
- Character state is authoritative on the server. The client may render and suggest commands but cannot mint wallet funds, inventory or travel access.
- Keep physical location fields distinguishable: current city, world/region, scene, coordinates, session/transport. The final serialized structure must be decided after reading both actual save schemas.
- Support at least two concurrent clients without duplicated materials, rewards or objects.

## E02 Ledger and invariants

- Wallet and treasury changes are exact, auditable, authorized transactions. PAPER cannot appear because a player visited a region or reopened an interaction.
- Finite wood and stone do not disappear without a recorded transfer, material conversion or legitimate consumption; city warehouse, municipal reserves, courier cargo, construction, installed structures, tools, scrap, bags and chests must reconcile where modeled.
- Regional decorative trees never mint harvestable wood until their resource IDs and conservation rules are implemented.
- requestId retries are idempotent across scene changes, reconnection and restart. A bounded receipt retention policy and durable ledger need implementation review.

## E03 Scene, movement and portals

- Travel validates scene, target, collision, proximity, permissions and active job/transport/combat blockers server-side.
- Physical entry and return are explicit; unknown remote teleport is rejected.
- WORLD-01 Forest and MentalHumor can remain separate scenes with deliberate transitions. Seamless sector streaming is future work, not a present feature.
- A player cannot be duplicated across city instances and scene registries.

## E04 Compatibility / migration

- Current CIVIC city-network candidate uses a dementor-cities-v1 multi-city save envelope; experimental Universe derives from 0.3.0-rc.1. Confirm the exact effective state of v0.4 before converting any saves.
- Append-only migrations, explicit schemaVersion and dry-run on a copy of the real save are required before production.
- Back up the complete named world volume and verify restoring a copy. Preserve world.json and media.
- No resets, database writes, destructive change to runtime state or direct production deployment in a documentation/integration-preparation task.

## E05 UI and graphics

- Unified 2D paper-cut rendering; mobile HUD may not obscure playfield. Support zoom, path stopping, touch control, and meaningful feedback.
- Adopt all 20 approved PAPER CUT UI icons and the canonical atlas. A style spec or icon mapping alone is insufficient; prove binary presence and loading in both directions.
- Existing v0.4 runtime/AGENTS.md historically allows emoji UI; this conflicts with later approved icon canon. Resolve in the actual integration PR without rewriting unrelated behavior.

## E06 Modules / public content

- CIVIC is sole owner of city materials, jobs, plots and finance rules; thematic modules use authorized Engine commands.
- UNIVERSE owns region definitions, rights-marked exhibit content, physical navigation and safe public info cards; no implicit Club permissions or links to private user data.
- COMBAT is isolated until authenticated session/loot/health and persistence compatibility are proven; PvE integration cannot silently alter city accounts.
- WORLD ORGANISM synthetic simulation is not a runtime implementation.

## Verification gates (required before shared runtime release)

1. Compare exact SHA of production image/source, branch heads and current save schema.
2. Test migration and rollback on an external copy of real save; never on live volume.
3. Cross-track Node tests: resident identity, ledger equality, request retries, travel, city returns and two concurrent players.
4. Two real browser clients and browser console/network: city ↔ forest ↔ museum park ↔ hall, with accurate return, inventory and wallet after restart.
5. Physical iOS Safari or independently observed mobile device usability in portrait/landscape.
6. Check installed atlas binary hash, asset 200/image mime type and all 20 screen mappings.
7. Production deploy only after explicit go/no-go and verified backups; post-deploy acceptance is a separate gate.

**Current truth:** these are guardrails and acceptance criteria; no cross-track integrated browser or live acceptance is claimed.
