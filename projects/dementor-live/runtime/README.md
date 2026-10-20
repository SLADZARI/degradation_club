# Dementor Live · 0.5.0-rc.2 (кандидат безопасного обновления)

**Важно:** этот checkout объединяет CIVIC P1–P3 и исправления совместной игры 20 октября, но **не является доказательством обновления production VM**. Используйте [release guide](docs/RELEASE_0.5.0_RC2_SAFE.md), [QA reconciliation](../qa/PLAYTEST_2026-10-20_RECONCILIATION.md), [combined playtest checklist](../qa/PLAYTEST_CHECKLIST_v2_2026-10-20.md) и [QA recording runbook](../qa/QA_RECORDING_RUNBOOK_2026-10-20.md). До независимой проверки живого `dementor-live-world` не делать cutover.

Ни в коем случае не использовать `deploy/publish-clean-world.sh --reset-world`; новый безопасный путь — `deploy/publish-preserve-world.sh` с exact SHA, полной копией игрового тома, проверкой миграции на копии и восстановлением после неуспешного запуска.

## Исторические документы версии 0.2.1

# Dementor Live · 0.2.1

Локальная многопользовательская бумажная игра: строим город, зарабатываем на участок, обустраиваем дом и огород, расчищаем новую землю вместе. Node.js 22+, runtime без npm-зависимостей.

Вход: [START_HERE](START_HERE.md). Состояние и границы проверки: [CURRENT_STATE](CURRENT_STATE.md). Изменения: [релиз 0.2.1](docs/RELEASE_0.2.1.md). Следующий чат: [NEXT_CHAT_PROMPT](NEXT_CHAT_PROMPT.md).

`npm start` → http://127.0.0.1:4173; сетевой адрес второго устройства показывается при запуске. WASD — идти; E — действие; 1–6 — ячейки; Q — положить ресурс; F — поесть. ☷ показывает места; задания слева сворачиваются.

Город 64×40, восемь участков. Общая экспедиция: южный указатель (31,35), E; расчистка 8 древесины и 6 камня открывает два восточных участка; (8,14) — выход. Одна конечная зона, без PvE и бесконечной генерации. Прогресс и добыча сохраняются. Для восточного берега нужен мост.

`npm run doctor` — среда. `npm run check` — синтаксис/модель. `npm run test:integration` — HTTP/SSE. `npm run test:expansion`, `test:quests`, `test:compact-panels`, `test:perimeter` — браузерные сценарии во временных мирах; отдельно нужны Chrome/Playwright. `npm run pack` — переносной ZIP с MANIFEST.json.

Реальный мир в data/world.json; не удалять/не публиковать. Сохранения, backups и секреты исключены из архива. Набор для отдельного Docker-запуска на своей VM: [deploy/README.md](deploy/README.md). Установка на VM не заявлена, пока не пройдена проверка SSH-узла и не выполнен первый запуск. Городская валюта только игровая, числовые параметры — прототип.


## 0.3.0-rc.1 — кандидат обновления (не production)

[Отчёт и процедура миграции](docs/RELEASE_0.3.0_RC1.md). Доступны отдельная семенная лавка, городской опытный огород и реестр новых городов. Сводная ведомость `materials` показывает дерево и камень на всех этапах. `npm run test:persistence` проверяет реальный перезапуск с одним `world.json`, `npm run test:cities-browser` проверяет переход двух живых браузерных сессий. Перед обновлением VM обязателен отдельный backup `dementor-live-world`; в текущем кандидате используется новая `dementor-cities-v1` схема сохранения. ZIP собирается командой `npm run pack` или в GitHub Actions PR #261 после PASS.

## DL-TERRAIN-01 / RC3 — покрытия земли (SVG-first)

[ТЗ, UI-покупки, рюкзак, предпросмотр и серверные права](../design/DL_TERRAIN_01_RC3_GAMEPLAY.md) · [безопасный RC3 runbook](docs/RELEASE_0.5.0_RC3_TERRAIN_SAFE.md). Пять правил: **три товара — paving, grass, flowers; пакет 10 за 1 PAPER; старые 20 UI-иконок неизменны; частный участок покрывает только владелец; реальный world.json никогда не сбрасывать**. Отдельные 17 SVG собираются через `python3 tools/build-terrain.py` в один версионированный атлас на размер; в магазине отображать картинки атласа, покупку складывать в существующий `terrainBag`, на карте сначала выбирать ромб, потом «Применить». Статус: draft candidate, не продакшен. Измерить FPS и проверить два браузера/мобильный телефон перед merge и публикацией.

## Графика мира · 35 SVG · Batch 01 (только кандидат)

[Полный аудит и рисунки](../design/world-assets/WORLD_ASSET_GAP_AUDIT_2026-10-20.md) · [CSV по 139 объектам](../design/world-assets/WORLD_ASSET_GAP_AUDIT_2026-10-20.csv) · исходники `assets-source/world-art-batch01/*.svg`. Зависимости для офлайн-сборки `cairosvg pillow`, команда из `runtime/`: `python3 tools/world-art-batch01/build.py && python3 tools/world-art-batch01/build_atlas.py && python3 tools/world-art-batch01/test_assets.py`. Генерация PNG не обновляет клиент и не меняет `world.json`. Художественная приёмка, world geometry/collision и реальное мобильное тестирование не выполнены. См. Draft PR #301.

## World Art · 139/139 SVG Source Coverage (Batch 02 — DRAFT)

[Аудит и QA](../design/world-assets/WORLD_ART_COVERAGE_139_2026-10-20.md). 90 новых оригинальных SVG + 21 независимое изображение стадий в `assets-source/world-art-batch02/`; 35 базовых SVG — Batch01 PR #301. Действующий рендер/сейвы не меняются. Генерация PNG: `python3 tools/world-art-batch02/build_from_svg.py`, проверка: `python3 tools/world-art-batch02/test_batch02.py` (локально нужны CairoSVG и Pillow). **Библиотека изображений ≠ все картинки нарисованы в игре**: до G6 — привязки к footprint и z-index, художественная QA, две вкладки/iPhone. Старые 20 UI и 17 текстур земли защищены.

## Уникальные здания ISO30 — самостоятельная художественная партия

[14 строений + 11 объектов грядок/мебели + 21 визуальная стадия, QA](../design/world-assets/UNIQUE_HOUSES_ISO30_G6_ACCEPTANCE_2026-10-20.md) · [исходные SVG](assets-source/world-art-unique-houses/) · [скачать полный каталог SVG+PNG](https://drive.google.com/file/d/13hNk-YY4ulbkzSVLWWv6Tsj9deFdplA6/view). Технические SVG/alpha/детерминизм PASS, но художественная приёмка, точные Cube Units, позиции, коллизии и клиентские тесты **не завершены**. Рендер пока остаётся старым Canvas. Не вносить графические кандидаты в production и не переписывать старые Paper Cut v2/UI или DL-TERRAIN-01.
