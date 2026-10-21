#!/usr/bin/env bash
# Game-only safe canary deployment. NEVER resets or initializes the existing production volume.
# Run on the game VM from a SEPARATE immutable checkout.
# bash deploy/publish-preserve-world.sh --dry-run
# bash deploy/publish-preserve-world.sh --apply <approved full 40-character commit SHA>
# bash deploy/publish-preserve-world.sh --apply-fresh <approved full 40-character commit SHA> (archive old world, start a new one)
set -Eeuo pipefail
MODE="${1:---dry-run}"
SOURCE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
APP=/srv/dementor-live/app
ENV_FILE="$APP/deploy/.env"
COMPOSE="$APP/deploy/compose.yaml"
PROJECT=dementor-live
SERVICE=game
VOLUME=dementor-live-world
BACKUP_ROOT=/srv/dementor-live/backups
PORT=14173
fail(){ echo "STOP: $*" >&2; exit 2; }
for dep in docker git curl awk tar grep;do command -v "$dep" >/dev/null || fail "Missing $dep";done
[[ "$SOURCE" != "$APP" ]] || fail 'Do not deploy from the live app directory'
[[ -f "$ENV_FILE" && -f "$COMPOSE" && -f "$SOURCE/package.json" ]] || fail 'Missing live config or release source'
[[ "${MODE}" == "--dry-run" || "${MODE}" == "--apply" || "${MODE}" == "--apply-fresh" ]] || fail 'Only --dry-run, --apply or --apply-fresh is supported'
[[ "${2:-}" == "" || "${2}" =~ ^[0-9a-f]{40}$ ]] || fail 'Supply a full Git commit SHA'
ACTUAL_SHA="$(git -C "$SOURCE" rev-parse HEAD)"
EXPECTED_VERSION="$(awk -F'"' '/"version"/ {print $4; exit}' "$SOURCE/package.json")"
[[ "$EXPECTED_VERSION" != "" ]] || fail 'No package version'
docker volume inspect "$VOLUME" >/dev/null || fail 'Existing world volume missing; do not create a new world'
docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" config --services | grep -qx "$SERVICE" || fail 'Game Compose service not found'
CONTAINER="$(docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" ps -q "$SERVICE")"
[[ -n "$CONTAINER" ]] || fail 'Existing game container missing'
[[ "$(docker inspect "$CONTAINER" --format '{{index .Config.Labels "com.docker.compose.project"}}')" == "$PROJECT" ]] || fail 'Unexpected container owner'
[[ "$(docker inspect "$CONTAINER" --format '{{index .Config.Labels "com.docker.compose.service"}}')" == "$SERVICE" ]] || fail 'Unexpected container service'
docker image inspect dementor-live:local >/dev/null || fail 'Existing game image not present'
# Public origin is already configured in the running container. Loopback:14173 is
# a Docker proxy port, NOT an allowed HTTP Host on the application port 4173.
PUBLIC_URL="$(docker inspect "$CONTAINER" --format '{{range .Config.Env}}{{println .}}{{end}}' | awk -F= '$1=="DEMENTOR_PUBLIC_URL"{sub(/^[^=]*=/,"");print;exit}')"
[[ "$PUBLIC_URL" =~ ^https?://[^/]+/?$ ]] || fail 'Current container has no valid DEMENTOR_PUBLIC_URL'
PUBLIC_HOST="${PUBLIC_URL#*://}"
PUBLIC_HOST="${PUBLIC_HOST%%/*}"
LOCAL_URL="http://127.0.0.1:$PORT"
echo "CHECK: source=$ACTUAL_SHA version=$EXPECTED_VERSION existing container=$CONTAINER volume=$VOLUME"
echo "LIVE HEALTH: $(curl --max-time 5 -fsS -H "Host: $PUBLIC_HOST" "$LOCAL_URL/api/health" || echo 'unavailable')"
if [[ "$MODE" == "--dry-run" ]];then
 echo 'DRY RUN PASS: no container, volume or save modified. To deploy, provide --apply and exact commit SHA.'
 exit 0
fi
[[ "$MODE" == "--apply" || "$MODE" == "--apply-fresh" ]] || fail 'Only --dry-run, --apply or --apply-fresh is supported'
[[ "${2:-}" == "$ACTUAL_SHA" ]] || fail 'Approved SHA must match the checkout exactly'
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP="$BACKUP_ROOT/safe-$STAMP-${ACTUAL_SHA:0:10}"
mkdir -p "$BACKUP"
OLD_IMAGE="dementor-live:before-safe-$STAMP"
NEW_IMAGE="dementor-live:sha-$ACTUAL_SHA"
STOPPED=0
CUTOVER=0
rollback(){
 status=$?
 trap - EXIT
 set +e
 if [[ "$CUTOVER" == 1 ]];then
   echo 'Candidate failed: restoring previous image AND full game volume archive'
   docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" stop "$SERVICE"
   docker run --rm --user 0 --entrypoint sh \
     --mount "type=volume,source=$VOLUME,target=/world" \
     --mount "type=bind,source=$BACKUP,target=/backup,readonly" "$OLD_IMAGE" \
     -c 'test -s /backup/full-world.tar.gz && cd /world && find . -mindepth 1 -maxdepth 1 -exec rm -rf -- {} + && tar -xzf /backup/full-world.tar.gz'
   docker tag "$OLD_IMAGE" dementor-live:local
 fi
 if [[ "$STOPPED" == 1 ]];then
   docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" up -d --no-deps --no-build --force-recreate "$SERVICE"
 fi
 echo "STOP: deployment failed, check old health and restore: $BACKUP"
 exit "$status"
}
trap rollback EXIT
# Verify candidate builds with no production save mounted.
docker build --tag "$NEW_IMAGE" --file "$SOURCE/deploy/Dockerfile" "$SOURCE"
# Retain the exact approved Paper Cut UI v2 assets from the currently live 0.4.1 build.
docker run --rm --entrypoint node "$NEW_IMAGE" tools/verify-paper-icons-v2.mjs
docker tag dementor-live:local "$OLD_IMAGE"
echo "CANDIDATE built: $NEW_IMAGE. Stopping game to freeze its authoritative state."
STOPPED=1
docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" stop "$SERVICE"
# Backup entire world volume including music, then a separate pristine world.json for audit.
docker run --rm --user 0 --entrypoint sh \
  --mount "type=volume,source=$VOLUME,target=/world,readonly" \
  --mount "type=bind,source=$BACKUP,target=/backup" "$OLD_IMAGE" \
  -c 'test -s /world/world.json && cp -p /world/world.json /backup/world.json && cd /world && tar -czf /backup/full-world.tar.gz .'
test -s "$BACKUP/world.json" && test -s "$BACKUP/full-world.tar.gz"
# Read-only rehydration of the REAL backed-up world in a throwaway new-code container.
docker run --rm --entrypoint node \
  --mount "type=bind,source=$BACKUP,target=/backup,readonly" "$NEW_IMAGE" \
  tools/upgrade-audit.mjs /backup/world.json | tee "$BACKUP/upgrade-audit.json"
grep -q '"status": "PASS_READ_ONLY"' "$BACKUP/upgrade-audit.json"
echo "World backup and compatibility gate PASS: $BACKUP"
# Fresh mode removes only world.json after the full volume archive is verified. Rollback restores that archive.
if [[ "$MODE" == "--apply-fresh" ]];then
 CUTOVER=1
 docker run --rm --user 0 --entrypoint sh \
   --mount "type=volume,source=$VOLUME,target=/world" "$NEW_IMAGE" \
   -c 'test -s /world/world.json && rm -f /world/world.json /world/world.json.tmp'
 echo "FRESH START: previous world archived at $BACKUP; creating a new empty-start world."
fi
# Only the approved named game image/service will change. /app/data mounts the original persistent volume.
CUTOVER=1
docker tag "$NEW_IMAGE" dementor-live:local
docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" up -d --no-deps --no-build --force-recreate "$SERVICE"
READY=0
for i in $(seq 1 40);do
 if curl --max-time 3 -fsS -H "Host: $PUBLIC_HOST" "$LOCAL_URL/api/health" | grep -Fq "\"version\":\"$EXPECTED_VERSION\"";then READY=1;break;fi
 sleep 1
done
[[ "$READY" == 1 ]] || fail 'New game health/version check failed'
curl --max-time 5 -fsS -H "Host: $PUBLIC_HOST" "$LOCAL_URL/" >/dev/null || fail 'Game index route unavailable'
for icon in /paper-icons.js /paper-icons.css /assets/paper-icons/paper_atlas_64.png /assets/paper-icons/png_256/wood.png;do
  curl --max-time 5 -fsS -H "Host: $PUBLIC_HOST" "$LOCAL_URL$icon" >/dev/null || fail "Canonical icon asset missing after cutover: $icon"
done
docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" ps "$SERVICE"
printf 'approved_sha=%s\nversion=%s\nbackup=%s\n' "$ACTUAL_SHA" "$EXPECTED_VERSION" "$BACKUP" > "$BACKUP/release-manifest.txt"
CUTOVER=0;STOPPED=0;trap - EXIT
if [[ "$MODE" == "--apply-fresh" ]];then
 echo "DEPLOYED with a new empty-start world. Full previous world archive: $BACKUP/full-world.tar.gz"
else
 echo "DEPLOYED safely. Live player save remains in $VOLUME. Backup: $BACKUP"
fi
echo 'Retain old image and full backup. Do not run publish-clean-world.sh --reset-world.'
