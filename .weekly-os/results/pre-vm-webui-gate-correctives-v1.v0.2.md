---
artifactId: dementor-club.result.pre-vm-webui-gate-correctives-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: APPROVED
workStatus: ACTIVE
version: 0.2
supersedes: 0.1
updated: 2026-10-22
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssues: 126,227,228,237
ownerG4Decision: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6320105037
ownerD1ConditionalCodeGrant: https://github.com/SLADZARI/degradation_club/issues/227#issuecomment-6326985199
leadP1ScopeClassification: https://github.com/SLADZARI/degradation_club/issues/227#issuecomment-6328589143
g4Status: PASS_LIMITED_CODE_ONLY
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

# Pre-VM Web/UI v1 · v0.2 — G4 narrow post-confirmation amendment, G5 ACTIVE

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

**ONE active integration branch**, reusing existing PR #308 branch `fix/board-composer-visual-stability-20261020`, exact production base `cde332779ab0e256dd1e498660d6fa651e91846e`. Serials: Lead/F-01 focus candidate → Q-01; F-01 P1-A → Q-01; F-01 P1-B → Q-01. Same shared Board CSS/JS must not have competing writers; update PR #308 scope/title before broadening, not a duplicate UI implementation PR. Q-01 does not self-approve.

## G6 and G7/8 boundaries
G4 CODE ONLY; no production merge/deploy, host DNS/Nginx/Certbot, Cloud Auth/DB/Storage/RLS, MDAO `/data/*`, Live code/world, or new Club features. Run full source CI + actual local browser acceptance on exact candidate SHA and safe isolated test actors. Specifically QA shall simulate **confirmed publish then refresh failure**, and verify that no failure-to-publish status or duplicate RPC occurs. Validate real-click pending lock/definite failure/invalid input on Chromium+WebKit independently. Existing #228 full Auth/PKCE/Guest/DC9/Applicant/Member/Dementor/Owner/CIRCLE RLS/private media negatives still required; signed-in live Board boot may UPDATE lifecycle RPC and cannot be treated as a read-only test. Physical mobile keyboard and 200% full page zoom require separate verdict. Source stage only until Q-01 G6 and clean G7 RC then distinct owner release GO; G8 only with live evidence.

**Stage1 site-only G4 APPROVED but WAITING**, no competing active integration branch; existing BQA-23 owner-admin remains WAITING at historical G5 with Draft PR #252 retained.
