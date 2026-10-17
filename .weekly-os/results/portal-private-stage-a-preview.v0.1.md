---
artifactId: dementor-club.result.portal-private-stage-a-preview
project: dementor-club
documentType: RESULT
projectStage: PLANNING
gate: G4_APPROVAL_PENDING
status: DRAFT
workStatus: WAITING_APPROVAL
version: 0.1
updated: 2026-10-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: REFERENCE
parentIssue: 237
implementationStartAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
semanticMutationAuthorized: false
sourceBranch: dementor-club-production
sourceCommit: cde332779ab0e256dd1e498660d6fa651e91846e
---

# Portal Stage A · private static preview · proposed Result v0.1

**STATE:** Draft, **NOT YET A GATE OR PERMISSION TO WRITE TO VM**. Lead records owner's wish to deploy the already-approved production portal in a private test preview now, without additional VM allocation. This proposal does not override the current active BQA-23 Result, #228 stable-baseline NO-GO or #237 broader cloud/self-host migration DEFERRED.

## Purpose

Demonstrate the **existing, unchanged static portal** on the **already accessible VM** with reversible loopback-only HTTP; reuse GitHub Pages build input and existing Supabase Cloud browser configuration. Verify isolation before considering further hosting. Do not expose staging publicly or use live authenticated login as a test.

## Evidence already received (2026-10-17)

- Dev2 #256: clean `dementor-club-production@cde332779ab0e256dd1e498660d6fa651e91846e`; Node22; canonical 8 validators PASS, `_site/` 468 files / 17,425,725 bytes; sorted content manifest SHA-256 `b2da2d55847be160dd1827d4fc2169f3d078f06c121ef6667ffcde51d1490c63` twice on unpolluted builds; loopback 13×200/1×404; Chrome 360/390/1440 static shells smoke PASS with mobile hero clipping carried to #227. Independent Q-01 static acceptance is still pending.
- Operator-provided **read-only SSH** VM snapshot at 2026-10-17T15:33:37Z: `/srv/dementor` exists root:root 0755 (no special write ACL), disk ~43G available, available RAM 6.8 GiB / total 7.6 GiB, 4 vCPU; nginx, docker, GitLab Runner active; `db-dev` Up; 22/80/443/32778 existing listeners. This is an operator-captured terminal report, not verified by Lead SSH.
- Subsequent operator read-only check: `bash -n` for both downloaded scripts + existing SSH command + no symlinks at checked `/srv/dementor/stage-a` paths = **PASS**. This preflight did NOT create directories, transfer files or start a server.
- Existing script on user's Mac: `~/Downloads/dementor_stage_a_portal.sh` (provided-file SHA256 `344f61e14c5c3e98269b60187a050df1dbbb6aee154e4dde113b36bcd6abf265`), `~/Downloads/dementor_stage_a_stop.sh` (SHA256 `16eaf205ae4bd52eee8003560f19231500a7536dbae2af42176bfac58cd603da`). Operator should confirm downloaded bytes before use. Scripts are conversation attachments, **not repo-controlled release files**.

## Bounded execution scope (IF separately approved)

**IN:** take a fresh isolated Mac clone of exact source SHA, canonical 8 release validators, copy only resulting static `_site/` archive under `/srv/dementor/stage-a/releases/<exact-sha>`, create `stage-a/releases`, `stage-a/logs` and a narrowly named preview PID/log if missing, bind Python static HTTP **127.0.0.1:18080 only after a fresh port-free check**, drop server to pre-existing unprivileged `nobody`, visit through operator-controlled SSH tunnel, capture static HTTP and legacy before/after evidence, and stop only that exact matching preview PID. Existing functioning administrative root SSH can perform copying to root-owned `/srv/dementor`; no new Unix account is required for this private proof of concept. Root is not permitted as the HTTP process UID.

**OUT:** changes to existing `/data/**`, MDAO/db-dev/legacy Docker containers, Nginx config/reload, port 80/443, firewall, DNS/Certbot, OAuth redirect, Cloud DB/Auth/Storage/schema/RLS, any logged-in/public ingress, GitHub Pages production workflow, other Result branches, games/launcher, self-hosted Supabase and production cutover.

## STOP and rollback

- Operator must verify **exact script SHA256** above and Git checkout SHA, clean source root, no file/symlink collision, fresh bind availability and baseline nginx/docker/runner/db-dev health immediately before VM writes.
- Stop on any preflight mismatch, wrong SHA, any unexpected permissions/collision, legacy service change or non-local listener. The existing script does not claim owner approval.
- Existing stop script verifies PID, UID `nobody`, command `http.server`, exact site and loopback; then signals only this preview, leaves staging files for audit. No system or legacy services are stopped.
- After launch: Q-01/DevOps compare baseline legacy services/listeners and assert no changes to protected ownership/state. Full MDAO backup/restore is **not** part of this static preview. Future Supabase self-host requires an independent dedicated Result and restore drill.

## Approval and separation

1. **Lead/owner** confirms exact private static preview scope/Gate, explicitly recording approval in the canonical .weekly-os governance trail; do NOT use this DRAFT alone as authorization. Any conflicting active integration branch pointers must be reconciled before promotion.
2. **VM host owner / Kirill scope:** earlier host allocation and SSH confirmed by owner, but exact permission to deploy within existing root-owned staging namespace should be confirmed within host-owner's existing agreement. Do not interpret read-only SSH as blanket root mutation permission.
3. **DevOps/operator** executes once, only after (1) and (2), with before/after and STOP evidence in #255/#237.
4. **Q-01** performs static private preview verification; separate authenticated/CIRCLE/Storage negatives must PASS **before any publicly accessible or authenticated VM staging**. #228 parent stays NO-GO until independent behavioral/role acceptance.

No merge into `dementor-club-production`, no prod deploy; #237 infrastructure migration/cutover remains deferred.
