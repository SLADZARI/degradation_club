# DEMENTOR LIVE · GLOBAL AUDIT ROUND 03
## Treasury liquidity, shared municipal water, first-farm CAPEX/OPEX
Дата: 2026-10-17 | Source: GDD v0.1 + GA-01 and GA-02.
Status: CALCULATED / SYNTHETIC SPECIFICATION MODELS. No new DESIGN decision approved. No game-server code/database was tested.

### Executive result
GA-03 verifies three cross-domain problems independently: onboarding city liquidity, raw material inventory for tutorial building, and common city water infrastructure. Also calculates first-harvest cash gap and sensitivity of equipment CAPEX. All numbers sourced from GDD TEST fixtures or expressly labeled GA-03 scenario knobs. Models are not integrated into one production engine and do not promise actual earnings.

## 1. Onboarding cash and physical tutorial resources
Starting scenario per player: CITY pays 80 PAPER first; four jobs pay 4×90=360 PAPER; city takes 360 PAPER for 12×12 plot and 60 PAPER for cabin. Player ends 20 PAPER IF starter building materials 6 WOOD+4 PAPER_SHEET are supplied without price and physically transferred from city stock (not spawned from nothing).
Net city cash leakage per COMPLETE player = 80+360−360−60=20 PAPER; treasury still needs up to 440 PAPER of temporary liquidity per player BEFORE land proceeds return.
One-time starter kit must debit source warehouse city resources. If the player buys it at city prices WOOD6×3=18 and SHEET4×5=20, first house costs 18 more than 20 cash reserve permits (existing CC-029).
Simulated 8 scenarios with 7 accounting invariants each (56/56 PASS, synthetic):
| Players | Treasury opening | Kits WOOD/SHEET | Scheduling | Completed | Treasury ending |
|---:|---:|---|---|---:|---:|
| 1 | 10,000 | 6/4 | Round-robin | 1 | 9,980 |
| 20 | 10,000 | 120/80 | Round-robin | 20 | 9,600 |
| 100 | 10,000 | 600/400 | Round-robin | 0 | 20 |
| 100 | 50,000 | 600/400 | Round-robin | 100 | 48,000 |
| 100 | 10,000 | 600/400 | Sequential | 100 | 8,000 |
| 100 | 50,000 | 120/80 | Round-robin | 20 | 48,000 |
| 20 | 50,000 | 0/0 | Round-robin | 0 | 49,600 |
| 20 | 0 | 120/80 | Round-robin | 0 | 0 |
In the 100 concurrent/10k example, city first funds grants to 100 players (8,000) and then only 22 wage installments of 90, leaving 20 treasury; 78 players are waiting after first grant, 22 after first job. No player has reached the 4-job milestone; no land money returns. This is a **liquidity/scheduling deadlock**, not insolvency over the complete lifecycle. Sequential scheduling can complete 100 because revenue returns after each cabin; such scheduling can however unfairly privilege early accounts.
City stocking is independent: even 50k PAPER treasury funds only 20 complete starter kits if inventory provides materials for20.
Source accounting invariants: SUM(money)=constant without mint, source kit material conservation, one-time issuance/reward by idempotent IDs, nonnegative wallets, completed character has correct cabin and20 PAPER.
CAVEAT: city job payouts simulated as unconditional if enabled, not actual mission effort/proofs, no anti-alt fraud, no geography or NPC work capacity. 50k/10k treasury and city physical stock numbers are stress knobs, not adopted treasury policy.

## 2. Shared municipal water supply
Previously city water service 120 L/hour could be misread as 120 L/hour to EACH farm. GA-03 models one district head distributing only 2,000 mL/minute total across all users. Each farm has a40L initial reservoir; city water supply shared; crop planting 4 HEMP plants consumes8L each 45min cycle; each harvested batch gives4 paper production sub-batches costing8L per sub-batch, six real minutes per sub-batch. The farm attempts to replant only if its production backlog is controlled and water is available.
Separate per-farm river TEST pump gives500mL/min=30 L/hour **per independent river pump**. Does not imply unlimited legal river extraction.
16 stress scenarios 1/4/20/100 farms ×1/7 real days × CITY trunk / separate RIVER pumps, 7 water/material invariants each =112/112 PASS and one persisted 7-day checkpoint replay equality.
| Farms | CITY total PAPER_SHEET in 24h | CITY total sheets in 7d | CITY water intake in 24h (L) |
|---:|---:|---:|---:|
| 1 | 744 | 5,352 | 1,248 |
| 4 | 1,752 | 12,120 | 2,820 |
| 20 | 1,920 | 12,360 | 2,878 |
| 100 | 3,000 | 13,800 | 2,878 |
A single trunk supplies at most 120L×24=2,880L per day. The 100-farm first day is high partly due to **100 initial fully filled 40L tanks** =4,000L pre-funded initial stock. Intake vs consumption reconciles with remaining stored water; no water minted in the simulation.
At steady operation, shared head capacity—not each disconnected plant's theoretical productivity—limits scaling. City water source must model upstream district capacity, connection capacity, tank, source rights and allocation fairness. Player interface should show shared availability and queue. Do not combine this water-only theoretical production with economy Round02 simulation outputs: GA-03 water model intentionally omits seeds, working capital, storage and demand and uses front-loaded irrigation for simplicity.

## 3. First business liquidity
First home finishes with20 PAPER if kit free. First 4-plant HEMP to PAPER_SHEET batch as TEST:
- Four seeds ×4 PAPER =16
- Water40L in10L packs ×2 PAPER =8
- Workshop maintenance 4 paper batches ×2 PAPER =8 (GA-01 comparison extension, not canon for hemp)
- Paid courier shipment =5 (GA-02 test fee only)
- Total before first city sale =37 PAPER
- Gap against cash after house20 PAPER =17 PAPER (CC-048).
Expected eventual city buyer revenue 24 SHEETS ×3=72 PAPER if fully funded buyer reservation exists, after above four money costs 72−37=35 PAPER cash contribution before facility costs, active labor, reserves, plot/tool CAPEX and taxes. NO sale guaranteed.
This is separate from earlier 18 PAPER gap when buying first cabin materials — both can be true under different tutorial-kit policies.

## 4. Equipment CAPEX sensitivity
Original GDD lacks cash prices, real materials, installation time and maintenance contract for paper plant, tank, seed supply and auto modules. Do not invent a canonical sticker price. As pure test, compare additional hypothetical CAPEX 0/120/300/600/1000 PAPER against GA-02 one mature HEMP farm, 500 PAPER working capital, 64 SHEETS/day finite city demand and activated backpressure+funded order; cash gain after 30d was +2,756 PAPER under these assumptions (wallet 3,256 vs startup 500).
| Hypothetical installed CAPEX | First daily boundary where model gain covers CAPEX | Model gain after CAPEX at 30d |
|---:|---:|---:|
| 0 | day 2 | 2,756 |
| 120 | day 3 | 2,636 |
| 300 | day 5 | 2,456 |
| 600 | day 8 | 2,156 |
| 1,000 | day 12 | 1,756 |
This sensitivity does NOT check the player's ability to fund the original installation; cannot call it actual payback, ROI, EBITDA or real game economy profitability until all cash/material, land and human labor costs are specified. Starting with500 is NOT the same as post-home cash20. Availability of raw construction materials, paid delivery and local demand is a prerequisite.

## 5. Domain proposals to review (none approved)
TREASURY-01: reserved budget/liquidity for onboarding, fair staggered or escrow-backed funding schedule; initial city funds and allowed issuance rule explicit, monitored.
CITY-KIT-01: finite tutorial kit inventory and one-time physically accounted grant; starter plot availability and stage transition atomic.
CITY-WATER-01: master municipal source cap, district head, per connection limits, REAL_TIME water allocation; accounting and availability notices.
WORKING-CAPITAL-01: intended first-harvest path: one extra paid job, material grant or alternate low-cash activity before industry. Do not grant money silently.
CAPEX-01: pricing catalog for land, workshop, pipes, reservoir, storage, automation, transport, seeds and consumables. Define investment conditions and throughput rates.
FAIRNESS-01: city job scheduling and water allocation fairness; prevent signup floods draining city treasury and all water.

## 6. Engineering and evidence
Artifact sources:
- onboarding_treasury_model.js + onboarding_treasury_results.json.
- shared_city_water_model.js + shared_city_water_results.json.
- capex_opex_sensitivity_results.json.
Model checks: 56 onboarding accounting assertions,112 water accounting assertions, checkpoint match; these are data-model checks only, NOT game-server QA. Source truth GDD v0.1 and GA-01/02 frozen.
Before closure: same flows must be implemented with actual database transaction isolation, RLS, honest city balance/stock, batch event scheduler and market reservations; integrated replay under 20/100 clients and user approval required.

## 7. Next audit work
- Merge city payment and shared water into same finite simulation WITH seed/warehouse/demand/transport CAPEX and explicit real labor.
- Test 1/7/30d 1/20/100 newcomers + producers across shared city accounts, not disconnected subsystem sums.
- Design scenario permutations: fixed city treasury10k vs budget replenish policy; seasonal demand; 120/240/600L/hour district water trunks; courier wages and REAL_TIME tariffs.
- Formalize economy policy and player-first-house flow with user choice.
- Align all 27 domain texts to versioned DATA_CONTRACTS and release gate tests. Until full long-form original chat archived, SOURCE COMPLETENESS remains OPEN.

Summary status: Round03 numerical/shared budget and utility check documented; economy still unapproved and not game runtime validated.
