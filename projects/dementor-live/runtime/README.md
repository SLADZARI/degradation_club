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

## Новые SVG-иконки · NEW-ONLY v3.1

Интеграция **только 42 новых** номеров (21–62), старые 20 Paper Cut v2 — без изменения: [инструкция, список ID и QA](../design/asset-library/NEW_ONLY_ICONS_V3_1_2026-10-20.md). Скачать [архив с 42 SVG, 210 PNG и установщиком](https://drive.google.com/file/d/13nNQYJ0rLOasHLE2pGA5Vsx2TS2DTiM_/view). Локально: `python3 install_new_only.py /path/to/runtime`; скрипт оставит каталог `public/assets/paper-icons/` и старый код иконок без изменений. Перед публикацией нужны проверки реального Mac, HTTP и мобильного UI.

## DL-TERRAIN-01 · изометрическая земля (P0 assets, no deployment)

[ТЗ, 17 SVG, результаты QA и установка](../design/DL_TERRAIN_01_ISO30_P0_2026-10-20.md) · [готовый пакет SVG/атласов](https://drive.google.com/file/d/1ofFxr1jWCWGUhqlUfNtjQio4u-hFGYqw/view). Плитки 256×148, 1×1 клетки, ISO30. Загрузчик рендерит *только* имеющиеся `landscape.tiles`; старый процедурный слой остаётся fallback. Перед релизом обязательны iPhone Safari/две сессии/backup; production не обновлён.
