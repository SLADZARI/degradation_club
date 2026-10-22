---
artifactId: dementor-club.report.vm-isolation-backup-security-readiness-prep-2026-10-17
project: dementor-club
documentType: REPORT
projectStage: PLANNING
status: DRAFT
version: "0.4"
updated: "2026-10-23"
owner: "A-01 Solution Architect / I-01 DevOps (issue #255; Lead review pending)"
sourceSystem: GIT
authorityType: REFERENCE
parentIssue: 255
migrationIssue: 237
implementationAuthorized: false
productionDeployAuthorized: false
semanticMutationAuthorized: false
---

# #255 · Dementor VM isolation, backup and security readiness — read-only audit

## W47 / SRE · Three independently capped mounts and scoped rollback runbook · 2026-10-23

**STATUS:** `G3_3_MOUNT_SOURCE=COMPLETE` · `COMPOSE_MAC_STATIC=PASS` · `COMPOSE_VM_V2321_STATIC=PASS` · `MOUNT_GUARD_NEGATIVE=PASS` · `ACTUAL_VM_MOUNTS=NOT_RUN` · `RUNTIME_WAL_LINK=NOT_RUN` · `NEW_C_BACKUPS_C2_RESTORE=NOT_RUN` · `PHASE_HOST_G4=NOT_ISSUED` · `G7_PUBLIC_CUTOVER=NO_GO`. This **supersedes W46's one 10-GiB ext4 loop filesystem** without changing the historical report or the original Cloud. G3 source/reference only; no VM install, source export or permission expansion.

**AUTHORITY / bounded scope:** Owner/Lead [#255 storage decision 6352861682](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6352861682) and [W47 task 6353732232](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6353732232) authorize the technical split of **4GiB PGDATA + 2GiB separate WAL + 4GiB private Storage = 10GiB hard persisted C ceiling**, and **≥16GiB host root free**; VM capacity, placement and Kirill's MDAO operation were accepted and need no repeat. **FIRST backup computer = Никитин Mac, SECOND = Женин Mac, physically distinct OWNER_ATTESTED**. Their current clean-C archive set/encryption/manifest/decrypt+restore is **NOT VERIFIED**; earlier SRE absence-of-external-disk statement is not a denial of two existing laptops. Owner's later [G4 preparation consent #228](https://github.com/SLADZARI/degradation_club/issues/228#issuecomment-6353495324) is **not** a named, independently authenticated HOST_INSTALL/DATA_EXPORT phase GO; [Q-01 #42](https://github.com/SLADZARI/degradation_club/issues/42#issuecomment-6353489870) proved fabricated G4 URL can pass structural `gatekeeper.py`. Do not run protected commands on a synthetic JSON `STRUCTURE_PASS`.

### Three actual filesystem identity and capacity boundaries (future gated host operation)

| Domain | Host mount and CONTAINER binding | New separate fully preallocated Club-only ext4 backing image, planned | Hard ceiling |
| --- | --- | --- | ---: |
| **PGDATA** and PG config | `/srv/dementor/club-backend/c-data/pgdata`; bind `pgdata/db:/var/lib/postgresql/data` and `pgdata/config:/etc/postgresql-custom` | `/srv/dementor/club-backend/loop-images/club-pgdata-4g.img` | **4,294,967,296 B** |
| **WAL** | `/srv/dementor/club-backend/c-data/wal`; bind `wal/wal-data:/var/lib/postgresql/wal` and set `POSTGRES_INITDB_WALDIR=/var/lib/postgresql/wal` at FIRST init only | `/srv/dementor/club-backend/loop-images/club-wal-2g.img` | **2,147,483,648 B** |
| **Private Storage** | `/srv/dementor/club-backend/c-data/storage`; bind `storage/objects:/var/lib/storage` | `/srv/dementor/club-backend/loop-images/club-storage-4g.img` | **4,294,967,296 B** |
| **TOTAL C persistent data** | Three independent mountpoints / three different loop devices and ext4 filesystems on the existing host | Three separately bounded images; they are **not three physically distinct disks** | **10,737,418,240 B = 10 GiB** |

Mount design: the host has ext4 root without activated project quota; use three new fully allocated loop-backed filesystems, without remounting root or touching `/data/*`, `db-dev`, game/MDAO volumes, ALPHA/BETA, DNS/443 or existing TLS. Each ext4 mount root contains `lost+found`, so bind empty **subdirectories** `pgdata/db` and `wal/wal-data` for PostgreSQL init. Future Kirill/authorized operator must ensure each backing filename is NEW (no overwrite), images are fully allocated before formatting, mount targets are empty/dedicated/permission-restricted, host remains **≥16GiB free after full 10GiB allocation plus Docker image/overlay/log overhead**, and a real authenticated HOST_INSTALL G4 exists. **No new loop image/mount was created by this G3 work.**

**Real WAL behavior:** Supabase [docker/CONFIG.md](https://github.com/supabase/supabase/blob/master/docker/CONFIG.md) documents `POSTGRES_INITDB_WALDIR`; PostgreSQL [initdb --waldir](https://www.postgresql.org/docs/current/app-initdb.html) is for **first cluster creation**. A new DB cluster should create `PGDATA/pg_wal` as a symlink to `/var/lib/postgresql/wal`. Existing PGDATA must **never be silently reinitialized** or reassigned by just setting an env var. Before any G7, independent runtime proof must inspect `PG_VERSION`, **inside-container** `readlink /var/lib/postgresql/data/pg_wal`, `docker inspect Mounts`, actual distinct `stat` devices, `SHOW data_directory`, `pg_ls_waldir()`, and retained WAL/slot/archive settings. `max_wal_size` is a soft checkpoint target, NOT a hard WAL filesystem quota.

### Actual five-service Compose (G3 source; NOT an executable production installation)

Same immutable PG17, **GoTrue v2.197.0**, REST, Storage and Envoy image digests as W46. Only future loopback `127.0.0.1:18431:8000` is published; no host PostgreSQL/Auth/REST/Storage listener. Four long-syntax binds across THREE quota-enforced mounts use `bind.create_host_path: false`, an additional check but **not** sufficient mount identity proof (Compose [issue #13602](https://github.com/docker/compose/issues/13602)). W46 contains the previously verified Envoy trimmed configs: CDS SHA256 `033cbec93cc3f9b0375b8370558e068f8e78c2d7d6283a9ec3013d3287aeb754`, LDS SHA256 `b9e5319da576aa400ab7157b9d64462b73c5f3712592266a0d31bcbe4d0ec5ad`. When operator assembles full vendor assets, both matching configs and the same exact reviewed Compose SHA are required.

**SHA256 `ffc5d53d02b5640bca14ec744d1a3694daf532053e2630c9fb87bc06933bf29f`, file `dc-club.compose.g3-3mount.yaml`:**

```yaml
---
name: dc-club-backend
services:
  db:
    image: supabase/postgres:17.6.1.136@sha256:f371b5f3f2ac0a05703f33d6e6134515fb2498cab708fb948a0aeb7481467c00
    restart: 'no'
    volumes:
    - "./volumes/db/realtime.sql:/docker-entrypoint-initdb.d/migrations/99-realtime.sql:Z"
    - "./volumes/db/webhooks.sql:/docker-entrypoint-initdb.d/init-scripts/98-webhooks.sql:Z"
    - "./volumes/db/roles.sql:/docker-entrypoint-initdb.d/init-scripts/99-roles.sql:Z"
    - "./volumes/db/jwt.sql:/docker-entrypoint-initdb.d/init-scripts/99-jwt.sql:Z"
    - type: bind
      source: "${CLUB_DATA_ROOT:?THREE_MOUNTS_REQUIRED}/pgdata/db"
      target: "/var/lib/postgresql/data"
      bind:
        create_host_path: false
      read_only: false
    - "./volumes/db/_supabase.sql:/docker-entrypoint-initdb.d/migrations/97-_supabase.sql:Z"
    - "./volumes/db/logs.sql:/docker-entrypoint-initdb.d/migrations/99-logs.sql:Z"
    - "./volumes/db/pooler.sql:/docker-entrypoint-initdb.d/migrations/99-pooler.sql:Z"
    - type: bind
      source: "${CLUB_DATA_ROOT:?THREE_MOUNTS_REQUIRED}/pgdata/config"
      target: "/etc/postgresql-custom"
      bind:
        create_host_path: false
      read_only: false
    - type: bind
      source: "${CLUB_DATA_ROOT:?THREE_MOUNTS_REQUIRED}/wal/wal-data"
      target: "/var/lib/postgresql/wal"
      bind:
        create_host_path: false
      read_only: false
    healthcheck:
      test:
      - CMD
      - pg_isready
      - "-U"
      - postgres
      - "-h"
      - localhost
      interval: 5s
      timeout: 5s
      retries: 10
    environment:
      POSTGRES_HOST: "/var/run/postgresql"
      PGPORT: "${POSTGRES_PORT}"
      POSTGRES_PORT: "${POSTGRES_PORT}"
      PGPASSWORD: "${POSTGRES_PASSWORD}"
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
      PGDATABASE: "${POSTGRES_DB}"
      POSTGRES_DB: "${POSTGRES_DB}"
      JWT_SECRET: "${JWT_SECRET}"
      JWT_EXP: "${JWT_EXPIRY}"
      POSTGRES_INITDB_WALDIR: "/var/lib/postgresql/wal"
      PGDATA: "/var/lib/postgresql/data"
    command:
    - postgres
    - "-c"
    - config_file=/etc/postgresql/postgresql.conf
    - "-c"
    - log_min_messages=fatal
    mem_limit: 1024m
    cpus: 0.8
    pids_limit: 128
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    networks:
    - club_private
  auth:
    image: supabase/gotrue:v2.197.0@sha256:1736a63078f5922b198c4cbe50f80ab9a2d3b54fe8b7b6cfb2e9dc5dbbc12c6b
    restart: 'no'
    healthcheck:
      test:
      - CMD
      - wget
      - "--no-verbose"
      - "--tries=1"
      - "--spider"
      - http://localhost:9999/health
      timeout: 5s
      interval: 5s
      retries: 3
    depends_on:
      db:
        condition: service_healthy
    environment:
      GOTRUE_API_HOST: 0.0.0.0
      GOTRUE_API_PORT: 9999
      API_EXTERNAL_URL: "${API_EXTERNAL_URL}"
      GOTRUE_DB_DRIVER: postgres
      GOTRUE_DB_DATABASE_URL: postgres://supabase_auth_admin:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
      GOTRUE_SITE_URL: "${SITE_URL}"
      GOTRUE_URI_ALLOW_LIST: "${ADDITIONAL_REDIRECT_URLS}"
      GOTRUE_DISABLE_SIGNUP: "${DISABLE_SIGNUP}"
      GOTRUE_JWT_ADMIN_ROLES: service_role
      GOTRUE_JWT_AUD: authenticated
      GOTRUE_JWT_DEFAULT_GROUP_NAME: authenticated
      GOTRUE_JWT_EXP: "${JWT_EXPIRY}"
      GOTRUE_JWT_SECRET: "${JWT_SECRET}"
      GOTRUE_JWT_ISSUER: "${API_EXTERNAL_URL}"
      GOTRUE_EXTERNAL_EMAIL_ENABLED: "${ENABLE_EMAIL_SIGNUP}"
      GOTRUE_EXTERNAL_ANONYMOUS_USERS_ENABLED: "${ENABLE_ANONYMOUS_USERS}"
      GOTRUE_MAILER_AUTOCONFIRM: "${ENABLE_EMAIL_AUTOCONFIRM}"
      GOTRUE_SMTP_ADMIN_EMAIL: "${SMTP_ADMIN_EMAIL}"
      GOTRUE_SMTP_HOST: "${SMTP_HOST}"
      GOTRUE_SMTP_PORT: "${SMTP_PORT}"
      GOTRUE_SMTP_USER: "${SMTP_USER}"
      GOTRUE_SMTP_PASS: "${SMTP_PASS}"
      GOTRUE_SMTP_SENDER_NAME: "${SMTP_SENDER_NAME}"
      GOTRUE_MAILER_URLPATHS_INVITE: "${MAILER_URLPATHS_INVITE}"
      GOTRUE_MAILER_URLPATHS_CONFIRMATION: "${MAILER_URLPATHS_CONFIRMATION}"
      GOTRUE_MAILER_URLPATHS_RECOVERY: "${MAILER_URLPATHS_RECOVERY}"
      GOTRUE_MAILER_URLPATHS_EMAIL_CHANGE: "${MAILER_URLPATHS_EMAIL_CHANGE}"
      GOTRUE_EXTERNAL_PHONE_ENABLED: "${ENABLE_PHONE_SIGNUP}"
      GOTRUE_SMS_AUTOCONFIRM: "${ENABLE_PHONE_AUTOCONFIRM}"
      GOTRUE_EXTERNAL_GOOGLE_ENABLED: "${GOOGLE_ENABLED:-false}"
      GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID: "${GOOGLE_CLIENT_ID:-}"
      GOTRUE_EXTERNAL_GOOGLE_SECRET: "${GOOGLE_SECRET:-}"
      GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI: "${API_EXTERNAL_URL}/callback"
    mem_limit: 256m
    cpus: 0.35
    pids_limit: 128
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    networks:
    - club_private
    - club_auth_egress
  rest:
    image: postgrest/postgrest:v14.12@sha256:54000f24847d01a2c2302e0041cf0618b875c57fb48507d743cfa9aaa50bf43c
    restart: 'no'
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test:
      - CMD
      - postgrest
      - "--ready"
      interval: 5s
      timeout: 5s
      retries: 3
    environment:
      PGRST_DB_URI: postgres://authenticator:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
      PGRST_DB_SCHEMAS: "${PGRST_DB_SCHEMAS}"
      PGRST_DB_MAX_ROWS: "${PGRST_DB_MAX_ROWS:-1000}"
      PGRST_DB_EXTRA_SEARCH_PATH: "${PGRST_DB_EXTRA_SEARCH_PATH:-public}"
      PGRST_DB_ANON_ROLE: anon
      PGRST_ADMIN_SERVER_PORT: 3001
      PGRST_ADMIN_SERVER_HOST: localhost
      PGRST_JWT_SECRET: "${JWT_JWKS:-${JWT_SECRET}}"
      PGRST_DB_USE_LEGACY_GUCS: 'false'
      PGRST_APP_SETTINGS_JWT_SECRET: "${JWT_SECRET}"
      PGRST_APP_SETTINGS_JWT_EXP: "${JWT_EXPIRY}"
    command:
    - postgrest
    mem_limit: 256m
    cpus: 0.25
    pids_limit: 128
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    networks:
    - club_private
  storage:
    image: supabase/storage-api:v1.60.4@sha256:c8eb9858eafec891a97c27125470aaad54703c3f4eb4d55ca7f1bf6c6411febf
    restart: 'no'
    depends_on:
      db:
        condition: service_healthy
      rest:
        condition: service_started
    healthcheck:
      test:
      - CMD
      - wget
      - "--no-verbose"
      - "--tries=1"
      - "--spider"
      - http://storage:5000/status
      timeout: 5s
      interval: 5s
      retries: 3
      start_period: 10s
    environment:
      ANON_KEY: "${ANON_KEY}"
      SERVICE_KEY: "${SERVICE_ROLE_KEY}"
      POSTGREST_URL: http://rest:3000
      AUTH_JWT_SECRET: "${JWT_SECRET}"
      DATABASE_URL: postgres://supabase_storage_admin:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
      STORAGE_PUBLIC_URL: "${SUPABASE_PUBLIC_URL}"
      REQUEST_ALLOW_X_FORWARDED_PATH: 'true'
      FILE_SIZE_LIMIT: 52428800
      STORAGE_BACKEND: file
      GLOBAL_S3_BUCKET: "${GLOBAL_S3_BUCKET}"
      FILE_STORAGE_BACKEND_PATH: "/var/lib/storage"
      TENANT_ID: "${STORAGE_TENANT_ID}"
      REGION: "${REGION}"
      ENABLE_IMAGE_TRANSFORMATION: 'false'
      IMGPROXY_URL: ''
      S3_PROTOCOL_ACCESS_KEY_ID: "${S3_PROTOCOL_ACCESS_KEY_ID}"
      S3_PROTOCOL_ACCESS_KEY_SECRET: "${S3_PROTOCOL_ACCESS_KEY_SECRET}"
    volumes:
    - type: bind
      source: "${CLUB_DATA_ROOT:?THREE_MOUNTS_REQUIRED}/storage/objects"
      target: "/var/lib/storage"
      bind:
        create_host_path: false
      read_only: false
    mem_limit: 384m
    cpus: 0.35
    pids_limit: 128
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    networks:
    - club_private
  api-gw:
    image: envoyproxy/envoy:v1.39.0@sha256:d59f7f5fa10cff6d5892b6c5e7df5c9297ddfb2c3683e33fbfb82da24de4fa66
    restart: 'no'
    volumes:
    - "./volumes/api/envoy/envoy.yaml:/etc/envoy/envoy.yaml:ro"
    - "./volumes/api/envoy/cds.yaml:/etc/envoy/cds.yaml:ro"
    - "./volumes/api/envoy/lds.template.yaml:/etc/envoy/lds.template.yaml:ro"
    - "./volumes/api/envoy/docker-entrypoint.sh:/docker-entrypoint.sh:ro"
    depends_on:
      auth:
        condition: service_healthy
      rest:
        condition: service_healthy
      storage:
        condition: service_healthy
    environment:
      ANON_KEY: "${ANON_KEY}"
      SERVICE_ROLE_KEY: "${SERVICE_ROLE_KEY}"
      SUPABASE_PUBLISHABLE_KEY: "${SUPABASE_PUBLISHABLE_KEY:-}"
      SUPABASE_SECRET_KEY: "${SUPABASE_SECRET_KEY:-}"
      ANON_KEY_ASYMMETRIC: "${ANON_KEY_ASYMMETRIC:-}"
      SERVICE_ROLE_KEY_ASYMMETRIC: "${SERVICE_ROLE_KEY_ASYMMETRIC:-}"
      DASHBOARD_USERNAME: "${DASHBOARD_USERNAME}"
      DASHBOARD_PASSWORD: "${DASHBOARD_PASSWORD}"
    entrypoint:
    - "/bin/sh"
    - "/docker-entrypoint.sh"
    healthcheck:
      test:
      - CMD-SHELL
      - timeout 1 bash -c '</dev/tcp/127.0.0.1/8000'
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
    - club_private
    - club_auth_egress
    mem_limit: 128m
    cpus: 0.25
    pids_limit: 128
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    ports:
    - 127.0.0.1:18431:8000/tcp
networks:
  club_private:
    internal: true
  club_auth_egress:
    internal: false
x-club-bounded-mounts:
  pgdata:
    mount: "${CLUB_DATA_ROOT:?THREE_MOUNTS_REQUIRED}/pgdata"
    limit_gib: 4
    backing: club-pgdata-4g.img
  wal:
    mount: "${CLUB_DATA_ROOT:?THREE_MOUNTS_REQUIRED}/wal"
    limit_gib: 2
    backing: club-wal-2g.img
  storage:
    mount: "${CLUB_DATA_ROOT:?THREE_MOUNTS_REQUIRED}/storage"
    limit_gib: 4
    backing: club-storage-4g.img
```

### Fail-closed three-mount host preflight (SOURCE only; no mounts created)

**SHA256 `34170542ee5f83f6dd950460c66cf90ac301a398bb3729f6ab48d138031636dc`, file `dc-club-three-mount-preflight.g3.sh`**. Explicit `CLUB_CHECK_MODE=FIRST` requires fresh empty PGDATA+WAL; `EXISTING` requires PG_VERSION and WAL symlink, preventing accidental replay/overwrite. Each of the three must be a true ext4 mount with a distinct loop device, unique inode/dev, correct exact backing filename, actual full allocation and size, plus root reserve and safe child directory. This guard validates only host facts and is NOT a substitute for an independently authenticated scope/custodian/G4 decision.

```bash
#!/usr/bin/env bash
# READ-ONLY preflight. It does not mount, initialize, download, back up or start containers.
set -Eeuo pipefail
stop() { printf 'CLUB_PREFLIGHT_DENY %s %s\n' "$1" "$2" >&2; exit "$1"; }
canonical=/srv/dementor/club-backend/c-data
backing=/srv/dementor/club-backend/loop-images
reserve=17179869184
[ "$CLUB_DATA_ROOT" = "$canonical" ] || stop 64 'club_root_not_exact'
[ "$CLUB_CHECK_MODE" = FIRST ] || [ "$CLUB_CHECK_MODE" = EXISTING ] || stop 65 'explicit_mode_required'
[ -d "$canonical" ] && [ ! -L "$canonical" ] || stop 66 'club_root_missing_or_symlink'
[ -d "$backing" ] && [ ! -L "$backing" ] || stop 67 'backing_root_missing_or_symlink'
seen_dev='|'
seen_loop='|'
for spec in 'pgdata:4294967296:club-pgdata-4g.img' 'wal:2147483648:club-wal-2g.img' 'storage:4294967296:club-storage-4g.img'; do
  IFS=: read -r name expected file <<EOF
$spec
EOF
  mounted="$canonical/$name"
  [ -d "$mounted" ] && [ ! -L "$mounted" ] || stop 68 "mount_target_missing_or_symlink_$name"
  mountpoint -q "$mounted" || stop 69 "not_a_mount_$name"
  actual_target=$(findmnt -n -o TARGET -T "$mounted") || stop 70 "findmnt_target_$name"
  [ "$actual_target" = "$mounted" ] || stop 71 "wrong_mount_target_$name"
  fstype=$(findmnt -n -o FSTYPE -T "$mounted") || stop 72 "findmnt_fs_$name"
  [ "$fstype" = ext4 ] || stop 73 "wrong_fs_$name"
  source=$(findmnt -n -o SOURCE -T "$mounted") || stop 74 "findmnt_source_$name"
  case "$source" in /dev/loop[0-9]*) ;; *) stop 75 "not_club_loop_$name" ;; esac
  device=$(stat -Lc %d "$mounted") || stop 76 "stat_dev_$name"
  case "$seen_dev" in *"|$device|"*) stop 77 "same_device_$name" ;; esac
  seen_dev="$seen_dev$device|"
  case "$seen_loop" in *"|$source|"*) stop 78 "same_loop_$name" ;; esac
  seen_loop="$seen_loop$source|"
  loop_backing=$(losetup -n -O BACK-FILE "$source" 2>/dev/null) || stop 79 "loop_without_backing_$name"
  [ "$loop_backing" = "$backing/$file" ] || stop 80 "backing_identity_mismatch_$name"
  [ -f "$loop_backing" ] && [ ! -L "$loop_backing" ] || stop 81 "backing_file_not_regular_$name"
  actual_bytes=$(stat -Lc %s "$loop_backing") || stop 82 "backing_size_unavailable_$name"
  [ "$actual_bytes" -eq "$expected" ] || stop 83 "wrong_size_$name"
  allocated_blocks=$(stat -Lc %b "$loop_backing") || stop 84 "blocks_unavailable_$name"
  [ "$((allocated_blocks * 512))" -ge "$expected" ] || stop 85 "sparse_file_$name"
  opt=$(findmnt -n -o OPTIONS -T "$mounted") || stop 86 "options_unavailable_$name"
  case ",$opt," in *,rw,*) ;; *) stop 87 "mount_not_rw_$name" ;; esac
  printf 'MOUNT_CHECK_PASS %s %s %s\n' "$name" "$actual_bytes" "$source"
done
for sub in pgdata/db pgdata/config wal/wal-data storage/objects; do
  item="$canonical/$sub"
  [ -d "$item" ] && [ ! -L "$item" ] || stop 88 "required_subpath_missing_or_symlink_$sub"
  # Parent mount must be exactly the intended bounded filesystem (no nested mount escape).
  case "$sub" in pgdata/*) owner_mount="$canonical/pgdata" ;; wal/*) owner_mount="$canonical/wal" ;; storage/*) owner_mount="$canonical/storage" ;; esac
  path_mount=$(findmnt -n -o TARGET -T "$item") || stop 89 "subpath_mount_unavailable_$sub"
  [ "$path_mount" = "$owner_mount" ] || stop 90 "subpath_escape_$sub"
done
pgdir="$canonical/pgdata/db"
waldir="$canonical/wal/wal-data"
if [ "$CLUB_CHECK_MODE" = FIRST ]; then
  [ ! -e "$pgdir/PG_VERSION" ] && [ ! -e "$pgdir/pg_wal" ] || stop 91 'first_init_existing_pg_cluster'
  [ -z "$(ls -A "$pgdir")" ] && [ -z "$(ls -A "$waldir")" ] || stop 92 'first_init_not_empty'
else
  [ -f "$pgdir/PG_VERSION" ] || stop 93 'existing_mode_pg_version_missing'
  [ -L "$pgdir/pg_wal" ] || stop 94 'existing_wal_not_symlink'
  link_target=$(readlink "$pgdir/pg_wal") || stop 95 'wal_link_unreadable'
  [ "$link_target" = /var/lib/postgresql/wal ] || stop 96 'wal_link_wrong_target'
fi
root_free=$(df -B1 --output=avail / | tail -n 1 | tr -d '[:space:]') || stop 97 'root_df_unavailable'
[ "$root_free" -ge "$reserve" ] || stop 98 'host_reserve_below_16g'
printf 'CLUB_3_MOUNT_PREFLIGHT_STATIC_PASS three_distinct_loop_ext4=YES postallocation_root_free_bytes=%s mode=%s\n' "$root_free" "$CLUB_CHECK_MODE"
# Human-executed G4 authenticity & B01/Q01 proof is SEPARATE and mandatory before any real start.
```

### Actual offline/VM static checks (NO install and NO exports)

- **Mac Docker Compose v5.1.0:** `config --quiet` PASS; JSON assertions PASS exactly 5 images/services, four Club binds, three separate mount prefixes, explicit WAL env, no short bind host-path auto-create, only Envoy loopback published. Missing `CLUB_DATA_ROOT` → negative PASS (config fails closed).
- **VM Docker Compose v2.32.1:** exact YAML streamed over previously authorized SSH to `docker compose -p dc-club-backend -f - config --quiet`, complete **fake-only** environment; PASS exit 0, **0 warnings/errors**. No remote host file, mount or container modified.
- **Guard:** Mac `bash -n` PASS; missing root/mount negative PASS. VM `bash -n` PASS and missing actual mount root read-only negative **exit 66 `club_root_missing_or_symlink` PASS**. Positive real three-mount test, real `initdb --waldir`, container startup/ENOSPC and C→C2 restore remain **NOT RUN**.

### Risk-triggered rollback and recovery (owned; no new access rights)

| Situation / checkpoint | SRE/operator response | Required acceptance before resumption |
| --- | --- | --- |
| **Before a real HOST_INSTALL G4** | STOP all provisioning, source export, Docker start and route changes. Owner G4 PREPARATION is not a human-authenticated host-install or data-extraction phase; maintain Cloud and game/MDAO state | Lead+Kirill scope/operator + independent Q01 authentic Gate, exact YAML SHA and 3-device preflight |
| **Clean target G4: mount, `initdb`, Auth/REST/Storage or private-data QA FAIL** | Stop **only** new `dc-club-backend` containers. Isolate its new loopback listener. Preserve each of the three loop images and evidence until independently reviewed; no `down -v`, no volume reset, root quota/remount or WAL removal. Original Cloud stays serving the site | Verify correct WAL symlink+device, 11 Google provider→UUID→profile mappings, 27 Auth tables/271 columns/75 migration tags, 49 FK, exact 69 Cloud RPC/ACL, 16 Storage physical body SHA, negative RLS/Storage tests, backup C2 restore |
| **PGDATA/WAL/Storage usage reaches 80%/90%; or VM free approaches 16GiB** | Warn at **80%**; at **90%** suspend nonessential uploads/release and freeze new target writes if necessary; investigate WAL slots/archive and disk budget. At <16GiB VM free STOP any new Club allocation. Never `rm pg_wal`, `pg_resetwal` or indiscriminate `docker prune`; retain encrypted recovery manifests. Any rebalancing must stay within total 10GiB and an approved host change | Only a repaired bounded C or independently clean-restored C2 after QA. A WAL-full PostgreSQL may halt; do not assume self-recovery |
| **After G7 route switch but BEFORE any acknowledged target write** | With a separate owner rollback GO revert only scoped Club API/Google callback/issuer/client config to preserved Cloud configuration, maintain one active Telegram worker; require new sign-in as needed. Do not touch game worlds | Signed-in login→Board→action→reload, DC9 baseline, outsider private-media DENY, source Cloud unchanged |
| **After G7 and real new DB/Storage writes** | **NEVER just flip DNS.** Stop new writes and Telegram sending, checkpoint target DB+object changes, privately reconcile/write-preserve acknowledged target changes to approved destination; independent Q01 confirms IDs/roles/private bytes, then owner G7 rollback GO and scoped routing revert | Signed dual-side delta+snapshot manifests (no PII in GitHub), 11 stable AccountIds, all acknowledged Board/Storage operations recovered, no duplicate outbound job |
| **Recovery media and C2** | Existing *physically separate* Mac Никиты (first) and Женин Mac (second) are OWNER-ATTESTED, not newly inventoried here. Only after real DATA G4 create an **encrypted current clean-C** snapshot (DB+private Storage object bodies) with private UTC asOf, archive size/SHA256 and separate key custody on BOTH. Independently decrypt and RESTORE to new isolated C2, not the shared VM or current DEV volumes | Match source manifest/object checksums, Google UUIDs and grants/RLS negative tests; **present old Mac files ≠ current clean-C backup PASS**. Preserve original Cloud. Mixed MP/Robo/legacy Q requires separate rights |

**Exact teardown if a scoped G4 rollback becomes necessary:** stop only `dc-club-backend`, verify no new DB writer/file descriptor, preserve backup and hashes; only with Kirill and Lead authorization unmount exactly the three verified Club mounts and detach each validated Club loop backing file. Never execute `docker compose down -v`, delete host/game volumes, remove encrypted backups automatically, change MDAO `/data/*`, restart ALPHA, or silently undo public OAuth/DNS. **A post-cutover rollback after writes requires data reconciliation before any routing change.**

**ONE NEXT actual operator action:** Kirill/nominated SRE acknowledges and, only after real named operator HOST_INSTALL G4, provisions the three loop ext4 filesystems with 4/2/4 GiB ceilings, runs this preflight, boots the exact compatible PG17/GoTrue target, checks the WAL link/ENOSPC, and hands independent C2 restore to Q01/B01. The two-Mac hardware choice is closed; the missing evidence is **new clean C backup content/encryption and restore**, not hardware selection. **STAGE2_REAL_CLOUD_EXPORT** remains NO GO until Backend #228 authenticates an approved selective Club-only FK-closed path or all foreign data-controller permissions for off-VM full Q. Public G7 is separate.

**CHECKPOINT:** asOf 2026-10-23, one-file reference/Draft PR #257. SHA and permalink recorded after update in Issue #255. **CHANGED:** G3 documentation/source only. **VERIFIED:** Mac/VM Compose parse and host negative guard. **NOT RUN:** three actual mounts, GoTrue/WAL runtime, Q/A export, clean-C first+second encrypted backup, C2 restore, production cutover. **PRODUCTION EFFECT: NONE.**


## W46 · Actual static Compose + isolated disk contour + first-backup physical check · 2026-10-23

**ROLE/MODE:** SRE / G3 offline EXECUTE+VERIFY, from owner's direct #255 instruction. **SRE recommended bounded-disk design = 10 GiB ext4 loop-backed, preallocated Club-only C state**, BUT **Kirill operator-specific mount acceptance and protected host/data G4 are NOT yet verified**. Neither available shared VM capacity nor Kirill/MDAO prior clearance is being re-opened.

### Direct evidence and selected disk variant

1. **Read-only VM inspect**, 2026-10-22 22:27 UTC using previously authorized operator Mac→VM SSH: `findmnt -T /srv/dementor` → `/dev/sda1 ext4 rw,relatime`; filesystem features do **NOT** include ext4 `project` quota; Docker root `/var/lib/docker` overlay2. `losetup` and `/dev/loop-control` **exist**, no mounted loops enumerated. Candidate 18431 TCP port was **not bound at inspection**; `/srv/dementor` owned by root. No host changes. Prior `~40.86GiB` root free and owner-accepted 16GiB protected reserve remain the **last direct measured resource snapshot**, no new load/MDAO test.
2. **SRE choice, FUTURE ONLY after real protected G4 and Kirill operator acknowledgement:** a *fully preallocated* **10 GiB ext4 image** belonging solely to Club C mounted at `/srv/dementor/club-backend/c-data`; PGDATA+pg_wal, private Storage objects and PG config all remain inside that filesystem. Keep application/config under `/srv/dementor/club-backend/<approved-result-sha>/`, separated from live `/data/*`, MDAO, game world volumes, db-dev, Nginx, Club Stage1. Loop mount would require a future scoped host write and operator-owned mount/umount+rollback, **NOT PERFORMED**.
3. **LIMITATION acknowledged:** 10GiB is a real HARD cap **only for bind-mounted stateful C bytes after the mount exists**. Docker overlay2 layers, downloaded image cache and container logs still live on shared root; each proposed container has json logs 10m×3 and fixed RAM/CPU/pids, but **root total Club disk hard cap NOT PROVEN**. `max_wal_size` is NOT hard; WAL shares the capped C filesystem, meaning ENOSPC can halt PG. Operator preflight needs verified mountpoint, backend state ownership, ≥16GiB free host root **after** approved image allocation, and STOP+rollback if filesystem/host threshold approaches limit. **Never treat Compose bind path as proof of mount**: without it Docker might create directories on unbounded root. No prune / loop mount / data copy now.

### Fully concrete five-service G3 Compose — actual offline checked bytes

**Registry/asset provenance:** vendor `supabase/supabase@self-hosted/v0.7.2`, upstream base `docker/docker-compose.yml` Git blob `d34a43fe755979029636091503b70d818176abd8` (confirmed by direct `git hash-object` locally), official `docker-compose.envoy.yml`, `.env.example`, exact upstream `volumes/db/*.sql` and `volumes/api/envoy/*` fetched read-only. No real secrets, users, PG dumps, buckets, cloud DB exports, VM installation, container start or Docker pull; all work in a temporary sandbox on the **already connected Mac**.

**Actual authored `dc-club.compose.g3.yaml`, SHA256 `9cc27e191844b0e976757aa3c68e54dde3a970aa5aaa0c95302a3ae2fedb18b5`.** This source is embedded verbatim for review in the existing **one-file** Draft PR #257; it is NOT automatically deployed by being documented:

```yaml
---
name: dc-club-backend
services:
  db:
    image: supabase/postgres:17.6.1.136@sha256:f371b5f3f2ac0a05703f33d6e6134515fb2498cab708fb948a0aeb7481467c00
    restart: 'no'
    volumes:
    - "./volumes/db/realtime.sql:/docker-entrypoint-initdb.d/migrations/99-realtime.sql:Z"
    - "./volumes/db/webhooks.sql:/docker-entrypoint-initdb.d/init-scripts/98-webhooks.sql:Z"
    - "./volumes/db/roles.sql:/docker-entrypoint-initdb.d/init-scripts/99-roles.sql:Z"
    - "./volumes/db/jwt.sql:/docker-entrypoint-initdb.d/init-scripts/99-jwt.sql:Z"
    - "${CLUB_DATA_ROOT:?C_not_mounted_or_not_set}/pgdata:/var/lib/postgresql/data"
    - "./volumes/db/_supabase.sql:/docker-entrypoint-initdb.d/migrations/97-_supabase.sql:Z"
    - "./volumes/db/logs.sql:/docker-entrypoint-initdb.d/migrations/99-logs.sql:Z"
    - "./volumes/db/pooler.sql:/docker-entrypoint-initdb.d/migrations/99-pooler.sql:Z"
    - "${CLUB_DATA_ROOT:?C_not_mounted_or_not_set}/pg-config:/etc/postgresql-custom"
    healthcheck:
      test:
      - CMD
      - pg_isready
      - "-U"
      - postgres
      - "-h"
      - localhost
      interval: 5s
      timeout: 5s
      retries: 10
    environment:
      POSTGRES_HOST: "/var/run/postgresql"
      PGPORT: "${POSTGRES_PORT}"
      POSTGRES_PORT: "${POSTGRES_PORT}"
      PGPASSWORD: "${POSTGRES_PASSWORD}"
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
      PGDATABASE: "${POSTGRES_DB}"
      POSTGRES_DB: "${POSTGRES_DB}"
      JWT_SECRET: "${JWT_SECRET}"
      JWT_EXP: "${JWT_EXPIRY}"
    command:
    - postgres
    - "-c"
    - config_file=/etc/postgresql/postgresql.conf
    - "-c"
    - log_min_messages=fatal
    mem_limit: 1024m
    cpus: 0.8
    pids_limit: 128
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    networks:
    - club_private
  auth:
    image: supabase/gotrue:v2.197.0@sha256:1736a63078f5922b198c4cbe50f80ab9a2d3b54fe8b7b6cfb2e9dc5dbbc12c6b
    restart: 'no'
    healthcheck:
      test:
      - CMD
      - wget
      - "--no-verbose"
      - "--tries=1"
      - "--spider"
      - http://localhost:9999/health
      timeout: 5s
      interval: 5s
      retries: 3
    depends_on:
      db:
        condition: service_healthy
    environment:
      GOTRUE_API_HOST: 0.0.0.0
      GOTRUE_API_PORT: 9999
      API_EXTERNAL_URL: "${API_EXTERNAL_URL}"
      GOTRUE_DB_DRIVER: postgres
      GOTRUE_DB_DATABASE_URL: postgres://supabase_auth_admin:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
      GOTRUE_SITE_URL: "${SITE_URL}"
      GOTRUE_URI_ALLOW_LIST: "${ADDITIONAL_REDIRECT_URLS}"
      GOTRUE_DISABLE_SIGNUP: "${DISABLE_SIGNUP}"
      GOTRUE_JWT_ADMIN_ROLES: service_role
      GOTRUE_JWT_AUD: authenticated
      GOTRUE_JWT_DEFAULT_GROUP_NAME: authenticated
      GOTRUE_JWT_EXP: "${JWT_EXPIRY}"
      GOTRUE_JWT_SECRET: "${JWT_SECRET}"
      GOTRUE_JWT_ISSUER: "${API_EXTERNAL_URL}"
      GOTRUE_EXTERNAL_EMAIL_ENABLED: "${ENABLE_EMAIL_SIGNUP}"
      GOTRUE_EXTERNAL_ANONYMOUS_USERS_ENABLED: "${ENABLE_ANONYMOUS_USERS}"
      GOTRUE_MAILER_AUTOCONFIRM: "${ENABLE_EMAIL_AUTOCONFIRM}"
      GOTRUE_SMTP_ADMIN_EMAIL: "${SMTP_ADMIN_EMAIL}"
      GOTRUE_SMTP_HOST: "${SMTP_HOST}"
      GOTRUE_SMTP_PORT: "${SMTP_PORT}"
      GOTRUE_SMTP_USER: "${SMTP_USER}"
      GOTRUE_SMTP_PASS: "${SMTP_PASS}"
      GOTRUE_SMTP_SENDER_NAME: "${SMTP_SENDER_NAME}"
      GOTRUE_MAILER_URLPATHS_INVITE: "${MAILER_URLPATHS_INVITE}"
      GOTRUE_MAILER_URLPATHS_CONFIRMATION: "${MAILER_URLPATHS_CONFIRMATION}"
      GOTRUE_MAILER_URLPATHS_RECOVERY: "${MAILER_URLPATHS_RECOVERY}"
      GOTRUE_MAILER_URLPATHS_EMAIL_CHANGE: "${MAILER_URLPATHS_EMAIL_CHANGE}"
      GOTRUE_EXTERNAL_PHONE_ENABLED: "${ENABLE_PHONE_SIGNUP}"
      GOTRUE_SMS_AUTOCONFIRM: "${ENABLE_PHONE_AUTOCONFIRM}"
      GOTRUE_EXTERNAL_GOOGLE_ENABLED: "${GOOGLE_ENABLED:-false}"
      GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID: "${GOOGLE_CLIENT_ID:-}"
      GOTRUE_EXTERNAL_GOOGLE_SECRET: "${GOOGLE_SECRET:-}"
      GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI: "${API_EXTERNAL_URL}/callback"
    mem_limit: 256m
    cpus: 0.35
    pids_limit: 128
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    networks:
    - club_private
    - club_auth_egress
  rest:
    image: postgrest/postgrest:v14.12@sha256:54000f24847d01a2c2302e0041cf0618b875c57fb48507d743cfa9aaa50bf43c
    restart: 'no'
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test:
      - CMD
      - postgrest
      - "--ready"
      interval: 5s
      timeout: 5s
      retries: 3
    environment:
      PGRST_DB_URI: postgres://authenticator:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
      PGRST_DB_SCHEMAS: "${PGRST_DB_SCHEMAS}"
      PGRST_DB_MAX_ROWS: "${PGRST_DB_MAX_ROWS:-1000}"
      PGRST_DB_EXTRA_SEARCH_PATH: "${PGRST_DB_EXTRA_SEARCH_PATH:-public}"
      PGRST_DB_ANON_ROLE: anon
      PGRST_ADMIN_SERVER_PORT: 3001
      PGRST_ADMIN_SERVER_HOST: localhost
      PGRST_JWT_SECRET: "${JWT_JWKS:-${JWT_SECRET}}"
      PGRST_DB_USE_LEGACY_GUCS: 'false'
      PGRST_APP_SETTINGS_JWT_SECRET: "${JWT_SECRET}"
      PGRST_APP_SETTINGS_JWT_EXP: "${JWT_EXPIRY}"
    command:
    - postgrest
    mem_limit: 256m
    cpus: 0.25
    pids_limit: 128
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    networks:
    - club_private
  storage:
    image: supabase/storage-api:v1.60.4@sha256:c8eb9858eafec891a97c27125470aaad54703c3f4eb4d55ca7f1bf6c6411febf
    restart: 'no'
    depends_on:
      db:
        condition: service_healthy
      rest:
        condition: service_started
    healthcheck:
      test:
      - CMD
      - wget
      - "--no-verbose"
      - "--tries=1"
      - "--spider"
      - http://storage:5000/status
      timeout: 5s
      interval: 5s
      retries: 3
      start_period: 10s
    environment:
      ANON_KEY: "${ANON_KEY}"
      SERVICE_KEY: "${SERVICE_ROLE_KEY}"
      POSTGREST_URL: http://rest:3000
      AUTH_JWT_SECRET: "${JWT_SECRET}"
      DATABASE_URL: postgres://supabase_storage_admin:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
      STORAGE_PUBLIC_URL: "${SUPABASE_PUBLIC_URL}"
      REQUEST_ALLOW_X_FORWARDED_PATH: 'true'
      FILE_SIZE_LIMIT: 52428800
      STORAGE_BACKEND: file
      GLOBAL_S3_BUCKET: "${GLOBAL_S3_BUCKET}"
      FILE_STORAGE_BACKEND_PATH: "/var/lib/storage"
      TENANT_ID: "${STORAGE_TENANT_ID}"
      REGION: "${REGION}"
      ENABLE_IMAGE_TRANSFORMATION: 'false'
      IMGPROXY_URL: ''
      S3_PROTOCOL_ACCESS_KEY_ID: "${S3_PROTOCOL_ACCESS_KEY_ID}"
      S3_PROTOCOL_ACCESS_KEY_SECRET: "${S3_PROTOCOL_ACCESS_KEY_SECRET}"
    volumes:
    - "${CLUB_DATA_ROOT:?C_not_mounted_or_not_set}/storage:/var/lib/storage"
    mem_limit: 384m
    cpus: 0.35
    pids_limit: 128
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    networks:
    - club_private
  api-gw:
    image: envoyproxy/envoy:v1.39.0@sha256:d59f7f5fa10cff6d5892b6c5e7df5c9297ddfb2c3683e33fbfb82da24de4fa66
    restart: 'no'
    volumes:
    - "./volumes/api/envoy/envoy.yaml:/etc/envoy/envoy.yaml:ro"
    - "./volumes/api/envoy/cds.yaml:/etc/envoy/cds.yaml:ro"
    - "./volumes/api/envoy/lds.template.yaml:/etc/envoy/lds.template.yaml:ro"
    - "./volumes/api/envoy/docker-entrypoint.sh:/docker-entrypoint.sh:ro"
    depends_on:
      auth:
        condition: service_healthy
      rest:
        condition: service_healthy
      storage:
        condition: service_healthy
    environment:
      ANON_KEY: "${ANON_KEY}"
      SERVICE_ROLE_KEY: "${SERVICE_ROLE_KEY}"
      SUPABASE_PUBLISHABLE_KEY: "${SUPABASE_PUBLISHABLE_KEY:-}"
      SUPABASE_SECRET_KEY: "${SUPABASE_SECRET_KEY:-}"
      ANON_KEY_ASYMMETRIC: "${ANON_KEY_ASYMMETRIC:-}"
      SERVICE_ROLE_KEY_ASYMMETRIC: "${SERVICE_ROLE_KEY_ASYMMETRIC:-}"
      DASHBOARD_USERNAME: "${DASHBOARD_USERNAME}"
      DASHBOARD_PASSWORD: "${DASHBOARD_PASSWORD}"
    entrypoint:
    - "/bin/sh"
    - "/docker-entrypoint.sh"
    healthcheck:
      test:
      - CMD-SHELL
      - timeout 1 bash -c '</dev/tcp/127.0.0.1/8000'
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
    - club_private
    - club_auth_egress
    mem_limit: 128m
    cpus: 0.25
    pids_limit: 128
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: '3'
    ports:
    - 127.0.0.1:18431:8000/tcp
networks:
  club_private:
    internal: true
  club_auth_egress:
    internal: false
```

**Vendor Envoy trim, static only:** official 7 clusters/21 routes have dependencies on absent services; the verified transform retains auth/rest/storage (3 clusters), removes 9 disabled-service routes, adds last default-404 (13 routes). Output hashes: `cds.yaml` sha256 `033cbec93cc3f9b0375b8370558e068f8e78c2d7d6283a9ec3013d3287aeb754`; `lds.template.yaml` sha256 `b9e5319da576aa400ab7157b9d64462b73c5f3712592266a0d31bcbe4d0ec5ad`. Download vendor assets at `supabase/supabase@self-hosted/v0.7.2`, then the following produces the identical scoped replacement:

```ruby
require 'yaml'
require 'digest'
require 'fileutils'
dir='volumes/api/envoy'
allowed=%w[auth rest storage]
cds_file="#{dir}/cds.yaml"
lds_file="#{dir}/lds.template.yaml"
FileUtils.cp(cds_file,"#{dir}/cds.vendor-original.yaml")
FileUtils.cp(lds_file,"#{dir}/lds.vendor-original.template.yaml")
cds=YAML.load_file(cds_file)
orig_clusters=cds.fetch('resources').map{|s|s.fetch('name')}
cds.fetch('resources').select!{|s|allowed.include?(s.fetch('name'))}
raise "CLUSTER_FILTER_INVALID" unless cds.fetch('resources').map{|s|s.fetch('name')}.sort==allowed.sort
lds=YAML.load_file(lds_file)
virtual_hosts=lds.fetch('resources').first.fetch('filter_chains').first.fetch('filters').first.fetch('typed_config').fetch('route_config').fetch('virtual_hosts')
raise "VHOST_UNEXPECTED" unless virtual_hosts.length==1
routes=virtual_hosts.first.fetch('routes')
original_routes=routes.length
removed=[]
routes.reject! do |route|
  cluster=route['route'] && route['route']['cluster']
  if cluster && !allowed.include?(cluster)
    removed << route.fetch('name',cluster)
    true
  else
    false
  end
end
routes << {'name'=>'club-disabled-endpoints-fail-closed', 'match'=>{'prefix'=>'/'}, 'direct_response'=>{'status'=>404, 'body'=>{'inline_string'=>'Not Found'}}}
File.write(cds_file,YAML.dump(cds))
File.write(lds_file,YAML.dump(lds))
reread=YAML.load_file(lds_file)
vhosts=reread.fetch('resources').first.fetch('filter_chains').first.fetch('filters').first.fetch('typed_config').fetch('route_config').fetch('virtual_hosts')
newroutes=vhosts.first.fetch('routes')
assert_clusters=newroutes.map{|r|r.dig('route','cluster')}.compact.uniq
raise "ROUTE_CLUSTER_CLOSURE_FAIL #{assert_clusters}" unless (assert_clusters-allowed).empty?
raise "MISSING_REQUIRED_ROUTE" unless %w[auth rest storage].all?{|name|assert_clusters.include?(name)}
raise "MISSING_FAIL_CLOSED_FALLBACK" unless newroutes.last.dig('direct_response','status')==404 && newroutes.last.dig('match','prefix')=='/'
orig_lds=File.read("#{dir}/lds.vendor-original.template.yaml")
curr_lds=File.read(lds_file)
dollar='$'
placeholders=%w[ANON_KEY SERVICE_ROLE_KEY SUPABASE_PUBLISHABLE_KEY SUPABASE_SECRET_KEY ANON_KEY_ASYMMETRIC SERVICE_ROLE_KEY_ASYMMETRIC DASHBOARD_BASIC_AUTH]
placeholders.each do |v|
  ref="#{dollar}{#{v}}"
  raise "TOKEN_DROPPED_#{v}" if orig_lds.include?(ref) && !curr_lds.include?(ref)
end
puts "ENVOY_TRIM_G3_PASS vendor_clusters=#{orig_clusters.length} active_clusters=#{allowed.join(',')} vendor_routes=#{original_routes} active_routes=#{newroutes.length} removed=#{removed.join(',')}"
puts "ENVOY_TRIM_G3_HASHES cds=#{Digest::SHA256.file(cds_file).hexdigest} lds=#{Digest::SHA256.file(lds_file).hexdigest}"
```

**Actual static validation, with no service startup or real credentials:**
- Mac Docker Compose **v5.1.0** `config --quiet` **PASS** on pinned candidate YAML and vendor filesystem assets; JSON assertions **PASS**: five image digests, internal dependencies, three binds inside planned Club-only C mount, no database/Auth/REST/Storage host listener, Envoy at **127.0.0.1:18431** only, CPU/Memory/pids/log bounds. Missing `CLUB_DATA_ROOT` causes immediate `config` **failure PASS**.
- Official Envoy CDS+LDS YAML reparse and route/cluster referential integrity + fail-closed fallback **STATIC PASS**. Version-pin digest manifest unchanged.
- Synthetic `API_EXTERNAL_URL=https://api.dementor.club/auth/v1` yields `https://api.dementor.club/auth/v1/callback` **PASS**, with Google disabled in example configuration; no OAuth origin/provider switch performed.
- **Also parsed the same YAML directly on VM Docker Compose v2.32.1 via authorized SSH stdin**, `docker compose -p dc-club-backend -f - config --quiet`, using fake-only env variables: **PASS exit 0, zero warnings**. No remote file created, no container started or Docker state mutation.
- **NOT RUN:** actual Envoy startup/secret substitution/authorization, PG17 init+GoTrue2.197 migration compatibility, real 11 Google identities, Cloud RLS/ACL/RPC and private Storage bytes, loop image allocation/mount ENOSPC tests, clean-C restore C2, release. Static Compose+parser success is **not** runtime readiness.

**Fail-closed pre-start guard, operator-run ONLY AFTER authenticated host/data G4 (not executed):**
```sh
test "${CLUB_DATA_ROOT:-}" = "/srv/dementor/club-backend/c-data" || exit 64
mountpoint -q "$CLUB_DATA_ROOT" || exit 65
test "$(findmnt -no FSTYPE -T "$CLUB_DATA_ROOT")" = ext4 || exit 66
test "$(findmnt -no SOURCE -T "$CLUB_DATA_ROOT")" != /dev/sda1 || exit 67
test "$(df -B1 --output=avail / | tail -n 1 | tr -d ' ')" -ge 17179869184 || exit 68
# Separate signed operator evidence must establish that the mounted filesystem
# is the actual preallocated bounded Club image, not another shared filesystem.
docker compose --env-file .env.example -f dc-club.compose.g3.yaml config --quiet
```
**WARNING:** operator must replace vendor example environment with private true production secrets after G4 and before G7; never launch `up` against `.env.example` or without proving a bounded mount. Before G4 this guard is a review-only example.

**Independent first physical backup search, real inventory:**
- `MacBook-Pro-Zena.local`, already owner-chosen **SECOND** recovery device, has FileVault ON and ~511GiB available. `diskutil list external physical` returned **zero external disks**; Docker disk images are virtual and do not count.
- The other previously registered `Macbooks-MacBook-Pro.local` was **OFFLINE**, last seen ~104h earlier. A distinct registration/hostname is **not** evidence of a separate physical failure domain or accepted private data custody.
- **FIRST_BACKUP_PHYSICAL=NOT_PROVEN**; no archive or real private objects downloaded or copied. Shortest zero-spend operator path: verify an already existing other Mac or removable disk (private device identity and separate encryption/recovery custodian), distinct from Женин Mac. Then only under a real approved protected data G4 produce encrypted Club-only C manifest+SHA, test independent decrypt+restore C2. No mixed MP/Robo/legacy_edu Q to shared VM or unauthorized media.

**SRE decision vs external authority:** bounded 10GiB ext4 loop-backed Club-C state partition is the **SRE technical variant**, justified because shared root ext4 has no project quotas. It is **not yet mounted or accepted by Kirill as a new host operation**. The design caps C-mounted PGDATA/WAL/Storage only; overlay2 layers and Docker logs remain shared-root (bounded log rotation, runtime watch, host ≥16GiB). `CLUB_ISOLATED_COMPOSE_READY=NO` until actual G4-gated mount, boot and restore proof; `HOST_CAPACITY_OWNER_ACCEPTED=YES`, `CONCURRENT_LOAD=N/A_OWNER_WAIVED`, `MDAO=KIRILL_OPERATOR_ATTESTED`, `COMPOSE_G3_STATIC=PASS`, `FIRST_BACKUP=NOT_PROVEN`, `C2_RESTORE=NOT_RUN`, `HOST_DATA_G4=NOT_ISSUED`, `G7_PUBLIC_CUTOVER=NO`.

**One next operator decision:** Kirill/nominated operator: acknowledge YES/NO for future bounded Club-only 10GiB mount+rollback and identify/attest the distinct FIRST encrypted device. Do not repeat owner VM placement/MDAO/performance approvals. Backend B-01 #228 and independent QA #42 own data authority/restore/security. **PRODUCTION EFFECT NONE.**


## W45 / SRE · One-page same-VM Club-only isolated C receipt — 2026-10-23

**ROLE/MODE:** SRE / VERIFY→G3 DESIGN, `#255` under [Lead W45](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6352198495). This section **supersedes historical W24/W32 demands for extra stress tests and MDAO canaries**; historical evidence remains below. **No VM or Cloud deployment, backup creation, Docker pull, DNS or OAuth change.** Gate and security authority are not granted by this report.

### A. Host receipt and operator/owner decision (already DONE; do not recheck)

- **Direct authorized VM read-only receipt:** [#255 6352008220](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6352008220), 2026-10-22 **21:44 UTC**: 4 logical CPUs, `MemAvailable=7,053,012 kB (~6.73 GiB)`, root free **43,856,678,912 B (~40.86 GiB)**, **4,181,300** inodes free; no swap. Host shared root volume for `/`, `/srv`, `/data`. ALPHA **stopped deliberately**, BETA **healthy**, `db-dev` running, no Club backend installed; 80/443 and 32778 already bound, game Beta 127.0.0.1:14173. Snapshot proves current resource state, NOT an automatically enforced future per-project cap.
- **Accepted owner correction:** [#255 6352059981](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6352059981). `HOST_CAPACITY_OWNER_ACCEPTED=YES`, `KIRILL_MDAO=OPERATOR_ATTESTED_OWNER_ACCEPTED`, `SIMULTANEOUS_LOAD=N/A_OWNER_WAIVED`. Kirill/Gabil VM placement already accepted. **Do not rerun 24h concurrency test, MDAO canary or placement ballot.**

### B. EXACT five-service G3 target profile, non-operative until G4

**Rechecked registry index digests 2026-10-23 from existing connected Mac** using **read-only `docker buildx imagetools inspect`** (no pulls/containers started); candidate versions are pinned, but Auth/schema/REST/Storage functional compatibility is **NOT RUN**.

| Club-only component | Exact immutable Docker image (candidate) | Proposed hard max, NOT tested |
| --- | --- | --- |
| New Club PostgreSQL 17 | `supabase/postgres:17.6.1.136@sha256:f371b5f3f2ac0a05703f33d6e6134515fb2498cab708fb948a0aeb7481467c00` | **1024 MiB / 0.80 CPU** |
| Auth / Google PKCE | `supabase/gotrue:v2.197.0@sha256:1736a63078f5922b198c4cbe50f80ab9a2d3b54fe8b7b6cfb2e9dc5dbbc12c6b` | **256 MiB / 0.35 CPU** |
| REST/RPC | `postgrest/postgrest:v14.12@sha256:54000f24847d01a2c2302e0041cf0618b875c57fb48507d743cfa9aaa50bf43c` | **256 MiB / 0.25 CPU** |
| Private Storage | `supabase/storage-api:v1.60.4@sha256:c8eb9858eafec891a97c27125470aaad54703c3f4eb4d55ca7f1bf6c6411febf` | **384 MiB / 0.35 CPU** |
| Envoy API gateway (no Kong) | `envoyproxy/envoy:v1.39.0@sha256:d59f7f5fa10cff6d5892b6c5e7df5c9297ddfb2c3683e33fbfb82da24de4fa66` | **128 MiB / 0.25 CPU** |
| **Proposed aggregate** | **Exactly five services, not full default Supabase stack** | **2048 MiB / 2.0 CPU** |

**Deployment boundary / exact paths and ports:** future source+config at `/srv/dementor/club-backend/<approved-G4-SHA>/`, Compose project `dc-club-backend`, private bridge `dc-club-backend-internal`, **new** `127.0.0.1:18431` → gateway only if preflight `ss` shows unbound and Kirill accepts. DB 5432 / Auth 9999 / REST 3000 / Storage 5000 remain **internal only**, zero `0.0.0.0` or IPv6 wildcard exposure. New optional `api.dementor.club` hostname requires separate Kirill Nginx/TLS+DNS scoped authority and later owner public G7; before that gateway remains loopback-only and **does not alter** existing Club site, default 443/game or MDAO vhosts. New project mounts, UID, secrets and logs **never intersect** `/data/*`, `db-dev`, Club Stage1 site or game volumes. Envoy's upstream override currently depends on Studio; slim override must **actually remove dependency and validate config**, not merely delete Studio. Edge/Telegram runner OFF during migration; one separately approved worker at cutover only, never two active senders.

**Actual isolation implementation requiring reviewed G4:** add explicit `mem_limit`, `cpus`, `pids_limit`, bounded `tmpfs` and Docker json-log `max-size/max-file` per container, and `read_only` for non-stateful filesystems after image compatibility verification. **Disk/WAL boundary is NOT delivered by `max_wal_size` alone or Compose named volumes.** Host uses shared root ext4 with project-quota capability **not proven enabled**; Kirill must approve one **preallocated and mounted bounded Club-C-only filesystem, candidate 10 GiB**, with both PGDATA/pg_wal and private Storage bytes INSIDE it; retain independently capped overlay/log/temp growth and a preflight + runtime **host root free ≥16 GiB** threshold. Bounded filesystem is **a proposal, not an installed mount**; actual boot, mount isolation, `docker compose config --quiet`, image readback and fail-closed ENOSPC/rollback checks remain **NOT RUN**. If hard cap cannot be implemented without shared-root or unrelated service mutation: **STOP CLUB INSTALL** and stay with zero-cost fake-only Mac plan under separate synthetic G4. No `docker system prune`, default full-stack `up`, new charges or host reconfiguration under this draft.

**Exact rollback/kill-switch (future scoped operator only):** stop and remove **only** `dc-club-backend` containers/network, disable only its new private loopback route/vhost if provisioned, retain isolated Club-C data and off-VM encrypted manifest until independent QA; restore source Cloud as authoritative and do not reverse DNS/OAuth after acknowledged target writes without explicit reconciliation. Do not call `down -v`, delete bounded filesystem, touch existing Nginx default or alter game/MDAO. Operator = Kirill/nominated existing access; Lead controls G4, independent QA owns negative/restore acceptance and owner controls G7.

### C. Backup custody and single binary Gate (no invented recovery PASS)

- Owner-selected **SECOND** independent encrypted recovery carrier = **Женин Mac** (FileVault ON, ~509GiB free from prior check). `FIRST` source Q/operator backup **physical device and named custodian remain UNPROVEN**; an additional offline Mac device exists in Desktop Commander but is **not** proven an authorized independent FIRST carrier. Never call two directories on Женин Mac redundant media.
- No encrypted **clean-C** export+off-VM first/second copies, key escrow or **decrypt+actual isolated C→C2 restore** was performed. Q mixed-MP/Robo/legacy_edu cannot be placed on shared VM or on unauthorized second Mac. Backend [#228 W45 decision](https://github.com/SLADZARI/degradation_club/issues/228#issuecomment-6352446126) separately governs `FULL_Q` all-custodian consent vs independently FK-closed `SELECTIVE_CLUB_A`; neither is authorized by this host receipt.
- **BINARY:** `HOST_READONLY_CAPACITY_RECEIPT=PASS`, `HOST_CAPACITY_OWNER_ACCEPTED=YES`, `CONCURRENT_STRESS=N/A_OWNER_WAIVED`, `MDAO=KIRILL_OPERATOR_ATTESTED`, **`CLUB_ISOLATED_COMPOSE_READY=NO`** (exact image pins and layout delivered, but hard bounded FS, slim dependency-valid `compose config` and boot/rollback evidence NOT RUN), **`BACKUP_FIRST_PHYSICAL=NOT_PROVEN`**, **`C2_RESTORE=NOT_RUN`**, **`HOST_DATA_G4_ISSUED=NO`**, **`PUBLIC_CUTOVER_G7=NO`**.
- **One SRE remaining handoff:** Kirill/assigned operator reviews the 10GiB bounded-root C design and exact new-only Compose, pins replacement when verified, proves first independent encrypted hardware+custodian **distinct from Женин Mac**, and once actual protected G4 is issued executes a bounded install plus actual clean C2 restore. Q01 independent security and Auth/Storage negatives happen in #42/#228. **Owner is not being asked for another capacity/MDAO/placement approval.**

**CHECKPOINT:** asOf=2026-10-23; repo document-only Draft PR #257; no runtime SHA; registry digest read-only PASS for 5/5, exact C runtime NOT RUN. **CHANGED:** this one reference report only. **PRODUCTION EFFECT: NONE.**



**Verdict: PREP REPORT / LEAD-ACCEPTED AS DRAFT PLANNING INPUT; HOST READ-ONLY AFTER VERIFIED AT W12; STATIC MANIFEST FALSE-ALARM CORRECTED AT W13; STAGE1 RELEASE STILL NO-GO.**  
**Production effect: NONE.** This report is not a Decision, Result, Gate, host approval or deploy authorization. It proposes no immediate change to existing services. Parent [#237](https://github.com/SLADZARI/degradation_club/issues/237) remains **BACKLOG/DEFERRED**; [#228](https://github.com/SLADZARI/degradation_club/issues/228) does not yet provide an accepted current stable migration baseline.

## W33 · Measured full Cloud PG data size and safe offline encrypted recovery staging · 2026-10-22

**LEAD TASK:** [#255 W33 exact scope](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6329752219). Method [#228 clone-first owner G3 proposal](https://github.com/SLADZARI/degradation_club/issues/228#issuecomment-6329745318) supersedes a guess that every 49-FK edge needs a custom per-table row importer. **STATUS: PRECISE SOURCE SIZE ACCEPTED; OFFLINE QUARANTINE/RETENTION/RESTORE PROCEDURE PREPARED; NOT EXECUTED.** The older W32 large disk envelope is a **PROVISIONAL, NOT-MEASURED five-service runtime protection budget**, not the amount of Club data to migrate. No new service, branch/Result, VM write or real Cloud export authorized.

### W33-A. Exact source scope; no invented multi-GB database

**Backend's direct read-only PostgreSQL 17.6** `SELECT pg_database_size(current_database())` returned **29,371,539 bytes (28.011 MiB)** for the **ENTIRE mixed source PostgreSQL database** (Club + MP + Robo + Postgres system), not just DC. Source inventory: `public` 56 tables = **28 `dc_*` / 15 `mp_*` / 2 Robo / 11 unprefixed**; 11 `auth.users`, 11 Google identities and 11 `profiles`. Private `dc-community-artifacts` metadata lists **16 objects, declared file bodies 23,934,580 bytes (22.826 MiB)**. **Declared physical database + separately declared Storage bodies total 53,306,119 bytes (50.84 MiB) but this is NOT an actual backup archive size, PG restore size or confirmed Storage-body checksum.** Both `pg_database_size` and object metadata are point-in-time measurements; uncompressed text `COPY`/SQL, extension role/GoTrue setup, WAL, temp, logs, images, encrypted archives and future uploads can be larger. Do NOT use 507GiB or 12.5GiB as source data size: **507.47GiB was the Mac's FREE DISK, 12.5GiB is an unproven staging ceiling**. Physical self-hosted database and 5-service Docker image/volume sizes will be measured only after approved isolated test.

### W33-B. Two approaches and selected G3 candidate, not data-export authority

| Approach | Correctness and privacy characteristics | Status |
| --- | --- | --- |
| **A: selective Club-only per-table copy** | Least-privilege source read/filter and smaller sensitive-data exposure; requires source-faithful DDL/roles/RLS/RPC/GoTrue-owned tables, FK row ordering and identity mapping across approved shared `profiles`; overhead large relative to 28MiB source | Valid fallback if full mixed-copy custody/restore cannot be approved |
| **B: one logical FULL mixed-source snapshot → encrypted OFF-VM private quarantine → offline source-faithful restore → approved MP/Robo/legacy pruning in COPY → Club-only encrypted sanitized target** | More faithfully preserves scoped FKs/functions/Auth system and avoids 49 manual row mappings; **temporarily handles unrelated MP/Robo PII, sessions/refresh tokens and privilege state**, with much stricter owner/custodian/expiry/crypto-erasure gates. Source Cloud NEVER pruned. **NO full mixed DB reaches shared VM** | **Preferred OWNER-PROPOSED G3 CANDIDATE; REAL SNAPSHOT/QUARANTINE NOT AUTHORIZED** |

Full clone here is **logical application/user schema** using the current official Supabase CLI restore-from-platform flow, **NOT** raw copying a managed platform PGDATA data directory or blind `pg_dumpall` of every Cloud internal schema. Official flow exports **roles / schema / data** separately, with Supabase-specific reserved-role/schema filtering; source `auth.users`, policy/functions/trigger definitions are included by its documented scope, but complete fidelity for the **current actual** schemas/extensions must be validated before treating any snapshot as a clone. **Storage FILE BYTES, Edge function code, Google OAuth provider settings, JWT secrets and DNS are NOT exported by the database dump**. Guide: https://supabase.com/docs/guides/self-hosting/restore-from-platform . Before real copy B-01 verifies live CLI flags and the snapshot metadata manifest; source user rows, object data and secrets NEVER land in a public GitHub diff.

### W33-C. Safest no-new-fee QUARANTINE location, independent restore and key custody (G3 proposal)

**CANDIDATE destination: owner's connected Mac ONLY WITH WRITTEN DATA-CUSTODIAN APPROVAL**, not an already selected/authorized backup. Direct safe metadata check `2026-10-22 00:38 UTC`: `FileVault is On`, `hdiutil` and `diskutil` built in; `hdiutil create -help` supports **APFS, SPARSEBUNDLE, -encryption and -stdinpass**. Root free `534,218,436 KiB ≈509.5GiB` on latest check (prior snapshot 507.47GiB). These are **laptop spare storage**, never part of the Cloud 28MiB. Separate `age/gpg` encryption tool not present on previous check, and `psql/pg_dump` not verified installed; installing anything would be another change and was **NOT attempted**.

**Least-exposure proposed location design, not mounted/executed:**
1. After named Club+MP/Robo data owner consent, create a **private passphrase-protected AES-256 encrypted APFS sparsebundle** in a 0700 operator-owned folder on the Mac with a unique key NOT saved in repo, CLI args, shell history or on the Mac-only copy. A separate explicitly approved **isolated** restore environment must use bind-mounted PG/Storage data directories backed by the same encrypted mounted bundle, NOT unmanaged old `degradation_club`/B-01 Docker volumes. No published network ports, no email/Telegram/GoTrue Google outbound, no scheduled workers, explicit Docker storage/metadata leakage audit. FileVault helps disk-at-rest security but is **NOT** equivalent to independently recoverable encrypted archive+key escrow.
2. Source export is a **read-only outbound Cloud logical snapshot** after *REAL DATA G4* with narrowly approved read credentials and finite UTC snapshot. Create 3 files inside the encrypted mounted bundle **only**, per official CLI syntax with placeholders; template (NEVER RUN under W33):
   ```sh
   supabase db dump --db-url "[OWNER_APPROVED_SOURCE_URL]" -f roles.sql --role-only
   supabase db dump --db-url "[OWNER_APPROVED_SOURCE_URL]" -f schema.sql
   supabase db dump --db-url "[OWNER_APPROVED_SOURCE_URL]" -f data.sql --use-copy --data-only
   ```
   **These are three distinct CLI read operations; consistency across them is NOT automatically one atomic cross-file snapshot.** Source application write interval and row/version reconciliation must be controlled by B-01; no live Cloud table mutation/freezing today. Source URL in examples is PLACEHOLDER ONLY: future operator MUST avoid real connection credentials in command-line history/process listings/logs and use an approved key/secret injection technique. Post-export inspect only private manifest: exact source PG version, expected schema/table count, auth 11 (approved fields), 49 FK catalogue+69 `dc_*` routines / 65 definers, `dc_*` table count, real dump file bytes, SHA256, restore tool+image versions; do not log member rows/PII or dump private SQL to GitHub.
3. Copy source-snapshot backups into a **separately recipient-encrypted off-VM archive** with owner-held decrypt key and independently escrowed recovery key (e.g., vetted `age` recipient mode, **NOT INSTALLED/NOT EXECUTED**). Keep an encrypted first copy on Mac, and **an independent second encrypted copy on a separately approved external medium/provider** under a different custodian; Mac-only + FileVault is not a complete disaster recovery plan. No MP/Robo snapshot on VM, in browser uploads, repo, ordinary Google Drive share or Cloud target public volume. Transfer the 16 authenticated **Storage object bodies** separately only after policy+data G4, with private SHA/object bytes/ACL and signed URL negative tests; never pretend metadata bytes prove backup completeness.
4. Create a **new disposable, network-isolated quarantine PostgreSQL/GoTrue runtime** matched to source PG17/GoTrue, **not** existing local B-01/Club Mac compose, old Cloud or VM `db-dev`. Before using any sensitive dump, require verified egress denial and disabled cron/pg_net/Telegram/mail/function outbound, ephemeral DB user, startup import and scope check; Supabase guide uses `psql --single-transaction --variable ON_ERROR_STOP=1` for restore. **The guide's example `SET session_replication_role=replica` suppresses triggers; if used in OFFLINE import only, restore constraints/triggers and independently re-enable/verify **every FK, RLS, grant and trigger** before declaring copy safe; NEVER run a blanket trigger disable against Cloud or live host. Run exact source 49 FK, 69 routines/65 definer owner/search_path/EXECUTE, auth UUID+Google subject, rows and CIRCLE/DC9/Storage checks. Evaluate 8 OWNER_DECISION_STOP FK and shared profile privacy fields before any prune. No `DROP ... CASCADE`; create one **reviewed migration/sanitization SQL allowlist with dry-run diff**, delete MP/Robo only in quarantine, assert no residual MP/Robo rows/roles/functions/tokens, no active worker.
5. Export **sanitized Club-only** dataset from the quarantine to a SECOND **recipient-encrypted archive** and restore it to a *separate disposable* test target, check independent QA 31 negative actor cases/GoTrue/Storage/role/RPC and full bytes. **Only the sanitized encrypted payload may later be considered for VM transfer** after Stage1 G8 and separate host/data G4; it does NOT automatically authorize an issuer/DNS/worker switch. Freeze/delta/rollback handled by separate release Gate.

**RETENTION / ERASURE CONTRACT TO APPROVE, NOT A POLICY YET:** owner to approve a short quarantine lease (proposed maximum **72 hours after successful sanitized-checkpoint receipt**, or earlier if requested; incident/legal requirement may override), least-privilege key custody, twice-signed inventory, and expiry alert. Clear attached sensitive containers/bind mounts/snapshots after approved retention; destroy **separately held temporary encryption keys** for cryptographic erasure and independently validate no dangling Docker volume/archive copies or unencrypted dumps. **`rm -rf` is NOT verified secure erasure on APFS/SSD snapshots**; do not claim secure deletion from ordinary file delete. Long-term retention of the **Club-only** encrypted backup and second independent copy requires a different owner-controlled retention class (propose 30 days after verified G8 only if accepted), recovery-key rotation and at least one end-to-end DECRYPT+RESTORE rehearsal. MP/Robo encrypted quarantine must NOT be retained with Club backups.

### W33-D. Size evidence and reproducible **measurement-based** envelope (no guessed multi-GB minimum)

| Item | Current measured data | Future proof before real Gate |
| --- | --- | --- |
| Mixed source PG physical | **29,371,539 B (28.011MiB)** including MP/Robo and system | Actual roles/schema/data **plain SQL export byte totals**, SHA, source rows/extension versions; relative sizes may exceed PG physical |
| Club private Storage metadata | **16 objects; 23,934,580 B (22.826MiB)** | Real authenticated object **body** byte total, per-object SHA256/content type/ACL and failure/retry evidence; DB dump excludes bodies |
| Backup/archive encrypted bytes | **NOT MEASURED** | Record actual size after encrypted packaging, key escrow, restore decrypt round trip |
| Quarantine PGDATA and WAL/temporary usage | **NOT MEASURED** | Measure actual `du` inside future isolated, approved writable fixture during restore with peak and 2x observed margin; forbid root Docker spill and unintended host ports |
| Sanitized Club-only PG/Storage & restore | **NOT MEASURED** | Independently encrypted **SECOND** snapshot & isolated second restore with actual size/manifest, Q-01 31-case G6, exclusion negatives |
| Docker/Auth runtime itself | W32 five immutable image **compressed registry layers 713,766,910 B**, UNPACKED unknown | Runtime image/PG17+Auth+API/Storage network isolation on approved fake-only fixture; independent capacity/cgroup resource measuring |
| Shared VM | Last verified ~**40.96GiB** free, >=16GiB existing-services protected reserve (PROPOSED) | Stage2 HOST G4=NO until host hard quota/mount safety, full representative concurrent overlap and off-VM independent restore; source 28MiB size does not override this |

**Sizing formula for OFF-VM quarantined restore**, use REAL measurements once available, not static fixed 12.5GiB:
```text
LOCAL_QUARANTINE_PEAK_BYTES =
  max_observed(roles.sql + schema.sql + data.sql
               + decrypted source SQL during controlled import
               + quarantine PGDATA/WAL/temp
               + intermediate sanitized export
               + quarantine Storage real bodies
               + container image/overlay + encrypted backup archive)
  + documented restore/retry headroom based on observed peak
OWNER APPROVES ONLY WHEN: no default Docker/Cloud/MDAO/Game spill;
  readable TWO separately encrypted copies; restored Club-only data
  verified, temporary mixed-source dump retention and key custody signed.
```
This is intentionally more conservative than merely adding the `28MiB + 23MiB` data figures, but **does not claim tens of GiB actually required**. Keep W32 hard isolation and protected host Gate NO; if future Mac full quarantine is owner-approved, stage on Mac **off VM** first and send only reviewed Club-only clean dataset to target later. The baseline full-source dump is a sensitive **mixed MP/Robo** export, even if only 28MiB.

### W33-E. Owner answers and exact acceptance

**No repeated Kirill ALPHA default-443 ask:** already accepted as relayed in W29. **No repeat 49-FK enumeration:** Backend canonical #228. New minimally sufficient authority packet for Lead to route at the *right Gate*, not presume approval:

1. **Club + MP/Robo owners:** specifically permit or deny *temporary encrypted full mixed source snapshot* of 56 public tables + Auth into MAC OFFLINE quarantine, approve 8 disputed legacy FK dispositions and `profiles.full_name/avatar_url` privacy, and designated **operator/custodian/key recovery actor**; if MP/Robo owner denies, fall back to A selective Club-only export (no full mixed snapshot).
2. **Backup/recovery:** accept or reject Mac FileVault+dedicated encrypted APFS sparsebundle as TEMP OFF-VM stage and specify a SECOND independent encrypted backup destination/custodian; agree quarantine lease and verified cryptographic erasure plus independent decrypt+restore receipt. **No export until G4**.
3. **Kirill shared-host:** name protected non-destructive MDAO positive canary and future shared Nginx reload/rollback operator, accept host disk isolation + representative 24h ALPHA+BETA+MDAO resource evidence. This does not block offline design on Mac but BLOCKS VM target G4.
4. **Lead + QA:** resolve Stage1 G8 before Stage2 execution or approve explicit serial dependency exception, create one Stage2 Result/G4 scoped to fake-only first; independent Q-01 source-faithful 31-case QA with no MP/Robo/tokens/SMS/SMTP/worker leaks and original Cloud unaffected.

```text
STATUS: W33 EXACT_SOURCE_SIZING + OFF_VM_ENCRYPTED_QUARANTINE_PLAN COMPLETE / G3 ONLY
CHECKED: Lead 6329752219 direct Cloud 29,371,539B source; B-01 49-FK/33-hash/31-case and clone-first proposal; official Supabase restore guide; owner Mac FileVault/readonly hdiutil syntax and free space from current mount
CHANGED: same existing one-file Draft PR #257 report only; NO production code or G4 decision
VERIFIED: all measured source and legacy capacity estimates properly separated; Mac built-in encrypted APFS sparsebundle option exists, NOT EXECUTED
NOT VERIFIED: actual full logical dump byte size or consistency; sensitive mixed source consent, quarantine host isolation/credentials, second independent encrypted location, object bodies, off-VM restore, RPO/RTO, protected VM host G4 and Stage1 G8
BLOCKERS: MP/Robo data custodian + Club owner approval, safe key/second-storage custody, 8 legacy FK/privacy choices, QA/restore and future VM host Gate
NEXT: Lead obtains an explicit bounded owner data/quarantine/retention/second-copy decision after Stage1 G8 or serial exception; B-01 validates actual versioned dump semantics in fake-only isolated restore FIRST
PRODUCTION / VM / MAC EXISTING CONTAINERS / CLOUD / DNS / MDAO / LIVE EFFECT: NONE
```

## W32 · Exact five-service staging resource equation, actual registry layers, ext4 quota and off-VM candidate — 2026-10-22 00:15–00:17 UTC

**DECISION: `HOST_TEST_G4_READY=NO` / `VM_HOST_DISK_ISOLATION=NOT_PROVEN` / `STAGE2_REAL_DATA_G4=NOT_AUTHORIZED`.** This responds to [Lead W32 #255](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6329425915) using B-01's [measured Cloud source and bounded test-only caps](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6329351681), and the already accepted [W31 VM read-only snapshot](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6329204808). **Kirill's owner-relayed acceptance of CURRENT ALPHA implicit HTTPS :443 default is already closed at [W29](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6328901739); do NOT reopen it.** This is another short read-only *decision evidence* update to the existing one-file DRAFT PR #257, not a new Compose or Result.

### W32-A. Measured host disk/isolation feasibility: an actual missing prerequisite

**DIRECT read-only at `2026-10-22T00:15:48Z`** from existing trusted owner-Mac with pinned key and strict known_hosts: root/Club and Docker root both reside on **`/dev/sda1`, `ext4`, mount `rw,relatime`**. `tune2fs -l` feature set has **NO `project` and NO `quota` feature**; live mount has no `prjquota`/`usrquota`/`grpquota`. Legacy host has no `setquota`, `repquota` or `quota` tools. `docker info` driver **`overlay2`**, Cgroups **v2/systemd**, Docker root `/var/lib/docker`. This means **the recommended per-volume 4G PGDATA/WAL, 2G Storage and 6G scratch in W31 are numerical planning ceilings, NOT enforceable disk hard caps on current host**. Docker Compose `mem_limit`/CPU controls can be separately validated for containers; they do NOT impose persistent-volume disk quotas. PostgreSQL `max_wal_size=1GB` is a **checkpoint target not absolute WAL disk limit**.

Read-only `df -kP /srv/dementor`: **42,946,184 KiB = 40.9567 GiB available**, 75GiB nominal filesystem, 43% used, **4,183,837 inodes available**. **No Club API on proposed :18431, no Club backend installed** per Lead W31. This point measurement is NOT a future free-space guarantee and must not be converted to installation approval.

**Conditional isolation options requiring explicit Kirill+owner G4 (NOT implemented):** filesystem-sized, fully preallocated independent loopback ext4 mounts (one PGDATA+WAL, one private Storage, one restore scratch) with boot/systemd mount lifecycle, negative ENOSPC+WAL behavior tests, root/mount ownership and full site rollback; OR a dedicated volume/partition with verified filesystem quota support and host-level alerts. Both are **host changes** affecting shared disks and recovery; loopback preallocation reduces free disk immediately, and `overlay2` image writable layers/logs/unpacked images still remain on root unless separately bounded. `fallocate`/mount/resize/prjquota feature activation and Docker configuration are **NOT AUTHORIZED NOW**; never propose `docker system prune`/MDAO volumes `/data/*`/game cleanup. **Without independently verifiable hard disk ceilings+boot/recovery test, classify the shared host as `HOST_UNSAFE` for a new Club stage**, regardless of impressive idle RAM.

### W32-B. Exact current-vs-required staging resource equation (TEST ONLY, fake identities, worker OFF)

**B-01 five components; proposed CAP not enforced:** PG17 **768 MiB / 0.80 vCPU**, GoTrue **256 MiB / 0.20**, PostgREST **256 MiB / 0.20**, Storage API **512 MiB / 0.40**, gateway **256 MiB / 0.20** → summed proposed maximum **2048 MiB RAM and 1.80 vCPU**. No Studio, Analytics, Realtime, imgproxy, Telegram Edge/cron, external Google provider or real user/Storage copy. Memory cgroup v2 can *propose* strict `memory.max` and `pids.max`, but restart/OOM/failure semantics with this canonical schema are NOT TESTED; 1.8 CPU worth of quotas is not guaranteed latency isolation of ALPHA/BETA/MDAO on four shared cores. Source relation count ~2MB and declared 16 private Storage objects ~24MB are not a steady-state PGDATA/WAL/S3 footprint.

**Image-size registry evidence, no image pulled/started:** on authorized Mac, `docker buildx imagetools inspect --raw` for five W24 pinned candidate upstream image tags followed **linux/amd64** manifest references and summed **compressed registry-layer sizes**:

| Pinned candidate image | Compressed manifest layer bytes | Scope / remaining uncertainty |
| --- | ---: | --- |
| `supabase/postgres:17.6.1.136` | **367,203,535** (29 layers) | Compressed network layers, NOT actual root overlay2 usage |
| `supabase/gotrue:v2.189.0` | **26,259,857** (6) | Target OAuth schema/Google identity compatibility NOT tested |
| `postgrest/postgrest:v14.12` | **6,301,482** (1) | 69 source RPC/runtime definition parity NOT tested |
| `supabase/storage-api:v1.60.4` | **244,025,276** (13) | Private object bytes and ACL parity NOT tested |
| `envoyproxy/envoy:v1.39.0` | **69,976,760** (9) | Envoy override still needs removal of dangling Studio dependency before Compose test |
| **SUM, no shared-layer dedup** | **713,766,910 bytes = 0.66475 GiB COMPRESSED** | **Expanded layers, cache and container writable layers NOT MEASURED. DO NOT BUDGET ONLY COMPRESSED.** |

**Disk obligation formula in GiB**, all distinct from system already in use:
```text
D_required_total_additional = DB_PGDATA_PLUS_WAL(4)
                            + PRIVATE_STORAGE(2)
                            + ROTATED_LOGS(0.5)
                            + INDEPENDENT_RESTORE_SCRATCH(6)
                            + HOST_PROTECTED_EXISTING_FREE_RESERVE(16)
                            + EXTRA_PEAK_GROWTH_BUFFER(8)
                            + IMAGE_UNPACKED_AND_OVERLAY(I_actual)
                            + OTHER_TMP_AND_WAL_OVERFLOW(T_actual)
                         = 36.5 + I_actual + T_actual GiB
VM_free_current         = 40.9567 GiB
remaining_for_I_and_T   = 4.4567 GiB
IMAGE_COMPRESSED_LOWER_SCOPE = 0.66475 GiB; I_actual UNKNOWN, T_actual UNKNOWN
HOST_TEST_G4_READY      = NO (hard disk caps absent, 24h representative load absent, restore and authority absent)
```
This 36.5GiB requirement includes the protected existing-service free reserve (16) and an additional 8GiB future growth cushion; neither is an expendable staging allocation. **Do not treat compressed image bytes as a rigorous mathematical lower bound for deduplicated on-disk `I_actual`: registry data, shared already-downloaded layers and decompression may change actual incremental bytes either way.** Only a measured approved disposable image install and validated quota/cgroup/ENOSPC test could establish it.

**Fail-closed future G4 proposal (NOT enforced):** if Kirill/Club owner ever authorize an isolated test, admit only after BEFORE `df` gives at least **16GiB protected reserve + 8GiB growth buffer** *after preallocating* all stage-specific disks, actual image layers and restore scratch. Abort and bounded rollback if any: root available below **24GiB**, host `MemAvailable` below **3GiB** for 5 min or **2GiB** at any instant; any `memory.events` `oom/oom_kill` increase, protected game/MDAO restart, SSH/Nginx readiness regression, protected game p95/SSE/save error exceeds explicitly recorded per-owner baseline, sustained CPU idle below **25%** or iowait above **10%** for 5 min; WAL/storage/temp exceeds proven quota; unintended host API/DB public bind. These are proposed conservative **STOP thresholds**, not claims of achieved uptime/availability. No one should automatically restart/migrate game or clean legacy images to recover capacity.

**Representative ≥24h overlap availability:** historical `sar sa21` **138 × ten-minute samples** had minimum CPU interval mean idle 95.46% and sampled MemAvailable 6.39GiB, but ALPHA was too new for 24h concurrency. At current `00:15Z` only new `sa22` ~6.9KB with 00:10 samples; **impossible to certify 24h actual simultaneous ALPHA+BETA+MDAO workload with these records now**. A timer/interval alone cannot replace real session/SSE/iPhone/DB workload evidence. No paid daemon deployed or artificial/stress game traffic injected. Future Kirill-approved read-only `sar -u -r -q -d -n DEV`, `docker stats --no-stream`, cgroup `memory.events`, `df` and existing service logs **metadata/error-count only** at start/end can establish a qualified 24h record, with QA/Game documenting representative sessions. No monitoring service installed from this task.

### W32-C. No-added-fee off-VM encrypted restore destination candidate and operations contract — NOT EXECUTED

**READ-ONLY Mac feasibility:** connected owner Mac has `FileVault is On` and **532,120,976 KiB (~507.47GiB)** currently free, not an external drive. This is **a feasible potential off-VM storage destination by capacity** but **NOT a nominated custodian, approved real-account transfer or a proven independent failure domain**. Encryption *at rest* through FileVault **alone does not provide per-archive independently recoverable encrypted exports**. `openssl`, `tar`, `shasum` exist; **`age` and `gpg`, `pg_dump`, `pg_restore` are NOT installed on this Mac**, so no approved encryption and restore CLI workflow exists yet. No source Cloud secrets, SQL dumps, PII, image payloads or test data copied.

**OWNER DECISION PACKET / exact gated operations in a dedicated future Result (not a command to execute now):**
1. Club **data owner** names approved migration export operator, permitted tables/columns (including `profiles` privacy), exact 49 FK/four trigger/69-RPC + excluded MP/Robo and unknown empty tables dispositions, 11 Google account UUID/identity grant, a separate **backup custodian** and a key escrow/recovery custodian; Kirill approves protected VM destination/restore operator if it will touch VM. Mac alone is only a *candidate* recipient; recovery requires a separately held tested encrypted copy outside the VM and preferably outside the laptop.
2. After explicit **DATA G4**, a compatible version-pinned `pg_dump`/approved allowlist extractor creates a **consistent, privileged, Club-only** database Auth/schema/RLS/RPC export and copies **actual** 16 private Storage bodies with content-type, path, exact size and SHA256 in owner-private manifest. Exclude Cloud sessions/refresh tokens/flow states, MP/Robo, JWT/OAuth secrets, prohibited schema and live Telegram sends. Freeze/catch up only at future separate cutover; do not naïvely use a complete mixed `pg_dumpall`.
3. Before network transfer, the approved tool performs **recipient-key authenticated archive encryption** (`age` or separately vetted equivalent), storing only an **encrypted** archive on the owner-controlled Mac and separately approved second medium; `umask 077` and private directory plus off-Git key custody. Never run `openssl enc` ad-hoc with a shared passphrase. Record private archive SHA256, size, schema/row/object manifest, UTC snapshot sequence and key-unlock custodians separately from public PR.
4. Restore to a **new** separately authorized disposable PG17/GoTrue/Storage network-isolated fixture (never existing B-01 or MP shared Supabase), with worker/Telegram/Google outbound paths disabled. Run schema/role/RLS/DEF grants and Auth provider UUID/identity mapping checks, per-object decrypted SHA equality, 49 FK validated, 28/69 function baseline comparisons and 9 actor positive/negative semantics. Add failure injection: partial archive, missing Storage object, expired fake JWT, incompatible GoTrue version. Preserve old Cloud as original MP/Robo and Club recovery fallback.
5. Measure `RPO_actual = last_safe_source_write_UTC − last_included_restore_checkpoint_UTC` and `RTO_actual = restore_usable_UTC − incident_or_restore_start_UTC` under owner-defined tests, give PASS only after independent Q-01 acceptance. Targets `RPO ≤15min`, `RTO ≤120min` are **UNMEASURED PROPOSALS**, not availability promises. Account for writes accepted by target after cutover: reverse reconciliation and exactly one Telegram sender; no blind DNS rollback.

**READ-ONLY verification commands for Kirill in his future authorized change window** (examples, NOT RUN by W32): `findmnt -no SOURCE,FSTYPE,OPTIONS -T /srv/dementor`; `df -kP /srv/dementor`; `ss -lnt`; `docker info --format '{{.Driver}} {{.DockerRootDir}}'`; `sar -u -r -q -f /var/log/sysstat/saYY`. **Future MUTATING restore/volume setup needs its own exact bounded Bash/Compose files, config dry validation and rollback review, not execution from this document.** No approval to create compressed backup, mount loop filesystem, enable ext4 quota, install `age`, export Cloud or modify MDAO, ALPHA/BETA and current Club site.

### W32-D. Binary answer to Lead, shortest unblock route

```text
STATUS: W32_HOST_CAPACITY_MATH+FILESYSTEM_QUOTA+OFFVM_CANDIDATE_CHECKED
HOST_TEST_G4_READY: NO
HOST_UNSAFE_NOW: YES (no verified enforceable disk quotas, no mature 24h representative game+MDAO peak, no signed host/data Gate)
CHECKED: ext4 root/mount/FS-feature flags and overlay2 driver; current 40.9567GiB free; five exact registry-layer compressed sizes; owner Mac encrypted-disk/free-space/tools availability; W31/W32 source sizing
NEW EVIDENCE: project ext4 quota unavailable in current live mount; 713,766,910 bytes registry compressed; formula 36.5GiB + I_actual + T_actual; Mac FileVault ON with 507GiB free, but not approved backup custodian
ACCEPTED: B-01 5-service/2GiB memory/12.5GiB test-only input; current ALPHA implicit 443 accepted by Kirill (W29); MDAO owner says required workflows work
NOT VERIFIED: actual expanded images and enforceable isolated disk; simultaneous 24h real sessions/save/SSE/network-error rates; off-VM encrypted DB+Storage copy/restore & RPO/RTO; private key custody; signed Kirill positive MDAO canary or documented limitation and reload/rollback operator; Stage1 G8 and Stage2 host/data G4
OWNER+PERMISSION: Lead/Club owner must approve separate Stage2 test-only Result and scope *after* Stage1 G8 or explicit dependency Decision; Kirill approves host quota/mount and rollback; data custodian approves export/recoverable encryption; Q-01/GAME acceptance separately
NEXT: keep original VM running unchanged. Shortest safe fallback: retain already accepted B-01 synthetic-only Mac testing and, after a new source-faithful Result/G4, use isolated **localhost/internal-network Mac** fake-data fixture for full schema parity. No real Cloud copy or VM host install. Independently solve 24h load + owner-restorable encrypted backup + hard disk quotas before reevaluating VM test G4.
PRODUCTION/VM/MAC EXISTING WORKLOADS/DNS/MDAO/LIVE/CLOUD EFFECT: NONE
```

## W29 · Kirill accepts current ALPHA unknown-SNI default HTTPS vhost — 2026-10-22 (owner-relayed)

**STATUS: `DEFAULT_443_ALPHA_KIRILL_ACCEPTED_OWNER_RELAYED` (NARROW HOST-POLICY RISK DISPOSITION) / HOST/PRODUCTION G4+G8 STILL BLOCKED.** The Club owner explicitly relayed Kirill's confirmation that **ALPHA is acceptable as the current default HTTPS service**. Canonical owner-relayed [#255 acceptance record](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6328901739) and linked [Game SRE #51 cross-project handoff](https://github.com/SLADZARI/dementor_live/issues/51#issuecomment-6328904244). This is **not** presented as a direct signed GitHub statement by Kirill, an approval to mutate the VM or a changed Game ownership boundary.

**NEW read-only external verification from authorized Mac on 2026-10-22:** TLS no-SNI leaf at `138.199.144.94:443` = `CN=alpha.138.199.144.94.sslip.io`, expires `2027-01-19 19:26:45 GMT`. Named SNI leafs remain separated: `dementor.club` = Club CN (expires `2027-01-15 17:14:06 GMT`), `play.dementor.club` = play CN (expires `2027-01-19 21:48:55 GMT`), `alpha.dementor.club` = alpha CN (expires `2027-01-19 21:49:05 GMT`). This validates current cert routing at **TLS handshake tier**, not MDAO functional health, game identity, two real clients or certificate renewal automation. Prior W28 direct Nginx syntax, original four MDAO/default hashes and Club vhost no-drift proof below remain historically valid.

**DECISION BOUNDARY:** leave current ALPHA implicit 443/default intact. There is no need to switch it back to n8n or rework shared/default Nginx solely to resolve default ownership. Game SRE owns future Game vhost changes; Kirill's confirmation resolves **this one host policy blocker**, not separate new vhost/reload rights. **Still STOP** on Club selfhost installation / account copy / DNS-OAuth switch / Certbot mutation, MDAO `/data/*`, production deploy, off-VM restore and Stage1 G8. Positive non-destructive MDAO canary or explicit coverage-limit signoff, named shared reload/rollback operator, representative ≥24h game+MDAO peak and encrypted off-VM DB+Storage timed restore with approved custodian remain required.

`CHECKED=Owner-relayed Kirill statement + current exact no-SNI and named-SNI certificate subjects | CHANGED=Draft #257 docs-only chronology and GitHub #255/#51 evidence | VERIFIED=Existing default TLS identity + segregated named SNI | NOT VERIFIED=MDAO functional canary, 24h shared-host peak, independent restore, renewal, host/cutover G4 | NEXT=A-01/Game SRE/Kirill retain protection; resolve other blockers | PRODUCTION EFFECT=NONE`.

## W28 · Lead new Game ALPHA canonical-host correction, protected vhost NO-DRIFT · 2026-10-21 23:24–23:25 UTC

**STATUS: READ-ONLY POST-GAME-G6 HOTFIX HOST COMPARISON DONE / CLUB HOST G4+G8 STILL NO-GO.** Source authority: [Lead W28 migration handoff #237](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6328701384), [Lead W27 #255](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6328135991), [Game SRE #51 actual ALPHA canonical host repair](https://github.com/SLADZARI/dementor_live/issues/51#issuecomment-6328688155). Game SRE PR #59 exact repair source `f3017df0cf0c449a19ce9ac7015e1e65343b873e` is owned by GAME, not Club. Existing Web/UI Result v0.2 on active single branch and Stage1 pending G8 remain unaffected. No new infra plan/branch/service added by Architect.

**DIRECT read-only checks** via owner-authorized online Mac existing verified SSH, VM UTC 2026-10-21 23:24:04Z and 23:25:28Z, plus normal client CA-trusted **unauthenticated HEAD** from Mac. No cookies, bearer, auth sessions, secret/config bodies, legacy data, game worlds or private objects inspected.

| Protected or changed target | Observed fact | Verdict |
| --- | --- | --- |
| Shared Nginx syntax | `nginx -t` PASS after Game SRE separate Alpha canonical-host fix | **PASS current config syntax**; NOT a protected app E2E PASS |
| Original legacy/default four config SHAs | `default=ce0901350a021608139b5639cf4ccd7717bef8c3a9e4f79031eb46386b67b03f`; `graylog.conf=4574f21408c4cc60b93343a0ee75091485583789dc6a7867929196eb7cc7d5d3`; `monitoring.conf=c547a60bae6ade4735c30f5d0183af74266cb8223506ef3a9ae7a0c857f2ce18`; `n8n.conf=f6eaeb722e748240f89bcde9f99612b2096c69fb9ee76a2c2307e356dd7d4064` | **PASS exact current hash parity** to W18/W27; owner already reports MDAO required workflows work, **no repeated 502 as incident** |
| Existing Club and game vhosts | `zz-dementor.club.conf=899fad9bc3f1387dcb5865819f135df48f323e6ebd41eedae5200d78dd2cf6bf`; `dementor-live.conf=b6846c6625dc6d92ed9118f557d6f478e56061d517a7e6617b4f52ed1c923fcd`; `dementor-live-alpha.conf=33ece5481ac6fa97cb29664de78b7d9b6110d23fd52a8cac14c16c240b5eb0cd` | **UNCHANGED since W27**; no Club vhost rewrite by Game repair |
| Game canonical new file | `dementor-live-canonical.conf` W27 SHA `7100d55e30c4222496842a836105756c5d921e77c867e20fab2368b5b8c3d72c` → current SHA `826f1c1f4c9c1df69ad1f33be304b6d4b442f9388192e116ef722e70aea3af98` | **CHANGED, game-only ownership.** Consistent with #51 reported Alpha canonical Host-header hotfix; identity/cause proven by Game SRE's own report, Architect did not diff private gate values |
| Docker/listeners | BETA and ALPHA containers both healthy, protected `db-dev` up 19 months; game `127.0.0.1:14173`/ `:14174` listen; proposed Club API `:18431` NOT bound | **PASS current protected process/bind inventory**; no Stage2 backend running |
| Public unauth TLS and routes | `https://dementor.club/` **200 trusted CA**, www **301 trusted**, `https://play.dementor.club/api/health` **200 trusted**; `https://alpha.dementor.club/` **302 trusted** and `/__alpha_enter` **401 trusted** for unauth client. Each `curl ssl_verify_result=0`, remote IPv4 VM | **PASS narrow unauth ingress smoke**. **Does not prove authenticated ALPHA 200 or two real players/iPhone/CharId**; game #51 has its separately reported synthetic-gate-cookie 200 only |
| Direct current SNI leaf subjects | Unknown SNI → alpha sslip.io; explicit n8n→ n8n, Club→ Club, play→ play, alpha→ alpha; BETA IP Host API status **200** | **PASS named-certificate segregation.** Current implicit 443 default **still Game ALPHA**, with **Kirill + Game SRE formal ACCEPT/BLOCKED pending**; no Club vhost/default edits allowed |

**ACCEPTANCE BOUNDARY:** This is a meaningful *new* W28 check following Game #51 post-W27 repair, not redundant full W27 capacity, static parity or MDAO 502 scans. It independently confirms **the only new vhost hash delta under the Game correction** and protected Club/MDAO/default static hashes intact. It does **not** substitute for Kirill's **non-destructive positive business canary** and named shared Nginx reload/rollback owner, Game SRE+Kirill explicit unknown TLS SNI default decision, Certbot DNS-01 unattended renewal test or approved manual schedule, **representative ≥24h ALPHA+BETA+MDAO under game sessions** (last prior ALPHA uptime ~2h), or encrypted off-VM Club DB+Storage *real restore with RPO/RTO*. No data owner, backup authorization or Stage2 host/cutover G4 is on record. Those remain STOP before self-hosted backend.

```text
STATUS: W28 POST-GAME HOTFIX PROTECTED VHOST CHECK DONE / HOST G4 BLOCKED
CHECKED: existing Lead+Game SRE #51, current host config SHA, Nginx syntax, process health+loopback, CA-verified unauth routes, selected SNI
CHANGED: one existing Draft PR #257 REPORT ONLY, no game/Club host changes
VERIFIED: 4 original protected/default SHA unchanged, Club vhost unchanged, only Game canonical file changed since W27; both games healthy; narrow public TLS/HTTP
NOT VERIFIED: Kirill formal MDAO positive canary/operator and default-443 decision, 24h simultaneous representative peak, unattended renewal, off-VM real restore, owner Stage1 G8 and Stage2 host G4
BLOCKERS: explicit cross-owner host acceptance and release/cutover grants
NEXT: Lead/Kirill/Game SRE respond to already linked #51 ownership ask; maintain B-01 no-port sandbox; QA/Lead serial Web/UI G6/G7/G8; no new host action from A-01
PRODUCTION / MAC / VM / NGINX / DNS / CLOUD / MDAO / GAME EFFECT FROM A-01: NONE
```

## W27 · Lead current host SRE evidence, Game canonical TLS and Stage2 go/no-go — 2026-10-21 23:00–23:03 UTC

**AUTHORITY:** [Lead W27 #255](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6328135991) and [W27 parent #237](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6328135331). Existing W24 six-image pinned proposal stands; **NO duplicate Compose, fixture, network or PR**. D2 owner-approved synthetic-only Mac fixture is **now actually operated by B-01**, not A-01/I-01: B-01's [24/24 synthetic HTTP tests twice](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6327620792) use a private `dc-b01-g4-synthetic` network with zero published host ports. It remains a *7-table source-derived analogue*, not 28-table/69-RPC/real PKCE acceptance. **DO NOT touch/recreate it**; Q-01 independent acceptance remains separately owned. Active PROJECT Result is Web/UI G5 on branch `fix/board-composer-visual-stability-20261020`; Stage1 G8 and Stage2 real-VM host G4 remain NOT AUTHORIZED.

### W27-A. DIRECT historic OS metrics read, not a new stress test

On **already connected trusted** `MacBook-Pro-Zena.local`, current root SSH key/known_hosts with `BatchMode=yes` and `StrictHostKeyChecking=yes` authenticated to existing VM. Read-only commands: `date`, `uptime`, `free`, `df`, `docker stats --no-stream`, `ss -lnt`, `systemctl is-active/show`, `nginx -t`, `find`, `sha256sum`, `openssl x509/s_client`, `sar` reading preexisting system historical `/var/log/sysstat/sa21`. NO storage/media/DB/game/MDAO contents or Certbot hook secrets read, no new monitoring process, no files or services changed.

| Metric at 2026-10-21 23:00–23:03 UTC | DIRECT evidence | Assessment |
| --- | --- | --- |
| Host OS / load | **4 vCPU**, load **0.18 / 0.12 / 0.12**, RAM **7751 MiB total / 6800 MiB available**, **0 swap**, filesystem **75G total / 41G available (43% used)** | POINT-SAMPLE ONLY, not peak capacity |
| Historical `sar` CPU | Existing Oct 21 sysstat **138 valid ten-minute samples** spanning **00:10→23:00 UTC**; MIN interval-average **CPU idle=95.46%** at 14:40 UTC; sample-set max one-minute load **0.53** at 10:50 UTC | Direct **historic measured series**, but is **per interval mean**, not subminute peak or per-service p95 |
| Historical `sar` memory | Same 138 samples, minimum `kbavail=6,703,276 KiB` at 21:30 UTC (≈**6.39 GiB**) | Direct historical lower bound for those samples; excludes transient dips between samples |
| CURRENT simultaneous game/legacy process points | ALPHA **5.26% CPU / 37.74 MiB** Docker memory, BETA **19.00% CPU / 71.09 MiB**, db-dev **0.00% / 36.05 MiB**; all three containers healthy/running; Beta Host/IP `/api/health` **HTTP200** | Single Docker `--no-stream` instant; CPU percentages per container are NOT VM percentage; no 24h game events, saves/SSE or iPhone p95 |
| Listening/port exclusion | 80/443 public Nginx, game **127.0.0.1:14173/14174**, db-dev **0.0.0.0/[::]:32778** unchanged; proposed Club backend `127.0.0.1:18431` **no listener seen** | Existing services protected; proposed port NOT reserved or approved |
| Capacity interpretation | BETA has been up ~9h and ALPHA only ~1h at this check, MDAO/db-dev long-running; archived 138 samples **do not span 24h of ALPHA+BETA+MDAO together**. W24 resource caps total **3328 MiB**, disk proposal ~**41 GiB** plus unknown restore scratch | **STAGE2 SHARED-VM CAPACITY=NOT APPROVED** despite low measured OS CPU: need ≥24h representative concurrent players and event load, worst-case game/DB/Storage RAM/disk/latency and >16GiB protected free reserve, and restore scratch before G4. No blind `docker compose up`, `prune`, swap or resizing |

### W27-B. Exact current Nginx cross-project evidence after Game SRE canonical domain release

[Game SRE #51 canonical DNS/TLS work](https://github.com/SLADZARI/dementor_live/issues/51#issuecomment-6328353057) owns recently enabled **`dementor-live-canonical.conf`**, play/alpha A records and certs; Game PR #59 SHA `ec39f7cbda6fcea6eb5038e90703ac2d4a201f51` is separate DRAFT/game owner. Independent VM read-only `nginx -t` **PASS** and current *enabled site list*:

`default`, `dementor-live-alpha.conf`, `dementor-live-canonical.conf`, `dementor-live.conf`, `graylog.conf`, `monitoring.conf`, `n8n.conf`, `zz-dementor.club.conf`.

**Current SHA256 named-vhost metadata, at 23:02 UTC:**

| Site | SHA256/current role | Compared with W18 |
| --- | --- | --- |
| `default` | `ce0901350a021608139b5639cf4ccd7717bef8c3a9e4f79031eb46386b67b03f` | SAME |
| `graylog.conf` | `4574f21408c4cc60b93343a0ee75091485583789dc6a7867929196eb7cc7d5d3` | SAME |
| `monitoring.conf` | `c547a60bae6ade4735c30f5d0183af74266cb8223506ef3a9ae7a0c857f2ce18` | SAME |
| `n8n.conf` | `f6eaeb722e748240f89bcde9f99612b2096c69fb9ee76a2c2307e356dd7d4064` | SAME |
| `dementor-live.conf` | `b6846c6625dc6d92ed9118f557d6f478e56061d517a7e6617b4f52ed1c923fcd` | CHANGED previously; **GAME OWNER** |
| `dementor-live-alpha.conf` | `33ece5481ac6fa97cb29664de78b7d9b6110d23fd52a8cac14c16c240b5eb0cd` | NEW GAME OWNER |
| `dementor-live-canonical.conf` | `7100d55e30c4222496842a836105756c5d921e77c867e20fab2368b5b8c3d72c` | NEW GAME OWNER |
| `zz-dementor.club.conf` | `899fad9bc3f1387dcb5865819f135df48f323e6ebd41eedae5200d78dd2cf6bf` | NEW EXISTING CLUB |

**Direct live SNI leaf subjects** (no HTTP credential/auth interaction): unknown `unknown.invalid` ⇒ **`CN alpha.138.199.144.94.sslip.io`** (ALPHA is still implicit default 443); `dementor.club` and `www.dementor.club` ⇒ `CN dementor.club`; `n8n.g155333.ru` ⇒ `CN n8n.g155333.ru`; `alpha.dementor.club` ⇒ `CN alpha.dementor.club`; `play.dementor.club` ⇒ `CN play.dementor.club`. Original Beta IP Host API stays HTTP200. Explicit name routing works at **leaf-subject tier**; unknown-host ALPHA default remains an **owner Game SRE+Kirill design choice**, not a Club change. This alone **does not prove HTTPS trust/reachability/private ingress on every route** or full MDAO business application health. Kirill MUST accept protected MDAO named business canary or provide a technical risk/coverage statement before any further shared-host write. User previously reported needed MDAO functions work; **do not label MDAO down** or demand another vague owner check. No existing legacy vhost was edited by A-01.

### W27-C. TLS control and backup/restore concrete Gate

- Current Club apex+www certificate still **valid Oct 17, 2026 to Jan 15, 2027 17:14:06Z**, dual SAN. `certbot.timer` **ACTIVE**; `LastTriggerUSec=Oct 21 16:00:44Z`, `NextElapseUSecRealtime=Oct 22 07:20:56Z` at the snapshot. **This is scheduler evidence only**, not a successful noninteractive DNS-01 renewal or successful Nginx certificate deployment. Preserve owner's temporary **MANUAL RENEWAL WITH NAMED REMINDERS** risk classification from #255; do not flip to AUTO/PASS and do not run a mutating certbot dry-run without DNS/host permission.
- **Encrypted independent off-VM restore**: current status **NOT RUN / NO DEDICATED OWNER GRANT / NOT A BACKUP PASS**. W24 contracts still apply; no Cloud data export or VM backup mutation. For future acceptance, obtain *named* owner (Kirill host snapshot, separate Club private DB/Storage custodian), documented encrypted target and key recovery (secrets out of Git), source exact SHA and approved Club-only allowlist, actual private Storage bytes+SHA/ACL, then isolated PG17+Storage restore with timed UTC start/end, FK/RLS/API/role negatives, `RTO_actual`, `RPO_actual`, failure/rollback proof, second independently held off-VM copy, scheduler OFF until cutover. Proposed RPO ≤15min/RTO ≤120min is **TARGET ONLY**.
- **Before ANY Stage2 VM G4**: commit only a redacted exact host/routing/source decision; require G6 source-faithful 28-table/69-RPC RLS actor negatives (B-01 sandbox currently 7-table analogue), stable single Telegram scheduler, acceptable real-world 24h overlap load and >16GiB residual disk plus restore/backup scratch; Kirill host grant and G7 owner release. The *Mac D2 synthetic-only* permission is NOT real account copy, new Cloud OAuth, VM DB install or production cutover authorization.

### W27-D. Lead handoff / verification tier

```text
STATUS: W27 DIRECT_VM_HISTORY_AND_CROSS_PROJECT_TLS_EVIDENCE_DELIVERED / G3-ONLY
CHECKED: approved kernel active Web/UI; B-01 already-running 24/24 synthetic Mac fixture; VM 138-point historical sysstat + current Docker/OS/ports + cert timer; Nginx five historic and three new-vhost SHA; SNI for six names; Game SRE #51 new domain owner
CHANGED: SAME one-file Draft PR #257 W27 only, NO host/Cloud/Mac/DNS/secret/data mutations
VERIFIED: historical 10-min CPU/RAM samples, live protected configs 4/4 SHA stable, named Club/n8n/game TLS leaf routing, Beta API200, current game+db-dev states, valid unexpired Club cert
NOT VERIFIED: 24h simultaneous representative Alpha+Beta+MDAO load, peak/OOM/save/SSE/iPhone, Kirill positive business probe/rollback signoff, unknown-SNI default owner acceptance, unattended DNS-01 renewal, encrypted independent off-VM restore, real Club 28/69 security negatives and Stage1 G8
BLOCKERS: Stage2 HOST G4/production non-authorized, real backend migration capacity/recovery FAIL-TO-PROVE; keep B-01 D2 fixture intact
NEXT: Kirill+Game SRE select safe positive MDAO canary/443 implicit-default criterion; host owner obtain representative full overlap evidence and encrypted independent restore custodian; Q-01 independent 24 synthetic negatives and exact source differences; Lead serial Stage1 G8 and future Stage2 authorization
PRODUCTION EFFECT: NONE
```

## W24 · Lead Stage2 minimal isolated backend + Mac fixture + recovery contract (2026-10-21 21:14 UTC)

**STATUS: G3 SOURCE + REGISTRY + HOST-METADATA PREP DELIVERED; DEPLOYABLE COMPOSE AND CAPACITY/RESTORE G4 NOT YET APPROVED.** Owner approved target Club-only migration and read-only/offline preparation; [Lead exact #255 W24 task](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6326589657) and [#237 W24](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6326581091) explicitly FORBID existing Mac container restart/rebind, real account/Storage export, VM Docker/ports/network, Nginx/DNS/OAuth or production writes. This section is a minimal **reviewable Compose DESIGN + pinned release candidates**, not a complete runnable Compose or authority to implement. Preserve live Stage1 public site & UUID route and BETA/ALPHA/MDAO unchanged. Existing PR #257 remains single-file Draft/REFERENCE, no competing Result/branch while Web/UI #308 owns active G5.

### W24-A. Actual vendor release source and immutable registry pin receipts — no image pull, no build

**Official self-host release candidate (not yet production certified):** `supabase/supabase` Git ref **`self-hosted/v0.7.2`**, upstream `docker/docker-compose.yml` source blob SHA `d34a43fe755979029636091503b70d818176abd8`; its Envoy override `docker/docker-compose.envoy.yml` source blob SHA `8a2d706ffdba3f4b817011cc922fe925e30a634e`. Refs are public upstream evidence and are NOT this Club's target branch or approved Docker deployment. Base vendor Compose v0.7.2 still defines **Kong 3.9.3**; Envoy is enabled by the official **override**, which disables Kong and wires `functions` to `api-gw`, but it **still depends on Studio** and needs an owner-reviewed minimal removal/dependency reconciliation. **DO NOT** naïvely remove Studio while leaving `depends_on: studio`, or silently deploy mixed Kong+Envoy. Supabase 2026 breaking changes: PG17; Auth `API_EXTERNAL_URL` includes `/auth/v1` ONCE; Envoy gateway separate from outer HTTPS reverse proxy; client `sb_publishable_*` parity must be established before G4. Original mixed-cloud API keys/JWT issuer/secrets never reused as new target production keys.

**Registry queried from authorized Mac via `docker buildx imagetools inspect` READ-ONLY; exact upstream immutable multiarch manifest digests, not pulled or run. Verified linux/amd64 availability where listed.**

| Required service | Candidate vendor image: tag@immutable digest | Confidence / additional proof before G4 |
| --- | --- | --- |
| PostgreSQL 17 + `pg_cron`, `pg_net`, `vault` | `supabase/postgres:17.6.1.136@sha256:f371b5f3f2ac0a05703f33d6e6134515fb2498cab708fb948a0aeb7481467c00` | REGISTRY_PIN_FOUND; local legacy image is `17.6.1.075`, mixed Cloud 17.6.1.121. **ABI/extension/pg_dump-restore compatibility and exact extension availability NOT tested**. Never mount PG15/old local PGDATA into this new target |
| GoTrue Google/PKCE | `supabase/gotrue:v2.189.0@sha256:385184459f57569c54c25209f51f3b2be99ddd7c4ce9e3555b5d3eea8447b7cf` | REGISTRY_PIN_FOUND, provider binding and all-account 11→11 UUID/identities import not validated. No old sessions/refresh/flow states |
| PostgREST v14 API/RPC | `postgrest/postgrest:v14.12@sha256:54000f24847d01a2c2302e0041cf0618b875c57fb48507d743cfa9aaa50bf43c` | REGISTRY_PIN_FOUND, 69 Club RPC+65 SECURITY DEFINER and 10 Cloud/local definition drifts require B-01 exact authority checks |
| Envoy API Gateway v1.39.0 | `envoyproxy/envoy:v1.39.0@sha256:d59f7f5fa10cff6d5892b6c5e7df5c9297ddfb2c3683e33fbfb82da24de4fa66` | REGISTRY_PIN_FOUND; apply official override and **remove Studio dependency safely**, verify signed/publishable key acceptance and JWT/JWKS, 401 vs 403 matrix with actual browser build. No Kong in target |
| Supabase Storage + private S3-compatible API | `supabase/storage-api:v1.60.4@sha256:c8eb9858eafec891a97c27125470aaad54703c3f4eb4d55ca7f1bf6c6411febf` | REGISTRY_PIN_FOUND; use named protected Storage object volume for backend **only after owner selection**; S3-protocol API must be tested separately. **External MinIO is NOT implicitly required/approved**: avoid adding a new memory/disk-consuming object server without source need. Need 16 actual private payloads/bytes/hash proof under data Gate |
| One Edge runtime for Club Telegram | `supabase/edge-runtime:v1.74.0@sha256:2781daf92394db91f7e94129cc3d04ec474ad16a8fe64b3fbeef6e7d557ab120` | REGISTRY_PIN_FOUND; **worker exists but DISABLE runner and external Telegram egress in synthetic/staging**. At cutover one scheduler owner and strict outbox dedupe, rotated new Vault endpoint/keys |
| CLI / fixture compatibility | Existing Mac CLI `2.75.0`, existing `kong:2.8.1`, PG `17.6.1.075`, GoTrue `2.186.0` | OBSERVED only; not equal to candidate. No full self-host v0.7.2 Compose config validation or container trial yet |

**Control plane dependencies that MUST remain:** core Postgres roles/extension setup, Auth/GoTrue Google callbacks and email/redirect configs, Envoy public API/auth/storage/functions routing, PostgREST, Storage, and one Edge runtime. Club worker code (`supabase/functions/telegram-outbox-worker/index.ts`, source blob `be4f757ae9b893885253169734a1d20e1be7321d`) invokes service-scoped `dc_distribution_*` RPC and creates **private Storage signed URL** before Telegram. Current Cloud cron worker runs every minute via `pg_cron`, `pg_net`, Vault; new target must not activate it until old scheduler drained under G7. `realtime`, Studio/pg_meta, Logflare/Vector/Analytics and imgproxy **not included in the default *proposal***, BUT they are **UNPROVEN OPTIONAL**, not verified unnecessary: B-01 must check exact served site/imported RPC callgraph for realtime channels/DB hooks/images and run functional+negative QA, then add a missing service to G3 or STOP. A working external Google OAuth requires tightly scoped network egress for Auth; local fake-only synthetic fixture must not pretend to be a real Google PKCE acceptance.

### W24-B. Candidate VM service resource envelope — target numbers, NOT measured PASS

Current host is a **shared** 4-vCPU, 7.6-GiB RAM, 75G-disk VM; point sample ~**6.7 GiB MemAvailable, 41 GiB free disk, 0 swap**, *with* BETA, ALPHA, MDAO/db-dev/Runner/Nginx. Official full selfhost standalone minimum **4 GiB RAM / 40 GB disk**, recommended **8+ GiB / 80+ GB** at https://supabase.com/docs/guides/self-hosting/docker; those minima are **NOT proof of fit on the shared VM**. For a **hypothetical trimmed** target set these fail-closed **hard cap proposals** (MiB, not promised steady consumption):

| Proposed service | Container memory MAX candidate | CPU MAX candidate | Ownership / exposure |
| --- | ---: | ---: | --- |
| Club Postgres 17 | 1536 MiB | 1.25 CPU | private named DB volume and internal network only, health/readiness and WAL limits |
| GoTrue/Auth | 384 MiB | 0.40 CPU | private network; public only through authenticated gateway/HTTPS |
| Envoy gateway | 256 MiB | 0.35 CPU | `127.0.0.1` **one new nonconflicting high host port** only, HTTPS proxy later separate Gate |
| PostgREST | 256 MiB | 0.35 CPU | private network only |
| Storage | 512 MiB | 0.40 CPU | private Storage objects only; through Envoy, not public direct |
| Edge/Telegram worker | 384 MiB | 0.30 CPU | internal and **disabled except one approved scheduler after cutover** |
| **Total proposal (max)** | **3328 MiB (~3.25 GiB)** | **3.05 CPUs** | **No steady-state/peak test; caps may crash/OOM services, not guaranteed safe** |

**Proposed HARD STOP/acceptance BEFORE shared-VM G4:** observe ≥24h with representative simultaneous BETA+ALPHA/MDAO activity (not 0.02 load sample); reserve **at least 2 GiB host MemAvailable** under representative sustained load and **at least 1 dedicated equivalent vCPU of headroom** for existing game/MDAO and Nginx; zero memory OOM/game stutter/restarts, p95 auth/api/storage request latency within owner-agreed targets, iPhone12 Pro game remains playable. At planned host peak, require all already-running protected containers unchanged. **This cannot be attested from current one sample**. Abort rather than `docker system prune` or add unmanaged swap. Original Beta IP route and persistent world MUST remain unaffected.

**Disk target planning, not a reservation:** project propose initial new named DB data budget **8 GiB**, private object data **8 GiB** (existing Cloud object metadata ~24 MB but not verified), container images/log/WAL/temp **~9 GiB**, protected minimum OS/legacy recovery/free cushion **16 GiB** = ~41 GiB total projected demand. This consumes essentially **ALL reported free disk** and ignores spike/restore scratch: **VM capacity verdict for G4 = FAIL / NOT CLEAR until measured image layers/actual DB/WAL/object growth/offhost restore workspace and safe additional margin**. Do NOT install a full selfhost just because it fits current container RSS. Separate off-VM encrypted backup target is obligatory and not one of those 41 GiB; on-host snapshots are not disaster recovery. Disk quota/rate-limit proposed, NOT configured.

### W24-C. Mac local existing service protection + synthetic fixture proposal

**DIRECT READ-ONLY MAC CHECK 2026-10-21 21:13–21:14 UTC:** Docker Engine+client **29.2.1**, context `desktop-linux`; current `degradation_club` compose network `supabase_network_degradation_club` contains existing PG17.6.1.075, GoTrue v2.186.0, REST v14.3, Kong v2.8.1, Storage and Studio/RealtIme/Analytics/Mail. Current host-bound **54321(API), 54322(DB), 54323(Studio), 54324(Mail), 54327(Analytics)** are published to `0.0.0.0` and `[::]` (confirmed by `docker ps` and Mac `lsof` owned by Docker process). LAN/firewall reachability **NOT VERIFIED**. Two original local auth users' provenance unknown; **DO NOT REBIND/STOP/RESET this existing project** or import private Club/MP/Cloud data into it. Local source with 10 function-body + 2 policy drift not accepted as current production authority.
- **New existing B-01 synthetic PostgreSQL container discovered:** `dc-b01-qa-pg17` image `postgres:17-alpine`, **running**, `network=none`, **NO published ports**, memory cap **805,306,368 bytes (768 MiB)**, separate from above compose and no compose project label. This is **existing**, not a fresh DevOps invention; **DO NOT STOP/ALTER/RENAME/RESET**. It is NOT yet equivalent to real GoTrue/Envoy/RPC/RLS/Storage stack or a verified authorized complete 9-role fixture.
- Mac candidate future host sockets **15431–15435** presently no LISTEN (point snapshot). These are **candidate, not reserved**. After explicit local-only synthetic fixture G4 and B-01 agreement, **reuse B-01 fixture ownership rather than duplicating his PG**, or propose a separate disposable Supabase-compatible `dc-club-qa-sandbox` Compose project/network with randomized dedicated volume prefixes, NO connection to the existing compose network, and ONLY `127.0.0.1:15431` public test-gateway port if absolutely necessary; DB/Studio/Mail/Analytics **no host ports**, while GoTrue/Storage internal. Bind `127.0.0.1` only, never `0.0.0.0`/`[::]`. Validate from a second LAN device no exposure; nonlocal access DENY. No real Cloud users/Google identity or private CIRCLE; fake/synthetic actor and local inert email/Telegram only.
- Existing B-01 fixture is `network=none`, so adding a network or starting Auth/Storage is **a state mutation requiring separate G4 and B-01 operator consent**. Another complete fixture might require a distinct PG instance; only one owner may write at a time. Proposed isolated `docker compose -p dc-club-qa-sandbox -f <reviewed-file> config --quiet` after approved synthetic fixture source/contract; **NOT RUN now**, no YAML deployed. Before stopping, identify only the exact new project/volume resources and purge **only those** after approved fixture teardown; never use broad `docker compose down -v` against original `degradation_club`, no `docker system prune`.

### W24-D. Host target namespace/port/TLS and platform boundary

**Future only after separate Stage2 host G4 + Kirill resource approval:** `/srv/dementor/club-backend/<approved-result-sha>/` under its own Linux UID and Docker Compose project `dc-club-backend`, dedicated private network `dc-club-backend-internal`; named volumes `dc-club-pg17-data`, `dc-club-storage-data`, `dc-club-backup-staging` with owner-controlled permissions and isolated secrets from approved external secret source (NEVER Git or share MDAO credentials). No `/data/*`, no legacy `db-dev:32778`, no Beta/Alpha world volumes, no `14173`/`14174`/`18080` bind collision. Proposed **new** API gateway only on host **`127.0.0.1:18431`**, subject to fresh `ss` verification and Kirill consent; DB `5432`, internal Auth `9999`, REST `3000`, Storage `5000`, Edge `9000` stay **container-private only**, exact container port names validated with vendor pinned Compose. No Supabase Studio, Postgres/analytics/admin HTTP public exposure.
- Future public API HTTPS **`api.dementor.club` is PROPOSAL ONLY**; existing certificate SAN covers **apex/www only**. New API hostname requires separate DNS A/CNAME, certificate SAN/issuer and server routing G4/release owner. Preserve current public `dementor.club` static root/Board UUID 302, game ALPHA 443 implicit default and Beta IP until Game SRE #51 + Kirill clarify new default; no generic IP/default rewrite. External public Auth and client `sb_publishable_*` must be proven compatible through signed/anon RLS actor cases. Google OAuth provider callback **`https://api.dementor.club/auth/v1/callback`** vs browser **`https://dementor.club/auth/callback/`**: BOTH are separate negotiated redirect/callback routes, switch atomically only at Stage2 cutover.
- No dedicated host backup/restore port; encrypted off-VM transfer uses Kirill-approved short-lived restricted transport, not a new public DB listener.

### W24-E. Off-VM backup/real restore/Scheduler recoverability contract (NOT IMPLEMENTED)

**Custody to be explicitly named by Club owner and Kirill, not invented by A-01.** Proposed source package after separate Data G4: encrypted off-VM database logical snapshot of **exact approved Club-only schema and ALL 11 auth/Google identities + minimal profiles**, consistent FK and all 28 `dc_*` + 8 Club unprefixed (plus explicitly decided disabled compatibility schema-only), PostgreSQL roles/grants/extensions/triggers/RLS/69 RPC current authorized definitions. Do NOT `pg_dumpall` full mixed 65-migration Cloud, do NOT copy MP/Robo or active `auth.sessions`, `auth.refresh_tokens`, `auth.flow_state`, JWT/Vault provider secrets. Avoid naïve per-table `pg_dump -t` missing privileges/functions; generate reviewed explicit allowlist and separate schema SQL/role policies, reconstruct Auth through version-compatible importer after approval. Owner/Backend decide field-level redaction and approved encrypted key custody.

**Storage:** private `dc-community-artifacts` 16 metadata objects ~23,934,580 declared bytes only; after permit, export authenticated actual object bodies+content-type/path/checksums to encrypted off-VM location. S3 protocol/Storage owner policy must pass signed-link issue/expiry/outsider negatives; metadata alone is NOT backup. New worker secrets, JWT issuer keys, Vault values, API publishable key and Telegram provider key must be generated **new** and never leaked into PR; Cloud cron still the only sender until single-owner cutover, drain outbox, freeze writes, disable old worker under Gate, activate exactly one new worker and test ambiguous delivery for no double-send.

**Backup/restore plan (all future G4-gated, NOT measured):** (1) named cloud/data export operator and off-VM encrypted storage custodian with access review; (2) point-in-time consistent Club-only SQL+Auth selected identities+Storage bytes, create SHA256 file/object manifest **privately**; (3) copy encrypted backup off the same VM with approved transfer, prove encryption and independent readability; (4) perform **actual isolated restore** on owner-approved nonproduction host with same pinned images, extensions, roles and endpoint overrides; (5) time from snapshot start to DB+Storage hash/FK+API success (`RTO_actual`) and timestamp gap between last accepted source write and verified target checkpoint (`RPO_actual`); (6) rehearse failed import/PKCE/Storage/worker scenario with restoration of original Cloud+Pages status; (7) final controlled write-freeze+deltas/one-active scheduler; (8) preserve rollback in **both** directions. Production rollback after new target writes is **NOT** safely achieved by flipping a DNS record—requires owner-reviewed reverse-data reconciliation.

**Proposal SLO only, NOT a PASS:** RPO target **≤15 min during allowed pre-cutover operations and 0 unreplicated acknowledged writes during final validated freeze**, RTO target **≤120 min** for tested isolation recovery. No measurements available: status **NOT RUN**; accepting SLO requires dated full independent restore and synthetic failure. Disk/VM margin currently not ready for concurrent hot backup plus dual databases. Off-VM backup is necessary but not permission to export Cloud PII.

### W24-F. Deterministic verification and STOP ledger

| Acceptance | Direct CHECKED | PASS / FAIL / NOT RUN |
| --- | --- | --- |
| Existing Mac 11 service labels/network and broad host port ownership | `docker ps` / `docker inspect` no environment / Mac `lsof` | **PASS READ-ONLY INVENTORY; SECURITY ISOLATION FAIL/UNVERIFIED** (bind all interfaces) |
| Existing B-01 isolated PG fixture | `docker inspect`, `portmap={}`, `network=none` | **PASS bounded PG network exclusion**, full API/Auth/CIRCLE fixture NOT RUN |
| Official 2026 candidate versions+immutable registry digests | `self-hosted/v0.7.2` vendor blobs + `buildx imagetools inspect` | **PASS six registry manifest digest lookups; compatible minimal target RUN NOT TESTED** |
| `docker compose config --quiet` for custom slim stack | No approved, fully wired minimal Compose yet; vendor override has Studio dependency | **NOT RUN / cannot claim Compose ready** |
| Same-VM 24h game+MDAO concurrent perf / resource acceptance | One current low-load VM snapshot, official full standalone minima | **NOT RUN / HOST CAPACITY NO-GO** |
| Cloud/localhost 10 RPC + 2 policy parity and UUID/Google + Private Storage | Existing catalog drift and 16 Storage metadata, no actual records/bytes | **NOT RUN for runtime**, Backend/Q-01 owner |
| Encrypted off-VM backup + exact private objects + isolated restore and RPO/RTO | Owner/operator/storage target not selected; no export/read of object bodies | **NOT RUN / RELEASE BLOCKED** |
| PKCE issuer/new gateway and one active worker | Source code and Cloud cron evidence only | **NOT RUN / NO ROUTE SWITCH** |
| Game/MDAO positive K1 and 443 routing ownership | W22 hashes/default drift; W23 owner assures MDAO functions work | **OWNER ASSURANCE RECORDED / KIRILL TECH SIGNOFF NOT RUN** |

**HARD STOPS:** no named owner+Backend synthetic G4, no separate isolated fixture/local port negative, unsupported API publishable key or unsafe Google UID importer, no actual branch/source authority for 10 RPC/2 RLS differences, **default full Docker install** on insufficient free disk, any DB/Studio exposure on public NIC, use `db-dev`/`/data`/game volume, no encrypted off-VM restore evidence, running two Telegram workers or publishing wrong Cloud Vault URL, new nonreviewed `api.dementor.club` cert/port/DNS, unaccepted ALPHA 443 default or MDAO damage, no G7/G8/auth/privacy security tests.

**Exact next G4 decision Lead must route:** (a) B-01 & Q-01 agree who owns already-running `dc-b01-qa-pg17` and whether to reuse or provision separate full fixture; (b) owner names disposable **localhost-only** fixture and grants synthetic writes/teardown without touching existing Mac compose; (c) Architect/SRE+Kirill sign capacity/legacy headroom and proposed caps with game overlap; (d) Backend confirms allowed schema/routine ownership and import compatibility; (e) owner names encrypted offhost custodian, resource/recovery owner and experimental no-real-data gate. Until those, **NO MAC OR VM WRITE** from this report. **PRODUCTION/MAC EXISTING STACK/VM/DNS/CLOUD/MDAO/LIVE EFFECT: NONE.**

## W23 · Club owner MDAO functional acceptance — 2026-10-21

**NEW OWNER STATEMENT (USER IN PROJECT CHAT):** «все с мдао хорошо что нужно работает». This is explicit **OWNER-REPORTED FUNCTIONAL ACCEPTANCE of the MDAO workflows the owner requires**, not an independent all-endpoint diagnosis and not a Kirill-authored technical health proof. Do not keep characterizing MDAO as **user-reported broken** based solely on the legacy three HEAD 502 probes. The prior owner-selected K1 pre-existing-502 conditional no-regression interpretation remains accepted at the **narrow HTTP probe** level.

**EVIDENCE TIERS ARE NOT INTERCHANGEABLE:**
- **OWNER_REPORTED_MDAO_FUNCTIONAL_OK:** YES, dated 2026-10-21; no additional burden on Club owner to repeat old 502 tests. Existing MDAO functional usefulness as experienced by owner is acknowledged.
- **CURRENT READ-ONLY TECHNICAL PROBES:** Legacy Graylog and Monitoring HEAD http 502; n8n HEAD http 301 → HTTPS, n8n HEAD https 502; these probes alone cannot contradict owner's functional experience or independently validate all needed functions. `nginx -t` PASS; MDAO site configuration hashes unchanged at W22; `db-dev` running. Exact same scheme/Host/method must be used when comparing historical codes.
- **MDAO KIRILL BASELINE/OWNER SCOPE:** An actual Kirill-selected **safe positive** service readiness signal, timestamped BEFORE and same-method AFTER, plus named future shared-Nginx rollback operator is **still NOT DOCUMENTED** in #255. If Kirill considers owner's functional confirmation enough for business acceptance, record that **as a separate signed risk/health-coverage decision**, not as a fabricated successful test.
- **OTHER INFRA CHANGE:** An independent Game ALPHA TLS site has become the implicit unknown-SNI :443 default and original `dementor-live.conf` SHA changed (W22). Kirill + Live SRE #51 own risk acceptance/correction, not Club. **Do not change an operational MDAO system just to silence its historic 502 probes.**

**REVISED BLOCKER STATEMENT:** **MDAO_USER_COMPLAINT=NONE / OWNER_FUNCTIONAL_ACCEPTED=YES / KIRILL_POSITIVE_PROBE_AND_HOST_GRANT=WAITING**. This is NOT permission to reload Nginx, reset `db-dev`, inspect `/data/*`, edit certbot, migrate Stage2 database, or declare Stage1 G8. No new user-terminal action requested. Kirill/Lead may now proceed with documentation of their safe change-control criteria without requesting another generic MDAO status confirmation.

**STATUS / CHECKED / CHANGED / VERIFIED / NOT VERIFIED / BLOCKERS / NEXT / PRODUCTION EFFECT:**
- STATUS: owner operational assurance RECORDED; historical 502 classified as limited probe not user-facing incident.
- CHECKED: owning #255 W19–W22 and latest #237 Stage2 handoffs; current Draft #257 authority.
- CHANGED: one existing Draft #257 reference report and Issue #255 handoff, no service or DB writes.
- VERIFIED: exact owner statement exists in this chat; earlier bounded Nginx hash and listener probes as separately dated.
- NOT VERIFIED: Kirill positive health method and formal host change consent, ALPHA 443 default acceptance, Stage1 G7/G8 and Stage2 resource/restore Gate.
- BLOCKERS: future shared-host change needs Kirill operator + no-regression evidence and applicable owner Gate; Stage2 independent capacity/identity/storage/backup Gate.
- NEXT: hand off Kirill safe health method / signoff in #255 only, without delaying architectural read-only Stage2 preparation or blaming MDAO; Lead to track cross-repo TLS routing.
- PRODUCTION EFFECT: NONE.
## W22 · Current live VM Stage1 drift, Board UUID route and Game/MDAO 443 default · 2026-10-21 20:51–20:53 UTC

**STATUS: ACTUAL CLUB PUBLIC HTTPS + D1 DNS OBSERVED; W22 REVIEW-ONLY RECONCILIATION; PRODUCTION G8 NOT ACCEPTED.** Supersedes W20's *pre-install* facts only for current live runtime. Existing [Lead P0 cutover reconciliation](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6324764162), [Lead pre-DNS SNI](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6324775100), [Board emergency UUID route / #237](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6324768480), and separate [Live #51](https://github.com/SLADZARI/dementor_live/issues/51) are the current owner threads. New Club source PR/branch is not authorized; this update is ONLY within the existing one-file Draft #257. **No agent host writes or ACME challenge/DNS mutation in W22.**

### W22-A. Direct read-only CURRENT observations (existing trusted strict SSH; public resolver/HTTPS)

| Surface | Independent current evidence | Classification |
| --- | --- | --- |
| Public DNS and TLS at 20:52:11 UTC | 1.1.1.1 resolves apex A **138.199.144.94** (no apex AAAA), www CNAME **dementor.club** and A inherits the VM IPv4. Normal publicly routed CA-trusted HTTPS apex **200** (curl ssl_verify_result=0), www **301** to apex (ssl_verify_result=0). | **CURRENT PUBLIC HTTP/TLS PROBE PASS**; historical GitHub Pages baseline obsolete; does NOT establish G8, owner change provenance or all global resolver caches |
| Current enabled Nginx set | `default`, `dementor-live-alpha.conf`, `dementor-live.conf`, `graylog.conf`, `monitoring.conf`, `n8n.conf`, `zz-dementor.club.conf`. Nginx -t PASS. The Club file is **root-owned 0644**, current sha256 **899fad9bc3f1387dcb5865819f135df48f323e6ebd41eedae5200d78dd2cf6bf**, root currently pinned to the **old** `cde332779ab0e256dd1e498660d6fa651e91846e` release. | **ACTUAL HOST HAS CHANGED SINCE W20.** New Club site present; do not install/reload an already existing file from historic W14 plan |
| Five W18 preexisting host-file hashes (read-only) | Current sha of `default`, `graylog.conf`, `monitoring.conf`, `n8n.conf` **MATCH W18**; original `dementor-live.conf` **CHANGED** from `6d3bb785eb757364ff1cb797d6d56518ad3f73009b58029da70862e8ddd2ff7b` to `b6846c6625dc6d92ed9118f557d6f478e56061d517a7e6617b4f52ed1c923fcd`. Three MDAO names are regular enabled files, not necessarily copies under `sites-available`; comparison correctly hashes **sites-enabled targets**. | **4/5 MATCH, 1/5 DIFFERENT.** Cause/operator/grant of game vhost mutation **NOT VERIFIED**; owning game SRE #51 must reconcile, do NOT assume Club caused it |
| 443 implicit default — IMPORTANT NEW CROSS-PROJECT DRIFT | Enabled `dementor-live-alpha.conf` contains `listen 443 ssl` and loads BEFORE old `n8n.conf`. **Direct** openssl unknown-SNI `unseen.example.invalid` returned leaf **CN alpha.138.199.144.94.sslip.io**; explicit n8n SNI still returned n8n certificate; explicit Club SNI returned Club certificate. | **PREVIOUS 'n8n is implicit 443 default' invariant is NO LONGER TRUE**, independently proved. Alpha is new implicit 443 default; this is **potential shared ingress change**, not proof of existing MDAO outage. New changes STOP until Kirill+game SRE review/accept correct default behavior |
| Runtime game and legacy probes | ALPHA and BETA Docker both **healthy**, respective loopback listeners 14174/14173; original game IP Host GET `/api/health` **200**. Legacy graylog/monitoring HTTP HEAD **502/502**; n8n HTTP HEAD **301** redirect, while n8n **HTTPS HEAD 502**. | Historic n8n 'three HEAD 502' probe used HTTPS; compare the **same host+scheme+method** (n8n HTTP 301 vs HTTPS 502 is not an unexplained functional improvement). Kirill positive MDAO health signal remains **MISSING**. No game SSE/auth/characters or legacy business payload tested |
| Pinned Club static root and routes | VM `index.html` sha256 **1f807b08e772ceae853cb7518f149b73024d5933de65f55af510003e4ffc0f30**, size 14470, owner root, mode 0644, matching W13 frozen baseline. Public SNI apex `/` **200**, `/workspace/` **200**, `/auth/callback/` **200**, `/community/artifact/11111111-1111-4111-8111-111111111111/` **302** to query-detail, malformed path **404**, missing JS **404**, `/.env` **404**, `/live/` **404** (future separate G1 scope). | **STATIC/ROUTE HTTP SMOKE PASS** for these probes only. Current public site still serves pinned older static baseline, **not** Draft PR #308 latest G5 UI candidate. Board real private content, OAuth PKCE, CIRCLE/RLS, and game SSO not tested |

### W22-B. MUST CODIFY emergency Board deep-link route, without changing VM today

**Owner-confirmed actual live emergency change:** the Club-only new vhost has an anchored UUID-only redirect (Lead #237 source). Current read-only filtered Club config confirms exact regex/redirect; no generic SPA catchall or wildcard route was deployed:

```nginx
location ~* "^/community/artifact/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/?$" {
    return 302 /community/artifact/?id=$1;
}
```

**Minimal canonical W14 candidate delta for a later approved infra source/RC:** insert exactly this location in the **first** `server_name dementor.club` HTTPS block **BEFORE** `location / { try_files $uri $uri/ =404; }`, and keep separate dotfile 404 rule; DO NOT insert it in www/HTTP redirect blocks or Live/game/legacy. This exact rule matches only UUID-shaped paths; response 302 does not prove a card exists/reader has permission. Prior GitHub Pages `404.html` had a legacy detail rewrite that default static Nginx `try_files` did not emulate. **The live VM has already been emergency patched; this record codifies observed behavior, not a second patch.**

**Exact synthetic regression contract (read-only GET/HEAD, no real UUIDs/private data):** shape UUID with optional slash ⇒ 302 Location `/community/artifact/?id=<UUID>` then existing query detail shell HTTP200; malformed UUID, unknown filenames, `/.env`, `/.git` ⇒ 404; `/auth/callback/`, `/workspace/` and root ⇒ 200; www ⇒ 301 and CA-trusted; unknown Host/SNI MUST retain **the owner-approved existing** 443 default (currently changed by ALPHA, not the earlier n8n baseline). Browser QA additionally needs Member/Guest/CIRCLE outsider/owner card overlays, back/close and privacy checks in **owner-approved isolated fixture**; no production signed-in Board tests claimed because source Board boot can WRITE lifecycle RPC.

**Conditional rollback of THIS Board hotfix only (Kirill/owner approval required, NOT run):** use already reported `/root/dementor-club-nginx-pre-artifact-route-20261021.conf` solely under Kirill-owned incident procedure; compare exact current Club file SHA and prior backup ownership, reverse only the isolated UUID location, `nginx -t` then approved controlled reload, retest Club, MDAO and game. **Do not run rollback automatically** as that would reintroduce the Board 404 and might clash with concurrent ALPHA vhost changes. Never alter default/MDAO/game files from Club PR.

### W22-C. Critical ownership and Gate differences

- **Lead/Kirill (existing #255/#237)** must reconcile who/when executed the **already live** D1 A+CNAME, Club vhost installation and UUID hotfix, record exact operator approvals and current SHA; do not retroactively certify Stage1 G6/G7/G8 or mark RELEASED from current HTTP200 alone. Stage1 Result v0.2 is still `APPROVED/G4_PASS/WAITING`, `liveHostMutationAuthorized=false`. Any release-authority discrepancy stays **NOT VERIFIED/BLOCKED** until accepted owner evidence.
- **Game SRE/Architect (existing Live #51)** owns new `dementor-live-alpha.conf` TLS/default 443 and changed `dementor-live.conf` SHA; confirm host change Gate/custodian and ensure unknown/default TLS route **does not leak ALPHA** or regress MDAO. Original Beta IP and saved world remain under Live ownership. This Club report is a **read-only evidence handoff only**, not approval to edit Live config.
- **Kirill/MDAO** still owes a safe, meaningful functional-positive readiness signal; pre-existing 502s, daemon/process RUNNING and stable config hash alone are **not healthy MDAO PASS**. Ask Kirill to confirm baseline and nonregression after existing live modifications; any operational repair is independently owned by MDAO.
- **Club Lead / Q-01** must reconcile actual served frozen source `cde33277…` versus approved-but-Draft Web/UI PR #308 emitted static source, independent security actors/private CIRCLE, and release milestones; public VM is reachable but canonical site G8 **NOT ACCEPTED**. Stage2 selfhost on this shared VM is separate G4 and resource/restore decision, no default compose install.
- **TLS/DNS:** current Club apex+www CA-trusted HTTPS probe PASS (both VM today); this is NOT certbot unattended DNS-01 renewal PASS. Manual owner policy with reminders retained, timer may still run and needs Kirill reconciliation. No ACME/DNS writes/reloads in W22.

```text
STATUS: READ_ONLY_CURRENT_VM_RECONCILIATION_DONE / LIVE_HTTP_TLS_PASS / RELEASE_G8_NOT_ACCEPTED
CHECKED: live VM Nginx sites and cert SNI; five old config sha; game/legacy status metadata; Club route and immutable index; public DNS+HTTPS
CHANGED: same Draft PR #257 documentation only; NO VM/DNS/NGINX/DOCKER/CLOUD changes in this action
VERIFIED: D1 apex+www public VM HTTPS 200/301 trusted; current Club vhost SHA and UUID redirect; 4/5 original protected files equal W18; Alpha+Beta healthy/IP beta 200
NOT VERIFIED: Live operator/Gate provenance and changed game config cause; safe positive MDAO business health; full Game/Alpha security; live Stage1 code/UI/Security G6/G7/G8; TLS unattended renewal
BLOCKERS: Kirill+Game SRE classify 443 implicit default takeover and changed Live vhost; Kirill MDAO positive baseline; Lead exact release/Gate reconciliation; Q-01 private actor negatives
NEXT: handoff #255 Lead / #51 Game SRE / #237 Lead for explicit owner decisions; preserve actual live state; no reactive reload
PRODUCTION EFFECT BY THIS ARCHITECT/DEVOPS ACTION: NONE
```
## W20 · 2026-10-21 pre-install owner GO and static RC candidate freeze (NO active host mutation)

**OWNER DIRECTION RECEIVED:** Club owner explicitly requested **«давай делать - владелец сервера сказал делать»**. Interpret as *owner-reported in-principle agreement to proceed with the previously reviewed D1/new-only Nginx installation workflow*. This is sufficient for **pre-install evidence and safe isolated preparation**; it is **NOT** a replacement for the separately documented exact host-change operator, agreed positive MDAO functional probe, G6 system/security/G7 acceptance and final public release GO. Existing Stage1 Result v0.2 still has **`liveHostMutationAuthorized=false`**. Therefore NO Nginx configuration writes, reload, Certbot/ACME, DNS, game/MDAO/Cloud changes were done in this wave. The statement must not be backdated as a Kirill-authored explicit health attestation.

**FRESH READ-ONLY HOST PRE-CHANGE RECHECK** (trusted existing SSH, 2026-10-21 18:43:32 UTC):
- `nginx -t = PASS`; systemd nginx/docker/gitlab-runner active; Certbot timer active (supervised manual policy still awaiting Kirill reconciliation); two running containers and Dementor Live `HEALTHY` status reported by existing Docker health metadata.
- Current enabled Nginx site names exactly: `default`, `dementor-live.conf`, `graylog.conf`, `monitoring.conf`, `n8n.conf`; **no Club vhost enabled**. The exact SHA-256 of **each of those five current files remains UNCHANGED** compared with the sanitized W18 baseline (fingerprints there). This is critical preinstall no-drift evidence, not an assessment of each application health.
- Available memory **6.67 GiB of 7.57 GiB**; available disk **41.02 GiB** at snapshot time. No workload peak/restore proof, no MDAO-specific functional PASS established. No Nginx reload or active-service mutation attempted.

**INDEPENDENT CURRENT SITE ARTIFACT FREEZE (off-VM, disposable clean Node22 builds, same sort manifest contract as prior W13):**
- Existing public production base `dementor-club-production@cde332779ab0e256dd1e498660d6fa651e91846e` → **468 files**, **17,425,725 bytes**, Path-sorted JSON bundle SHA256 `b2da2d55847be160dd1827d4fc2169f3d078f06c121ef6667ffcde51d1490c63`.
- Current isolated [Web/UI Draft PR #308](https://github.com/SLADZARI/degradation_club/pull/308) **`5e62cca40ca6ae1cf2c60851d0f9f0dd99ce0d69`** → **468 files**, **17,432,062 bytes**, Path-sorted JSON bundle SHA256 `367a7b5bc3d1f7318616f13fc5be9522fb0595d5a2ea47d709023a650b0b949c`. Diff of emitted site: **4 changed files**, zero added or deleted: `community/board/board-composer-sheet-v2.css`, `community/board/board-composer-sheet-v2.js`, `community/board/board-fullscreen-v2-1.css`, `home-v1-core-20260828.css`; existing test-only source `scripts/validate-board-v21-browser.mjs` is NOT in served static release. **Delta +6,337 bytes** total.
- Q-01 [independent 220/220 Chrome/WebKit changed-behavior acceptance](https://github.com/SLADZARI/degradation_club/issues/126#issuecomment-6323194777) and exact-head [Site Integrity CI 39646600372](https://github.com/SLADZARI/degradation_club/actions/runs/39646600372) SUCCESS. This is *only* approved Web/UI changed-scope G6, **not overall security, Auth, publish-in-flight/semantic resolution or site G7 release acceptance**. Shallow clones used independently: local intra-clone `git diff` on a missing ancestor was invalid; trusted source whitelist comes instead from [PR #308's exact five-file diff](https://github.com/SLADZARI/degradation_club/pull/308/files). No broad drift inferred.

**INSTALLATION SAFETY STOP-LIST BEFORE FIRST NGINX WRITE:**
1. Kirill/A-01 enters **one concrete existing safe positive MDAO functional-health method, expected result, permitted operator and BEFORE observation** into #255. Owner has selected K1 for old 502 as narrow historical HTTP comparison only; this is still NOT an application health check. Kirill also confirms his or delegated precise Nginx config change/reload+rollback custody, with STOP on legacy default host/route/status/metric regression.
2. Q-01/Lead verifies accepted Web/UI G6 and resolves Product/owner **valid submit + in-flight Cancel** behaviour observed only under mocked delayed RPC; real actor Auth/PKCE/RLS/CIRCLE/private Storage QA remains a separate outstanding blocker and may need owner-approved isolated fixtures. Before site public release clean G7/RC of the final exact SHA/manifest is required.
3. Only after the appropriate separate explicit host mutation approval is written, operator may install **EXACTLY TWO** reviewed NEW items: `/etc/nginx/sites-available/zz-dementor.club.conf` plus `/etc/nginx/sites-enabled/zz-dementor.club.conf` symlink. Nginx old implicit :443 n8n default remains unaffected: NO changes to existing five configs; NO `default_server`/new IPv6. New static root must point to **later ACCEPTED final RC** (not outdated W13 production or still-Draft W20 candidate). Validate `nginx -t` before an explicitly approved controlled reload, then real CA-valid SNI of BOTH apex and www with `curl --resolve` **without `-k`**, verify old exact host/game/MDAO baseline, rollback ONLY new items if deviation.
4. Current D1 DNS strategy and manual TLS reminders remain approved **planning only**. DNS change (apex A & www CNAME together, IPv6 no VM AAAA) requires a **separate owner RELEASE GO after G7**, no running change in this step. Manual renewal with 30/14/7 alerts does NOT prove renew automation; existing timer is not altered in this wave.

**PRODUCTION/VM/NGINX/DOCKER/DNS/CERTBOT/SUPABASE/MDAO/LIVE EFFECT: NONE.** All execution in this W20 wave used only read-only VM metadata and disposable Mac builds, plus GitHub docs/evidence.

## W19 · Owner selects K1 conditional MDAO health acceptance — 2026-10-21

**OWNER RESPONSE RECEIVED:** the Dementor Club owner states: **«Кирилл подтверждает, что эти ответы существовали до переезда, и предоставляет хотя бы одну дополнительную безопасную проверку реальной работоспособности MDAO.»** Treat this as owner's selection of **K1 — conditional no-regression acceptance** rather than K2. This text is **owner-reported Kirill confirmation**, NOT an independently documented Kirill-authored functional-health attestation: no endpoint, expected result, screenshot, approved safe command, or timestamped positive proof was supplied in this message. Do not invent the details or close Kirill's part of the Gate.

**K1 accepted scope (only):** legacy HTTP `HEAD` probes for three existing named MDAO/monitoring/n8n virtual hosts historically returned `502/502/502` before the Club cutover; with owner-reported Kirill acknowledgment, their **unchanged status may serve as a narrow negative/no-regression observation only**. A 502 **never proves an application is up or healthy**, even when it predates the Club's change. This does **not** authorize serving those endpoints through new site routing or overriding the existing `n8n` implicit :443 default.

**Kirill/MDAO acceptance still required before host reload grant:**
1. Specify **one or more meaningful non-destructive functional-health checks** for the MDAO service(s) exposed to risk, identifying exact *safe* method (e.g. existing GET readiness/health endpoint **if Kirill identifies one**, or Kirill-approved service-level state that correlates with actual function). Do not assume endpoints such as `/healthz` exist and do not call business/operational API endpoints or protected data without permission.
2. Define **expected successful outcome**, e.g. an explicit status/class or `RUNNING/READY` plus independent real-service signal, execution route (loopback vs public hostname, and proper Host/SNI), operator, timestamp, timeout and precise STOP criterion. `nginx active`, PID counts, and 502 matching alone are **not** functional-health PASS.
3. Record sanitized **BEFORE** evidence at approved scope; repeat **the exact same probe AFTER** only a separately authorized new-only Club Nginx installation/reload. If new errors, unexpected change of response, wrong vhost/default takeover, disrupted n8n/MDAO/game route, changed legacy config fingerprints, or loss of healthy signal: **STOP and perform Kirill-owned site-only rollback**. Do not inspect `/data/*`, db-dev business data, service secrets, session tokens or production payloads.
4. Kirill names an authorized host change / rollback custodian; ownership of the decision by Club does not replace Kirill's separate written grant.

**STATUS:** `K1_OWNER_SELECTION=RECORDED`; `LEGACY_502_PREEXISTENCE=OWNER_REPORTED_KIRILL_CONFIRMATION`; `MDAO_FUNCTIONAL_HEALTH_PROBE=AWAITING_KIRILL_SPECIFICATION_AND_EVIDENCE`; `KIRILL_HOST_WRITE_APPROVAL=NOT_GRANTED`; `VM/Nginx/DNS/ACME=NO_MUTATION`. Retain D1 future IPv4 apex+www plan and supervised manual TLS with 30/14/7 reminders as already authorized; none is a release/host change GO.

**NEXT A-01/I-01:** obtain Kirill's exact check and an approved initial before snapshot, then Q-01/Lead independently judge signal sufficiency and prepare an exact post-install comparison. Do NOT promote Stage1 to G6/G7 or merge Draft #257 based on this statement.

## W18 · Owner D1/manual TLS and sanitized pre-change VM snapshot — 2026-10-21

**SCOPE OF OWNER DECISION (PLAN ONLY):** Dementor Club owner explicitly selected **D1** for a *future* controlled release: replace GitHub Pages A records on `dementor.club` with independently reverified VM IPv4, change `www.dementor.club` CNAME from `sladzari.github.io` to `dementor.club`, keep apex AAAA absent and do NOT enable VM IPv6 until separate tests. Canonical `dementor.club` URL, redirect `www` → apex, preserve all old Pages DNS records/custom-domain configuration for rollback. **D1 is the approved DNS strategy, not consent to execute a DNS change now.** The actual IP, current authoritative records/TTL and reverse rollback must be rechecked immediately before any later G7-approved cutover.

**TLS temporary exception chosen by Club owner:** document **SUPERVISED MANUAL renewal**, with reminders at 30/14/7 days before 2027-01-15 certificate expiry. **DO NOT label as AUTO-RENEW PASS**: the existing `certbot.timer` is CURRENTLY ACTIVE and DNS-01 auth/cleanup hooks exist, but their end-to-end operation was not exercised. The manual exception does not itself stop or disable the timer; Kirill/host Certbot owner must separately reconcile the active timer with the manual-only plan **before the next renewal window**. Do NOT modify certbot.timer, install hooks, run `certbot renew --dry-run`, read provider credentials or create/delete `_acme-challenge` TXT without separate Kirill+DNS-owner authorization. Manual renewal also requires the later scoped permissions and controlled post-renew chain check/Nginx reload if necessary. Proposed Warsaw-time checkpoints: **2026-12-16, 2027-01-01, 2027-01-08** (30/14/7 days before notAfter 2027-01-15 17:14:06 UTC); an explicitly named human custodian and actual alert delivery must be confirmed.

**DIRECT SANITIZED READ-ONLY HOST SNAPSHOT** at **2026-10-21T18:20:06+00:00**, through previously authorized trusted SSH from connected Mac. Only `systemctl is-active`, `docker ps --format` (names/status filtered), `ps -eo comm` (counts only), `ss -lntH` (port counts only), `os.statvfs`, `free -m`, and the five ALREADY ENABLED Nginx config SHA-256 fingerprints were read. No `nginx -T` config dump, Docker environment/inspect dump, secrets, logs, credentials, private media, `/data/*` traversal, or Cloud account data were collected. Snapshot was held in the caller process output and documented here; **no new file was written on VM**. Normal SSH auth/audit logging may occur independently.

| Metadata (point-in-time only) | Actual observation |
| --- | --- |
| Services `nginx`, `docker`, `gitlab-runner`, `certbot.timer` | `active`, `active`, `active`, `active` |
| Enabled site configs | `default`, `dementor-live.conf`, `graylog.conf`, `monitoring.conf`, `n8n.conf` (5 total) |
| New Club site active? | **NO**; no `zz-dementor.club.conf` in sites-enabled |
| Docker | 2 running containers, of which **Dementor Live = Up (healthy)**; 1 other container (details withheld) |
| Processes (names only) | Nginx 5; dockerd 1; containerd 1; gitlab-runner 1; node 1; postgres 6; python3 2 |
| Listening TCP port counts | 22×2, 53×2, 80×2, 443×1, 14173×1, 18080×1, 32778×2. These are **local listener observations**, NOT proof of external reachability or firewall status |
| Filesystem at `/` and `/srv/dementor` | 41.03 GiB available; 4,188,561 free inodes on inspected filesystem |
| Memory (`free -m`, same bounded followup) | total 7751 MiB; available 6841 MiB; a point-in-time figure, NOT peak usage |
| Existing configuration SHA-256 | Listed below, computed only for five named config targets resolving **inside `/etc/nginx/`**. Fingerprints do NOT reveal config body or keys |

```text
default              ce0901350a021608139b5639cf4ccd7717bef8c3a9e4f79031eb46386b67b03f
dementor-live.conf   6d3bb785eb757364ff1cb797d6d56518ad3f73009b58029da70862e8ddd2ff7b
graylog.conf         4574f21408c4cc60b93343a0ee75091485583789dc6a7867929196eb7cc7d5d3
monitoring.conf      c547a60bae6ade4735c30f5d0183af74266cb8223506ef3a9ae7a0c857f2ce18
n8n.conf             f6eaeb722e748240f89bcde9f99612b2096c69fb9ee76a2c2307e356dd7d4064
```

**SAFETY AND NON-EQUIVALENCE:** This snapshot proves metadata visibility and config fingerprint at capture time, **not MDAO application health**, correct public TLS routing, future disk/memory peaks, externally open 32778, or that a future Nginx reload is harmless. `nginx -t` and isolated fixture PASS are **earlier separately scoped evidence**, not a new host-change trial. Existing graylog/monitoring/n8n HEAD 502 responses remain an **unaccepted functional-health signal** pending Kirill **K1/K2** with a meaningful safe endpoint/expected response. No restart, reload, container operation, VM site file writes, DNS record edits, ACME challenge or GitHub Pages production mutation occurred during this inventory.

**CURRENT DECISION MATRIX:**
- **D1 DNS PLAN = OWNER ACCEPTED**. *Execution rights = NOT GRANTED.* `www` including its inherited IPv6 must not be left on Pages when apex later switches.
- **TLS RENEWAL = TEMPORARY MANUAL POLICY ACCEPTED WITH REMINDERS; AUTO RENEWAL = NOT VERIFIED**. Kirill to decide how active timer is managed and who can renew/restore. No Certbot/DNS side effect authorized.
- **K1/K2 MDAO health criterion = AWAITING KIRILL**, including safe meaningful health probe and host rollback custodian; no MDAO service edits.
- **New-only Nginx design = ACCEPTED FOR REVIEW**, exact two new Club namespace items only, no shared 443 default/Live/SSE/legacy drift. **Install / reload / DNS / public release = NOT AUTHORIZED; independent G6/G7/host GO required**.

**NEXT:** Kirill identifies meaningful non-secret MDAO health criterion, cert renewal operator and a later separately approved installation window; DNS owner keeps rollback records and a manual renewal responsibility; Q-01 tests only consented authorized isolated fixtures; Lead does not merge/deploy/activate Stage1 while pre-VM Web/UI Result remains G5. **PRODUCTION/VM/Nginx/DNS/Cloud/MDAO/Live EFFECT FROM THIS RECORD: NONE.**

## W17 · Lead 6322170273 — Kirill/MDAO + DNS owner permission closure (2026-10-21)

**STATUS: ARCHITECT REVIEW-READY / SIGNATURES MISSING / ZERO HOST WRITES.** The current authority is [Stage1 Result v0.2](https://github.com/SLADZARI/degradation_club/blob/dementor-club/.weekly-os/results/portal-vm-site-hosting-stage1.v0.2.md): APPROVED, G4_PASS, WAITING, implementationStartAuthorized=true **for isolated code/preparation only**, liveHostMutationAuthorized=false and productionDeployAuthorized=false. Active Web/UI Result/PR #308 has one integration branch and independent G6 pending; Stage1 has no active site branch. Earlier Draft Stage1 PR #309 was CLOSED/UNMERGED and superseded. [Lead exact #255 request](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6322170273) does NOT grant a VM/DNS change.

**ALREADY ACCEPTED / DO NOT REPEAT:** W12 read-only host snapshot, W13 468/468 static byte parity, W14 certificate SAN/expiry and current Nginx include/listener map, isolated mock and literal new-only diff. W14 is the implementation *proposal*; this section only clarifies named owner decisions and guardrails. No new issue/Result, source rebuild, VM inventory, Nginx reload, ACME challenge or DNS change.

### W17-A · Kirill no-regression baseline — answer K1 OR K2; no presumed consent

Historical and current bounded MDAO HEAD codes are graylog.mdao.is=502, monitoring.mdao.is=502, n8n.g155333.ru=502. **UNCHANGED 502 is only a comparison observation, NOT a healthy MDAO verdict.** Kirill/MDAO service custodian must formally select:

- **K1 ACCEPT LIMITED PROBE:** I acknowledge these three existing HEAD 502 responses and accept matching codes **for probe-level no-regression only**, together with the following SAFE independently meaningful service status/health checks and expected acceptable values: [Kirill to specify]; observation window and incident/rollback owner: [Kirill to specify]. No /data contents, db-dev data or protected volumes will be inspected by Club.
- **K2 NOT ACCEPTED:** 502 cannot be accepted as sufficient evidence; I require a separately owned MDAO safe health criterion or repair before shared Nginx reload. **HOST CHANGE STOP** until Kirill supplies the criterion. Do not create an MDAO repair task within #255 by implication.

Either reply MUST name the responsible host custodian and acknowledge protection of preexisting Nginx config hashes/owners/modes, default 80, implicit n8n default 443, MDAO/Live vhosts, Live IP/SSE, Docker/Runner/db-dev port and volume **metadata only**. The accepted baseline is not consent for changes. If there is no explicit K1/K2 response, MDAO baseline acceptance is **NOT VERIFIED**.

### W17-B · Exactly permitted host change **AFTER SEPARATE WRITTEN AUTHORIZATION**

**Host owner = Kirill; release/Club approval = Club owner + Lead Gate; those grants are DISTINCT.** Under an approved later window, exact scope:

1. NEW regular file /etc/nginx/sites-available/zz-dementor.club.conf mode 0644 with exactly the W14-B reviewed blocks, only if currently absent. NEW symlink /etc/nginx/sites-enabled/zz-dementor.club.conf -> ../sites-available/zz-dementor.club.conf only if absent. **No other file may change.** The zz- lexical position preserves existing n8n as first implicit TLS 443 default under the verified sites-enabled/* include. Do not set default_server, [::]:443, new port or any proxy of game.
2. Kirill captures BEFORE protected metadata (no /data traversal), applies ONLY the two new Club items, validates nginx -t and **only after PASS** performs ONE controlled Nginx reload under a host change grant. AFTER compare effective 80/443 default/SNI, three MDAO bounded HEAD codes plus Kirill's actual chosen health checks, db-dev/Runner/Docker state, Live IP Host GET /api/health 200 and SSE route. Any unexpected change = STOP.
3. Separate pre-DNS CA-trusted HTTPS checks via curl --resolve for **both** dementor.club and www.dementor.club at reverified VM IPv4 (historically 138.199.144.94): apex 200, www 301, normal routes/404, certificate SAN/chain, existing n8n default & Live IP unchanged. **No curl -k** and no public DNS switch. This cannot be performed on a new site before the approved install/reload.
4. **SITE-ONLY ROLLBACK if failed:** Kirill disables/removes ONLY the newly added enabled symlink, validates nginx -t, performs his controlled reverting reload, and removes the newly added file only after checking no other references. Reverify protected baseline and Game IP. No blanket restart, no edits to default/MDAO/Live/docker/Certbot, no /data touch. Do not use this rollback procedure unless the original grant covers the incident window.

**STOP when:** named file/link already exists with unreviewed content, any existing vhost/default changes, unknown 443 Host/SNI now routes to Club, game IP/SSE is intercepted, MDAO no-regression criterion absent, CA-trusted TLS fails, QA privacy fails or required host/owner Gate is missing.

### W17-C · Club DNS owner — BOTH hostnames plus IPv6 and ACME are separate decisions

**Current public DNS baseline:** apex GitHub Pages A = 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 (authoritative TTL 600), **NO apex AAAA**. The www CNAME = sladzari.github.io (TTL 3600) and that target can resolve to Pages **IPv4 and IPv6**. Changing only apex A leaves www on GitHub Pages. DNS owner must choose a two-name cutover and explicit rollback, not just an apex update.

**Proposed owner choice D1 (PENDING, NOT A GRANT):** on a later signed G7 release after tested VM SNI, replace apex four A with revalidated VM IPv4 and change the **www CNAME** target from sladzari.github.io to dementor.club. Preserve NO apex AAAA and NO [::]:443 until independent IPv6 listener/firewall/cert/route QA. Account for non-atomic DNS operations and caches (TTL 600 apex / 3600 www). Test authoritative and recursive A/AAAA/CNAME and both HTTPS hostnames. Do not deactivate Pages prior to tested rollback.

**Rollback D1:** DNS owner restores EXACT original four apex Pages A and original www CNAME sladzari.github.io, with no new AAAA. Re-test apex+www TLS/redirect after resolver caches; preserve original Pages custom domain and release workflow. Alternative D2 is permitted only with an owner-written exact A/CNAME/AAAA/two-SAN strategy and equivalent rollback, NOT an improvised `www` redirect.

**Separate decision ACME1 (NOT YET AUTHORIZED):** the existing Certbot 2.9.0 manual dns-01 lineage contains root-owned Python auth+cleanup hooks, active certbot.timer and an apex+www SAN certificate valid until **2027-01-15 17:14:06 UTC**. These metadata are **NOT unattended-renewal PASS**. Certbot `renew --cert-name dementor.club --dry-run` may CREATE/DELETE **REAL** DNS TXT records at both _acme-challenge names, write logs and invoke provider APIs. Require explicit **Kirill VM/Certbot + Club DNS owner** written rehearsal window, allowed least-privilege TXT scope/credentials custody, provider API availability, idempotent cleanup of only owned records and recovery, plus redacted evidence. Future deploy hook/controlled reload is a SECOND host permission. If unavailable, record owner-approved supervised manual renewal/30-14-7 day alert as a temporary EXCEPTION, never an unattended PASS; HTTP-01 requires a distinct reviewed config Change Proposal.

**Host changes, ACME rehearsal and public DNS release have THREE DIFFERENT grants.** The Stage1 code-only G4 does not grant any of them. The www/IPv6 DNS choice also does not authorize TLS hook actions.

### W17-D · exact ownership and acceptance outcome

| Item | Evidence | Current verdict | Next accountable |
| --- | --- | --- | --- |
| Limited Stage1 source work | canonical Result v0.2 G4_PASS/WAITING, Web/UI G5 in progress | **APPROVED code only**, no host source branch | Lead / Web/UI / Q-01 |
| New-only Nginx diff / implicit 443 default | W14 two-item diff and local fixture PASS | **DESIGN PREPARED, NOT INSTALLED** | Kirill+Club owner host permission after QA/release Gate |
| MDAO legacy 502 and meaningful health | historical 502/502/502, no healthy proof | **NOT VERIFIED/NO K1-K2 OWNER SIGNOFF** | Kirill/MDAO owner |
| DNS A plus www CNAME and IPv6 | Pages both names today; www target includes AAAA | **D1 PROPOSED/NOT APPROVED** | Club DNS owner + later release Gate |
| DNS-01 noninteractive rehearsal/cleanup | cert/hook/timer metadata only | **NOT VERIFIED; REAL TXT SIDE EFFECTS** | Club DNS owner + Kirill separately |
| Live pre-DNS CA-trusted SNI / post-reload no-drift | New Club site not installed on VM | **NOT RUN** | Kirill+Q-01 after written host grant |
| Production/G8 | independent Web/UI G6 and Auth/Storage actors pending | **NO-GO** | Lead / Q-01 / Club owner |

**REQUEST IN EXISTING #255 ONLY:** Kirill reply K1 or K2 plus meaningful safe health baseline/rollback custodian and explicit future host-grant owner; Club DNS owner reply D1 or D2 and separate ACME1 permission choice. A-01 is ready to reconcile their actual answers into same Draft #257; until then classify as WAITING_FOR_SIGNOFF, not DONE. **PRODUCTION / VM / DNS / CLOUD / MDAO / LIVE EFFECT: NONE.**
## W14 · TLS renewal and MDAO no-drift — exact Architect/DevOps permission packet (2026-10-21)

**STATUS: DOCUMENTED + LOCAL FIXTURE TESTED, NOT INSTALLED.** The latest [Lead W14 task](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6314259056) permits preparation ONLY in existing Draft PR #257. Site-only [Draft #309](https://github.com/SLADZARI/degradation_club/pull/309) remains G4_APPROVAL_PENDING with implementationStartAuthorized=false. Cloud Auth, GitHub Pages, existing game and MDAO are unchanged. W13 static artifact 468/468 source-vs-VM byte parity accepted; do not rebuild or re-upload.

### W14-A. KNOWN — live metadata checked at 2026-10-21 12:42–12:45 UTC (strict-known-hosts SSH, read only)

- Actual Ubuntu Nginx 1.24.0 reports configuration syntax PASS and uses wildcard **include /etc/nginx/sites-enabled/*;**. Enabled files: default, dementor-live.conf, graylog.conf, monitoring.conf, n8n.conf. The 80 IPv4+IPv6 default is explicitly marked default_server; existing game owns its IP-Host :80. **n8n.conf is the only present 443 ssl vhost and therefore the current implicit 443 default**, with no explicit 443 default_server. No dementor.club named vhost currently exists.
- **Critical Nginx ordering correction:** Earlier W9 site file candidate dementor.club.conf would sort BEFORE n8n.conf and might silently replace n8n as implicit 443 default. Use ONLY the proposed **zz-dementor.club.conf** filename and same enabled symlink: existing wildcard ordering loads it AFTER n8n. The actual post-install implicit default and unknown Host/SNI routing MUST still be tested. No global Nginx/default rewrite.
- Actual VM certificate CN dementor.club, SAN **dementor.club + www.dementor.club**, validity **2026-10-17 17:14:07 UTC – 2027-01-15 17:14:06 UTC**. Existing VM paths are /etc/letsencrypt/live/dementor.club/fullchain.pem and privkey.pem. No key bytes read. No current Nginx Club HTTPS listener, so client-trusted VM SNI is NOT VERIFIED.
- Certbot 2.9.0; existing renewal/dementor.club.conf is root-owned mode 0644, authenticator **manual**, preferred challenge **dns-01**, and BOTH authentication+cleanup hooks configured. Without reading scripts/credentials, safely parsed hook command metadata: Python3 invokes the same existing root-owned **0700** Python script (~6661 bytes) with different auth/cleanup arguments. certbot.timer is enabled and active; generic renewal-hooks/pre|deploy|post directories contain 0 files. **This does NOT prove noninteractive DNS renewal, cleanup or Nginx reload**.
- Authoritative DNS still points apex to GitHub Pages A quartet 185.199.108/109/110/111.153 (TTL 600), apex AAAA is ABSENT; www CNAME sladzari.github.io (TTL 3600). Existing 443 listener has no verified IPv6: no AAAA or IPv6 443 addition is part of this change.
- W12 read-only baseline: 4 vCPU, 7.6 GiB total / 6.7 GiB available RAM, 42G disk free; nginx/docker/gitlab-runner active, db-dev running; Live game Docker healthy and IP-Host /api/health HTTP 200; private Club preview 12 public routes HTTP 200 + two intentional 404. Three legacy MDAO vhost HEAD probes return **502 / 502 / 502**, matching prior observations. **This is not a MDAO service-health PASS**, only the observed response baseline.

### W14-B. EXACT new-only Nginx diff for future approval — ZERO existing files changed

Two planned changes ONLY: add /etc/nginx/sites-available/zz-dementor.club.conf as new mode 0644 file, and add /etc/nginx/sites-enabled/zz-dementor.club.conf as a NEW symlink to it. The new file will load after n8n.conf, with no default_server and IPv4 only. No upstream proxy, Docker, game route, auth or existing certificates modified. Existing Nginx config and MDAO files are NOT edited. **This is a literal review proposal, not a deploy command.**

~~~diff
diff --git a/etc/nginx/sites-available/zz-dementor.club.conf b/etc/nginx/sites-available/zz-dementor.club.conf
new file mode 100644
--- /dev/null
+++ b/etc/nginx/sites-available/zz-dementor.club.conf
@@ -0,0 +1,29 @@
+# PROPOSAL ONLY; new site file, not installed.
+server {
+    listen 443 ssl;
+    server_name dementor.club;
+    root /srv/dementor/stage-a/releases/cde332779ab0e256dd1e498660d6fa651e91846e;
+    index index.html;
+    ssl_certificate /etc/letsencrypt/live/dementor.club/fullchain.pem;
+    ssl_certificate_key /etc/letsencrypt/live/dementor.club/privkey.pem;
+    location / {
+        try_files $uri $uri/ =404;
+    }
+    location ~ (^|/)\. {
+        return 404;
+    }
+}
+server {
+    listen 443 ssl;
+    server_name www.dementor.club;
+    ssl_certificate /etc/letsencrypt/live/dementor.club/fullchain.pem;
+    ssl_certificate_key /etc/letsencrypt/live/dementor.club/privkey.pem;
+    return 301 https://dementor.club$request_uri;
+}
+server {
+    listen 80;
+    server_name dementor.club www.dementor.club;
+    location / {
+        return 301 https://dementor.club$request_uri;
+    }
+}
diff --git a/etc/nginx/sites-enabled/zz-dementor.club.conf b/etc/nginx/sites-enabled/zz-dementor.club.conf
new file mode 120000
--- /dev/null
+++ b/etc/nginx/sites-enabled/zz-dementor.club.conf
@@ -0,0 +1 @@
+../sites-available/zz-dementor.club.conf
~~~

**LOCAL TEST ONLY:** Tested these same server/location/redirect rules in an isolated disposable Nginx fixture with ports 19443/19080, a throwaway self-signed SAN cert and synthetic default vhosts. After correcting ONLY the fixture temp-directory traversal permissions, nginx -t PASS, apex / and /projects/ HTTP 200, missing static/dotfile 404, www HTTPS and apex HTTP 301 to canonical apex, unknown Host on 80 and 443 stayed with synthetic existing defaults (418/418). Client checks used an explicitly trusted local test cert, not insecure -k. This does **NOT** validate live VM TLS SNI, site install, renewal or prod G6.

**No HTTP-01 in this diff:** the Club dotfile-deny blocks /.well-known/acme-challenge on HTTPS; HTTP is redirect-only. Existing lineage uses DNS-01. An HTTP-01 switch would require a separate approved port-80 challenge webroot/location exception, safe dotfile negatives and an additional reviewed diff.

### W14-C. VERIFIED PLAN for unattended TLS renewal (NOT RUN)

**Preferred route: validate and automate the existing manual DNS-01 hooks, if safe and supported.** Kirill is the VM/Nginx/Certbot host custodian; the Club owner is the GoDaddy DNS/TXT custodian; Q-01 independently reviews redacted evidence. Prior to any rehearsal they must privately inspect the existing script (not publish secrets), confirm approved noninteractive provider API eligibility, credential custody outside Git/logs, least-privilege zone scope, TXT propagation and cleanup by exact record ID for BOTH _acme-challenge.dementor.club and _acme-challenge.www.dementor.club. Cleanup MUST NOT delete other concurrent values/TXT. Script existence is not a behavior PASS.

| Exact action | Side effects and required permission | PASS/STOP criterion |
| --- | --- | --- |
| Read-only SAN/expiry/mode/timer/hook metadata | Allowed now; COMPLETED, no DNS action | Identified names and date; auto-renew status remains **NOT VERIFIED** |
| Later scoped **certbot renew --cert-name dementor.club --dry-run** | **MUTATING despite dry-run**: staging ACME network calls, may create/delete REAL DNS TXT, execute external hook, write local logs/temp/state; requires **explicit Kirill host + Club DNS owner approval**, named TXT scope, time window, cleanup and failure rollback. Confirm staging ACME endpoint, not an unintended custom production endpoint. **NOT EXECUTED** | Both SAN validations noninteractive PASS, authoritative TXT propagation and only owned records cleaned up, no orphans, no MDAO/other cert changes; sanitized run/exit evidence |
| Future cert success deploy handling | A deploy hook/automatic reload changes shared Nginx state: **separate Kirill+Club owner written permission**; certbot.timer alone NOT sufficient | Validated renewed certificate, nginx -t + **controlled reload only after authorized success**, MDAO/game baseline unchanged, externally trusted leaf/chain after reload |
| Future pre-DNS site SNI after separately approved install | curl --resolve dementor.club:443:APPROVED_VM_IP https://dementor.club/ plus www variant; verify without -k, CA chain, SAN, HTML/404/redirect and callback shell; also test unknown SNI/default routing | Both names trusted, apex 200, www 301, no MDAO/IP game impact; no DNS cutover at this step |
| Operational ownership | Owner-approved certificate expiry alert at 30/14/7 days before **2027-01-15**, named Kirill and Club owner, recovery runbook | Actual alert recipient and recovery path demonstrated; not merely timer enabled |

**Alternative if DNS API/hooks cannot safely auto-renew:** retain explicit human-owned manual DNS-01 renewal with expiry monitoring as TEMPORARY documented exception only; label **MANUAL, NOT UNATTENDED PASS** and obtain separate owner risk decision before release. HTTP-01 is an alternate Change Proposal, **not** a behavior in the proposed site diff. Relevant vendor guidance: https://github.com/certbot/certbot/blob/main/certbot/docs/using.rst ; Nginx default/location behavior: https://docs.nginx.com/nginx/admin-guide/web-server/web-server/ .

### W14-D. NO-MDAO / NO-LIVE DRIFT acceptance and permission matrix

**Kirill/MDAO must first explicitly accept the legacy baseline.** Their three sites showed HTTP HEAD 502/502/502 both before and after game installation. Preserving those codes is only probe-level no-regression, **not proof that MDAO works**. Kirill must document accepted status or a meaningful existing health endpoint and owner before any new Club Nginx install; if missing, **STOP** instead of declaring PASS.

| Protected check | BEFORE and AFTER required proof, metadata/redacted only | Hard STOP / rollback |
| --- | --- | --- |
| Nginx existing files/owners | Kirill records original enabled-site filenames, owner/mode and hashes (NOT their contents in public GitHub). AFTER exact same; **only two newly added Club items**; nginx -t PASS | Any change to default, Live, n8n, graylog, monitoring or global nginx.conf; any old file SHA change |
| 80/443 default/host/SNI | Port 80 default IPv4+IPv6 unchanged, existing 443 implicit default remains n8n, Live IP Host and MDAO name mapping unchanged. New Club only explicit apex/www | New/default_server, implicit 443 drift, collision, 443 IPv6/AAAA surprise, wrong-site unknown Host |
| Game and SSE | Live Docker healthy, GET /api/health with IP Host 200, same loopback 14173, world volume NAME unchanged; separate bounded SSE fixture if approved | Live IP / health failure, SSE intercepted by Club, unexpected restart/network/volume touch |
| MDAO /db-dev /Runner | nginx/docker/gitlab-runner active; db-dev running on original port; existing volumes/mount names and listener map unchanged. Owner-approved MDAO 502 baseline and any meaningful health probe stable | Any unintended restart/port/mount/service/health change; no accepted MDAO baseline |
| Resource/static/Cloud | Owner-approved minimum available memory/disk/inodes; current 468-file fixed source hash; same Cloud Auth/PKCE/Storage endpoints and no private leak | Reserve exceeded, static SHA difference, Auth/PKCE/role negative fail |
| Recovery | Original GitHub Pages remains active/rollback-capable; save four apex A records and www CNAME before future DNS cutover; Kirill owner of site link/file revert and controlled reload | No safe two-item rollback, no tested Pages fallback, any protected service not stable |

**SEQUENCE (PROPOSED):** (1) Kirill signs MDAO/protected service BEFORE baseline and accepts agreed 502 interpretation; Lead/Q-01 review W14 diff; (2) **SEPARATE Stage1 G4 implementation approval** from Club owner and **Kirill permission** for exactly two new site files, nginx -t and controlled reload, with no other edits; (3) if later authorized, Kirill alone installs exactly those two items, checks nginx -t and live host default/MDAO/IP health, then targeted SNI, with immediate site-only rollback (remove only new link/file and authorized reload) on deviation; (4) approve/test DNS-01 staging rehearsal separately with Club DNS owner, prove TLS renewal strategy and QA actors; (5) clean G6/G7 + explicit owner/host/DNS cutover permit, preserve Pages rollback, verify live G8. Stage2 Club Auth/Data is another Result.

**NO-GO:** any unapproved existing vhost mutation/default change, MDAO owner baseline missing, game/SSE risk, failed/private role test, no trusted TLS+renewal decision, insufficient disk/RAM reserve, unapproved G4/G7. Static W13 parity PASS does not waive these.

STATUS: W14 PLAN DELIVERED / exact NEW-ONLY diff; KNOWN: cert SAN+expiry, DNS hooks present, names/default and no AAAA; NOT VERIFIED: unattended DNS renew/TXT cleanup, client-trusted VM Club 443, Kirill signed 502 baseline, QA actors; REQUIRES PERMISSION: Kirill+owner site install/reload, Kirill+DNS owner DNS-mutating certbot rehearsal, later QA/Lead/owner production DNS approval. **PRODUCTION / VM / DNS / CLOUD / MDAO / LIVE EFFECT FROM W14 = NONE.**

## A-01/I-01 · W13 independent forensics of W12 static manifest ordering — 2026-10-21 08:58–08:59 UTC

**STATUS: STATIC_BYTE_PARITY PASS (READ-ONLY RECHECK); W12 HASH ALARM ROOT CAUSE IDENTIFIED AS MANIFEST SORT ORDER.** The preceding W12 historical FAIL is retained unmodified as observed. After [Dev2's exact 468/468 file-level reconciliation](https://github.com/SLADZARI/degradation_club/issues/256#issuecomment-6312014541) and [A-01 recheck request](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6312030083), Architect independently ran two **non-mutating, in-memory** hash calculations on the **same live existing release tree** using `MacBook-Pro-Zena.local`, already authorized strict-known-host SSH, `2026-10-21 08:58:34Z` and `08:59:06Z`. No site files, VM state, secrets, caches, source branch or services changed.

**Exactly reproduced both recorded SHA values from two different orderings** while keeping the same 468 file paths and bytes, identical per-file row schema `{"path", "bytes", "sha256"}`, outer object `{"sourceSHA", "files"}`, and compact UTF-8 `json.dumps(..., separators=(',', ':'), ensure_ascii=False)`:

| Sort expression before JSON | Count / bytes | SHA256 of manifest | Provenance / verdict |
| --- | --- | --- | --- |
| `sorted(files)` = Python `Path` component-wise ordering (Dev2's actual reference implementation) | 468 / 17,425,725 | **`b2da2d55847be160dd1827d4fc2169f3d078f06c121ef6667ffcde51d1490c63`** | **PASS**, matches Dev2 clean local build and latest VM source-by-file check |
| `sorted(files, key=lambda p: p.relative_to(root).as_posix())` = lexicographic POSIX path string ordering (W12 original Architect script) | 468 / 17,425,725 | **`516af743538e7f854d6da75ff3f81619419abbd24d4c3e54a236bce446f205c7`** | **EXPECTED DIFFERENT DIGEST**, not different file data |

**Direct reproducer first order divergence, same input filesystem:** element index 4 is `about/index.html` for Path component ordering, but `about-definition-v1.css` for POSIX string ordering. Python compares `Path` by components (e.g. directory `about` vs filename `about-definition...`), whereas the serialized POSIX path compares slash and hyphen as characters. This changes row order and therefore aggregate JSON SHA256. Both orderings produce the **SAME file set**, and independent Dev2 source-vs-VM per-file SHA/size comparison found **ZERO changed, missing or extra files**. VM `index.html` and actual localhost HTTP-served homepage sha256 `1f807b08e772ceae853cb7518f149b73024d5933de65f55af510003e4ffc0f30` match Dev2 clean build.

**Corrective conclusion:** W12 did **not** establish changed/corrupted VM content; it compared different manifest serialization orders. Historical recorded digests remain correct for their *respective* ordering and W12 source-level STOP was conservative at the time. **Supersede ONLY that static file-byte-parity STOP** after this independent recheck; use the exact `sorted(Path)` reference method for future agreed hash equality, or preferably compare per-file path-keyed `SHA256 + size` before declaring a deployment mismatch. Document canonical order explicitly in the owning artifact contract (#256). Do NOT re-upload, overwrite, re-build, chmod or restart the existing VM release for this now-explained difference.

**NOT A RELEASE GO:** Stage1 [Draft #309](https://github.com/SLADZARI/degradation_club/pull/309) `G4_APPROVAL_PENDING` / implementation false; W12 real Nginx named map indicates no existing `dementor.club` name but the candidate vhost is NOT installed; public CA-trusted VM SNI and unattended DNS-01 certificate renewal NOT VERIFIED; MDAO 3×502 must not be mislabelled healthy; 24–72h VM peaks, off-VM restore, UX P1, #228 role/PKCE/CIRCLE/RLS/Storage actor negatives and explicit G6/G7/owner release remain BLOCKED.

```text
STATUS: #255 ARCHITECT HOST AUDIT DONE / STATIC PARITY PASS_RECHECK / #309 SITE IMPLEMENTATION G4 PENDING
CHECKED: Dev2 #256 per-file evidence; both original W12 and Dev2 sorted(Path) manifests independently on current exact VM tree
CHANGED: SAME one-file Draft PR #257 report; no host, production, game, Cloud or DNS edits
VERIFIED: identical 468 file set, same 17,425,725 bytes, both original hash values independently reproducible from different sort order; Dev2 468/468 source parity
NOT VERIFIED: staged public SNI/TLS renew, protected full MDAO health, QA actors/privacy, off-VM recovery, release authorization
BLOCKERS: all non-static-release Gates above remain, except W12 manifest-hash STOP corrected
NEXT: Q-01 independently classify corrected static byte-parity evidence; Lead evaluate Stage1 #309 G4 and remaining separate DNS/host approvals
PRODUCTION EFFECT: NONE / VM EFFECT: NONE
```

## A-01/I-01 · W12 ACTUAL trusted-SSH VM AFTER snapshot — 2026-10-21 08:37–08:41 UTC

**EVIDENCE STATUS: HOST ACTUALLY VERIFIED (READ-ONLY, LIVE), NO DEPLOY / HOST WRITE.** Previously blocked host inspection now performed using EXISTING registered `MacBook-Pro-Zena.local` via Remote Desktop Commander + existing `~/.ssh/dementor_server` key and **pretrusted** `138.199.144.94` SSH host key with `BatchMode=yes`, `IdentitiesOnly=yes`, `StrictHostKeyChecking=yes`. Host identity verification succeeded, `date` returned live UTC times. Preexisting authorized SSH identity reports `root`; **no account creation, sudo escalation, key mutation or config write**. Read-only shell on host used `ss`, `nginx -t/-T` FILTERED directives only, service and container metadata, `stat`, `sha256sum`, `free/df`, `openssl x509`, `curl` HEAD/health GET status, and one **in-memory** Python SHA256 of existing static tree. No Cloud/DB/Storage/auth records, game save/world/music, secrets, PAT, private key bytes or protected `/data/*` were read.

### W12-1. Fresh post-game VM and protected-service comparison

| Surface | DIRECT observation at 2026-10-21 UTC | Status / caution |
| --- | --- | --- |
| VM CPU/RAM/swap | **4 vCPU**, **7.6 GiB total / 6.7 GiB MemAvailable**, **0 swap**; point-in-time load `0.22/0.12/0.10` | **CURRENT POINT-IN-TIME PASS for inventory only**; NOT 24–72h peak/capacity PASS or Stage2 Supabase sizing |
| Filesystem/inodes | root ext4 **75G total / 31G used / 42G available / 43% used**, inodes **4,201,990 available / 14% used** | **MEASURED PASS** free-space count; off-host backup/restore headroom NOT VERIFIED |
| systemd/Docker | `nginx`, `docker`, `gitlab-runner` all **active**, `nginx -t` **syntax PASS**; `db-dev` running; Docker `dementor-live-game-1` running **healthy** | **SERVICE STATE PASS** at inspection. DB clients/legacy data integrity/backups NOT VERIFIED. :32778 historical owner inquiry remains RESOLVED; live bind metadata observed but not re-escalated |
| Listeners | public `0.0.0.0:80`, `[::]:80`, `0.0.0.0:443`; game **`127.0.0.1:14173`**, Club private preview **`127.0.0.1:18080`**; :32778 binds on both host stacks as previously reported | **BIND INVENTORY PASS**; no public new Club port. No `[::]:443` listener observed, so separate IPv6/TLS plan before adding an AAAA |
| Nginx included sites | `default` owns port-80 default IPv4+IPv6; **`dementor-live.conf`** matches the IP Host on port-80 IPv4+IPv6; protected MDAO `graylog.conf`, `monitoring.conf`, `n8n.conf` remain enabled; n8n named HTTPS 443; selected effective `server_name` directives contain **NO `dementor.club` or `www.dementor.club`** | **NO EXISTING NAMED SITE COLLISION PASS (current config only)**. Does **not** prove future candidate `nginx -t`, SNI, SSL, default behavior, nginx include/add/reload or MDAO full I1–I8 |
| Game IP and SSE boundary | Game Docker **healthy**, volume **`dementor-live-world` name present**, IP-Host `http://127.0.0.1/api/health` with Host set to VM IP = **HTTP 200**. Direct loopback `127.0.0.1:14173/api/health` returned **403** for both HEAD/GET without the IP Host (Host-dependent path); not used as evidence of game outage | **IP-HOST HEALTH PASS**, game process stays separate and loopback; no SSE/reconnect/world-data integrity test. No route/front-door change allowed |
| MDAO vhost HTTP status | Read-only HEAD to 3 existing named MDAO vhosts yielded **502 / 502 / 502**. Oct18 game deployment owner report recorded the **same 502 pre- and post-game** | **NO CHANGE IN THESE THREE REPORTED HEAD CODES vs Oct18**, but MDAO service end-to-end **NOT HEALTHY/PASS** and no proof of total legacy no-drift; Kirill/MDAO own existing failures |
| Club private preview | PID **2772007**, user **nobody**, Python3; `127.0.0.1:18080` HTTP HEAD returned 200 for 12 permitted static/public/Workspace/Board/Join/PKCE shell/SEO paths; missing asset and `/.git/config` both 404 | **STATIC LOOPBACK HTTP PASS**, with NO browser JS, Google login, role, private RLS, media or public HTTPS evidence |
| Site files/permissions | Root `/srv/dementor/stage-a/releases/cde332779ab0e256dd1e498660d6fa651e91846e` **0755 root:root**, `index.html` **0644 root:root**, regular real file with SHA256 **`1f807b08e772ceae853cb7518f149b73024d5933de65f55af510003e4ffc0f30`**; no observed symlink escape of index | **ENTRY METADATA PASS**. Does not prove Nginx public read/config/route. Existing earlier `www-data` read PASS operator evidence only |
| TLS | Owner-issued separate VM fullchain readable; X.509 CN `dementor.club`, SAN apex+www, issuer Let's Encrypt **YE2**, valid `2026-10-17 → 2027-01-15`. Renewal config contains both `manual_auth_hook` and `manual_cleanup_hook` entries, Certbot timer enabled | **CERT PRESENT + RENEWAL HOOK CONFIG PRESENT**. **UNATTENDED FUTURE RENEWAL NOT PROVED** (no `certbot renew --dry-run`, no ACME challenge run); **VM client-trusted HTTPS SNI NOT PROVED** because new site vhost not installed |

### W12-2. Critical artifact parity discrepancy — **STATIC MANIFEST NOT MATCHING**

**Direct in-memory hash with EXACT Dev2 documented canonical algorithm** (no files/manifests written on VM): sort existing 468 regular files by POSIX-relative path, each row `{"path":...,"bytes":...,"sha256":<file SHA256>}`, then hash UTF-8 canonical JSON `json.dumps({"sourceSHA": pinnedSHA, "files": rows}, separators=(',', ':'), ensure_ascii=False)`. Dev2 baseline and algorithm: [#256 evidence](https://github.com/SLADZARI/degradation_club/issues/256#issuecomment-6235450709).

| Property | Dev2 clean local build `_site/` | Actual existing VM preview directory |
| --- | --- | --- |
| Pinned source claim | `cde332779ab0e256dd1e498660d6fa651e91846e` | Same **directory name/source claim**, not independent file-content identity |
| File count | **468** | **468** |
| Sum of file bytes | **17,425,725** | **17,425,725** |
| Full SHA256 manifest | **`b2da2d55847be160dd1827d4fc2169f3d078f06c121ef6667ffcde51d1490c63`** | **`516af743538e7f854d6da75ff3f81619419abbd24d4c3e54a236bce446f205c7`** |
| Exact file-level parity verdict | Accepted developer reference | **FAIL (hash mismatch)** |

**Release consequence:** Matching file count and total size alone **DO NOT** prove immutable artifact parity. Verify the per-file difference against the source-of-truth clean build under Dev2's owned artifact acceptance and possible manifest-serialization discrepancy, without rewriting/rebuilding the current VM release or public production under #255. **HARD STOP** for using this existing VM artifact as the exact clean G7 RC until parity is explained and independently retested. This is an observed mismatch, **NOT** proof of tampering/compromise and not license to mutate VM. Lead/Dev2/Q-01 should classify and resolve under owning approved site Result/Gate.

### W12-3. Final gate/evidence verdict

```text
STATUS: AFTER READ-ONLY HOST VERIFIED / CANDIDATE SITE RELEASE BLOCKED
CHECKED: ssh strict host identity, dated process/service/ports, compiled nginx named map, static route/404, manifest algorithm, VM public cert metadata, MDAO historic HEAD statuses
CHANGED: Draft #257 report only; VM/production/DNS/Cloud/database/game/MDAO NONE
VERIFIED: 4 vCPU, 6.7 GiB available memory, 42G available disk, nginx/docker/runner active, db-dev running, Live IP Host health 200, private static routes/404, no Club named vhost collision, cert SAN+dates
NOT VERIFIED: full MDAO no-drift/legacy health, public VM CA-trusted SNI, unattended renewal, 24–72h host capacity, off-VM restore, Auth/PKCE/RLS/CIRCLE/Storage actors and Stage2
FAIL: pinned 468-file static artifact SHA256 manifest differs from clean reference despite equal count and size
BLOCKERS: artifact content parity owner investigation; independently demonstrated TLS renewal; G4/#309 owner authority; Q-01 actor negatives and future G6/G7; full release/rollback approval
NEXT: Dev2 investigate exact artifact hash/diff without modifying source VM; Q-01 classify fail; Lead+Kirill decide next G4/host steps; Architect makes proposed nginx new-only config readiness statement but DOES NOT install
PRODUCTION EFFECT: NONE
```

## A-01/I-01 · W11 post-game host audit readiness (2026-10-21)

**AUTHORIZED SCOPE:** [Lead #255 latest](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6301643536) = **one dated, sanitized READ-ONLY host-after snapshot** and exact new-only vhost collision delta in this Draft #257. No new Result, vhost install/reload, Docker, ACME/DNS rehearsal, Cloud export, production or game/MDAO mutation is permitted.

**CURRENT GOVERNANCE — VERIFIED ON GITHUB; OLD KERNEL BLOCKER RESOLVED:** [Owner #237 decision](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6302633113) and [Lead verified governance update](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6302725694). Approved pointer correction `e4cacb8ef1f962c534ad937fbbf6bdd125ad34de` already done; formal BQA-23 owner-pause commit `6c5d552d89c94e6662c78c2f9b54a9f576f54c13` already done. Direct re-read of `dementor-club` PROJECT v3.24 confirms `activeIntegrationBranch=null`, `currentResult=owner-admin-community-ops-v1 v0.2` **WAITING** at historical G5, and paused Draft PR #252 preserved; INDEX v3.25 and Result v0.2 consistent. **Do NOT repeat pointer changes or resume Owner Admin.** Stage1 [Draft #309](https://github.com/SLADZARI/degradation_club/pull/309) now has `ownerScopeConfirmed=true` and `g4PreparationAuthorized=true`, but `G4_APPROVAL_PENDING` and `implementationStartAuthorized=false`. Owner permitting preparation is **NOT** site implementation approval.

**CURRENT HOST EVIDENCE — NOT VERIFIED:** Remote Desktop Commander lists both authorized/registered Macs OFFLINE as of this check, including the previously trusted SSH Mac. No host login was attempted; no unknown ED25519 host key accepted, no privilege escalation. We **cannot** convert Oct17 pre-game Nginx facts into post-Oct18 Live no-drift PASS. The connected Mac being offline is not evidence that VM is offline.

**ONE PREPARED NON-MUTATING PACK (local user attachment, not canonical Git authority):** `dementor_club_operator_pack_readonly.zip`, **SHA256 `83175cf4835dc0bb29066d221e6a2d66b233ad1b3a08490424c87cfc3a394bda`** (updated to record completed pointer/BQA pause). Embedded `01_host_readonly.sh` unchanged at SHA256 `84f22e6d50502ecdf8be573f8ec7b8da8afb2fbfc7330d04e63b3b1a42e60517`, `bash -n` PASS and ZIP CRC/4-entry integrity PASS. Run only through **an already trusted Kirill-authorized SSH session**, once; do NOT use `StrictHostKeyChecking=no`, `sudo`, or unapproved host writes. Redact results before GitHub; script prints filtered Nginx directive *paths/names*, 80/443 and private game/portal bind codes, service states, static `index.html` hash/metadata, and `nproc/free/df/inodes`, never game world or `/data/*` contents.

| Lead requested evidence | Historical evidence | CURRENT independent status |
| --- | --- | --- |
| MDAO/IP game Nginx default/80/443 named vhosts | Oct17 owner map before Oct18 Live vhost; game deploy owns IP `138.199.144.94` / `127.0.0.1:14173` | **NOT VERIFIED POST-GAME**; cannot say new `dementor.club` vhost has no collision |
| `/srv/dementor` release index, `127.0.0.1:18080` | Oct17 operator static index and Python private HTTP PASS | **NOT VERIFIED NOW**, no served 468-file hash parity |
| MDAO db-dev/Runner/Docker, Live game status and saved volume | Operator historical services, Oct18 Live report; old :32778 inquiry owner-resolved | **NOT VERIFIED CURRENT**; do NOT read game world or MDAO `/data/*` |
| Capacity free RAM/CPU/disk/inodes | Older 4 vCPU/7.6 GiB/~43 GB free, BEFORE game | **NOT VERIFIED CURRENT**; cannot approve Stage2 full Supabase sizing |
| TLS and renewal | Owner dual-SAN apex+www cert expires 2027-01-15; DNS-01 v2 hooks staging reconfigure and orphan TXT cleanup owner-PASS | Actual CA-trusted VM SNI and unattended *future* renewal **NOT VERIFIED**, `certbot.timer` alone not PASS |
| New-only Nginx design and rollback | W9-3 exact proposed vhost/cert paths, Pages quartet fallback | **PROPOSAL ONLY**; no Nginx install, `nginx -t` on live diff, reload or DNS switch |

**NEXT:** once the trusted host client is available, run exactly one already-prepared collector with Kirill's existing read-only grant; compare actual post-game Nginx `server_name`/default listen, site root, RAM and MDAO/Live vs the historic baseline; mark `PASS / FAIL / NOT VERIFIED` for each, identify cert/backup/rollback custodians, attach **sanitized metadata only** in #255 and amend same Draft #257 for Q-01. If access unavailable, **WAITING FOR HOST EVIDENCE**, not another architecture branch. #228 Q-01 and #309 owner G4 remain separate blockers. **PRODUCTION / VM / DNS / CLOUD / MDAO / LIVE EFFECT: NONE.**

## A-01/I-01 unified operator package — Lead W10 reconciliation, 2026-10-20

**STATUS:** **ONE REVIEWED DRAFT DOCUMENT / ONE LOCAL NON-MUTATING OPERATOR KIT / NO INSTALL**. Owning instructions: [Lead #255 Wave 10](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6301643536), [Lead PR #257 exact corrections](https://github.com/SLADZARI/degradation_club/pull/257#issuecomment-6301387334), owner DC01 [#237](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6301176142), and distinct Stage1 site-only G4 proposal [Draft #309](https://github.com/SLADZARI/degradation_club/pull/309). **This document is DRAFT/REFERENCE and cannot authorize host changes.** Existing active Owner Admin G5 vs closed Board Media active-branch pointer discrepancy remains a STOP for Gate promotion, not to be mechanically edited by DevOps.

### W10-A. Single-packet manifest and terminal handoff (no duplicate mechanisms)
- Existing static site source: `dementor-club-production@cde332779ab0e256dd1e498660d6fa651e91846e`, existing built `_site` evidence 468 files; do **not** rebuild for this audit. Current Draft #308 Board composer and source-known mobile/login P1 issues are separate Web/UI owner PR/Gates; no silent integration into frozen site artifact.
- **One optional host evidence collection, only when required, from the EXISTING trusted operator Mac:** downloadable chat-attachment packet `dementor_club_operator_pack_readonly.zip` (local convenience, NOT Git authority) SHA256 `83175cf4835dc0bb29066d221e6a2d66b233ad1b3a08490424c87cfc3a394bda`. Contains `01_host_readonly.sh` SHA256 `84f22e6d50502ecdf8be573f8ec7b8da8afb2fbfc7330d04e63b3b1a42e60517`, review-only Nginx candidate and guarded release/rollback checklist. The script **does not use sudo, read /data contents, extract credentials, write to VM, touch Cloud or restart services**; it prints selected Nginx server_name/listen/root/cert **paths only**, 80/443/IP game loopback/preview, safe process/container identifiers, disk/inodes/RAM and public certificate metadata. Review/redact all hostnames/paths before filing evidence. If owner-SSH is unavailable, status stays **NOT VERIFIED**; no host key bypass.
- **Terminal command ONLY IF trusted access is available and Kirill grants read-only host inspection:** after unpacking packet on the trusted Mac, in its folder run:
  ```bash
  ssh -o BatchMode=yes -o StrictHostKeyChecking=yes YOUR_EXISTING_SSH_ALIAS 'bash -s' < 01_host_readonly.sh > host_after_private.txt
  ```
  This creates a report on **Mac only**. No file is created on VM. GitHub comment must contain only sanitized metadata, not full raw config. Do **not** use untrusted root login, install keys or ask owner to repeat old static/TLS tests.
- **Known access constraint:** connected remote Mac(s) were OFFLINE at W10 collection, so Architect did NOT run direct host inspection. Existing owner-operated snapshots from Oct17/18 remain **DATED** after Live deployment. The bundle is prepared for ONE future operator run, not a new server setup.

### W10-B. Actual-to-target isolation and no-drift proof matrix

| Surface | Existing evidence | Exact current AFTER proof still required | Allowed future delta / STOP |
| --- | --- | --- | --- |
| **Club site Stage1** | Pages canonical source `cde33277`; operator private VM `127.0.0.1:18080`; `/srv/dementor/stage-a/releases/<SHA>` | Actual root/index SHA, permissions, private preview status, no symlink escape; Nginx worker read; source vs served artifact | New **named-only** `dementor.club` and `www.dementor.club` HTTPS blocks, correct 200/404, HTTP→HTTPS and canonical. **NO default_server**, no unapproved IPv6 |
| **Dementor Live** | [Oct18 deployment](https://github.com/SLADZARI/degradation_club/blob/deploy/dementor-live-isolated-2026-10-18/projects/dementor-live/runtime/docs/DEPLOYMENT_2026-10-18.md): IP Host `138.199.144.94`, `dementor-live.conf`, `127.0.0.1:14173`, `dementor-live-world` | Current IP/default server_name/listen map, container status and **HTTP status only**, volume **name only**, world backup owner (no contents) | Site must not intercept IP Host or game SSE, alter Live Compose/volume, proxy or reload game. Any conflict = STOP |
| **MDAO legacy** | Nginx named default/graylog/monitoring/n8n, Docker `db-dev:32778`, Runner and protected `/data/*` | Current filtered enabled Nginx list, service states, listener/bind map; metadata only, no `/data` traversal | All existing vhosts/files, ports, Docker volumes and processes remain unchanged. Any unexpected diff = STOP; port inquiry #32778 owner-reported resolved |
| **Capacity** | Old 4 vCPU/7.6GiB and ~43 GB free before new game; owner once estimated ~40 GB | Fresh after-game `nproc/free/df -hT/df -i` and listen/runner pressure; owner-provided peak data if available | Stage1 static within accepted reserve; **Stage2 full Auth/Postgres/API/Storage/worker capacity UNKNOWN until measured** |
| **TLS/ACME** | Owner manual dual SAN cert apex+www expires 2027-01-15; v2 DNS-01 auth+cleanup staging reconfigure and guarded TXT cleanup reported PASS | Filtered cert paths + owner/custodian + current lineage renew hook config **names only** (no PAT), trusted HTTPS SNI **AFTER site install via separate Gate** | `certbot.timer` != unattended renewal PASS. Renewal scenario must be tested under separately approved DNS/ACME scope; cannot emit or modify certificates in this audit |
| **Backend Stage2** | Shared Cloud mixed Auth, 28 dc_*, 11 unprefixed and MP/Robo/Live exclusions | Approved B-01 DC01 all-account/minimal-profile manifest, tested UUID/Google mapping, pinned Supabase version images, post-game capacity, off-VM restore owner | Fully independent Club stack under its own `/srv/dementor` namespace, never legacy `db-dev` or `/data`; **no work in Stage1** |

### W10-C. Version pinning and Auth URL contract (verified official Supabase 2026 requirements, no install)
- **PG17 default** (self-hosted rollout June 2026): new target should plan PostgreSQL 17 compatible with source Cloud 17.6, **not** assume old default PG15; pin the exact vendor Postgres image tag and immutable digest in a future approved Compose lock manifest after local compatibility testing. PG15 data dirs cannot be mounted directly by PG17. Check extensions and locale/collations. [Official PG17 change](https://supabase.com/changelog/46080-self-hosted-supabase-upgrading-from-pg-15-to-17-breaking-change).
- **GoTrue external auth URL** after July 2026: `API_EXTERNAL_URL` contains `/auth/v1` once. Provider callback becomes `${API_EXTERNAL_URL}/callback`, yielding `https://<dedicated-api-host>/auth/v1/callback`; do not double-prefix. The **Club website** `/auth/callback/` is a different browser client route. [Official URL change](https://supabase.com/changelog/47093-self-hosted-supabase-api-external-url-to-include-auth-v1) and [self-host OAuth](https://supabase.com/docs/guides/self-hosting/self-hosted-oauth).
- **Envoy new default API gateway** (Aug 2026) replaces default Kong: `api-gw` / `supabase-envoy`, default gateway plain HTTP port 8000 requiring owner-approved external TLS proxy; do NOT reserve or bind 8000 publicly on shared host without measured port inventory/owner. Pin exact stack/Envoy/Auth/Storage/PostgREST/worker image tags AND digests **as a consistent tested bundle**, not `latest` and not hardcoded outdated Kong conventions. [Official Envoy change](https://supabase.com/changelog/48048-self-hosted-supabase-envoy-becomes-the-default-api-gateway-b).
- Current Supabase Cloud mixed project `mmekfydwbvptbdatwitj` runs PostgreSQL 17.6. **No self-hosted image/version has been chosen, pulled, locked, deployed or tested.** B-01 owns compatibility, reference schema parity and version pin manifest after independent Stage2 Gate. Never `db reset` or replay all 65 mixed Cloud migrations (includes MP/5 Robo migrations) as Club restore.

### W10-D. Exact client Join/Auth parity + Stage1/Stage2 cut
- Source at `dementor-club-production@cde33277`: [`global-header.js`](https://github.com/SLADZARI/degradation_club/blob/cde332779ab0e256dd1e498660d6fa651e91846e/global-header.js) has **`Вступить в клуб → /join/`**. Existing local first DC-9 allows completion without login; `/join/result/` displays result; before `/join/apply/` Google/PKCE login required; Membership comes only after review. No redirect of main CTA straight to Auth, no rewrite of 9/9 baseline/membership semantics.
- **Stage1:** `site-config.js` keeps current Cloud `https://mmekfydwbvptbdatwitj.supabase.co`, `canonicalOrigin=https://dementor.club`, public `/auth/callback/` must return correct static route; real PKCE login/return and Board/Storage negative tests remain Q-01 **NOT VERIFIED**. No Cloud Auth callback/CORS mutation under site hosting.
- **Stage2:** `auth/callback/index.html` separately hardcodes the Cloud Supabase URL and public publishable key, and `site-config.js` has its own endpoint; B-01/Web must perform an **atomic reviewed exact-SHA site/client+callback+other Auth call-sites** update only after isolated new Auth, approved Google callback and rollback readiness. Existing sessions are not portable assumptions. Never copy old tokens or service-role credentials into browser code.
- **Acceptance:** anonymous→DC-9 local→result→Application login/PKCE→review→Member route plus Guest/Applicant/Dementor/Owner and private CIRCLE/Storage direct API-negative tests. UI hiding ≠ security. Existing #228 hard stops and P1 anonymous Board login/Home mobile H1 are independently owned; no fake QA pass here.

### W10-E. Gated operator runbook / handoff with minimum user terminal friction
1. **NOW (allowed):** canonical #255/#257 doc reconciliation, one read-only prepared packet, Q-01 exact-head review, Lead #309 owner/G4 review; **NO terminal request until one current host snapshot is indispensable**.
2. **ONE read-only terminal run LATER only as required:** existing trusted Mac/approved SSH identity executes only the packaged `01_host_readonly.sh` above; no `sudo` assumptions or host-key override. Post sanitized output to #255, compare BEFORE/AFTER IP game+MDAO, reserved RAM/disk/inodes and precise vhost collision.
3. **AFTER separate APPROVED Stage1 G4+Kirill owner host grant:** reviewed new-only site-specific Nginx config (W9-3) and symlink, `nginx -t`, controlled reload and **pre-DNS** hostname/SNI `curl --resolve` using trusted CA **without `-k`**, route/404/header/Cloud PKCE/privacy and zero-MDAO/game drift. Unattended dual-SAN renewal/custodian proof required before release. No other vhost/file edits.
4. **AFTER independent Q-01 G6→clean G7 RC and FINAL owner/host/DNS release approval:** scoped apex A / www plan + exact Pages A rollback; live G8 only after actual site+roles+private media QA. PR #309 is currently a **DRAFT G4 proposal**, not a write permission.
5. **AFTER Stage1 G8:** separate Stage2 Club-only backend Result/G4 and new Auth/DB restore acceptance, preserving original Cloud MP/Robo, Live game and MDAO. Full accounts copied only under B-01 review; no self-host mutation now.

**STOP/NO-GO (automatic):** unknown present-day post-game/default 80/443 conflicts, any legacy/game IP or SSE interception, insufficient host reserve, missing actual site-root parity or valid CA-trusted VM certificate, timer-only renewal, unknown backup owner or failed off-VM restore, Cloud auth/PKCE break, private RLS/Storage leak, any future Result/authority conflict, owner/QA Gate not approved. **Prior kernel mismatch is already resolved by approved Lead commit; G4 Stage1 is still pending. NO PROD/VM/DNS/Cloud mutation performed by this A-01 package.**

## DC-Lead-002 — Club-only backend/Auth isolation read-only delta (2026-10-20)

**AUTHORITY:** Owning #237 club-only scope lock and #255 Lead clarification (comment 6278123149) supersede earlier generalized backend/game scope. This is DRAFT/REFERENCE, not a Decision/Gate. Live source metadata gathered read-only using Supabase MCP project mmekfydwbvptbdatwitj on 2026-10-20; no record contents, personal identifiers, credentials or object bytes were read or changed.

### B0. Measured ownership and dependencies
| Classification | Tables / services | Why / next authority |
| --- | --- | --- |
| CLUB_COPY candidate | 28 public dc_* tables | Club membership, role, Board, content, media, collaboration, outbox; check full DDL, FK, RLS, triggers, grants, records, worker semantics with Backend owner |
| CLUB_AUTH_ALL_ACCOUNT_COPY_INPUT / SHARED_PROFILE_MINIMIZATION | **ALL current shared-cloud** `auth.users` + linked `auth.identities` (Google provider) are owner-approved **source account input** for *new separate Club Auth*, **not** whole mixed DB restore; `public.profiles` only approved minimum fields; original Cloud accounts/MP/Robo remain intact. **Exclude old sessions, refresh tokens, JWT secrets, MP app permissions.** | DC01 owner scope supersedes prior selected-user policy. B-01 must prove UUID/provider mapping, profile per-field minimization, Google OAuth re-login, and negative actor QA BEFORE any export; no production write now |
| CLUB_COPY candidate, unprefixed | assessment_runs, assessment_snapshots, join_applications | DC-9/Application require these; live metadata 67 runs, 10 snapshots, 4 applications; reviews/outbox FK to join_applications, all three FK to profiles |
| CLUB_COPY schema/data candidates (B-01 source-backed, owner gate pending) | `course_enrollments` (1), `carts` (3), `cart_items` (2), `orders` (0), `order_items` (0) | B-01 confirmed shipped Workspace/Cart code calls and FK closure; zero rows != dispensable schema; **do not classify as approved copy until owner/Gate** |
| UNKNOWN_STOP | `event_registrations` (0), `contact_requests` (0) | Current public actions disabled; B-01 did not establish approved live API/use. Owner Decision required before schema inclusion/data export |
| MP_PRESERVE, DO NOT MIGRATE | 15 public mp_* tables, mp_private, MP RPCs, MP Auth/data | Leave original Cloud MP intact without client/Auth/permissions disruption |
| ROBO_EXCLUDE | public.game_daily_runs, player_profiles; Edge submit-run, daily-top3, daily-top5 | Separate Robo owner; preserve original Cloud auth dependency |
| Live/MDAO preserve | Dementor Live runtime, volume dementor-live-world; MDAO /data/*, db-dev, nginx IP/default, Runner, monitoring | Not part of Club cutover; metadata-only no-regression checks |

**Direct structural evidence:** profiles.id references auth.users.id; many dc_* FKs reference profiles. dc_membership_reviews and dc_membership_notification_outbox reference join_applications. Several MP tables reference auth.users directly. A prefix-only export fails FK and user identity parity.

**Aggregate identity metadata, NOT PERSON EXPORT:** auth.users=11, auth.identities=11, auth.sessions=43, profiles=11, dc_system_memberships=6, mp_system_memberships=3. Historical five-signal Club candidate union=7, including 3 MP-associated; 4 did not match partial Club signals. **Those 7/4 are diagnostic, NOT the current Auth copy filter.** Owner DC01 now explicitly selects **ALL current Auth users and linked provider identities as account source input**, while old Cloud Auth remains unchanged. Do not copy current sessions/refresh tokens or wholesale raw mixed profile fields, MP roles/permission claims or platform secrets. All-user copy has not been attempted; per-field privacy and GoTrue/UUID/Google provider compatibility must be approved and tested. No personal records read by this audit.

**RPC/RLS/worker:** metadata finds 69 dc_*-named public routines, 65 SECURITY DEFINER, 51 mentioning auth.uid, 13 mentioning profiles. A naive text scan mentioning mp_ is not reliable proof of MP table dependency; Backend must inspect exact routine SQL, references, policy predicates, EXECUTE grants, search_path, trigger and RPC invocation graph, with negative tests. Public tables report RLS enabled, but enabling RLS alone does NOT prove access parity.

**Storage:** private dc-community-artifacts bucket: 16 object records, 23,934,580 bytes declared in metadata, NOT downloaded and NOT physical-byte verified. Restore must include actual object bodies, metadata, hashes, content types and private access policy tests.

**Edge:** active telegram-outbox-worker v13 is Club scoped, verify_jwt=false; audit the actual worker authorization/schedule/secrets and dc_distribution_outbox duplicate-send guard before any cutover. Three Robo Edge functions excluded.

### B1. All-account copy alternatives — neither authorized to implement
**DC01 latest owner scope (2026-10-20):** input includes **ALL existing `auth.users` + linked `auth.identities`** in the current shared Cloud. This is a NON-DESTRUCTIVE *additional copy* into an independently isolated Club Auth. Original Cloud user UUIDs/MP-Robo logins/permissions continue unchanged. It is NOT a whole-Cloud database restore and it does not grant Club Membership or Role to an MP-only account.

1. **Option A (preferred only on tested compatibility):** preserve all 11 currently observed user UUIDs and 11 linked Google identity links in a **separate** Club Auth instance. Selective extraction is now applied to *approved profile columns/metadata only*, NOT to account membership. B-01 proves GoTrue schema/identity/provider constraints and duplicate-resolution without changing original Cloud Auth.
2. **Option B (requires separate owner Decision if A fails):** copy all accounts into new Club Auth with a documented restricted old→new UUID mapping; rewrite **only Club-owned** FK/Storage policy references, verify referential completeness and invariant state. Never rewrite MP/Robo source identities or assume an email string safely links identities.

**Privacy-field contract (DRAFT for B-01/privacy owner, not a column extraction command):** mandatory stable `id` / necessary account identifier and approved Google provider identity keys; include email/login flags and required creation/confirmation fields **only where validated by target Auth**. Minimal `public.profiles`: `id` plus only actually used Club display/avatar/nickname fields after consent and call-site check; no automatic full-table `SELECT *`. Review any `raw_app_meta_data` product/role claims before transfer; never use user-editable `raw_user_meta_data` for authorization. Do not copy source sessions, refresh tokens, JWT signing keys, API service keys, Vault material, obsolete recovery tokens, MP/Robo product data or provider secrets into Git/docs. Provider password hashes only with a separately audited necessity/compatibility ruling, not by default.

For BOTH: force safe Google/PKCE re-login with separately owned callback/issuer/allowed redirect validation; no session portability assumed. Test anonymous, unfinished DC-9, immutable first 9/9, pre-Application login, Applicant, Member, Dementor and Owner with direct Auth/RLS/RPC/Storage negatives. `AUTHENTICATION ≠ DC-9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`. All-account presence does NOT provide Club membership. No copy/export/DDL or personal identity list was performed in this audit.

### B2. Stage sequence and hard-stops
- B-01 Backend signs exact per-table five-class matrix and complete Club dependency closure (FK + source JS/RPC + row ownership + RLS/storage/worker), not Architect alone.
- Architect/DevOps confirms post-game VM headroom and isolated namespace under /srv/dementor without any MDAO/game default/legacy volume changes. Old 4-vCPU/7.6 GiB/43GB point-in-time snapshot is NOT a sizing PASS for Supabase full stack.
- Separate approved Club Auth + DB + Storage + API/Edge restore on isolated staging with encrypted off-VM backup custodian, actual restore evidence and counts/hashes/negative policies. Never replay all Cloud migrations into a shared service blindly.
- Follow Stage1 site HTTPS domain acceptance with Cloud unchanged, then independently gated Stage2 Club-only backend migration; no Cloud Auth/OAuth changes before new endpoint/actor tests, write freeze and rollback approval.
- STOP if either UNKNOWN_STOP object is wrongly included, account/UUID/provider and MP overlap cannot be independently separated in the new Club Auth, profile fields over-collected, private objects missing, SECURITY DEFINER behavior differs, worker double-sends, RLS negatives fail, resource reserve unproven or Live/MDAO affected.

**STATUS:** READ-ONLY CLUB DEPENDENCY MATRIX DELIVERED; implementation BLOCKED on B-01 identity/owner Decisions, independent QA, host capacity and approved Result/Gate. **PRODUCTION/CLOUD/MP/ROBO/LIVE/VM EFFECT: NONE.**

## Lead wave 9: **Public frontend hosting cutover PREP ONLY** (2026-10-17, ~17:18 UTC)

**New owner scope/sequence:** [#237 owner Stage 1→Stage 2 decision](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6237372766) and [Lead assignment #255](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6237292833). **Stage 1:** move the actual public frontend hostname `https://dementor.club` from GitHub Pages to existing Kirill VM; keep current Supabase Cloud Auth/RLS/Storage/Edge workers and all semantics. **Stage 2:** backend migration only after Stage 1 acceptance, with *separate* approved Result/Gate, backup/restore and QA. This is **scope/order approval, NOT permission for any production Nginx, certificate, DNS or host change**. Stage A private preview [Draft PR #258](https://github.com/SLADZARI/degradation_club/pull/258) is NOT a public release Gate and carries a recorded pre-Gate execution deviation. Existing architectural Draft PR #257 stays REFERENCE/DRAFT only. Parent #228 stable QA = NO-GO.

### W9-1. DNS / current public TLS: actual external read-only observations

**Collection source:** read-only shell `dig`, `curl -I`, and `openssl s_client` on connected Mac `Macbooks-MacBook-Pro.local`, UTC `2026-10-17T17:18:16Z` through ~17:19Z. This probes **the public domain only** (not the Kirill VM, its ports or credentials). Authoritative A/CNAME checks used `@ns75.domaincontrol.com`; nonauthoritative resolver results agreed. Public HTTPS HEAD succeeded, and certificate metadata was inspected without writing state.

| Property | Observed | Cutover / owner implication |
| --- | --- | --- |
| Current apex `dementor.club` A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, **authoritative TTL 600 seconds** | **GitHub Pages** IPv4 quartet; do not change until G7 approval |
| Current apex AAAA | **No AAAA answer** from resolver and authoritative NS at collection | Do **not** add VM AAAA until the VM IPv6 address, Nginx IPv6 TLS listener and firewall reachability are verified under host owner |
| Apex CNAME | None returned | Apex A is cutover record type; planned change below requires domain owner credentials (not held by this report) |
| `www.dementor.club` CNAME | `sladzari.github.io.`, **TTL 3600 seconds** at authoritative NS | Existing www route follows Pages today; separate explicit choice to keep Pages-managed www→apex redirect temporarily **or** migrate www TLS/redirect under separately approved config. Do not break this by removing Pages prematurely |
| Nameservers | `ns75.domaincontrol.com`, `ns76.domaincontrol.com` | DNS service appears DomainControl/GoDaddy nameservers; **registrar/account/editor/controller not yet established**. No DNS credentials used |
| Public apex response | `HTTP/2 200`, `server: GitHub.com`, `x-github-request-id` and `via: varnish` | Confirms GitHub is serving the public domain at test time, not VM |
| Public www response | `HTTP/2 301` → `https://dementor.club/` with GitHub.com server | Preserve canonical www→apex behavior when/if www changes hosts |
| Public apex certificate | Subject CN `dementor.club`; issuer **Let's Encrypt YR2**; validity `2026-08-29 08:38:58 UTC` → `2026-11-27 08:38:57 UTC` | **CURRENT PAGES certificate**, not proof of a certificate/key on the VM. A new or separately authorized **VM-readable valid** cert/chain must be prepared before any live cutover, with automated renewal owner documented |

**Host baseline already supplied, but not independently SSH-verified by Architect:** [#255 operator BEFORE snapshot at 15:33:37 UTC](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6235861662) proves *from submitted output* `/srv/dementor` root:root/0755; 75G disk / 43G available, 7.6 GiB RAM / 6.8 GiB available at one moment, 4 vCPU; nginx, docker, gitlab-runner active; `db-dev` on 32778. [Stage A private launch evidence](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6236459364) reports files at `/srv/dementor/stage-a/releases/cde332779ab0e256dd1e498660d6fa651e91846e` and `nobody` on `127.0.0.1:18080`, **NOT verified by current SSH session**. [Architect independent AFTER attempt](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6237112145) failed before login on an untrusted ED25519 host identity for this connected Mac. Do not override host-key checking or equate a different Mac's trust failure with server outage.

### W9-2. Historical pre-cert host gaps; see W9-6–W9-9 for current operator evidence

| Item | What is known | Exact read-only Kirill/operator evidence still needed |
| --- | --- | --- |
| Nginx 80/443 owner, default/wildcard overlap | Historical host nginx active; multiple protected MDAO vhosts | Dated redacted list of active vhost *symlink/file paths*, `server_name` **name-only map**, `listen` address:port summary and owner/controller, whether default/`dementor.club` name collision exists; don't publish private upstreams or full configs |
| Certificate management on VM | **UNKNOWN**. Public GitHub certificate ≠ VM certificate | TLS/ACME/Certbot or other renewal **mechanism and responsible host admin**, current public name ownership, allowed DNS-01 vs other authorized challenge method, prospective separate cert file **paths only after consent**, renewal/rollback owner. Never copy GH Pages private keys or assume certificate availability |
| Existing staging artifact/root | Operator reports exact immutable release directory and private Python listener | Dated `ls`/`stat` proof that `index.html` and required static files are **direct children of that path** (or identify correct `_site` subpath), actual uid/modes, `SHA256(index.html)`, no symlink escape; Nginx read rights and static root owner review |
| IPv6 / external ingress | VM IPv6 historically reported; exact host nginx dual-stack config not supplied | Kirill-approved IPv4+IPv6 listener/TLS/firewall and upstream/public-reachability plan; default no new AAAA until checked |
| Owner rights and protected services | MDAO /data, nginx, docker, runner, db-dev existing and protected | Kirill's explicit vhost file owner and approved *future* site-only change path; signed/sanitized BEFORE and AFTER service snapshot. **No edits** to current configs or `/data/*` |
| DNS registrar/account and TTL control | Authoritative DNS points to DomainControl/GoDaddy nameservers | Actual domain management account/DNS editor, ability to replace four apex A with approved VM IPv4, live TTL/rollback plan and propagation window owner |

**CHRONOLOGY / SUPERSESSION (2026-10-17):** The preceding table describes **gaps at the start of W9**, NOT today's state. W9-6/7 later established by **owner terminal evidence**: `nginx -t` PASS, `sites-enabled/*` active (default + graylog + monitoring + n8n; filtered map showed no Dementor vhost), site root/index and `www-data` read PASS. W9-8/9 **superseded 'no VM cert'**: with specific owner consent, a manual DNS-01 apex+www certificate was issued at `/etc/letsencrypt/live/dementor.club/{fullchain.pem,privkey.pem}`, and X.509 CN/SAN/validity verified, expiring 2027-01-15. Club owner **is** the GoDaddy DNS operator and added both TXT challenges. **Current state: CERT PRESENT / DEMENTOR NGINX TLS VHOST ABSENT / RENEWAL NOT AUTOMATIC / PUBLIC DNS STILL PAGES.** Timer alone does not renew this lineage. **2026-10-21 later W13:** static 468-file byte parity PASS after sorting-method reconciliation; client-trusted public VM SNI, full I1–I8, unattended renewal and release Gate still NOT VERIFIED.

### W9-3. Minimal **separate** virtual-host proposal (NOT A CONFIG DEPLOYED)

The following is a **literal candidate isolated site-only config proposal, not installed**. W9-6/7 owner evidence confirms `sites-enabled/*`, no observed conflicting named Dementor vhost, www-data index access and static root; W9-8/9 confirms actual apex+www certificate paths. **W14 CORRECTION:** use NEW `/etc/nginx/sites-available/zz-dementor.club.conf` and NEW symlink `/etc/nginx/sites-enabled/zz-dementor.club.conf` to preserve current n8n implicit 443 default for review in its **own approved frontend-hosting Result/G6/G7**. Reconfirm compiled Nginx `listen`/SNI/no-MDAO conflicts, IPv6, www redirect and exact rollback before any authorized file write or reload. **Do not edit existing MDAO/default files.**

```nginx
# PROPOSAL ONLY — NEVER paste onto VM until separate owner/Kirill G6/G7 authorization.
# New server block; no changes to default site or any MDAO vhost.
server {
    listen 443 ssl;
    # listen [::]:443 ssl;  # ONLY after approved host dual-stack and DNS AAAA plan
    server_name dementor.club;

    # Verify that index.html actually lives directly here; never point to /data.
    root /srv/dementor/stage-a/releases/cde332779ab0e256dd1e498660d6fa651e91846e;
    index index.html;

    # Owner-consented manual DNS-01 certificate, issued and X.509 SAN-verified W9-8/9.
    # Certificate renewal remains a separate RELEASE BLOCKER.
    ssl_certificate     /etc/letsencrypt/live/dementor.club/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dementor.club/privkey.pem;

    # Multi-page static build: /projects/, /workspace/board/, /join/, /auth/callback/.
    # No SPA catch-all to '/' (avoids accidental 200 for missing/private routes).
    location / {
        try_files $uri $uri/ =404;
    }

    # Dotfiles stay denied. This ALSO denies /.well-known/acme-challenge/ here.
    location ~ (^|/)\. {
        return 404;
    }

    # Site files are pinned to a SHA; do not set blanket immutable cache on HTML/JS.
}
# Proposed www TLS canonical redirect using SAME already-issued dual-SAN certificate.
server {
    listen 443 ssl;
    server_name www.dementor.club;
    ssl_certificate     /etc/letsencrypt/live/dementor.club/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dementor.club/privkey.pem;
    return 301 https://dementor.club$request_uri;
}
# New-site-only HTTP -> canonical HTTPS; no existing host vhost edits.
server {
    listen 80;
    server_name dementor.club www.dementor.club;
    # Use location-level redirect so a later specifically approved HTTP-01
    # challenge path can be added without server-level return precedence.
    # No HTTP-01 challenge carve-out is configured or assumed to work today.
    location / { return 301 https://dementor.club$request_uri; }
}
```

**This is STILL NOT release authorization / NOT INSTALLED:** cert paths are now literal per owner terminal evidence, but the existing manual DNS-01 certificate **WILL NOT auto-renew** under `certbot.timer` without an approved/demonstrated mechanism; SNI/client-trusted full chain on VM is NOT VERIFIED. **HTTP-01 is NOT VERIFIED and cannot succeed using the current HTTPS dotfile guard or the proposed port-80 redirect until a future separately approved and tested `location ^~ /.well-known/acme-challenge/` exception points to a confined challenge webroot on actual port 80, while other dotfiles remain denied.** No such exception exists in this proposal. If choosing DNS API/hooks instead, verify GoDaddy API eligibility and least-privilege credentials without posting tokens. Approve actual auto-renew ownership/recovery and test before G7. At exact-config approval review full Nginx name/listener map, root and `try_files` slash handling, private key Nginx access, external SNI/chain and MDAO no-interference; if an existing protected vhost must change, **STOP/Change Proposal**, not blind edits. Private Python preview is not public HTTPS.

**Routing checks for approved RC:** `/`, `/projects/`, `/workspace/`, `/workspace/board/`, `/join/`, `/join/apply/`, `/auth/callback/`, `/robots.txt`, `/sitemap.xml`, `/site-config.js`, `/assets/...` return correct 200/asset type; non-existent asset and forbidden dot path must return 404; trailing-slash/direct refresh and index behavior must match Pages. Validate mobile 360/390/414/430 and 1440, real share/canonical/OG/meta and relative paths; **existing** Board anonymous CTA and mobile H1 clipping remain documented P1 until independently fixed in their own approved Web/UI Result. Same-origin public HTTP→HTTPS/www redirects must not alter Auth callback, Supabase URL or API policies.

### W9-4. Non-authority cutover checklist + rollback (official Gates kept separate)

**Authority separation:** `CUT-00…CUT-07` below are **step IDs, not project Gates or PASS statuses**. Official `.weekly-os` control is **site-only approved Result → G6 independent validation → clean G7 RC → explicit Club owner and authorized host release approval → scoped deploy/DNS switch → live G8 QA**. `CUT-06` is not G8, and `CUT-07` is not an official rollback Gate. This document/PR is DRAFT, not permission for Nginx/DNS writes. W9-8 certificate-only issuance was a separate narrow owner-consented VM write already completed.

**Frozen input:** only `dementor-club-production@cde332779ab0e256dd1e498660d6fa651e91846e` and its already-built static artifact, without modified auth/media config. The existing `_site/CNAME=dementor.club` is Pages-origin metadata, **not** a DNS instruction or a new nginx CNAME handler. [Live current workflow](https://github.com/SLADZARI/degradation_club/blob/dementor-club-production/.github/workflows/deploy-pages.yml) builds using Node 22 and requires `release_confirmation=APPROVED`; it retains GitHub Pages until explicit release approval. Source `site-config.js` has canonicalOrigin `https://dementor.club` and the **same** Supabase Cloud endpoint with Google login/PKCE. The site-host move should not require a new OAuth redirect if canonical origin remains unchanged, but **callback/PKCE actual browser test is required**.

| Cutover step / order (NON-AUTHORITY) | Planned exact decision/test, NOT run now | Authority and rollback |
| --- | --- | --- |
| CUT-00 host/no-interference | Kirill supplies dated nginx MDAO vhost/listener/cert ownership inventory, correct static root/read ACLs, disk reserve and **BEFORE I1–I8**. Do not disturb MDAO. | Kirill/MDAO; no host mutation in #255 |
| CUT-01 certificate BEFORE DNS | **Already DONE with narrow owner consent:** manual DNS-01 apex+www cert on VM W9-8 and X.509 SAN/validity W9-9. **Still required:** owner-approved, actually testable unattended renewal and VM-hosted client-trusted HTTPS/SNI; the separate GitHub Pages certificate is not usable here | Kirill + DNS/cert owner, planned separate Gate; do not request issuance now |
| CUT-02 isolated exact RC | Once separately authorized, add **only** new server block and new site-specific enabling link (if host uses it), review literal diff and perform `nginx -t` then Kirill-approved reload. Before DNS change validate intended HTTPS via verified IP/SNI e.g. `curl --resolve dementor.club:443:<VM_IPV4> https://dementor.club/` for 200/redirect/route/asset/cert chain; validate no impact on existing MDAO. | Kirill + Club owner + Q-01; **all commands are future steps** |
| CUT-03 QA release delta | Anonymous/public: direct-refresh/routes/status/SEO/OG/canonical/mobile; with approved safe actor fixtures: Auth callback/PKCE/session, Guest/Applicant/Member/Dementor/Owner, CIRCLE/Storage RLS negatives; distinguish already-known P1 UX and #228 parent NO-GO. Do not mutate LIVE Cloud data to "test" staging. | Q-01 independent with Lead/owner disposition |
| CUT-04 explicit production approval | Exact site-specific Result/G6 and clean G7 RC, authorized config diff, cert+AAAA choice, restored fallback, owner+Kirill public-DNS/cutover approval. **PR #258 Stage A private proposal is NOT this Gate.** | Owner + Kirill + Lead, NOT authorized now |
| CUT-05 DNS transition | After approval, **replace apex four GitHub Pages A records** with approved VM IPv4 (`138.199.144.94` is historical host address; reverify immediately before use); authoritative TTL currently 600s. **Apex AAAA currently absent: do not invent it**. Decide www separately, preserving HTTPS `www→apex` or migrating it to owned VM vhost after its own cert plan. | Domain/DNS owner, record exact before/after values and time; no update now |
| CUT-06 live G8 | Verify DNS resolving VM, valid cert both chosen hostnames, HTTP redirect to HTTPS, content/Workspace/Board, same Cloud backend/auth/Storage, mobile/SEO/404, error logs **sanitized**, I1–I8 MDAO invariants, and runtime resource headroom; record accepted SHA/release time and owner signoff. | QA+DevOps+Lead+owner; only then RELEASED |
| CUT-07 rollback if fail | Domain owner restores **exact original GitHub Pages A quartet** at apex; original Pages custom domain and manual workflow must remain functional during window, no premature Pages decommission. Reverse only site-specific new nginx activation **by Kirill under approved plan**, keep MDAO untouched. Validate HTTPS after DNS propagation for both apex/www; DNS cache/TLL can delay reversion, require agreed write freeze/recovery window and monitor. | Kirill for host changes, DNS owner for records, owner/Lead for rollback decision |

**Important DNS TTL:** authoritative `600` seconds describes published record TTL, **not** a guaranteed global cutover time; recursive caching, resolvers and TLS/ACME propagation vary. `www` CNAME TTL is `3600` seconds, so plan www redirects deliberately. Do **not** remove Pages custom-domain mapping/credentials or publish a new AAAA before rollback viability is tested.

**STOP conditions:** any required edit to existing MDAO vhost/listeners, unexpected 80/443 conflict, no valid VM certificate/private key management, stale/incorrect static root, wrong production SHA, loss of existing Cloud callback/privacy behavior, missing DNS owner/IPv6 decision, absent repeatable Pages fallback, or independent QA negative failure → NO-GO; no production DNS switching.

### W9-5. Acceptance/evidence classification & next exact owner

**VERIFIED BY THIS AUTHOR (external only):** authoritative A/AAAA/CNAME/TTL/NS values above; GitHub Pages server HTTP 200 / www→apex 301 and live cert issuer/validity; exact GitHub source Pages workflow and `site-config.js`; previous operator-documented VM root/resources/private smoke and QA-declared limits from cited GitHub evidence.

**OPERATOR-REPORTED, not independently QA-executed:** direct owner SSH, Nginx active vhost/name map, `www-data` static index access, loopback preview, manual DNS-01 cert **PRESENT** with exact fullchain/key paths, owner X.509 SAN/validity and direct GoDaddy DNS control (W9-6–W9-9). Historical missing-certificate/DNS-controller statements in W9-1/2/6/7 are **SUPERSEDED** as of successful W9-8/9. **MISSING/NOT VERIFIED NOW:** installed and served Dementor Nginx SSL vhost; external CA-trusted HTTPS SNI on VM; unattended cert renewal; full 468-file static parity; protected I1–I8 AFTER snapshot; approved real-role Auth/PKCE/CIRCLE/Storage negatives, P1 owner disposition, exact RC/G6/G7/G8 and explicit public release permission.

**NEXT / Architect–DevOps:** send this same-PR proposed new-file-only vhost and exact C1/C2/supersession corrections to Q-01 for delta re-review; no further DNS operator, worker ACL or cert SAN checks. **NEXT / Lead/owner:** resolve existing canonical owner Result/G6/G7 for Stage1 before any Nginx write; separately approve exact vhost install/reload, tested pre-DNS SNI, renewal, safe role fixtures and fallback; only then seek explicit production DNS cutover approval. **EFFECT:** this doc update changes no host/public site; **W9-8 DID create owner-authorized certificate files** (do not claim zero VM changes across W9).

### W9-6. Actual owner-operated VM read-only Nginx and private preview verification (2026-10-17)

**NEW OPERATOR TERMINAL EVIDENCE after W9 plan; not independently run by A-01 or Q-01.** The Club owner, who operates the existing working Mac SSH session and controls domain DNS, executed one read-only batch with `nginx -t`, filtered `nginx -T`, directory listings, `ss`, `stat`, `sha256sum`, `ps` and certificate-manager checks. **No host, cert, DNS, Cloud or legacy write was performed by the batch.** This replaces previous repeated requests for Kirill to provide routine host facts. Owner's existing SSH key and DNS-management access are already working; do not ask for new accounts or keys.

| Checked item | Exact supplied observation | Verified extent / remaining proof |
| --- | --- | --- |
| Nginx baseline | `systemctl is-active nginx = active`; `nginx -t` syntax and configuration both **successful** | Current config valid; no revised Dementor vhost installed |
| Active includes | `nginx.conf` includes `/etc/nginx/conf.d/*.conf` and `/etc/nginx/sites-enabled/*`; `conf.d/` contains no files | Proves existing active include mechanism; no need to invent another config location |
| Existing named hosts | `/etc/nginx/sites-enabled/default`: port 80 default, `server_name _`; `graylog.conf`: `graylog.mdao.is` port 80; `monitoring.conf`: `monitoring.mdao.is` port 80; `n8n.conf`: `n8n.g155333.ru` on 80 and 443 SSL | **No `dementor.club` server_name appeared in filtered effective config.** Existing named blocks must remain unchanged; a new name-specific block looks possible but cannot prove new config/cert will work before test |
| Listener identity | `0.0.0.0:80` and `0.0.0.0:443` owned by Nginx; `[::]:80` by Nginx; `127.0.0.1:18080` Python3 PID `2772007`; no `[::]:443` line in supplied filtered output | Confirms loopback-only preview socket as of command, not full external VM security audit; **no new public IPv6/AAAA without additional checked HTTPS policy** |
| Certificate manager | `/usr/bin/certbot` exists; `/etc/letsencrypt/live` lists only `n8n.g155333.ru` | **No existing Dementor VM cert observed.** Site-only HTTPS still requires certificate issuance+renewal ownership and a valid chain before public switch; GitHub Pages certificate cannot be assumed reusable |
| Pinned site | `/srv/dementor/stage-a/releases/cde332779ab0e256dd1e498660d6fa651e91846e` exists root:root mode 0755; `index.html` is root:root mode 0644 | Correct direct index root exists; **ancestor traversal and Nginx worker read access should be verified using a bounded read-only test**. Do not equate one file hash with full build manifest |
| Observed site index SHA256 | `1f807b08e772ceae853cb7518f149b73024d5933de65f55af510003e4ffc0f30` | This is **VM file hash** supplied by operator. Do not claim byte-for-byte match to earlier local 468-file manifest until independently compared |
| Preview process | PID `2772007`, `nobody`, command `/usr/bin/python3 -m http.server 18080 --bind 127.0.0.1 --directory /srv/dementor/stage-a/releases/cde332779ab0e256dd1e498660d6fa651e91846e` | Stronger current operator evidence that preview is a scoped Python listener; not a public Nginx production deployment |

**W9 planning delta:** Formerly unknown `sites-enabled` include location, name collision risk and cert inventory are now materially narrowed by actual host output. The proposed **new-only** `dementor.club` Nginx vhost can target the existing verified `index.html` release root in a later approved exact diff; preserve all pre-existing MDAO vhosts. No automatic TLS method is yet selected: **do not run Certbot or alter challenge routing until a separate approved site-hosting Gate, certificate strategy and rollback are recorded**. If DNS-01 is chosen, the Club owner can operate DNS; issue+renewal credentials/process must still be decided without sharing secrets. If HTTP-01 is chosen, plan challenge routing and existing Page-directed DNS deliberately; do not expose an untested HTTPS site before certificate readiness. Existing dotfile deny in proposal may require a narrow `/.well-known/acme-challenge/` carve-out for HTTP-01, never a blanket dotfiles allow.

**Next bounded evidence (NO Kirill dependency for routine checks):** current operator may run a single read-only `namei -l` on the exact release root and `runuser -u www-data -- test -r <exact-index>` if the `user` directive confirms nginx worker `www-data`; capture the binary yes/no, no content. Review exact HTTPS issuance and renewal strategy, www redirect/dual hostname certificate, safe pre-DNS Host/SNI tests and QA release deltas. Owner controls DNS records; no reason to ask who edits GoDaddy again. No live `nginx reload`, Certbot issuance, DNS change, database/backend migration or production deploy authorized by this evidence.

**Evidence tier:** `OPERATOR_ON_HOST_READ_ONLY_OUTPUT` / `DRAFT_SITE_HOSTING_PLAN` — **not** independent I1–I8 PASS, public-auth/Cloud security PASS or a release Gate.

### W9-7. Nginx site-root traversal and certificate renew timer: owner-operated read-only PASS (2026-10-17)

**NEW OPERATOR TERMINAL EVIDENCE**, separate from DevOps independent SSH: Mac owner used the existing trusted SSH identity to execute `ps`, `namei -l`, `runuser` read-only `test -r`, and `systemctl list-timers` on the VM; no write/reload/deploy occurred.

| Target | Exact evidence | Verdict |
| --- | --- | --- |
| Nginx worker identity | `ps -eo user,args` shows two `www-data nginx: worker process` lines | **PASS** for observed worker user |
| Directory walk | `namei -l /srv/dementor/stage-a/releases/cde332779ab0e256dd1e498660d6fa651e91846e/index.html`: all ancestors root:root **drwxr-xr-x**; index root:root **-rw-r--r--** | **PASS** ancestor traversal at snapshot |
| Actual worker read access | `runuser -u "$WORKER" -- test -r "$SITE/index.html"` printed `PASS: Nginx worker can read the site` | **PASS** file readability, with actual worker identity; no need for `chown/chmod` |
| Certbot renewal timer | `certbot.timer` in `systemctl list-timers --all`, next scheduled run shown 2026-10-17 17:51:53 UTC | **PASS** renewal *scheduler is present*; **DOES NOT prove auto-renewability of a new manually DNS-validated certificate** |

**Narrowed next implementation boundary:** Frontend static-root path/worker read checks are now resolved as *operator evidence*; existing `nginx -t` baseline PASS, existing `certbot` installed, but **no `dementor.club` VM certificate has yet been observed or issued**. Do not repeat these owner terminal checks.

**TLS approach:** With apex A records still pointing to GitHub Pages, choose a pre-cutover domain authorization method:
- `DNS-01` via TXT record under **owner-operated GoDaddy DNS** can issue an apex+www cert while Pages remains live. `certbot certonly --manual --preferred-challenges dns -d dementor.club -d www.dementor.club` is a **proposed FUTURE command ONLY, not executed**, and manual validation does **not** get unattended renewal from `certbot.timer`. Either approve a vetted DNS API automation mechanism under a future Gate or transition renewal to validated HTTP-01/webroot after site cutover (port 80 routing/ACME/AAAA and www name checks).
- A valid cert + testable exact Nginx site-only config must precede any public DNS cutover; the chosen issuance/renewal plan, rollback, Stage-1 Result/G6/G7 and explicit owner release approval remain pending.
- Do not use `certbot --nginx` or live HTTP-01 challenge now by accident, as the domain is still on Pages and the host's existing MDAO Nginx sites must not be altered. Any cert file creation or Nginx reload is a VM mutation that requires scoped permission.

**No SSH/DNS controller question remains:** User is already the operator of existing Mac→VM SSH and editor of domain DNS; do not repeatedly request Kirill, additional keys or a second VM for this routine step. This evidence is **not** a full independent I1–I8 host baseline, authenticated Cloud/RLS/CIRCLE/Storage security PASS, or site-release approval.

### W9-8. Let's Encrypt apex+www manual DNS-01 issuance successful — owner terminal evidence (2026-10-17)

**NEW OWNER-OPERATED HOST CHANGE WITH EXPLICIT USER CONSENT:** Following the earlier successful read-only Nginx/file ACL tests, the Club owner explicitly requested issuance of a **free HTTPS certificate** and personally executed the existing VM's Certbot over their established Mac SSH. This is **a narrowly approved certificate-only VM write**, not approval to modify Nginx, site DNS A/AAAA/CNAME, Supabase Cloud or production hosting.

**Exact operator terminal outcome (not independently executed by Lead/Q-01):**
```text
certbot certonly --manual --preferred-challenges dns --cert-name dementor.club -d dementor.club -d www.dementor.club
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/dementor.club/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/dementor.club/privkey.pem
This certificate expires on 2027-01-15.
This certificate will not be renewed automatically.
```

**Validation provenance:** two separate TXT DNS-01 challenges for `_acme-challenge.dementor.club` and `_acme-challenge.www.dementor.club` were published by the owner in their existing GoDaddy DNS account and Certbot returned success. No challenge tokens copied into project ledger. The issuer's success message is operator evidence of issuance for the requested two domains; **certificate's SAN, chain, on-disk read permissions and precise clock validity were not independently parsed** in this GitHub update.

**Current completed/blocked boundaries:**
- **PASS (operator-reported):** free cert issued via DNS-01, `fullchain.pem` + `privkey.pem` stored on VM, expiry 2027-01-15. Certbot timer previously observed enabled.
- **NOT DONE:** certificate configured in an isolated `dementor.club` Nginx server block; `nginx -t` after any new vhost; independent pre-DNS SNI `curl --resolve` check; external DNS switch/public VM serving and live Auth/CIRCLE/Storage negative QA. **GitHub Pages remains current public origin until an actual controlled cutover.**
- **CRITICAL RENEWAL BLOCKER:** Certbot explicitly said **manual DNS certificate WILL NOT renew automatically** without a `--manual-auth-hook`. The previously observed `certbot.timer` cannot solve this. Before public site G7/GO, record an actually viable renewal policy (approved GoDaddy DNS API automation with scope/credential custody, or after site cutover replace the manual lineage with separately tested HTTP-01/webroot using an isolated ACME path and renewal simulation). Do not assume a GoDaddy API integration is available without verifying current account prerequisites. No HSTS/forced-HTTPS before a tested rollback.
- **NEXT SAFE READ-ONLY STEP:** with existing owner SSH, run `certbot certificates` plus `openssl x509 -in /etc/letsencrypt/live/dementor.club/fullchain.pem -noout -subject -dates -ext subjectAltName`. **Never print/copy `privkey.pem`**, challenge tokens, Cloud secrets or private vhost/upstream configuration.
- **NEXT SEPARATELY GATED IMPLEMENTATION:** prepare exact isolated `dementor.club` + optionally `www` static vhost to be validated with SNI `curl --resolve` before changing public DNS, and harden no-regression checks for protected legacy MDAO vhosts. No SSH/backend expansion or host-owner escalation is needed for routine steps when the Club owner is already the authorized VM and DNS operator.

**STATUS:** `CERT_ISSUED_OPERATOR_REPORTED / NGINX_SITE_NOT_INSTALLED / DNS_CUTOVER_NOT_AUTHORIZED / AUTO_RENEWAL_UNRESOLVED`.

### W9-9. Existing VM certificate X.509 SAN and validity verified — read-only owner evidence (2026-10-17)

**New actual owner terminal:** existing Mac→VM SSH ran read-only `openssl x509 -in /etc/letsencrypt/live/dementor.club/fullchain.pem -noout -subject -dates -ext subjectAltName`, no private key reading, no host mutation.

```text
subject=CN = dementor.club
notBefore=Oct 17 17:14:07 2026 GMT
notAfter=Jan 15 17:14:06 2027 GMT
X509v3 Subject Alternative Name:
    DNS:dementor.club, DNS:www.dementor.club
```

**PASS (observed operator evidence):** real X.509 certificate is readable on the VM at the expected `fullchain.pem` path, CN matches apex, explicit SAN includes both apex and `www`, and the certificate's stated validity window covers the issuance date and ends 2027-01-15 17:14:06 UTC. No more repetitive cert subject/SAN/expiry checks are necessary.

**NOT VERIFIED / next Gate:** chain validation against client's browser trust store, VM Nginx server-block binding, complete static pages/critical routes with `curl --resolve`, auth/Cloud positive-negative QA, and unchanged legacy vhosts after future config. `certbot.timer` remains **insufficient** for renewal of the confirmed manual DNS-01 lineage; need actually validated renewal path before release.

**Next unblocked work:** exact `dementor.club`-only Nginx config proposal scoped to `/srv/dementor/stage-a/releases/cde332779ab0e256dd1e498660d6fa651e91846e` and the now-verified `fullchain.pem` / `privkey.pem` paths; code/review it in existing Draft PR #257. Installation/reload and public DNS A/CNAME changes still depend on the appropriate scoped owner release authorization, G6/G7 controls, baseline #228 QA and rollback evidence. **Do not claim public VM HTTPS or Stage1 released.**

`STATUS: VM TLS SAN+WINDOW VERIFIED / NGINX TLS VHOST NOT INSTALLED / PUBLIC DNS STILL GITHUB PAGES / RENEWAL AUTOMATION PENDING`

## LEAD WAVE 2 — READ-ONLY STAGE A SAFETY & HOST INVENTORY (2026-10-17)

**Permission:** [Lead #255](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6235077290) and [owner prep direction #237](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6235076956) allow architecture/reporting and Kirill-authorized read-only snapshots ONLY. [Q-01](https://github.com/SLADZARI/degradation_club/issues/228#issuecomment-6235143113) explicitly says Stage A READ-ONLY PREP MAY PROCEED; public/authenticated VM staging and parent #228 stable-baseline remain NO-GO. No staging Result/Gate is approved; no VM write is authorized.

**K4 status supersedes historical alarm:** [Lead correction](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6235026856) explicitly records operator's "всё нормально с этим портом — выяснил." Current status: **OWNER/OPERATOR-REPORTED RESOLVED**, no independent network/TLS/ACL audit. Preserve earlier Docker bind and Kirill external-access statement as HISTORICAL, but do not maintain active escalation/blocker or interrogate Kirill again without new evidence.

**Portal-only fixed candidate:** production cde332779ab0e256dd1e498660d6fa651e91846e; Node 22, node scripts/build-pages.mjs → _site/; static preview confined to loopback/private ingress after a separate Gate, port selection TBD by Kirill based on observed occupancy; Supabase Cloud Auth/DB/Storage configuration unchanged; no game runtime bundled. [Dev1 #256 clarification](https://github.com/SLADZARI/degradation_club/issues/256#issuecomment-6235146633): PASS applies to *disposable local BQA-23 Supabase backend*, NOT a reusable Club/game Compose. [Dev2 source contract](https://github.com/SLADZARI/degradation_club/issues/256#issuecomment-6235077783) confirms portal static artifact. No shared Compose dependency is evidenced, and no new Compose is authorized.

### W2-A. Non-mutating Kirill host/MDAO inventory

| Surface | Current evidence and owner | Exact dated, sanitized Kirill snapshot required | Status |
| --- | --- | --- | --- |
| Existing nginx virtual hosts / 80+443 / TLS certificates | MDAO vhosts and public listener historical in #237, Kirill/MDAO owner | Enabled vhost **file paths only**, vhost/certificate/renewal **owner map**, listener addresses/ports; no full configurations, private keys or secrets | NOT VERIFIED CURRENT |
| systemd baseline: nginx, gitlab-runner, docker | Reported running in older snapshot; Kirill owns host | active/enabled **status**, unit names and owner only; no full unit files, runner tokens or secret logs | NOT VERIFIED CURRENT |
| db-dev legacy PostgreSQL | Historic name, PostgreSQL 16 and published 32778; MDAO owns DB | Container ID prefix, image tag/status, published port and **mount/network ownership classification**; never query DB or disclose credentials | HISTORICAL; K4 OWNER-REPORTED RESOLVED |
| Existing port occupancy and Docker namespaces | Ports 80/443/32778 historical; port collision risk unknown | Redacted IP:port listeners, docker network and volume **names/owners only**; select an unused future loopback address+port with Kirill, not a guessed reservation | NOT VERIFIED |
| VM disk/RAM/CPU and runner pressure | Kirill verbally reports ~40 GB free DISK; old inventory 4 vCPU/7.6 GiB | Date+filesystem capacity/inodes, memory pressure, CPU and 24–72h peaks, existing runner demand; confirm owner minimum free-space reserve | OWNER DISK ESTIMATE / MEASUREMENTS PENDING |
| /srv/dementor path and SSH identity | Kirill says path exists and separate account possible | Direct dated path existence + owner/mode/ACL and approved non-root identity/key-grant **scope**; exclude /data, sudo, docker group/socket | OWNER REPORTED / DIRECT PROOF PENDING |
| Backup and rollback custody | Existing backup whereabouts unknown; Kirill says new off-VM backups feasible | Explicit custodian, independently hosted encrypted target/failure domain, owner retention, key custody, restore-test ownership and authorization | NOT VERIFIED |

**Read-only diagnostic template for Kirill, not executed by Architect:** date -Is; ls -ld /srv /srv/dementor; stat -c '%n %U %G %a' /srv/dementor (if present); df -hT; df -i; free -h; nproc; systemctl is-active nginx gitlab-runner docker; systemctl is-enabled nginx gitlab-runner docker; ss -lnt; docker ps --format (name, image, status, port only); docker network ls (names only); list symbolic-link **paths** under /etc/nginx/sites-enabled (no config contents). If command permissions are denied, mark NOT VERIFIED rather than elevate privileges. Kirill must sanitize hostnames, network identifiers, users, protected mount details and anything sensitive; do not attach full nginx configs, docker inspect Env, logs with private data, credentials, tokens or keys. No commands run on VM by this author.

### W2-B. BEFORE / AFTER no-interference and scoped rollback matrix (future Gate, NOT executed)

| Invariant / owner | BEFORE mandatory evidence | Future permissible bounded delta (only after owner/Result/Gate) | AFTER PASS criterion / STOP | Rollback owner and boundary |
| --- | --- | --- | --- | --- |
| I1 /data/** (Kirill/MDAO) | Protected path/mount ownership metadata | **NONE** | No changes to ownership, mounts or contents | Kirill owns any anomaly; Club never cleans/moves legacy data |
| I2 nginx/MDAO vhosts and 80/443/certs (Kirill) | Vhost/listener/cert owner inventory + service health | **NONE for loopback static Stage A** | Service health and config/listeners identical | No Club reload or cert/dns edit; Kirill investigates drift |
| I3 db-dev:32778, MDAO Docker networks/volumes (MDAO/Kirill) | Container ID/status/image/ports and mount/network classification | **NONE** | Container, ports, networks/volumes and legacy consumers unchanged | No stop/rebind/prune/restart of legacy; Kirill owner only |
| I4 GitLab Runner/systemd (Kirill) | Active state, runner consumption | **NONE** | Runner/process baseline unchanged, future overhead within cap | Stop only approved Dementor-owned workload |
| I5 localhost/private binding & host resource reserve (Kirill) | Measured port occupancy, memory, CPU, disk and minimum agreed free space | Dedicated non-root staging listener **127.0.0.1/TBD unused port** only; no 0.0.0.0 public port | No new public listener or collision, reserve preserved | Stop **named** Dementor staging listener only |
| I6 /srv/dementor (Kirill+Club) | Dated existence/ACL/owner and original contents | Only explicitly approved dedicated staging subpath and immutable artifact; no unapproved mkdir/chown/chmod | Whitelisted exact new resources, manifest SHA and access ownership | Remove/revert ONLY enumerated staging-owned additions with Kirill-approved deletion rules |
| I7 GitHub Pages+Supabase Cloud (Club/Q-01) | Production exact SHA and Cloud endpoint/auth callback/Storage/RLS owners | **NONE**; private mirror is not release | Public release/Auth/DNS/DB/worker unchanged; unauthorised authenticated staging = STOP | Existing Pages+Cloud never switched; rollback local static mirror only |
| I8 staging recoverability (Club backup custodian) | Fixed SHA/source artifact and approved off-VM custodian | Versioned static artifact/config recovery only; no Cloud DB export | Private clean rebuild/restore of exact static asset tree demonstrated | Revert only staging manifest; full self-hosted DB is separate Gate |

**Future rollback recipe, only after a reviewed Gate:** freeze Dementor staging-only changes → stop its *named isolated* listener/process → restore last immutable staging artifact/config only if path and deletion manifest approved → compare I1–I8 current state with saved BEFORE snapshot → if MDAO/shared drift appears, STOP and ask Kirill. Never use generic Docker prune, unscoped compose down, blind rm, Nginx reload, firewall mutations, DNS/OAuth changes or /data modifications. No real rollback has occurred.

### W2-C. Exact outstanding decisions and acceptance

- **Kirill K1/K2:** confirm path owner/ACL with dated redacted proof; name grant recipient and least-privilege read/SSH scopes. No grant already assumed.
- **Kirill K3:** approve owner map of existing Nginx/certs and a future private/loopback port chosen from an actual listener list, not a port invented in documentation.
- **Kirill K5/K6:** identify external independent backup custodian and restore rehearsal responsibility; measure disk/inodes/RAM/CPU under legacy workloads and define free-space reserve. ~40 GB verbal disk figure is not a measured capacity PASS.
- **Dev1/Dev2 #256:** static exact-SHA source→Node 22 build→_site/→localhost-only direct-refresh/asset/390/360 smoke with PASS/FAIL and no secrets. Disposable BQA-23 Docker PASS is unrelated, not a reusable portal staging PASS.
- **QA #228 and Lead:** authenticated Guest/Applicant/Member/Dementor/Owner, private CIRCLE/Storage and OAuth-return negative results before ANY public or authenticated VM staging. Parent QA NO-GO; owner-approved bounded Result/Gate, before/after snapshots and rollback PASS required before implementation.

**Current verdict:** READ-ONLY PLAN DOCUMENTED. ACTUAL KIRILL-SIGNED INVENTORY / HOST ACL/PORT / BACKUP RESTORE / REAL STAGING: **NOT VERIFIED**, with K4 resolved by owner report not a security audit PASS. No implementation, VM access, SSH grant, backup job, merge or production effect.

## Kirill's replies relayed by operator — 2026-10-17, ~15:46 Europe/Warsaw

**Evidence tier: OWNER/OPERATOR-REPORTED, not independently validated by SSH or signed diagnostics.** The user forwarded short answers attributed to Kirill. Statements of feasibility are **not** permission to make host, legacy or production changes.

| K ID | Kirill response (relayed by user) | Status, exact next evidence |
| --- | --- | --- |
| **K1: /srv/dementor** | Exists | **OWNER-REPORTED EXISTS; ON-HOST NOT VERIFIED**. Prior `ls -ld` did not establish it; need dated `ls -ld /srv/dementor` plus owner/ACL. Do not create or chmod |
| **K4: db-dev port 32778** | Earlier Kirill: accessible; later operator to Lead: issue clarified and okay | **OWNER-REPORTED RESOLVED / NOT independently security-audited / NOT ACTIVE MIGRATION BLOCKER** |
| **K2: separate non-root SSH** | Yes | **FEASIBLE IN PRINCIPLE**. No actual Unix account, key, login or grant demonstrated, no production authorization |
| **K3: separate Nginx staging** | Possible | **FEASIBLE IN PRINCIPLE**. No vhost, certificate, DNS, public ingress or reload authorization |
| **K5: backups** | Existing location unknown; can organize | **BACKUP EXISTENCE/LOCATION AND RESTORE NOT VERIFIED**. Off-VM encrypted backup destination, custody, retention and test remain to be selected/approved |
| **K6: available capacity** | 40 gigabytes | **~40 GB FREE DISK REPORTED** based on question context; NOT 40 GB RAM. No dated `df -h`, memory or CPU pressure evidence |

**Historical 32778 request superseded:** Later operator clarification to Lead says the port question is okay ([#255 Lead correction](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6235026856)). Record **OWNER-REPORTED RESOLVED / NOT VERIFIED BY INDEPENDENT SECURITY AUDIT**. No renewed demand, scans, firewall/Docker changes, legacy DB queries, or claim of compromise under this issue; preserve old note as provenance only.

**Approval boundaries unchanged:** #228 stable parent remains NO-GO, #237 migration BACKLOG/DEFERRED, Draft #257 documentation only. Kirill's Yes on SSH/Nginx is an acknowledgement of feasibility, not staging authorization. Backups are not ready without a successful isolated off-VM restore.

## Lead + Q-01 review reconciliation — 2026-10-17

- [Lead review in #255](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6234150832) and [Q-01 independent review of PR #257](https://github.com/SLADZARI/degradation_club/pull/257#issuecomment-6234226553) accepted this **as a planning DRAFT only**, **not** host-ready, architecture APPROVED, migration-GO or release approval. Their factual corrections are applied in this revision.
- **Namespace evidence:** prior `ls -ld` did not establish `/srv/dementor`; Kirill **now reports it exists**, but on-host existence/ACLs remain **NOT INDEPENDENTLY VERIFIED** until a new dated command. See sections 2 and 6A/K1.
- **Historical K4 report and latest decision:** earlier Kirill-reported external access was not independently tested; [later owner clarification](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6235026856) states the matter was resolved. **OWNER-REPORTED RESOLVED**, not security audit PASS, and no longer an active staging blocker. No repeated escalation absent new evidence.
- **Latest independently reported production identity:** [#228 Q-01 report](https://github.com/SLADZARI/degradation_club/issues/228#issuecomment-6234059093) confirms branch HEAD + Pages #138 + Supabase #9 on `cde332779ab0e256dd1e498660d6fa651e91846e`; parent **#228 remains NO-GO** for full behavioral/role acceptance.
- **Dev2 #256 source handoff received:** [inventory](https://github.com/SLADZARI/degradation_club/issues/256#issuecomment-6234046431) distinguishes static Club portal from *unverified* Battle, Robo and Lab runtimes. It does not authorize new routes, containers, hosting or merge. Dev1 exact Compose/clean-run evidence still missing.
- **Approval checklist added** in section 6A for Kirill/MDAO/Club owner and sanitized evidence; zero host/VM writes or production effects.

## 1. Sources, confidence and authority

| Source | What it establishes | Limitation |
| --- | --- | --- |
| [#255 task](https://github.com/SLADZARI/degradation_club/issues/255) + [Lead correction](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6234150832) | Scope and read-only permission; 17 Oct operator-evidence *summary*; corrects mistaken `/srv/dementor` existence claim | Raw current command logs / signed operator snapshot are **not attached** here |
| [#237 migration backlog](https://github.com/SLADZARI/degradation_club/issues/237) | 22 Sep inventory, current→proposed topology, Supabase Cloud migration risks, protected host paths, proposed migration sequence | Host details are historical **reported observations**, not independently remeasured today |
| [PROJECT.json](https://github.com/SLADZARI/degradation_club/blob/dementor-club/.weekly-os/PROJECT.json) → [ARTIFACT_INDEX.json](https://github.com/SLADZARI/degradation_club/blob/dementor-club/.weekly-os/ARTIFACT_INDEX.json) → [APPROVED_STATE.json](https://github.com/SLADZARI/degradation_club/blob/dementor-club/.weekly-os/APPROVED_STATE.json) | Kernel/authority and implementation separation | No approved migration Result or architectural semantic promotion is established by this document |
| [Production deployment contract](https://github.com/SLADZARI/degradation_club/blob/dementor-club-production/docs/deployment.md), [actual Pages workflow](https://github.com/SLADZARI/degradation_club/blob/dementor-club-production/.github/workflows/deploy-pages.yml), [release policy](https://github.com/SLADZARI/degradation_club/blob/dementor-club/operations/PRODUCTION_RELEASE_POLICY_V1.md) | Current public site must use the production branch and explicitly dispatched/manual Pages release | Git HEAD/PR success is **not** current live deploy proof; Q-01 checks that in #228 |
| [23 Sep technical baseline](https://github.com/SLADZARI/degradation_club/blob/dementor-club/operations/STABILIZATION_TECHNICAL_BASELINE_2026-09-23.md) + [17 Oct independent QA #228](https://github.com/SLADZARI/degradation_club/issues/228#issuecomment-6234059093) | Earlier technical stabilization and later exact live SHA evidence; full #228 remains **NO-GO** | Not proof of current authenticated role/behavioral acceptance |
| [24 Sep historical migration replay blocker](https://github.com/SLADZARI/degradation_club/blob/dementor-club/operations/ARTIFACT_COLLABORATION_BACKEND_G5_MIGRATION_HISTORY_REPLAY_BLOCKER_2026-09-24.md) and [25 Sep local workaround evidence](https://github.com/SLADZARI/degradation_club/blob/dementor-club/operations/ARTIFACT_COLLABORATION_BACKEND_G5_RUNTIME_2026-09-25.md) | Clean replay once failed on missing legacy EDU pre-state; later **local** backend G5 passed using tracked prehistory fixture and observed-production compatibility overlay | The overlay is validation-only; local PASS is **not** production database restore/transfer proof |
| [#256 Dev2](https://github.com/SLADZARI/degradation_club/issues/256#issuecomment-6234046431), [#237 Lead handoff](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6234151938) | Dev2 **source inventory delivered**, Dev1 local Docker evidence pending | No successful clean-run game builds/ports/resource profiles confirmed |
| [PR #252](https://github.com/SLADZARI/degradation_club/pull/252), [PR #254](https://github.com/SLADZARI/degradation_club/pull/254) | Separate Owner Admin runtime Draft and team-protocol Draft | Neither is approved migration authority nor a deploy event |

**Evidence classification:** “REPORTED” below = facts recorded in GitHub, not direct SSH/host inspection by this author. “PROPOSAL” = not implemented. “UNKNOWN” = requires an authorized operator, exact tests and dated evidence. No SSH/VM commands, backups or external scans were executed for #255. **Correction after Lead/Q-01 review:** prior operator output did NOT establish that `/srv/dementor` exists; its actual presence/ACLs remain **NOT VERIFIED**. The path in all target diagrams is a proposal, not an observed directory.

## 2. Current-state boundary map (not the future topology)

```text
ACTIVE PUBLIC SITE / MANAGED BACKEND            EXISTING SHARED VM (not a Dementor deployment)
dementor.club                                      138.199.144.94 (+ IPv6; reported)
  └─ GitHub Pages                                 ├─ nginx :80/:443, existing MDAO vhosts
       └─ production manual workflow              │   n8n.g155333.ru / graylog.mdao.is /
                                                 │   monitoring.mdao.is
Browser / Workspace / Board                      ├─ Docker legacy db-dev: Postgres 16
  └─ Supabase Cloud (current)                    │    0.0.0.0:32778 -> 5432
       Auth/Google OAuth, DB/RLS/RPC, Storage,    │    bind: /data/project-dev/pgdata
       Edge Function telegram-outbox-worker       ├─ GitLab Runner (reported running)
                                                 ├─ /data/project, /data/project-dev,
                                                 │  /data/graylog, /data/monitoring,
                                                 │  /data/n8n = LEGACY, PROTECTED
                                                 └─ /srv/dementor = REPORTED EXISTS;
                                                    existence/ACL NOT VERIFIED;
                                                    no staging deployment verified
GitHub = source and CI, not proof of deployed VM applications.
```

| Asset / responsibility | Reported state | Owner / protection | What is NOT verified |
| --- | --- | --- | --- |
| VM OS / compute | Ubuntu 24.04.1 LTS; 4 vCPU; 7.6 GiB RAM; IPv4 `138.199.144.94`, IPv6 present | Kirill / Gabil host approval | 17 Oct `uname`, CPU/RAM pressure, provider quotas, uptime, host network ACLs |
| Root filesystem | ~75 GB ext4 historical; Sep ~43 GB free; **Kirill now reports ~40 GB free disk** without `df` evidence | Kirill | Dated `df -hT`, inodes, growth rate and reserve |
| Host software | Docker 27.4.1; nginx and GitLab Runner active (historical inventory) | Kirill and each legacy service owner | Versions, security patches, runner executor isolation, running jobs |
| Legacy Docker | `db-dev` PostgreSQL 16, host binding 32778, volume under `/data/project-dev/pgdata`; **Kirill reports external access to this port** | MDAO / Kirill; no Architect changes authorized | Exact external ACL/IPv4/IPv6 source scope, authentication/TLS/logs, current consumers and container state |
| Existing web | nginx 80/443, MDAO vhosts; **Kirill reports separate staging feasible in principle** | Kirill/MDAO | Vhost/cert ownership, approved private ingress, no changes configured |
| Existing `/data/*` | Protected historical MDAO data; Docker data ~23 GB, Prometheus volume ~8.7 GB | Kirill / MDAO; **do not mount, delete, prune or back up without grant** | Exact sizes, data sensitivity, backup owner, retention, restoration history |
| Dementor namespace | **OWNER-REPORTED EXISTS** by Kirill through user; prior `ls -ld` did not establish it; **on-host existence/ACL still NOT VERIFIED** | Kirill to provide proof/owner/ACL, no creation/permissions change under this audit | Dated `ls -ld /srv/dementor`, UID/GID/ACL/quotas/contents |
| Current public deployment | Q-01 #228 independently reports production branch + latest successful Pages **#138** and Supabase **#9** at `cde332779ab0e256dd1e498660d6fa651e91846e`; GitHub Pages + managed Supabase Cloud | Club release owner / provider | Full authenticated behavioral acceptance **NO-GO**; independent Pages asset-to-tree hash and today’s browser-role retest not proven by this audit |
| Current Cloud data | Auth, Google identities/sessions, RLS, Storage and Edge Function per #237 | Club backend owner / Supabase | 17 Oct real schema fingerprint, total DB bytes, object byte totals, residency/backup schedule |

**Current port status:** Historic Docker bind and earlier Kirill relay are retained, but the [later explicit owner clarification](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6235026856) says the issue was checked and is okay. **OWNER-REPORTED RESOLVED**, independent security-control audit not performed; **NOT active staging prep blocker**.

## 3. Target separation: staged, gated proposal (NOT implemented)

```text
NOW:  GitHub Pages + Supabase Cloud → remain as-is

AFTER #228 + explicit owner approval + Result/Gate, Stage A:
  GitHub approved exact SHA → isolated site staging in /srv/dementor/staging
                           → local-only binding/private access first
                           → same current Supabase Cloud endpoint (no DB move)
  Existing nginx/MDAO vhosts, /data/*, legacy Docker remain untouched.
  Any new nginx vhost/cert/DNS/Cloud OAuth redirect still needs separate approval.

LATER, separately gated Stage B:
  isolated self-hosted Supabase QA stack + sanitized/authorized copy/restore
  → auth/RLS/storage/worker parity → disaster recovery drill
  → release candidate + explicit owner cutover/rollback authorization
  → only then consider public production routing.
```

**Namespace proposal** (must not be created or modified by this audit):

```text
/srv/dementor/
  staging/               # Stage A site, independent release/asset directory
  production/            # reserved; NO deployment authorized
  compose/               # separate Compose project files after Dev1/Dev2 contracts
  local-backups/          # short-lived encrypted staging restore artifacts only
```

Specific isolation controls **required for a future Gate**, not configured now:

- Dedicated non-root host identity `dementor` with narrowly scoped SSH access and dedicated deploy key; no root login, no reuse of Kirill/MDAO keys; note that membership in `docker` group is effectively host-root privilege and requires a separate security grant.
- Distinct Docker Compose **project name**, prefixed networks/volumes and container names; no `network_mode: host`, shared default network, `/data` bind mounts or unchecked published ports. Record precise existing names with Kirill first; avoid hidden collisions.
- Stage A: render static portal from exact source SHA when Dev2 confirms runtime; never assume all games need containers or share auth. Use loopback-only bind/SSH tunnel or another Kirill-approved private ingress; do not expose a publicly reachable staging endpoint by default.
- A later nginx integration must be confined to *new*, approved config/vhost; no editing existing MDAO server blocks, cert owners, port 80/443 listeners or default route. Host-level reload and certificate issuance are independent operator-controlled actions.
- No direct public database port for a future self-hosted database. Segregate DB from edge networks; app/API ingress only as explicitly approved and tested.
- Store secrets outside Git and build artifacts; use least-privilege one-purpose credentials, secret rotation and documented recovery grants. No real credentials, identity records, pg_dump contents or private config may enter PR/logs.
- Preserve GitHub Actions role as build/CI evidence; propose exact-SHA, reviewed, manually approved deploy with minimal SSH/runtime rights *only after* Result/approval. No automatic deployment on push/merge.
- Before allowing authenticated staging against current Cloud, review the auth redirect allow-list, Google OAuth owner and data protection. **Do not** change Cloud Auth/OAuth to accommodate test staging within #255. If full authentication is unavailable, mark authenticated QA **BLOCKED** rather than bypassing it.

Stage A rollback concept (only after approval): restore prior staged artifact/config in **Dementor-owned namespace**, verify private staging, and leave Pages+Cloud unaffected. Stage B cutover rollback is **not** a blind DNS flip: it needs write-freeze, transaction/Storage delta handling, session re-login behavior, DNS TTL/callback/config reversal order, and reconciliation of any post-cutover writes; the owner must approve the recovery window.

## 4. Capacity and headroom — observed vs planning estimate

| Resource | 22 Sep observed/reported | **Planning only**; validation needed |
| --- | --- | --- |
| CPU | 4 vCPU | Static site small; GitLab Runner/legacy workloads can burst. Capture 24–72h CPU/IO/runner schedule before additional always-on stacks |
| RAM | 7.6 GiB total; ~6.9 GiB available **at one snapshot**; no swap | Static staging can be budgeted at ~0.1–0.5 GiB incremental **hypothesis**. Full self-hosted Supabase+workers+games may need several GiB more; no co-location capacity approval without load profiles |
| Disk | Historical ~43 GB free; **~40 GB free disk reported by Kirill 17 Oct**, not independently measured; historical Docker data ~23 GB | Hypothetical Stage A incremental: static assets 1–3 GB + cache 2–5 GB + logs 1–2 GB = **4–10 GB**, unverified |
| Free space after Stage A estimate | Starting point **~40 GB reported free disk**, no raw `df` | If actually 40 GB and Stage A consumes 4–10 GB, **~30–36 GB** might remain; proposed reserve ≥20 GB, validate before any approval |
| Local backup | **Kirill does not know existing backup location**, but says independent backup can be organized | No usable backup is confirmed; require separately approved encrypted off-VM target and an actual isolated restore test |
| Full DB/Storage | no measured 17 Oct DB bytes or daily growth | **Unknown**: do not promise that full self-hosted Supabase, production data, staging+prod, logs and local backups all fit concurrently |

The #237 statement “VM sufficient for V1” is a **working capacity hypothesis**, not a benchmark or authorization. One-time `free` output is not peak RSS; a root disk with dozens of GB of existing Docker data has log/image/WAL growth and runner churn. Stage A can be evaluated first; Stage B must have per-service CPU/RAM/disk/I/O envelopes, real load test, free-space alarms and a restore-time trial. No swap exists in the recorded snapshot; ask Kirill whether to plan a separately approved swap/limits strategy, not to configure it now. **No latest capacity measurement exists in this audit**, and all RAM/disk facts above refer to the earlier inventory.

## 5. Security/risk register (non-mutating)

| Risk / severity | Evidence and uncertainty | Consequence | Proposed mitigation and evidence test | Owner / required authorization |
| --- | --- | --- | --- | --- |
| R1. Legacy Postgres :32778 — **OWNER-REPORTED RESOLVED (historical item)** | Historic bind, earlier external-access statement; later [Lead resolved correction](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6235026856), no independent audit | If new contrary evidence arises, legacy DB risk belongs to Kirill/MDAO | No renewed escalation or probing solely on old statement; any remediation is legacy owner-authorized | Kirill/MDAO; **not active #237 blocker** |
| R2. Overlapping nginx listeners/vhosts/certs — **HIGH** | Current MDAO nginx 80/443; new domains only hypothetical | 502/route hijack, TLS failure, legacy outage | Complete vhost/upstream/cert mapping before change; dedicated new vhost and conflict/rollback tests | Kirill + MDAO and Club owner; later Gate |
| R3. `/data/*` and legacy volume exposure — **HIGH** | Protected in #237, legacy DB and 8.7 GB Prom volume | Data loss, privacy breach, unplanned downtime | Path ACL matrix, explicit forbid-mount list, independent volumes/networks, no prune/cleanup | Kirill/MDAO approval mandatory |
| R4. Port/network/runner privilege crossover — **HIGH** | GitLab Runner and Docker already installed; current runner executor/config unknown | CI or staging app may gain host/legacy access | Inventory runner/executor, Docker socket mounts, networks, users and deploy key grants; separate deploy identity | Kirill + CI owner |
| R5. Insufficient capacity / no swap — **MED/HIGH** | Historical RAM 7.6 GiB, **Kirill reports ~40 GB free disk without measurement**, shared legacy services | OOM, disk exhaustion, interrupted legacy operations/backup | Measure 24–72h peak memory/IO, disk growth, inodes; future per-stack resource limits and reserve alarm | Kirill + Architect/DevOps after authorized sizing |
| R6. Partial DB/Auth/RLS/Storage restore — **HIGH** | Current Cloud includes auth identities, sessions, RLS, Storage, worker; historical schema replay drift | Data loss, broken login, leaked private media, permission drift | Exact current production structural diff; restore `auth`/`public`, roles, grants, RLS, functions, buckets **and actual object bytes**; negative access tests and isolated restore | Backend owner + Q-01 + Club owner, separate DB Gate |
| R7. No proven off-host restore — **HIGH** | No actual off-VM backup destination, encryption/retention or restore proof supplied; existence of usable backups itself **NOT VERIFIED** | Unrecoverable host/disk failure | Encrypted, versioned, separate failure-domain backups; documented key escrow; timed isolated restore from new VM; checksums | Club owner + Kirill/backups custodian + security approval |
| R8. OAuth/callback and session continuity — **HIGH at cutover** | Current Google→Supabase Cloud callback, PKCE and clients; target differs | Login lockout, orphan callbacks, incorrect session migration assumptions | Preflight allowed URLs/callback ownership, test first-login and logout; assume re-login at cutover and stage rollback | Auth owner + Google client owner + Club release owner |
| R9. DNS/dual-write rollback — **HIGH at cutover** | Pages+Cloud live; no write-freeze/delta plan | Split-brain, user edits lost on reversal | Approved downtime/RPO, final DB+Storage sync, freeze, cutover/return test, downstream worker catch-up and delta reconciliation | Club owner + Backend + Ops, explicit production Gate |
| R10. Uncontrolled staging access or CI logs — **MED/HIGH** | No authorized staging ingress or secret handoff yet | Test content/data leak, credentials in repository | Private-only staging until approved; protected environment, redacted logs, test accounts/nonprod data, secret inventory **names only** | Kirill + Club owner + security |

This is a non-invasive architectural threat review, **not** an external penetration test. Kirill has **reported** that public DB port access is possible; independent reachability proof is not recorded, and no incident, exploitation or data leak is asserted.

## 6. Access-and-approval matrix (no grants requested by this report)

| Principal | Proposed minimum future permission | Approver / prerequisites | Prohibited now |
| --- | --- | --- | --- |
| **A-01 Architect** | GitHub issue/read-only docs and host redacted inventory **if** explicitly granted | Lead; Kirill for host snapshots | Any host config/write, changing approved meaning |
| **I-01 DevOps** | For a later Gate: access restricted to `/srv/dementor` + protected deployment action, no host Docker root unless formally reviewed | Kirill host admin + Club owner; key lifecycle and audit | nginx reload, firewall, Docker mutation or prod deployment |
| **X-01 Kirill** | Existing host administrator; supplies inventory, confirms MDAO ownership, decides safe exposure/backup boundaries | Kirill and affected legacy service owner jointly for changes | Implicit delegation of MDAO permissions to Club |
| **Dev1** | Local Docker sandbox and build/test report with env **names** only | Existing Dev1 authorization / Lead | VM deployment, secrets, modifying other Result files |
| **Dev2 #256** | Repo/launch inventory for each game and portal | Game/source owners + Lead | New shared game registry, route/auth edits, Docker compose writes |
| **Q-01 QA/Security** | Redacted read-only findings and later isolated test access | Lead + data owner; no production credentials in Issues | Mutating real production accounts/records for this audit |
| **Club release owner** | Approves Result/Gate, published domain/callback, data migration plan and cutover | Explicit owner decision + baseline evidence | Treating this report/PR as authorization |
| **Backup custodian** | Future off-VM encrypted backup write and **isolated restore** read, separately scoped key access | Kirill + data owner + compliance/security | Storing backup secrets in GitHub, relying solely on same-VM copies |

Required explicit decisions for Kirill + owner: (D1) host/legacy owner map and resource budget; (D2) 32778 inquiry **owner-reported resolved, not active**; (D3) namespace/UID/SSH/deploy credentials; (D4) staging private ingress/vhost/certificate ownership; (D5) independent encrypted backup custodian and restore; (D6) runner isolation and Docker privilege; (D7) rollback decision-maker. Neither feasibility nor silence authorizes implementation.

## 6A. Kirill decision checklist — ready for explicit approvals (NO grants/change yet)

**Use this short form in #255 or via the authorized host-owner communication path.** Each question needs an explicit **YES / NO / UNKNOWN** plus owner and dated redacted evidence. “YES” means *approval to plan or collect specified evidence* unless a later Result/Gate separately authorizes a concrete mutation. Kirill/MDAO and the Club release owner remain separate authorities.

| ID | Ask Kirill / legacy owner | Required nonsecret proof | Approval / safe boundary | 17 Oct status |
| --- | --- | --- | --- | --- |
| **K1 — namespace** | Kirill reports `/srv/dementor` exists. Confirm exact owner and rights | Dated `ls -ld /srv/dementor`, redacted UID/GID/ACL/quota; no mkdir | Kirill grants after actual evidence and later Gate | **YES REPORTED / EVIDENCE PENDING** |
| **K2 — SSH & identity** | Kirill says scoped SSH user is possible; who will receive read-only access? | Unix non-root account/SSH source and grant matrix, **names only** | Kirill+Club owner; no root/sudo/Docker socket or /data by default | **FEASIBILITY YES / GRANTS PENDING** |
| **K3 — ingress & nginx** | Kirill confirms staging vhost feasible | Redacted vhost/cert owners and private/loopback access proposal | Kirill+MDAO/Club approve separately; no vhost/cert/DNS/reload now | **FEASIBILITY YES / CONFIG PENDING** |
| **K4 — Postgres port** | Earlier Kirill accessibility report; later owner/operator says situation okay | Retain historical snapshot, no further check requested absent new evidence | MDAO security owner retains control; this audit not a security PASS | **OWNER-REPORTED RESOLVED / NO ACTIVE ACTION** |
| **K5 — backup/restore** | Kirill does not know existing backup location; can organize new backups | Determine actual existing backup owner and independent off-host encrypted target; timed isolated restore proof | Kirill+Club data custodian approve, no backup/export now | **FEASIBILITY YES / EXISTING BACKUPS UNKNOWN** |
| **K6 — capacity & runners** | Kirill reports **~40 GB free disk**, RAM/CPU still unknown | Dated `df -hT`, `free -h`, inodes, 24–72h peaks, runner/docker isolation (no secrets) | Kirill + MDAO runner owner; no resource reservations | **DISK ESTIMATE REPORTED / RESOURCE PROOF PENDING** |
| **K7 — rollback authority** | Who may stop only a future Dementor staging release and restore its exact artifact, without touching MDAO? Who can approve a later cloud/DB cutover reversal? | Names/roles, emergency contact escalation, separate rollback approval and no-overlap path/volume plan | Kirill + Club release/DB owner; production DNS/OAuth rollback requires **new explicit Gate** | **AWAITING DECISION** |

**Kirill's operator-relayed answers are preliminary evidence, not implementation permission.** K1 needs dated path/ACL proof; do not create or modify it. K4 is now owner-reported resolved under the latest Lead direction; no repeat escalation without new evidence or unilateral Docker/firewall changes. A backup is not “ready” until a restored **off-host** copy passes tests on a clean isolated environment. Any authorized diagnostic outputs must be sanitized to exclude credentials, tokens, personal/legacy data and private addresses.

## 7. Backup and restore design for later approval

**Before staging deployment**, have Kirill establish the *existing* MDAO backup owner and avoid backing up or modifying protected `/data/*` by Dementor processes. For initial **static-only Stage A**, recoverability can come from immutable Git commit/build manifest + off-VM config record + any explicitly authorized new assets. Supabase Cloud remains the actual database provider; do not quietly create production exports for staging.

**For separately approved Stage B self-hosted migration**, propose:

1. **Scope inventory:** actual latest production database schema/tables, `auth` identities, sessions/PKCE expectations, RPC, RLS/grants/triggers, migration history vs live drift; Storage bucket policies **plus actual object bytes**, Edge Function/worker config and scheduling; list secrets by *name*, not value.
2. **Backups:** encrypted database base/full backups + PITR/WAL strategy if infrastructure supports it, separate Storage object-and-metadata backups, versioned release manifests, config/secret escrow and reproducible deployment contract. Never assume SQL dump alone backs up objects or that replaying migrations reconstructs live state. Provider Cloud snapshots are not yet proven restorable into local self-host.
3. **Destination:** at least one off-VM failure domain under a named custodian and access policy. Local copies are only short-lived convenience, **not** the disaster-recovery source. Backup write key cannot delete old backups if immutable/object-lock is available; separate restore credentials and MFA where supported.
4. **Schedule/retention proposal for owner decision:** daily encrypted full snapshot + incremental/WAL/PITR where available; weekly off-VM integrity check, monthly restore drill, retained daily 7 / weekly 4 / monthly 3 *as initial proposal*, adjusted for storage cost, legal requirements and data volume. No schedule is deployed.
5. **Recovery objectives proposed, not promised:** target initial `RPO ≤24 h` for low-volume assets and `RTO ≤8 h` for rehearsal; if contribution/member state cannot tolerate 24 h loss, require WAL/PITR and negotiate stricter RPO before approval. Timed restore evidence must validate or revise both numbers.
6. **Restore proof on disposable isolated host:** provision a clean VM without legacy MDAO mounts → checkout an exact verified release SHA → restore encrypted DB and all Storage bytes/metadata → restore permitted secret/config from custodian → run app/services privately → test guest/applicant/member/Dementor/owner positive+negative RLS/Auth/Storage, critical routes, callback/return, DC-9 baseline, Application, Membership, Board, share/relation and worker → measure restoration time and compare object counts/checksums & schema fingerprint → document final PASS/FAIL. If tests require realistic private data, obtain owner/data-controller authorization and isolate/redact the test system.
7. **Cutover rollback:** keep Cloud available for a separately approved window; agree write-freeze and state delta reconciliation. Do not simply redirect DNS to a stale Cloud DB after users have written to self-host.

Minimum **acceptance evidence**: timestamped inventory and exact source SHA; encryption/retention proof and off-VM storage location class (no secrets); controlled backup job id+checksum+success; from-scratch restore logs, test matrix and observed RTO/RPO; negative RLS and private media access; approved rollback responsibility; owner and QA sign-off. **No backup job or restore test has been run in this Issue.**

## 8. Read-only verification pack for Kirill (operator-executed only)

For a future authorized diagnostic session, request **redacted output** of:

- `date -Is`, OS/kernel, `nproc`, `free -h`, `df -hT`, `df -i`, `lsblk`, bounded `du` for specified authorized paths; 24–72h peak RAM, CPU, IO, Docker and runner usage.
- `ss -lntup`, exact bind/listeners, nginx vhost/upstream name map (redact private upstreams and keys), IPv4 **and IPv6** exposure, provider/network firewall status, `ufw status` and nftables/iptables policy (redact sensitive endpoints).
- `docker ps --format` with image/name/status/ports/mounts (selective inspect fields; **do not** dump `docker inspect` full `Env` or credentials), Docker networks and volumes, legacy container restart/backup owners and known service dependencies.
- `systemctl is-active nginx`, `systemctl is-active gitlab-runner`; runner executor/security model (no runner tokens). Key and account **grants**, not credential material.
- Existing backup schedule/provider/retention & date of *last successful restore*, exact owner/contact, resource alarms, authorized /srv ACL details.
- For historical 32778: **OWNER-REPORTED RESOLVED**; no new probing or escalation without new evidence or express legacy owner request. Ordinary read-only host inventory may record nonsecret listening-port metadata.

Submit sanitized evidence links/checksum plus capture date and operator attribution to #255 or linked owner request. Do not run actions that write state, restart services, disclose secrets or touch protected data.

## 9. Dependencies, handoff, and STOP/GO

```text
NOW (parallel read-only)      #255 architecture report
                           + #256 Dev2 portal/game launch manifest
                           + Dev1 local-only Compose/build/health evidence
                           + Q-01 #228 current production/live QA reconciliation
                           + #227 BA/UX separate product-gap evidence
                                     |
                               Lead review of collisions/owners
                                     |
                      #228 stable accepted + OWNER migration approval
                                     |
                       dedicated #237 Result/Gate and one integration branch
                                     |
                           staging site with Cloud (Stage A)
                                     |
                         separately approved DB/Storage/Auth Gate (Stage B)
                                     |
                   QA + backup/restore + exact release candidate + approval
                                     |
                        owner-controlled production cutover + live G8
```

**Dev2 #256 source inventory received:** [Dev2 report](https://github.com/SLADZARI/degradation_club/issues/256#issuecomment-6234046431) is **read-only source evidence, not reproducible runtime PASS**. Its independently owned project status impacts stage layout as follows:

| Project | Source evidence (Dev2's checked ref) | Architect interpretation for staging | Pending evidence/owner |
| --- | --- | --- | --- |
| Club Portal | `SLADZARI/degradation_club:dementor-club-production@cde332779ab0e256dd1e498660d6fa651e91846e`; `node scripts/build-pages.mjs` builds `_site/` | **First Stage A candidate = static-only isolated preview with Cloud unchanged**, no new server process architecture assumed | Dev1 clean checkout/build, exact local loopback preview and no secret exposure; Q-01 auth/route acceptance; owner approval to deploy |
| Dementor Battle | `SLADZARI/Dementor-Battle:main@1a4b8cda802dc3fa3b8e8996a73a1fe47fe57de2`; browser candidate is **unmerged**; canonical tactical bundle cannot be fully reconstructed from clean repo | **Do not reserve a production game container or publish route now** | Battle owner source recovery, dependency pin/licensing, exact clean-game smoke and Gate |
| Robo Games | `SLADZARI/dementor_robo_games:main@945a207e80946c7cd2b6e3e6045a3513deb44dd1`; assets exist but no main executable web build | **Runtime shape unknown; not deployable** | Robo owner accepted executable contract/M3 Result, reproducible smoke and integration authority |
| DEMENTOR LAB | `SLADZARI/dementor_lab:main@de9caa0535556ceff46979bdd3acd61ea082a05e`; browser static source, reported current CI FAIL; hosting/Git deployment mismatch | **Static-hostable in principle, not proven released or clean-run PASS** | Lab owner resolves CI, hosting ownership, local browser smoke and Gate |

These are project-owner handoff facts, **not an additional Architect claim to own game runtime**. Landing pages under Club `/projects/...` are not evidence of public playable game deployment; no universal registry, shared auth/DB, game routing or cross-repo code change is approved. Resource budget for games cannot be measured from the source list. Dev1 should consume a nonsecret per-project manifest, not amend independent game engines.

**Dev1 deliverable requested via #237, no parallel file edits:** `repo/ref/full SHA`, OS/architecture, exact `compose` file path(s) and Compose project/net/volume names, build and run/stop commands, health endpoints and test PASS/FAIL, exposed ports, dependency/env variable **names only**, read-only persistent-volume mapping, startup resource observation, reproducible teardown scope, known blockers. Architect will *consume* that manifest, not edit Dev1-owned compose/VM code.

**Dev2 #256 deliverable:** the source inventory is **RECEIVED** (see table above). Next, coordinate with Dev1/owning game repositories on the precise **interface-only manifest** `source owner | repo | SHA | entry route | build/run | env names only | static/service/unknown | auth/data/storage | assets | ports | resource observations | smoke tests | status`, and record clean-checkout results under authorized game Gates. Architect consumes the contract, not changes to Dev1 Compose or game runtime.

**Q-01 #228:** [independent QA handoff](https://github.com/SLADZARI/degradation_club/issues/228#issuecomment-6234059093) identifies exact production branch/live Pages #138/Supabase #9 at **`cde332779ab0e256dd1e498660d6fa651e91846e`**. **Parent #228 is explicitly NO-GO** for accepted stable baseline: real unassisted BQA-01–06/08/09, authenticated negative role/RLS and owner Gate acceptance remain open. This audit does not overrule Q-01 or treat child technical G8 as parent acceptance.

**Lead:** do not mark this Draft PR merged/approved as migration authorization; decide D1–D7 with Kirill and owner. Keep #237 deferred until #228 acceptance, inventory, and explicit Result/Gate. PR #252 Owner Admin Community Ops and #254 team protocol are separate Draft tracks and must not silently enter migration.

## 10. Acceptance and report

| #255 acceptance | Evidence delivered here | Verdict |
| --- | --- | --- |
| Current state with provenance and unknowns | Sections 1–2 | **DOCUMENTED; physical host not independently verified** |
| Isolated non-colliding staging proposal | Section 3 | **DESIGNED ONLY; no runtime change** |
| External backup + restore-test criteria | Section 7 | **DESIGNED ONLY; zero restore tests** |
| Security risk, grants and Kirill approvals | Sections 5–6A + relayed Kirill responses | **FEASIBILITY ANSWERS RECEIVED; port risk and host permissions/evidence remain open** |
| Dependencies and blockers | Section 9 | **DOCUMENTED; #237 still deferred** |
| Traceable handoff | This report / #255 comment / Draft PR | **READY FOR LEAD REVIEW** |

**STATUS:** #255 read-only planning deliverable ready for review; **not DONE/VALIDATED** as infrastructure or release. Parent #237 = BACKLOG/DEFERRED.  
**CHECKED:** #255/#237/#228/#256; kernel metadata; current Pages policy/workflow; historical Supabase replay+corrective evidence; PR #252/#254 separation.  
**CHANGED:** this **documentation-only Draft PR** and Issue handoff only; no code/runtime/host/data changes.  
**VERIFIED:** GitHub-listed boundaries, source policy, current task permissions and prior dated evidence as *recorded*.  
**NOT VERIFIED:** raw `ls -ld`/ACL proof despite reported `/srv/dementor` existence; external port-32778 ACL/source scope/TLS/auth despite Kirill's reported external accessibility; `df/free` proof for ~40 GB disk and RAM/CPU; actual SSH grants; existing backup location or off-VM restore; Dev1 Docker/game startup, authenticated #228 acceptance. Q-01 production SHA evidence remains valid; parent #228 NO-GO.  
**BLOCKERS:** Current host path/ACL/port occupancy/CPU/RAM/disk snapshot, scoped non-root grant and Nginx owner, off-VM backup/recovery custodian, portal local build/smoke, #228 security-hard-stop fixtures and dedicated #237 approved Result/Gate. K4 owner-reported resolved, not active blocker.  
**NEXT:** Kirill supplies scoped sanitized K1/K2/K3/K5/K6 MDAO inventory and ownership reply; Lead/QA reviews W2 before/after and rollback plan for future gated Stage A. #228 NO-GO, #237 actual implementation deferred; no VM mutation or deploy.  
**PRODUCTION EFFECT:** **NONE**.
