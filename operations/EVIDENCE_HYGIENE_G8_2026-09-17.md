---
artifactId: dementor-club.evidence.evidence-hygiene-g8-2026-09-17
project: dementor-club
documentType: QA_EVIDENCE
status: APPROVED_EVIDENCE
updated: 2026-09-17
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.evidence-hygiene-v1
issue: 201
productionCommit: 374defbe583fac0839a43611b151d1104b47a42b
backendDeployRunId: 35150249462
pagesDeployRun: 119
pagesDeployRunId: 35211118478
pagesArtifactId: 10492111474
pagesArtifactDigest: sha256:e076fe6c94bb5b009d52d1f2395987b9ad05e2a478d63b875966903087e3ca8a
liveRetest: PASS_LAYERED_PRODUCTION_EVIDENCE
---

# Evidence Hygiene v1 · G8 closure evidence

## Result

**APPROVED / RELEASED / LAYERED-PRODUCTION-VALIDATED / G8 CLOSED**

Canonical invariant:

`QA EVIDENCE ≠ AUDIENCE EVIDENCE ≠ PROGRAMMING MOMENT`

Closure is based on:
- backend production verification;
- exact deployed-code automated acceptance;
- canonical Pages exact-SHA release;
- live production serving smoke.

Consolidated live evidence:

`operations/EVIDENCE_HYGIENE_LIVE_RETEST_2026-09-17.md`

## Production evidence chain

### Backend
- canonical backend workflow: `Deploy Dementor Supabase Production`;
- run id: `35150249462`;
- conclusion: `SUCCESS`;
- migration `20260916213500_evidence_hygiene_v1.sql`: applied;
- canonical QA provenance guard verified in production function definition;
- canonical public Activity `qa:%` exclusion verified in production read owner;
- normal production Activity rows preserved;
- no historical rewrite.

Evidence:
`operations/EVIDENCE_HYGIENE_BACKEND_RELEASE_2026-09-16.md`

### Automated acceptance
- Site Integrity #1199 / run `35161854100` = `SUCCESS`;
- exact validated corrective `842d96b07b7ef20f298578e078467148cfa27675`;
- all 51 release-readiness steps passed;
- Evidence Hygiene browser acceptance proves differential QA exclusion, normal Artifact preservation, QA analytics hard suppression, normal consented analytics behavior, Home/Community/pagination, mobile/public matrices and Current Program Home/Board contract;
- PR #218 corrective altered only release-validator ownership, not product runtime semantics.

Evidence:
- `operations/EVIDENCE_HYGIENE_G6_2026-09-16.md`;
- `operations/EVIDENCE_HYGIENE_PAGES_VALIDATOR_DRIFT_CORRECTIVE_2026-09-17.md`.

### Canonical Pages
- workflow: `.github/workflows/deploy-pages.yml`;
- run `#119 / 35211118478`, attempt `2`;
- conclusion: `SUCCESS`;
- exact deployed production SHA: `374defbe583fac0839a43611b151d1104b47a42b`;
- Pages artifact: `10492111474`;
- digest: `sha256:e076fe6c94bb5b009d52d1f2395987b9ad05e2a478d63b875966903087e3ca8a`;
- deployment id: `355b02cde90bbf14706cdff2698573a57c6b0a34`.

Evidence:
`operations/EVIDENCE_HYGIENE_PAGES_RELEASE_2026-09-17.md`

### Live smoke
Read-only production smoke after canonical deploy confirms:
- Home serving correctly;
- Community serving correctly;
- `/workspace/board/` guest/auth-required shell serving correctly;
- `/join/` serving correctly;
- normal public Activity visible;
- canonical Current Program visible;
- no observed runtime errors across exercised routes.

Analytics network interception was not repeated live and is not claimed as such. Exact deployed-code automated acceptance is the analytics proof layer.

## G8 cleanup inventory

### 1. Result branch
Observed stale integration branch:

`result/evidence-hygiene-v1@842d96b07b7ef20f298578e078467148cfa27675`

That commit is the exact validated corrective and is already present as the second parent of production merge commit `374defbe583fac0839a43611b151d1104b47a42b`.

Cleanup action:
- retire branch from active semantic ownership;
- kernel `activeIntegrationBranch` becomes `null`;
- no further Result work is assigned to this branch.

The available GitHub control surface in this closure does not expose branch-ref deletion. The remote branch may therefore remain as historical Git state, but it is no longer an active owner and is not a second integration path.

### 2. Temporary flags / runtime switches
No temporary runtime feature flag was introduced by #201.

`sessionStorage["dc_qa_session_v1"]` is the canonical approved QA-session marker of the Result, not a temporary rollout flag, and remains required runtime behavior.

No temporary database flag/table/enum/metadata field was introduced.

### 3. Temporary QA evidence / test data
- no closure-only QA Artifact was created in production;
- no historical rows were rewritten;
- fixture-only QA evidence remains inside automated acceptance;
- evidence markdown files are durable release evidence, not temporary runtime artifacts.

No cleanup DML is required.

### 4. Compatibility / duplicate runtime layers
No product runtime compatibility layer was introduced by #201.

`scripts/validate-browser-shell-v21-compat.mjs` is a test/release validator adapter that already represented the current Board v2.1 contract; #218 only aligned the canonical Pages workflow with that existing release-readiness owner. It is not a new runtime shell, route owner, state owner, CSS/JS system or production compatibility layer.

### 5. Accidental / legacy Pages workflow ownership
The accidental legacy/default-branch Pages incident remains documented at:

`operations/EVIDENCE_HYGIENE_PAGES_CONTROL_PLANE_INCIDENT_2026-09-17.md`

Observation:
- a legacy/default-branch release path exists outside the canonical #201 Pages workflow ownership;
- the incident did not deploy `main` application contents, but it exposed duplicate release-control ownership;
- canonical #201 release evidence comes only from `.github/workflows/deploy-pages.yml` on `dementor-club-production`.

G8 action:
- keep the duplicate/legacy workflow ownership as a separately recorded cleanup/follow-up observation;
- do **not** delete, rewrite or redesign release architecture inside #201 closure;
- any removal/consolidation that changes canonical release ownership requires its own architecture/change decision.

### 6. Stale QA / Result status
Closure action:
- Evidence Hygiene removed from `currentResult`;
- `activeIntegrationBranch=null`;
- `activeReleaseBranch=null`;
- Result moved to `completedResults` as v1.0 / APPROVED / G8_CLEANUP;
- #201 may be closed as completed;
- #213 remains NOT ACTIVE and is not activated by this mutation.

### 7. Unrelated Results
No WAITING/completed Result is reopened or modified semantically by #201 G8.

## Preserved boundaries

Evidence Hygiene v1 does not:
- create a new Artifact taxonomy;
- add `is_test` / `evidence_type` / parallel evidence tables;
- derive Current Program automatically from Artifacts;
- alter Membership lifecycle;
- alter DC-9 lifecycle;
- alter Telegram semantics;
- rewrite pre-cutover evidence;
- claim all historical data is clean.

Historical caveat remains mandatory:

`pre-cutover evidence may contain QA/internal activity`

## G8 conclusion

**G8 PASS.**

Evidence Hygiene v1 can be retired from active ownership and promoted to completed Result v1.0.

`G8 CLOSED ≠ #213 ACTIVATED`

A fresh activation review is required before any #213 work starts.
