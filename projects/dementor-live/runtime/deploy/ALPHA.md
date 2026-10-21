# Dementor Live ALPHA deployment

ALPHA uses the existing demo deployment pattern: one Compose `game` service, a named world volume, a loopback-bound app port, a dedicated Nginx virtual host, Docker healthcheck, a volume backup before updates, and `docker compose up -d --build game`. Run it on the separate ALPHA VM only. Keep BETA's Compose file, volume, Nginx vhost and data unchanged.

## Prepare the source on the ALPHA VM

Use a clean checkout of the reviewed, CI-passing source SHA. Do not use the Mac clone with unrelated changes:

```sh
sudo mkdir -p /srv/dementor-live-alpha/source /srv/dementor-live-alpha/backups
sudo chown "$USER":"$USER" /srv/dementor-live-alpha/source /srv/dementor-live-alpha/backups
git clone https://github.com/SLADZARI/degradation_club.git /srv/dementor-live-alpha/source
git -C /srv/dementor-live-alpha/source fetch origin feature/dementor-live-clearing-first-and-resources-2026-10-21
git -C /srv/dementor-live-alpha/source checkout --detach <CI-passing-full-SHA>
cd /srv/dementor-live-alpha/source/projects/dementor-live/runtime
cp deploy/.env.alpha.example deploy/.env.alpha
```

Edit `deploy/.env.alpha` and set `DEMENTOR_PUBLIC_URL` to the new Alpha IP or host. Keep the bind address `127.0.0.1` and port `14174`. Do not copy BETA's `world.json`, music, `.env`, tokens or Docker volume into ALPHA.

## Configure Nginx and start

On the dedicated Alpha VM, install the Alpha-only Nginx file and validate it before reload:

```sh
sudo install -m 644 deploy/nginx/dementor-live-alpha.conf /etc/nginx/sites-available/dementor-live-alpha.conf
sudo ln -s /etc/nginx/sites-available/dementor-live-alpha.conf /etc/nginx/sites-enabled/dementor-live-alpha.conf
sudo nginx -t
sudo systemctl reload nginx
docker compose -f deploy/compose-alpha.yaml --env-file deploy/.env.alpha config --quiet
docker compose -f deploy/compose-alpha.yaml --env-file deploy/.env.alpha up -d --build game
docker compose -f deploy/compose-alpha.yaml --env-file deploy/.env.alpha ps
docker compose -f deploy/compose-alpha.yaml --env-file deploy/.env.alpha logs --tail=80 game
curl --fail --show-error http://127.0.0.1:14174/api/health -H "Host: $(sed -n 's#^DEMENTOR_PUBLIC_URL=http://##p' deploy/.env.alpha)"
```

The first start creates the separate `dementor-live-alpha-world` volume with a fresh Alpha world. Then open `DEMENTOR_PUBLIC_URL` in a browser and verify the page and `/api/health`. Run model, persistence, mobile and two-client acceptance checks against this exact SHA before inviting testers.

## Later Alpha updates

Archive the Alpha volume before rebuilding. This command writes the backup only under the Alpha backup directory:

```sh
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
docker run --rm --mount type=volume,source=dementor-live-alpha-world,target=/world,readonly --mount type=bind,source=/srv/dementor-live-alpha/backups,target=/backup alpine:3.20 sh -c "tar -czf /backup/alpha-world-$STAMP.tar.gz -C /world ."
docker compose -f deploy/compose-alpha.yaml --env-file deploy/.env.alpha up -d --build game
```

Do not use `down -v`, prune commands, or commands targeting `dementor-live` / `dementor-live-world`. BETA promotion remains a separate exact-SHA decision after Alpha acceptance.
