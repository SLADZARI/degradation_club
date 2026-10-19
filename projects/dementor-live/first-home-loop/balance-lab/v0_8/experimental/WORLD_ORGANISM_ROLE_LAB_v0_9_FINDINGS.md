# WORLD ORGANISM v0.9 · Mixed player/character roles

19 October 2026 · isolated shadow model · no production writes.

## Source reconciliation
- [WORLD EXPANSION v0.4](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-city-ownership-and-wilderness-01/projects/dementor-live/design/WORLD_EXPANSION_NEXT_BIG_LOOP_2026-10-19.md): roads and physical travel between biomes, tourist map kiosk, training/university +20 bag slots once (not extra mass), robot arena as separately permissioned project, industrial chains, scooter using hemp oil, paper assets and cultural landmarks. Status DRAFT; numbers not canon.
- [MAYOR OWNERSHIP LABOR MARKET v0.2](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-city-ownership-and-wilderness-01/projects/dementor-live/design/MAYOR_OWNERSHIP_LABOR_MARKET_v0.2.md): mayor privately owns city, separate mayor wallet and city treasury, residents migrate with legal property, hired NPC workers have actual finite payroll and physical work; unfunded work suspends; some rules remain CANDIDATE.
- [WILDERNESS encounters candidate](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-city-ownership-and-wilderness-01/projects/dementor-live/design/WILDERNESS_FOG_ENCOUNTERS_v0.1_CANDIDATE.md): wilderness NPC encounters and hostile actors; clearing/exploration is distinct from ownership; no automatic loot duplication.
- [Combat alpha PR #267](https://github.com/SLADZARI/degradation_club/pull/267): one persistent CharacterId across city and isolated PvE; 1–2-player first prototype, finite ammo/rewards, no production deployment, mobile Safari and complete two-human battle NOT proven.
- [Player Stories First PR #263](https://github.com/SLADZARI/degradation_club/pull/263): human collaboration, social encounters and voluntary choice drive play; resources serve these stories.

## Why the v0.8.7 agent model was inadequate
The economy assumed interchangeable resident demand, labor and food behavior. It cannot treat mayors, hired NPC workers, human tradespeople, tourists, wilderness story NPCs and hostile NPCs as one population. It also must not assume every agent eats one unit/day or owns a wallet.

## New v0.9 role catalog in isolated proof model
MAYOR, RESIDENT, COURIER, FARMER, BUILDER, TOURIST, EXPLORER, NPC_WORKER, NPC_STORY, NPC_HOSTILE.

The distinctions are **simulation capability/identity tags**, not user-locked character classes. A real player can change job / engage in another activity; next version must separate account/character/job/profession/permission from NPC kind.

- Mayor: player personal wallet is separate from city-owned treasury. Work and purchase may exhaust treasury without confiscating private residents' funds.
- Human occupations: only a resident present in city with a real funded assignment can receive a paid wage. Moving cities does not zero their wallet.
- NPC_WORKER: paid from finite city treasury through a hold/reserved job ID; physical city WOOD consumed once; no work if missing materials or funding.
- NPC_STORY: scripted role, not a paid resident or hostile kill economy.
- NPC_HOSTILE: encounter threat, not a city resident or harvest producer. One event ID cannot award anything twice.
- Tourist/explorer: a volunteer story or PvE encounter can be declined; one-time university course +20 inventory **slots** (no automatic increase in carrying mass).

## QA execution
[GitHub Actions #39329903753](https://github.com/SLADZARI/degradation_club/actions/runs/39329903753) — **1185/1185 PASS**:
- 22 v0.8 published D30-snapshot consistency tests;
- 374 v0.8.2 synthetic shadow economics tests;
- 672 federation/equity tests;
- **117 new v0.9 mixed-role tests** (9 focused + 108 scenarios = 4 populations × 3 cities counts × 3 hired-NPC counts × 3 horizons).

No live server, no original v0.8 ZIP and its 52 original tests. No browser or actual multiplayer identity is included in v0.9 Role Lab. For now NPC jobs consume modeled finite WOOD stock as a stand-in for proved productive labor — not a complete construction pipeline or behavioral AI.

## Next required redesign (not yet implemented)
1. Role != identity: PlayerAccount → persistent CharacterId → optional mayor deed → profession / WorkContract; NPC actors separate with Story/Worker/Enemy behavior controllers.
2. Finite event/ledger per building, route, vehicle, crop, physical loot and encounter. Without cargo and roads world expansion can become only a map.
3. Mayor investments and earnings, player migration, NPC wages, treasury collapse. NPC money recipients must participate in a policy for money circulation (cost sink/vendor/owner); otherwise town treasury drains into unused NPC wallets.
4. Two human players with different professions and mayor privilege; two cities; one hired bot, one story NPC, one hostile enemy; interactive tutorial/travel/quest/PvE acceptance tests.
5. Public tourist mapping, museum, university one-time grant, hemp oil scooter and Robo Games ownership check as **separate gated modules**; no speculative teleport.
6. Time-domain difference: active-session needs, real-time production and world-day schedule; synthetic daily NPC work does not certify online/offline parity.

## Status
This model tests contracts and accounting only and MUST NOT be described as a runnable combat/wilderness expansion. Do not merge the chained draft PRs into production or deploy without a source/version comparison, backup and complete acceptance.
