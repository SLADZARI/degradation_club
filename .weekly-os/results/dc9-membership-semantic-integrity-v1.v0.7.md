---
artifactId: dementor-club.result.dc9-membership-semantic-integrity-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G8_CLEANUP
status: DRAFT
version: 0.7
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.6
---

# MP | Dementor Club | BUILD | DC-9 / Membership Semantic Integrity v1 | v0.7

## Goal
Remove semantic and state-integrity drift across DC-9, Application and Membership without changing the protected lifecycle:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

## Status
**RELEASED / G7 LIVE RETEST PASS / G8 CLEANUP ACTIVE**

Implementation PR: `#136`  
Validated candidate: `7a7db50038e14e89c7ac85c28311a61a992eb49a`  
Full G6: Site Integrity / Release Readiness **#893** (`34256560528`) — **SUCCESS**  
Production merge commit: `472882c95ffd1d9fae165edf4dcaf4e1865337a9`  
Production deploy: **#48** (`34258541128`) — **SUCCESS**  
Production Pages artifact: `10068871371`

## Database release
Production Supabase migration is applied and smoke-tested:

`20260908132816_dc9_membership_semantic_integrity_v1`

Tracked repository migration:

`supabase/migrations/20260908132816_dc9_membership_semantic_integrity_v1.sql`

The previous repository/live migration-history timestamp mismatch was reconciled before production code merge.

## G6 evidence
Run #893 passed the complete release-readiness chain, including DC-9 immutable baseline, account sync integrity, Membership semantic authority, Board static/browser contracts, production build, canonical shell, OAuth handoff, Workspace recovery, My Artifacts, WebKit auth, route manifest and production artifact release gate.

The Board mobile failure encountered while preparing this release was proven to be a QA lifecycle issue. Temporary projection-only product CSS workarounds were removed; the final validator waits for canonical spatial initialization before measuring layout width. #893 passes the corrected test.

## Production release evidence
PR #136 merged into the exact current `dementor-club-production` baseline. No release merge from `dementor-club-site` was used.

Manual production deploy completed through **Deploy Dementor Production** with explicit `release_confirmation=APPROVED`. Build and Pages deploy both succeeded. Release-source logs confirm the deployed artifact was built from production commit:

`472882c95ffd1d9fae165edf4dcaf4e1865337a9`

## G7 live functional retest — PASS
User-performed production browser validation completed on 2026-09-08.

### Guest DC-9 partial progress
PASS:
- `/join/` opens without login gate;
- Guest can enter a sphere and answer scenes;
- partial draft survives page reload;
- reload returns to the sphere picker under the accepted current UX contract;
- picker exposes `ПРОДОЛЖИТЬ · N/6`;
- selecting the sphere resumes at the first unanswered scene rather than restarting.

Accepted current UX contract: reload without an explicit `?sphere=` route lands on the picker; automatic re-entry into the active scene is not required by this Result.

### Authentication / Workspace recovery
PASS:
- login succeeds;
- authenticated Workspace opens;
- navigation from Workspace to Community Board and back works;
- session survives navigation / return without 404 or shell loss.

### Authenticated DC-9 state and strict cross-device sync
PASS:
- authenticated DC-9 state is visible after login;
- the same account was opened from a phone browser;
- expected DC-9 progress/state was available there, confirming real browser/device synchronization beyond the G6 mock contract.

### Application / Membership boundary
PASS for active-member guard:
- `/join/apply/` identifies the current account as already active in the club;
- UI shows active membership state and directs the user to Workspace;
- no repeat application is offered through the normal UI path.

No synthetic production non-member 9/9 identity was created solely to exercise a successful new application. The server-side success/guard semantics remain backed by the production migration dry-run, post-migration smoke and G6 semantic authority checks.

### Board / Workspace regression spot-check
PASS for Result-relevant regression scope:
- Community Board opens on desktop;
- Board opens on mobile;
- Workspace navigation remains functional;
- cards were dragged to new positions on the phone and, after opening Board on the computer, the cards appeared at the persisted positions.

This provides live cross-device evidence for Board position persistence relevant to the release regression check. It does **not** close the separate `board-access-control-v2` Result or its remaining role-state matrix.

## G7 conclusion
Release evidence is complete:

`DB migration PASS → G6 PASS → production merge PASS → production deploy PASS → live functional retest PASS`

No release blocker remains for this Result. Gate advances to **G8_CLEANUP**.

## G8 cleanup scope
- audit and remove obsolete v8/v9 account-sync sources if truly unreferenced;
- audit the temporary legacy `self-development` compatibility writer and retire it only when legacy-state evidence permits;
- reassess remaining idempotent compatibility sync paths;
- reconcile QA-MEM-035…042 final statuses in the canonical QA ledger;
- remove stale temporary release/integration branches where safe;
- verify no superseded migration filename, temporary QA workaround or duplicate runtime owner remains;
- preserve separate Board Result status and do not infer its DONE/G8 closure from this Result's live Board spot-check.

## Gate
Current: **G8_CLEANUP**.

The Result is released and live-retested. It remains DRAFT until cleanup evidence is completed and canonical QA/branch/runtime entropy checks are reconciled.
