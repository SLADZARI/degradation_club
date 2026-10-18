# Dementor Live server deployment

This Compose project owns only `dementor-live`, host port `14173`, and volume `dementor-live-world`. It does not attach to shared networks or edit Nginx, `/srv/dementor/stage-a`, `/data/*`, other Compose projects, or other applications.

## First installation

1. Run `probe-readonly.sh` over SSH and inspect available Docker/Compose, free port, disk, and whether `/srv/dementor-live` already exists. Stop if that directory or Compose names belong to another project. Do not install packages, edit firewall rules or change Nginx.
2. Install the checked-out runtime under `/srv/dementor-live/app` and create `/srv/dementor-live/app/deploy/.env` from `deploy/env.example`. Set `DEMENTOR_PUBLIC_URL` to the exact URL players will open. The example serves the game directly at `http://138.199.144.94:14173`.
3. Before starting Compose for the first time, copy the approved `data/world.json` and optional `data/music/` into the named volume `dementor-live-world`. Keep a separate dated backup outside the application directory. Never copy `.env`, `.git`, `node_modules`, or `backups/` into the image.
4. From `/srv/dementor-live/app`, run `docker compose -f deploy/compose.yaml --env-file deploy/.env up -d --build game`.
5. Check only this project with `docker compose -f deploy/compose.yaml --env-file deploy/.env ps` and `docker compose -f deploy/compose.yaml --env-file deploy/.env logs --tail=80 game`. Confirm `http://138.199.144.94:14173/api/health` returns `ok: true` and version `0.2.1`.

The persistent volume stores the authoritative world and uploaded music. Keep a single running instance: the game state is held in memory and saved as JSON, so replicas would diverge. After first transfer, make the server copy authoritative; do not overwrite it with a later local test save.

## Updating code

Back up the volume before each release. Fetch/check out the intended Git commit in the app directory, then run the same `docker compose ... up -d --build game` command. Compose replaces only this service. Do not use `down -v`, `prune`, or commands against other projects. Check health and version after restart. Retain the previous image and a matching world backup for rollback.

The app accepts the configured public origin while preserving the existing localhost and LAN origins. No reverse proxy or shared server configuration is required for the initial direct-IP launch. If later placed behind an HTTPS subdomain, set `DEMENTOR_PUBLIC_URL` to that exact HTTPS origin and route only that host to this service; SSE responses already disable proxy buffering.
