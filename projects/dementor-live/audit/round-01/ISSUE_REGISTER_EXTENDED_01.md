# DEMENTOR LIVE — CROSSCHECK / ISSUE REGISTER EXTENDED 01
2026-10-17 | GA-01 | STATUS: TRIAGED — NO FIXES APPROVED. Дублирующие старые номера CC-001..027 остаются в CROSSCHECK_01_v0.1 в замороженном baseline.

## Сводка
Проверено 27 разделов на текстовой/числовой согласованности; расчётные сценарии не равны runtime QA. Существующие CC-001..027: восемь исходных blocker-class проблем и девятнадцать HIGH/MEDIUM. Новый глобальный аудит добавляет CC-028..040. Значение severity зависит от этапа: CHARACTER issues блокируют Character Gate, экономические — Economic Gate, social age — Public Release Gate. Не объявляем все блокировками текущего документа.

## Новые находки (продолжение нумерации)
| ID | Gate | Severity | Конфликт / воспроизведение | Предлагаемое исправление (не APPROVED) | Статус |
|---|---|---|---|---|---|
| CC-028 | ECONOMY P2 | BLOCKER | HEMP/FLAX оба создают generic PLANT_FIBER, а бумажные рецепты имеют разные литры/выход; 12 HEMP→24 fiber→24 sheets через FLAX рецепт за18л вместо32л | HEMP_FIBER и FLAX_FIBER separate resource_ids ИЛИ единый рецепт generic fiber | OPEN |
| CC-029 | ONBOARDING P2 | BLOCKER | 80+4×90−360−60=20 PAPER, но покупка 6 WOOD+4 SHEET в городе стоит38 → дефицит18 | Явная разовая бесплатная выдача материалов (ledger) или ещё работа ≥18 PAPER или ребаланс | OPEN |
| CC-030 | WATER P2 | HIGH | 4 HEMP steady production water ~53.33л/час > river pump30л/час, дефицит23.33л/час | Считать это намеренным bottleneck + в UI прогноз supply/demand + buffer policy, либо пересмотреть насос/рецепт | OPEN |
| CC-031 | TIME P2 | HIGH | «69мин hemp batch» относится к последовательному прохождению, а steady-state при наложении циклов →32 sheets/hour, не ~20.87/h. Для flax 107мин vs steady25.6 sheets/hour | Явно разделить serial latency, machine utilization, throughput | OPEN |
| CC-032 | AUTOMATION P2 | HIGH | 24h offline upper bounds подразумевают авто-сбор, авто-посев, 128 seeds/day, склад/доставку; обычный фермер такого не получает | Отдельные модульные prerequisites и finite buffers для каждого automated action | OPEN |
| CC-033 | UNITS/BUILD G0 | HIGH | 55 из 144 клеток стартового участка занято по площади, но нет доказательства размещения с подходами, дверью, отступами и частной границей | Создать навигационно корректный 12×12 plot test и occupancy/path proof | OPEN |
| CC-034 | ECONOMY P2 | HIGH | 4 tree/day потенциально 80 WOOD→160 PAPER_SHEET, 248л/сут; городская бесконечная закупка выдаст480 PAPER/день при условии спроса | Учесть сменный stock, 24h/7d/30d treasury simulation, seed/repair/delivery/market | OPEN |
| CC-035 | WATER/ECON P2 | HIGH | PRICE 2 PAPER/10L vs целые литры; 36L требует либо7.2 дробных PAPER (против money integer), либо40L пакет за8 с остатком4L | Утвердить минимум пакет10L/rounding или fixed tariff per litre using integer smallest denomination | OPEN |
| CC-036 | TIME/RESOURCE P2 | HIGH | Нужны гарантии детерминированного приоритета одновременных событий plant/pump/production/job при одинаковой временной отметке и реигре | Canonical (server timestamp, sequence, resource priority, txid) ordering; per ledger monotonic cursor | OPEN |
| CC-037 | MARKET/ECONOMY P2 | HIGH | Городской базовый ассортимент «гарантированно доступен» и реальные city stock finite противоречат без policy replenishment | Явный replenishment ledger + бюджетные/временные лимиты и starter exceptions | OPEN |
| CC-038 | RESOURCE/TRANSPORT P3 | HIGH | seller/courier/buyer may be custodian/owner at different times, unclear exact property transfer before delivery | Formal manifest, custodial state and settlement ownership transition with failure recovery | OPEN |
| CC-039 | RELEASE G0 | MEDIUM | Character-first gate vs параллельные tech engine selection and 2D world mockups | Prohibit engine lock until SVG Character Gate, permit only visual board scale test | OPEN |
| CC-040 | SOCIAL Public | HIGH | AGE / retention / moderation no final policy; full open chat can't public launch safely | Define intended audience, age gates and privacy control policy before public beta | OPEN |

## Старые критические CC требуют конкретного evidence
CC-001/002: 4 authoring views vs 8 runtime + accepted reference; pass via validated character master/8-view/animation demo.
CC-003: v0.3 board 2.0 scale correction exists, GDD candidate must inherit correctly.
CC-004: START HERE character-first supersedes engine-first release ordering.
CC-005: PAPER vs PAPER_SHEET contract unresolved.
CC-006: Treasury budget and emission unresolved.
CC-007: Online/offline shared resource replay unresolved.
CC-008: First 27 chapters only consolidated in GitHub/Drive; full original text archive not yet persisted.

## Patch/closure evidence requirements
For each CC: owner chapter, source link, OLD rule quote, NEW rule (proposal then approved), numerical fixtures, migrations if schema change, unit+integration test, owner sign-off, date, revision.
Do not mark CC as closed merely because the proposed fix has been described. BLOCKER count goes down only after owning gate proof and approval.

## Suggested decision bundles (not approved)
BUNDLE A Character: G0 board/camera + v0.3 geometry + authoring vs runtime + rig proof.
BUNDLE B Economy: explicit currency/material/fiber resource IDs + first-home material gap + treasury supply policy.
BUNDLE C Simulation: water/stocks/events + idempotence + offline replay + stable throughput.
BUNDLE D World: parcel 4-axis states + public shops + geometry + first world expedition.
BUNDLE E Launch: marketplace escrow and transport custody + social moderation + runtime QA.
