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
