# Первое развёртывание Dementor Live · 18 октября 2026

## Размещение

- Версия: `0.2.1`.
- Публичный адрес: `http://138.199.144.94:14173`.
- Приложение: `/srv/dementor-live/app`.
- Compose-проект и контейнер: `dementor-live`, `dementor-live-game-1`.
- Порт: `0.0.0.0:14173 -> 4173/tcp`.
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

Из рабочей сети запрос к публичному адресу на порт `14173` истёк по времени. На VM порт слушается на `0.0.0.0`, UFW выключен, политика `INPUT` — `ACCEPT`, Docker содержит правило переадресации на контейнер. Поэтому проверь игру из другой внешней сети. Если там такой же тайм-аут, нужен просмотр входящих правил у хостинг-провайдера для TCP `14173`. Во время этого развёртывания firewall не менялся.

Nginx, GitLab Runner, `db-dev`, `project-dev`, `/data/*`, `/srv/dementor/stage-a` и прочие приложения не изменялись. Системные обновления не запускались, VM не перезагружалась. Создан только проект Dementor Live и его отдельная Docker-сеть/том.

## Запуск и обновление

```sh
cd /srv/dementor-live/app
docker compose -f deploy/compose.yaml --env-file deploy/.env ps
docker compose -f deploy/compose.yaml --env-file deploy/.env logs --tail=80 game
```

Для обновления сначала сделать датированную копию `dementor-live-world`, затем заменить только код и выполнить `docker compose -f deploy/compose.yaml --env-file deploy/.env up -d --build game`. Не использовать `down -v`, глобальные prune-команды, системные рестарты или команды к другим Compose-проектам.
