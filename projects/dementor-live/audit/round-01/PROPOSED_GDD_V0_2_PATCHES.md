# DEMENTOR LIVE — PROPOSED RECONCILIATION PATCHES FOR GDD v0.2
2026-10-17 | From Global Audit GA-01 | Status: PROPOSED, USER APPROVAL REQUIRED, not edits to approved canonical v0.1.
Note: These are proposed targeted patches to owning chapters, not silent migration.

## PATCH-01 / ECONOMY-01 + RESOURCE-01 — Paper as money vs material
PROPOSED: MONEY.PAPER = integer server ledger, physical RESOURCE.PAPER_SHEET and RESOURCE.CARDBOARD. The world may call currency PAPER, but crafting Paper Sheet does not mint currency. Optional lore: treasury issues certified PAPER claim distinct from ordinary sheet.
Trade settlement in PAPER transfers balances; physical sheets only change owner through RESOURCE. Mint/burn must specify City Treasury funding and authority.
Alternatives: fully commodity-backed physical bills with mint facility + redemption; higher complexity, not recommended for MVP.
Approval: choose monetary identity and issuance rule. Tests: 40 repeated paper recipes never alter total money; city buying 40 sheets does transfer money from finite treasury.

## PATCH-02 / RESOURCE-01 + PRODUCTION-01 — Fiber identity
PROPOSED: remove generic PLANT_FIBER from paper recipe validation, use HEMP_FIBER and FLAX_FIBER. 3 HEMP→6 HEMP_FIBER; 6 HEMP_FIBER+8L→6 PAPER_SHEET. 4 FLAX→8 FLAX_FIBER; 8 FLAX_FIBER+6L→8 PAPER_SHEET.
If intended generic FIBER, must instead adopt same sheet recipe for either origin. Do not keep current mixed rules unchanged.
Approval: choose origin-specific vs common input. Tests: HEMP cannot invoke FLAX recipe without explicitly designed transformation.

## PATCH-03 / QUEST-01 + BUILD-01 + ECONOMY-01 — First home affordability
Observed 80+4×90−360−60=20 PAPER, materials if bought38: deficit18, excluding seed/water.
RECOMMENDED: first BUILD lesson awards 6 WOOD + 4 PAPER_SHEET once from a finite recorded city tutorial container, not new money; material award occurs when prerequisites met and shows in resource ledger. Alternatively more paid work/price rebalance.
Do not assign another +18 bonus secretly or treat a free city material award as a player-money transfer.
Approval: confirm exact onboarding route including cost of first water/seeds. Test: first-house completion with 0 unpaid invisible resource spawns; reject claim duplicate across reconnect.

## PATCH-04 / ECONOMY-01 + MARKET-01 + WORK-01 — City solvency
RECOMMENDED: separate CITY_TREASURY accounts: reserve for starter grants/jobs, city inventory for fixed essential goods, city purchases according to finite demand/budget; issue/mint actions logged separately if chosen. Config max orders and regeneration schedule in REAL_TIME.
City buying wood at2 and selling at3 PAPER is a spread, paper buys at3, sells at5. Endless goods and endless budget cannot coexist with no emission rules.
Stress: 20 newcomers need initial 1600 + tutorial payouts 7200 PAPER; 100 newcomers initial8000 + tutorial payouts36000, unless existing balances/transaction recirculation explicitly defined. Can recycle treasury receipts after city land sales, but initial liquidity is still required before first land purchases.
Approval: define money source, city initial reserve, bounded demand, market and onboarding guarantee. Tests: 30d treasury ledger no unexplained issuance/negative city, profitable round-trip documented and bounded.

## PATCH-05 / WATER-01 + ECONOMY-01 — Water denomination
RECOMMENDED: wallet PAPER integer, city water sold in minimum 10L packs at 2 PAPER, and internal transport as integer millilitres for deterministic 30L/h (500ml/min) and 120L/h (2000ml/min) rates. If a 36L requirement leads to 40L purchase, preserve 4L in tank, do not treat it as consumed.
Alternatives: per-litre tariff 1/5 PAPER in subunits and wallet centimes; more complex.
Approval: tariff rounding and fractional flow precision. Tests: no negative water, simultaneous requests exclusive, demand spikes bounded by available tank.

## PATCH-06 / TIME-01 + AUTOMATION-01 — Offline concurrency/replay
RECOMMENDED: one sequenced server event ledger, explicit resource locks/reservations, event idempotency key, processed_until per process, timestamp+priority+sequence stable ordering. Emit new events only once. Online and offline use same event engine, allowing consistent result.
Separate crop timers (progress) from water debits (WATER) and recipe stages (PRODUCTION). No offline double-count.
Approval: tie-breaking and pause policy. Tests: 40L tank shared between 4 growing hemp and workshop, reconnect and server restart at each stage, online/offline parity.

## PATCH-07 / LAND-01 + UNITS-01 + MARKET-01 — States/access/area
RECOMMENDED: separate territory_state, ownership_state, development_state, market_availability; a 12×12 plot check must include public paths, gates, interactions and physical footprints, not only sum of object areas.
Storefront accessible via street-facing terminal OR explicitly permitted public shop zone. It never opens private residence or storage.
Approval: authoritative WU/Build Cell scale, camera test and public shop policy. Tests: 2 simultaneous buyers, guest forbidden harvest, all public routes navigable.

## PATCH-08 / CHARACTER-01 + VISUAL-01 + RELEASE-01 — One character before runtime
CONFIRMED SOURCE: accepted visual reference with 4 cast NPC, 2D high 3/4. Source Direction Draft v0.1 uses four orthographic views; actual runtime target after Style Lock v0.2 is 8 directions at ONE camera angle. Sprite Registry v0.3 defines single FRONT_RIGHT PNG per hero and corrections 2.15 board scale→2.0; anchor(128,285) @256×320.
RECOMMENDED: first SHMYG canonical source SVG, identity/pivots/parts, 8 consistent views and at least Idle/Walk/Talk/Interact, QA under accepted style. Freeze engine selection until character gate passes. Incomplete SVG boards not production-APPROVED.
Approval: exact camera tilt, one hero identity proportions and rig. Tests: matched attachments/handedness and ground anchor across 8 views at 32/48/64/128px.

## PATCH-09 / TRANSPORT-01 + MARKET-01 + RESOURCE-01 — Cargo and escrow
RECOMMENDED: separate sold ITEM title, cargo physical ContainerId, handler/custodian, seller, recipient and payment escrow. Define timing of transfer; until accepted by buyer, buyer's money remains escrow, except explicit dispute protocol. Sale and delivery must have exactly-once terminal outcomes.
Approval: cancellation/dispute and owner-transfer timing. Tests: courier disconnect, buyer/ seller cancellation mid-route, duplicate completion, refund after settle forbidden.

## PATCH-10 / COMBAT-01 + WORLD-01 — Instance and permanent land
RECOMMENDED: EXPEDITION_INSTANCE temporary, TERRITORY_STATE persistent; first completed expedition marks CLEARED once, and land never auto-becomes privately owned. Replay gives mission rewards by separate guarded rules.
Approval: criteria for collective liberation. Tests: two teams simultaneously finish, one world unlock and no extra plots.

## PATCH-11 / GAMEPLAY-01 + ECONOMY-01 — Comparative profitability
RECOMMENDED: balance to equal opportunity-cost units PAPER/hour active and PAPER/day semi-automatic, accounting for real labor, energy/water, tooling CAPEX, downtime, transport, actual demand. A 4-position HEMP farm upper-bound 768 sheets/24h at constant full automation implies possible city buy pressure 2304 PAPER/day, not guaranteed profit. Set exchange caps and consider interactive earning balance.
Approval: progression targets and viable city budgets. Tests: 1/20/100 player 30-day stress with finite city supply and sales.

## PATCH-12 / SOCIAL-01 + RELEASE-01 — Public-ready safety
RECOMMENDED: decide target age range before open chat and cosmetic payments, adopt blocking/reporting, anti-spam, privacy controls and retention policy. Approval cannot be inferred from generic moderation plan.
Tests: blocked DM, forced invite, public/private access, permission revocation and contract/escrow preservation.

## Decision pack for user review
Priority 1: Currency model, fiber model, onboarding material gap.
Priority 2: Character camera and 8-direction production gate; world spatial scale.
Priority 3: Treasury solvency + water denomination + deterministic replay.
Priority 4: world/land/shop and escrow state machines; PvE unlocking.
Priority 5: public moderation and monetization.
Each patch requires explicit acceptance + owning-chapter update + test evidence. This file does not mark any change approved.
