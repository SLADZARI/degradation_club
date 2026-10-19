# DEMENTOR LIVE — COMBAT ALPHA P0 · RELEASE SCOPE LOCK
Date: 2026-10-19 · Decision: USER-APPROVED P0 SCOPE · Implementation: IN PROGRESS / NOT PLAYABLE / NOT DEPLOYED

## Product and authority
Dementor Live is one persistent 2D shared world. Combat is a closed co-op PvE expedition with the **same CharacterId and persistent economy**, not a separate game, not 3D/Dementor Battle. This document is an execution overlay for COMBAT-01 v0.1 candidate and its user-approved decisions 01–48. Historical GDD and existing game features are not overwritten. This branch is based on PR #261's candidate 0.3.0-rc.1, **not the live 0.3.0-rc.2**. Reconcile exact production SHA before deploy.

## Frozen minimum: C1–C5
1. **C1 Entry:** one marked combat-zone entry outside the starting city; one 16×16 instance map, no ready-made permanent public building, no destruction.
2. **C2 Session:** squad 1–2 for P0 acceptance (architecture may later support 1–4); manually start closed session, no mid-join by third parties, reconnect to existing session.
3. **C3 Gear:** one permanently owned weakest-tier random starter rifle issued once per character, ammo is finite and physical-accounted; melee and ordinary food; no ammunition production or unlimited free reissue.
4. **C4 Persistence:** server authoritative movement/hit/loot; ammo, food and items survive save/restart, requestId idempotency; last checkpoint survives partial failure; whole-team wipe resets current encounter only, no repeated first-time rewards.
5. **C5 Done:** clear three stages of 'Abandoned Repeater', exit, return to original world and same character inventory; first-win global change only once, later replay allowed with bounded loot.

## Explicitly agreed gameplay values
- DOWNED 30 seconds. Ally REVIVE by feeding edible food for 2 uninterrupted seconds; consume food only on completion; restore 40–80% HP, protect from damage 3 seconds. Solo can skip needless downed waiting by checkpoint respawn.
- Self-feeding takes 2 uninterrupted seconds and restores 15–40% HP, without post-heal invulnerability. Outside combat only, passive HP can recover to at most 30%.
- DASH: cooldown, no stamina debit, collision-respecting. Solid cover blocks movement/shots. Finite enemy waves and three archetypes CHASER/RANGED/GUARD; basic melee knockback.
- Personal weapon ownership and loot, co-op shared physical materials; no PAPER minted on NPC kill, no duplication on retry, reconnect or restart.
- Real-time desktop independent move/aim and mobile twin-stick; mobile camera zoom and visible gameplay are P0 acceptance prerequisites.

## Stage contract
1. Approach → finite CHASER combat → checkpoint A.
2. Activate repeater → finite CHASER+RANGED defense → checkpoint B.
3. Reach exit past GUARD → extract and return. Victory requires objective completion; replay does not re-issue first-clear reward.

## Gates and ownership
**Gate 0 – reconcile the world:** exact live 0.3.0-rc.2 source SHA and merge order for PRs #259/#260/#261/#262; PASS persistence of stone/wood and PAPER, iPhone viewport & pathfinding. No silently destructive migration. Live world volume immutable during QA.
**Gate 1 – isolated model:** server-authoritative combat model, stable identities, finite spawns, collisions, starter weapon/ammo, downed/revive and idempotent loot; automated Node tests.
**Gate 2 – runtime/UI integration:** account authorization, instance orchestration, 2D renderer and HUD controls, encounter objectives, fallback disconnect and checkpoint recovery, one persistent character.
**Gate 3 – end-to-end:** two real browser clients enter, fight, revive with food, collect, exit and reload; no duplicates; mobile Safari / small viewports; save/restart and server/client source equality.
**Gate 4 – release decision:** all mandatory tests PASS; off-VM backup of 'dementor-live-world', exact SHA recorded, deploy only the game service with explicit approval; postdeploy read-only/real-client acceptance.

## Non-goals
PvP, WANTED/crime/bounty, city bans, law, military/police NPC, NPC command UI (questions #49 onward), multiple mission regions, three combat specializations and full rarity/upgrades, the WORLD ORGANISM v0.8 demand model, terrain/building damage and city capture. Existing civil game mechanics may not be broken.

## Known v0.1 → approved-rule corrections
- v0.1 *temporary test weapon* is **superseded** by permanently owned unique starter weapon.
- v0.1 *generic REVIVE* is **superseded** by 30-second DOWNED and a 2-second food transaction.
- v0.1 *full-team loss ends mission* is **superseded** by checkpoint rollback of current encounter, not item ledger rollback.
- v0.1 *no classes ever* is superseded by three approved upgradable specializations, **P1 for implementation**.
- v0.1 *dynamic director later* is superseded by finite dynamic encounter composition for P0; no infinite farm.

## Test acceptance
Mandatory local + isolated server + live-candidate evaluation: independent move/aim; shot-through-wall rejection; dash-wall collision; NPC no infinite loops; at-most-one spawn; at-most-one loot claim; ammo and food net-conservation; 30s DOWNED / 2s feeding and interrupted actions; partial failure vs full wipe; checkpoint state; same CharacterId out and back; one-time first win; reconnect; two-browser session; save/restart; mobile viewport and zoom; preexisting world resource conservation.

## Status of the new code in this branch
'combat-p0.mjs' is an **isolated executable model** until wired into the runtime through authenticated HTTP/SSE routes and 2D UI. Model test PASS is **not** release PASS and is not evidence of a real two-player game. Do not merge as an operational release or deploy this branch without Gates 0–4.
