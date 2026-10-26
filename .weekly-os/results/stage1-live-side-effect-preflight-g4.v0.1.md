---
artifactId: dementor-club.result.stage1-live-side-effect-preflight-g4
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G4_PASS
status: APPROVED
workStatus: WAITING_SRE_DESIGN_AND_PRIVATE_ACTOR_MAP
version: 0.1
updated: 2026-10-26
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssues: 237,255,256,42
ownerDecisionRelay: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6418034431
leadPriorCheckpoint: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6417895517
sreW144AuthorDesign: https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6417650501
independentQ01Blocker: https://github.com/SLADZARI/degradation_club/issues/42#issuecomment-6417444376
g4Status: PASS_LIMITED_PROTECTED_PREFLIGHT_CONDITIONAL
productionSourceCommit: cde332779ab0e256dd1e498660d6fa651e91846e
implementationStartAuthorized: true
scopedLiveCloudReadOnlyPreflightAuthorized: true
scopedEncryptedAffectedRowRecoveryCopyAuthorized: true
isolatedDecryptAndRestoreAuthorized: true
protectedLiveBrowserOrAutoWriteExecutionAuthorized: false
sourceOrCloudSqlDdlDmlAuthorized: false
activeIntegrationAuthorized: false
activeIntegrationBranch: null
schemaChangeImplementationAuthorized: false
liveDatabaseMutationAuthorized: false
liveHostMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
stage2CloudDataExportOrCutoverAuthorized: false
changeControlRequired: true
---

# Stage1 live side-effect safety preflight v0.1 — narrow Owner G4, NO protected browser GO

## Authority / precise distinction

Owner explicitly approved all *listed* Lead W144 preflight prerequisites in the ongoing project conversation on 2026-10-26 ("все разрешаю"). Lead's redacted, bounded owner-consent relay is linked in front matter. This is a **supporting protective QA Result**, not a WebUI implementation Result, project-wide change of Product/Domain/Architecture, Stage2 migration, live Club modification, or new PR. It does **not** supersede PROJECT.currentResult (WebUI v0.3 / PR #308) and does not change the existing Stage1 site-only Result v0.2 or its original host/data permissions. Its only additional authority is tightly scoped *read-only Cloud preflight* and *independent recovery-copy verification* to safely decide whether one live QA journey can be authorized later. Stage1 is currently LIVE / G8 OPEN; Stage2 real host/data G4, human G7 and cutover remain NO-GO.

Current actual served source is `dementor-club-production@cde332779ab0e256dd1e498660d6fa651e91846e`, VM static release under the established Stage A root, backed by existing Cloud Supabase. Draft PR #308 (`a71eb033643d2c26f25db5a41a202f5a30433c59`) is **not** the served build; the temporary preview was rolled back. Review evidence: Dev2 W142 #256, protected W143 plan #256 and Q-01 #42 blocker. No claim of complete 468-file reverse build parity or existing production site rollback execution.

## Allowed, serial, and **only after each listed prerequisite**

**0 — SRE independent design checkpoint (no Cloud commands yet).** SRE #255 reviews the existing frozen private W144 source/plan and returns `SRE_SIDE_EFFECT_CONTROLS_DESIGN_READY` or `BLOCKED_<exact gap>`. Verify the live project identity, actual read-only facility/operator, the source-defined auto-write set, minimal rows, retention/custody protocol, concurrency-safe restore and privacy boundaries. If source data ownership, live Cloud target, or side effects are not provably bounded, STOP the disputed data access.

**1 — Actor/artifact/operator private binding.** Operator Nikita (previously owner-designated), under SRE and Lead coordination, verifies own authorization and the exact live Cloud project, binds genuine *existing* Owner and Member identities to server-authoritative AccountId/role and verified account-holder consent. Select exactly **one** previously existing consented test Artifact, verifying the owner has consented to it and it is safe for test. Store real UUIDs, emails, tokens, browser storage, secrets and selected Artifact URL **only in the approved private custody location**, never GitHub. If no safe real fixture is available, `BLOCKED_FIXTURE`; do not choose an unrelated member's record. Guest/DC9/Applicant/Dementor cannot be silently promoted to consented live fixtures.

**2 — Constrained Cloud safety reads only.** After steps 0–1 and exact source-table identification, inspect only safe affected-row **metadata and minimum necessary current row state** for:
- `public.dc_artifacts` rows that a single Board/detail lifecycle normalization might alter *at the proposed test clock/window*, including other owners' rows **only where their inclusion is proven relevant to the automatic normalizer**;
- exactly the authorized fixture in `public.dc_artifact_reactions` and proven limited dependent counters/audit/trigger targets;
- authorized test actor's possible on-load `course_enrollments`, `dc_progress_signals`, `dc_program_certificates` and source-proven related row effects;
- only the minimal Auth/account proof necessary to verify source and actor; no credentials, secrets or broad identity export.
Read existing source-only function/trigger/policy/ACL metadata insofar as needed to build the exact side-effect set. If source-effective eligibility or a cross-product shared table is UNKNOWN, STOP that data scope, do not query blindly. Capture privately timestamp, exact permitted query inventory, operator/evidence hashes, owner/row version and non-test-row concurrency protections. A `COUNT(*) = 0` in one instant is not an adequate side-effect proof.

**3 — Scoped encrypted safety recovery and isolated restore.** After independently evaluating the exact row subset and data permissions, create an encrypted *minimum necessary* backup/safety copy of the authorized records only (no whole-Cloud DB, Q/WAL, cross-product ownership, unrelated private Storage bytes, OAuth/session keys or account transfer); retain private ownership/hash/custody manifest and recovery keys only under the authorized custodian. Verify **decryption and actual independent cold/differential restoration into an isolated copy**, preserving rows outside the permitted set; establish idempotent, conditional per-row restore, compare version/updated_at/hash and avoid clobbering legitimate expiry or concurrent real business changes. Two physically distinct Owner-designated Mac custody choices are historical agreement, **NOT** evidence of actual two encrypted copies or successful restore. If credentials/medium/ownership cannot be proved, status `BLOCKED_RECOVERY`.

**4 — Independent QA readiness, but not test execution.** SRE publishes redacted `SIDE_EFFECT_CONTROL_PASS_SCOPED` with privately retained hashes, before state, isolated restore and timeout/rollback controls or exact BLOCKED. Q-01 #42 reviews only the newly unblocked W143 live test and returns `QA_PLAN_READY_CONDITIONAL` or exact BLOCKED. Lead issues a **separate** exact `PROTECTED_EXECUTE_GO` only after both, after verifying exact private actor+Artifact map, consent, allowed observation window and production-site rollback readiness. Such a later GO covers at most one Member `Интересно` action/undo and the real Google→Board→Artifact→reload/login role flow under an observed before/after protocol with iPhone Safari 200% human evidence. `G7` human release decision and `G8` live acceptance remain separate; no automatic approval from this Result.

## Strict STOP / exclusions

- **NO** Board/Workspace JavaScript hydration, real OAuth callback navigation, background expiry normalization, course import or live QA action under this preflight Result. A normal GET may write Cloud data. No public site/VM restart or configuration changes.
- **NO** unbounded sensitive Cloud queries/exports, writes of SQL/DDL/GRANT/RLS/Storage/Auth, bulk Q/WAL, existing MP/Robo/MDAO/game data access, membership or entitlement changes, DC-9 reset, original user-account transfer, product redesign, old-alias identity remap, credential or key disclosure, DNS/OAuth/VM changes, ALPHA/BETA/PAPER/CharacterId touches, PR #308 change/merge/deploy, new paid CI/provider or production cutover.
- **SOURCE_CONFLICT:** stop the disputed object only and preserve independent nonblocked reviews; `course_enrollments` source CHECK/ACL/client mismatch remains a separate protected problem in #228/#227, not fixed by this G4.
- **STOP_LIVE_SIDE_EFFECT:** if unrelated Artifact lifecycle state cannot be safely bounded without unapproved mutations, or if any proposed rollback would overwrite legitimate user edits / time-driven expiry, there is no safe live UI test. Use a separately authorized isolated, source-equivalent clone and keep Stage1 G8 OPEN.
- Private row data and ACL details remain in approved custody; GitHub stores only redacted status, source commit, nonsecret evidence fingerprints and the narrow next action.
- Independent Q-01 cannot self-approve Owner G4 or Lead GO; SRE design PASS is not an executed backup; author static PASS is not independent runtime G6.

## Acceptance and reporting

**Preflight PASS_SCOPED** needs all of: verified SRE design and source boundary; consented verified actor/Artifact private map; time-bounded row/trigger side-effect inventory; immutable private before receipt; encrypted least-scope snapshot; independently verified **isolated decrypt/restore** with tested version-safe differential and rollback; untouched out-of-scope data; independent Q-01 plan readiness. Otherwise explicitly `BLOCKED`/`NOT_RUN`, not PASS.

Report in #255/#237/#42: `STATUS | RISK PROTECTED | Issue/comment | SHA/hashed private evidence | DELTA | TEST PASS/FAIL/BLOCKED/NOT_RUN | BLOCKER | NEXT | COST +$0/PRODUCTION EFFECT NONE`. Retain W138/W140 accepted *local synthetic* evidence without rerunning unchanged fixtures. This Result itself executes **no** Cloud/VM/user mutation.
