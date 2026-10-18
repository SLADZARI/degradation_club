# Первое развёртывание Dementor Live · 18 октября 2026

## Размещение

- Версия: `0.2.1`.
- Публичный адрес: `http://138.199.144.94/` через существующий HTTP порт 80.
- Приложение: `/srv/dementor-live/app`.
- Compose-проект и контейнер: `dementor-live`, `dementor-live-game-1`.
- Внутренний порт приложения: `127.0.0.1:14173 -> 4173/tcp`.
- Отдельный Nginx vhost: `/etc/nginx/sites-available/dementor-live.conf`, включён симлинком в `sites-enabled`; перенаправляет только Host `138.199.144.94` на игру и отключает буферизацию SSE.
- Постоянные данные: Docker volume `dementor-live-world`.
- Первая резервная копия мира и музыки: `/srv/dementor-live/backups/initial-2026-10-18`.

Сборка выполнена из опубликованного runtime 0.2.1, commit `130e47567077830a29df06ce545bac06c26ae032`, ветка `deploy/dementor-live-isolated-2026-10-18`. ZIP до передачи: SHA-256 `60571ded018c635dfbd75b4cdeb5cda183721dc7435abef3de11b4e48b93288a`.

## Сохранение

Первоначальный `data/world.json` и MP3 сохранены в томе и отдельной резервной копии. Их SHA-256 при переносе и после заполнения тома совпали:

- `world.json`: `80d5c8f1cf5d8cff39d41ffbd04cbd00f0d7707301e389f2773e922200e4f54e`.
- `Новый городской трек-58797718.mp3`: `587977185801a11afedf838a567ba3f4b7915ea200a4d3368352334eaeda32d1`.

Серверный том теперь главный. Перед обновлением сделать новую датированную копию тома. Не копировать поверх него локальный тестовый мир.

## Проверки и границы

Docker image собрался; внутри контейнера `npm run doctor` и `npm run check` завершились успешно, 48/48 проверок. Контейнер `healthy`; запрос к `http://127.0.0.1:14173/api/health` на самой VM вернул `{"ok":true,"version":"0.2.1","testMode":false}`.

До настройки Nginx внешний TCP `14173` не проходил сетевой фильтр провайдера. Вместо запроса нового публичного порта игра переведена за существующий Nginx на порт 80; порт контейнера теперь привязан к loopback. После мягкой перезагрузки Nginx внешний запрос к странице и `/api/health` по `http://138.199.144.94/` вернул HTTP 200. TCP `14173` у провайдера открывать не требуется.

Существующие Nginx virtual hosts не редактировались; добавлен отдельный файл только для Dementor Live. Перед reload `graylog.mdao.is`, `monitoring.mdao.is` и `n8n.g155333.ru` возвращали 502; после reload сохранили те же ответы. `GitLab Runner`, `db-dev`, `project-dev`, `/data/*`, `/srv/dementor/stage-a` и прочие приложения не менялись. Системные обновления не запускались, VM не перезагружалась. Docker volume `dementor-live-world` не менялся и после пересоздания контейнера сохранил данные.

## Запуск и обновление

```sh
cd /srv/dementor-live/app
docker compose -f deploy/compose.yaml --env-file deploy/.env ps
docker compose -f deploy/compose.yaml --env-file deploy/.env logs --tail=80 game
```

Для обновления сначала сделать датированную копию `dementor-live-world`, затем заменить только код и выполнить `docker compose -f deploy/compose.yaml --env-file deploy/.env up -d --build game`. Не использовать `down -v`, глобальные prune-команды, системные рестарты или команды к другим Compose-проектам.
