# DEMENTOR LIVE — GDD v0.2 CANDIDATE / GA-03 CITY & FIRST-HOME PATCHES
2026-10-17. DESIGN REVIEW PROPOSAL ONLY. This text does not supersede accepted game design or MASTER GDD v0.1. Any new canonical rule needs user approval and change ID.
Affected domains: ECONOMY-01 / WORK-01 / QUEST-01 / LAND-01 / BUILD-01 / RESOURCE-01 / WATER-01 / FARM-01 / PRODUCTION-01 / AUTOMATION-01 / MARKET-01 / TECH-01 / RELEASE-01.

### GA03-P01 ECONOMY — treasury liquidity and job funding
CityTreasury shall distinguish totalBalancePAPER, availableBalancePAPER, reservedForTutorialPAPER, serviceCommitmentsPAPER, cityBuyOrdersEscrowPAPER, scheduledReceivingReceiptsPAPER (estimates are NEVER spendable until settled). Invariant: available + all committed funds + purchase escrows = total city funds (double-entry accounts, not duplicates).
Training package quote: START80 +4×90=440 PAPER outgoing before 360 plot+60 cabin receipts; 20 PAPER net outflow after full round. Clear money issuance rule separate from treasury transfers. Explicit policy for sudden 100 new players: reserve onboarding budget against quoted obligation, queue fairly and prevent unfunded future payable job offers. Do not promise four instant wages to100 if available city cash <44,000 PAPER and cannot collect receipts until later.
Until user approves, initial treasury amount and issuance policy stay OPEN; figures 10k/50k are stress fixtures.
Events: TutorialEntitlementGranted, CityBudgetReserved, JobCompleted, WageSettled, LandBought, BuildingFinished, TransactionCompensated. Every event idempotent.

### GA03-P02 RESOURCE/BUILD/QUEST — tutorial physical kit
TutorialWood6 + TutorialSheets4 must transfer from CityStarterWarehouse with actual item stock or be gathered legally. Grant proof is one-time and linked to Character tutorial state, not arbitrary online reward. Before irreversible city land/build spending, show ready material kit and obtain a funded reservation or allow a safe staged hold. Plot and cabin steps must not strand80 applicants after cash has been spent and kit supply is exhausted.
Options: (A) kit from finite city warehouse, pre-reserved in starter contract; (B) guaranteed permitted manual gathering; (C) more accessible paid work allowing purchases. No hidden item spawning.

### GA03-P03 WORK/QUEST/ECONOMY — complete first economic roundtrip
After starter land360+cash cabin60 from original440, cash20. Proposed first HEMP paper chain expects PAPER37 outflows before sale (seed16, water8, maintenance8 TEST extension, courier5 GA02 fixture); cash shortage17 + unpriced equipment. First economic tutorial must explicitly choose a viable pathway:
A. Additional normal jobs before farming (>=17 cash plus equipment investment) not artificial quest grant.
B. First seed/water/maintenance materials via one-time physically funded starter kit.
C. Manual accessible WOOD→PAPER chain at lower cash exposure, requiring legitimate tools and water, possibly initially free public source.
D. Starter workbench/communal facility with no personal equipment CAPEX until income starts.
First-house and first-production target times must be recalculated with real walking/working and transport travel, not pure formula.

### GA03-P04 WATER/WORLD/TIME — unified municipal shared source
World/Region/District network: municipalSource (intake cap), districtTrunk (shared finite flow), perPlotMeter (connection cap+ownership), StorageTank (40L test), ResourceConsumers (FARM/PRODUCTION). For 120 L/hour central example district budget=2,000mL/min TOTAL, not per farm. A 30L/hour river TEST pump=500mL/min PER authorized source. Model source capacity and refill integrated across simultaneous growers and industry in REAL_TIME; WORLD_TIME affects sunlight only unless separately approved.
At all times sum(consumption)+sum(stored)+sum(legitimate output) = start stock + sourced intake. Never allocate capacity twice. Server adjudicates two same-timestamp requests; per-connection and fair allocation rates logged.
If paid city water package 10L at2 PAPER remains TEST, payment must be funded on water delivery, not when client renders UI. Source operating costs and tariff destination ledgers to be decided.

### GA03-P05 CAPEX/OPEX — one catalog of cost and units
Mandatory machine asset/installed material quotes: plot rights, building footprints, workshop, refinery inputs, reservoir, pipes, pump, energy source, seed containers, storage, bicycles, courier fees, maintenance and active labor. Each item has ItemSKU/qty, PAPER fee (if any), realTime construction duration, storage footprint, permissions. No invented canonical prices. Apply sensitivity fixture cost120/300/600/1000 PAPER only as reference — payback numbers from toy model MUST NOT be used as live ROI or EBITDA.
Metrics: time-to-first-house, time-to-first-sellable-paper, cash reserve before first sale, city available PAPER during simultaneous tutorial jobs, city stock WOOD/SHEET/seeds and occupied land, water available per district, demand-filled per seller, risk of queue starvation.

### GA03-P06 SOCIAL/SECURITY — one-time grant fairness
Onboarding entitlements require validated CharacterId and one-time ledger proofs, retries idempotent, no free claim by a second character without specific policy. Rate-limits/abuse monitoring must be privacy-preserving and should not lock legitimate households unfairly. Avoid assumptions about specific personally identifiable documents, geography or platform user identity until age/privacy policy approved.

### GA03-P07 RELEASE — cross-system acceptance gates
G3.1: 20/100 concurrent newcomers, treasury ≥0 at each debit and no unlogged monetary issue; inventory debited/credited; no stranded committed purchases due starter kit.
G3.2: complete first house & at least 1 economically viable first paper sale at TEST parameters, with funded buyer, physical material logistics and true equipment construction.
G3.3: 100 players on one district head with finite water source; per tank + per source conservation; online/offline exact parity, retry consistency and fairness telemetry.
G3.4: CAPEX/OPEX documented as cost catalog with approved or explicitly TEST numbers and gameplay evidence; report how player affords required upfront costs from cash20 after house.
G3.5: Character-first SVG gate from START HERE remains BLOCKING for gameplay engine selection; economy document tests do not bypass it.
G3.6: All CC-046..052 tracked with evidence and explicit approval; user review necessary before APPROVED GDD v0.2.

### Evidence lineage
GA-03:
- onboarding_treasury_model.js / onboarding_treasury_results.json: 8 independent toy scenarios ×7 invariants=56 PASS.
- shared_city_water_model.js / shared_city_water_results.json:16 independent toy scenarios×7 invariants=112 PASS, 7d checkpoint replay equality.
- capex_opex_sensitivity_results.json: conditional calculations; not accounting-standard ROI or production proof.
No real database concurrency or game runtime execution in GA-03, no full 27-chapter revision completed.
