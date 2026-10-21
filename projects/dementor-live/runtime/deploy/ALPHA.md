# Dementor Live ALPHA deployment

ALPHA follows the same deployment pattern as the existing demo: one Docker Compose `game` service, a named world volume, a loopback-bound app port, a dedicated Nginx virtual host, Docker healthcheck, and `docker compose up -d --build game`. Run it only on the separate ALPHA VM. Do not run the BETA publish helper or change the BETA VM/configuration.

## One-time setup on the dedicated ALPHA VM

Check out the reviewed source commit into the Alpha app directory and copy the environment example:

```sh
sudo mkdir -p /srv/dementor-live-alpha/app /srv/dementor-live-alpha/backups
sudo chown "$USER":"$USER" /srv/dementor-live-alpha/app /srv/dementor-live-alpha/backups
cd /srv/dementor-live-alpha/app
cp deploy/.env.alpha.example deploy/.env.alpha
```

Edit `deploy/.env.alpha` and set `DEMENTOR_PUBLIC_URL` to the new Alpha IP or host. Leave the bind address at `127.0.0.1` and the port at `14174`. Do not copy BETA's `world.json`, music, `.env`, tokens, or Docker volume into ALPHA.

Install the ALPHA Nginx virtual host on this dedicated VM:

```sh
sudo install -m 644 deploy/nginx/dementor-live-alpha.conf /etc/nginx/sites-available/dementor-live-alpha.conf
sudo ln -s /etc/nginx/sites-available/dementor-live-alpha.conf /etc/nginx/sites-enabled/dementor-live-alpha.conf
sudo nginx -t
sudo systemctl reload nginx
```

## First start

The first start creates the separate `dementor-live-alpha-world` volume with a fresh Alpha world:

```sh
docker compose -f deploy/compose-alpha.yaml --env-file deploy/.env.alpha ps
docker compose -f deploy/compose-alpha.yaml --env-file deploy/.env.alpha up -d --build game
docker compose -f deploy/compose-alpha.yaml --env-file deploy/.env.alpha ps
docker compose -f deploy/compose-alpha.yaml --env-file deploy/.env.alpha logs --tail=80 game
curl --fail --show-error http://127.0.0.1:14174/api/health -H "Host: $(sed -n 's#^DEMENTOR_PUBLIC_URL=http://##p' deploy/.env.alpha)"
```

Then open `DEMENTOR_PUBLIC_URL` in a browser and confirm the page and `/api/health` return successfully. The browser, model, persistence, mobile and two-client Alpha acceptance checks must pass on the exact source commit before inviting testers.

## Later Alpha updates

Archive only the Alpha volume before an update. Then build/recreate only the Alpha game service with the same command:

```sh
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
docker run --rm --mount type=volume,source=dementor-live-alpha-world,target=/world,readonly --mount type=bind,source=/srv/dementor-live-alpha/backups,target=/backup alpine:3.20 sh -c "tar -czf /backup/alpha-world-$STAMP.tar.gz -C /world ."
docker compose -f deploy/compose-alpha.yaml --env-file deploy/.env.alpha up -d --build game
```

Do not use `down -v`, prune commands, or commands targeting `dementor-live` / `dementor-live-world`. BETA promotion remains a separate exact-SHA decision after Alpha acceptance.
