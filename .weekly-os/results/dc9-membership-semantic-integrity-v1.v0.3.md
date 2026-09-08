---
artifactId: dementor-club.result.dc9-membership-semantic-integrity-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G6_VALIDATION
status: DRAFT
version: 0.3
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.2
---

# MP | Dementor Club | BUILD | DC-9 / Membership Semantic Integrity v1 | v0.3

## Goal
Remove semantic and state-integrity drift between DC-9 local state, account sync, sphere identity, first-complete baseline, application gate, membership validity, Interest Map server invariants and Supabase client ownership without changing the approved Membership lifecycle.

Protected boundary:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

## Status
**IN_PROGRESS / G6 VALIDATION / CODE+BROWSER G6 PASS / SQL RUNTIME VALIDATION PENDING**

Implementation branch: `agent/dc9-membership-semantic-integrity-v1`  
Implementation PR: `#136` → `dementor-club-production`  
Production baseline: `a9511a271fbb3524c486c2a9ecd0dc8a3ff22380`  
Validated candidate head: `d6fa31708d8b5686749a1b6ef8eb375a71206e57`  
Canonical QA ledger: `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`

## Implemented QA cluster
This Result owns `QA-MEM-035…042`.

1. Account sync now uses a deterministic non-destructive state merger that preserves drafts, remote recovery, immutable baseline history, repeat history and unknown forward-compatible fields.
2. `self-development` is normalized to canonical `self_development` before persistence and source-key generation.
3. Application and Entry Status candidate SQL use `dc_first_complete_baseline_v1()` as the canonical 9/9 authority rather than a second latest-per-sphere permission model.
4. Candidate application RPC validates the Interest Map server-side: exactly nine canonical integer keys, each 0..100, total exactly 100.
5. Candidate server decisions use `dc_membership_active()` validity-window semantics instead of `status='active'` alone.
6. Join storage/runtime path handling normalizes the legacy `/degradation_club/` prefix without making it canonical production routing.
7. Account sync and GlobalHeader reuse `community-runtime-v1.js → getClient()` rather than creating another Supabase session owner.
8. New sync-integrity, semantic-authority and browser recovery contracts are wired into the existing Site Integrity workflow.

## Additional compatibility protection found during validation
The first candidate replacement for `dc_member_entry_status_v1()` corrected the semantic gate but reduced the historical JSON response shape.

Before release, this was corrected so the replacement retains shared informational fields including:
- `completed_spheres` / `missing_spheres`;
- `identity_ready` / `legal_ready`;
- `membership_status` plus canonical `membership_active`;
- Artifact slot granted/consuming/available counters;
- published Artifact count and activation state.

The executable semantic-authority validator now protects this compatibility shape so a semantic correction cannot silently break Workspace/Join/Board consumers.

## G6 evidence
Site Integrity / Release Readiness run **#883** (`34230599645`) — **SUCCESS** on candidate `d6fa31708d8b5686749a1b6ef8eb375a71206e57`.

The single full workflow passed:
- registry/routes/features;
- content readiness and visual contract;
- immutable first-baseline contract;
- DC-9 sync-integrity contract;
- Membership semantic-authority contract;
- Board v2 / v2.1 static contracts;
- production candidate build and analytics/consent;
- canonical shell and built-JS syntax;
- Google OAuth handoff;
- DC-9 partial-login sync + clean-device remote recovery browser regression;
- Board Chromium/WebKit state matrix;
- Workspace browser recovery;
- My Artifacts history;
- WebKit auth regression;
- route manifest and production artifact release gate.

A previous #881 inherited Board mobile measurement failure was not bypassed or disabled. The final candidate passed the unchanged Board browser gate; no Board product/CSS change was added to this Result.

## SQL validation boundary
Tracked migration candidate:
`supabase/migrations/20260908135500_dc9_membership_semantic_integrity_v1.sql`

Live Supabase was inspected read-only and confirms the production functions still contain the stale semantics this migration is intended to replace, while `dc_first_complete_baseline_v1()` and `dc_membership_active()` already exist as the canonical primitives.

No live migration has been applied.

The repository has no confirmed local Supabase harness (`supabase/config.toml` absent), and the Supabase project currently has no existing development branch. Therefore runtime execution of the candidate SQL has **not** been claimed. Creating a new paid Supabase development branch requires separate cost confirmation; applying the migration to production is a separate G7 database-release mutation.

## Release boundary
Still NOT authorized:
- live Supabase migration;
- merge PR #136 to `dementor-club-production`;
- production deploy.

`commit ≠ merge ≠ database release ≠ deploy`.

## G8 candidates
After released/live evidence:
- remove obsolete v8/v9 account-sync sources if no longer referenced;
- replace/remove the 1200ms dual local `self-development` compatibility writer after legacy-state audit;
- reassess remaining idempotent compatibility sync paths;
- reconcile QA-MEM-035…042 statuses in the canonical ledger.

## Gate
Current: **G6_VALIDATION**.

Code/static/browser G6 is green. Result remains DRAFT/IN_PROGRESS until SQL runtime validation/release evidence is resolved; do not infer production readiness from the committed migration alone.
