# DEMENTOR LIVE — FOOD-01 / FRESH PRODUCE & STORAGE v0.1 CANDIDATE
Date: 2026-10-17 | Status: REVIEW CANDIDATE. This records newly expressed user decisions; numeric examples are TEST until approved.

## 0. Source and scope
USER INTENT, from latest conversation:
- Include seeds for carrots, pumpkin, watermelon (and allow expanding to other fruits/vegetables). Seeds may be bought or found; additional sources could be harvest/quests, subject to economy balance.
- Food harvest is perishable outside refrigerated storage, measured in REAL elapsed time (24 hours mentioned as example).
- Player house unlocks a refrigerator; while inside refrigerator, produce stays fresh indefinitely as intentional gameplay abstraction.
- Fridge has no hard per-item count cap in the user's concept; every item is physically stacked in layers. Retrieving buried items requires moving top layers and time.
These are articulated design directions from the user, but all consequences/coefficients and recommended extensions below remain PROPOSED/TEST.

## 1. Ownership of data
FOOD-01 owns: product type definition, freshness rules, spoilage transitions.
FARM-01 owns: crop planting, seeds, germination, water demand, yield, harvest event.
RESOURCE-01 owns: unique product batch inventories, quantities, origins, owners, item location.
STORAGE-01 (subsystem candidate in BUILD / RESOURCE) owns: stack/layer order, physical access cost, insertion/removal actions and fridge mode.
BUILD-01 owns: house/fridge placement and access permission.
TIME-01 owns: REAL_TIME UTC elapsed and deterministic offline replay.
MARKET-01 owns: funded demand, prices, quality grade and delivery.
TRANSPORT-01 owns: transit state; perishability resumes when produce leaves fridge.
PRODUCTION-01 owns: recipes using fresh produce, possible later.
AUTOMATION-01 owns: reorder/harvest/sales strategy with no hidden inventory duplication.

## 2. Registry candidates
Minimum scope: SEED_CARROT → CARROT; SEED_PUMPKIN → PUMPKIN; SEED_WATERMELON → WATERMELON.
Additional PROPOSED crops: POTATO, TOMATO, APPLE (apple = tree crop, not 1×1 vegetable seed/field without a dedicated orchard config), plus others through registry.
Each CropDef: crop_id, seed_id, growth REAL minutes/hours, planting footprint, water REAL L, seed consumption, product yield and seed-recovery policy.
Each FoodDef: item_id, outdoor_shelf_life_real_minutes, indoor_shelf_life_real_minutes, quality stages, spoiled_item_id, stacking_rule, volume/weight. Realism-inspired but numbers calibrated for game.
Do not introduce mandatory character hunger: SURVIVAL-01 MVP still says no hunger or thirst treadmill.

## 3. Freshness contract
Products are tracked by harvested batch (BatchId, CropId, quantity, harvested_at_utc, remaining_freshness_seconds, currentStorageId, currentStorageMode, last_accounted_at, qualityState, revision).
In outdoor/open crate/unrefrigerated place, freshness decreases by elapsed REAL seconds × environment rate. Default outdoor example 24 real hours (TEST, not universal); species-specific shelf lives TEST. Never use accelerated WORLD_TIME for decay.
Inside built Refrigerator: spoilage rate exactly 0 (infinite preservation) as gameplay rule. Moving fresh produce out resumes its remaining time, not a new 24h full clock. Already spoiled goods are never revived by refrigeration.
Partial consumption / stack split: new child batch retains remaining freshness from the parent; mixing batches doesn't grant minimum-age reset. Every transfer is idempotent.
State: FRESH → AGING → STALE → SPOILED; avoid exact percentage thresholds before tuning. SPOILED is not marketable as fresh, may become compost through separate recipe if approved.
If the refrigerator is unpowered, we do NOT assume spoilage until an explicit ELECTRICITY design rule is accepted. First prototype fridge acts as preservation area without electricity dependency.

## 4. Refrigerator stacking
Player requested unlimited stackable content with layers. Model as unbounded logical stack list ordered bottom→top; count can grow but not duplicate items. Top object retrievable directly. To retrieve something at depth d (number of layers above it), we must relocate (temporarily or permanently) the d upper layers and restore them as needed; never teleport bottom batch into hand.
Accessibility is a cost, NOT ordinary item expiry:
Retrieval test time t_retrieve = t_base + d × t_move_layer; example TEST base 10 real seconds and move_layer 20 real seconds, depth19 costs390 real seconds (~6m30s). This can be simulated as one queued job, rather than 19 repetitive manual clicks. During physically recorded unloading outside fridge, moved products start expiring again until restowed, subject to exact time and state.
Logical unlimited capacity is user's artistic/systemic premise. Technically the UI renders only the accessible top few layers plus an aggregated depth counter; inventory DB paginated. Anti-DOS/performance safeguard distinct from an in-game hard item cap (open performance limits).
Stack ownership, position and ordering are authoritative. Concurrent users cannot pull buried objects without a lock/reservation; cancellation restores positions and perishable exposure to actual elapsed time.
Potential issue: fridge + zero spoilage + unlimited logical slots can allow infinite long-term hoarding. Balance via refrigerator acquisition CAPEX, labor/access depth and market demand, not by secretly adding a time expiry.

## 5. Economic implications
Harvested food has market window; outside harvest beyond buyers' demand decays. Refrigerator allows arbitrage of timing but has access-time bottleneck, so a visible food economy needs:
- funded Market purchase orders, explicit buyer demand and deadline,
- storage and retrieval labor/time,
- delivered freshness at arrival, especially if shipment spans expiry,
- transportation and timing,
- quality grades, price by age (proposed),
- eventual expired food sink and optional compost return to soil,
- remaining fresh inventory ledger.
Can't declare margins while shelf lives, cost of fridge, wages and quality pricing are unapproved.

## 6. Visual World Organism v0.3 requirements
New nodes: SeedBank (seed sources), Orchard/VegetableBeds, FreshHarvestBuffer, OutdoorStorage, HomeRefrigerator, StackLayers, FoodMarketplace, ConsumerOrders, SpoilageCompost.
New directed flows: seed → plant → harvest → ambient food; ambient → fridge / transport / spoilage; fridge→rehandle→market; spoiled→compost→soil/crops (last loop optional).
Visual channels: fresh produce orange/green, danger red, cold storage cyan, time/age violet, money yellow; every flow label Δ quantity, Σ cumulative, and (for food) ETA before spoilage.
Each inventory shows freshness bar and deadline, storage mode, top/buried accessibility, queue minutes, warning hotspots.
Actions: scenario warm outdoors24h, fridge indefinite + retrieval stack depth, courier delivery delay and spoilage, market demand collapse, mixed old/new harvest split/merge, online/offline replay.
All food expiry is measured in REAL_TIME. WALL/CLOCK time not derived from dashboard zoom or accelerated WORLD_TIME.

## 7. Verification cases (proposed, NOT RUN)
FD-001 10 CARROT units harvested with 24h TEST outdoors → at24h expire; at23h59 not yet expired.
FD-002 10 CARROT with 4h outdoors then fridge 7 real days still has 20h usable freshness.
FD-003 out of fridge after seven days uses remaining20h, not24h reset.
FD-004 spoiled product put in fridge stays spoiled.
FD-005 split old batch, new batch retains age; cannot reset timer.
FD-006 fridge 1000 layers remain logically stored, paginated visual renderer does not freeze.
FD-007 20 stacked items, bottom retrieval requires relocating19 layers; access time applies and top items remain accounted for.
FD-008 concurrent retrieval of same bottom item only one succeeds, no duplication.
FD-009 cancel retrieval returns products in consistent layer order and accounts for outside-exposure.
FD-010 player has no house/fridge → food outside spoils in REAL_TIME.
FD-011 delivery arrives after expiry => cannot settle a fresh-only buyer order; return/refund/dispute event.
FD-012 moving from fridge to transit resumes decay; server offline replay == online replay.
FD-013 spoiled items turn compost only via explicit conversion, not unlogged raw disappearance.
FD-014 MONEY ledger independent of crop expiry; item destruction must not mint/burn PAPER.
FD-015 no mandatory hunger penalty introduced merely because FOOD-01 exists.

## 8. Proposed next GDD dependency review
Cross-check FOOD/FARM/RESOURCE/BUILD/TIME/MARKET/TRANSPORT/AUTOMATION/SURVIVAL. Missing canonical policy: per-species shelf lives, per-species growth rates, season/weather (not needed MVP), outdoor quality effect, costs of fridge, time per layer, moving exposed goods, spoilage accounting after server downtime, buyer freshness constraints. Do not mark APPROVED before source review.
