#!/usr/bin/env bash
# OPS-01 owner-authorized limited game-VM read + PRIVATE Mac-only backup copy.
# Never writes to the VM, does not run Docker or any game code on production.
# Tested Mac copy is private; never upload it to GitHub, Drive, chat or logs.
set -Eeuo pipefail
umask 077
HOST="138.199.144.94"
KEY="${DEMENTOR_SSH_KEY:-$HOME/Downloads/dementor_server}"
ID="${DEMENTOR_BACKUP_ID:-latest}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
RUNTIME="$(cd "$SCRIPT_DIR/.." && pwd -P)"
CANDIDATE="${DEMENTOR_CANDIDATE_RUNTIME:-$RUNTIME}"
MAX_GIB="${DEMENTOR_QA_MAX_ARCHIVE_GIB:-16}"
BASE="${DEMENTOR_QA_HOME:-$HOME/Library/Application Support/DementorLivePrivateQA}"
WORK=""
SUCCESS=no
fail(){ printf '%s\n' "QA_RESTORE_STOP: $*" >&2; exit 1; }
cleanup(){ if [[ "$SUCCESS" != yes && -n "$WORK" ]]; then rm -rf -- "$WORK"; fi; }
trap cleanup EXIT
for cmd in bash ssh ssh-keygen tar python3 node git shasum awk cmp; do
  command -v "$cmd" >/dev/null 2>&1 || fail "missing local prerequisite $cmd"
done
[[ -f "$KEY" && ! -L "$KEY" ]] || fail "approved local SSH key is unavailable"
ssh-keygen -lf "$KEY" >/dev/null 2>&1 || fail "local SSH key invalid"
[[ "$ID" == latest || "$ID" =~ ^safe-[A-Za-z0-9_-]{8,96}$ ]] || fail "invalid backup selector"
[[ "$MAX_GIB" =~ ^[1-9][0-9]{0,2}$ ]] || fail "invalid QA archive budget"
(( MAX_GIB <= 128 )) || fail "QA budget larger than allowed bound"
[[ "$BASE" == "$HOME/"* && ! -L "$BASE" ]] || fail "QA directory must be a non-symlink folder under Mac home"
[[ -f "$CANDIDATE/tools/upgrade-audit.mjs" ]] || fail "source candidate auditor unavailable"
[[ -f "$RUNTIME/tools/qa-restore-identity-audit.mjs" ]] || fail "OPS QA auditor unavailable"
[[ -f "$RUNTIME/tools/qa-restore-extract.py" ]] || fail "OPS safe extractor unavailable"
NODE_MAJOR="$(node -p "Number(process.versions.node.split('.')[0])")"
(( NODE_MAJOR >= 22 )) || fail "Node 22+ is required on isolated Mac"
CANDIDATE_SHA="$(git -C "$CANDIDATE" rev-parse HEAD 2>/dev/null)" || fail "candidate must be a git checkout"
[[ "$CANDIDATE_SHA" =~ ^[0-9a-f]{40}$ ]] || fail "candidate SHA unavailable"
if [[ -n "${DEMENTOR_CANDIDATE_SHA:-}" ]]; then
  [[ "$CANDIDATE_SHA" == "$DEMENTOR_CANDIDATE_SHA" ]] || fail "source candidate SHA changed; no restore"
fi
mkdir -p -- "$BASE"
chmod 700 "$BASE"
WORK="$(mktemp -d "$BASE/restore-XXXXXXXX")"
chmod 700 "$WORK"
SSH_OPTS=(-T -i "$KEY" -o BatchMode=yes -o IdentitiesOnly=yes
  -o PreferredAuthentications=publickey -o PasswordAuthentication=no
  -o KbdInteractiveAuthentication=no -o NumberOfPasswordPrompts=0
  -o StrictHostKeyChecking=yes -o ConnectTimeout=12 -o ConnectionAttempts=1)
# This entire remote script performs reads only: no local or VM env dump,
# Docker, extract, copy, touching save, configuration, or service restart.
cat > "$WORK/remote-readonly.sh" <<'VM'
set -Eeuo pipefail
MODE="${1:-}"
SELECTOR="${2:-}"
ROOT=/srv/dementor-live/backups
[[ -d "$ROOT" && ! -L "$ROOT" ]] || exit 3
[[ "$SELECTOR" == latest || "$SELECTOR" =~ ^safe-[A-Za-z0-9_-]{8,96}$ ]] || exit 3
exists_safe(){
  local d="$ROOT/$1"
  [[ -d "$d" && ! -L "$d" &&
     -f "$d/world.json" && ! -L "$d/world.json" && -s "$d/world.json" &&
     -f "$d/full-world.tar.gz" && ! -L "$d/full-world.tar.gz" &&
     -s "$d/full-world.tar.gz" ]]
}
CHOSEN=""
if [[ "$SELECTOR" != latest ]]; then
  exists_safe "$SELECTOR" || exit 3
  CHOSEN="$SELECTOR"
else
  while IFS= read -r name; do
    if exists_safe "$name"; then CHOSEN="$name"; break; fi
  done < <(find "$ROOT" -mindepth 1 -maxdepth 1 -type d -name 'safe-*' -printf '%f\n' | LC_ALL=C sort -r)
fi
[[ -n "$CHOSEN" ]] || exit 3
DIR="$ROOT/$CHOSEN"
ARCHIVE_HASH="$(sha256sum "$DIR/full-world.tar.gz" | awk '{print $1}')"
WORLD_HASH="$(sha256sum "$DIR/world.json" | awk '{print $1}')"
ARCHIVE_SIZE="$(stat -c %s "$DIR/full-world.tar.gz")"
WORLD_SIZE="$(stat -c %s "$DIR/world.json")"
if [[ "$MODE" == inspect ]]; then
  printf 'backup_id=%s\narchive_sha256=%s\nworld_sha256=%s\narchive_bytes=%s\nworld_bytes=%s\n' \
    "$CHOSEN" "$ARCHIVE_HASH" "$WORLD_HASH" "$ARCHIVE_SIZE" "$WORLD_SIZE"
elif [[ "$MODE" == fetch ]]; then
  [[ "${3:-}" == "$ARCHIVE_HASH" && "${4:-}" == "$WORLD_HASH" ]] || exit 3
  # Two known regular files only; stdout is BINARY. All extraction stays on Mac.
  tar -cf - -C "$DIR" -- world.json full-world.tar.gz
else
  exit 3
fi
VM
# Only approved host/identity; two *read-only* SSH sessions:
# (1) immutable metadata, (2) stream pre-existing backup files to private Mac.
META="$(ssh "${SSH_OPTS[@]}" "root@$HOST" bash -s -- inspect "$ID" < "$WORK/remote-readonly.sh")" ||
  fail "read-only SSH metadata attestation failed; no copy made"
field(){ printf '%s\n' "$META" | awk -F= -v k="$1" '$1==k {print $2;exit}'; }
BACKUP_ID="$(field backup_id)"
ARCHIVE_HASH="$(field archive_sha256)"
WORLD_HASH="$(field world_sha256)"
ARCHIVE_BYTES="$(field archive_bytes)"
WORLD_BYTES="$(field world_bytes)"
[[ "$BACKUP_ID" =~ ^safe-[A-Za-z0-9_-]{8,96}$ ]] || fail "bad backup metadata"
[[ "$ARCHIVE_HASH" =~ ^[a-f0-9]{64}$ && "$WORLD_HASH" =~ ^[a-f0-9]{64}$ ]] ||
  fail "bad checksum metadata"
[[ "$ARCHIVE_BYTES" =~ ^[1-9][0-9]*$ && "$WORLD_BYTES" =~ ^[1-9][0-9]*$ ]] ||
  fail "bad size metadata"
LIMIT_BYTES="$((MAX_GIB*1024*1024*1024))"
(( ARCHIVE_BYTES <= LIMIT_BYTES )) || fail "backup exceeds private QA transfer budget"
FREE="$(python3 - "$WORK" <<'PY'
import shutil,sys
print(shutil.disk_usage(sys.argv[1]).free)
PY
)"
[[ "$FREE" =~ ^[1-9][0-9]*$ ]] || fail "local disk capacity unknown"
(( FREE > ARCHIVE_BYTES*2 + 512*1024*1024 )) ||
  fail "insufficient free space for safe Mac-only copy"
printf 'Inspect-only SSH complete; approved private copy selected (bytes=%s)\n' "$ARCHIVE_BYTES"
if ! ssh "${SSH_OPTS[@]}" "root@$HOST" bash -s -- fetch "$BACKUP_ID" "$ARCHIVE_HASH" "$WORLD_HASH" \
    < "$WORK/remote-readonly.sh" 2> "$WORK/transfer-private.err" | tar -xf - -C "$WORK"; then
  fail "secure backup stream failed; private partial copy will be deleted"
fi
sha_local(){ shasum -a 256 "$1" | awk '{print $1}'; }
[[ -f "$WORK/full-world.tar.gz" && -f "$WORK/world.json" ]] ||
  fail "backup file pair missing after transfer"
[[ "$(sha_local "$WORK/full-world.tar.gz")" == "$ARCHIVE_HASH" ]] ||
  fail "private copy archive SHA mismatch"
[[ "$(sha_local "$WORK/world.json")" == "$WORLD_HASH" ]] ||
  fail "private copy world SHA mismatch"
printf '%s\n' "PASS: source/destination SHA-256 match (no VM writes)"
mkdir -p "$WORK/restored"
python3 "$RUNTIME/tools/qa-restore-extract.py" "$WORK/full-world.tar.gz" "$WORK/restored" \
  "$LIMIT_BYTES" > "$WORK/extract.out" 2> "$WORK/extract.err" ||
  fail "isolated restore or archive security check failed"
[[ "$(sha_local "$WORK/restored/world.json")" == "$WORLD_HASH" ]] ||
  fail "restored world differs from original frozen backup"
node "$CANDIDATE/tools/upgrade-audit.mjs" "$WORK/restored/world.json" \
  > "$WORK/upgrade-audit.json" 2> "$WORK/upgrade-audit.err" ||
  fail "source candidate upgrade-audit FAIL on private copy"
python3 - "$WORK/upgrade-audit.json" <<'PY' || fail "invalid candidate upgrade-audit verdict"
import json,sys
j=json.load(open(sys.argv[1]))
assert j.get("status")=="PASS_READ_ONLY" and j.get("sourceFileUntouched") is True
PY
# Two fresh OS processes rehydrate the same separate Mac copy. RequestId
# replay must be immutable; no real server, no network, no auth/tokens emitted.
node "$RUNTIME/tools/qa-restore-identity-audit.mjs" "$WORK/restored/world.json" "$CANDIDATE" \
  > "$WORK/cold-start-1.json" 2> "$WORK/cold-start-1.err" ||
  fail "first private cold-load or requestId check failed"
node "$RUNTIME/tools/qa-restore-identity-audit.mjs" "$WORK/restored/world.json" "$CANDIDATE" \
  > "$WORK/cold-start-2.json" 2> "$WORK/cold-start-2.err" ||
  fail "second private cold-load or requestId check failed"
cmp -s "$WORK/cold-start-1.json" "$WORK/cold-start-2.json" ||
  fail "private cold start summary differs after restart"
python3 - "$WORK/cold-start-1.json" <<'PY' || fail "private cold-load evidence missing"
import json,sys
j=json.load(open(sys.argv[1]))
assert j.get("status")=="PASS_PRIVATE_RESTORE_RELOAD" and j.get("sourceFileUntouched")
print("PASS: private two-process cold-load; cities=%d players=%d plots=%d cached_receipts=%d replay_cases=%d" %
      (j["cities"], j["players"], j["plots"], j["receipts"], j["requestIdReplayCases"]))
if j["requestIdReplayCases"]==0:
    print("WARN: no cached request IDs in this backup; real replay could not be exercised")
PY
cat > "$WORK/RESULT.txt" <<EOF
OPS-01 PRIVATE MAC RESTORE / NOT A PRODUCTION RELEASE
backup_identifier=$BACKUP_ID
backup_archive_sha256=$ARCHIVE_HASH
backup_world_sha256=$WORLD_HASH
backup_archive_bytes=$ARCHIVE_BYTES
candidate_source_sha=$CANDIDATE_SHA
copy_hash_match=PASS
extract_on_separate_Mac=PASS
upgrade_audit_on_disposable_copy=PASS
two_fresh_processes=PASS
real_production_game_restart=NOT_RUN
live_release_GO=NOT_GRANTED
no_VM_writes=yes
EOF
SUCCESS=yes
printf 'PASS: OPS-01 private copy restored on separate Mac; source candidate %s\n' "$CANDIDATE_SHA"
printf 'Private reports retained ONLY on operator Mac in a 0700 QA directory; never upload archives/saves to Git or chat.\n'
