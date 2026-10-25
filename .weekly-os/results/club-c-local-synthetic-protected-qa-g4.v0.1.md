---
artifactId: dementor-club.result.club-c-local-synthetic-protected-qa-g4
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G4_PASS
status: APPROVED
workStatus: ACTIVE
version: 0.1
updated: 2026-10-25
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssues: 227,228,237,255,42
ownerDecisionRelay: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6401913107
architectProposal: https://github.com/SLADZARI/degradation_club/issues/227#issuecomment-6399836702
backendDependencyClosure: https://github.com/SLADZARI/degradation_club/issues/228#issuecomment-6401684101
preflightEvidence: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6401923386
g4Status: PASS_LIMITED_LOCAL_SYNTHETIC_QA_ONLY
executionOwner: Lead
independentQaOwner: Q-01
allowedHost: MacBook-Pro-Zena.local
allowedDockerProject: dc_c10_synthetic_g4_w132
allowedInnerDatabase: b01_c10_disposable_qa
implementationStartAuthorized: true
isolatedSyntheticDatabaseDdlDmlAuthorized: true
isolatedSyntheticActorAndStorageAuthorized: true
activeIntegrationAuthorized: false
activeIntegrationBranch: null
schemaChangeImplementationAuthorized: false
liveDatabaseMutationAuthorized: false
liveHostMutationAuthorized: false
cloudSourceReadOrExportAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
changeControlRequired: true
---

# Club C local-only protected synthetic QA — one scoped G4 / no source or production implementation

## Purpose, explicit decision and authority

The owner twice confirmed the pending **LOCAL_SYNTHETIC_CLUB_C_PROTECTED_QA_G4** in the project conversation, finally instructing Lead "да - делай" on 2026-10-25. Lead relayed the approval in [#237 W132](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6401913107), after [Architect's precise G3 plan](https://github.com/SLADZARI/degradation_club/issues/227#issuecomment-6399836702) and [Backend's W131 exact closure](https://github.com/SLADZARI/degradation_club/issues/228#issuecomment-6401684101). The existing physical preflight is [#237 W132](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6401923386).

This RESULT approves **only disposable, isolated, synthetic local QA** on the already connected Mac: local image/host preflight, creation of a fresh, uniquely named Docker project/network/volume, local PostgreSQL 17 and where source-exact dependencies permit pinned local GoTrue 2.197.0 + PostgREST + Storage API, fake UUID identities and fake private media, a narrow C10-R1 source-exact test, local committed synthetic writes and exact-project teardown after evidence. **No new spend, no new external provider.** This is a *supporting test Result*, **not an active source-integration Result** and it does not supersede PROJECT's sole WebUI v0.3 CURRENT_RESULT/PR #308, whose source whitelist stays unchanged.

## Immutable inputs

- Production **source** (not runtime): `SLADZARI/degradation_club@dementor-club-production` commit `cde332779ab0e256dd1e498660d6fa651e91846e`, no source edit.
- Existing immutable B-01 C10-R1 review-only archive on Mac, SHA256 `70148eebdddd4dad4dc41d11e6ee864abb17e87a3c86121f8e9b8886cde65318`; parent W105 complete-body archive SHA256 `02ad37c421b049471d1b9e80bf2fde622bc5d3bce2eef94344c07616a1cb015e`.
- W104 saved exact source function/ACL observations, W105 ten MD5 source match and 69-function graph; B-01 W131 ten C10 roots + eight helpers + 24 public tables, auth.users and nine Owner regclass literal references. Raw original source proacl bytes and real target owner-issuer contract **UNKNOWN**, do not fabricate.
- Existing local preloaded pinned images (confirm digests again at launch, no pull): `postgres:17-alpine` `sha256:b0f9560a2de083e2cc7382e75f808c7381a32852a7ec49117deedb300e552b24`; `public.ecr.aws/supabase/gotrue:v2.197.0` `sha256:1736a63078f5922b198c4cbe50f80ab9a2d3b54fe8b7b6cfb2e9dc5dbbc12c6b`; `public.ecr.aws/supabase/postgrest:v14.3` `sha256:7c5840727ad683b0fdbfb9810930665b34f8b44884a4dc740aa8844748a2b85e`; `public.ecr.aws/supabase/storage-api:v1.35.3` `sha256:5a3ecdc67dbe9e88a56810b5b2f432f2d93708dcb4dc9de34e78e342b390eb4d`. Do not change pre-existing running GoTrue v2.186.0.

## Strict execution whitelist / physical containment

1. **Only** MacBook-Pro-Zena.local, a **new** Docker Compose project `dc_c10_synthetic_g4_w132` and local DB `b01_c10_disposable_qa`; all created resources must carry unambiguous `dc-c10-g4-w132` ownership labels. Unique network and volume, no mounts from any other service/container, existing database or secrets directory. Never use preexisting `dc-b01-qa-pg17`, its volume, or any `supabase_*` container/volume/network.
2. **Internal-only network, no egress by default**; initial PostgreSQL fixture exposes **zero host ports**. For explicitly justified local HTTP actor testing, only `127.0.0.1` new nonconflicting ports; validate listener and network against no public access. No published public IP, host tunnel, VM, OAuth redirect, DNS or Nginx. All mock keys generated locally for this fixture only; no real project environment/secrets, real tokens, Google callbacks or auth credentials in scripts or GitHub.
3. No image pull, paid CI or external fetch inside test containers. Before creating anything, recheck Docker daemon, local image digests, 12 neighbor containers/status, networks/volumes/port conflicts, ~8 GiB Docker VM memory and disk headroom. If resource, egress or object collision occurs, **STOP before container action**. Limit CPU/memory and do not alter neighbor resource allocation.
4. Local ephemeral SQL/DDL/DML only **inside the exact created fresh project** and only synthetic data. Never blindly replay all 60 historical migrations: the `legacy_edu` renaming and shared-table assumptions are source-equivalence STOP. No placeholders to turn absent function signatures/MD5/proacl/JWT into a PASS. Missing immutable-source completeness → report `BLOCKED_FIXTURE`.
5. Scope excludes live Cloud Supabase DB/Auth/RLS/Storage/Edge, exports, 11 real users, session/JWT/material, Cloud Google/PKCE, Club production, VM, Stage1/Stage2 cutover, shared `/data/*`, MP, Robo, MDAO, game ALPHA/BETA/world/saves/CharacterId, cron/Vault/workers/Telegram, code/PR updates, and any public release. Stage1 G8 stays OPEN; Stage2 real host/data G4 and G7 remain NO-GO.

## Two technically distinct test protocols and evidence grades

**T: transaction-only PostgreSQL 17 (one DB connection):** build **source-exact** ten root full bodies, eight reachable helper definitions, 24 public relations, `auth.users`, relevant FKs, policies and Owner nine literal `regclass` names from frozen existing sources; expand four relevant triggers/helper closures if test covers them. Prove exact signature and body-MD5 source precondition; record OID, proowner, proacl (including effective authenticated/anon/PUBLIC/service_role EXECUTE), search_path, pg_depend/operator shadow resolution. Apply exact C10-R1 9 ALTER + 1 same-signature Owner replace only inside `BEGIN … ROLLBACK`; prove **all local before/after/rollback invariants** in the same connection. Source raw proacl parity remains UNKNOWN if not captured; do not claim target/source byte match from effective role counts. Never equate T with HTTP actor verification.

**H: committed but **separate disposable local copy** for real HTTP/token actor:** only after T provenance checks and independent Q-01 accepted fixture. Local genuine GoTrue-issued permanent Owner positive with exact UUID + JSON boolean `is_anonymous=false` + active Owner row, signed anonymous (even with fake old Owner row), revoked, new UUID/same email, foreign/member/dementor, invalid/wrong issuer, expiry, missing/invalid claim negatives via local verifying PostgREST. Fake GUC `SET request.jwt.claims`, hand-signed JWT or a mock are **not** real-issuer PASS. Synthetic RLS/Board hidden/CIRCLE private Storage byte read via Storage API, Guest read→normalizer UPDATE, non-idempotent interest toggle, Workspace two-course conditional onload INSERT/UPSERT and before/after + reload. A transaction-only ROLLBACK is invisible to HTTP DB sessions: H must be committed *only within disposable project* with controlled teardown, never in real Cloud. No false assumption that local issuer tests prove real 11 Cloud users or Google PKCE.

**EVIDENCE:** exact versions and SHA, source completeness matrix, redacted actor types and HTTP codes (not secrets), synthetic row digests/counts, ACL OID/proacl before vs after and ROLLBACK, side-effect records, isolated network and independent Q-01 verdict. Report PASS/FAIL/BLOCKED_FIXTURE/NOT_RUN **per layer**, do not label whole G6 accepted from T alone.

## Ownership / stop / rollback

**Lead** owns scoped local integration/decision and confirms this Result before any Docker start. **SRE #255** independent resource/neighbor isolation checkpoint and safe teardown advice; **Backend B-01 #228** exact source projection and T execution within gate; **Q-01 #42** independent (not author) security/actor/Storage/rollback acceptance. No redundant retest of W105 362/362, C10-R1 149/149+9/9, PR308 WebKit W99. One local experiment at a time; checkpoint/handoff when needed.

Rollback: stop/remove **only** exact `dc_c10_synthetic_g4_w132` project, network and verified labeled dedicated volumes after Q-01 has retained evidence; verify these disappeared while all 12 preexisting neighbor names/status/ports are unchanged. Do not run unscoped `prune` or global `down -v`; never delete unrelated volumes if labels mismatch. STOP after two nonproductive attempts, communicate blockers to Lead/owner without increasing scope. **New cost $0 / production effect NONE.**
