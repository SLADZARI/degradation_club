# DEMENTOR LIVE — SOCIAL-01 / Базовые взаимодействия между игроками
Версия: v0.1 CANDIDATE · 2026-10-17
Статус: DESIGN CONTRACT / для первого играбельного FIRST HOME LOOP, НЕ внедрено в исполняемый прототип.
Источники: CORE_AND_FIRST_LEVEL_v0.1.md (основной согласованный документ), явные решения пользователя в диалоге 17 октября о расчистке участка, семенах, мини-огороде, продаже/обмене/разрешении собирать урожай, городской Доске воров. Все дополнительные точные правила ниже — PROPOSED, пока не утверждены.
Цель: единая система взаимодействий в общем мире, без игровых телепортов материалов или денег и с достоверным правом собственности.

## 0. User-decided principles (preserve)
- Свой участок — отдельная сцена от общей карты; палатка/дом — отдельный интерьер, состояние мира и инвентари общие.
- Игрок может общаться и взаимодействовать с другими через обмен, продажу, разрешение собирать урожай с огорода и совместную работу.
- Игрок может взять овощи с чужого огорода без разрешения; сразу после успешной кражи он появляется на отдельной городской «Доске воров».
- Доступ на частный участок регулируется владельцем (канонический CORE); разрешение войти и разрешение собрать урожай — разные вещи.
- Любой игрок может одновременно быть владельцем и исполнителем собственной деятельности; кооперация и найм развиваются со временем.

## 1. Единое действие с объектом
Every request is a server-authoritative ActionEnvelope:
action_id (unique/idempotency), actor_player_id, target_player_id?, target_object_id, source_scene_id,
timestamp_real_utc, action_type, asset_id?, batch_id?, qty?, currency_amount?, permit_id?, expected_object_revision.
Server checks: actor present/eligible, accessible scene, geometric reach, stock remains unreserved, role and permission,
item state/growth stage, cash, inventory storage and cargo capacity, TTL and version; then updates ledger, location, ownership, event log and board **atomically**.
No client-only grants or resource duplication. Backend transport semantics/protocol still OPEN, not a claim of implementation.

## 2. Первый этап: матрица взаимодействий (PROPOSED contract)
| Действие | Где / при каком условии | Согласие | Результат | Публичность |
| --- | --- | --- | --- | --- |
| Разговор/осмотр | Игроки в одной сцене и в радиусе взаимодействия | необязательно для осмотра | социальная активность без transfer | нет записи на доске |
| Передать вещь / подарок | оба в одной доступной сцене и близко; вещь у дарителя | получатель принимает | предмет целиком/часть переходит к получателю | приватное событие инвентарей |
| Обмен | оба рядом, оба предлагают доступные вещи | обе стороны подтверждают финальные условия | одна атомарная двусторонняя сделка | приватное событие обоих |
| Продать вещь игроку | оба рядом; цена определена и у покупателя хватает PAPER | обе стороны подтверждают | предмет продавец→покупатель, PAPER покупатель→продавец за 1 атомарную операцию | приватное событие обоих |
| Войти на частный участок | участок общедоступен или персонаж приглашён/имеет пропуск; владелец может быть offline | сохранённое разрешение/публичный режим | переход CITY→PLOT | факт посещения может быть виден владельцу |
| Войти в чужую палатку | отдельное разрешение на интерьер | пропуск/приглашение | PLOT→INTERIOR | событие доступа |
| Ухаживать за чужими грядками | владелец выдал HELP_GARDEN | предварительное разрешение | разрешённые полив/работы, урожай остаётся у владельца | журнал действий участка |
| Собрать чужой урожай и ОСТАВИТЬ ВЛАДЕЛЬЦУ | владелец разрешил HARVEST_FOR_OWNER | предварительное разрешение | ресурс на участке/складе владельца, помощник его не присваивает | журнал действий участка |
| Собрать и ЗАБРАТЬ чужой урожай | владелец выдал TAKE_HARVEST, растение созрело, лимит действителен | предварительное разрешение | урожай → забравшему, без кражи | журнал участка |
| Собрать и ЗАБРАТЬ без разрешения | игрок физически достиг грядки в сцене, урожай созрел, нет TAKE_HARVEST | нет согласия; это намеренная кража | ресурс меняет владельца; одновременно запись THEFT_COMMITTED и появление на Доске воров | Доска воров + журнал участка |
| Помочь расчистить участок | есть ACCESS_PLOT + HELP_CLEAR и доступные инструменты | разрешение владельца | конечный объект расчищается один раз; материалы по условиям задания | журнал участка |
| Выполнить частный заказ | заказ создан владельцем, оплата зарезервирована, результат принят | согласованный контракт | работа + акцепт + PAPER из escrow, без автоматической зарплаты за время | заказ и проводка |
| Работа на городском проекте | одобренное поручение, ресурсы/работы реально сданы | системный городской заказ, обеспеченный средствами | оплата и изменение объекта города | публичный прогресс проекта |

Первый MVP не требует аукциона, удалённого рынка, онлайн-подписи в смартфоне, почтовой доставки, аренды, кредита или сложных корпоративных прав.

## 3. Permission Model
Сцены: WORLD_CITY, PRIVATE_PLOT, PRIVATE_INTERIOR. Вход в PRIVATE_PLOT не даёт доступ в PRIVATE_INTERIOR, а доступ к интерьеру не даёт право брать вещи в сундуках.
Actions/scopes:
- ENTER_PLOT — только вход;
- ENTER_INTERIOR — отдельное посещение интерьера;
- HELP_CLEAR — расчистить указанные клетки/объекты, базовое владение добычей остаётся у владельца участка (PROPOSED default);
- HELP_GARDEN — полив и уход за указанными грядками;
- HARVEST_FOR_OWNER — сбор с зачислением владельцу урожая;
- TAKE_HARVEST — сбор с присвоением себе только разрешённых урожаев;
- ACCESS_CHEST — отдельный будущий доступ к сундуку, НЕ implied by visit/harvest permissions.
Permit: permit_id, grantor_owner_id, grantee_player_id or public_mode, plot_id,
scopes[], target_plot_cell_ids/crop_ids (optional), max_qty (optional), used_qty,
valid_from_utc, expires_at_utc, revoked_at_utc, revision.
Default private plot: no ENTER_PLOT without explicit access; owner can enable 'open visitors' but harvest remains forbidden unless separately allowed.
Changing access/permit doesn't retroactively legalize/illegalize past committed events. Revocation blocks future actions, even if visitor is still physically present. No permission to move across a blocked gate just because harvesting is mechanically possible.
A contract to clear/harvest may include its own explicit payout or share of material, not implicit ownership of all output.

## 4. Trade atomicity & lifecycle
Offer: DRAFT → PROPOSED → BOTH_CONFIRMED → COMMITTED; or DECLINED / CANCELLED / EXPIRED.
Offer has offer_id, 2 player_ids, source batch+qty, requested batch+qty or currency PAPER, expiry, revised version.
When an offer is accepted, reserve all legs (items, currency, receiving capacity) and commit simultaneously. One party revising terms clears previous acceptance. Cancel/timeout releases reservations, creates no trade. Inventory updates follow physical transfer (both in same scene within reach), not an invisible remote account deposit.
Recipient offline → no live barter/instant sale; only persistent permits can be honored offline. Later, market stall/contract could enable unattended sale under separate funded rules.
Cannot sell harvest still attached to crop as already held stock; field pickup or pre-contract should be separate.
All PAPER transfers reconcile ledger; fees or taxation are future proposals, no automatic mint/burn.
Trader can be company owner/operator later, but MVP deals only with player legal game inventories.

## 5. THEFT-01 / Доска воров
The theft event is the **successful unauthorized taking of a mature crop from another player's garden**; reaching the garden presumes valid scene access under current plot rules. The system does not silently auto-create a break-in/forced entry mechanic.
At commit:
(1) mature crop available and reachable; (2) actor != owning player; (3) no currently valid TAKE_HARVEST for actor,target,qty; (4) qty removed once from plant/harvest stock; (5) crop transferred to actor; (6) immutable event THEFT_COMMITTED linked to action_id, crop/batch/qty, victim and actor; (7) public board entry appears immediately and once.
MVP board public display: game avatar/name, which crop and qty, victim game name, timestamp (game or real time labeling explicit), record status. No real-world personal info. Viewable on city board without victim needing to be online. Owner receives notice upon next visit/login (PROPOSED).
Attempt without available harvest → no theft, no board entry. Authorized harvest → no theft. Taking another player's food as a fully consensual trade/gift → no theft. Permission revoked before commit → unauthorised harvest becomes theft; permission granted later doesn't delete a historical record.
On retry/race of two thieves harvesting same batch, one succeeds; the other sees empty crop without phantom second theft.
Reputation points, fines, jail, duration/expungement/dispute process OPEN — not implicitly automatic, no platform account ban. Moderation abuse policy separate from in-game crime.

## 6. Scenes and when actions are possible
CITY: common jobs, meeting players, player-to-player transfer/trade, inspect thief board, buy plots.
PLOT: clear, forage, harvest, plant; player trade while physically together; permission management by owner remotely via UI (PROPOSED), guests must have entry.
INTERIOR: place/take items from own containers, sleep/rest, exchange gifts if guests have interior entry, but 'enter interior' does not mean chest access.
Action entry popup on player: talk, give, offer exchange, sell, request help; on plot object: view owner, ask permission, collect allowed crop, steal crop if mature and accessible. Actor should understand unauthorised harvesting → board (clear in-game feedback, NOT an accidental penalty). For a single click on own garden, just harvest.
MVP physical reach testing: both in same scene and Manhattan distance at most 1-2 cells (test configurable), not remote teleport.

## 7. Game metrics & economics
Per player: available cash, value and quantities of physical inventory, number/completion of city jobs, amount from clearing, traded/sold/gifted/stolen items, time spent, land cleared, bed cells cultivated, plot invitations, authorized harvests, thefts.
World Organism graph nodes to add: PLAYER_A/B/C, PLOT_A/B/C, VISITOR_PERMISSION, GARDEN_CROPS, OFFER_ESCROW, P2P_TRADE, THEFT_BOARD, CITY_PUBLIC_PROJECT (some are visual views of same underlying ledger, do not duplicate physical assets).
Compare 3 player scenarios: independent homesteading, specialization with P2P trade, help/permissions; theft with/without permits; city project payouts only funded and actually completed. Differentiate player's intent percentages from successful work/blocked time; events must timestamp and quantify.
Caution: theft does not generate PAPER, only redistributes goods, and may increase trust/reputation risk.

## 8. Acceptance tests (PROPOSED, NOT EXECUTED)
SOC-001 trade 3 WOOD for 2 STONE between nearby players: single commit, zero double consumption.
SOC-002 PAPER purchase 5 SEED_CARROT; seller +, buyer -, inventory transfer exactly once.
SOC-003 one-sided accept/revised terms: no partial money/item loss; requires re-confirmation.
SOC-004 offline buyer: cannot complete direct live deal, stock remains with owner.
SOC-005 two players racing same limited quantity: at most 1 completion/remaining actual stock.
SOC-006 user enters open plot; harvest forbidden; unauthorized mature carrot pickup succeeds + appears once on board.
SOC-007 authorized TAKE_HARVEST ×3 carrots: transfer 3, no board entry, fourth unauthorized carrot triggers single theft event.
SOC-008 HELP_GARDEN or HARVEST_FOR_OWNER does not allow KEEP; produce remains with farmer.
SOC-009 ENTER_PLOT does not authorize ENTER_INTERIOR or ACCESS_CHEST.
SOC-010 revoked permit before action prevents authorized pickup; after-action revoke doesn't reclassify earlier act.
SOC-011 crop not ripe/empty/blocked gate: no successful theft and no board row.
SOC-012 two simultaneous harvests, same cell: stock and board exactly once.
SOC-013 event replay/restores board and balances identically, preserves idempotency.
SOC-014 HELP_CLEAR removes vegetation exactly once; seed, WOOD, STONE sources finite with recorded destination/owner; separate fee settlement.
SOC-015 city payout only after accepted city project activity with reserved funds, not due to minutes elapsing.
SOC-016 first home loop: city job → plot purchase → clear → pitch tent → interior chest/bed → prepare mini garden → sow/water/harvest → neighboring exchange.
SOC-017 owner offline and public plot: granted TAKE_HARVEST remains valid, stolen taking without it posts board immediately.
SOC-018 when plant produces a perishable crop, freshness history/batch ID persists across gift, sale, theft and fridge storage; cannot reset expiry.

## 9. Deferred
Market shop/stall and remote asynchronous offers, house interiors mini-constructor, furniture factory, player-run employers, managing business ownership/roles, disputes/sheriff/reputation/sentencing and theft of chests/tools (first theft exclusively garden crop).
Numbers for distances, listing lifetimes, trading fees, public accessibility default and anti-grief limits remain TEST/OPEN until playtest. No social notification/chat moderation verified.
Dependencies: CORE first level; GDD LAND/BUILD/RESOURCE/WORK/SOCIAL/ECONOMY/FARM/MARKET/TIME/TRANSPORT/GOVERNANCE. Keep master GDD unchanged until explicit approval.
