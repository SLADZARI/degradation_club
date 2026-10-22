---
artifactId: dementor-club.result.pre-vm-webui-gate-correctives-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: APPROVED
workStatus: ACTIVE
version: 0.3
supersedes: 0.2
updated: 2026-10-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssues: 126,227,228,237
ownerG4Decision: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6320105037
ownerG4DecisionV03: https://github.com/SLADZARI/degradation_club/issues/126#issuecomment-6342046769
ownerD1ConditionalCodeGrant: https://github.com/SLADZARI/degradation_club/issues/227#issuecomment-6326985199
leadP1ScopeClassification: https://github.com/SLADZARI/degradation_club/issues/227#issuecomment-6328589143
g4Status: PASS_LIMITED_CODE_ONLY_V03_WEBKIT
integrationBranch: fix/board-composer-visual-stability-20261020
integrationBaseRef: dementor-club-production
integrationBaseCommit: cde332779ab0e256dd1e498660d6fa651e91846e
productionBaseCommit: cde332779ab0e256dd1e498660d6fa651e91846e
existingDraftPullRequest: 308
implementationStartAuthorized: true
schemaChangeImplementationAuthorized: false
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
changeControlRequired: false
---

# Pre-VM Web/UI v1 · v0.3 — OWNER G4 two-file WebKit amendment, G5 ACTIVE

## Goal and acceptance
One accountable F-01, independent Q-01. Existing bugfixes only, no product/permission redesign, no unapproved releases. The owner authorized this bounded Web/UI G4 together with Stage1 planning in [the canonical decision](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6320105037).

1. Existing IDEA/announcement Board composer: preserve [PR #308](https://github.com/SLADZARI/degradation_club/pull/308)'s opaque/scrollable CSS candidate, and repair focus return after Escape/Cancel. Current closeSheet erroneously prefers hidden `[data-slot]` over visible opener. Restore to connected, visible, enabled previous opener, otherwise real visible canonical Board action; full forward/reverse Tab and keyboard tests. Do not submit QA Board data.
2. P1-A anonymous Board: reveal ONLY existing loginWithGoogle button for `UNAUTHENTICATED` in existing Board surface; no Auth/route/role/RPC change, other roles unaffected.
3. P1-B mobile Home first-line `САМОРАЗВИТИЕ`: fully readable at 360/390/414/430/560/200%-zoom without desktop text/CTA/header regression.

4. **P1-D1 post-confirmation truth corrective (narrow owner-permitted extension):** once existing `dc_publish_artifact_v1` confirms a successful publication, a later failure inside `refreshAll()` must **not** record `НЕ ОПУБЛИКОВАНО`, a false failure/retry prompt or a second publish. Distinguish already-confirmed commit from a failed Board projection refresh; keep the existing confirmed success receipt, emit a truthful diagnostic for refresh failure, preserve all pre-commit error/retry behavior. QA verified the false internal error only in **hidden composer DOM** under a synthetic refresh fault; no evidence that two messages were simultaneously visible or real publication was lost. No new publication state, retry RPC, ontology or permissions.

## Code whitelist / single integration owner
- `community/board/board-composer-sheet-v2.css` already existing candidate.
- `community/board/board-composer-sheet-v2.js` minimal focus correction.
- `community/board/board-fullscreen-v2-1.css` anonymous gate CSS only.
- `home-v1-core-20260828.css` mobile H1 CSS only.
- `scripts/validate-board-v21-browser.mjs` reuse existing Chromium/WebKit test harness.
- `community/board/board.js` **ADDED IN v0.2 ONLY FOR post-confirmed refresh error differentiation inside existing `publishFromForm`**. No edits to RPC names/arguments, Auth/roles/ACL, draft creation, media upload, success event ordering, Artifact statuses, DB or independent Board refresh model.
**This one-file whitelist addition is conditional owner D1 scope execution, not a broader product decision:** [owner grant](https://github.com/SLADZARI/degradation_club/issues/227#issuecomment-6326985199); [independent defect reproduction](https://github.com/SLADZARI/degradation_club/issues/126#issuecomment-6328538890); [Lead P1 classification](https://github.com/SLADZARI/degradation_club/issues/227#issuecomment-6328589143). G6 must be repeated on new exact SHA; old PASS is historical only.

## v0.3 exact OWNER-approved WebKit native first-click correction (existing scope only)

**Authority:** owner [G4 v0.3 decision for EXACT two paths](https://github.com/SLADZARI/degradation_club/issues/126#issuecomment-6342046769). This **supersedes v0.2** without changing its six preapproved file scopes or any product permissions.

- **NEW v0.3 PATH 7:** `community/board/board-fullscreen-v2-1.js` — replace redundant identical `btn.textContent` and `onclick` writes in existing `updatePrimary()` across four current Owner/Member/Guest/occupied branches with an idempotent same-value guard and stable semantically equivalent handlers reading current state. Preserve existing membership gate, canonical composer/no-`[data-slot]` fallback, no layout/RPC/role changes.
- **NEW v0.3 PATH 8:** `community/board/board-guest-actions-v1.js` — inside existing `syncCreateCTA()`, avoid identical `button.textContent` and `aria-label` rewrites for Guest/Applicant while preserving existing denied publishing and membership-gate behavior.
- Existing `scripts/validate-board-v21-browser.mjs` (already whitelisted) may add native pointer timing/role regression assertions only; no separate test framework.
- Both JS changes must land via the sole Lead/F-01 writer on existing Draft PR #308 based on pinned original `59e3e12a08a897cab3fc61a3d8b6ca10744fc424` after refreshing the actual head; no concurrent branch/source writes.

**Evidence boundary:** original WebKit Guest/Applicant native pointer 14/80 correct vs local **compiled-only two-guard** 80/80; old behavior 220/220, current Owner 80/80 and publish/refresh 158/158 synthetic tests were on disposable candidates, NOT a committed-source G6. Independent Q-01 must evaluate a NEW exact Git SHA: >=80 fresh WebKit Owner and >=80 Guest/Applicant pointer/timer/observer scenarios at 360/390/430/1440 with no-slot variants; existing 220 behavior and 158 real-click publish/refresh, Enter/Space/Escape, focus/inert, negative role checks and exact SHA CI. Real iPhone/Safari, physical keyboard, 200% zoom, Cloud Auth/RLS/Storage and live login are NOT RUN unless separately evidenced. Failure remains G6 FAIL. New code does **not** authorize merge/deploy/Stage1 G7/G8, production backend, real DB, Nginx/DNS, games or migrations.

**ONE active integration branch**, reusing existing PR #308 branch `fix/board-composer-visual-stability-20261020`, exact production base `cde332779ab0e256dd1e498660d6fa651e91846e`. Serials: Lead/F-01 focus candidate → Q-01; F-01 P1-A → Q-01; F-01 P1-B → Q-01. Same shared Board CSS/JS must not have competing writers; update PR #308 scope/title before broadening, not a duplicate UI implementation PR. Q-01 does not self-approve.

## G6 and G7/8 boundaries
G4 CODE ONLY; no production merge/deploy, host DNS/Nginx/Certbot, Cloud Auth/DB/Storage/RLS, MDAO `/data/*`, Live code/world, or new Club features. Run full source CI + actual local browser acceptance on exact candidate SHA and safe isolated test actors. Specifically QA shall simulate **confirmed publish then refresh failure**, and verify that no failure-to-publish status or duplicate RPC occurs. Validate real-click pending lock/definite failure/invalid input on Chromium+WebKit independently. Existing #228 full Auth/PKCE/Guest/DC9/Applicant/Member/Dementor/Owner/CIRCLE RLS/private media negatives still required; signed-in live Board boot may UPDATE lifecycle RPC and cannot be treated as a read-only test. Physical mobile keyboard and 200% full page zoom require separate verdict. Source stage only until Q-01 G6 and clean G7 RC then distinct owner release GO; G8 only with live evidence.

**Stage1 site-only G4 APPROVED but WAITING**, no competing active integration branch; existing BQA-23 owner-admin remains WAITING at historical G5 with Draft PR #252 retained.
