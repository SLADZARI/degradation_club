# DEMENTOR LIVE — CC-046..052 / GA-03 CROSS-CHAPTER ISSUES
Дата: 2026-10-17 | Status: OPEN / GA-03 SYNTHETIC OBSERVATIONS. Продолжает CC-001..045; проблема != подтверждённый баг runtime.

## CC-046 [P0 ECONOMY/WORK/TIME] Одновременный онбординг блокирует казну до поступлений от земли
20 параллельных новичков при 10,000 PAPER завершают 20/20; 100 параллельных при 10,000 завершают 0/100; те же 100 при 50,000 100/100. 100 строго последовательно при 10,000 тоже завершают 100/100, поскольку выручка возвращается в казну после предыдущих покупок.
Root: все платёжные обязательства наступают до любых поступлений от земли; запас ликвидности на 100 игроков должен покрывать до44,000 PAPER временных выплат (при данном TEST), тогда как чистое снижение treasury после завершения20 PAPER/человек. Обязательства и порядок исполнения нужно явно моделировать.
Proposed: funded tutorial reserve / обоснованный budget issuer / transparent municipal job queue / guaranteed starter path with anti-alt controls. No anonymous unlogged mint. Acceptance: 20/100 simultaneous scenarios with source money ledger, fairness, ledger replay and protection vs disconnect.

## CC-047 [P0 RESOURCE/BUILD/QUEST] Денег достаточно, но нет 6 WOOD +4 SHEET на каждого новичка
100 игроков при50k treasury и inventory только120 WOOD/80 SHEET завершают 20/100, оставшиеся уже оплатили землю и бытовку, но не получают construction kit. 20 игроков,50k treasury, 0 city material stock: 0/20 complete; деньги в город сданы, игрок stuck.
Proposed: reserve physical tutorial materials BEFORE non-refundable construction stage or atomic material debit+funded build commit; transparent restock/alternative gathering, prevent quest deadlock. Acceptance: 100 simultaneous claims against CityStorage with 600 WOOD/400 SHEET or viable wild gathering; no item conjuring or double issue.

## CC-048 [P0 WORK/FARM/PRODUCTION/QUEST] Даже бесплатные материалы бытовки не финансируют первый урожай и продажу
После стартовой земли и бытовки20 PAPER; условная первая HEMP→SHEET партия требует16 seeds +8 municipal water +8 maintenance +5 city delivery =37 PAPER before guaranteed sale, deficit17 PAPER. Both numbers are TEST and shop city order must be genuinely funded. Workshop/pump CAPEX not included so true gap may be bigger.
Proposed: another accessible paying delivery or staged tutorial supplies / free initial water/seed via ledger; real first-sale quote; player doesn't begin with impossible upfront costs. Test: exact first home → plant→process→funded sale with no negative wallet.

## CC-049 [P0 WATER/WORLD/ECONOMY] Источник города 120 L/h должен быть общим пределом сети, а не у каждого подключения
GA-03 CITY head cap2 L/min shared among1/4/20/100 farms; first24h production sheets744/1752/1920/3000, not linear 744×n. 100 farms arrive with100 prefilled tanks40L each, so initial supply stored4,000L; distinguish input from city pump 2,878L and initial storage in ledger. Seven-day checkpoint replay equal to uninterrupted.
Proposed: Source → DistrictTrunk → Connection → Tank → Consumer with max ml/min each edge, water quotas, per-edge capacity, price, permission, fair queue, storage reservation, absence behavior. Real graph implementation to verify.

## CC-050 [P1 BUILD/ECONOMY/RELEASE] Цена оборудования и обязательного CAPEX не определена
Workshop, reservoir, irrigation, storage, pumps, logistics, automation installation values still OPEN. GDD source recipes cannot establish real profitability/cost of first production. Synthetic sensitivity arbitrary CAPEX120/300/600/1000 shows toy cumulative gain thresholds at3/5/8/12 real-day boundaries but does not demonstrate affordance. Need source-backed cost catalog + actual materials + install time + operating costs and legal construction rights, not paper-only guessed prices.

## CC-051 [P0 ECONOMY/SOCIAL/SECURITY] Стартовые выплаты и материалы можно многократно получать через новые аккаунты без правил
100 alt accounts demand44k temporary PAPER and600 WOOD/400 SHEET kits; treasury and stock drain risk even if balances conserved. Proposed one-time per verified entitlement with reasonable anti-abuse, privacy-respecting limitations, refund/retry, no unjustified restriction; social/age policy and abuse process need separate review.

## CC-052 [P1 WATER/TIME/SOCIAL] Fair distribution / starvation and reporting conditions under shared city water
Deterministic water scheduler in GA-03 rotates start priority and spreads2,000mL/minute across eligible tanks. This avoids obvious global overdraw, but no guaranteed equitable long-term per-player consumption under different tank/crop/connection geometry. Source frontage, upgrade costs and QoS unknown.
Proposed: explicit fair-queue vs paid-priority rules, per-connection capacity, city district segmentation, rental/property permission and telemetry waiting minutes vs rejected debit events. Gate: real SQL/concurrency test and performance under 100 clients.

## Severity and closure
These are **7 new cross-system review items**; overall CC-001..052 contains known inconsistencies, open choices and test requirements, not 52 real bugs. No issue considered FIXED solely by independent design-model PASS. Close by ownership approval, specific numerical schema, database implementation & replay evidence, user-flow acceptance and changelog.
