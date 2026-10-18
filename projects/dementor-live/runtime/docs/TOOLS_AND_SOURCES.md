> Актуализация 18.10.2026: [релиз 0.2.1 и состояние серверного запуска](RELEASE_0.2.1.md), [рабочая версия, пожертвования и интерфейс](RELEASE_2026-10-18_DONATIONS.md). Ниже сохранены предыдущие сведения; серверный Compose-проект подготовлен локально, VM пока не изменялась.

# Терминал, плагины и источники

Проверено в текущем чате 17 октября 2026 через Plugin Management: **GitHub** и **Google Drive** установлены, статус **ENABLED**. Это проверка наличия плагинов, не обещание неизменных прав и подключения в другом чате. Новые плагины не устанавливались; настройки разрешений не менялись.

## Минимальный набор

| Возможность | Для чего | Что проверить в новом чате |
|---|---|---|
| Терминал / файловые инструменты | Исходники, Node, Git, запуск и тесты | Есть доступ к папке проекта, процессам и локальным сокетам |
| GitHub | Читать и при необходимости обновлять существующие документы | Доступ к SLADZARI/degradation_club; читать перед записью, использовать текущий SHA |
| Google Drive | Читать и обновлять основной START HERE | Открывается точный документ ниже; читать перед записью и проверять после |
| Браузерные инструменты | Реальные клиенты, консоль, UI, скриншоты | Отдельная доступность и разрешения; не обходить отказ |

Для игры не нужен Supabase, Vercel, новый сервер MCP или новый плагин. Локальный Node-сервер уже является сервером мира. Не импортировать аккаунтные токены в .env, файлы или архив ради переноса.

## Точные источники

- Репозиторий документации: **SLADZARI/degradation_club**.
- Ветка: **docs/dementor-live-global-audit-05**.
- Основной core: `projects/dementor-live/CORE_AND_FIRST_LEVEL_v0.1.md` — [открыть](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-global-audit-05/projects/dementor-live/CORE_AND_FIRST_LEVEL_v0.1.md).
- Оглавление: `projects/dementor-live/audit/round-05/README.md` — [открыть](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-global-audit-05/projects/dementor-live/audit/round-05/README.md).
- Городские проекты: `projects/dementor-live/design/CITY_PROJECTS_v0.2.md` — [открыть](https://github.com/SLADZARI/degradation_club/blob/docs/dementor-live-global-audit-05/projects/dementor-live/design/CITY_PROJECTS_v0.2.md).
- START HERE: [Google Doc](https://docs.google.com/document/d/13egjMzmrOQCjew7V-DL2M15jnX7tyJoASTVdJF86Huw/edit).

Предыдущее состояние: локальный runtime не был загружен в репозиторий. Текущая публикация — projects/dementor-live/runtime в ветке docs/dementor-live-city-ownership-and-wilderness-01. Он существует в данной папке и переносном архиве. Снимки исходных документов лежат в docs. Если есть сеть и плагины, сравнить их с текущими удалёнными версиями перед редактированием; если доступа нет, явно назвать снимки локальными копиями.

## Порядок записи

Документировать проверенный результат отдельно от намерения. В GitHub обновлять прочитанный файл с актуальным SHA, в Google Docs — соответствующую запись с сохранением остального содержания. Не переписывать замороженные Master GDD/Decision Register; не плодить PR без необходимости. Проверять чтением после записи. Никакая настройка этой папки не отменяет собственные проверки разрешений инструментов.
