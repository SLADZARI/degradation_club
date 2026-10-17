# DEMENTOR LIVE — MARKET-01 / CITY BUY ORDER CONTRACT v0.2 CANDIDATE
2026-10-17 | DESIGN PROPOSAL (not APPROVED), derived from GA-02 CC-042. No actual market server exists in tested sample.

## Why
Finite city demand must be both a public offer and a reserved commitment. Without reservation, 20/100-player demand races let couriers pay before finding buyers; fixed tie-break scheduling biases individual sellers. At 30d/64 sheets-city/day HEMP base city finite:
20 farms: 13 never sold any PAPER_SHEET, max individual sales808;
100 farms: 64 never sold, max individual sales168.
In proposed booked+rotating SYNTHETIC variant:
20 farms: 8 never sold, max individual sales192;
100 farms: 30 never sold, max individual sales56.
Aggregate city sales are1920 sheets/30d in both variants because effective city demand cap remains64/day. Fairness improves, scarcity remains.

## Identity and authority
CityPurchaseOrder: orderId, itemId, grade, totalQty, remainingQty, maxUnitPricePAPER, cityWalletId, receivingWarehouseId, settlementRules, activeRealTimeWindow, serviceArea.
PurchaseReservation: reservationId, orderId, sellerId, itemHoldId, cityMoneyEscrowId, reservedQty, currencyAmount, receivingCapacityHoldId, courierContractId, expiresAt, state, revision.
RESOURCE owns physical items and item ownership/custody; MARKET owns order, matching and commercial conditions; ECONOMY owns cash and escrow balance; TRANSPORT owns courier custody and shipment; TIME owns expiry. Market frontend cannot mint money or move physical stock directly.

## Order states
DRAFT → OPEN → PARTIALLY_RESERVED → FULLY_RESERVED → FILLED / EXPIRED / CANCELLED. Reservation state: PROPOSED → RESERVED → PICKUP_CONFIRMED → IN_TRANSIT → DELIVERED → SETTLED.
Failure: RESERVED/IN_TRANSIT → DISPUTE/RETURNING → REFUNDED or SETTLED. Only one terminal payout status, never both.
Quote/Price: stable price/PAPER and quantity/units for time-scoped reservation; no price changes after both sides accept.

## Atomic reserve
1. Server validates order and expiry, item type and stock; checks seller's item availability and physical dispatch eligibility.
2. Lock city purchase order remaining, cityWallet spendable PAPER, city receiving storage capacity and seller input ContainerId.
3. Reserve qty (min seller stock, order remaining, treasury/price and capacity), transfer CITY funds to escrow, reserve seller items and warehouse slots.
4. Persist reservation revision + transaction_id exactly once; return quote and delivery instructions to clients.
5. Initiate courier order only AFTER successful reservation.
6. On delivery proof, consume seller item hold and move item to city Warehouse, release capacity hold, settle escrow to seller and courier compensation by separate funded job. All committed once, journal idempotently.
7. If shipment cannot be completed: preserve physical cargo, enter RETURN/DISPUTE; escrow not released twice.

## Fairness choices (must be explicitly selected)
OPTION A: strictly FIFO per order, priority by confirmed request time; vulnerable to player automation and fast monopolization.
OPTION B: round-robin between eligible sellers across accepted first orders in a time window; better inclusion, can starve large producers.
OPTION C: auction/price priority; realistic but risks oligopoly and serious economy complexity.
Recommendation PROPOSED B for base city procurement, market player-to-player free prices as separate module; anti-abuse identities and per-seller fair quotas need design. Only demonstrated in toy sequence, fairness guarantee NOT formally proved.

## Constraints, currency and delivery
- City treasury can spend only owned funds, not reserved funds.
- City buyer demand and receiving storage finite, reset on REAL_TIME city budget cadence once/day.
- Source paper produced remains PAPER_SHEET; PAPER is MONEY only if proposed split becomes APPROVED.
- Confirmation of purchase order is not an item teleport; physical cargo must move via courier/defined municipal pickup.
- Dispatch has explicit courier fee. A seller must not pay shipping for a buyer reservation that never existed.
- Delivery timeout cannot silently burn buyer funds or seller goods. Track reserved stock/escrow until settled/refunded.
- A seller cannot accept their own listing via city without supply proof and quotas.

## Acceptance suite (to implement on real runtime)
BUY-001: Two sellers reserve last32 city demand; only one claim commits, other stays unspent.
BUY-002: City's PAPER lower than order price => reservation rejected, no courier charge.
BUY-003: Destination warehouse full => no reservation (or justified partial qty).
BUY-004: Two couriers attempt pickup same package => one custodian.
BUY-005: Restart between reserve and pickup => escrow and item hold persist.
BUY-006: 32-sheet shipment after day boundary => previous reservation and funding remain valid until expiry.
BUY-007: Duplicate receipt => PAPER credited once; source item deleted once; receiving item created once.
BUY-008: Cancellation vs settlement race => exclusive terminal result, no double transfer.
BUY-009: 100 equal suppliers/finite cap => use measurable fairness (zero-sale ratio, min/max fill, time-to-first-order).
BUY-010: City buy quote expires => safely restore funds and physical hold, no hidden sale.
BUY-011: Seller offline / courier offline => resumable custody without loss.
BUY-012: No title rights => seller cannot reserve someone else's warehouse stock.

## Status
Existing GA-02 v0.3 prototype does a simplified money/space reservation at courier dispatch, deferred payment at arrival, round-robin opportunity. It doesn't implement actual SQL locks, cancellation, professional courier compensation, deadline policy, RLS or real-world fairness. Keep CC-042 OPEN until complete user approval and real integration testing.
