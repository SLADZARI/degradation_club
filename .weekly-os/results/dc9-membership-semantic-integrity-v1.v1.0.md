---
artifactId: dementor-club.result.dc9-membership-semantic-integrity-v1
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G8_CLEANUP
status: APPROVED
version: 1.0
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.10
---

# MP | Dementor Club | RELEASE | DC-9 / Membership Semantic Integrity v1 | v1.0

## Goal
Close the DC-9 / Membership semantic-integrity Result after implementation, live database release, production release, real-browser/cross-device validation and entropy cleanup while preserving:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

## Final status
**APPROVED / RELEASED / LIVE VALIDATED / G8 CLEANUP COMPLETE**

Production branch: `dementor-club-production`  
Final production HEAD: `b1ed177564581c820e3739e70404957108157af1`  
Canonical Supabase migration: `20260908132816_dc9_membership_semantic_integrity_v1.sql`  
Migration registry version: `20260908132816`

## Scope delivered
QA cluster closed by this Result:
`QA-MEM-035…042`.

Delivered canonical ownership and invariants:
- field-preserving local/remote DC-9 state merge with partial drafts, immutable first baseline, repeat history and unknown forward-compatible fields preserved;
- one canonical `self_development` identity with legacy `self-development` accepted only at compatibility/read boundaries;
- one canonical first-complete 9/9 server primitive for application permission and Entry Status permission meaning;
- server-side Interest Map invariant for exactly nine canonical keys, integer values `0..100`, total `100`;
- one active-membership validity-window meaning through `public.dc_membership_active(profile_id)`;
- canonical Join legacy-base-path normalization without creating another router;
- one Supabase JS client owner: `community-runtime-v1.js → getClient()`;
- executable DC-9 sync and Membership semantic-authority regression coverage.

No new Membership lifecycle, baseline table, auth provider, application flow, Board product rule or parallel profile/state mechanism was introduced.

## Database release evidence
Production Supabase project migration was applied only after explicit owner authorization and after a full transactional production dry-run returned `dry_run_ok`.

Post-migration evidence included:
- live migration registry version `20260908132816`;
- canonical helpers live: `dc_first_complete_baseline_v1` and `dc_membership_active`;
- application and Entry Status RPCs retained `SECURITY DEFINER`, authenticated EXECUTE and no anon EXECUTE;
- complete/incomplete Entry Status smoke matched canonical 9/9 meaning;
- active-membership helper matched the explicit validity-window formula for current production rows;
- active Member application guard returned `ALREADY_MEMBER` before writes;
- incomplete DC-9 application guard returned `SPHERE_GATE_INCOMPLETE` before writes;
- no synthetic successful production application fixture was fabricated where no suitable real non-member 9/9 profile existed.

Tracked migration and Supabase migration-registry statement are functionally reconciled through the exact candidate transactional dry-run, live RPC definitions, grants and smoke evidence. Byte-for-byte equality is not claimed because the migration registry representation omits explanatory inline comments.

## Primary release evidence
Implementation candidate:
`7a7db50038e14e89c7ac85c28311a61a992eb49a`.

Site Integrity / Release Readiness **#893** (`34256560528`) — **SUCCESS**.

PR **#136** merged the validated Result to production as:
`472882c95ffd1d9fae165edf4dcaf4e1865337a9`.

Manual production deploy **#48** (`34258541128`) — **SUCCESS**.  
Pages artifact: `10068871371`.

## Primary live retest evidence
Real user-browser validation on 2026-09-08 confirmed:
- Guest `/join/` works without authentication;
- partial DC-9 progress survives reload;
- current accepted reload UX is picker-first: reload returns to the sphere map, displays `ПРОДОЛЖИТЬ · N/6`, and resumes at the first unanswered question;
- login → Workspace recovery works;
- authenticated session/state persists;
- active Member `/join/apply/` shows membership already active and does not offer a duplicate application;
- Workspace / Board desktop and mobile spot-checks pass;
- strict cross-device DC-9 sync passes from phone to desktop;
- Board card position persistence passes from phone drag/reposition to desktop recovery.

The picker-first reload behavior is explicitly recorded as the accepted current UX contract, not treated as a regression.

## G8 cleanup
Cleanup branch:
`agent/dc9-membership-semantic-integrity-g8`.

Cleanup PR **#137** contained exactly four production-relative changes:
1. remove retired `dementor-account-sync-v8.js`;
2. remove retired `dementor-account-sync-v9.js`;
3. replace the permanent `self-development ↔ self_development` interval writer with one-shot canonical migration in `join-storage-guard.js`;
4. extend `scripts/validate-dc9-sync-integrity.mjs` with entropy regression checks.

Canonical active account-sync owner remains:
`site-config.js → dementor-account-sync-v10.js → community-runtime-v1.js/getClient()`.

`join/apply/apply.js → syncLocalAssessmentRuns()` is intentionally retained as an idempotent current-map compatibility guard. Safe removal was not independently proven, so G8 did not remove it merely for cosmetic cleanup.

Fresh cleanup Site Integrity / Release Readiness **#894** (`34267025765`) — **SUCCESS** against exact cleanup head:
`ca84a64fdeb8579bb686e9e4e584d5ac4b648399`.

PR #137 merged as final production commit:
`b1ed177564581c820e3739e70404957108157af1`.

## Cleanup deploy evidence
Manual `Deploy Dementor Production` run **#49** (`34272073283`) — **SUCCESS**.  
Pages artifact: `10074208550`.  
Artifact digest: `sha256:2c442117c6d2e67dac272914fc1e9294ebc3d1662cafb4c2e3e556e85cb9d195`.

The workflow-dispatch run itself is recorded by GitHub under `main` because the deployment workflow lives there. This is not used as production-content provenance. Build logs explicitly show:
- `actions/checkout` with `ref: dementor-club-production`;
- checked-out commit exactly `b1ed177564581c820e3739e70404957108157af1`;
- site validation `0 error(s), 0 warning(s)`;
- production release guard PASS;
- Pages artifact upload PASS;
- Pages deploy PASS.

## Final live smoke
After cleanup deploy #49, the project owner performed the requested production smoke and reported **“всё работает”** for:
- `/join/` and current DC-9 progress/resume;
- Workspace → Board;
- `/join/apply/` active-Member guard;
- no observed regression from the one-shot legacy alias migration.

This is the final human live evidence required for this Result.

## Branch / entropy audit
- the original implementation and cleanup branches are no longer active integration owners after production merge;
- `agent/dc9-membership-semantic-integrity-v1` is fully contained in production and is a stale branch candidate;
- historically divergent handoff/evidence branches are not blindly deleted because divergence was not proven safe to discard;
- the available connector in this Result did not expose branch deletion, so branch removal is repository hygiene rather than an active runtime/semantic owner;
- no temporary Board projection CSS workaround survived the release;
- obsolete account-sync v8/v9 runtime owners are removed from production.

## QA reconciliation
The canonical ledger `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md` records the final reconciliation for QA-MEM-035…042 and the release/deploy/live evidence above.

Earlier dated sections of that ledger remain historical evidence and must not override the final reconciliation section when their release-state statements conflict.

The separate Board Result remains **WAITING**. This Result's Board spot-check and cross-device position persistence evidence do not silently close the remaining Guest / State5 / OwnerAdmin Board role-state QA.

## Closure
Acceptance criteria for this Result are met with implementation evidence, live database evidence, exact production merge/deploy provenance, real-browser and cross-device evidence, and post-release G8 cleanup.

**Result closed at G8_CLEANUP.**
