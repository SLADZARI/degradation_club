# DEMENTOR LIVE — ECONOMY 1 / 7 / 30-DAY STRESS SCENARIOS
GA-01, 2026-10-17 | Status: HYPOTHETICAL UPPER BOUNDS / NO MARKET DEMAND MODEL. Values depend on unapproved GDD TEST prices, recipe and full automation assumptions.
WARNING: numbers describe what an unbounded city buy-back scheme would have to fund, NOT actual predicted sales, revenue or player profit. No game code has been tested.

## Assumptions / fixtures
4 planting slots per farm, immediate automatic harvest/replant/transfer, seeds at 4 PAPER each bought from city, factory infinite warehouse/delivery, water bought at 2 PAPER per 10L, maintenance at 2 PAPER per paper-making batch (extension of wood-paper TEST charge for comparison), selling price = 3 PAPER/PAPER_SHEET (city unlimited hypothetical), no taxes/capex/labor/transport, no demand constraints. Same farm first begins planting at t0; complete cycles counted with floor(24h/cycle). Parallel factory processing allowed only when total machine time fits calendar.
HEMP: 32 growth rounds/day of 4 plants, each 12 HEMP => 24 SHEETS, 40L water, 4 process batches, 4 seeds. Factory 32×24=768 minutes/day for these 128 paper batches, <1440 available. Total daily 768 SHEETS, 1280L, 128 seeds.
FLAX: floor(1440/75)=19 rounds, each 16 FLAX ⇒32 SHEETS,36L,4 process batches,4 seeds. Factory 19×32=608 minutes/day, <1440. Total 608 SHEETS,684L,76 seeds. This ignores machine backlog at arbitrary deadlines and crop/plant downtime.
Prices and every source of cash remain TEST, absent actual demand the sales portion may be zero.

## One four-plant automated farm/day — hypothetical
| KPI | HEMP | FLAX |
|---|---:|---:|
| Paper sheets | 768 | 608 |
| Water used (L) | 1280 | 684 |
| Seeds required | 128 | 76 |
| City buy value if all bought at 3 PAPER | 2304 | 1824 |
| Water city pack purchase PAPER | 256 | 138 |
| Seed city cash at4 PAPER/seed | 512 | 304 |
| Maintenance TEST 2 PAPER/paper-making batch | 256 | 152 |
| Conditional cash margin before land/tools/work/delivery/taxes | 1280 | 1230 |

HEMP river pump 30L/h over24h yields <=720 L intake; with initially full40L tank there is <=760L available, leaving ≥520 L unmet relative to1280L/day demand (potential additional losses due capacity/timing). City water line 120L/h theoretically supplies2880L/day, enough for one HEMP farm and some other demand, but bursting must be replay-tested.
With only one 32-sheet output buffer and no automated transfer, theoretical all-day sell scenario FAILS: a single HEMP station needs to empty its buffer at least 24 times/day; no such network flow has been implemented. No automatic replant = cannot attain upper bound.

## Market-demand stress table: PAPER required by unbounded city buybacks
| Simultaneous identical farms | Period (days) | HEMP buyback PAPER | FLAX buyback PAPER | HEMP water L |
|---|---:|---:|---:|---:|
| 1 | 1 | 2304 | 1824 | 1280 |
| 1 | 7 | 16128 | 12768 | 8960 |
| 1 | 30 | 69120 | 54720 | 38400 |
| 20 | 1 | 46080 | 36480 | 25600 |
| 20 | 7 | 322560 | 255360 | 179200 |
| 20 | 30 | 1382400 | 1094400 | 768000 |
| 100 | 1 | 230400 | 182400 | 128000 |
| 100 | 7 | 1612800 | 1276800 | 896000 |
| 100 | 30 | 6912000 | 5472000 | 3840000 |

If city treasury started at10000 PAPER and no funds returned/issued (pure isolated TEST): unlimited HEMP buyback from 1 farm could exhaust it in 4.34 days; 20 farms in0.217 days; 100 farms in0.0434 days. This is NOT a forecast because real city sales, land receipts, stock, taxes, demand, trade and actual player activity are absent.

## Beginner liquidity stress
Training jobs 4×90=360 PAPER each new user. 20 new users =>7200 PAPER wage reserve before buying land; 100=>36000. If initial80 PAPER also funded from treasury rather than minted, add1600 for20 users or8000 for100 (total8800 or44000). Land payments may recycle360/player back into city treasury only AFTER player earns and buys the land. Initial liquidity/faucet required to avoid early failure. Construction materials gap18 PAPER/player if purchased at city prices; for20 players total360 extra; for100 1800 extra.

## Scenarios to run with real game sim (not yet done)
S-01 Cold launch 1 user, treasury0, city inventory starting KIT — does tutorial require minted funds?
S-02 20 users with standard courier income, finite city wood/seed/water supply and city treasury initial 10k, supply restock schedule.
S-03 100 users, rush-buy land same district/stock and 5 automated hemp farms selling to city while city paper demand limited.
S-04 24h mixed 10 HEMP + 10 FLAX farms with 5 pumps and streetfront shops; monitor water shortage and physical delivery.
S-05 7d/30d 20 farms, finite cap/area, maximum manufacturing buffer, city cash with and without replenishment.
S-06 buy/sell arbitrage: buy city WOOD at3, use city WATER2/10L, upkeep2, sell 8 SHEET×3 to city => gross PAPER gain8/5min before constraints; alternate buyer demand limited.
S-07 negative cash shocks: sell prices 1,2,3,4; supplier wood scarcity; stage cancellation/refund.
S-08 world time cycle60 real min has zero influence on above production durations.

## Closure thresholds must be approved, not guessed
Initial solvency reserve, maximum budget issued per day, target beginner time-to-land/time-to-house, maximum fully automated city purchases per player/day, base material stock replenishment, demand depth, allowed markup, storage capacity and transportation costs. Until defined, profitability and 30-day economy equilibrium are OPEN.
