# DEMENTOR LIVE — GLOBAL CROSSCHECK NEW FINDINGS CC-041..045
2026-10-17 · GA-02 · DESIGN REVIEW. Complements CC-001..040; statuses remain OPEN until source owner approval and real integration tests.
SEVERITY gates: ECONOMY/PRODUCTION/MARKET P0 for economic vertical slice; public release additionally Social/Safety.

## CC-041 [HIGH · FARM/PRODUCTION/AUTOMATION/ECONOMY] Self-draining automation
Reproduction: finite city buy64 PAPER_SHEET/day, player wallet500, four HEMP beds, autofarm, seeds4 PAPER each, city water10L/2 PAPER, maintenance2 per paper batch, shipping5 per order, finite buffer32 warehouse128. 1d player ends166 PAPER, 7d player ends0 PAPER, production348/sold192/held156. Continues to pay for unsellable output.
Expected: automatic spending bounded by player-controlled working capital, storage backlog and signed buyer demand (if player elects risk).
Root: no backpressure or funded buyer requirement.
Candidate: working-capital reserve60, max raw stock24, finished backlog96, pause work before committing new costs; explicitly handle already running stages. See AUTOMATION_BACKPRESSURE_v0_2_CANDIDATE.
Evidence: finite_economy_results.json and backpressure_comparison_results.json.
Status: PROPOSED FIX TESTED IN SYNTHETIC FIXTURE, OPEN FOR APPROVAL AND RUNTIME QA.

## CC-042 [HIGH · MARKET/TRANSPORT/ECONOMY] Paid deliveries without booked demand + unfair order matching
Reproduction: 20 farms with city demand64 sheets/day: 13 had zero city sales in 30d with baseline backpressure, max individual808 sheets. 100 farms: 64 zero-sale. Delivery fee paid at dispatch even if city demand can be exhausted before arrival.
Expected: order quantity/city budget/receiving capacity reserved before courier dispatch; exclusive settlement or refund; documented fair matching.
Candidate: CityPurchaseOrder with escrow/physical item hold/receiving capacity reservation, round-robin per accepted quote; 20 farms 8 zero-sale, 100 farms30 zero-sale in synthetic 30d. Still scarcity.
Status: PROPOSED FIX TESTED IN SYNTHETIC FIXTURE; MARKET fairness/abuse and real SQL concurrency NOT VERIFIED.

## CC-043 [HIGH · WATER/WORLD/ECONOMY] No shared municipal infrastructure stress rule
GA-02 assumes one city water connection120L/h per farm (dedicated); 100 farms therefore hypothetically can purchase water each at full rate even though shared trunk capacity, tariffs, pumps, location and municipal finance unspecified.
Expected: separate consumer service connection capacity, shared district network capacity, source renewal/quotes, priority/overrun policy with graphical pipes/cross-region routing. Model supply in ml with discrete event order.
Candidate: water graph with source-level and branch-level capacities and atomic concurrent debit/flow.
Status: OPEN; current simulation adequate only for per-farm connection TEST.

## CC-044 [HIGH · ECONOMY/RELEASE] Missing real profitability and player population model
Despite 24 finite simulation cases, cannot certify net profit or economic equilibrium. Excluded land, workshop, hoses, pump, power, repair, wages, character active time, real delivery labor, realistic city inventory replenishment, pricing dynamics, player-to-player market, location, taxes, crop aging.
Expected: integrated onboarding+CAPEX+OPEX+treasury+NPC role demand+player market, 1/7/30d across 1/20/100 players, sensitivity and legitimate money creation source.
Status: OPEN; next comprehensive simulator spec required.

## CC-045 [MEDIUM · QA/OBSERVABILITY] Metric denominators flawed under waiting conditions
GA-02 experimental counters seedDenials/waterDenials increment for every minute while unmet, not per unique command or completed stage. Counts may imply thousands of rejected user actions when a single production condition persists.
Expected: distinguish duration WAITING_INPUT/BUYER/WATER/CASH (minutes), count unique rejected request IDs and retries, map to accurate UI.
Status: OPEN; improve domain telemetry before runtime metric review.

## Closure contract
Each issue requires: approval by owner, exact changed canonical rule, corresponding user-facing UI text, event/schema implementation, deterministic tests with DB concurrency/retry and rollback evidence, 7/30-day replay in integrated model, relevant user-facing QA, changelog update.
GA-02 designer simulations are not grounds for closing these issues. Original CC-001..040 not silently reset.
