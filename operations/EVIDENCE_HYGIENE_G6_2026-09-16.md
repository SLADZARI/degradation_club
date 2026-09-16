---
artifactId: dementor-club.operations.evidence-hygiene-g6-2026-09-16
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: VALIDATION
gate: G6_VALIDATION
status: PASS
version: 1.0
updated: 2026-09-16
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.evidence-hygiene-v1
---

# Evidence Hygiene v1 — G6 validation evidence

## Result
`dementor-club.result.evidence-hygiene-v1`

Invariant:

`QA EVIDENCE ≠ AUDIENCE EVIDENCE ≠ PROGRAMMING MOMENT`

## Candidate
- baseline: `dementor-club-production@0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`
- integration branch: `result/evidence-hygiene-v1`
- exact validated head: `0a9687266aa27ea2bd40fa12099052e1308b6ae2`
- draft validation PR: `#216`
- GitHub Actions run: `35141615180`
- Site Integrity conclusion: `SUCCESS`
- validate job completed: `2026-09-16T19:39:50Z`

## Implemented contract
### QA Artifact provenance
- existing `dc_artifacts.source_ref` is reused;
- canonical prefix: `qa:`;
- canonical create owner `dc_create_artifact_draft_v1` receives optional `p_source_ref`;
- only OWNER_ADMIN may submit QA provenance;
- a non-null source ref must begin with `qa:` and is written when the draft row is created;
- ordinary calls may omit the parameter and preserve existing behavior;
- `provenance_status` is not written or repurposed;
- no historical row is updated.

### Production analytics QA guard
Canonical owner: `production-analytics-v1.js`.

Marker:

`sessionStorage["dc_qa_session_v1"] = "1"`

The guard executes on the production origin before consent boot and therefore before GA4 / Clarity SDK loading, page_view emission or semantic tracking installation.

### Public Activity guard
Canonical read owner: `dc_public_activity_read_v1`.

The tracked migration excludes rows whose `source_ref` begins with `qa:` from public Activity while leaving Board storage and operational ownership unchanged. Pagination/keyset semantics remain unchanged.

### Current Program
`current-program-v1.js` is unchanged.

Baseline SHA = Result SHA = `59cd30edcf715bba6c19e7a101a4ca0cc7c5aaf3`.

Evidence:

`ARTIFACT EXISTS ≠ PROGRAMMING MOMENT`

## Exact diff boundary
Production candidate differs from baseline only in:
1. `.github/workflows/site-integrity.yml`
2. `production-analytics-v1.js`
3. `scripts/validate-board-public-activity-contract.mjs`
4. `scripts/validate-evidence-hygiene-browser.mjs`
5. `scripts/validate-production-analytics.mjs`
6. `supabase/migrations/20260916213500_evidence_hygiene_v1.sql`

`public-activity-v1.js`, Board runtime/publisher UI, `current-program-v1.js`, Membership, DC-9 and Telegram runtime are outside the diff.

## Validation evidence
The exact candidate head passed the full `Site Integrity / Release Readiness` workflow. All 51 validation steps completed successfully, including:
- Supabase release contract;
- Board security / IA / publisher / public Activity static contracts;
- production build;
- Current Program contract;
- production analytics + consent contract;
- JS syntax, route and shell validation;
- sustained Club publisher browser stability;
- Board public Activity browser acceptance;
- **Evidence Hygiene browser acceptance**;
- Current Program browser acceptance;
- mobile/public harmonization browser matrices;
- DC-9 sync;
- Board fullscreen/live/deep-link/share browser regressions;
- Workspace recovery;
- Artifact history;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

### Evidence Hygiene sequential browser acceptance
PASS proves on the candidate artifact:
- source dataset contains a QA-marked Artifact but public Activity eligibility excludes it;
- QA Artifact is absent from Home Activity on desktop and mobile;
- ordinary public Artifact remains visible;
- Community first page and load-more preserve ordinary pagination while QA remains absent;
- QA production session with granted historical consent still performs no GA4 request, no Clarity request, injects no tracker script, creates no tracker globals/dataLayer/page_view, and leaves semantic `track()` inert;
- normal production session with granted consent still loads both SDK paths and emits the manual GA4 page_view.

## Negative cases
PASS:
- QA Artifact does not appear in public Activity;
- QA session does not load GA4/Clarity SDKs;
- QA session does not create page views or semantic Product Health events;
- ordinary Artifact remains visible;
- ordinary consented analytics remains functional;
- Current Program did not change;
- no retrospective `source_ref` rewrite exists in the migration;
- no `is_test`, `evidence_type`, new Artifact taxonomy or public ontology was introduced.

## Historical evidence rule
No pre-cutover Artifact is reclassified.

Required caveat for historical analysis:

`pre-cutover evidence may contain QA/internal activity`

## Release state
**G6 PASS / AWAITING EXPLICIT MERGE AUTHORIZATION.**

No merge was performed.
No Supabase migration was applied to production.
No Pages deploy was performed.
No live production retest or G8 cleanup has occurred yet.

Release boundary remains:

`G6 PASS ≠ merge ≠ backend/pages deploy ≠ live retest ≠ G8`
