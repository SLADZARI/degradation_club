# Dementor Live · Mac operator release / read-only attestation (OPS-01)

Status: **DRAFT operator procedure, NOT a production GO** · 2026-10-20

These tools live in the source-runtime [OPS PR #300](https://github.com/SLADZARI/degradation_club/pull/300), remain independent of the frozen RC4 game build, and must not be confused with production proof. The release helper now has **two deliberately pinned profiles**: historical `resident-recovery` (default, exact `a38a03e68fcec5ceac45c0c362436ee6d69d5c5d`) and explicitly selected **`h0-v3`** (exact `6d09e9828a549b6ce64a354c5f7bf0a29717a700`, includes six required CI runs). It is never a generic "latest" deploy.

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

## H0-specific profile · 21 October 2026

The owner-approved **H0 technical scope** is the new-only JSON manifest and save-preserving saved-resident parent. The H0 profile is **opt-in**, not the default, and it is not an authorization to publish.

```bash
# Operator Mac, reviewed OPS checkout, read-only VM audit only:
bash deploy/mac-production-audit.sh

# Separately: off-VM private backup restore from existing backup with
# independently checked candidate checkout, never export the save:
DEMENTOR_CANDIDATE_RUNTIME="/private/path/to/checked-out/rc4-h0/runtime" \
DEMENTOR_CANDIDATE_SHA="6d09e9828a549b6ce64a354c5f7bf0a29717a700" \
bash deploy/mac-private-backup-restore.sh
```

Only **after** all six exact-SHA CI runs conclude SUCCESS, the private off-VM restoration, two real clients and physical iPhone G6 have passed, and owner issues the **separate 40-character G7 GO** together with a no-players maintenance window, the authorized operator may use the H0 profile:

```bash
DEMENTOR_RELEASE_PROFILE=h0-v3 \
DEMENTOR_GO_SHA="6d09e9828a549b6ce64a354c5f7bf0a29717a700" \
DEMENTOR_NO_PLAYERS_GO=yes \
bash deploy/mac-safe-release.sh
```

Without both GO variables, the helper must stop before VM filesystem or Docker writes. An already-deployed exact image+receipt exits read-only. The H0 candidate's protected publisher keeps rollback armed until the **running HTTP manifest** parses as JSON with exactly 42 records; if that validation fails, the publisher restores the previous game image AND frozen game world volume. Production `0.5.0-rc.4` string alone is **not** image identity. Keep this section updated with exact QA SHA if any source commit changes; never use stale run IDs.

**Status at preparation:** CI jobs may still be pending; no VM SSH, real backup copy, restore or G7 GO executed by this document.

## 5. Gate / completion

A green Bash syntax CI only certifies shell validity and static safety checks, **not** VM attestation, backup restore, asset SHA verification, two-player G6, or G7 acceptance. Preserve immutable source + workflow run URLs, operator redacted output and a 3-2-1/off-VM restore-on-copy proof. Lead signs manual GO; G8 after the actual deployed image/rollback evidence, not after a Draft PR.


## 6. Owner-authorized private off-VM backup restore (DEC-REL-01; not G7 GO)

Only from an **already authorized Mac** with an out-of-band verified game-VM
SSH host fingerprint in its known_hosts. The Mac must have Node 22+, Python 3,
and enough **private local** disk space. Nothing is extracted or modified on the
game VM; no Docker build, service restart, live save write or deploy occurs.

Use the reviewed OPS source branch; pin the exact candidate build SHA (OPS
checkout may differ from the intended H0 candidate, so distinguish those in the
Result). Example, when the operator already has that candidate as a clean,
immutable **local Mac checkout**:

```bash
DEMENTOR_CANDIDATE_RUNTIME="/private/path/to/checked-out/game/runtime" \
DEMENTOR_CANDIDATE_SHA="<exact-40-character-candidate-SHA>" \
bash deploy/mac-private-backup-restore.sh
```

The helper performs **two** strict-host-verified, one-key read-only SSH
connections: snapshot metadata and private streaming of only the selected
pre-existing full-world archive and adjacent world.json. They arrive in a new
0700 directory under the operator's Mac home, never in GitHub or chat. SHA-256
must match server-side file hashes. A hardened local Python extractor rejects
tar traversal, links, special files, duplicate paths and extraction beyond
disk/size quotas. Local `upgrade-audit.mjs` then tests the chosen candidate
on the restored copy, and two **independent fresh Node processes** rehydrate it,
checking saved CharacterId/token (comparisons only, never output), PAPER,
properties, resources, transactions, preserved receipts and requestId replay.

Optional explicit `DEMENTOR_BACKUP_ID=safe-...` chooses a particular existing
snapshot; otherwise the latest complete-looking `safe-*` pair is selected,
without claiming it corresponds to the live running image. If disk is too
small, corrupt/incomplete data appears, game upgrade fails, or a Mac/key is
offline, the script **stops without VM writes** and removes any incomplete
private local transfer. Default max archive transfer size is 16 GiB and
can be adjusted locally only after confirming spare space.

The resulting `RESULT.txt` and private QA logs stay only on the operator Mac.
The off-VM Mac extraction and cold Node-load are **not** a running production
container restart or live mobile validation. An archive pair being present
is not the same as successful restore. Any upload must contain **only
redacted aggregate results**, NEVER the archive/world/token/IDs. The owner
Decision [DEC-REL-01](https://github.com/SLADZARI/dementor_live/blob/audit/rc4-production-inventory-20261020/docs/decisions/DEC_RELEASE_H0_AUDIT_F1_SEQUENCE.v1.0.md)
authorizes this rehearsal, but **no release application (G7 GO)**.

Synthetic-only CI: `python3 -m unittest discover -s test -p 'test_qa_restore_extract.py'`
and `node --test test/qa-private-restore.test.mjs`; these test the tool,
not a real production backup.
