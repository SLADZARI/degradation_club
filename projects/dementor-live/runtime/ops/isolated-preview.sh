#!/usr/bin/env bash
# Dementor Live 0.2.0. Safe, fail-closed isolated installation on the OWNED Ubuntu VPS.
# Run on the VPS as root: bash isolated-preview.sh preflight | install | status
# Only creates /srv/dementor/live-preview; never edits /data, nginx, other Docker containers,
# systemd units, TLS certificates, host firewall, or ports 80/443/18080.
set -Eeuo pipefail
MODE="${1:-preflight}"
ROOT="/srv/dementor/live-preview"
NAME="dementor-live-preview-020"
PORT="14173"
REF="docs/dementor-live-city-ownership-and-wilderness-01"
COMMIT="1ffbf5095605f381f06e82168c713aa238d7e9b9"
REPO="https://github.com/SLADZARI/degradation_club.git"
IMAGE="node:22-alpine"
CODE="$ROOT/repo"
RUNTIME="$CODE/projects/dementor-live/runtime"
STATE_DIR="$ROOT/private-data"

die(){ printf 'BLOCKED: %s\n' "$*" >&2; exit 2; }
say(){ printf '[DL-PREVIEW] %s\n' "$*"; }
require(){ command -v "$1" >/dev/null 2>&1 || die "Missing prerequisite: $1"; }

audit(){
  [[ "$EUID" -eq 0 ]] || die "Run via SSH as root for permission checks."
  [[ -d /srv/dementor ]] || die "/srv/dementor missing; will not create outside established service root."
  for tool in git docker ss df awk curl; do require "$tool"; done
  docker info >/dev/null 2>&1 || die "Docker daemon unavailable"
  [[ ! -e "$ROOT" ]] || die "$ROOT already exists; do not overwrite an existing install"
  [[ -z "$(ss -H -ltn "sport = :$PORT")" ]] || die "Port $PORT is already listening"
  ! docker container inspect "$NAME" >/dev/null 2>&1 || die "Container $NAME already exists"
  [[ "$(df -Pk /srv/dementor | awk 'END {print $4}')" -gt 3145728 ]] || die "Less than 3 GiB free"
  say "Preflight PASS. No files/containers/services changed."
  say "Target: $ROOT; container: $NAME; host binds 127.0.0.1:$PORT only."
  say "Nginx, /data, Stage A, 80/443 and existing containers are untouched."
}

install(){
  audit
  say "Creating only $ROOT and isolated subdirectories"
  umask 022
  mkdir -p "$ROOT"
  git clone --depth 1 --filter=blob:none --sparse --single-branch -b "$REF" "$REPO" "$CODE" \
    || die "GitHub clone failed: check repository read access; no other services affected"
  git -C "$CODE" sparse-checkout set projects/dementor-live/runtime
  # Lock GAME CODE to the verified release commit, not the newer documentation tip.
  git -C "$CODE" fetch --depth 1 origin "$COMMIT" \
    || die "Pinned release commit is not reachable; no server launched"
  git -C "$CODE" checkout --detach "$COMMIT" \
    || die "Could not check out the pinned release"
  actual="$(git -C "$CODE" rev-parse HEAD)"
  [[ "$actual" == "$COMMIT" ]] || die "Git commit changed: $actual, expected $COMMIT. Review before upgrading."
  [[ -f "$RUNTIME/server.mjs" && -f "$RUNTIME/package.json" && -d "$RUNTIME/public" ]] \
    || die "Not a runnable game package"
  mkdir -p "$RUNTIME/data" "$STATE_DIR/music"
  # Game state and user MP3 live in a NEW directory, never in the existing /data.
  chown -R 10001:10001 "$STATE_DIR"
  chmod 700 "$STATE_DIR" "$STATE_DIR/music"
  say "Fetching official Node 22 image only if not already present"
  docker image inspect "$IMAGE" >/dev/null 2>&1 || docker pull "$IMAGE"
  say "Running isolated model tests without network or live world files"
  docker run --rm --network none --read-only \
    --security-opt no-new-privileges --cap-drop ALL --user 10001:10001 \
    --tmpfs /tmp:rw,nosuid,noexec,size=32m \
    --mount "type=bind,src=$RUNTIME,dst=/app,readonly" \
    --workdir /app "$IMAGE" \
    node --test test/model.test.mjs test/life.test.mjs test/plaza.test.mjs \
    || die "Model tests failed; refusing to start application"
  [[ -z "$(ss -H -ltn "sport = :$PORT")" ]] || die "Port occupied before launch; refusing"
  ! docker container inspect "$NAME" >/dev/null 2>&1 || die "Container name taken before launch; refusing"
  say "Starting one new container. Port $PORT is bound only to 127.0.0.1."
  docker run -d --name "$NAME" --restart=no \
    --user 10001:10001 --read-only --security-opt no-new-privileges \
    --cap-drop ALL --pids-limit 128 --cpus 1 --memory 512m \
    --tmpfs /tmp:rw,nosuid,noexec,size=32m \
    --log-opt max-size=10m --log-opt max-file=3 \
    --publish "127.0.0.1:$PORT:$PORT" \
    --mount "type=bind,src=$RUNTIME,dst=/app,readonly" \
    --mount "type=bind,src=$STATE_DIR,dst=/app/data" \
    -e NODE_ENV=production -e DEMENTOR_HOST=0.0.0.0 \
    -e DEMENTOR_PORT="$PORT" -e DEMENTOR_STATE=/app/data/world.json \
    --workdir /app "$IMAGE" node server.mjs
  say "Waiting up to 20 sec for /api/health"
  ok=0
  for i in $(seq 1 20); do
    if curl --noproxy '*' -fsS "http://127.0.0.1:$PORT/api/health" >/dev/null 2>&1; then ok=1; break; fi
    sleep 1
  done
  [[ "$ok" == 1 ]] || die "Health check failed. Inspect ONLY own container: docker logs $NAME"
  say "PASS: isolated new game running. NO public port, reverse proxy or domain changed."
  say "Access from Mac through SSH tunnel: ssh -N -L $PORT:127.0.0.1:$PORT -i ~/.ssh/dementor_server root@138.199.144.94"
  say "Open http://127.0.0.1:$PORT in your Mac browser."
}

status(){
  require docker; require ss; require curl
  docker ps -a --filter "name=^/$NAME$" --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
  ss -H -ltn "sport = :$PORT" || true
  curl --noproxy '*' --max-time 3 -sS "http://127.0.0.1:$PORT/api/health" || true
  printf '\n'
}

case "$MODE" in
  preflight) audit;;
  install) install;;
  status) status;;
  *) die "Usage: bash isolated-preview.sh {preflight|install|status}";;
esac
