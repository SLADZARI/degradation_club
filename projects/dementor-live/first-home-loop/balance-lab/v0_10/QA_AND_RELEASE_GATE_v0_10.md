# World Organism v0.10 — Проверки и релизные гейты
**20 октября 2026 · standalone model and Chromium evidence, NOT PRODUCTION.**

- Node **55/55 PASS**, 36 стресс-комбинаций (3/4/5 игроков × normal/forest/dry/treasury × 1/7/30d).
- **52 инварианта в каждом прогоне**: денежная масса, nonnegative, resource stocks, finite city orders, capacity, P2P, garden, demand/paper/food.
- Chromium Playwright три размера: 1440×900, 390×844, 320×700; 0 page errors; legacy SVG 42 узла и atlas map 13; pinned HUD при прокрутке; 3 сценария DEMO PASS; import v0.10 JSON и переход обратно в лабораторию PASS.
- v0.8 контроль normal D30 P3: PAPER=3600, city=2301, homes=3, finite projects=3, PAPER_SHEET 6 made/6 consumed, HEMP processed=36, CARROT eaten by humans=90. Дополнительные 35 initial STONE seed в v0.10 — новое тестовое условие, а не тихая дополнительная добыча.
- Результаты PR v0.9 [#273](https://github.com/SLADZARI/degradation_club/pull/273) 1185/1185 и v0.9.1 [#274](https://github.com/SLADZARI/degradation_club/pull/274) 1217/1217 — CI источников, **не проверены здесь повторным исполнением оригинальных suites**.
- Manual atlas actions сейчас **не воспроизводятся автоматически по прежнему формату command replay**; после demo `replay()` честно возвращает NOT_VERIFIED. Это следующий P0.
- Routes city→forest→ruins — **узловой тест маршрута**, не серверная collision/physics, не PvE runtime. Пейджеры, пещера, рыбалка, аренда и MentalHumor запланированы/в отдельных ветках, не слиты в эту модель.
- Обитель Габеля содержит только концептуальную область шести районов и внешний платеж 5000 USD. Ни оплата, ни её подтверждение в модели не производятся.
- Публичная игра: save migration/version SHA не сопоставлены в этой лабораторной проверке; server state, PAPERS, персонажи не изменялись.

### TODO перед v0.10.1 / game integration
1. Record/replay every atlas action with event/action_id, idempotency, before/after snapshot and combined concurrency tests.
2. Сверить точный production game SHA + read-only world copy и feature gates CIVIC/UNIVERSE на staging.
3. Подключать города/путешествия к одному authoritative CharacterId и city treasury, не производить деньги при переходе.
4. Геометрия+блокировки/коллизии и мобильный маршрут для 2 реальных клиентов; portal return.
5. Реальная перевозка физического cargo, disconnects и restore/replay; тест авторизации курьера.
6. Проверка live-статуса каждого PR и отдельный GO/NO GO для production, без reset volumes.
7. Дополнительные поведенческие тесты по payphone, приватности, лавке, пещере/топливу, рыбалке, музею и Gabel founding payment provider.

**NO-GO deploy**, пока выполняются эти гейты. Source package and browser HTML are chat artifacts; GitHub docs here index observations, not runtime source.
