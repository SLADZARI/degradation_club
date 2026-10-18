# Dementor Live 0.2.1 — продолжить отсюда

Рабочий локальный проект и отдельная серверная версия 0.2.1. Перед продолжением прочитать CURRENT_STATE.md, AGENTS.md и docs/DEPLOYMENT_2026-10-18.md; последние правила — docs/RELEASE_0.2.1.md. История и согласованное ядро: docs/CORE_AND_FIRST_LEVEL_v0.1.md, docs/REQUIREMENTS.md.

## Запуск и игра вдвоём

Node.js 22+, без npm-зависимостей. `npm run doctor`, `npm run check`, затем `npm start`, если сервер ещё не работает. На Mac http://127.0.0.1:4173; второму устройству в той же сети адрес из вывода запуска (сейчас http://172.20.10.3:4173). На другом устройстве сервер запускать не нужно. После обновления нажать F5 на обоих.

WASD/стрелки — движение; E — действие, удержание повторяет; Shift — бег; 1–6 — быстрая ячейка; Q — положить ресурс; F — поесть; Enter — чат. Камера следует за героем. ☷ — места и путь к ним. «Твои задания» раскрывается/сворачивается. Шесть ячеек настраиваются в рюкзаке; раскладка и сворачивание сохраняются в этом браузере.

## Первая общая миссия

☷ → «Выход · миссия расчистки» → стрелка. Указатель на юге (31,35), E. Оба игрока в одной зоне. Соберите топором/киркой 8 древесины и 6 камня; два новых участка откроются всем. Выход внизу зоны, E; добыча и прогресс сохраняются. Восточные участки требуют физического прохода по готовому мосту. Это одна конечная миссия, не бесконечная генерация.

## Сохранение и проверки

data/world.json — реальные игроки и мир, не удалять и не публиковать. Перед рестартом сохранить закрытый backup. ZIP содержит исходники, документацию, тесты и референсы, без data/backups/.env/.git/node_modules. `npm run pack` обновляет архив и MANIFEST.json.

`npm run test:expansion`, `test:quests`, `test:compact-panels`, `test:perimeter`, `test:integration` — отдельные временные миры; для браузерных тестов нужны установленный Chrome и Playwright (для игры не нужны). Check не заменяет браузерную проверку. Подробный статус — CURRENT_STATE.md, reports.

## Отдельный запуск на VM

Версия 0.2.1 уже работает отдельным Docker Compose в `/srv/dementor-live/app`, порт `14173`, том `dementor-live-world`. Мир и музыка перенесены и сохранены в датированной резервной копии. Проверка внутри VM проходит; внешний запрос из рабочей сети пока истекает по времени. См. [отчёт о первом запуске](docs/DEPLOYMENT_2026-10-18.md) и [инструкцию обновления](deploy/README.md). Исходники опубликованы в [изолированной ветке GitHub](https://github.com/SLADZARI/degradation_club/tree/deploy/dementor-live-isolated-2026-10-18/projects/dementor-live/runtime).

GitHub: https://github.com/SLADZARI/degradation_club/tree/docs/dementor-live-city-ownership-and-wilderness-01/projects/dementor-live/runtime
Google Drive START HERE: https://docs.google.com/document/d/13egjMzmrOQCjew7V-DL2M15jnX7tyJoASTVdJF86Huw/edit
Workspace: https://drive.google.com/file/d/1YpPha-6v0nXgEaNtLl37mn0twwwx9_IF/view

Плагины дают доступ к удалённым материалам только при наличии подключения в новом чате. Код и сервер не требуют интернета. Локальная папка/ZIP не выдают чату терминал или аккаунтные права.
