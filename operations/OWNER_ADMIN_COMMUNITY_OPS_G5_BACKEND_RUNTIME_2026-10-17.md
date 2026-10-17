---
artifactId: dementor-club.operations.owner-admin-community-ops-g5-backend-runtime-2026-10-17
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: BUILD
gate: G5_BUILD
status: PASS_BACKEND_LOCAL_ONLY
version: 1.0
updated: 2026-10-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.owner-admin-community-ops-v1
parentQa: BQA-23
integrationBranch: result/owner-admin-community-ops-v1
validatedSourceHead: c44e460149a1030fedeac1e54a617cc9c5a27b5f
productionBaseline: cde332779ab0e256dd1e498660d6fa651e91846e
runtimeValidated: true
runtimeTarget: DISPOSABLE_LOCAL_SUPABASE
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# BQA-23 · G5 backend local runtime evidence (2026-10-17)

## Verdict

**BACKEND G5 LOCAL RUNTIME PASS: two independent validator executions surrounding a clean local database reset.**

This is a local backend sub-gate result, **not** full G5 frontend/auth or live acceptance, G6 approval, production readiness, merge/deploy or VM migration authorization.

## Actual execution and source

The operator ran, from a separate clean macOS worktree `/Users/zena/degradation_club_bqa23`:

```bash
git pull --ff-only origin result/owner-admin-community-ops-v1
node scripts/validate-owner-admin-community-ops-disposable-local.mjs
```

The complete sanitized JSON result was supplied directly in the BQA-23 handoff chat on 2026-10-17. This file transcribes that reported terminal output; it is **not** an independent remote execution or a stored signed CI artifact.

| Property | Reported actual result |
| --- | --- |
| Branch | `result/owner-admin-community-ops-v1` |
| Exact source HEAD | `c44e460149a1030fedeac1e54a617cc9c5a27b5f` |
| Docker engine | `29.2.1` |
| Supabase CLI | `2.75.0` |
| Disposable project | `dc-bqa23-28413-99c8fe` |
| Isolated local ports | API `43061`, DB `43062`; base `43060` |
| Final phase | `PASS_LOCAL_RUNTIME` |
| First runtime | `PASS_LOCAL_SUPABASE` |
| Second runtime | `PASS_LOCAL_SUPABASE` |
| Reset warning | `null` |
| Overall backend verdict | `PASS_LOCAL_SUPABASE` |
| Cleanup | `DISPOSABLE_STACK_REMOVED` |

Both first and second runtime reported each of:
- `static_validation: PASS`
- `repeatable_migration: PASS`
- `owner_admin_gate: PASS` (synthetic active Owner role **and membership**, ordinary Member negative)
- `same_name_disambiguation: PASS`
- `no_email_projection: PASS`
- `slot_formula: PASS`
- `grant_history: PASS`
- `membership_status: PASS`

The disposable runner separately checked the local migration ledger for `20260924002500` and `20260930180000`, plus presence of the two new RPC signatures, **before both runtime passes**. Local fixture mutations never targeted live Supabase.

## Root cause of the first runtime failure, now resolved

At source head `31b071896cd6e8251650f7b0237969eeb4539361`, synthetic Owner profile had an active `owner_admin` role but no active `dc_system_memberships` row. Canonical `dc_is_owner_admin` calls `dc_has_role`, which requires both. PostgreSQL correctly rejected the RPC with `OWNER_ADMIN_REQUIRED`.

The local test fixture alone was fixed in `c44e460149a1030fedeac1e54a617cc9c5a27b5f`; no production SQL migration, persistent state, rights or semantic rule changed.

Prior environment blocker `operations/OWNER_ADMIN_COMMUNITY_OPS_G5_RUNTIME_ENV_BLOCKER_2026-10-17.md` remains an accurate historical observation of the **assistant** container without Docker; that environment limitation was bypassed via this isolated **operator Mac** proof and is no longer a blocker for backend local execution.

## CI and integration boundary

- Site Integrity #1343 [SUCCESS on exact validated SHA](https://github.com/SLADZARI/degradation_club/actions/runs/39033378713).
- PR [#252](https://github.com/SLADZARI/degradation_club/pull/252) remains Draft/Open/Unmerged, target `dementor-club-production`.
- CI browser acceptance uses mocked RPC fixtures for flow/visual verification. Real guest/ordinary-Member direct-route browser negative behavior and end-to-end authenticated live integration are **not** proven by this backend-local JSON alone.
- No live DB mutation, production merge/deploy, DNS/OAuth or shared VM service change was made.

## Next checkpoint

Independently verify outstanding G5 route access and privacy negative cases (guest/member), then perform G6 exact diff / frontend-backend boundary review against production baseline and record an independent QA decision. G7 clean RC only after G6 PASS; G8/live only after owner release authorization and deployment.
