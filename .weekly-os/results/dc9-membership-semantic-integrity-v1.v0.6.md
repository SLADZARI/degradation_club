---
artifactId: dementor-club.result.dc9-membership-semantic-integrity-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G7_RELEASE
status: DRAFT
version: 0.6
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.5
---

# MP | Dementor Club | BUILD | DC-9 / Membership Semantic Integrity v1 | v0.6

## Goal
Remove semantic and state-integrity drift across DC-9, Application and Membership without changing the protected lifecycle:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

## Status
**IN_PROGRESS / G7 RELEASE / DB LIVE + SMOKE PASS / CODE MERGED / PRODUCTION DEPLOY PASS / LIVE FUNCTIONAL RETEST PENDING**

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
- production branch head confirmed as the same merge commit.

No merge from `dementor-club-site` was used.

## Production deployment evidence
Manual GitHub Actions deployment was explicitly dispatched by the user and completed successfully.

Workflow evidence:
- workflow: `.github/workflows/deploy-production.yml` from default branch `main`;
- workflow name: **Deploy Dementor Production**;
- workflow dispatch run: **#48**;
- run id: `34258541128`;
- event: `workflow_dispatch`;
- conclusion: **SUCCESS**;
- required confirmation: `release_confirmation=APPROVED`;
- build job: **SUCCESS**;
- deploy job: **SUCCESS**.

The workflow itself runs from `main`, but its build step explicitly checks out canonical branch `dementor-club-production`. Build logs confirm the checked-out commit was exactly:

`472882c95ffd1d9fae165edf4dcaf4e1865337a9`

Release checks inside the deployment passed:
- registry/routes/features: PASS;
- content readiness: PASS;
- visual contract: PASS;
- production Pages build: PASS;
- analytics/consent: PASS;
- production release guard: PASS (`48 HTML routes`).

Pages evidence:
- artifact name: `github-pages`;
- Pages artifact id: `10068871371`;
- artifact size: `14776616` bytes;
- artifact digest: `sha256:86af1fccc84b154f60ca53984295ac9a7edf433e48217643535b1b27a6287504`;
- `actions/deploy-pages@v4`: **Reported success**;
- environment URL reported by GitHub Pages: `http://dementor.club/`.

Note: GitHub Pages records the workflow run's default-branch SHA as `pages_build_version`, while the uploaded artifact was built after an explicit checkout of `dementor-club-production`. The build log is the release-source evidence for the deployed site and confirms production commit `472882c9...`.

## Live retest boundary
The deployment itself is confirmed complete by GitHub Actions and Pages evidence. A direct external HTTP/browser retest from the current assistant runtime could not resolve/fetch `dementor.club`, so no live functional browser PASS is claimed here.

Required before G8 closure:
- live public route smoke;
- `/join/` DC-9 load/state smoke;
- authenticated login → Workspace recovery;
- authenticated cross-device/DC-9 sync path;
- Application eligibility state;
- Board/Workspace regression spot-checks relevant to the Result.

## G8 candidates
After live evidence:
- remove obsolete v8/v9 account-sync sources if unreferenced;
- retire the dual `self-development` local compatibility writer after legacy-state audit;
- reassess remaining idempotent compatibility sync paths;
- reconcile final QA-MEM-035…042 statuses in the canonical ledger;
- remove stale temporary release coordination branches.

## Gate
Current: **G7_RELEASE**.

Database release, production merge and production deployment are complete with evidence. Result remains DRAFT/IN_PROGRESS until the live functional retest is recorded; do not infer G8 closure from deployment success alone.
