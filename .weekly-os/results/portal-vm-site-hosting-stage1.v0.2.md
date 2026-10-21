---
artifactId: dementor-club.result.portal-vm-site-hosting-stage1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G4_PASS
status: APPROVED
workStatus: WAITING
version: 0.2
supersedes: 0.1
updated: 2026-10-21
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 237
ownerG4Decision: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6320105037
g4Status: PASS_LIMITED_ISOLATED_CODE_ONLY
integrationBranch: null
integrationBaseRef: dementor-club-production
integrationBaseCommit: cde332779ab0e256dd1e498660d6fa651e91846e
productionBaseCommit: cde332779ab0e256dd1e498660d6fa651e91846e
implementationStartAuthorized: true
schemaChangeImplementationAuthorized: false
liveDatabaseMutationAuthorized: false
liveHostMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
changeControlRequired: true
---

# Dementor Club VM site-only Stage1 · G4 APPROVED / WAITING

The owner approved LIMITED isolated code/QA implementation for Stage1 in [#237](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6320105037); this supersedes the earlier [Draft proposal v0.1 / PR #309](https://github.com/SLADZARI/degradation_club/pull/309) as current authority. **No VM installation/reload, Nginx/DNS/Certbot, OAuth, Cloud/backend data or production approval** follows from G4 alone.

**Scope IN:** current public Club site, Workspace, Board, Join/DC9/Application shell, Public Header and static routes, existing Cloud Supabase Auth/PKCE/RLS/Storage unchanged. Exact pinned static snapshot `cde332779ab0e256dd1e498660d6fa651e91846e`: private VM Stage A has 468/468 identical files and 17,425,725 bytes; two historical manifest digests differed by row-sort order only. GitHub remains CI/source; GitHub Pages is rollback. Stage2 standalone Club Auth+DB/RPC/RLS/Storage/worker with account copying is EXCLUDED, same Cloud MP/Robo users untouched; separate Result after Stage1 live G8. No new Club→Live auth integration.

**Serial dependency:** `dementor-club.result.pre-vm-webui-gate-correctives-v1` active G5 must finish existing anonymous Board login P1, mobile H1 P1 and composer keyboard/modal defect under its own G4/G6. This Stage1 is APPROVED but WAITING with no active integration branch. After Web/UI acceptance/clean G7 candidate, activate exactly one site-only integration branch with current frozen source SHA/manifest (re-hash if UI bytes changed).

**Allowed while WAITING:** static site-only Nginx proposal review, isolated mocked vhost fixture, read-only host/DNS/TLS status, build and route QA planning. DevOps Draft #257 new-only `zz-dementor.club.conf` loads after existing n8n implicit 443 default; DO NOT replace/alter any existing MDAO/game IP/default/SSE vhosts, `/data/*`, `db-dev`, containers, Certbot or backups. Separate Kirill+owner host mutation approval is required before Nginx config install/reload. Real DNS-01 dry-run *does mutate DNS* and requires separate authorization. Existing dual-SAN certificate to Jan 2027 and timer/hook presence do NOT prove unattended renewal. Both `dementor.club` apex and `www` (currently GitHub Pages CNAME with IPv6) require independent pre-DNS SNI and approved simultaneous cutover/rollback.

**Acceptance**: #228 independent Auth/RLS/Storage role/CIRCLE/PKCE negatives on owner-consented isolated fixtures; routes/headers/callback at real HTTPS; MDAO owner acceptable pre/post baseline (historic 3 HEAD 502s are NOT healthy); game IP and world no regression; 360/390 mobile+a11y; G6 and clean exact G7 RC; separate written Club owner and Kirill host/production/DNS GO; final live G8. Otherwise NO-GO.

**No production, host or Cloud effect of this G4 authority commit.**
