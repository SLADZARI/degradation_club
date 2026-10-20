# Dementor Live — инструкции для продолжения

Работай с существующим проектом. Не начинай заново. Приоритет имеют актуальные сообщения пользователя.

## Вход

1. Прочитай START_HERE.md, CURRENT_STATE.md и docs/REQUIREMENTS.md.
2. Основной согласованный замысел — docs/CORE_AND_FIRST_LEVEL_v0.1.md. HANDOFF.md описывает предыдущую точку передачи; CURRENT_STATE.md уточняет последующую настройку среды.
3. Посмотри git status и git diff, если это Git-репозиторий. Сохраняй текущие изменения других участников.
4. Выполни npm run doctor и npm run check перед содержательной работой. Если пользователь просит только документ/упаковку, не запускай игровой сервер и долгие проверки без необходимости.

## Объём и источники

- Это отдельный локальный runtime. Не смешивать с Battle, Robo или клубным сайтом. Новый удалённый репозиторий и публичный деплой не создавать без запроса.
- Не превращать config.mjs в утверждённый баланс. Замороженные архивные GDD не отменяют позднейших решений пользователя.
- Не добавлять обратно удалённую числовую спецификацию в согласованное ядро. Контекст ошибки — в HANDOFF.md.
- Три выбранных референса в references — ориентиры; они не доказывают существование работающего UI.
- Только игровая валюта. Никаких обещаний реальных выплат, вывода денег и платной инфраструктуры.
- Правила мира и список ожидаемого результата — docs/REQUIREMENTS.md; не расширять slice до завершения базовой цепочки.

## Проверки и честный статус

- npm run check выполняет синтаксические проверки и тесты модели. Это НЕ браузерная или HTTP/SSE-проверка.
- Прежнее неверное ожидание после исчерпания узла в test/integration.mjs исправлено. Смотри текущие результаты в CURRENT_STATE.md и reports. Не выдавать старые проверки за доказательство изменённого runtime.
- До заявления о двух настоящих игроках проверить два независимых клиента, консоль, сеть и реальные действия. Фикстуры и две записи в модели — другое доказательство.
- До заявления о готовом UI открыть его, оценить визуально и снять настоящий скриншот приложения. Не подменять его PNG-референсом.
- Не обходить отказ системы разрешений. Сообщить конкретное ограничение и продолжать независимую работу.
- После значимого шага обновить CURRENT_STATE.md: что изменено, какие проверки реально выполнены, что осталось. Непроверенное отмечать NOT RUN.

## Инструменты

- Терминал — локальные файлы, Node.js, Git и тесты.
- GitHub и Google Drive — существующая удалённая документация. Точные пути в docs/TOOLS_AND_SOURCES.md. Проверять доступные инструменты в новом чате; ZIP не даёт аккаунтных прав.
- Не добавлять токены в файлы, команды, отчёты или архив. data, .env, node_modules, .git и локальные резервные копии исключены из переносного пакета.
- Не менять глобальные настройки/разрешения плагинов. Субагентов не запускать без явного запроса пользователя или применимой обязательной инструкции.

## Разделение графики мира и интерфейса

По прямому уточнению пользователя 18 октября: мир рисуется в исходном бумажном/origami стиле — геометрические деревья, камни, кусты с красными ягодами, лавки, здания и объекты площади. Не заменять физические объекты на карте системными эмодзи. Эмодзи допустимы для иконок предметов в рюкзаке, панели и магазинах; разные семена имеют разные значки (сейчас 🌰 конопля, 🫘 морковь).

## DL-TERRAIN-01 / RC3 — покрытия земли (SVG-first)

[ТЗ, UI-покупки, рюкзак, предпросмотр и серверные права](../design/DL_TERRAIN_01_RC3_GAMEPLAY.md) · [безопасный RC3 runbook](docs/RELEASE_0.5.0_RC3_TERRAIN_SAFE.md). Пять правил: **три товара — paving, grass, flowers; пакет 10 за 1 PAPER; старые 20 UI-иконок неизменны; частный участок покрывает только владелец; реальный world.json никогда не сбрасывать**. Отдельные 17 SVG собираются через `python3 tools/build-terrain.py` в один версионированный атлас на размер; в магазине отображать картинки атласа, покупку складывать в существующий `terrainBag`, на карте сначала выбирать ромб, потом «Применить». Статус: draft candidate, не продакшен. Измерить FPS и проверить два браузера/мобильный телефон перед merge и публикацией.

## Paper-world graphics · WORLD ART Batch 01 (35 SVG candidates)

Аудит сцен RC4 / GRID-02 / WORLD-01 / WORLD-02 / CAVE / OBITEL: [WORLD_ASSET_GAP_AUDIT_2026-10-20.md](../design/world-assets/WORLD_ASSET_GAP_AUDIT_2026-10-20.md), [полный реестр 139 записей](../design/world-assets/WORLD_ASSET_GAP_AUDIT_2026-10-20.csv). 35 отдельных SVG-исходников находятся в `runtime/assets-source/world-art-batch01/`, 5 Python-скриптов — в `runtime/tools/world-art-batch01/`. Визуальный стиль `DL-ISO30-PAPER-WORLD-01`: редактируемый SVG + чистая альфа + бумажные плоскости, без внешних теней, текстуры мира — отдельно от UI-иконок. Все 35 изображений — **только кандидаты, НЕ подключены к игровому Canvas и НЕ согласованы художественно**. Игровые размеры CU, границы коллизий и порядок глубины берутся из существующего runtime, а не из иллюстрации. Не изменять 20 утверждённых UI-иконок v2, 17 terrain SVG, героя, экономику или сохранения. Экспериментальные миры не переносить автоматически в RC4. Без approval, bbox/CU/occlusion и мобильного QA ничего не merge/deploy.

## ISO30 World Asset Source Coverage · 139/139 (CANDIDATE)

Для новых сцен и рисунков использовать [аудит 139 объектов](../design/world-assets/WORLD_ART_COVERAGE_139_2026-10-20.md) и исходные SVG в `assets-source/world-art-batch01/` + `assets-source/world-art-batch02/`. Есть 125 базовых ISO30 SVG-кандидатов для 124 физических ID, 21 кандидат строительных стадий и 15 логических ID без отдельного спрайта. **НЕ считать это подтверждением runtime UI, художественного APPROVED, DEPLOYED или маппинга к CU-footprint**. Для нового мира требуется прямой game-object→sprite→anchor→stage→depth контракт и G6 браузерная проверка. 20 Paper Cut v2 и 17 DL-TERRAIN-01 не изменять, особенно hero / `world.json` / live state.

## Unique City Houses / ISO30 G6 art (PR stack after #303)

[Unique houses and furniture G6 acceptance](../design/world-assets/UNIQUE_HOUSES_ISO30_G6_ACCEPTANCE_2026-10-20.md) contains 46 individual SVG sources: 14 unique structure designs, 11 bed/bench/chair/furniture designs and 21 candidate construction states in `assets-source/world-art-unique-houses/`. SVG → PNG 128/256 only. **NO AUTOMATIC RUNTIME REPLACEMENT**. Every physical building still uses server-authoritative footprint and depth, and every actual stage must be read from existing game state, not inferred from art. Static warehouse/tool shop/mayor tent have **no stage machine**; their extra stage images are not playable. Residential plots currently support a three-stage tent, not a new house. Keep 20 approved UI v2 icons, 17 terrain tiles, original hero and saves immutable. Real iPhone/browser G6 NOT RUN; G7 not approved.

### Уточнение v1.1 — 8 личных участков (20.10.2026)

Помимо 14 индивидуальных городских зданий, 11 грядок/скамеек/стульев/мебели и 21 рисунка строительных стадий, подготовлены **8 стабильных фасадов личной палатки** на `plot-1…plot-8`. Полный комплект: **54 SVG / 108 PNG**; [архив v1.1](https://drive.google.com/file/d/1-N4bkRh9JyxGI3o9jjWGUUroCmoqO-ZA/view) · [G6 критерии](../design/world-assets/UNIQUE_HOUSES_ISO30_G6_ACCEPTANCE_2026-10-20.md). Детерминированная функция в `assets-source/world-art-unique-houses/visual-variants.mjs` выбирает стиль по существующим `cityId` и `plotId`; **не вводить дополнительное поле в world.json**. PNG и SVG не подменяют действующий Canvas до art/CU/browser QA, не добавляют игрокам новые дома вместо палатки.
