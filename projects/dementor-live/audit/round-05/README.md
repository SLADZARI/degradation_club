# DEMENTOR LIVE — GLOBAL AUDIT ROUND 05 · START HERE
**2026-10-17 · REVIEW / SYNTHETIC CHECKED · USER APPROVAL PENDING**

GitHub: https://github.com/SLADZARI/degradation_club/tree/docs/dementor-live-global-audit-05/projects/dementor-live/audit/round-05
Google Drive: https://drive.google.com/drive/folders/11EJ6s_x6WN6zqYTM72Baq7cQR7p4WYYC

Project boundary: own 2D Dementor Live life sandbox, NOT Dementor Battle / Robo Games. Frozen v0.1 remains unchanged. A new test model is not approved new GDD or functional game code.


## Главный вход — ядро игры и первый этап (2026-10-17)

[CORE_AND_FIRST_LEVEL_v0.1.md — Ядро игры и первый этап](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-global-audit-05/projects/dementor-live/CORE_AND_FIRST_LEVEL_v0.1.md) — **читать первым для актуального замысла**. Один краткий основной документ только с согласованными решениями: смысл игры, главные механики и стартовая цепочка от пустого поля и городской площади к своему участку. Раздел открытых вопросов и предлагаемые детали из основного текста исключены.

Это позднейшее выбранное пользователем направление после CITY_PROJECTS v0.2: только игровая валюта, бесплатные изнашиваемые стандартные инструменты от мэрии, общественная кузница, поэтапная стройка с отдельным обустройством, река и мост, голод во время игры и состояние духа с обязательным самостоятельным восстановлением.

**Согласование старых глав ещё предстоит:** прежний SURVIVAL исключал обязательный голод, а прежний Character-first gate не учитывал последующее разрешение механической проверки на простом клеточном поле. Персонажи сохраняют вид из трёх сгенерированных блоковых изображений; окружение и графика мира ещё примитивнее. Готовая графика не является условием этой проверки. **Сейчас код и прототип не начинаются: сначала фиксируется основа.** Этот документ не означает обновление всех 27 глав и не подтверждён тестами GA05. Замороженный Master GDD не переписан. Следующие разделы описывают тематические документы и историю аудита.

## Тематический документ — City Projects v0.2 (2026-10-17)

- [CITY_PROJECTS_v0.2.md — Городские проекты и собственное место в городе](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-global-audit-05/projects/dementor-live/design/CITY_PROJECTS_v0.2.md) — более узкая редакция о городских проектах, предшествующая текущему краткому ядру. [К] Пустое поле, размеченные площадки и временное представительство мэра; первый проект — городская площадь. Город / государство оплачивает принятый вклад в одобренные проекты; заработанное открывает покупку своего участка и личное развитие. Авторское здание проходит изображения → согласие большинства → игровой макет от платформы / разработчиков → финансируемую городом поэтапную стройку. Образ мэра, правила голосования, бюджет, ресурсы и баланс остаются [О].
- [П] Предварительное резервирование денег и приёмки, защита от повторного учёта — предлагаемый контракт, не проверенная реализация. Сохраняются малое население, возможность завершить небольшой проект одному, оплата принятой части и фиксированный объём проекта.
- [CITY_PROJECTS_v0.1.md — предыдущая редакция](../../design/CITY_PROJECTS_v0.1.md) сохранена для истории. Мастерская больше не первый проект; возможна как последующий рабочий пример без установленной очередности.
- Это документация концепции после GA05, не его тестовый результат и не утверждённый числовой баланс. Frozen Master GDD v0.1 сохранён.

## Read in order — GA05 audit archive
1. Round05 full audit: https://docs.google.com/document/d/18fF9JAUKQI9FiCb9FmC9LnKsM7eN-H-Bsjd9TmOanbg/edit
2. Core GDD v0.2 (draft) for MONEY, RESOURCE, WORK, QUEST, LAND, BUILD, FARM, PRODUCTION, WATER, TIME, MARKET, TRANSPORT, AUTOMATION, TECH, RELEASE: https://docs.google.com/document/d/1UOEPzp5qAI-TDzGEgVl_k8Sdj8b4LosKUmjz9S8UGGc/edit
3. GA05 decision review (not approved): https://docs.google.com/document/d/1fyg0s2ezq1XFDoz8yimzZ4EoaOKmFK7DYCN6T5_gE_s/edit
4. GA05 27-system traceability/closure matrix: https://docs.google.com/document/d/1dcN8TEUGf-xosMPH4ntq3NWPUPCfSNCMoWpQILm0qHg/edit
5. New CC-060..067 (cumulative review ledger CC-001..067): https://docs.google.com/document/d/10EP3HWkK9dOw-hYtSm1BHNvfvnT6vx6IXZP-3vSL8iU/edit
6. Target real server integration tests (36 tests NOT RUN): https://docs.google.com/document/d/1dBIx_jXbIzn4aViOOApYIzOaHK-5sVCRJF99Y_8LE6A/edit

## Reproducible files
- first_sale_unified_city_simulator.js — extends GA04 shared treasury+parcel+wood+seed+water+factory+warehouse+physical cargo+escrow with one-time FIRST_6 funded buyer.
- first_sale_stress_results.json — 31 new cohort/threshold cases, 496 repeated invariants PASS in synthetic model (not game).
- first_sale_test_runner.js — no-dependency Node runner, 47 runner assertions verified in equivalent JS execution; GA04 base regression16 scenarios retained.
- GA05_UNIFIED_CONFIG_CATALOG.json — 57 test parameter IDs with units/provenance; new seven: mode/6qty/1800 budget/128 hub cap/32 sheets per hour/7-day TTL/0 shipping fee for first sale.
- GA05_FUNDED_FIRST_SALE_AUDIT.md, GDD_v0_2_CORE_CONTRACTS_CANDIDATE.md, GA05_GDD_v0_2_DECISION_REVIEW.md, GA05_27_DOMAIN_CLOSURE_MATRIX.md, ISSUES_CC_060_067.md, GA05_REAL_INTEGRATION_ACCEPTANCE_RUNBOOK.md.

## Principal findings (GA05 TEST ONLY)
- Baseline GA04 city quota and min shipment16: 0/100 first sales within day1, 15/100 within7d.
- Funded six-sheet one-time city offer: 96/100 settled by1 REAL day, 100/100 by7 days under 50k treasury with a city buyer hub and 1800 offer budget.
- 100/7d physically delivered600 PAPER_SHEET to tutorial hub and settled1,800 PAPER by genuine city transfers; no PAPER mint.
- Median first-sale time in successful100/7d synthetic cohort =915 real minutes/15h15, **not accepted usability target** and far longer than early accessible short gameplay sessions.
- Offer budget900 yields50 funded first orders, hub processing0 yields only21 complete physical consignments, TTL60min expires all100 offers, treasury10k with100 simultaneous people cannot fund tutorial jobs. Exposing those limits and consequences is mandatory.
- For first SIX sheets, test player pays at least22 PAPER (seeds16, initial city water packs4, one stage maintenance2) before CITY payout18, excluding labor/tooling and with remaining hemp resource. First SALE != first positive cash flow or full profitability.
- All proposed economics depend on approval of PAPER vs PAPER_SHEET, HEMP vs FLAX fiber, municipal PAPER origin and physical demand, starter material grants and workshop access.

## Review and next
Issue count is 67 *review items* across GA01..GA05, not confirmed 67 bugs.
27/27 chapters have an editorial traceability row and inherited source baseline, but **0/27 full long-form GDD v0.2 chapters are yet approved**. Source long-form chat export still pending.
No real PostgreSQL/RLS/durable checkpoint test or final SVG character rig tested in GA05. Historical GA05 Character-first gate; the later current core permits mechanical checks using the three generated block character images and a more primitive environment, while implementation is currently deferred until after documenting the core.
Next GA06 should prioritize an enjoyable FIRST 30/60/90 REAL minute narrative/interaction proof, source artifact completion for all27, and user acceptance of decision choices D01–D11; then bridge to actual game implementation when art/architecture gate is ready.
