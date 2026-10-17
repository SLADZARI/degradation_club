# DEMENTOR LIVE — GA05 CROSS-CHAPTER COMPLETENESS MATRIX 27/27
2026-10-17. Coverage counts an editorial REVIEW against GA05, NOT completion or user APPROVAL of 27 full v0.2 chapters. Uses same 50 GA04 TEST parameters plus first-sale TEST overrides in GA05, all unapproved.
| № | Система | Что проверялось/изменилось в GA05 | Связи | Что требуется закрыть | Очерёдность |
|---:|---|---|---|---|---|
| 01 | WORLD | Общегородской рынок нуждается в реальных улицах и городской недвижимости | WATER, LAND, TRANSPORT | Проверить доступность CityBeginnerHub без телепортации; публичные пути | P1 |
| 02 | LAND | Право на единственный стартовый участок + физическое зонирование | BUILD, ECONOMY, SOCIAL | Транзакция last plot, выдача комплекта до списания PAPER | P0 |
| 03 | BUILD | Учебная бытовка, муниципальный станок, склад и подключение | RESOURCE, LAND, UNITS | Протестировать 6 WOOD+4 SHEET, доступ, CAPEX и временной процесс | P0 |
| 04 | ECONOMY | PAPER ledger, CITY offer hold, escrow, депозиты и эмиссия | WORK, MARKET, RESOURCE | Заблокировать производство→PAPER, зафиксировать источник 1 800 PAPER | P0 |
| 05 | RESOURCE | PAPER_SHEET vs PAPER; HEMP_FIBER/FLAX_FIBER; происхождение cargo | PRODUCTION, TRANSPORT, FARM | Сумма по SKU и источникам, refund/cancel с реальным перемещением | P0 |
| 06 | FARM | 4 HEMP/45мин, семена, вода, урожай, повторные посевы | WATER, TIME, RESOURCE | Реальные стадии полива/урожая, отсутствие продаж при OFFLINE | P0 |
| 07 | WATER | Общий лимит 120л/ч, бак40л, городская услуга | WORLD, FARM, PRODUCTION | Схема труб, сегментация, очередь и fairness 100 фермеров | P0 |
| 08 | PRODUCTION | 4 цикла бумажного производства с происхождением волокна | RESOURCE, WATER, TIME | Входные товары и выход6 SHEET, резерв склада, остановка без воды | P0 |
| 09 | TIME | REAL_TIME vs WORLD_TIME, TTL предложения, escrow время | FARM, MARKET, TECH | Реальный checkpoint/recovery и нечестные 60мин TTL | P0 |
| 10 | WORK | Пять реальных курьерских заданий и источник зарплат | QUEST, ECONOMY, TRANSPORT | Пруф реального CargoId и времени, не 7-мин таймер | P0 |
| 11 | MARKET | One-time FIRST_6 и обычный городской спрос | ECONOMY, RESOURCE, TRANSPORT | 100/100 доступ и истинный городской PAPER demand, не фиктивное поглощение | P0 |
| 12 | SOCIAL | Friends, private property, anti-alt и справедливость доступа | LAND, ECONOMY, WORK | One-time per entitlement без несправедливого бана семей | P1 |
| 13 | COMBAT | PvE городская экспедиция отдельно от общего хозяйства | WORLD, ECONOMY, SOCIAL | Первый unlock once без приватизации и без дублирования наград | P2 |
| 14 | TRANSPORT | 6 листов физически идут через Cargo, не телепортируются | WORK, MARKET, WORLD | Курьерский маршрут, владельцы/держатели, reconnect, оплаченная доставка | P0 |
| 15 | CHARACTER | 2D SVG master и движение восьми направлений | VISUAL, UNITS, RELEASE | Character Gate остаётся blocking перед выбором 2D engine | P0 |
| 16 | QUEST | Tutorial FirstSaleEntitlement и корректные стадии | WORK, BUILD, MARKET | Quest state при недостатке CITY budget/stock, перенос срока | P0 |
| 17 | NPC | Шмыг, Бетон, Искра, Мох — расписания/услуги | CHARACTER, QUEST, TIME | Городские функции доступны без NPC online; art не готов | P1 |
| 18 | SURVIVAL | Нет offline смерти/голода по умолчанию в MVP | CHARACTER, TIME | Сверить штрафы с занятиями по 15 часов реального времени | P2 |
| 19 | AUTOMATION | Stop spending при нулевом спросе/буфере | FARM, MARKET, RESOURCE | Одноразовый заказ не превращается в бесконечный выкуп | P0 |
| 20 | MONETIZATION | Реальная монетизация отдельно от PAPER | ECONOMY, VISUAL, SOCIAL | Нельзя продавать городскую квоту/землю за реальные деньги без согласования | P2 |
| 21 | UNITS | WU↔BC↔sprite pixel; реальная дистанция первой доставки | CHARACTER, WORLD, BUILD | 12×12 проход с SVG героем, время walk от home до CityHub | P0 |
| 22 | VISUAL | Сохранить accepted высокую 3/4 камеру и SVG-реквизит | CHARACTER, UNITS, NPC | 4 source authoring views ≠8 runtime; завершить одну анимационную сборку | P0 |
| 23 | TECH | Server-ledger/tx, RLS, SQL atomic и idempotence | ALL | Fault injection на CITY offer hold / item escrow / physical stock | P0 |
| 24 | RELEASE | Гейт первого опыта и SVG character-first | GAMEPLAY, VISUAL, TECH | Прогон 20/100 реальных user flows и статусы REVIEW/IMPLEMENTED/VERIFIED | P0 |
| 25 | GAMEPLAY | Короткие сессии и честный early progression | WORK, FARM, MARKET | Тест median 915мин на 100 игроков: принять target time, переделать delivery | P0 |
| 26 | GOVERNANCE | Не переводить TEST в APPROVED, сохранить GDD v0.1 | ALL | Архив дословных глав и статусная трассировка каждого решения | P0 |
| 27 | DECISIONS | GA01–GA05, CC-001..067 и открытые policy choices | ALL | Approve only explicit choices; create issue-to-chapter diff and evidence | P0 |
## Обязательная структура финальных 27 отдельных глав
Каждой системе нужны: введение и границы, owner сущностей, схемы с обязательными типами, стейт-машина, реальные единицы/числовая конфигурация, события и RPC, позитивные/негативные UX-сценарии, доступы и безопасность, необратимые операции/rollback, серверная семантика офлайн, интеграционные тесты, визуальный/карточный QA и подтверждение. Не подменять главу одной строкой таблицы.
Общая оценка: 27/27 domain impacts REVIEWED, 0/27 полных user-approved GDD v0.2; core economic contract candidate подготовлен отдельно. GA05 31 синтетический прогон/496 repeated invariant checks и16 унаследованных GA04 регрессионных запусков; ни один не является тестированием сервера.
## Порядок закрытия
GATE-0 SOURCE/ART: восстановить длинные 27 исходных глав, Character SVG source8 runtime направления, WU/BuildCell scale; не запускать игровой движок раньше.
GATE-1 ECONOMY: PAPER vs PAPER_SHEET, HEMP vs FLAX fiber, city initial liquidity/issuance, starter kits, first cash flow and real WORK.
GATE-2 MARKET: обоснованный physical buyer demand, one-time fund held18 PAPER, true CityHub consumption, 6-sheet shipping and real logistic cost.
GATE-3 SIMULATION: 20/100 actual users + shared head water, SQL fault/replay, no duplicated items or money.
GATE-4 CONTENT: all social, PvE, NPC, safety, cosmetics and final GDD chapter structure.
Status recorded per chapter as DRAFT / REVIEW / APPROVED / IMPLEMENTED / VERIFIED; новая тестовая цифра не наследует APPROVED автоматически.
