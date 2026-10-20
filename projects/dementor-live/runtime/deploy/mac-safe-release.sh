#!/usr/bin/env bash
# Dementor Live: one-command, single-key, save-preserving production release from the user's Mac.
# Key stays on Mac. Release code stays immutable at EXACT_RELEASE_SHA.
# Bash 3.2 compatible (macOS default).
set -Eeuo pipefail

REPO="SLADZARI/degradation_club"
HOST="138.199.144.94"
USER_NAME="root"
RELEASE_BRANCH="hotfix/dementor-live-rc4-saved-resident-recovery-2026-10-20"
EXACT_RELEASE_SHA="a38a03e68fcec5ceac45c0c362436ee6d69d5c5d"
EXPECTED_VERSION="0.5.0-rc.4"
RUNS=(39473604439 39473604350 39473604513 39473604305 39473604530)

info(){ printf '\n== %s ==\n' "$*"; }
stop(){ printf '\nSTOP: %s\n' "$*" >&2; return 1; }
for cmd in curl python3 ssh ssh-keygen; do
  command -v "$cmd" >/dev/null 2>&1 || { stop "На Mac отсутствует: $cmd"; exit 1; }
done

info "Проверяем ровно один SSH-ключ, локально (без попыток входа)"
SSH_KEY=""
if [ -n "${DEMENTOR_SSH_KEY:-}" ]; then
  [ -f "$DEMENTOR_SSH_KEY" ] || { stop "Указанный ключ DEMENTOR_SSH_KEY не найден"; exit 1; }
  SSH_KEY="$DEMENTOR_SSH_KEY"
else
  for candidate in "$HOME/Downloads/dementor_server" "$HOME/Downloads/dementor_server.pem" "$HOME/.ssh/dementor_server"; do
    if [ -f "$candidate" ]; then SSH_KEY="$candidate"; break; fi
  done
fi
if [ -z "$SSH_KEY" ]; then
  printf 'Известные пути пусты. Возможные файлы на Mac:\n'
  for dir in "$HOME/Downloads" "$HOME/.ssh"; do
    if [ -d "$dir" ]; then
      find "$dir" -maxdepth 3 -type f \( -name 'dementor_server' -o -name 'dementor_server.pem' \) -print
    fi
  done
  stop 'SSH-ключ не найден. Не пробуем неизвестные ключи на сервере.'
  exit 1
fi
chmod 600 "$SSH_KEY" || { stop "Не удаётся установить права 600 для ключа"; exit 1; }
ssh-keygen -lf "$SSH_KEY" || { stop "Ключ не читается. Не выполняем SSH-подключение."; exit 1; }
printf 'Рабочий путь: %s\n' "$SSH_KEY"

info "Проверка релизного SHA и пяти CI — без SSH"
BRANCH_URL="https://api.github.com/repos/$REPO/branches/$RELEASE_BRANCH"
curl --connect-timeout 10 --max-time 20 -fsSL "$BRANCH_URL" |
  python3 -c 'import json,sys; d=json.load(sys.stdin); assert d["commit"]["sha"]==sys.argv[1], "STOP: релизная ветка изменилась"; print("Релизная ветка совпадает с SHA")' "$EXACT_RELEASE_SHA" ||
  { stop 'Нельзя продолжать: SHA ветки не совпадает'; exit 1; }

for run_id in "${RUNS[@]}"; do
  curl --connect-timeout 10 --max-time 20 -fsSL "https://api.github.com/repos/$REPO/actions/runs/$run_id" |
    python3 -c 'import json,sys; d=json.load(sys.stdin); assert d.get("head_sha")==sys.argv[1], "STOP: SHA теста не совпадает"; assert d.get("conclusion")=="success", "STOP: тест не PASS: "+str(d.get("conclusion")); print("PASS:",d.get("name","CI"))' "$EXACT_RELEASE_SHA" ||
    { stop "Тест $run_id не прошёл — сервер не трогаем"; exit 1; }
done

info "Проверка опубликованной версии, без SSH"
curl --connect-timeout 10 --max-time 15 -fsS "http://$HOST/api/health" || { stop 'Публичный health недоступен'; exit 1; }
printf '\n'

info "Один SSH-вход с подтверждённым ключом; пароли запрещены"
SSH_OPTS=(
  -i "$SSH_KEY"
  -o BatchMode=yes
  -o IdentitiesOnly=yes
  -o PreferredAuthentications=publickey
  -o PasswordAuthentication=no
  -o KbdInteractiveAuthentication=no
  -o NumberOfPasswordPrompts=0
  -o ConnectTimeout=12
  -o ConnectionAttempts=1
  -o StrictHostKeyChecking=accept-new
)
# Exactly one authentication attempt. If it fails, no retries or key guessing.
ssh "${SSH_OPTS[@]}" "$USER_NAME@$HOST" bash -se -- "$EXACT_RELEASE_SHA" "$RELEASE_BRANCH" "$EXPECTED_VERSION" <<'SERVER'
set -Eeuo pipefail
SHA="$1"
BRANCH="$2"
VERSION="$3"
REPO="https://github.com/SLADZARI/degradation_club.git"
DIR="/srv/dementor-live/releases/rc4-${SHA:0:12}"

command -v git >/dev/null && command -v docker >/dev/null || { echo 'STOP: git/docker отсутствуют'; exit 1; }
mkdir -p "$(dirname "$DIR")"
if [ ! -d "$DIR/.git" ]; then
  git clone --depth 1 --single-branch --branch "$BRANCH" "$REPO" "$DIR"
fi
[ "$(git -C "$DIR" rev-parse HEAD)" = "$SHA" ] || { echo "STOP: checkout не соответствует одобренному SHA"; exit 1; }
cd "$DIR/projects/dementor-live/runtime"
[ -f deploy/publish-preserve-world.sh ] || { echo 'STOP: нет безопасного скрипта деплоя'; exit 1; }
[ "$(node -p "require('./package.json').version" 2>/dev/null || sed -n 's/.*"version": "\([^"]*\)".*/\1/p' package.json | head -1)" = "$VERSION" ] || { echo 'STOP: версия не совпадает'; exit 1; }

echo 'Проверка набора файлов релиза'
docker run --rm -v "$PWD:/work:ro" -w /work node:22-bookworm-slim npm run check:release

echo 'Проверка Docker, тома и окружения без изменений'
bash deploy/publish-preserve-world.sh --dry-run

echo '=== Проверяем предыдущую настоящую резервную копию БЕЗ остановки работающего сервера ==='
# This immutable file was created by the failed (safely rolled back) RC4 attempt.
LAST_FROZEN_BACKUP="/srv/dementor-live/backups/safe-20261020T180923Z-970882dee4/world.json"
[ -s "$LAST_FROZEN_BACKUP" ] || { echo 'STOP: проверенная сохранённая копия не найдена; боевой сервер не трогаем'; exit 1; }
PREVIEW_IMAGE="dementor-live:preflight-$SHA"
docker build --quiet -t "$PREVIEW_IMAGE" -f deploy/Dockerfile .
docker run --rm --entrypoint node \
  --mount "type=bind,source=$LAST_FROZEN_BACKUP,target=/readonly/world.json,readonly" \
  "$PREVIEW_IMAGE" tools/upgrade-audit.mjs /readonly/world.json
echo '=== PASS: предыдущая резервная копия совместима. Теперь создадим свежую после остановки игры ==='
echo 'Сборка, остановка игры, полная копия world.json и тома, миграционная проверка, публикация, автоматический откат при ошибке'
bash deploy/publish-preserve-world.sh --apply "$SHA"
SERVER

info "Проверяем опубликованную версию с Mac"
curl --connect-timeout 10 --max-time 20 -fsS "http://$HOST/api/health" |
  python3 -c 'import json,sys; s=json.load(sys.stdin); assert s.get("ok") is True and s.get("testMode") is False and s.get("version")==sys.argv[1], "STOP: публичная версия не соответствует релизу: "+str(s); print("PRODUCTION PASS:",s)' "$EXPECTED_VERSION"

printf '\nГОТОВО: боевой сервер подтверждён, релиз %s, SHA %s\n' "$EXPECTED_VERSION" "$EXACT_RELEASE_SHA"
printf 'Сервер хранит манифест и полный архив в /srv/dementor-live/backups.\n'
