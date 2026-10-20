# Dementor Live · Mac operator release / read-only attestation (OPS-01)

Status: **DRAFT operator procedure, NOT a production GO** · 2026-10-20

These tools live in the source-runtime [OPS PR #300](https://github.com/SLADZARI/degradation_club/pull/300), remain independent of the frozen RC4 game build, and must not be confused with production proof. The current release helper is pinned to the **saved-resident hotfix** `a38a03e68fcec5ceac45c0c362436ee6d69d5c5d`. It is not a generic "latest" deploy.

## 1. Host authentication before any command

- Mac operator must already have the **verified** server host key (fingerprint checked out-of-band via their hosting console) in `~/.ssh/known_hosts`. Both helpers use `StrictHostKeyChecking=yes`, a single `BatchMode`/public-key/IdentitiesOnly SSH attempt, and fail closed on a changed/unknown host. Never blindly accept new host keys or upload/private-copy the SSH key into Git.
- The existing SSH identity path is `${DEMENTOR_SSH_KEY:-$HOME/Downloads/dementor_server}`; helper only verifies that the key exists/readable and does not chmod it.
- On an offline Mac or missing key/host verification, report `NOT VERIFIED`; do not guess credentials or retry using unrelated keys.

## 2. Read-only production attestation (operator only, with existing authorized VM access)

From the existing, checked-out OPS branch at `projects/dementor-live/runtime`:

```bash
bash deploy/mac-production-audit.sh
```

It reads exactly one running **game** container's image ID, start time, tags and reported digests; game container CPU/RAM/Net I/O **one-shot**; host CPU count, memory available, load and /srv storage; VM-local health; most recent release receipt and presence/size/hash of backup world; and aggregate/hashes of game world JSON **in memory**. It does **not** emit secrets, tokens, player names, game log contents, raw saves, real environment values or Nginx config. It does not stop/restart anything or access unrelated Club/MP/Robo services.

**Evidence distinctions:** a release-manifest `approved_sha` is **SOURCE-REPORTED** and becomes **IMAGE-ATTESTED** only if its exact `dementor-live:sha-<sha>` tag's image ID matches the live game container ID. A Docker `RepoDigests: []` value is **NOT VERIFIED** as an external registry digest. Nonempty backup files + `world.json` SHA prove *file presence and hash only*, not tar integrity or successful recovery. `archive_restore_on_copy=NOT_RUN` requires separate isolation.

### Minimum privacy-safe Result fields
Record timestamp/timezone, source Git URL + script SHA, command exit code, running image ID or explicit unknown, container startedAt, version from VM-loopback health, receipt SHA / tag equality, backup archive bytes / world SHA (no path with user identifiers), host available RAM/disk, Docker limits and one-shot CPU/RAM/net. Do not attach raw SSH/NGINX, env, disk image, entire world file, names, tokens, player messages or secrets to public Issues/PRs.

## 3. Release helper: no VM write without exact owner GO

```bash
# Read-only if already running exact pinned image and valid receipt.
# Otherwise fails closed before mkdir/git clone/docker run/build unless:
DEMENTOR_GO_SHA=<OWNER_APPROVED_FULL_40_CHAR_SHA> \
DEMENTOR_NO_PLAYERS_GO=yes \
bash deploy/mac-safe-release.sh
```

The owner/operator must provide a **separate, explicit SHA-specific G7 GO** and validate a player-free maintenance window, physical iPhone and two real independent player journeys, backup-copy restoration and exact-head CI. The code does **not** infer permission from this example. Do not run the release helper from automation or opportunistic console sessions. It calls `publish-preserve-world.sh --dry-run` and then `--apply` only after approvals, and uses rollback-protected game-only publishing. `--reset-world`, `down -v`, production QA `/__test`, overwriting the current world, speculative Ctrl-C/reset or touching Club/MP/Robo are forbidden.

## 4. Staging/QA isolation before load testing

Do not deploy a QA shard into the current production container or world volume. Prefer a separate staging VM; until hardware and CPU/RAM/disk parity are measured, reserve **no definitive concurrency figure**. Distinct Docker project, private test URL/port, disposable volume and credentials, bounded memory/CPU/PIDs, private logs, and a kill/expiry procedure must be approved under [QA-PANEL-01 #32](https://github.com/SLADZARI/dementor_live/issues/32) G3 and [PERF-01 #8](https://github.com/SLADZARI/dementor_live/issues/8). No load against public production IP.

## 5. Gate / completion

A green Bash syntax CI only certifies shell validity and static safety checks, **not** VM attestation, backup restore, asset SHA verification, two-player G6, or G7 acceptance. Preserve immutable source + workflow run URLs, operator redacted output and a 3-2-1/off-VM restore-on-copy proof. Lead signs manual GO; G8 after the actual deployed image/rollback evidence, not after a Draft PR.
