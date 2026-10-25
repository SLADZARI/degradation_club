---
artifactId: dementor-club.result.stage1-rc-qa-preview-24h-g4
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G4_PASS
status: APPROVED
workStatus: WAITING
version: 0.2
supersedes: 0.1
updated: 2026-10-25
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssue: 237
ownerG4Decision: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6391163452
leadStopDecision: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6398847484
stageCleanupEvidence: https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6398876421
g4Status: STAGE_HOST_CLOSED_AUTH_ALLOWLIST_CLEANUP_PENDING
implementationStartAuthorized: false
temporaryStageHostMutationAuthorized: false
stageOnlyDnsTlsNginxMutationAuthorized: false
productionHostMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
schemaChangeImplementationAuthorized: false
activeIntegrationBranch: null
changeControlRequired: true
---

# Stage1 exact-RC temporary HTTPS QA preview · used and closed, Auth cleanup WAITING

**Authority history, not reusable deployment authorization.** Owner granted one single-use, zero-extra-cost <=24h `STAGE1_RC_QA_PREVIEW_24H_G4` on 2026-10-25. Source G4 v0.1 previously permitted exactly one staging HTTPS origin and no live data mutation, schema/rights, production release or Stage2 host work. **This v0.2 supersedes the active staging host lease and sets all stage host deployment/redeployment authorizations false.** Existing WebUI v0.3/current PR #308 Result, Stage1 public site Result, Stage2 and other Project lanes are unchanged.

## What actually ran
- Temporary isolated `https://stage1-rc-56c7c78.dementor.club/` served the exact detached frozen RC commit `56c7c78ae4e01d2bd26168103d1d0de05c41ab47`, tree `99318667ef5fe189efebd072368e1583e213ede3`, 468 files. Source-to-serving file parity, browser signed-in UI, TLS, HTTP Basic 401/200, and real existing Artifact UUID same-origin 302→200 path were **PASS_SCOPED**, not full protected G6.
- First independent external TLS availability observed **2026-10-25 13:39 UTC**. A new stage-only A record, dedicated new-only Nginx vhost and stage-specific free ACME TLS were used; production vhost source/config hashes remained unchanged.
- Owner self-attested addition of exact single Auth Redirect URL `https://stage1-rc-56c7c78.dementor.club/auth/callback/*`; Auth Management API and live Google PKCE matching were **not independently verified**.
- Lead W125/W126 static source verification identified **possible, not proven in this session**, automatic Cloud writes on normal actor UI loads: member Board `loadBoard()` calls SECURITY DEFINER lifecycle normalizer with `UPDATE dc_artifacts` on eligible expired rows; guest Board/detail read RPCs normalize; Workspace `workspace-enhancements-v1.js` auto-calls `importLocal()` when session exists, conditionally `INSERT/UPDATE course_enrollments` and `UPSERT dc_progress_signals` if local progress is present. Original owner G4 explicitly excluded live user data mutation, so protected actor/Storage/RLS/PKCE QA remained **BLOCKED_SIDE_EFFECT / NOT_RUN**. No conclusion that user data did or did not change.

## Exact NEW-ONLY rollback actually executed and verified
- Lead STOP: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6398847484.
- SRE actual operator rollback report: https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6398876421.
- New stage-only rollback script ran successfully **2026-10-25 14:25:57–14:26:00 UTC**, returned `STAGE_A_DELETE_PASS` and `STAGE_ROLLBACK_PASS`, exit 0.
- Post-execution authoritative provider GoDaddy GET returned **0 exact stage A records**; temporary stage Nginx file/symlink, static site root and ACME cert+renewal config absent; `nginx -t PASS`; existing Club/Live Nginx SHA unchanged; live canaries `dementor.club 200`, `play.dementor.club 200`, `alpha.dementor.club 302`, pre-existing MDAO/n8n `502`, game container healthy, `db-dev` running. A public recursive resolver briefly retained old stage IP within normal TTL; not provider DNS state.
- Root `at` job #1 removed **after** confirmed cleanup; `atq` empty at **2026-10-25 14:27:30 UTC**. No new VM resources/services left from this preview.

## One unresolved closure obligation — DO NOT MARK CLEAN
**Owner-managed Supabase Auth ninth redirect entry remains UNVERIFIED/NOT_REMOVED.** On a separate authenticated Supabase Auth → URL Configuration tab, remove **ONLY** `https://stage1-rc-56c7c78.dementor.club/auth/callback/*`. Do not change `Site URL=https://dementor.club` or any of the prior eight redirect entries, Google provider callback, Auth users or data. Independently confirm the list count is back to 8; only then may Lead issue a v0.3 `workStatus: CLOSED` closeout. No accessible connector currently supports this management edit in the active session. Do not infer successful removal.

**Current workStatus WAITING** is exclusively this single cleanup item, not permission to reactivate stage. **Full G6 INCOMPLETE; public G7 NO-GO; Stage1 G8 OPEN; Stage2 Host/Data G4 NO-GO**. Further protected tests need a new source-authoritative, risk-scoped G4/fixture and independent Q-01, not silent reuse of this spent preview.
