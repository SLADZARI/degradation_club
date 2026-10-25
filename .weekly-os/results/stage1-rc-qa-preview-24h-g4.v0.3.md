---
artifactId: dementor-club.result.stage1-rc-qa-preview-24h-g4
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G8_CLEANUP
status: APPROVED
workStatus: CLOSED
version: 0.3
supersedes: 0.2
updated: 2026-10-25
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
parentIssues: 237,255,256,42
hostRollbackEvidence: https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6398876421
g4Status: STAGE_PREVIEW_CLOSED_OWNER_ATTESTED_AUTH_RULE_REMOVAL
implementationStartAuthorized: false
temporaryStageHostMutationAuthorized: false
stageOnlyDnsTlsNginxMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
schemaChangeImplementationAuthorized: false
activeIntegrationBranch: null
changeControlRequired: true
---

# Stage1 temporary exact-RC QA preview — scoped closeout v0.3

**Closure scope:** the single-use temporary Stage1 RC preview, **NOT** Stage1 public site G8, WebUI G6 full acceptance or Stage2 migration. Reuse/redeploy remains forbidden. See superseded [v0.2](stage1-rc-qa-preview-24h-g4.v0.2.md) for complete setup, preserved test gaps and no-data-write STOP.

## Proven rollback
SRE independently recorded execution and checks in [#255 W127](https://github.com/SLADZARI/degradation_club/issues/255#issuecomment-6398876421): staged source/vhost/cert/root removed, GoDaddy exact stage A=0, pre-existing Club/Live service config SHA unchanged, at cleanup cancelled only after rollback pass. Actual rollback 2026-10-25 14:25:57–14:26:00 UTC. Owner 24-hour limit met and extra cost $0.

## Owner-reported Auth redirect cleanup
After Lead W129 asked for removal of the **one** temporary Supabase Auth redirect pattern, owner responded in project conversation on 2026-10-25 **"сделал"**. Record **OWNER_ATTESTED_REMOVED**, not independently read via Auth Management API or confirmed by an authenticated screenshot. Expected removal: `https://stage1-rc-56c7c78.dementor.club/auth/callback/*`; original eight redirect rules and `Site URL=https://dementor.club` should remain. Actual post-change URL count and exact settings are **NOT_INDEPENDENTLY_VERIFIED** because available Supabase connector does not expose Auth URL Configuration. If a later authorized UI read shows drift, reopen cleanup as a separate corrective; do not claim runtime provider verification or delete other rules.

## Acceptance / limits
`TEMP_HOST_ROLLBACK=PASS_SCOPED`; `AUTH_CLEANUP=OWNER_ATTESTED_ONLY`; `PREVIEW_WORKSTATUS=CLOSED`; `STAGE1_PUBLIC_G8=OPEN`; `FULL_PROTECTED_G6=INCOMPLETE`; `G7=NO_GO`; `STAGE2_HOST_DATA_G4=NO_GO`. Existing W125/W126 findings of possible automatic Board lifecycle and Workspace progress DML remain blocking real Cloud "read-only" UI tests. No actual row-write evidence or live pre/post diff was collected. Any new protected fixture requires a separate approved G4. No secrets, real users or Storage paths added to evidence.

**PRODUCTION EFFECT of this governance closeout: NONE. No source/host/DNS/Cloud/DB/role/VM mutation authorized.**
