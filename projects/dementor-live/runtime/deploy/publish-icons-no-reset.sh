#!/usr/bin/env bash
# Graphic-only rollout from a verified portable release; never reset player/world saves.
# Run on the existing game VM from a separate extracted runtime:
# bash deploy/publish-icons-no-reset.sh --preserve-world
set -Eeuo pipefail
[[ "${1:-}" == "--preserve-world" ]] || { echo 'Use: bash deploy/publish-icons-no-reset.sh --preserve-world'; exit 2; }
SOURCE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
APP=/srv/dementor-live/app
ENV="$APP/deploy/.env"
COMPOSE="$APP/deploy/compose.yaml"
PROJECT=dementor-live
VOLUME=dementor-live-world
SERVICE=game
BASE=http://138.199.144.94
VERSION=0.4.0-world-p0
ATLAS_SHA=607e40f07a2695148ecbb8e541ec234eeeb92de7a223a26438d754d104576193
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
CANDIDATE="dementor-live:paper-icons-$STAMP"
OLD="dementor-live:pre-paper-icons-$STAMP"
BACKUP="/srv/dementor-live/icon-backups/$STAMP"
ROLLBACK=0

fail(){ echo "STOP: $*" >&2; exit 1; }
for bin in docker node curl sha256sum tar grep; do command -v "$bin" >/dev/null || fail "Missing $bin"; done
[[ "$SOURCE" != "$APP" ]] || fail 'Use a separate staging runtime, not the live app'
[[ -d "$APP" && -f "$ENV" && -f "$COMPOSE" ]] || fail 'Existing app/environment unavailable'
[[ -f "$SOURCE/deploy/Dockerfile" ]] || fail 'Candidate Dockerfile missing'
[[ -f "$SOURCE/public/paper-icons.js" ]] || fail 'Candidate JS adapter missing'
[[ -f "$SOURCE/public/assets/paper-icons/paper_atlas_64_indexed.png" ]] || fail 'Candidate atlas missing'
[[ "$(sha256sum "$SOURCE/public/assets/paper-icons/paper_atlas_64_indexed.png" | cut -d' ' -f1)" == "$ATLAS_SHA" ]] || fail 'Approved atlas hash differs'
grep -Fq '"version": "0.4.0-world-p0"' "$SOURCE/package.json" || fail 'Unexpected runtime version'
node "$SOURCE/tools/verify-paper-icons.mjs" || fail 'Not all approved images are installed'
docker volume inspect "$VOLUME" >/dev/null || fail 'Existing world volume is missing'
docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV" config --services | grep -qx "$SERVICE" || fail 'Unexpected Compose service'
CONTAINER="$(docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV" ps -q "$SERVICE")"
[[ -n "$CONTAINER" ]] || fail 'Running game container not found'
[[ "$(docker inspect "$CONTAINER" --format '{{index .Config.Labels "com.docker.compose.project"}}')" == "$PROJECT" ]] || fail 'Wrong Compose project'
[[ "$(docker inspect "$CONTAINER" --format '{{index .Config.Labels "com.docker.compose.service"}}')" == "$SERVICE" ]] || fail 'Wrong Compose service'
docker image inspect dementor-live:local >/dev/null || fail 'Old image unavailable'
HEALTH="$(curl -fsS --max-time 7 "$BASE/api/health")" || fail 'Current game health is unreachable'
[[ "$HEALTH" == *'"version":"0.4.0-world-p0"'* ]] || fail 'Unexpected live game version'
echo 'PRECHECK PASS: exact artwork, Compose scope, running game and existing save volume'
echo 'BUILD: old game remains online. Docker has no access to game data volume during image build.'
find "$SOURCE" -type f -name '._*' -delete
docker build -t "$CANDIDATE" -f "$SOURCE/deploy/Dockerfile" "$SOURCE"
docker tag dementor-live:local "$OLD"
umask 077
mkdir -p "$BACKUP"
tar -czf "$BACKUP/previous-runtime.tgz" -C "$APP" --exclude='./data' --exclude='./node_modules' --exclude='./reports' .
echo "BACKUP: previous code at $BACKUP (game saves remain in $VOLUME)"

rollback(){
  code=$?
  trap - ERR
  set +e
  if (( ROLLBACK )); then
    echo 'ROLLBACK: restoring previous GAME CODE/IMAGE ONLY; saved world volume remains untouched'
    tar -xzf "$BACKUP/previous-runtime.tgz" -C "$APP"
    docker tag "$OLD" dementor-live:local
    docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV" up -d --no-deps --no-build --force-recreate "$SERVICE"
    echo 'Rollback requested; manually inspect health and icon endpoints'
  fi
  exit "$code"
}
trap rollback ERR
ROLLBACK=1
# Portable release excludes deploy/.env, and game data lives in its unchanged Docker volume.
cp -a "$SOURCE/." "$APP/"
docker tag "$CANDIDATE" dementor-live:local
docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV" up -d --no-deps --no-build --force-recreate "$SERVICE"
READY=0
for i in {1..45}; do
  if curl -fsS --max-time 4 "$BASE/api/health" | grep -Fq '"version":"0.4.0-world-p0"' &&
     curl -fsS --max-time 8 "$BASE/assets/paper-icons/paper_atlas_64_indexed.png" | sha256sum | grep -q "^$ATLAS_SHA " &&
     curl -fsS --max-time 5 "$BASE/paper-icons.js" | grep -q 'PaperIcons'; then
    READY=1;break
  fi
  sleep 1
done
[[ "$READY" == 1 ]] || { echo 'Icon endpoint health failed'; false; }
ROLLBACK=0
trap - ERR
echo "PASS: $BASE serves approved Paper Cut UI Icons v1, 20/20 atlas SHA $ATLAS_SHA"
echo 'PASS: existing Dementor Live world volume preserved; no --reset-world, no down -v'
docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV" ps "$SERVICE"
