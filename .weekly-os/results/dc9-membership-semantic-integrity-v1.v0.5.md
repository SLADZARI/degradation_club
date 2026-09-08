---
artifactId: dementor-club.result.dc9-membership-semantic-integrity-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G7_RELEASE
status: DRAFT
version: 0.5
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.4
---

# MP | Dementor Club | BUILD | DC-9 / Membership Semantic Integrity v1 | v0.5

## Goal
Remove semantic and state-integrity drift across DC-9, Application and Membership without changing the protected lifecycle:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

## Status
**IN_PROGRESS / G7 RELEASE / DB LIVE + SMOKE PASS / CODE MERGED / DEPLOY AUTHORIZED BUT NOT YET DISPATCHED**

Implementation PR: `#136`  
Validated candidate: `7a7db50038e14e89c7ac85c28311a61a992eb49a`  
Full G6: Site Integrity / Release Readiness **#893** (`34256560528`) — **SUCCESS**  
Production baseline before merge: `a9511a271fbb3524c486c2a9ecd0dc8a3ff22380`  
Production merge commit: `472882c95ffd1d9fae165edf4dcaf4e1865337a9`

## Database release
Production Supabase migration is applied and smoke-tested:

`20260908132816_dc9_membership_semantic_integrity_v1`

Tracked repository migration is aligned to the same migration-history version:

`supabase/migrations/20260908132816_dc9_membership_semantic_integrity_v1.sql`

The earlier repository-only `20260908135500_...` identity mismatch was reconciled before code merge.

## G6 evidence
Run #893 passed all release-readiness gates, including DC-9 baseline, account sync integrity, Membership semantic authority, Board static/browser contracts, production build, canonical shell, OAuth handoff, Workspace recovery, My Artifacts, WebKit auth, route manifest and production artifact release gate.

The Board mobile failure encountered during reconciliation was confirmed as a QA lifecycle issue. Temporary projection-only product CSS workarounds were removed. The final validator waits for the deterministic Member Artifact fixture to reach canonical `data-size-class="M"` before measuring `offsetWidth`; #893 passes this corrected contract.

## Production merge
PR #136 was marked ready and merged into the exact unchanged `dementor-club-production` baseline.

Merge evidence:
- base before merge: `a9511a271fbb3524c486c2a9ecd0dc8a3ff22380`;
- head: `7a7db50038e14e89c7ac85c28311a61a992eb49a`;
- merge commit: `472882c95ffd1d9fae165edf4dcaf4e1865337a9`;
- current production branch head confirmed as the same merge commit.

No merge from `dementor-club-site` was used.

## Deployment boundary
The user explicitly authorized production deploy after merge.

Canonical workflow:
`.github/workflows/deploy-pages.yml` → **Deploy Dementor Production**.

It is intentionally `workflow_dispatch` only and requires input:

`release_confirmation = APPROVED`

The currently connected GitHub action surface can read/re-run existing workflows but does not expose creation of a new workflow-dispatch run. Therefore the deployment is **not claimed as started or completed** in this snapshot.

Required next release action is one manual GitHub Actions dispatch on branch `dementor-club-production` with `release_confirmation=APPROVED`, followed by deployment evidence and live retest.

## G8 candidates
After deployed/live evidence:
- remove obsolete v8/v9 account-sync sources if unreferenced;
- retire the dual `self-development` local compatibility writer after legacy-state audit;
- reassess remaining idempotent compatibility sync paths;
- reconcile final QA-MEM-035…042 statuses in the canonical ledger;
- remove stale temporary release coordination branches.

## Gate
Current: **G7_RELEASE**.

Database is released and code is merged. Production deployment is authorized but still pending the explicit workflow dispatch; do not infer live site release from the merge commit.
