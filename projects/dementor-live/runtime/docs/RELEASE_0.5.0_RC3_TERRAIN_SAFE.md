# Dementor Live · RC3 TERRAIN — безопасная подготовка
**Feature branch:** `feature/dementor-live-terrain-placement-rc3-2026-10-20` (от P5).
**Статус:** кандидат, не деплой. Нельзя применять без CI, exact SHA и согласованного окна.

- Подготовка Docker: сначала **утверждённые Paper Cut v2 CLEAN** через штатный `icons-v2/install-v2.py`; отдельно `python3 tools/build-terrain.py` собирает 17 SVG и хешированные PNG/WebP в игровой образ. Проверить `/assets/terrain/manifest.json`, 200 для WebP и PNG по манифесту, 200 для всех старых 20 PNG.
- Пройти `npm run check:terrain`, `npm test`, `npm run test:persistence` и существующие модельные/браузерные тесты на чистом тестовом `DEMENTOR_STATE`. Пройти 100/500/1200 покрытий, два одновременных браузера, iPhone Safari, Retina/масштаб.
- Права: муниципальная земля общая; частная — только владелец, непроданная закрыта. Запрещённое размещение не списывает покрытие/валюту.
- Зафиксировать старый SHA, PDF/JSON отчёт мира и точную версию образа. Перед публикацией на VM строго сохранить действующий `dementor-live-world` том и полный `world.json` по [RC2 SAFE](RELEASE_0.5.0_RC2_SAFE.md) и выполнить `deploy/publish-preserve-world.sh --dry-run`.
- **Не менять принудительно версию package.json и не применять имеющийся `--apply` RC2 к этой ветке**: для RC3 потребуется отдельное утверждение версии и обновление exact-SHA/version release gate. Не запускать `publish-clean-world.sh --reset-world`, `down -v`, удаление томов или копирование тестового мира на сервер.
- При откате вернуть исходный образ + связанный с ним том из общего backup, не один образ отдельно.

Границы: новая графика влияет только на материалы `paving`, `grass`, `flowers`, не добавляет прямые/повороты как покупаемые SKU и не меняет `scene`, `CityNetwork`, `CharacterId`, города, баланс текущих игроков или старые иконки.
