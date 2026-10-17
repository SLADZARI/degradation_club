# DEMENTOR LIVE — GLOBAL AUDIT ROUND 05
## Funded first sale, starter liquidity and demand/capacity reconciliation
2026-10-17 · Status: MODEL TESTED / POLICY PROPOSED / NOT GAME RUNTIME VERIFIED

### 1. Scope and policy
This round builds DIRECTLY ON GA-04 unified city fixture (treasury, onboarding, land, cabin materials, city seed supply, HEMP cultivation, common WATER head, municipal workshop, physical warehouse/courier cargo, city purchase escrow). It adds a test-only first market entitlement for a new household.

Proposed policy **FUNDED_6**:
- On successful atomic plot+starter-cabin purchase, city reserves **6 PAPER_SHEET ×3 PAPER =18 PAPER** from actual CITY_TREASURY to an offer hold for that player's one-time contract.
- Starting city money is 50,000 PAPER in the base stress fixture; max one-time first-sale purchase budget is 1,800 PAPER for 100 players, NOT a mint. If insufficient, order is NOT promised/issued.
- Player must legitimately harvest HEMP, process at the shared workshop, produce 6 physical sheets into its local container. Only then can the six sheets be picked up (test: 15 real minutes, **zero separate pickup fee for first sale**, not a real courier service implementation).
- At order reservation, 18 PAPER moves from CITY offer hold into in-transit purchase escrow; 6 physical sheets move from player warehouse to a single cargo container (never copied); city receiver capacity also held.
- On delivery, CITY physical buyer hub receives 6 sheets and PAPER escrow settles to player; repeats cannot create a second payout.
- City first-purchase hub is SEPARATE from ordinary quota64 sheets/real-day city demand, has finite capacity128 sheets and processing/consumption32 physical sheets per real hour. This 600-sheet incremental municipal demand and consumption PURPOSE ARE UNPROVEN fiction/fixture: no perpetual demand without real uses.
- Offer TTL test 7 real days. Expiry returns unused CITY money to city available funds and cancels *unaccepted* quote; it cannot expire after goods enter transit.
- Sellers holding a funded first-sale order cannot bypass it through normal shipping while they have no sale, avoiding dual liabilities and a double-claim.

All quantities are TEST, not approved GAMEPLAY/ECONOMY rules. No original v0.1 canon modified.

### 2. Model test evidence
Reused unmodified GA04 numeric baseline when FUNDED_6 is OFF: 16 previously defined runs preserved their results, and 16/16 regression configurations passed.
Executed **31 new Round05 independent synthetic cases ×16 accounting invariants = 496/496 repeated checks** (plus 16 GA04 regression cases ×16 test-model invariants = 256; some overlap, not distinct features).
Checked money across CITY+players+held quotes+delivery escrow, conservation of WOOD, starter SHEETS, produced SHEETS/cargo/municipal hub consumption, SEED_HEMP, municipal WATER, source throughput, workshop materials, stock capacity, home materials, one-time offer lifecycle and settlement count, no hidden mint.

| Players | Horizon | Without funded first sale: number with sale | FUNDED_6: signed first sales | Overall sellers under FUNDED_6 |
|---:|---|---:|---:|---:|
| 1 | 24 REAL hours | 1 | 1 | 1 |
| 20 | 24 REAL hours | 3 | 20 | 20 |
| 100 | 24 REAL hours | **0** | **96** | **96** |
| 100 | 7 REAL days | **15** | **100** | **100** |
| 100 | 30 REAL days | 15 | 100 | 100 |

At 100 persons/7 days: 100 first-sale contracts settled, **600 physical PAPER_SHEET** went into/through the dedicated municipal beginner buyer hub, and **1,800 PAPER** moved from CITY to sellers (not from minting). Total sheets sold across all city demand channels =952, versus370 under GA04 baseline; not all 952 are ordinary buyers. City buyer hub consumed600 sheets in the test fixture, so this design would need a real municipal use or lawful stock flow to justify ongoing demand.
The first-sale median time among paid new sellers in 100-player/7d TEST is 915 REAL minutes (15h15 after simulation begins), not a suitable target automatically; 100-player/24h test paid96/100 by 24h, remaining4 still have held offers. Times include abstract tutorial work and automation, not physical city walks or controls.

### 3. Stress parameters and failure cases
| 100 players, 7 real days except where specified | Funded offers | Settled first sales | Overall players with any sale | What it demonstrates |
|---|---:|---:|---:|---|
| Base 50k city/first budget1,800 | 100 | 100 | 100 | Contract clears in defined toy conditions |
| First-sale budget900 | 50 | 50 | 59 | Can't promise 100 offers on 900 PAPER |
| First-sale budget0 | 0 | 0 | 15 | Returns to scarce ordinary market |
| Hub capacity32 sheets (rather than128) | 100 | 100 | 100 | Throughput and time more important than storage alone |
| Hub processing8 sheets/hour | 100 | 100 | 100 | Later first sales; median 1,875 real minutes |
| Hub processing0 sheets/hour | 100 | **21** | 21 | Capacity128 holds only 21 six-sheet consignments (126 sheets) |
| Municipal water reduced from120 to30 L/h | 100 | 100 | 100 | Median time to sale 3,048 real minutes |
| Water raised to600 L/h | 100 | 100 | 100 | Median 495 real minutes; still physical production constraints |
| City treasury10,000 PAPER with 100 simultaneous starters | 0 | 0 | 0 | Can't finance tutorial before city land receipts |
| Same city10,000, 100 arrivals staggered30min | 100 | 100 | 100 | Timing and recycling matter; cannot substitute real fairness rules |
| Starter kit only for20 households | 20 | 20 | 20 | Material stock as binding constraint independent of money |
| Offer TTL just60 REAL minutes | 100 | 0 | 15 | Quotes expire before production; first-sale contract useless |

**Important**: "100/100 in seven days" means *under the particular toy input rules*. It is NOT an unconditional first-sale guarantee, a promise to real users, or justification for inventing city currency.
Even under base, 4/100 did NOT complete in 24 hours; the target "first sale within first hour" is not met. This calls for UX/reward design revisions, not just silently increasing WATER.

### 4. First sale is not a full profit proof
6 sold sheets pay 18 PAPER TEST. To make the first batch from an empty four-bed HEMP farm, the player must buy 4 seeds (16 PAPER) and at least two 10L water packets (4 PAPER) for 8L growth+8L first paper batch, plus maintenance2 PAPER = at least22 PAPER in gross initial cash outflows before first six-sheet receipt, not counting equipment/labor/commute. Therefore the first sale alone is not a profitable cash-positive investment (-4 PAPER by this simplified attribution), though one crop produces remaining HEMP for subsequent batches.
After the first house the player has20 PAPER in GDD TEST; GA04 already provides an extra funded ordinary courier job30 PAPER to reach a start wallet50. This exercise only validates arithmetic under timed (not truly played) courier jobs and assumes a shared starting workshop with zero equipment CAPEX. Without that extra job or another funded source, the first sale may be unreachable.

### 5. Architecture and game governance
Need contract types:
- **FirstSaleEntitlement**(CharacterId, RegionId, oneTime, grantedAt, state, offerExpiry).
- **CityPurchaseOrder**(orderId, item=RESOURCE.PAPER_SHEET, qty=6, unitPricePAPER=3, cityBudgetLedgerRef, receivingHubId, committedReceiptCapacity, expiry, priority).
- **ReserveTransfer** monetary CITY.available→CITY.offer_hold→CITY.in_transit_escrow→PLAYER.wallet, 18 PAPER; track CITY receipts/purchases without treating manufacturing as mint.
- **CargoManifest** ItemStack id and qty, sellerOwnerRef, custodianRef, pickup proof, delivery proof, no free teleportation.
- **CityBeginnerHub** finite physical stock, processing or end-user recipe with real registered use, capacity, maintenance, content limits and time.
- **JobAssignment** for true extra30 PAPER courier task, action proof and exactly-once payout; not stopwatch salary.
All operations idempotent and server-authoritative. Round05 single process does not prove real SQL atomicity or concurrency.

### 6. Impact on 27 chapters
Direct contract changes required: ECONOMY, RESOURCE, WATER, FARM, PRODUCTION, TIME, WORK, MARKET, TRANSPORT, QUEST, AUTOMATION, BUILD, LAND, SOCIAL, TECH, GOVERNANCE, RELEASE, GAMEPLAY.
For WORLD, NPC, CHARACTER, VISUAL, UNITS, COMBAT, SURVIVAL, MONETIZATION and DECISIONS: the proposed offer references their boundaries, but does not claim implementation or art assets; those chapters remain individually under review.
Do not replace existing 27 long-form chapters with a 27-line checklist; need owners/status, per-domain schemas, events, acceptance, full-source citations and approved alternatives.

### 7. Round05 decision recommendation
RECOMMENDED TO REVIEW, not approved:
1. Keep money PAPER separate from stock PAPER_SHEET and HEMP_FIBER separate from FLAX_FIBER.
2. Provide a physically fulfilled small first sale through a municipally funded, finite, one-time contract; do NOT promise it unless city money and warehouse intake are reserved.
3. Provide a real extra paid job or legal alternate starter path before first production, and price/ownership of municipal starter workbench.
4. Ensure public buyer demand has a believable physical use or warehouse disposition, explicit city expenses, player market alternative and measured inflation.
5. Track actual novice experience targets; median15h15 is not good proof of enjoyable onboarding.
6. Obtain user acceptance on choices and numerics, then write 27 reconciled domain specs. No GAMEPLAY engine selection until SVG character-first gate.
