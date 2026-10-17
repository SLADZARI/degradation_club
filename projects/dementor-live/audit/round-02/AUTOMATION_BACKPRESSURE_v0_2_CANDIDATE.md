# DEMENTOR LIVE — AUTOMATION BACKPRESSURE / ECONOMY v0.2 CANDIDATE
2026-10-17 | Status PROPOSED, not APPROVED, not game runtime. GA-02 finding CC-041.

## Core problem
A four-plant farm with automatic sow/harvest/paper-making can turn cash (seeds, city water, maintenance, paid courier) into nonliquid PAPER_SHEET when actual buyers are limited. With city quota64 sheets/day, starting wallet500, no stock control, GA-02 test reached wallet0 after 7 real days, 348 made but only192 sold and156 stranded in storage. Automatic processes should obey *available resources, future cost exposure and finite storage*, not simply repeat while available inputs exist.

## Core policy
BACKPRESSURE IS A CONTRACT, not a hidden passive efficiency buff. Player authorizes automation, chooses a selected ProductionPolicy. Default PROPOSED SAFETY: stop starting new discretionary spend when storage over threshold or cash reserve too low. Already committed stages follow explicit stage rollback/recovery (don't erase outputs or refunded materials). Manual player actions have separate rules and safety confirmations.
Proposed policy object:
policy_id: AUTOSOW_SAFETY_TEST_01
enabled: true
reserveCashPAPER:60 (TEST)
maxRawStockBeforePause:24 HEMP / crop units (TEST)
maxFinishedStockBeforePause:96 PAPER_SHEET equivalent physical items including reserved returned cargo (TEST)
stopIfNoFundedBuyerForDays: optional Real Time horizon (OPEN)
seedProcurement: min qty tied to actual current rotation, city SeedShop stock
waterProcurement: only if permitted and demand exists; never fill just for future imaginary production beyond tank capacity
export: require funded purchase-order reservation before charging courier fee (requires MARKET policy)
all config values must be visible and editable within permitted limits; not approved until reviewed.

## Design states
ACTIVE → WAITING_INPUT / WAITING_WATER / WAITING_CAPACITY / WAITING_BUDGET / WAITING_BUYER
Waiting → ACTIVE only if actual resources and policy conditions met.
ON_PAUSE: existing production stage may complete and hold output, or pause only at allowed stage boundary. No player inventory destruction or uncaught reversal.
STOPPED_MANUALLY: user explicit off, no new batches, existing reservations handled by stage rule.
RECOVERY_PENDING: after disconnect/server restart, process exact event replay with own last_processed cursor.

## Owner responsibilities
FARM owns plant and seed lifecycle; PRODUCTION owns recipe and current stage; RESOURCE owns actual stacks/buffers; WATER owns ledger and pump; TIME owns time/event ordering; MARKET owns buyer order and shipment; ECONOMY owns working capital/reserves; AUTOMATION only orchestrates policy, cannot mint item or PAPER.
Machine may predict expected potential sales, but it must never treat a prediction as an actual funded order.

## Comparative synthetic fixture
HEMP, one mature farm, city demand64 PAPER_SHEET per REAL day, starting wallet500, city budget10000 and finite seed+warehouse:
No backpressure: 7d papers made348, sold192, wallet0, held156.
Safety backpressure: 7d made576, sold448, wallet1022, held128.
No backpressure: 30d made348, sold192, wallet0, held156.
Safety backpressure: 30d made2040, sold1920, wallet3256, held120.
Those numeric results are under toy market/delivery assumptions; do not assume real profitability or universal improvement. With 100 competing farms and city cap64/day, even improved backpressure leaves many producers without sales; fair funded orders/limit also required.

## Critical edge cases
AUT-BP-001: Buyer demand falls to zero while 12 HEMP raw pending => no new discretionary seed expense, raw remains.
AUT-BP-002: Finished stock>=threshold => pause sow/replant without deleting existing growing crops; keep already funded production recoverable.
AUT-BP-003: Stored goods sold => resume if cash and water/inputs permitted; no manual reset needed.
AUT-BP-004: Cash < reserve60, but a committed factory stage has maintenance2 due => apply previously reserved stage cost or explicit pause/compensate, never silent negative balance.
AUT-BP-005: Permission revoked => stop only work requiring revoked rights; owner inventory stays safe.
AUT-BP-006: Client disconnected 30d, backpressure causes same final state as online deterministic replay under same external orders.
AUT-BP-007: Two water consumers with same tank, priority conflict => no consumption beyond actual volume.
AUT-BP-008: Courier buyer order cancelled before pickup => no courier charge and safe resource unlock.
AUT-BP-009: Buyer order cancelled in transit => dispute/return state; must not duplicate cargo or buyer cash.
AUT-BP-010: Farm process reached maxRaw but price rises next day => resume after actual buyer reservation, not speculative exchange-rate prediction.
AUT-BP-011: Warehouse capacity includes returned unsold delivery reserve exactly once; don't double-count in-transit cargo in pressure calculation.
AUT-BP-012: Water purchase packs10L at2 PAPER; unused water remains in tank when process pauses.

## Open questions
Policy thresholds and scope: farm vs workshop vs plot, thresholds per material type or equivalence, how to prioritize cash between BUILD and AUTO, liability/fees for return cargo, buyer order validity, whether time-based idle stop produces warnings, which PAUSE settings default to safe mode. Determine via design review and actual playtesting.

## Closure
A concrete AutomationPolicy schema, full state machine, ledger compatible event integration, UI error/restart states, integration tests with shipping/escrow, approval, then IMPLEMENTED and VERIFIED on real server. The toy model is evidence of risk and candidate mitigation, not final canon.
