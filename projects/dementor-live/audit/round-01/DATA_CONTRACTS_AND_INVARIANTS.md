# DEMENTOR LIVE — DATA CONTRACTS, UNITS AND INVARIANTS / AUDIT CANDIDATE
Version GA-01 / 2026-10-17. Статус: PROPOSED DESIGN CONTRACTS, not approved and not implementation.
Цель — закрыть семантические коллизии до утверждения GDD v0.2 и начала coding.

## 1. Единая терминология
- World Unit (WU): координата и расстояние, пока физический масштаб не определён.
- Build Cell (BC): дискретный footprint размещения; WU_per_BC = OPEN.
- World Tile: покрытие мира, геометрически не обязательно BC.
- Screen Pixel: presentation-only, не серверная collision geometry.
- Time REAL_TIME UTC: production, plants, work contracts, water; WORLD_TIME: visual daypart, NPC schedules; ACTIVE_TIME: подтверждённая активность, не способ начислить ресурсы.
- PAPER: единица денежной книги — PROPOSED, нельзя производить через рецепты как обычный Item.
- PAPER_SHEET: материальный SKU — PROPOSED.
- CARDBOARD: материальный SKU.
- WATER: материальная субстанция с объёмом, зарезервирована и потреблена отдельно; от города/источника учтён intake.
- WOOD, WOOD_PULP, HEMP, FLAX: физические типы Item в RESOURCE.
- PLANT_FIBER: DEPRECATED CANDIDATE до решения CC-028. Предлагаются HEMP_FIBER/FLAX_FIBER; НЕ утверждено.

## 2. Единый реестр владения
PLAYER: AccountId → CharacterId (first MVP one player hero TEST).
WORLD: ParcelId: region/district + geometry WU/BC + public_route graph links.
LAND: owner_ref, zoning, public access boundary, dynamic permission query.
BUILD: BuildingInstanceId + ParcelId + footprint + construction state + installedCapabilities + input/output container references; не хранит копию material quantity.
RESOURCE: ContainerId + ItemId + quantity INT + reserved_qty INT + owner/holder + ledger.
ECONOMY: WalletId + currency PAPER + available/held balance + strict signed ledger.
TRANSPORT: VehicleId + cargo ContainerId + driver/custodian_ref; не хранит независимую копию количества.
MARKET: TradeAgreementId → seller/buyer + item reserve + escrow payment + transfer settlement reference.
WORK: JobAssignmentId → objective proof + conditional reward claim, no independent balance.
TIME: EventId + timestampUTC + stable event priority/sequence + applied revision + last_processed boundary.
SOCIAL: AccessGrantId for user, object, action, expiry; friendship not a property permission.

## 3. Конструкции и статусы не должны противоречить
LAND TerritoryState: UNEXPLORED, DISCOVERED, HOSTILE, CLEARED, SURVEYED, AVAILABLE (as map progression, SUBJECT TO APPROVAL); отдельно OwnershipState: NONE, RESERVED, OWNED; отдельно DevelopmentState: UNDEVELOPED, BUILDING, DEVELOPED; отдельно MarketAvailability: NOT_FOR_SALE, CITY_AVAILABLE, LISTED. Избежать ONE enum where OWNED mutually exclusive with DEVELOPED.
BUILD ConstructionState: PLANNED / BUILDING / COMPLETE / PAUSED, trade/public access separately.
PRODUCTION: IDLE / WAITING_INPUT / WAITING_WATER / WAITING_STORAGE / RESERVED / RUNNING / COMPLETED / PAUSED / CANCELLED; phases and stage output/commit explicit.
MARKET: OFFERED / FUNDED / READY_FOR_PICKUP / IN_TRANSIT / DELIVERED / SETTLED / REFUND_PENDING / CANCELLED / DISPUTED; owner/custodian fields distinct, not all simultaneous states.
WORK: JobOffer available vs JobAssignment accepted/in_progress/objective_complete/completed; payment is ECONOMY transaction, not duplicated in assignment.
COMBAT: Encounter temporary instance can be completed many times, WorldTerritory first liberation recorded at most once.

## 4. Уравнения, которые должны выполняться
MONEY: ΣPAPER_wallet_end=ΣPAPER_wallet_start+issued−burned. Перевод между wallet и escrow не меняет сумму. Каждая эмиссия имеет отдельный документ и право.
RESOURCES: available_qty >=0, reserved_qty>=0, total_stock=available+reserved+inTransit references (not copied extra stock); преобразование item ids допускает recipe-defined mass conversion, все списания и выпуск доказаны.
WATER: 0 <= stored_ml <= capacity_ml; water intake — recorded event, consumption — recorded event, no double-debit. Для точности rate 30 L/h=500 ml/min, 120 L/h=2000 ml/min; внутренние мл целыми, UI отображает литры. Это PROPOSED, не меняет ранее выбранные whole-liters UI.
TIME: event applied once; processed_until monotonic, replay of identical log yields same final state; WORLD_TIME never accelerates REAL_TIME resource tasks.
LAND: one exclusive owner per ParcelId in MVP; allowed PublicRoute always navigable; private entry only by grant except explicit public storefront.
TRADE: money settlement to seller XOR refund to buyer for same reserved payment; package custody transfer must be atomic/compensated. Buyer cannot receive same ItemId quantity twice.
AUTOMATION: no action without permission, actual source stock and output capacity.
CHARACTER: fixed approved reference remains source-of-truth visual, cosmetic geometry/hats never change hitbox; across all 8 views same ground anchor; editable SVG source must exist.

## 5. Atomic transaction templates (proposal)
Land purchase: lock ParcelId + WalletId; check available/title/price → reserve debit → change owner → create ledger entries → commit once → publish. Retry must return previous result by request_id.
Marketplace remote order: reserve Seller items in SOURCE container, reserve Buyer money in ECONOMY; upon courier acceptance custodian changes but title transfer policy must be explicitly approved. Delivery finalizes buyer ContainerId and money seller+courier; cancellation releases goods/money exactly once per agreement, without partial duplicate settlements.
Production stage: lock InputContainer+OutputCapacity+WaterNode; validate recipe and origin; reserve → consume stage inputs/water → finish with item output in reserved destination; keep idempotency key per stage. Failure recovery specifies committed stage vs cancelled.
Water flow: node graph ownership + capacity + available volume, debit source/reservoir and credit destination in one transaction; no duplication if pipe graph recalculated.
Timed replay: process committed events chronologically by (scheduled_at, priority, sequence, event_id) and persist cursor with all resource changes, not independent per-building multipliers.

## 6. Тесты на преступления против консистентности
- 2 users buy same plot at same millisecond → precisely one buyer; loser untouched wallet.
- 2 factories take last 8 fibers → one recipe succeeds; the other waits.
- 2 consumers request 10L tank each, tank10L → total consumed <=10L.
- Buyer cancels during courier disconnect/late delivery → one final settlement or safe refund, not both.
- Server restarts between debit and credit → atomic finish or rollback/recovery.
- Offline replay 24h equals online event-replayed 24h for same actions/input/rules.
- Social friend removed during work contract → no cross-permission escalation or vanishing money.
- 8-direction art with asymmetric accessory keeps handedness and anchor in every view.
- Blocked account cannot write another user's parcel, wallet, inventory or grant via client anon endpoint.

## 7. Что требуется для APPROVED
User decisions on currency identity, fiber provenance, precise WU/BC, 8-view runtime output vs four-source authoring, monetary source, escrow transfer conditions, offline event tie ordering. Then implement machine schemas with migrations, assertion tests and visual snapshots. Until then document only.
