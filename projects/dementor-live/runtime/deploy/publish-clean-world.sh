#!/usr/bin/env bash
# Dementor Live ONLY: deploy World P0 from this checkout and intentionally RESET its save.
# Usage ON THE GAME VM: bash deploy/publish-clean-world.sh --reset-world
set -Eeuo pipefail

if [[ "${1:-}" != "--reset-world" ]]; then
  echo 'Usage: bash deploy/publish-clean-world.sh --reset-world' >&2
  echo 'This discards all Dementor Live player/world saves. Other Docker volumes are untouched.' >&2
  exit 2
fi

SOURCE="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
APP=/srv/dementor-live/app
ENV_FILE="$APP/deploy/.env"
COMPOSE="$APP/deploy/compose.yaml"
PUBLIC_URL=http://138.199.144.94
EXPECTED_VERSION=0.4.0-world-p0
PROJECT=dementor-live
VOLUME=dementor-live-world
SERVICE=game
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
NEW_IMAGE="dementor-live:world-p0-${STAMP}"
OLD_IMAGE="dementor-live:pre-world-p0-${STAMP}"
NEEDS_ROLLBACK=0

fail(){ echo "ERROR: $*" >&2; exit 1; }
for command in docker curl grep cp node; do
  command -v "$command" >/dev/null || fail "$command is missing on this VM"
done
[[ -f "$SOURCE/package.json" && -f "$SOURCE/deploy/Dockerfile" ]] || fail "Source must be a checked-out runtime directory"
[[ "$SOURCE" != "$APP" ]] || fail "Do not execute from the live app. Use a separate checkout"
[[ -f "$ENV_FILE" && -f "$COMPOSE" ]] || fail "Existing app or its private environment is missing"
[[ -f "$SOURCE/deploy/compose.yaml" ]] || fail "Missing new compose configuration"
grep -q '"version": "0.4.0-world-p0"' "$SOURCE/package.json" || fail "Wrong source release version"
grep -q 'name: dementor-live' "$SOURCE/deploy/compose.yaml" || fail "Wrong Compose project"
grep -q 'name: dementor-live-world' "$SOURCE/deploy/compose.yaml" || fail "Wrong named volume"
docker volume inspect "$VOLUME" >/dev/null || fail "Production volume not found; stop to avoid touching another project"
docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" config --services | grep -qx "$SERVICE" || fail "Compose service is not the expected game"
CURRENT_CONTAINER="$(docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" ps -q "$SERVICE")"
[[ -n "$CURRENT_CONTAINER" ]] || fail "Existing game container not found"
[[ "$(docker inspect "$CURRENT_CONTAINER" --format '{{index .Config.Labels "com.docker.compose.project"}}')" == "$PROJECT" ]] || fail "Unexpected Compose owner"
[[ "$(docker inspect "$CURRENT_CONTAINER" --format '{{index .Config.Labels "com.docker.compose.service"}}')" == "$SERVICE" ]] || fail "Unexpected Compose service"
docker image inspect dementor-live:local >/dev/null || fail "Expected current image dementor-live:local was not found"
echo "Existing live state: $(curl --max-time 6 -fsS "$PUBLIC_URL/api/health" || echo unavailable)"
echo 'New code verification and Docker build — old game stays online during this phase.'
# Dockerfile executes npm run doctor + npm run check; no production volume mounted during build.
docker build -t "$NEW_IMAGE" -f "$SOURCE/deploy/Dockerfile" "$SOURCE"
docker tag dementor-live:local "$OLD_IMAGE"
echo "Built candidate $NEW_IMAGE; retained old image $OLD_IMAGE."

rollback(){
  status=$?
  trap - ERR
  set +e
  if (( NEEDS_ROLLBACK )); then
    echo "Candidate failed (status $status). Attempting game-only old-image rollback."
    docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" stop "$SERVICE"
    docker tag "$OLD_IMAGE" dementor-live:local
    # Recreate an empty state again if the candidate wrote an incompatible world schema.
    docker run --rm --user 0 --entrypoint sh \
      --mount "type=volume,source=$VOLUME,target=/world" \
      "$OLD_IMAGE" -c 'find /world -maxdepth 1 -type f -name "world.json*" -delete'
    docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" up -d --no-deps --no-build --force-recreate "$SERVICE"
    echo "Rollback requested. Inspect $PUBLIC_URL/api/health manually."
  fi
  exit "$status"
}
trap rollback ERR

echo 'Starting game-only cutover. All OLD GAME WORLD/PLAYER SAVES will be removed.'
NEEDS_ROLLBACK=1
docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" stop "$SERVICE"
# Preserve upload media under /world/music; erase only old saved worlds and their temp/legacy copies.
docker run --rm --user 0 --entrypoint sh \
  --mount "type=volume,source=$VOLUME,target=/world" \
  "$NEW_IMAGE" -c 'find /world -maxdepth 1 -type f -name "world.json*" -delete'
# Do not copy deploy/.env; it remains on this VM, never committed to Git.
cp -a "$SOURCE/." "$APP/"
docker tag "$NEW_IMAGE" dementor-live:local
docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" up -d --no-deps --no-build --force-recreate "$SERVICE"

READY=0
for i in {1..30}; do
  if curl --max-time 3 -fsS "$PUBLIC_URL/api/health" | grep -q "\"version\":\"$EXPECTED_VERSION\""; then
    READY=1; break
  fi
  sleep 1
done
[[ "$READY" == 1 ]] || fail "Health did not reach $EXPECTED_VERSION"
echo "HEALTH: $(curl -fsS "$PUBLIC_URL/api/health")"
docker compose -p "$PROJECT" -f "$COMPOSE" --env-file "$ENV_FILE" ps "$SERVICE"
NEEDS_ROLLBACK=0
trap - ERR
echo "DEPLOYED: $EXPECTED_VERSION at $PUBLIC_URL"
echo 'Game save starts empty; uploaded MP3s (media, not player saves) were preserved.'
echo "Old image retained as $OLD_IMAGE for code rollback (not old player data)."
