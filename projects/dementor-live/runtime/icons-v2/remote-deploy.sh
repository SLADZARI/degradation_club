#!/usr/bin/env bash
# Game-only online publication of owner-selected v2 icons. NO world reset.
set -Eeuo pipefail
REV="$1"
[[ "$REV" =~ ^[a-f0-9]{40}$ ]] || { echo "Expected 40-char Git commit" >&2; exit 2; }
ROOT="https://raw.githubusercontent.com/SLADZARI/degradation_club/$REV/projects/dementor-live/runtime"
APP=/srv/dementor-live/app
COMPOSE="$APP/deploy/compose.yaml"
ENV_FILE="$APP/deploy/.env"
VOLUME=dementor-live-world
URL=http://138.199.144.94
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
RELEASE="/srv/dementor-live/icons-v2-online-$STAMP"
CANDIDATE="$RELEASE/candidate"
SOURCES="$RELEASE/source"
OLD_IMAGE="dementor-live:pre-icons-v2-$STAMP"
NEW_IMAGE="dementor-live:icons-v2-$STAMP"
SWITCHED=0
DONE=0
fail(){ echo "STOP: $*" >&2; exit 1; }
for exe in docker curl python3 sha256sum cp; do command -v "$exe" >/dev/null || fail "$exe unavailable"; done
[[ -f "$APP/server.mjs" && -f "$ENV_FILE" && -f "$COMPOSE" ]] || fail "live game config absent"
docker volume inspect "$VOLUME" >/dev/null || fail "dedicated game world missing"
CURRENT="$(docker compose -p dementor-live -f "$COMPOSE" --env-file "$ENV_FILE" ps -q game)"
[[ -n "$CURRENT" ]] || fail "game container missing"
[[ "$(docker inspect "$CURRENT" --format '{{index .Config.Labels "com.docker.compose.project"}}')" == dementor-live ]] || fail "unexpected Docker project"
[[ "$(docker inspect "$CURRENT" --format '{{index .Config.Labels "com.docker.compose.service"}}')" == game ]] || fail "unexpected Docker service"
docker image inspect dementor-live:local >/dev/null || fail "current game image missing"
PREVIOUS="$(curl --max-time 8 -fsS "$URL/api/health")"
[[ "$PREVIOUS" == *'"version":"0.4.0-world-p0"'* || "$PREVIOUS" == *'"version":"0.4.1-icons-v2"'* ]] || fail "unexpected current game version"
echo "Before update: $PREVIOUS"
mkdir -p "$SOURCES/icons-v2" "$SOURCES/assets-source" "$CANDIDATE"
for name in paper-icons.js paper-icons.css verify-paper-icons-v2.mjs install-v2.py; do
  echo "Fetching $name from GitHub"
  curl -fLsS --retry 3 --connect-timeout 15 --max-time 90 \
    "$ROOT/icons-v2/$name" -o "$SOURCES/icons-v2/$name"
done
echo "Fetching ORIGINAL clean v2 art directly from GitHub"
curl -fLsS --retry 3 --connect-timeout 15 --max-time 120 \
  "$ROOT/assets-source/Dementor_Live_Paper_Icons_v2_CLEAN_REVIEW.zip" \
  -o "$SOURCES/assets-source/Dementor_Live_Paper_Icons_v2_CLEAN_REVIEW.zip"
(
 cd "$SOURCES/assets-source"
 echo '930d1e390e81e3c1b2734f3abdfa7bbb52077a3feb803bb32efe6b6bd6cd533f  Dementor_Live_Paper_Icons_v2_CLEAN_REVIEW.zip' | sha256sum -c -
)
echo "Building candidate separately; live server stays up during the build."
cp -a "$APP/." "$CANDIDATE/"
find "$CANDIDATE" -type f -name '._*' -delete
python3 "$SOURCES/icons-v2/install-v2.py" "$CANDIDATE" "$SOURCES/icons-v2"
docker build -t "$NEW_IMAGE" -f "$CANDIDATE/deploy/Dockerfile" "$CANDIDATE"
docker run --rm --entrypoint node "$NEW_IMAGE" tools/verify-paper-icons-v2.mjs
echo "PASS: new image compiled, existing world volume untouched."
docker tag dementor-live:local "$OLD_IMAGE"
rollback(){
  rc=$?
  trap - EXIT
  set +e
  if [[ "$SWITCHED" == 1 && "$DONE" == 0 ]]; then
    echo "Candidate failed, restoring game-only image."
    docker tag "$OLD_IMAGE" dementor-live:local
    docker compose -p dementor-live -f "$COMPOSE" --env-file "$ENV_FILE" up -d --no-deps --no-build --force-recreate game
    echo "Rollback health: $(curl --max-time 10 -fsS "$URL/api/health")"
  fi
  exit "$rc"
}
trap rollback EXIT
SWITCHED=1
docker tag "$NEW_IMAGE" dementor-live:local
docker compose -p dementor-live -f "$COMPOSE" --env-file "$ENV_FILE" up -d --no-deps --no-build --force-recreate game
READY=0
for i in $(seq 1 50); do
  HEALTH="$(curl --max-time 3 -fsS "$URL/api/health" 2>/dev/null || true)"
  if [[ "$HEALTH" == *'"version":"0.4.1-icons-v2"'* ]] &&
     curl -fsS --max-time 4 -o /dev/null "$URL/paper-icons.js" &&
     curl -fsS --max-time 4 -o /dev/null "$URL/paper-icons.css" &&
     curl -fsS --max-time 4 -o /dev/null "$URL/assets/paper-icons/paper_atlas_64.png" &&
     curl -fsS --max-time 4 -o /dev/null "$URL/assets/paper-icons/png_256/wood.png"; then
    READY=1;break
  fi
  sleep 1
done
[[ "$READY" == 1 ]] || fail "game failed health/icon route checks"
echo "Saving icon source changes in game app directory."
for name in server.mjs package.json; do cp -a "$CANDIDATE/$name" "$APP/$name"; done
for name in index.html combat.html paper-icons.js paper-icons.css; do cp -a "$CANDIDATE/public/$name" "$APP/public/$name"; done
mkdir -p "$APP/public/assets/paper-icons" "$APP/tools"
cp -a "$CANDIDATE/public/assets/paper-icons/." "$APP/public/assets/paper-icons/"
cp -a "$CANDIDATE/tools/verify-paper-icons-v2.mjs" "$APP/tools/"
cp -a "$CANDIDATE/deploy/Dockerfile" "$APP/deploy/Dockerfile"
DONE=1
SWITCHED=0
trap - EXIT
echo "SUCCESS: $HEALTH"
echo "20 correct paper-cut v2 icons published; all world saves and other services preserved."
echo "$URL/"
