# DEMENTOR LIVE — 27-SYSTEM GLOBAL QA / TRACEABILITY MATRIX
2026-10-17. BASELINE v0.1. Статусы runtime проверки NOT RUN по умолчанию: CALCULATED PARTIAL означает проверена арифметика на допущениях, а не игровой код. Настоящее VERIFIED требует исполнения тестов и evidence.

На каждый раздел требуется единый артефакт: purpose, units and schema, event/state transitions, config with numeric source, dependencies, failure cases, security/permissions, deterministic examples, acceptance, changelog/status. На каждую связку систем нужны positive+negative+concurrency+offline tests.

| ID | Система | Проверяемое содержимое | Зависимости | CC | Критерий | Test IDs | Current |
|---|---|---|---|---|---|---|---|
| 01 | WORLD | Region/District/Plot, public topology, Danger state | LAND, COMBAT, TRANSPORT | CC-015/022 | Open world paths stay reachable; first CLEAR once; no duplicate parcel allocation | WORLD-T01..08 | NOT RUN |
| 02 | LAND | Parcel geometry, zoning, owner, 4 state axes | WORLD, BUILD, SOCIAL, ECONOMY | CC-009/010/017 | 1 atomic owner; purchased lot remains DEVELOPED and OWNED; road buffer untouched | LAND-T01..12 | DESIGN REVIEW |
| 03 | BUILD | Structures, stages, footprints, recipes and cost links | LAND, RESOURCE, UNITS, WATER | CC-016/017 | Cabin fits lot, costs/reservation correct, physical paths, permissions | BUILD-T01..12 | DESIGN REVIEW |
| 04 | ECONOMY | PAPER wallet, city budget, ledger, prices, faucet/sink | WORK, LAND, PRODUCTION, MARKET | CC-005/006/011/021 | sum(PAPER)=start+mint-burn; city solvent; no unlogged issuance | ECON-T01..20 | CALCULATED PARTIAL |
| 05 | RESOURCE | Item IDs and units, containers, stock, provenance, ownership | FARM, PRODUCTION, TRANSPORT | CC-013/028 | No negative balance, split or simultaneous double-use; fiber origin enforceable | RES-T01..14 | DESIGN REVIEW |
| 06 | FARM | Plant per cell, seed, growth, yield, watering, wild renewal | WATER, TIME, RESOURCE | CC-012/030/031 | 4 hemp⇒12 HEMP at 45m if watered; stage pause/replay | FARM-T01..12 | CALCULATED PARTIAL |
| 07 | WATER | L volume, node graph, refill speed, priority and tariff | TIME, FARM, PRODUCTION | CC-007/012/030/035 | 40L initial not double-used; 30L/h cap; fractional tariff rule | WAT-T01..16 | CALCULATED PARTIAL |
| 08 | PRODUCTION | WOOD/HEMP/FLAX/PULP/FIBER/PAPER_SHEET/CARDBOARD | RESOURCE, WATER, TIME, ECONOMY | CC-011/028/029 | Correct recipe-specific consumption; blocked full output; one result/run | PROD-T01..20 | CALCULATED PARTIAL |
| 09 | TIME | REAL/WORLD/ACTIVE domain, event ordering, replay | FARM, WATER, PRODUCTION, WORK | CC-007/031/036 | online/offline same event log⇒same stocks; world days don't accelerate REAL | TIME-T01..16 | DESIGN REVIEW |
| 10 | WORK | Offers, assignments, wages, licenses, bonuses | ECONOMY, TIME, RESOURCE | CC-006/021/029 | 4 training jobs yield 360 test; one reward/job, funded payout | WORK-T01..20 | CALCULATED PARTIAL |
| 11 | MARKET | City stock and shop, direct trade, order, escrow | ECONOMY, RESOURCE, TRANSPORT | CC-010/011/014 | trade stock physical; seller and courier get once; refund exclusive of settle | MKT-T01..20 | DESIGN REVIEW |
| 12 | SOCIAL | Friends, roles/grants/invites, chat, access | LAND, WORK, MARKET, COMBAT | CC-010/019 | Friend not owner; revocation safe; blocked user cannot DM; reports stored | SOC-T01..22 | DESIGN REVIEW |
| 13 | COMBAT | 2D real-time, team/mission, rewards, world unlock | WORLD, LAND, SOCIAL, ECONOMY | CC-015/023 | 2 player objective cannot be bypassed; one global unlock; reward once | CMB-T01..18 | DESIGN REVIEW |
| 14 | TRANSPORT | Bike, route graph, cargo capacity, owner/custodian | WORLD, RESOURCE, WORK, MARKET | CC-013/014/022 | cargo remains in one container across transfer, roads respected | TRN-T01..22 | DESIGN REVIEW |
| 15 | CHARACTER | 1 character, locomotion+action, rig, equipment | VISUAL, UNITS, COMBAT, WORK | CC-001/002/017 | 2D SVG master/8 views same identity, footpoint; cosmetics don't alter hitbox | CHAR-T01..08 | BLOCKED ART |
| 16 | QUEST | Narrative progress event listeners, no duplicate job reward | WORK, COMBAT, WORLD | CC-027 | already-done goals recognized, one-time rewards exactly once | QUEST-T01..09 | DESIGN REVIEW |
| 17 | NPC | 4 cast, schedules, services, identity and sprites | CHARACTER, VISUAL, TIME | CC-002/024 | approved visual reference retained; tutor service available during NPC rest | NPC-T01..08 | BLOCKED ART |
| 18 | SURVIVAL | HP/stamina, downed, no hunger/absence punish | CHARACTER, COMBAT, TIME | CC-023 | no offline death/land loss; appropriate revival | SURV-T01..08 | DESIGN REVIEW |
| 19 | AUTOMATION | Machine triggers, input/water/stacks, report | RESOURCE, FARM, TIME, WATER | CC-007/032 | no resources without input; buffer stops; replay idempotent | AUTO-T01..10 | DESIGN REVIEW |
| 20 | MONETIZATION | Free core, cosmetics, entitlement accounting | ECONOMY, VISUAL, SOCIAL | CC-026 | real payments separate from PAPER, cosmetics no stats | MON-T01..10 | DESIGN REVIEW |
| 21 | UNITS | WU/Cell/Tile/Pixel, projection, footprint, collision | WORLD, BUILD, VISUAL | CC-003/017/033 | 12×12 pack actually navigable; board sprite scale2.0/anchor match | UNITS-T01..12 | BLOCKED SCALE |
| 22 | VISUAL | 3/4 camera, reference, four authoring vs 8 runtime, z order | CHARACTER, NPC, UNITS | CC-001/002/003/004 | one true vector hero, 8 identities consistent, clips, 48–64px review | VIS-T01..20 | BLOCKED ART |
| 23 | TECH | Authoritative movement, transactions, RLS, migrations | ALL | CC-007/018/020 | anon cannot mint, double-spend or bypass; reconnect/restart state restored | TECH-T01..30 | NOT RUN |
| 24 | RELEASE | Gates, P0 character-first, target platform metrics | VISUAL, TECH, ALL | CC-004/027 | G0 character board before engine; G1 character verified; later runtime | REL-T01..14 | BLOCKED ART |
| 25 | GAMEPLAY | Short/medium/long loops, solo freedom, connection | WORK, MARKET, SOCIAL, COMBAT | CC-021/023 | first home affordable; solo no dead-end; shared social meaning | GAME-T01..12 | DESIGN REVIEW |
| 26 | GOVERNANCE | Source version, decision status and provenance | ALL | CC-008/027 | source refs verifiable, draft not approved, changelog on each change | GOV-T01..10 | BASELINE ONLY |
| 27 | DECISIONS | CC registry + approved/proposed/test/open, dependencies | ALL | CC-001..040 | all blockers owner+repro+fix+evidence; no silent overrides | DEC-T01..15 | REVIEW |
## Coverage cross-check
- 27/27 разделов получили дорожную карту проверки и IDs тестов; факт реализации тестов НЕ проверен.
- Состояния CALCULATED PARTIAL: только ECONOMY/FARM/WATER/PRODUCTION/WORK, не runtime.
- Первые барьеры: CHARACTER/VISUAL, PAPER material/currency, event replay, treasury, source integrity.
- Действия после design review: построить машиночитаемые source configs, unit tests, integration replay test, user approval, QA record with version evidence.
## Приёмка каждой системы
Gate S-READY: нет неопределённых базовых типов, единиц или владельца данных.
Gate N-READY: формулы прошли расчёт на тестовых данных, нет отрицательных незаконных величин.
Gate TX-READY: учтены отмена/повтор/ошибка, нет duplicate transfer.
Gate RUNTIME-READY: реализована система, есть auto tests и manual QA evidence.
Gate APPROVED: пользователь утвердил дизайнерские решения — это иной статус, чем RUNTIME-READY.
## Категории регресса
UNIT (definitions/calcs); CONTRACT (schema/event); INTEGRATION (cross module); MULTIPLAYER (2+ clients); OFFLINE (pause/replay); SECURITY (negative tests); VISUAL (snapshots/animations); ECONOMY (long-horizon sensitivity); DOCUMENTATION (source/links/versions).
