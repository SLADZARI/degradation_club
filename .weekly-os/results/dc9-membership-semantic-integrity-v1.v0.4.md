---
artifactId: dementor-club.result.dc9-membership-semantic-integrity-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G7_RELEASE
status: DRAFT
version: 0.4
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.3
---

# MP | Dementor Club | BUILD | DC-9 / Membership Semantic Integrity v1 | v0.4

## Goal
Remove semantic and state-integrity drift between DC-9 local state, account sync, sphere identity, first-complete baseline, application gate, membership validity, Interest Map server invariants and Supabase client ownership without changing the approved Membership lifecycle.

Protected boundary:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

## Status
**IN_PROGRESS / G7 RELEASE / DB APPLIED + SMOKE PASS / FULL G6 PASS / PRODUCTION MERGE+DEPLOY AUTHORIZED**

Implementation branch: `agent/dc9-membership-semantic-integrity-v1`  
Implementation PR: `#136` → `dementor-club-production`  
Production baseline: `a9511a271fbb3524c486c2a9ecd0dc8a3ff22380`  
Validated candidate head: `7a7db50038e14e89c7ac85c28311a61a992eb49a`  
Full validation: Site Integrity / Release Readiness **#893** (`34256560528`) — **SUCCESS**  
Canonical QA ledger: `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`

## Implemented QA cluster
This Result owns `QA-MEM-035…042`.

1. Account sync uses a deterministic non-destructive state merger preserving drafts, remote recovery, immutable first-baseline history, repeat history and unknown forward-compatible fields.
2. `self-development` is normalized to canonical `self_development` before persistence and source-key generation.
3. Application and Entry Status use `dc_first_complete_baseline_v1()` as canonical 9/9 authority rather than a second latest-per-sphere permission model.
4. Application RPC validates the Interest Map server-side: exactly nine canonical integer keys, each 0..100, total exactly 100.
5. Server membership decisions use `dc_membership_active()` validity-window semantics rather than raw `status='active'` alone.
6. Join storage/runtime path handling normalizes the legacy `/degradation_club/` prefix without making it canonical production routing.
7. Account sync and GlobalHeader reuse `community-runtime-v1.js → getClient()` rather than creating another Supabase session owner.
8. Sync-integrity, semantic-authority and browser recovery contracts are wired into the existing Site Integrity workflow.

## Database release evidence
Tracked migration is aligned to the live registry identity:

`supabase/migrations/20260908132816_dc9_membership_semantic_integrity_v1.sql`

Production Supabase migration registry contains:

`20260908132816_dc9_membership_semantic_integrity_v1`

Safety sequence before live mutation:
1. current production functions, constraints and migration registry inspected read-only;
2. complete candidate SQL executed inside `BEGIN … ROLLBACK` on production Postgres — `dry_run_ok`;
3. the same candidate migration was then applied through the migration API.

Post-migration smoke PASS:
- both replacement RPCs remain `SECURITY DEFINER`;
- EXECUTE remains granted to `authenticated`, not `anon`;
- canonical complete/incomplete baseline integrity scan reports no mismatches;
- `dc_membership_active()` matches explicit validity-window evaluation for current membership rows;
- Entry Status preserves historical response fields while using canonical permission semantics;
- active Member application guard returns `ALREADY_MEMBER` before writes;
- incomplete DC-9 application guard returns `SPHERE_GATE_INCOMPLETE` before writes.

## Migration-history reconciliation
An initial repository filename used version `20260908135500` while the live production registry recorded `20260908132816`.

Before code merge this was reconciled so that:
- remote registry version = `20260908132816`;
- tracked repository migration = `20260908132816_dc9_membership_semantic_integrity_v1.sql`;
- the old `20260908135500_...` migration file is absent;
- PR #136 contains exactly one migration for this Result.

Byte-for-byte Git blob identity is not claimed because the registry stores normalized migration statements. Functional identity is backed by transactional dry-run, applied function definitions, grants and post-migration smoke evidence.

## Full G6 evidence
Site Integrity / Release Readiness **#893** (`34256560528`) — **SUCCESS** on candidate `7a7db50038e14e89c7ac85c28311a61a992eb49a`.

All workflow gates passed, including:
- registry/routes/features;
- content readiness and visual contract;
- immutable first-baseline contract;
- DC-9 sync integrity;
- Membership semantic authority;
- Board v2 / v2.1 static contracts;
- production candidate build and analytics/consent;
- canonical shell and built-JS syntax;
- Google OAuth handoff;
- DC-9 login sync + clean-device remote recovery;
- Board v2.1 Chromium mobile/fullscreen browser state matrix;
- Workspace browser recovery;
- My Artifacts history;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

## Board QA lifecycle regression resolved without product CSS mutation
After migration-history reconciliation, a stricter Board mobile QA assertion switched from transformed visual width to `offsetWidth`. This exposed a test-lifecycle race: the test measured Member Artifact cards after `.dc-spatial-viewport` appeared but before the spatial runtime had completed the later `MutationObserver → refreshSpatial() → placeCards()` cycle that assigns `data-size-class`.

Two temporary projection-only CSS attempts were removed. The final validator keeps `offsetWidth`, waits for both deterministic fixture Artifacts (`qa-artifact-own`, `qa-artifact-other`) to reach `data-size-class="M"`, and emits detailed geometry diagnostics on failure.

Run #893 passed this corrected lifecycle-aware Board browser gate. Therefore no Board production CSS workaround is part of the release candidate.

## Release authorization
On 2026-09-08 the user explicitly authorized proceeding with the production release after the fresh full G6 PASS.

Authorized sequence:
1. mark PR #136 ready;
2. merge PR #136 into exact current `dementor-club-production` baseline;
3. run/verify production deployment;
4. perform live post-deploy retest.

`commit ≠ database release ≠ merge ≠ deploy` remains the governing distinction. Database release is already applied; code merge and deploy are still pending at this snapshot.

## G8 candidates
After production release/live evidence:
- remove obsolete v8/v9 account-sync sources if no longer referenced;
- replace/remove the 1200ms dual local `self-development` compatibility writer after legacy-state audit;
- reassess remaining idempotent compatibility sync paths;
- reconcile QA-MEM-035…042 final statuses in the canonical QA ledger;
- remove any stale temporary release-evidence branches created during release coordination.

## Gate
Current: **G7_RELEASE**.

Database migration is live and smoke-tested. Full code/static/browser G6 is green on the reconciled head. Production merge and deploy are explicitly authorized but not yet claimed as completed in this version.
