# DEMENTOR LIVE — isolated server staging (review package)

**Prepared:** 2026-10-18  
**Game source:** `SLADZARI/degradation_club` at immutable commit `1ffbf5095605f381f06e82168c713aa238d7e9b9` (Dementor Live `0.2.0`).  
**This deployment branch:** `deploy/dementor-live-isolated-2026-10-18`, forked from that exact code commit. Only deployment files have been added; the application/server files from v0.2.0 are unchanged.

**Status: PREPARED IN GITHUB, NOT INSTALLED ON REMOTE SERVER.** No remote SSH probe or Docker run has happened from the preparation environment. This is NOT a claim of Internet/public deployment. All preexisting services and `/data/*` MUST remain unchanged.

## Safety/ownership

- Intended target: separate existing Linux server; do not alter current websites, reverse proxies, shared firewall, system packages, Docker daemon settings, or existing `/srv/dementor` and `/data/*`.
- Proposed **new** directory: `/srv/dementor-live` (must first check it does NOT contain somebody else's files).
- Proposed Compose project: `dementor-live`, one container and private Docker network, separate volume `dementor-live_world_data`.
- **First run is LOOPBACK ONLY:** `127.0.0.1:14173:14173`. Port is deliberately not published on public 0.0.0.0. Server's current Host/Origin guard accepts `http://127.0.0.1:14173` through SSH forwarding because app port and forwarded port match.
- Fresh temporary test world is generated in its NEW volume, never use live Mac `data/world.json` for the first test; don't run two game servers with the same persistent world.
- `read_only` container root, writable persistent `/app/data` only, user `node`, dropped capabilities, no-new-privileges and CPU/RAM/pid limits.
- No `npm install` required by this game source; Docker image uses Node.js 22.

## Stage 0 — inspect target via SSH (read-only)

From your own Mac with your configured SSH key, download or clone this **deployment branch** and review the script:

```bash
git clone --single-branch --depth 1 \
  -b deploy/dementor-live-isolated-2026-10-18 \
  https://github.com/SLADZARI/degradation_club.git ~/dementor-live-deploy-review
cd ~/dementor-live-deploy-review/projects/dementor-live/runtime/deploy
sed -n '1,200p' probe-readonly.sh
ssh SSH_USER@SERVER_IP 'bash -s' < probe-readonly.sh
```

**Do not continue without reviewing returned facts:** OS/CPU/RAM; availability of Docker Compose; whether `/srv/dementor-live` already exists; current Compose projects and containers; whether port `14173` is occupied; free storage; existing proxy and firewall. No new Docker installation or firewall changes before this report.

If Compose is absent, do not attempt the Compose instructions below. Use the existing Node/service approach only after inspecting the host conventions.

## Stage 1 — explicitly isolated staging (ONLY after read-only audit)

If the audit confirms Docker Compose exists, staging destination does not collide, and port14173 is free, administrator may perform:

```bash
# On the remote server, do not use /srv/dementor or /data.
mkdir -p /srv/dementor-live
git clone --depth 1 --single-branch \
  -b deploy/dementor-live-isolated-2026-10-18 \
  https://github.com/SLADZARI/degradation_club.git \
  /srv/dementor-live/repo

cd /srv/dementor-live/repo/projects/dementor-live/runtime/deploy
docker compose -p dementor-live config
docker compose -p dementor-live build
docker compose -p dementor-live up -d --no-build
docker compose -p dementor-live ps
docker compose -p dementor-live logs --tail=60 game
curl -fsS http://127.0.0.1:14173/api/health
```

Expected `/api/health` JSON includes `"ok":true,"version":"0.2.0","testMode":false`. If a preexisting Compose project or volume has the same name, **STOP** and choose new unique names before any write. Builds/volumes/images created here belong to this Compose project only. Do **not** execute `docker compose down -v`, `docker system prune`, `docker volume prune`, `systemctl restart docker` or any shared Nginx/UFW commands.

Open the staging game from the Mac (while SSH forwarding remains open):

```bash
ssh -N -L 14173:127.0.0.1:14173 SSH_USER@SERVER_IP
```

Browser: `http://127.0.0.1:14173`. Test with two browser profiles, make two **temporary staging players** and verify SSE updates, actions, UI, and persistence after stopping/restarting **only this** Compose service. The staging players are not the old Mac characters.

## Stage 2 — moving the real world (DO NOT perform during initial staging)

1. Verify existing Mac `data/world.json` + entire `data/music/`, plus owner login/session transfer strategy. No tokens, secrets or live player data in GitHub/ZIP.
2. Choose short maintenance window and stop **only** the original Mac game; collect consistent offline copy of `data/` with private checksum-enforced archive and a second backup. Re-start original only if abandoning cutover.
3. Stop staging container, preserve a backup of named volume (even if empty), import private `data/` into **the new dedicated volume**. Check file permissions for UID/GID node and check JSON before start. Never mount two game processes against that same world state.
4. Start one instance, test health, existing world, music, two browsers, reload and restart. Decide whether old browser player tokens can be safely remapped; sessionStorage is origin-specific.
5. **After cutover**, server becomes authoritative. Future code-only upgrades must never overwrite the server's `data/`. Backup before new version and retain matching code+world snapshot for rollback.

## Stage 3 — public Internet access: not authorized/implemented yet

The current code rejects unrecognized Host/Origin and has local-session bearer tokens, no full public login, no confirmed TLS protection, no public join throttling. **Do not expose port 14173 publicly.** Need separately review existing proxy routes, DNS/subdomain, TLS certificate, forwarded Host+Origin validation and SSE buffering/read-timeout, abuse/rate-limits and authentication. If no available hostname/route/port can be safely provisioned without impacting current services, do not claim public game access.

## Rollback isolation

`docker compose -p dementor-live stop` affects only this deployment's service; volumes stay. `docker compose -p dementor-live down` removes only the project's container/network, but NEVER append `-v`. Preserve a consistent world backup made with game stopped and the pinned working source/image. Upgrade by prepare→backup→stop this game→start new→health→rollback code+data if needed. Avoid rebuilding old unrelated images.
