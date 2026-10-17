# DEMENTOR LIVE — ALL 27 CHAPTERS: UNIFIED GA04 CROSS-CHECK
Revision: GA-04 / 2026-10-17 / IN REVIEW. One and the same GA04 50-parameter TEST config used for every modeled section. GDD v0.1 APPROVED boundaries preserved; formulas and tests are synthetic, not game runtime.
## SOURCE-OF-TRUTH fixtures
Code: unified_city_simulator.js. Scenario JSON: unified_city_scenarios.json. Stress: unified_city_sensitivity_results.json. Fairness: integrated_market_fairness_results.json. Config: GA04_UNIFIED_CONFIG_CATALOG.json. The single fixture uses city budget, 4 training wages, building materials, seeds, 120L/h shared trunk, one municipal workshop with 4 concurrent slots, 10L WATER packs, city demand64/day and 5 PAPER deliveries. All quantities marked TEST; do not copy into canon without review.
## Audit across all 27 chapters
| № | Domain | Required cross-check | Observed in unified model | Unverified or conflicting with the full GDD | Next test |
|---:|---|---|---|---|---|
| 01 | WORLD | City region/district/source and public route | Source cap at district head modeled | No real map topology, public roads or clearance states | GA04-WORLD-T01 |
| 02 | LAND | Plot title and availability | Finite city plots; 100 claims physically count | No exact parcel ID collision, zoning or market resale | GA04-LAND-T01 |
| 03 | BUILD | Cabin contract, stage, materials | 6 WOOD+4 PAPER_SHEET consumed once for each built home; 10min construction TEST | No 2D placement, utility installation or material source alternatives | GA04-BUILD-T01 |
| 04 | ECONOMY | PAPER accounts and city treasury | City+players+escrow total conserved; city receipts and payments centralized | Monetary issuance, city policies and real-money boundaries remain OPEN | GA04-ECON-T01 |
| 05 | RESOURCE | WOOD, seeds, HEMP and sheets stored physically | All starter materials, seeds and sheets conserved via ledger | No full item/cargo stack owner model, FLAX or fiber provenance | GA04-RES-T01 |
| 06 | FARM | Plant 4 HEMP, 45min harvest | Finite seeds consumed and 12 HEMP per harvest | No multiple crop species, seed ecology, staged irrigation | GA04-FARM-T01 |
| 07 | WATER | Shared district 120L/h and 10L water packs | Source intake equals spent+stored; ≤2000mL/min source | No pipes, service connection bounds, per-user fairness proof | GA04-WAT-T01 |
| 08 | PRODUCTION | 12 HEMP → 4×6 sheets, 8L water and maintenance per batch | Output after 6 real minutes, workshop slots finite, raw conservation | No WOOD/FLAX fiber chain, cardboard or actual workbench ownership | GA04-PROD-T01 |
| 09 | TIME | Minute event scheduler, real-day budgets | Same input gives same result; resource and monetary balances deterministic | No actual checkpoint replay of GA04 state; SQL concurrency absent | GA04-TIME-T01 |
| 10 | WORK | 4 tutorial deliveries+bonus and extra 30 PAPER jobs | City pays only if funded, 10k/100 simultaneous deadlock reproduced | No player action proof, route, physical courier career or anti-bot | GA04-WORK-T01 |
| 11 | MARKET | City quote, escrow, demand, warehouse | Funded purchase order before paid shipment, warehouse cap respected | Extremely unequal seller access; no player market or cancellation/dispute tests | GA04-MKT-T01 |
| 12 | SOCIAL | Guest/invite/access limits | No social permissions altered by economic toy model | NOT TESTED: access grants, chat, privacy, moderation | GA04-SOC-T01 |
| 13 | COMBAT | PvE, co-op, public land liberation | Model creates no land from PvE | NOT TESTED: combat, reward, persistence, world clearance | GA04-CMB-T01 |
| 14 | TRANSPORT | Paid pickup shipment of real paper stock | Cargo in transit counted once; 5 PAPER fee; 15m travel, escrow settlement | No bike/road, ownership/custody, courier player or failed delivery | GA04-TRN-T01 |
| 15 | CHARACTER | Single hero with inventory and movement | Only abstract player ID tracked | NOT TESTED: 8-view SVG, collisions, rig, controls | GA04-CHAR-T01 |
| 16 | QUEST | First job→property→construction→farm tutorial | Stage order and idempotent job payouts modeled | No narrative dialog, already-done goal detection or optional flow | GA04-QUEST-T01 |
| 17 | NPC | Four guides and accessible municipal services | Municipal facilities represented by services only | NOT TESTED: SHMYG, BETON, ISKRA, MOH AI, localization or schedules | GA04-NPC-T01 |
| 18 | SURVIVAL | HP/Stamina and safe absence | No offline hunger or death imposed by toy model | NOT TESTED: injury, death, recovery or environment | GA04-SURV-T01 |
| 19 | AUTOMATION | Backpressure, finite store, cash-aware sow | Starts work only with funds/input/capacity; stops at storage limit | Buyer-wait/cash-wait reporting coarse; UI controls and policy revocation absent | GA04-AUTO-T01 |
| 20 | MONETIZATION | Free core, cosmetics separate from PAPER | No real-money flow inside model | NOT TESTED: entitlements, payments or child protections | GA04-MON-T01 |
| 21 | UNITS | BuildCells vs world coordinates | Logical resource sizes and time units tagged | No WU/BuildCell or actual player/bike/door collision | GA04-UNITS-T01 |
| 22 | VISUAL | Approved 3/4 style and eight runtime directions | Numerical model does not alter art | NOT TESTED: character-first SVG master or animation gate | GA04-VIS-T01 |
| 23 | TECH | Authoritative transactions and exactly-once | Synthetic money, stock, water invariants pass; baseline input replay deterministic | No actual server, DB locks/RLS/disconnect recovery or 100 live clients | GA04-TECH-T01 |
| 24 | RELEASE | Character-first gates and economic acceptance | GA04 shows why economy and gameplay gates not met | Cannot advance character gate, runtime QA or public release | GA04-REL-T01 |
| 25 | GAMEPLAY | Starter game loop and fair economic opportunity | House and some production/market progression measured | 85/100 no sales in 7d ⇒ first rewarding economic loop not broadly viable | GA04-GAME-T01 |
| 26 | GOVERNANCE | One source catalog and version/review statuses | 50 unified numeric TEST values with unit/source; frozen v0.1 untouched | Verbatim 27-long-form chapter archival and approvals still open | GA04-GOV-T01 |
| 27 | DECISIONS | Issue owner, severity, closure and migration | GA04 linked to CC-001..052 and new findings | New policy choices unapproved; do not close blockers without owner | GA04-DEC-T01 |
## Status and important qualifications
Sections 01–27 each reviewed for integrated evidence and remaining gaps; this is an **audit coverage matrix**, not 27 IMPLEMENTED chapters or 27 unit-test suites.
Model facts: 16 base+variant scenarios with 208 invariant assertions and replay determinism; 11 sensitivity scenarios with 143 further invariant assertions; 12 shipping-minimum scenarios with 156 further invariant assertions. Total 39 synthetic runs and 507 money/material/capacity/recipe checks (not actual game QA). This counts repeated checks across cases, not unique invariants. Every case uses code derived from the SAME TEST configuration.
Important high-level results: 100 new accounts vs treasury10k all wait for training wages; 100 staggered with10k can complete through recycled city land income; kit stock insufficient limits completions. 1/20/100 HEMP farms 7d paper sold396/414/370 while production426/912/2868; at100 farms 85/100 have zero sales. Changing minimum shipment to6 lifts 7d 100-farm sales to436 and active sellers to27/100, but scarce demand and municipal water remain critical.
## Gate decision
GA04 documentary audit 27/27 topics COVERED. Full final content integration, approval, real runtime and real SVG CHARACTER-GATE NOT COMPLETE. No chapter promoted to VERIFIED or APPROVED on the basis of this table.
## Immediate policy questions
1. Currency split PAPER/PAPER_SHEET and HEMP vs FLAX fiber provenance, source budget/emission.
2. Full onboarding seed/water/equipment pathway and no deadlock for 100 simultaneous new users.
3. CityPurchaseOrder fair queue, minimum shippable 6/12/16 and delivery cost/proof.
4. Shared district water trunk, per-property entitlement, actual geography/pipe cap, fairness.
5. Workshop shared/private ownership and CAPEX; labor and commute costs, real first sale vs guaranteed purchase.
6. Actual source GDD chapters and character-first gate, server DB locks and ledger tests.
