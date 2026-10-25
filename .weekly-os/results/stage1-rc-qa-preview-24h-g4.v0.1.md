---
artifactId: dementor-club.result.stage1-rc-qa-preview-24h-g4
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
parentIssues: 237,255,256,42
ownerG4Decision: https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6391163452
ownerAuthPathAmendmentEvidence: https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6398157493
g4Status: PASS_LIMITED_TEMPORARY_STAGE_PREVIEW_ONLY
implementationStartAuthorized: true
temporaryStageHostMutationAuthorized: true
stageOnlyDnsTlsNginxMutationAuthorized: true
productionHostMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
schemaChangeImplementationAuthorized: false
activeIntegrationBranch: null
changeControlRequired: true
---

# Stage1 exact-RC temporary HTTPS QA preview · 24h isolated G4

## Authority, source and special status
Owner approved **exactly** `STAGE1_RC_QA_PREVIEW_24H_G4` in [Lead W109](https://github.com/SLADZARI/degradation_club/issues/237#issuecomment-6391163452) and explicitly confirmed existing operator/host permissions in the 2026-10-25 project conversation. Owner viewed **eight** existing Supabase Auth URL entries and subsequently personally reported **"добавлено"** after being given precisely the single stage-only callback rule `https://stage1-rc-56c7c78.dementor.club/auth/callback/*`. This attests the owner's intentional **narrow path/query amendment**, not an independently verified remote Auth configuration or a working Google session. No broader wildcard is authorized.

This Result authorizes **one disposable QA support environment only** alongside the current `pre-vm-webui-gate-correctives-v1` v0.3 G5 code Result. It is **not** an active integration/release branch and does not promote the waiting Stage1 site-only Result, Draft PR #308/#257, Board pointer integration, Stage2 Club C, G6, G7 or G8. Existing WebUI whitelist and release authority remain unchanged.

**Exact bytes:** detached frozen source commit `56c7c78ae4e01d2bd26168103d1d0de05c41ab47`, tree `99318667ef5fe189efebd072368e1583e213ede3`, based on `dementor-club-production@cde332779ab0e256dd1e498660d6fa651e91846e`; 468 static files. Existing Mac sealed transfer tar SHA256 `a5142ff448aecb2e0a81d857fa4bc686bcddea0e7f9d445188249695ba43fc48`. No source recompile, changes, new PR or alternative SHA permitted.

## Approved, strictly bounded changes
- **ONE hostname** `stage1-rc-56c7c78.dementor.club`, authoritative GoDaddy A record pointing only to independently verified existing shared Club VM `138.199.144.94`, single-stage HTTP-01 challenge for a new free TLS certificate, and a **new dedicated** Nginx staging-only server block. Never change apex/www or any existing production/ALPHA/BETA, IP/default, MDAO/n8n, MP/Robo vhosts or other services. Reuse existing host capacity, cost $0 incremental.
- Stage root contains only frozen 468-file build and stage-only configuration. An HTTPS QA access guard must restrict ordinary pages to consented testers; HTTP may expose **only** ACME challenge, not the Club. `X-Robots-Tag: noindex`, avoid request/query/secret logging. Stage-specific Artifact deep route `/community/artifact/<valid UUID>/` must preserve UUID into frozen `/community/artifact/?id=<UUID>`, refresh/back and same-origin `/auth/callback/?next=...`; no global rewrite. The actual session and private Storage still hit existing Cloud Supabase and must retain source RLS.
- In Supabase Auth Redirect URLs, the **only** added path-scoped rule is `https://stage1-rc-56c7c78.dementor.club/auth/callback/*` as owner attested. Preserve Site URL, all original eight redirect entries, Google provider callback and secrets. **No further Auth mutation** under this Result. The owner will remove the added single rule after QA; until independently verified removed, mark Auth cleanup incomplete.
- Owner-attested operator routing: authorized Mac `MacBook-Pro-Zena.local` has a pre-existing known-host-verified dedicated ED25519 SSH key granting read-only verified access to VM `bot-m`; named operator Nikita and neighbor guardian Kirill remain accountable as previously confirmed by owner. Access proof is **not** personally signed human ACK; do not invent identities or attribution.
- **Maximum lifetime 24h from observed activation**, may end sooner. Before any DNS/TLS/Nginx change, record targeted before-state and install a verified **new-only automated teardown** task scheduled no later than 24h from first exposure; undo stage vhost/files, stage DNS A and new certificate without touching any pre-existing config. Manual or owner-mediated Auth allowlist cleanup remains an explicit closure obligation; never delete arbitrary config/records in case of conflict.
- Stage must fail-closed if the no-cost host, vhost isolation, A record ownership, SSL challenge, exact SHA/468 parity, scheduled teardown, redirect query matching, restricted access or rollback checks fail. `nginx -t` and neighbor canaries pre/post, including pre-existing n8n 502 as debt, are mandatory; stop/rollback on newly introduced regression. Never use raw JWTs, callback codes, private UUIDs, credential strings or raw session headers in public evidence.

## Conditional execution / test and exit
The named operator may issue stage-only `EXECUTE_GO` in the parent #237 **only after this source-authoritative Result is present** and preconditions above are measured. This exception applies only to the disposable QA preview, not Stage1 live/prod or Club C.

After successful stage HTTPS and exact built-byte proof, Dev2 #256 independently checks origin, Google callback, real Artifact UUID route/reload/back and TLS. Q-01 #42 independently checks consented real Owner/Dementor/Member session, authorized/forbidden Artifact/CIRCLE metadata and private Storage; no new users/roles/data/SQL/Storage writes, no lifecycle-mutating READ RPC or non-idempotent toggle under this G4. Guest/Applicant/Revoked and iPhone Safari 200% remain NOT_RUN without approved fixtures/device. Only exact SHA + real issuer/browser evidence can support Full G6; HTTP200/302, static/browser mocks and host presence are insufficient.

End by restoring/cleaning stage-only DNS/vhost/TLS and owner-verified removal of the ninth redirect rule; log START/END and canaries with sanitized receipt. No G7 or production cutover, no Stage2 migration, no GitHub-paid CI.

**At registration:** owner Auth rule addition self-attested; HTTPS stage, live allowlist match, rollback test, protected G6 **NOT RUN**. Production effect none before actual stage deployment.  
