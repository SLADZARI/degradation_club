---
artifactId: dementor-club.result.evidence-hygiene-v1
project: dementor-club
documentType: RESULT
projectStage: IMPLEMENTATION
gate: G5_IMPLEMENTATION
status: ACTIVE
version: 0.1
updated: 2026-09-16
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
---

# MP | Dementor Club | Evidence Hygiene v1 | Result v0.1

## Goal
Отделить QA/internal evidence от реальной editorial/public activity без новой публичной ontology и без изменения product semantics Board / Current Program / Membership.

Invariant:

`QA EVIDENCE ≠ AUDIENCE EVIDENCE ≠ PROGRAMMING MOMENT`

## Baseline
- production baseline: `dementor-club-production@0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`
- integration branch: `result/evidence-hygiene-v1`
- issue: `#201`
- gate: `G5_IMPLEMENTATION`

## Scope
### A. Artifact QA provenance
Use existing `dc_artifacts.source_ref` prospectively for QA/smoke/test Artifact creation.
Canonical prefix: `qa:`; example: `qa:board-smoke:<run-or-case>`.
The marker must be written at draft creation time by the existing canonical Artifact creation owner. `provenance_status` is unchanged. No new field/table/enum/JSON metadata or parallel publisher.

### B. Production analytics QA session guard
Canonical owner: `production-analytics-v1.js`.
Session marker: `sessionStorage["dc_qa_session_v1"] = "1"`.
When present on production, analytics must stop before GA4 or Clarity SDK boot and before page_view / semantic event installation.
Normal production analytics remains unchanged.

### C. Public Activity evidence guard
Canonical read owner: `dc_public_activity_read_v1`.
Artifacts whose `source_ref` begins with canonical `qa:` are excluded in the read model itself. Board operational visibility remains unchanged.

### D. Current Program evidence
`current-program-v1.js` is not changed.
Existing architecture is evidence for: `ARTIFACT EXISTS ≠ PROGRAMMING MOMENT`.

### E. Historical evidence rule
No retrospective reclassification. Pre-cutover evidence is potentially mixed and must carry the caveat:

`pre-cutover evidence may contain QA/internal activity`

## Explicit non-goals
- #213 ThingProjection Runtime;
- Programming Decision v1;
- Contribution / Direct Publish;
- FIRST_ARTIFACT activation changes;
- new Activity or History ontology;
- new analytics platform or QA dashboard;
- new Artifact taxonomy;
- cleanup/reclassification of old smoke records;
- Telegram refactor;
- unrelated Board fixes.

## Acceptance Criteria
- new QA Artifact receives deterministic `qa:` source provenance at creation;
- ordinary Artifact does not receive QA provenance;
- historical rows are not rewritten;
- QA-marked Artifact remains available to canonical Board/operational audit but is absent from public Activity;
- ordinary public Activity remains visible and paginates normally;
- QA production session loads neither GA4 nor Clarity and emits no page_view/semantic Product Health events;
- ordinary production session + consent behaves as before;
- `current-program-v1.js` is unchanged;
- no new public/domain ontology;
- Membership / DC-9 / Contribution / Programming semantics unchanged;
- static/schema checks and Full Site Integrity pass at exact Result head;
- sequential browser evidence covers positive and negative cases before G6 PASS.

## Validation matrix
1. normal public production session + consent;
2. QA production session;
3. normal public Artifact;
4. QA-marked Artifact;
5. Home Activity;
6. Community Activity;
7. pagination/load more;
8. Board operational visibility;
9. Current Program unchanged;
10. desktop/mobile;
11. GA4 suppression in QA;
12. Clarity suppression in QA;
13. normal analytics regression;
14. route integrity;
15. static/schema validation;
16. Full Site Integrity exact-head.

## Release boundary
`implementation → G6 → separate merge authorization → merge → separate backend/pages deploy authorization → deploy → live retest → G8`

`G6 PASS ≠ merge ≠ deploy ≠ G8`

No merge or deploy is authorized by this Result opening.
