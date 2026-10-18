# DEMENTOR LIVE — P0 IMPLEMENTATION STATUS · World Organism v0.7.1
Дата: 2026-10-18 · **STATUS: LAB IMPLEMENTED + TESTED, GAME SERVER NOT MODIFIED**.

## Контекст и границы
В ответ на принятие направления [WORLD MODEL CHANGESET v0.7.1](WORLD_MODEL_CHANGESET_v0_7_1_CANDIDATE.md) реализовано автономное обновление World Organism на базе v0.6 + закреплённой панели мониторинга v0.7. **Это не PR и не изменение релиза Dementor Live 0.3.0-rc.2.** Код, HTML, отчёты, тесты и JSON-снимок D30 переданы пользователю пакетом в текущем разговоре. Канонический MASTER GDD не переписывался.

## Реализованный P0
1. Persistent goals по занятиям: ROUTING, INTERACTING, COMPLETE, WAITING_RESOURCE, BLOCKED; после перехода между сценами персонаж продолжает выбранную цель. Завершённый стартовый дом не создаёт повторные «блокировки». Раздельные productive / travel / idle / waiting / blocked.
2. Project Registry: площадь 22 WOOD + 16 STONE; затем TEST кузница 8+6 и мост 18+10; открываются последовательно. Каждый оплаченный заказ резервирует 18 PAPER города, оплачивается только после сдачи физического материала. Город принимает личный WOOD/STONE при исчерпании общего источника. **Числа тестовые, не совпадение, подтверждённое с game runtime.**
3. Water source: WATER_INFLOW ledger +2л/час если ниже тестовой ёмкости 800л, dry without inflow. Не эмитируется PAPER.
4. Capacity: bag 36, chest 144 балансовых весовых единиц; ошибки при переполнении; возможность перекладывать в сундук.
5. Synthetic P2P now logs OFFER_PROPOSED + OFFER_ACCEPTED + P2P_SALE. Consent is by deterministic test agents; two living users' consent NOT verified.
6. Updated standalone interactive HTML, pinned major money/resource metrics, independent scroll below, 3 project status cards, activity diagnostics, 42-node legacy model + informational rc2 overlay, imports old v0.6 and new v0.7.1 JSON.

## Test Evidence
**47/47 tests PASS**, including **36** stress combinations: 3/4/5 users × normal/treasury/forest/dry × 1/7/30 days. **29/29 invariants** on each; Chromium 1440×900, 390×844, 320×700 with zero browser errors, frozen HUD and JSON import tested.
3 players normal 30d:
- PAPER: city 2400, players 1200, total **3600** unchanged;
- Projects: square 38/38, forge 14/14, bridge 28/28;
- 3 plots, 3 tents, 3 chests, 3 beds; 80 completed city tasks;
- 468 blocked, 942 waiting, 3848 idle, 1508 productive steps; 213 synthetic P2P sales; WATER 814; HEMP 508.
3 players forest 30d: square 38/38, forge 14/14, bridge 13/28; some job cargo from private holdings; allowed resource constraint.
Dry 30d: WATER_INFLOW = 0; shortages naturally arise.
Treasury stress: city can fail to complete projects without minting PAPER.

## Comparison with prior 37-day v0.6 audit
User-uploaded `Dementor_Live_Organism_v06_D37_P3.json` (36d21h, 3 users) had 6030 blocked, WATER=0, HEMP=1520, PAPER=3600, 13 deals, one finished city square. Different horizon and test rules mean this is **not** a controlled A/B; the point is exercising new mechanisms and allowing meaningful distinctions in indicators.

## Not yet implemented / P1
Real Demand/Order market, production-to-final-consumption chains for HEMP, robust food consumption/freshness, biologically distinct seed recipes, physical multiplayer consent in server, full land/interior/harvest policy integration, source-authenticated read-only real server metrics. No complete forge/bridge runtime construction nor transport synced to rc.2.
Next gate: obtain source code and latest contracts of 0.3.0-rc.2; preserve implemented game loop, agree exact recipes/prices before integrating; run real-client two-user replay and 24h endurance.

## User artifact handoff
- HTML: `Dementor_Live_World_Organism_v0_7_1_P0.html`
- ZIP: `Dementor_Live_World_Organism_v0_7_1_P0_Package.zip`
- Test summary: `Dementor_Live_World_Organism_v0_7_1_P0_QA.json`
- Example data: `Dementor_Live_World_Organism_v0_7_1_P0_D30_P3.json`
- README + technical report in package. These are chat artifacts, not hosted GitHub files. Do not pretend standalone code has been checked into the game runtime repository.

## Follow-up evidence D36/D42 (18.10.2026)
Загружены два независимых exports лаборатории v0.7.1 и проведён независимый ledger audit. 29/29 invariants PASS в каждом, но конечная экономика всё ещё блокируется 100% заполнением сундуков; алгоритм предложения товара может игнорировать существующий спрос, а в журнале P2P_SALE записывается до OFFER_ACCEPTED. **P0 Implementation PASS ≠ P1 Sustainable Economy PASS**. Подробности: [balance lab D36/D42](balance-lab/BALANCE_AUDIT_v0_7_1_D36_D42.md), [backlog v0.7.2](balance-lab/BALANCE_BACKLOG_v0_7_2_CANDIDATE.md). Исходный вывод 47 тестов P0 не отменён, основной Master GDD и production сервер не менялись.
