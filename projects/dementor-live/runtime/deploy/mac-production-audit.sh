#!/usr/bin/env bash
# Read-only game VM attestation after G7 release, one known Mac key, one SSH attempt.
set -Eeuo pipefail
HOST="138.199.144.94"
SSH_KEY="\${DEMENTOR_SSH_KEY:-$HOME/Downloads/dementor_server}"
echo '=== Dementor Live production G7 / READ ONLY ==='
if [[ ! -f "$SSH_KEY" ]]; then echo "STOP: key not found: $SSH_KEY" >&2; exit 1; fi
if ! ssh-keygen -lf "$SSH_KEY" >/dev/null 2>&1; then echo 'STOP: key unreadable' >&2; exit 1; fi
echo "key_path=$SSH_KEY"
SSH_OPTS=(-i "$SSH_KEY" -o BatchMode=yes -o IdentitiesOnly=yes
  -o PreferredAuthentications=publickey -o PasswordAuthentication=no
  -o KbdInteractiveAuthentication=no -o NumberOfPasswordPrompts=0
  -o ConnectTimeout=12 -o ConnectionAttempts=1
  -o StrictHostKeyChecking=accept-new)
ssh "\${SSH_OPTS[@]}" "root@$HOST" 'bash -se' <<'VM'
set -Eeuo pipefail
echo '=== Container/image (no env or secrets) ==='
command -v docker >/dev/null || { echo 'STOP: Docker unavailable'; exit 1; }
CID="$(docker ps --quiet --filter label=com.docker.compose.project=dementor-live --filter label=com.docker.compose.service=game)"
if [[ -z "$CID" || "$CID" == *$'\n'* ]]; then echo 'STOP: expected exactly one running game container'; exit 1; fi
IMAGE="$(docker inspect --format '{{.Image}}' "$CID")"
echo "container_id=$CID"
echo "started_at=$(docker inspect --format '{{.State.StartedAt}}' "$CID")"
echo "container_health=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}NOT_DEFINED{{end}}' "$CID")"
echo "running_image_id=$IMAGE"
echo "image_created_at=$(docker image inspect --format '{{.Created}}' "$IMAGE")"
echo "image_tags=$(docker image inspect --format '{{json .RepoTags}}' "$IMAGE")"
echo "image_digests=$(docker image inspect --format '{{json .RepoDigests}}' "$IMAGE")"
echo '=== API health on VM ==='
curl -fsS --connect-timeout 4 --max-time 8 http://127.0.0.1:14173/api/health
printf '\n'
echo '=== Most recent release receipt / frozen backup ==='
ROOT=/srv/dementor-live/backups
LAST=""
if [[ -d "$ROOT" ]]; then
  LAST="$(find "$ROOT" -mindepth 2 -maxdepth 2 -type f -name release-manifest.txt -print | LC_ALL=C sort | tail -n 1)"
fi
if [[ -n "$LAST" ]]; then
  echo "release_manifest=$LAST"
  awk -F= '$1=="approved_sha"||$1=="version"||$1=="backup" {print "manifest_"$0}' "$LAST"
  BACKUP="$(awk -F= '$1=="backup" {print substr($0,index($0,"=")+1);exit}' "$LAST")"
  if [[ "$BACKUP" == "$ROOT"/safe-* && -s "$BACKUP/world.json" && -s "$BACKUP/full-world.tar.gz" ]]; then
    echo 'complete_backup=yes'
    echo "backup_archive_bytes=$(stat -c %s "$BACKUP/full-world.tar.gz")"
    echo "backup_world_sha256=$(sha256sum "$BACKUP/world.json" | awk '{print $1}')"
  else
    echo 'complete_backup=NOT_VERIFIED'
  fi
else
  echo 'release_manifest=NOT_FOUND'
fi
echo '=== Anonymized live save counters (no names, IDs, tokens) ==='
docker exec -i "$CID" node - <<'NODE'
const fs=require("node:fs"),crypto=require("node:crypto");
const data=fs.readFileSync("/app/data/world.json");
const raw=JSON.parse(data.toString("utf8"));
const worlds=raw?.schema==="dementor-cities-v1"
 ?[raw.origin,...Object.values(raw.cities||{}).map(x=>x.state)]
 :[raw];
let players=0,plots=0,ownedPlots=0,relocations=0,walletPaper=0,treasuryPaper=0,wood=0,stone=0;
for(const w of worlds){
 if(!w)continue;
 const people=Object.values(w.players||{});
 players+=people.length;
 plots+=(w.plots||[]).length;
 ownedPlots+=(w.plots||[]).filter(p=>p.owner).length;
 relocations+=(w.residentRelocations||[]).length;
 walletPaper+=people.reduce((v,p)=>v+(Number(p.wallet)||0),0);
 treasuryPaper+=Number(w.treasury)||0;
 for(const r of w.resources||[]){
  if(r.type==="wood")wood+=Number(r.stock)||0;
  if(r.type==="stone")stone+=Number(r.stock)||0;
 }
}
console.log("live_world_summary="+JSON.stringify({
 schema:raw.schema||"legacy",cities:worlds.length,players,plots,ownedPlots,
 relocationRecords:relocations,walletPaper,treasuryPaper,wood,stone,
 bytes:data.length,sha256:crypto.createHash("sha256").update(data).digest("hex")
}));
NODE
echo '=== READ ONLY COMPLETE: no deployment, save edit, or restart ==='
VM
