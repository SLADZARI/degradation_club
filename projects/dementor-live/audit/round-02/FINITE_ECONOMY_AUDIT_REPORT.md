# DEMENTOR LIVE — GLOBAL AUDIT ROUND 02 / FINITE ECONOMY REPORT
Дата 2026-10-17 | GA-02 | STATUS: SIMULATED DESIGN FIXTURES, NOT GAME RUNTIME QA; NO CANON APPROVAL.
Исходная документация: frozen GDD v0.1 + GA-01. Никакие изменения здесь не стирают утверждённый канон.

## 1. Что впервые проверено
Вместо прежнего unlimited-city-buyback upper bound реализована независимая детерминированная minute-step модель с ограниченными: PAPER бюджетом и покупательной способностью города, запасами семян, суточным пополнением магазина, водной линией, 40L баком, входной/выходной буферной машиной, локальным складом 128 sheets, логистикой в партии 32 sheets с 15-минутной доставкой за5 PAPER, city demand 64 sheets/real day.
Игроки конкурируют за общую городскую закупку (не market-maker с бесконечным бюджетом).
Для HEMP и FLAX семена и вода списываются по TEST. Во избежание дефекта CC-028 происхождение fiber хранится как HEMP_FIBER или FLAX_FIBER.
Предположено, что готовая ферма уже оснащена оборудованием, autosow, autoship, autounload (CAPEX и монтаж вне модели). Вода на весь рост списывается при посеве — это упрощение, не полная stage-based WATER-01.
Бюджет/потребление города и закупочные цифры здесь исключительно тестовая политика: CITY initial treasury10000 PAPER, mature farm start wallet500 PAPER (не новый новичок), city seeds64 initial +32/day, seed4 PAPER, city buy paper3/шт, city buy max64 листа/day, budget max300 PAPER/day, city paper storage128, city consumption64/day; city water 10L at2 PAPER with limit one pack/5 REAL min per farm, or river inflow0.5L/min; warehouse128, output32.
Test 24 cases (HEMP/FLAX, n=1/20/100, t=1/7/30 days, 3 river cases + three automation toggles), 8 invariants per case =192/192 PASS; same scenario recomputed twice produces same result.
INVARIANTS: global money transfer-only conservation, water intake/consumption, seed stock/restock/planting, produced sheet identity across seller warehouse/courier/city/consumption, output and warehouse capacity, nonnegative money, daily demand cap and city storage capacity. Эти проверки выполнены только на toy model, а не на actual code.

## 2. Ключевой сценарий — 4 HEMP plants, one farm, CITY supply, finite demand
| Horizon | 1d | 7d | 30d |
|---|---:|---:|---:|
| Produced PAPER_SHEET | 222 | 348 | 348 |
| Sold to CITY | 64 | 192 | 192 |
| Physically held unsold | 158 | 156 | 156 |
| Player wallet PAPER | 166 | 0 | 0 |
| CITY treasury PAPER | 10334 | 10500 | 10500 |
| Used irrigation+factory water L | 432 | 730 | 730 |
| Seeds planted | 68 | 133 | 133 |
Следствие: базовый autosow закупает семена, воду и оплачивает производство даже при малой возможности продать товар. При исходных500 PAPER доход перестаёт покрывать такие расходы; деньги переходят городу, хозяйство останавливается. Статус DESIGN DEFECT CC-041, не runtime finding.

## 3. Предложенный защитный контроллер backpressure (NOT APPROVED)
В альтернативном design model включены три защиты:
1. Остановить новый посев, если суммарный backlog превышает96 sheets (включая резерв места возврата), raw crop>=24 или кошелёк<60 PAPER.
2. Не отправлять платного курьера, если у города сейчас нет минимума обеспеченного спроса на16 sheets и доступного бюджета.
3. Сохранить разрешённое производство в уже запущенных стадиях, не удалять существующий товар, правильно вести складские резервы.
Ни одна защита не гарантирует реальный net profit; market demand remains contested and unreserved during transit, у конкурентов может измениться ситуация.
| HEMP one farm | No backpressure 7d | With 7d | No backpressure 30d | With 30d |
|---|---:|---:|---:|---:|
| Produced sheets | 348 | 576 | 348 | 2040 |
| Sold | 192 | 448 | 192 | 1920 |
| Unsold | 156 | 128 | 156 | 120 |
| Wallet | 0 | 1022 | 0 | 3256 |
| CITY treasury | 10500 | 9478 | 10500 | 7244 |
Эффект модели: меньше напрасных затрат, сохранена оборотная ликвидность. Нельзя принимать эти значения как обещание доходности в игре. Альтернативный контроллер проверен отдельными 16 сравнительными прогонами и инвариантами.

## 4. Предупреждение: рынку нужна справедливая очередь и обеспеченные заказы
При общем городском спросе64 sheets/day в 30-day HEMP with backpressure:
| Concurrent farms | Total bought | Total unsold | Farms with zero sales | Max sales in single farm |
|---|---:|---:|---:|---:|
| 20 | 1920 | 2016 | 13 | 808 |
| 100 | 1920 | 6432 | 64 | 168 |
Количество некупленной бумаги растёт, 13 из20 или64 из100 ферм не продали ни листа по синтетическому алгоритму. Причина не только скудный спрос, но и отсутствие справедливой механики аллокации. В текущем toy model отправка курьера не резервирует место в городском заказе; несколько продавцов могут отправить груз одновременно, уплатить доставку и обнаружить, что лимит уже занят. Временные tie-breaker варианты могут систематически отдавать преимущество определённым игрокам.
DESIGN PROPOSAL: Market BuyOrder reservation при принятии сделки (reserve city budget, quantity and storage capacity); deterministic FIFO with age/fair round robin, anti-spam, per-seller limits where appropriate. Корректность сервера нужно проверять на реализационном коде.

## 5. Результаты альтернативных вариантов, 7 дней, один фермер
| Crop | Test regime | Produced | Sold | Wallet PAPER |
|---|---|---:|---:|---:|
| HEMP | Base demand64/day, baseline | 348 | 192 | 0 |
| HEMP | Demand256/day, baseline, city cost cap900, city storage512 | 1560 | 1560 | 2641 |
| HEMP | Demand256/day + city seed restock160/day, baseline | 1692 | 1536 | 2 |
| HEMP | No auto shipping | 156 | 0 | 0 |
| HEMP | Manual single planting | 24 | 24 | 551 |
| FLAX | Base demand64/day, baseline | 352 | 192 | 0 |
| FLAX | Demand256/day, baseline | 1952 | 1792 | 3086 |
| FLAX | Demand256/day + seed restock160/day, baseline | 1952 | 1792 | 1798 |
Рост входных поставок семян сам по себе может ускорять расходы и усиливать зависание товара в складе; высокая теоретическая производительность не равна положительному денежному потоку.

## 6. Экономическое объяснение
PAPER в этой модели не создаётся из товара: city<->player переводы только; SUM(city treasury+all player wallets) одинаков в начале и конце. Цены CITY sell seeds4 и water packs2, fee service2/batch и shipping5/dispatch переводят деньги в казначейство. CITY PAPER_SHEET buy3 выводит их обратно. Разница между accrued inventory и realized sales критична.
Суточные границы и закупочные лимиты вычисляются по REAL_TIME, не WORLD_TIME. 60мин world day не делает два десятка денежных закупочных циклов за сутки.

## 7. Новые риски и необходимые изменения
CC-041 HIGH: automated planting/processing spends money while finished goods are unsellable; add optional automatic backpressure + inventory reserve/working-capital settings + player UI projection.
CC-042 HIGH: competing sellers send paid cargo without booked buy order and fair allocation; establish city purchase order reservation, escrow and deterministic fairness policy.
CC-043 MEDIUM/HIGH: demand and municipal water line scaled per farm in test model; city-level utility shared physical capacity and geographic connection caps remain undecided, particularly for100 farms.
CC-044 HIGH: incomplete economic model: CAPEX, wages for workers, shop delivery labor, water billed by event meter, storage expansion, seed stock replenishment policy, physical city consumer usage and land/plot costs need complete gameplay fixtures.
CC-045 MEDIUM: rejection counters increment each minute while blocked, not one rejection per job. Telemetry must distinguish time waiting vs distinct denials/events, otherwise operational metrics misleading.

## 8. Recommended adoption gate
A. Decide denomination PAPER vs PAPER_SHEET and species-specific fiber.
B. Approve 24h/7d/30d targets for opportunity cost, treasury, farm margin and city demand as explicit designer goals, not arbitrary policies.
C. Formalize MARKET CityPurchaseOrder and escrow semantics including timed logistics.
D. Specify AutomationBackpressure with cash floor, input/WIP/output thresholds and optional user override.
E. Build shared city utility / warehouse storage / seed restock model and repeat with live concurrency + SQL transaction abort scenarios.
F. Update source chapters ECONOMY/RESOURCE/WATER/FARM/PRODUCTION/AUTOMATION/MARKET/TIME and create GDD v0.2 candidate — not yet APPROVED.
