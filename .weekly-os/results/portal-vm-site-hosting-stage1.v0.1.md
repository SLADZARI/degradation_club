---
artifactId: dementor-club.result.portal-vm-site-hosting-stage1
project: dementor-club
documentType: RESULT
projectStage: PLANNING
gate: G4_APPROVAL_PENDING
status: DRAFT
workStatus: WAITING_APPROVAL
version: 0.1
updated: 2026-10-20
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: REFERENCE
parentIssue: 237
integrationBaseRef: dementor-club-production
integrationBaseCommit: cde332779ab0e256dd1e498660d6fa651e91846e
implementationStartAuthorized: false
schemaChangeImplementationAuthorized: false
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
changeControlRequired: true
---

# Portal VM Site Hosting Stage 1 · G4 proposal v0.1 — DRAFT, NOT APPROVED

**Decision requested, NOT a permission to implement.** Canonical owner: [#237](https://github.com/SLADZARI/degradation_club/issues/237). Host readiness: [#255 / Draft #257](https://github.com/SLADZARI/degradation_club/pull/257). Portal-only private preview [Draft #258](https://github.com/SLADZARI/degradation_club/pull/258) is a DIFFERENT, non-authorizing Result and documents an approval-order deviation; do not reuse its G4 status to authorize public hosting. #228 baseline remains NO-GO. This file is intentionally unindexed/unactivated and must not update `.weekly-os/PROJECT.json` / `ARTIFACT_INDEX.json` / `APPROVED_STATE.json` before separate owner and authority review.

## Goal and bounded outcome

Deliver **the existing Dementor Club public site + Workspace + Board + Join/DC-9/Application/Membership shell** under `https://dementor.club` served from the existing VM, using a pinned immutable built artifact from `dementor-club-production` and **the same existing Supabase Cloud** endpoint, Auth/PKCE/RPC/RLS/Storage. Preserve current semantics and existing public routes. GitHub remains code/CI/PR source. Keep existing GitHub Pages production custom-domain setup recoverable through a tested DNS rollback.

**Stage 1 does NOT include** self-hosting or copying PostgreSQL, Auth accounts, `profiles`, `dc_*`, nonprefixed Club tables, Storage object bytes, Edge workers, schema changes, OAuth provider changes, account re-registration, SSO with Live, or Robo Games. These belong to separately owned **Stage 2** after Stage 1 live G8 and a fresh approved Result/Gate. Confirmed future Stage 2 owner scope: non-destructive **COPY** of all existing shared Auth user accounts and linked Google identities/minimal approved profiles into isolated Club Auth, with original shared Cloud untouched; MP/Robo data remain excluded.

## Existing-before-new: exact proven input vs open gaps

- Current public site source baseline: `dementor-club-production@cde332779ab0e256dd1e498660d6fa651e91846e`. Dev2 [#256](https://github.com/SLADZARI/degradation_club/issues/256) reproducibility evidence: Node 22; clean `_site/` **468 files / 17,425,725 bytes**; canonical sorted manifest SHA256 `b2da2d55847be160dd1827d4fc2169f3d078f06c121ef6667ffcde51d1490c63` (reproduced cleanly). The Pages workflow has a dedicated browser-shell validator that was not part of Dev2's standalone seven-step run: do not call them exact CI parity.
- An owner-operated private loopback preview at `127.0.0.1:18080` was reported. The private preview is not an HTTPS/SNI/Cloud-role PASS and is not a public release authorization.
- Operator evidence says a dual-SAN `dementor.club` / `www.dementor.club` VM certificate was issued (valid until 2027-01-15), with a DNS-01 hook configuration staged. **Actual future unattended renewal and live Nginx CA-valid chain/SNI remain NOT VERIFIED.** Reconfiguration and orphan TXT cleanup records from #255 are not automatic-renewal PASS.
- Later than initial 2026-10-17 Nginx snapshot, **Dementor Live** was deployed to the same host with IP Host `138.199.144.94`, separate `dementor-live.conf`, loopback `127.0.0.1:14173`, Compose `dementor-live`, volume `dementor-live-world`. Current SHA/health and POST-GAME Nginx map still need read-only operator confirmation.
- Protected legacy: **MDAO `/data/*`, `db-dev`, Nginx old vhosts, Docker networks/volumes, monitoring, n8n, Graylog, GitLab Runner**. NO content reads, writes, restarts, volume cleanup or repurposed default/IP game vhost.
- Current kernel is internally inconsistent: top-level `activeIntegrationBranch=result/board-media-performance-v1` points to a CLOSED/G8 Result, while `currentResult=dementor-club.result.owner-admin-community-ops-v1` is ACTIVE/G5 with its own `integrationBranch=result/owner-admin-community-ops-v1`. Existing [BQA-23 Draft #252](https://github.com/SLADZARI/degradation_club/pull/252) must stay separate.

## Owner/authority decisions required BEFORE G4 PASS

1. **KERNEL-1 — mechanical pointer correction authorization:** after validating current `PROJECT.json`, `ARTIFACT_INDEX.json` and both owning Result files, proposed temporary correction `activeIntegrationBranch: result/board-media-performance-v1 → result/owner-admin-community-ops-v1` to match the *currently* active Result; NO status, Gate, scope or code changes. Authority owner must approve the specific edit and exact base SHA. If they designate a different owner/result, STOP and reconcile rather than force this proposal.
2. **KERNEL-2 — serial ownership:** authority owner/Lead must either finish/park the unrelated BQA-23 Owner Admin G5 track with explicit state and branch ownership, or approve a non-conflicting Stage 1 planning lane. Never replace the active `currentResult` by implication. Only **after** approval may a Stage 1 active integration branch be selected/registered. This Draft branch is NOT an integration branch.
3. **G4-1 — scope and scope-out approval:** site-only Host/HTTPS serving on VM, same Cloud/PKCE URL in both `site-config.js` AND hard-coded `auth/callback/index.html`; no legacy route rewrites, game changes, new Table/RPC/Auth/Storage or domain switches. Existing Board composer and known mobile/guest P1 corrections require separate Web/UI Results and their own acceptance, not silent bundling in this infrastructure Result.
4. **HOST-1 — host operator and Club owner:** Kirill/authorized host operator supplies dated POST-GAME Nginx listener+effective vhost/default mapping, fresh RAM/CPU/disk+free backup capacity, and precise no-touch evidence for MDAO and Live, then approves exact **new-only** `dementor.club` Nginx file/symlink, `nginx -t`/controlled reload and STOP/rollback boundaries. This is separate from public DNS cutover approval.
5. **TLS-1 — renewal proof:** demonstrate client-trusted apex+www CA full chain and SNI without `-k`, and explicit custodianship plus a testable unattended renewal mechanism; do not infer real renewal from active certbot.timer. An authorized guarded rehearsal may have ACME/DNS side effects and needs separate scope.
6. **QA-1 — actor fixtures:** Q-01 requires existing authorized actor state map and non-sensitive fixture instructions for anonymous, Guest/DC-9, Applicant, Member, Dementor, Owner, CIRCLE outsider. The Board can invoke lifecycle-writing RPCs; do not describe opening the real Board as strictly read-only without checking actual calls and permissions.

**Approvals: PENDING.** Club owner approval of this exact G4 scope does not replace Kirill host mutation consent, independent QA G6, clean G7 RC or final public DNS production release authorization.

## Before-G6 frontend correction dependencies (SEPARATE Web/UI ownership)

- Existing Board IDEA/announcement **opaque + scrollable composer**: [Draft PR #308](https://github.com/SLADZARI/degradation_club/pull/308) @ `38d6f2aa11698522b5e068c3303fec41328e4fd0`, exact CI Site Integrity [39494797716](https://github.com/SLADZARI/degradation_club/actions/runs/39494797716) SUCCESS, but no independent authenticated browser acceptance or approved Web/UI Result/G4/G7/G8. Do not merge this CSS/test diff into Stage 1 hosting by accident.
- Two distinct P1s from [#227](https://github.com/SLADZARI/degradation_club/issues/227): (A) anonymous Board's *existing* Google CTA hidden by CSS ancestor, and (B) Home mobile H1 `САМОРАЗВИТИЕ` cropped about 73px/78px at 360/390. Each needs owning scoped Web/UI Gate and Q-01 keyboard/role/mobile QA before broad public promotion. Do not equate no horizontal scroll to readable type.
- When accepted corrective PRs are released (if any), **re-freeze the actual production branch HEAD** as the new exact Stage 1 source SHA, rebuild in CLEAN checkout and re-hash; do NOT reuse the older 468-file hash for altered bytes. Until then the only evidenced unchanged baseline is `cde33277...`.

## Stage 1 independent acceptance/G6 (future approved environment)

| ID | Required evidence / STOP boundary |
| --- | --- |
| S1-01 provenance | Exact accepted current production source SHA, full ordered Pages Node22 validators including browser-shell, clean `_site` files/bytes+SHA manifest OUTSIDE source root; VM served bytes must match immutable artifact. |
| S1-02 host isolation | Dated post-game MDAO + Live BEFORE: `nginx -t`, 80/443/default/SNI, loopback game/portal, CPU/RAM/disk, service availability; no drift after site-only host activation. |
| S1-03 TLS | `curl --resolve dementor.club:443:<verified VM IPv4> https://dementor.club/` **without `-k`**, real trust chain; `www` HTTPS redirects canonically; certificate renewal ownership and test evidence. |
| S1-04 routes | `/`, `/projects/`, `/workspace/`, `/workspace/board/`, `/join/`, `/join/result/`, `/join/apply/`, `/auth/callback/`, `/share/artifact/`; direct refresh, correct 200/redirect/404/dotfile and assets, content type/canonical/OG/robots/sitemap. |
| S1-05 Cloud still original | `site-config.js` and actual browser PKCE callback still use **the existing Cloud project**, no new issuer/Storage/Edge/API URL, no unexpected redirect or CORS origin change. |
| S1-06 board and mobile | Current Board composer accepted from separate PR, P1-A/P1-B explicitly fixed/accepted or documented public-release NO-GO; Chrome 360/390/414/430/560/1440 and Safari if available, keyboard focus, zoom 200%, existing Workspace Header unchanged. |
| S1-07 actor privacy | Approved positive+negative Auth/PKCE, 9/9 immutable baseline, Application vs Membership, Guest/Applicant/Member/Dementor/Owner/anonymous/CIRCLE outsider, RLS/API direct negatives and private `dc-community-artifacts` Storage/signed-media checks. No staging write into shared production Cloud to fabricate data. |
| S1-08 Live + MDAO no regression | Existing game IP Host/health/SSE/world persistence intact; MDAO old vhosts/db-dev/Runner/legacy volumes availability/resource before/after intact, no MDAO data access/mutation. |
| S1-09 backup/rollback | GitHub Pages custom-domain & original apex four Pages A records and www behavior recorded; controlled DNS rollback plan with expected TTL limitations; no premature shutdown of Cloud or Pages. |
| S1-10 release truth | G6 independent QA PASS + clean G7 **site-only RC** with exact diff/SHA, then separately **written Club owner & Kirill host + DNS approval** for production switch. Actual DNS cutover follows approval; live G8 with evidence and explicit accepted source SHA only afterwards. |

All S1 checks remain **NOT VERIFIED on public VM**, unless a specifically dated operator and independent Q-01 record proves them. Historical private-preview/local CI observations do not count as production G6/G8.

## Execution lanes (parallel read-only; serial writes)

- **Lead (existing #237):** reconcile kernel pointer with authority; isolate competing BQA-23; seek approval of this standalone Stage 1 G4. Gate status remains PENDING.
- **A-01/I-01 DevOps (#255 / Draft #257):** dated post-game host headroom, no-MDAO-drift baseline, separated new-only Nginx config and renewal rehearsal contract; no sudo writes/reloads until host approval.
- **F-01/Dev2 + Board owner (#256, #126, #227, PR #308):** accepted browser route/site transport as evidence, independent scoped Web/UI corrective review; no extra shell/Auth/Board implementation from this Result.
- **Q-01 (#228):** independent CSS candidate review then separate P1-A/P1-B, full actor+Cloud+Storage negative matrix; no unapproved new users, payloads or Cloud writes.
- **B-01 Backend (existing #237):** may continue **read-only** Club dependency closure and owner DC01 copy-all accounts metadata contract in parallel. No Auth/DB export/import, key generation, off-VM data transfer, or Cloud write until a separate Stage 2 Result/Gate **AFTER** Stage 1 live G8.

## Owner/authority checklist to return in #237

- [ ] Authority accepts specific stale-pointer correction while BQA-23 is still G5; exact base SHA and conflict handling recorded.
- [ ] BQA-23 precedence / parking is decided; no simultaneous shared-state implementation branches.
- [ ] Club owner approves bounded site-only Stage 1 G4 (without granting DNS/VM mutation).
- [ ] Kirill and owner approve exact Host-only config/reload scope after dated service/resource check.
- [ ] Q-01 independently accepts G6 actor/privacy/visual evidence, then separately release G7 and public DNS owner signoff.

**PRODUCTION EFFECT: NONE.** This is a planning proposal only. Do not merge as an APPROVED Result, mark G4 PASS, create active integration branch, run host changes or cut over DNS from this Draft.
