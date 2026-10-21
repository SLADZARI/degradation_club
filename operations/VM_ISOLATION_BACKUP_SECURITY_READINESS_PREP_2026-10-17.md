---
artifactId: dementor-club.report.vm-isolation-backup-security-readiness-prep-2026-10-17
project: dementor-club
documentType: REPORT
projectStage: PLANNING
status: DRAFT
version: "0.1"
updated: "2026-10-17"
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

**Verdict: PREP REPORT / LEAD-ACCEPTED AS DRAFT PLANNING INPUT; INFRASTRUCTURE UNVERIFIED.**  
**Production effect: NONE.** This report is not a Decision, Result, Gate, host approval or deploy authorization. It proposes no immediate change to existing services. Parent [#237](https://github.com/SLADZARI/degradation_club/issues/237) remains **BACKLOG/DEFERRED**; [#228](https://github.com/SLADZARI/degradation_club/issues/228) does not yet provide an accepted current stable migration baseline.

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

**CHRONOLOGY / SUPERSESSION (2026-10-17):** The preceding table describes **gaps at the start of W9**, NOT today's state. W9-6/7 later established by **owner terminal evidence**: `nginx -t` PASS, `sites-enabled/*` active (default + graylog + monitoring + n8n; filtered map showed no Dementor vhost), site root/index and `www-data` read PASS. W9-8/9 **superseded 'no VM cert'**: with specific owner consent, a manual DNS-01 apex+www certificate was issued at `/etc/letsencrypt/live/dementor.club/{fullchain.pem,privkey.pem}`, and X.509 CN/SAN/validity verified, expiring 2027-01-15. Club owner **is** the GoDaddy DNS operator and added both TXT challenges. **Current state: CERT PRESENT / DEMENTOR NGINX TLS VHOST ABSENT / RENEWAL NOT AUTOMATIC / PUBLIC DNS STILL PAGES.** Timer alone does not renew this lineage. No independent client-trusted SNI, full static manifest, I1–I8 or release Gate pass.

### W9-3. Minimal **separate** virtual-host proposal (NOT A CONFIG DEPLOYED)

The following is a **literal candidate isolated site-only config proposal, not installed**. W9-6/7 owner evidence confirms `sites-enabled/*`, no observed conflicting named Dementor vhost, www-data index access and static root; W9-8/9 confirms actual apex+www certificate paths. Proposed new file `/etc/nginx/sites-available/dementor.club.conf`, proposed only-new symlink `/etc/nginx/sites-enabled/dementor.club.conf` for review in its **own approved frontend-hosting Result/G6/G7**. Reconfirm compiled Nginx `listen`/SNI/no-MDAO conflicts, IPv6, www redirect and exact rollback before any authorized file write or reload. **Do not edit existing MDAO/default files.**

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
