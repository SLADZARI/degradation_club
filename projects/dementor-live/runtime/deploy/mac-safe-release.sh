#!/usr/bin/env bash
# Dementor Live: one-command, single-key, save-preserving production release from the user's Mac.
# Key stays on Mac. Release code stays immutable at EXACT_RELEASE_SHA.
# Bash 3.2 compatible (macOS default).
set -Eeuo pipefail

REPO="SLADZARI/degradation_club"
HOST="138.199.144.94"
USER_NAME="root"
# Only enumerated exact-source profiles may be used. The default remains
# the historical resident-recovery workflow; H0 requires explicit opt-in.
RELEASE_PROFILE="${DEMENTOR_RELEASE_PROFILE:-resident-recovery}"
case "$RELEASE_PROFILE" in
  resident-recovery)
    RELEASE_BRANCH="hotfix/dementor-live-rc4-saved-resident-recovery-2026-10-20"
    EXACT_RELEASE_SHA="a38a03e68fcec5ceac45c0c362436ee6d69d5c5d"
    RUNS=(39473604439 39473604350 39473604513 39473604305 39473604530)
    ;;
  h0-v3)
    RELEASE_BRANCH="fix/dementor-live-v3-icon-static-http-20261020"
    EXACT_RELEASE_SHA="6d09e9828a549b6ce64a354c5f7bf0a29717a700"
    # Six required exact-SHA groups, including seven sequential gates. Fail
    # closed if ANY workflow is pending, failed, or attached to another SHA.
    RUNS=(39564570805 39564570819 39564570767 39564570839 39564570774 39564570818)
    ;;
  *)
    echo "STOP: unknown release profile; only resident-recovery or h0-v3" >&2
    exit 2
    ;;
esac
EXPECTED_VERSION="0.5.0-rc.4"

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
# Read-only key validation. SSH itself rejects unsafe key permissions; never chmod user credentials here.
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
  -o StrictHostKeyChecking=yes
)
# Exactly one authentication attempt. If it fails, no retries or key guessing.
ssh "${SSH_OPTS[@]}" "$USER_NAME@$HOST" bash -se -- "$EXACT_RELEASE_SHA" "$RELEASE_BRANCH" "$EXPECTED_VERSION" "${DEMENTOR_GO_SHA:-}" "${DEMENTOR_NO_PLAYERS_GO:-}" <<'SERVER'
set -Eeuo pipefail
SHA="$1"
BRANCH="$2"
VERSION="$3"
OWNER_GO_SHA="${4:-}"
NO_PLAYERS_GO="${5:-}"
REPO="https://github.com/SLADZARI/degradation_club.git"
DIR="/srv/dementor-live/releases/rc4-${SHA:0:12}"

# FIRST inspect the running game image/receipt without changing VM files or
# creating a container. Owner GO is not required for exact-SHA attestation.
command -v docker >/dev/null || { echo 'STOP: Docker absent'; exit 1; }
echo '=== Read-only exact-SHA attestation (no VM writes) ==='
RUNNING_CID="$(docker ps --quiet --filter label=com.docker.compose.project=dementor-live --filter label=com.docker.compose.service=game)"
RUNNING_COUNT="$(docker ps --quiet --filter label=com.docker.compose.project=dementor-live --filter label=com.docker.compose.service=game | wc -l | tr -d ' ')"
[ "$RUNNING_COUNT" = 1 ] || { echo 'STOP: unexpected running game container count'; exit 1; }
RUNNING_IMAGE="$(docker inspect --format '{{.Image}}' "$RUNNING_CID")"
EXPECTED_IMAGE="$(docker image inspect --format '{{.Id}}' "dementor-live:sha-$SHA" 2>/dev/null || true)"
LAST_RECEIPT="$(find /srv/dementor-live/backups -mindepth 2 -maxdepth 2 -type f -name release-manifest.txt -print | LC_ALL=C sort | tail -n 1)"
RECEIPT_SHA=""
if [ -n "$LAST_RECEIPT" ]; then
  RECEIPT_SHA="$(awk -F= '$1=="approved_sha" {print $2;exit}' "$LAST_RECEIPT")"
fi
echo "running_image_id=$RUNNING_IMAGE"
echo "expected_sha=$SHA"
if [ -n "$EXPECTED_IMAGE" ] && [ "$RUNNING_IMAGE" = "$EXPECTED_IMAGE" ]; then
  if [ "$RECEIPT_SHA" != "$SHA" ]; then
    echo 'STOP: matching image but missing/mismatched successful release receipt; do not redeploy'
    exit 1
  fi
  echo 'ALREADY DEPLOYED: running image and latest successful receipt match exact SHA; no changes'
  exit 0
fi
[ "$OWNER_GO_SHA" = "$SHA" ] || { echo 'STOP: explicit exact-SHA owner GO required; no changes'; exit 1; }
[ "$NO_PLAYERS_GO" = "yes" ] || { echo 'STOP: owner has not confirmed player-free window; no changes'; exit 1; }
echo 'GO accepted for exact SHA and player-free maintenance window'
# Never create release directories, clone Git, run Docker containers or build
# images until BOTH approvals above succeed. The ALREADY DEPLOYED path returns
# before reaching any of the commands below.
command -v git >/dev/null || { echo 'STOP: Git absent'; exit 1; }
mkdir -p "$(dirname "$DIR")"
if [ ! -d "$DIR/.git" ]; then
  git clone --depth 1 --single-branch --branch "$BRANCH" "$REPO" "$DIR"
fi
[ "$(git -C "$DIR" rev-parse HEAD)" = "$SHA" ] || { echo 'STOP: checkout does not match approved SHA'; exit 1; }
cd "$DIR/projects/dementor-live/runtime"
[ -f deploy/publish-preserve-world.sh ] || { echo 'STOP: safe publisher not found'; exit 1; }
[ "$(node -p "require('./package.json').version" 2>/dev/null || sed -n 's/.*"version": "\([^"]*\)".*/\1/p' package.json | head -1)" = "$VERSION" ] || { echo 'STOP: release version mismatch'; exit 1; }
echo 'Inspecting release files in a throwaway candidate container (after owner GO)'
docker run --rm -v "$PWD:/work:ro" -w /work node:22-bookworm-slim npm run check:release
echo 'Preflight live Docker/volume config (no apply)'
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
