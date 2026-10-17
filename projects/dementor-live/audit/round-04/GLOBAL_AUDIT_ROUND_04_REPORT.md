# DEMENTOR LIVE — GLOBAL AUDIT ROUND 04 / UNIFIED CITY REPORT
**17 October 2026 · GA-04 · DESIGN-SIMULATION EVIDENCE, NOT REAL GAME QA**

## 1. Scope, status and provenance
This audit is built on immutable GDD v0.1 and GA-01/02/03 reviews in independent documentation branches of SLADZARI/degradation_club, not on the executable runtime of Dementor Battle / Robo Games. The source artifact is unified_city_simulator.js with ONE minute-step event loop and ONE city/players/escrow ledger, accompanied by frozen sample parameters GA04_UNIFIED_CONFIG_CATALOG.json.
Covered end-to-end in this test model: initial city PAPER treasury, first player grant, four paid tutorial jobs, finite lots, one-step atomic purchase/build kit debit, construction delay, extra paid courier jobs, starter cash, seeds sold from city stock, HEMP growth, shared municipal water head, tank storage, shared workshop slots, maintenance, player warehouses, paid courier pickup, physically held in-transit sheets, city purchase reservations/escrow/daily quotes, city paper consumption. All prices and timings TEST, not APPROVED rules. Model does not simulate character, NPC dialog, geographical travel, genuine workshop building construction, DB concurrency or externally played sessions.

## 2. Reproducible execution
- 16 main cohort scenarios (1/20/100 players, 1/7/30 REAL days plus treasury, arrivals, kit shortfall, demand, water and equipment variants). **208 of 208 accounting/stock/recipe/capacity checks PASS.**
- 11 sensitivity scenarios with demand, per-shipment minimum, equipment and source limits: **143/143 fixture invariants PASS.**
- 12 integrated market shipping-minimum comparisons (6/12/16 sheets): **156/156 fixture invariants PASS.**
- **Combined: 39 independent model runs, 507 repeated invariants**. This is not 507 distinct tests of a running game; it checks the same 13 state laws in different situations.
- Deterministic result equality of two complete identical runCity input reruns PASS. This is not a database crash/recovery or checkpoint replay test.
- Balance source: 50 named configuration values tagged TEST_NOT_APPROVED with units, owners and trace origins.

### Thirteen laws tested in every scenario
1. SUM(city PAPER + escrow PAPER + player PAPER) = initial treasury; no hidden PAPER emission.
2. Original city WOOD = unconsumed city WOOD + consumed cabin WOOD.
3. Initial city PAPER_SHEET + produced PAPER_SHEET = city starter stock + material consumed in buildings + city purchased/held/consumed physical stock + player stock + in-transit cargo; no double-count of city purchases.
4. City initial SEED_HEMP + documented restock = city remaining seeds + seeds planted.
5. Documented water delivered = industrial/agricultural water used + physical volume remaining in tanks.
6. Shared source flow ≤120 L/hour overall district at base settings.
7. No cash or physical inventories below zero.
8. Local and city storage limits respected.
9. Every built home uses exactly 6 WOOD +4 SHEET in TEST.
10. City buyer available quotes never overrun budget or demand.
11. Every escrow PAPER balance is backed by exactly the in-transit pending shipment quantity.
12. No minted/burned PAPER without explicit event (both zero in simulation).
13. HEMP raw from harvesting = raw remaining + raw committed to completed and in-progress recipes.

## 3. Baseline results using SAME city rules
Common default: 50,000 PAPER city treasury, finite tutorial kits for100, finite seed restocking, one shared city water trunk2,000mL/min =120L/hour, municipal workshop4 parallel tasks, shared city sheet buyback max64/day, city buy price3, paid cargo min16 sheets/5 PAPER with 15-real-minute delivery.
| Players | Horizon | First homes | PAPER_SHEET made | PAPER_SHEET sold | City PAPER at end |
|---:|---:|---:|---:|---:|---:|
| 1 | 1 day | 1 | 84 | 54 | 49,943 |
| 1 | 7 days | 1 | 426 | 396 | 49,444 |
| 1 | 30 days | 1 | 1,746 | 1,714 | 47,540 |
| 20 | 1 day | 20 | 552 | 54 | 49,649 |
| 20 | 7 days | 20 | 912 | 414 | 49,125 |
| 20 | 30 days | 20 | 2,292 | 1,794 | 47,031 |
| 100 | 1 day | 100 | 1,068 | **0** | 47,516 |
| 100 | 7 days | 100 | 2,868 | 370 | 48,059 |
| 100 | 30 days | 100 | 4,248 | 1,750 | 46,061 |
IMPORTANT: day-one 100 players all produced >=6 sheets, but zero sold with shipping minimum16. The first economic loop is not reliably completable with this design. 100 farmers in7 days: only15 had at least one city sale;85 sold nothing. For 20 farmers, only3 sold;17 sold nothing. This is a usability and fairness issue even though material conservation holds.

## 4. Money liquidity vs money conservation
100 simultaneous tutorial players with10,000 city PAPER treasury: 0 first homes after7 days; all100 are in JOB stage, no plot/cabin sale receipts can return yet; city available cash ends20. Same 100 players entering at30-minute intervals with identical starting treasury: 100 homes and farms operating, city money8,131 after7 days because player plot/cabin payments return as work completes.
100 players with50k treasury but 120 WOOD +80 PAPER_SHEET for starter kits (20 homes worth): only20 homes are built, others remain WAIT_KIT. Combined purchase+kit check blocks monetary debit until stock available. Actual physical gathering and suppliers remain outside this fixture.
First home from four training deliveries retains20 PAPER; proposed 4-bed first-paper chain requires37 PAPER of seeds+water+maintenance+delivery before first city sale, excluding equipment, hence **17 PAPER shortage**. GA04 adds one further normal paid delivery30 for a no-equipment communal workshop scenario to cross that cash threshold. This job is fictive completed by timer and must be backed by real WORK gameplay proof.

## 5. City demand and logistics are more binding than some new buildings
Market test at100 farmers/7 days:
| Minimum delivery size | Paper sold total | Sellers with ≥1 sale | Farmers with zero sales |
|---:|---:|---:|---:|
| 16 sheets | 370 | 15 | 85 |
| 12 sheets | 432 | 19 | 81 |
| 6 sheets | 436 | 27 | 73 |
Even 6-sheet parcels help new sellers but still leave 73 of100 without sales, since city demand is globally finite.
Adding workshop concurrency4→20 at100/7d changes nothing (made2,868 and sold370), while raising district water head120→600L/h raises made2,928 and sold430 in the same 7 days. Increasing city buyback quota from64→640/day (with funding and storage caps adjusted) lifts7-day sold to3,786 but consumes all seed stock in the fixture, showing scarcity moves between domains.
Do not simply increase every capacity: track the active bottleneck and require paid, physically valid market orders.

## 6. Equipment price and actual investment
CAPEX=120 PAPER per new player is funded through five rather than one extra 30-PAPER courier jobs in the GA04 synthetic path, extending work duration and increasing city wage exposure. Net city+players cash can finish identical because more wage money is returned to city when equipment is purchased, but player time costs are not the same.
CAPEX=600 PAPER per player with max12 extra jobs from fixture leaves all20 users in WAIT_STARTUP by day7 — not viable in this onboarding design. Neither setting represents real equipment cost; original GDD lacks machines' canonical prices and physical component recipes. Therefore cannot claim actual ROI/EBITDA/payback. The model assumes a free community workshop of four slots, with optional fee for hypothetical equipment but does not instantiate a private workshop, which must be corrected before signing off its design.

## 7. New cross-system issues (CC-053..059)
CC-053: delivery size16 blocks early market entry, even when paper crafted.
CC-054: 85/100 suppliers zero sales despite city procurement, and first-in constraints/fairness.
CC-055: equipment cash barrier and excessive repeated jobs can block or prolong startup.
CC-056: wrong bottleneck upgrades do not increase throughput or seller income.
CC-057: city StarterWarehouse and CityBuyerWarehouse are correctly separated inventories, but no explicit municipal restocking pathway; municipal purchase doesn't refill tutorial kit automatically.
CC-058: training work abstracted as timed payouts; not real courier route, proof or wage policy.
CC-059: rerunning complete synthetic model doesn't verify authoritative DB event checkpoint, concurrent locks and rollback.
See ISSUES_CC_053_059.md for reproduction, proposal and closure criteria. Previous CC-001..052 remain OPEN unless separately approved and verified; 59 tracked review items ≠59 real game bugs.

## 8. Design-candidate solutions, not canon changes
- Reserve a finite CityPurchaseOrder in PAPER escrow before courier dispatch; consider small municipal drop-off or ONE-TIME first-sale contract for each beginner, separately funded and tied to quest identity. City demand and stock must remain finite.
- Decide pricing for delivery small parcels to avoid paying disproportionate transport costs; avoid teleporting physical resources.
- Govern access to shared water and workshop fairly; batch equipment capabilities and geo-constraints remain separate.
- Store signed onboarding treasury reserve and actual city kit stock, with one-time entitlement tied to character; solve 100-player liquidity and 100-player kit deficits independently.
- Set acceptable novice milestones as a measurable target: first HOME, first crop, first PAPER_SHEET, first FUNDED SALE with real effort and no negative wallet. Work and production progress should not depend on being in online game constantly.
- Keep character-first SVG pipeline/scale approved gate before selecting 2D game engine. Game-source QA only after compatible runtime exists.

## 9. 27-system review and remaining work
CROSSCHECK_27_UNIFIED_FIXTURE.md audits each of 27 GDD domains against this SAME catalog and run. Some domains have tested toy invariants (ECONOMY, RESOURCE, FARM, WATER, PRODUCTION, TIME, WORK and MARKET), but other sections such as SOCIAL, COMBAT, NPC, VISUAL and MONETIZATION remain NOT TESTED because this model does not implement them. All 27 long-form individual v0.2 chapters require reconciliation with full source chat, source refs, status review, real design choice approvals and eventually executable integration tests; a 27-row matrix is not a substitute for 27 completed chapter specs.

## 10. GA04 handoff / next action
Candidate decision pack:
(1) PAPER currency vs PAPER_SHEET, fiber IDs;
(2) onboarding treasury funding and entitlement, seed/water start;
(3) CityBuyOrder min size6/12/16 and fair allocation/first-sale order;
(4) city source and workshop ownership, CAPEX and routes;
(5) SQL transaction/event replay and 2D SVG character source.
Until approved all changes are PROPOSED. The original v0.1 preserved; no false IMPLEMENTED or VERIFIED declaration.
