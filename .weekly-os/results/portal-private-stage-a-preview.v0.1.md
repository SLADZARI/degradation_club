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

**STATE:** Draft / G4 approval pending. **This document was initially written before execution; the operator subsequently ran the private staging preview before this Gate was approved. This is a recorded approval-order deviation, NOT retroactive permission.** Lead records owner's wish to deploy the already-approved production portal in a private test preview now, without additional VM allocation. This proposal does not override the current active BQA-23 Result, #228 stable-baseline NO-GO or #237 broader cloud/self-host migration DEFERRED.

## Purpose

Demonstrate the **existing, unchanged static portal** on the **already accessible VM** with reversible loopback-only HTTP; reuse GitHub Pages build input and existing Supabase Cloud browser configuration. Verify isolation before considering further hosting. No public staging exposure was approved. **Important: the operator later reported account sign-in in the private SSH-tunneled preview despite this original restriction; see factual execution record below.**

## Evidence already received (2026-10-17)

- Dev2 #256: clean `dementor-club-production@cde332779ab0e256dd1e498660d6fa651e91846e`; Node22; canonical 8 validators PASS, `_site/` 468 files / 17,425,725 bytes; sorted content manifest SHA-256 `b2da2d55847be160dd1827d4fc2169f3d078f06c121ef6667ffcde51d1490c63` twice on unpolluted builds; loopback 13×200/1×404; Chrome 360/390/1440 static shells smoke PASS with mobile hero clipping carried to #227. Q-01 subsequently audited source and reported local static prep **ACCEPTED WITH LIMITS** in #228 comment 6236615871; no independent VM byte-hash or full browser/network validation.
- Operator-provided **read-only SSH** VM snapshot at 2026-10-17T15:33:37Z: `/srv/dementor` exists root:root 0755 (no special write ACL), disk ~43G available, available RAM 6.8 GiB / total 7.6 GiB, 4 vCPU; nginx, docker, GitLab Runner active; `db-dev` Up; 22/80/443/32778 existing listeners. This is an operator-captured terminal report, not verified by Lead SSH.
- Subsequent operator read-only check: `bash -n` for both downloaded scripts + existing SSH command + no symlinks at checked `/srv/dementor/stage-a` paths = **PASS**. This preflight did NOT create directories, transfer files or start a server.
- Existing script on user's Mac: `~/Downloads/dementor_stage_a_portal.sh` (provided-file SHA256 `344f61e14c5c3e98269b60187a050df1dbbb6aee154e4dde113b36bcd6abf265`), `~/Downloads/dementor_stage_a_stop.sh` (SHA256 `16eaf205ae4bd52eee8003560f19231500a7536dbae2af42176bfac58cd603da`). Operator subsequently supplied matching `shasum -a 256` output for both downloaded files. Scripts are conversation attachments, **not repo-controlled release files**.

## AS-OBSERVED / after proposed Gate was drafted — 2026-10-17

**The following execution happened before this DRAFT received formal approval; do not backdate any authorizing decision.** Facts are from operator terminal output and screenshots, NOT the Lead's independent SSH or authentication/network capture.

1. The operator selected Mac `nvm use 22` (Node `v22.22.0`), executed `~/Downloads/dementor_stage_a_portal.sh`. Fresh checkout and the site's canonical validations reported PASS: registry, internal references, visual contract, sitemap/social, JS 113 files, 34 public + 17 private/compat + 1 disabled route manifest and 52-route guard.
2. Existing SSH read-only conflict/preflight reported PASS. The script **wrote** immutable build files to `/srv/dementor/stage-a/releases/cde332779ab0e256dd1e498660d6fa651e91846e` and started a Python static server. Operator result: PID `2772007`, UID `nobody`, loopback **127.0.0.1:18080**, `REMOTE_LOOPBACK_HTTP_200=PASS`, `LEGACY_SERVICE_STATE_AFTER=PASS`, `STAGE_A_PRIVATE_PREVIEW=PASS`. Independent process bind, file hash and MDAO full I1–I8 unchanged assertion remain NOT VERIFIED.
3. User supplied Safari desktop Home screenshot after SSH tunnelling: shared Public Header, primary CTA, H1, art and footer-area content visibly rendered. User reported navigation through portal and successful account sign-in; supplied Safari screenshot of `Community Board — Dementor Club` on address displaying `127.0.0.1`, with Workspace navigation, profile UI `Sled Zari`, 3 Board cards and onboarding overlay. Actual URL/path/port, session token, PKCE callback and role were NOT independently captured by QA. Possible `ВОЙТИ` alongside profile is a UI question for #227, not an established auth failure.
4. **The unchanged static portal still points at LIVE Supabase Cloud** in `site-config.js`. Authenticated UI may contact production data. Do NOT run test account grants, invites, membership/Artifact mutations, negative access probes, or change OAuth callback/Cloud configuration from this preview without separate approved QA sessions/fixtures. An apparent login success does not certify isolation or negative RLS.
5. [Independent Q-01 review](https://github.com/SLADZARI/degradation_club/issues/228#issuecomment-6236615871) accepts the existing Dev2 local portal smoke with limits: the CI Pages #138 includes a browser-shell validator that Dev2's separate local validator list omitted. It classifies VM portal HTTP and screenshots as **operator-reported partial smoke**, not independent auth/privacy or full production readiness. [Q-01 review of this same PR](https://github.com/SLADZARI/degradation_club/pull/258#issuecomment-6236667626) requests this factual corrective.
6. **GATE DEVIATION OPEN:** Draft `G4_APPROVAL_PENDING / implementationStartAuthorized:false` was active when VM files/listener were created. Earlier owner verbally directed immediate portal testing; that is **not** a recorded `.weekly-os` approval of this Result. Lead/owner must explicitly decide **KEEP PRIVATE FOR SCOPED QA** or **STOP VIA GUARDED SCRIPT**, record host-owner write scope and separately approve any *future* VM modifications. No retroactive approval, no inference of authorized public/authenticated staging.

**Current factual status:** `PRIVATE_PREVIEW_STARTED_OPERATOR_REPORTED`, `BROWSER_HOME_AND_WORKSPACE_OPERATOR_REPORTED`, `GATE_APPROVAL_PENDING`, `PRODUCTION_RELEASE_UNCHANGED_AS_REPORTED`. Existing #228 stable baseline remains NO-GO. Do not repeat the already completed VM installation without a corrective reason and approved Gate.

## Bounded execution scope (original intended limits; FUTURE changes still require approval)

**IN:** take a fresh isolated Mac clone of exact source SHA, canonical 8 release validators, copy only resulting static `_site/` archive under `/srv/dementor/stage-a/releases/<exact-sha>`, create `stage-a/releases`, `stage-a/logs` and a narrowly named preview PID/log if missing, bind Python static HTTP **127.0.0.1:18080 only after a fresh port-free check**, drop server to pre-existing unprivileged `nobody`, visit through operator-controlled SSH tunnel, capture static HTTP and legacy before/after evidence, and stop only that exact matching preview PID. Existing functioning administrative root SSH can perform copying to root-owned `/srv/dementor`; no new Unix account is required for this private proof of concept. Root is not permitted as the HTTP process UID.

**OUT:** changes to existing `/data/**`, MDAO/db-dev/legacy Docker containers, Nginx config/reload, port 80/443, firewall, DNS/Certbot, OAuth redirect, Cloud DB/Auth/Storage/schema/RLS, any logged-in/public ingress, GitHub Pages production workflow, other Result branches, games/launcher, self-hosted Supabase and production cutover.

## STOP and rollback

- Operator must verify **exact script SHA256** above and Git checkout SHA, clean source root, no file/symlink collision, fresh bind availability and baseline nginx/docker/runner/db-dev health immediately before VM writes.
- Stop on any preflight mismatch, wrong SHA, any unexpected permissions/collision, legacy service change or non-local listener. The existing script does not claim owner approval.
- Existing stop script verifies PID, UID `nobody`, command `http.server`, exact site and loopback; then signals only this preview, leaves staging files for audit. No system or legacy services are stopped.
- After launch: Q-01/DevOps compare baseline legacy services/listeners and assert no changes to protected ownership/state. Full MDAO backup/restore is **not** part of this static preview. Future Supabase self-host requires an independent dedicated Result and restore drill.

## Approval and separation

1. **Lead/owner** must now decide KEEP PRIVATE or STOP and approve any future exact private-preview scope/Gate, recording the prior unauthorized sequencing as a deviation in the canonical .weekly-os governance trail; do NOT use this DRAFT alone as authorization. Any conflicting active integration branch pointers must be reconciled before promotion.
2. **VM host owner / Kirill scope:** earlier host allocation and SSH confirmed by owner, but exact permission to deploy within existing root-owned staging namespace should be confirmed within host-owner's existing agreement. Do not interpret read-only SSH as blanket root mutation permission.
3. **DevOps/operator:** the first Stage A preview has **already been executed prior to Gate**; no rerun or expanded host write until (1) and (2). Supply observed before/after and guarded STOP evidence in #255/#237 as appropriate.
4. **Q-01** performs static private preview verification; separate authenticated/CIRCLE/Storage negatives must PASS **before any publicly accessible or authenticated VM staging**. #228 parent stays NO-GO until independent behavioral/role acceptance.

No merge into `dementor-club-production`, no prod deploy; #237 infrastructure migration/cutover remains deferred.
