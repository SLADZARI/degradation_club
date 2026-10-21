---
artifactId: dementor-club.result.portal-vm-site-hosting-stage1
project: dementor-club
documentType: RESULT
projectStage: PLANNING
gate: G4_APPROVAL_PENDING
status: DRAFT
workStatus: WAITING_APPROVAL
ownerScopeConfirmed: true
g4PreparationAuthorized: true
ownerDecision: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6302633113
version: 0.1
updated: 2026-10-21
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

**G4 decision still requested; owner has CONFIRMED the bounded scope and AUTHORIZED PREPARATION ONLY, not implementation.** Canonical owner: [#237](https://github.com/SLADZARI/degradation_club/issues/237). Host readiness: [#255 / Draft #257](https://github.com/SLADZARI/degradation_club/pull/257). Portal-only private preview [Draft #258](https://github.com/SLADZARI/degradation_club/pull/258) is a DIFFERENT, non-authorizing Result and documents an approval-order deviation; do not reuse its G4 status to authorize public hosting. #228 baseline remains NO-GO. Stage1 is intentionally **unindexed/unactivated**; the separately owner-authorized BQA-23 pause updated PROJECT/INDEX without making Stage1 current. `APPROVED_STATE.json` is unchanged.

## Owner scope and priority decision (2026-10-20)

**OWNER SCOPE CONFIRMED / G4 PREPARATION AUTHORIZED / G4 PASS STILL PENDING.** [Canonical owner decision](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6302633113) explicitly confirms only the existing site/Workspace/Board/Join frontend hosting on the VM with the **current Supabase Cloud unchanged**; the team may finish G4 documentation and read-only host/QA readiness checks. **The owner did NOT authorize production, VM writes, Nginx reload, DNS, backend/Auth/data migration, source merge or any feature change.**

**Kernel precondition update:** stale branch pointer corrected in [`e4cacb8`](https://github.com/SLADZARI/degradation_club/commit/e4cacb8ef1f962c534ad937fbbf6bdd125ad34de); BQA-23 [formally OWNER-PAUSED at G5](https://github.com/SLADZARI/degradation_club/commit/6c5d552d89c94e6662c78c2f9b54a9f576f54c13) with owning Result v0.2 status WAITING, no active integration branch and [Draft PR #252](https://github.com/SLADZARI/degradation_club/pull/252) preserved. **This Draft proposal branch is NOT an active Result/integration branch.** Stage1 G4 still needs explicit later approval and registration by the kernel owner with no competing integration owner.

## Goal and bounded outcome

Deliver **the existing Dementor Club public site + Workspace + Board + Join/DC-9/Application/Membership shell** under `https://dementor.club` served from the existing VM, using a pinned immutable built artifact from `dementor-club-production` and **the same existing Supabase Cloud** endpoint, Auth/PKCE/RPC/RLS/Storage. Preserve current semantics and existing public routes. GitHub remains code/CI/PR source. Keep existing GitHub Pages production custom-domain setup recoverable through a tested DNS rollback.

**Stage 1 does NOT include** self-hosting or copying PostgreSQL, Auth accounts, `profiles`, `dc_*`, nonprefixed Club tables, Storage object bytes, Edge workers, schema changes, OAuth provider changes, account re-registration, SSO with Live, or Robo Games. These belong to separately owned **Stage 2** after Stage 1 live G8 and a fresh approved Result/Gate. Confirmed future Stage 2 owner scope: non-destructive **COPY** of all existing shared Auth user accounts and linked Google identities/minimal approved profiles into isolated Club Auth, with original shared Cloud untouched; MP/Robo data remain excluded.

## Lead W13 evidence reconciliation — 2026-10-21 (read-only, NOT G4 PASS)

- Actual trusted operator VM after snapshot recorded in [#255](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6311862135), Draft [#257](https://github.com/SLADZARI/degradation_club/pull/257) at `9bdf4d54df5ba6f28240f760940a0453bdcf6520`: effective Nginx syntactically valid, no current `dementor.club` named vhost collision, 4 vCPU, 6.7 GiB available RAM, 42 GB free, Live IP Host game health HTTP 200, private Stage A route/404 smoke. MDAO existing three vhost HEAD status 502 each, as previously observed; NOT MDAO application-health PASS. Unattended TLS renewal and public VM CA-valid SNI still unverified.
- **W12 manifest discrepancy CLOSED AS SORT-ORDER FALSE ALARM (technical only).** Dev2 [#256 independent two-order reproduction](https://github.com/SLADZARI/degradation_club/issues/256#issuecomment-6313720121) and Architect [#257 W13 correction](https://github.com/SLADZARI/degradation_club/pull/257) reproduced `b2da2d55...` using Path-component ordering and `516af743...` using lexical POSIX-string ordering **over the same 468 static files**. Zero path/size/byte-SHA differences versus a clean Node22 source build (17,425,725 bytes), as independently checked by Lead [#256](https://github.com/SLADZARI/degradation_club/issues/256#issuecomment-6312140648). The first ordering divergence is zero-based row 4 (`about/index.html` vs `about-definition-v1.css`). Q-01 [#228 accepted the static-content recheck](https://github.com/SLADZARI/degradation_club/issues/228#issuecomment-6314105790). Preserve original W12 observation as history. **No VM rebuild/upload needed; not a G7 or runtime security PASS.**
- **Still no Stage1 permission:** scope G4 prep only, implementationStartAuthorized=false, Q-01 actor/PKCE/RLS/Storage negatives not accepted, composer physical keyboard/auth and P1 Web/UI G4/implementation still open, automated renewal and pre-DNS CA-valid SNI not proved, no Kirill-authorized Nginx install/reload or public DNS. Stage1 Result remains DRAFT/REFERENCE.
- **Current Q-01 bounded results:** [#126 Chromium five-viewport visual QA](https://github.com/SLADZARI/degradation_club/issues/126#issuecomment-6313861962) PASS (360/390/430/768/1440, 4000-char form, scroll/sticky actions, Escape/Tab, no DB writes) on Draft #308 `38d6f2aa`; **physical keyboard/200% zoom, signed-in actor and Submit/role negatives NOT VERIFIED**. [#228](https://github.com/SLADZARI/degradation_club/issues/228#issuecomment-6314105790) Cloud read-only metadata inspected: 28 `dc_*` RLS-enabled tables, private `dc-community-artifacts` (16 objects), direct six anon API HEAD requests blocked at GRANT; **real signed-in/CIRCLE outsider/private Storage negative QA NOT RUN**. Do not upgrade catalog/anonymous results to full RLS PASS.
- **Two P1 corrections: SOURCE-DIAGNOSED / NO CODE PR:** [#227 Frontend+UX exact two-CSS-file proposal](https://github.com/SLADZARI/degradation_club/issues/227#issuecomment-6313844578) for anonymous Board existing login button and clipped 360/390 homepage H1. Separate owned Web/UI G4 must be approved before code changes; P1-A then P1-B serial, candidate QA and resulting new exact source artifact/manifest re-freeze. Existing #308 composer must not be silently merged into this proposal.

## Existing-before-new: exact proven input vs open gaps

- Current public site source baseline: `dementor-club-production@cde332779ab0e256dd1e498660d6fa651e91846e`. Dev2 [#256](https://github.com/SLADZARI/degradation_club/issues/256) reproducibility evidence: Node 22; clean `_site/` **468 files / 17,425,725 bytes**; canonical sorted manifest SHA256 `b2da2d55847be160dd1827d4fc2169f3d078f06c121ef6667ffcde51d1490c63` (reproduced cleanly). The Pages workflow has a dedicated browser-shell validator that was not part of Dev2's standalone seven-step run: do not call them exact CI parity.
- An owner-operated private loopback preview at `127.0.0.1:18080` was reported. The private preview is not an HTTPS/SNI/Cloud-role PASS and is not a public release authorization.
- Operator evidence says a dual-SAN `dementor.club` / `www.dementor.club` VM certificate was issued (valid until 2027-01-15), with a DNS-01 hook configuration staged. **Actual future unattended renewal and live Nginx CA-valid chain/SNI remain NOT VERIFIED.** Reconfiguration and orphan TXT cleanup records from #255 are not automatic-renewal PASS.
- Later than initial 2026-10-17 Nginx snapshot, **Dementor Live** was deployed to the same host with IP Host `138.199.144.94`, separate `dementor-live.conf`, loopback `127.0.0.1:14173`, Compose `dementor-live`, volume `dementor-live-world`. Current SHA/health and POST-GAME Nginx map still need read-only operator confirmation.
- Protected legacy: **MDAO `/data/*`, `db-dev`, Nginx old vhosts, Docker networks/volumes, monitoring, n8n, Graylog, GitLab Runner**. NO content reads, writes, restarts, volume cleanup or repurposed default/IP game vhost.
- **RESOLVED (2026-10-20):** exact kernel branch mismatch repaired by [`e4cacb8`](https://github.com/SLADZARI/degradation_club/commit/e4cacb8ef1f962c534ad937fbbf6bdd125ad34de). BQA-23 is now **WAITING / OWNER-PAUSED** in [`6c5d552d`](https://github.com/SLADZARI/degradation_club/commit/6c5d552d89c94e6662c78c2f9b54a9f576f54c13); `currentResult` retains its WAITING pointer for traceability, but `activeIntegrationBranch=null` and implementation permissions are false. #252 remains Draft. Stage1 still not activated.

## Owner/authority decisions required BEFORE G4 PASS

1. **KERNEL-1 — DONE / VERIFIED:** owner's exact pointer fix [`e4cacb8`](https://github.com/SLADZARI/degradation_club/commit/e4cacb8ef1f962c534ad937fbbf6bdd125ad34de) corrected the stale top-level integration branch. No other pointer edits needed.
2. **KERNEL-2 — OWNER PARK DONE:** [`6c5d552d`](https://github.com/SLADZARI/degradation_club/commit/6c5d552d89c94e6662c78c2f9b54a9f576f54c13) preserves BQA-23 as WAITING at last historic G5 with PR #252 Draft. Current implementation branch pointer is null. **Stage1 activation remains a separate next G4 decision**: on approval, reconcile WAITING BQA-23 into `waitingResults` and register only one Stage1 Result/integration branch. This Draft proposal branch is NOT that integration branch.
3. **G4-1 — OWNER SCOPE CONFIRMED / G4 PASS PENDING:** owner permits G4 preparation for site-only Host/HTTPS serving on VM, same Cloud/PKCE URL in both `site-config.js` AND hard-coded `auth/callback/index.html`; no route rewrite, game, new Table/RPC/Auth/Storage or domain switch. **Implementation cannot start** before a separate recorded full G4 approval after exact host/QA evidence. Existing Board composer and mobile/guest P1 corrections require separate Web/UI Results and acceptance, never silent bundling.
4. **HOST-1 — host operator and Club owner:** Kirill/authorized host operator supplies dated POST-GAME Nginx listener+effective vhost/default mapping, fresh RAM/CPU/disk+free backup capacity, and precise no-touch evidence for MDAO and Live, then approves exact **new-only** `dementor.club` Nginx file/symlink, `nginx -t`/controlled reload and STOP/rollback boundaries. This is separate from public DNS cutover approval.
5. **TLS-1 — renewal proof:** demonstrate client-trusted apex+www CA full chain and SNI without `-k`, and explicit custodianship plus a testable unattended renewal mechanism; do not infer real renewal from active certbot.timer. An authorized guarded rehearsal may have ACME/DNS side effects and needs separate scope.
6. **QA-1 — actor fixtures:** Q-01 requires existing authorized actor state map and non-sensitive fixture instructions for anonymous, Guest/DC-9, Applicant, Member, Dementor, Owner, CIRCLE outsider. The Board can invoke lifecycle-writing RPCs; do not describe opening the real Board as strictly read-only without checking actual calls and permissions.

**Owner scope and G4 preparation: CONFIRMED. G4 PASS / implementation: PENDING.** This consent does not replace Kirill host mutation consent, independent QA G6, clean G7 RC or final public DNS production release authorization.

## Before-G6 frontend correction dependencies (SEPARATE Web/UI ownership)

- Existing Board IDEA/announcement **opaque + scrollable composer**: [Draft PR #308](https://github.com/SLADZARI/degradation_club/pull/308) @ `38d6f2aa11698522b5e068c3303fec41328e4fd0`, exact CI [39494797716](https://github.com/SLADZARI/degradation_club/actions/runs/39494797716) SUCCESS. Q-01's independent [five-viewport Chrome emulation](https://github.com/SLADZARI/degradation_club/issues/126#issuecomment-6313861962) validates static presentation only; actual authenticated flow, physical mobile keyboard and 200% zoom remain unverified. No Web/UI G4/G7/G8 authorization; do not silently merge with Stage1.
- Two distinct P1s from [#227](https://github.com/SLADZARI/degradation_club/issues/227): (A) anonymous Board's existing Google CTA hidden by CSS ancestor, (B) mobile H1 `САМОРАЗВИТИЕ` clipped ~73/78 px at 360/390. [F-01 exact CSS selectors and proposed changes](https://github.com/SLADZARI/degradation_club/issues/227#issuecomment-6313844578) delivered and source-reviewed; **no code PR or owning G4 yet**. Serial P1-A → Q-01 → P1-B → Q-01, visual/accessibility and real-actor negatives before broad release. Do not equate no horizontal scroll to readable text.
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

- **Lead (existing #237):** kernel pointer and BQA-23 pause are VERIFIED in separate authority commits. Stage1 scope is owner-confirmed; collect remaining G4 evidence and seek the separate **implementation-authorizing** Stage1 G4 decision. Gate remains PENDING.
- **A-01/I-01 DevOps (#255 / Draft #257):** dated post-game host headroom, no-MDAO-drift baseline, separated new-only Nginx config and renewal rehearsal contract; no sudo writes/reloads until host approval.
- **F-01/Dev2 + Board owner (#256, #126, #227, PR #308):** accepted browser route/site transport as evidence, independent scoped Web/UI corrective review; no extra shell/Auth/Board implementation from this Result.
- **Q-01 (#228):** independent CSS candidate review then separate P1-A/P1-B, full actor+Cloud+Storage negative matrix; no unapproved new users, payloads or Cloud writes.
- **B-01 Backend (existing #237):** may continue **read-only** Club dependency closure and owner DC01 copy-all accounts metadata contract in parallel. No Auth/DB export/import, key generation, off-VM data transfer, or Cloud write until a separate Stage 2 Result/Gate **AFTER** Stage 1 live G8.

## Stage1 Gate decision packet — Lead 2026-10-21

**Verified preparation**: (a) owner-approved scope and BQA-23 parked kernel; (b) actual read-only post-game VM ports/resources/vhost inventory; (c) 468-file source-to-private-VM parity with root-cause reconciliation; (d) independent emulated visual candidate QA for #308; (e) Supabase schema/policy/Storage *metadata* inventory. These are PREPARATION facts, NOT implementation approval.

**Separate G4 decision still necessary:** authority must accept a single site-only Result/integration branch and exact safe change scope with rollback, preserving Cloud and all MDAO/game vhosts. Stage1 G4, even if later approved, allows only the bounded new site configuration **in a controlled nonproduction/integration lane**; it does not authorize host config installation/reload or DNS cutover. Proposed Web/UI fixes #308/#227 require **their own** scoped G4/QA. Avoid imposing post-install public HTTPS/SNI or real-actor end-to-end results as conditions that must already be passed before any implementation exists; those are subsequent G6/G7 checks with their own permission/fixtures.

**Currently blocking G6/G7 release, not solved by G4 prep:** real authorized actor-role/PKCE/RLS/CIRCLE/private media and signed URL negatives, physical/keyboard/zoom composer, the two P1 fixes and retests, trusted public VM SNI/CA-valid apex+www, unattended renewal proof under separate Kirill/DNS authorization, MDAO 502 historical ownership and no-regression thresholds, clean exact RC and rollback. STOP on P0 privacy leak, unapproved Cloud writes, new default/IP game vhost, or MDAO modifications.

## Owner/authority checklist to return in #237

- [x] Exact kernel pointer repair approved and verified ([`e4cacb8`](https://github.com/SLADZARI/degradation_club/commit/e4cacb8ef1f962c534ad937fbbf6bdd125ad34de)).
- [x] BQA-23 parked at historic G5, owning Result v0.2 WAITING and no active integration branch ([`6c5d552d`](https://github.com/SLADZARI/degradation_club/commit/6c5d552d89c94e6662c78c2f9b54a9f576f54c13)); PR #252 stays Draft.
- [x] Owner confirms bounded site-only Stage1 scope and G4 preparation ([decision](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6302633113)).
- [ ] Approving authority/owner gives separate Stage1 **G4 PASS** for implementation after the required evidence; only then promote a current Result/one integration branch.
- [ ] Kirill and owner approve exact Host-only config/reload scope after dated service/resource check.
- [ ] Q-01 independently accepts G6 actor/privacy/visual evidence, then separately release G7 and public DNS owner signoff.

**PRODUCTION EFFECT: NONE.** This is a planning proposal only. Do not merge as an APPROVED Result, mark G4 PASS, create active integration branch, run host changes or cut over DNS from this Draft.
