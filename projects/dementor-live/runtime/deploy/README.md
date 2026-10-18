# Dementor Live server deployment

This Compose project owns only `dementor-live`, loopback port `127.0.0.1:14173`, and volume `dementor-live-world`. Public HTTP traffic reaches the app through a dedicated Nginx virtual-host file at `/etc/nginx/sites-available/dementor-live.conf`; existing site files and other Compose projects are left untouched.

## Current VM deployment (2026-10-18)

Version 0.2.1 is running at `/srv/dementor-live/app` and is publicly reachable at `http://138.199.144.94/` through the existing Nginx listener on port 80. Nginx proxies only this IP host to `127.0.0.1:14173`; the game container is bound to loopback. The world and music remain in the `dementor-live-world` volume; the first-transfer backup is under `/srv/dementor-live/backups/initial-2026-10-18`. The app health endpoint returns `ok: true`. Nginx uses one added, dedicated virtual-host file, versioned at `deploy/nginx/dementor-live.conf`; existing site files were not edited. See `../docs/DEPLOYMENT_2026-10-18.md` before continuing.

## First installation

1. Run `probe-readonly.sh` over SSH and inspect available Docker/Compose, free port, disk, and whether `/srv/dementor-live` already exists. Stop if that directory or Compose names belong to another project. Do not install packages or edit firewall rules.
2. Install the checked-out runtime under `/srv/dementor-live/app` and create `/srv/dementor-live/app/deploy/.env` from `deploy/env.example`. Set `DEMENTOR_PUBLIC_URL` to the exact URL players will open. Keep `DEMENTOR_BIND_ADDRESS=127.0.0.1` when using the dedicated Nginx route.
3. Before starting Compose for the first time, copy the approved `data/world.json` and optional `data/music/` into the named volume `dementor-live-world`. Keep a separate dated backup outside the application directory. Never copy `.env`, `.git`, `node_modules`, or `backups/` into the image.
4. From `/srv/dementor-live/app`, run `docker compose -f deploy/compose.yaml --env-file deploy/.env up -d --build game`.
5. Check only this project with `docker compose -f deploy/compose.yaml --env-file deploy/.env ps` and `docker compose -f deploy/compose.yaml --env-file deploy/.env logs --tail=80 game`. Confirm `http://138.199.144.94/api/health` returns `ok: true` and version `0.2.1`.

The persistent volume stores the authoritative world and uploaded music. Keep a single running instance: the game state is held in memory and saved as JSON, so replicas would diverge. After first transfer, make the server copy authoritative; do not overwrite it with a later local test save.

## Updating code

Back up the volume before each release. Fetch/check out the intended Git commit in the app directory, then run the same `docker compose ... up -d --build game` command. Compose replaces only this service. Do not use `down -v`, `prune`, or commands against other projects. Check health and version after restart. Retain the previous image and a matching world backup for rollback.

The app accepts the configured public origin while preserving existing localhost and LAN origins. Its dedicated Nginx virtual host disables proxy buffering for server-sent events. For a future domain, add a separate Nginx virtual-host file and DNS record; do not edit other site's configs. Validate with `nginx -t` before a graceful reload.
