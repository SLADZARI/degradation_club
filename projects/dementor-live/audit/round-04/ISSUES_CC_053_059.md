# DEMENTOR LIVE — CROSSCHECK CC-053..CC-059 (GLOBAL AUDIT ROUND 04)
2026-10-17 | OPEN / DESIGN MODEL FINDINGS. Cumulative register CC-001..CC-059. Do not call these confirmed runtime bugs.

### CC-053 · MARKET/GAMEPLAY · HIGH — Ship-minimum stops novice sales
UNIFIED test 100 players/first24h/treasury50k: 1,068 PAPER_SHEET crafted, zero sales because no individual accumulated 16 needed for one city shipment before the test-day end. With minimum6 sheets, 60 city sheets were sold to10 sellers, though total production 1,008.
At 100 players and7d, default16 ⇒ 370 sheets sold, 15/100 sellers; proposed min6 ⇒436 sold,27/100 sellers; market quota64/day=448 total upper bound.
Needs: set shipping price policy per small package vs salary/costs, city drop-off/municipal aggregation, partial orders and fair acceptance. User approval; actual courier/cargo tests.

### CC-054 · MARKET/SOCIAL/GAMEPLAY · HIGH — Severe seller exclusion despite valid funded city orders
20 farmers at7d: 17/20 sold zero, 3 had any sale; 100 farmers: 85/100 sold zero, 15 had sales. Under min6 improvement still 73/100 sold zero. Deterministic per-minute rotation and first funded accept does not guarantee equitable city trade under uneven water and workshop availability.
Needs: fair job/procurement rule, small-producer municipal co-op, bid/queue policy, age of offer, time-to-first-sale target, combined fairness metrics (unique sellers, max vs min, distribution), no bogus guaranteed NPC buyer.
This extends CC-042 (Round02 order reservation/fairness) but is first reproduced on ONE integrated economy.

### CC-055 · ECONOMY/WORK/BUILD · HIGH — Additional workshop investment can make first production unreachable
TEST equipmentCAPEX=120 PAPER: 20 households finish farming after100 extra courier jobs total (five per player vs one), cash/production results nearly same as no CAPEX due additional treasury funded wages returning on equipment purchases; hidden progression delay matters. TEST equipmentCAPEX=600: 20 households perform max12 extra courier jobs each (240 total), then none reaches FARM within7 days; all WAIT_STARTUP. This limitation is from GA04 maxExtraWork12 fixture, not a canon policy.
Needs: explicit machinery price/materials, shared bench alternative, job availability and cash/liquidity to first sale, no forced excessive grind, time-to-farm test.
Extends CC-050 (unpriced CAPEX).

### CC-056 · WATER/PRODUCTION · HIGH — Adding capacity to the wrong bottleneck does not improve 100-player trade
At100 players/7d city head120L/h: 2,868 sheets made,370 sold. Raising municipal workshop concurrency4→20 yields identical outputs 2,868/370; increasing shared water head120→600L/h yields2,928/430, improvement still minor due city demand, warehouse, seed and time interplay.
Needs: capacity graph with stage utilizations and queue lengths; price facilities based on actual value-added in an integrated population model, don't promise faster production from machine upgrades unconditionally.

### CC-057 · GOVERNANCE/RESOURCE/MARKET · HIGH — City starter and city buyback stocks aren't a unified replenishment policy
City StarterWarehouse initially stores physically finite WOOD and PAPER_SHEET and is decremented when new player gets first house; city procurement later puts industrial PAPER_SHEET into CityBuyerWarehouse, and consumer buys/consumes there. Under current fixture the stock purchased by municipality does NOT replenish starter supply. This is valid accounting but may cause first-home kit scarcity even when city has plentiful purchased paper elsewhere.
Needs: inventory reclassification/stock transfer between municipal warehouses with actual source and signed purpose; restock and city material policy explicit, without secretly materializing goods.

### CC-058 · WORK/TRANSPORT/QUEST · HIGH — Tutorial income simulated as clock-based, not actual completed duties
Four delivery wages90 paid after seven minute intervals, extra jobs30 also after seven minutes, independently of physical parcels, NPC offers, route, cargo movement, cooldown and character action. It closes accounting arithmetic but is NOT a verified viable active gameplay earning path or fraud-resistant income.
Needs: WORK AssignmentId proof, cargo custody, quest idempotency, NPC funding and real-world route time at accepted geometry; re-run cash and 100-player cohorts.

### CC-059 · TIME/TECH · HIGH — Deterministic fresh rerun is not a server checkpoint/rollback or true concurrent transaction proof
GA04 invokes runCity twice with identical config, and 39 scenarios pass source-conservation tests. It does not serialize a half-run world state to durable DB, crash during item/payment stage, resume, atomically lock shared tank/order or handle real concurrent requests. GA03 isolated water checker had one checkpoint replay; GA04 integration requires its own checkpoint/retry tests on actual implementation.
Needs: persistent event log, unique txids for all economic & material mutations, durable cursor, DB isolation tests, crash/restart fault injection, same-online/offline equivalence; status OPEN.

## Parent evidence
round-04/unified_city_simulator.js, unified_city_scenarios.json (16 cases,208 invariant checks), unified_city_sensitivity_results.json (11 cases,143 checks), integrated_market_fairness_results.json (12 cases,156 checks), CROSSCHECK_27_UNIFIED_FIXTURE.md.
No issues closed merely because models are internally consistent. Monetary PAPER/PAPER_SHEET and resource fiber choices remain UNAPPROVED. Runtime tests not executed.
