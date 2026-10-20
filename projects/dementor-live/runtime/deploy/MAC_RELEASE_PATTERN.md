# Dementor Live · проверенный SSH/деплой паттерн с Mac

## Параметры (подтверждены 20.10.2026)
- Mac login: `nacBOOKr`
- Приватный SSH-ключ **только на Mac**: `/Users/nacBOOKr/Downloads/dementor_server`
- SSH: `root@138.199.144.94`, стандартный порт 22; прежний успешный статус `SSH_CONNECTED`.
- Сервер приложения: `/srv/dementor-live/app`; отдельные релизные checkout: `/srv/dementor-live/releases/rc4-<SHA-prefix>`.
- Compose project `dementor-live`, game service `game`, том `dementor-live-world`, URL health `http://138.199.144.94/api/health`.
- Сохранять мир и инвентарь, не делать `down -v` или `--reset-world`.

## Единственный запуск с Mac
Скачай `deploy/mac-safe-release.sh` из этой ops-ветки в `~/Downloads/dementor-live-publish.sh` и запусти `bash ~/Downloads/dementor-live-publish.sh`. При повторной публикации используй ту же команду запуска, предварительно заменив зафиксированный релизный SHA и CI IDs новой проверенной версии в скрипте.

### Порядок
1. Локальная проверка **только** 1 проверенного ключа, включая права 600 и публичный fingerprint; никакой подбор ключей, никакого пароля, no retries.
2. GitHub `branch HEAD == approved SHA` и 5 полных `Actions SUCCESS` с тем же SHA.
3. Проверка текущей публичной версии; ровно один SSH-вход с BatchMode и IdentitiesOnly.
4. Изолированный checkout строго SHA, локальная целостность, `check:release`, `publish-preserve-world.sh --dry-run`.
5. `--apply SHA`: сборка образа без живого тома, сохранение старого образа, остановка игры, полный архив существующего `dementor-live-world` + `world.json`, read-only audit копии мира, переключение game service, проверка health/index/icon endpoints. При ошибке после переключения откат образа и данных.
6. Публичный health с Mac должен содержать утверждённую версию; сервер хранит `backups/safe-.../release-manifest.txt`.

**Важно:** Убедиться, что игроки вышли до запуска. Данные для SSH в репозитории — только относительные пути и имя файла; приватный ключ никогда не коммитить и не загружать. При новом релизе изменяются только SHA, ветка, версия и IDs успешных CI, а сам паттерн повторно используется.

## Ошибки, которые уже исключены
- Не вводить `ssh root@138.199.144.94` без `-i "$HOME/Downloads/dementor_server"`: иначе SSH перебирает неправильные идентичности.
- Если GitHub Actions `in_progress`/`failure` — **никакого SSH**.
- Не добавлять `|| exit 1` в интерактивную команду Mac: она закрывает терминал; остановкой управляет только дочерний Bash-скрипт.
- Не вводить в терминал Markdown-ссылки вида `[https://...](https://...)`: только чистые команды.


## Инцидент 20.10.2026 — подтверждённое исправление
- Предыдущий запуск на `970882d` корректно остановился при несовместимых координатах сохранённого персонажа в P4/P5.
- Backup from the frozen volume: `/srv/dementor-live/backups/safe-20261020T180923Z-970882dee4/world.json`; old container restored and public health reports RC2.
- Hotfix game branch `hotfix/dementor-live-rc4-saved-resident-recovery-2026-10-20`, SHA `a38a03e68fcec5ceac45c0c362436ee6d69d5c5d` adds deterministic collision migration and append-only ledger without changing wallets/bags/land.
- Before *any downtime*, the one-command deploy builds a clean candidate image and runs `upgrade-audit.mjs` on this REAL FROZEN BACKUP as readonly Docker bind. Missing backup or failed migration = STOP WITHOUT INTERRUPTING THE LIVE GAME.
- New candidate requires all five exact-SHA green CI runs and fresh backup + audit before cutover, with rollback guards preserved.
