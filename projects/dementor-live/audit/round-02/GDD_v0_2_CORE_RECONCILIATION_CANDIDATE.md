# DEMENTOR LIVE — GDD v0.2 CANDIDATE / CORE ECONOMY & WORLD DELTA 02
2026-10-17 | PRE-APPROVAL PATCHSET · GA-01 + GA-02. This document supplements, does NOT overwrite MASTER GDD v0.1. Explicit user approval is required for each decision ID. The source 27 chapters remain design materials, not automatic canon.

## CHANGESET A: ECONOMY-01
Decision CAND-E-01: PAPER is a server-authoritative integer currency ledger, PAPER_SHEET a physically stored manufactured item; crafting never mints PAPER. Approved? NO. Alternative: physical certified notes with controlled minting — not chosen.
CAND-E-02: every city-created starting grant and tutorial wage has a funded treasury source or explicit signed mint event, not unlogged balance creation. Initial grants 80 and 4×90 (including once-only bonus) still TEST.
CAND-E-03: municipal city buy-back requires finite real inventory demand, spend budget and warehouse receiving capacity, purchase quote reserved before courier dispatch.
CAND-E-04: city source/sink accounting: player money+city money+escrow conserved except explicit authorized mint/burn; city shops, workshop service, seed/water selling transfer PAPER TO treasury, city procurement transfers FROM.
CAND-E-05: working capital, CAPEX, OPEX and treasury scenario must be signed off before claiming profitability.
AFFECTS WORK, MARKET, LAND, FARM, PRODUCTION, RELEASE.

## CHANGESET B: RESOURCE-01
CAND-R-01: separate HEMP_FIBER and FLAX_FIBER SKU until user approves generic shared recipe. Prevent CC-028 exploit.
CAND-R-02: total_stock with available + reserved + in_transit is one physical quantity; cargo custodian does not create an additional item copy. Owner and custodian separate.
CAND-R-03: every resource type has canonical integer unit, cargo capacity coefficient, stack split/merge, source/provenance, allowed recipes. WATER tracked in integer millilitres for fractional rates, displayed as litres.
AFFECTS PRODUCTION, TRANSPORT, BUILD, MARKET.

## CHANGESET C: FARM-01
CAND-F-01: planting spends seed once and water through approved staged schedule; no offline progress without corresponding water entitlement.
CAND-F-02: auto replant must respect finite seed inventory, cash and input/output backpressure; owner can enable optional policy.
CAND-F-03: partial water deficiency pauses growth; don't retroactively credit progress at WORLD_TIME sunrise. Yield still 3 HEMP / plant, 4 FLAX / plant TEST.
AFFECTS TIME, WATER, AUTOMATION, ECONOMY.

## CHANGESET D: WATER-01
CAND-W-01: source water flow ≤ allowed source ML/min; river pump TEST 500 ml/min, city service TEST 2000 ml/min/connection, CITY utility shared trunk cap OPEN.
CAND-W-02: city tariff purchase ten litre pack at 2 integer PAPER (TEST) and unused water remains stored; need explicit pricing/rounding policy.
CAND-W-03: each tank/source transfer and consumer usage one event and ledger transaction; simultaneously requesting consumers cannot double-use last 10L.
AFFECTS PRODUCTION, FARM, TIME, RESOURCE.

## CHANGESET E: PRODUCTION-01
CAND-P-01: recipe source IDs separate HEMP and FLAX fibers, stages preserve origin; final SHEET amount credited once after full stage completion.
CAND-P-02: output buffer and receiving warehouse have separate caps and reservations; no second batch if result cannot be stored safely.
CAND-P-03: before consuming raw material, check permission, capacity, energy/water timing, optional spending cap, stage cancellation/refund semantics.
CAND-P-04: WOOD-paper TEST 4 WOOD+10L→8 SHEETS/5min, hemp TEST 3 HEMP+8L→6 SHEETS/6min, flax TEST 4 FLAX+6L→8 SHEETS/8min. Not fixed game economy; restart after source approval.
AFFECTS RESOURCE, WATER, TIME, AUTOMATION, ECONOMY.

## CHANGESET F: AUTOMATION-01
CAND-A-01: policy with reserveCashPAPER / maxRawBeforePause / maxFinishedBeforePause and optional funded buyer required for shipment. Prototype thresholds 60 PAPER, 24 raw, 96 finished TEST.
CAND-A-02: automatically pause new discretionary spending when already committed stock cannot sell or the inventory is over cap. Do not delete existing crops, goods or reservations.
CAND-A-03: user sees projections: 24-hour resource consumption, current buyer demand, free storage and reason for WAITING_BUDGET / WAITING_BUYER.
AFFECTS FARM, PRODUCTION, MARKET, ECONOMY, TIME.

## CHANGESET G: MARKET-01
CAND-M-01: CityPurchaseOrder has remaining funded quantity, unit price, city warehouse capacity; purchase reservation atomically holds seller item, city PAPER escrow and receiving slot BEFORE delivery.
CAND-M-02: paid courier operates only against confirmed reserved order, with committed custody state and time-limited cancellation/return policy.
CAND-M-03: evaluate round-robin seller queue vs FIFO vs market price bid; GA-02 synthetic preference for eligible rotating offer queue, but anti-gaming/fairness metrics must be decided.
CAND-M-04: city resale and stock procurement are finite, no guarantee to buy every player product.
AFFECTS TRANSPORT, WORK, SOCIAL, RESOURCE, ECONOMY.

## CHANGESET H: TIME-01
CAND-T-01: REAL_TIME drives planting, utility flow, machine stages, contracts, courier time and budget reset; accelerated WORLD_TIME drives daylight and NPC schedule only.
CAND-T-02: deterministic event order with distinct idempotency keys and atomic locks; online/offline replay must produce equivalent ledger state under same world actions. GA-02 minute step only a synthetic fixture.
CAND-T-03: analytics record blocked-duration MINUTES separately from distinct rejected commands, fix CC-045.
AFFECTS WATER, PRODUCTION, WORK, MARKET, NPC.

## CHANGESET I: WORK / QUEST / BUILD / LAND
CAND-O-01: do not present first house as affordable by exactly four tutorial deliveries if player must buy all materials: shortage18 PAPER. Candidate either record 6 WOOD+4 SHEETS starter kit from finite City RESOURCE account, add paid job ≥18, or rebalance prices. Keep proposed baseline as TEST pending onboarding playthrough.
CAND-O-02: CITY pay-outs must be treasury-backed in concurrent 20/100 novice loads before plot payments recycle money.
CAND-O-03: region clearance/owned/developed/market available independent status axes; home/commercial plot permissions come from LAND/SOCIAL and cannot be bypassed by marketplace.
AFFECTS LAND, BUILD, ECONOMY, SOCIAL, RELEASE.

## DESIGN EVIDENCE
GA-01 40/40 arithmetic checks, 21/21 synthetic replay behavior checks.
GA-02 24 finite simulated runs x8 invariants =192/192; 16 baseline/backpressure comparisons with positive resource/money conservation; 9 booked-order 30-day scenarios; 10/10 targeted escrow/order tests.
Substantive finding: low buyer demand can drive one auto HEMP farm wallet500→0 in7d despite stocks, while inventory/cash controls can preserve currency in toy. Multiple sellers require reserved city buy order to avoid shipping fees without buyer and fairness issues; 100 competitor test showed 64 with zero sales under base policy and 30 under booked rotation, demand remains scarce.
THIS IS NOT PRODUCTION-VERIFIED or a claim of healthy real economy. All policies and numbers are unapproved hypotheses.

## NEXT GO / NO GO
BEFORE ECONOMIC CODE GATE:
- user approves E-01/R-01 and treasure issuance policy;
- character-first camera/rig pipeline remains separate P0 blocker;
- cash/source/pricing policies locked;
- live SQL transaction specs written for item transfers, water reservation and escrow;
- runs of 1/20/100-player integrated game simulation + onboarding + physical logistics and true external players.
Before public release additionally age/chat moderation and pay policies approved.
